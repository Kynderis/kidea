# Quy tắc và trạng thái

<a id="data"></a>
## DATA — đầu vào, đầu ra và nguồn quyết định

Actor thao tác là người dùng đã được nhận diện và có quyền đối với đối tượng; admin không được hủy hộ. Trigger là ý định REGISTER hoặc CANCEL của chính người tham gia trên web/native. Căn cứ: registration D2; completion A, B1, B2, B4, B7.

| Dữ liệu | Nghĩa và miền |
|---|---|
| actor | Danh tính được xác thực, không tin một ID actor tự khai thay quyền |
| requestId | Mã đục của một ý định, gắn với actor và nội dung; cùng mã khi gửi lại |
| operation | REGISTER hoặc CANCEL trong lát cắt |
| workshopId | Mã đục xác định workshop, không suy quyền từ việc biết ID |
| registrationId | CANCEL bắt buộc nhận diện chính xác một lần đăng ký; REGISTER tạo ID mới khi thành công |
| W | DRAFT, OPEN, PAUSED |
| C | Sức chứa có thẩm quyền, số nguyên 1–1000, đơn vị chỗ |
| N | Số ACTIVE có thẩm quyền của workshop, số nguyên không âm |
| registration | Một ID có trạng thái ACTIVE hoặc CANCELLED; “chưa có” là vắng bản ghi, không phải một trạng thái được lưu mới |
| request outcome | Chưa xử lý / đang xử lý / chưa xác định / kết quả cuối; kết quả cuối được giữ suốt vòng đời dữ liệu lab |
| observed availability | Số chỗ quan sát gần nhất cùng thời điểm và phiên bản; có thể trễ, không phải đầu vào quyết định nhận đăng ký |

