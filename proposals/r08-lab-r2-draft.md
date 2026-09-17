# R08 R2 — đầu vào lab, DRAFT / NOT_EXECUTION_READY

2026-09-17. **Bản lịch sử đầu vào: đã được tiếp nối bởi [gói execution R2-A](r08-lab-r2-execution-r1.md).** Human “Ok làm đi” sau `34aa641` đã giao inventory chỉ đọc và xây script/manifest; phần dưới giữ trạng thái trước lượt chuẩn bị mới. Chuẩn bị ban đầu trong D1–D3 r1 đã duyệt, chỉ đọc repo. **Chưa xin quyền chạy gói này:** thiếu script/target/artifact hiện hành và giới hạn đo được. Không có Docker inventory hoặc workload nào được chạy trong r1. Không chuyển gate KA-28 sang R09.

## Nguồn có thật và điều kiện tái sử dụng

- [Backend r5](../tests/evidence/r05/backend-execution-r5.md), [manifest](../tests/evidence/r05/backend-execution-r5/manifest.json): bằng chứng build, TLS/integration/drain và binary Caddy đã có. Đây là chứng cứ lịch sử; chưa chứng minh image/cache/artifact hiện đang còn trên Docker.
- [Web r2](../tests/evidence/r05/web-execution-r2.md), [snapshot nguồn](../tests/evidence/r05/web-execution-r2/sample/): mẫu Node/Web, check/lint/unit/browser/server lịch sử; không là release package R2.
- [Manifest bootstrap cũ](../tests/r05/fixtures/backend-build-r1/manifest.json): có digest image Ubuntu/Caddy/browser/BuildKit nhưng trạng thái gốc PROPOSED; không chọn lại image Caddy cũ vì các lượt sau đã thay dependency/patch. Cần truy manifest r5 và artifact thực, không lấy manifest đầu tiên làm baseline cuối.
- Script r5 `tests/r05/backend-replay-r5.mjs`, `backend-drain-r5.mjs` và `review-backend-r5.mjs` dùng cho kiểm trước; không mặc định có preflight/revision/attempt/restore của R08. Không chạy lại collector hoặc log vào đường lịch sử.
- R05-TIDY-01 hết hiệu lực khi R05 khép. Nếu cần build mới phải xử lý nguyên nhân hoặc trình ngoại lệ cụ thể mới; không tái dùng waiver tự động.
- Pilot ngoài repo có 21 docs và chưa có `.kidea`; giữ nguyên, không tạo metadata để biến lab thành pilot. R09-T14 vẫn bắt buộc.

## Thiết kế diễn tập cần cụ thể hóa trước approval thực thi

Một lab riêng, namespace/volume/output riêng, backend + Web, dữ liệu giả, DEV và PROD giả tách target/config. Một entry gọi child script, chung logic; target PROD thật luôn ngoài phạm vi. Không mount secret hoặc dữ liệu thật. Các ca phải chạy trên service thật và quan sát state; file fixture chỉ giúp chuẩn bị.

| Nhóm | Thao tác cần được xác định bằng script | Bằng chứng đòi hỏi |
|---|---|---|
| Baseline + reuse | chọn Web mới + backend artifact giữ nguyên; build identity khác display version | source/digest/config/schema cũ→mới và actual service/flow readback |
| C06/C07/C09 | đổi child/config/migration; sai target/quyền; trùng ID/sai revision; gửi chồng | từ chối trước side effect, target state nguyên, attempt history được giữ |
| C08 | lỗi một component sau component khác hoàn thành | partial/unknown đúng target, không release success |
| C10 | ngắt liên lạc sau send trước receipt | readback migration/service rồi mới quyết định retry ID mới, không replay mù |
| C11 | app rollback không tương thích, restore dữ liệu giả được cấp quyền | dữ liệu/admin/quyền và artifact/config/schema sau recovery |
| C12 | observer mất/stale, dừng phiên điều khiển | không báo healthy từ dữ liệu cũ; job không phụ thuộc phiên AI |

Cùng-host lab không chứng minh mất host hay observer độc lập. Phần độc lập cần host/quyền thật thích hợp hoặc giữ NOT_RUN và trình rõ gate còn thiếu trước nghiệm thu; không thuê cloud hoặc giả PASS.

## Các mục còn thiếu, theo thứ tự giải quyết

1. **Inventory chỉ đọc:** xác minh image ID/digest, volume/artifact hiện còn, footprint, Docker limits và cổng trống; cần quyền cho một lát cắt chuẩn bị có Docker read-only vì D3 hiện là 0Docker. Không restart/prune/cài/tải. Ưu tiên artifact hiện có sau đối chiếu digest.
2. **Nguồn thực thi:** triển khai và review main/child/preflight/attempt/readback/fault/restore scripts của lab; cố định exact source và config, đầu vào giả, ma trận expected outcomes. Công việc triển khai executor lab này ngoài r1 hướng dẫn đã duyệt; phải được giao phạm vi cụ thể trước làm.
3. **Manifest cuối:** hash tất cả script/artifact/config/schema/migration và nguồn, exact command graph, target/ports/volumes/mounts/permissions; không có placeholder ở bản xin chạy.
4. **Quota đề nghị sau inventory:** trần CPU/RAM/đĩa/tải, sàn free disk, tổng thời gian, từng lệnh/round, bộ đo và dừng. Chưa kế thừa quota/deadline R05; chưa cam kết 0download khi chưa biết cache. Giữ evidence cả lỗi và teardown, không xóa tài nguyên cũ.
5. **Approval execution:** Human xem gói đã cụ thể ở mục 1–4 rồi mới duyệt workload; PROD thật vẫn Human trực tiếp chạy gói đã xác minh ở project tương ứng, không thuộc lab.

Điểm tiếp theo: nghiệm thu kết quả r1 và giao lát cắt chuẩn bị R2 (inventory read-only + triển khai script lab), sau đó trình execution manifest đủ cụ thể. Không yêu cầu secret trong chat. R08-T03–T06 và phase vẫn mở.
