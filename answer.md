Đã chuẩn bị gói build C++/Web trên Docker local và kế hoạch deploy/kiểm job-cảnh báo-phục hồi. Không cần server lúc này. Chưa chạy build mới.

Bạn duyệt gộp hai mục nhé:

- Một lượt build tối đa60phút,2CPU/4GiB,đĩa thêm8GiB; không tải/cài thêm, không mở cổng ra Mac.
- R08-TIDY-01: cho phép đúng một ngoại lệ lint SQLite đã giải thích, chỉ cho lượt này; giữ nguyên kiểm an toàn.

Cần duyệt vì ngoại lệ R05 cũ đã hết hiệu lực và lượt build này có ngân sách riêng. Nguồn/cache/script đã cố định trong gói, kiểm local2/2 và core283/283PASS. Build có artifact thật rồi mới chốt gói deploy. R08 chưa hoàn tất.

[Gói duyệt](proposals/r08-product-build-r1.md) · [Báo cáo](tests/evidence/r08/product-preparation-r1.md).
