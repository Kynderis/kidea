Đã ghi nhận duyệt kiến trúc và tích hợp hướng dẫn vào Kidea. **Chưa khép R04:** kiểm độc lập phát hiện 5 điểm trong bản thiết kế tôi viết cần sửa/bổ sung.

Tôi đã gom thành [một gói sửa C1–C5](D:/Code/kynderis/kidea/tests/evidence/r04/design-r1/correction-request.md):

| Mục | Sửa gì — ví dụ dễ hiểu |
|---|---|
| C1 | Phân biệt mã đăng ký theo từng người: A và B cùng dùng mã X không bị coi nhầm là một yêu cầu. |
| C2 | Không để dữ liệu cũ ghi đè dữ liệu mới: đã hủy thì phản hồi cũ đến muộn không được hiện lại “đang đăng ký”. |
| C3 | Bổ sung trình tự mở/dừng an toàn; khi dừng, chờ xử lý tối đa 30 giây và không báo kết quả giả. |
| C4 | Giới hạn tải để tránh gửi tràn: 128 yêu cầu đang xử lý, 64 chờ ghi, 100 lượt/giây toàn hệ thống và 20/người; giới hạn kết nối chi tiết có trong gói. |
| C5 | Bổ sung liên kết truy nguồn và ca kiểm tra cho các điểm trên. |

**Bản sửa đã được reviewer kiểm lại: 8/8 tiêu chí đạt**, trong đúng phiên đã cấp. Nhưng chưa áp vào pilot vì cần chốt phần thay đổi của bản đã duyệt.

Hồi quy: **265/265 test lõi, 15/15 test tài liệu và validator đạt**. Lỗi đếm file của bộ R03 cũ được ghi riêng. Chưa cài/chạy ứng dụng.

Bạn chỉ cần chốt **“Duyệt gói sửa R04”**. Tôi sẽ áp đúng bản đã kiểm, kiểm lại và trình kết quả cuối R04; không cần xin thêm phiên AI cho bản này.

Đã lưu hồ sơ và đồng bộ GitHub.

<oai-mem-citation>
<citation_entries>
MEMORY.md:473-473|note=[Use current approved sources rather than forgotten Kidea decisions]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>
