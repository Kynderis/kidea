Đã ghi nhận **O1–O6 được duyệt** và hoàn thành [thiết kế quản trị](D:/Code/kynderis/kidea-workshop-pilot/docs/design/admin.md).

Gói cần chốt:

| Mục | Đề xuất |
|---|---|
| A1 — Phạm vi | Chỉ quản trị workshop trên web; không thêm xóa workshop, hủy hộ hoặc xem danh tính người tham gia. |
| A2 — Tạo/sửa | Tạo luôn là bản nháp. Lưu nội dung và xuất bản là hai thao tác riêng, tránh vô tình mở đăng ký. |
| A3 — Xác nhận | Xác nhận trước xuất bản/tạm dừng/mở lại, giảm sức chứa hoặc đổi lịch khi có người đăng ký. Sửa chữ thông thường không hỏi thêm. |
| A4 — Lỗi/mất mạng | Không tự gửi lại hoặc ghi đè khi kết quả chưa rõ. Ví dụ: tạo bị mất phản hồi thì không tự tạo thêm một workshop. |
| A5 — Dấu thao tác | Giữ được **ai làm gì, khi nào, kết quả ra sao** trước khi báo thành công cuối; không lưu toàn bộ dữ liệu nhập hoặc secret. |
| A6 — Lưu giữ | Giữ dấu thao tác suốt vòng đời lab trong ngân sách đã duyệt; không tự xóa khi thiếu dung lượng, không mở thêm trang xem log. |

**Kiểm tài liệu đạt 12/12, 659 liên kết hợp lệ**; [bằng chứng](D:/Code/kynderis/kidea/tests/evidence/r04/design-r1.md) đã đẩy lên GitHub. Chưa xây ứng dụng hoặc dùng phiên AI độc lập.

Nếu đồng ý, chốt **“Duyệt thiết kế quản trị R04”**; tôi sẽ làm phần kiến trúc, gồm cả cách xử lý yêu cầu admin chưa rõ kết quả và bảo toàn dấu thao tác.
<oai-mem-citation>
<citation_entries>
MEMORY.md:473-473|note=[Use current approved sources rather than forgotten Kidea decisions]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>
