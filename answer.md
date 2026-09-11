Đây là **hai quy tắc dành cho AI**, không phải hai việc bạn phải tự làm.

**1. Trước khi dừng hoặc chuyển việc, AI phải lưu đủ để lần sau làm tiếp.**

Ví dụ AI đang làm chức năng hủy đăng ký:

- Backend đã xong và đã kiểm tra.
- Giao diện đang làm dở.
- Việc tiếp theo là hoàn thiện nút hủy rồi kiểm tra cả luồng.

AI phải **lưu các file đang làm và ghi lại tình trạng trên**. Lần sau mở lại, AI biết tiếp tục từ đâu, không bắt bạn kể lại hoặc làm lại từ đầu.

Việc này thực hiện sau mỗi task, trước chuyển việc và trước chủ động kết thúc phiên; không cần ghi chép sau từng dòng code. **Lưu việc dở không có nghĩa công việc đã đạt hoặc được phép deploy.**

**2. Nếu AI làm hỏng file do thao tác ghi của chính nó, cho phép nó sửa lại một cách an toàn.**

Ví dụ AI cập nhật một file nhưng vô tình ghi mất một đoạn. Nếu AI còn bản ngay trước khi ghi và chắc chắn chưa có ai sửa thêm file đó, nó được khôi phục đoạn bị mất rồi kiểm tra lại — trong phạm vi file đã được phép sửa.

Nhưng nếu bạn cũng vừa sửa file đó, AI **không được lấy bản cũ đè lên**, vì có thể mất phần bạn làm. Nó phải giữ nguyên và hỏi cách xử lý.

Quyền này chỉ nhằm sửa lỗi ghi file trên máy đang làm việc; **không phải quyền tự lùi cả dự án, sửa lịch sử Git đã chia sẻ hay khôi phục database/production**.

Nói ngắn gọn: **điểm 1 để không mất dấu việc đang làm; điểm 2 để AI sửa lỗi của mình mà không làm mất việc của bạn.**
