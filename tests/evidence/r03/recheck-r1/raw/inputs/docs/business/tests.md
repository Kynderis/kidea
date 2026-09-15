# Workshop — đặc tả kiểm thử nghiệp vụ

Đây là các ca cần chạy khi có sản phẩm, **chưa là test ứng dụng đã thực thi**. Kiểm link tài liệu và phiên đọc AI không thay thế chúng. Mỗi hàng tham số hóa yêu cầu chạy từng biến thể được liệt kê; không lấy số hàng làm số ca đã PASS.

<a id="coverage"></a>
## Coverage và cách đọc

Tiền đề chung khi hàng không ghi khác: actor tham gia đủ quyền, input hợp lệ, workshop OPEN, mã mới, không lỗi lưu; C10,N0, chưa ACTIVE. Mọi kết quả từ chối/không đổi giữ dữ liệu và không phát thay đổi giả. Mọi mutation giữ [R-INV](shared/registration.md#invariant), nghĩa vụ [V-PUBLISH](shared/availability.md#publish). Kết quả tên Việt là ngữ nghĩa, không mã HTTP hoặc câu UI bắt buộc.

| Nghĩa vụ nguồn | Ca bắt buộc | Feature/AC dùng |
|---|---|---|
| W-ACCESS/W-LISTS/W-STATE | P01–P08 | [Xem AC](features/view.md#ac), [đăng ký AC](features/register-cancel.md#ac), [admin AC](features/admin.md#ac), [cập nhật AC](features/updates.md#ac) |
| R-INV/R-NEW/B4 | R01–R08 | [Đăng ký AC](features/register-cancel.md#ac), [admin AC](features/admin.md#ac) |
| R-RETRY/D1 | I01–I10 | [Đăng ký AC](features/register-cancel.md#ac) |
| R-SERIAL/D3 | C01–C05 | [Đăng ký AC](features/register-cancel.md#ac), [admin AC](features/admin.md#ac) |
| W-DATA/W-EDIT | D01–D08 | [Admin AC](features/admin.md#ac) |
| V-PUBLISH/RECONCILE/STALE/MONITOR | E01–E10 | [Cập nhật AC](features/updates.md#ac), [xem AC](features/view.md#ac), [đăng ký AC](features/register-cancel.md#ac) |
| Flow, link, ảnh hưởng, nền tảng | T01–T04 | Cả bốn Feature |

Vét toàn 9 ô chuyển state, các nhánh retry, các cặp lịch được yêu cầu ở cả hai thứ tự; biên field theo phân hoạch. Không nhân mọi độ dài với mọi role/state: kiểm quyền và biên có nghĩa độc lập trong rule; thêm các tổ hợp rủi ro có tương tác (PAUSED+đầy/ACTIVE, quyền+PAUSED, retry sau đổi state, capacity+đăng ký). Không loại concurrency/retry vì tốn số ca. Trạng thái N>C hoặc hai ACTIVE có sẵn không là seed hợp lệ để thử đường thành công; phát hiện dữ liệu hỏng/repair kỹ thuật cần đặc tả riêng, không miễn invariant. Stress/liveness/độ trễ số giây, thiết bị thật, recovery storage, transport encoding thuộc kỹ thuật/triển khai; chưa được coverage này chứng minh.

<a id="access"></a>
## Quyền, hiển thị và state

Căn cứ [W-ACCESS](shared/workshop.md#access), [W-STATE](shared/workshop.md#state), [W-LISTS](shared/workshop.md#lists); [flow xem](features/view.md#flow), [flow đăng ký](features/register-cancel.md#flow), [flow admin](features/admin.md#flow), [flow cập nhật](features/updates.md#flow).

| ID | State/input và biến thể phải xét | Expected/state sau |
|---|---|---|
| P01 | Khách/người tham gia/admin × đọc công khai DRAFT/OPEN/PAUSED | DRAFT không công khai cho bất kỳ actor nào; admin đọc DRAFT qua phạm vi admin; OPEN/PAUSED công khai, PAUSED có nhãn. Không thay dữ liệu |
| P02 | Khách/người tham gia/admin × tạo/sửa/đặt state/monitoring | Chỉ quyền admin nhận; khách/tham gia không thể thực hiện; role client giả admin không vượt quyền |
| P03 | Khách, chính chủ, người khác, admin-only × đăng ký/hủy/xem lịch sử | Khách không có thao tác cá nhân; người tham gia chỉ chính chủ; admin không hủy hộ hoặc xem danh tính qua trang admin; không rò kết quả riêng |
| P04 | ID không tồn tại và ID người khác; cả OPEN và PAUSED | Cùng không thể thực hiện trong phạm vi truy cập; không tiết lộ state/C/N hay kết quả cũ |
| P05 | OPEN/PAUSED có start trước/sau và hai workshop cùng start; thêm DRAFT | Chỉ public OPEN/PAUSED, tăng theo thời điểm rồi ID ổn định; không biến lịch quá khứ thành đóng |
| P06 | Chủ có ACTIVE A và CANCELLED B; người khác hỏi cùng danh sách | Chủ thấy phân biệt cả hai; người khác không thấy; không lọc mất lịch sử hủy |
| P07 | Admin đặt đích DRAFT/OPEN/PAUSED từ mỗi trạng thái (9 ô), thêm giá trị lạ | Chính xác ma trận W-STATE: 3 không đổi, 3 chấp nhận, 3 từ chối; giá trị lạ từ chối. Không đổi/từ chối không event giả |
| P08 | Thời gian trôi qua start/end ở mỗi DRAFT/OPEN/PAUSED | State/dữ liệu giữ nguyên, không tự đóng/xóa hoặc hủy đăng ký |

<a id="registration"></a>
## Đăng ký/hủy

Căn cứ [R-INV](shared/registration.md#invariant), [R-NEW](shared/registration.md#new), [AC-R1/R4](features/register-cancel.md#ac).

| ID | State/input | Expected/state sau |
|---|---|---|
| R01 | Không có ACTIVE; C1,N0 và C10,N9: đăng ký mới | Nhận ID mới ACTIVE, N+1=C, một nghĩa vụ thay đổi |
| R02 | Không có ACTIVE; C1,N1 và C10,N10: đăng ký mới | Hết chỗ; N/C/registrations giữ nguyên |
| R03 | Đã ACTIVE; lần lượt N<C và N=C; mã mới đăng ký | Đã đăng ký trước kiểm đầy; không thêm ACTIVE/event |
| R04 | A ACTIVE chính chủ; N1 và N=C: hủy A | A CANCELLED, N−1, một nghĩa vụ thay đổi |
| R05 | A CANCELLED; còn chỗ: đăng ký lại B rồi hủy A bằng mã mới | B ID khác A, ACTIVE; hủy A trả đã hủy, B/N không đổi ở bước cuối |
| R06 | A CANCELLED, không rebook; mã mới hủy A hai lần khi OPEN | Cả hai đã hủy, không giảm N hoặc event |
| R07 | PAUSED với không ACTIVE/đã ACTIVE × N<C/N=C; đăng ký mới; hủy ACTIVE/CANCELLED mới | Tất cả báo hiện không nhận thao tác trước duplicate/full/already-cancelled; N giữ nguyên |
| R08 | DRAFT, người tham gia thao tác ID không thuộc phạm vi; và thiếu registrationID khi hủy | DRAFT chặn quyền không lộ state; thiếu ID lỗi hình thức trước truy đối tượng; không tìm ACTIVE khác để hủy |

<a id="retry"></a>
## Gửi lại và kết quả chưa biết

Căn cứ [R-RETRY](shared/registration.md#retry), [R-NEW](shared/registration.md#new), [AC-R2](features/register-cancel.md#ac), [V-PUBLISH](shared/availability.md#publish).

| ID | Chuỗi/state/input | Expected/state sau |
|---|---|---|
| I01 | Nhận đăng ký với mã X, mất phản hồi, gửi X cùng nội dung 2 lần | Trả kết quả đầu; chỉ một registration, N chỉ tăng 1, không event nghiệp vụ lần hai |
| I02 | Hủy A mã X thành công, gửi X lại | Trả hủy cũ, N không giảm lần hai |
| I03 | X có kết quả; đổi action/workshop/registrationID (từng biến thể) | Xung đột nội dung, không chạy ý định mới |
| I04 | X cùng nội dung đang xử lý hoặc chưa xác định hiệu lực lưu | Chưa có kết quả cuối, tra/tiếp tục X; không tự nói thất bại cuối hoặc tạo mã Y |
| I05 | X đăng ký thành công; hủy A, PAUSE workshop (xét riêng và cùng xảy ra); gửi X | Quyền hiện tại hợp lệ: kết quả lịch sử cũ, trạng thái hiện tại không bị nói thành ACTIVE; không hồi sinh/chỗ/event |
| I06 | X đã có kết quả; quyền hiện tại bị thu hồi hoặc actor khác biết X | Chặn đọc, không lộ kết quả; dữ liệu không đổi |
| I07 | X bị FULL; sau đó có chỗ; gửi X rồi tạo ý định Y | X vẫn FULL lịch sử, không nhận; Y kiểm mới, nhận nếu điều kiện vẫn hợp lệ |
| I08 | X đã hủy thành công; PAUSE; gửi X rồi mã mới Y hủy cùng ID | X trả lịch sử; Y báo tạm dừng trước đã hủy; N giữ nguyên |
| I09 | OPEN,C2,N0; cùng U gửi hai bản REGISTER X cùng nội dung đồng thời khi chưa có kết quả | Chỉ một ý định/ID ACTIVE,N1 và một nghĩa vụ thay đổi; trong xử lý có thể chưa-final, khi đã final cả lần đọc trả cùng kết quả/ID lịch sử. Không đổi bản thứ hai thành mã mới hoặc kết quả đã đăng ký của ý định khác; không đặt thời hạn |
| I10 | OPEN,C3,N2,A ACTIVE; CANCEL Y đã đổi A CANCELLED,N1 nhưng chưa xác định lưu kết quả/nghĩa vụ; gửi lại Y. Xét thêm nhánh sau đó U đăng ký mới B khi authority có thể xử lý hợp lệ | Giữ chưa-final/tra cùng Y tới khi có căn cứ kết quả; không giảm N lần hai, không báo thất bại cuối do mất phản hồi, giữ nghĩa vụ cập nhật. Không có B: N1; có B: B ACTIVE,N2, phục hồi Y không hủy B. Không suy việc tạo B giải quyết sự chưa biết của Y |

<a id="concurrency"></a>
## Lịch đồng thời — đủ cả hai thứ tự

Căn cứ [R-SERIAL](shared/registration.md#serial), [R-INV](shared/registration.md#invariant), [W-STATE](shared/workshop.md#state); [AC-R3](features/register-cancel.md#ac), [AC-A3](features/admin.md#ac). Mỗi hàng là **hai ca lịch**, không khẳng định thứ tự vật lý/ai bấm trước.

| ID | Seed / hai thao tác | Thứ tự thứ nhất | Thứ tự ngược |
|---|---|---|---|
| C01 | C10,N9; U và V khác người đăng ký | U nhận N10, V FULL | V nhận N10, U FULL |
| C02 | C10,N9; đăng ký U và giảm C9 | U nhận N10, giảm bị từ chối C10 | Giảm C9,N9, U FULL |
| C03 | C10,N0 OPEN; U đăng ký và PAUSE | U nhận N1, sau PAUSED vẫn ACTIVE | PAUSED trước, U tạm dừng, N0 |
| C04 | C10,N1, A ACTIVE OPEN; hủy A và PAUSE | Hủy A CANCELLED,N0, sau PAUSED | PAUSED trước, hủy tạm dừng, A ACTIVE,N1 |
| C05 | C10,N0; cùng người U, hai mã mới X/Y đăng ký | X nhận một ACTIVE,N1; Y đã đăng ký | Y nhận một ACTIVE,N1; X đã đăng ký |

<a id="data"></a>
## Miền dữ liệu và sửa admin

Căn cứ [W-DATA](shared/workshop.md#data), [W-EDIT](shared/workshop.md#edit), [R-INV](shared/registration.md#invariant); [AC-A2](features/admin.md#ac).

| ID | Input/state và từng biến thể | Expected |
|---|---|---|
| D01 | N0, C đề nghị 0/1/1000/1001; thêm −1, 1.5, null, thiếu | Chỉ 1 và 1000 nhận; còn lại từ chối, không làm tròn |
| D02 | C10,N9; đề nghị C8/C9/C10 | C8 từ chối; C9 nhận; C10 không đổi; không tự hủy ACTIVE |
| D03 | Tiêu đề sau trim dài 0/1/120/121; whitespace-only, newline, thiếu/null | Chỉ độ dài 1/120 một dòng hợp lệ; còn lại sai. Có emoji ngoài BMP: tính một code point, không hai UTF-16 unit |
| D04 | Mô tả sau trim dài 0/1/5000/5001; newline giữa văn bản, thiếu/null | 1/5000 và newline trong giới hạn hợp lệ; 0/5001/thiếu/null sai; trim trước đếm |
| D05 | Tiêu đề/mô tả nhập HTML hoặc Markdown; văn bản plain có dấu tiếng Việt | Nội dung markup không được nhận như nội dung định dạng hay thực thi; plain hợp lệ giữ nghĩa. Cú pháp nhận diện/encoding kỹ thuật phải giữ hợp đồng văn bản thuần |
| D06 | Start=end, start>end, end>start; thiếu timezone ở từng mốc, thiếu/null từng mốc; hai timezone biểu diễn cùng instant | Chỉ end>start và đủ timezone nhận; cùng instant vẫn bằng nên từ chối; không so chữ giờ địa phương |
| D07 | 3 state × sửa từng title/description/schedule/C hợp lệ; lặp lại chính nội dung đã chuẩn hóa | Thay đổi thực nhận với đúng nghĩa vụ; lặp không đổi không event giả; DRAFT không phát nội dung cho public |
| D08 | Đang có ACTIVE; sửa lịch hợp lệ, thử xóa workshop/quay DRAFT | Sửa lịch nhận, đăng ký giữ nguyên, không hứa thông báo riêng; xóa/quay DRAFT không được phép |

<a id="events"></a>
## Event, riêng tư và gián đoạn

Căn cứ [V-PUBLISH](shared/availability.md#publish), [V-RECONCILE](shared/availability.md#reconcile), [V-STALE](shared/availability.md#stale), [V-MONITOR](shared/availability.md#monitor); [AC-U](features/updates.md#ac), [AC-V2](features/view.md#ac).

| ID | State/input | Expected/state sau |
|---|---|---|
| E01 | Đã thấy v11; nhận v12 snapshot C10,N9 nhất quán | Hiện v12, còn1; không ghép C/N khác version |
| E02 | Đã thấy v12; nhận v12 cùng nội dung, rồi v11 | Không đổi hoặc đếm lại/lùi về v11 |
| E03 | Đã thấy v12; nhận v12 khác C/N/nội dung (từng loại) | Báo lỗi cần đối chiếu, không chọn tùy tiện; chưa xác nhận |
| E04 | Mất v12/v13; nhận v14 snapshot đủ bao phủ | Khôi phục v14, không bắt replay từng event cũ/đăng ký |
| E05 | Gián đoạn, bản nhận không đủ bao phủ | Giữ quan sát gần nhất có nhãn; đọc nguồn thẩm quyền rồi khôi phục; giữ event lỗi |
| E06 | Đang hiện còn1 tại T; mất kết nối; biến thể chưa từng có snapshot | Có bản: giữ 1/T với “chưa cập nhật”; chưa có: không bịa 0/T; phục hồi cập nhật đúng bản |
| E07 | Lưu kết quả/nghĩa vụ thay đổi chưa biết; biến thể đã lưu chắc nhưng view chưa nhận | Chưa biết: không thành công/thất bại cuối, giữ mã; đã chắc: được trả kết quả cuối, view trễ không đảo nghiệp vụ |
| E08 | Thay đổi đăng ký/hủy/C/state/nội dung công khai (từng loại); thêm no-op/từ chối/retry | Thay đổi thực có nghĩa vụ và version phù hợp; ba loại không đổi không tạo thay đổi giả |
| E09 | Public snapshot/log hiển thị, cá nhân, monitoring; DRAFT thay đổi | Public không identity/requestID/dữ liệu đăng ký riêng; DRAFT chỉ admin; riêng tư kiểm quyền; không đưa lỗi chứa dữ liệu riêng ra public |
| E10 | Admin xem pending/error/lag/last-success; mất quan sát; người không quyền; tìm replay/delete | Chỉ admin xem dữ liệu quan sát; mất tín hiệu không giả 0/healthy; không nút replay/delete; giữ lỗi để đối chiếu |

<a id="trace"></a>
## Flow, traceability và giới hạn

| ID | Kiểm tra | Expected / căn cứ |
|---|---|---|
| T01 | Đọc độc lập cả [xem](features/view.md#flow), [đăng ký](features/register-cancel.md#flow), [admin](features/admin.md#flow), [updates](features/updates.md#flow) | Theo input/state xác định nhánh/kết quả và mục nguồn; mỗi Feature có AC/test, không cần transcript |
| T02 | Theo link mọi rule/AC/test, rồi backlink tại [C-REG](shared/registration.md#relations), [C-LIFE](shared/workshop.md#relations), [C-VIEW](shared/availability.md#relations) | Đích tồn tại, đúng mục đích; không chỉ có link tới trang nhưng sai hợp đồng |
| T03 | Giả lập đề xuất đổi cho hủy PAUSED hoặc max2ACTIVE toàn hệ thống | Chưa áp dụng [Future](../features.md#later); truy ảnh hưởng state/new/retry/caller/AC/test, xin quyết định thay đổi phạm vi trước triển khai |
| T04 | Cùng case đăng ký/xem trên web/Android/iOS; web JS-off cho public list/detail và trang giới thiệu | Cùng nghĩa nghiệp vụ; public nội dung đọc trước JS theo [phạm vi nền tảng](../features.md#boundaries); hiện NOT_RUN vì chưa sản phẩm/thiết bị, không lấy hồ sơ thay bằng chứng |

Các bảng trên là nguồn expected cụ thể có dẫn rule, không oracle kiểm từ khóa. Chưa lựa chọn ngưỡng hiệu năng, broker, DB, API, UI hoặc thuật toán. Không có kết luận “toàn sản phẩm PASS” từ việc rà tài liệu này.
