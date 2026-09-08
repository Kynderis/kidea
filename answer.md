Đã ghi nhận **S01 — bài toán/MVP được duyệt**. S02 đang chờ duyệt ba điểm:

| Quyết định | Đề xuất |
|---|---|
| **D1 — Chuỗi cần truy** | Rule đăng ký → dữ liệu → event → số chỗ hiển thị → web/native và monitoring. Backend quyết định nhận chỗ từ dữ liệu gốc, không từ cache. |
| **D2 — Tình huống lỗi** | Tranh chỗ cuối; gửi lại yêu cầu; event lặp/trễ/đảo thứ tự; gián đoạn rồi phục hồi. Không vượt chỗ, không xử lý trùng hoặc làm lùi trạng thái; có đối chiếu dữ liệu và theo dõi lỗi. |
| **D3 — Thứ tự pilot** | Backend → web tối thiểu → thử thêm Feature giữa MVP → event/admin/monitoring → Android → iOS → release lab và khôi phục. |

Bài thử thêm Feature **không tự bổ sung chức năng vào MVP đã duyệt**; phải giữ checkpoint và đi qua quy trình thay đổi. Backend/web chạy được cũng không thay nghiệm thu native.

Bạn đọc [gói S02](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current). Chưa chọn database, công cụ truyền event, thuật toán hoặc ngưỡng đo; chưa code/chạy pilot.

Đã đồng bộ và xác minh bản GitHub; không tạo file tạm. Sau duyệt, mình sẽ soạn S03 về nơi giữ hồ sơ, lab/chi phí/quyền.

Bạn duyệt D1–D3 của S02 chứ?
