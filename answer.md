Đã thực hiện gói thay dependency Caddy trong Docker. Go mới và dependency lock/checksum đạt, nhưng build gặp lỗi tương thích ở hai lời gọi API CEL. Không cài công cụ lên macOS. [Báo cáo r2](tests/evidence/r05/backend-execution-r2.md).

C++ dev và ASan/UBSan đều 9/9 ca PASS, gồm ca hàng đợi mới. HTTPS chưa chạy; R05 chưa hoàn tất. Container đã dừng, log FAIL/PASS và snapshot được lưu; tải browser chưa hoàn tất đã hủy để giữ dung lượng.

Bạn duyệt [bản vá hai vị trí trong source Caddy](proposals/r05-caddy-cel-compat-r1.md) để tương thích thư viện mới và tiếp tục kiểm trong Docker nhé?

Cần xác nhận vì gói thay dependency r1 đã duyệt quy định dừng nếu không tương thích; lần này cần sửa source Caddy. Không cần bạn cài thêm gì lên Mac.
