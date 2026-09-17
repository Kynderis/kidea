Đã triển khai EX-T02-WAL-01 r1: **76 kiểm offline và 22 kiểm tĩnh PASS**. Giữ log FAIL ban đầu, raw TSan/CTest và assertion gốc; chưa chạy Docker bản mới.

Đã chuẩn bị [build r6](docs/R09_T02_BUILD_R6_REVIEW.md) trên nguồn cuối: **1 lượt, tối đa 2 giờ, 4 container tuần tự, mỗi container 2 CPU/4 GiB RAM; thêm ≤8 GiB đĩa, không tải/cài thêm**.

Bạn duyệt **build r6** nhé? Quyền vừa duyệt chỉ mở triển khai/kiểm offline; gói chạy nay đã có nguồn và manifest cụ thể. Không cần duyệt lại ngoại lệ TSan. R09 chưa hoàn tất.
