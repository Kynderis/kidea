# R04 — Báo cáo độc lập, lượt đầu

**Kết quả: V1–V5 và V8 PASS; V6 và V7 FAIL.** Có một mâu thuẫn trực tiếp về phạm vi mã yêu cầu, ba khoảng trống thiết kế và một nhóm quan hệ truy nguồn thiếu.

Đã đọc đầy đủ prompt, SKILL.md, business.md, product-design.md, gói R04 và toàn bộ 15 Markdown trong `kidea-workshop-pilot/docs`. Đọc thêm hai nguồn quyết định R03 được liên kết để đối chiếu nghiệp vụ. Không đọc báo cáo tự chấm/prior review, không sửa file, chạy test, dịch vụ hoặc network.

Các approval Q/UX/SEO/O/A/K được hiểu theo sự kiện trong prompt; không dùng nhãn draft lịch sử làm lỗi gate. PASS dưới đây là đánh giá tài liệu thiết kế, **không phải sản phẩm đã chạy đạt**.

## V1 — PASS: Chất lượng có thể đo và giữ đúng giới hạn bằng chứng

Nguồn: `docs/design/quality.md#workload`, `#response`, `#freshness`, `#recovery`, `#privacy`, `#resources`, `#client-seo`.

- Tải mở 5 request/s, tỷ lệ đọc/ghi, 4.500 lượt/cửa sổ, warm-up, deadline, missed-offer, phân vị và ba lượt riêng từng nền tảng được mô tả.
- Timeout/lỗi nghiệp vụ không bị loại khỏi mẫu; vi phạm quyền/invariant không được bù bằng tỷ lệ lỗi thấp.
- Tách độ trễ phản hồi, commit-to-render, mất quan sát; crash storage nguyên vẹn khác mất ổ với ngoại lệ Q4 đã được duyệt.
- Manifest máy/thiết bị, backup độc lập và diễn tập thực được giữ ở trạng thái chưa có bằng chứng.

Không phát hiện lỗi tại yêu cầu chất lượng. Việc chưa có máy, số đo và restore drill là bằng chứng runtime phải có sau này, không phải lý do đánh FAIL thiết kế. Khoảng trống triển khai nghĩa vụ chống lạm dụng được ghi riêng tại V6/F04.

## V2 — PASS: UX giữ hành trình và nghĩa nghiệp vụ

Nguồn: `experience.md#screens`, `#action`, `#error`, `#usability`, `#cases`; `registration.md#retry`, `#new`, `#invariant`.

- Có web W0–W5 và hai màn native, trạng thái loading/empty/error/denied/offline, bố cục và điều hướng.
- Có no-JS cho nội dung công khai; giữ ý định qua reload; mất phản hồi không tự biến thành thất bại cuối hoặc tạo mã mới.
- Tách kết quả đăng ký lịch sử khỏi ACTIVE/CANCELLED hiện tại; hủy đúng registration ID; không cho admin quyền tham gia/hủy hộ.
- Có nhãn stale, timestamp, cỡ chữ, bàn phím và focus.

Không phát hiện mâu thuẫn UX. Hợp đồng kỹ thuật bảo vệ thứ tự dữ liệu cá nhân còn thiếu ở F02; điều đó không làm yêu cầu UX đã viết trở thành sai.

## V3 — PASS: SEO và quyền riêng tư đúng phạm vi lab

Nguồn: `experience.md#seo`, `#cases`; `architecture.md#updates`; `workshop.md#access`; R04 D3.

Có nội dung/owner, URL ổn định, metadata/canonical, lỗi ẩn/không tồn tại, HTML trước JavaScript và private cache. Noindex không được dùng thay xác thực; không hứa ranking/index/citation. Không phát Event markup thiếu dữ kiện; search bot và training bot được phân biệt.

Không phát hiện lỗi. Không thực hiện xác minh website hoặc mở các nguồn web trong phiên này.

## V4 — PASS: Monitoring phân biệt sự cố, dữ liệu cũ và sự chưa biết

