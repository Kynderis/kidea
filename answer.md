Đã chạy diagnostic r2 đúng gói duyệt và thu hồi container.

- WAL song song: đủ **100 cập nhật**, kiểm toàn vẹn đạt; vẫn có **2 cảnh báo TSan** ở hai bản sao header WAL.
- Mẫu cố ý gây lỗi được bắt; hai mẫu đối chiếu không có cảnh báo.
- Đã lưu log, dữ liệu và bằng chứng nguồn không đổi; không cài thêm gì.

[Báo cáo](tests/evidence/r09/t02-sqlite-diagnostic-r2.md). Sáu FAIL của bộ kiểm ứng dụng vẫn giữ nguyên; **R09 chưa hoàn tất**. Bước tiếp là chốt cách xử lý gate SQLite–TSan có bằng chứng trước lượt build mới; chưa tự tắt cảnh báo hoặc cấp miễn trừ.
