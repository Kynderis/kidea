**Tiếp theo là thử AI dùng Kidea thật, rồi gom kết quả để bạn duyệt khép phần lõi R02.** Tôi đáng lẽ phải nói rõ bước này ngay cuối câu trả lời trước.

Test vừa rồi chứng minh **các lệnh chạy đúng**; còn cần kiểm tra **AI có chọn và dùng đúng lệnh, hiểu đúng lời duyệt và tiếp tục đúng việc khi sang phiên mới không**.

Tôi đề xuất duyệt chung một gói:

- **Cho dùng 6 phiên agent phụ**, chia thành 3 cặp: A khởi tạo/review/lưu điểm dở; B không nhận lịch sử A, chỉ nhận hồ sơ để tiếp tục. Dùng cấu hình model hiện tại, tối đa 5 phút mỗi phiên; có tiêu hao hạn mức AI.
- Chạy trên **project giả ở D** bằng cơ chế agent sẵn có, không mở launcher sandbox riêng, không VM, không thay bảo mật Windows. Phạm vi đọc/ghi được quy định trong bài thử, không tuyên bố cách ly bằng hệ điều hành.
- Tôi chuẩn bị đầu vào, chạy các tình huống đúng/sai đã liệt kê, giữ kết quả cả khi lỗi, sửa lỗi trong phạm vi lõi đã chốt và chạy hồi quy. Không tự thêm phiên AI vượt 6 phiên.
- Sau đó tôi rà tài liệu/bằng chứng và trình **một gói kết quả R02**, nêu rõ đạt gì, thiếu gì và có đủ điều kiện mở R03 hay chưa. Không tự duyệt thay bạn.

**Bạn chỉ cần xác nhận “Duyệt gói thử AI này”.** Không cần cài đặt hay thao tác trên máy. Sau xác nhận, tôi làm liền mạch; chỉ dừng nếu phát sinh quyền, thay đổi thiết kế hoặc cần thêm lượt AI ngoài gói.
