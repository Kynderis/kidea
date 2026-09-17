Đã chỉnh ma trận R05: Android Emulator/iOS Simulator được dùng để kiểm mẫu Kidea; điện thoại thật không còn chặn các ca mô phỏng được. Giữ8nhóm oracle riêng từng nền tảng, mẫu sai phải bị bắt và kết quả phải ghi đúng môi trường. Nghĩa vụ kiểm ứng dụng thật giữ theo từng project; R05 chưa hoàn tất.

Đã chuẩn bị gói tại proposals/r05-simulator-lab-r1.md:

- Android:4archive chính thức cho Intel tổng~1.38GiB. Đề nghị duyệt cài/boot một AVD API36 trên macOS, trần2GiB tải/12GiB đĩa thêm/90phút; build app vẫn dùng Docker và SDK37. Chưa tải binary/cài/chạy.
- iOS: đề xuất Xcode16.2 + iOS18.2 Simulator để dùng Sonoma hiện tại, là tổ hợp lab bổ sung. Chưa đủ manifest để duyệt cài: archive Xcode yêu cầu đăng nhập Apple, metadata runtime universal còn thiếu. Không cần nâng macOS ngay.

Cần Human duyệt gói Android và chốt hướng lab iOS16.2. Quyền cài cần riêng vì chỉ đạo ban đầu cấm tự cài công cụ, còn “ok làm đi” gần nhất giao chỉnh ma trận/chuẩn bị gói. Không xin duyệt lại R05 r1/A1/SDK37; không yêu cầu secret vào chat.
