# T05 updates runtime evidence

This harness validates the local pilot, not a generated application's production
deployment. The pilot is a separate local checkout; cloning Kidea does not create
it. Follow `docs/MAC_HANDOFF.md` and the applicable R09 execution authority before
running workloads. Use Node.js 24 or later; the installed binary's exact patch is
evidence, not a Kidea requirement. Docker is local, images already exist, and no
host ports or trust-store changes are needed.

## Backend and sanitizer component

The pilot's `scripts/t05/build.sh` extends the complete T02 build. It retains all
old CTest, HTTP, session and shutdown checks and adds updates units/tidy. Every change within the compiled backend source closure requires a new
frozen manifest and complete four-preset build; an interrupted attempt is never resumed into a PASS evidence directory.
A Web-only change can reuse that exact artifact only after verifying the whole
compiled source closure unchanged; it needs a new frozen Web/integration manifest
and complete Web checks. The previously accepted SQLite/WAL TSan exception remains limited to its old
classification. New updates units and transport component paths have no waiver.

`t05-socket-run.mjs <complete-backend-run> <new-evidence-directory>` binds source
closure, binary hashes and three harness files. Each preset runs the real backend
and HTTP-upgraded sockets in a fresh owned container, without network, root or
host ports. The component validates privacy, authorization, subscription barrier,
register/cancel snapshots, heartbeat, invalid command and shutdown with active
sockets. It flushes backend logs before strict sanitizer inspection. Loopback
component checks do not prove TLS, Chrome, throughput or independent recovery.

Initial snapshots may repeat under the at-least-once protocol. A positive barrier
and the order and canonical content of **every** initial snapshot must hold;
exactly-one delivery is not the contract. The original timeout and diagnostic
rerun are retained. The timeout's cause was not directly observed in raw frames.

## Real HTTPS integration

`t03-integration/prepare.mjs <new-manifest-file> <complete-backend-run>` freezes
the release binary, tools, entire plan, Web source/build/dependencies and fixtures.
`t03-integration/run.mjs <manifest> <whole-manifest-sha256>` verifies those bytes
before and after execution. Do not edit bound source or plan files during a run.
Never overwrite a manifest or reuse an attempt's result directory.

The existing application/admin checks remain. Initial U/V stale-observation
mutation fixtures intentionally close WSS; the new updates contexts and raw
socket connections are not intercepted. One retained admin case injects a
contradictory HTTP GET. Results identify these fixtures separately from real
backend replies. The real updates checks use Caddy HTTPS and native TLS WSS,
without ignoring TLS errors. FAKE sessions and owned SQLite data are disposable.

Completed old fixture pages are closed before the quota phase. Explicit pauses
between rapid quota navigations keep this functional sequence within the
unchanged HTTP caller budget (20/s, burst40). There are no hidden API retries or
changed success assertions. Separate injected session HTTP429/503 cases require
read-only recovery and zero browser POSTs. Admin temporary failures hide/inert
the retained form, preserve its draft and reveal it only after the same identity
is verified; actual role/actor/epoch loss destroys the form. Raw response records
distinguish injected errors from the actual 429 retained in integration r3.

The added controls only pause/unpause the owned app or revoke/restore fixed FAKE
actors V/A. Pause proves loss of signals and local staleness, not necessarily TCP
reconnection. A separate native-browser socket close proves actual reconnect and
SUBSCRIBE-before-GET ordering. Both assert zero browser mutation replay. Fixture completion uses immutable
per-sequence receipts with SHA-256 framing, exact action/id/schema checks and the
original bounded deadline. Partial shared-filesystem reads remain pending and
are retained as observations; a malformed complete receipt fails the run.
`t05-control-receipt.test.mjs` validates truncation, corruption and mismatched
acknowledgements. Exact
socket quotas and a no-ACK reader are functional limits; they are not an RSS,
latency-percentile or workload certification. Separate durable no-op intent
result lookups while all 128 sockets are admitted and while one reader exhausts
its eight-frame credit check that the writer still completes; these functional
probes do not measure throughput, queue occupancy or process RSS. Abusive ACK flooding may violate
receipt ordering and is not isolated evidence of the frame-rate threshold.

