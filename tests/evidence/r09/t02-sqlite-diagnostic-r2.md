# R09-T02 — diagnostic r2 đã thực thi

Human: “Duyệt diagnostic r2”, sau hồ sơ tại dc20f7a. Chạy đúng manifest SHA256 `33100182a56884d404b49526d8e0d45b134e867a674293db69b822e560b85b51`, source ae8a327, pilot HEAD d3cb602. Manifest giữ nguyên nội dung đề xuất để bảo toàn hash; receipt này ghi quyền và kết quả thực thi. Không replay lượt đã dùng.

| Mode | Exit | Cảnh báo TSan | Oracle dữ liệu |
|---|---:|---:|---|
| detector-control | 66 | 2, tại biến cố ý deliberatelyRacy | Control chạy hết; detector vẫn bắt lỗi |
| wal-parallel | 66 | 2, hai bản sao header WAL | count=100, quick_check=ok |
| delete-parallel | 0 | 0 | count=100, quick_check=ok |
| wal-serial | 0 | 0 | count=100, quick_check=ok |

[Quan sát](t02-sqlite-diagnostic-r2/observations.json), [receipt môi trường/nguồn/cleanup/hash](t02-sqlite-diagnostic-r2/execution-receipt.json), [raw logs](t02-sqlite-diagnostic-r2/run/sqlite-diagnostic/out/), [runner](t02-sqlite-diagnostic-r2/run/results.json). Flags thực được ghi trong toolchain.txt: halt_on_error=0:exitcode=66:report_bugs=1. Wrapper exit0 chỉ xác nhận thu thập hoàn tất, không phải product PASS.

## Review hai cảnh báo

Cảnh báo thứ nhất: walIndexWriteHdr:68469 ↔ walIndexTryHdr:70135, bản sao aHdr[1], giống r1. Cảnh báo thứ hai: walIndexWriteHdr:68471 ↔ walIndexTryHdr:70133, bản sao aHdr[0]; đây là stack mới được quan sát khi cho chạy tiếp, đã đối chiếu riêng với source vendor. Hai cặp nằm hai phía walShmBarrier của cơ chế đọc đôi, so sánh và checksum được vendor giải thích tại tag-20200519-1. Không có stack cảnh báo khác trong mẫu WAL của lượt này.

Dữ liệu mẫu không bị mất cập nhật và quick_check đạt trong một lượt; chưa chứng minh an toàn cho mọi lịch chạy, crash/cross-process hoặc toàn backend. Bằng chứng hỗ trợ giả thuyết giới hạn TSan với giao thức WAL này, không tự chứng minh false-positive hoặc cấp miễn trừ. Không đổi compiler, annotation, suppression, vendor, backend, test oracle hoặc journal mode ứng dụng.

## Giới hạn và điểm tiếp tục

Một container, 15.30 giây (2026-09-17T17:31:52Z–17:32:07Z; ngày 18/09 giờ Việt Nam), không OOM; đã thu hồi và đọc lại label rỗng. Output 8316 KiB, giữ tại đường dẫn trong receipt. Không tải/cài/port/cloud. Lưu raw log và DB giả, binary giữ ở output local và có hash; không commit binary. 54 hash nguồn không đổi sau chạy, pilot sạch/không remote, không sửa metadata hay cấp gate giả.

R5 vẫn 6 FAIL TSan; TSan HTTP và release NOT_RUN. T02 chưa nghiệm thu, R09 IN_PROGRESS, R10 chưa mở. Bước tiếp là chuẩn bị quyết định xử lý gate SQLite–TSan: phải chỉ rõ chính xác vùng kiểm bị ảnh hưởng, bằng chứng bổ sung, cách vẫn bắt race của ứng dụng và cảnh báo mới, trước bất kỳ ngoại lệ/compiler change/full build mới. Không chạy thêm diagnostic chỉ để lấy kết quả xanh và không dùng dữ liệu PASS để thay TSan PASS. Điểm tiếp tục trong Kidea là hiện hành; checkpoint pilot trước lượt vẫn giữ nguyên và cần đọc cùng receipt này khi resume.
