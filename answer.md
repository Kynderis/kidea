**Đã ghi quy tắc duyệt theo gói cho cả các phase sau. Ba quyết định đăng ký vừa rồi đã được ghi nhận là duyệt, không hỏi lại.**

Đây là **toàn bộ gói còn lại của R03 tôi đề xuất chốt lúc này**:

### 1. Quy tắc nghiệp vụ còn lại

| Mục | Đề xuất cụ thể |
|---|---|
| Ai thấy workshop | Bản nháp chỉ admin thấy. Đã mở hoặc tạm dừng vẫn công khai; tạm dừng thì không đăng ký/hủy mới. Đăng ký cá nhân chỉ chủ sở hữu xem. |
| Dữ liệu hợp lệ | Sức chứa 1–1000, không thấp hơn số đang đăng ký; tiêu đề 1–120 ký tự, mô tả 1–5000; giờ kết thúc sau giờ bắt đầu. Không tự đóng theo đồng hồ. |
| Admin sửa gì | Được sửa nội dung, lịch và sức chứa ở mọi trạng thái. **Đổi lịch khi đã có người đăng ký vẫn được phép**, nhưng chưa có email/push thông báo. Không xóa hoặc đưa workshop đã mở về nháp. |
| Hủy rồi đăng ký lại | Lần mới có mã đăng ký mới. Ví dụ hủy A rồi đăng ký B: thao tác hủy cũ của A không được hủy B. Giữ lịch sử. |
| Cập nhật số chỗ | Phải giữ thông tin đủ để phục hồi cập nhật; bản cũ/lặp không làm sai số chỗ. Ví dụ đã nhận bản 12 thì bản 11 đến muộn không được ghi đè. |
| Mất kết nối | Giữ số chỗ biết gần nhất, kèm thời điểm và nhãn chưa cập nhật; không giả thành 0. Chưa rõ đăng ký thành công thì tra lại cùng yêu cầu. |
| Riêng tư/vận hành | Cập nhật công khai không chứa danh tính người đăng ký. Chỉ admin xem tình trạng cập nhật/lỗi; chưa có nút chạy lại hoặc xóa dữ liệu. |
| Danh sách | Xếp workshop theo giờ bắt đầu; người dùng xem được đăng ký hiện tại và lịch sử đã hủy. Không thêm thử nghiệm A/B vào pilot. |

### 2. Quyền để làm hết gói

- Viết đủ hồ sơ bốn nhóm MVP tại **đúng thư mục pilot trên D**: dự kiến 10 file Markdown kể cả hai file đã có; giữ bản trước khi sửa.
- Tích hợp hướng dẫn nghiệp vụ vào skill và chạy kiểm tra tài liệu/hồi quy lõi. **Không thêm runtime sửa sản phẩm hoặc tự chuyển task**, không cài đặt, VM, Git pilot hay deploy.
- Chạy **hai phiên AI mới, tối đa 15 phút/phiên**: một phiên soạn lát cắt trong vùng thử riêng, một phiên đọc/kiểm từ file. Không tự chạy thêm phiên; giữ cả lỗi và phần chưa đạt.

Sau khi bạn chốt, tôi làm liên tục đến **một gói kết quả cuối**. Chỉ hỏi giữa chừng nếu phát sinh thật; ngưỡng hiệu năng và triển khai thuộc phase sau, không tự tuyên bố đạt ở R03.

Bạn có thể nói **“Duyệt toàn bộ gói R03”**, hoặc sửa các dòng muốn đổi. [Gói đầy đủ đã push](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md).
