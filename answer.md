Đã ghi nhận **duyệt cách tổ chức nhánh và worktree**.

Gói tiếp theo chốt: **khi nào một thay đổi đủ điều kiện nhập vào `master`, và làm sao biết bản sau tích hợp vẫn đúng**.

| Quyết định | Đề xuất |
|---|---|
| **D1 — Trước khi tích hợp** | Thay đổi phải hoàn chỉnh trong phạm vi đã chốt; tài liệu, code, test và cấu hình liên quan đồng bộ; đủ kiểm tra và các lần duyệt bắt buộc, bằng chứng còn đúng bản. |
| **D2 — Sau khi tích hợp** | Kiểm tra lại bản tích hợp thực tế, kể cả tương tác với phần đã có. Nếu lỗi hoặc chưa kiểm tra thì chưa xác nhận đạt, giữ bằng chứng và dừng phát hành; không tự bỏ test hay khôi phục ngoài quyền. |

**Không phải chờ cả sản phẩm xong:** một gói thiết kế hoàn chỉnh có thể được nhận khi chưa viết ứng dụng. Nhưng nếu đang sửa chức năng hủy đăng ký, phải hoàn thành đủ đặc tả, code và test của thay đổi đó.

Test trên nhánh riêng đạt **chưa thay thế kiểm tra sau tích hợp**. Và `master` **không mặc nhiên là bản đang chạy production**.

Gói này chưa cấp quyền merge/push/deploy, chưa chọn cách merge, công cụ CI hoặc ngưỡng kiểm thử. [Đề xuất đầy đủ trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) đã được cập nhật và xác minh.

Sau duyệt, mình sẽ kiểm tra khép phần này rồi soạn **thao tác Git nào Kidea được tự làm trên máy, thao tác nào cần quyền riêng**.

Bạn duyệt D1–D2 này chứ?
