# R02-T06-S02 — Native lock feasibility probe

Observed on 2026-09-14. This is an isolated prerequisite probe on synthetic files,
not a production writer, completion of S02, approval, or an all-races guarantee.

**Result: the current candidate does not establish the required path/namespace
protection. Latest run: 11 tests, 7 PASS, 4 FAIL, exit 1. Do not integrate it into
the Kidea writer.** The failures are retained as counterexamples, not changed to
successful acceptance expectations.

## Runtime and scope

- Node: `D:\Code\kynderis\kidea\.tools\node-v24.21.0-win-x64\node.exe`,
  reported `v24.21.0`.
- PowerShell: `C:\Users\vuhoa\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\powershell\pwsh.exe`,
  reported `7.6.5`; `-NoLogo -NoProfile -NonInteractive -File`.
- PowerShell SHA-256:
  `362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139`.
  Verified before development and by the Node harness before each run.
- D: was read back as `Fixed / NTFS`. Post-run token check returned
  `IsInRole(Administrator) = False`. Children inherit the caller token; the probe
  does not enable privileges, request elevation, change ACLs, install anything,
  access production, or call external services. Microsoft documentation was
  read separately.
- Source changes are limited to this `tests/r02-t06/` directory. No change to
  SKILL, the public helper, status, package commands, or project records.
