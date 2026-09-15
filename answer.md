Tôi định **kiểm tra khả năng cách ly trên Windows bằng script cố định trước, chưa chạy AI**, theo trình tự:

1. **Ghi nhận trạng thái trước khi thử:** cấu hình Codex, tài khoản sandbox, quyền thư mục liên quan và quy tắc firewall. Đây là bản đối chiếu, không phải bản sao lưu toàn máy.

2. **Chuẩn bị dữ liệu giả trên ổ D:** một thư mục được phép đọc/ghi, một thư mục phải bị chặn và nơi lưu bằng chứng riêng. Không dùng tài liệu cá nhân để thử, không sửa mã nguồn Kidea.

3. **Cho Codex thiết lập sandbox Windows tiêu chuẩn:** không dựng VM/WSL, không chạy AI với toàn quyền. Tuy nhiên, bước này có thể tạo hoặc cập nhật tài khoản sandbox, quyền truy cập thư mục và firewall ngoài thư mục thử, kể cả trạng thái trên C. Đây chính là phần quyền bổ sung tôi đang đề xuất. [OpenAI Docs](https://learn.chatgpt.com/docs/windows/windows-sandbox).

4. **Chạy một lượt kiểm tra có giới hạn thời gian:** xác nhận đọc/ghi được nơi cho phép, bị chặn ở nơi cấm và không truy cập được mạng. Nếu lỗi hoặc quá hạn thì dừng tiến trình thử và giữ log; không tự chạy lại liên tục.

5. **Đối chiếu sau thử và báo kết quả:** nêu rõ kiểm tra nào đạt, thay đổi nào quan sát được. Nếu có thay đổi ngoài dự kiến, dừng để xử lý; không tự gỡ quyền hoặc sửa firewall theo phỏng đoán. Chỉ sau đó mới chốt việc chạy các phiên AI kiểm chứng Kidea.

**Giới hạn cần nói thẳng:** hiện chưa xem trước được đầy đủ những quyền mà setup sẽ thay đổi, nên tôi không thể hứa “chỉ tác động ổ D” hoặc “hoàn tác tuyệt đối mọi thay đổi”.

Đây là kế hoạch đề xuất; tôi chưa thực hiện các bước thiết lập và chạy thử trên.
