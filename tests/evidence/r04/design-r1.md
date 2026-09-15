# R04 — bằng chứng triển khai gói thiết kế

## Hiện hành — tích hợp đã kiểm; chờ duyệt bản sửa C1–C5

**Chưa khép R04.** Human đã duyệt K1–K7/AR-r1; review độc lập sau tích hợp phát hiện F01–F05 nên quay gate bước 7 đúng phần sửa, không reset Q/UX/OP/AD. [Gói sửa dễ đọc C1–C5](design-r1/correction-request.md) và [AR-r2 đề xuất](design-r1/architecture-r2-proposed.md) đã được kiểm độc lập nhưng **chưa áp dụng vào pilot, chưa được Human duyệt**. Không biến approval AR-r1 thành approval sửa nghĩa AR-r2.

### Kết quả đã có

- Hướng dẫn M0–M5 đã tích hợp qua skill-creator, giữ public helper/runtime/schema và ranh giới tác vụ. Core **265/265**, tài liệu R04 **15/15**, validator **PASS**; byte nguồn/test và pilot không đổi sau run. [Raw run](design-r1/integration-FCCoGx.json), [stdout đủ 265](design-r1/integration-FCCoGx-core-stdout.json). Bộ R03 giữ **7/8** với giả định đếm `15 !== 10`, không hạ assertion; kiểm cây hiện hành do R04 đảm nhiệm.
- [Review đầu](design-r1/review-initial.md): V1–V5/V8 PASS, V6/V7 FAIL. F01 khóa mã đăng ký thiếu actor; F02 version lịch sử cá nhân chưa đủ; F03 lifecycle còn thiếu; F04 chống lạm dụng chưa khép; F05 thiếu cạnh nguồn trực tiếp. Đây là lỗi/thiếu thiết kế, không phải test ứng dụng thất bại.
- [Recheck đề xuất lần 1](design-r1/review-recheck-1.md): F01–F03 PASS; F04 PARTIAL/F05 FAIL do mapping admission vào M2/M7 và cạnh mới còn thiếu. [Bản kiến trúc lúc đó](design-r1/correction-proposal-initial-architecture.md), [operations lúc đó](design-r1/correction-proposal-initial-operations.md) giữ nguyên; không xóa kết quả chưa đạt.
- [Closure trên đề xuất cuối](design-r1/review-closure.md): **F01–F05 và V1–V8 PASS** trong review hồ sơ hữu hạn. AR SHA `6e91cc904bea0e6f1e521b839d0a6e28bc1f0dd2c518e65e5cb1d4cd48b0bc16`; OP SHA `a86b489d55766771cf2cff71d21b62f3971a8f379a870a0f7552e80664036736`. Chỉ làm rõ M7 tính lỗi kỹ thuật trong mẫu WQ; M2 vẫn lỗi xử lý còn mở, không biến một lần 429 thành incident không khép; queue/socket là bộ đếm nội bộ, không thêm dashboard.
- [Dispatch](design-r1/review-dispatch.json), [biên nhận thời gian và toàn followup](design-r1/review-receipt.json): **một reviewer**, fork none; dispatch thực 16:24:17.417 UTC, closure nhận 16:37:19.243 UTC, trước deadline bảo thủ 16:39:01 UTC. Hai recheck cùng phiên, không thêm phiên hoặc gia hạn. Timestamps đối chiếu event log local của chính task. Agent chỉ đọc theo chỉ dẫn; không gọi đó là cách ly OS.
- [Kiểm đề xuất cuối](design-r1/correction-proposal-check.json): **826 link hợp lệ**, không thiếu backlink đã khai báo; ngoài kiến trúc chỉ append reference. Tại 16:41:00 UTC, pilot vẫn nguyên byte, các input của run tích hợp và bản đề xuất khớp hash; không có thay đổi sau review cần tự nhận lại PASS. Kiểm này không phát hiện mọi cạnh ngữ nghĩa, nên cần review độc lập như trên.
- Kiểm whitespace Git ghi nhận đúng hai Markdown hard-break (hai dấu cách cuối dòng) trong raw `review-closure.md`; giữ nguyên văn reviewer, không sửa để làm sạch raw. Các file khác không có lỗi `git diff --check`; đây không phải test runtime hoặc thay assertion hồi quy.

### Phần còn lại và quyền

