Ý mình là: **AC giúp bạn đọc được các điều kiện chấp nhận Feature; rule giải thích chính xác từng điều kiện; test đưa dữ liệu cụ thể để kiểm tra.** Câu “AC ngắn” trước đó dễ khiến bạn hiểu thành chỉ chọn vài hành vi tiêu biểu rồi bỏ phần còn lại. Mình diễn đạt chưa rõ. :codex-annotation{index="1"}

Lấy ví dụ đơn giản: **chủ đơn được hủy đơn đang chờ xử lý**.

**Trong phần AC**, ta viết:

> Khi chủ đơn yêu cầu hủy một đơn đang chờ xử lý, yêu cầu phải thành công và đơn chuyển sang đã hủy.

Bạn đọc câu này để đánh giá: “Đúng, tôi muốn Feature có hành vi đó.”

**Trong phần rule**, ta làm rõ những gì câu trên dựa vào:

| Rule | Nội dung |
|---|---|
| Quyền hủy | Người yêu cầu phải có ID trùng với ID chủ đơn. |
| Trạng thái cho phép | Chỉ cho hủy khi trạng thái hiện tại là `CHỜ_XỬ_LÝ`. |
| Kết quả thành công | Chuyển trạng thái sang `ĐÃ_HỦY`, giữ nguyên chủ đơn. |
| Kết quả từ chối | Nếu không đủ điều kiện thì từ chối, trạng thái đơn giữ nguyên. |

AC liên kết tới các rule này. Khi cần biết “chủ đơn được xác định thế nào?” hoặc “đơn đang giao có được hủy không?”, ta đọc phần rule tương ứng.

**Trong phần test**, ta chọn những tình huống cụ thể:

| Test | Ban đầu | Hành động | Kết quả mong đợi |
|---|---|---|---|
| T1 | Đơn O1 thuộc U1, đang chờ xử lý | U1 hủy O1 | Thành công; O1 thành đã hủy |
| T2 | Đơn O1 thuộc U1, đang chờ xử lý | U2 hủy O1 | Từ chối; O1 vẫn chờ xử lý |
| T3 | Đơn O1 thuộc U1, đang giao | U1 hủy O1 | Từ chối; O1 vẫn đang giao |

T1 kiểm tra AC thành công ở trên. T2 và T3 kiểm tra các rule từ chối; Feature cũng cần tiêu chí chấp nhận tương ứng nếu đây là những hành vi bắt buộc để chấp nhận Feature.

**“Độ bao phủ nằm ở test” nghĩa là:** nhìn một câu AC chưa cho biết đã có đủ tình huống kiểm tra hay chưa. Ta phải đối chiếu các test với rule để biết:

- đã kiểm tra đúng chủ đơn và sai chủ đơn chưa;
- đã kiểm tra các trạng thái được phép và không được phép chưa;
- đã kiểm tra trạng thái sau thành công và sau từ chối chưa.

Chỉ có T1 thì chưa đủ, dù T1 đáp ứng AC thành công.

Còn “AI truy ngược được đầy đủ” nghĩa là mỗi test ghi rõ căn cứ của nó. Ví dụ T1 trỏ tới AC thành công và các rule quyền hủy/chuyển trạng thái. Khi rule quyền hủy đổi, AI tìm các AC và test liên quan để đọc, phân tích và cập nhật theo quy trình đệ quy ta đã chốt.

**Mình điều chỉnh đề xuất thành: AC phải đủ các tiêu chí chấp nhận cần thiết, viết rõ và không dài hơn cần thiết. Không đặt mục tiêu ít AC hoặc ngắn bằng mọi giá.** Human vẫn review toàn bộ rule và test khi duyệt; phần AC chỉ giúp nhìn rõ những kết quả mà Feature phải đạt.

Có một sự trùng lặp thực sự ở đây: với Feature đơn giản, AC có thể gần giống rule. Nếu viết thêm AC chỉ là chép lại từng rule mà không giúp bạn đánh giá Feature dễ hơn, ta nên cân nhắc gộp hoặc bỏ lớp AC riêng. Đây là điểm cần đánh giá bằng ví dụ thực tế trước khi bắt buộc mọi Feature đều có một bảng AC.

Mình chưa sửa tài liệu phương pháp. Câu trả lời đã được lưu vào [answer.md](https://github.com/Kynderis/kidea/blob/master/answer.md) và push lên GitHub.
