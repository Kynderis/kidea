Đã chẩn đoán xong: **cảnh báo tái hiện ngay trong SQLite độc lập, không cần mã backend**. TSan bắt được lỗi cố ý; hai mẫu đối chiếu đạt. Log đã lưu và container đã thu hồi.

Kết quả khoanh vùng vấn đề vào SQLite WAL/TSan, nhưng chưa đủ để tự bỏ qua6lỗi cũ. R09 vẫn mở; TSan/release chưa hoàn tất.

Bước tiếp: review phương án tương thích SQLite–TSan trước gói kiểm mới, giữ nguyên backend và WAL. [Báo cáo đầy đủ](tests/evidence/r09/t02-sqlite-diagnostic-r1.md).
