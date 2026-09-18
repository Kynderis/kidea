# Vì sao lượt kiểm dừng — 2026-09-18

Không có bằng chứng Kidea hoặc macOS bị crash. Bộ chạy chủ động trả FAIL khi một kiểm tra không đạt, rồi dừng/dọn các container và mạng thuộc lượt đó. Không tiếp tục để tránh nhận PASS cho các ca chưa chạy.

- r1: lỗi pilot Web thật: quan sát dữ liệu mới làm mất cảnh báo UNKNOWN sau EDIT đã commit nhưng mất phản hồi. Đã sửa nguồn.
- Hai regression native trên nguồn cũ xác nhận thêm lỗi thiếu xác nhận lịch sử EDIT riêng khi publication thất bại. Hai lỗi pilot Web đã sửa trong commit4544bd6; 93unit/18SSR/4regression/type/lint/build mới PASS. Không phải sửa Kidea runtime.
- r2: observer Chromium không đọc được body phản hồi503; nguyên nhân transport/cache cụ thể chưa xác định. Observer mới đọc phản hồi backend thật trước chuyển nguyên phản hồi tới trang; không giả kết quả/status.
- r3: 46 kiểm PASS trước khi ca namespace thất bại. U/V đã có đăng ký ACTIVE từ các ca trước nên máy chủ trả LIMIT_REACHED đúng Max2, trong khi ca mới cần hai người còn hạn mức. Đây là dữ liệu kiểm thử chưa cô lập, không lỗi quota ứng dụng. r4 dùng hai participant giả riêng BOUNDARY-U/V và SQL vẫn kiểm owner/result/registration thật; không giảm hạn mức hoặc sửa kỳ vọng REGISTERED.

Các FAIL và frozen plan từng lượt giữ nguyên. r4 được chạy lại toàn bộ77 kiểm cũ +8 nhóm mới theo manifest80db68c1. Chưa có kết luận PASS cho r4 tại thời điểm ghi chẩn đoán này. T05/R09 vẫn mở; chưa nghiệm thu/G2.

R4 tiếp tục trả FAIL46 kiểm: payload khác nhắm DRAFT riêng tư bị404 trước409. R5 dùng workshop công khai có sẵn làm payload khác, giữ nguyên visibility/request conflict; ứng dụng không đổi sau các Web gate. Chưa có kết luận PASS r5 tại thời điểm bổ sung này.

Kết quả cuối r5:85/85 HTTPS/WSSPASS, SQL14checksPASS, khôngskip; raw runner/manifest ở integration-r5. Hai lỗi Web được sửa; hai điều kiện dữ liệu kiểm và observer được sửa, giữ đầy đủ an toàn. T05/R09 vẫn mở.
