# Delivery: planning, code, release and operations (steps 9–10)

Read this after the project's approved design, coding rules and test specification in [coding-testing.md](coding-testing.md). Use current project sources and Human decisions, not remembered approvals. This reference guides decisions and evidence; it adds no CLI action, metadata writer or product executor. Keep the existing schema2 contracts documented by the existing action references. Use only supported helpers for metadata, within their documented scope; never call an internal writer or edit metadata with shell commands to simulate a missing capability. Product tools require their own authorization.

## Plan and authority

Start from approved scope and acceptance criteria. Decompose the selected work into phase/task/subtask with dependencies, input, concrete output, checks, reviewer/gates and stop conditions. Include backend, Web, admin, operations and SEO where applicable. Keep undecomposed or blocked work visible: missing detail is not zero remaining work. Reuse the project's plan and change workflow; do not create another progress tracker.

For each work item fill in: `scope/AC → dependency → source inputs → output → focused and impact checks → completion evidence → approval and execution permission → stop condition`. These are information requirements, not a new storage schema. Record unknowns and the decision needed. Review the plan first. Plan approval alone does not authorize code, tool installation, build, deployment or external side effects. Reuse explicit permissions already granted; ask only for missing authority that affects the next action.

## Code and final verification

Read the current task, rules, maps and sources. Implement a bounded slice, run focused and impact checks, update mappings and evidence, then review the exact source. Keep failures, skips and unverified requirements visible; they do not support DONE. Use [change.md](change.md) when scope, dependencies or assumptions change.

After each completed Feature run the final checks for the **whole project**, including unchanged components (G2). Focused task tests do not replace this run. Any source/configuration/test input change after it requires the entire final run again on the final inputs. Record source and configuration identities before and after verification. Combined branches, builds and releases have their own verification gates. A commit on master or a WIP state is not automatically release ready.

Prepare the environment and reusable build/test commands early. Fix the source, toolchain, dependencies, configuration and target; preserve lockfiles and exact artifact identity. Backend uses local Docker; heavy/performance work needs the granted cloud host and permissions. Do not install tools or acquire cloud resources implicitly. The application's browser and viewport matrix belongs to that project; Kidea's Chrome-only offline UI policy does not choose it. Only local unsynchronized project folders are supported; network/cloud-synchronized folders and simultaneous writers on multiple machines are outside scope.

## Release basis

Distinguish the product version, component version, exact build/artifact identity, and release-record revision. If only Web changes, reuse the exact unchanged backend artifact after compatibility verification. Two builds with the same display version remain different artifacts. Do not use `latest`, rebuild/pull moving inputs on PROD, or move a published tag.

Before executing, make an immutable, reviewable package containing:

- Source commit and tree identity; per-component version and artifact digest; build evidence and target architecture.
- Configuration identity with secrets referenced safely, schema compatibility and migration identity/order.
- Main entry script and every child script, migration and dependency identity; exact invocation and side effects.
- Old → new target state, checks/readiness, rollback versus data-restore procedure, retention and recovery evidence.
- Release revision, selected target, approval, execution authority, limits and stop conditions.

Changed artifact/configuration/schema/script (including child scripts) means a new revision and the corresponding review and tests before execution. An old approval does not cover changed inputs. A single deployment entry calls the component scripts. DEV and PROD share verified logic, with separate configuration and authority. AI may execute DEV only within the grant. Human selects the exact package/configuration/target and **directly runs the verified PROD scripts**; preparing those scripts does not authorize the agent to run PROD.

## Preflight and attempts

Preflight must resolve target and actual authority, old → new identities, compatibility, required artifacts/configuration, recovery readiness and overlapping attempts. Ambiguous target or missing authority blocks sending a command. Do not infer permission from reachable credentials. Protect logs and outputs from secrets and review sharing scope.

Give each attempt a distinct ID tied to the correct immutable revision and target. Retain failed, partial and unknown attempts. A retry gets a new ID after checking actual state and the correct revision; it does not replace the prior record. After connection loss following a send, read actual state first. Never blindly replay deployment or migration because no receipt arrived. If state cannot be established, record UNKNOWN and stop dependent unsafe actions.

## Readback and recovery

Record per-target, per-component observed artifact/configuration/schema identities, service readiness and the main user/admin flows, with time and source of observation. A command's exit0, receipt, build or tag does not prove the selected release is running. One successful component plus a failed or unknown component is not release success. Stale or absent observation cannot establish current health.

App rollback and database restore are separate operations. Verify schema/data compatibility before rollback; do not assume Git or an older binary reverses external effects. Data restore needs explicit authority, a verified recovery source/procedure and readback of data, admin flows and permissions. Preserve failures and discrepancies. A real lab must demonstrate command → readback → injected failure → recovery before claiming those capabilities; document scenarios are not deployment evidence.

## Operations and closeout

Jobs and alerts must continue independently of the AI session and laptop on an appropriately authorized execution host. A process or backup on the same host does not demonstrate host-loss recovery or an independent observer. Record these limitations until actual independent-host evidence exists. Missing observations remain unknown; do not turn them into healthy status.

Keep SEO/index/readiness evidence and the project's Human gate. A closed lab must not open public indexing. Missing SEO evidence or an unapproved N/A keeps the gate open. Review logs for secrets before sharing; use synthetic examples in documentation, never real credentials.

Remove obsolete APIs/schema/flags/branches only after checking support, compatibility, retention/recovery obligations and deletion authority. Incidents and production bugfixes follow the existing change/plan path: use the correct production base, preserve unfinished Feature work, and bring the fix back to the active line with relevant verification. Do not erase history or bypass final gates to accelerate recovery. Human acceptance is distinct from the agent's report of checks.