Retain the whole result, raw logs, frames, control receipts and screenshots via
`t04/collect-integration.py <run-output> <evidence-directory>`. The collector is
CREATE-only for its `run/` destination. It excludes disposable CA private keys
and browser execution profiles. Keep FAIL attempts byte-for-byte. Inspect new
screenshots directly before claiming visual acceptance.

## Scope still open

Live public/admin lists and standalone `/me` now use audience-specific WSS and
SUBSCRIBE-before-reconcile-GET. New collection helpers validate identity/epoch
and atomic snapshots; private history retains cancellation high-water against
older GET and hides on temporary session failure, clearing on actual loss.
An empty anonymous public list has no epoch metadata: bounded read-only HTTP
bootstrap waits for a real epoch before connecting WSS; it stays UNKNOWN.
The new real collection mutation/revocation checks are distinct from the
explicitly injected old private GET and session503. Native SSR API fixtures
forward hydrated reads and drain route callbacks before context close.
All old integration checks remain; final pages slice has93 units,18 native SSR
Chrome and62 real HTTPS/WSS checks.
Full T05 matrix, monitoring/backup/readiness, workload measurements,
independent restore and later R09 gates remain pending. Only public Kidea helpers
write `.kidea`; a DRAFT source review is not a new Human approval or DONE result.

## Source matrix and durable administration audit

The matrix suite retains the preceding62 real integration checks and adds9
functional groups. It exercises three states × four UI fields, all9 STATE cells,
unknown-state/field rejection, distinct authoritative IDs for duplicate titles,
committed EDIT/STATE response loss and GET-only reconciliation, and the exact
C10,N9→C9 registration-winning race. Only response loss and race timing are
controlled; backend commits and domain results are real. An explicit1100ms
pause between independent UI field actions keeps this functional suite separate
from offered-load WQ; HTTP20/s burst40 and success/error oracles are unchanged.

After every owned container/network is cleaned, matrix-audit.py opens the
durable fake fixture SQLite database read-only. Runner PASS also requires one
result/audit per observed intent, exact field deltas, no changes/events for
rejection/no-op/GET, contiguous durable versions/outbox and capacity invariants.
This is post-shutdown audit, not crash/restore or independent host survival.

The source-preserving audit-coverage.py takes Kidea root, pilot root, completed
integration evidence directory and a CREATE-only output directory. It checks
all137 original IDs/source hashes/expected text and actual proof selectors,
records missing clauses individually, retains the4Max2 amendment cases
separately and leaves the compiled original T02 ledger unchanged. Component
PASS, covered functional row, partial and NOT_RUN are distinct; this ledger
does not close G2, impacts or Human acceptance.

## Administration response loss, double clicks and both race orders

The fault/concurrency extension retains all71 preceding HTTPS/WSS checks and
adds6 functional groups. It holds the tenth participant POST until the C10,N9
capacity reduction commits; the real backend must then return FULL and preserve
C9,N9 without a version/outbox increment for that rejection. The preceding
registration-winning C10,N10 case remains unchanged.

Separately dropped EDIT and CREATE requests never reach the backend. Two reloads
and exact-intent GETs must return the real202/stateUNKNOWN, keep controls blocked
and issue no replacement POST. CREATE also forbids a title/collection lookup or
an invented server ID. Two real pointer clicks during the held request interval
exercise CREATE/EDIT/STATE; each requires one POST, one durable audit/result and
exactly one version change. Only request drop/hold/order is controlled; domain
results, writes and the post-shutdown SQL audit are real.

The initial raw protocol-field assertion error belongs to the test harness:
backend responses use `state`, not `finality`. Keep that FAIL and its frozen plan;
correct the reader against the existing contract, retain all safety oracles and
run the complete suite again. Snapshot comparisons bind authoritative fields,
excluding observation timestamps; this does not relax version/data assertions.
The current coverage audit requires these new proof selectors and durable SQL
checks before assessing AD-T04/AR-T06 as covered functional rows. Its old version
remains in historical evidence; AD-T08 and the rest of the missing variants are
not automatically promoted. No monitoring, workload or crash/restore acceptance
is inferred from this extension. Application and Kidea runtime source changes
remain distinct from harness fixes and additional execution evidence.
