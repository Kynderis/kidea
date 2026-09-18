# Real outbox telemetry and primary operations Web — r1

IN_PROGRESS; human full R09 execution authority, not product acceptance.

Source: operations M1/M2/M4, W5 `/operations`, COMMON-01–08, CPP-02–04.
New CREATE-ONLY databases opt into `outbox-telemetry-r1` with additional tables.
Protocol/business schema user_version remains1; exact schema hash changes.
Existing databases are never opened for migration, altered or reset implicitly.
Old schema1 stays usable; aggregate pending is known, age/catalog/success unknown.

M1 counts ALL incomplete obligations, independently of the dispatch batch64.
Transaction timestamp commits atomically with domain/result/audit/outbox. This
pre-COMMIT time is an upper age bound, not an exact durable commit instant.
Dispatcher separately persists a first observation of an already committed row;
this yields a conservative lower age bound. Clock reversal/missing timestamps
remain UNKNOWN. No latency or full OP-T01 claim from these bounds.

M2 is a durable processing-error catalog keyed by real event identity and code,
not retries/log frequency. Failure recording validates id/epoch/workshop/version.
Successful completion resolves only PROCESSING errors for exactly completed rows
and a fully successful processing-cycle source-read error. INVARIANT/RECONCILE
remain open pending separate verified reconciliation, with no public clear API.
A failure to persist or startup before a verified cycle keeps observation UNKNOWN,
while readable known critical catalog errors remain visible. This covers dispatcher
errors only, not every business-result/reconciliation/invariant producer.

M4 is the processing transaction time bound to epoch/workshop/version, not a
browser receipt. Duplicates and empty scans never invent a new success.

W5 is admin-only SSR plus read-only2s polling with2s request timeout,5s stale
limit, exact actor/epoch binding and no-store. Invalid identity/revocation clears
private DOM; pagehide/BFCache/hidden/unmount fence late responses. Known critical
errors survive unknown reads; pending critical recovery needs3distinct2s samples.
M3/M5/M6/M7/M8/M9/admission remain UNKNOWN/unwired. No confirmed Human oncall
window, independent-host proof, WQ/E1, backup/restore or production certification.
Fallback observer schema1 is unchanged; it is NOT fed fabricated complete samples.
Next bridge must extend its source envelope to explicit per-signal unknowns.

Verification requires a newly frozen manifest, full four presets under unchanged
EXr2, all existing50CTest/control/oracle/HTTP/session/shutdown/updates checks,
additional sanitizer-clean telemetry tests, complete Web checks and real TLS Chrome.
FAIL attempts and source copies are retained. Native clients Future; AppleSilicon
NOT_RUN. No gate/owner/status/acceptance is promoted by this technical milestone.
