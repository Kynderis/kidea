# R09 A–E — implementation and pilot preparation evidence

2026-09-17. Human approved all A–E in the package at `77f5caf`; this is implementation evidence, not Human acceptance of B/C or R09. A accepts D1 at `26dffeb`; [acceptance](../../../docs/R09_D1_ACCEPTANCE.md).

## Scope and source

Kidea `Kynderis/kidea`, local master, base77f5caf plus the exact working-tree source manifests in [ae-r1](ae-r1/). macOS14.7/Intel x64, ordinary uid501, Node24.19.0 already installed. No downloads, system changes, Docker/cloud workload, AI trial or application build/deploy. Tests use local synthetic fixtures; native/Windows/Silicon and postponed real-pilot view are not certified.

B1 adds reviewed replanning and CHANGE/BUGFIX rounds; B2 adds release/attempt/observation records; B3 adds explicit completion of supported interrupted writes. Six public actions and schema2 retained. Read [contracts/review scope](../../../docs/R09_AE_REVIEW.md) for limitations.

## Failure history retained

- `b1-attempt-01.log`:4/5; positive proposal fixture omitted required reassessment of downstream steps. Corrected the proposal to include those obligations, retaining the rejection rule. Attempt02:6/6; additional negative/interop cases followed.
- `b2-attempt-01.log`:3/3 initial delivery groups. Final suite also tests a BUGFIX round pinned to a public release.
- `b3-attempt-01.log`:0/3 because the synthetic SAVE request used an unsupported field instead of the existing checkpoint contract. Fixed fixture shape, not runtime permissiveness. Attempt02:3/3; attempt03:4/4 including CREATE-only bootstrap and changed request/Git.
- `full-attempt-01.log` and02: harness inventory hit Node's default1MiB stdout buffer (`ENOBUFS`), before running suites. Git existed. The collector now uses the trusted Git resolver and a32MiB inventory buffer; no test timeout/oracle or product limit changed.
- `full-attempt-03/`: all8 suites PASS,167source files unchanged. This is pre-interop-fix evidence, not the final-source claim.
- `interop-before-fix.log`: both new cases FAIL, revealing `IMPACT_NOT_RESOLVED` from an unrelated paused-round blocker and `DELIVERY_PIN_UNAVAILABLE` for a valid Git-pinned historical release/plan. Fixed impact return-frame selection while retaining global/current dependency blockers; read bound Git evidence without fetch or replacing historical identities.
- `interop-recovery-after-fix.log`:6/6 PASS. Includes recovery permission/checkout drift. Full final-source regression is collected separately; no failed run removed.
- Pilot environment receipt initially failed after the authorized link edits because this Python runtime lacks `os.listxattr`. Preserved preimages and verified exact link-only before/after bytes; used system `xattr` to read attribute names. [Record](ae-r1/pilot/preparation-failure.txt). No repeated mutation or rollback.

## Final regression

**PASS on the final source:** [summary and 168-file source manifest](ae-r1/full-attempt-04/summary.json). All 9 suites exited 0 and all 168 inputs were unchanged before/after; current bytes matched again during evidence collection. Core 293/293; cycles 7/7, delivery 4/4, recovery 4/4, interop 2/2; R06 19 groups plus 5 boundary groups; R07 19 groups; R08 local 14/14. No skipped/cancelled/todo cases in the Node test suites. R08 validates local guards/receipts and an in-memory migration, not replay of historical workloads. The 25 helper script hashes used by public pilot init/SAVE match the final regression candidate ([comparison](ae-r1/pilot/helper-source-match.json)). Changed Kidea document paths: 455 checked, no missing local targets ([check](ae-r1/document-path-check.json)).

## Pilot C

- Read all21 inherited documents and137 source IDs, preserving R03–R05 approval provenance. Before hashes all matched R05 Web r2. Native profiles remain historical Future.
- Exactly23 Windows links changed in8 authorized files;13 inherited files unchanged. Added only two documentation files and `.gitignore`; [before/after](ae-r1/pilot/), [document checks](ae-r1/pilot/document-check.json), [20 provenance anchors](ae-r1/pilot/provenance-anchors.json).
-1,005 internal links checked;35 GitHub provenance links verified against local Git objects,20 with anchors. All137 application source IDs remain NOT_RUN, not application PASS.
- All7,906 sample file/link entries retain original bytes/modes/link targets; [preservation](ae-r1/pilot/samples-after.json). Samples remain on disk and ignored by pilot Git.
- Created local master with existing Git identity, no remote/push. Initial docs commit `dae0875551ca33d35ce681982ca69c42df4a8478`; public-init metadata commit `e5dad70a166cfa635ce4d12bc4ce950c1911e233`.
- Public `init` returned INITIALIZED, project `36ea2fe5-f510-4003-ba02-199f7a723322`; public status OK, resume WAITING/W-001. [Source/tool receipt](ae-r1/pilot/init-receipt.json), [init state](ae-r1/pilot/final-state.json). Public SAVE then retained W-001/blockers and saved the approved continuation; local commit `8ce0af4b3262fe3b2bd14a1b4b653a46e95b059b`, [final readback](ae-r1/pilot/continuation-final-state.json). Git remains clean with no remote. Helper working-tree hashes are recorded explicitly; do not represent base77f5caf alone as the implementation version.

C prepared an execution-plan/manifest checklist for review. Source/image/commands/quota of the **new workshop application** are not yet materialized; the plan clearly marks them NOT_READY. C does not authorize authoring/building/deploying that application. D/E are recorded for their approved stages, not activated in the initial MVP or certified by fixture tests.

R09 remains open. B/C output review, concrete T02 execution authority and later product gates remain; old postponed obligations are neither PASS nor silently removed. No R10 execution opened.

Final Git diff whitespace check: source/tests/authored documentation clean. The full raw-evidence check reports 38 trailing spaces emitted by the R06 runner in attempts03/04; these exact stdout bytes are retained to preserve their recorded SHA256, not edited into a different log.
