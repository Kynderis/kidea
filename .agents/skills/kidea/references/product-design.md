# Product design: quality through architecture

Use for steps 3–7 in the selected, authorized scope. Read the actual approved business sources and relevant design inputs, not just status labels. This method supports clarification, design and review; it does not implement a product writer, advance tasks, grant execution or make change/visualize available. Follow SKILL.md and the relevant public procedure for supported review/context metadata. Product authoring needs its own explicit grant.

## M0 — Sources, decisions and gates

Start with the user outcome, selected Feature slice, shared rules, AC and constraints. For an existing product separate observed implementation from desired behavior. Keep the established document layout: product sources outside coordination records, review evidence referring to them. Do not create a file per requirement, another live status tracker, a fourth map or a new runtime/schema.

For each material decision record source → option/recommendation → reason/tradeoff → affected consumers → verification. Distinguish unchanged approved input, new proposal, missing evidence and observed result. Use ordinary, boundary and failure examples that expose wrong behavior. A template is a coverage aid, not a requirement for irrelevant fields or artificial state.

Batch all currently identifiable decisions, permissions and verification limits in a plain-language package with examples. Proceed continuously within approval; ask again only for a new consequential choice, conflict, missing authority or a concrete result gate. Human approves the presented version, not unseen dependent designs. Preserve separate gates for quality (3), experience and design SEO (4), operations (5), admin (6), architecture (7), and SEO readiness before release. Open dependent work only after its inputs are approved. Independent material may be prepared together without declaring an unapproved dependency usable.

Trace each design obligation to exact rule/AC or quality/operational need and add a reverse reference at the source section. Review missing semantic relationships as well as links already written. When meaning changes, inspect all affected consumers/tests even if their code did not change. Missing business meaning returns to the earliest affected step; do not invent a rule in a form/API, silently rewrite an approved source or reset unrelated work. A consequential design revision needs renewed review of that scope.

N/A needs reason, exact scope and Human confirmation. Approval of targets is distinct from evidence of attainment. Keep FAIL, PARTIAL, NOT_RUN and historical results with their actual input versions; do not turn a link check or source hash into semantic or runtime proof.

## M1 — Quality, step 3

Useful row: ID | source/purpose | operation and workload | environment/device/network | metric/unit/window | target and rationale | measurement/failure cases | limits | approval and evidence. Omit irrelevant fields with a reason; a missing applicable target blocks approval of that requirement, not all independent work.

Cover latency/capacity, availability, security/privacy, data retention, permitted data loss and recovery time, cost/resource budgets, web/native performance and SEO. Do not transfer Kidea-tool targets or one pilot's numbers into another product.

- Specify concurrency, offered request rate, read/write mix, data size, duration, repetitions and contention hotspots. Seed account count does not establish supported user capacity.
- Separate backend duration, user-observed response and derived-view freshness. State sample counts, percentiles and errors/deadlines; include offered failures/timeouts rather than measuring successes only or using an average to hide a slow tail.
- Distinguish process crash with intact storage from loss of the storage/failure domain. Explain durability of acknowledged outcomes and downstream obligations. A successful backup job is not proof that restore works or that a recovery point covers recent commits.
- Specify public/private boundaries, server authority, allowed logs and retention. Do not put secrets/private data in evidence or invent automatic deletion to meet a budget.
- Propose numeric targets with rationale or identify the missing input and blocked decision. Approved targets remain NOT_RUN until tested in the required environment; do not defer numbers indefinitely or substitute a convenient platform for required native/device tests.

Example: “two users cannot both take the last seat” is a correctness invariant; response latency and time until all observers see the new count are separate measurements. A storage-loss exception must be explicit, not hidden under a process-crash guarantee.

## M2 — Experience and SEO, step 4

Journey template: actor/goal → platform/screen → data/source → action → loading/empty/success/error/denied/offline → safe next action → rule/AC/test. Include a small layout sketch, not just page names. Cover each approved platform, keyboard/focus/error labels, narrow screens, text scaling and non-color-only states where applicable. New measurable accessibility/usability standards need review.

After a submitted action loses its response, distinguish unknown from final failure. Retain the appropriate intent identity and use only the retry/reconciliation rights defined for that action. A registration retry rule is not automatically an admin retry rule. A historical outcome must not overwrite newer observed state; matching current state alone does not prove a particular past action succeeded. Render missing/stale data as such, not as zero/empty/final success.

SEO template: page/audience | purpose/content/owner | URL/identity | title/description | links | rendering | canonical/status/redirect | index/bot policy | tests. Keep private data out of public HTML and shared caches; noindex is not access control. Distinguish search-crawler and training-crawler policy. Consider sitemap and structured data only for real applicable content; do not invent reviews, locations or other facts to qualify. Separate technical checks from real indexing/ranking/citation observations. A closed-lab waiver for real search results does not waive technical SEO or authorize publishing/index submission. Architecture selects mechanisms after the experience gate.

## M3 — Operations, step 5

Signal template: source need | meaning/unit | observation point | sampling/freshness/window | threshold | recipient/action | delivery channel/deadline | collection failure | authority/privacy | test. Pick actionable signals, not a dashboard per metric. Controls need a business/operational source and permission; a monitoring need does not itself authorize replay, deletion, restart or restore.

