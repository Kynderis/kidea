# Workshop — quản trị, bản AD-r1

Đề xuất đầu ra **bước 6, chờ Human duyệt**. O1–O6 đã được Human “Duyệt thiết kế vận hành R04” sau `86c051ca7968980a25c502e635c5808c8d1eda93`; đó là approval thiết kế, chưa có hệ thống vận hành. [Báo cáo và căn cứ](D:/Code/kynderis/kidea/tests/evidence/r04/design-r1.md) giữ trạng thái review, không dùng nhãn trong snapshot thay approval.

<a id="choices"></a>
## Gói quản trị A1–A6 cần chốt

| ID | Đề xuất | Ví dụ / đánh đổi |
|---|---|---|
| A1 | Giữ một nhóm trang web quản trị workshop, gồm danh sách, tạo và sửa | Không thêm admin native, quản lý tài khoản, danh tính người tham gia, xóa workshop hoặc hủy hộ |
| A2 | Tạo luôn là bản nháp; sửa nội dung không tự xuất bản; nút đổi trạng thái là thao tác riêng | Lưu tên mới không vô tình mở đăng ký |
| A3 | Xác nhận trước xuất bản/tạm dừng/mở lại, giảm sức chứa hoặc đổi lịch khi đã có đăng ký; sửa chữ/tăng sức chứa không thêm hộp xác nhận | Hiện cũ → mới và ảnh hưởng trước khi bấm; thêm một lần xác nhận chỉ ở thao tác nhạy cảm |
| A4 | Dữ liệu thay đổi hoặc kết quả chưa rõ thì không tự gửi lại/ghi đè; tải và đối chiếu trước | Sau tạo bị mất mạng không tự tạo workshop thứ hai; chưa đủ bằng chứng thì vẫn báo chưa xác nhận |
| A5 | Ghi dấu ai thao tác, đối tượng, loại thay đổi, thời điểm và kết quả; bảo toàn dấu thay đổi cùng kết quả trước khi báo thành công cuối | Không lưu toàn payload/secret. Nếu chưa chắc đã lưu dấu, không giả thành công hoặc thất bại cuối |
| A6 | Giữ dấu thao tác suốt vòng đời lab trong ngân sách đã duyệt; quyền đọc chẩn đoán riêng, không thêm màn xem log/audit | Hết dung lượng không tự xóa dấu/lịch sử; báo và dừng bài thử theo thiết kế vận hành |

Đây là thiết kế admin và yêu cầu truy vết, không tự thay rule R03 hoặc chọn DB/API. Nếu hợp đồng kỹ thuật sau này cần thay nghĩa retry/quyền/kết quả, phải quay đúng gate nghiệp vụ; không coi A4 cấp sẵn rule mới.

<a id="scope"></a>
## A-SCOPE — Quyền và bố cục

