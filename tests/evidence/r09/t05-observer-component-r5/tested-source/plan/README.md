# R09 observer component checks

`python3 tests/r09/observer-component/run.py` from Kidea root creates a fresh
owned attempt on existing Docker/images/tools under full R09 authority. It
freezes source/tool/image/profile hashes, keeps stdout/stderr/control receipts,
uses three non-root1CPU/2GiB readonly containers on an internal network with no
published host ports and a10min attempt/9min container deadline. No pulls,
install, host trust/config changes, cloud, product writes or historical cleanup.
Cumulative disk uses the original full-scope20GiB baseline, free>=100GiB,
plus128MiB Git reserve. Never rerun into an old receipt or reset after FAIL.

Source values and sessions are explicitly fake. Real TLS/Chromium display,
observer fsync checkpoint, SIGKILL child restart, separate Node source process
stop and session revocation are tested. Controlled filesystem actions apply
only to newly owned fixture processes/profile files; none are product UI/API
controls. Desktop bind ownership is solved by creating the private child with
the ordinary container UID; ownership/permission guards remain unchanged.

The 15 selectors are all required. All receiver timing assertions retain the
OP budgets: M1 detect-to-show<=5s/stimulus-to-show<=8s, M6 detect-to-show<=5s/
source-down-to-show<=17s. Shared-kernel/synthetic stimulus timing is not E1 or a
backend-host-loss PASS. Full app coverage137 remains11covered/88partial/38NOT_RUN
from the prior actual backend/Web slice; component facets are reported separately.

Private ephemeral TLS key and browser profile stay in ignored owned temporary
storage. Collect public certificate, all run/browser/source/manager/raw command
logs and state checkpoint (no real credentials/PII), with exact SHA. Keep every
FAIL and diagnostic. Primary backend/Web artifacts/sources and historical raw
collections are preserved and reused explicitly, not rerun or relabeled here.
