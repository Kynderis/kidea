Đã ghi nhận duyệt và **khép phần chuẩn bị pilot workshop**. Chưa tạo repo hoặc chạy pilot.

Gói tiếp theo giải quyết việc: **giữ phần đang sửa tách khỏi bản tích hợp, nhưng không làm quy trình Git phức tạp**.

| Quyết định | Đề xuất |
|---|---|
| **D1 — Bản đang làm** | Một nhánh tích hợp (`master` cho pilot) và một nhánh làm việc hiện hành cho mỗi thay đổi có phạm vi rõ. Tài liệu, code và test của cùng thay đổi đi cùng nhánh; không tạo nhánh cho từng thao tác hoặc thêm `develop`. |
| **D2 — Thư mục làm việc riêng** | Mặc định dùng thư mục hiện có. Chỉ thêm **worktree** — thư mục làm việc bổ sung của cùng repo — khi cần giữ bản cũ nguyên trạng để kiểm tra/đối chiếu trong lúc sửa bản mới. |

Ví dụ: đổi quy tắc hủy đăng ký workshop thì đặc tả, code và test cùng nằm trên nhánh của thay đổi đó. Worktree chỉ cần nếu phải giữ riêng bản cũ để đối chiếu; không phải tạo thêm project.

**Gói này chỉ chốt cách tổ chức**, chưa cho phép tạo/chuyển nhánh, tạo worktree, commit/push hoặc merge. Điều kiện nhập thay đổi vào `master` và quyền thao tác sẽ được duyệt riêng.

[Gói đề xuất trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) đã được cập nhật và xác minh. Sau duyệt, mình sẽ soạn phần **khi nào một thay đổi đủ điều kiện nhập vào bản tích hợp và cần kiểm tra gì sau đó**.

Bạn duyệt D1–D2 này chứ?
