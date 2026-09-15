# R04 — bằng chứng triển khai gói thiết kế

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