Differentiate backlog count, oldest pending age, last processing success and last observation. Missing collection is unknown/error, not zero or healthy; zero-event periods need separate liveness evidence. Define onset, escalation, recovery, reminders/grouping and persistence of unresolved incidents when relevant. HTTP success with an old sample is not a fresh measurement; health probes do not prove writes, backup or recovery.

Identify responsibility, staffed window and a notification/display path that outlives the AI session and the component being monitored. Verify relevant failure-domain independence, not just a second process on the same failed host. Unconfirmed recipient/channel/environment remains a readiness gap; do not assign the Human 24/7 duty or create a scheduler/service without a grant. Preserve the approved channel scope. Explain what happens when dashboard, collector or its data source fails and how users recognize stale information.

## M4 — Admin, step 6

Action template: actor/permission/data scope | rule/flow | input | confirmation and reason | outcome/state | error/retry/concurrency | audit | test. Server state decides valid mutations; client role or old form values grant nothing. Confirm consequential actions with their real effect, not every text edit. A confirmation dialog is not a lock or priority over competing actions.

Keep business intents separate when the sources require it. Address lost responses, concurrent edits and unknown durable outcomes explicitly. If correlation/deduplication or overwrite handling is not selected yet, record the architecture obligation; do not claim safe retry or conflict prevention already exists. A new observable rejection/precedence/retry right may require business review, not just an implementation note.

Specify audit actor/action/time/correlation/outcome and necessary changed fields, permitted readers, retention and storage-failure behavior. Do not default to full payloads/secrets, expose identities outside scope or silently add an audit UI/API. Distinguish audit attempts from actual domain events; no-op/rejection need not be a domain change. If durable audit is required for success, architecture must cover its commit/recovery path, including ambiguity, not best-effort logging disguised as certainty.

## M5 — Architecture and contracts, step 7

Open only after input gates. Useful row: requirement | component/responsibility | authoritative owner | input/output/error contract | sync/async dependencies | rights | consistency/retry | rendering/cache | deployment/compatibility | recovery | tests/open decisions.

Prefer a modular application unless requirements justify services, brokers or distributed state. Preserve the selected technology/platform matrix. Verify specific technology claims against current official sources; do not pin a remembered version or treat library support as proof of the combined system. The pilot's C++/SQLite, transports, thresholds and topology are examples of project decisions, not universal defaults.

Contracts must resolve types/domains/units/null, identity, authentication/authorization, errors, outcome certainty, version meanings and old/new compatibility. Separate domain version, wire/schema version and restored dataset generation where needed. Define bounded queues/backpressure and storage-error behavior without silently introducing domain rejection priorities. A missing request result is not proof that a delayed/in-flight mutation never ran.

Follow the full change chain: accepted mutation → durable outcome and downstream obligation → asynchronous processing → consistent derived view → web SSR/realtime/native/operations consumers. Locate the transaction/authority boundary and test crashes before/after commit and delivery; duplicates, reorder, gaps and same-version conflicting content; subscription/read races; private caches; and recovery/reconciliation. Derived observations never allocate authoritative capacity. Mark delivery processed separately from each client having observed it when that distinction affects quality targets.

For each component document target environment, packaging, start/stop/health/config/secrets, durable data, backup/restore, scaling/cost limits and authorized operator. Record concrete responsibilities and safe sequencing; defer only environmental values/version pins that are explicitly owned by a later gate, not unexplained operational gaps. Do not install to answer a design question. Separate the Kidea host from the product target: a selected Linux container can provide Ubuntu userspace without requiring another standalone Ubuntu VM. Where Docker local/cloud is selected, keep reproducible build/test commands, persistent data and graceful shutdown; the AI uses authorized existing Docker/SSH tools, not a new Kidea remote-execution service. Cloud runs need the actual host/scope/time/resource grant. Containers on one laptop do not prove independent monitoring/backup or server performance; Intel/ARM artifacts and native/device checks remain distinct. Do not impose this pilot's Docker choice on every project.

Backups need a consistent recovery point, verification at the destination, appropriate failure-domain independence, retention/resource accounting and an actual restore test later. Address old client requests/sessions after data restore; never silently replay from stale caches/logs. Distinguish app rollback from DB restore and its permitted loss. Upgrades require schema/API compatibility, deployment order and stop conditions; destructive migrations do not inherit approval from a design.

Reference the effective Git, test, coding-rule and execution-permission conventions; later profile/toolchain work refines them without skipping integration/readiness gates. Final integration checks cover the complete scoped candidate, not only changed files. Consider A/B only when the product needs it, with hypothesis/groups/metrics/stop conditions and permission; do not add it to every product.

## Review and handoff

Review eight dimensions: measurable quality; complete platform journeys; SEO/privacy and waiver scope; trustworthy actionable operations; admin source fidelity; end-to-end contracts/recovery/compatibility; semantic forward/reverse coverage; and authority/version/evidence honesty. Give each PASS/PARTIAL/FAIL with source sections and limitations. Inspect plausible omitted obligations: a checker cannot discover every missing relationship.

Before claiming completion bind findings and test results to exact input bytes, environment and method. Deterministic link/preservation checks, skill validation, independent AI review and executed product tests are different evidence. An independent reviewer gets the realistic task and raw authorized sources, not the author's desired verdict; use only the granted count/time/scope and retain raw findings/rechecks. No quota means no invented independent pass. Report unreviewed changes after a pass and untested runtime cases. Human acceptance of the final result remains distinct from approval of the five designs.