Thiếu/null dữ liệu cần thiết đến mức không hiểu được actor/operation/target/request thì lỗi nhận diện hoặc hình thức theo R-ENTRY, không giả thành một yêu cầu nghiệp vụ hợp lệ. Grammar ID, encoding, payload limit, biểu diễn thời điểm và phép so sánh nội dung cụ thể còn [OPEN](#open); không tự chọn UUID, HTTP hoặc độ dài chuỗi. Không có số tiền, đơn vị phân số hoặc làm tròn trong slice.

Kết quả trả phải phân biệt: kết quả cuối của yêu cầu lịch sử, trạng thái hiện tại nếu được đọc và đủ quyền, hoặc chưa có kết quả cuối. Nhãn kết quả trong tài liệu là ý nghĩa nghiệp vụ, không ấn định câu UI/mã giao thức.

Authority xử lý thay đổi sở hữu đăng ký, số ACTIVE, kết quả yêu cầu và nghĩa vụ cập nhật. Quản trị sở hữu quyền yêu cầu đổi workshop, nhưng C/W cùng phải tham gia [R-SERIAL](#serial). Bên hiển thị chỉ sở hữu dữ liệu quan sát, không có quyền nhận chỗ hoặc replay đăng ký.

<a id="inv"></a>
## INV — điều luôn đúng

Nguồn: registration phần giữ nguyên và D1–D3; completion B2, B4–B7.

- I1: 0 ≤ N ≤ C; N bằng số bản ACTIVE của workshop.
- I2: tối đa một ACTIVE cho mỗi cặp người/workshop. Không có giới hạn hai ACTIVE toàn hệ thống ở MVP.
- I3: hủy chỉ đổi đúng ID thuộc người thao tác; CANCELLED cũ không được đổi lại ACTIVE và không làm hủy ID mới.
- I4: một ý định được gửi lại không tạo thêm tác dụng nghiệp vụ hoặc nghĩa vụ thay đổi thứ hai. Việc truyền lại bản cập nhật đã có để phục hồi không phải thay đổi nghiệp vụ mới.
- I5: từ chối/yêu cầu không làm đổi dữ liệu không đổi N/đăng ký hoặc tạo event thay đổi giả. Việc giữ kết quả từ chối không bị cấm bởi invariant này.
- I6: đầu ra công khai không chứa danh tính đăng ký hoặc mã yêu cầu cá nhân; đọc kết quả/lịch sử vẫn kiểm quyền hiện tại.

<a id="entry"></a>
## R-ENTRY — nhận diện và quyền

Nguồn: [registration D2](../inputs/proposals/r03-registration-decisions-r1.md#d2--thứ-tự-kết-quả-từ-chối-cho-yêu-cầu-mới), [completion B1/B7](../inputs/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị).

Kiểm nhận diện và dữ liệu đủ hiểu yêu cầu trước; lỗi hình thức được phân biệt với từ chối nghiệp vụ. Sau đó kiểm quyền truy cập đối tượng và thao tác. Đối tượng không tồn tại trong phạm vi truy cập hoặc không đủ quyền → không thể thực hiện, không tiết lộ trạng thái/sức chứa/kết quả riêng của nguồn không được phép. Biết ID không cấp quyền. Admin không có quyền CANCEL thay người khác.

DRAFT chỉ admin thấy; OPEN/PAUSED công khai. Danh sách đăng ký và kết quả riêng chỉ chủ thể được quyền xem; không có trang admin xem danh tính người tham gia. Không tự kết luận vai trò admin đồng thời là participant nếu chưa xác định quyền cụ thể. Retry phải kiểm quyền hiện tại truy cập kết quả trước khi trả kết quả cũ hoặc lộ xung đột mã của người khác. Thứ tự chi tiết giữa các lỗi nhận diện/hình thức ở cùng bước không được nguồn quy định: [O1](#open).

<a id="retry"></a>
## R-RETRY — lịch sử khác với thao tác mới

Nguồn: [registration D1](../inputs/proposals/r03-registration-decisions-r1.md#d1--gửi-lại-cùng-yêu-cầu-không-thực-hiện-lần-hai), completion B5/B6.

Sau R-ENTRY và quyền truy cập kết quả hợp lệ:

| Mã/nội dung | Kết quả và thay đổi |
|---|---|
| Cùng mã, cùng nội dung, đã có kết quả cuối | Trả kết quả cũ kể cả nay PAUSED hoặc đăng ký đã CANCELLED. Không chạy lại điều kiện OPEN, không nhận/hủy thêm, không phát thay đổi mới |
| Cùng mã, khác nội dung | Xung đột, không thực hiện nội dung mới |
| Cùng mã, cùng nội dung, đang xử lý | Chưa có kết quả cuối; tra/tiếp tục chính yêu cầu đó |
| Cùng mã, cùng nội dung, chưa xác định | Chưa có kết quả cuối; đối chiếu/tiếp tục cùng mã, không biến timeout thành thất bại nghiệp vụ cuối |
| Mã mới | Ý định mới, đi R-MUTATE và kiểm điều kiện hiện tại |

Giữ kết quả cuối trong vòng đời dữ liệu lab, không tự TTL/xóa. Một ý định mới thử lại sau từ chối hết chỗ phải dùng mã mới. Client không tự tạo mã mới vì phản hồi chưa biết. Kết quả REGISTER thành công lịch sử không chứng minh registration hiện vẫn ACTIVE. Trong tình huống chưa xác định, không hứa trạng thái chưa từng thay đổi; có thể authority đã thực hiện, cần tìm lại kết quả, tuyệt đối không replay mù.

<a id="mutate"></a>
## R-MUTATE — kết quả cho yêu cầu mới

Nguồn: registration D2; completion B4. Sau R-ENTRY, áp dụng đúng thứ tự:

1. W không OPEN → hiện không nhận đăng ký/hủy; không sửa dữ liệu. Vì vậy PAUSED + đầy hoặc PAUSED + ACTIVE vẫn trả không nhận thao tác, không chọn lỗi sau.
2. REGISTER nếu đã có ACTIVE trên cùng workshop → đã đăng ký, không tạo thêm; không kiểm đầy để thay kết quả này.
3. CANCEL đúng ID đã CANCELLED → đã hủy, không đổi dữ liệu. ID không truy cập được đã dừng tại R-ENTRY, không suy là đã hủy.
4. REGISTER chưa ACTIVE: nếu N=C → hết chỗ; nếu N<C → tạo ID mới ACTIVE, N tăng 1. Lịch sử CANCELLED giữ nguyên.
5. CANCEL đúng ID ACTIVE của mình → đổi ID đó thành CANCELLED, N giảm 1.

Mọi thay đổi thực đi cùng [R-UPDATE](#update); nghĩa thành công cuối chịu điều kiện lưu kết quả/nghĩa vụ cập nhật ở đó.

<a id="state"></a>
## STATE — bảng chuyển dưới authority

Các hàng dưới dành cho mã mới đã qua R-ENTRY; điều kiện W được xét trước trạng thái đăng ký. Không coi bảng là thuật toán đọc N rồi ghi rời rạc.

| Trước | Event/điều kiện | Sau/kết quả |
|---|---|---|
| Chưa có ACTIVE, có thể có lịch sử CANCELLED | REGISTER, OPEN, N<C | ID mới ACTIVE; lịch sử nguyên; N+1; thành công theo R-UPDATE |
| Chưa có ACTIVE | REGISTER, OPEN, N=C | Không đổi; hết chỗ |
| Có ACTIVE | REGISTER, OPEN, còn chỗ hoặc đầy | ACTIVE nguyên; đã đăng ký |
| ID đích ACTIVE | CANCEL, OPEN | ID đích CANCELLED; N−1 |
| ID đích CANCELLED, có/không ID ACTIVE mới | CANCEL, OPEN | Tất cả bản nguyên; đã hủy |
| Mọi trạng thái hợp lệ có thể truy cập | REGISTER/CANCEL, PAUSED hoặc DRAFT | Không đổi; hiện không nhận thao tác |

DRAFT với participant thường không qua R-ENTRY; hàng cuối chỉ nói kết quả khi actor có quyền truy cập/thao tác phù hợp. CANCEL một ID không có hoặc của người khác là nhánh R-ENTRY, không một transition hợp lệ. CANCELLED→ACTIVE trên cùng ID không tồn tại trong mô hình; đăng ký lại tạo bản khác.

<a id="serial"></a>
## R-SERIAL — các thao tác tranh chấp

Nguồn: [registration D3](../inputs/proposals/r03-registration-decisions-r1.md#d3--đăng-ký-và-sửa-sức-chứa-đồng-thời), completion B2/B3 và D.

Kết quả phải tương đương một thứ tự hợp lệ trên dữ liệu có thẩm quyền. Mỗi thao tác kiểm trạng thái sau các thao tác đã được chấp nhận trước nó; kiểm OPEN tại quyết định, không chỉ lúc tải màn hình. Không ưu tiên admin/participant, không hứa ai bấm trước thắng.

Hợp đồng admin cần cho slice: C mới là số nguyên 1–1000 và C mới≥N tại quyết định; giảm dưới N bị từ chối, giữ C cũ. W chuyển DRAFT→OPEN, OPEN→PAUSED, PAUSED→OPEN; không quay lại DRAFT/xóa; đặt lại đúng trạng thái/nội dung hiện có không đổi, không phát thay đổi giả. Không tự đóng theo đồng hồ. Đây là dependency nguồn B2/B3, không chọn lock/database/broker.

Lịch cụ thể và từng kết quả được đặt ở [T-CONCURRENT](tests.md#concurrent), bao gồm cả hai thứ tự cho tranh chỗ, giảm C, PAUSE, và hai mã đăng ký của cùng người. I1/I2 phải giữ ở mỗi kết quả được chấp nhận, không chỉ khi cuối cùng hội tụ.

<a id="update"></a>
## R-UPDATE — nghĩa vụ sau thay đổi

Nguồn: completion B5–B7 và phần “Chi tiết để không giấu điểm cần quyết”.

Authority giữ kết quả và thông tin đủ tái lập cập nhật. Chưa xác định đã lưu kết quả/nghĩa vụ thì không báo thành công cuối. Không cần đợi mọi màn hình nhận xong mới thành công nếu nghĩa vụ đã được giữ; không hứa truyền đúng một lần. Lỗi cập nhật được giữ để đối chiếu, không xóa hoặc đăng ký lại chỉ vì chưa thấy event.

Thay đổi thật đăng ký, C, W hoặc nội dung công khai phải cập nhật hiển thị. Trạng thái công khai nhất quán có version tăng theo workshop, không chứa thông tin cá nhân/mã request. Bên nhận:

- Bản mới được xác định nhất quán → nhận trạng thái mới.
- Bản lặp cùng nội dung hoặc cũ → bỏ, không lùi trạng thái đã thấy.
- Cùng version khác nội dung → lỗi cần đối chiếu authority, không chọn ngẫu nhiên.
- Sau gián đoạn → đối chiếu; snapshot mới đủ bao phủ có thể thay nhiều bản cũ, nếu chưa đủ phải đọc nguồn để phục hồi. Không replay REGISTER/CANCEL.

Giữ số quan sát gần nhất và thời điểm; khi biết mất kết nối/đang đối chiếu ghi “chưa cập nhật”, không thay bằng 0. Backend vẫn quyết định theo N/C thật, kể cả UI còn chỗ. Không có SLO số giây, không chứng nhận latency. Monitoring chỉ admin và không có nút replay/xóa ở MVP; toàn flow monitoring ngoài slice.

<a id="open"></a>
## OPEN — giới hạn kết luận

| ID | Chưa xác định | Phần bị chặn |
|---|---|---|
| O1 | Grammar/encoding/giới hạn ID và payload, phép chuẩn hóa nội dung retry; ưu tiên giữa lỗi nhận diện và hình thức cùng lúc | Ca protocol cụ thể và exact message/HTTP; không chặn cùng nội dung chính xác hoặc nội dung rõ ràng khác operation/target |
| O2 | Chi tiết mô hình cấp/thu hồi quyền và admin có đồng thời quyền participant hay không | Không lập expected tự động từ chỉ nhãn admin; test ghi rõ quyền tiền đề. Cấm hủy hộ và quyền hiện tại kiểm lại đã chốt |
| O3 | Cơ chế lưu/đồng bộ/version/giao nhận, liveness, fairness và ngưỡng SLO | Test executable, chịu tải, thời hạn phục hồi; không chặn invariant và kết quả cho thứ tự logic đã chốt |
| O4 | UI khi chưa từng nhận được một số chỗ, exact UI wording và wireframe | Không tự đặt lần quan sát đầu thành 0 hay tạo expected UI đầy đủ; B6 chỉ đủ quyết định khi đã có quan sát |

Không đọc Feature Map hay implementation ngoài frozen inputs; vì vậy không khẳng định đã đối chiếu code hoặc toàn bộ nguồn sản phẩm. Không có OPEN về việc cho hủy PAUSED hoặc giới hạn hai ACTIVE toàn hệ thống: hai điều đó đã ở ngoài MVP.

<a id="impact"></a>
## Quan hệ ngược và thay đổi nguồn

| Mục được dùng | Caller chính xác | Mục đích |
|---|---|---|
| [DATA](#data), [INV](#inv) | [FLOW](flow-ac.md#flow), [test tiền đề](tests.md#setup) | Miền trạng thái và điều phải giữ ở mọi ca |
| [R-ENTRY](#entry) | [FLOW F0–F1](flow-ac.md#flow), [AC1](flow-ac.md#ac1), [T-ENTRY](tests.md#entry) | Quyền và ưu tiên không tiết lộ |
| [R-RETRY](#retry) | [FLOW F2](flow-ac.md#flow), [AC2](flow-ac.md#ac2), [T-RETRY](tests.md#retry) | Tách lịch sử/ý định mới và tác dụng một lần |
| [R-MUTATE](#mutate), [STATE](#state) | [FLOW F3–F5](flow-ac.md#flow), [AC3](flow-ac.md#ac3), [T-STATE](tests.md#state) | Các kết quả mới và ID hủy |
| [R-SERIAL](#serial) | [FLOW](flow-ac.md#flow), [AC4](flow-ac.md#ac4), [T-CONCURRENT](tests.md#concurrent) | Thứ tự hợp lệ và dependency admin |
| [R-UPDATE](#update) | [FLOW F6](flow-ac.md#flow), [AC5](flow-ac.md#ac5), [T-UPDATE](tests.md#update) | Thành công, phục hồi và hiển thị |

Nếu nguồn đổi: tìm ID/link trong bốn file này, đọc các caller nêu trên; sửa quy tắc, flow, AC và expected bị đổi cùng lượt trong quyền soạn. Ghi các mục không ảnh hưởng kèm lý do; dùng danh sách đã xét để không lặp qua backlinks. Bên ngoài slice, thay R-SERIAL/R-UPDATE còn tác động Feature admin/view/updates, phải báo nghĩa vụ đồng bộ cho chủ các tài liệu đó; bộ này không có quyền sửa chúng. Không tự giữ approval cho nghĩa mới hoặc lấy review bộ con khép R03.
