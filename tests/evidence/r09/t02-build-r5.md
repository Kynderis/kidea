# R09-T02 build r5 — dev/ASan+UBSan PASS, TSan FAIL SQLite WAL

Human “duyệt nhé” cho gói tại e8231b0. [Approval](t02-build-r5/authorization.json). Manifest1fc4125a, source539e2b3/HEAD4d30799; Mac Intel/Docker linux amd64/Node24 có sẵn. Source51hash nguyên tới sau lượt; không tải hoặc cài mới.

| Preset | Kết quả thực |
|---|---|
| dev | Formatter/build/46CTest/collector/clang-tidy backend và tests/18HTTP PASS; server exit0. |
| ASan+UBSan | Build/46CTest/collector/18HTTP PASS, server exit0; không sanitizer failure. |
| TSan | Build qua,40/46CTest PASS,6FAIL I09/C01–C05. Collector/HTTP chưa chạy. |
| release | NOT_RUN do lượt dừng tại TSan. |

[Test summary](t02-build-r5/test-summary.json), [runner](t02-build-r5/run/results.json), [dev logs](t02-build-r5/run/dev/out/dev/), [ASan logs](t02-build-r5/run/asan-ubsan/out/asan-ubsan/), [TSan logs](t02-build-r5/run/tsan/out/tsan/). Không skip; dev/ASan có796assertion observations mỗi preset,0missing/failed; HTTP18/18 bao gồm JSON regressions. Các kết quả này chưa là review mọi variant137nghĩa vụ/whole-app acceptance.

[Chẩn đoán đọc nguồn](t02-build-r5/tsan-diagnosis.json): cả6report cùng write walIndexWriteHdr:68469/read walIndexTryHdr:70135 ở SQLite shared WAL header, qua COMMIT/BEGIN IMMEDIATE từ Store. [SQLite nguyên hash](t02-build-r5/sqlite-wal-source-excerpt.txt) có tag-20200519-1 về possible false-positive với double-read/barrier; macro SQLITE_NO_TSAN ở vendor chỉ kích hoạt với Clang, trong khi build dùng GCC13. Đây là căn cứ để điều tra, không xác nhận false-positive hay lý do tắt TSan. Không sửa vendor/suppression/đổi expected/giảm concurrency.

[Receipt](t02-build-r5/receipt.json):3container thu hồi/readback label rỗng; output1954848KiB (~1.86GiB) giữ nguyên tại `/Users/kendrick/Desktop/kidea-t02-build-lab/t02-ba920f4d-1f9d-4ce5-b76d-13a81d51edde/`. Bản sao log/DBfake/Testing và hash binaries giữ trong repo; nguồn và mọi FAIL r1–r4 bảo toàn. Các trạng thái container trong run/dev,run/asan-ubsan,run/tsan ghi thời gian/exit thực.

Đã chuẩn bị [gói diagnostic riêng](../../../docs/R09_T02_SQLITE_DIAGNOSTIC_REVIEW.md), chưa chạy, không sửa backend/test hiện hữu. Public SAVE CONTINUATION_SAVED giữ W-001/gates; pilot source01d8d7f/HEAD14cb14e, local master sạch/không remote. R09 IN_PROGRESS, T02 chưa nghiệm thu/R10 chưa mở. Bước tiếp là diagnostic đã review, không blind rerun hoặc coi6FAIL là PASS.
