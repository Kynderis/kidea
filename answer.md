Đã ghi nhận **duyệt quản trị R04**. Tôi đã soạn xong [gói kiến trúc](D:/Code/kynderis/kidea-workshop-pilot/docs/design/architecture.md), gom 7 điểm cần chốt:

| Mục | Đề xuất, nói đơn giản |
|---|---|
| K1 — Bộ khung | Một backend C++ và SQLite lưu dữ liệu; giữ web, Android và iOS như đã chốt. Không tách nhiều dịch vụ. |
| K2 — Lưu chắc | Lưu thay đổi, kết quả và dấu thao tác cùng nhau; sập giữa chừng vẫn biết việc cập nhật nào còn thiếu. |
| K3 — Mất phản hồi | Mỗi lần admin thao tác có mã để tra kết quả. Không tự gửi lại hoặc đoán thành công bằng tên workshop. |
| K4 — Hai bản sửa | Chỉ gửi trường vừa sửa. **Nếu cùng sửa một trường, lần máy chủ xử lý sau thắng**; không khóa form. |
| K5 — Quyền truy cập | Kết nối HTTPS; máy chủ kiểm quyền, không tin vai trò client tự khai. Không tự cài chứng chỉ lên máy bạn. |
| K6 — Sao lưu | Đề xuất mỗi 5 phút sang nơi độc lập máy chủ. Phục hồi phải chặn yêu cầu cũ tự chạy lại. Chưa cần dựng VM trên ổ C. |
| K7 — Cảnh báo | Màn dự phòng chạy độc lập máy chủ trong phiên thử; không thêm dịch vụ trả phí hoặc yêu cầu trực 24/7. |

Đã kiểm: **13/13 test tài liệu, 777 liên kết hợp lệ**. Bộ test R03 cũ còn 1 lỗi đếm file vì nay có thêm 5 thiết kế; đã ghi rõ, không che thành PASS. **Chưa cài/chạy ứng dụng; hiệu năng và phục hồi chưa được đo.**

Bạn có thể chốt: **“Duyệt kiến trúc R04”** hoặc sửa mục cụ thể. Sau đó tôi sẽ tích hợp hướng dẫn vào Kidea, chạy hồi quy và phiên kiểm độc lập đã được cấp, rồi báo kết quả cuối R04.

Đã lưu hồ sơ và đồng bộ lên GitHub.

<oai-mem-citation>
<citation_entries>
MEMORY.md:473-473|note=[Use current approved sources rather than forgotten Kidea decisions]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>
