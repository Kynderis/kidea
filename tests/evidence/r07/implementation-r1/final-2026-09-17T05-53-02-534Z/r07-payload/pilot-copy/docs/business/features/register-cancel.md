# PIL-F02 — Đăng ký, hủy và lịch sử của tôi

**Amendment Web r2, 2026-09-17 — theo quyết định Human:** client hiện hành chỉ Web; app Android/iOS là Future chưa roadmap/thời hạn. Giữ nghiệp vụ, ngưỡng backend/Web, 137 source ID và 20 nhóm TC; A/I/N1/N2 chỉ là biến thể Future, không PASS/N/A mới. Hồ sơ r1 và kết quả lab cũ giữ đúng nguồn; amendment không là nghiệm thu ứng dụng hoặc R05. Nguồn quyết định và snapshot/hash trước–sau: repo Kynderis/kidea, `KIDEA_DESIGN.md#client-web-scope-approved`, `tests/evidence/r05/web-scope-r1/manifest.json`.

[Feature Map](../../features.md#pil-f02). Người tham gia thao tác trên đăng ký chính mình; Web theo cùng quy tắc nghiệp vụ; native Future chưa roadmap. Cụm đầu dùng C-REG/C-LIFE và bàn giao nghĩa vụ sang C-VIEW.

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

### Nơi dùng trong thiết kế chất lượng

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [ac](#ac) | [Chất lượng · response](../../design/quality.md#response) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |

### Nơi dùng trong thiết kế trải nghiệm

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [flow](#flow) | [Trải nghiệm · screens](../../design/experience.md#screens) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
