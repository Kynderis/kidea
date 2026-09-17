Đã kiểm tra Google Cloud project kidea-508908: project ACTIVE, billing đã bật, Compute API đã bật; tài khoản có quyền tạo/dừng/xóa VM và tài nguyên liên quan. Hiện project không có VM.

Có thể tự quản lý VM phục vụ kiểm Kidea theo quyền bạn vừa giao, rồi thu log và xóa tài nguyên lab khi hết cần. Chưa tạo máy vì đang xác minh và chuẩn bị workload; không cần bạn duyệt lại từng lệnh cloud thông thường.

300USD là ngân sách khá rộng cho các lượt CPU VM nhỏ, chạy hữu hạn; chưa xác minh số dư credit/hạn dùng thực. Tôi sẽ bắt đầu với mục tiêu kiểm soát≤10USD/đợt, tính cả disk/IP/egress và đặt thời hạn. Stop VM không xóa mọi khoản phí; sẽ thu hồi tài nguyên lab và kiểm lại.

[Ghi nhận quyền và kết quả](docs/R08_GCP_AUTHORITY.md).
