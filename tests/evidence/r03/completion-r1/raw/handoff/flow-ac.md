# Luồng và điều kiện chấp nhận

<a id="flow"></a>
## FLOW — bảng nguồn cho nhánh

Actor/đầu vào theo [DATA](rules.md#data). Đây là thứ tự logic, toàn quyết định mutation phải thỏa [R-SERIAL](rules.md#serial), không phải hướng dẫn đọc và ghi không đồng bộ. [INV](rules.md#inv) áp dụng mọi nhánh. Retry không đi qua F3–F6 để thực hiện lại.

| Bước | Điều kiện/hành động, căn cứ | Kết quả / bước tiếp hoặc kết thúc |
|---|---|---|
| F0 | [R-ENTRY](rules.md#entry): nhận diện và hình thức đủ hiểu | Không đạt: lỗi nhận diện/hình thức, kết thúc; đạt: F1. Ưu tiên lỗi cùng F0 còn O1 |
| F1 | [R-ENTRY](rules.md#entry): quyền hiện tại đối tượng/thao tác/kết quả theo loại yêu cầu | Không đạt/đối tượng không truy cập được: không thể thực hiện, không lộ chi tiết, kết thúc; đạt: F2 |
| F2a | [R-RETRY](rules.md#retry): mã mới | F3 |
| F2b | Cùng mã/cùng nội dung, kết quả cuối | Trả kết quả lịch sử, không tác dụng mới; phân biệt trạng thái hiện tại; kết thúc |
| F2c | Cùng mã/khác nội dung | Xung đột; không chạy ý định mới; kết thúc |
| F2d | Cùng mã/cùng nội dung đang xử lý hoặc chưa xác định | Chưa có kết quả cuối; tiếp tục/tra cùng mã. Lần tra sau quay F0 để kiểm quyền lại; không tự chuyển sang F2a |
| F3 | [R-MUTATE](rules.md#mutate): W có OPEN tại quyết định không | Không: hiện không nhận thao tác, kết thúc; có: F4 |
| F4a | REGISTER đã có ACTIVE | Đã đăng ký, dữ liệu nguyên; kết thúc |
| F4b | REGISTER chưa có ACTIVE | F5 |
| F4c | CANCEL đúng ID CANCELLED | Đã hủy, dữ liệu nguyên kể cả có ACTIVE ID mới; kết thúc |
| F4d | CANCEL đúng ID ACTIVE | Chuyển đúng ID theo [STATE](rules.md#state), N−1; F6 |
| F5a | REGISTER, N=C theo authority | Hết chỗ, dữ liệu nguyên; kết thúc |
| F5b | REGISTER, N<C theo authority | Tạo ID mới ACTIVE, N+1 theo [STATE](rules.md#state); F6 |
| F6a | [R-UPDATE](rules.md#update): đã xác định lưu kết quả và nghĩa vụ cập nhật | Thành công cuối; hiển thị được cập nhật qua nghĩa vụ đó; kết thúc |
| F6b | Chưa xác định việc lưu kết quả/nghĩa vụ | Chưa có kết quả cuối; đối chiếu cùng mã qua R-RETRY. Không khẳng định state chưa đổi hoặc tự rollback/replay |

Kết thúc không thay đổi nghiệp vụ không phát thay đổi giả. Kết quả cuối của một mã được giữ theo R-RETRY. “Tiếp tục” ở F2d/F6b là nghĩa vụ, không hứa thời gian trả lời hay chọn recovery algorithm. Thời gian lịch workshop đi qua không tạo thêm nhánh tự đóng.

<a id="ac1"></a>
## AC1 — quyền và thứ tự từ chối

Theo [R-ENTRY](rules.md#entry) và [R-MUTATE](rules.md#mutate), người không đủ quyền không được làm đổi state hoặc thấy dữ liệu riêng. Với yêu cầu mới đủ quyền, không OPEN thắng nhánh đã ACTIVE/đã CANCELLED/đầy; đã ACTIVE thắng nhánh đầy. Kiểm bằng [T-ENTRY](tests.md#entry) và [T-STATE](tests.md#state).

<a id="ac2"></a>
## AC2 — retry và kết quả lịch sử

Theo [R-RETRY](rules.md#retry), cùng mã cùng nội dung không có tác dụng nghiệp vụ lần hai; kết quả cuối cũ vẫn được trả sau đổi state nếu quyền hiện tại hợp lệ, không được diễn giải thành ACTIVE hiện tại. Xung đột nội dung không thực hiện ý định mới; pending/unknown không là thất bại cuối và tiếp tục cùng mã. Kiểm bằng [T-RETRY](tests.md#retry).

<a id="ac3"></a>
## AC3 — vòng đời và chỗ

Theo [R-MUTATE](rules.md#mutate), [STATE](rules.md#state) và [INV](rules.md#inv), OPEN nhận khi chưa ACTIVE và còn chỗ; đầy không nhận thêm; hủy đúng ACTIVE giải phóng một chỗ. Hủy lặp không đổi; đăng ký lại dùng ID mới; hủy ID cũ không đụng ID mới. Kiểm bằng [T-STATE](tests.md#state).

<a id="ac4"></a>
## AC4 — tranh chấp

Theo [R-SERIAL](rules.md#serial), mỗi kết quả đồng thời tương đương một thứ tự hợp lệ và giữ I1/I2 tại mỗi bước. Không được nhận cả hai người tranh một chỗ hoặc đồng thời nhận đăng ký và giảm C xuống dưới N mới. PAUSE được xét trong thứ tự quyết định. Kiểm bằng [T-CONCURRENT](tests.md#concurrent); không đặt người thắng cố định.

<a id="ac5"></a>
## AC5 — cập nhật có thể phục hồi, riêng tư và số chỗ trễ

Theo [R-UPDATE](rules.md#update), thay đổi thật có kết quả/nghĩa vụ phục hồi được giữ trước thành công cuối; version cũ/lặp không lùi hiển thị; xung đột version phải đối chiếu; mất kết nối không giả số chỗ bằng 0 hoặc replay nghiệp vụ. Bản công khai không lộ cá nhân/request. Kiểm bằng [T-UPDATE](tests.md#update).

## Traceability ngược

AC1 được dùng bởi T-ENTRY/T-STATE; AC2 bởi T-RETRY; AC3 bởi T-STATE; AC4 bởi T-CONCURRENT; AC5 bởi T-UPDATE, qua các link ở từng mục trên. FLOW là caller của rules, đồng thời được [coverage](tests.md#coverage) dùng để kiểm nhánh bị bỏ sót. AC là điều kiện quan sát, chưa được nghiệm thu bằng thực thi sản phẩm.
