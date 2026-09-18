# T05 updates runtime evidence

This harness validates the local pilot, not a generated application's production
deployment. The pilot is a separate local checkout; cloning Kidea does not create
it. Follow `docs/MAC_HANDOFF.md` and the applicable R09 execution authority before
running workloads. Use Node.js 24 or later; the installed binary's exact patch is
evidence, not a Kidea requirement. Docker is local, images already exist, and no
host ports or trust-store changes are needed.

## Backend and sanitizer component

The pilot's `scripts/t05/build.sh` extends the complete T02 build. It retains all
old CTest, HTTP, session and shutdown checks and adds updates units/tidy. Every
product source change requires a new frozen manifest and complete four-preset
build; an interrupted attempt is never resumed into a PASS evidence directory.
The previously accepted SQLite/WAL TSan exception remains limited to its old
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

Live public/admin lists and the standalone `/me` page are not implemented by this
slice. Full T05 matrix, monitoring/backup/readiness, workload measurements,
independent restore and later R09 gates remain pending. Only public Kidea helpers
write `.kidea`; a DRAFT source review is not a new Human approval or DONE result.
