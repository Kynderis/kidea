# R08 B2 — rà đầu vào và các phép kiểm còn thiếu

2026-09-17. PREPARATION_ONLY. Thực hiện trong lúc B1 build; chưa deploy B2 hoặc tạo VM. Không ghi vào live pilot, không thay profile/source ứng dụng.

**Cập nhật sau build:** B1 PASS; bộ thu đã chạy thành công, khóa [identity artifact](delivery-inputs-r1.json): backend4.405.008byte,109file Web build và5252entry dependency, cùng Caddy đã đối chiếu. B2 vẫn chưa EXECUTION_READY vì còn main/child/config/target và ma trận kiểm thực.

## Đầu vào thực đã kiểm

- B1 dùng snapshot 1051file, inputs.json khóa hash; artifact chỉ được chọn khi summary B1 PASS và source/package vẫn khớp. Bộ thu `tests/r08/delivery-inputs-r1.mjs` kiểm điều kiện này rồi ghi CREATE-only; không chạy Docker/cloud. Inventory ghi hash/bytes/quyền executable và chỉ nhận symlink tương đối còn nằm trong cây artifact.
- Caddy export chỉ đọc bằng `docker cp` từ container R05 đang dừng `kidea-r05-e2-r3-caddy:/work/caddy`, không start nó. Bản local `.test-output/r08-delivery-inputs-r1/caddy`: 77.716.230byte, SHA256 `07f440f3a7421623b3340aaf8e212b8c326579b7fc203b037e538fa3d99c7b1e`, khớp `tests/evidence/r05/backend-execution-r4/caddy-final.sha256`. Không dùng stock image cũ, không rebuild Caddy.
- Source server.cpp cố định origin `https://localhost:8443`, database `/data/sample.db`, synthetic sessions `/secrets/sessions.json`; Web dùng ORIGIN/KIDEA_INTEGRATION. LAB DEV/PROD có thể tách network/data/config nhưng giữ cùng origin của mẫu, không cần đổi source B1.
- Store trong domain.hpp/domain.cpp tạo WAL/FULL/foreign_keys và bốn bảng domain/results/audit/outbox. Chưa có API backup/restore của ứng dụng; phải bổ sung công cụ diễn tập ngoài source ứng dụng, dùng SQLite backup API, đọc lại qua backend thật. Không coi snapshot JSON của R2-A là backup SQLite.

## Khóa execution B2 sau artifact

Một main gọi child cho hai config LAB DEV/LAB PROD, cùng logic, chỉ network Docker internal và fixture data riêng. Khóa hash main/child/config/artifact/image và target trước tác dụng phụ. Không gọi các runner R05 có tên/volume/output/quota cũ. Identity phải đối chiếu executable/process/config thực và HTTP; hash file build hoặc exit code riêng không đủ.

Chạy các vector hiện có trên artifact mới: `https-check.mjs` (38), `layers-r4.mjs` (15), `header-boundary.mjs` (3), `browser-https.mjs` (8) và drain normal/stuck. HTTPS checker thu hồi session B; browser phải dùng session mới hoặc deployment mới, không vô tình dùng credential đã revoke. Browser dùng CA/NSS riêng theo `browser-bootstrap-r4.sh`, không TLS bypass hoặc trust macOS. Các số trên là số vector dự kiến từ nguồn/lịch sử, chưa là PASS mới.

Kiểm lỗi revision/child/config/target trước deploy; lỗi một component và mất response sau send phải giữ attempt UNKNOWN rồi readback trước retry. Restore cần backup provenance/checksum, integrity/schema/bốn bảng, dữ liệu trước/sau và role/admin thực. Không copy riêng `.db` đang WAL. Thay schema thực cần migration/compatibility cụ thể; mẫu hiện tại không có migration sản phẩm để giả đã đạt.

Rà source thấy `Store::apply` dùng `INSERT INTO ... VALUES` theo vị trí cột (domain.cpp:191–192). Vì vậy không thể mặc định thêm cột bằng ALTER TABLE vẫn tương thích với binary B1. Ca schema lệch phải bị gate compatibility chặn; thử lỗi/restore chỉ dùng database lab riêng, ghi nhận kết quả thực trước kết luận. Không chỉnh source ứng dụng hoặc mở một build mới bằng ngoại lệ B1 đã dùng.

Cloud đã có quyền tại docs/R08_GCP_AUTHORITY.md, không xin lại quyền VM thông thường. Trước provisioning vẫn phải khóa workload, thời hạn phía cloud, dự toán và cleanup sở hữu lab. Observer/backup cần failure domain khác workload và Mac; ghi alert/recovery vào dữ liệu lab, không gửi ra email/Slack. Chưa có bằng chứng mất host; không suy Docker local hoặc B1 thành PASS.

## Điểm kết thúc

B1 chỉ chốt build gates. B2 còn execution package, kiểm tích hợp/restore/ops, rồi kiểm cuối G2 đúng tổ hợp và Human nghiệm thu. R08 IN_PROGRESS; R09/R10 chưa mở. Native Future, Apple Silicon NOT_RUN giữ nguyên.
