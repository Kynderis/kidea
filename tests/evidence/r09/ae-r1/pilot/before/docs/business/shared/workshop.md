# C-LIFE — Workshop và quyền truy cập

Nguồn quyết định: gói R03 B1–B3/B8; nội dung nghiệp vụ, không lựa chọn storage/API. [Phạm vi](../../features.md#goal).

<a id="data"></a>
## W-DATA — Miền dữ liệu

Căn cứ [B2 và chi tiết miền dữ liệu](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#chi-tiết-để-không-giấu-điểm-cần-quyết).

Workshop có ID đục, tiêu đề, mô tả, sức chứa C, bắt đầu/kết thúc kèm múi giờ và trạng thái. Các trường bắt buộc không thiếu/null. Tiêu đề sau trim dài 1–120 Unicode code point, một dòng. Mô tả sau trim dài 1–5000 code point, văn bản thuần, cho xuống dòng; không nội dung HTML/Markdown do người dùng nhập. Không đếm byte hay làm tròn số. C là số nguyên 1–1000 chỗ, đồng thời theo [sức chứa có thẩm quyền](registration.md#invariant). Kết thúc > bắt đầu theo thời điểm thực, không so chuỗi giờ địa phương. ID không mang quyền. Chi tiết encoding/payload và cách báo lỗi cú pháp giao thức thuộc kỹ thuật; không được thay đổi miền nghiệp vụ này. Nội dung phải được hiển thị như văn bản thuần, không thực thi markup.

Đầu vào có nội dung định dạng HTML/Markdown không hợp lệ theo B2 và bị từ chối, không lưu nguyên chuỗi markup như một cách chấp nhận thay thế; từ chối giữ nguyên dữ liệu hiện có hoặc không tạo workshop mới. Ví dụ nội dung HTML `<b>abc</b>` và nội dung Markdown `**abc**`. Quy tắc này không tự cấm mọi dấu câu của văn bản thuần; grammar/encoding kỹ thuật phải phân biệt dữ liệu đúng miền đã chốt.

<a id="access"></a>
## W-ACCESS — Actor và dữ liệu

Căn cứ [B1/B7](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị).

| Đối tượng / thao tác | Khách | Người tham gia | Admin |
|---|---|---|---|
| Workshop OPEN/PAUSED | Đọc công khai | Đọc công khai | Đọc công khai |
| Workshop DRAFT, tạo/sửa/chuyển trạng thái | Không | Không | Có |
| Đăng ký/hủy, danh sách cá nhân | Không | Chỉ của mình | Không có quyền hủy hộ hay trang danh tính người tham gia |
| Monitoring | Không | Không | Có |

Role client tự khai không là căn cứ quyền. Đối tượng không tồn tại trong phạm vi truy cập và đối tượng không được phép truy cập đều trả kết quả không thể thực hiện, không lộ chi tiết. Nếu một người có nhiều quyền thì kiểm quyền thao tác cụ thể; quyền admin tự nó không cấp quyền tham gia/hủy hộ. Kết quả yêu cầu cũ vẫn kiểm quyền hiện tại theo [R-RETRY](registration.md#retry).

<a id="state"></a>
## W-STATE — Vòng đời

Căn cứ [B3](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị).

Admin tạo workshop hợp lệ với ID mới ở DRAFT và N=0, chưa có đăng ký; đầu vào thỏa [W-DATA](#data). Workshop mới không xuất hiện công khai theo [W-ACCESS](#access); thành công cuối theo [V-PUBLISH](availability.md#publish). Đây là kết quả tạo, không một phép chuyển từ workshop đã tồn tại. Ma trận lệnh đặt trạng thái:

| Trước \ Đích | DRAFT | OPEN | PAUSED |
|---|---|---|---|
| DRAFT | Không đổi | Chấp nhận | Từ chối |
| OPEN | Từ chối | Không đổi | Chấp nhận |
| PAUSED | Từ chối | Chấp nhận | Không đổi |

Giá trị trạng thái ngoài tập bị từ chối. Không xóa, không tự đóng/mở/xóa theo đồng hồ, không quay về DRAFT. Chỉ OPEN nhận đăng ký/hủy mới; việc đọc lại kết quả cũ không phải một lần hủy mới. Mọi quyết định xét trạng thái có thẩm quyền tại thời điểm quyết định theo [R-SERIAL](registration.md#serial).

<a id="edit"></a>
## W-EDIT — Sửa nội dung

Căn cứ [B2/B3](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị) và [chi tiết sửa lịch](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#chi-tiết-để-không-giấu-điểm-cần-quyết).

Admin được sửa tiêu đề/mô tả/lịch/C ở cả ba trạng thái khi thỏa [W-DATA](#data) và [R-INV](registration.md#invariant). C bằng N được chấp nhận, C<N bị từ chối, không âm thầm hủy đăng ký để giảm C. Nội dung hợp lệ sau chuẩn hóa giống hiện tại hoặc đặt trạng thái y hệt là không đổi: không phát thay đổi giả. Sửa lịch khi đã có ACTIVE được phép, không hứa email/push. Thay đổi thực phải theo [V-PUBLISH](availability.md#publish). Từ chối giữ nguyên dữ liệu; tài liệu không đặt ưu tiên giữa nhiều lỗi field admin cùng sai vì không có nghĩa vụ lỗi đầu tiên cho admin.

<a id="lists"></a>
## W-LISTS — Danh sách

Căn cứ [B1/B8](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị).

Công khai gồm OPEN/PAUSED, xếp bắt đầu tăng dần theo thời điểm, hòa dùng thứ tự ID ổn định. PAUSED ghi tạm dừng; DRAFT không lọt danh sách/chi tiết công khai. Danh sách của tôi chỉ dữ liệu chính chủ, phân biệt ACTIVE/CANCELLED và giữ lịch sử lab; không suy lịch quá khứ là đã đóng. Không A/B trong pilot.

<a id="relations"></a>
## Nơi dùng và ảnh hưởng

Bảng liệt kê từng mục nguồn và caller trực tiếp đến đúng section; không gộp hai rule rồi ngầm coi chúng có cùng người dùng. Link điều hướng trong INDEX và link quay về bảng quan hệ không phải dependency nghiệp vụ.

| Mục nguồn | Caller trực tiếp / kiểm chứng | Mục đích |
|---|---|---|
| [W-DATA](#data) | [features/admin · flow](../features/admin.md#flow), [features/admin · ac](../features/admin.md#ac), [features/view · flow](../features/view.md#flow), [shared/registration · invariant](registration.md#invariant), [shared/workshop · state](#state), [shared/workshop · edit](#edit), [tests · data](../tests.md#data) | Kiểm miền nhập và diễn giải đúng nội dung/lịch/sức chứa khi hiển thị. |
| [W-ACCESS](#access) | [features/admin · flow](../features/admin.md#flow), [features/admin · ac](../features/admin.md#ac), [features/register-cancel · flow](../features/register-cancel.md#flow), [features/register-cancel · ac](../features/register-cancel.md#ac), [features/updates · flow](../features/updates.md#flow), [features/view · flow](../features/view.md#flow), [shared/availability · publish](availability.md#publish), [shared/registration · retry](registration.md#retry), [shared/workshop · state](#state), [tests · access](../tests.md#access), [tests · data](../tests.md#data) | Giới hạn đối tượng, thao tác và dữ liệu công khai/riêng tư. |
| [W-STATE](#state) | [features/admin · flow](../features/admin.md#flow), [features/admin · ac](../features/admin.md#ac), [shared/registration · new](registration.md#new), [tests · access](../tests.md#access), [tests · concurrency](../tests.md#concurrency), [tests · data](../tests.md#data), [shared/registration · serial](registration.md#serial) | Khởi tạo/chuyển state và điều kiện OPEN tại quyết định. |
| [W-EDIT](#edit) | [features/admin · flow](../features/admin.md#flow), [features/admin · ac](../features/admin.md#ac), [tests · data](../tests.md#data) | Kiểm sửa hợp lệ, không đổi và bảo toàn đăng ký. |
| [W-LISTS](#lists) | [features/register-cancel · flow](../features/register-cancel.md#flow), [features/view · flow](../features/view.md#flow), [features/view · ac](../features/view.md#ac), [tests · access](../tests.md#access) | Lọc trạng thái/quyền, thứ tự danh sách và lịch sử chính chủ. |

Khi nguồn đổi, đọc các caller này cùng flow/AC/test; tìm thêm ID/link trong toàn hồ sơ để phát hiện quan hệ chưa khai báo. Từ caller bị đổi nghĩa, lan tiếp đến nơi phụ thuộc và ghi lý do với phần không bị ảnh hưởng. Bảng giúp tra cứu, không thay việc đọc hợp đồng hoặc cấp quyền sửa ngoài phạm vi.

### Nơi dùng trong thiết kế chất lượng

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [data](#data) | [Chất lượng · workload](../../design/quality.md#workload), [Chất lượng · privacy](../../design/quality.md#privacy) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |
| [access](#access) | [Chất lượng · privacy](../../design/quality.md#privacy) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |
| [lists](#lists) | [Chất lượng · privacy](../../design/quality.md#privacy) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |

### Nơi dùng trong thiết kế trải nghiệm

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [access](#access) | [Trải nghiệm · choices](../../design/experience.md#choices), [Trải nghiệm · action](../../design/experience.md#action), [Trải nghiệm · error](../../design/experience.md#error), [Trải nghiệm · seo](../../design/experience.md#seo) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
| [state](#state) | [Trải nghiệm · choices](../../design/experience.md#choices), [Trải nghiệm · action](../../design/experience.md#action) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
| [lists](#lists) | [Trải nghiệm · screens](../../design/experience.md#screens), [Trải nghiệm · usability](../../design/experience.md#usability) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
| [data](#data) | [Trải nghiệm · screens](../../design/experience.md#screens), [Trải nghiệm · usability](../../design/experience.md#usability) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế vận hành

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [access](#access) | [Vận hành · signals](../../design/operations.md#signals), [Vận hành · response](../../design/operations.md#response), [Vận hành · privacy](../../design/operations.md#privacy) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |
| [state](#state) | [Vận hành · response](../../design/operations.md#response) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế quản trị

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [access](#access) | [Quản trị · scope](../../design/admin.md#scope), [Quản trị · errors](../../design/admin.md#errors) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [data](#data) | [Quản trị · commands](../../design/admin.md#commands), [Quản trị · errors](../../design/admin.md#errors) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [state](#state) | [Quản trị · commands](../../design/admin.md#commands), [Quản trị · confirm](../../design/admin.md#confirm), [Quản trị · integration](../../design/admin.md#integration) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [edit](#edit) | [Quản trị · commands](../../design/admin.md#commands), [Quản trị · confirm](../../design/admin.md#confirm), [Quản trị · integration](../../design/admin.md#integration) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế kiến trúc

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [access](#access) | [Kiến trúc · components](../../design/architecture.md#components), [Kiến trúc · api](../../design/architecture.md#api) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [edit](#edit) | [Kiến trúc · admin-intent](../../design/architecture.md#admin-intent) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [state](#state) | [Kiến trúc · admin-intent](../../design/architecture.md#admin-intent) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [data](#data) | [Kiến trúc · api](../../design/architecture.md#api) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [lists](#lists) | [Kiến trúc · api](../../design/architecture.md#api) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |

### Nơi dùng bổ sung trong kiến trúc AR-r2 (đề xuất C5)

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [access](#access) | [Kiến trúc · updates](../../design/architecture.md#updates) | Truy hợp đồng trực tiếp và ca sửa review; không đổi nguồn |
| [lists](#lists) | [Kiến trúc · updates](../../design/architecture.md#updates), [Kiến trúc · cases](../../design/architecture.md#cases) | Truy hợp đồng trực tiếp và ca sửa review; không đổi nguồn |
