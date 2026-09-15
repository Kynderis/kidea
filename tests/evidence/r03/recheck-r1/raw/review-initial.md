Kết quả review bản frozen r1: **FAIL về coverage/traceability; PARTIAL về tính quyết định của một expected**. Phần đăng ký, retry, đồng thời và phân biệt dữ liệu có thẩm quyền với hiển thị nhất quán với nguồn đã duyệt.

Đã đọc đủ 10 tài liệu sản phẩm, `SKILL.md`, `references/business.md`, bốn proposal và `pilot-scope.md`. Chỉ đọc snapshot được cấp; không chạy sản phẩm, sửa file, đọc lịch sử/memory hoặc mở agent con.

## Findings

### F1 — Thiếu dependency ngược ở các caller thực tế

Các liên kết xuôi tồn tại nhưng bảng quan hệ nguồn chưa đủ:

| Nguồn | Caller thực tế | Thiếu ở |
|---|---|---|
| W-DATA | `docs/business/features/view.md:11`, bước V2 | `shared/workshop.md:60–66` không ghi W-DATA → view#flow |
| R-INV | `docs/business/tests.md:75`, nhóm concurrency | `shared/registration.md:56–62` chỉ gán test concurrency cho R-SERIAL |
| R-SERIAL | `docs/business/features/admin.md:18`, AC-A3 | `shared/registration.md:58–62` có admin#flow nhưng thiếu admin#ac; bổ sung AC chỉ ghi đăng ký |

Ảnh hưởng: đọc bản đồ khi đổi miền nội dung/lịch hoặc invariant C/N có thể bỏ qua consumer/AC/test đang trực tiếp dùng rule. Đây là thiếu traceability thực, không phải yêu cầu mỗi file phải backlink mọi liên kết điều hướng.

Căn cứ: business method yêu cầu quan hệ hai chiều đến đúng mục và mục đích; completion D yêu cầu forward/backlink và impact đầy đủ. Cần bổ sung các cạnh còn thiếu và rà những dependency nội bộ tương tự.

### F2 — Nhánh tạo workshop chưa có AC/test xác nhận trạng thái cuối

- `shared/workshop.md:31` đã quy định tạo hợp lệ → DRAFT, chưa đăng ký.
- `features/admin.md:11` có nhánh tạo.
- `features/admin.md:18`: AC-A1 kiểm ma trận chuyển trạng thái; AC-A2 kiểm miền dữ liệu/sửa. Chưa có AC rõ cho kết quả tạo.
- `tests.md:30`, P02 chỉ xác nhận quyền tạo; D01–D08 kiểm miền/sửa, không có case tạo với expected workshop mới ở DRAFT, N=0 và không xuất hiện công khai.

Vì tạo là nhánh hữu hạn thuộc PIL-F03, đây là thiếu coverage bắt buộc theo business method/completion D, không phải tổ hợp field×role cần vét thêm.

Cần case tạo với input hợp lệ cụ thể, trạng thái trước chưa có workshop, trạng thái sau và audience; liên kết tới W-STATE/W-ACCESS cùng AC admin tương ứng.

### F3 — D05 chưa xác định nhận hay từ chối nội dung HTML/Markdown

`tests.md:96`, D05 chỉ yêu cầu markup “không được nhận như nội dung định dạng hay thực thi”. Cả hai kết quả sau có thể thỏa câu này:

1. Từ chối, giữ nguyên nội dung.
2. Nhận và lưu nguyên chuỗi `<b>abc</b>` như văn bản.

Trong khi `shared/workshop.md:10` và B2 ghi không HTML/Markdown do người dùng nhập. D05 chưa nêu kết quả nghiệp vụ và dữ liệu sau; không thể dùng nó để quyết định hai cách xử lý trên có tương đương hay không.

Cần expected rõ theo cách hiểu có căn cứ của nguồn. Nếu nguồn chưa quyết định việc chấp nhận chuỗi literal, ghi OPEN của đúng hành vi đó; không tự chọn reject hoặc accept dưới tên chi tiết encoding.

## Các kết quả tái dựng được

- **Xem:** OPEN/PAUSED công khai, DRAFT chỉ phạm vi admin. Danh sách tăng theo thời điểm bắt đầu và dùng ID ổn định khi hòa. Mất kết nối giữ số chỗ/thời điểm đã quan sát, đánh dấu chưa cập nhật.
- **Đăng ký:** C10,N9, người chưa ACTIVE được nhận → N10; yêu cầu mới tiếp theo hết chỗ. Người đã ACTIVE nhận kết quả đã đăng ký trước kiểm đầy.
- **Hủy và retry:** A đã hủy, đăng ký lại B; yêu cầu mới hủy A trả đã hủy, B không đổi. Retry mã đăng ký cũ sau hủy/PAUSE trả kết quả lịch sử nếu còn quyền, không hồi sinh ACTIVE.
- **Đồng thời:** C10,N9, đăng ký trước giảm C9 → N10,C10 và giảm bị từ chối; giảm trước → C9,N9 và đăng ký FULL. PAUSE trước chặn đăng ký/hủy mới; thao tác hợp lệ trước PAUSE giữ hiệu lực đã nhận.
- **Admin:** DRAFT→OPEN→PAUSED→OPEN được phép; ba ô giữ nguyên không tạo event giả; các chuyển còn lại trong ma trận bị từ chối. C<N không được nhận; sửa lịch khi có ACTIVE không hủy đăng ký hoặc tự thêm thông báo riêng.
- **Cập nhật:** đã thấy v12 thì bỏ v11/lặp v12; v12 khác nội dung phải đối chiếu. Snapshot v14 đủ bao phủ có thể phục hồi mà không replay nghiệp vụ. Chưa chắc việc lưu kết quả/nghĩa vụ không được báo thành công cuối; view chậm sau lưu chắc không đảo kết quả đăng ký.

## Rubric

| Dimension | Kết quả | Căn cứ |
|---|---|---|
| Scope | PASS | Đủ bốn Feature; hai bài change và giới hạn nền tảng được giữ |
| Không tự quyết định/approval | PASS | Không nhận tài liệu là nghiệm thu; không tự mở runtime hoặc R04 |
| Input/state → output/state quyết định được | PARTIAL | Đa số rõ; D05 thiếu accept/reject và state sau |
| Retry semantics | PASS | Giữ mã, lịch sử, quyền hiện tại; không lặp hiệu lực; có same-code concurrency |
| Concurrency | PASS | Năm cặp lịch bắt buộc đủ hai thứ tự, invariant phù hợp D3 |
| Authority vs cache | PASS | Backend quyết định; version/recovery không replay đăng ký |
| Traceability/coverage | FAIL | F1 và nhánh tạo ở F2 |
| Reconstruction không transcript | PARTIAL | Tái dựng được các luồng chính; D05 còn hai outcome có thể hiểu khác nhau |

Không xem thiếu DB/broker, lock, mã HTTP, wireframe, SLO số giây hoặc bằng chứng thiết bị là lỗi nghiệp vụ của gói này: chúng được hoãn có chủ đích. Review này không duyệt đầu ra hay xác nhận sản phẩm đã chạy.
