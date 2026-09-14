param([Parameter(Mandatory = $true)][string]$RequestPath)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
Add-Type -Path @((Join-Path $PSScriptRoot 'native-lock-probe.cs'), (Join-Path $PSScriptRoot 'oplock-probe.cs'))
$repo = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$allowed = [IO.Path]::GetFullPath((Join-Path $repo '.test-output/r02-t06'))
function FixturePath([string]$Value) {
    if (-not [IO.Path]::IsPathFullyQualified($Value) -or $Value.StartsWith('\\') -or $Value.Substring(2).Contains(':')) { throw 'FIXTURE_PATH_REQUIRED' }
    $full = [IO.Path]::GetFullPath($Value)
    if (-not $full.StartsWith($allowed + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'OUTSIDE_FIXTURE_AREA' }
    return $full
}
function Emit($Value) {
    $Value.pid = $PID; $Value.time = [DateTime]::UtcNow.ToString('O')
    [Console]::Out.WriteLine(($Value | ConvertTo-Json -Compress -Depth 10)); [Console]::Out.Flush()
}
$request = Get-Content -LiteralPath (FixturePath $RequestPath) -Raw | ConvertFrom-Json -AsHashtable
$target = FixturePath $request.path
$owner = $null; $attributeHandle = $null
try {
    $drive = [IO.DriveInfo]::new('D:\')
    if ($drive.DriveType -ne [IO.DriveType]::Fixed -or $drive.DriveFormat -ne 'NTFS') { throw 'FIXED_NTFS_REQUIRED' }
    if ($request.action -eq 'owner') {
        $release = FixturePath $request.releaseFile
        $owner = [OplockProbe]::new($target, [bool]$request.directory)
        Emit @{ event = 'ready'; grantError = $owner.GrantError; requestedLevel = $(if ($request.directory) { 'RH' } else { 'RWH' }); state = $owner.Observe() }
        $timer = [Diagnostics.Stopwatch]::StartNew(); $reported = $false
        while (-not [IO.File]::Exists($release)) {
            if ($timer.Elapsed.TotalSeconds -ge 20) { throw 'OWNER_TIMEOUT' }
            $state = $owner.Observe()
            if ($state.Signaled -and -not $reported) { Emit @{ event = 'break'; state = $state }; $reported = $true }
            Start-Sleep -Milliseconds 20
        }
        Emit @{ event = 'before-close'; state = $owner.Observe() }
        $owner.Dispose()
        Emit @{ event = 'closed'; completionSignaled = $owner.CloseCompletionSignaled }
    } elseif ($request.action -eq 'contender') {
        $other = FixturePath $request.other
        if ($request.operation -eq 'attributes-before') {
            $attributeHandle = [OplockProbe]::OpenAttributes($target)
            Emit @{ event = 'armed'; metadata = [NativeLockProbe]::Inspect($attributeHandle) }
            $start = FixturePath $request.startFile; $timer = [Diagnostics.Stopwatch]::StartNew()
            while (-not [IO.File]::Exists($start)) {
                if ($timer.Elapsed.TotalSeconds -ge 20) { throw 'CONTENDER_START_TIMEOUT' }
                Start-Sleep -Milliseconds 20
            }
        }
        Emit @{ event = 'started'; operation = $request.operation }
        if ($request.operation -in @('attributes-before', 'attributes-after')) {
            if ($null -eq $attributeHandle) { $attributeHandle = [OplockProbe]::OpenAttributes($target) }
            $result = [OplockProbe]::SetJunctionOnAttributeHandle($attributeHandle, $other)
        } else { $result = [NativeLockProbe]::Attempt($request.operation, $target, $other) }
        Emit @{ event = 'completed'; result = $result }
    } else { throw 'UNKNOWN_OPLOCK_ACTION' }
} catch {
    $exception = $_.Exception
    while ($null -ne $exception.InnerException) { $exception = $exception.InnerException }
    Emit @{ event = 'error'; message = $exception.Message }
    exit 1
} finally {
    if ($null -ne $owner) { $owner.Dispose() }
    if ($null -ne $attributeHandle) { $attributeHandle.Dispose() }
}
