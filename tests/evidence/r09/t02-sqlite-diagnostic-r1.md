# R09-T02 — kết quả chẩn đoán SQLite WAL/TSan r1

Human “duyệt nhé” cho gói tại `2a94de3a4febe75441c088523cca22113d09a081`. [Approval receipt](t02-sqlite-diagnostic-r1/authorization.json). Đã chạy đúng manifest `85316832b9d96ca68f9d235bf21e61e087aea39ee1524c86546af658adc9c918`, source `01d8d7ffd317b43e3c3650568595163078428f10`, pilot HEAD `14cb14e` lúc bắt đầu. Dùng image/toolchain GCC13/SQLite3.53.4 đang có, instrumentation TSan đầy đủ; không suppression hoặc chỉnh vendor/backend.

## Quan sát thực

| Mẫu | Exit | Kết quả |
|---|---:|---|
| detector-control | 66 | TSan bắt race cố ý ở `deliberatelyRacy`; detector đang hoạt động. |
| wal-parallel | 66 | Tái hiện đúng write `walIndexWriteHdr:68469` / read `walIndexTryHdr:70135` trong SQLite WAL shared header, không có mã backend/Drogon. Dừng trước oracle tổng100/quick_check. |
| delete-parallel | 0 | Hai thread/hai connection, đủ100 cập nhật, quick_check=ok, không báo race trong lượt này. Chỉ là đối chiếu, không đổi journal ứng dụng. |
| wal-serial | 0 | Hai connection gọi tuần tự, đủ100 cập nhật, quick_check=ok, không báo race trong lượt này. Không thay ca đồng thời. |

[Observations](t02-sqlite-diagnostic-r1/observations.json), [log từng mẫu](t02-sqlite-diagnostic-r1/run/sqlite-diagnostic/out/), [runner](t02-sqlite-diagnostic-r1/run/results.json). Exit0 của wrapper có nghĩa đã thu đủ phép chẩn đoán, **không phải component/product PASS**.

Đây là bằng chứng rằng cùng cảnh báo xuất hiện chỉ với SQLite WAL và GCC TSan, không cần backend. Kết hợp [ghi chú vendor tag-20200519-1](t02-build-r5/sqlite-wal-source-excerpt.txt), kết quả hỗ trợ giả thuyết giới hạn nhận diện đồng bộ WAL của sanitizer. Chưa chứng minh cảnh báo vô hại trong mọi trường hợp, chưa xác nhận thuật toán SQLite hoặc toàn bộ ứng dụng, chưa tự cấp ngoại lệ. WAL parallel không chạy tới cuối nên không báo count100/quick_check cho mẫu này.

## Bảo toàn và giới hạn

[Receipt](t02-sqlite-diagnostic-r1/receipt.json):54 sourcehash khớp trước/sau lượt, pilot sạch/không remote lúc chạy. [Container](t02-sqlite-diagnostic-r1/run/sqlite-diagnostic/container-state.json):17:09:54.452Z–17:10:09.068Z ngày2026-09-17 (00:09:54–00:10:09 ngày2026-09-18 tại Việt Nam), khoảng14.6giây, exit0, không OOM. Đã thu hồi đúng container; readback label rỗng. Output8344KiB (~8.15MiB), giữ nguyên tại `/Users/kendrick/Desktop/kidea-t02-build-lab/t02-sqlite-diagnostic-ac40d418-91e4-4e63-9328-5811f44ba391/`; log, DBfake, tool inventory, artifact hashes được sao lưu trong repo. Không tải/cài macOS/cloud/port, không chạy lại r5.

Sau lượt chỉ cập nhật bàn giao/checkpoint, không đổi mã. Public SAVE CONTINUATION_SAVED, giữ W-001/gates; pilot local HEAD `c578edc6adf4ded30158d727809db7813613dbbe`, không remote/push. Các manifest đã dùng không được replay; sửa docs sau run không làm thay kết quả source đã đóng băng.

## Điểm tiếp tục

R5 vẫn FAIL_TSAN: dev và ASan/UBSan đạt46CTest+18HTTP mỗi preset; TSan40/46,6FAIL; TSanHTTP/release chưa chạy. R09 IN_PROGRESS/T02 chưa nghiệm thu/R10 chưa mở. Tiếp theo review phương án tương thích SQLite–TSan và phạm vi chứng minh trước gói build mới. Giữ nguyên backend/WAL/test hiện hành; không thêm mutex giả để tuần tự hóa ca race, đổi sang DELETE, tắt instrument SQLite hoặc chấp nhận blanket suppression chỉ để xanh. Nếu đề xuất compiler/annotation/exception khác, phải nêu rõ phần thay đổi và vùng chưa được kiểm, không đổi sáu FAIL cũ thành PASS. Lượt này không cấp quyền đó.
