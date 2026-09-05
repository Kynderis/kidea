Đúng, **một AC có thể dựa trên nhiều rule, và một rule thường cần nhiều test**. Nhưng còn chiều ngược lại: **một rule có thể phục vụ nhiều AC, và một test có thể kiểm tra nhiều rule hoặc AC cùng lúc**.

Vì vậy, chúng liên kết với nhau theo quan hệ **nhiều–nhiều**, không phải một cây mà mỗi test chỉ thuộc đúng một rule.

Lấy ví dụ Feature **“Hủy đơn hàng”**. Giả sử đơn tồn tại, người yêu cầu đã đăng nhập và ta đã chốt các rule sau:

| Rule | Quy tắc nghiệp vụ |
|---|---|
| R1 | Chỉ chủ đơn mới được hủy đơn. |
| R2 | Chỉ đơn đang `CHỜ_XỬ_LÝ` mới được hủy. |
| R3 | Khi thỏa cả R1 và R2, hủy thành công và chuyển đơn sang `ĐÃ_HỦY`. |
| R4 | Khi yêu cầu bị từ chối, trạng thái đơn phải giữ nguyên. |

**Từ các rule đó, AC diễn đạt những hành vi Feature cần đạt:**

| AC | Tiêu chí chấp nhận | Dựa trên rule |
|---|---|---|
| AC1 | Chủ đơn hủy đơn đang chờ xử lý thì thành công, đơn thành đã hủy. | R1 + R2 + R3 |
| AC2 | Người không phải chủ đơn yêu cầu hủy thì bị từ chối, trạng thái đơn giữ nguyên. | R1 + R4 |
| AC3 | Yêu cầu hủy đơn ở trạng thái không cho phép bị từ chối, trạng thái đơn giữ nguyên. | R2 + R4 |

Bạn có thể thấy:

- **AC1 dựa trên ba rule:** R1, R2, R3.
- **R1 xuất hiện trong hai AC:** AC1 xét người có quyền; AC2 xét người không có quyền.
- **R4 cũng phục vụ hai AC:** cả từ chối vì quyền lẫn vì trạng thái đều phải giữ nguyên đơn.

**Tiếp theo, test đặt dữ liệu cụ thể vào những hành vi này.**

Trong các test dưới đây, đơn O1 thuộc U1; mỗi test bắt đầu độc lập:

| Test | Trạng thái ban đầu | Hành động | Kết quả mong đợi | AC được kiểm tra | Rule được kiểm tra |
|---|---|---|---|---|---|
| T1 | O1 chờ xử lý | U1 hủy O1 | Thành công; O1 thành đã hủy | AC1 | R1, R2, R3 |
| T2 | O1 chờ xử lý | U2 hủy O1 | Từ chối; O1 vẫn chờ xử lý | AC2 | R1, R4 |
| T3 | O1 đang giao | U1 hủy O1 | Từ chối; O1 vẫn đang giao | AC3 | R2, R4 |
| T4 | O1 đang giao | U2 hủy O1 | Từ chối; O1 vẫn đang giao | AC2, AC3 | R1, R2, R4 |

Đọc bảng theo từng chiều sẽ thấy rõ quan hệ:

- **Một AC → nhiều test:** AC2 được kiểm tra bởi T2 và T4.
- **Một rule → nhiều test:** R4 được kiểm tra trong T2, T3 và T4.
- **Một test → nhiều rule:** T1 kiểm tra quyền, trạng thái được phép và kết quả hủy.
- **Một test → nhiều AC:** T4 đồng thời nằm trong trường hợp của AC2 và AC3.

Tuy nhiên, **T4 không thay thế được T2 và T3**. Nếu phần mềm quên kiểm tra quyền, T4 vẫn có thể bị từ chối vì đơn đang giao. T2 mới kiểm tra riêng trường hợp chỉ sai quyền. Tương tự, T3 kiểm tra riêng trường hợp chỉ sai trạng thái. Đây là lý do cần nhiều test dù chúng có chung rule hoặc chung kết quả.

Bảng trên chưa quy định mã lỗi khi vừa sai quyền vừa sai trạng thái. Nếu cần kiểm tra chính xác mã lỗi, ta phải chốt thêm rule ưu tiên lỗi trước, rồi mới bổ sung kết quả mong đợi cho T4.

**Vậy khi viết tài liệu, ta nên làm thế nào?**

1. Làm rõ rule và flow nghiệp vụ.
2. Viết AC để diễn đạt các điều kiện chấp nhận Feature, liên kết về rule/flow tương ứng.
3. Thiết kế test từ cả rule, AC, state và flow; mỗi test ghi rõ nó kiểm tra những mục nào.
4. Đối chiếu ngược để biết AC/rule nào còn thiếu tình huống kiểm tra.

Không cần “mỗi rule sinh một bộ test riêng” rồi chép cùng một test vào nhiều bộ. **T1 chỉ viết một lần và liên kết tới R1, R2, R3 cùng AC1.**

Khi R1 thay đổi, AI tìm AC1, AC2 và các test có liên quan để đọc và phân tích; việc có link chỉ ra nơi cần xem, chưa tự động có nghĩa tất cả đều phải sửa.

Mình chưa sửa tài liệu phương pháp. Câu trả lời đã được lưu vào [answer.md](https://github.com/Kynderis/kidea/blob/master/answer.md) và push lên GitHub.
