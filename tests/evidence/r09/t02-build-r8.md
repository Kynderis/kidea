# R09 T02 build r8 — signal fix verified, WAL limitation retained

Source `1a4dc77b7f8b38c7d968ae9db4386c958a105e4a`, manifest `ffcaa8889ec47d0aa62bf95860a704225d54af5015586d9c4a0754fda8b97aef`, 78 source/824 vendor files. [Receipt](t02-build-r8/execution-receipt.json), [raw evidence](t02-build-r8/run/results.json). Run `t02-6f8c36c5-94f5-4942-880b-54de5743efb4` ran on Docker Linux amd64 on Mac Intel under the [full R09 authority](../../../docs/R09_EXECUTION_AUTHORITY.md).

All four presets completed and all four containers were removed. Dev, ASan/UBSan and release each passed 46 CTest cases/796 assertions. Every preset passed 18 HTTP assertions and SIGTERM/SIGINT shutdown regressions, with server exit 0 and empty stderr. TSan HTTP has zero reports after the signal fix.

TSan retains 40 CLEAN cases and six known WAL cases with 12 reports/exit66; all 796 functional assertions and controls passed. The exact EX r2 policy accepts this evidence with a limitation, not as TSan CLEAN. Raw failing CTest and sanitizer output are retained. No new exception or suppression was introduced. Final runner state is `EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED`; this is not T02 or R09 product acceptance.

The application now blocks TERM/INT before creating workers, disables Drogon's asynchronous default handler and polls pending signals on its event loop. Shutdown therefore runs in normal execution context, retaining the existing drain deadline. Zero-timeout polling and inherited signal blocking follow the [Linux sigtimedwait contract](https://man7.org/linux/man-pages/man2/sigwaitinfo.2.html). R7's signal-unsafe FAIL remains unchanged. New regression tests exercise both signals in every preset; offline policy/gate checks total 100 PASS and still reject that report class.

Next: r9 verifies the additive session endpoint needed for real Web/backend integration. Keep EX r2 visible in every subsequent review; do not infer Apple Silicon, Windows or production coverage from this run.
