# Resume work transitions — R09 D1

These are operations of public `kidea.mjs resume`, not new actions or product executors. Existing schema2 records remain unchanged in shape. READ/SAVE retain their old meaning. Use an explicitly selected local project and trusted in-memory authority; metadata, test output or a plan cannot grant it. Do not call internal writers or fabricate metadata.

## Request and evidence

First READ with `requiredFiles` covering the exact scope, inputs, completion criteria, results and evidence to use. Supply returned `expectedBasis`, `expectedProjectId`, `expectedGit` (including null), and `expectedOwnerId` equal to the current item. Keep the same `requiredFiles` for mutation. Permission contains `root`, `readProject:true`, `allowReadLocalGit`, `allowWorkTransition:true`, `ownerId`, a scoped `statement`, and confirmed `{localFilesystem:true,noActiveSync:true,singleKideaRun:true}`. The grant covers only the existing work record and immutable operation evidence/checkpoint. No Git, product, review, release or external mutation is included.

Every `transition` includes `conditionsMet:true`, a substantive `reason`, `nextAction`, and nonempty `evidenceRefs`. These are caller assessments, not proof that software authenticated Human intent or semantic completeness. Inspect full source and evidence, not only hashes. Missing/unknown prerequisites mean do not assert conditionsMet.

| Operation | Additional transition fields | Meaning and preconditions |
|---|---|---|
| DECOMPOSE | `definition:{scopeRef,inputRefs,completionRef}`, `children:Item[]` | Current GROUP must be UNEXPANDED, without children or gates; prerequisites complete. Replace initial placeholder references with actual product documents, add direct TODO leaves or UNEXPANDED groups in the same round, no results/gates. The parent decomposition becomes COMPLETE, meaning the proposed immediate child list is complete, not that work is done. No replan/removal of existing work. |
| RESOLVE_BLOCKERS | `blockers:Blocker[]` | Exact current-owner blockers only, with current approved gate coverage and evidence. Retain other/global blockers. Records the caller's assessed resolution, never silently removes blockers during selection. |
| SELECT | `nextItemId` | Explicit item in this work/round; current item must be complete or a fully decomposed ancestor of target. Dependencies and ancestor gates/blockers must permit it. A new GROUP may be selected to prepare its documents while retaining its own initial blocker/gate. No automatic choice, round switch or impact bypass. |
| START | none | Current leaf TODO→IN_PROGRESS; dependencies, current/ancestor gates and blockers checked. Approved packages must cover leaf inputs/scope/completion. No product command is executed. |
| COMPLETE | `resultRefs:Ref[]` | Current leaf IN_PROGRESS→DONE only with actual bound results and conditions; check dependencies, blockers and current approvals again. The last leaf completing a STEP also requires that STEP's approved packages cover all actual descendant results. A planning-only approval cannot close a product step. |

Prepare product documents under separate authoring authority while their GROUP is current, then decompose and use `approve` to materialize exact planning/content gates. Keep planning and final-output reviews distinct when their conditions differ. Existing approved pilot documents need provenance reconciliation, not invented confirmation. Ordinary intermediate tasks do not gain a mandatory Human gate merely from being split; mandatory STEP gates and chosen child gates still apply.

Use stable product documents for scope/completion and review packages. Approving the mutable entire `.kidea/work.md` also binds its checkpoint/progress fields; changing it can invalidate that approval and the writer rejects the projection. Do not bypass or silently preserve such a review. Use supported review operations with appropriate source selection.

The writer retains before/planned bytes, input snapshots, tool identity, authority statement, request and readback. Wrong root/owner/project/checkout, stale basis/source, incomplete dependency, missing/unapproved/unrelated gate, unsafe reference or pending write rejects dependent work. A partial write remains pending; never replay/delete its marker or claim success.

`WORK_RECORDED` means the metadata transaction completed, not product execution, authenticated acceptance or phase completion. `WORK_NOT_COMPLETE` retains the actual failure/pending state. Inspect it before further work.

## Impact and boundaries

An active return stack, unresolved or stale impact prevents these operations. Use `change` to assess/review/CLOSE; then resume the original unfinished item. CLOSE checks global blockers and those belonging to impact/return owners, ancestors and dependencies. Independent future-step blockers remain on disk and do not require finishing the MVP before closing one scoped impact.

This version supports initial decomposition and scoped progression in the existing round. It does not rewrite an already decomposed work tree, create a new round/release, execute product commands, recover pending effects or authenticate approvals. Feature-driven changes to the main work tree still need a separately defined supported operation; do not use impact REPLAN as if it rewrites original work items. Report that gap at its owning R09 task before dependent work.
