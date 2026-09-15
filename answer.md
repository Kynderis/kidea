Đã xác định điểm nóng trên bộ 1.000 task: **kiểm đường dẫn/metadata**.

- `realpathSync` chiếm **87,6% thời gian lấy mẫu**, chủ yếu nằm trong `lstat`; đọc nội dung file chỉ khoảng 5,4%.
- Một lượt profiling hoàn tất, output đúng; **258/258 kiểm thử đạt**, bằng chứng D1/D2 nguyên vẹn. [Báo cáo](D:/Code/kynderis/kidea/tests/evidence/r02-t10-profile-r1.md).

Khuyến nghị: **thử `realpathSync.native`**, giữ nguyên các kiểm tra an toàn rồi kiểm chứng lại. Chưa sửa runtime hoặc chạy thêm; tỷ trọng profile không phải cam kết mức tăng tốc.
