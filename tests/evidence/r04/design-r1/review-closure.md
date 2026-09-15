# R04 — Closure recheck, bản đề xuất AR-r2

**F01–F05 PASS; V1–V8 PASS ở mức review thiết kế trên bản đề xuất được kiểm dưới đây.** Không phát hiện vấn đề mới từ hai thay đổi cuối.

Đây **không** là xác nhận pilot gốc đã được sửa, AR-r2 đã được Human duyệt hoặc sản phẩm đã chạy đạt. Kết quả FAIL của lượt đầu trên AR-r1 vẫn được giữ đúng phiên bản.

## Closure F01–F05

| Finding | Kết quả | Nguồn và căn cứ |
|---|---|---|
| F01 — Phạm vi mã yêu cầu | PASS | `architecture.md#storage`, AR-T19: khóa đăng ký/hủy có actor; hai actor cùng literal X độc lập; admin K3 giữ namespace riêng. |
| F02 — Thứ tự dữ liệu cá nhân | PASS | `architecture.md#updates`, AR-T20: hợp nhất theo actor/epoch/workshop/audience/version; HTTP cũ không ghi đè CANCELLED/rebook mới, không so version giữa workshop hoặc qua epoch. |
| F03 — Lifecycle | PASS | `architecture.md#delivery`, C3/AR-T21: có readiness, thứ tự mở ghi, admission/drain, xử lý in-flight và observer dừng cuối; chi tiết host/lệnh được giao R05/R09. |
| F04 — Chống lạm dụng/telemetry | PASS | `architecture.md#admission`, AR-T22: giới hạn hữu hạn; lỗi trước admission không thành FINAL nghiệp vụ. Bản cuối quy định 429/503 trong mẫu WQ thuộc M7; M2 chỉ giữ lỗi xử lý/đối chiếu còn mở. Queue/connection là bộ đếm nội bộ, không tự thêm monitoring. |
| F05 — Quan hệ truy nguồn | PASS | Các cạnh bổ sung ở lượt trước được giữ. Bản cuối có link `architecture#admission → operations#signals` và backlink ngược với mục đích giữ đúng nghĩa M2/M7. |

Phản ví dụ còn mở ở lượt trước đã được giải quyết: một lần rate-limit bình thường không tạo incident M2 không có điều kiện khép; nếu thuộc mẫu WQ, nó vẫn được tính là lỗi kỹ thuật và không bị loại để làm đẹp kết quả.

## V1–V8 trên bản đề xuất cuối

| Tiêu chí | Kết quả | Căn cứ chính |
|---|---|---|
| V1 — Chất lượng | PASS | `quality.md#workload`, `#response`, `#recovery`; admission không nới ngưỡng hoặc bỏ mẫu lỗi. |
| V2 — UX | PASS | `experience.md#screens`, `#action`, `#error`; hợp đồng private snapshot đã nối được yêu cầu lịch sử/trạng thái hiện tại. |
| V3 — SEO/privacy | PASS | `experience.md#seo`, `architecture.md#updates`; giữ audience, no-store/noindex và phạm vi N/A. |
| V4 — Monitoring | PASS | `operations.md#signals`, `#alerts`, `#response`; mapping admission hiện giữ đúng M2/M7, không thêm chỉ số hoặc quyền. |
| V5 — Admin | PASS | `admin.md#commands`, `#errors`, `#audit`; K3/K4 và giới hạn quyền/retry không bị mở rộng bởi bản sửa. |
| V6 — Hợp đồng kiến trúc | PASS | `architecture.md#storage`, `#updates`, `#admission`, `#delivery`; các khoảng trống được báo đã có quyết định và case tương ứng. |
| V7 — Traceability ngữ nghĩa | PASS | Các cạnh thiếu đã báo và cạnh phát sinh `signals ↔ admission` đều được bổ sung đúng mục đích. |
| V8 — Quyền/gate/bằng chứng/phương pháp | PASS | AR-r2/C1–C5 vẫn IN_REVIEW/chưa áp dụng; không giả runtime, deployment hoặc Human approval; phương pháp tái dùng giữ nguyên. |

Không còn finding mở từ F01–F05 trên bản đề xuất này. Các lựa chọn C1–C5 vẫn cần gate Human trước khi áp dụng. PASS tài liệu không chứng minh các giới hạn tải/drain, bảo mật, durability, cảnh báo hay native đã hoạt động; toàn bộ case runtime vẫn NOT_RUN.

## Byte và phạm vi kiểm

Hai hash đã đọc và đối chiếu trực tiếp lúc **2026-09-15 16:36:27 UTC**, trùng với bản controller chỉ định:

- `correction-proposal-r1/docs/design/architecture.md`  
  `6E91CC904BEA0E6F1E521B839D0A6E28BC1F0DD2C518E65E5CB1D4CD48B0BC16`
- `correction-proposal-r1/docs/design/operations.md`  
  `A86B489D55766771CF2CFF71D21B62F3971A8F379A870A0F7552E80664036736`

Recheck kế thừa phần đã đọc/đối chiếu trong cùng phiên, kiểm trực tiếp hai thay đổi cuối và hệ quả liên quan. Không viết file, chạy test/dịch vụ hoặc network. Đã kiểm đủ V1–V8; không có tiêu chí bỏ dở do deadline. Kết quả không áp dụng tự động cho byte sửa sau lượt này.
