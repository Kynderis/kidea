# Workshop — Feature Map

**Amendment Web r2, 2026-09-17 — theo quyết định Human:** client hiện hành chỉ Web; app Android/iOS là Future chưa roadmap/thời hạn. Giữ nghiệp vụ, ngưỡng backend/Web, 137 source ID và 20 nhóm TC; A/I/N1/N2 chỉ là biến thể Future, không PASS/N/A mới. Hồ sơ r1 và kết quả lab cũ giữ đúng nguồn; amendment không là nghiệm thu ứng dụng hoặc R05. Nguồn quyết định và snapshot/hash trước–sau: repo Kynderis/kidea, `KIDEA_DESIGN.md#client-web-scope-approved`, `tests/evidence/r05/web-scope-r1/manifest.json`.

Bộ hồ sơ nghiệp vụ lab để kiểm cách Kidea viết/đọc đặc tả. Căn cứ: [phạm vi gốc](D:/Code/kynderis/kidea/KIDEA_DESIGN.md#pilot-scope), [gói quyết định R03](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md), [retry/thứ tự/đồng thời](D:/Code/kynderis/kidea/proposals/r03-registration-decisions-r1.md). Nội dung tài liệu không là bằng chứng code chạy hoặc Human duyệt đầu ra.

<a id="goal"></a>
## Mục tiêu

Người tham gia xem workshop, đăng ký/hủy chỗ và xem lịch sử của mình; admin quản lý workshop. Hệ thống phải giữ đúng chỗ và đối chiếu được số chỗ hiển thị. Khách chỉ xem công khai. Dữ liệu giả, không người dùng thật.

<a id="pil-f01"></a>
## PIL-F01 — Xem workshop — MVP

Danh sách/chi tiết, nội dung/lịch/sức chứa/số chỗ và thời điểm quan sát; chính sách hiển thị và luồng tại [Xem](business/features/view.md#flow).

<a id="pil-f02"></a>
## PIL-F02 — Đăng ký/hủy — MVP

Đăng ký, hủy chính chủ, đăng ký lại, lịch sử cá nhân, xử lý gửi lại yêu cầu và tranh chỗ; luồng tại [Đăng ký/hủy](business/features/register-cancel.md#flow). Quy tắc chỉ có một nguồn ở các mục shared, không riêng từng client.

<a id="pil-f03"></a>
## PIL-F03 — Quản trị — MVP

Tạo/sửa/xuất bản/tạm dừng/mở lại workshop, quản lý sức chứa; chỉ web admin. [Luồng và AC](business/features/admin.md#flow).

<a id="pil-f04"></a>
## PIL-F04 — Cập nhật/vận hành — MVP

Xử lý cập nhật bất đồng bộ, version, dữ liệu trễ/gián đoạn/phục hồi; monitoring web admin. [Luồng và AC](business/features/updates.md#flow). Hiển thị không có thẩm quyền nhận chỗ.

<a id="boundaries"></a>
## Nền tảng và giới hạn lab

Backend C++ Ubuntu sở hữu rule/dữ liệu; web SvelteKit/TypeScript, SSR không sở hữu rule thứ hai. Trang giới thiệu tĩnh kiểm prerender; danh sách/chi tiết công khai đọc được trước JavaScript. Client hiện hành chỉ Web. Android Kotlin/Compose và iOS Swift/SwiftUI, kể cả hai màn N1/N2, chuyển Future chưa roadmap theo quyết định Human; không là điều kiện MVP.

Seed đích: 3 workshop, 10 người tham gia giả, 1 admin giả, sức chứa 10; fixture tranh chỗ cuối còn 1 chỗ. Đây chưa là dữ liệu runtime đã tạo. Giới hạn C=1000 trong rule không là cam kết chịu tải. Không code/build/deploy trong gói hồ sơ R03.

Không thanh toán, email/SMS/push, waitlist, public release, dịch vụ tính phí; lab không cho lập chỉ mục, chưa nhận SEO đạt. Ngân sách phát sinh 0 đồng. Kiến trúc/giao thức/storage, ngưỡng đo số giây, UX/wireframe, môi trường/thiết bị và nghiệm thu thực thuộc phase sau.

<a id="later"></a>
## Future — hai bài change giữ nguyên

- Giới hạn hai ACTIVE trên toàn workshop: chưa áp dụng MVP.
- Cho hủy khi PAUSED nhưng không cho đăng ký mới khi PAUSED: chưa áp dụng MVP.

Không A/B trong pilot theo B8; không đặc tả thêm hai biến thể.

<a id="open"></a>
## Tra cứu và phần chưa chứng minh

[Mục lục nghiệp vụ](business/INDEX.md#candidates) liên kết nguồn chung và bốn Feature. [Test specification](business/tests.md#coverage) ghi coverage và phần chưa chạy. Không có OPEN nghiệp vụ mới được tự chốt ngoài quyết định nguồn; chi tiết kỹ thuật để lại đúng phạm vi đã hoãn, không giả là ứng dụng đã đạt.

<a id="design-relations"></a>
### Nơi dùng trong thiết kế chất lượng

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [boundaries](#boundaries) | [Chất lượng · resources](design/quality.md#resources), [Chất lượng · client-seo](design/quality.md#client-seo) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |

### Nơi dùng trong thiết kế trải nghiệm

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [boundaries](#boundaries) | [Trải nghiệm · choices](design/experience.md#choices), [Trải nghiệm · seo](design/experience.md#seo) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
