Đã ghi nhận duyệt và khép phần hợp đồng approval. Đã bổ sung 29 tình huống đối chiếu; đây là mẫu thiết kế, chưa phải chức năng approve chạy được. 16 test khung vẫn đạt.

Tiếp theo là **cách giữ đúng bản bạn đã duyệt**. Mình đề xuất:

1. **Giữ bản sao những file cần làm căn cứ**, gắn với đúng gói và phạm vi. Nhờ vậy, kể cả file chưa commit vẫn có bản cũ để so sánh. Không sao chép cả project; bản lưu chỉ là lịch sử, không thay tài liệu hiện hành. Đánh đổi là thêm dung lượng, và không được tự đưa secret/dữ liệu riêng vào hồ sơ hoặc Git.
2. **Dùng SHA-256 — mã tính từ nội dung file — để phát hiện thay đổi.** Mã khác chỉ báo cần đối chiếu; AI vẫn phải đọc để phân biệt sửa lỗi gõ với đổi yêu cầu. Kiểm tra cả đầu vào liên quan; nếu nguồn đổi trong lúc đọc hoặc thiếu căn cứ thì dừng phần phụ thuộc.

Bản lưu local chưa chuyển thì máy khác chưa có; đây chưa là backup chống hỏng ổ đĩa. Cách ghi an toàn, phục hồi và tương thích phiên bản sẽ trình riêng, chưa triển khai trong gói này.

Bạn duyệt hai lựa chọn này nhé? [Gói chi tiết và kết quả đã lưu trên repo](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current).