Nguồn: `operations.md#signals`, `#display`, `#alerts`, `#response`, `#privacy`, `#cases`; `architecture.md#operations`, `#recovery`.

- M1–M9 phân biệt pending/oldest age, xử lý thành công, quan sát thành công, độ trễ, backup recovery point.
- Có ngưỡng, lịch quan sát, thời hạn hiển thị tới đầu nhận, escalation/reminder và điều kiện khôi phục.
- HTTP 200 với mẫu cũ không làm mới trạng thái; restart collector không làm mất incident.
- Host quan sát độc lập backend và phiên AI; giới hạn hỏng đồng thời/người trực được nêu.
- Không tự thêm replay/xóa/restart/restore hoặc trực 24/7.

Không phát hiện lỗi trong hợp đồng monitoring. Máy/kênh/người trực thực tế phải được xác nhận trước chạy; đây là readiness runtime được nhận diện đúng.

## V5 — PASS: Admin không tự mở rộng nghiệp vụ

Nguồn: `admin.md#commands`, `#confirm`, `#errors`, `#audit`, `#integration`, `#cases`; `architecture.md#admin-intent`; `workshop.md#access`, `#state`, `#edit`; `registration.md#serial`.

Có đủ tạo DRAFT, sửa field, chín ô state, no-op, quyền server, xác nhận thao tác nhạy cảm, audit nguyên khối và giới hạn retry admin.

K3 đã được duyệt riêng, không bị coi là quyền suy từ R-RETRY. K4 công khai trường hợp cùng field bị lần xử lý sau thay thế; A4 chỉ yêu cầu xem lại khi đã phát hiện thay đổi và không hứa dialog khóa dữ liệu. Vì vậy không coi chính lựa chọn K4 là lỗi.

## V6 — FAIL: Hợp đồng kiến trúc còn mâu thuẫn và thiếu quyết định

### F01 — Phạm vi unique của request_result không khớp R-RETRY

**Nguồn:** `architecture.md#storage`, hàng `request_result` (dòng 54); `business/shared/registration.md#retry`, bảng “Lịch sử mã trong phạm vi actor”; `architecture.md#admin-intent`, câu giữ nguyên R-RETRY cho đăng ký/hủy.

Kiến trúc viết: “unique mã trong namespace/epoch, sai actor/content không được dùng lại”. Khóa được mô tả không chứa actor, trong khi rule đăng ký/hủy phân loại lịch sử trong phạm vi actor.

**Phản ví dụ:** U đã dùng mã X. V đủ quyền gửi ý định đăng ký mới cũng có literal mã X. Theo bảng R-RETRY, lịch sử của V chưa có X nên phải xử lý ý định mới. Theo unique `namespace/epoch/X`, bản của U gây xung đột và V bị từ chối.

**Ảnh hưởng:** Thêm điều kiện từ chối ngoài nguồn cho đăng ký/hủy. UUID khó trùng không sửa được nghĩa hợp đồng.

**Sửa tối thiểu:** Ghi rõ khóa đăng ký/hủy là `(epoch, actor, namespace, requestID)` và lookup luôn dùng actor đã xác thực. Nếu muốn namespace admin có semantics khác theo K3, viết riêng. Thêm case hai actor cùng literal X, đồng thời giữ case actor khác không đọc được kết quả của U.

### F02 — Chưa xác định khóa/version để hợp nhất lịch sử cá nhân

**Nguồn:** `architecture.md#api`, hàng `GET /me/registrations`; `#updates` (dòng 103–105); `#storage`, hàng `registration`; `experience.md#action`, `#error`.

Public snapshot có `epoch/workshopID/version`. Private registration snapshot mới xác định audience; chưa chọn revision thuộc actor, registration hay workshop, và chưa nói response lịch sử nhiều workshop được hợp nhất với socket theo khóa/version nào. Câu chung “snapshot version mới thay trọn trạng thái” không giải quyết phạm vi version cho collection cá nhân.

