# R04 — Recheck bản đề xuất AR-r2, lượt 1

**F01–F03 PASS; F04 PARTIAL; F05 FAIL do một quan hệ mới bị thiếu.** Bản đề xuất giải quyết các lỗi chính của lượt đầu, nhưng ánh xạ telemetry mới tại C4 chưa rõ.

Phạm vi: đọc toàn bộ `correction-proposal-r1/docs/design/architecture.md`, đối chiếu thay đổi của 14 file còn lại với pilot gốc. Các thay đổi ngoài kiến trúc quan sát được là bảng backlink bổ sung. Không áp dụng/duyệt bản đề xuất, không chạy test hoặc network.

## Recheck từng finding

### F01 — PASS

Nguồn: `design/architecture.md#storage`, hàng `request_result`; `#cases`, AR-T19.

Khóa đăng ký/hủy đã ghi rõ `(epoch, actor đã xác thực, namespace registration, requestID)`. Hai actor dùng cùng literal X là hai ý định độc lập; lookup vẫn kiểm actor hiện tại. Namespace admin được tách riêng theo K3.

Phản ví dụ U/V cùng X của lượt đầu đã có kết quả thiết kế đúng. Không phát hiện xung đột mới với R-RETRY.

### F02 — PASS

Nguồn: `design/architecture.md#updates`; `#cases`, AR-T20.

Đã chọn nhóm `(actor, epoch, workshopID)`, `workshopVersion`, toàn lịch sử chính chủ nhất quán trong từng nhóm; high-water tách audience và workshop. Collection HTTP hợp nhất theo nhóm, không ghi đè toàn danh sách. Response cũ khi đổi actor/epoch bị loại.

Cách này giải quyết GET ACTIVE đến muộn sau CANCELLED, hai workshop cùng số version và public version không loại nhầm private snapshot. Quy tắc không xóa nhóm vắng trong response phù hợp nguồn hiện tại: lịch sử không bị xóa trong cùng epoch. Không cần tự thêm global revision.

### F03 — PASS

Nguồn: `design/architecture.md#delivery`, mục C3; `#cases`, AR-T21.

Đã có artifact/process owner, live/read-ready/write-ready, thứ tự observer → phục hồi backend → đường đọc → backup/quan sát hợp lệ → mở ghi. Shutdown đóng admission, drain hữu hạn và giữ UNKNOWN khi không đủ căn cứ.

Ngưỡng drain 30 giây là lựa chọn mới được ghi là đề xuất, không thay QR/QD. Service manager, tài khoản và lệnh cụ thể để R05/R09 là phân chia hợp lý sau khi lifecycle đã rõ. Không suy quyền thực thi từ bản thiết kế.

### F04 — PARTIAL

Nguồn: `design/architecture.md#admission`; `#cases`, AR-T22.

Đã bổ sung giới hạn HTTP/rate/actor/IP/socket/frame/queue và hành vi trước/sau admission. Các giới hạn hữu hạn, không dựa IP để cấp quyền, không biến 429/503 thành FINAL nghiệp vụ và không cấp quyền tự POST admin. Tải WQ đã chọn thấp hơn các rate cap trong trường hợp bình thường; đây vẫn là mục tiêu chưa benchmark.

**Phần chưa đủ: mapping telemetry ở câu cuối C4.**

> “Metric từ chối kỹ thuật/queue/connection được đưa vào M2/M7 theo phạm vi hiện có…”

Trong `operations.md#signals`:

- M2 là số **bản ghi lỗi xử lý/đối chiếu chưa giải quyết**, có quy tắc giữ/khép incident.
- M7 là thống kê request của bài WQ, phân nhóm đọc/ghi và cửa sổ 60 giây.

Câu mới chưa chỉ rõ metric nào vào đâu. Queue depth/connection count không đồng nghĩa unresolved error; một lần 429 cũng không tự trở thành bản ghi lỗi xử lý chưa giải quyết.

