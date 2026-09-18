Đã áp dụng EX r2: **99 kiểm offline và 5 kiểm tĩnh PASS**; giữ nguyên bằng chứng FAIL r6. Đã lưu checkpoint và chuẩn bị nguồn/manifest build r7. R09 chưa hoàn tất.

Bạn duyệt **một lượt build r7 trong Docker**, tối đa2giờ,4container tuần tự,2CPU/4GiB mỗi container,đĩa mới≤8GiB,không tải/cài thêm nhé?

Cần duyệt lượt chạy này vì [gói EX r2](docs/R09_T02_TSAN_GATE_R2_PROPOSAL.md) vừa duyệt chỉ mở triển khai offline và yêu cầu trình [manifest nguồn cuối](docs/R09_T02_BUILD_R7_REVIEW.md) trước Docker.