Chỉ còn gate C1–C5 → áp đúng bảy đích trong [manifest byte](design-r1/correction-proposal-final.json) → kiểm/readback trên pilot → trình kết quả cuối R04. Chưa cần thêm AI nếu áp đúng byte đã review. Nội dung runtime AR có 22 nhóm ca NOT_RUN; không app/service/backup/monitoring thật, không cài toolchain/VM hoặc phát sinh chi phí. Đầu ra đang chờ là **bản sửa thiết kế**, không một hạng mục bị bỏ quên hay ngầm DONE.

Snapshot Markdown dưới evidence giữ đường tương đối của pilot để xem nội dung, không là cây nguồn điều hướng độc lập. Manifest giữ đầy đủ byte bảy đích để áp sau approval; các nguồn gốc trước sửa đã có trong run tích hợp. Các mục “hiện hành/đang chạy” bên dưới là lịch sử các chặng, phần này là trạng thái mới nhất.

---

## Hiện hành — kiến trúc đã duyệt; tích hợp và kiểm chứng

Human “Duyệt kiến trúc R04” sau `6abd98505ac13064b56f5a070480db48827dc4f1` chấp nhận **K1–K7/AR-r1**, SHA256 `d74ed6937dd616fccc004db890cfa44cfc5c2b835a13bca5986e3913c3551e36`, khép bước 7. Năm gate thiết kế và SEO đầu vào đã đủ; không đồng nghĩa các ca runtime đạt hoặc cấp quyền cài/code/deploy.

Đã tích hợp M0–M5 vào `.agents/skills/kidea/references/product-design.md` và dẫn hướng từ SKILL.md; giữ nguyên public action, runtime/schema. Theo skill-creator, hướng dẫn phân biệt quyết định riêng pilot với phương pháp tái dùng, dùng reference thay làm dài entrypoint, và giữ ranh giới authoring/quyền/gate. Chưa mở kết quả R04 DONE trước kiểm chứng.

Kiểm tự động hoàn tất bằng `tests/r04/evidence.mjs integration`: [run FCCoGx](design-r1/integration-FCCoGx.json), 2026-09-15 16:21:07–16:23:52 UTC. **265/265 core PASS, 15/15 R04 PASS, validator PASS, 777 link hợp lệ**. Bộ R03 **7/8**, giữ đúng lỗi inventory `15 !== 10` đã công khai khi trình AR-r1; không thay assertion hoặc gọi bộ cũ xanh. Điều kiện kiểm nguồn hiện hành do 15 test R04 bảo vệ, bao gồm đúng 10 nguồn + 5 thiết kế và toàn byte đã trình AR-r1. Không phát hiện input thay đổi trong run, toàn pilot nguyên byte.

Vì runner lõi có đường output tương đối thuộc R02, harness chép nguyên byte nguồn vào một root mới bên trong `.test-output/r04/`, rồi chạy runner hiện hữu ở đó; không sửa assertion hay ghi vào output R02 của repo gốc. Mọi file sinh nằm dưới run R04, không dọn/xóa. [Toàn stdout core, byte/base64/hash](design-r1/integration-FCCoGx-core-stdout.json) giữ đủ 265 kết quả, không chỉ tail trong summary; raw stderr/summary/fixtures cũng còn tại run local. Node v24.21.0 đúng bản đã cấp; Python/PyYAML có sẵn, validator skill-creator kiểm cấu trúc chứ không chứng minh hành vi. Hash runtime/validator và nguồn, byte pilot/skill/prompt cùng raw kiểm tài liệu/legacy/validator nằm trong run JSON.

Phiên độc lập theo [prompt](../../r04/prompt-review.md), [dispatch](design-r1/review-dispatch.json) bắt đầu cửa sổ 16:24:01 UTC, deadline 16:39:01 UTC; tối đa 1 phiên ×15 phút, chỉ đọc, fork không truyền kết luận tác giả. R04/core/validator đã qua trước dispatch; failure inventory R03 được giữ riêng như trên. Kết quả và trạng thái cuối được bổ sung khi có bằng chứng. Đây là giới hạn bằng chỉ dẫn/hashes, không sandbox OS.

---

## Hiện hành — quản trị đã duyệt; kiến trúc chờ duyệt

