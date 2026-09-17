# R05 simulator preparation — 2026-09-17

Source before preparation: `ae1e2c231a827050ba8f4328eeb436408af98684`, clean master of Kynderis/kidea. Human authorized the simulator matrix and environment-package preparation; installation is not authorized by this receipt.

[Proposal and matrix](../../../../proposals/r05-simulator-lab-r1.md), [manifest](manifest.json), [metadata collector](../../../r05/prepare-simulator-plan.py). Collector reads public publisher metadata and performs a HEAD probe, with no binary download or simulator execution. Output is CREATE-only. Publisher archive SHA1 values are expectations, not hashes measured on downloaded tools.

Preparation checks completed:

- Three raw metadata files match manifest byte counts and SHA256.
- Four stable Android artifacts selected for macOS/x86_64; total1481684124bytes; no arm64/beta selection.
-315local Markdown link targets in changed/new documents exist (target existence, not a claim that every anchor was checked).
-23A1 snapshot files and23live sample files match the original source manifest;21live pilot files match the SDK37 amendment. Historical evidence and runtime code are unchanged.
-`git diff --check` passes. No core or application tests rerun: changes are documentation and metadata collection only.

Open findings: Xcode archive HEAD302 goes to Apple's unauthorized page; no official archive size/hash verified through this unauthenticated session. iOS18.2 index entry is stable22C150, but its mobileAsset entry does not establish the universal Intel variant URL/hash or actual installed footprint. iOS installation remains NOT_INSTALL_READY. These gaps are not suppressed or reported as PASS.

One local edit attempt was rejected by apply_patch because it contained both delete and add operations for answer.md in the same patch. The rejected patch made no changes; it was replaced with an update operation. This is an editing-tool error, not a build/test result.

Android bootstrap, Android runtime groups N01…N08, iOS build/Simulator, hardware devices and Apple Silicon are not new PASS results from this preparation. Existing Android A1 evidence retains its own source/scope. No account credentials, SDK license acceptance, system installation, OS upgrade or global configuration change occurred.
