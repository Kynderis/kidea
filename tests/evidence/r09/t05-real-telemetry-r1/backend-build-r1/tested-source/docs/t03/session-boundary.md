# T03 session boundary

Under approved full R09 scope, add GET /api/v1/session to the existing authenticated C++ Store transaction. It returns actor/epoch/current roles and CSRF only for a nonexpired/nonrevoked server session; never returns the cookie token. No-store remains mandatory. This is an additive identity lookup for Web, not new account management or role authority on the client. Existing auth/origin/domain/DB policy and EX r2 are unchanged.

Web public SSR stays anonymous and strips private additions. Private /me forwards only the session cookie to the fixed internal backend; actor/epoch validated and token/CSRF excluded from returned page data. Registration keeps intent by actor/epoch/workshop before sending, reload GET only, cancellation exact ID, keyed lifecycle on workshop/epoch.

R8 completed all four presets, 72 HTTP assertions and eight signal checks; TSan case reports remain within EX r2 and require final review, not TSan-clean. R9 rechecks complete backend on final session source plus eight session assertions per preset. Current Web33unit/17SSR–Chrome passes with fake API; actual HTTPS/backend integration remains next. No per-build approval needed under full-phase authority. R09 not accepted, R10 not opened.