Human “Duyệt thiết kế quản trị R04” sau `ccaeb1d3b1a5e6ebd5fd09016b5ffd52ae72048c` chấp nhận **A1–A6/AD-r1**, SHA256 `0547ea80c04f4c961b18212281b722643301c8c0332832db80de181ca2692775`, khép bước 6. Đây là approval thiết kế gồm audit bền vững, không cấp quyền cài/chạy hay tự mở retry admin.

Đã soạn `D:/Code/kynderis/kidea-workshop-pilot/docs/design/architecture.md`; [snapshot AR-r1](design-r1/architecture-r1.md), SHA256 `d74ed6937dd616fccc004db890cfa44cfc5c2b835a13bca5986e3913c3551e36`. **K1–K7 IN_REVIEW** cho bước 7: một backend C++/SQLite, atomic result/audit/outbox, hợp đồng admin correlation, sửa đồng thời, HTTP/socket/quyền, backup/restore/epoch, observer độc lập, môi trường và tương thích phát hành.

### Bằng chứng chặng kiến trúc

- [Preimage 14 file](design-r1/architecture-pre.json), [postimage 15 file](design-r1/architecture-post.json), [diff append-only](design-r1/architecture-diff.json). Thêm đúng file kiến trúc; chỉ append backlink vào 3 nguồn shared R03 và Q/UX/OP/AD. Nội dung trước đó giữ nguyên sau chuẩn hóa line ending, không tuyên bố tất cả byte nguồn không đổi. Không có code/.kidea/VM/toolchain mới tại pilot.
- [Raw check](design-r1/architecture-check.json): **13/13 test R04 PASS**, **777 liên kết nội bộ hợp lệ**, kiểm đúng 10 nguồn + 5 thiết kế, nguồn đã duyệt trước backlink, truy hai chiều đúng anchor và ca âm. Bộ R03 lịch sử **7/8**, lỗi `15 !== 10` vì giả định cây chỉ có 10 file; raw failure giữ nguyên, không sửa ngoài allowlist hoặc gọi toàn bộ test đều xanh.
- Đối chiếu tài liệu chính thức Drogon, SQLite transaction/WAL/FULL/backup, SvelteKit adapter-node, Caddy proxy/local TLS và OWASP session; link tại AR-r1. Đây là căn cứ lựa chọn khả năng, không compatibility/security/performance test. Version chính xác còn ở R05, host/cert/secret/quyền chạy ở gói môi trường sau.
- Review tác giả: K3 chỉ chống thực thi trùng và đọc đúng kết quả; không tự POST lại hoặc tìm create bằng title, GET không có result vẫn unknown. K4 gửi field thay đổi, lịch một nhóm, cùng field lần được authority xử lý sau thắng; không dùng expectedVersion làm nhánh nghiệp vụ mới hoặc tuyên bố chống mọi lost update. Không đổi R03 source/AC. Nếu Human muốn khóa/từ chối bản cũ hoặc retry tự động thì phải chốt nguồn nghiệp vụ trước code.
- Crash ACK và disaster recovery tách rõ; online backup có verified recovery watermark và miền lỗi độc lập, restore đổi epoch/revoke session/chặn replay. 2 GiB tính cả backup/tạm/log, không SDK; không có quyền tự dọn/xóa. Chưa chứng minh có host độc lập, không yêu cầu VM trên C hoặc bỏ native iOS.
- **18 nhóm AR-T01–AR-T18 NOT_RUN**. Chưa ứng dụng, dịch vụ, màn dự phòng hoặc backup đang chạy. Skill/runtime/schema chưa đổi; chưa chạy lại 265 core/validator của chặng tích hợp; **1 phiên AI ×15 phút chưa dùng** và đợi gate AR cùng tích hợp.

### Chốt kế tiếp

Human chốt K1–K7/AR-r1 để khép bước 7. Sau đó tích hợp hướng dẫn vào skill, chạy hồi quy và phiên review độc lập trong quyền đã cấp, rồi trình kết quả cuối R04. Không xin lại quyền file thường lệ. Snapshot trong repo giữ nguyên byte và đường dẫn tương đối của pilot để đọc từ xa, không phải nguồn thứ hai có cây link độc lập; duyệt liên kết tại pilot gốc. Các mục “hiện hành/chờ duyệt” bên dưới là lịch sử trước approval mới này.

---

## Hiện hành — vận hành đã duyệt; quản trị chờ duyệt

