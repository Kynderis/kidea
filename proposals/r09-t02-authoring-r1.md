# R09-T02 — gói viết backend và bộ kiểm r1

**APPROVED** — Human “Tôi duyệt” cho gói tại `cdd6ee5`. Chuẩn bị sau Human “Ok làm đi” tiếp nối kết quả A–E tại `60d0a33`. Lượt này được giao review B/C và chuẩn bị gói T02; chưa được hiểu thành nghiệm thu B/C hoặc quyền build ứng dụng.

## Quyết định đề nghị, gộp một lần

1. Chấp nhận đầu ra B/C tại `60d0a33` trong [phạm vi đã review](../docs/R09_BC_TECHNICAL_REVIEW.md): helper và chuẩn bị pilot, không nghiệm thu ứng dụng hoặc R09.
2. Cho viết nguồn backend, hợp đồng API, test và harness T02 tại `/Users/kendrick/Desktop/kidea-workshop-pilot`, theo allowlist dưới đây. Cho kiểm tĩnh bằng công cụ đã có và commit Git local `master`; không remote/push pilot. Không cần duyệt lại tên hàm/tách file thường lệ bên trong allowlist.

**Gói này đủ để bắt đầu viết nguồn, chưa cấp chạy build/container.** Sau khi nguồn có thật, AI phải tự hoàn thiện và kiểm tĩnh gói build với exact source commit/hash, script có thật, image/toolchain/dependency, quota và cleanup trước trình quyền chạy. Không yêu cầu Human duyệt source hash giả hoặc lệnh chưa tồn tại. Build là gate sau, không là việc bị quên trong T02.

## Đầu vào và hành vi giữ nguyên

Pilot local `master` tại `8ce0af4b3262fe3b2bd14a1b4b653a46e95b059b`, project `36ea2fe5-f510-4003-ba02-199f7a723322`. Đọc và kế thừa 21 tài liệu R03–R05 qua `docs/kidea-handoff.md`; 23 tài liệu hiện hành, 137 source ID chưa kiểm ứng dụng. Không sao chép sample thành sản phẩm đã hoàn tất.

Backend C++20/Drogon, SQLite C API; một writer hữu hạn, WAL/FULL/foreign keys kiểm giá trị thực. Trong cùng transaction: domain + request_result + admin_audit khi áp dụng + outbox. Actor/quyền từ phiên giả server, không tin body. Auth/cú pháp/quyền trước lịch sử và thứ tự R-NEW; retry giữ kết quả lịch sử và UNKNOWN, không hồi sinh đăng ký. IDs chuỗi, version uint64 trên wire là chuỗi; JSON strict, Unicode và plain-text theo profile đã duyệt. K3/K4 giữ đúng ý định admin và patch trường/lịch.

MVP ban đầu **chưa giới hạn 2 ACTIVE toàn workshop, chưa cho hủy PAUSED**: D đã duyệt nhưng áp tại T04/T09. Không thay expected R07/I08/C04 sớm. Cấm xóa lịch sử hoặc thêm TTL để làm test đơn giản. Dữ liệu seed giả U/V/A/G và workshop C10; race dùng C1/C10,N9; không dữ liệu/credential thật.

## Allowlist và đầu ra

| Đích trong pilot | Nội dung được viết |
|---|---|
| `backend/CMakeLists.txt`, `backend/CMakePresets.json` | Targets và dev/asan-ubsan/tsan/release, warnings project là lỗi; không fetch dependency ngầm |
| `backend/src/`, `backend/include/` | Domain/validation, auth/session, SQLite repository/transaction, result/outbox/audit, HTTP adapters và lifecycle/admission; một backend, không service mới |
| `backend/schema/` | DDL/index/schema version; unique ACTIVE, request namespaces/epoch, constraint; không chạy migration lên dữ liệu cũ |
| `backend/tests/` | Oracle, transaction concurrency, error/fault hooks chỉ test, API/privacy/serialization; không hook bật mặc định trong bản ứng dụng |
| `contracts/` | OpenAPI, typed request/result/error mapping, versioned fixtures; routes đúng architecture/api, không endpoint quản trị tài khoản/audit mới |
| `tests/t02/` | Ma trận ID→variant→oracle→test, seed, report schema, kiểm completeness và trường hợp chưa hỗ trợ; giữ NOT_RUN cho test chưa chạy |
| `scripts/t02/` | Entrypoint kiểm tĩnh, collector/hash/preflight/build/G2/cleanup; được viết và kiểm cú pháp, chưa chạy build/G2/container |
| `containers/t02/` | Cấu hình Docker và mount/user/network hữu hạn; không Docker build/pull/run trong gói viết nguồn |
| `docs/t02/` | Kế hoạch theo nguồn, review kế thừa, thiết kế code, review test, dependency/license/source closure và gói build hoàn chỉnh |
| `docs/kidea-handoff.md`, `docs/implementation-plan.md` | Cập nhật quyền mới/điểm tiếp tục và liên kết gói cụ thể; không đổi nội dung 21 nguồn đã chốt |
| `.gitignore` | Chỉ thêm output tạm/build của T02; không bỏ theo dõi nguồn hoặc bằng chứng |
| `.kidea/` | Chỉ public Kidea API cho review/phân rã/checkpoint trong scope thật; không viết tay JSON, không giả Human approval/DONE |

