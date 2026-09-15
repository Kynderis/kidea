# C-LIFE — Workshop và quyền truy cập

Nguồn quyết định: gói R03 B1–B3/B8; nội dung nghiệp vụ, không lựa chọn storage/API. [Phạm vi](../../features.md#goal).

<a id="data"></a>
## W-DATA — Miền dữ liệu

Căn cứ [B2 và chi tiết miền dữ liệu](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#chi-tiết-để-không-giấu-điểm-cần-quyết).

Workshop có ID đục, tiêu đề, mô tả, sức chứa C, bắt đầu/kết thúc kèm múi giờ và trạng thái. Các trường bắt buộc không thiếu/null. Tiêu đề sau trim dài 1–120 Unicode code point, một dòng. Mô tả sau trim dài 1–5000 code point, văn bản thuần, cho xuống dòng; không nội dung HTML/Markdown do người dùng nhập. Không đếm byte hay làm tròn số. C là số nguyên 1–1000 chỗ, đồng thời theo [sức chứa có thẩm quyền](registration.md#invariant). Kết thúc > bắt đầu theo thời điểm thực, không so chuỗi giờ địa phương. ID không mang quyền. Chi tiết encoding/payload và cách báo lỗi cú pháp giao thức thuộc kỹ thuật; không được thay đổi miền nghiệp vụ này. Nội dung phải được hiển thị như văn bản thuần, không thực thi markup.

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

Admin tạo workshop hợp lệ ở DRAFT, chưa có đăng ký. Ma trận lệnh đặt trạng thái:

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
## Nơi dùng và ảnh hưởng khi đổi

| Mục nguồn | Caller/kiểm chứng | Mục đích |
|---|---|---|
| W-DATA/W-EDIT | [Admin flow và AC](../features/admin.md#flow), [test dữ liệu](../tests.md#data) | Miền nhập, sửa, bảo toàn dữ liệu |
| W-ACCESS/W-STATE/W-LISTS | [Xem](../features/view.md#flow), [đăng ký](../features/register-cancel.md#flow), [admin](../features/admin.md#flow), [cập nhật](../features/updates.md#flow), [test quyền/state](../tests.md#access) | Quyền, lọc, điều kiện thao tác |
| W-STATE | [serial](registration.md#serial), [test đồng thời](../tests.md#concurrency) | PAUSE không vượt qua kiểm điều kiện lúc quyết định |

Khi đổi mục nào, đọc các caller trong hàng đó, AC/test tương ứng và nghĩa vụ cập nhật; không chỉ sửa nhãn trong mục lục.

Liên kết bổ sung theo mục: [W-ACCESS](#access) được [R-RETRY](registration.md#retry) và [V-PUBLISH](availability.md#publish) dùng cho quyền cá nhân/công khai; [W-STATE](#state) được [R-NEW](registration.md#new) dùng cho điều kiện OPEN; [W-DATA](#data) được [R-INV](registration.md#invariant) dùng cho miền C. [AC xem](../features/view.md#ac) dùng W-LISTS; [AC đăng ký](../features/register-cancel.md#ac) dùng W-ACCESS; [AC admin](../features/admin.md#ac) dùng W-DATA/W-EDIT/W-STATE. [Test đăng ký](../tests.md#registration), [test retry](../tests.md#retry) phụ thuộc quyền/state qua R-NEW/R-RETRY.