**Phản ví dụ:** GET lịch sử được đọc khi A còn ACTIVE nhưng phản hồi bị chậm; sau đó cancel A và client nhận trạng thái CANCELLED; phản hồi GET cũ đến cuối. Thiếu token thứ tự/phạm vi, client có thể đưa A về ACTIVE. Hai workshop có cùng số version cũng không được coi là cùng một dòng trạng thái.

**Ảnh hưởng:** Ba client phải tự chọn hợp đồng để giữ yêu cầu UX; có nguy cơ hiện trạng thái cá nhân cũ như hiện tại.

**Sửa tối thiểu:** Chọn envelope/version cho dữ liệu cá nhân và quy tắc hợp nhất HTTP/socket theo đúng actor + epoch + tài nguyên. Có thể tái dùng workshop version nếu trả đủ phạm vi nhất quán; không bắt thêm global revision. Thêm case GET lịch sử đến muộn sau cancel/rebook, nhiều workshop và đổi epoch.

Đây là thiếu **quyết định thiết kế**, chưa phải bằng chứng sản phẩm đã có lỗi.

### F03 — Chưa có lifecycle cụ thể cho từng thành phần

**Nguồn:** R04 M5 yêu cầu “đóng gói/start/stop/health/config/secret” cho từng thành phần; `product-design.md`, M5; `architecture.md#components`, `#operations`, `#delivery`.

Kiến trúc đã chọn C++, SvelteKit Node, Caddy và observer nhưng chưa mô tả cách quản lý tiến trình/đóng gói, thứ tự mở phục vụ và dừng an toàn, trách nhiệm drain hàng ghi, xử lý request đang chờ khi dừng. Probe đọc đã được phân biệt với writer health, nhưng điều kiện cho phép mở ghi vẫn chưa có quy trình thành phần cụ thể.

**Phản ví dụ:** Sau khởi động, cổng đọc trả được nội dung trong khi điều kiện backup/observer chưa sẵn sàng; hoặc dừng backend với request còn ở hàng RAM. Văn bản hiện tại chưa chỉ rõ thành phần nào chặn tiếp nhận và khi nào được mở lại.

**Ảnh hưởng:** Người triển khai phải tự bổ sung phần vận hành mà M5 yêu cầu thiết kế giải quyết.

**Sửa tối thiểu:** Thêm bảng lifecycle ngắn: thành phần, artifact/process owner, dependency, readiness, start/stop và xử lý in-flight. Phiên bản, hostname, tài khoản, câu lệnh cụ thể có thể tiếp tục để R05/R09. Không cần triển khai service trong R04.

### F04 — Nghĩa vụ chống lạm dụng chưa được khép tại bước 7

**Nguồn:** `quality.md#privacy`, đoạn yêu cầu bước 5–7 quyết định “chống lạm dụng … với test tương ứng”; `architecture.md#storage`, `#api`, `#updates`, `#cases`.

Có body cap 128 KiB và câu hàng ghi/socket queue “có giới hạn”, nhưng chưa có chính sách nhận tải quá mức hoặc giới hạn kết nối/request/socket; chưa có case kiểm nghĩa vụ chống lạm dụng tương ứng. Những chi tiết này cũng chưa được ghi thành quyết định còn mở có owner/gate.

**Phản ví dụ:** Một client giả có phiên hợp lệ mở nhiều socket hoặc liên tục gửi request hợp lệ. Tài liệu chưa xác định giới hạn nào bị kích hoạt và việc không nhận thêm request được biểu diễn thế nào mà vẫn giữ nghĩa UNKNOWN sau gửi.

**Ảnh hưởng:** Nghĩa vụ QS có thể bị bỏ qua hoặc AI tự đặt chính sách tại code.

**Sửa tối thiểu:** Chọn chính sách hữu hạn phù hợp lab cho admission/connection/queue và kết quả khi quá giới hạn; giá trị cấu hình phụ thuộc máy có thể gắn owner/gate R05. Thêm case overload không biến lỗi kỹ thuật thành từ chối nghiệp vụ hoặc thành công giả. Không bắt thêm dịch vụ/rate-limit framework.

