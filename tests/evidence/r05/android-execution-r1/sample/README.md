# Android A1 lab — SDK37.0 / target37

Synthetic R05 sample, not product code or device certification. Current authoritative outcome is in the Kidea repo `tests/evidence/r05/android-execution-r1.md`. The SDK36.1 full run retains its lint FAIL. Human approved SDK37.0/target37; current source includes the structural identity cache fix and 11 unit tests. No lint suppression or baseline was introduced.

This sibling is outside Git. The repo retains its source snapshot and separate final Gradle locks / verification metadata. Binary tools, caches, APKs and the generated debug private key remain only in Docker volume `kidea-r05-a1-work`.

## Approved execution

Use the Node24+ runtime available on the host and repo helpers `tests/r05/android-run.mjs` / `android-exec.mjs`. Do not directly start containers or reset `start.json`, download counters or disk baselines. The launcher shares the E2/A1 aggregate quota guard and enforces the original deadline. Replays after expiration need the specific continuation authorization recorded in the repo.

- `bootstrap.mjs`: CREATE-only tool downloads/extraction using the approved manifest, archive path checks, size and publisher checksums. Installing SDK package metadata is part of bootstrap. The separate approved `sdk37.mjs` installs platform37.0 revision2 and keeps platform36.1 for evidence. Existing volume is retained; do not rerun bootstrap over it.
- `gradle-stage.mjs resolve`: bounded Google Maven/Maven Central bridge on container loopback only; resolve locks and SHA256 verification metadata. It never opens a host port. Upstream HTTPS validation stays enabled.
- `maven-audit.mjs`: verify publisher checksums for downloaded jar/aar files and retain POM license metadata. Review the OSV receipts and scoped dependency gate separately; an empty result is not certification.
- `gradle-stage.mjs offline --continue lintDebug lintRelease testDebugUnitTest testReleaseUnitTest assembleDebug assembleRelease`: all required tasks with network=none. `--continue` collects independent task outcomes despite lint failure; exit1 remains FAIL.
- `mutations.mjs`: six isolated CREATE-only copies; earlier 10-test runs are retained in separate evidence namespaces. The final revision (`mutations.mjs complete`) runs all11 unit cases and requires the named oracle to fail; build/compile failure alone is not a detected mutant.
- Run the full original tasks with `--rerun-tasks` after mutations. `collect.mjs` captures reports, source/lock/artifact hashes and signing status without copying APKs/private keys to Git.

No KAPT, remote/imported build cache, application network permission, real backend, real tokens, device connection, emulator, ADB or NDK invocation. The critical/high advisory matches retained in the repo are tooling/input-path findings assessed only for this closed lab. Reassess before any external input, networking, device work, signing identity, toolchain change or distribution.

The test helpers close their parent coroutine jobs in finally blocks so assertion failures do not leave tests hanging; assertions verify owner cancellation before cleanup. No expected assertion was relaxed for mutants.
