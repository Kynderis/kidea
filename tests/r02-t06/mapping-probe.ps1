param([Parameter(Mandatory = $true)][string]$RequestPath)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
Add-Type -Path (Join-Path $PSScriptRoot 'mapping-probe.cs')
$request = Get-Content -LiteralPath $RequestPath -Raw | ConvertFrom-Json
$probe = $null
function Emit($value) {
    $value.pid = $PID
    $value.at = [DateTime]::UtcNow.ToString('o')
    [Console]::WriteLine(($value | ConvertTo-Json -Compress -Depth 8))
    [Console]::Out.Flush()
}
try {
    if ($request.role -eq 'mapper') {
        $probe = [WritableMappingProbe]::new($request.path, [bool]$request.closeOriginalHandles)
        Emit @{ event = 'ready'; role = 'mapper'; originalHandlesClosed = $probe.OriginalHandlesClosed; prefix = $probe.ReadPrefix() }
    } elseif ($request.role -eq 'lease') {
        $probe = [MappedLeaseProbe]::new($request.path, ($request.leaseRole -eq 'input'), [uint32]$request.level)
        Emit @{ event = 'ready'; role = 'lease'; opened = $probe.Opened; openError = $probe.OpenError;
            oplockRequested = $probe.OplockRequested; oplockGranted = $probe.OplockGranted;
            oplockError = $probe.OplockError; prefix = $probe.ReadPrefix(); oplockSignaled = $probe.OplockSignaled() }
    } else { throw 'Unknown probe role' }
    while ($null -ne ($line = [Console]::ReadLine())) {
        $command = $line | ConvertFrom-Json
        if ($command.action -eq 'release') { break }
        if ($command.action -eq 'write' -and $request.role -eq 'mapper') {
            Emit @{ event = 'written'; prefix = $probe.WritePrefix($command.text) }
        } elseif ($command.action -eq 'read' -and $request.role -eq 'lease') {
            Emit @{ event = 'read'; prefix = $probe.ReadPrefix(); oplockSignaled = $probe.OplockSignaled() }
        } else { throw 'Unknown command' }
    }
    $probe.Dispose(); $probe = $null
    Emit @{ event = 'released' }
} catch {
    Emit @{ event = 'error'; message = $_.Exception.ToString() }
    exit 1
} finally {
    if ($null -ne $probe) { $probe.Dispose() }
}