## V7 — FAIL: Có quan hệ nguồn–consumer trực tiếp chưa được khai báo

### F05 — Đường truy ngược bỏ sót chính nơi thực thi hợp đồng

**Nguồn cụ thể:**

1. `registration.md#retry` → bảng “Nơi dùng trong thiết kế kiến trúc” chỉ có `architecture.md#admin-intent`.
   - Nhưng `architecture.md#storage` lưu/deduplicate kết quả đăng ký; `#api` định nghĩa POST đăng ký/hủy và GET kết quả. Cả hai trực tiếp thực thi R-RETRY.
   - `#storage` không có link trực tiếp R-RETRY trong danh sách nguồn.

2. `architecture.md#updates` quyết định public/private snapshot, DRAFT/audience và private cache.
   - Đây là consumer trực tiếp của `workshop.md#access` và `availability.md#publish`.
   - Danh sách nguồn của `#updates` và các backlink kiến trúc ở hai rule này thiếu các cạnh đó.

**Phản ví dụ:** Đổi phạm vi mã yêu cầu hoặc audience của snapshot; lần theo bảng hiện tại có thể sửa admin-intent/API nhưng bỏ storage uniqueness hoặc đường socket/public snapshot.

**Ảnh hưởng:** Checker kiểm link đã khai báo vẫn có thể xanh, trong khi impact review không tới đầy đủ consumer. F01 cho thấy đây không chỉ là vấn đề điều hướng.

**Sửa tối thiểu:** Bổ sung forward/backlink theo từng rule–section với mục đích cụ thể, rồi rà các quan hệ trực tiếp chưa viết trong toàn bộ năm thiết kế. Gắn case F01/F02 vào đúng hợp đồng; không tạo map/tracker mới hoặc sửa rule R03.

## V8 — PASS: Phương pháp tái dùng được, không giả quyền/runtime

Nguồn: `SKILL.md`; `business.md`; `product-design.md` M0–M5 và Review and handoff; R04 P1–P3/mục 4; các tuyên bố phạm vi trong năm thiết kế.

- Giữ các gate riêng; approval đầu vào không phải nghiệm thu runtime hoặc quyền cài/deploy.
- Tách helper metadata khỏi product authoring; không quảng cáo action chưa có.
- Công nghệ/ngưỡng/topology workshop được ghi rõ là quyết định của pilot, không mặc định chung.
- Có nguyên tắc N/A theo nguồn, không thêm A/B mặc định, không dùng hash/link/test count thay bằng chứng ngữ nghĩa.
- Phiên review này thực hiện trong scope chỉ đọc và còn trước deadline.

F01–F05 là nội dung cần giải quyết ở đầu ra thiết kế; không tự cho phép sửa những bản đã duyệt. Bản sửa có thay đổi nghĩa phải qua gate thích hợp. Tôi không chứng nhận các log/hash/test controller nằm ngoài đầu vào được đọc.

## Phạm vi bằng chứng và bàn giao

Đã kiểm cả V1–V8; không có tiêu chí bỏ dở do hết giờ. Không kiểm ứng dụng, hiệu năng, recovery hoặc công nghệ bằng chạy thực tế. Các NOT_RUN trong hồ sơ vẫn là NOT_RUN, không bị chuyển thành lỗi chỉ vì đang ở pha thiết kế.

Mốc kiểm hash: **2026-09-15 16:27:57 UTC**.

- `architecture.md`: `D74ED6937DD616FCCC004DB890CFA44CFC5C2B835A13BCA5986E3913C3551E36`
- `business/shared/registration.md`: `E544ECB787A49274C26A06B52A554CC0001B4C347BCF2A139A61747E5F2EAA3D`
- `references/product-design.md`: `9BE0B2D324F3CF95207F790B53D25EB543E2120C0001469068532357D7E29B25`

Không dùng kết quả lượt này để xác nhận các byte được sửa sau đó nếu chưa recheck.
