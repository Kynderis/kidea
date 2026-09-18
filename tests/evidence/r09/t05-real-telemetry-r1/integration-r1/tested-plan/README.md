# Real T03 integration lab

## Additive T05 real telemetry checks

The current runner retains all 132 prior browser checks and the 22-check SQL audit. It additionally runs `operations-browser.mjs` against the real release C++ backend and built primary SvelteKit `/operations` page, then a separate five-check read-only `operations-audit.py`. Preparing or running this harness is not evidence of PASS; use the immutable manifest and completed result for each attempt.

The added source is partial M1/M2/M4 telemetry. It checks the total durable pending count, conservative age bounds, actual processing identity, durable dispatcher/capacity errors, private admin reads, source loss, stale samples, revocation and late responses. M3/M5/M6/M7/M8/M9 remain explicitly UNKNOWN and writeReady is false. It does not certify the fallback observer, whole M2 error coverage, backup, readiness, oncall, host survival, E1 or WQ.

`OPS_FAULT_INVARIANT` and `OPS_REPAIR_INVARIANT` are exact scoped controls in this run's newly created fake SQLite database. The former temporarily removes the original capacity trigger and adds eleven marked registrations only to the newly created `OPS telemetry authority fixture`. The real dispatcher must detect the invalid authority and persist INVARIANT. The latter verifies/removes exactly those eleven rows and restores the original trigger SQL. Ordinary processing must not clear the durable critical incident. No existing pilot database or product data is changed. Source loss/stale HTTP responses and BFCache lifecycle events are explicitly injected; cookie changes and session revocation use actual lab sessions. The BFCache event test does not prove a real browser history cache round trip.

The supplemental browser also captures 360px, 1280px, text200% and critical-state screenshots, and verifies keyboard focus and no horizontal overflow. The dashboard may only GET; it has no replay, readiness or incident-clear endpoint. A separate native Mac Chrome server suite uses an explicitly fake API and must not be presented as this real backend/TLS integration.

## Existing T03 lab contract

Prepared under full R09 execution authority. This is a private DEV test, not a release attempt or PROD-role run. All data and sessions are fake.

`prepare.mjs OUTPUT BACKEND_RUN_DIRECTORY` requires completed final backend evidence, then freezes exact release binary, schema/seed, tool binaries, all runner files and Web build/dependencies/source. `run.mjs MANIFEST SHA256` verifies the frozen closure before starting and after testing. The output directory is CREATE-only with a UUID. Do not reuse or overwrite a consumed manifest/output after fixing a failure; prepare a new manifest and retain the old result.

Three existing Linux amd64 images/containers serve backend plus Node Web, Caddy TLS and Playwright Chromium. The Docker network is internal, with no host port mapping or download. Bind mounts are read-only except each role's own output and the fake fixture directory; roots are read-only, uid1000, capabilities dropped, no-new-privileges. Each container has at most2CPU/4GiB, bounded tmpfs/PIDs/logs and a20-minute timeout. The runner is bounded to30minutes with2GiB reserved within the unchanged cumulative20GiB/100GiB-free R09 budget. Cleanup verifies owner labels and removes only this run's containers/network. Raw logs, fake DB and test output remain locally; do not publish the generated CA private key.

Caddy issues a certificate for workshop.test under a run-local CA. Only its public root certificate is copied to the browser fixture. `certutil` trusts it in a new container-local NSS directory; Node uses NODE_EXTRA_CA_CERTS. No host trust changes or TLS bypass. This checks Chromium/Linux HTTPS; the separate T03 evidence covers real Chrome/macOS UI.

The browser sends real user mutations through Caddy to C++. Only the lost-response test intercepts one response: it first forwards the real POST and verifies the committed result, then drops the reply. Reload must query the same intent and never POST again. Other checks cover JS-off SSR, private sessions, last-seat rejection, Escape/confirmed cancellation, rebook/history, immutable old results, private SSR isolation, forged proxy headers and invalid CSRF. Failures remain failures; this does not certify T05 events/ops or all R09 obligations.
