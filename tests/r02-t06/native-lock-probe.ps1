param([Parameter(Mandatory = $true)][string]$RequestPath)
# Synthetic probe only. No public helper integration, install, cleanup or privilege change.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Add-Type -Path (Join-Path $PSScriptRoot 'native-lock-probe.cs')

function Emit($Value) {
    [Console]::Out.WriteLine(($Value | ConvertTo-Json -Compress -Depth 12))
    [Console]::Out.Flush()
}

$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$allowed = [IO.Path]::GetFullPath((Join-Path $repo '.test-output/r02-t06'))
function Assert-FixturePath([string]$Value) {
    if (-not [IO.Path]::IsPathFullyQualified($Value) -or $Value.StartsWith('\\') -or $Value.Substring(2).Contains(':')) {
        throw 'FIXTURE_PATH_REQUIRED'
    }
    $full = [IO.Path]::GetFullPath($Value)
    if (-not $full.StartsWith($allowed + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'OUTSIDE_FIXTURE_AREA'
    }
    return $full
}

# All payload paths are confined to fresh test directories. This lexical guard is
# not the production safe-path algorithm; holder verification checks handle identity.
$requestFile = Assert-FixturePath $RequestPath
$request = Get-Content -LiteralPath $requestFile -Raw | ConvertFrom-Json -AsHashtable
$handles = [Collections.Generic.List[Microsoft.Win32.SafeHandles.SafeFileHandle]]::new()
$heldPaths = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$observed = [Collections.Generic.List[object]]::new()

function Protect-Parents([string]$Target) {
    $parent = [IO.Directory]::GetParent($Target)
    $chain = [Collections.Generic.List[string]]::new()
    while ($null -ne $parent) { $chain.Add($parent.FullName); $parent = $parent.Parent }
    $chain.Reverse()
    foreach ($directory in $chain) {
        if ($heldPaths.Add($directory)) {
            # BACKUP_SEMANTICS is required to open directories; no backup/restore privilege is enabled.
            $handle = [NativeLockProbe]::Open($directory, 0, 3, 3, $true)
            $handles.Add($handle)
            $metadata = [NativeLockProbe]::Inspect($handle)
            $observed.Add(@{ path = $directory; kind = 'directory'; metadata = $metadata })
            [NativeLockProbe]::CheckPathIdentity($handle, $directory, $true)
        }
    }
}

try {
    $drive = [IO.DriveInfo]::new('D:\')
    if ($drive.DriveType -ne [IO.DriveType]::Fixed -or $drive.DriveFormat -ne 'NTFS') { throw 'FIXED_NTFS_REQUIRED' }
    switch ($request.action) {
        'hold' {
            foreach ($item in $request.items) {
                $target = Assert-FixturePath $item.path
                Protect-Parents $target
                switch ($item.kind) {
                    'target' { $access = [NativeLockProbe]::Read -bor [NativeLockProbe]::Write; $share = 0; $directory = $false }
                    'target-delete' { $access = [NativeLockProbe]::Read -bor [NativeLockProbe]::Write -bor [NativeLockProbe]::Delete; $share = 0; $directory = $false }
                    'input' { $access = [NativeLockProbe]::Read; $share = 1; $directory = $false }
                    'input-delete' { $access = [NativeLockProbe]::Read -bor [NativeLockProbe]::Delete; $share = 1; $directory = $false }
                    'existing-writer' { $access = [NativeLockProbe]::Write; $share = 7; $directory = $false }
                    'directory' { $access = 0; $share = 3; $directory = $true }
                    'directory-deny-write' { $access = 0; $share = 1; $directory = $true }
                    default { throw 'UNKNOWN_HOLDER_KIND' }
                }
                $handle = [NativeLockProbe]::Open($target, $access, $share, 3, $directory)
                $handles.Add($handle)
                $metadata = [NativeLockProbe]::Inspect($handle)
                $observed.Add(@{ path = $target; kind = $item.kind; metadata = $metadata })
                [NativeLockProbe]::CheckPathIdentity($handle, $target, $directory)
            }
            $releaseFile = Assert-FixturePath $request.releaseFile
            Emit @{ event = 'ready'; pid = $PID; observed = $observed.ToArray(); powershell = $PSVersionTable.PSVersion.ToString() }
            $watch = [Diagnostics.Stopwatch]::StartNew()
            while (-not [IO.File]::Exists($releaseFile)) {
                if ($watch.Elapsed.TotalSeconds -ge 25) { throw 'HOLDER_TIMEOUT' }
                Start-Sleep -Milliseconds 40
            }
            $final = @($handles | ForEach-Object { [NativeLockProbe]::Inspect($_) })
            Emit @{ event = 'released'; pid = $PID; metadata = $final }
        }
        'attempt' {
            $results = foreach ($item in $request.items) {
                $target = Assert-FixturePath $item.path
                $other = if ($item.ContainsKey('other')) { Assert-FixturePath $item.other } else { $null }
                [NativeLockProbe]::Attempt($item.operation, $target, $other)
            }
            Emit @{ event = 'results'; pid = $PID; results = @($results) }
        }
        default { throw 'UNKNOWN_PROBE_ACTION' }
    }
}
catch {
    $exception = $_.Exception
    while ($null -ne $exception.InnerException) { $exception = $exception.InnerException }
    $code = if ($exception -is [ComponentModel.Win32Exception]) { $exception.NativeErrorCode } else { $null }
    Emit @{ event = 'error'; pid = $PID; error = $code; message = $exception.Message; observed = $observed.ToArray() }
    exit 1
}
finally {
    for ($index = $handles.Count - 1; $index -ge 0; $index--) { $handles[$index].Dispose() }
}
