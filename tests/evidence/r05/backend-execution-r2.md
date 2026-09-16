# R05 — Caddy dependency replacement, execution r2

2026-09-16. **PARTIAL / CADDY_BUILD_FAILED_COMPATIBILITY**. Human approved replacement r1 after `57319d79495e529539359817c30eb6de173e8327`; [authority](backend-execution-r2/approval.md), [start/environment](backend-execution-r2/start.json). Master/remote Kynderis/kidea verified; initially clean. Existing evidence r1 and Windows remain unchanged.

## Dependency replacement performed

Go 1.26.7 Linux archive downloaded from go.dev, exact 66,890,901 bytes/SHA256 matched the approved pin. It was extracted and run only in Docker. Caddy source archive matched the approved commit/hash. Containers used 2 CPU/4 GiB, ordinary UID 1000 inside and UID 501 on macOS; no host package, CA trust or system configuration changes.

First dependency resolve FAIL: approved candidate x/net v0.56.0 was below requirements of x/crypto and grpc. Retry retained approved primary upgrades and selected transitive minimums x/net v0.58.0 / x/text v0.41.0. `go mod tidy`, download and `go mod verify` PASS. [Final module lock](backend-execution-r2/go.mod), [checksums](backend-execution-r2/go.sum), [download metadata](backend-execution-r2/downloads.json). This resolves the graph, not runtime compatibility.

OSV queried 548 module/stdlib versions. Go 1.26.7 returned no entries at query time. 34 advisory records in the full graph were mapped against 982 imports of `./cmd/caddy`; their affected package paths were absent. [Triage](backend-execution-r2/triage.json) retains the method and limits, with raw advisory files alongside. Main Caddy forward_auth restriction still applies; no claim that the entire graph is vulnerability-free. License collection preserved 230 notices for 218 downloaded source modules; zeebo/assert lacked a root notice and was not imported by the Caddy command. This is source inventory, not a legal certification.

## Actual compile failure

Caddy build ran network none and failed at `modules/caddyhttp/celmatcher.go:506` and `:529`: `interpreter.NewCall` in cel-go 0.30.0 expects `[]interpreter.InterpretableV2`; Caddy 2.11.4 passes `[]interpreter.Interpretable`. No Caddy binary was produced; adapt/validate, HTTPS, browser integration and full matrix remain NOT_RUN.

[Proposed two-position source fix](../../../proposals/r05-caddy-cel-compat-r1.md) is ready for review and has not been applied. Source inspection confirms InterpretableAttribute already embeds InterpretableV2. The approved replacement package explicitly stops on incompatible graph; vendor-source amendment is presented separately. No downgrade or insecure workaround was applied.

## Independent C++ work

Added a deterministic bounded queue test: blocks the active task, fills capacity, checks overflow and closed admission, releases the task and verifies exactly three accepted tasks drain. Dev rebuild and **9/9 CTest PASS**, no skip. This is still a unit slice, not completed B01–B08 or the full E2 matrix.

ASan/UBSan build and **9/9 CTest PASS**, no skip and no sanitizer report. [Dev JUnit](backend-execution-r2/cpp-dev.xml), [ASan/UBSan JUnit](backend-execution-r2/cpp-asan-ubsan.xml). Tests cover the current unit slice; no sanitizer mutant has run, so this is not complete B08 certification. TSan/release, mutation, final format/tidy, Web Docker regression and full integration remain NOT_RUN.

## Final state and continuation

[Manifest](backend-execution-r2/manifest.json) captures all 10 stages, source hashes, 54 unchanged existing sample files, 27 unchanged original Web r2 files and 21 unchanged pilot documents. Caddy source remained unpatched. All owned r2 containers exited; port 8443 closed. No CA generated or HTTPS server opened. [Browser pull cancellation](backend-execution-r2/browser-pull-cancellation.md) preserves exit 143; browser image was not fully pulled and no browser was run. Cache/volumes were retained, without prune.

Next: review the proposed two-position Caddy source amendment, then build/test that amendment and continue the existing matrix. Recheck cumulative network/disk headroom before further artifact downloads/builds. R05/T03-S03 remain IN_PROGRESS, not accepted; Apple Silicon remains NOT_RUN.
