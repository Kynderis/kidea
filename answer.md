R4 **PASS46/46 nhóm CTest và clang-tidy toàn bộ backend**, nhưng dừng ở12cảnh báo trong bộ test. Tôi đã sửa, giữ nguyên assertion/expected/log; HTTP/sanitizer/release chưa chạy, R09 chưa hoàn tất.

Bạn duyệt [một lượt build r5](docs/R09_T02_BUILD_R5_REVIEW.md) nhé: tối đa2giờ,4container tuần tự,2CPU/4GiB, thêm tối đa8GiB đĩa; không tải/cài thêm lên macOS.

Cần duyệt vì gói r4 quy định một lượt và dừng khi lỗi, không đổi nguồn rồi chạy lại bằng quyền đó. Không xin lại nghiệp vụ/B/C.
