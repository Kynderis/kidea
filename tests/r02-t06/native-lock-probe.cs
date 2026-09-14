// Isolated feasibility probe, not a Kidea writer. No privilege adjustment.
// API references: Microsoft Learn CreateFileW, GetFileInformationByHandle,
// BY_HANDLE_FILE_INFORMATION, GetFinalPathNameByHandleW, MoveFileExW,
// ReplaceFileW and CreateHardLinkW. Only the Node harness supplies requests.
using System;
using System.ComponentModel;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Win32.SafeHandles;

public static class NativeLockProbe
{
    public const uint Read = 0x80000000, Write = 0x40000000, Delete = 0x00010000;
    public const uint ShareRead = 1, ShareWrite = 2, ShareDelete = 4;
    public const uint OpenExisting = 3, CreateNew = 1;
    public const uint BackupSemantics = 0x02000000, OpenReparsePoint = 0x00200000;
    public const uint ReparseAttribute = 0x400, DirectoryAttribute = 0x10;

    [StructLayout(LayoutKind.Sequential)]
    public struct HandleInfo
    {
        public uint Attributes;
        public System.Runtime.InteropServices.ComTypes.FILETIME Creation, Access, WriteTime;
        public uint Volume, SizeHigh, SizeLow, Links, IndexHigh, IndexLow;
    }
    public sealed class Metadata
    {
        public string FinalPath { get; set; }
        public string FileId { get; set; }
        public uint Attributes { get; set; }
        public uint NumberOfLinks { get; set; }
        public ulong Length { get; set; }
        public bool ReparsePoint { get; set; }
        public bool Directory { get; set; }
    }
    public sealed class Outcome
    {
        public string Operation { get; set; }
        public bool Succeeded { get; set; }
        public int Error { get; set; }
        public string Message { get; set; }
        public Metadata Metadata { get; set; }
    }

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern SafeFileHandle CreateFileW(string path, uint access, uint share,
        IntPtr security, uint disposition, uint flags, IntPtr template);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool GetFileInformationByHandle(SafeFileHandle handle, out HandleInfo info);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern uint GetFinalPathNameByHandleW(SafeFileHandle handle, StringBuilder path,
        uint size, uint flags);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool DeleteFileW(string path);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool MoveFileExW(string from, string to, uint flags);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool ReplaceFileW(string replaced, string replacement, string backup,
        uint flags, IntPtr exclude, IntPtr reserved);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool CreateHardLinkW(string alias, string existing, IntPtr security);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool WriteFile(SafeFileHandle handle, byte[] bytes, uint count,
        out uint written, IntPtr overlapped);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetFilePointerEx(SafeFileHandle handle, long distance,
        out long position, uint origin);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetEndOfFile(SafeFileHandle handle);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool FlushFileBuffers(SafeFileHandle handle);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool DeviceIoControl(SafeFileHandle handle, uint code, byte[] input,
        uint inputSize, IntPtr output, uint outputSize, out uint returned, IntPtr overlapped);

