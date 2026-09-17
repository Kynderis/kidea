# R09 A–E — phạm vi đầu ra và review

Human “Tôi duyệt tất cả mục trên nhé” duyệt gói tại77f5caf. A đã ghi [nghiệm thu D1](R09_D1_ACCEPTANCE.md); B/C là quyền triển khai/chuẩn bị, chưa nghiệm thu trước đầu ra. D/E đã chốt và không cần hỏi lại nội dung.

## Hợp đồng B đã triển khai

- B1: REPLAN_WORK có disposition mọi item, giữ lịch sử/việc dở, buộc đánh giá consumer không diff. Tạo CHANGE/BUGFIX với10bước, baseline và điểm quay lại; không tự hoàn tất MVP hoặc chuyển Git.
- B2: release/revision và từng attempt/observation qua public resume; exact source/artifact/config/schema/script/release/target, approval và readback. Lịch sử UNKNOWN/FAILED giữ nguyên, retry identity riêng. Chỉ hồ sơ từ bằng chứng caller cung cấp, không xác thực service sống hoặc tự deploy.
- B3: đọc/hoàn tất bộ metadata planned sau ngắt bằng grant mới và basis chính xác. BEFORE/PLANNED/prefix planned hữu hạn được đối chiếu; OTHER/UNKNOWN/đổi nguồn/Git/tool/quyền vẫn chặn. Giữ marker khi recovery bị ngắt; phải đối chiếu và cấp quyền thay guard rõ. Không rollback tùy ý, cleanup hoặc replay ngoại tác; pending cũ thiếu prepared request vẫn chặn.

Các giới hạn B3 là phạm vi hỗ trợ công khai, không làm trạng thái thiếu bằng chứng thành PASS. Triển khai tuần tự B1→B2→B3; sau các lượt kiểm tập trung chạy hồi quy toàn nguồn cố định. [Báo cáo cuối](../tests/evidence/r09/ae-r1.md): 9/9 bộ PASS, core 293/293, 17 ca mới, R06/R07 và 14 ca R08 local đạt; 168 file nguồn giữ nguyên. Giữ mọi FAIL/PASS; kết quả kiểm không tự là nghiệm thu Human.

## C và phần tiếp theo

Đọc đủ21tài liệu/137case, giữ approval R03–R05. Chỉ sửa23Windowslink trong8file, thêm hai tài liệu bàn giao/kế hoạch và `.gitignore`; Git localmaster, không remote/push pilot; samples giữ nguyên ngoài Git. Public init đã thành công sau kiểm helper liên quan; public SAVE lưu điểm tiếp tục. Pilot local commit `8ce0af4b3262fe3b2bd14a1b4b653a46e95b059b`, sạch/không remote, WAITING tại W-001. Không nhập DONE hoặc137casePASS.

Manifest thực thi workshop trong kế hoạch C được chuẩn bị để review, vẫn chưa đủ source/image/command/quota của ứng dụng mới. C không mở code/build/deploy/AItrial. Bước kế tiếp sau review B/C là gói T02 cụ thể; không đề nghị Human duyệt placeholder hoặc lặp approval nghiệp vụ cũ.

D: max2ACTIVE ápT04; hủyPAUSED ápT09, giữ các điều kiện của gói đã duyệt. E: dữ liệu giả/lab, AI DEV và Human chạy script vaiPROD khi exact release sẵn; N/A index công khai, giữ SEO/SSR/UX/readiness. View pilot R07, Windows/Silicon, native hoãn; không tự bỏ gate viewT14, khépR09 hoặc mởR10.
