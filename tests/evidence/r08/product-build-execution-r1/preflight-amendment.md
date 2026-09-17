# B1 approval and preflight repair

Human approved B1 and R08-TIDY-01: “Duyệt B1 và R08-TIDY-01, làm tiếp R08.” Source HEAD: becb96fd42bcef0047b992e3b1d1057a341f50ac.

The original approved manifest adb913ee7257a5bba9f41662eb5559164641105eadfa64b754d479392388d2d0 failed with FILE_SET before output/lock creation or any Docker command. Original runner.stdout.txt and runner.stderr.txt are retained. The source has a legitimate pinned manifest.json; the verifier incorrectly excluded it as package metadata.

The repair makes package self-manifest exclusion explicit; source closure now checks every file including manifest.json. Regression verifies success, missing/tampered/unexpected source manifest and explicit package exclusion. All 3 harness tests PASS; the actual 1051-file source closure PASS.

Revised manifest: 3cbf4f8f9ddea26b14e8a34b1724fd484f89e734a7578ca54ddda63ea93986b7. Only run.mjs/verify.mjs hashes changed. Application source, build commands, images, exception target and limits remain identical. The authorized single workload has not started; this is a preflight harness correction, not a second build allocation.