    // Synthetic junction conversion, no token privilege enablement. This is a
    // mount-point reparse record, not a symbolic-link privilege workaround.
    // Microsoft Learn: FSCTL_SET_REPARSE_POINT / REPARSE_DATA_BUFFER.
    static bool SetJunction(string directory, string destination)
    {
        byte[] substitute = Encoding.Unicode.GetBytes(@"\??\" + destination);
        byte[] printable = Encoding.Unicode.GetBytes(destination);
        byte[] buffer = new byte[16 + substitute.Length + 2 + printable.Length + 2];
        Array.Copy(BitConverter.GetBytes(0xA0000003u), 0, buffer, 0, 4); // IO_REPARSE_TAG_MOUNT_POINT
        Array.Copy(BitConverter.GetBytes((ushort)(buffer.Length - 8)), 0, buffer, 4, 2);
        Array.Copy(BitConverter.GetBytes((ushort)substitute.Length), 0, buffer, 10, 2);
        Array.Copy(BitConverter.GetBytes((ushort)(substitute.Length + 2)), 0, buffer, 12, 2);
        Array.Copy(BitConverter.GetBytes((ushort)printable.Length), 0, buffer, 14, 2);
        Array.Copy(substitute, 0, buffer, 16, substitute.Length);
        Array.Copy(printable, 0, buffer, 18 + substitute.Length, printable.Length);
        using (var h = Open(directory, Write, 7, OpenExisting, true))
        {
            if (!DeviceIoControl(h, 0x000900A4, buffer, (uint)buffer.Length,
                IntPtr.Zero, 0, out _, IntPtr.Zero))
                throw new Win32Exception(Marshal.GetLastWin32Error(), "FSCTL_SET_REPARSE_POINT");
            return true;
        }
    }

    public static SafeFileHandle Open(string path, uint access, uint share, uint disposition,
        bool directory = false)
    {
        var handle = CreateFileW(path, access, share, IntPtr.Zero, disposition,
            OpenReparsePoint | (directory ? BackupSemantics : 0), IntPtr.Zero);
        if (handle.IsInvalid)
        {
            int error = Marshal.GetLastWin32Error();
            handle.Dispose();
            throw new Win32Exception(error, "CreateFileW: " + path);
        }
        return handle;
    }

    public static Metadata Inspect(SafeFileHandle handle)
    {
        if (!GetFileInformationByHandle(handle, out var info))
            throw new Win32Exception(Marshal.GetLastWin32Error());
        var buffer = new StringBuilder(32768);
        uint count = GetFinalPathNameByHandleW(handle, buffer, (uint)buffer.Capacity, 0);
        if (count == 0 || count >= buffer.Capacity)
            throw new Win32Exception(Marshal.GetLastWin32Error(), "Unverified final path");
        return new Metadata {
            FinalPath = buffer.ToString(),
            FileId = info.Volume.ToString("X8") + ":" + info.IndexHigh.ToString("X8") + info.IndexLow.ToString("X8"),
            Attributes = info.Attributes, NumberOfLinks = info.Links,
            Length = ((ulong)info.SizeHigh << 32) | info.SizeLow,
            ReparsePoint = (info.Attributes & ReparseAttribute) != 0,
            Directory = (info.Attributes & DirectoryAttribute) != 0
        };
    }

    public static void CheckPathIdentity(SafeFileHandle handle, string expected, bool directory)
    {
        var info = Inspect(handle);
        if (info.ReparsePoint) throw new IOException("REPARSE_POINT_REJECTED");
        if (!directory && info.NumberOfLinks != 1) throw new IOException("MULTIPLE_LINKS_REJECTED");
        if (info.Directory != directory) throw new IOException("WRONG_FILE_KIND");
        string actual = info.FinalPath.StartsWith(@"\\?\") ? info.FinalPath.Substring(4) : info.FinalPath;
        if (!String.Equals(Path.GetFullPath(expected).TrimEnd('\\'), actual.TrimEnd('\\'), StringComparison.OrdinalIgnoreCase))
            throw new IOException("FINAL_PATH_MISMATCH");
    }

    // Deliberate competing write used only on fresh synthetic fixtures.
    public static void WriteBytes(SafeFileHandle handle, byte[] bytes)
    {
        if (!SetFilePointerEx(handle, 0, out _, 0)) throw new Win32Exception(Marshal.GetLastWin32Error());
        if (!WriteFile(handle, bytes, (uint)bytes.Length, out uint count, IntPtr.Zero))
            throw new Win32Exception(Marshal.GetLastWin32Error());
        if (count != bytes.Length) throw new IOException("SHORT_WRITE");
        if (!SetEndOfFile(handle)) throw new Win32Exception(Marshal.GetLastWin32Error());
        if (!FlushFileBuffers(handle)) throw new Win32Exception(Marshal.GetLastWin32Error());
    }

    public static Outcome Attempt(string operation, string path, string other)
    {
        try
        {
            bool success;
            Metadata info = null;
            switch (operation)
            {
                case "read":
                    using (var h = Open(path, Read, 7, OpenExisting)) info = Inspect(h);
                    success = true; break;
                case "read-share-read":
                    using (var h = Open(path, Read, 1, OpenExisting)) info = Inspect(h);
                    success = true; break;
                case "write":
                    using (var h = Open(path, Write, 7, OpenExisting))
                        WriteBytes(h, Encoding.UTF8.GetBytes("COMPETING WRITER\n"));
                    success = true; break;
                case "exclusive":
                    using (var h = Open(path, Read | Write, 0, OpenExisting)) info = Inspect(h);
                    success = true; break;
                case "delete": success = DeleteFileW(path); break;
                case "rename": success = MoveFileExW(path, other, 0); break;
                case "replace-move": success = MoveFileExW(other, path, 1); break;
                case "replace-api": success = ReplaceFileW(path, other, null, 0, IntPtr.Zero, IntPtr.Zero); break;
                case "hardlink": success = CreateHardLinkW(other, path, IntPtr.Zero); break;
                case "set-junction": success = SetJunction(path, other); break;
                case "create-new":
                    using (var h = Open(path, Read | Write, 0, CreateNew)) {
                        WriteBytes(h, Encoding.UTF8.GetBytes("CREATE_NEW CONTENT\n"));
                        info = Inspect(h);
                    }
                    success = true; break;
                case "metadata":
                    using (var h = Open(path, 0, 7, OpenExisting, Directory.Exists(path))) info = Inspect(h);
                    success = true; break;
                default: throw new ArgumentException("Unknown probe operation: " + operation);
            }
            int error = success ? 0 : Marshal.GetLastWin32Error();
            return new Outcome { Operation = operation, Succeeded = success, Error = error,
                Message = error == 0 ? null : new Win32Exception(error).Message, Metadata = info };
        }
        catch (Win32Exception ex) {
            return new Outcome { Operation = operation, Succeeded = false, Error = ex.NativeErrorCode, Message = ex.Message };
        }
    }
}
