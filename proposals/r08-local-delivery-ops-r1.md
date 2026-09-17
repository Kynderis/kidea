# R08 — ma trận deploy/tích hợp/ops còn lại, Docker local

**Cập nhật môi trường:** Human đã cung cấp Google Cloud project `kidea-508908` và quyền tự tạo/thu hồi VM phục vụ kiểm Kidea theo [ghi nhận quyền](../docs/R08_GCP_AUTHORITY.md). Các đoạn chưa có server/chỉ local dưới đây giữ bối cảnh lúc soạn; gói build local hiện có không tự biến thành gói chạy cloud hoặc bỏ ngoại lệ đang chờ duyệt.
2026-09-17. Human xác nhận: “Tôi chưa có, bạn dùng docker trên máy đi”. **Quyết định môi trường: Docker trên Mac hiện tại; không server/cloud mới.** Nguồn nhiệm vụ: R08-T03–T06/KA-28, R05 đã nghiệm thu phạm vi hữu hạn, R2-A15vector đã đạt. Bảng này chuẩn bị phần tiếp theo, không tự cấp quyền chạy hoặc nhận nghiệm thu.

## Chuỗi đầu vào

[B1](r08-product-build-r1.md) build sạch từ sample C++/Web đã có → artifact/backend/Web manifest mới → B2 exact package/source/config/main-child script → thực thi local và readback → review phạm vi/giới hạn → Human nghiệm thu. B1 build không tự duyệt deploy, B2 chưa EXECUTION_READY trước hash artifact thực. Không tạo hoặc sửa `.kidea` pilot để giả đã đi workflow.

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

## Quyết định local và giới hạn host

Docker có thể chứng minh process chạy khi client/phiên AI kết thúc, lỗi service, cảnh báo và backup/restore dữ liệu trong lab. Docker trên cùng Mac không tạo failure domain độc lập: mất Mac sẽ mất cả workload/observer nếu chúng cùng host. Không có server được cấp nên **không mở yêu cầu server lúc này**, không thuê hoặc cài thêm. Giữ cột bằng chứng độc lập host là NOT_PROVEN, không đổi thành PASS/N/A tự động.

Trước khép R08, trình rõ phần đã đạt local và nghĩa vụ chưa có để Human quyết định phạm vi nghiệm thu; quyết định dùng Docker local hiện tại không tự được diễn giải thành đã miễn mọi tiêu chí độc lập host. R09-T14 và kiểm sản phẩm thật vẫn có gate riêng. Native Future chưa roadmap, Safari ngoài UI Kidea, Apple Silicon NOT_RUN.
