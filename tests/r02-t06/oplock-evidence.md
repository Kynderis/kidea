# R02-T06-S02 — Separate bounded oplock probe

**Observed 2026-09-14: 4 tests, 0 PASS / 4 FAIL, exit 1.** RWH on the target and
RH on an empty directory did not protect the tested hard-link/reparse namespace
changes, including an attributes-only handle opened before or after the oplock
was granted. This is a result for these candidates on the verified local host,
not a claim that every possible Windows protection mechanism is impossible.

The [share-mode probe and its original failures](native-lock-evidence.md) remain
unchanged. Nothing here is integrated into a public Kidea writer.

## Runtime, command and hashes

Same verified Node v24.21.0, PowerShell 7.6.5 and D: Fixed/NTFS environment as the
share-mode probe. The Node harness checks PowerShell SHA-256
`362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139` before running.
No elevation, ACL/token changes, installation, external application data or
service calls. Only synthetic paths under fresh `.test-output/r02-t06/oplock-*`
directories are mutated. This remains a trusted-fixture experiment, not a
production path-authorization API.

From `D:\Code\kynderis\kidea`:

```powershell
& '.tools/node-v24.21.0-win-x64/node.exe' --test tests/r02-t06/oplock.test.mjs
```

Source hashes recorded at run start and independently rechecked afterward:

| File | SHA-256 |
|---|---|
| `native-lock-probe.cs` (unchanged shared API primitives) | `175303721b93cfd1da37356486d932d9d0c4b3f08d3433dad6de2b4b33bdde8d` |
| `oplock-probe.cs` | `303840dff04dc2ae43db58a94d2e67893fcdfffda3379ea4d500f3885aed797d` |
| `oplock-probe.ps1` | `a888e3ce3dc29c896751cbf1ac72a4bbc3b97e0dd76b16c8710e83aeb239eca9` |
| `oplock.test.mjs` | `9c4eb02529c9c67d6a9512afc9e23b32aa7ba3989ebfc0650d1926d1b411a37e` |

## Raw evidence

