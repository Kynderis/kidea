// Separate bounded feasibility experiment. Compiled with native-lock-probe.cs;
// the existing share-mode probe and its failing expectations remain unchanged.
using System;
using System.ComponentModel;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Win32.SafeHandles;

public sealed class OplockProbe : IDisposable
{
    [StructLayout(LayoutKind.Sequential)]
    struct Input { public ushort Version, Length; public uint Level, Flags; }
    [StructLayout(LayoutKind.Sequential)]
    public struct Output {
        public ushort Version, Length;
        public uint OriginalLevel, NewLevel, Flags, AccessMode;
        public ushort ShareMode;
    }
    [StructLayout(LayoutKind.Sequential)]
    struct Overlapped { public UIntPtr Internal, InternalHigh; public uint Offset, OffsetHigh; public IntPtr Event; }
    public sealed class Observation {
        public bool Signaled { get; set; }
        public bool AckRequired { get; set; }
        public string InternalStatus { get; set; }
        public Output Output { get; set; }
        public NativeLockProbe.Metadata Metadata { get; set; }
    }
    public SafeFileHandle Handle { get; private set; }
    public int GrantError { get; private set; }
    public bool CloseCompletionSignaled { get; private set; }
    IntPtr input, output, overlapped, completionEvent;
    bool pending, disposed;

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern SafeFileHandle CreateFileW(string path, uint access, uint share, IntPtr security,
        uint disposition, uint flags, IntPtr template);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern IntPtr CreateEventW(IntPtr security, bool manual, bool initial, string name);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern uint WaitForSingleObject(IntPtr handle, uint timeout);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool CloseHandle(IntPtr handle);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool DeviceIoControl(SafeFileHandle handle, uint code, IntPtr input,
        uint inputSize, IntPtr output, uint outputSize, IntPtr returned, IntPtr overlapped);

    public OplockProbe(string path, bool directory)
    {
        try {
            uint access = directory ? NativeLockProbe.Read : NativeLockProbe.Read | NativeLockProbe.Write;
            uint share = directory ? 3u : 0u;
            uint flags = 0x40000000 | NativeLockProbe.OpenReparsePoint | (directory ? NativeLockProbe.BackupSemantics : 0);
            Handle = CreateFileW(path, access, share, IntPtr.Zero, 3, flags, IntPtr.Zero);
            if (Handle.IsInvalid) throw new Win32Exception(Marshal.GetLastWin32Error(), "Open overlapped owner");
            NativeLockProbe.CheckPathIdentity(Handle, path, directory);
            completionEvent = CreateEventW(IntPtr.Zero, true, false, null);
            if (completionEvent == IntPtr.Zero) throw new Win32Exception(Marshal.GetLastWin32Error());
            input = Marshal.AllocHGlobal(Marshal.SizeOf<Input>());
            output = Marshal.AllocHGlobal(Marshal.SizeOf<Output>());
            overlapped = Marshal.AllocHGlobal(Marshal.SizeOf<Overlapped>());
            Marshal.StructureToPtr(new Input { Version = 1, Length = (ushort)Marshal.SizeOf<Input>(),
                Level = directory ? 3u : 7u, Flags = 1 }, input, false);
            Marshal.StructureToPtr(new Output(), output, false);
            Marshal.StructureToPtr(new Overlapped { Event = completionEvent }, overlapped, false);
            bool synchronous = DeviceIoControl(Handle, 0x00090240, input, (uint)Marshal.SizeOf<Input>(),
                output, (uint)Marshal.SizeOf<Output>(), IntPtr.Zero, overlapped);
            GrantError = synchronous ? 0 : Marshal.GetLastWin32Error();
            if (synchronous || GrantError != 997)
                throw new Win32Exception(GrantError, "Oplock not granted as ERROR_IO_PENDING");
            pending = true;
        } catch { Dispose(); throw; }
    }

    public Observation Observe()
    {
        uint wait = WaitForSingleObject(completionEvent, 0);
        if (wait != 0 && wait != 258) throw new Win32Exception(Marshal.GetLastWin32Error());
        var result = Marshal.PtrToStructure<Output>(output);
        var ov = Marshal.PtrToStructure<Overlapped>(overlapped);
        return new Observation { Signaled = wait == 0, AckRequired = wait == 0 && (result.Flags & 1) != 0,
            InternalStatus = "0x" + ov.Internal.ToUInt64().ToString("X"), Output = result,
            Metadata = NativeLockProbe.Inspect(Handle) };
    }

    public void Dispose()
    {
        if (disposed) return;
        disposed = true;
        // Closing is the only acknowledgement/release in this experiment.
        // Never free the OVERLAPPED/output buffers while kernel I/O is pending.
        if (Handle != null) Handle.Dispose();
        CloseCompletionSignaled = !pending || WaitForSingleObject(completionEvent, 5000) == 0;
        if (!CloseCompletionSignaled) return; // Retain allocations until this bounded process exits.
        if (input != IntPtr.Zero) Marshal.FreeHGlobal(input);
        if (output != IntPtr.Zero) Marshal.FreeHGlobal(output);
        if (overlapped != IntPtr.Zero) Marshal.FreeHGlobal(overlapped);
        if (completionEvent != IntPtr.Zero) CloseHandle(completionEvent);
    }

    public static SafeFileHandle OpenAttributes(string path)
    {
        return NativeLockProbe.Open(path, 0x100, 7, 3, true); // FILE_WRITE_ATTRIBUTES only
    }

    public static NativeLockProbe.Outcome SetJunctionOnAttributeHandle(SafeFileHandle handle, string destination)
    {
        byte[] substitute = Encoding.Unicode.GetBytes(@"\??\" + destination);
        byte[] printable = Encoding.Unicode.GetBytes(destination);
        byte[] data = new byte[16 + substitute.Length + 2 + printable.Length + 2];
        Array.Copy(BitConverter.GetBytes(0xA0000003u), 0, data, 0, 4);
        Array.Copy(BitConverter.GetBytes((ushort)(data.Length - 8)), 0, data, 4, 2);
        Array.Copy(BitConverter.GetBytes((ushort)substitute.Length), 0, data, 10, 2);
        Array.Copy(BitConverter.GetBytes((ushort)(substitute.Length + 2)), 0, data, 12, 2);
        Array.Copy(BitConverter.GetBytes((ushort)printable.Length), 0, data, 14, 2);
        Array.Copy(substitute, 0, data, 16, substitute.Length);
        Array.Copy(printable, 0, data, 18 + substitute.Length, printable.Length);
        IntPtr buffer = Marshal.AllocHGlobal(data.Length);
        IntPtr returned = Marshal.AllocHGlobal(4);
        try {
            Marshal.Copy(data, 0, buffer, data.Length);
            bool ok = DeviceIoControl(handle, 0x000900A4, buffer, (uint)data.Length,
                IntPtr.Zero, 0, returned, IntPtr.Zero);
            int error = ok ? 0 : Marshal.GetLastWin32Error();
            return new NativeLockProbe.Outcome { Operation = "set-junction-attributes", Succeeded = ok,
                Error = error, Message = ok ? null : new Win32Exception(error).Message,
                Metadata = NativeLockProbe.Inspect(handle) };
        } finally { Marshal.FreeHGlobal(buffer); Marshal.FreeHGlobal(returned); }
    }
}
