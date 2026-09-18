# T02 backend — nguồn để review, chưa compile hoặc chạy

Quyền tại [authority](authority.md), nguồn nghiệp vụ/thiết kế qua [handoff](../kidea-handoff.md). Đây là đầu ra authoring, không bảng tiến độ thay `.kidea/work.md`. 137 case vẫn NOT_RUN; B/C đã nghiệm thu không làm backend đạt.

## Cấu trúc và quyết định triển khai

- `backend/src/model.cpp`: JSON strict, UTF-8/code point, plain-text bằng cmark đã giữ cờ reference-definition từ R05; lịch RFC3339 với offset và precision phần lẻ giữ nguyên. Không chuẩn hóa Unicode ngầm. Title/description trim whitespace Unicode theo tập tường minh trong code; test Unicode vẫn chưa chạy.
- `store.cpp` và `schema/001.sql`: một transaction bao domain/result/admin-audit/outbox; SQLite C API bind tham số; owned strings sống tới finalize, không dùng SQLITE_TRANSIENT hay xin lại waiver cũ. WAL/FULL/foreign_keys/schema/integrity kiểm khi mở; không auto migration/restore. Result namespace registration theo actor/epoch, admin theo intent/epoch và owner đối chiếu; history giữ nguyên. Từ chối nghiệp vụ/no-op có result, không domain event. Audit giữ revision thay toàn văn title/description và trước/sau C/state/lịch, thời điểm; không endpoint đọc audit.
- `executor.cpp`: worker sở hữu connection, SQL không chạy trên event loop; queue hữu hạn, writer pending≤64, tổng queue≤128; drain30s. `admission.hpp` dùng steady clock, global100/s burst200 và actor/guest20/s burst40; token/role/header không làm identity.
- `main.cpp`: HTTP nội bộ chỉ mở bằng **`--serve-component-fixture`**. Không chế độ PROD hoặc claim release write-ready. Cookie/session fake từ seed server, CSRF/Origin; snapshot private/no-store. WSS/outbox publisher/ops/backup/observer/HTTPS/Web thuộc các lát T03/T05/T08, chưa được dựng giả để mở release gate. Durable outbox chưa là chứng minh delivery.
- `contracts/openapi.json`: wire contract hiện có và endpoint còn ở lát sau. RFC3339 không nhận leap-second/offset unknown `-00:00` trong parser hiện tại; những trường hợp ngoài vector R03/R05 phải được review trước khi tuyên bố coverage đầy đủ, không tự coi là thay đổi rule nguồn.

Đầu ra được viết tuần tự: miền/JSON → schema/transaction → transport/admission → oracle/test → harness/manifest. Mỗi phần lấy nguồn tại business/tests và architecture storage/api/admission, có dependency trực tiếp lên lớp trước. Review C++/transport và kiểm chạy còn cần ở gói build; không lấy kiểm JSON/link thay các gate này.

## Kiểm đã viết và giới hạn

`backend/tests/tests.cpp` có40 nhóm P/R/I/C/D, thêm SQLFAIL/TX/CRASH/JSON/K3K4/ADMISSION. Mỗi nhóm chạy nhiều assertion/biến thể, xuất JSONL. Có DB oracle đọc trực tiếp, cả hai lịch C01–05 và barrier tranh writer, fork crash trước/sau commit, fault transaction, SQLite prepare/step/commit lỗi, rollback chưa rõ, result không hồi sinh đăng ký, queue/drain, clock/rate. Hook chỉ trong `workshop_test_core`; binary server link core không có macro test.

`backend/tests/http.mjs` chạy server thật trong cùng container, fake session hết hạn sau300s, HTTP/privacy/CSRF/origin/duplicate JSON và đối chiếu lịch sử. Đây là HTTP nội bộ, không là chứng nhận HTTPS/browser/QA. Chưa có fault VFS để chứng minh mọi lỗi I/O vật lý, power-loss/storage-loss; rollback injection không phải mất điện thật. Lifecycle/outbox delivery và telemetry đầy đủ vẫn có nghĩa vụ riêng. Bộ test mới chưa compile, chưa đủ căn cứ tuyên bố mọi biến thể hoặc nhóm TC được khép.

`tests/t02/coverage.json` giữ137ID, row/section expected nguyên từ nguồn và hash;40 nhóm backend được trỏ tới test mới,97 nhóm còn lại giữ nơi tiếp tục. AR/TC giao cắt vẫn phải rà biến thể theo nguồn, không cộng40nhóm thành137PASS. `g2.mjs` từ chối thiếu evidence/source/variant review cho bất kỳID nào; nó kiểm report, không tự chứng minh kết quả report đúng.

## Dependency và build

`containers/t02/vendor-lock.json` khóa824file Drogon1.9.13/Trantor đi kèm, cmark0.31.2 có patch reference-definition và SQLite3.53.4 từ sample đã kiểm. Đối chiếu lại khớp closure R08; không copy sample application, không sửa vendor. License giữ tại vendor (Drogon MIT, Trantor BSD, cmark BSD, SQLite public-domain dedication trong source). Khi đóng bundle phải mang license tương ứng. Khớp hash không là review advisory mới hoặc chứng nhận không có lỗ hổng.

Image Ubuntu/linux-amd64 được pin trong manifest; metadata hiện có không thay xác minh package/tool version khi build. CMake không FetchContent/download, dependencies mount read-only. Gói build networknone, không port host; không Caddy/TLS/system trust/công cụ macOS mới.

Lệnh kiểm tĩnh: `node scripts/t02/static-check.mjs`, `node --check` từng script, formatter có sẵn, `git diff --check`. Chưa chạy CMake/configure/compiler/CTest/HTTP test/build.sh/run.mjs/G2. Các lệnh build cụ thể và quyền cần duyệt ở [gói build](build-proposal.md); manifest sẽ ghim commit nguồn thực sau kiểm tĩnh, không điền hash sample thay source ứng dụng.
