# R05 — Đồng bộ backend/Web và gói review kết quả

Ngày 2026-09-17. Nguồn đầu lượt `19548a40b13f1e91b8b39e91b11d7711a93e5dbf`, `master`, remote `git@github.com:Kynderis/kidea.git`, working tree sạch. Human đã quyết định client chỉ Web và giao đồng bộ thiết kế/skill/pilot/ma trận kiểm. Đây là kết quả thực hiện quyết định đó, không xin lại phạm vi và không tự nghiệm thu R05.

## Phần đã đồng bộ

- Thiết kế, KA-23/KA-28, ma trận môi trường, cây project và hướng dẫn coding hiện hành dùng backend/Web. Native chuyển Future chưa roadmap; giữ sáu task và nội dung lịch sử. Không đổi sáu hành động, schema/helper, Node≥24, local-only hoặc nghĩa vụ host Windows/Mac Intel/Apple Silicon.
- Skill có [phương pháp bước 8](../../../.agents/skills/kidea/references/coding-testing.md): rule/revision/ngoại lệ, setup–oracle–evidence, biến thể, provenance, kiểm mẫu đúng/sai và Human gate. Responsive do project chọn, không áp breakpoint/minOS chung.
- Pilot local `kidea-workshop-pilot/docs/`: sửa13/21file, giữ nguyên byte8file. Cả40rule giữ nguyên hàng đúng/sai/oracle:24COMMON/CPP/WEB áp dụng hiện hành,16AND/IOS Future. Giữ137sourceID, bảng trace NOT_RUN và20nhóm TC. Hoãn riêng A/I trong14nhóm; không xóa ca mixed hoặc đổi ứng dụng chưa chạy thành PASS.
- Giữ yêu cầu responsive pilot360/1280CSSpx/chữ200%, Web lifecycle, authority, UNKNOWN, actor/epoch, cookie/CSRF/TLS, uint64, release và restore. Các con số QC/QR/QF/QD/WQ và workload không hạ.

[Manifest amendment](web-scope-r1/manifest.json) ghi21hash trước/sau,40rule,20nhóm và137case. [Trước](web-scope-r1/before/docs/features.md) khớp toàn bộ21hash amendmentSDK37; [sau](web-scope-r1/after/docs/features.md) khớp live pilot. Profile hiệu lực là `workshop-rules-web-r2`, revision2; snapshot engineering C++/Web r1 vẫn giữ nội dung và provenance, đọc dưới scope r2. Đây không phải kho cấu hình chạy thứ hai.

| Case mixed | Nghĩa vụ còn áp dụng | Phần hoãn |
|---|---|---|
| T04, AR-T01 | Hợp đồng/backend/Web; JS-off/SSR và authority | Chạy cùng vector qua Android/iOS |
| UX-T02/03/10/13 | Loading/empty/error, action, navigation, keyboard/focus, responsive Web | N1/N2, cỡ chữ và navigation app native |
| AR-T11 | HTTP/SSR/socket, revoke/CSRF, không lộ token | Transport/storage native |
| QT13/QT14 |100local actions p95≤100ms;30process-cold Web p95≤3s, đúng protocol | Lần đo riêng từng app native |
| TC-18/19/20 | C++ sanitizer; Web UI/lifecycle/actor change/callback cũ | Native diagnostics/rotation/device traces |

## Kiểm mới và bảo toàn

[Lượt cuối](web-scope-r1/check-3/summary.json) và [nguồn/môi trường](web-scope-r1/check-3/start.json) ghi đầu vào thực. Host macOS14.7 build23H124, Intel x64, uid501; dùng Node24.19.0 có sẵn bằng đường tuyệt đối, không đổi Node22 mặc định/PATH máy. Root local đã được kiểm ở LP-01, realpath được ghi lại; không cài dependency/toolchain hoặc chạy Docker/cloud/AI/benchmark/native.

- Bộ amendment:14/14PASS, gồm source/oracle preservation, thiếu/đổi case, falsePASS, sai biến thể, link/anchor và CREATE-only từ chối thư mục/symlink đã tồn tại.998link nội bộ pilot hợp lệ.
- Bên trong lượt đó: toàn bộ11test R05r1 nguyên byte chạy PASS trong layout thư mục sạch với snapshot r1. Validator cũ không chạy lên hồ sơ mới rồi sửa expected để xanh.
- Chuyển trọn skill và dependency đã khóa sang thư mục sạch; helper status đọc fixture hợp lệ, không ghi nguồn hoặc tự nhận authority. Đây là kiểm chuyển bộ hướng dẫn/helper và phục hồi docs; **không phải build ứng dụng mới trong Docker sạch**.
- Toàn bộ core:283/283PASS trên Mac Intel, không fail/skip/cancel/todo, nguồn trước–sau không đổi; [summary](web-scope-r1/check-3/core-local/summary.json), [raw](web-scope-r1/check-3/core-local/stdout.txt).
-2.245file test/evidence R05 lịch sử khớp hash; không sửa các FAIL/Windows/native trước đây. [Danh mục hash](web-scope-r1/historical-hashes.json).

