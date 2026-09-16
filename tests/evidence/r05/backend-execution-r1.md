# R05 — Kết quả Docker E2-BW-r1 trên Mac Intel

Ngày 2026-09-16. **PARTIAL / BLOCKED_DEPENDENCY_REVIEW**, không PASS toàn gói. Human duyệt thực thi sau nguồn `74a2772277664cd35314180431259e69379c8b04`. [Manifest nguồn/hash/stage logs](backend-execution-r1/manifest.json), [môi trường bắt đầu](backend-execution-r1/start.json).

Host macOS 14.7 Intel x64, UID 501; Docker Desktop 4.91.0 / Engine 29.8.0 linux/amd64. Dùng Node 24.19.0 có sẵn điều phối; không cài công cụ host. Mẫu CREATE-only ở sibling `kidea-workshop-pilot/samples/r05/backend-integration-r1`, snapshot nguồn/config lưu trong evidence. Git ban đầu sạch, evidence Windows và các lượt cũ được bảo toàn.

## Kết quả thực

- Xác minh APT snapshot bằng Ubuntu archive keyring; khóa 104 package bằng version/URL/SHA256. Tải 105 artifact gồm Node Linux, tổng 208,854,018 byte; đây không phải tổng byte mạng cả lượt.
- Toolchain Docker build PASS, image `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`. Cài local deb trong Docker với network none.
- C++ dev compile PASS, **8/8 CTest PASS**, không skip: grammar, unicode/strict JSON, atomicity, rollback, SQL, concurrency, crash, lifetime. [JUnit](backend-execution-r1/cpp-dev-results.xml). Không đồng nghĩa hoàn thành tám nhóm B hoặc 22 nhóm ma trận.
- ASan/UBSan, TSan, release, clang-tidy, format nguồn cuối, CommonMark conformance đầy đủ, mutant, Web Docker regression và HTTPS/CSRF/browser/socket integration **NOT_RUN**. Chưa full positive toàn gói trên nguồn cuối.

## FAIL và sửa nguyên nhân

Raw stdout/stderr/result của cả FAIL/PASS được manifest liệt kê:

1. Docker credential helper thiếu PATH: thêm helper vào môi trường process con, không sửa host shell.
2. Ubuntu base thiếu public CA cho HTTPS snapshot: xác minh InRelease/Packages/deb bằng archive keyring/hash rồi bootstrap CA trong container. Không tắt TLS/chữ ký.
3. APT local deb với `--no-download` lỗi pathname: bỏ tùy chọn không tương thích, vẫn giữ network none và hash deb.
4. Strict warning áp vào vendor headers: khai báo dependency SYSTEM trong CMake; giữ `-Wconversion -Wsign-conversion -Werror` cho mã dự án. Không sửa assertion để lấy PASS.

## Điểm chặn

`caddy build-info` trong container network none xác nhận Go **1.26.3**. [GO-2026-6090](https://pkg.go.dev/vuln/GO-2026-6090) / CVE-2026-56862 mô tả TLS KeyUpdate có thể gây tiêu thụ CPU không giới hạn, sửa từ Go 1.26.6. HTTPS dự kiến đi qua crypto/tls bị ảnh hưởng; giới hạn không forward_auth không đủ. Không mở HTTPS hoặc thử khai thác. [Thông báo Go](https://groups.google.com/g/golang-announce/c/94pEornpRlI).

Inventory binary và truy vấn OSV giữ trong receipts; các kết quả khác chưa triage đầy đủ, không suy tất cả khai thác được. Rà Ubuntu chỉ truy vấn high/critical pending theo source/revision; source linux có kết quả nhưng closure chỉ dùng linux-libc-dev headers, không cài Ubuntu kernel. Đây không phải chứng nhận hết lỗ hổng hoặc kiểm toán license hoàn chỉnh.

Dừng tại gate advisory đã duyệt. [Đề xuất thay Caddy](../../../proposals/r05-caddy-remediation-r1.md) chờ duyệt, chưa áp nâng dependency.

## Bảo toàn và điểm tiếp tục

Collector xác minh 27 file Web r2 và 21 hồ sơ pilot nguyên hash. Snapshot lưu nguồn mẫu, patch cmark và receipts; receipt lớn gzip với hash nội dung gốc trong manifest. Core không đổi, không chạy lại benchmark lịch sử.

Workload và builder đã dừng, port 8443 đóng; chưa tạo CA lab hoặc chạy HTTPS. Giữ image/cache/volume riêng, không prune. Docker thống kê khoảng 2.213 GB image, 816.7 MB container, 2.119 GB volume; không coi đây là số đo chính xác tăng đĩa vật lý hoặc byte mạng.

R05/T03-S03 vẫn IN_PROGRESS. Sau duyệt thay Caddy: resolve/audit/build, hoàn thiện và chạy đủ preset/Web/integration/mutation rồi full positive nguồn cuối. Kết quả Intel không chứng minh Apple Silicon; LP-01 ARM vẫn NOT_RUN.
