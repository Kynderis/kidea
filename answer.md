Đã ghi nhận bạn duyệt **ACL chỉ trong vùng dữ liệu thử**.

Tuy nhiên, tôi mắc lỗi khi xem trợ giúp CLI: gọi nhầm lệnh khiến sandbox khởi động từ root repo và chạy bước áp quyền đọc. Lệnh con thất bại; **chưa mở phiên AI nào — vẫn 0/3**.

- Mã nguồn và cả 9 fixture vẫn khớp manifest.
- Không có snapshot ACL trước sự cố, nên **chưa xác định được quyền nào thực sự đổi**. Tôi không tự khôi phục bằng phỏng đoán.
- Đã dừng sandbox, lưu sự cố và cập nhật roadmap. Chưa đủ bằng chứng để tiếp tục trong ngoại lệ hẹp bạn duyệt.

[Chi tiết sự cố](D:/Code/kynderis/kidea/tests/r02-t07/launcher-preflight.md). Bước đề xuất là rà soát launcher chỉ đọc để xác định đích tác động trước khi cân nhắc bất kỳ quyền bổ sung nào.
