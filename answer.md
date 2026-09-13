Đã đối chiếu 51 tình huống mẫu; 16 test khung vẫn đạt. Chưa có bộ đọc thật.

Tiếp theo, mình đề xuất:

1. **Làm chức năng “xem tiến độ”.** Kidea đọc hồ sơ và báo đang làm gì, còn vướng gì. Ví dụ thiếu bản đã duyệt thì chỉ rõ chỗ thiếu, không tự đoán đã xong hoặc sửa file.
2. **Dùng thêm [bộ đọc dữ liệu có sẵn](https://github.com/microsoft/node-jsonc-parser/tree/v3.3.1).** Chỉ thêm thư viện này trong repo, giúp không phải tự viết phần đọc cú pháp. Đổi lại có thêm một thư viện cần quản lý; quy tắc riêng của Kidea vẫn phải viết và kiểm tra.

Bạn duyệt hai ý này nhé? Sau đó mình mới thêm thư viện, viết bộ đọc và test; chưa làm chức năng sửa, duyệt hay triển khai.
