// Synthetic two-process feasibility probe only; not the production writer.
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Win32.SafeHandles;

public static class MappingNative
{
    public const uint Read = 0x80000000, Write = 0x40000000;
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    public static extern SafeFileHandle CreateFileW(string path, uint access, uint share,
        IntPtr security, uint creation, uint flags, IntPtr template);
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    public static extern IntPtr CreateFileMappingW(SafeFileHandle file, IntPtr attributes,
        uint protection, uint high, uint low, string name);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern IntPtr MapViewOfFile(IntPtr mapping, uint access, uint high, uint low, UIntPtr count);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern bool UnmapViewOfFile(IntPtr address);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern bool FlushViewOfFile(IntPtr address, UIntPtr count);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern bool CloseHandle(IntPtr handle);
    [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    public static extern IntPtr CreateEventW(IntPtr security, bool manual, bool initial, string name);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern uint WaitForSingleObject(IntPtr handle, uint timeout);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern bool DeviceIoControl(SafeFileHandle file, uint code, IntPtr input, uint inputSize,
        IntPtr output, uint outputSize, IntPtr returned, IntPtr overlapped);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern bool ReadFile(SafeFileHandle file, byte[] bytes, uint count,
        out uint read, IntPtr overlapped);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern bool GetOverlappedResult(SafeFileHandle file, IntPtr overlapped,
        out uint transferred, bool wait);
    [DllImport("kernel32.dll", SetLastError=true)]
    public static extern bool SetFilePointerEx(SafeFileHandle file, long distance, out long position, uint origin);
    [StructLayout(LayoutKind.Sequential)]
    public struct Overlapped { public UIntPtr Internal, InternalHigh; public uint Offset, OffsetHigh; public IntPtr Event; }
    public static void Check(bool success, string operation) {
        if (!success) throw new Win32Exception(Marshal.GetLastWin32Error(), operation);
    }
}

public sealed class WritableMappingProbe : IDisposable
{
    SafeFileHandle file;
    IntPtr mapping, view;
    public bool OriginalHandlesClosed { get; private set; }
    public WritableMappingProbe(string path, bool closeOriginalHandles) {
        try {
            file = MappingNative.CreateFileW(path, MappingNative.Read | MappingNative.Write, 7,
                IntPtr.Zero, 3, 0x00200000, IntPtr.Zero);
            MappingNative.Check(!file.IsInvalid, "mapper open");
            mapping = MappingNative.CreateFileMappingW(file, IntPtr.Zero, 4, 0, 0, null);
            MappingNative.Check(mapping != IntPtr.Zero, "create writable mapping");
            view = MappingNative.MapViewOfFile(mapping, 2, 0, 0, new UIntPtr(4096));
            MappingNative.Check(view != IntPtr.Zero, "map writable view");
            if (closeOriginalHandles) {
                file.Dispose(); file = null;
                MappingNative.Check(MappingNative.CloseHandle(mapping), "close original mapping handle");
                mapping = IntPtr.Zero;
                OriginalHandlesClosed = true;
            }
        } catch { Dispose(); throw; }
    }
    public string WritePrefix(string text) {
        byte[] bytes = Encoding.UTF8.GetBytes(text);
        if (bytes.Length > 256) throw new ArgumentException("bounded prefix only");
        Marshal.Copy(bytes, 0, view, bytes.Length);
        MappingNative.Check(MappingNative.FlushViewOfFile(view, new UIntPtr((uint)bytes.Length)), "flush mapped view");
        return ReadPrefix();
    }
    public string ReadPrefix() {
        byte[] bytes = new byte[32]; Marshal.Copy(view, bytes, 0, bytes.Length);
        return Encoding.UTF8.GetString(bytes);
    }
    public void Dispose() {
        if (view != IntPtr.Zero) { MappingNative.UnmapViewOfFile(view); view = IntPtr.Zero; }
        if (mapping != IntPtr.Zero) { MappingNative.CloseHandle(mapping); mapping = IntPtr.Zero; }
        if (file != null) { file.Dispose(); file = null; }
    }
}

public sealed class MappedLeaseProbe : IDisposable
{
    [StructLayout(LayoutKind.Sequential)]
    struct Input { public ushort Version, Length; public uint Level, Flags; }
    [StructLayout(LayoutKind.Sequential)]
    struct Output { public ushort Version, Length; public uint OriginalLevel, NewLevel, Flags, AccessMode; public ushort ShareMode; }
    SafeFileHandle file;
    IntPtr input, output, overlapped, completionEvent;
    bool pending, disposed, asynchronous;
    public bool Opened { get; private set; }
    public int OpenError { get; private set; }
    public bool OplockRequested { get; private set; }
    public bool OplockGranted { get; private set; }
    public int OplockError { get; private set; }
    public MappedLeaseProbe(string path, bool inputRole, uint level) {
        try {
            asynchronous = level != 0;
            // Level 0 exactly matches worker target READ|WRITE/share0 and input READ/shareREAD.
            file = MappingNative.CreateFileW(path, inputRole ? MappingNative.Read : MappingNative.Read | MappingNative.Write,
                inputRole ? 1u : 0u, IntPtr.Zero, 3, (asynchronous ? 0x40000000u : 0u) | 0x00200000, IntPtr.Zero);
            OpenError = file.IsInvalid ? Marshal.GetLastWin32Error() : 0;
            Opened = !file.IsInvalid;
            if (!Opened || level == 0) return;
            OplockRequested = true;
            completionEvent = MappingNative.CreateEventW(IntPtr.Zero, true, false, null);
            MappingNative.Check(completionEvent != IntPtr.Zero, "create oplock event");
            input = Marshal.AllocHGlobal(Marshal.SizeOf<Input>());
            output = Marshal.AllocHGlobal(Marshal.SizeOf<Output>());
            overlapped = Marshal.AllocHGlobal(Marshal.SizeOf<MappingNative.Overlapped>());
            Marshal.StructureToPtr(new Input { Version = 1, Length = (ushort)Marshal.SizeOf<Input>(), Level = level, Flags = 1 }, input, false);
            Marshal.StructureToPtr(new Output(), output, false);
            Marshal.StructureToPtr(new MappingNative.Overlapped { Event = completionEvent }, overlapped, false);
            bool synchronous = MappingNative.DeviceIoControl(file, 0x00090240, input, (uint)Marshal.SizeOf<Input>(),
                output, (uint)Marshal.SizeOf<Output>(), IntPtr.Zero, overlapped);
            OplockError = synchronous ? 0 : Marshal.GetLastWin32Error();
            pending = !synchronous && OplockError == 997;
            OplockGranted = pending;
        } catch { Dispose(); throw; }
    }
    public string ReadPrefix() {
        if (!Opened) return null;
        if (!asynchronous) {
            long position; uint count; byte[] synchronousBytes = new byte[32];
            MappingNative.Check(MappingNative.SetFilePointerEx(file, 0, out position, 0), "reset lease read position");
            MappingNative.Check(MappingNative.ReadFile(file, synchronousBytes, 32, out count, IntPtr.Zero), "read synchronous lease");
            return Encoding.UTF8.GetString(synchronousBytes, 0, (int)count);
        }
        IntPtr readEvent = MappingNative.CreateEventW(IntPtr.Zero, true, false, null);
        MappingNative.Check(readEvent != IntPtr.Zero, "create read event");
        IntPtr readOverlapped = Marshal.AllocHGlobal(Marshal.SizeOf<MappingNative.Overlapped>());
        try {
            Marshal.StructureToPtr(new MappingNative.Overlapped { Event = readEvent }, readOverlapped, false);
            byte[] bytes = new byte[32]; uint read;
            bool ok = MappingNative.ReadFile(file, bytes, (uint)bytes.Length, out read, readOverlapped);
            if (!ok && Marshal.GetLastWin32Error() != 997) MappingNative.Check(false, "read lease");
            if (!ok) MappingNative.Check(MappingNative.GetOverlappedResult(file, readOverlapped, out read, true), "await lease read");
            return Encoding.UTF8.GetString(bytes, 0, (int)read);
        } finally { Marshal.FreeHGlobal(readOverlapped); MappingNative.CloseHandle(readEvent); }
    }
    public bool OplockSignaled() { return pending && MappingNative.WaitForSingleObject(completionEvent, 0) == 0; }
    public void Dispose() {
        if (disposed) return; disposed = true;
        if (file != null) file.Dispose();
        // Keep kernel-owned buffers alive until cancellation completes (or process exits).
        if (pending && MappingNative.WaitForSingleObject(completionEvent, 5000) != 0) return;
        if (input != IntPtr.Zero) Marshal.FreeHGlobal(input);
        if (output != IntPtr.Zero) Marshal.FreeHGlobal(output);
        if (overlapped != IntPtr.Zero) Marshal.FreeHGlobal(overlapped);
        if (completionEvent != IntPtr.Zero) MappingNative.CloseHandle(completionEvent);
    }
}