Human “Duyệt thiết kế vận hành R04” sau `86c051ca7968980a25c502e635c5808c8d1eda93` chấp nhận **O1–O6/OP-r1**, khép bước 5. Vai Human chỉ trong phiên thử được xác nhận; kênh dự phòng/ngưỡng là yêu cầu thiết kế, chưa quyền chạy job hoặc cam kết trực nền.

Đã soạn `D:/Code/kynderis/kidea-workshop-pilot/docs/design/admin.md`; [snapshot AD-r1](design-r1/admin-r1.md), SHA256 `0547ea80c04f4c961b18212281b722643301c8c0332832db80de181ca2692775`. **A1–A6 IN_REVIEW** cho bước 6, chưa mở kiến trúc. Nội dung: một nhóm trang admin, tạo nháp/sửa/state tách ý định, xác nhận nhạy cảm, unknown/đồng thời và dấu thao tác an toàn. Không thêm xóa/hủy hộ/điều khiển vận hành.

### Bằng chứng chặng quản trị

- [Preimage 13 file](design-r1/admin-pre.json), [postimage 14 file](design-r1/admin-post.json), [diff](design-r1/admin-diff.json). Thêm đúng admin.md; append reference vào 4 nguồn R03 và 3 hồ sơ Q/UX/OP, giữ nội dung trước đó. Kiểm root/ancestor không link/reparse bất ngờ; không xóa/restore hoặc thêm code tại pilot.
- [Raw check](design-r1/admin-check.json): **12/12 test R04 PASS**, **659 liên kết nội bộ hợp lệ**. Kiểm danh sách 10 nguồn + đúng 4 file thiết kế, nguồn đã duyệt giữ nguyên trước backlink, liên kết hai chiều đúng rule và ca âm. Bộ R03 lịch sử vẫn **7/8**, lỗi tổng file `14 !== 10` giữ nguyên; không dùng nó nhận toàn cây R04 đạt hoặc sửa ngoài allowlist.
- Review tác giả: đối chiếu W-DATA/ACCESS/STATE/EDIT, R-INV/SERIAL, V-PUBLISH và AC-A1–A5. Không biến hộp xác nhận thành khóa dữ liệu/ưu tiên admin. No-op có thể có audit attempt nhưng không event thay đổi nghiệp vụ. Tạm dừng workshop khác dừng workload/server/alert. Admin chỉ thấy N tổng hợp, không danh tính tham gia.
- **A5 là lựa chọn mới cần chốt:** mutation thực phải giữ chắc dấu truy vết hoặc nghĩa vụ phục hồi audit cùng kết quả trước khi báo thành công cuối; lỗi lưu chưa rõ không tự thành thất bại. Không giả cơ chế đã tồn tại. Audit không là payload đầy đủ hoặc API/trang đọc log mới; retention trong vòng đời lab và giới hạn Q5.
- **Ranh giới retry admin còn phải giải quyết ở kiến trúc:** R-RETRY R03 chỉ thuộc đăng ký/hủy. A4 không tự mở retry admin hoặc dùng trùng tên/state hiện tại làm bằng chứng ý định trước đã thành công. Correlation/đối chiếu/đồng thời/API cần hợp đồng cụ thể trước code; nếu đổi nghĩa nghiệp vụ phải quay gate nguồn, không lén bổ sung vào runtime.
- 15 nhóm AD-T01–AD-T15 là **NOT_RUN**, không browser/service test. Skill/runtime/schema chưa đổi, chưa chạy 265 core/validator của chặng tích hợp, chưa dùng 1 phiên AI ×15 phút.

### Chốt kế tiếp

Human chốt A1–A6/AD-r1 để khép bước 6 và mở thiết kế kiến trúc bước 7. Không xin lại quyền file đã cấp; chưa được cài/build/deploy. Các mục “hiện hành/chờ duyệt” bên dưới là lịch sử trước xác nhận mới này.

---

## Hiện hành — UX/SEO đã duyệt; theo dõi vận hành chờ duyệt

Human “Duyệt trải nghiệm và SEO R04” sau `6790a9e143c1338fa9a6a47e30aab69e9662f074` chấp nhận **UX1–UX6/UX-r1**, khép bước 4 và gate thiết kế SEO. Phạm vi không Event markup cho pilot hiện tại được chấp nhận; không bỏ năng lực hướng dẫn structured data cho project phù hợp hoặc mở indexing lab. Không dùng approval này thay bằng chứng browser/device.

