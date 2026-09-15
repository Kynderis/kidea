# Đặc tả business test

<a id="setup"></a>
## Tiền đề và ký hiệu

Tất cả ca dưới là **đặc tả chưa chạy trên sản phẩm**. [DATA](rules.md#data) định nghĩa state/input; [INV](rules.md#inv) I1–I6 là assertion chung cho tất cả ca, kể cả không nhắc lại ở từng hàng. Số N cuối luôn phải khớp bản ACTIVE, không chỉ số hiển thị. Mỗi dòng có thể liệt kê biến thể hữu hạn; mỗi biến thể chạy riêng từ state đầu đã ghi, không cộng dồn trừ khi nói “chuỗi”.

Mặc định: W=OPEN, C=2,N=0; U là participant đủ quyền, chưa ACTIVE; mã request mới, dữ liệu hợp lệ; Q là actor khác. Authority có thể hoàn tất lưu kết quả/nghĩa vụ cập nhật, không có thao tác khác xen vào ngoài sequence đã chỉ định. Thay đổi thật yêu cầu R-UPDATE, từ chối/no-op không tạo thay đổi mới. Một “thành công” trong expected là thành công cuối khi điều kiện đó thỏa. ID A/B là nhãn đục minh họa, không phải grammar protocol được chốt. Bộ này áp dụng cả web và native, không coi test web là đã thực thi native.

<a id="coverage"></a>
## Nghĩa vụ trước ca

| Nghĩa vụ/nguồn | Ca chỉ định | Giới hạn |
|---|---|---|
| [R-ENTRY](rules.md#entry), FLOW F0/F1, AC1 | E01–E06 | Không chọn ưu tiên giữa lỗi cùng F0 hoặc permission model chưa chốt |
| [R-RETRY](rules.md#retry), F2a–d/F6b, AC2 | R01–R09 | Kỹ thuật crash recovery/SLO chưa executable |
| [STATE](rules.md#state), F3/F4a–d/F5a–b, AC3 | S01–S12 | Không nhân tất cả C với tất cả state; có biên đại diện và nhánh hữu hạn |
| [R-SERIAL](rules.md#serial), AC4 | C01–C05, S10–S12 | Cả hai thứ tự mỗi cặp rủi ro; không tuyên bố mọi interleaving nhiều thao tác |
| [R-UPDATE](rules.md#update), F6a–b, AC5 | U01–U07, R04–R05 | Hợp đồng slice, không toàn màn hình monitoring hoặc mọi điểm crash |
| Giữ ngoài MVP | S09; E04; INDEX FUT-1/FUT-2 | Không triển khai/đặc tả sâu Future |

Các bảng dưới là hữu hạn những nhánh đã lựa chọn cho lát cắt, không phải toàn bốn Feature MVP. Không bao phủ đầy đủ validation tiêu đề/mô tả/lịch và toàn bảng chuyển W/admin, danh sách sort/tie-break, monitoring. Các nghĩa vụ này vẫn thuộc completion D, chưa bị miễn bởi bộ test này. Dữ liệu cá nhân và hiển thị được kiểm ở biên dùng chung cần cho đăng ký/hủy.

Loại tổ hợp bất khả thi: N<0 hoặc N>C không là state đầu hợp lệ; CANCEL ACTIVE với N=0 không hợp lệ theo I1; cùng ID vừa ACTIVE vừa CANCELLED không hợp lệ; participant thường đọc DRAFT không vượt quyền để tới F3. Không giả expected repair cho dữ liệu hỏng. Không nhân mọi lỗi hình thức với mọi state bởi F0 dừng trước nghiệp vụ; những lỗi kết hợp làm đổi kết quả quan sát (quyền+PAUSED, PAUSED+đầy/ACTIVE/CANCELLED, ACTIVE+đầy) được liệt kê riêng. Rủi ro retry/concurrency không bị loại vì nhiều biến thể.

<a id="entry"></a>
## T-ENTRY — quyền và đầu vào

Căn cứ chung từng ca: [R-ENTRY](rules.md#entry), [AC1](flow-ac.md#ac1), I5/I6.

| ID | State đầu và input/event | Expected output/state cuối |
|---|---|---|
| E01 | Khách chưa nhận diện gửi REGISTER hợp lệ còn lại | Không thực hiện, yêu cầu nhận diện; N=0; không tạo đăng ký |
| E02 | U; lần lượt thiếu/null operation, workshopId hoặc requestId khiến không hiểu yêu cầu; CANCEL thiếu/null registrationId | Lỗi hình thức riêng với từ chối nghiệp vụ; N/state nguyên. Exact encoding/message còn O1 |
| E03 | Q có A ACTIVE, N=1; U CANCEL A; biến thể A không tồn tại trong phạm vi U | Không thể thực hiện, không lộ A/state của Q; N=1, A ACTIVE trong biến thể có A |
| E04 | Admin chỉ có quyền admin, không sở hữu A của U; CANCEL A, N=1 | Không thể hủy hộ; A ACTIVE,N=1 |
| E05 | W=PAUSED,N=C=2; actor không đủ quyền thao tác | Không thể thực hiện trước lỗi PAUSED/đầy; state nguyên, không tiết lộ số chỗ |
| E06 | Participant không có quyền DRAFT; W=DRAFT,N=0; REGISTER | Không thể thực hiện trước nhánh W; không tiết lộ workshop riêng, N=0 |

<a id="state"></a>
## T-STATE — nhánh và chuỗi

Căn cứ chung từng ca: [R-MUTATE](rules.md#mutate), [STATE](rules.md#state), [AC3](flow-ac.md#ac3), I1–I3/I5; ca có thứ tự lỗi còn [AC1](flow-ac.md#ac1).

| ID | State đầu và input/event | Expected output/state cuối |
|---|---|---|
| S01 | Không ACTIVE; từng cặp (C,N)=(1,0),(2,0),(1000,999); REGISTER | Nhận ID A ACTIVE; N lần lượt 1,1,1000; C nguyên |
| S02 | Không ACTIVE của U; (C,N)=(1,1),(2,2),(1000,1000); REGISTER | Hết chỗ; không tạo A; N/C nguyên |
| S03 | U có A ACTIVE; (C,N)=(2,1) và (2,2); mã mới REGISTER | Đã đăng ký cho cả hai, không trả đầy ở biến thể hai; N/A nguyên |
| S04 | U có A ACTIVE; (C,N)=(1,1),(2,1),(2,2); CANCEL A | A CANCELLED, N lần lượt 0,0,1; C nguyên |
| S05 | U có A CANCELLED,N=0; CANCEL A với mã mới; tiếp tục CANCEL A với mã mới nữa | Mỗi lần đều đã hủy, N=0; không thay đổi/event mới |
| S06 | Chuỗi từ mặc định: REGISTER→A; CANCEL A; REGISTER→B; CANCEL A mã mới | A CANCELLED; B khác A và ACTIVE; N=1; lần cuối đã hủy, không đụng B |
| S07 | PAUSED: (a) U chưa ACTIVE,N=C=2; (b) U có A ACTIVE,N=1; REGISTER mã mới | Cả hai hiện không nhận thao tác; N/bản nguyên; không báo đầy/đã đăng ký |
| S08 | PAUSED: đích (a) A ACTIVE,N=1 hoặc (b) A CANCELLED,N=0; CANCEL mã mới | Cả hai hiện không nhận thao tác, không báo đã hủy ở (b); state nguyên |
| S09 | U đã ACTIVE ở hai workshop khác; workshop đích OPEN,C=2,N=0, U chưa ACTIVE; REGISTER | Nhận tại workshop đích,N=1; không chặn do giới hạn toàn hệ thống chưa thuộc MVP |
| S10 | [R-SERIAL](rules.md#serial): admin đủ quyền sửa C, C=10,N=9; lần lượt C mới=0,1,8,9,10,1000,1001 | 0/1001 ngoài miền và 1/8 dưới N: từ chối giữ C=10; 9: nhận C=9; 10: không đổi; 1000: nhận C=1000; N=9 tất cả. Không gán thứ tự lỗi admin |
| S11 | R-SERIAL: C=2,N=0; admin sửa C thành 1 rồi REGISTER U | C=1, REGISTER thành công,N=1; kiểm biên 1 có thể được nhận khi N cho phép |
| S12 | W=OPEN,C=2,N=0; thời điểm kết thúc workshop đã qua; REGISTER U | Không tự đóng theo đồng hồ; nhận A,N=1 nếu mọi điều kiện mặc định thỏa |

Nhánh DRAFT đã qua quyền trong STATE là điều kiện logic: nếu sau này xác định actor có quyền participant và truy cập DRAFT, yêu cầu mới dừng không OPEN. Không giả định quyền kết hợp đó để chấm một ca sản phẩm cụ thể; O2 còn mở.

<a id="retry"></a>
## T-RETRY — lịch sử, xung đột và chưa biết

Căn cứ chung từng ca: [R-RETRY](rules.md#retry), [AC2](flow-ac.md#ac2), I4/I6; liên quan lưu/phục hồi dùng [R-UPDATE](rules.md#update).

| ID | State đầu và input/event/chuỗi | Expected output/state cuối |
|---|---|---|
| R01 | REGISTER mã x đã thành công A,N=1, phản hồi mất; gửi x cùng nội dung | Thành công lịch sử cùng A; N=1, một ACTIVE, không nghĩa vụ thay đổi mới |
| R02 | Từ R01: CANCEL A mã y thành công; PAUSE; gửi lại x cùng nội dung đủ quyền | Trả thành công lịch sử REGISTER A; hiện A CANCELLED,N=0,W=PAUSED; không nhận lại hoặc gọi hiện ACTIVE |
| R03 | CANCEL A mã y đã thành công; đăng ký lại B rồi PAUSE; gửi lại y cùng nội dung | Trả thành công CANCEL lịch sử A; B vẫn ACTIVE,N=1; không phải hủy khi PAUSED |
| R04 | x đang xử lý, chưa có final; gửi x cùng nội dung | Chưa có final, tiếp tục/tra cùng x, không tạo yêu cầu mới hoặc tác dụng thêm. State cuối phụ thuộc lần xử lý gốc, chưa được suy thất bại |
| R05 | x chưa xác định sau gián đoạn; biến thể authority (a) chưa đổi state, (b) đã tạo A nhưng chưa xác định lưu outcome/nghĩa vụ | Chưa có final, tra cùng x; không tự nói thất bại hoặc N=0 ở (b), không replay. Sau đối chiếu nếu xác lập final thì trả đúng final và chỉ một tác dụng gốc; không đặt thời hạn hay outcome trước bằng chứng |
| R06 | x đã dùng REGISTER W1; cùng actor gửi x đổi thành REGISTER W2 hoặc CANCEL A | Xung đột nội dung, không thao tác W2/CANCEL; toàn state nguyên |
| R07 | x đã final hết chỗ C=1,N=1; người khác hủy làm N=0; retry x cùng nội dung; sau đó ý định mới mã z | x vẫn trả hết chỗ lịch sử,N=0; z kiểm hiện tại rồi nhận A,N=1 |
| R08 | x có final thành công A,N=1; quyền hiện tại truy cập kết quả của actor đã mất; retry x | Không trả kết quả riêng cũ; không thể thực hiện/đọc; A,N không đổi. Không biến lỗi quyền hiện tại thành sửa kết quả lịch sử |
| R09 | x là mã đã dùng của U; Q yêu cầu đọc/gửi lại x như của U, không có quyền | Không đọc/lộ outcome của U, không mutation; không suy quyền chỉ từ mã biết được |

R04/R05 có expected “chưa final” rõ nhưng không chứng minh liveness hoặc quyết định kỹ thuật cuối còn chưa xác định. Đây không được tính như một test phục hồi sản phẩm đã đạt. Xung đột nội dung đang xử lý cũng theo R-RETRY (khác nội dung → xung đột); biến thể triển khai phép so sánh payload chờ O1.

<a id="concurrent"></a>
## T-CONCURRENT — lịch cụ thể cả hai thứ tự

Căn cứ chung từng ca: [R-SERIAL](rules.md#serial), [R-MUTATE](rules.md#mutate), [AC4](flow-ac.md#ac4), I1/I2/I5. Các request đều mã mới, actors đủ quyền; “trước” là thứ tự kết quả có thẩm quyền, không phải thứ tự bấm. Kiểm từng lịch riêng; không yêu cầu implementation ép người thắng cố định.

| ID | State đầu/thao tác đồng thời | Lịch 1 và state cuối | Lịch 2 và state cuối |
|---|---|---|---|
| C01 | OPEN,C=1,N=0; REGISTER U và REGISTER Q | U được nhận A,N=1; Q hết chỗ; cuối chỉ U ACTIVE | Q được nhận B,N=1; U hết chỗ; cuối chỉ Q ACTIVE |
| C02 | OPEN,C=10,N=9; REGISTER U và admin giảm C→9 | REGISTER nhận,N=10; giảm bị từ chối; cuối C=10,N=10 | Giảm nhận,C=9,N=9; REGISTER hết chỗ; cuối C=9,N=9 |
| C03 | OPEN,C=2,N=0; REGISTER U và PAUSE | REGISTER nhận A,N=1; PAUSE nhận; cuối PAUSED,A ACTIVE | PAUSE nhận; REGISTER không nhận thao tác; cuối PAUSED,N=0 |
| C04 | OPEN,C=2,N=1,A ACTIVE của U; CANCEL A và PAUSE | CANCEL nhận,A CANCELLED,N=0; PAUSE nhận; cuối PAUSED | PAUSE nhận; CANCEL không nhận thao tác; cuối PAUSED,A ACTIVE,N=1 |
| C05 | OPEN,C=2,N=0; U gửi hai ý định REGISTER với mã x và z khác nhau | x nhận A,N=1; z đã đăng ký; cuối một ACTIVE | z nhận B,N=1; x đã đăng ký; cuối một ACTIVE |

Mọi kết quả nhận đồng thời cả hai trong C01, hoặc C02 kết thúc N>C, đều trái quy tắc; không sửa bằng “eventual consistency”. Với retry cùng mã, áp dụng R-RETRY thay vì coi là hai ý định như C05. Không có cam kết ưu tiên/fairness hoặc latency trong các lịch này.

<a id="update"></a>
## T-UPDATE — biên cập nhật của slice

Căn cứ chung từng ca: [R-UPDATE](rules.md#update), [AC5](flow-ac.md#ac5), I4/I6.

| ID | State đầu và event/sequence | Expected output/state cuối |
|---|---|---|
| U01 | OPEN,C=2,N=0; REGISTER thành công rồi CANCEL đúng ID; authority xác định đã giữ outcome và thông tin phục hồi | N lần lượt 1 rồi 0; mỗi thay đổi thực có nghĩa vụ cập nhật; final trả được; public snapshot không chứa danh tính/mã request |
| U02 | Đã quan sát v12 còn 1 chỗ; nhận v11, rồi v12 cùng nội dung | Bỏ hai bản, vẫn v12/còn 1; không mutation đăng ký |
| U03 | Đã quan sát v12 còn 1; nhận v12 nội dung khác số chỗ | Ghi lỗi/đối chiếu nguồn, không chọn tùy tiện/lùi state; không replay nghiệp vụ |
| U04 | Đã quan sát v12 còn 1 lúc t; biết mất kết nối; reconnect đang đối chiếu; nhận snapshot authority v15 đủ bao phủ còn 0 | Trong mất/đối chiếu giữ số 1 và t, ghi chưa cập nhật; sau đối chiếu nhận v15 số 0 đúng nguồn. Không bịa 0 trong thời gian mất, không REGISTER lại |
| U05 | Có khoảng trống cập nhật; nhận dữ liệu mới nhưng chưa đủ tái lập trạng thái nhất quán | Đọc authority để phục hồi, không tự coi phần thiếu đã đầy đủ; giữ biểu thị chưa cập nhật trong đối chiếu; không đổi nghiệp vụ |
| U06 | UI quan sát còn 1; authority C=1,N=1; U REGISTER mới chưa ACTIVE | Hết chỗ theo authority,N=1; cache không quyết định nhận; không có ACTIVE mới |
| U07 | REGISTER đã tạo A nhưng việc giữ outcome/nghĩa vụ chưa xác định; bên hiển thị chưa nhận | Không báo thành công cuối, chưa xác định và tra cùng mã như R05; không tạo A thứ hai. Chưa thấy event không là lý do replay |

## Phần chưa thực hiện/không tuyên bố

- Chưa chạy code, test executable, UI web/native, network/crash injection, privacy penetration, performance, latency hoặc deployment.
- Chưa phủ toàn bộ product fields, admin flow, view flow, monitoring flow; chưa có exhaustive mọi chuỗi dài và interleaving nhiều thao tác. Các cặp rủi ro được chọn có cả hai thứ tự, không đồng nghĩa toàn Feature hoàn tất.
- [OPEN](rules.md#open) chặn expected về protocol/permission mapping/SLO/UI ban đầu tương ứng; không tự đặt giá trị để làm ca có vẻ đầy đủ.
- Các link ngược nằm ở [rules IMPACT](rules.md#impact) và AC. Khi sửa rule phải đối chiếu cả expected lẫn coverage; số lượng hàng không thay review ngữ nghĩa và không tạo Human approval.
