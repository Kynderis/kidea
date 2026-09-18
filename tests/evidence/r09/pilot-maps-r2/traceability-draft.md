# Responsibility mapping — current Web slice, incomplete

Authored rows; reverse lookup is derived. Not another task queue or acceptance record. Backend, admin/events/ops and later R09 slices remain to be mapped against actual source.

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
    "conditions": "Client contract and fake-API Chrome have passed; real HTTPS integration pending. Does not prove backend commit atomicity.",
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
  }
]
```