Đã soạn `D:/Code/kynderis/kidea-workshop-pilot/docs/design/operations.md`; [snapshot OP-r1](design-r1/operations-r1.md), SHA256 `6414b6ad4680f362ef65c223d7f8a51ffa7883346bb77e2e3a3ad187cdc47b2e`. **O1–O6 IN_REVIEW** cho bước 5: tín hiệu/ngưỡng, kênh dự phòng không phụ thuộc dashboard/AI, vai Human trong phiên thử, gom cảnh báo và giới hạn chỉ đọc. Chưa có hệ thống giám sát, job hoặc kênh cảnh báo được cài/chạy.

### Bằng chứng chặng vận hành

- [Preimage 12 file](design-r1/operations-pre.json), [postimage 13 file](design-r1/operations-post.json), [diff](design-r1/operations-diff.json). Thêm đúng operations.md; chỉ thêm backlink vào 4 file nghiệp vụ, quality.md và experience.md; giữ nguồn đã duyệt/byte snapshots, không xóa/restore. Kiểm root/ancestor/directory không reparse/link bất ngờ.
- [Raw check](design-r1/operations-check.json): **11/11 test R04 PASS**, **551 liên kết nội bộ hợp lệ**. Kiểm đúng tập 10 nguồn + 3 tài liệu thiết kế, nội dung Q/UX không đổi trước phần reference, link/backlink theo source section và ca âm. Bộ R03 giữ **7/8**, đúng lỗi đếm `13 !== 10`, không biến thành PASS. Bộ R04 dùng để kiểm tập nguồn hiện hành; không sửa bộ cũ ngoài allowlist.
- Review tác giả: nguồn M1–M9 có ý nghĩa/đơn vị/nhịp/thiếu dữ liệu/ngưỡng/action; last-processing khác last-observation; cảnh báo không nới Q; pending cũ không phụ thuộc count tăng; sai invariant phải truy authority, không tự repair. Probe đọc không chứng minh ghi/backup/restore. Không có mutation giám sát nền hoặc nút replay/xóa/restart/restore mới.
- Kênh dự phòng là **yêu cầu thiết kế**, chưa lựa chọn công nghệ/host hoặc chứng minh miền lỗi độc lập. O4 là **đề xuất vai trò** trong phiên đã xác nhận, không tự giao Human trực 24/7. Chưa có người/target/kênh thực đã được kiểm thì không nhận phiên vận hành sẵn sàng. Không tạo automation Codex, email/SMS/push/thông báo OS hoặc thêm dịch vụ ngoài app.
- Có 15 nhóm OP-T01–OP-T15 **NOT_RUN** trên sản phẩm. Chưa chạy core 265/validator vì chưa sửa skill/runtime/schema; nghĩa vụ hồi quy cuối vẫn giữ. Quota 1 phiên AI ×15 phút chưa dùng, chỉ chạy khi đủ năm hồ sơ/gate và tích hợp hướng dẫn.

### Chốt kế tiếp

Human chốt O1–O6 của OP-r1 để khép thiết kế bước 5 và mở admin bước 6. Không xin lại quyền tài liệu đã cấp. Quyền cài/chạy/ngắt/restore vẫn thuộc gói thực thi sau; ngưỡng cảnh báo và trách nhiệm chỉ áp dụng trong phạm vi lab đã nêu.

---

Các mục “hiện hành/chờ duyệt” bên dưới giữ lịch sử từng chặng; không phủ nhận các xác nhận mới phía trên.

## Hiện hành — chất lượng đã duyệt, trải nghiệm/SEO chờ duyệt

Human “Duyệt chất lượng R04” sau answer `a24681b9db77e0f8618094e805500d6e6f37b174` chấp nhận **Q1–Q6 của Q-r1**, gồm workload/cách đo và ngoại lệ mất ổ chỉ trong lab. T01-S05/gate bước 3 DONE; không xem là mục tiêu đã đo đạt hoặc quyền diễn tập phá hủy. Các nhãn “đề xuất/chờ duyệt” trong snapshot Q-r1 phía dưới là lịch sử đúng bản đã trình; chỉ thêm backlink, không viết lại mục tiêu đã chốt.

