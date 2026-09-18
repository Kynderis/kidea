# R9 control report display order

Full R09 authority permits fixing the parser without a new exception when the approved access identities are unchanged. R9 source5c1fc6 dev/ASan passed; TSan control blocked before application cases, release NOT_RUN. The detector caught its deliberate race, serial WAL exited0 without report, parallel WAL completed100 updates/quick_check but printed the second approved pair as current Read70133 then Previous write68471, both memcpy115/107,8bytes,same address,shared-header offset0. First pair68469/70135 remains unchanged.

The old classifier assumed current Write/Previous read display order. Normalize only these two valid layouts to writer and reader before applying the same exact stack/line/size/address/mutex/header/summary/context/exit/completeness checks. Two reads, two writes, swapped roles with mismatching stacks, unknown accesses and incomplete reports remain BLOCKED. No new access pair, vendor/backend change, sanitizer option or EX r2 extension. Raw r9 FAIL is retained in Kidea tests/evidence/r09/t02-build-r9.

78 policy plus34 gate offline checks pass. Real r9 control reclassification is diagnostic only; a new full four-preset build must verify final source, including session/HTTP/shutdown. R09 remains open, no product acceptance.
