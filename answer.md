Đã ghi nhận duyệt cả hai, gồm phần làm rõ về Git và dọn bản tạm. Thiết kế đã cập nhật; chưa xóa file hoặc triển khai chức năng.

Tiếp theo là chuyện **Kidea gặp hồ sơ khác phiên bản**. Hiểu đơn giản như phần mềm cũ mở một kiểu file mới mà nó chưa hiểu. Mình đề xuất:

1. **Không hiểu thì báo rõ và giữ nguyên dữ liệu.** Kidea kiểm tra khả năng đọc hồ sơ trước khi làm tiếp; không tự đoán trạng thái, sửa file hay nâng công cụ.
2. **Đặt số 2 cho định dạng hồ sơ thử đã bổ sung.** Mẫu số 1 trước đây chưa đủ thông tin về căn cứ duyệt và lần ghi. Bộ đọc đầu tiên sẽ hỗ trợ số 2 sau khi chốt đủ chi tiết; mẫu số 1 vẫn giữ nguyên. Nếu cần chuyển hồ sơ cũ, phải có phương án bảo toàn dữ liệu riêng, không đổi ngầm.

Đánh đổi là **bản đầu chưa tự hỗ trợ hồ sơ cũ**, nhưng tránh đọc sai rồi ghi hỏng dữ liệu. “Số 2” ở đây không phải Kidea 2.0 hay phiên bản sản phẩm của bạn.

Bạn duyệt hai lựa chọn này nhé? [Gói chi tiết](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) mới là đề xuất; chưa đổi định dạng hoặc viết bộ đọc.
