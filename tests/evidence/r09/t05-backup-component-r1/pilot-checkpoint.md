# T05 backup component checkpoint r1

Source `a1102ce` adds an online SQLite backup component, durable in-snapshot watermark, destination hash/integrity verifier, measured headroom, and an explicit process-local SQLite access boundary for the embedded writer/collector fixture. The release snapshot is converted to rollback-journal mode before publication so the transferred artifact is one private `0600` file without WAL/SHM sidecars.

The frozen r5 build manifest SHA256 is `16e2bd76dccae1d74f214e7352238f7dd1fba2064783336bf8bf9ef549b226d6`. Dev, ASan/UBSan, TSan and release all exited 0. Every preset ran 174 telemetry, 20 backup and 77 update checks with empty sanitizer stderr for those additions. TSan retained exactly the seven inherited SQLite/WAL cases and 14 reports allowed by `EX-T02-WAL-01-r2`; HTTP was clean. The exception and test oracles were not widened.

The release CLI created and independently reverified a 2,408,448-byte snapshot with hash `2c4ebb1cae1feb615e525a6f5d840f6079dcc534e205f0ad80ead65869ad7e88`, watermark `r09_t05_cloud_20260919`, `quick_check=ok`, journal mode `delete`, mode `0600`, and no sidecars. Headroom measured the real target and remained below warning/stop thresholds.

That same snapshot was transferred with authenticated `gcloud compute scp` to a temporary Debian 12 x86_64 `e2-micro` instance in project `kidea-508908`. Python/SQLite already present on the VM rechecked ownership/mode, bytes, hash, immutable quick check, journal mode, watermark/epoch and file/directory fsync. The returned receipt is `INDEPENDENT_HOST_SNAPSHOT_VERIFIED` and explicitly lab-only. The VM and boot disk were deleted; both post-delete inventories are empty.

The failed r1 TSan fixture, r3 portable-file diagnostic, r4 HTTP overlap and authoring failures remain in the evidence ledger. The fixes changed the fixture to a process boundary, forced a single portable snapshot, and made the embedded collector wait at most 100 ms for a completing writer before returning UNKNOWN. Raw external evidence remains under the named lab directories; compiler scratch was hashed then removed without deleting logs or reports.

Public REVISE recorded `R09-T04-OUTPUT-r1` revision 12 as DRAFT. SAVE returned `CONTINUATION_SAVED` with `SAVED_NOTE_NOT_TASK_COMPLETION`; `W-009-ADMIN-OPS` remains IN_PROGRESS. Metadata was committed locally at `23e0588`. The verified complete-history Git bundle for that commit remains on the same Mac and is not an independent-host backup.

[Evidence inventory](inventory.json), [summary](summary.json), [attempt ledger](attempts.json), [independent-host receipt](final/cloud/returned/receipt.json).

This checkpoint proves the component and one authenticated independent-host lab copy. It does not prove scheduling, retention, restore, production recovery, admission/readiness/lifecycle, WQ, G2, output acceptance, or completion of T05/R09. Continue with admission/readiness/lifecycle and remaining functional/operational obligations.
