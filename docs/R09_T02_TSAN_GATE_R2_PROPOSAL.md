# EX-T02-WAL-01 r2 — thêm một cặp truy cập WAL đã thấy trong r6

**PROPOSED, chưa duyệt/chưa áp dụng.** [R6 thực](../tests/evidence/r09/t02-build-r6.md) dừng đúng gate; r1 không tự mở rộng sang report mới. Human chỉ đã duyệt r6 một lượt và EX r1. Đây là quyết định bổ sung hẹp, không xin lại hai cặp cũ hay nghiệp vụ.

## Phát hiện và đề xuất

Cả sáu ca I09/C01–C05 ghi hai report: cặp cũ `walIndexWriteHdr:68469 ↔ walIndexTryHdr:70135` và **cặp mới write `walIndexWriteHdr:68471` (memcpy) ↔ read `walTryBeginRead:70780` (memcmp)**. Cặp mới đọc aHdr[0] ở offset0; nó không phải cặp `walIndexTryHdr:70133` trong diagnostic r2. [Đối chiếu từng report](../tests/evidence/r09/t02-build-r6/new-reader-review.json), [source đúng hash](../tests/evidence/r09/t02-build-r6/new-reader-source.txt).

Đề nghị mở rộng có điều kiện đúng **một cặp mới** vào EX-T02-WAL-01 r2 cho một đợt kiểm T02 kế tiếp, giữ tất cả điều kiện r1. Cùng SQLite SHA `b1dd5d74ec7f29055a6684fa06fb3c2f6821c87dd38f9a458dfd2e8a1db28189`, GCC13.3.0/image cũ. Chỉ xét write/read8byte cùng địa chỉ, write stack memcpy115/107→68471, read stack memcmp844/840→70780, shared header `*-shm` offset0, đủ report/summary/exit66 và provenance như r1. Không chấp nhận mọi memcmp hoặc mọi truy cập SQLite.

## Vì sao đề xuất, và giới hạn

Nguồn vendor tại70744–70789 giải thích bước này: sau lấy read-lock, kiểm header live có thay đổi so với bản cache không; có barrier trước phép so sánh; không khớp thì unlock và WAL_RETRY để tránh đọc snapshot sai khi writer/checkpointer thay đổi dữ liệu. Điều này hỗ trợ giả thuyết đây cũng là cảnh báo về giao thức đồng bộ WAL đặc thù. Nó chưa là chứng minh an toàn tuyệt đối, không được tự gộp vào hai cặp đã review trước.

R6 chạy tới cuối đủ796 assertion chức năng dưới TSan, control bắt lỗi/mixed unknown bị chặn; dev/ASan đều đủ46CTest+18HTTP. Chưa có TSanHTTP/release, chưa đủ kết luận T02. Rủi ro còn lại giống r1: một lỗi thật có cùng chữ ký có thể bị phân loại vào nhóm được miễn có điều kiện; không thể dùng việc dữ liệu đạt trong một lịch chạy để chứng minh không có race trong mọi lịch.

Một vấn đề riêng là nhãn `db.sqlite-shm (deleted)` trong report. [Linux man-pages](https://man7.org/linux/man-pages/man5/proc_pid_maps.5.html) giải thích hậu tố cho file-backed mapping đã bị unlink và lưu ý tính mơ hồ của tên. Do đó nhãn này không được dùng một mình làm bằng chứng an toàn. Parser đã sửa riêng phần định dạng để chấp nhận đúng hậu tố này khi **hai access stack đã duyệt và offset đều khớp**; nhãn khác/offset khác vẫn chặn. Cặp memcmp mới vẫn bị chặn sau sửa, có regression cho cả sáu log thật. Không thay report r6 hoặc tự biến thành PASS.

## Điều kiện triển khai nếu duyệt

- Giữ instrumentation, report_bugs=1, exit66 và raw CTest/JUnit FAIL. Thêm loại report của đúng cặp mới; không tắt cảnh báo hay sửa source vendor/backend/assertion.
- Bổ sung regression thuận từ sáu log thật, nghịch thay read function/line/interceptor/offset/size/hash, trộn cảnh báo ứng dụng, thiếu log và lỗi dữ liệu. Mọi report ngoài ba cặp vẫn BLOCKED. Dữ liệu chức năng phải đủ tất cả oracle r1, không chỉ đủ số ca.
- Live controls và đối chiếu nguồn/toolchain vẫn bắt buộc ở lượt build mới. Báo kết quả cao nhất là có giới hạn cần review, không TSan sạch, không tự nghiệm thu.
- Duyệt r2 chỉ mở cập nhật policy/classifier/kiểm offline và hồ sơ nguồn cuối trong phạm vi pilot/Kidea đã có; không cấp thêm Docker/cloud/download. Khi nguồn/test đã hoàn chỉnh, trình manifest build mới với giới hạn tương đương r6. Không dùng lại manifest/deadline r6 đã tiêu thụ.
- Hết hiệu lực khi source/SQLite/compiler/image/flags/logic DB hoặc chữ ký report thay đổi, không chuyển sang ứng dụng/task khác. Human review kết quả mới trước dùng để qua gate.

**Đề nghị Human duyệt phần bổ sung một cặp truy cập trên.** Đây là mở rộng phạm vi ngoại lệ so với r1 nên cần quyết định rõ; không phải sửa lỗi parser thông thường hoặc suy quyền từ việc cùng file SQLite. Nếu không chấp nhận giới hạn này, giữ T02 blocked và review hướng compiler/vendor khác trước thực thi; không hứa đổi compiler sẽ tự chứng minh an toàn.
