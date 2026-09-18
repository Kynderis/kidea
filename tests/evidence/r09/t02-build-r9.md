# R09 T02 build r9 — control parser FAIL, fixed offline

[Receipt](t02-build-r9/execution-receipt.json), [raw run](t02-build-r9/run/results.json). Source `5c1fc6ffc8cf80a218b8d85d2b7d3fa662ea439a`, manifest `a85c9bf4bffc9e08f70e10ee7ca1a21e2e02d999ea7e830c362fc943d47e4ff2`;80source/824vendor. Source closure unchanged at collection; three containers removed.

Dev and ASan/UBSan each passed46CTest/796assertions,18HTTP,eight session assertions and two shutdown tests. TSan compilation succeeded, but controls returned `CONTROL_BASELINE`; application cases, TSanHTTP/session/shutdown and release were not run. Overall r9 remains FAIL.

The deliberate-race detector worked, serial WAL had no warning, parallel WAL reached100updates/quick_checkok and emitted two reports. The second is exactly the approved writer68471 ↔ reader70133 pair, memcpy115/107,8bytes,same address,shared header offset0; TSan printed current Read followed by Previous write. The classifier incorrectly required current Write followed by Previous read. [Before/after offline diagnosis](t02-build-r9/parser-review/result.json) preserves the original blocked result and proves the same approved pair identities.

The fix normalizes only those two layouts to writer/reader, then retains all existing checks. It does not admit a new access pair, change the exception, or make a TSan-clean claim. Two-read/two-write/mismatching role or stack/size/address/offset/unknown/truncated cases remain blocked. [78 policy tests](t02-build-r9/parser-review/policy.log) and [34 gate tests](t02-build-r9/parser-review/gate.log) passed. Backend/vendor/flags/oracles unchanged. No repeat-until-green run of old binaries: next is a complete fresh four-preset run on fixed source.

Full-phase authority covers this parser correction and the next bounded build. Real HTTPS Web/backend integration waits for final release evidence; T02/T03/R09 not accepted, R10 phase not opened (build-r10 is merely the tenth T02 build).
