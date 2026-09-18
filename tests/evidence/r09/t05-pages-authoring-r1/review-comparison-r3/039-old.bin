# Đặc tả kiểm kỹ thuật R05 — r1

**Amendment Web r2, 2026-09-17 — theo quyết định Human:** client hiện hành chỉ Web; app Android/iOS là Future chưa roadmap/thời hạn. Giữ nghiệp vụ, ngưỡng backend/Web, 137 source ID và 20 nhóm TC; A/I/N1/N2 chỉ là biến thể Future, không PASS/N/A mới. Hồ sơ r1 và kết quả lab cũ giữ đúng nguồn; amendment không là nghiệm thu ứng dụng hoặc R05. Nguồn quyết định và snapshot/hash trước–sau: repo Kynderis/kidea, `KIDEA_DESIGN.md#client-web-scope-approved`, `tests/evidence/r05/web-scope-r1/manifest.json`.

**PROPOSED — chờ duyệt nội dung. Tất cả ca ứng dụng/build: NOT_RUN.** Tài liệu này cụ thể hóa cách kiểm, không thay expected R03/R04. [Rule chung](rules.md#rules), [nghiệp vụ nguồn](../business/tests.md#coverage), [kiến trúc C1–C5](../design/architecture.md#cases), [Q](../design/quality.md#coverage).

<a id="protocol"></a>
## Giao thức cho từng case/biến thể

Mỗi instance ghi `caseID + variant + platform + runID`, source anchor/SHA, profile revision/SHA, preconditions, seed, input, thứ tự thao tác, oracle, target/artifact/config, command, thời điểm và evidence. Mỗi biến thể trong hàng nguồn phải chạy riêng; số nhóm trong bảng không là số test đã PASS. Setup mặc định dữ liệu giả mới C10/N0/OPEN, actor U/V có quyền tham gia, A chỉ admin, G khách; các case state/quyền thay setup theo nguồn. Không seed invariant sai cho đường thành công.

Oracle nghiệp vụ dùng DB/result/outbox có thẩm quyền qua hook lab chỉ đọc được cho phép, không lấy cache UI làm expected. So trạng thái trước/sau, số mutation/version/event và quyền; client assertions kiểm hiển thị riêng. Fault hook/barrier chỉ có trong build lab được duyệt, không endpoint thao tác production. Mỗi case có teardown theo quyền fixture, không tự xóa bằng chứng/dữ liệu thật. Kết quả thiếu/fail/skip ghi nguyên; không retry lấy lượt đẹp hoặc tự nâng timeout/ngưỡng Q.

Môi trường: **B** = backend Ubuntu Docker cùng target CPU cho kiểm chức năng; **W** = SSR/browser qua HTTPS lab; **A/I** = biến thể Android/iOS Future chưa roadmap, không là gate hiện hành; **L** = các host lab độc lập/backend/load/backup/observer với quyền cụ thể; **D** = kiểm hồ sơ/config, không runtime. B/W/L/D cần kiểm riêng đúng môi trường. Catalog trước amendment giữ A/I trong snapshot lịch sử; bảng hiện hành chỉ liệt kê phần còn áp dụng. Không lấy một browser/CPU đại diện mọi tổ hợp. Mọi nhóm cần app hiện NOT_RUN; thiếu bố trí là BLOCKED_ENV_PENDING.

Evidence từng instance dự kiến `<runID>/<caseID>/<variant>/<platform>/`: manifest JSON, stdout/stderr, assertion report, request/result IDs giả, DB snapshot đọc được, traces có redaction, screenshot/xcresult/instrumentation khi áp dụng. Không gom JSON chứa token thật. Log lỗi/timeout gắn source/config/target, thời lượng test không tự là benchmark.

<a id="cases"></a>
## Nhóm kỹ thuật — mỗi hàng có oracle riêng

| ID | Setup và input/biến thể | Thao tác thực thi | Expected / assertion | Môi trường | Evidence bổ sung |
|---|---|---|---|---|---|
| TC-01 | G/U/V/A × DRAFT/OPEN/PAUSED; ID thật/ngoài quyền/không tồn tại; state 9 ô | Gọi trực tiếp API rồi UI, giả role client, đổi clock qua lịch | Đúng P01–P08/W-ACCESS/W-STATE; không leak, không tự đóng, no-op không event | B+W | Permission matrix, public/private body/HTML và DB diff |
| TC-02 | C1/N0 U/V; C10/N9 với giảm C hoặc PAUSE; cùng actor hai mã | Barrier trước quyết định, ép từng thứ tự C01–C05, 100 vòng WQ2 khi có quyền tải | 0≤N≤C, một ACTIVE/actor/workshop, kết quả đúng từng lịch; không ưu tiên admin | B+W; L cho WQ2 | Thứ tự commit, IDs, N/C trước/sau, không chỉ tổng pass |
| TC-03 | Intent X đủ quyền; response trễ/mất; hủy A rồi rebook B | Gửi X, cắt response, reload/process restart, tra hoặc dùng lại đúng X theo R-RETRY, thu hồi quyền | Kết quả lịch sử không hồi sinh A; không X→Y tự động; U/V cùng literal X độc lập theo C1 | B+W | Correlation actor/epoch/namespace, lịch POST/GET, result history |
| TC-04 | Transaction domain/result/audit/outbox, seed trước commit | Tiêm lỗi prepare/step/commit/rollback, crash trước/sau commit và giữa publish/mark; restart | Bốn phần nguyên khối, ACK giữ với storage nguyên; chưa chắc vẫn UNKNOWN; không event cho no-op/reject | B | Snapshot DB/WAL, commit marker, outbox replay và oracle ACK |
| TC-05 | Admin create/edit/state, intent X; hai form cùng/khác field | Double click/packet, đổi payload/actor; mất response rồi GET; sửa field khác và lịch nhóm | K3 không tự POST lại; K4 chỉ dirty fields, cùng field lần xử lý sau thắng, schedule nguyên nhóm; dialog không là lock | B+W | Request bodies, intent/result/audit, state từng form |
| TC-06 | D01–D09; emoji/UTF-8 lỗi, version 2^53+1; vector CPP-06 | Validate cả tạo/sửa qua backend và nhập client; duplicate JSON key/unknown field; so literal lưu | Đúng code point/miền/thời điểm thực; malformed bị từ chối; không cấm dấu câu thuần; không đổi DB/event khi sai | B+W | Vector input/expected/raw encoding và diff DB |
| TC-07 | Nhóm actor/epoch/workshop/audience, ACTIVE rồi CANCELLED/rebook | Giữ HTTP cũ, phát socket mới, release HTTP; trùng/cũ/gap/cùng version khác nội dung; đổi epoch/actor | Merge đúng nhóm C2, không mất ID lịch sử, không so version xuyên nhóm; conflict unknown/reconcile | B+W | Lịch message, cache snapshots, generation và render history |
| TC-08 | Từng limit C4 từ architecture/admission; N−1/N/N+1 cho count/size, token bucket dùng clock kiểm được | Vượt từng rate/burst/body/frame/queue/socket; client chậm; mất response sau admission | Bound đúng nguồn, 429/503 không final domain; M7 giữ mẫu lỗi; ngắt socket dẫn stale/reconcile, không replay | B+W | Counters, timing, error classification và tài nguyên |
| TC-09 | U/V/G/A, revoked session, token/sentinel giả; TLS và Origin hợp lệ/sai | Truy ID DRAFT/private, forged role/header, cross-origin, subscribe rồi thu hồi, SSR đồng thời | Không mutation/leak sai quyền; không token URL/log; mọi request và phát socket kiểm quyền | B+W | HTTP/SSR/socket/log/backup inspection, redaction report |
| TC-10 | Startup thiếu DB/schema/backup/observer; stop với RAM pending và đã commit | Mở từng điều kiện, đóng admission, drain tới 30s, dừng/restart; đóng phiên AI | Không write-ready sớm, không ACK RAM, không phủ định commit; observer sống tới cuối và phục hồi không replay | B+W+L | Readiness timeline, process lifecycle, pending/result và signal |
| TC-11 | WQ/E1, đang có thay đổi; backup API mỗi 5 phút, đích độc lập | Gián đoạn chuyển bản sao, xác minh hash/integrity/watermark; lỗi job giả success | Chỉ VERIFIED khi đích/mốc hợp lệ; M9 dựa recovery point, không giờ job; bản .db riêng không đạt | B+L | Source/target hashes, watermark, DB integrity và timestamp |
| TC-12 | Bản sao lab được phép phá, known recovery point; client giữ epoch cũ | Diễn tập crash storage còn nguyên và mất storage riêng; restore, epoch mới, revoke sessions | QD crash 0 ACK mất/≤5 phút; mất ổ ≤15 phút thay đổi và ≤60 phút; không replay che mất; không rollback app giả | B+L+W | Operation ledger trước/sau point, clock, epoch/session assertions |
| TC-13 | Đúng WQ1/E1 từng platform, 2 phút warm-up +15 phút đo, 3 lượt | Phát open-loop 5req/s (3600 đọc/900 ghi), deadline10s; blackout30s riêng, thu mọi mẫu/offer | QR p95 đọc≤1000ms/ghi≤2000ms, lỗi≤1% riêng nhóm; missed-offer>0 fail; QF p95≤2s/max≤5s, catch-up≤10s; không loại mẫu | L+W | Raw mọi request/commit/render, clock offset, p95 nearest-rank và denominator |
| TC-14 | M1–M9, dữ liệu tươi/cũ/thiếu, incident mở, 80%/2GiB, backup10/15phút | Ngắt collector/backend/dashboard/AI/observer; duplicate alert/restart; biên ngưỡng theo OP | Unknown không xanh/0, đúng ngân sách cảnh báo và recovery; không tự dọn/replay; fallback độc lập đúng cửa sổ trực | B+L+W | Sample age, incident persistence, bằng chứng đầu nhận cảnh báo |
| TC-15 | Release R1/R2 với artifact/config/schema/script SHA; client/server cũ–mới | Thử cả hai chiều tương thích; đổi artifact cùng version, config sau review; deploy một phần/mất kết nối; migration/rollback | Unknown major chặn mutation, optional field theo contract; không giữ approval sai byte; đọc lại từng component; rollback chỉ khi schema tương thích, restore riêng | D+B+W+L | Release revision, từng attempt/retry, readback version/config, rollback decision |
| TC-16 | Hồ sơ có rule/profile/command/evidence; biến thể thiếu/skip/sai SHA/ngoại lệ cũ | Review toàn G2 trên bản cuối; đổi một input, giữ log fail, thử nhận docs thay runtime | Không DONE/PASS khi thiếu; ngoại lệ phải đúng bản/phạm vi; không chép config hoặc lấy test phần đổi thay toàn dự án | D | Manifest validation, danh sách nghĩa vụ/ngoại lệ, kết luận có giới hạn |
| TC-17 | Một mẫu thuận và mẫu nghịch cho từng CPP/WEB (AND/IOS Future), toolchain đúng/sai | Build sạch và chạy checker theo profile, ghi expected detection của mẫu sai; đổi target/SDK | Thuận qua, nghịch bị bắt đúng lỗi; không báo PASS nếu compiler thiếu hoặc nghịch không bị bắt; môi trường mô phỏng không thay target chưa kiểm | B+W | Compiler diagnostics, dependency graph, binary/package SHA, xcresult/lint |
| TC-18 | Resource/callback/thread hữu hạn; SQL chậm, exception, actor isolation | Hủy/race, chạy ASan+UBSan và TSan riêng trên C++; rotate/native diagnostics Future | Không use-after-free/race/leak/lock vô hạn, main/event loop không blocking; sanitizer không thay test semantics | B | Tool version/options, sanitizer report, thread/resource count |
| TC-19 | W1–W6, JS tắt/on, keyboard, 360/1280px, chữ200%; N1–N2/native lớn Future | Navigate/back, dialog Escape/confirm, loading/empty/error, đổi title, đọc HTML đầu | Đúng UX/SEO/QC nguồn; stable URL, noindex lab, không Event markup/private SSR; không side effect do render | W | Screenshots, keyboard/focus trace, HTML/metadata, timing QC |
| TC-20 | App ở mỗi await; actor A→B, epoch cũ→mới, foreground/background | Đóng/reload/recreate browser, release callback cũ; cancel task sau gửi; process death/rotate app native Future | State đúng generation, không rò A sang B; cancel không rollback server; không tăng mutation do lifecycle | W | Scheduler timeline + instrumentation/device traces, POST count |

QF mất kết nối rõ phải đánh dấu ≤1s, im lặng >5s; TC-07/TC-13/TC-14 kiểm hai đường riêng. OP-T01–15 giữ ngưỡng cảnh báo gốc, không dùng ngưỡng p95 thay max. QC lấy đúng các mục tiêu trong [quality/client-seo](../design/quality.md#client-seo), không đổi ngưỡng theo thiết bị yếu. Source thiếu hoặc mâu thuẫn phải báo, không tự chọn expected để test xanh.

TC-19/QT13 đo 100 thao tác cục bộ mỗi môi trường Web đã chọn, p95≤100ms. QT14 đo 30 lần process-cold mỗi môi trường Web đã chọn, p95≤3s: web mở browser context mới với HTTP cache trống, không service worker, cùng dữ liệu server; biến thể native kết thúc tiến trình rồi khởi động mới giữ lịch sử Future, không là gate hiện hành. Clock bắt đầu tại thao tác mở/navigate, kết thúc ở frame nội dung công khai có ích; không kết thúc ở skeleton/loading. Warm-cache chạy riêng và không thay mẫu cold. Không tự xóa account/DB để tạo cold; crash/force-stop và thiết bị phải nằm trong quyền bài thử.

<a id="coverage"></a>
## Đối chiếu toàn bộ case nguồn

Bảng dưới chỉ dẫn từng case tới nhóm kỹ thuật; phải đọc setup/input/expected/biến thể tại nguồn rồi áp giao thức phía trên. Không thay bộ nguồn bằng 20 hàng nhóm. Rule/profile là cách thực hiện, không căn cứ duyệt nghiệp vụ mới.

| Case nguồn | Nguồn setup/input/expected | Nhóm kỹ thuật | Runtime |
|---|---|---|---|
| P01 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| P02 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| P03 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| P04 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| P05 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| P06 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| P07 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| P08 | [business/tests.md#access](../business/tests.md#access) | TC-01 | NOT_RUN |
| R01 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| R02 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| R03 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| R04 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| R05 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| R06 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| R07 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| R08 | [business/tests.md#registration](../business/tests.md#registration) | TC-02 | NOT_RUN |
| I01 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I02 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I03 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I04 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I05 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I06 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I07 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I08 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I09 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| I10 | [business/tests.md#retry](../business/tests.md#retry) | TC-03 | NOT_RUN |
| C01 | [business/tests.md#concurrency](../business/tests.md#concurrency) | TC-02 | NOT_RUN |
| C02 | [business/tests.md#concurrency](../business/tests.md#concurrency) | TC-02 | NOT_RUN |
| C03 | [business/tests.md#concurrency](../business/tests.md#concurrency) | TC-02 | NOT_RUN |
| C04 | [business/tests.md#concurrency](../business/tests.md#concurrency) | TC-02 | NOT_RUN |
| C05 | [business/tests.md#concurrency](../business/tests.md#concurrency) | TC-02 | NOT_RUN |
| D01 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D02 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D03 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D04 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D05 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D06 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D07 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D08 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| D09 | [business/tests.md#data](../business/tests.md#data) | TC-06 | NOT_RUN |
| E01 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E02 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E03 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E04 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E05 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E06 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E07 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E08 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E09 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| E10 | [business/tests.md#events](../business/tests.md#events) | TC-07 | NOT_RUN |
| T01 | [business/tests.md#trace](../business/tests.md#trace) | TC-16 | NOT_RUN |
| T02 | [business/tests.md#trace](../business/tests.md#trace) | TC-16 | NOT_RUN |
| T03 | [business/tests.md#trace](../business/tests.md#trace) | TC-16 | NOT_RUN |
| T04 | [business/tests.md#trace](../business/tests.md#trace) | TC-16 | NOT_RUN |
| UX-T01 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T02 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T03 | [design/experience.md#cases](../design/experience.md#cases) | TC-03 | NOT_RUN |
| UX-T04 | [design/experience.md#cases](../design/experience.md#cases) | TC-03 | NOT_RUN |
| UX-T05 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T06 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T07 | [design/experience.md#cases](../design/experience.md#cases) | TC-07 | NOT_RUN |
| UX-T08 | [design/experience.md#cases](../design/experience.md#cases) | TC-09 | NOT_RUN |
| UX-T09 | [design/experience.md#cases](../design/experience.md#cases) | TC-06 | NOT_RUN |
| UX-T10 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T11 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T12 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T13 | [design/experience.md#cases](../design/experience.md#cases) | TC-19 | NOT_RUN |
| UX-T14 | [design/experience.md#cases](../design/experience.md#cases) | TC-12 | NOT_RUN |
| UX-T15 | [design/experience.md#cases](../design/experience.md#cases) | TC-05 | NOT_RUN |
| OP-T01 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T02 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T03 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T04 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T05 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T06 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T07 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T08 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T09 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T10 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T11 | [design/operations.md#cases](../design/operations.md#cases) | TC-09 | NOT_RUN |
| OP-T12 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T13 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T14 | [design/operations.md#cases](../design/operations.md#cases) | TC-14 | NOT_RUN |
| OP-T15 | [design/operations.md#cases](../design/operations.md#cases) | TC-11 | NOT_RUN |
| AD-T01 | [design/admin.md#cases](../design/admin.md#cases) | TC-06 | NOT_RUN |
| AD-T02 | [design/admin.md#cases](../design/admin.md#cases) | TC-05 | NOT_RUN |
| AD-T03 | [design/admin.md#cases](../design/admin.md#cases) | TC-01 | NOT_RUN |
| AD-T04 | [design/admin.md#cases](../design/admin.md#cases) | TC-02 | NOT_RUN |
| AD-T05 | [design/admin.md#cases](../design/admin.md#cases) | TC-02 | NOT_RUN |
| AD-T06 | [design/admin.md#cases](../design/admin.md#cases) | TC-05 | NOT_RUN |
| AD-T07 | [design/admin.md#cases](../design/admin.md#cases) | TC-05 | NOT_RUN |
| AD-T08 | [design/admin.md#cases](../design/admin.md#cases) | TC-05 | NOT_RUN |
| AD-T09 | [design/admin.md#cases](../design/admin.md#cases) | TC-09 | NOT_RUN |
| AD-T10 | [design/admin.md#cases](../design/admin.md#cases) | TC-04 | NOT_RUN |
| AD-T11 | [design/admin.md#cases](../design/admin.md#cases) | TC-04 | NOT_RUN |
| AD-T12 | [design/admin.md#cases](../design/admin.md#cases) | TC-09 | NOT_RUN |
| AD-T13 | [design/admin.md#cases](../design/admin.md#cases) | TC-05 | NOT_RUN |
| AD-T14 | [design/admin.md#cases](../design/admin.md#cases) | TC-19 | NOT_RUN |
| AD-T15 | [design/admin.md#cases](../design/admin.md#cases) | TC-12 | NOT_RUN |
| AR-T01 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-06 | NOT_RUN |
| AR-T02 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-02 | NOT_RUN |
| AR-T03 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-02 | NOT_RUN |
| AR-T04 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-04 | NOT_RUN |
| AR-T05 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-05 | NOT_RUN |
| AR-T06 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-05 | NOT_RUN |
| AR-T07 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-05 | NOT_RUN |
| AR-T08 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-04 | NOT_RUN |
| AR-T09 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-07 | NOT_RUN |
| AR-T10 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-13 | NOT_RUN |
| AR-T11 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-09 | NOT_RUN |
| AR-T12 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-19 | NOT_RUN |
| AR-T13 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-11 | NOT_RUN |
| AR-T14 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-12 | NOT_RUN |
| AR-T15 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-14 | NOT_RUN |
| AR-T16 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-14 | NOT_RUN |
| AR-T17 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-13 | NOT_RUN |
| AR-T18 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-15 | NOT_RUN |
| AR-T19 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-03 | NOT_RUN |
| AR-T20 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-07 | NOT_RUN |
| AR-T21 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-10 | NOT_RUN |
| AR-T22 | [design/architecture.md#cases](../design/architecture.md#cases) | TC-08 | NOT_RUN |
| QT01 | [design/quality.md#response](../design/quality.md#response) | TC-13 | NOT_RUN |
| QT02 | [design/quality.md#response](../design/quality.md#response) | TC-03 | NOT_RUN |
| QT03 | [design/quality.md#response](../design/quality.md#response) | TC-02 | NOT_RUN |
| QT04 | [design/quality.md#freshness](../design/quality.md#freshness) | TC-13 | NOT_RUN |
| QT05 | [design/quality.md#freshness](../design/quality.md#freshness) | TC-07 | NOT_RUN |
| QT06 | [design/quality.md#freshness](../design/quality.md#freshness) | TC-14 | NOT_RUN |
| QT07 | [design/quality.md#recovery](../design/quality.md#recovery) | TC-12 | NOT_RUN |
| QT08 | [design/quality.md#recovery](../design/quality.md#recovery) | TC-12 | NOT_RUN |
| QT09 | [design/quality.md#privacy](../design/quality.md#privacy) | TC-09 | NOT_RUN |
| QT10 | [design/quality.md#privacy](../design/quality.md#privacy) | TC-09 | NOT_RUN |
| QT11 | [design/quality.md#privacy](../design/quality.md#privacy) | TC-06 | NOT_RUN |
| QT12 | [design/quality.md#resources](../design/quality.md#resources) | TC-14 | NOT_RUN |
| QT13 | [design/quality.md#client-seo](../design/quality.md#client-seo) | TC-19 | NOT_RUN |
| QT14 | [design/quality.md#client-seo](../design/quality.md#client-seo) | TC-19 | NOT_RUN |
| QT15 | [design/quality.md#client-seo](../design/quality.md#client-seo) | TC-19 | NOT_RUN |
| QT16 | [design/quality.md#client-seo](../design/quality.md#client-seo) | TC-19 | NOT_RUN |

<a id="results"></a>
## Trạng thái kiểm và gate

Các TC-01–TC-20 và toàn bộ case kế thừa đều **NOT_RUN** trên ứng dụng. Kiểm R05 hiện tại chỉ xác nhận hồ sơ, liên kết, bảo toàn và coverage có khai báo, không chứng minh đủ ngữ nghĩa hoặc runtime. Mẫu build R05, tích hợp R09 và nghiệm thu R10 vẫn có gate riêng. Mọi sửa bản nguồn/config sau kết quả phải làm mất hiệu lực phần liên quan, giữ raw lịch sử và chạy lại đúng lượt bắt buộc.
