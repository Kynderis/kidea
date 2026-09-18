Đã triển khai lát outbox/WSS và cập nhật trực tiếp cho trang chi tiết, form quản trị và đăng ký riêng trong pilot Kidea.

- Backend: bốn cấu hình build và kiểm socket PASS; giữ ngoại lệ SQLite/WAL TSan cũ, không mở ngoại lệ cho phần mới.
- Web: 81 unit, 18 SSR–Chrome Mac; HTTPS/WSS với backend thật trong Docker đạt 52/52. Kidea core đạt 293/293, không skip.
- Đã sửa lỗi phục hồi đọc phiên và giữ draft; lưu riêng toàn bộ FAIL/PASS, nguồn cố định và điểm tiếp tục. Không cài thêm công cụ hoặc dependency.

T05/R09 chưa hoàn tất. Tiếp theo: nối cập nhật trực tiếp cho danh sách và `/me`, rồi hoàn thiện kiểm tải, vận hành/backup/restore và ma trận còn thiếu. Trước lát tiếp theo, tôi sẽ đánh giá độ phức tạp và gợi ý model/reasoning theo yêu cầu của bạn. Hiện không cần xác nhận thêm trong quyền trọn R09; nghiệm thu cuối vẫn thuộc bạn.

Chi tiết: [R09 T05](docs/R09_T05_PROGRESS.md). Android/iOS Future chưa lịch; Apple Silicon chưa kiểm, R10 chưa mở.
