Đã chuẩn bị bản thiết kế gói kiểm Android N01–N08: ca đúng/sai, source còn thiếu, đường HTTPS/ADB, ký release lab, dependency và hạn mức dự kiến. Gói chạy vẫn DRAFT cho tới khi source/harness và manifest hoàn chỉnh; chưa chạy ứng dụng.

Bộ kiểm bằng chứng N08 trên host đạt12/12 test synthetic;23file A1 và21hồ sơ pilot khớp. Không suy thành PASS runtime Android/iOS. Báo cáo: tests/evidence/r05/native-runtime-plan-r1.md.

iOS đã kiểm lại: trang Apple Downloads yêu cầu đăng nhập, chưa đủ metadata bộ cài Intel. Khi ngồi máy, bạn mở https://developer.apple.com/download/all/?q=Xcode%2016.2 và đăng nhập; chưa cần tải/cài, không gửi mật khẩu/OTP/cookie vào chat. Hướng Xcode16.2/Simulator18.2 đã duyệt, không cần duyệt lại.

Tiếp theo hoàn thiện source/harness Android rồi trình gói chạy cụ thể; iOS hoàn thiện manifest khi có phiên Apple. R05 vẫn mở, Apple Silicon chưa kiểm.
