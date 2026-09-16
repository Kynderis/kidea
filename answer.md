Đã ghi nhận duyệt nội dung R05 r1 và chuẩn bị [gói môi trường/build](proposals/r05-environment-build-r1.md). Chưa cài hoặc build.

Đề nghị bước đầu chỉ cài **Docker Intel4.91.0 + Node24.20/npm11.19 riêng cho project**, kiểm khởi động rồi dừng. Ngân sách đĩa51GiB, tải tối đa1GiB, tối đa90phút; không đổi Node hệ thống, không sudo hoặc nâng macOS. Android/iOS và build ứng dụng chưa nằm trong quyền này.

Bạn cần chốt: **“Duyệt E1; Docker dùng cá nhân”** nếu đúng mục đích của bạn; nếu dùng cho tổ chức thì cho biết để kiểm điều kiện license. Gói đã ghi nguồn tải, checksum, đích cài và điều kiện dừng.

Cần xác nhận riêng vì bạn đã yêu cầu không tự cài công cụ/thay cấu hình; lần duyệt vừa rồi chỉ bao gồm nội dung R05 và chuẩn bị gói. R05 chưa hoàn tất; Apple Silicon vẫn chưa kiểm.
