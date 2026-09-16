# R05 — Chuẩn bị mẫu Web độc lập Docker

Ngày 2026-09-16. Human cho tiếp tục phần không cần Docker; Docker chờ Human báo lại khi ở máy. Đây là phần chuẩn bị E2 trong [gói môi trường](r05-environment-build-r1.md), không cấp quyền cài dependency/build/app/server. Nội dung profile r1 đã duyệt giữ nguyên. Không mở R06 hoặc đóng R05.

## Đầu ra cụ thể

[Bộ chín vector](../tests/r05/fixtures/web-sample-vectors-r1.json) cụ thể hóa WEB-01/03/05/06/07 và TC-03/05/07/09/19/20. Mỗi ca có trạng thái đầu, thứ tự/barrier, expected, biến thể sai và đích kiểm. JSON mô tả mô hình test trừu tượng, không định nghĩa payload API hoặc schema mới của sản phẩm. Cả chín ca ứng dụng vẫn NOT_RUN; kiểm tính đủ trường của vector không là chạy ứng dụng.

| Lát cắt | Đầu ra mẫu sau quyền thực thi | Bằng chứng đủ để nhận đạt |
|---|---|---|
| State/reducer: S01–S05,S09 | Module nhỏ giữ key actor/epoch/workshop/audience/generation và version chuỗi; test bằng barrier xác định | Mẫu thuận qua toàn assertions, biến thể bỏ guard/ép Number phải bị bắt; lưu seed/order, state trước–sau. Không dùng sleep ngẫu nhiên |
| SSR: S06,S08 | Hai request độc lập trên bundle production, fixture private tách actor; render literal an toàn | Kiểm HTML thô và headers, đảo thứ tự request trên process mới, hydrate/browser bổ sung; unit mock không đủ nhận SSR đạt |
| Admin transport: S07 | Fake transport ghi POST/GET, response UNKNOWN/FINAL và reload state | Negative retry tự động phải bị bắt; không coi fake FINAL là bằng chứng transaction hoặc quyền backend |

Không dùng render title S08 thay validator W-DATA: đó là input đối kháng của lớp render; backend có thể từ chối trước khi đến đây. Các variant actor/epoch/audience khác trong profile gốc vẫn cần chạy; chín vector là lát cắt mẫu, không thay137ca nguồn hoặc toàn ma trận test kỹ thuật.

## Chuẩn bị và chạy không cần Docker

Ngay bây giờ có thể đọc nguồn, hoàn thiện vector, rà coverage/link, đối chiếu metadata dependency và soạn kế hoạch. Node24.19 hiện có đủ cho kiểm hồ sơ Kidea; không cần cài Node khác cho các thao tác đó.

Bước thực thi Web sau này có thể chạy native trên Mac, không phụ thuộc Docker: build SvelteKit adapter-node, SSR và browser dùng fake transport ở mẫu. Điều kiện còn thiếu là dependency lock, exact công cụ check/lint/browser, quyền tải/cài dependency và chạy mẫu; approval chuẩn bị hiện tại chưa cấp các quyền đó. Giữ sáu phiên bản nền đã duyệt; chưa đổi baseline sản phẩm hoặc thực thi npm ci trong pilot.

Khi đến thực thi: dùng thư mục mới `samples/r05/web/` trong sibling; không chạy trực tiếp trong repo Kidea. Test data chỉ chứa fake actor/intent/sentinel. Lệnh project check/lint/unit/build/browser phải có script thật trước khi xin chạy, không coi tên script dự kiến là lệnh đã kiểm. Các mẫu âm tách thư mục để không biến mutation cố ý sai thành nguồn mặc định; mỗi lượt gắn source/lock/profile/Node/browser SHA.

Mẫu browser cần server loopback do lượt chạy sở hữu, cổng được cấp trong gói thực thi; dừng process sau test. Kiểm cookie Secure/CSRF/proxy theo thiết kế cần HTTPS lab và C++ backend thật ở lượt integration: không bỏ các kiểm đó vì mẫu native không có Docker. Không trust CA hoặc đổi firewall trong lượt chuẩn bị.

## Trình tự tiếp tục

1. Chốt manifest dependency Web và thiết kế script mẫu trong phạm vi chuẩn bị; thiếu resolved lock/browser thì ghi rõ, không chứng nhận INSTALL_READY.
2. Trình quyền tải/chạy mẫu Web hữu hạn riêng khi đầu vào đủ; không phải chờ Docker để xin gói Web đó.
3. Sau quyền thực thi, chạy unit/SSR/browser mẫu theo ma trận, giữ cả FAIL và PASS; integration backend/Caddy vẫn chờ Docker. Không gọi kết quả fake transport là nghiệm thu sản phẩm.

Phần này vẫn là R05-T03/T06 chuẩn bị; T03-S03 chưa chạy. Không sửa test inventory R03 cũ hoặc làm biến mất lỗi19/20 lịch sử.
