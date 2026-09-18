# Responsibility mapping — current scoped implementation

Single authored mapping; reverse lookup is derived. Backend/Web/T04 coverage does not complete admin/events/ops or T14. Compiler/Web diagnostics and unfinished event wiring remain explicit; no fourth progress map.

```json
[
  {
    "id": "WEB-INTENT",
    "spec": {
      "path": "docs/business/shared/registration.md",
      "anchor": "retry"
    },
    "targets": [
      "web/src/lib/state.ts#prepareSend",
      "web/src/lib/Registration.svelte#execute",
      "web/tests/server/public.test.mjs"
    ],
    "purpose": "Persist identity before POST and reconcile the same request after lost response; explicit action only.",
    "conditions": "Client contract, Mac Chrome and real HTTPS integration have scoped receipts. Backend commit atomicity is separately tested; this is not whole-product acceptance.",
    "evidence": [
      {
        "path": "web/src/lib/state.ts",
        "anchor": null
      },
      {
        "path": "web/src/lib/Registration.svelte",
        "anchor": null
      },
      {
        "path": "web/tests/server/public.test.mjs",
        "anchor": null
      }
    ]
  },
  {
    "id": "WEB-IDENTITY",
    "spec": {
      "path": "docs/business/shared/workshop.md",
      "anchor": "access"
    },
    "targets": [
      "web/src/lib/server/public.ts#readPublic",
      "web/src/routes/me/+page.server.ts#load",
      "web/src/lib/Registration.svelte",
      "web/tests/server/public.test.mjs"
    ],
    "purpose": "Keep public SSR anonymous; private history and mutation identity come from the authenticated server session.",
    "conditions": "No client actor/role authority; cookies excluded from public fetch and credentials excluded from SSR payload. Server implementation remains a separate responsibility.",
    "evidence": [
      {
        "path": "web/src/lib/server/public.ts",
        "anchor": null
      },
      {
        "path": "web/src/routes/me/+page.server.ts",
        "anchor": null
      },
      {
        "path": "web/tests/server/public.test.mjs",
        "anchor": null
      }
    ]
  },
  {
    "id": "WEB-RESTORE",
    "spec": {
      "path": "docs/design/experience.md",
      "anchor": "error"
    },
    "targets": [
      "web/src/routes/me/+page.svelte",
      "web/tests/server/public.test.mjs"
    ],
    "purpose": "Remove private DOM on pagehide and reload against the current server session on persisted pageshow.",
    "conditions": "Explicit PageTransitionEvent handler regression in Chrome, not a claim about every browser BFCache schedule or T05 revocation delivery.",
    "evidence": [
      {
        "path": "web/src/routes/me/+page.svelte",
        "anchor": null
      },
      {
        "path": "web/tests/server/public.test.mjs",
        "anchor": null
      }
    ]
  },
  {
    "id": "WEB-HISTORY",
    "spec": {
      "path": "docs/business/features/register-cancel.md",
      "anchor": "ac"
    },
    "targets": [
      "web/src/lib/state.ts#ClientState",
      "web/src/lib/reply.ts",
      "web/src/lib/Registration.svelte",
      "web/tests/server/public.test.mjs"
    ],
    "purpose": "Separate immutable intent result from current versioned registration history; cancellation binds the captured registration ID.",
    "conditions": "Older/conflicting history cannot invent current ACTIVE; event transport and all concurrency schedules remain separate checks.",
    "evidence": [
      {
        "path": "web/src/lib/state.ts",
        "anchor": null
      },
      {
        "path": "web/src/lib/reply.ts",
        "anchor": null
      },
      {
        "path": "web/tests/server/public.test.mjs",
        "anchor": null
      }
    ]
  },
  {
    "id": "WEB-SEO",
    "spec": {
      "path": "docs/design/experience.md",
      "anchor": "seo"
    },
    "targets": [
      "web/src/routes/+page.svelte",
      "web/src/routes/+layout.svelte",
      "web/src/routes/workshops/+page.svelte",
      "web/src/routes/workshops/[id]/+page.svelte",
      "web/tests/server/public.test.mjs"
    ],
    "purpose": "Readable public HTML, stable lab canonical, noindex and escaped plain content; no private identity in public metadata.",
    "conditions": "Lab policy only, no public indexing or Event markup. Browser tests include JS off, responsive widths and text zoom.",
    "evidence": [
      {
        "path": "web/src/routes/+layout.svelte",
        "anchor": null
      },
      {
        "path": "web/tests/server/public.test.mjs",
        "anchor": null
      }
    ]
  },
  {
    "id": "WEB-EVENT-REMAINING",
    "spec": {
      "path": "docs/business/shared/availability.md",
      "anchor": "reconcile"
    },
    "targets": [],
    "purpose": "Live public/private event reconciliation and freshness consumers still need T05 wiring.",
    "conditions": "State helper tests alone do not implement or certify live event delivery.",
    "evidence": [
      {
        "path": "web/src/lib/state.ts",
        "anchor": null
      }
    ]
  },
  {
    "id": "T04-ATOMIC-QUOTA",
    "spec": {
      "path": "docs/t04/max2.md",
      "anchor": null
    },
    "targets": [
      "backend/src/store.cpp",
      "backend/tests/tests.cpp"
    ],
    "purpose": "Count actor ACTIVE globally inside BEGIN IMMEDIATE before capacity; duplicate and remembered intent keep their earlier priority.",
    "conditions": "Q01 and Q04 compare real final codes/counts/outbox, including two concurrent different-workshop writes. Full original oracle remains required.",
    "evidence": [
      {
        "path": "backend/src/store.cpp",
        "anchor": null
      },
      {
        "path": "backend/tests/tests.cpp",
        "anchor": null
      },
      {
        "path": "docs/t04/oracle-extension.json",
        "anchor": null
      }
    ]
  },
  {
    "id": "T04-LEGACY-CANCEL",
    "spec": {
      "path": "docs/t04/max2.md",
      "anchor": null
    },
    "targets": [
      "backend/src/store.cpp",
      "backend/schema/001.sql",
      "backend/tests/tests.cpp"
    ],
    "purpose": "Preserve preexisting excess rows; cancellation releases quota once and CANCELLED is excluded. Existing one_active partial index supports actor filtering.",
    "conditions": "Q01/Q02/Q03 assert exact history/count/event consequences and both serial orders; schema/data are not rewritten.",
    "evidence": [
      {
        "path": "backend/src/store.cpp",
        "anchor": null
      },
      {
        "path": "backend/schema/001.sql",
        "anchor": null
      },
      {
        "path": "backend/tests/tests.cpp",
        "anchor": null
      }
    ]
  },
  {
    "id": "T04-HISTORICAL-RESULT",
    "spec": {
      "path": "docs/t04/max2.md",
      "anchor": null
    },
    "targets": [
      "backend/src/store.cpp",
      "web/src/lib/reply.ts",
      "web/src/lib/Registration.svelte",
      "web/tests/unit/state.test.mjs",
      "backend/tests/tests.cpp"
    ],
    "purpose": "LIMIT_REACHED remains immutable for the same intent after cancellation; fresh intent is a separate server decision. Web does not infer current quota from history.",
    "conditions": "Q01/Q03 and Web tests distinguish old rejection, new success and invalid CANCEL decoding; lost reply/no replay regressions remain.",
    "evidence": [
      {
        "path": "backend/src/store.cpp",
        "anchor": null
      },
      {
        "path": "web/src/lib/reply.ts",
        "anchor": null
      },
      {
        "path": "web/src/lib/Registration.svelte",
        "anchor": null
      },
      {
        "path": "web/tests/unit/state.test.mjs",
        "anchor": null
      },
      {
        "path": "backend/tests/tests.cpp",
        "anchor": null
      }
    ]
  },
  {
    "id": "T04-CONTRACT",
    "spec": {
      "path": "docs/t04/max2.md",
      "anchor": null
    },
    "targets": [
      "contracts/openapi.json",
      "web/src/lib/reply.ts",
      "backend/src/store.cpp"
    ],
    "purpose": "Add the REJECTED outcome without claiming a technical failure or granting client-side mutation authority.",
    "conditions": "Old client unknown-code behavior remains uncertain rather than false success; mixed-version release readiness is still an explicit T08 obligation.",
    "evidence": [
      {
        "path": "contracts/openapi.json",
        "anchor": null
      },
      {
        "path": "web/src/lib/reply.ts",
        "anchor": null
      },
      {
        "path": "backend/src/store.cpp",
        "anchor": null
      }
    ]
  }
]
```
