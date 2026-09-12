Đã ghi nhận duyệt nhé bro. Mẫu hồ sơ mới đã được chốt về nguyên tắc; chưa đổi mẫu thử hoặc viết bộ đọc.

Tiếp theo: **làm sao biết đã triển khai đúng bản và không nhầm các lần chạy?** Mình đề xuất:

1. **Không chỉ nhìn tên file hoặc số phiên bản.** Hai file cùng tên “web-1.0.zip” có thể chứa nội dung khác nhau. Kidea phải nhận diện đúng gói đã kiểm tra, kèm cấu hình và script tương ứng; trước triển khai đối chiếu lại, khác thì dừng. Đổi tổ hợp phải ghi bản hồ sơ mới, không sửa âm thầm bản đã chọn.
2. **Mỗi lần thực sự triển khai có mã riêng.** Lần đầu lỗi, chạy lại thì ghi lần mới và giữ lỗi cũ. Còn chỉ vào kiểm tra lần đầu đã thành công chưa thì bổ sung kết quả cho lần đầu, không tính thành một lần triển khai khác. Mất kết nối không có nghĩa được chạy lại ngay.

Cách này cần thêm thông tin đối chiếu, nhưng giúp tránh triển khai nhầm hoặc che mất lần lỗi. Không đưa mật khẩu/token vào hồ sơ.

Bạn duyệt hai cách này nhé? [Gói chi tiết](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) vẫn chỉ là thiết kế, chưa build/deploy hoặc cấp quyền chạy PROD.