Nguồn: [W-ACCESS](../business/shared/workshop.md#access), [PIL-F03 flow/AC](../business/features/admin.md#flow), [UX nhóm trang](experience.md#screens), [UX dùng được](experience.md#usability). Role được server xác nhận theo thao tác/đối tượng; admin không mặc nhiên là người tham gia. Không nhận role hoặc workshopID biết được làm quyền.

```text
/admin/workshops
WORKSHOP — chỉ admin              [Tạo bản nháp]
Tên | Lịch + timezone | DRAFT/OPEN/PAUSED | C / N đã quan sát | [Sửa]
Đang tải / không có dữ liệu / không truy cập được là các trạng thái riêng

/admin/workshops/{id}, hoặc form tạo trong cùng nhóm trang
Tên [...................]     Mô tả plain text [....................]
Bắt đầu [ngày giờ + múi giờ]   Kết thúc [ngày giờ + múi giờ]
Sức chứa C [...]              Đã ACTIVE N: ... (quan sát lúc ...)
Trạng thái hiện tại: ...      Lần quan sát: ...
[Lưu nội dung] [Bỏ phần chưa lưu]   [Lệnh trạng thái hợp lệ]
Lỗi tại trường / kết quả thao tác / chưa xác nhận được
```

Danh sách admin gồm các workshop được phép quản lý, không dùng danh sách public để suy DRAFT không tồn tại. Chỉ hiển thị tổng ACTIVE quan sát được, không danh tính đăng ký. Chưa chọn sort/filter nâng cao hoặc phân trang mới; danh sách dùng thứ tự lịch rồi ID ổn định để dễ đối chiếu, không đổi thứ tự public đã chốt.

Truy cập thẳng route/form hoặc quyền bị thu hồi đều kiểm server; UI ẩn nút không thay kiểm quyền. Không quyền/ID ngoài phạm vi không lộ nội dung/C/N/trạng thái. Rời phiên có quyền thì không giữ nội dung riêng trong back stack cho actor mới. Phần nhập chưa lưu là dữ liệu cục bộ của đúng phiên, không tự upload/log; khi bỏ hoặc mất quyền không để actor khác đọc lại. Cơ chế lưu draft/reload nếu cần thuộc kiến trúc, không hứa đã có.

<a id="commands"></a>
## A-COMMAND — Từng thao tác, nguồn và kết quả

Nguồn: [W-DATA](../business/shared/workshop.md#data), [W-STATE](../business/shared/workshop.md#state), [W-EDIT](../business/shared/workshop.md#edit), [R-INV](../business/shared/registration.md#invariant), [R-SERIAL](../business/shared/registration.md#serial), [V-PUBLISH](../business/shared/availability.md#publish), [AC-A1–A5](../business/features/admin.md#ac). Nguồn là nơi định nghĩa rule; bảng dưới ánh xạ thao tác, không phiên bản nghiệp vụ thứ hai.

| Thao tác | Input / kiểm nguồn | Kết quả UI và dữ liệu đúng nguồn | Xác nhận / audit |
|---|---|---|---|
| Tạo bản nháp | Các field bắt buộc của W-DATA, actor đủ quyền | Thành công: ID mới, DRAFT,N=0; chuyển form theo ID trả về. Sai: không tạo; chưa rõ lưu: UNKNOWN | Không hộp xác nhận riêng vì chưa công khai. Audit create theo A-AUDIT |
| Sửa tên/mô tả | Plain text đúng W-DATA tại cả ba state | Lưu nội dung đã chuẩn hóa; không đổi state, không thông báo email/push | Không hộp xác nhận riêng; audit field đã đổi, không toàn văn |
| Sửa lịch | Mốc có timezone và end>start theo W-DATA/W-EDIT | Giữ đăng ký; không tự đóng/mở theo đồng hồ; không hứa thông báo người tham gia | Nếu có ACTIVE đã quan sát hoặc chưa biết chắc N: xác nhận lịch cũ → mới; audit hai mốc |
| Sửa C | C đúng miền và không dưới N có thẩm quyền | Server xét cạnh tranh theo R-SERIAL; từ chối không tự hủy người đã đăng ký; no-op không event giả | Giảm C cần xác nhận cũ → mới và N đã quan sát; tăng C không dialog riêng; audit C trước/sau |
| Xuất bản | DRAFT→OPEN theo W-STATE | Chỉ khi nguồn nhận và nghĩa vụ chắc mới báo đã mở; DRAFT không phát public trước đó | Xác nhận tên/lịch, việc sẽ công khai và nhận đăng ký; audit state |
| Tạm dừng | OPEN→PAUSED theo W-STATE | Theo rule hiện tại chặn cả đăng ký/hủy mới; không hủy ACTIVE đang có, không tắt tiến trình | Xác nhận rõ “Tạm dừng đăng ký và hủy mới”; audit state |
| Mở lại | PAUSED→OPEN theo W-STATE | Nhận thao tác mới theo điều kiện hiện tại; không tự replay yêu cầu cũ | Xác nhận mở lại; audit state |
| Lệnh đặt state y hệt / nội dung giống sau chuẩn hóa | Nhánh no-op W-STATE/W-EDIT, kể cả request trực tiếp | Hiện không có thay đổi, không phát event nghiệp vụ giả | Ghi lần thao tác với kết quả no-op, không ghi giả bản dữ liệu mới |
| Nhánh state/field/role không hợp lệ | Mọi ô và biên đã có ở R03 | Từ chối giữ nguyên dữ liệu; UI không tạo nút cho xóa/quay DRAFT/hủy hộ | Ghi từ chối đã làm sạch nếu xác định được, không log input bí mật |

Lưu nội dung và đổi state là **hai ý định UI riêng**, không âm thầm “lưu rồi xuất bản” nguyên khối. Nếu đang có phần nhập chưa lưu mà bấm đổi state: yêu cầu lưu trước hoặc bỏ phần chưa lưu, không tự chọn thay Human. Nếu lưu xong nhưng xuất bản không thành công, nói rõ nội dung đã lưu, trạng thái còn thế nào/chưa xác nhận; không rollback nội dung tự động. Không cho preview public của DRAFT chỉ để xem đẹp: bản xem tại form vẫn trong quyền admin.

<a id="confirm"></a>
## A-CONFIRM — Xác nhận có ý nghĩa, không là khóa dữ liệu

Nguồn: [W-EDIT](../business/shared/workshop.md#edit), [W-STATE](../business/shared/workshop.md#state), [R-SERIAL](../business/shared/registration.md#serial), [UX6](experience.md#usability). Dialog hiện đúng ID/tên, thao tác, giá trị cũ → mới, thời điểm quan sát và ảnh hưởng; có [Quay lại] không gửi và [Xác nhận ...] rõ hành động, không nút “OK” mơ hồ. Gộp các thay đổi nhạy cảm trong một lần lưu vào một dialog, không hỏi mỗi field.

Nếu N chưa biết thì sửa lịch được coi cần xác nhận, không giả N=0. Nếu state/C/N/lịch trên form được phát hiện đã thay đổi trong khi dialog mở, yêu cầu xem lại và xác nhận trên dữ liệu mới; không âm thầm giữ nội dung cũ rồi gọi là đã được xác nhận. Nếu thay đổi xảy ra sau xác nhận nhưng trước quyết định server, backend vẫn theo R-SERIAL/W-EDIT; dialog không hứa khóa chỗ hoặc ưu tiên admin.

Ví dụ C10,N9: dialog giảm C9 không bảo đảm thành công. Người khác đăng ký trước có thể khiến server từ chối giảm; UI giữ C10,N10 theo kết quả/quan sát được xác nhận, không xóa đăng ký mới để “hoàn thành” yêu cầu admin. Cơ chế phát hiện version/cập nhật đồng thời và hợp đồng chống ghi đè cụ thể phải được chốt ở bước 7, không tự áp điều kiện version mới vào nghiệp vụ.

<a id="errors"></a>
## A-ERROR — Lỗi field, mất phản hồi và sửa đồng thời

Nguồn: [W-DATA](../business/shared/workshop.md#data), [W-ACCESS](../business/shared/workshop.md#access), [V-PUBLISH](../business/shared/availability.md#publish), [UX lỗi](experience.md#error), [QR](quality.md#response), [QF](quality.md#freshness). Không suy timeout là thất bại cuối hoặc quyền đã cấp mãi mãi.

| Tình huống | Hành vi bắt buộc trong thiết kế |
|---|---|
| Lỗi field/validation | Giữ dữ liệu nhập trong phiên có quyền; chỉ ra field/lý do đúng miền. Cho sửa; không tự trim/làm tròn để đổi nghĩa ngoài nguồn. Có thể chỉ nhiều lỗi admin, không đặt thứ tự lỗi nghiệp vụ mới |
| Tải dữ liệu lỗi | Hiện chưa tải được, không empty hoặc N=0; [Tải lại] chỉ đọc |
| Đang gửi / double click | Khóa phát trùng từ nút cho lần đang gửi, phản hồi loading theo QC; không tự sinh hai lần tạo |
| Server đã xác nhận kết quả cuối | Hiện đúng thành công/từ chối/no-op; cập nhật form qua dữ liệu có thẩm quyền/quan sát được xác nhận, không cộng trừ chỗ trên client làm authority |
| Mất phản hồi hoặc chưa biết lưu kết quả/audit | Hiện “Chưa xác nhận”; không tự gửi lại create/edit/state. Cho đọc/đối chiếu, giữ dấu ý định trong đúng phiên; chưa đủ bằng chứng thì vẫn chưa xác nhận |
| Dữ liệu hiện tại khác khi đang sửa | Không tự ghi đè phần nhập hoặc tự lưu đè server khi đã phát hiện khác; hiện bản đã nhập so với bản đọc mới và yêu cầu người dùng xem lại. Chưa chọn merge/lock/version API ở đây |
| Quyền bị thu hồi / đổi actor | Dừng hành động, không trả kết quả/nội dung riêng cho phiên mới; đối chiếu chỉ qua quyền hiện tại |
| Kết quả mutation chắc nhưng cập nhật public còn chậm | Tách “đã lưu” khỏi “hiển thị chưa cập nhật”; theo QF, không yêu cầu admin lưu lại để chữa pipeline |

**Giới hạn retry admin:** [R-RETRY](../business/shared/registration.md#retry) hiện định nghĩa đăng ký/hủy, không được tự áp thành hợp đồng cho tạo/sửa workshop. A4 chỉ chốt không gửi lại mù và không giả kết quả. Đặc biệt tạo mới mất phản hồi: trùng tên không chứng minh đó là workshop vừa tạo, không chọn ID bằng cách tìm tên. Hợp đồng kỹ thuật cần có căn cứ đối chiếu từng ý định hoặc đường xử lý unknown an toàn; chốt tại bước 7 trước code/test retry admin. Nếu muốn cho phép retry tự động hoặc sửa nghĩa kết quả thì phải trình quyết định riêng ở đúng nguồn nghiệp vụ, không ẩn trong API.

Tương tự, một state hiện tại trùng state mong muốn không tự chứng minh **chính lần bấm đó** thành công. Đọc được hiện tại chỉ cập nhật quan sát; kết luận lịch sử cần bằng chứng riêng. Không thêm lời hứa mọi unknown sẽ tự hết trong QR; QR là mục tiêu phản hồi theo bài tải, lỗi đối chiếu/khôi phục phải báo đúng giới hạn.

<a id="audit"></a>
## A-AUDIT — Dấu thao tác và bảo vệ thông tin

Nguồn: [QS](quality.md#privacy), [QD](quality.md#recovery), [QB](quality.md#resources), [O6](operations.md#privacy), [V-PUBLISH](../business/shared/availability.md#publish). Đây là yêu cầu truy vết quản trị, không mở thêm trang/API xem lịch sử audit hoặc cấp admin đọc danh tính người tham gia.

Mỗi dấu thao tác cần: actor đã xác thực hoặc nhãn không xác thực; loại lệnh; ID workshop khi đã có và được phép ghi; thời điểm nhận/kết quả; định danh tương quan kỹ thuật của ý định; outcome success/rejected/no-op/unknown; danh sách field đã đổi. Với C/lịch/state ghi giá trị trước/sau đã xác nhận; với tên/mô tả ghi field và revision/hash nội dung để đối chiếu nguồn được phép, không chép toàn văn. Với create chưa có ID thì không bịa ID thành công. Hash không là mã hóa; bằng chứng công khai không xuất thông tin riêng chỉ vì đã hash.

Không token/password/secret, requestID đăng ký của người khác, toàn payload, danh tính người tham gia hoặc stack trace chưa làm sạch. Actor input không xác thực không được gắn thành actor server đã xác thực. Từ chối/no-op có audit thao tác nhưng không phát event đổi nghiệp vụ giả. Nhiều lần đọc đối chiếu không được nhân bản thành nhiều thay đổi workshop.

**A5 đề xuất:** với mutation thực, kết quả và đủ dấu truy vết phải được giữ chắc hoặc có nghĩa vụ phục hồi chắc trước khi báo thành công cuối; không ghi kiểu best-effort rồi im lặng mất audit. Nếu chưa biết, giữ unknown; không khẳng định không có thay đổi. Kiến trúc chọn cơ chế, không mặc định transaction/broker hay thêm service. Audit của từ chối/đọc lỗi cần báo mất khả năng ghi dấu qua tín hiệu lỗi đã có, không lộ dữ liệu và không chạy mutation để bù; không biến thiếu log thành quyền cho thao tác bị từ chối.

Giữ dấu cần truy trong vòng đời lab, cùng ngân sách dữ liệu/log/backup 2 GiB; không TTL/xóa tự động. Đích/quyền đọc phục vụ chẩn đoán phải được xác nhận khi thực thi; không mặc định là public hoặc toàn admin đều được xem raw. Không overwrite dấu cũ để “sửa lịch sử”; thêm kết quả đối chiếu và liên kết dấu trước. Audit/identity phải đi cùng recovery point khi restore theo QD; không dùng log ngoài mốc khôi phục để tự replay nghiệp vụ. Những lần không còn đủ căn cứ phải ghi rõ chưa xác nhận.

<a id="integration"></a>
## A-INTEGRATION — Nối vận hành, chất lượng và SEO

Nguồn: [W-STATE](../business/shared/workshop.md#state), [W-EDIT](../business/shared/workshop.md#edit), [V-PUBLISH](../business/shared/availability.md#publish), [V-RECONCILE](../business/shared/availability.md#reconcile), [O-RESPONSE](operations.md#response), [SEO](experience.md#seo), [QC](quality.md#client-seo).

Thay đổi thực title/description/C/lịch/state phải giữ nghĩa vụ cập nhật đúng audience; DRAFT không rò public. Đổi tên không đổi URL ID; title/description public chỉ theo bản đã xuất bản đúng quyền, không bản đang gõ. Việc xuất bản workshop trong lab không mở indexing/public Internet; không thêm Event markup/marketing/thông báo ngoài phạm vi đã chốt.

Sửa C/state và đăng ký có thẩm quyền theo R03; số liệu quan sát của admin/monitoring chỉ để xem. Tạm dừng workshop không tương đương dừng bài thử, dừng server hoặc tắt alert. Điều khiển vận hành/restart/restore vẫn không có trong admin. Bàn phím/focus/dialog/cỡ chữ dùng UX6 và thời gian QC; chưa có kiểm browser/native thật.

<a id="cases"></a>
## AD-T — Ca cần kiểm, tất cả NOT_RUN trên sản phẩm

| Case | Seed / kích thích | Expected / nguồn |
|---|---|---|
| AD-T01 | Admin tạo dữ liệu hợp lệ; các biến thể thiếu/sai field | Nhánh hợp lệ ID mới,DRAFT,N0, không public; nhánh sai không tạo, lỗi đúng field; [A-COMMAND](#commands), R03 D01–D09 |
| AD-T02 | Cả ba state × sửa từng field hợp lệ, gồm lịch có ACTIVE | Kết quả W-EDIT và đối thoại xác nhận tương ứng, không đổi state hoặc hứa email; [A-COMMAND](#commands) |
| AD-T03 | Tất cả 9 ô state, thêm state lạ/request trực tiếp | Đúng W-STATE, no-op không event, không có nút chuyển trái phép; [A-COMMAND](#commands) |
| AD-T04 | C10,N9; giảm C9 cạnh tranh đăng ký ở hai thứ tự | Đúng R03 C02, không ưu tiên admin/hủy người khác; [A-CONFIRM](#confirm) |
| AD-T05 | Chuyển PAUSED cạnh tranh đăng ký/hủy | Đúng R03 C03/C04; text xác nhận nói chặn cả hai, không tắt server; [A-COMMAND](#commands) |
| AD-T06 | Dialog nhạy cảm: quay lại, Escape, xác nhận; thay đổi nguồn khi đang mở | Hủy dialog không gửi; nguồn được biết đã đổi thì xem lại; không giả dialog là khóa; [A-CONFIRM](#confirm) |
| AD-T07 | Đang nhập chưa lưu rồi bấm xuất bản; lưu xong nhưng xuất bản lỗi | Không ngầm lưu+xuất bản; kết quả từng thao tác riêng, không rollback tự động; [A-COMMAND](#commands) |
| AD-T08 | Tạo/sửa/state mất phản hồi, double-click/reload; tạo trùng tên | Không gửi lại mù/nhân đôi create; không chọn ID theo tên, unknown còn khi chưa có căn cứ; [A-ERROR](#errors) |
| AD-T09 | Khách/người tham gia/role giả/admin bị thu hồi, ID ngoài phạm vi | Không mutation/leak; dừng render/cache đúng quyền; [A-SCOPE](#scope), [A-ERROR](#errors) |
| AD-T10 | No-op/từ chối/thay đổi thực và đọc đối chiếu | Audit phân biệt, không domain event giả; [A-AUDIT](#audit) |
| AD-T11 | Ghi dấu thất bại trước/sau mutation; crash trước phản hồi | Không success giả hoặc khẳng định dữ liệu chưa đổi; bảo toàn/đối chiếu theo hợp đồng, cơ chế phải được chốt trước thực thi; [A-AUDIT](#audit) |
| AD-T12 | Payload chứa token giả/chuỗi riêng, actor giả; audit public export | Không lưu/xuất dữ liệu cấm, không nâng actor chưa xác thực; [A-AUDIT](#audit) |
| AD-T13 | Hai form/bản quan sát khác nhau; số liệu mới về khi đang nhập | Không tự ghi đè khi phát hiện khác, không giả có lock/version chưa chốt; [A-ERROR](#errors) |
| AD-T14 | Đổi tên/nội dung DRAFT/OPEN/PAUSED; view chậm | URL ổn định, audience đúng, trạng thái lưu và view tách biệt; [A-INTEGRATION](#integration) |
| AD-T15 | Gần ngân sách/restore recovery point; tìm xóa/restart/restore/hủy hộ | Không xóa dấu để đủ chỗ hoặc tự replay sau restore, không có chức năng ngoài scope; [A-AUDIT](#audit), [A-INTEGRATION](#integration) |

Kiểm cả bố cục/chữ dài/timezone/bàn phím theo UX-T09/T10; không lấy số hàng test hoặc link hợp lệ làm ứng dụng đã đạt. Sự cố storage/ngắt/restore chỉ được tiêm trên fixture/môi trường có quyền ở R09. Hợp đồng admin correlation/retry, bảo toàn audit và concurrency API là đầu vào phải giải quyết tại kiến trúc, không tự nhận đã hiện thực hóa từ bản này.

Sau Human duyệt A1–A6 mới mở bước 7 kiến trúc; mọi quyết định kỹ thuật đổi nghĩa nghiệp vụ phải quay lại nguồn sớm nhất. Chưa tích hợp skill, chưa dùng quota AI độc lập và chưa mở quyền thực thi sản phẩm.

<a id="design-relations"></a>

### Nơi dùng trong thiết kế kiến trúc

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [scope](#scope) | [Kiến trúc · components](../design/architecture.md#components) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [audit](#audit) | [Kiến trúc · storage](../design/architecture.md#storage), [Kiến trúc · recovery](../design/architecture.md#recovery) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [commands](#commands) | [Kiến trúc · admin-intent](../design/architecture.md#admin-intent) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [confirm](#confirm) | [Kiến trúc · admin-intent](../design/architecture.md#admin-intent) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [errors](#errors) | [Kiến trúc · admin-intent](../design/architecture.md#admin-intent) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [cases](#cases) | [Kiến trúc · cases](../design/architecture.md#cases) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |

### Nơi dùng bổ sung trong kiến trúc AR-r2 (đề xuất C5)

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [errors](#errors) | [Kiến trúc · admission](../design/architecture.md#admission) | Truy hợp đồng trực tiếp và ca sửa review; không đổi nguồn |
