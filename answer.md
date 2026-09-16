Đã chuẩn bị [gói E2-BW-r1](proposals/r05-backend-build-r1.md): dependency/image có hash, cấu hình HTTPS,22nhóm kiểm backend/CSRF và lệnh thực thi dự kiến. Kiểm tĩnh đạt; chưa build/chạy container.

Đề nghị duyệt chạy trọn gói trong Docker local: tối đa4GiB tải,16GiB đĩa,2CPU/4GiB RAM và3giờ; chỉ localhost8443, CA riêng trong container. Gói đề xuất SQLite3.53.4 và cmark0.31.2; Caddy2.11.4 chỉ dùng cấu hình không forward_auth theo giới hạn advisory đã ghi. Không cài công cụ hoặc CA lên macOS.

Bạn duyệt E2-BW-r1 để tôi triển khai và kiểm trọn gói nhé? Cần xác nhận vì yêu cầu ban đầu chưa cho tự build/chạy ứng dụng; lượt vừa rồi chỉ giao chuẩn bị gói. R05 vẫn chưa hoàn tất.
