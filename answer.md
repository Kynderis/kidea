Đã ghi nhận duyệt.

Tiếp theo là tình huống: **bạn đã duyệt một nội dung, nhưng sau đó nội dung ấy được sửa**. Mình đề xuất:

1. **Giữ căn cứ của bản bạn đã duyệt.** Không chỉ ghi “đã duyệt”, mà phải biết bạn đã xem nội dung nào và dựa trên yêu cầu nào. Khi làm tiếp, AI đối chiếu với bản hiện tại. Nếu không tìm được bản cũ để so sánh thì báo thiếu căn cứ, không tự đoán xác nhận cũ vẫn dùng được.
2. **Phân biệt sửa chữ với đổi yêu cầu.**

   - Sửa lỗi gõ trong tiêu đề: có thể giữ xác nhận sau khi đối chiếu và ghi rõ không đổi ý nghĩa.
   - Đổi từ “chỉ người đăng ký được hủy” sang “quản trị viên cũng được hủy”: phải trình bạn duyệt lại phần thay đổi, đồng thời rà giao diện, code và test liên quan.
   - Chưa chắc thay đổi có ảnh hưởng hay không: hỏi bạn, không tự coi là sửa nhỏ.

Xác nhận cũ vẫn được giữ làm lịch sử. Phần đã chứng minh không bị ảnh hưởng không phải duyệt lại toàn bộ.

Bạn duyệt cách đối chiếu này nhé? [Gói chi tiết](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) vẫn là thiết kế; chưa chạy chức năng approve hoặc pilot.
