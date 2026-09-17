# R07 r1 — kết quả triển khai Chrome và khoảng trống pilot

Ngày2026-09-17. **IMPLEMENTED / R07 IN_PROGRESS, chưa nghiệm thu.** D1–D5 được Human duyệt sau gói tại `4605f994f927bb17ec6e30cbbd728a1c2961ad09`; [Chrome-only](../../../docs/R07_CHROME_SCOPE.md) thay Safari trong ma trận. Mã kiểm là working tree trên commit đó, nhận diện từng SHA256 trong [manifest cuối](implementation-r1/final-2026-09-17T05-53-02-534Z/summary.json), được commit cùng báo cáo; không nhận base commit là đã chứa mã mới.

## Đầu ra thực

- `visualize` đã nối vào CLI và skill, chỉ xuất `.kidea/views/progress.html` bằng request có quyền đọc/ghi view/xuất metadata rõ ràng; schema2 không đổi.
- HTML tự chứa: cây tiến độ/gate/blocker/review, target và từng release/revision/lần triển khai, ba góc nhìn map và lọc trách nhiệm hai chiều. Không suy DONE từ chưa phân rã, không coi kết quả một thành phần là toàn release hoặc sức khỏe live.
- Chỉ nhúng các trường đã chọn, không nhúng nguyên văn Markdown/config hoặc cấu hình extractor. CSP/escaping, giới hạn nguồn/output, từ chối pending/conflict/nguồn đổi, symlink và file đích lạ. Thay view có kiểm trước/sau; lỗi khôi phục bản cũ khi an toàn, giữ bản phục hồi và báo reconciliation nếu đích bị người khác sửa.
- [Mẫu HTML đối chứng](implementation-r1/final-2026-09-17T05-53-02-534Z/r07-payload/V01-V04-source-projection/.kidea/views/progress.html) là hồ sơ giả, không phải tiến độ ứng dụng pilot.

## Kiểm trên nguồn cuối

Môi trường: macOS14.7 build23H124, Intel x64, uid501, Node24.19.0, Chrome153.0.8010.47. [Preflight/nguồn/quota](implementation-r1/final-2026-09-17T05-53-02-534Z/start.json); [các lệnh và thời gian](implementation-r1/final-2026-09-17T05-53-02-534Z/commands.json).

| Phần | Kết quả thực |
|---|---|
| Core | 283/283 PASS,0fail/skip/cancel/todo;106,6giây cả runner; [raw](implementation-r1/final-2026-09-17T05-53-02-534Z/core.stdout) |
| R06 | 19nhóm chức năng+source-freeze PASS,5nhóm lỗi âm PASS; [chính](implementation-r1/final-2026-09-17T05-53-02-534Z/r06-payload/summary.json), [biên](implementation-r1/final-2026-09-17T05-53-02-534Z/r06-boundaries-payload/summary.json) |
| R07 helper/CLI | 19nhóm PASS, gồm nguồn thiếu/cũ/thay đổi, pending/conflict, hai revision/lần retry, plan riêng, map unknown/stale, quyền/escaping, lỗi ghi và can thiệp vào đích; [kết quả](implementation-r1/final-2026-09-17T05-53-02-534Z/r07-payload/summary.json) |
| Chrome | 8tổ hợp S/M×hẹp/rộng×zoom100/200%, cộng standalone/escaping/offline PASS;0HTTP request,0page error. [DOM/thao tác/số đo](implementation-r1/final-2026-09-17T05-53-02-534Z/r07-payload/chrome/summary.json) |
| Pilot | 21file giữ nguyên hash; thiếu `.kidea/INDEX.md`, helper từ chối đúng và không tạo trạng thái. **Render/đo pilot thật NOT_RUN**; [bằng chứng](implementation-r1/final-2026-09-17T05-53-02-534Z/pilot.json) |

Nguồn toàn lượt68file khớp trước/sau, cùng kiểm input riêng của core/R06; không sửa nguồn helper hoặc harness hồi quy sau lượt cuối. Không chạy AI mới, Docker, build ứng dụng, cài hoặc đổi cấu hình hệ thống. Dùng parser/Clang có sẵn cho hồi quy R06; không biến test adapter thành build backend. Hai lượt phát triển và một lượt tích hợp cuối nằm trong ba vòng của D5; lệnh dài nhất106,6giây, dưới30phút. Collector ghi~85,1MiB tăng tại lúc đóng gói cuối; có kiểm dung lượng sau bổ sung raw/ảnh trong receipt cuối, vẫn dưới512MiB. Giữ nguồn pilot/cache/evidence lịch sử.

## Số đo đã duyệt, không hạ ngưỡng

Mỗi cỡ sinh1lượt đầu+5lượt tiếp; browser cũng giữ cả6lượt cho từng cấu hình. “Lượt đầu” là lần mở đầu của cấu hình đó, không tuyên bố cache OS đã xóa. Thời gian mở tính đến frame đầu sẵn sàng; tương tác tính xử lý sự kiện và frame hiển thị kế tiếp. Ghi cả cold/repeat, median và max từ raw; không loại mẫu chậm.

