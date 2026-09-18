# T04 — kết quả thay đổi hạn mức, chờ review đầu ra

Ngày 2026-09-18. Đây là đầu ra thay đổi đã được kiểm trên lát ứng dụng đang có; chưa là nghiệm thu R09 hoặc hoàn thành MVP. Quy tắc từ [amendment](max2.md), chỉ mục bằng chứng [index](evidence/index.json). Mọi nguồn R03–R05 và 137 nghĩa vụ gốc vẫn giữ nguyên; phần chưa triển khai không thành PASS.

## Kết quả người dùng thấy

Mỗi người có tối đa hai đăng ký đang hiệu lực trên toàn bộ workshop. Đăng ký thứ ba bị từ chối, không chiếm chỗ; hủy hợp lệ giải phóng một suất. Yêu cầu cũ luôn giữ kết quả cũ, yêu cầu mới được xét theo trạng thái mới. Dữ liệu cũ có hơn hai đăng ký được giữ nguyên, không tự hủy/xóa. Quyền và quy tắc PAUSED hiện tại không đổi; thay đổi hủy khi PAUSED thuộc T09.

## Nguồn và môi trường

Backend build từ `c168eea24192827fe4545368164c0e38e42b4e27`; Web cuối từ `de26fb6e646e57891464fc86a3058e635af336bf`. Đã đối chiếu đủ 91 file trong manifest backend sau chạy, không đổi nguồn. Commit Web chỉ sửa lời giải thích hạn mức để đúng cả dữ liệu cũ vượt hai. Hồ sơ/bản đồ bổ sung sau kiểm không thay code đã chạy.

Mac Intel, macOS 14.7, tài khoản thường; Node host 24.19.0. Backend trong Docker Linux/amd64, GCC 13.3, Node 24.20; parser Clang 18.1.3 từ image có sẵn. Không cài thêm công cụ hoặc sửa cấu hình máy. Bằng chứng Mac Chrome 153.0.8010.47 và kiểm HTTPS bằng Chromium Linux 153.0.8010.12 được tách riêng. Không suy ra Windows/Apple Silicon PASS.

## Kiểm thực tế

| Nhóm | Kết quả |
|---|---|
| Backend dev, ASan/UBSan, release | Mỗi cấu hình đủ 50 case/856 assertion; 796 assertion gốc giữ nguyên, thêm 60 quota |
| TSan | Đủ 856 assertion; 43 case sạch, 7 case/14 report thuộc đúng hai cặp SQLite WAL EX-T02-WAL-01-r2. Raw CTest FAIL giữ nguyên; không gọi TSan sạch |
| HTTP/session/shutdown | Mỗi cấu hình: 18 HTTP, 8 session, 2 shutdown PASS; controls sanitizer giữ nguyên |
| Policy/gate offline | 79 policy + 34 gate = 113 PASS; test âm chặn receipt 796 cũ khỏi closure 856 mới |
| Web cuối | 34 unit PASS; check/lint/build PASS; 18 SSR–Chrome PASS trên Mac |
| HTTPS backend thật | 18 kiểm PASS, gồm ba kiểm quota mới; TLS được xác minh, không bỏ kiểm chứng chỉ; không có page error/request ra ngoài |
| Test lỗi cố ý | Baseline Q01 PASS; bốn mutant bỏ quota/đếm CANCELLED/tính lại retry/sai duplicate đều FAIL đúng assertion |
| Query plan | SQLite 3.53.4 dùng COVERING INDEX one_active theo actor; không cần migration |

Bằng chứng có phiên bản: [backend](evidence/backend.json), [phân loại TSan](evidence/tsan-classification.json), [HTTPS](evidence/https.json), [manifest HTTPS](evidence/https-manifest.json), [mutants](evidence/mutations.json), [query plan](evidence/query-plan.txt), [Web](evidence/web-results.json). Raw đầy đủ ở repo Kidea `tests/evidence/r09/t04-*`; index ghi đường dẫn/hash cụ thể.

Ảnh `t04-integration-r1/run/browser/quota-rejected.png` đã xem: thông báo hạn mức đọc được, đúng ngữ cảnh lịch sử, không che nút/link. Ảnh chụp trong lúc đối chiếu trạng thái hiện tại, không là bằng chứng cập nhật trực tiếp/event hoàn tất. Các kiểm viewport/keyboard/200% vẫn thuộc suite Chrome hiện có; ảnh này không tự chứng nhận toàn UX.

## Đánh giá ảnh hưởng không có diff

- Quota nằm trong `Store::handle` với `BEGIN IMMEDIATE`, trước capacity, sau lookup kết quả cũ/PAUSED/duplicate; `remember` và domain/outbox cùng commit. Q04 chạy hai connection với barrier, mười lịch thực, đúng một người thắng suất quota cuối. Không đếm bên ngoài transaction hoặc từ cache Web.
- Hủy vẫn đúng registrationId/owner; Q01–Q03 kiểm CANCELLED không đếm, hủy lại không giải phóng thêm, dữ liệu legacy và lịch sử không bị xóa. Từ chối không gọi `changed`, không phát public event; count/outbox được kiểm thực.
- Admin, SSR/public/private, auth/epoch/CSRF và remaining theo workshop giữ nghĩa cũ. Suite gốc và HTTPS kiểm lại; quota cá nhân không trở thành quyền admin hoặc số chỗ công khai.
- Không đổi schema, format backup, outbox payload hay ngưỡng latency/freshness/recovery. Publisher/reconcile/monitor/backup/admin UI chưa hoàn tất vẫn thuộc T05; độc lập miền lỗi và WQ/E1 chưa được chứng minh bởi lượt Docker local này.
- Additive LIMIT_REACHED được backend/Web hiện hành hiểu; mixed-version release vẫn phải kiểm ở T08. Không tự công bố release/readiness/deploy.

## Ba bản đồ và giới hạn

Một [responsibility mapping](../architecture/traceability.md) được soạn; reverse lookup sinh từ đó, không thêm bảng tiến độ/test thứ tư. Documentation map: 22 file, 143 node/1.052 link, không lỗi cấu trúc. Web + 4 translation unit Clang và inventory test/schema/contract: 626 node/432 edge, 1.641 diagnostic, INCOMPLETE. Traceability: 10 hàng/31 cạnh, còn 2 diagnostic, INCOMPLETE. Các dispatch/URL/event và tên định nghĩa C++ ngoài class chưa giải chắc được giữ rõ; liên kết quota dùng file thật và assertion có nghĩa, không suy đầy đủ từ AST.

## FAIL giữ lại và điểm tiếp tục

Giữ FAIL decoder trước khi thêm LIMIT_REACHED; FAIL fixture policy cũ 796 bị dùng cho oracle 856 (sửa harness, thêm test âm); lỗi khởi chạy npm do đường dẫn runtime không có npm (dùng npm có sẵn với Node 24); query-plan r1 không chạy được binary trên tmpfs noexec (r2 dùng bind output dùng một lần); toàn bộ raw TSan FAIL. Không sửa expected gốc hoặc nới EX r2 để lấy PASS.

Cần public ASSESS đủ 10 consumer và Human review đúng bản đầu ra trước CLOSE để quay lại W-009-MAX2. Review này chỉ khép ảnh hưởng T04 trên MVP dở; không nghiệm thu trước T05, final G2/137 nghĩa vụ, T08 Human PROD, T09/T10 hotfix, T11–14 hoặc R09. Không cần duyệt lại từng lệnh/build theo quyền trọn R09.
