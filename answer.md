Tiếp theo là **thiết kế cách Kidea lưu và nhận biết công việc**, chưa xây thêm chức năng ngay.

Trình tự:

1. **Khép phần khung ban đầu:** kiểm tra cấu trúc và 16 bài thử đã đạt, log đã xóa. Còn hai thư mục rỗng bị chặn xóa; mình đề xuất ghi nhận chúng là tồn đọng môi trường, không để việc này giữ toàn bộ tiến độ. Đây chưa phải thay đổi đã áp dụng vào lộ trình.
2. **Trình bạn duyệt cách nhận diện và chia công việc:** mỗi việc có mã, thuộc việc cha nào; phân biệt rõ “chưa chia thành việc nhỏ” với “đã hoàn thành”. Ví dụ: bước “Xây giao diện” chưa có danh sách màn hình thì phải báo **chưa phân rã**, không được báo xong.
3. **Sau khi bạn duyệt**, mới chốt nơi lưu danh sách công việc/hồ sơ duyệt, rồi tạo mẫu đúng–sai để kiểm tra.

Đó là phần **R02-T02 — Schema nguồn tối thiểu**: hiểu đơn giản là quy cách ghi hồ sơ để các phiên AI đọc cùng một cách, không tự đoán tiến độ. Hiện phần này **chưa mở, chưa có gói quyết định cần bạn duyệt**.
