# R09-T02 build r6 — FAIL ở gate báo cáo TSan

Human **“Duyệt r6”** cho gói tại Kidea f67626a. Chạy đúng một lượt manifest `5685e9990b63c69fe943c2351e2badb25f6737a3e944d48f0420ecdda9c211c9`, source `763ab55cb238ab3ccdab4a984525a883b39b44f7`, pilot HEAD03b20b5 lúc chạy. [Quyền/môi trường](t02-build-r6/authorization.json), [runner FAIL](t02-build-r6/run/results.json), [receipt và hash](t02-build-r6/execution-receipt.json).

| Preset | Kết quả thực |
|---|---|
| dev | Build/format,46 CTest,796 assertion, toàn bộ clang-tidy,18 HTTP PASS; server exit0 |
| ASan+UBSan | Build,46 CTest,796 assertion,18 HTTP PASS; server exit0 |
| TSan | Build và controls đạt. Raw CTest40/46 PASS, sáu ca exit66;796 assertion chức năng đều PASS. Gate BLOCKED: SANITIZER_HEADER_LOCATION |
| release | NOT_RUN vì fail-stop |

TSan HTTP/collector gate hoàn chỉnh chưa đạt và HTTP chưa chạy. [Đối chiếu từng ca/assertion](t02-build-r6/observations.json), [raw cases](t02-build-r6/run/tsan/out/tsan/raw-cases/), [control](t02-build-r6/run/tsan/out/tsan/controls-classification.json). Việc đủ796 assertion không phải TSan sạch hoặc component PASS. Không đổi kết quả FAIL của r5/r6.

## Hai vấn đề khác nhau

1. Vị trí mapping có nhãn `db.sqlite-shm (deleted)+0x30` thay vì dạng không suffix trong diagnostic. Bộ phân loại r1 chưa nhận dạng suffix nên dừng ở report đầu. Đây là thiếu hỗ trợ định dạng trong parser; không phải lý do để tự bỏ toàn bộ warning.
2. Đọc trọn log sáu ca I09/C01–C05 cho thấy tổng12 report: sáu cặp cũ write68469/read70135 và **sáu cặp mới write walIndexWriteHdr68471 / read walTryBeginRead70780 qua memcmp**. Cặp mới khác walIndexTryHdr70133 đã duyệt. Ngay cả khi sửa định dạng, r1 vẫn phải chặn; đây là giới hạn ngoại lệ hoạt động đúng.

[Inventory từng report](t02-build-r6/new-reader-review.json). [Source excerpt đúng hash](t02-build-r6/new-reader-source.txt) cho thấy memcmp mới là bước kiểm header live sau read-lock/barrier, mismatch trả WAL_RETRY. Đây là căn cứ review, chưa chứng minh warning vô hại. [Đề xuất EX r2](../../../docs/R09_T02_TSAN_GATE_R2_PROPOSAL.md) khoanh đúng cặp mới, PROPOSED/chưa áp dụng.

## Sửa hữu hạn sau run, không mở rộng ngoại lệ

Đã bổ sung hồi quy từ log r6; [FAIL trước sửa](t02-build-r6/deleted-suffix-regression-fail.log) giữ nguyên. Chỉ nhận thêm hậu tố chính xác `(deleted)` khi cả hai stack/offset vốn đã được duyệt khớp; suffix/offset khác vẫn chặn. Tách lỗi ACCESS_STACK để không gọi mọi khác biệt là lỗi vị trí. [Patch](t02-build-r6/post-fix.patch), [snapshot](t02-build-r6/post-fix-source/), [51 kiểm policy](t02-build-r6/policy-after-format-fix.log) và [34 kiểm gate](t02-build-r6/gate-after-format-fix.log) PASS: tổng85 offline. Cả sáu log mới vẫn BLOCKED vì memcmp nằm ngoài r1. Không sửa vendor/backend/assertion hoặc tự chạy lại container.

[Linux man-pages](https://man7.org/linux/man-pages/man5/proc_pid_maps.5.html) mô tả suffix của file-backed mapping và tính mơ hồ của pathname. Vì vậy tên mapping không đủ để xác nhận an toàn; classifier còn yêu cầu source identity và access stack chính xác. Bản sửa là định dạng, không kết luận về lifecycle mapping hoặc tính đúng của thuật toán SQLite.

## Thu hồi, bảo toàn, điểm tiếp tục

Ba container chạy 00:26:12–00:43:00 UTC ngày18/09/2026 (07:26–07:43 giờ Việt Nam), khoảng16phút48giây; không OOM, đã thu hồi và readback label rỗng. Output1960772KiB (~1.87GiB), không vượt trần; giữ tại đường dẫn receipt. Không tải/cài/port/cloud. Lưu1502file log/DBfake/Testing và hashes, binary giữ local có SHA.68hash nguồn nguyên ngay sau run, trước bản sửa parser.

Pilot bản sửa source6308476, HEAD `f52d38c8b1dae31b1f440055f913778b5e225b6c`, sạch/không remote. [Public SAVE](t02-build-r6/execution-save.json) CONTINUATION_SAVED giữ W-001/gates; [receipt sau sửa](t02-build-r6/post-fix-receipt.json). Build manifest r6 đã tiêu thụ, không dùng lại trên nguồn thay đổi. T02/R09 chưa nghiệm thu, R10 chưa mở. Bước tiếp: Human quyết định cặp mới trong EX r2; sau quyết định mới triển khai phạm vi ngoại lệ và chuẩn bị manifest build khác.
