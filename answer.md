R6 đã chạy và dừng đúng gate:

- **Dev và ASan/UBSan đạt** toàn bộ 46 CTest / 796 assertion / 18 HTTP.
- TSan đủ 796 assertion chức năng, nhưng có **một cặp truy cập SQLite mới ngoài ngoại lệ đã duyệt**; TSanHTTP/release chưa chạy.
- Đã thu hồi 3 container, giữ log FAIL; sửa lỗi đọc định dạng report và 85 kiểm offline đạt. Cảnh báo mới vẫn bị chặn.

Tôi đã chuẩn bị [EX r2](docs/R09_T02_TSAN_GATE_R2_PROPOSAL.md), chỉ đề nghị bổ sung đúng cặp đọc header mới, giữ đầy đủ test/log. Bạn duyệt phần bổ sung này nhé?

Cần xác nhận vì đây là mở rộng phạm vi ngoại lệ r1, không phải duyệt lại việc cũ. R09 chưa hoàn tất.