Đã soạn `D:/Code/kynderis/kidea-workshop-pilot/docs/design/experience.md`; [snapshot UX-r1 để đọc từ GitHub](design-r1/experience-r1.md), SHA256 `62f24ffdd808c5e1a3f12f71fc790084d0a0b303870949307cef0f8337a8c9de`. Snapshot giữ link tương đối theo root pilot, không nguồn hiệu lực thứ hai. **UX1–UX6 IN_REVIEW** cho bước 4 và gate thiết kế SEO; chưa mở monitoring/admin chi tiết/kiến trúc hoặc phiên AI độc lập.

### Bằng chứng chặng UX

- [Preimage 11 file](design-r1/experience-pre.json), [postimage 12 file](design-r1/experience-post.json), [diff](design-r1/experience-diff.json). Thêm đúng experience.md, thêm reference vào 8 nguồn R03 và quality.md; các nguồn còn lại nguyên. Không thay nghiệp vụ hoặc Q-r1, không xóa/restore dữ liệu, không thêm `.kidea`/Git/code tại pilot. Kiểm root và directory không có link/reparse bất ngờ.
- [Kiểm nguyên văn](design-r1/experience-check.json): **10/10 test R04 PASS**, **448 liên kết nội bộ hợp lệ**, 0 lỗi link/anchor. Thêm kiểm nguồn chất lượng đúng bản trước backlink và dependency giữa hai tài liệu thiết kế; test đếm danh sách đúng 10 nguồn + 2 file được phép, không giảm assertion thành “ít nhất 10”.
- Bộ R03 cũ vẫn **7/8**, đúng lỗi tổng file `12 !== 10`; giữ nguyên raw failure. Không đổi nó thành PASS, bộ R04 kiểm tập nguồn hiện hành. Nội dung source test/harness đã cập nhật theo chặng mới, evidence chặng quality không bị ghi đè.
- Đối chiếu nguồn R03 về quyền/state/data/retry/registration/view/admin/updates và Q-r1. Review do tác giả: đường đăng ký/hủy/unknown/reload/đổi actor không tự tạo ý định; cache không nhận chỗ; public metadata/HTML không trộn dữ liệu riêng; native vẫn hai màn hình; xác nhận hủy chỉ thêm UX không đổi quyền; bố cục admin/ops chưa thay gate bước 5–6.
- SEO đối chiếu nguồn Google chính thức trong UX-r1: noindex cần crawler đọc được, không là bảo vệ dữ liệu; canonical không bảo đảm index; không tự bịa địa điểm/thuộc tính cho Event rich results. UX5 đề xuất không dùng Event markup trên pilot hiện tại, **chưa là N/A được duyệt** cho structured data; D3 N/A kết quả tìm kiếm thật đã được duyệt trước đó giữ nguyên. Không mở lab/public/submit URL.
- 15 nhóm UX-T01–UX-T15 là **test specification NOT_RUN**, không browser/native test thực tế. Chưa chạy 265 test lõi/validator vì skill/runtime/schema chưa đổi; chưa dùng 1 phiên AI ×15 phút, giữ tới đúng điều kiện cuối.

### Điều cần Human chốt

UX1 sáu nhóm web/hai màn native; UX2 kết quả lịch sử khác trạng thái hiện tại và unknown giữ mã; UX3 xác nhận hủy nhưng không thêm xác nhận đăng ký; UX4 route ID ổn định và HTML public đọc trước JS; UX5 SEO lab/metadata/canonical và không Event markup khi thiếu dữ kiện; UX6 nội dung tiếng Việt/timezone/bàn phím/focus/layout kiểm được. Duyệt UX1–UX6 chốt **đầu ra bước 4 và thiết kế SEO**, không kiến trúc hoặc phát hành. Sau đó mở bước 5 monitoring theo quyền đã cấp.

---

Phần dưới giữ báo cáo chặng chất lượng tại thời điểm trình, không phủ nhận approval hiện hành phía trên.

## Chặng chất lượng Q-r1 — chờ duyệt đầu ra bước 3

Human “Duyệt gói R04” sau `7ef7f1b5a91deed4cd100c275b9fde45e66d320d` cấp D1–D6/P1–P3 đúng [gói](../../../proposals/r04-design-batch-r1.md). Đã soạn chất lượng; chưa mở UX/SEO/ops/admin/kiến trúc, chưa tích hợp skill hoặc chạy AI. Quota kiểm độc lập còn nguyên 1 phiên ×15 phút, chỉ dùng khi đủ gate.

