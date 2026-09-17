# PIL-F01 — Xem workshop

**Amendment Web r2, 2026-09-17 — theo quyết định Human:** client hiện hành chỉ Web; app Android/iOS là Future chưa roadmap/thời hạn. Giữ nghiệp vụ, ngưỡng backend/Web, 137 source ID và 20 nhóm TC; A/I/N1/N2 chỉ là biến thể Future, không PASS/N/A mới. Hồ sơ r1 và kết quả lab cũ giữ đúng nguồn; amendment không là nghiệm thu ứng dụng hoặc R05. Nguồn quyết định và snapshot/hash trước–sau: repo Kynderis/kidea, `KIDEA_DESIGN.md#client-web-scope-approved`, `tests/evidence/r05/web-scope-r1/manifest.json`.

[Feature Map](../../features.md#pil-f01). Khách/người tham gia/admin xem nội dung theo quyền; Web giữ nghĩa nghiệp vụ; hai app native Future chưa roadmap.

<a id="flow"></a>
## Luồng nguồn

| Bước | Điều kiện / nguồn | Kết quả / đi tiếp |
|---|---|---|
| V1 | Danh sách hoặc ID chi tiết; [W-ACCESS](../shared/workshop.md#access) | Lọc theo quyền; ID không truy cập được: không tiết lộ, kết thúc; hợp lệ: V2 |
| V2 | [W-LISTS](../shared/workshop.md#lists), [W-DATA](../shared/workshop.md#data) | Danh sách có thứ tự ổn định, chi tiết văn bản/lịch/C và nhãn trạng thái; V3 |
| V3 | Quan sát cập nhật theo [V-RECONCILE](../shared/availability.md#reconcile), [V-STALE](../shared/availability.md#stale) | Hiện số chỗ và thời điểm thực sự quan sát được, nhãn chưa cập nhật khi cần; không đảm bảo đặt chỗ |
| V4 tùy chọn | Người dùng mở đăng ký của tôi | Chuyển sang [flow chính chủ](register-cancel.md#flow), không dùng danh sách công khai để lấy lịch sử |

<a id="ac"></a>
## Điều kiện chấp nhận

AC-V1: Danh sách/chi tiết đúng [quyền/state/thứ tự](../shared/workshop.md#lists), không lộ DRAFT hoặc danh tính người tham gia. AC-V2: Mọi tình trạng cập nhật theo [V-STALE](../shared/availability.md#stale) và [V-RECONCILE](../shared/availability.md#reconcile); không ghép các version thành số chỗ giả. AC-V3: Trang tĩnh và nội dung công khai danh sách/chi tiết web phải đọc được khi chưa chạy JavaScript theo [ranh giới nền tảng](../../features.md#boundaries); đây là yêu cầu đích, chưa là test trình duyệt đã chạy.

<a id="relations"></a>
## Kiểm chứng và ảnh hưởng

[Test quyền](../tests.md#access), [event](../tests.md#events), [flow/nền tảng](../tests.md#trace) dùng AC/flow này. Backlink nguồn: [workshop](../shared/workshop.md#relations), [availability](../shared/availability.md#relations). Đổi quyền/state/version phải xét lọc danh sách, chi tiết, SSR và Web cùng lúc; native Future khi được mở lại.

### Nơi dùng trong thiết kế chất lượng

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [ac](#ac) | [Chất lượng · response](../../design/quality.md#response), [Chất lượng · client-seo](../../design/quality.md#client-seo) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |

### Nơi dùng trong thiết kế trải nghiệm

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [ac](#ac) | [Trải nghiệm · screens](../../design/experience.md#screens), [Trải nghiệm · seo](../../design/experience.md#seo) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
