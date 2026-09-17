# SvelteKit / TypeScript — profile r1

**PROPOSED — chờ duyệt nội dung**, chưa build/browser test. Áp dụng web public/admin/ops của pilot. [Rule chung/ngoại lệ](rules.md#exceptions); nguồn [UX/SEO](../design/experience.md#seo), [API](../design/architecture.md#api), [updates](../design/architecture.md#updates), [admin intent](../design/architecture.md#admin-intent).

<a id="toolchain"></a>
## Tổ hợp và command dự kiến

Giữ ứng viên baseline: SvelteKit 2.70.3, Svelte 5.57.0, TypeScript 6.0.3, Vite 8.2.2, vite-plugin-svelte 7.3.0, adapter-node 5.5.7. Metadata npm chính thức ngày 2026-09-16 xác nhận version/peer ranges; chưa là thử cài hoặc compile. Node sản phẩm ứng viên 24.20.0/npm 11.19.0 theo thiết kế, độc lập với Node 24.19.0 đang kiểm Kidea; cần xác minh artifact/runtime và lock transitive trước build. Không nâng package chỉ vì đã có latest.

Command đề xuất sau có package/config thật: `npm ci`, script `check` (svelte-check + TypeScript strict), `lint`, `test:unit`, `test:browser`, `build`, rồi smoke bundle adapter-node qua cổng HTTPS được cấp. Chưa có các script hoặc tool versions phụ, không coi command ví dụ chạy được. SSR/private/SEO phải kiểm cả HTML đầu và tương tác browser; dev server xanh không thay bundle production. Nguồn [adapter-node](https://svelte.dev/docs/kit/adapter-node), [state management](https://svelte.dev/docs/kit/state-management).

<a id="rules"></a>
## Rule

| ID | Phạm vi / lý do / nguồn | Đúng | Sai | Kiểm |
|---|---|---|---|---|
| WEB-01 | SSR/state, architecture/updates | State riêng request/actor; private no-store | Global mutable store chia SSR giữa hai actor | TC-09: hai request đồng thời có dữ liệu sentinel khác, kiểm HTML/headers/cache |
| WEB-02 | Types/API, architecture/api | Decode unknown thành union FINAL/UNKNOWN/transport; version chuỗi | any hoặc ép cast JSON thành thành công | TC-06/TC-15: response sai schema, overflow, optional field mới |
| WEB-03 | Rendering/SEO, experience/seo | Escape text, URL theo ID, SSR public, lab noindex | Raw HTML từ title, đổi URL khi đổi tên, public DRAFT | TC-06/TC-19: JS tắt, metadata/canonical/robots và private HTML |
| WEB-04 | Auth/CSRF, architecture/api | Server xác thực mỗi action; cookie HttpOnly/Secure; Origin+token qua proxy đã tin | Role trong localStorage cấp quyền; tắt CSRF để chạy | TC-09: direct request, cross-origin, revoked session, forwarded header giả |
| WEB-05 | Unknown/admin, architecture/admin-intent | Lưu intent gắn actor trước gửi, mất phản hồi chỉ GET đối chiếu | Reload POST lại admin hoặc tìm theo title để nhận success | TC-03/TC-05: double click, timeout/reload và mã cùng tên khác payload |
| WEB-06 | State merge, architecture/updates | Key actor/epoch/workshop/audience, mới hơn thay nhóm, cũ bỏ | HTTP cũ replace history mới hoặc version public loại private | TC-07: CANCELLED/rebook, hai workshop cùng version, logout giữa await |
| WEB-07 | Accessibility/lifecycle, experience/usability | Nút và nhãn semantic, focus dialog, abort fetch + generation guard | Clickable div không keyboard; callback cũ cập nhật actor mới | TC-19/TC-20: Escape, keyboard, 360/1280px, chữ 200%, logout race |
| WEB-08 | Header/body/lifecycle, architecture/admission/delivery | Limit cả cổng và Node, origin cố định, stop nhận mới rồi drain | Trust tùy ý X-Forwarded-Host; chỉ tin exit 0 deploy | TC-08/TC-10/TC-15: body vượt giới hạn, proxy giả, shutdown request dở |

Mỗi rule không có ngoại lệ mặc định; theo rules/exceptions. C++ vẫn quyết định nghiệp vụ; frontend validation chỉ phản hồi sớm, không sao chép authority.

<a id="samples"></a>
## Mẫu đúng–sai và giới hạn

Mẫu thuận đề xuất: reducer pure nhận key/generation/version, bỏ response thế hệ cũ; mẫu sai bỏ guard generation hoặc dùng mutable global SSR store. Kiểm unit trì hoãn response A, logout/login B, release A: không có dữ liệu A ở B; browser/SSR test độc lập chứng minh cách wiring thực. Cả compile, unit mẫu và browser hiện **NOT_RUN**.

Đối chiếu advisory chính thức: [GHSA-29g2-3rmr-qm68](https://github.com/sveltejs/kit/security/advisories/GHSA-29g2-3rmr-qm68) ghi bản vá 2.70.2; [GHSA-2crg-3p73-43xp](https://github.com/sveltejs/kit/security/advisories/GHSA-2crg-3p73-43xp) ghi bản vá Kit 2.57.1 cho bypass body limit. 2.70.3 cao hơn hai mốc này; đây không phải audit toàn dependency. Trước install vẫn kiểm lock transitives/advisory và các header/body limits thực tế.
