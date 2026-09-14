// Internal Windows/NTFS byte transaction, schema-2 checkpoint only. This worker
// never grants permission from project content and never marks a task approved
// or done. The caller binds the validated graph to this exact request and must
// accept the byte proof before FINALIZE. Safety is conditional on the caller's
// explicit r2 environment assertions; ordinary share locks do not exclude new
// hard links or every concurrent namespace operation. Known unsafe state stops.
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Microsoft.Win32.SafeHandles;

public static class KideaNativeWrite
{
    const uint Read = 0x80000000, Write = 0x40000000, Delete = 0x00010000;
    const uint OpenExisting = 3, CreateNew = 1, OpenReparse = 0x00200000, BackupSemantics = 0x02000000;
    const string MetadataRoot = ".kidea/checkpoints";
    const int MaxBytes = 16 * 1024 * 1024, MaxLine = 64 * 1024 * 1024;
    static readonly UTF8Encoding Utf8 = new UTF8Encoding(false, true);
    static readonly StringComparer PathComparer = StringComparer.OrdinalIgnoreCase;
    static readonly JsonSerializerOptions Pretty = new JsonSerializerOptions { WriteIndented = true };

    [StructLayout(LayoutKind.Sequential)]
    struct HandleInfo
    {
        public uint Attributes;
        public System.Runtime.InteropServices.ComTypes.FILETIME Creation, Access, WriteTime;
        public uint Volume, SizeHigh, SizeLow, Links, IndexHigh, IndexLow;
    }
    [StructLayout(LayoutKind.Sequential)]
    struct DispositionInfo { [MarshalAs(UnmanagedType.U1)] public bool DeleteFile; }
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern SafeFileHandle CreateFileW(string path, uint access, uint share, IntPtr security, uint disposition, uint flags, IntPtr template);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool GetFileInformationByHandle(SafeFileHandle handle, out HandleInfo info);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern uint GetFinalPathNameByHandleW(SafeFileHandle handle, StringBuilder path, uint size, uint flags);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool CreateDirectoryW(string path, IntPtr security);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool ReadFile(SafeFileHandle handle, byte[] bytes, uint count, out uint read, IntPtr overlapped);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool WriteFile(SafeFileHandle handle, byte[] bytes, uint count, out uint written, IntPtr overlapped);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetFilePointerEx(SafeFileHandle handle, long distance, out long position, uint origin);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetEndOfFile(SafeFileHandle handle);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool FlushFileBuffers(SafeFileHandle handle);
    [DllImport("kernel32.dll", SetLastError = true)]
    static extern bool SetFileInformationByHandle(SafeFileHandle handle, int kind, ref DispositionInfo info, uint size);

    sealed class Failure : Exception
    {
        public readonly string Code;
        public Failure(string code, string detail = null) : base(detail ?? code) { Code = code; }
    }
    sealed class Held : IDisposable
    {
        public string Path, Id;
        public bool Directory, Closed, IdentityLost;
        public SafeFileHandle Handle;
        public byte[] Expected;
        public void Dispose() { if (!Closed) { Closed = true; Handle.Dispose(); } }
    }
    sealed class Target
    {
        public string Path, Action;
        public byte[] Before, Planned;
        public Held File;
        public bool Effect, Verified;
    }
    sealed class CleanupCopy
    {
        public string Path;
        public byte[] Expected;
        public Held File;
        public bool Deleted, AbsenceVerified;
    }