One run only:
`D:\Code\kynderis\kidea\.test-output\r02-t06\oplock-Y1duu5\`.
Started `2026-09-14T00:43:37.651Z`; test duration `12.191 s`.

Retained `environment.json`, all `001`–`008` request/result JSON files, four
per-fixture `comparison.json` files, and synthetic files/junctions. Raw result
JSON contains PID, parsed events, raw stdout/stderr and child exit. All eight
children exited 0 with empty stderr; the four failures are the intended
protection assertions, not startup/compiler/timeouts. Aggregate test output was
returned by the terminal, not saved as an additional runner transcript.

## Experiment and results

The owner opens FILE_FLAG_OVERLAPPED and requests FSCTL_REQUEST_OPLOCK with input
structure version 1 and REQUEST flag. All four requests returned
ERROR_IO_PENDING (997), the documented indication that the request was granted.
Each owner initially observed a nonsignaled manual-reset event, Internal status
`0x103` (pending) and original namespace metadata. Only then was the contender
allowed to perform the operation.

Owner masks: target GENERIC_READ|GENERIC_WRITE, share 0, requested level RWH (7);
directory GENERIC_READ, share READ|WRITE but not DELETE, requested level RH (3).
The directory owner therefore differs from the earlier access-0 directory probe.

| Case | Result before any owner release/acknowledgement | Evidence |
|---|---|---|
| RWH target + CreateHardLinkW | **FAIL:** contender creates the new alias successfully; owner-handle metadata NumberOfLinks changes 1 → 2 while oplock event is still nonsignaled. | Holder `001`, PID 23108; contender `002`, PID 21096; `rwh-hardlink-x9Im1P/comparison.json` |
| RH empty directory + GENERIC_WRITE handle + FSCTL_SET_REPARSE_POINT | **FAIL:** directory converts to a junction successfully; owner metadata ReparsePoint changes false → true while event remains nonsignaled. | Holder `003`, PID 19804; contender `004`, PID 21508; `rh-junction-CSdyn5/comparison.json` |
| RH directory + FILE_WRITE_ATTRIBUTES-only handle opened before grant | **FAIL:** contender emits `armed` after opening the attributes handle; owner still receives grant 997; after the explicit start signal the pre-opened handle converts the directory to a junction before close. | Contender `005`, PID 23652; holder `006`, PID 4196; `rh-attributes-before-awc7hZ/comparison.json` |
| RH directory + FILE_WRITE_ATTRIBUTES-only handle opened after grant | **FAIL:** attributes-only open and junction conversion both succeed before close; owner metadata changes to ReparsePoint true without an observed break. | Holder `007`, PID 19856; contender `008`, PID 2488; `rh-attributes-after-DbGepx/comparison.json` |

The attributes-only access mask is `0x100`; its share mask is READ|WRITE|DELETE.
The native call uses a mount-point reparse record, not a symbolic-link privilege
request. Both junction endpoints are fixtures inside the same fresh case folder.

For example, RWH was granted at `00:43:39.5830416Z`. Hard-link creation completed
successfully at `00:43:41.0012362Z`; the controller did not create the release
signal until `00:43:41.125Z`; owner `before-close` at `00:43:41.1381710Z` still
showed event nonsignaled and NumberOfLinks 2. This is not merely an event being
delivered after an early owner acknowledgement: the owner sent no acknowledgement.

All cases completed the contender operation before the controller's 750 ms
pending-observation interval elapsed. The controller then requested owner close.
No `break` event was observed, and the immediate `before-close` observation was
still nonsignaled/pending in all four cases. After handle close, completion was
signaled in all four cases, before the unmanaged I/O buffers were freed.

## Bounded cleanup and bytes

- Owner/start-signal waits are limited to 20 seconds. The controller kills only
  its own child at 30 seconds if necessary; test timeout is 45 seconds.
- The only release/ack mechanism used is closing the owning handle. A manual-reset
  event and unmanaged input/output/OVERLAPPED buffers remain alive until completion;
  close waits at most 5 seconds. If completion is not established, allocations
  are retained until the bounded process exits instead of being reused early.
- No recursive deletion, fixture cleanup, additional API trials, full worker,
  status integration or AI session was performed.
- Per-case comparisons preserve post-run target/sentinel bytes. Readback also
  confirmed the created hard-link alias contains `OPLOCK ORIGINAL\r\n`, identical
  to its source. Destination sentinels remain `DESTINATION ORIGINAL\r\n`.
  Namespace mutations are still failures even though these bytes stayed intact.

## Interpretation and limits

The tested oplock mechanism did not even deliver a pre-close break for these
namespace mutations; it cannot currently be used as proof that the unsupported
hard-link/reparse conditions remain absent. Do not silently reinterpret this as
permission to write first and detect the race afterward.

The bounded trial does not verify a production acknowledgement state machine,
all oplock variants, combined directory trees, interruption/recovery, or every
Windows namespace operation. Stop before writer integration and return the
actual mechanism/support-contract decision to the owning task. Keep both this
failure suite and the share-mode counterexamples as evidence.

## Primary references read before implementation

- [FSCTL_REQUEST_OPLOCK: grant result, overlap requirement, directory R/RH limitations](https://learn.microsoft.com/en-us/windows/win32/api/winioctl/ni-winioctl-fsctl_request_oplock).
- [REQUEST_OPLOCK_INPUT_BUFFER](https://learn.microsoft.com/en-us/windows/win32/api/winioctl/ns-winioctl-request_oplock_input_buffer),
  [REQUEST_OPLOCK_OUTPUT_BUFFER](https://learn.microsoft.com/en-us/windows/win32/api/winioctl/ns-winioctl-request_oplock_output_buffer).
- [OVERLAPPED](https://learn.microsoft.com/en-us/windows/win32/api/minwinbase/ns-minwinbase-overlapped),
  [GetOverlappedResult](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-getoverlappedresult),
  [CancelIoEx: cancellation is not completion](https://learn.microsoft.com/en-us/windows/win32/api/ioapiset/nf-ioapiset-cancelioex).
- [MS-FSA FSCTL_SET_REPARSE_POINT: WRITE_DATA or WRITE_ATTRIBUTES access](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-fsa/4aeefef8-92c3-4abc-af7a-a610caf8a165).
- [MS-FSA FileLinkInformation: link creation and destination-directory oplock check](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-fsa/891bb8eb-89f8-46ca-80b7-9f5d4e8b5583).
