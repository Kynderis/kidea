# R07 — chốt giới hạn nghiệm thu và lượt kiểm pilot

Ngày2026-09-17. **IN_REVIEW — đề xuất, chưa áp dụng.** Gói triển khai [R07 r1](r07-offline-view-r1.md) đã duyệt D1–D5; [Chrome-only](../docs/R07_CHROME_SCOPE.md) đã có quyết định riêng.

## Căn cứ thực tế

Pilot hiện có 21 tài liệu đã duyệt, nhưng không có `.kidea/INDEX.md` hoặc hồ sơ điều phối. Bản sao giữ đúng hash; helper trả `VIEW_NOT_UPDATED / VIEW_SOURCE_INVALID / MISSING_FILE` và không tạo tiến độ giả. [Bằng chứng pilot](../tests/evidence/r07/implementation-r1/final-2026-09-17T05-53-02-534Z/pilot.json).

V12/R07-T04 yêu cầu đo S/M và pilot. S/M kiểm được bằng đối chứng có nhãn giả; lượt render/đo trên pilot thật vẫn NOT_RUN. Không thể tạo đầu vào nghiệp vụ hoặc tự ghi task/approval cho pilot để lấp khoảng trống. Gói hiện hành cũng không cấp quyền đó.

## Đề xuất một quyết định

Nghiệm thu R07 r1 trong phạm vi helper, Chrome, ma trận đối chứng và các giới hạn tại [báo cáo](../tests/evidence/r07/implementation-r1.md); chuyển **riêng lượt dựng/đo view trên hồ sơ pilot thật** sang gate tích hợp R09-T14, khi pilot đã có hồ sơ điều phối hợp lệ từ luồng thực hiện được duyệt. Đây là đổi vị trí kiểm, không miễn hoặc đổi NOT_RUN thành PASS.

Sau khi Human đồng ý: khép phần R07 r1 đã kiểm; ghi nghĩa vụ pilot tại R09-T14 trong roadmap, giữ thông tin thiếu trong báo cáo. R09 chưa thể nghiệm thu nếu thiếu lượt kiểm này. Không tự khởi tạo pilot, mở R08/R09 thực thi, cài công cụ hoặc cấp thêm ngân sách trong quyết định này.

Nếu Human muốn kiểm trên pilot trước khi khép R07: giữ R07 mở và chuẩn bị riêng phạm vi tạo hồ sơ pilot từ tài liệu/tiến độ thật; không coi 21 tài liệu nghiệp vụ tự động xác định task, gate hoặc trạng thái hoàn thành.
