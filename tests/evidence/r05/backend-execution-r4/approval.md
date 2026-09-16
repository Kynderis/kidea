# Authority and constraints — r4

Human replied “duyệt nhé” to the concrete disk-budget proposal after source commit `fbbcf9168e1fee77ac20882c99de0aa8618eb347`. This approves cumulative disk growth up to **24 GiB**, replacing 16 GiB, while preserving 4 GiB artifact downloads, 2 CPU/4 GiB aggregate active Docker resources, 3 hours per run, at least 100 GiB host free, and only host publication `127.0.0.1:8443`.

The original E2 authorization includes implementation fixes, tests, isolated synthetic fixtures, final regression, evidence and Git commit/push. This is not approval of all Kidea/R05, production deployment, native Apple Silicon, cloud or host installation/trust changes.

`start.json` retains the runner's original generic E2 approval string unchanged. This file records the additional r4 authority rather than rewriting that raw receipt. The initial dirty runner change only extends the known evidence run identifiers to r4; the checkout was otherwise clean when this turn began.

No SQLite suppression, excluded test, compiler warning relaxation or expected-result weakening is authorized or used to make the positive TSan suite pass.
