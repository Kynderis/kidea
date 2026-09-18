# Observer — R09-T05 component r1

Read-only Node.js observer and independent fallback screen for the workshop lab.
This slice implements OP-r1 signal decoding, freshness, incident persistence,
coalescing/recovery/reminders, TLS collection/probes and a private fallback UI.
It does **not** implement backend telemetry, authoritative admission/readiness,
verified backup production/receipt, restore, WQ or a Human on-call window.
`writeReady` is deliberately false until that backend wiring exists.

All current source inputs are explicitly synthetic fixtures. Mac Intel unit
checks and Linux Docker Chromium/TLS/process-fault checks are component evidence;
they do not certify the full OP-T01–15, the primary SvelteKit W5, E1 timing,
Apple Silicon, closing the AI session or losing the whole backend host.
Containers on this Mac do not provide the independent failure domain of AR/OP.

## Run and state ownership

Use a trusted installed Node.js >=24. Runtime dependencies are Node built-ins;
`npm ci --offline --ignore-scripts` validates the zero-dependency lockfile.
`npm test` requires an existing trusted absolute `WORKSHOP_TEST_OPENSSL` path
solely to create temporary test TLS certificates. `npm run lint` reuses the
pilot Web's existing locked ESLint dev dependency; install neither tools nor
unlocked dependencies. Tests need an owned private temporary directory.

The entrypoint is `node src/main.mjs <private-operator-profile.json>`, from this
folder. It requires a normal account, an owned private local state directory,
private operator sessions/key/collector-header files and a provisioned TLS
certificate/CA. No automatic login, trust-store install, ACME, host service,
cloud allocation, profile creation or product window approval is performed.
No usable operator/collector credential or production profile ships here.
Listener and collector endpoints come only from the operator-provided profile;
collector requests are GET with absolute2s deadline, bounded64KiB body, verified
HTTPS and no redirect following. The fallback requires a live server-owned
admin session on every read; client role/actor headers grant no authority.

State directory mode0700 and files0600, owned by the running UID. Reject
symlinks, public/foreign state, corruption, config drift, active locks and
oversized checkpoints without overwriting/resetting/deleting evidence. Snapshot
writes use a unique temp, file fsync, rename and directory fsync before publish.
A proven dead owned local PID lock may be reclaimed; an active/reused PID or
another hostname fails closed. Namespace/container migration needs an explicit
owned-runtime reconciliation, not blind lock removal. No retention purge exists.

Docker Desktop reports a host-precreated bind directory as UID0 in this lab.
Provision the private child **inside the bind mount with the normal container
account**, then verify its actual UID/mode. Do not weaken the ownership guard,
chmod the private data public or use root/chown as a workaround. The test
manager creates `/state/private`; source/key/session files keep their normal UID.

The profile has `model` (run/window, fast/slow source clocks, required storage
names and independently verified topology), private file paths, a nonprivileged
TLS bind/port, state directory and the four fixed collector targets. `run` is
operator input; a true fixture flag is not real Human approval. Unconfirmed or
expired windows do not start collection. The process lifetime is bounded by
the profile window and4h maximum. The manager in Kidea tests is fixture-only;
no STOP/RESTART/replay/delete/ack/mute/restore HTTP control is exposed.

## Signal contract and safety

Each fast/slow HTTPS response echoes a fresh per-request nonce and contains
schema1, configured source ID, boot, increasing sequence, true sample wall time
and the complete group's signals. Fast=M1/M2/M3/M4/M7 every2s; slow=M8/M9
 every30s. M5 is last valid observation; M6 probes application/dashboard every5s
with2s timeout. Missing samples after5s/60s remain UNKNOWN with last values.
HTTP200, last processing success, malformed/duplicate/old/future samples and
permission loss cannot refresh the heartbeat. Source restarts retire old boots;
observer restart retains incidents/notifications but resets freshness and good
sample streaks. Clock profile offset/uncertainty/calibration is mandatory;
source age uses conservative uncertainty and local monotonic elapsed time.
The same-kernel fixture clock is not cross-host/E1 calibration.

M1 empty age is N/A; >5s warning, >=30s critical. M2 open standardized error
codes are persistent; invariant/version/permission errors critical immediately.
Closing M2 requires explicit reconciliation resolution and valid recovery
samples. M3/M7 accept only a declared single-observer measurement basis and
60s window with sample count; empty measured samples are N/A, unmeasured is
UNKNOWN. M7 includes all scheduled samples/errors/missed offers. It cannot
certify the full WQ run. M8 covers every configured data/log/backup/temp target,
counts2GiB in total, warns at80%, critical at limit or insufficient headroom;
missing targets do not become a complete total. Real profile headroom and
resource measurements remain to be fixed/verified before product readiness.
M9 verified/independent/durable/integrity/hash/coverage-point metadata must come
from a real backup receipt implementation; the current synthetic marker does
not verify a database or destination. Age>10min warns, >15min/unverified critical.

Recovery uses three distinct observations at the source cadence for M1–M7;
M8/M9 use two30s samples below the recovery thresholds. Missing/unmeasured
samples/restart reset streaks. Group by code/component/run; new/escalated
incidents notify, unresolved critical incidents remind each5min, no per-poll
spam. Critical known incidents remain visible even with UNKNOWN sources or
storage failure. History never claims delivered; delivery is measured only at
the receiver. Browser loss of observer heartbeat >5s shows UNKNOWN, retaining
known critical;403 clears private view and initial data and fences late replies.

Routes: GET/HEAD `/operations`, `/api/observation`, `/health/observer` for authorized
admin only. Private no-store/noindex/CSP, escaped SSR, keyboard refresh and text
size200% at360/1280px are component-tested. Health LIVE is not READ_READY or
WRITE_READY. Eligibility explains missing topology/receiver/data/backend wiring;
it never opens mutation admission or changes workshop/registration outcomes.

Next: real C++ metric/error sources, primary W5 wiring, backup/watermark/receipt,
backend admission and lifecycle checks. Independent-host/E1/WQ/release/Human
PROD exercises remain separate gates under Kidea's current authority.