    static void Require(bool value, string code) { if (!value) throw new Failure(code); }
    static void Win32(bool value, string operation) { if (!value) throw new Win32Exception(Marshal.GetLastWin32Error(), operation); }
    static string Now() { return DateTime.UtcNow.ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'", CultureInfo.InvariantCulture); }
    static string Hash(byte[] bytes) { return Convert.ToHexString(SHA256.HashData(bytes)).ToLowerInvariant(); }
    static JsonObject Integrity(byte[] bytes) { return new JsonObject { ["method"] = "SHA256", ["value"] = Hash(bytes), ["byteLength"] = bytes.Length }; }
    static JsonNode Clone(JsonElement element) { return JsonNode.Parse(element.GetRawText()); }
    static JsonObject Ref(string path) { return new JsonObject { ["path"] = path, ["anchor"] = null }; }
    static JsonObject Version(string source, string snapshot, byte[] bytes)
    {
        return new JsonObject { ["source"] = source == null ? null : Ref(source),
            ["location"] = new JsonObject { ["kind"] = "SNAPSHOT", ["ref"] = Ref(snapshot) }, ["integrity"] = Integrity(bytes) };
    }
    static JsonObject Copy(string source, string snapshot, byte[] bytes)
    {
        return new JsonObject { ["version"] = Version(source, snapshot, bytes), ["cleanup"] = null };
    }
    static byte[] Envelope(JsonObject checkpoint)
    {
        return Utf8.GetBytes("# Kidea write checkpoint - byte evidence, not task approval\n\n<!-- kidea:data:start -->\n```json\n" + checkpoint.ToJsonString(Pretty) + "\n```\n<!-- kidea:data:end -->\n");
    }
    static JsonObject CheckpointRecord(byte[] bytes)
    {
        string text = Utf8.GetString(bytes);
        var envelopes = Regex.Matches(text, @"<!-- kidea:data:start -->\r?\n```json\r?\n([\s\S]*?)\r?\n```\r?\n<!-- kidea:data:end -->");
        Require(envelopes.Count == 1 && Regex.Matches(text, "<!-- kidea:data:start -->").Count == 1 && Regex.Matches(text, "<!-- kidea:data:end -->").Count == 1, "INVALID_CHECKPOINT_ENVELOPE");
        using (var doc = Parse(envelopes[0].Groups[1].Value))
        {
            Closed(doc.RootElement, "schemaVersion", "projectId", "kind", "id", "ownerId", "createdAt", "tool", "permissionRefs", "inputRefs", "targets", "observations", "nextAction");
            Require(doc.RootElement.GetProperty("schemaVersion").GetInt32() == 2 && Text(doc.RootElement.GetProperty("kind")) == "checkpoint", "INVALID_CHECKPOINT");
            return (JsonObject)Clone(doc.RootElement);
        }
    }
    static void Emit(object value) { Console.Out.WriteLine(JsonSerializer.Serialize(value)); Console.Out.Flush(); }
    static string Receive()
    {
        var read = Console.In.ReadLineAsync();
        Require(read.Wait(TimeSpan.FromSeconds(10)), "PROTOCOL_TIMEOUT");
        string line = read.Result;
        Require(line != null && line.Length > 0 && line.Length <= MaxLine, "PROTOCOL_INPUT");
        return line;
    }
    static JsonDocument Parse(string line)
    {
        var doc = JsonDocument.Parse(line, new JsonDocumentOptions { MaxDepth = 64 });
        RejectDuplicates(doc.RootElement);
        return doc;
    }
    static void RejectDuplicates(JsonElement e)
    {
        if (e.ValueKind == JsonValueKind.Object)
        {
            var names = new HashSet<string>(StringComparer.Ordinal);
            foreach (var p in e.EnumerateObject()) { Require(names.Add(p.Name), "DUPLICATE_FIELD"); RejectDuplicates(p.Value); }
        }
        else if (e.ValueKind == JsonValueKind.Array) foreach (var item in e.EnumerateArray()) RejectDuplicates(item);
    }
    static void Closed(JsonElement e, params string[] keys)
    {
        Require(e.ValueKind == JsonValueKind.Object, "INVALID_OBJECT");
        var properties = e.EnumerateObject().Select(p => p.Name).ToArray();
        Require(properties.Length == keys.Length && properties.All(p => keys.Contains(p, StringComparer.Ordinal)), "UNKNOWN_OR_MISSING_FIELD");
    }
    static string Text(JsonElement e) { Require(e.ValueKind == JsonValueKind.String && !String.IsNullOrWhiteSpace(e.GetString()), "INVALID_TEXT"); return e.GetString(); }
    static bool Bool(JsonElement e) { Require(e.ValueKind == JsonValueKind.True || e.ValueKind == JsonValueKind.False, "INVALID_BOOLEAN"); return e.GetBoolean(); }
    static string Relative(JsonElement e) { string p = Text(e); Require(ValidRelative(p), "UNSAFE_PATH"); return p; }
    static bool ValidRelative(string p)
    {
        return !String.IsNullOrWhiteSpace(p) && !p.StartsWith("/") &&
            !p.Any(c => c < 32 || "\\:*?\"<>|".Contains(c)) &&
            p.Split('/').All(s => s.Length > 0 && s != "." && s != ".." && !s.EndsWith(".") && !s.EndsWith(" ") &&
                !Regex.IsMatch(s, @"^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)", RegexOptions.IgnoreCase));
    }
    static byte[] Bytes(JsonElement e)
    {
        Require(e.ValueKind == JsonValueKind.String, "INVALID_BYTES");
        string encoded = e.GetString();
        byte[] bytes;
        try { bytes = Convert.FromBase64String(encoded); } catch { throw new Failure("INVALID_BASE64"); }
        Require(bytes.Length <= MaxBytes && Convert.ToBase64String(bytes) == encoded, "INVALID_BYTES");
        return bytes;
    }
    static void CheckIntegrityShape(JsonElement i, bool payload = true)
    {
        Closed(i, "method", "value", "byteLength");
        Require(Text(i.GetProperty("method")) == "SHA256" && Regex.IsMatch(Text(i.GetProperty("value")), "^[0-9a-f]{64}$"), "INVALID_INTEGRITY");
        var n = i.GetProperty("byteLength");
        Require(n.ValueKind == JsonValueKind.Number && n.TryGetInt64(out long length) && length >= 0 && length <= (payload ? MaxBytes : 9007199254740991L), "INVALID_INTEGRITY");
    }
    static void CheckRef(JsonElement e)
    {
        Closed(e, "path", "anchor"); Relative(e.GetProperty("path"));
        if (e.GetProperty("anchor").ValueKind != JsonValueKind.Null) Text(e.GetProperty("anchor"));
    }
    static void CheckVersion(JsonElement e)
    {
        Closed(e, "source", "location", "integrity");
        // v1 supports local whole-file snapshots only. source=null belongs to
        // external references, which this worker cannot bind or verify.
        Require(e.GetProperty("source").ValueKind != JsonValueKind.Null, "UNSUPPORTED_REFERENCE");
        CheckRef(e.GetProperty("source"));
        var location = e.GetProperty("location");
        Require(location.ValueKind == JsonValueKind.Object && location.TryGetProperty("kind", out var kind) && kind.ValueKind == JsonValueKind.String && kind.GetString() == "SNAPSHOT", "UNSUPPORTED_REFERENCE");
        Closed(location, "kind", "ref"); CheckRef(location.GetProperty("ref"));
        Require(location.GetProperty("ref").GetProperty("anchor").ValueKind == JsonValueKind.Null, "UNSUPPORTED_REFERENCE");
        CheckIntegrityShape(e.GetProperty("integrity"));
    }
    static string CanonicalAbsolute(string path)
    {
        Require(Regex.IsMatch(path, @"^[A-Za-z]:\\") && !path.Substring(2).Contains(":"), "LOCAL_ABSOLUTE_ROOT_REQUIRED");
        string full = System.IO.Path.GetFullPath(path).TrimEnd('\\');
        Require(full.Length > 3 && String.Equals(path.TrimEnd('\\'), full, StringComparison.OrdinalIgnoreCase), "CANONICAL_ROOT_REQUIRED");
        return full;
    }
    static SafeFileHandle Open(string path, uint access, uint share, uint disposition, bool directory)
    {
        var handle = CreateFileW(path, access, share, IntPtr.Zero, disposition, OpenReparse | (directory ? BackupSemantics : 0), IntPtr.Zero);
        if (handle.IsInvalid) { int error = Marshal.GetLastWin32Error(); handle.Dispose(); throw new Win32Exception(error, "CreateFileW: " + path); }
        return handle;
    }
    static HandleInfo Inspect(Held file)
    {
        Require(!file.IdentityLost, "HANDLE_IDENTITY_LOST");
        try { return InspectIdentity(file); }
        catch { file.IdentityLost = true; throw; }
    }
    static HandleInfo InspectIdentity(Held file)
    {
        Require(!file.Closed, "HANDLE_NOT_CONTINUOUS");
        Win32(GetFileInformationByHandle(file.Handle, out var info), "GetFileInformationByHandle");
        Require((info.Attributes & 0x400) == 0, "REPARSE_POINT_REJECTED");
        Require(((info.Attributes & 0x10) != 0) == file.Directory, "WRONG_FILE_KIND");
        Require(file.Directory || info.Links == 1, "MULTIPLE_LINKS_REJECTED");
        string id = info.Volume.ToString("X8") + ":" + info.IndexHigh.ToString("X8") + info.IndexLow.ToString("X8");
        if (file.Id == null) file.Id = id; else Require(file.Id == id, "FILE_ID_CHANGED");
        var final = new StringBuilder(32768);
        uint count = GetFinalPathNameByHandleW(file.Handle, final, (uint)final.Capacity, 0);
        Require(count > 0 && count < final.Capacity, "FINAL_PATH_UNVERIFIED");
        string actual = final.ToString();
        if (actual.StartsWith(@"\\?\")) actual = actual.Substring(4);
        Require(PathComparer.Equals(actual.TrimEnd('\\'), file.Path.TrimEnd('\\')), "FINAL_PATH_CHANGED");
        return info;
    }
    static void Seek(Held file) { Win32(SetFilePointerEx(file.Handle, 0, out _, 0), "SetFilePointerEx"); }
    static byte[] ReadBytes(Held file)
    {
        var info = Inspect(file);
        ulong length = ((ulong)info.SizeHigh << 32) | info.SizeLow;
        Require(length <= MaxBytes, "FILE_TOO_LARGE");
        var bytes = new byte[(int)length]; Seek(file);
        Win32(ReadFile(file.Handle, bytes, (uint)bytes.Length, out uint count, IntPtr.Zero), "ReadFile");
        Require(count == bytes.Length, "SHORT_READ");
        Inspect(file); return bytes;
    }
    static void WriteBytes(Held file, byte[] bytes)
    {
        Inspect(file); Seek(file);
        Win32(WriteFile(file.Handle, bytes, (uint)bytes.Length, out uint count, IntPtr.Zero), "WriteFile");
        Require(count == bytes.Length, "SHORT_WRITE");
        Win32(SetEndOfFile(file.Handle), "SetEndOfFile");
        Win32(FlushFileBuffers(file.Handle), "FlushFileBuffers");
        Require(ReadBytes(file).SequenceEqual(bytes), "READBACK_DIFFERS");
    }

    sealed class Transaction : IDisposable
    {
        readonly List<Held> handles = new List<Held>();
        readonly Dictionary<string, Held> directories = new Dictionary<string, Held>(PathComparer);
        readonly Dictionary<string, Held> inputFiles = new Dictionary<string, Held>(PathComparer);
        readonly Dictionary<string, byte[]> expectedInputs = new Dictionary<string, byte[]>(PathComparer);
        readonly Dictionary<string, string> spellings = new Dictionary<string, string>(PathComparer);
        readonly List<Target> targets = new List<Target>();
        readonly Dictionary<string, CleanupCopy> cleanupCopies = new Dictionary<string, CleanupCopy>(PathComparer);
        readonly List<Held> evidence = new List<Held>();
        readonly List<string> bootstrapDirectories = new List<string>();
        readonly Dictionary<string, byte[]> bootstrapEvidence = new Dictionary<string, byte[]>(PathComparer);
        readonly Dictionary<string, Held> bootstrapFiles = new Dictionary<string, Held>(PathComparer);
        readonly string fault, barrier;
        string root, operation, opRelative, digest;
        byte[] requestBytes;
        JsonElement context, cleanup;
        JsonObject checkpoint;
        Held pending, current;
        bool restoreAllowed, retireAllowed, pendingCreated, retired, effects, faultUsed, barrierUsed, safetyLost, isCleanup, isBootstrap;
        int observationNumber;
        string lastPhase = "PRECHECK";

        public Transaction(string fault, string barrier) { this.fault = fault; this.barrier = barrier; }
        string Absolute(string relative) { Require(ValidRelative(relative), "UNSAFE_PATH"); return Path.Combine(root, relative.Replace('/', '\\')); }
        string CheckpointPath { get { return opRelative + "/checkpoint.md"; } }
        void Spelling(string p) { if (spellings.TryGetValue(p, out string previous)) Require(previous == p, "AMBIGUOUS_PATH_ALIAS"); else spellings.Add(p, p); }
        Held Hold(string path, uint access, uint share, uint disposition, bool directory, Action<Held> opened = null)
        {
            var file = new Held { Path = path, Directory = directory, Handle = Open(path, access, share, disposition, directory) };
            handles.Add(file);
            // CREATE_NEW has already changed the namespace. Record that fact
            // before inspection, even if the newly created handle is unsafe.
            opened?.Invoke(file);
            Inspect(file); return file;
        }
        void ProtectDirectory(string path)
        {
            path = Path.GetFullPath(path);
            if (directories.ContainsKey(path)) return;
            var parent = Directory.GetParent(path);
            if (parent != null) ProtectDirectory(parent.FullName);
            var file = Hold(path, 0, 3, OpenExisting, true); directories.Add(path, file);
        }
        void ProtectParent(string path) { ProtectDirectory(Path.GetDirectoryName(path)); }
        void CheckIdentities()
        {
            Require(!safetyLost, "SAFETY_PRECONDITION_LOST");
            try { foreach (var file in handles) if (!file.Closed) Inspect(file); }
            catch { safetyLost = true; throw; }
        }
        void CheckAbsence(string path)
        {
            CheckIdentities();
            try { using (var h = Open(path, 0, 7, OpenExisting, false)) { safetyLost = true; throw new Failure("CREATE_TARGET_EXISTS"); } }
            catch (Win32Exception e)
            {
                bool missingParent = isBootstrap && e.NativeErrorCode == 3 &&
                    ((!directories.ContainsKey(Absolute(".kidea")) && path.StartsWith(Absolute(".kidea") + "\\", StringComparison.OrdinalIgnoreCase)) ||
                    bootstrapDirectories.Any(d => !directories.ContainsKey(Absolute(d)) && path.StartsWith(Absolute(d) + "\\", StringComparison.OrdinalIgnoreCase)));
                if (e.NativeErrorCode != 2 && !missingParent) { safetyLost = true; throw; }
            }
            CheckIdentities();
        }
        void EnsureMetadataDirectory(string relative, bool mustBeNew = false)
        {
            string path = Absolute(relative); ProtectParent(path); CheckIdentities();
            bool created = CreateDirectoryW(path, IntPtr.Zero);
            if (!created)
            {
                int error = Marshal.GetLastWin32Error();
                if (mustBeNew && error == 183) throw new Failure("OPERATION_ID_REUSED");
                if (error != 183) throw new Win32Exception(error, "CreateDirectoryW");
            }
            ProtectDirectory(path); CheckIdentities();
        }
        byte[] Expected(string path)
        {
            var target = targets.FirstOrDefault(t => PathComparer.Equals(t.Path, path));
            return target != null && target.Verified ? target.Planned : expectedInputs[path];
        }
        void CheckInputs(Target exclude = null)
        {
            CheckIdentities();
            try
            {
                foreach (var item in inputFiles)
                {
                    if (exclude != null && PathComparer.Equals(item.Key, exclude.Path)) continue;
                    if (cleanupCopies.TryGetValue(item.Key, out var copy) && copy.Deleted)
                    {
                        copy.AbsenceVerified = false;
                        CheckAbsence(Absolute(item.Key)); copy.AbsenceVerified = true; continue;
                    }
                    Require(ReadBytes(item.Value).SequenceEqual(Expected(item.Key)), "INPUT_BYTES_CHANGED");
                }
            }
            catch { safetyLost = true; throw; }
        }
        void CheckStable(Target exclude = null)
        {
            CheckInputs(exclude);
            try
            {
                foreach (var target in targets)
                {
                    if (target == exclude) continue;
                    if (target.File == null) CheckAbsence(Absolute(target.Path));
                    else Require(ReadBytes(target.File).SequenceEqual(target.Verified ? target.Planned : target.Before), "TARGET_BYTES_CHANGED");
                }
                foreach (var file in evidence) Require(ReadBytes(file).SequenceEqual(file.Expected), "RECOVERY_EVIDENCE_CHANGED");
                if (pending != null && !pending.Closed) Require(ReadBytes(pending).SequenceEqual(pending.Expected), "PENDING_BYTES_CHANGED");
                if (current != null) Require(ReadBytes(current).SequenceEqual(current.Expected), "CHECKPOINT_BYTES_CHANGED");
            }
            catch { safetyLost = true; throw; }
            CheckIdentities();
        }
        void Barrier(string point)
        {
            if (barrier != point || barrierUsed) return;
            barrierUsed = true;
            Emit(new { @event = "BARRIER", point, operationId = operation });
            using (var doc = Parse(Receive()))
            {
                var e = doc.RootElement; Closed(e, "command", "point", "operationId");
                Require(Text(e.GetProperty("command")) == "CONTINUE" && Text(e.GetProperty("point")) == point && Text(e.GetProperty("operationId")) == operation, "INVALID_CONTINUE");
            }
            CheckIdentities();
        }
        bool Inject(string point)
        {
            if (fault != point || faultUsed) return false;
            faultUsed = true; return true;
        }
        Held NewEvidence(string relative, byte[] bytes, uint access = Read | Write)
        {
            CheckIdentities();
            var file = Hold(Absolute(relative), access, 0, CreateNew, false);
            WriteBytes(file, bytes); file.Expected = bytes; evidence.Add(file);
            CheckIdentities(); return file;
        }
        JsonArray Results()
        {
            var rows = new JsonArray();
            foreach (var target in targets)
            {
                string match = "UNKNOWN", detail = "Identity or byte state could not be established.";
                byte[] bytes = null;
                try
                {
                    CheckIdentities();
                    if (target.File == null) { CheckAbsence(Absolute(target.Path)); match = "BEFORE"; detail = "CREATE destination is still absent."; }
                    else
                    {
                        bytes = ReadBytes(target.File);
                        match = bytes.SequenceEqual(target.Planned) ? "PLANNED" : target.Before != null && bytes.SequenceEqual(target.Before) ? "BEFORE" : "OTHER";
                        detail = "Read back through the continuously held target handle.";
                    }
                }
                catch { bytes = null; }
                rows.Add(new JsonObject { ["path"] = target.Path, ["match"] = match, ["integrity"] = bytes == null ? null : Integrity(bytes), ["detail"] = detail });
            }
            return rows;
        }
        void Journal(string phase, string next, bool permitFault = true)
        {
            lastPhase = phase; CheckIdentities();
            checkpoint["nextAction"] = next;
            ((JsonArray)checkpoint["observations"]).Add(new JsonObject { ["at"] = Now(), ["phase"] = phase, ["results"] = Results(), ["evidenceRefs"] = new JsonArray() });
            var bytes = Envelope(checkpoint);
            NewEvidence(opRelative + "/observations/" + (++observationNumber).ToString("D4") + ".md", bytes);
            if (permitFault && Inject("JOURNAL_FAILURE"))
            {
                if (current != null) { Seek(current); Win32(WriteFile(current.Handle, Utf8.GetBytes("interrupted journal"), 19, out _, IntPtr.Zero), "WriteFile"); Win32(FlushFileBuffers(current.Handle), "FlushFileBuffers"); }
                throw new Failure("INJECTED_JOURNAL_FAILURE");
            }
            if (current == null) current = Hold(Absolute(CheckpointPath), Read | Write, 0, CreateNew, false);
            WriteBytes(current, bytes); current.Expected = bytes;
            CheckIdentities();
        }
        void ValidateRequest(JsonElement request, string line)
        {
            isCleanup = request.TryGetProperty("cleanup", out cleanup);
            isBootstrap = request.TryGetProperty("bootstrap", out var bootstrap);
            Require(!(isCleanup && isBootstrap), "INVALID_BOOTSTRAP");
            if (isCleanup)
            {
                Closed(request, "protocolVersion", "operationId", "root", "authorization", "context", "inputs", "targets", "cleanup");
                Closed(cleanup, "checkpointPath", "copies", "receipt"); Relative(cleanup.GetProperty("checkpointPath"));
            }
            else if (isBootstrap) Closed(request, "protocolVersion", "operationId", "root", "authorization", "context", "inputs", "targets", "bootstrap");
            else Closed(request, "protocolVersion", "operationId", "root", "authorization", "context", "inputs", "targets");
            Require(request.GetProperty("protocolVersion").ValueKind == JsonValueKind.Number && request.GetProperty("protocolVersion").GetInt32() == 1, "PROTOCOL_VERSION");
            operation = Text(request.GetProperty("operationId"));
            Require(Regex.IsMatch(operation, "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"), "INVALID_OPERATION_ID");
            root = CanonicalAbsolute(Text(request.GetProperty("root"))); requestBytes = Utf8.GetBytes(line); digest = Hash(requestBytes);
            opRelative = MetadataRoot + "/operations/" + operation;
            var auth = request.GetProperty("authorization");
            if (isCleanup) Closed(auth, "root", "metadataRoot", "targets", "allowRestoreUpdate", "allowRetireOwnPending", "assumptions", "cleanup");
            else if (isBootstrap) Closed(auth, "root", "metadataRoot", "targets", "allowRestoreUpdate", "allowRetireOwnPending", "assumptions", "bootstrap", "createDirectories");
            else Closed(auth, "root", "metadataRoot", "targets", "allowRestoreUpdate", "allowRetireOwnPending", "assumptions");
            Require(PathComparer.Equals(CanonicalAbsolute(Text(auth.GetProperty("root"))), root) && Text(auth.GetProperty("metadataRoot")) == MetadataRoot, "AUTHORIZATION_REQUIRED");
            restoreAllowed = Bool(auth.GetProperty("allowRestoreUpdate")); retireAllowed = Bool(auth.GetProperty("allowRetireOwnPending"));
            Require(retireAllowed, "PENDING_RETIRE_AUTHORIZATION_REQUIRED");
            var assumptions = auth.GetProperty("assumptions"); Closed(assumptions, "localNtfs", "noActiveSync", "noConcurrentNamespaceChanges");
            foreach (var p in assumptions.EnumerateObject()) Require(Bool(p.Value), "ENVIRONMENT_NOT_CONFIRMED");
            var drive = new DriveInfo(Path.GetPathRoot(root));
            Require(drive.DriveType == DriveType.Fixed && drive.DriveFormat == "NTFS", "FIXED_NTFS_REQUIRED");
            context = request.GetProperty("context"); Closed(context, "projectId", "ownerId", "tool", "permissionRefs", "inputRefs");
            Text(context.GetProperty("projectId")); Text(context.GetProperty("ownerId"));
            var tool = context.GetProperty("tool"); Closed(tool, "version", "components"); Text(tool.GetProperty("version"));
            var components = tool.GetProperty("components"); Require(components.ValueKind == JsonValueKind.Array && components.GetArrayLength() > 0, "TOOL_IDENTITY_REQUIRED");
            var componentNames = new HashSet<string>(StringComparer.Ordinal);
            foreach (var c in components.EnumerateArray()) { Closed(c, "name", "integrity"); Require(componentNames.Add(Text(c.GetProperty("name"))), "DUPLICATE_COMPONENT"); CheckIntegrityShape(c.GetProperty("integrity"), false); }
            foreach (string name in new[] { "permissionRefs", "inputRefs" })
            {
                var refs = context.GetProperty(name); Require(refs.ValueKind == JsonValueKind.Array && refs.GetArrayLength() > 0, "CONTEXT_REFERENCES_REQUIRED");
                foreach (var v in refs.EnumerateArray()) CheckVersion(v);
            }
            var list = request.GetProperty("targets"); Require(list.ValueKind == JsonValueKind.Array && list.GetArrayLength() > 0 && list.GetArrayLength() <= 256, "INVALID_TARGETS");
            foreach (var t in list.EnumerateArray())
            {
                Closed(t, "path", "action", "beforeBase64", "plannedBase64");
                string p = Relative(t.GetProperty("path")), action = Text(t.GetProperty("action")); Spelling(p);
                bool reserved = PathComparer.Equals(p, ".kidea") || PathComparer.Equals(p, MetadataRoot) || p.StartsWith(MetadataRoot + "/", StringComparison.OrdinalIgnoreCase);
                Require(!reserved || (isCleanup && p == cleanup.GetProperty("checkpointPath").GetString()), "RESERVED_TARGET");
                Require(!targets.Any(x => PathComparer.Equals(x.Path, p)) && (action == "CREATE" || action == "UPDATE"), "INVALID_TARGETS");
                byte[] before = t.GetProperty("beforeBase64").ValueKind == JsonValueKind.Null ? null : Bytes(t.GetProperty("beforeBase64"));
                Require((action == "CREATE") == (before == null), "INVALID_BEFORE");
                targets.Add(new Target { Path = p, Action = action, Before = before, Planned = Bytes(t.GetProperty("plannedBase64")) });
            }
            var grants = auth.GetProperty("targets"); Require(grants.ValueKind == JsonValueKind.Array && grants.GetArrayLength() == targets.Count, "TARGET_NOT_AUTHORIZED");
            var grantPaths = new HashSet<string>(PathComparer);
            foreach (var grant in grants.EnumerateArray())
            {
                Closed(grant, "path", "action"); string p = Relative(grant.GetProperty("path")), action = Text(grant.GetProperty("action"));
                Require(grantPaths.Add(p) && targets.Any(t => t.Path == p && t.Action == action), "TARGET_NOT_AUTHORIZED");
            }
            var inputs = request.GetProperty("inputs"); Require(inputs.ValueKind == JsonValueKind.Array && (isBootstrap || inputs.GetArrayLength() > 0) && inputs.GetArrayLength() <= 4096, "INVALID_INPUTS");
            foreach (var i in inputs.EnumerateArray())
            {
                Closed(i, "path", "expectedBase64"); string p = Relative(i.GetProperty("path")); Spelling(p);
                Require(!expectedInputs.ContainsKey(p), "DUPLICATE_INPUT"); expectedInputs.Add(p, Bytes(i.GetProperty("expectedBase64")));
            }
            if (isCleanup) ValidateCleanup(auth.GetProperty("cleanup"));
            if (isBootstrap) ValidateBootstrap(bootstrap, auth);
        }
        void ValidateBootstrap(JsonElement bootstrap, JsonElement auth)
        {
            Closed(bootstrap, "directories", "evidence");
            Require(Bool(auth.GetProperty("bootstrap")) && !restoreAllowed && targets.All(t => t.Action == "CREATE") &&
                targets.Any(t => t.Path == ".kidea/INDEX.md") && targets.Any(t => t.Path == ".kidea/work.md"), "INVALID_BOOTSTRAP");
            Require(targets.All(t => !t.Path.StartsWith(".kidea/", StringComparison.OrdinalIgnoreCase) || t.Path == ".kidea/INDEX.md" || t.Path == ".kidea/work.md"), "INVALID_BOOTSTRAP_TARGET");
            var dirs = bootstrap.GetProperty("directories"); var grants = auth.GetProperty("createDirectories");
            Require(dirs.ValueKind == JsonValueKind.Array && grants.ValueKind == JsonValueKind.Array && dirs.GetArrayLength() <= 256 && dirs.GetArrayLength() == grants.GetArrayLength(), "DIRECTORIES_NOT_AUTHORIZED");
            int n = 0;
            foreach (var d in dirs.EnumerateArray())
            {
                string p = Relative(d); Spelling(p);
                Require(!p.StartsWith(".kidea", StringComparison.OrdinalIgnoreCase) && !bootstrapDirectories.Contains(p, PathComparer) &&
                    Relative(grants[n++]) == p && targets.Any(t => t.Path.StartsWith(p + "/", StringComparison.Ordinal)), "DIRECTORIES_NOT_AUTHORIZED");
                Require(!targets.Any(t => PathComparer.Equals(t.Path, p)) && !expectedInputs.ContainsKey(p), "PATH_ROLE_COLLISION");
                bootstrapDirectories.Add(p);
            }
            var copies = bootstrap.GetProperty("evidence");
            Require(copies.ValueKind == JsonValueKind.Array && copies.GetArrayLength() > 0 && copies.GetArrayLength() <= 256, "INVALID_BOOTSTRAP_EVIDENCE");
            foreach (var e in copies.EnumerateArray())
            {
                Closed(e, "path", "bytesBase64"); string p = Relative(e.GetProperty("path")); Spelling(p);
                Require(p.StartsWith(opRelative + "/", StringComparison.Ordinal) && Regex.IsMatch(p.Substring(opRelative.Length + 1), @"^(permission|input-[0-9]+)\.md$") &&
                    !bootstrapEvidence.ContainsKey(p) && !expectedInputs.ContainsKey(p), "INVALID_BOOTSTRAP_EVIDENCE");
                bootstrapEvidence.Add(p, Bytes(e.GetProperty("bytesBase64")));
            }
        }
        void ValidateCleanup(JsonElement grant)
        {
            Require(!restoreAllowed && targets.Count == 1 && targets[0].Action == "UPDATE" && targets[0].Path == cleanup.GetProperty("checkpointPath").GetString(), "INVALID_CLEANUP_TARGET");
            Closed(grant, "copies", "conditions");
            var conditions = grant.GetProperty("conditions"); Closed(conditions, "ownerCompleted", "requiredChecksPassed", "retentionEnded");
            foreach (var p in conditions.EnumerateObject()) Require(Bool(p.Value), "CLEANUP_CONDITIONS_NOT_CONFIRMED");
            var before = CheckpointRecord(targets[0].Before);
            var planned = CheckpointRecord(targets[0].Planned);
            string oldId = before["id"].GetValue<string>();
            Require(Regex.IsMatch(oldId, "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$") &&
                targets[0].Path == MetadataRoot + "/operations/" + oldId + "/checkpoint.md" && oldId != operation, "CLEANUP_NOT_OWN_OPERATION");
            Require(before["projectId"].GetValue<string>() == Text(context.GetProperty("projectId")) && before["ownerId"].GetValue<string>() == Text(context.GetProperty("ownerId")), "CLEANUP_CONTEXT_IDENTITY");
            var oldTargets = before["targets"] as JsonArray;
            var observations = before["observations"] as JsonArray;
            Require(oldTargets != null && oldTargets.Count > 0 && observations != null, "INVALID_CHECKPOINT");
            var latestVerify = observations.LastOrDefault(o => o?["phase"]?.GetValue<string>() == "VERIFY");
            var results = latestVerify?["results"] as JsonArray;
            Require(results != null && results.Count == oldTargets.Count && oldTargets.All(t => results.Count(r => r?["path"]?.GetValue<string>() == t["path"].GetValue<string>() &&
                r?["match"]?.GetValue<string>() == "PLANNED" && JsonNode.DeepEquals(r["integrity"], t["planned"]["version"]["integrity"])) == 1), "CLEANUP_WRITE_NOT_VERIFIED");
            var receipt = cleanup.GetProperty("receipt"); Closed(receipt, "at", "reason", "evidenceRef");
            string at = Text(receipt.GetProperty("at"));
            Require(DateTime.TryParseExact(at, "yyyy-MM-dd'T'HH:mm:ss.fff'Z'", CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out _), "INVALID_CLEANUP_RECEIPT");
            Text(receipt.GetProperty("reason")); CheckRef(receipt.GetProperty("evidenceRef"));
            string evidencePath = Relative(receipt.GetProperty("evidenceRef").GetProperty("path")); Spelling(evidencePath);
            Require(expectedInputs.ContainsKey(evidencePath) && evidencePath != targets[0].Path, "CLEANUP_EVIDENCE_NOT_BOUND");
            var copies = cleanup.GetProperty("copies"); Require(copies.ValueKind == JsonValueKind.Array && copies.GetArrayLength() > 0, "INVALID_CLEANUP_COPIES");
            var expectedPlanned = (JsonObject)before.DeepClone();
            foreach (var copy in copies.EnumerateArray())
            {
                Closed(copy, "path", "targetPath", "copy", "integrity");
                string path = Relative(copy.GetProperty("path")), targetPath = Relative(copy.GetProperty("targetPath")), kind = Text(copy.GetProperty("copy")); Spelling(path);
                Require((kind == "before" || kind == "planned") && !cleanupCopies.ContainsKey(path), "INVALID_CLEANUP_COPIES");
                int index = -1;
                for (int i = 0; i < oldTargets.Count; i++) if (oldTargets[i]["path"].GetValue<string>() == targetPath) { Require(index == -1, "INVALID_CHECKPOINT"); index = i; }
                Require(index >= 0 && path == MetadataRoot + "/operations/" + oldId + "/" + kind + "-" + index + ".bin", "CLEANUP_NOT_OWN_PAYLOAD");
                var recovery = oldTargets[index][kind] as JsonObject;
                Require(recovery != null && recovery.ContainsKey("cleanup") && recovery["cleanup"] == null, "COPY_ALREADY_RETIRED_OR_ABSENT");
                using (var doc = Parse(recovery.ToJsonString()))
                {
                    Closed(doc.RootElement, "version", "cleanup"); CheckVersion(doc.RootElement.GetProperty("version"));
                }
                var version = recovery["version"];
                Require(version["source"]["path"].GetValue<string>() == targetPath && version["source"]["anchor"] == null &&
                    version["location"]["ref"]["path"].GetValue<string>() == path && JsonNode.DeepEquals(Clone(copy.GetProperty("integrity")), version["integrity"]), "CLEANUP_COPY_IDENTITY");
                Require(expectedInputs.TryGetValue(path, out var expected) && JsonNode.DeepEquals(Integrity(expected), version["integrity"]), "CLEANUP_COPY_BYTES_NOT_BOUND");
                cleanupCopies.Add(path, new CleanupCopy { Path = path, Expected = expected });
                expectedPlanned["targets"][index][kind]["cleanup"] = Clone(receipt);
            }
            Require(!cleanupCopies.ContainsKey(evidencePath) && JsonNode.DeepEquals(expectedPlanned, planned), "INVALID_CLEANUP_RECEIPT_UPDATE");
            foreach (string name in new[] { "permissionRefs", "inputRefs" }) foreach (var reference in context.GetProperty(name).EnumerateArray())
                Require(!cleanupCopies.ContainsKey(reference.GetProperty("source").GetProperty("path").GetString()) &&
                    !cleanupCopies.ContainsKey(reference.GetProperty("location").GetProperty("ref").GetProperty("path").GetString()), "CLEANUP_COPY_STILL_REFERENCED");
            var grants = grant.GetProperty("copies"); Require(grants.ValueKind == JsonValueKind.Array && grants.GetArrayLength() == cleanupCopies.Count, "CLEANUP_NOT_AUTHORIZED");
            var granted = new HashSet<string>(PathComparer);
            foreach (var copy in grants.EnumerateArray())
            {
                Closed(copy, "path", "integrity"); string path = Relative(copy.GetProperty("path"));
                Require(granted.Add(path) && cleanupCopies.TryGetValue(path, out var selected) && path == selected.Path && JsonNode.DeepEquals(Clone(copy.GetProperty("integrity")), Integrity(selected.Expected)), "CLEANUP_NOT_AUTHORIZED");
            }
        }
        void CheckContextReferences()
        {
            foreach (string name in new[] { "permissionRefs", "inputRefs" }) foreach (var v in context.GetProperty(name).EnumerateArray())
            {
                string snapshot = v.GetProperty("location").GetProperty("ref").GetProperty("path").GetString();
                byte[] bytes = BoundBefore(snapshot);
                var integrity = v.GetProperty("integrity");
                Require(integrity.GetProperty("value").GetString() == Hash(bytes) && integrity.GetProperty("byteLength").GetInt64() == bytes.Length, "REFERENCE_INTEGRITY_DIFFERS");
                if (v.GetProperty("source").ValueKind != JsonValueKind.Null)
                    Require(BoundBefore(v.GetProperty("source").GetProperty("path").GetString()).SequenceEqual(bytes), "REFERENCE_SOURCE_DIFFERS");
            }
        }
        byte[] BoundBefore(string p)
        {
            Spelling(p);
            if (isBootstrap && bootstrapEvidence.TryGetValue(p, out var captured)) return captured;
            if (inputFiles.TryGetValue(p, out var input)) return ReadBytes(input);
            var target = targets.FirstOrDefault(t => t.Path == p && t.Action == "UPDATE");
            Require(target != null, "UNBOUND_REFERENCE"); return ReadBytes(target.File);
        }
        void Acquire()
        {
            ProtectDirectory(root);
            if (isBootstrap)
            {
                CheckAbsence(Absolute(".kidea"));
                foreach (var d in bootstrapDirectories)
                {
                    string parent = Path.GetDirectoryName(Absolute(d));
                    if (!bootstrapDirectories.Any(x => PathComparer.Equals(Absolute(x), parent))) ProtectDirectory(parent);
                    CheckAbsence(Absolute(d));
                }
            }
            foreach (var target in targets)
            {
                string parent = Path.GetDirectoryName(Absolute(target.Path));
                if (!isBootstrap || !PathComparer.Equals(parent, Absolute(".kidea")) && !bootstrapDirectories.Any(d => PathComparer.Equals(Absolute(d), parent))) ProtectDirectory(parent);
            }
            foreach (var p in expectedInputs.Keys) ProtectParent(Absolute(p));
            foreach (var target in targets)
            {
                if (target.Action == "CREATE") CheckAbsence(Absolute(target.Path));
                else { target.File = Hold(Absolute(target.Path), Read | Write, 0, OpenExisting, false); Require(ReadBytes(target.File).SequenceEqual(target.Before), "BEFORE_BYTES_CHANGED"); }
            }
            foreach (var pair in expectedInputs)
            {
                var target = targets.FirstOrDefault(t => PathComparer.Equals(t.Path, pair.Key));
                Require(target == null || target.Action == "UPDATE", "CREATE_CANNOT_BE_EXISTING_INPUT");
                cleanupCopies.TryGetValue(pair.Key, out var cleanupCopy);
                var held = target != null ? target.File : cleanupCopy != null ?
                    Hold(Absolute(pair.Key), Read | Delete, 0, OpenExisting, false) : Hold(Absolute(pair.Key), Read, 1, OpenExisting, false);
                if (cleanupCopy != null) cleanupCopy.File = held;
                inputFiles.Add(pair.Key, held); Require(ReadBytes(held).SequenceEqual(pair.Value), "INPUT_BYTES_CHANGED");
            }
            CheckContextReferences(); CheckStable();
            EnsureMetadataDirectory(".kidea", isBootstrap); EnsureMetadataDirectory(MetadataRoot);
            // The persistent empty lock is never rewritten or deleted. Opening
            // the registry directory share=0 would block our own enumeration.
            Held mutex;
            try { mutex = Hold(Absolute(MetadataRoot + "/writer.lock"), Read | Write, 0, OpenExisting, false); }
            catch (Win32Exception ex) { if (ex.NativeErrorCode != 2) throw; mutex = Hold(Absolute(MetadataRoot + "/writer.lock"), Read | Write, 0, CreateNew, false); }
            Require(ReadBytes(mutex).Length == 0, "WRITER_LOCK_NOT_EMPTY");
            EnsureMetadataDirectory(MetadataRoot + "/pending"); EnsureMetadataDirectory(MetadataRoot + "/operations");
            Require(Directory.GetFileSystemEntries(Absolute(MetadataRoot + "/pending")).Length == 0, "INCOMPLETE_WRITE_EXISTS");
            CheckStable(); EnsureMetadataDirectory(opRelative, true); EnsureMetadataDirectory(opRelative + "/observations", true);
            Barrier("LOCKS_ACQUIRED"); CheckStable();
        }
        void Prepare()
        {
            var rows = new JsonArray();
            for (int i = 0; i < targets.Count; i++)
            {
                var t = targets[i];
                rows.Add(new JsonObject { ["path"] = t.Path, ["action"] = t.Action,
                    ["before"] = t.Before == null ? null : Copy(t.Path, opRelative + "/before-" + i + ".bin", t.Before),
                    ["planned"] = Copy(t.Path, opRelative + "/planned-" + i + ".bin", t.Planned) });
            }
            checkpoint = new JsonObject { ["schemaVersion"] = 2, ["projectId"] = Text(context.GetProperty("projectId")), ["kind"] = "checkpoint", ["id"] = operation,
                ["ownerId"] = Text(context.GetProperty("ownerId")), ["createdAt"] = Now(), ["tool"] = Clone(context.GetProperty("tool")),
                ["permissionRefs"] = Clone(context.GetProperty("permissionRefs")), ["inputRefs"] = Clone(context.GetProperty("inputRefs")), ["targets"] = rows,
                ["observations"] = new JsonArray(), ["nextAction"] = "Prepare recovery copies; no target write is authorized by this checkpoint." };
            Hold(Absolute(MetadataRoot + "/pending/" + operation + ".json"), Read | Write | Delete, 0, CreateNew, false,
                file => { pending = file; pendingCreated = true; if (Inject("PENDING_POSTOPEN_FAILURE")) throw new Failure("INJECTED_PENDING_POSTOPEN_FAILURE"); });
            var pointer = Utf8.GetBytes(JsonSerializer.Serialize(new { protocolVersion = 1, operationId = operation, planDigest = digest, checkpointRef = new { path = CheckpointPath, anchor = (string)null } }) + "\n");
            WriteBytes(pending, pointer); pending.Expected = pointer;
            Barrier("PENDING_CREATED"); CheckStable();
            // Exact protocol bytes are supporting evidence, not a new source of
            // authority. Never replay this persisted request automatically.
            NewEvidence(opRelative + "/request.json", requestBytes);
            foreach (var e in bootstrapEvidence) bootstrapFiles.Add(e.Key, NewEvidence(e.Key, e.Value));
            for (int i = 0; i < targets.Count; i++)
            {
                var t = targets[i];
                if (t.Before != null) NewEvidence(opRelative + "/before-" + i + ".bin", t.Before);
                NewEvidence(opRelative + "/planned-" + i + ".bin", t.Planned);
            }
            ((JsonArray)checkpoint["observations"]).Add(new JsonObject { ["at"] = Now(), ["phase"] = "PRECHECK", ["results"] = Results(), ["evidenceRefs"] = new JsonArray() });
            NewEvidence(opRelative + "/prepared.md", Envelope(checkpoint));
            Journal("PRECHECK", "Recovery copies are retained; target writes have not started.", false);
            Barrier("PREPARED"); CheckStable();
            // Missing business parents are created only after the discovery
            // marker and retained plan exist. Never adopt a raced-in directory.
            foreach (var directory in bootstrapDirectories) EnsureMetadataDirectory(directory, true);
            CheckStable();
        }
        void DeleteCleanupCopies()
        {
            if (!isCleanup) return;
            Barrier("CLEANUP_BEFORE_DELETE"); CheckStable();
            if (Inject("CLEANUP_DELETE_FAILURE")) throw new Failure("INJECTED_CLEANUP_DELETE_FAILURE");
            int count = 0;
            foreach (var copy in cleanupCopies.Values)
            {
                CheckStable();
                var disposition = new DispositionInfo { DeleteFile = true };
                Win32(SetFileInformationByHandle(copy.File.Handle, 4, ref disposition, (uint)Marshal.SizeOf<DispositionInfo>()), "SetFileInformationByHandle(CleanupPayload)");
                // Once delete-on-close is accepted, a crash may remove the file.
                // Record that effect before closing; never resurrect a payload.
                effects = true; copy.File.Dispose(); copy.Deleted = true;
                CheckAbsence(Absolute(copy.Path)); copy.AbsenceVerified = true;
                CheckStable();
                Journal("CLEANUP", "Verified absence of owned temporary payload " + copy.Path + ". Receipt checkpoint update is still pending.", false);
                if (++count == 1)
                {
                    Barrier("CLEANUP_AFTER_FIRST_DELETE"); CheckStable();
                    if (Inject("CLEANUP_AFTER_FIRST_DELETE")) throw new Failure("INJECTED_CLEANUP_AFTER_FIRST_DELETE");
                }
            }
        }
        bool Restore(Target target)
        {
            if (!restoreAllowed || target.Action != "UPDATE" || !target.Effect) return false;
            lastPhase = "RESTORE";
            try
            {
                Barrier("BEFORE_RESTORE"); CheckStable(target);
                if (Inject("RESTORE_FAILURE")) throw new Failure("INJECTED_RESTORE_FAILURE");
                WriteBytes(target.File, target.Before); target.Verified = false;
                CheckStable(); Journal("RESTORE", "Only the failed UPDATE was restored through its continuously held handle. Keep pending for reconciliation.", false);
                return true;
            }
            catch { return false; }
        }
        void WriteTargets()
        {
            Barrier("BEFORE_FIRST_WRITE"); CheckStable();
            if (Inject("BEFORE_FIRST_WRITE")) throw new Failure("INJECTED_BEFORE_FIRST_WRITE");
            foreach (var target in targets)
            {
                CheckStable();
                try
                {
                    if (target.Action == "CREATE")
                    {
                        // CREATE_NEW is the effect. Even an empty/partial new file
                        // remains as evidence and is never automatically deleted.
                        Hold(Absolute(target.Path), Read | Write, 0, CreateNew, false,
                            file => { target.File = file; target.Effect = effects = true; if (Inject("CREATE_POSTOPEN_FAILURE")) throw new Failure("INJECTED_CREATE_POSTOPEN_FAILURE"); });
                        Barrier("AFTER_CREATE"); CheckStable(target);
                        if (Inject("AFTER_CREATE")) throw new Failure("INJECTED_AFTER_CREATE");
                    }
                    target.Effect = effects = true;
                    if (isCleanup && Inject("CLEANUP_RECEIPT_FAILURE"))
                    {
                        byte[] partialReceipt = target.Planned.Take(Math.Max(1, target.Planned.Length / 2)).ToArray();
                        Seek(target.File); Win32(WriteFile(target.File.Handle, partialReceipt, (uint)partialReceipt.Length, out uint count, IntPtr.Zero), "WriteFile");
                        Require(count == partialReceipt.Length, "SHORT_WRITE"); Win32(FlushFileBuffers(target.File.Handle), "FlushFileBuffers");
                        throw new Failure("INJECTED_CLEANUP_RECEIPT_FAILURE");
                    }
                    bool secondFault = fault == "AFTER_PARTIAL_WRITE_SECOND" && targets.IndexOf(target) == 1;
                    if ((!faultUsed && (fault == "AFTER_PARTIAL_WRITE" || fault == "RESTORE_FAILURE" || fault == "SAFETY_LOSS_AFTER_PARTIAL_WRITE" || secondFault)) || (!barrierUsed && barrier == "AFTER_PARTIAL_WRITE"))
                    {
                        var partial = target.Planned.Take(Math.Max(1, target.Planned.Length / 2)).ToArray();
                        Seek(target.File); Win32(WriteFile(target.File.Handle, partial, (uint)partial.Length, out uint count, IntPtr.Zero), "WriteFile");
                        Require(count == partial.Length, "SHORT_WRITE"); Win32(FlushFileBuffers(target.File.Handle), "FlushFileBuffers");
                        Barrier("AFTER_PARTIAL_WRITE"); CheckStable(target);
                        if (Inject("SAFETY_LOSS_AFTER_PARTIAL_WRITE")) { safetyLost = true; throw new Failure("INJECTED_SAFETY_LOSS"); }
                        if (Inject("AFTER_PARTIAL_WRITE") || (secondFault && Inject("AFTER_PARTIAL_WRITE_SECOND")) || fault == "RESTORE_FAILURE") throw new Failure("INJECTED_AFTER_PARTIAL_WRITE");
                    }
                    WriteBytes(target.File, target.Planned); target.Verified = true;
                    CheckStable(); Journal("WRITE", "Target bytes were read back; remaining targets and final verification are still pending.");
                }
                catch
                {
                    // Do not restore earlier verified targets. A journaling fault
                    // after a verified write is not a failed target write.
                    if (!target.Verified) Restore(target);
                    throw;
                }
            }
            CheckStable(); Journal("VERIFY", "All planned target bytes verified; awaiting independent caller proof acceptance.");
            Barrier("AFTER_VERIFY"); CheckStable();
            if (Inject("AFTER_VERIFY")) throw new Failure("INJECTED_AFTER_VERIFY");
        }
        JsonArray InputProof()
        {
            var proof = new JsonArray();
            foreach (var input in inputFiles)
            {
                if (cleanupCopies.TryGetValue(input.Key, out var copy) && copy.Deleted)
                {
                    copy.AbsenceVerified = false;
                    CheckAbsence(Absolute(input.Key)); copy.AbsenceVerified = true;
                    proof.Add(new JsonObject { ["path"] = input.Key, ["integrity"] = null, ["absent"] = true });
                }
                else proof.Add(new JsonObject { ["path"] = input.Key, ["integrity"] = Integrity(ReadBytes(input.Value)) });
            }
            return proof;
        }
        JsonArray DeletedProof()
        {
            var proof = new JsonArray();
            foreach (var copy in cleanupCopies.Values) if (copy.Deleted)
                proof.Add(new JsonObject { ["path"] = copy.Path, ["integrity"] = Integrity(copy.Expected), ["absent"] = copy.AbsenceVerified });
            return proof;
        }
        void FinalizeWrite()
        {
            Emit(new { @event = "BYTES_VERIFIED", operationId = operation, planDigest = digest,
                checkpointRef = new { path = CheckpointPath, anchor = (string)null }, checkpoint,
                inputs = InputProof(), deleted = DeletedProof(),
                bootstrapEvidence = bootstrapFiles.Select(p => new { path = p.Key, integrity = Integrity(ReadBytes(p.Value)) }).ToArray(),
                targets = targets.Select(t => new { path = t.Path, integrity = Integrity(ReadBytes(t.File)) }).ToArray() });
            using (var doc = Parse(Receive()))
            {
                var e = doc.RootElement; Closed(e, "command", "operationId", "planDigest", "verified");
                Require(Text(e.GetProperty("command")) == "FINALIZE" && Text(e.GetProperty("operationId")) == operation && Text(e.GetProperty("planDigest")) == digest && Bool(e.GetProperty("verified")), "FINALIZE_NOT_VERIFIED");
            }
            CheckStable(); Barrier("BEFORE_RETIRE"); CheckStable();
            if (Inject("RETIRE_FAILURE")) throw new Failure("INJECTED_RETIRE_FAILURE");
            Require(retireAllowed, "PENDING_RETIRE_AUTHORIZATION_REQUIRED");
            Journal("CLEANUP", "Caller accepted the bound byte proof. Retire only this operation's pending discovery entry; retain all recovery evidence.");
            CheckStable();
            // Delete by the exact still-held handle, not a reopened pathname.
            var disposition = new DispositionInfo { DeleteFile = true };
            Win32(SetFileInformationByHandle(pending.Handle, 4, ref disposition, (uint)Marshal.SizeOf<DispositionInfo>()), "SetFileInformationByHandle(FileDispositionInfo)");
            pending.Dispose(); retired = true;
            // The commit point is retirement immediately after all bound bytes
            // and identities were verified under continuous locks. After it,
            // inspect only this discovery entry; do not introduce a new business
            // read phase whose I/O failure could imply an automatic replay.
            try
            {
                using (var h = Open(Absolute(MetadataRoot + "/pending/" + operation + ".json"), 0, 7, OpenExisting, false))
                    throw new Failure("PENDING_RETIRE_ABSENCE_UNVERIFIED");
            }
            catch (Win32Exception e) { if (e.NativeErrorCode != 2) throw new Failure("PENDING_RETIRE_ABSENCE_UNVERIFIED", e.Message); }
            Emit(new { @event = "RESULT", state = "COMPLETED_BYTES", operationId = operation, planDigest = digest, effects, deleted = DeletedProof(),
                checkpointRef = new { path = CheckpointPath, anchor = (string)null }, code = "BOUND_BYTES_VERIFIED_NOT_TASK_APPROVAL" });
        }
        public int Execute(string line)
        {
            try
            {
                using (var doc = Parse(line))
                {
                    ValidateRequest(doc.RootElement, line); Acquire(); Prepare(); DeleteCleanupCopies(); WriteTargets(); FinalizeWrite();
                }
                return 0;
            }
            catch (Exception e)
            {
                string code = e is Failure f ? f.Code : e is Win32Exception w ? "WIN32_" + w.NativeErrorCode : "WORKER_FAILURE";
                // A failed journal never erases earlier immutable observations.
                // Do not modify evidence if path/handle identity is no longer safe.
                if (pendingCreated && !retired && checkpoint != null)
                {
                    try { Journal(lastPhase, "Stop and reconcile retained evidence. Failure: " + code + ". No automatic replay or cleanup.", false); } catch { }
                }
                Emit(new { @event = "RESULT", state = pendingCreated || effects ? "PENDING" : "REJECTED", operationId = operation, planDigest = digest,
                    effects, deleted = DeletedProof(), safetyLost = safetyLost || handles.Any(h => h.IdentityLost), pendingRetired = retired,
                    checkpointRef = opRelative == null ? null : new { path = CheckpointPath, anchor = (string)null }, code, detail = e.Message });
                return 1;
            }
        }
        public void Dispose() { for (int i = handles.Count - 1; i >= 0; i--) handles[i].Dispose(); }
    }

    public static int Run(string testFault, string testBarrier)
    {
        using (var transaction = new Transaction(testFault, testBarrier))
        {
            try { return transaction.Execute(Receive()); }
            catch (Exception e) { Emit(new { @event = "RESULT", state = "REJECTED", code = "PROTOCOL_INPUT", detail = e.Message }); return 1; }
        }
    }
}
