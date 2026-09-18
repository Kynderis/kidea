# R09 T02 build r10 — complete with the approved WAL limitation

Source `38763269f4f34ac4aee37fdd75d0f608e7a038ed`, manifest `a82750b35886251ea3a051b64590b1723047e2d2e345a7b710d641939b665c6f`;82source/824vendor. [Receipt](t02-build-r10/execution-receipt.json), [raw results](t02-build-r10/run/results.json). This is the tenth T02 build within R09; phase R10 is not opened.

All four presets completed and four containers were removed. Dev/ASan/release each passed46CTest/796assertions. Every preset passed18HTTP,eight session checks and both SIGTERM/SIGINT shutdown checks. TSan controls verified; application cases retain40CLEAN and6knownWAL/12reports under the unchanged EX r2, with all796functional assertions. TSan HTTP is CLEAN; session/shutdown servers exit0 without sanitizer stderr.

The display-order parser correction is verified in a full new run, after112offline policy/gate checks. The r9 raw FAIL remains unchanged. No new access pair, vendor change, suppression or sanitizer option change. Final runner status is `EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED`, not TSan-clean or product acceptance. Source closure was verified unchanged at evidence collection; the independent Web-only commit029b663 did not change those82files.

The release binary can now be bound to the separate real HTTPS Web/backend lab. Current Web33unit/18SSR–Chrome passes on fake API; integration, T04 onward, final maps/gates and Human acceptance remain. No claim of Apple Silicon, Windows or production coverage.