| Cỡ | Sinh median / max | Mở max trên4cấu hình | Tương tác max | HTML |
|---|---|---|---|---|
| S:100task/300cạnh | 376,47 /464,72ms |214,21ms|36,10ms|161.008byte|
| M:1.000task/3.000cạnh |2.281,74 /2.353,21ms|718,63ms|43,90ms|1.443.518byte|

Đạt ngưỡng sinh/mở S2giây,M5giây; tương tác200ms; HTML10MiB. Viewport390×844/1440×900 trước zoom; ở200% CSS viewport thực còn195×422/720×450 và DPR2, không dùng CSS zoom hoặc pinch để giả browser zoom. Thiết lập chỉ ở profile thử riêng, đối chiếu số đo thật. Cơ chế preference tham khảo [mã nguồn Chromium](https://chromium.googlesource.com/chromium/src/+/66.0.3359.158/chrome/browser/ui/zoom/chrome_zoom_level_prefs.cc); PASS dựa trên Chrome thực, không dựa vào tài liệu phiên bản cũ.

## Lỗi giữ lại và review ảnh

- [Lượt phát triển1](implementation-r1/development-1/chrome/summary.json): ô nhập map tràn ở195CSSpx; đã sửa min-width/width của input. Một mẫu search317,9ms gồm frame vẽ đầu chưa hoàn tất; sửa cách đo để thời gian frame đầu thuộc chỉ số mở trang, vẫn giữ ngưỡng200ms cho tương tác. [Lượt2](implementation-r1/development-2/chrome/summary.json) và toàn lượt cuối đều đạt.
- Ảnh Playwright sau cuộn ở zoom200% có ảnh trắng dù DOM đúng; không dùng ảnh đó làm bằng chứng review đạt. Chụp trực tiếp viewport bằng Chrome DevTools `Page.captureScreenshot` không truyền clip cho ảnh đúng trên **chính HTML cuối không đổi**. Giữ cả ảnh trắng và [script/metrics bổ sung](implementation-r1/visual-cdp.mjs), [ảnh S](implementation-r1/visual-cdp-S.png), [ảnh M](implementation-r1/visual-cdp-M.png), [ô thao tác S](implementation-r1/visual-cdp-controls-S.png). Đã xem ảnh tổng quan, mapping, hẹp/rộng và zoom200%; chữ/điều khiển nằm trong khung, nguồn/unknown và lọc hai chiều giữ đúng. Summary browser là kiểm DOM/thao tác/số đo, review ảnh là bước riêng này.
- Safari preflight bị chặn Remote Automation; sau đó Human bỏ Safari khỏi phạm vi. [Lỗi gốc](implementation-r1/safari-preflight.json) không đổi thành PASS.
- Validator Python của skill không chạy được do thiếu PyYAML ở cả Python mặc định và bundled; không cài bổ sung. Kiểm frontmatter thực bằng Ruby standard YAML với UTF-8 và đối chiếu các ràng buộc/name/description/placeholder: [PASS có phạm vi](implementation-r1/skill-fallback-validation-utf8.json), không nhận đó là Python validator PASS. Thử Ruby mặc định báo encoding US-ASCII, đã gọi rõ UTF-8, không đổi cấu hình máy.

## Giới hạn và điểm cần chốt

[Receipt đóng gói](implementation-r1/receipt.json) giữ SHA256 toàn bộ payload, đối chiếu2.245file bằng chứng R05 cũ nguyên byte và thống kê dung lượng bảo thủ từ trước lượt này: khoảng187,5MiB block đĩa cho output/evidence/test mới, dưới512MiB. `.gitattributes` giữ byte evidence R07 khi chuyển host. Các bản ghi Git fixture được lưu dưới tên inert `git-metadata.snapshot`; symlink thử lỗi được giữ bằng metadata trong archive, không thành liên kết sống trong evidence.

T01–T03 đã có hiện thực và bằng chứng đối chứng; T04 còn lượt dựng/đo pilot thật chưa chạy, T05 đã hồi quy nhưng chưa đủ để tự khép phase. Map view chỉ phản ánh receipt R06 và nguồn được đọc, không chứng minh nghĩa nghiệp vụ/test assertion. Helper không là secret detector: người gọi phải xác định quyền xuất các trường metadata, không đặt secret trong chúng.

[Đề xuất chốt gate pilot](../../../proposals/r07-pilot-gate-r1.md) đang IN_REVIEW: nghiệm thu phần R07 r1 đã kiểm và giữ lượt kiểm trên hồ sơ pilot thật tại R09-T14. **Chưa áp dụng đề xuất, chưa nghiệm thu R07.** Không tự tạo metadata giả, miễn ca hoặc nhận pilot PASS. Android/iOS vẫn Future; Windows/Apple Silicon chưa có bằng chứng R07 mới. R08/R09 chưa được mở thực thi bởi kết quả này.
