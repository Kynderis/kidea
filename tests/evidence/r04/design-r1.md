# R04 — bằng chứng triển khai gói thiết kế

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
