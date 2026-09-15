# C-REG — Đăng ký và sức chứa có thẩm quyền

Nguồn quyết định: D1–D3 và B4/B5 của gói R03. [Phạm vi](../../features.md#pil-f02).

<a id="invariant"></a>
## R-INV — Dữ liệu và điều luôn đúng

Căn cứ [B2/B4](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị); invariant từ [D3](D:/Code/kynderis/kidea/proposals/r03-registration-decisions-r1.md#d3--đăng-ký-và-sửa-sức-chứa-đồng-thời).

C là số chỗ [hợp lệ](workshop.md#data); N là số đăng ký ACTIVE có thẩm quyền cho workshop. Luôn 0≤N≤C và tối đa một ACTIVE/người/workshop. Không giới hạn tổng ACTIVE trên nhiều workshop ở MVP. Registration có ID riêng, workshop, chủ sở hữu và ACTIVE/CANCELLED. Một lần nhận mới tạo ID mới và ACTIVE; hủy chỉ chuyển đúng ID ACTIVE→CANCELLED, N giảm một. Hủy rồi đăng ký lại tạo B khác A; hủy lại A không tác động B. Giữ lịch sử trong vòng đời lab; không TTL/dọn tự động. Không có chuyển CANCELLED→ACTIVE trên cùng ID.

<a id="retry"></a>
## R-RETRY — Ý định và kết quả lịch sử

Căn cứ [D1](D:/Code/kynderis/kidea/proposals/r03-registration-decisions-r1.md#d1--gửi-lại-cùng-yêu-cầu-không-thực-hiện-lần-hai).

Input gồm actor đã nhận diện, requestID đục, thao tác, workshopID, và registrationID bắt buộc khi hủy. RequestID gắn actor và toàn nội dung thao tác; ID biết được không là quyền. Xác thực cú pháp đủ hiểu và [quyền hiện tại](workshop.md#access) trước truy kết quả riêng.

| Lịch sử mã trong phạm vi actor | Kết quả | Tác động nghiệp vụ |
|---|---|---|
| Chưa có — ý định mới | Theo [R-NEW](#new) | Chỉ thay đổi khi được nhận |
| Cùng nội dung, có kết quả cuối | Trả nguyên kết quả lịch sử | Không đổi đăng ký/chỗ, không event lần hai |
| Khác nội dung | Xung đột mã yêu cầu | Không chạy nội dung mới |
| Cùng nội dung, đang xử lý hoặc chưa xác định | Chưa có kết quả cuối; tra/tiếp tục cùng mã | Không tự tạo mã khác hoặc kết luận thất bại cuối |

Lưu kết quả cuối kể cả từ chối nghiệp vụ suốt đời dữ liệu lab. Lỗi kỹ thuật chưa biết hiệu lực không là từ chối nghiệp vụ cuối. Ý định mới (kể cả thử lại sau FULL) cần mã mới và kiểm điều kiện hiện tại. Kết quả cũ được đọc sau hủy/PAUSED nếu quyền hiện tại còn hợp lệ; không kiểm OPEN như thao tác mới, không hồi sinh ACTIVE. Hiển thị tách “lần đó thành công” khỏi “đăng ký hiện tại đã hủy”. Quyền bị thu hồi chặn đọc kết quả, không trả thành công cũ cho người không còn quyền.

<a id="new"></a>
## R-NEW — Thứ tự cho yêu cầu mới

Căn cứ [D2](D:/Code/kynderis/kidea/proposals/r03-registration-decisions-r1.md#d2--thứ-tự-kết-quả-từ-chối-cho-yêu-cầu-mới).

| Bước | Điều kiện | Kết quả/tiếp theo |
|---|---|---|
| 1 | Nhận diện/cú pháp đủ hiểu | Sai: lỗi nhận diện/hình thức, dừng; đúng: 2 |
| 2 | Quyền thao tác và đối tượng trong phạm vi được truy cập | Sai: không thể thực hiện, không tiết lộ chi tiết; đúng: 3 |
| 3 | [Workshop OPEN](workshop.md#state) | Sai: hiện không nhận đăng ký/hủy, dừng; đúng: 4 |
| 4 đăng ký | Đã có ACTIVE của actor/workshop? | Có: đã đăng ký, không đổi; không: 5 |
| 4 hủy | Đúng ID chính chủ có ACTIVE hay CANCELLED? | CANCELLED: đã hủy, không đổi; ACTIVE: chuyển CANCELLED và giải phóng một chỗ; kết thúc |
| 5 đăng ký | N<C trên dữ liệu có thẩm quyền? | Có: nhận ID mới ACTIVE, N+1; không: hết chỗ, giữ nguyên |

Mỗi nhánh kết thúc giữ [R-INV](#invariant); từ chối/không đổi không phát thay đổi chỗ. Hủy ID không có/không thuộc quyền dừng ở bước 2, không tìm ID ACTIVE khác để thay thế. PAUSED+ACTIVE/đầy báo tạm dừng trước đã đăng ký/hết chỗ; sai quyền+PAUSED báo không thể thực hiện trước. Bảng là thứ tự logic, không phải thuật toán đọc rồi ghi rời nhau. Thành công cuối phải thỏa [nghĩa vụ lưu/phục hồi](availability.md#publish).

<a id="serial"></a>
## R-SERIAL — Thao tác tranh chấp

Căn cứ [D3](D:/Code/kynderis/kidea/proposals/r03-registration-decisions-r1.md#d3--đăng-ký-và-sửa-sức-chứa-đồng-thời).

Đăng ký, hủy, đổi C và đổi trạng thái có kết quả tương đương một thứ tự hợp lệ trên dữ liệu có thẩm quyền; mỗi thao tác thấy kết quả đã được nhận trước nó. Không ưu tiên admin, không hứa ai bấm trước thắng. Với C10,N9: đăng ký trước giảm C9 → N10,C10, giảm bị từ chối; giảm trước → C9,N9, đăng ký FULL. Hai người tranh chỗ cuối chỉ một được nhận. Cùng người hai request mới chỉ một ACTIVE, request sau đã đăng ký. Đăng ký/hủy trước PAUSE được nhận nếu đủ điều kiện; PAUSE trước chặn thao tác mới, không sửa lịch sử đã có. Xem [các lịch cả hai thứ tự](../tests.md#concurrency). Cache không có thẩm quyền nhận chỗ; chưa chọn lock/transaction hoặc cam kết latency/liveness.

<a id="relations"></a>
## Nơi dùng và ảnh hưởng

Bảng liệt kê từng mục nguồn và caller trực tiếp đến đúng section; không gộp hai rule rồi ngầm coi chúng có cùng người dùng. Link điều hướng trong INDEX và link quay về bảng quan hệ không phải dependency nghiệp vụ.

| Mục nguồn | Caller trực tiếp / kiểm chứng | Mục đích |
|---|---|---|
| [R-INV](#invariant) | [features/admin · flow](../features/admin.md#flow), [features/register-cancel · flow](../features/register-cancel.md#flow), [features/register-cancel · ac](../features/register-cancel.md#ac), [shared/availability · publish](availability.md#publish), [shared/registration · new](#new), [shared/workshop · data](workshop.md#data), [shared/workshop · edit](workshop.md#edit), [tests · coverage](../tests.md#coverage), [tests · registration](../tests.md#registration), [tests · concurrency](../tests.md#concurrency), [tests · data](../tests.md#data) | Giữ miền C/N, số ACTIVE và vòng đời trong mọi kết quả. |
| [R-RETRY](#retry) | [features/register-cancel · flow](../features/register-cancel.md#flow), [features/register-cancel · ac](../features/register-cancel.md#ac), [shared/availability · stale](availability.md#stale), [shared/workshop · access](workshop.md#access), [tests · retry](../tests.md#retry) | Phân biệt ý định mới, kết quả lịch sử và kết quả chưa biết; kiểm quyền đọc. |
| [R-NEW](#new) | [features/register-cancel · flow](../features/register-cancel.md#flow), [features/register-cancel · ac](../features/register-cancel.md#ac), [shared/availability · stale](availability.md#stale), [shared/registration · retry](#retry), [tests · registration](../tests.md#registration), [tests · retry](../tests.md#retry) | Quyết định nhánh đăng ký/hủy mới và thứ tự từ chối. |
| [R-SERIAL](#serial) | [features/admin · flow](../features/admin.md#flow), [features/admin · ac](../features/admin.md#ac), [features/register-cancel · flow](../features/register-cancel.md#flow), [features/register-cancel · ac](../features/register-cancel.md#ac), [shared/workshop · state](workshop.md#state), [tests · concurrency](../tests.md#concurrency) | Giữ điều kiện/invariant theo thứ tự quyết định khi các thao tác tranh chấp. |

Khi nguồn đổi, đọc các caller này cùng flow/AC/test; tìm thêm ID/link trong toàn hồ sơ để phát hiện quan hệ chưa khai báo. Từ caller bị đổi nghĩa, lan tiếp đến nơi phụ thuộc và ghi lý do với phần không bị ảnh hưởng. Bảng giúp tra cứu, không thay việc đọc hợp đồng hoặc cấp quyền sửa ngoài phạm vi.
