**Có thể chạy trên máy hiện tại, không bắt buộc dựng VM.** Đề xuất VM trước đó là phương án cách ly mạnh hơn, không phải vì chạy trực tiếp chắc chắn sẽ làm hỏng máy.

Điểm cần thận trọng là **launcher**, không phải bản thân dữ liệu thử Kidea: sandbox Windows có thể thiết lập tài khoản phụ, quyền đọc/ghi thư mục (ACL), firewall và chính sách hệ thống. Đây có thể là hoạt động thiết lập bình thường, nhưng cần biết phạm vi trước khi cho chạy. [OpenAI Docs](https://learn.chatgpt.com/docs/windows/windows-sandbox).

Sự cố T07 **chưa chứng minh gây mất dữ liệu hoặc hỏng máy**; vấn đề là thiếu bản đối chiếu trước nên chưa xác định quyền nào đã đổi. Vì vậy tôi không thể bảo đảm “chạy luôn thì không sao”.

Với việc ổ C ít dung lượng, tôi đề xuất:

- **Chưa dựng VM**; ưu tiên kiểm tra để dùng máy hiện tại.
- Đặt dữ liệu thử và log do bộ thử quản lý trên **ổ D**, dùng bản sao, không project thật. Một phần dữ liệu Codex vẫn có thể nằm trên C; thư mục D riêng không phải ranh giới cách ly.
- Trước chạy AI, xác định các thay đổi quyền cần thiết, trình bạn duyệt rồi kiểm tra launcher không gọi model. Không tắt sandbox hoặc cấp toàn quyền để bỏ qua bước này.

**Tóm lại: chạy trực tiếp là hướng khả thi, nhưng nên kiểm tra launcher trước, chưa chạy ngay sáu phiên AI.** Lượt này tôi chưa thay quyền hay cấu hình máy.
