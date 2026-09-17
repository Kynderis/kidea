# Workshop pilot — bàn giao hiện hành R09/C

Ngày2026-09-17. Đây là nguồn dẫn quyết định và điểm vào hồ sơ; trạng thái công việc có thẩm quyền nằm trong `.kidea/work.md` sau public init. Không nhập kết quả sample vào tiến độ ứng dụng.

## Phạm vi và quyền hiện hành

Human “Tôi duyệt tất cả mục trên nhé” duyệt A–E của [gói Kidea tại77f5caf](https://github.com/Kynderis/kidea/blob/77f5caf/proposals/r09-next-decisions-r1.md). C cho phép đọc21docs/137case, sửa chỉ23Windowslink trong8docs, thêm chính tài liệu này và [implementation-plan.md](implementation-plan.md), `.gitignore`, Git local `master` và public init với [Feature Map có sẵn](features.md#goal). Không remote/push pilot, chưa code/build/deploy workshop hoặc AI trial mới. Quyền Git của Kidea không tự là quyền remote pilot.

Giữ `samples/` nguyên trên đĩa và ngoài Git: đó là nguồn/binary/cache lab R05 lịch sử, không bộ ứng dụng mới. Nguồn trước sửa link và hash toàn samples được lưu ở repo Kidea `tests/evidence/r09/ae-r1/pilot/`. Clone Kidea không tự khôi phục sibling/sample này. Đích ở local APFS, không sync, một writer; không hỗ trợ mạng/iCloud/OneDrive/nhiều máy ghi.

## Bảng kế thừa — không hỏi lại approval cũ

| Hồ sơ | Căn cứ đã nghiệm thu | Cách dùng hiện tại |
|---|---|---|
| features, business/INDEX,4feature,3shared,business/tests (10file) | R03 E5 sau0dd5a25; [roadmap lịch sử](https://github.com/Kynderis/kidea/blob/77f5caf/KIDEA_ROADMAP.md) và [review R03](https://github.com/Kynderis/kidea/blob/77f5caf/tests/evidence/r03/recheck-r1.md) | Giữ nghiệp vụ/flow/AC/expected54nhóm; chưa runtime PASS |
| design/quality,experience,operations,admin,architecture (5file) | R04 nghiệm thu saua72e3a1; Q1–Q6/UX1–UX6/O1–O6/A1–A6/K1–K7 và sửaC1–C5 đã duyệt | Nhãn PROPOSED/IN_REVIEW trong bản soạn là lịch sử; không mở lại gate hoặc nhận đã chạy ứng dụng |
| engineering/rules,cpp,web,tests và2profile native (6file) | [R05 nghiệm thu](https://github.com/Kynderis/kidea/blob/77f5caf/docs/R05_ACCEPTANCE.md), acceptedsource98fb3416dc6b1d7483969393f6e1a2c100be1c82 | Backend/Web hiện hành; native Future;24rule hiện hành,16Future;137source ID/20TC vẫn nghĩa vụ ứng dụng |
| LP-01/Web amendment | [Manifest21file](https://github.com/Kynderis/kidea/blob/77f5caf/tests/evidence/r05/web-scope-r1/manifest.json) | Docker local Linux cho chức năng; cloud khi có workload/quyền; không suy Intel PASS thành Silicon |
| R08 | [Nghiệm thu lab hữu hạn](https://github.com/Kynderis/kidea/blob/77f5caf/docs/R08_ACCEPTANCE.md) tại16b2223 | Có bằng chứng build/delivery/restore riêng; không thay test workshop; manifest/deadline/waiver cũ đã dùng, không tái chạy |

Tất cả21file đã được đọc đầy đủ và đối chiếu nội dung trong lượt C, không chỉ kiểm hash. Bản R05 trước sửa link khớp cả21hash. Chỉ thay prefix Windows bằng URL GitHub cùng commit77f5caf trong8file;13file còn lại nguyên byte. Không sửa các bản snapshot Kidea/Windows.

## Nguồn có thẩm quyền và những điểm cần đọc đúng

- Backend C++/SQLite sở hữu quyền, idempotency, kết quả mutation và invariant. Web SvelteKit SSR chỉ kiểm nhập sớm/hiển thị. K3 không POST lại admin khi mất phản hồi; K4 cùng trường lần xử lý sau thắng, lịch nguyên nhóm. Không thiết kế lại broker/service.
- UI theo W0–W5 trong [experience/screens](design/experience.md#screens). Dòng TC-19 ghi W1–W6 là lệch nhãn biên tập; không tạo màn thứ bảy hoặc đổi expected. Khi cụ thể hóa case, ánh xạ vào sáu nhóm đã định nghĩa W0–W5 và ghi provenance. Native N1/N2 là Future, chưa lịch.
- Những câu “chưa chọn transaction/API” trong nghiệp vụ mô tả ranh giới tài liệu R03; thiết kế R04 phía sau đã chọn transaction/API. Chúng không phủ định R04. Tương tự command/phiên bản ứng viên trong profile r1 không là manifest build hiện hành hoặc quyền tải.
- D/E được duyệt trước, không giả là feedback Human xuất hiện muộn. T04 mới áp max2ACTIVE/người toàn workshop: CANCELLED không tính, hủy giải phóng hạn mức, kiểm atomic cùng capacity/idempotency; >2đã tồn tại giữ nguyên và chặn đăng ký mới tới khi dưới2. T09 mới cho chính chủ hủy PAUSED, vẫn chặn đăng ký mới, giữ quyền/ID/idempotency. Trước mỗi lần áp, cập nhật nguồn/caller/AC/test và thứ tự từ chối qua impact/gate; MVP ban đầu vẫn nguồn cũ.
- E chỉ lab dữ liệu giả/phi production: AI DEV trong quyền, Human trực tiếp chạy script vai PROD đã xác minh khi gói sẵn. N/A crawl/index/ranking công khai, noindex; giữ SSR/URL/metadata/accessibility/UX và gate readiness. Không mở DNS/publicproduction.
- Q1–Q6/ngưỡng/Lifecycle30s/2GiB dữ liệu giữ nguyên. Credit Google300USD không là ngân sách vô hạn. Local Docker không chứng minh backendhost hỏng; WQ/E1 cần máy tải/observer/backup đúng miền lỗi và mạng/clock đo thực trong manifest mới.
- Chrome của view Kidea không tự chốt ma trận browser sản phẩm. Gói chạy Web sẽ xác định browser/version/viewport thực, không tự N/A nghĩa vụ sản phẩm. View pilot kế thừa R07 hiện hoãn, chưa PASS hoặc bỏ gateT14; Windows/Silicon chưa có bằng chứng mới.

## Điểm tiếp tục

Public init bắt đầu W-001 với10STEP chưa phân rã, không gắn DONE/approval giả cho137case. Hồ sơ nghiệm thu cũ là đầu vào để lập gói review kế thừa đúng owner/version khi dùng, không duyệt lại nguyên thiết kế. Tiếp theo review đầu ra B/C của Kidea và gói code/build T02 cụ thể trong [kế hoạch](implementation-plan.md); chưa bắt đầu code/deploy từ việc đọc tài liệu này.