Giữ hai lỗi thực trong harness mới: [check-1](web-scope-r1/check-1/scope.stdout.log) có12PASS/1FAIL vì biến môi trường Node test cha làm runner con không trả báo cáo; đã tách context và buộc TAP, không bỏ11test con. [Check-2](web-scope-r1/check-2/collector-failure.json) có14PASS nhưng collector dừng EEXIST vì tên receipt trùng artifact review; CREATE-only đã bảo vệ file, core chưa chạy. Đã tách hậu tố `.receipt.json`; check-3 kiểm lại toàn bộ trên nguồn cuối. Không tính hai lượt này là PASS toàn gói.

Kiểm cuối2620link trong58file Markdown không có lỗi;83task ID giữ nguyên,6Future. `git diff --cached --check` phát hiện đúng hai dòng trắng có khoảng trắng trong stdout FAIL check-1 (dòng29/31 do Node tạo); giữ nguyên raw log, không làm sạch bằng chứng. Kiểm whitespace phần còn lại đạt khi loại riêng file raw này; không có ngoại lệ cho source hoặc tài liệu.

## Review bằng chứng backend/Web — không chạy lại workload

[Review mới](web-scope-r1/check-3/evidence-review.json) xác minh78file mẫu backend và27file mẫu Web live khớp manifest cũ, exit/count/skip của các lượt cuối, provenance r4/r5, sáu mutant backend và quota receipt. Có22nhóm vector lab đã đạt đúng phạm vi. Các kết quả sau là **thực thi lịch sử được review**, không phải số test ứng dụng chạy mới trong lượt amendment:

| Nghĩa vụ R05 | Bằng chứng và giới hạn |
|---|---|
| COMMON-01/04/05/07 | Backend r5 transaction/authority/UNKNOWN/uint64, HTTPS38, upstream15, Chromium8 hai lần; dữ liệu/phiên giả, không toàn ứng dụng |
| COMMON-02/03/06 | Revision/hash, kiểm âm nguồn/falsePASS, review ngoại lệ và giữ rawFAIL; không tự trao approval |
| COMMON-08 | Hợp đồng đa thành phần/restore và đặc tả ca lỗi còn giữ; chưa thực thi release/restore toàn pilot, thuộc R08/R09 |
| CPP-01…06/08 | Bốn preset dev/ASan+UBSan/TSan/release, mỗi12ca; sáu mutant; JSON/Unicode/SQL/writer/limits và lỗi có kiểm; finite vectors, không mọi parser/workload |
| CPP-07 | Backend/edge idle/active/stuck drain đã kiểm; backup đích độc lập/mất host/restore và workload đầy đủ vẫn chưa chạy |
| WEB-01…08 | Web r2 check/lint/build,32unit/18browser/4server; hai mutant dữ liệu mới,8mutant r1 giữ đúng nguồn. Backend r4/r5 bổ sung HTTPS/CSRF/cookie/proxy/revoke/SSR và drain. Chromium/reflow đã kiểm không chứng nhận mọi browser/thiết bị |
| R05-T06/T07 | Đủ đặc tả137case/20nhóm, hai profile hiện hành, mang docs/skill sang folder sạch và hồi quy; Human nghiệm thu riêng |

Xem [backend r5](backend-execution-r5.md), [Web r2](web-execution-r2.md) và [Web r1](web-execution-r1.md). Việc giữ mẫu đúng/sai đã chạy và nguồn không đổi đáp ứng review khả thi R05; không lấy docs-only thay các build đó. Mọi137case ứng dụng vẫn NOT_RUN trong trace, không cộng thành137PASS từ22nhóm lab. Performance/cloud, host-loss/restore, release ứng dụng, browser/thiết bị còn lại giữ ở gate tương ứng; không xin cài Xcode hoặc chạy native để giải quyết chúng.

**Ngoại lệ R05-TIDY-01:** chỉ hỗ trợ kết quả lịch sử profile r1 với SQLite3.53.4/clang-tidy18.1.3 tại đúng invocation, hết hạn khi khép R05 hoặc2026-10-16. Amendment r2 không gia hạn hoặc cấp lại ngoại lệ. Khi R05 được nghiệm thu, kết quả lịch sử vẫn có provenance; không dùng waiver đã hết để build tiếp/ràng buộc production. Nếu sample/product sau cần lại suppression, phải review đúng profile/nguồn/phạm vi mới. Không cần duyệt lại để đọc evidence cũ.

## Khôi phục và điểm tiếp tục

Khi chuyển máy, dùng snapshot `after/` của amendment thay cho việc coi bảnSDK37 cũ là hiện hành. Chỉ phục hồi vào đích local **chưa tồn tại** được phép; `restoreCreateOnly(target)` trong [web-scope.mjs](../../r05/web-scope.mjs) kiểm manifest trước/sau và từ chối overwrite. Có thể gọi bằng Node≥24 từ repo sau khi chọn đích; không chạy collector lịch sử. Pilot source/build samples là gói riêng, snapshot21docs không tự phục hồi toàn bộ môi trường ứng dụng.

**R05-T07-S02: phần tích hợp/kiểm đã hoàn tất, IN_REVIEW chờ Human nghiệm thu backend/Web đúng giới hạn trên.** Không tự đánh dấu R05 DONE hoặc mở R06. Sau Human nghiệm thu mới chuẩn bị gói R06 bản đồ/impact/change; native Future chưa roadmap, LP-01 Apple Silicon NOT_RUN. Không thay quota/deadline, không xóa SDK/AVD/cache/volume hay chạy dịch vụ nền.
