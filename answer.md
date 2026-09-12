Ý chính là: **Kidea phải phân biệt “đang làm”, “đã đưa vào sử dụng” và “chưa kiểm tra nên chưa biết”.**

Ví dụ bạn có một website đăng ký workshop:

- Website người dùng đang dùng **chỉ cho đăng ký**, chưa cho hủy.
- Bạn yêu cầu AI **bổ sung chức năng hủy đăng ký**.

### 1. Làm xong chưa có nghĩa người dùng đã dùng được

AI viết xong chức năng hủy và kiểm tra đạt trên máy làm việc. Nhưng chưa đưa bản mới lên website thật.

Kidea phải báo:

> Chức năng hủy: đã làm và kiểm tra xong.
>
> Website thật: lần kiểm tra gần nhất vẫn là bản chưa có chức năng hủy.

Không được báo “người dùng đã hủy được” chỉ vì code đã xong.

Sau khi đưa bản mới lên website thật, cần kiểm tra lại rồi mới ghi nhận kết quả. **Mỗi lần đưa bản lên có một phiếu ghi: đưa bản nào, lên đâu, lúc nào, thành công hay lỗi.** Sổ công việc chỉ dẫn tới phiếu đó, không chép một bản khác dễ bị lệch.

### 2. Chưa kiểm tra thì không được đoán

Giả sử hôm sau mở phiên AI mới, nhưng thiếu phiếu ghi hoặc không kiểm tra được website.

Kidea phải nói:

> Chưa đủ thông tin để xác nhận website đang dùng bản nào.

Không tự nói “chưa đưa bản mới lên”, cũng không tự nói “đã đưa lên thành công”.

Tương tự, nếu giao diện đã có nút Hủy nhưng phần xử lý phía máy chủ cập nhật lỗi, phải báo **cập nhật chưa hoàn tất**, không báo cả chức năng đã dùng được. Kết quả kiểm tra hôm qua cũng không chứng minh website vẫn hoạt động tốt hôm nay.

**Bạn đang được hỏi có đồng ý để Kidea ghi nhận công việc theo cách này không.** Đây chỉ là cách lưu và báo thông tin cho đúng; không phải xin quyền đưa website lên hoặc yêu cầu bạn tự ghi các phiếu này. [Đề xuất vẫn chờ duyệt](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current).
