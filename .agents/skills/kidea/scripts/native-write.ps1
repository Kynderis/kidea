param(
    [ValidateSet('NONE','BEFORE_FIRST_WRITE','AFTER_PARTIAL_WRITE','AFTER_PARTIAL_WRITE_SECOND','SAFETY_LOSS_AFTER_PARTIAL_WRITE','CREATE_POSTOPEN_FAILURE','PENDING_POSTOPEN_FAILURE','AFTER_CREATE','AFTER_VERIFY','RESTORE_FAILURE','JOURNAL_FAILURE','RETIRE_FAILURE','CLEANUP_AFTER_FIRST_DELETE','CLEANUP_DELETE_FAILURE','CLEANUP_RECEIPT_FAILURE')]
    [string]$TestFault = 'NONE',
    [ValidateSet('NONE','LOCKS_ACQUIRED','PENDING_CREATED','PREPARED','BEFORE_FIRST_WRITE','AFTER_PARTIAL_WRITE','AFTER_CREATE','AFTER_VERIFY','BEFORE_RESTORE','BEFORE_RETIRE','CLEANUP_BEFORE_DELETE','CLEANUP_AFTER_FIRST_DELETE')]
    [string]$TestBarrier = 'NONE'
)
# Internal, trusted-caller primitive. No public CLI action imports this script.
# No privilege adjustment, process termination, install, ACL or user-setting change.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
[Console]::InputEncoding = [Text.UTF8Encoding]::new($false, $true)
[Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
try {
    if (-not $IsWindows -or $PSVersionTable.PSVersion.Major -lt 7) { throw 'UNSUPPORTED_HOST' }
    Add-Type -Path (Join-Path $PSScriptRoot 'native-write.cs')
    exit [KideaNativeWrite]::Run($TestFault, $TestBarrier)
}
catch {
    $failure = $_.Exception
    while ($null -ne $failure.InnerException) { $failure = $failure.InnerException }
    [Console]::Out.WriteLine((@{ event = 'RESULT'; state = 'REJECTED'; code = 'WORKER_START_FAILED'; detail = $failure.Message } | ConvertTo-Json -Compress))
    [Console]::Out.Flush()
    exit 1
}
