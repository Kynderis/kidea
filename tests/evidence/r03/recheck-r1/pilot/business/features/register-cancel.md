# PIL-F02 — Đăng ký, hủy và lịch sử của tôi

[Feature Map](../../features.md#pil-f02). Người tham gia thao tác trên đăng ký chính mình; web/native cùng quy tắc. Cụm đầu dùng C-REG/C-LIFE và bàn giao nghĩa vụ sang C-VIEW.

<a id="flow"></a>
## Luồng nguồn

| Bước | Điều kiện / nguồn | Kết quả / đi tiếp |
|---|---|---|
| F1 | Ý định đăng ký/hủy: actor, requestID, workshopID, registrationID khi hủy theo [R-RETRY](../shared/registration.md#retry) | Thiếu/sai nhận diện/cú pháp: dừng lỗi hình thức; đủ: F2 |
| F2 | Kiểm [quyền](../shared/workshop.md#access), phân loại mã theo [R-RETRY](../shared/registration.md#retry) | Không quyền: dừng không tiết lộ; mã cũ: trả kết quả/xung đột/chưa cuối và kết thúc; mã mới: F3 |
| F3 | Thực hiện các nhánh [R-NEW](../shared/registration.md#new) và [R-SERIAL](../shared/registration.md#serial) | Bị từ chối/không đổi: trả kết quả và kết thúc; thay đổi được nhận: F4 |
| F4 | Giữ [R-INV](../shared/registration.md#invariant), hoàn tất [V-PUBLISH](../shared/availability.md#publish) | Lưu kết quả/nghĩa vụ còn chưa xác định: chưa có kết quả cuối, giữ mã; đã chắc: trả kết quả cuối |
| F5 độc lập | Xem đăng ký của tôi theo [W-LISTS](../shared/workshop.md#lists) | Kiểm quyền chính chủ; trả ACTIVE/CANCELLED phân biệt, không dữ liệu người khác |

Bước F4 không chọn giao dịch kỹ thuật hoặc cho phép phá invariant giữa F3/F4. Các bước là một nghĩa vụ xử lý có thẩm quyền. Số chỗ trên màn hình chỉ để tham khảo theo [V-STALE](../shared/availability.md#stale).

<a id="ac"></a>
## Điều kiện chấp nhận

- AC-R1: Với input/state xác định, kết quả và dữ liệu sau theo [R-NEW](../shared/registration.md#new); mọi nhánh giữ [R-INV](../shared/registration.md#invariant).
- AC-R2: Gửi lại cùng ý định không thêm hiệu lực; kết quả lịch sử không bị nói thành ACTIVE hiện tại, theo [R-RETRY](../shared/registration.md#retry).
- AC-R3: Mọi lịch tranh chấp theo [R-SERIAL](../shared/registration.md#serial); không nhận từ cache.
- AC-R4: Danh sách cá nhân và nghĩa vụ cập nhật đúng [quyền](../shared/workshop.md#access), [V-PUBLISH](../shared/availability.md#publish).

<a id="relations"></a>
## Kiểm chứng và ảnh hưởng

[Test đăng ký](../tests.md#registration), [retry](../tests.md#retry), [đồng thời](../tests.md#concurrency), [quyền](../tests.md#access), [event](../tests.md#events) dùng flow/AC này. Nguồn chung có backlink tại [C-REG](../shared/registration.md#relations), [C-LIFE](../shared/workshop.md#relations), [C-VIEW](../shared/availability.md#relations). Khi đổi rule, đối chiếu AC, test và các client; không sao chép rule thành bản riêng. Không áp dụng hai bài [Future](../../features.md#later).
