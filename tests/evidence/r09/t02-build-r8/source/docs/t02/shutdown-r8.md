# R8 signal shutdown fix

R09 full-scope approved. R7 FAIL during HTTP shutdown: Drogon SIGTERM handler allocated twice under TSan. All18 HTTP assertions and796 case assertions passed. No new exception: signal-unsafe report stays BLOCKED. R8 uses blocked SIGTERM/SIGINT before worker creation and synchronous sigtimedwait in main event loop; quit runs outside async handler. New shutdown regression sends both signals to each preset and requires clean process exit/stderr. Vendor/DB logic/EX r2 policy unchanged. Full build rerun is covered by phase authority; no per-build approval.
