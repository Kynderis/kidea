# R08 — ma trận deploy/tích hợp/ops còn lại

**Kết quả hiện hành2026-09-17:** ma trận đã được thực thi qua [B2 local](../tests/evidence/r08/b2-execution-r1.md), [G2 cuối](../tests/evidence/r08/final-r1.md) và [cloud độc lập](../tests/evidence/r08/cloud-execution-r1.md), PASS_SCOPED/cleanup đã xác minh. [R08 chờ Human nghiệm thu](../docs/R08_ACCEPTANCE.md); các câu “chưa chạy/chưa đóng gói” bên dưới là trạng thái khi lập ma trận, không phải điểm tiếp tục hiện tại. Không mở production hoặc R09.

2026-09-17. **Môi trường hiện hành:** Docker local để build/tích hợp; Human đã cấp Google Cloud project `kidea-508908` và quyền tự tạo/thu hồi VM phục vụ kiểm Kidea theo [ghi nhận quyền](../docs/R08_GCP_AUTHORITY.md). Quyết định này thay hạn chế chưa có server trước đó. Human đã duyệt B1 và R08-TIDY-01, yêu cầu tiếp tục R08. Nguồn nhiệm vụ: R08-T03–T06/KA-28, R05 đã nghiệm thu phạm vi hữu hạn, R2-A15vector đã đạt. Bảng này xác định phần còn thiếu; không tự nhận nghiệm thu hoặc cho phép production thật.

## Chuỗi đầu vào

[B1](r08-product-build-r1.md) build sạch từ sample C++/Web đã có → artifact/backend/Web manifest mới → B2 exact package/source/config/main-child script → thực thi local và readback → review phạm vi/giới hạn → Human nghiệm thu. B1 build không tự duyệt deploy, B2 chưa EXECUTION_READY trước hash artifact thực. Không tạo hoặc sửa `.kidea` pilot để giả đã đi workflow.

[Rà đầu vào B2](../tests/evidence/r08/delivery-preparation-r1.md): đã đối chiếu binary Caddy đúng hash, source/config và yêu cầu SQLite backup/restore thực. Bộ thu artifact CREATE-only đã có; chỉ chạy khi B1 PASS. Chưa có kết quả deploy/ops/cloud mới.

## Ma trận B2 phải giữ

| Nhu cầu còn thiếu | Phép kiểm cụ thể | Bằng chứng bắt buộc / không được suy |
|---|---|---|
| Deploy theo profile | Mẫu C++ và Web từ B1 cùng tổ hợp Caddy đã đối chiếu; main gọi child, LAB DEV/LAB PROD config riêng | digest nguồn/build/artifact/config/scripts/target cũ→mới; actual binary/process/HTTP, không receipt-only |
| Tích hợp | HTTPS bằng CA lab riêng; SSR/cookie/Origin/CSRF/role và lifecycle/drain theo vector R05 hiệu lực | raw test/response/drain và identity cuối; không cài CA lên macOS, không bỏ TLS/auth gate |
| Revision/retry/lỗi phần | Child hoặc config lệch phải chặn; một component lỗi; timeout/mất response sau send | giữ attempt history/unknown; readback trước retry, không replay tác dụng phụ |
| Khôi phục dữ liệu | SQLite backup/restore đúng API và contract của sample, không copy riêng file .db đang WAL; gate role/admin/data sau restore | backup provenance/checksum + consistency; R2-A JSON snapshot không thay phép kiểm này |
| Job độc lập phiên điều khiển | Job/observer là service Docker riêng, launcher thoát; đọc lại nhiều nhịp sau khi không còn client | tiến triển thật không phụ thuộc process AI/client; chưa chứng minh sống khi Mac ngủ/tắt |
| Cảnh báo local | Dừng service đích, observer ghi alert trong data riêng; trạng thái stale/unknown, sau khôi phục đọc hồi phục | alarm timestamp, target, lỗi và recovery; không gửi email/Slack hay public callback khi chưa được cấp quyền |
| Lượt cuối | focused/impact trong lúc sửa; toàn ma trận cần thiết trên đúng tổ hợp cuối khi khép Feature/G2 | không nhận kết quả build B1 là toàn G2; thay source/config/script thì kiểm lại phần cuối theo rule |

Các script B2 phải được soạn với artifact cụ thể sau B1; image/network/port/volume/quota/lệnh sẽ khóa trước trình execution. Không chạy lại runner R05 có đường output cũ hoặc expiry/quota cũ; không build generic deployment framework cho mọi nền tảng.

## Phân biệt bằng chứng local và độc lập host

Docker có thể chứng minh process chạy khi client/phiên AI kết thúc, lỗi service, cảnh báo và backup/restore dữ liệu trong lab. Docker trên cùng Mac không tạo failure domain độc lập: mất Mac sẽ mất cả workload/observer nếu chúng cùng host. GCP đã có quyền, nhưng cần workload/observer/backup tách host, thời hạn và cleanup được đóng gói trước provisioning. Giữ cột bằng chứng độc lập host là NOT_PROVEN đến khi có phép kiểm thực, không đổi thành PASS/N/A chỉ vì đã có tài khoản cloud.

Trước khép R08, trình rõ phần đã đạt và nghĩa vụ chưa có để Human nghiệm thu. Không xin lại quyền VM thông thường đã cấp; không bỏ tiêu chí độc lập host. R09-T14 và kiểm sản phẩm thật vẫn có gate riêng. Native Future chưa roadmap, Safari ngoài UI Kidea, Apple Silicon NOT_RUN.
