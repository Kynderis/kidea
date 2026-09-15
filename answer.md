Đã ghi nhận **UX1–UX6 được duyệt** và hoàn thành [thiết kế theo dõi vận hành](D:/Code/kynderis/kidea-workshop-pilot/docs/design/operations.md).

Gói cần chốt:

| Mục | Đề xuất |
|---|---|
| O1 — Cần xem gì | Một màn hình admin xem cập nhật tồn đọng/lỗi, độ trễ, mất tín hiệu, dung lượng và tình trạng sao lưu. |
| O2 — Khi nào báo | Quá 5 giây không có quan sát hợp lệ thì báo **“Không rõ”**; cập nhật chờ quá 5 giây cảnh báo, từ 30 giây báo nghiêm trọng. |
| O3 — Giám sát bị hỏng | Có đường hiển thị cảnh báo dự phòng, không phụ thuộc dashboard chính hoặc phiên AI. Chưa chọn hay cài công cụ. |
| O4 — Ai xử lý | Đề xuất bạn phụ trách **chỉ trong phiên thử đã xác nhận**, không trực 24/7. Lỗi nghiêm trọng thì dừng bài thử để kiểm tra. |
| O5 — Không báo dồn | Gom lỗi cùng loại; báo khi phát sinh, tăng mức hoặc khôi phục. Lỗi nghiêm trọng còn tồn tại nhắc mỗi 5 phút. |
| O6 — Không tự sửa | Màn vận hành chỉ xem/làm mới; không tự phát lại yêu cầu, xóa dữ liệu, khởi động lại hay phục hồi. Cảnh báo không chứa dữ liệu riêng hoặc secret. |

**Kiểm tài liệu đạt 11/11, 551 liên kết hợp lệ**; [bằng chứng](D:/Code/kynderis/kidea/tests/evidence/r04/design-r1.md) đã đẩy lên GitHub. Chưa chạy giám sát thật hoặc dùng phiên AI độc lập.

Nếu đồng ý, chốt **“Duyệt thiết kế vận hành R04”**; tôi tiếp tục phần quản trị theo quyền đã cấp.
<oai-mem-citation>
<citation_entries>
MEMORY.md:473-473|note=[Use current approved sources rather than forgotten Kidea decisions]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>