Trong repo Kidea chỉ cập nhật tài liệu review/roadmap/handoff/answer và evidence `tests/evidence/r09/t02-*`; commit/push theo quyền hiện hành. Nếu phát hiện thiếu helper: lưu tái hiện và đề xuất phần sửa, không tự mở refactor ngoài gói.

## Ma trận đầu ra bắt buộc trước đề nghị build

| Nhóm | Nguồn/oracle và cách kiểm cần được viết |
|---|---|
| Quyền/đọc/state | P01–P08, đủ actor/audience, 9 ô state, DRAFT generic error, lịch sử chính chủ, thời gian không tự đổi state |
| Đăng ký/hủy | R01–R08, ưu tiên PAUSED/duplicate/full, hủy đúng ID, cancel/rebook không hủy nhầm B; DB/count/result/outbox trước–sau |
| Idempotency | I01–I10; biến thể payload, hai actor cùng literal ID, quyền thu hồi, mất phản hồi, FULL cũ sau có chỗ, commit chưa chắc; không dùng exit0 làm oracle |
| Đồng thời | C01–C05 mỗi lịch cả hai thứ tự; barrier có chủ đích và race thực, không chỉ chạy tuần tự rồi gọi là concurrency; TSan riêng không thay oracle |
| Miền/admin | D01–D09, mọi giá trị biên/UTF-8/grammar/lịch, K3/K4, kết quả và audit nguyên khối; cập nhật trường khác không đè giá trị cũ |
| Transaction/transport | TC02/04/06/08/09/18 và các AR/CPP liên quan: fault trước/sau commit/response, SQLite mã lỗi/rollback, queue hữu hạn, JSON duplicate/unknown field, body/CSRF/session/private data |
| Toàn nguồn | Gắn mọi 137 source ID với nghĩa vụ/phase và trạng thái thật; test T02 chỉ nhận phần backend đã triển khai. Socket/UI/observer/backup độc lập và ngưỡng WQ còn về các lát sau, không N/A hoặc PASS thay |

Collector giữ từng variant, source/seed/oracle/tool/config/runID, stdout/stderr/timeout và hash; báo thiếu/skip/fail rõ. Test negative phải bắt invariant bị phá; không chỉnh kỳ vọng để xanh. Nhóm biên phát sinh từ code phải thêm test tương ứng và G2 bản cuối khi có quyền chạy.

## Kiểm được làm trong gói này

Đọc/so sánh source và manifest; kiểm JSON/đường dẫn/mapping/hash, `node --check` cho script mới bằng Node24 đã có; `git diff --check`; kiểm source không gọi tải/install/build ngầm. Đây là kiểm tĩnh, không tuyên bố C++ compile hoặc test nghiệp vụ PASS. Không chạy CMake/configure, binary ứng dụng, container hay script thực thi chưa được review. Nếu cần công cụ mới thì trình phần thiếu, không tự cài.

Giới hạn authoring: không tải, không cloud/AI trial, không port, không cài hệ thống; nguồn và evidence mới tối đa100 MiB, vượt thì dừng báo. Giữ nguyên `samples/`, cache và mọi bằng chứng cũ. Không prune, không xóa DB, không reset Git. Không dùng CPU/RAM/deadline/waiver R08 như quyền mới.

Image Linux amd64 `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92` còn local (đọc metadata, size1,784,463,073 bytes). Đây là **ứng viên**, chưa chứng minh chứa đủ dependency cho nguồn mới. Trước build cần xác minh closure/phiên bản/license và advisory trong phạm vi thực; không lấy image còn trên máy làm chứng nhận an toàn hoặc xin lại ngoại lệ R08-TIDY-01 nguyên xi.

## Điểm dừng và điều kiện hoàn tất gói

Kết thúc bằng source/test/harness commit local, ma trận coverage chưa chạy, kiểm tĩnh có bằng chứng và gói build có lệnh/source/image/limits thực để Human review. Nếu nguồn mâu thuẫn, cần thư viện mới, đổi policy/schema/quyền hoặc không thể tạo manifest có căn cứ: trình đúng phần đó cùng lựa chọn. Không gọi T02 DONE trước build/test và gate đầu ra; không mở T03, T08, R10 hoặc view/native đã hoãn.
