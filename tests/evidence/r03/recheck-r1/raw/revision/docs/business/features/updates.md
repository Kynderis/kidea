# PIL-F04 — Cập nhật và vận hành

[Feature Map](../../features.md#pil-f04). Nhận thay đổi có thẩm quyền để tạo trạng thái hiển thị và dữ liệu giám sát; chưa chọn hạ tầng.

<a id="flow"></a>
## Luồng nguồn

| Bước | Điều kiện / nguồn | Kết quả / đi tiếp |
|---|---|---|
| U1 | Thay đổi thực từ đăng ký/admin theo [V-PUBLISH](../shared/availability.md#publish) | Giữ nghĩa vụ phục hồi và đúng audience [W-ACCESS](../shared/workshop.md#access); sang U2 |
| U2 | So bản nhận với bản đã quan sát theo [V-RECONCILE](../shared/availability.md#reconcile) | Mới đủ: áp dụng; lặp/cũ: bỏ; xung đột/thiếu: U3 |
| U3 | Đối chiếu nguồn thẩm quyền/snapshot đủ; [V-STALE](../shared/availability.md#stale) | Đang chờ: chưa cập nhật; khôi phục được: U2 với bản xác nhận; không replay nghiệp vụ |
| U4 độc lập | Admin xem [V-MONITOR](../shared/availability.md#monitor) | Kiểm quyền; hiển thị chờ/lỗi/độ trễ/lần thành công quan sát được; không nút replay/xóa |

<a id="ac"></a>
## Điều kiện chấp nhận

AC-U1: Không báo thành công cuối khi nghĩa vụ lưu còn chưa xác định theo [V-PUBLISH](../shared/availability.md#publish). AC-U2: Đủ các nhánh [version/phục hồi](../shared/availability.md#reconcile), không đếm đôi/lùi hoặc nhận bản mâu thuẫn tùy tiện. AC-U3: Công khai không lộ dữ liệu riêng theo [V-PUBLISH](../shared/availability.md#publish), stale/monitor thể hiện đúng sự chưa biết theo [V-STALE](../shared/availability.md#stale)/[V-MONITOR](../shared/availability.md#monitor). AC-U4: Thay đổi nội dung/C/state/đăng ký đều cập nhật đúng audience; không dùng C-VIEW quyết định nhận đăng ký.

<a id="relations"></a>
## Kiểm chứng và ảnh hưởng

[Test event](../tests.md#events), [quyền](../tests.md#access) kiểm AC/flow này. Backlink: [availability](../shared/availability.md#relations), [workshop](../shared/workshop.md#relations). Đổi hợp đồng cập nhật phải xét cả bên ghi và bên đọc, mất phản hồi, phục hồi và rò rỉ dữ liệu, không chỉ đường thành công.
