# R05 — Đề xuất thay dependency Caddy r1

Ngày 2026-09-16. **APPROVED để thực thi** qua Human “ok bạn làm đi” gắn với yêu cầu thay Caddy sau `57319d7`. [Thực thi r2](../tests/evidence/r05/backend-execution-r2.md): resolve/checksum đạt, build FAIL do CEL API đổi. [Bản vá source hai vị trí](r05-caddy-cel-compat-r1.md) chưa áp dụng, chờ duyệt theo điều kiện dừng bên dưới. Nội dung đề xuất gốc được giữ để đối chiếu.

[E2 đã được duyệt](r05-backend-build-r1.md) đạt toolchain và 8 ca C++ dev. Image Caddy thực chứa Go 1.26.3; GO-2026-6090 ảnh hưởng TLS dự kiến. Giới hạn không forward_auth không loại bỏ lỗi này. [Bằng chứng](../tests/evidence/r05/backend-execution-r1.md).

Đề nghị cho phép resolve và khóa lại dependency Caddy, build bản thay hoàn toàn trong Docker, rà advisory/license và tương thích trước khi mở HTTPS, rồi tiếp tục đầy đủ ma trận E2 trên nguồn cuối. Giữ trần 4 GiB tải/16 GiB đĩa mới tính cả lượt trước, ít nhất 100 GiB trống, 2 CPU/4 GiB RAM, 3 giờ mỗi lượt, chỉ loopback 8443. Không cài Go/compiler/CA hoặc đổi cấu hình macOS.

Ứng viên cụ thể:

- Source Caddy v2.11.4, commit `e2eee6a7fce366321294c9c2a79f3146891dcbdf`, archive 844,139 byte, SHA256 `a593bd7077c76102ca76d19287a5e247d4e359dd67eddbc933f865afd3c131eb`. [Receipt](../tests/evidence/r05/backend-execution-r1/caddy-source-candidate.json); đã tải để review, chưa thực thi.
- Go 1.26.7 linux-amd64 từ go.dev, 66,890,901 byte, SHA256 `ffb5f8de10c62550dfddab66b36b57030721e0a44a3218e9e1181d7b59f121ca`; chưa tải/cài. [Metadata](../tests/evidence/r05/backend-execution-r1/remediation-metadata.json).
- Module ứng viên: x/net v0.56.0, x/text v0.39.0, x/crypto v0.56.0, grpc v1.83.2, cel-go v0.30.0, chi/v5 v5.3.0, klauspost/compress v1.18.7, otel v1.44.0. Metadata tồn tại; tương thích và hết advisory chưa được chứng minh.

Phải lưu toàn graph/go.sum, hash, license và đánh giá đường thực thi trước build; không nâng latest ngầm. Nếu còn advisory áp dụng hoặc graph không tương thích thì lưu lỗi và dừng, không giảm kiểm. Giữ giới hạn cấu hình Caddy cũ; kiểm binary thực và adapted config trước runtime. Đây là quyền xử lý dependency, không nghiệm thu R05.

Lý do cần duyệt: gói E2 khóa image cụ thể và yêu cầu “advisory có ảnh hưởng chưa xử lý ... thì dừng và lưu bằng chứng”. Đây là thay artifact sau phát hiện thực, không xin lại quyền chạy Docker.
