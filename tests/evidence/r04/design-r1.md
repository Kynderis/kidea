# R04 — bằng chứng triển khai gói thiết kế

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
