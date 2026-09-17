R5: **dev và ASan/UBSan đều PASS46/46 nhóm CTest cùng18/18 kiểm HTTP**. TSan có6lỗi tại SQLite WAL; release chưa chạy. Đã giữ log và thu hồi3container, chưa coi R09 hoàn tất.

Mã SQLite có ghi chú đây có thể là cảnh báo giả, nhưng tôi chưa bỏ qua. Bạn duyệt [gói chẩn đoán SQLite/TSan](docs/R09_T02_SQLITE_DIAGNOSTIC_REVIEW.md) nhé:1container,tối đa15phút,2CPU/4GiB,thêm tối đa1GiB đĩa; không tải/cài thêm, không tắt sanitizer hoặc sửa backend.

Cần duyệt vì lượt r5 đã dừng theo quy định khi FAIL; phép chẩn đoán dùng nguồn/lệnh/manifest mới. Không xin miễn trừ kiểm an toàn.
