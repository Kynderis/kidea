Đã kiểm tra sâu hơn và tìm ra điểm cần quyết định:

- CLI đã đổi sang **0.154.0-alpha.6.2**; bản cũ không còn. Tôi đã kiểm đúng binary mới và xuất schema giao tiếp trên D.
- Giao diện được kiểm **không có chức năng xem trước danh sách ACL mà setup sẽ đổi**. Vì vậy chưa chứng minh được điều kiện “setup chỉ tác động thư mục thử”.
- Thiết lập sandbox tiêu chuẩn có thể tác động tài khoản, ACL và firewall ngoài fixture; **không đồng nghĩa cấp toàn quyền cho AI**. [OpenAI Docs](https://learn.chatgpt.com/docs/windows/windows-sandbox).

Chưa chạy sandbox/AI hay thay quyền máy. Đã lưu [báo cáo](D:/Code/kynderis/kidea/tests/evidence/r02-t10-launcher-0154-interface.md) và push `master`.

**Bạn có chấp nhận cho Codex thiết lập sandbox tiêu chuẩn trên máy, không giới hạn thay đổi hạ tầng trong thư mục thử, để tiến tới kiểm tra không gọi AI không?** Nếu vẫn giữ giới hạn chỉ-fixture, hiện tôi chưa có cách đã được xác minh để chạy tiếp.
