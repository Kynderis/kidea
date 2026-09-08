Bạn hiểu đúng. **Cách bạn mô tả là luồng chính mình khuyến nghị.** Hai mục trước chính là “hoàn thiện trước khi merge” và “xác nhận bản sau merge”; phần giải thích của mình chưa làm rõ mức kiểm tra ở từng thời điểm.

Quy trình sẽ như sau:

1. **Chốt một đợt thay đổi.** Ví dụ: cho phép hủy đăng ký khi workshop đang tạm dừng. Xác định yêu cầu và các nơi bị ảnh hưởng, rồi tạo một nhánh từ `master` mới nhất đã xác minh. Các task con cùng làm trên nhánh này.

2. **Làm từng task, kiểm tra ngay phần đó.** Sửa backend thì chạy test hàm/module/API liên quan; sửa giao diện thì kiểm tra giao diện và kết nối với backend. Nếu thay đổi chạm nhiều thành phần, kiểm tra tương tác ngay. **Không cần chạy toàn bộ project sau mỗi sửa nhỏ.**

3. **Xong cả đợt mới kiểm tra tổng thể.** Rà đầy đủ tài liệu, code, test, dữ liệu/cấu hình và các phần liên quan; chạy toàn bộ bộ kiểm thử bắt buộc của project cho bản hiện tại, gồm cả chức năng cũ, và kiểm tra build. Nơi liên quan không cần sửa vẫn phải có căn cứ đã đối chiếu. Chỉ khi đủ kết quả và các lần duyệt đã chốt mới merge.

4. **Merge vào `master` và xác nhận đúng bản.** Không nhất thiết chạy lại nguyên bộ test vừa đạt: nếu chứng minh bản sau merge và đầu vào kiểm thử vẫn khớp bản đã kiểm tra, có thể dùng lại bằng chứng và kiểm tra nhanh. Nếu `master` đã thay đổi, có xử lý xung đột hoặc nội dung khác đi, phải kiểm tra lại phần bị ảnh hưởng; chưa rõ phạm vi thì chạy lại toàn bộ.

5. **Nếu cần phát hành, tạo và kiểm tra bản build.** Build là tạo gói chương trình có thể chạy. Gói này cần được kiểm tra trước khi đưa lên môi trường đích; build cần thiết cho test ở các bước trước vẫn làm bình thường.

6. **Triển khai rồi kiểm tra trên môi trường đang chạy.** Xác nhận đúng phiên bản, các luồng chính, dữ liệu và tín hiệu vận hành. Đây là kiểm tra sau deploy; các bài thử có thể phá dữ liệu chạy trong môi trường thử riêng. Với workshop, môi trường đích hiện là lab.

Ví dụ trên: test backend và giao diện có thể chạy riêng khi làm từng task. Đến cuối đợt, phải kiểm tra thêm việc hủy có cập nhật đúng số chỗ, có ảnh hưởng đăng ký mới và các luồng cũ hay không.

Một trường hợp cần giữ rõ: **nếu việc cũ còn dở mà phát sinh yêu cầu mới**, phải lưu điểm dừng và xét phần phụ thuộc trước. Yêu cầu bổ sung có thể thuộc chính đợt đang làm; không tự tạo nhánh từ `master` rồi bỏ mất phần chưa merge. Vẫn chỉ một việc được triển khai tại một thời điểm.

Mình đã [viết lại gói đề xuất theo luồng này](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) và đồng bộ GitHub. Gói vẫn đang trao đổi để chốt; chưa mở quyền Git hoặc triển khai pilot.
