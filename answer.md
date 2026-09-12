Nói đơn giản: **mình đang chọn cách làm “sổ công việc” cho Kidea**, để phiên AI sau mở lại vẫn biết đúng đang làm đến đâu.

### 1. Trong cùng một file, có phần cho bạn đọc và phần cho máy đọc

Ví dụ công việc “Làm màn hình đăng nhập” đang thực hiện:

- Phần bạn đọc: “Đang làm màn hình đăng nhập, còn thiếu kiểm tra lỗi mật khẩu.”
- Phần máy đọc: các ô thông tin cố định như **mã việc = W-002**, **trạng thái = đang làm**.

Đề xuất dùng **JSON** để ghi các ô thông tin đó ngay trong file Markdown. Máy đọc phần này, không phải đoán trạng thái từ câu văn.

Bạn không phải tự viết JSON; AI cập nhật trong phạm vi được phép. Điểm bất tiện là phần dữ liệu này trông kỹ thuật hơn bảng thông thường. Phần giải thích cho bạn chỉ diễn đạt lại dữ liệu, không có trạng thái riêng để sửa khác đi.

### 2. Mỗi thông tin chỉ ghi chính thức ở một chỗ

Hình dung một bộ sổ:

| Nơi lưu | Vai trò |
|---|---|
| **INDEX** | Trang mục lục: mở từ đây để tìm đúng hồ sơ |
| **work** | Sổ công việc: đang làm gì, xong gì, còn gì |
| **review** | Phiếu duyệt: bạn đã duyệt nội dung nào, bản nào |

Ví dụ bạn duyệt thiết kế đăng nhập: xác nhận được lưu ở **review**; **work** dẫn tới xác nhận đó, không ghi một bản duyệt thứ hai. Khi danh sách công việc quá dài mới tách sang **plans**, không giữ hai danh sách trùng nhau.

**Bạn đang được hỏi có đồng ý hai cách tổ chức này không.** Chưa phải duyệt xây chức năng, phát hành hay cấp thêm quyền thao tác. [Gói đề xuất đầy đủ](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) vẫn đang chờ duyệt.
