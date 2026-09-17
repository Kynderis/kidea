# Coding rules and test specification — step 8

Use after the project's approved business, quality, experience, operations, admin and architecture sources (steps 1–7). This method prepares and verifies a project profile; it does not add a public Kidea action, authorize installation/build/deploy or certify an application from documentation.

## Scope and authority

Current supported application profiles are C++ backend and Web. Android/iOS app support is Future, with no roadmap or date. Preserve native history without scheduling it or treating deferred variants as PASS/N/A. Kidea host portability (Windows, macOS Intel, Apple Silicon) is separate; never infer one CPU/OS from another. Each project owns its Web browser/viewport, responsive journeys, keyboard/touch/accessibility and acceptance criteria. Preserve approved project targets; do not copy pilot numbers or minOS into another product.

Read project conventions first. Record the effective profile ID/revision, scope, authoritative source anchors and content hashes. Each rule needs a stable ID, rationale, applicable component/environment, correct and incorrect examples, a falsifiable check and required evidence. Resolve conflicts before applying a profile. Shared authority, permissions, business invariants and Human gates cannot be waived through a coding-rule exception.

An exception needs the exact rule/revision, affected source/config/target, reason, risk, compensating checks, approver and expiry condition. An unapproved or expired exception blocks the affected claim. Do not carry a lab waiver into release or a later gate; review it again if its inputs or expiry change.

## Test specification and traceability

Enumerate every source case and its variants, not just test-group counts. Link each to setup, actions/order/fault injection, expected result, environment and evidence. Keep concurrency, denied permissions, partial failure, unknown outcomes, stale responses, actor/epoch changes, lifecycle, data/event consumers, release compatibility and restore assertions. A mixed case remains active for its backend/Web variants even when native variants are deferred. Document exclusions from an approved scope decision; missing tools are not a scope decision.

For each active profile, demonstrate a correct executable sample and a violation detected for the expected reason. Build/type/lint success alone cannot establish domain correctness. Preserve mutation diagnostics and distinguish a real detected violation from an unavailable compiler, timeout, crash or harness failure. Use separate sanitizer configurations when required; no skipped case counts as PASS. Numeric targets require the approved workload, clocks, sample accounting and target environment.

Identify each run by case/variant/platform/run ID and capture source/profile/config/lock/toolchain/target/dataset/command/artifact identity. Retain raw stdout/stderr, exit status, skips, failures and retries. A changed input invalidates only evidence whose dependency closure includes it, but unchanged filenames or version labels do not establish unchanged inputs. Verify hashes before reusing evidence and state that it is a review of historical execution, not a fresh run.

## Commands, environments and gates

Use explicit reproducible project commands and a lockfile. Verify the local root, tool versions, ordinary-user permissions and authorized resources before running. Docker/local/cloud choices belong to the project and approved environment grant; containers on one laptop do not prove host-loss recovery, independent monitoring or server performance. Missing access requires a concrete minimal proposal; never request secrets in chat or reset old quotas/deadlines.

Verify the method in a fresh local folder: restore into a nonexistent destination, validate source hashes and links, and exercise positive and negative fixtures without relying on a sibling pilot, caches or a prior session's state. Keep old validators on their historical snapshots. New scope/revision validation must preserve active oracles and reject missing cases, unauthorized changes and false PASS. Source-preservation checks supplement semantic review; they do not replace runtime tests.

Integrate references with the skill, run affected tests and the final full Kidea regression on fixed inputs, and record actual coverage and limitations. G2 still requires whole-project verification after a Feature; R08 execution/release, R09 application workloads and R10 acceptance remain separate. A finite lab sample, a synthetic gate fixture or a clean-folder documentation check is not all application cases. Present a concrete evidence package for Human acceptance; never mark a phase DONE solely because the agent's checks passed.

## Continue to steps 9–10

Once the project inputs have passed their applicable review gates, read [delivery.md](delivery.md) for plan decomposition, code and whole-project final verification, release identity, execution authority and operational readback. Step 8 approval does not itself grant code/build/deploy permission.
