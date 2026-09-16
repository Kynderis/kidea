Đã sửa và kiểm: core 283/283; mỗi preset C++ 12/12; Web 32 unit, 18 browser, 4 server; HTTPS 38/38 PASS. Đã lưu [báo cáo](tests/evidence/r05/backend-execution-r4.md), commit/push master.

Lượt cuối phải dừng vì tôi để hai client chồng nhau, tổng quota cấu hình vượt trần khoảng 18 giây. Container đã dừng; đã thêm guard quota, còn kiểm lại browser/drain. **R05 chưa hoàn tất.**

Bạn duyệt [ngoại lệ duy nhất cho cảnh báo tối ưu hóa của macro SQLite](proposals/r05-sqlite-transient-tidy-r1.md) và tiếp tục phần kiểm còn thiếu với quota hiện tại nhé? Ngoại lệ không tắt sanitizer hay kiểm an toàn.

Cần xác nhận vì quy tắc ngoại lệ của pilot (`docs/engineering/rules.md#exceptions`) yêu cầu: “Chưa duyệt thì không được áp.”