**Phản ví dụ cần phân định:** Client vượt rate một lần, sau đó hoạt động bình thường. Nếu lần 429 bị cộng vào M2 thì tài liệu chưa có căn cứ khép bản ghi đó; nếu chỉ nằm trong M7 thì phải nói rõ phạm vi mẫu WQ và cách đếm.

**Sửa tối thiểu:** Ánh xạ cụ thể:

- 429/503 trong mẫu WQ thuộc lỗi kỹ thuật M7, không bị loại khỏi bài đo.
- M2 chỉ tăng khi có lỗi xử lý/đối chiếu còn mở đúng định nghĩa hiện hữu.
- Queue/connection là số chẩn đoán của admission; nếu muốn thêm vào sản phẩm monitoring, phải trình rõ thay đổi O-SIGNALS và case tương ứng.

Tôi không kết luận runtime chắc chắn sẽ làm sai: cụm “theo phạm vi hiện có” giữ một ràng buộc đúng, nhưng chưa đủ để quyết định mapping triển khai.

### F05 — FAIL, phần cũ đã sửa nhưng còn cạnh mới thiếu

Các cạnh thiếu ở lượt đầu đã được bổ sung:

- R-RETRY → storage/API/updates/admission/cases.
- W-ACCESS và V-PUBLISH → updates.
- Các quan hệ lịch sử, lifecycle và quality mới có backlink tương ứng.

**Cạnh mới bị thiếu:** `design/architecture.md#admission` trực tiếp dùng M2/M7 của `design/operations.md#signals`, nhưng không có forward link tới section đó và bảng bổ sung backlink `operations.md` chỉ thêm `delivery`, chưa thêm `admission`.

**Ảnh hưởng:** Đổi định nghĩa M2/M7 hoặc chính sách overload không dẫn reviewer tới consumer mới; chính sự mơ hồ trong F04 có thể bị bỏ qua dù checker các cạnh đã viết đều qua.

**Sửa tối thiểu:** Sau khi chốt mapping F04, thêm cạnh hai chiều `operations#signals ↔ architecture#admission`, nêu rõ phần nghĩa được dùng. Không cần thay nghiệp vụ R03.

## V1–V8 trên đúng bản đề xuất này

| Tiêu chí | Kết quả | Căn cứ và giới hạn |
|---|---|---|
| V1 | PASS | Quality giữ nguyên yêu cầu đo và NOT_RUN; C4 không hạ ngưỡng hoặc cho loại mẫu lỗi. |
| V2 | PASS | UX giữ nguyên; C2 đã bổ sung hợp đồng bảo vệ thứ tự dữ liệu cá nhân. |
| V3 | PASS | Không thay SEO/audience/cache/noindex; không mở quyền publish. |
| V4 | PARTIAL | Thiết kế OP gốc vẫn đúng; telemetry mới của admission chưa được ánh xạ đủ rõ vào M2/M7. |
| V5 | PASS | Không thêm quyền admin; retry đăng ký và admin được tách đúng; overload không cấp retry admin mới. |
| V6 | PARTIAL | Mâu thuẫn khóa, private snapshot và lifecycle đã được giải quyết; còn mapping hợp đồng telemetry tại F04. |
| V7 | FAIL | Các cạnh cũ đã sửa; còn cạnh trực tiếp mới `signals ↔ admission` chưa khai báo. |
| V8 | PASS | AR-r2/C1–C5 được ghi đúng là IN_REVIEW/chưa áp dụng; không giả approval hay runtime; không sửa pilot đã duyệt. |

## Phiên bản và giới hạn

Hash SHA-256 của bản kiến trúc đã recheck, đọc lúc **2026-09-15 16:34:04 UTC**:

`C727AC66C65B49E909EED8ECABCE3F5E62CBD99CD40B20F34824961D04F7C17C`

Đã kiểm đủ V1–V8 cho phần thay đổi và hệ quả được nhận diện. Không còn mục bỏ dở vì thời gian ở lượt này. Các runtime case vẫn NOT_RUN. Kết quả chỉ áp dụng bản đề xuất mang hash trên, không biến pilot gốc thành đã sửa hoặc AR-r2 thành đã được Human duyệt.
