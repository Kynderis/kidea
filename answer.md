Đã hoàn tất phần backend/Web được duyệt:

- Áp ngoại lệ SQLite đúng phạm vi; clang-tidy PASS.
- Core 283/283; bốn cấu hình C++ mỗi cấu hình 12/12; sáu lỗi cố tình đưa vào đều bị bắt.
- HTTPS, browser và kiểm dừng dịch vụ đều PASS. Guard quota đã kiểm thật; container đã dừng.
- Lưu đầy đủ bằng chứng, lỗi trung gian và điểm tiếp tục tại [báo cáo r5](tests/evidence/r05/backend-execution-r5.md).

Tiếp theo: review kết quả backend/Web, rồi chuẩn bị môi trường/mẫu Android và iOS. R05 chưa hoàn tất; Apple Silicon chưa kiểm. Chưa cần cài thêm gì trên Mac trong lượt này.
