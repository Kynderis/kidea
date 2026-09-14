Đã áp dụng cách phối hợp mới và phân nhóm phần R02 còn lại. Mình cũng bổ sung phát hiện lượt ghi dở cho `status`: **90/90 bài kiểm tra đạt**; hướng dẫn skill vẫn chỉ đọc, không tự phục hồi.

**Có một điểm mới cần bạn chốt: mức bảo vệ ghi file của bản đầu.**

Các [phép thử thực tế](D:/Code/kynderis/kidea/tests/evidence/r02-t06.md) cho thấy cơ chế khóa chặn được các thao tác sửa file thông thường trong bài thử, nhưng chưa ngăn được chương trình khác tạo tên phụ cho file hoặc đổi hướng thư mục. Biến thể khóa bổ sung cũng không giải quyết được.

Ví dụ: file A được chương trình khác tạo thêm tên B. Kidea ghi A thì nội dung nhìn qua B cũng đổi, kể cả B nằm ngoài đường dẫn dự kiến. Kiểm tra lại có thể phát hiện nhưng không bảo đảm luôn kịp hoặc khôi phục được.

**Mình đề xuất bản đầu giữ cách chạy local đơn giản, nhưng công bố rõ không bảo đảm an toàn trong hai kiểu can thiệp liên kết ngay lúc ghi này.** Đây là giảm phạm vi bảo đảm đã duyệt, không chỉ chỉnh kỹ thuật.

Các bảo vệ còn lại giữ nguyên: khóa file, giữ bản trước, gặp xung đột thì dừng, không tự phục hồi khi thiếu căn cứ. Nếu bạn cần bảo vệ cả hai trường hợp trên, phải giữ đường ghi đóng để nghiên cứu tiếp; có thể cần tách quyền/môi trường, chưa rõ chi phí.

[Phạm vi thay đổi đầy đủ](D:/Code/kynderis/kidea/KIDEA_DESIGN.md:678) hiện **chưa được áp dụng**. Chức năng ghi vẫn đóng. Đã lưu và đồng bộ lên `master`.

Bạn duyệt giới hạn bản đầu này để mình tiếp tục triển khai nhé?
