# PIL-F03 — Quản trị workshop

[Feature Map](../../features.md#pil-f03). Chỉ web admin; không quyền hủy hộ hoặc trang danh tính người tham gia.

<a id="flow"></a>
## Luồng nguồn

| Bước | Điều kiện / nguồn | Kết quả / đi tiếp |
|---|---|---|
| A1 | Actor và đối tượng theo [W-ACCESS](../shared/workshop.md#access) | Không quyền/ngoài phạm vi: dừng, không tiết lộ; đủ: A2 |
| A2 | Tạo/sửa nội dung theo [W-DATA](../shared/workshop.md#data), [W-EDIT](../shared/workshop.md#edit) hoặc đặt state theo [W-STATE](../shared/workshop.md#state) | Sai: từ chối giữ dữ liệu; giống: không đổi; hợp lệ có thay đổi: A3 |
| A3 | Quyết định có thẩm quyền theo [R-SERIAL](../shared/registration.md#serial), [R-INV](../shared/registration.md#invariant) | Kiểm điều kiện sau thao tác trước; không giảm C dưới N; được nhận: A4 |
| A4 | [V-PUBLISH](../shared/availability.md#publish) | Lưu chưa xác định: chưa thành công cuối; đã chắc: kết quả cuối, cập nhật đúng audience |

<a id="ac"></a>
## Điều kiện chấp nhận

AC-A1: Mọi ô [ma trận state](../shared/workshop.md#state) đúng kết quả, không tự chuyển theo giờ. AC-A2: Miền dữ liệu và sửa tại cả ba trạng thái đúng [W-DATA](../shared/workshop.md#data)/[W-EDIT](../shared/workshop.md#edit). AC-A3: Tranh chấp giảm C/PAUSE với đăng ký/hủy giữ [R-SERIAL](../shared/registration.md#serial), không có ưu tiên admin ngầm. AC-A4: Không đổi không phát event giả, thay đổi thực giữ nghĩa vụ [V-PUBLISH](../shared/availability.md#publish).

AC-A5: Admin tạo với dữ liệu hợp lệ nhận một workshop ID mới, DRAFT,N=0; không xuất hiện công khai theo [W-STATE](../shared/workshop.md#state) và [W-ACCESS](../shared/workshop.md#access), kết quả cuối thỏa [V-PUBLISH](../shared/availability.md#publish). Đầu vào không hợp lệ không tạo workshop; không lấy kiểm miền field thay kiểm trạng thái sau tạo.

<a id="relations"></a>
## Kiểm chứng và ảnh hưởng

[Test dữ liệu](../tests.md#data), [quyền/state](../tests.md#access), [đồng thời](../tests.md#concurrency), [event](../tests.md#events) dùng các AC này. Backlink: [workshop](../shared/workshop.md#relations), [registration](../shared/registration.md#relations), [availability](../shared/availability.md#relations). Thay sức chứa tác động đăng ký và số chỗ hiển thị; thay lịch không tự thêm thông báo riêng.