Nguồn sản phẩm: `D:/Code/kynderis/kidea-workshop-pilot/docs/design/quality.md`. [Bản đọc đúng byte](design-r1/quality-r1.md) là snapshot bằng chứng, không nguồn có hiệu lực thứ hai; link tương đối trong snapshot giữ nguyên theo root pilot, không dùng như navigation trong repo Kidea. Hash nguồn Q-r1: `55733ba73437e3c26f14009efd1f4f06f9c4100a0559ed7be8c8640b5883996b`.

### Đã làm và kiểm

- Preflight đọc root D, các ancestor và toàn cây pilot: không link/reparse bất ngờ, chỉ 10 file nguồn trước ghi, chưa có design/Git/.kidea/code.
- [Preimage](design-r1/quality-pre.json) giữ bytes/hash/base64 cả 10 file; [postimage](design-r1/quality-post.json) giữ 11 file; [diff](design-r1/quality-diff.json) ghi đúng phần thêm. Thêm một quality.md, thêm backlink vào 7 file nguồn. Không sửa nghĩa rule/flow/AC/test R03; một số newline được apply_patch chuẩn hóa, không tuyên bố edited files giữ hash cũ.
- [Kết quả kiểm nguyên văn](design-r1/quality-check.json): **8/8 test R04 PASS**, **345 link nội bộ hợp lệ**, 0 lỗi link/anchor. Test kiểm giữ đủ 10 nguồn + đúng một file mới, phần nội dung nguồn không đổi, liên kết hai chiều theo section, ca âm thiếu backlink/sai rule/broken link/duplicate anchor.
- Bộ R03 nguyên bản chạy lại **7/8 PASS**: ca `real pilot has ten linked documents` FAIL vì tổng nay là **11**, không còn 10. Không sửa test lịch sử ngoài allowlist, không giấu failure hoặc nhận 8/8. Bộ R04 thay điều kiện đếm cố định bằng đúng tập 10 nguồn cũ + file quality mới và vẫn kiểm toàn bộ link/backlink. Đây là kiểm hiện hành cho chặng này; bộ R03 không dùng nguyên trạng để nhận toàn cây R04 đạt.
- Chưa chạy 265 test lõi vì runtime/skill/schema không đổi; hồi quy sau tích hợp vẫn bắt buộc. Không có test ứng dụng/tải/phục hồi/native thực tế trong lượt này.

### Review nội dung của người soạn — không phải kiểm độc lập

Đã đọc cả 10 nguồn R03, đối chiếu miền dữ liệu/quyền/đăng ký/retry/concurrency/event/retention. Q1–Q6 là mục tiêu đề xuất, không dựa vào benchmark có sẵn: tải nhỏ có lịch phát/cửa sổ/lỗi/môi trường; latency tách client và backend; cập nhật tách commit/view; crash khác mất ổ; dữ liệu giả/quyền server giữ nguyên; web/native và SEO không bị bỏ.

**Điểm mới nhạy cảm Q4:** đề xuất ngoại lệ thảm họa mất ổ cho lab cho phép mất tối đa 15 phút dữ liệu sau recovery point, phục hồi trong 60 phút; phải được Human duyệt, không áp cho crash thường và không thay rule R03 bằng backlink. Backup độc lập/đích/quyền chưa có, nên khả năng đạt chưa chứng minh. Nếu không chấp nhận ngoại lệ, phải sửa Q4 trước kiến trúc.

Đề xuất ngân sách 2 GiB là dữ liệu/log/backup, **không bao gồm SDK/toolchain**; chưa hứa đủ dung lượng build. Các thời gian 1/2/3/5 giây và 5/60 phút đều là mục tiêu lab đề xuất, không số đo. QT01–QT16 là 16 nhóm ca đặc tả NOT_RUN, không 16 test sản phẩm đã PASS.

### Gate kế tiếp

Human chốt Q1–Q6 của Q-r1 để khép bước 3 rồi soạn trải nghiệm/SEO. Chưa cần thêm quyền file, cài đặt hoặc phiên AI; các quyền đã được cấp không thay approval đầu ra. Nếu đổi Q-r1, giữ snapshot này và tạo revision/evidence mới, không ghi đè bằng chứng.
