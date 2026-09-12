Đã khép phần khung thử Kidea; hai thư mục rỗng được ghi nhận là tồn đọng không chặn. Bằng chứng kiểm tra vẫn khớp bản nguồn. Chưa có lõi Kidea.

Tiếp theo là thiết kế hồ sơ để Kidea biết **đang làm gì, còn gì chưa xong**. Gói [R02-T02-S01-r1](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) có hai đề xuất:

1. **Mỗi việc có mã riêng và ghi rõ việc cha.** Ví dụ `W-001` là “Xây giao diện”, `W-002` là “Màn hình đăng nhập”, thuộc `W-001`. Đổi tên hoặc chuyển nhóm vẫn giữ mã, tránh sửa hàng loạt link; đổi nhóm vẫn phải rà ảnh hưởng/gate. Đánh đổi: cần đọc quan hệ cha để biết vị trí, không nhìn riêng mã. Mã không trùng trong hồ sơ công việc hiện hành; không lập kho mã cũ cấm dùng lại hoặc đổi mã roadmap đang có.
2. **Phân biệt chưa chia hết việc với đã hoàn tất.** Nhóm ghi “chưa phân rã / đang phân rã / đã phân rã đủ”. Một màn hình xong không làm cả giao diện xong nếu còn màn hình chưa liệt kê. Việc nhỏ làm trực tiếp không cần tạo con giả; nhóm chỉ hoàn tất khi đủ việc, kiểm tra và gate cần thiết.

Bạn duyệt hai nguyên tắc này nhé? Sau đó mình mới trình cách lưu INDEX/work/review; chưa viết schema hoặc bộ đọc trước khi chốt.