- All mutation targets, link targets, request files and output files generated
  by the harness are inside fresh `mkdtemp` directories under
  `D:\Code\kynderis\kidea\.test-output\r02-t06\`.
- Holder parent verification also opens metadata handles on the ancestor chain
  through `D:\` (desired access 0, share READ|WRITE, no share DELETE). These
  ancestors are not written, renamed or deleted by the probe.
- Each holder waits at most 25 seconds for its release signal. Node terminates
  its own child at 35 seconds if necessary; test timeout is 50 seconds. Children
  use `windowsHide: true`. No recursive deletion or cleanup was performed.
- Positive-control DeleteFile/MoveFileEx/ReplaceFile calls intentionally
  delete/rename/replace only their newly created synthetic targets after release.
  Raw request/result files and remaining fixtures are retained.

## Reproduction and fixed inputs

From `D:\Code\kynderis\kidea`:

```powershell
& '.tools/node-v24.21.0-win-x64/node.exe' --test tests/r02-t06/native-lock.test.mjs
```

Latest run source hashes, independently rechecked after the run:

| File | SHA-256 |
|---|---|
| `native-lock-probe.ps1` | `f1cdee71853a5b660f7d118d06cdfaf1da9a40a70aec4f1a944437193ee73e02` |
| `native-lock-probe.cs` | `175303721b93cfd1da37356486d932d9d0c4b3f08d3433dad6de2b4b33bdde8d` |
| `native-lock.test.mjs` | `ea042002dff70c159f935fc05fa3ac7676fafa2baea3f2deeafc3a84be5acd8b` |

The harness verifies runtime hash, saves these source hashes and launches a
holder PowerShell process. It waits for the holder's `ready` JSON before starting
a different PowerShell contender process. Contender outcomes contain the actual
Win32 result/error; an expected rejected operation is not a child crash.

## Retained runs

| Run | Time UTC | Result | Raw files |
|---|---|---|---|
| First | 00:29:20–00:29:46 | 8 tests: 5 PASS / 3 FAIL; exit 1 | `.test-output/r02-t06/native-lock-cPhBLy/` |
| Latest | 00:32:24–00:33:06 | 11 tests: 7 PASS / 4 FAIL; exit 1; 42.324 s | `.test-output/r02-t06/native-lock-o3hnXx/` |

Each path is relative to `D:\Code\kynderis\kidea\`. Each run retains
`environment.json`, `completed.json`, `observations.json`, all `NNN-request.json`
and `NNN-result.json` files, and fixtures. Result files contain PID, process exit,
parsed events, raw stdout and raw stderr. First run has 18 child processes; latest
has 30. `completed.json` explicitly does not mean PASS. Test-run aggregate/assertion
output was returned by the terminal, not redirected to an extra raw runner log.

Two first-run failures were over-specific assertions: Windows rejected
MoveFileEx replacement and directory rename with error 5 (Access denied), not
32 (Sharing violation). The assertion now accepts those observed denial codes
and verifies the operations succeed after release. It still requires rejection
and unchanged bytes. The third first-run failure was a real hard-link namespace
counterexample; it remains a failing acceptance expectation below.

## Latest result matrix

Raw-file numbers below refer to `native-lock-o3hnXx`.

| Test | Result / actual observation | Raw evidence |
|---|---|---|
| Exclusive target: READ|WRITE, share 0 | PASS. Contender read-access open, write, delete, rename, MoveFileEx replacement and ReplaceFile all rejected. Target and incoming replacement bytes unchanged before positive controls; all six same operations succeed after holder release. | `001` holder PID 10628; `002` contender PID 21088; `003` unlocked positive controls |
| Input: READ, share READ | PASS. Compatible read-access open succeeds; write/delete/rename/exclusive target open rejected; bytes unchanged. | `004` holder PID 23608; `005` contender PID 19588 |
| Existing writer: WRITE, share READ|WRITE|DELETE | PASS. Even a permissive existing writer prevents the contender exclusive target lock and READ/share READ input acquisition. Bytes unchanged. | `006` holder; `007` exclusive attempt; `008` expected input-acquisition error 32/exit 1 |
| Held parent and ancestor directory rename | PASS. Both MoveFileEx directory renames rejected. After release, ancestor rename succeeds and child bytes remain unchanged. | `009` holder; `010` attempts; `011` unlocked positive control |
| CREATE_NEW | PASS. Occupied name returns error 80 without truncation; absent name is created; second CREATE_NEW returns 80 and leaves created bytes intact. | `012`, `013` |
| Existing hard-link pair | PASS. Metadata returns NumberOfLinks 2 and the same volume/file ID for both names. Holder rejects `MULTIPLE_LINKS_REJECTED`; both byte sequences unchanged. | `014` metadata; `015` expected rejection/exit 1 |
| Existing junction ancestor | PASS. No-follow directory metadata has reparse attribute. Holder rejects `REPARSE_POINT_REJECTED` before opening child; actual child bytes unchanged. | `016` metadata; `017` expected rejection/exit 1 |
| New hard link during baseline exclusive target lock | **FAIL.** CreateHardLinkW succeeds; live metadata reports NumberOfLinks 2. Write through new alias is rejected with 32, but MoveFileEx rename of the new alias succeeds. Original and renamed alias bytes are equal to the original fixture. | `018` holder PID 20676; `019` create/metadata PID 15976; `020` alias write/rename PID 24340 |
| Target with additional DELETE desired access | **FAIL.** READ|WRITE|DELETE/share 0 still permits CreateHardLinkW and live NumberOfLinks 2. Other listed target contenders remain rejected. No Delete/Rename is called through the owner's handle. | `021` holder PID 396; `022` contender PID 7856 |
| Input with additional DELETE desired access | **FAIL.** READ|DELETE/share READ still permits CreateHardLinkW and live NumberOfLinks 2. A reader sharing READ|WRITE|DELETE succeeds; a reader sharing only READ fails with 32. Write/delete/exclusive open stay rejected. | `023` holder PID 8084; `024` contender PID 9516 |
| Direct junction conversion while directory is held | **FAIL.** See the distinct empty/nonempty/share variants below. | `025`–`030` |

The read contender requests GENERIC_READ and inspects metadata from the opened
handle; it does not independently transfer file data with ReadFile. Byte checks
are performed by the Node harness when permitted or after holder release.

### Directory conversion details

The contender opens the fixture directory with GENERIC_WRITE and
FILE_FLAG_BACKUP_SEMANTICS|FILE_FLAG_OPEN_REPARSE_POINT, then sends
FSCTL_SET_REPARSE_POINT with a mount-point record aimed at another fixture
directory. No token privileges are changed. These are not symbolic-link
creation or directory rename tests.

| Holder/fixture | Actual result | Raw evidence |
|---|---|---|
| Empty directory; desired access 0, share READ|WRITE, no share DELETE | Conversion succeeds; contender and final owner-handle metadata report ReparsePoint true. The path still has the same text but its namespace meaning changed. | `025` holder PID 22860; `026` contender PID 1884 |
| Nonempty directory with a synthetic child; desired access 0, share READ|WRITE | Conversion fails with 145 (Directory not empty), not a sharing error; metadata remains non-reparse. This case does not prove the handle itself blocked conversion. | `027` holder PID 10864; `028` contender PID 21060 |
| Empty directory; desired access 0, share READ only | Conversion still succeeds; final owner-handle metadata changes to ReparsePoint true. Merely omitting share WRITE from this access-0 directory handle did not establish the desired protection. | `029` holder PID 16336; `030` contender PID 22752 |

The latest run's hard-link and directory assertions intentionally remain FAIL.
The report does not infer that all possible Windows mechanisms fail; only these
concrete candidates and this verified environment have been tested.

## Byte readback after the failed candidate tests

After all 30 child processes exited, an additional read-only check inspected
the remaining fixtures, including branches where the failing assertion prevented
later in-test byte assertions. Exact original strings were still present:

- `hardlink-during-6DW3Y8/source.txt` and
  `hardlink-during-6DW3Y8/aliases/new-link.txt-moved`:
  `ORIGINAL hardlink-during source.txt\r\n`.
- `target-delete-ulC0Rf/source.txt` and `target-delete-ulC0Rf/alias.txt`:
  `ORIGINAL target-delete source.txt\r\n`.
- `input-delete-8wn4ag/source.txt` and `input-delete-8wn4ag/alias.txt`:
  `ORIGINAL input-delete source.txt\r\n`.
- `junction-during-Mex1hs/destination/source.txt`:
  `ORIGINAL junction-during destination/source.txt\r\n`.
- `junction-during-Mex1hs/nonempty/original.txt`: `ORIGINAL CHILD\n`.

The namespace changed in the failing cases even though those byte sequences did
not. Unchanged bytes do not turn them into a successful safe-path proof.

## Limits and next boundary

- The PowerShell request guard is a fixture-area guard for this trusted harness,
  not a production authorization/path-validation API. Generic request reuse is
  not supported. The actual safety experiment is the native holder/contender
  behavior plus handle metadata verification.
- Existing reparse/multiple-link rejection is demonstrated. Stability of those
  conditions across later operations is **not** established by the tested locks.
- No checkpoint protocol, in-place update/restore worker, interrupted CREATE,
  recovery, status integration, or AI-session acceptance was implemented here.
- No claim is made about power loss, raw-disk/kernel/admin interference, network
  filesystems, sync folders, atomic multi-file writes, or every namespace race.
- Stop before integration. Changing/reworking the protection mechanism or its
  supported contract belongs to the owning task; do not replace it with a hash
  check, suppress these tests, or label the 7 passing probes as S02 completion.

## Primary API references checked

- [CreateFileW: access/share compatibility, CREATE_NEW, directory handles and reparse opening](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew).
- [GetFileInformationByHandle](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfileinformationbyhandle),
  [BY_HANDLE_FILE_INFORMATION: file identity and NumberOfLinks](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/ns-fileapi-by_handle_file_information),
  [GetFinalPathNameByHandleW](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-getfinalpathnamebyhandlew).
- [CreateHardLinkW: directory entries and per-file sharing](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-createhardlinkw).
- [MoveFileExW](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw),
  [ReplaceFileW](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-replacefilew).
- [FSCTL_SET_REPARSE_POINT](https://learn.microsoft.com/en-us/windows/win32/api/winioctl/ni-winioctl-fsctl_set_reparse_point),
  [REPARSE_DATA_BUFFER](https://learn.microsoft.com/en-us/windows-hardware/drivers/ddi/ntifs/ns-ntifs-_reparse_data_buffer).
