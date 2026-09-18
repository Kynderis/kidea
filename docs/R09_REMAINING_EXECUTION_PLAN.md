# Thực thi phần R09 còn lại — theo quyền trọn phase

Quyền: [R09_EXECUTION_AUTHORITY](R09_EXECUTION_AUTHORITY.md). Không tạo yêu cầu duyệt lại mỗi lượt. Các mốc dưới đây tách đầu ra và kiểm, không tự nghiệm thu sản phẩm hoặc thay cây `.kidea` bằng Markdown.

| Mốc | Đầu ra và kiểm bắt buộc | Điểm hiện tại |
|---|---|---|
| T02 | Dev/ASan/TSan/release, CTest/oracle/HTTP/controls; review đúng EX r2 | r10 hoàn tất với giới hạn EX r2; r7/r9 FAIL giữ nguyên |
| T03.1 | Decoder/merge theo actor/epoch/workshop/audience/version; intent persist-before-send và no replay | 33unit PASS; giữ FAIL route reuse trước bản sửa |
| T03.2 | Intro prerender, list/detail SSR/no-store/noindex/URL/escape; private/history và auth bootstrap đúng quyền server | Public/private SSR và đăng ký đã viết;18SSR–Chrome PASS với API giả |
| T03.3 | Wiring API thật, Chrome keyboard/360–1280/200%, mất phản hồi/reload/actor-switch/permission | 15kiểm HTTPS/backend thật PASS;33unit/18SSR–Chrome. Giữ giới hạn lát đầu, chưa admin/events/ops |
| T04 | Max2ACTIVE đã duyệt, impact từ bước1 trên MVP dở, cập nhật cây qua public helper, G2 | Chờ T03, không áp nghiệp vụ này sớm vào T02 |
| T05 | Admin intent/dirty fields, event/outbox/reconcile, heartbeat/monitor/backup | Chưa hoàn tất; giữ toàn bộ137nghĩa vụ và TC |
| T08 | Bundle fixed/readiness/compatibility/restore; Human chạy vai PROD lab | Chuẩn bị đầy đủ trước yêu cầu Human thực hiện; chưa deploy |
| T09/T10 | Hủy PAUSED sau release; hotfix bản đúng/master có Feature dở,2patch và G2 từng candidate | Chờ baseline release; không nhập kết quả mẫu |
| T11–T13 | Reject/approval/quyền; ngắt/ngoại tác chưa biết; Git/handoff đầy đủ | Dùng helper công khai; không giả Human acceptance hoặc sửa metadata tay |
| T14 | Tổng hợp G2 cuối, map/Chrome pilot thật, review nguồn/bằng chứng và nghiệm thu cuối | Đã bắt đầu đo snapshot thật hiện tại; chưa khép gate cuối |

T06/T07 native Future không lịch, Apple Silicon NOT_RUN. Cloud/máy độc lập, thay trust/cấu hình hệ thống hoặc thêm ngoại lệ sanitizer vẫn là điểm dừng thật theo quyền mới; không dùng Docker cùng Mac để chứng minh mất cả Mac.

Đang kiểm Chrome snapshot hiện tại dưới tải Docker; giữ mọi số đo kể cả vượt ngưỡng. Một lượt đo cuối phải ghi rõ tải máy và nguồn, không lọc mẫu chậm hoặc nới200ms. View hiện tại chỉ10nhóm UNEXPANDED và mapsUNKNOWN, không giả hồ sơ ứng dụng đã hoàn tất.

Gói public replan/provenance R09-REPLAN-LEGACY-r1 đang IN_REVIEW.21docs nguyên byte với C đã nghiệm thu;10step/17leaf mới chỉ là đề xuất, không nhậpDONE. Chờ đúng confirmation trước mutation REPLAN_WORK. [Gói cụ thể](R09_REPLAN_REVIEW.md).
