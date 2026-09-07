Đã chuẩn bị **P01-T05-QUALITY-r1**, gồm 10 nhóm tiêu chí để bạn duyệt. Toàn bộ nằm trong [bộ tiêu chí chất lượng](https://github.com/Kynderis/kidea/blob/master/KIDEA_QUALITY.md).

### Các mức mình đề xuất

**1. Đúng và an toàn là bắt buộc**

Không chấp nhận mất dữ liệu, ghi ngoài quyền, tự vượt bước duyệt hoặc báo PASS sai trong bộ thử. Có lỗi thì sửa và kiểm tra lại; không lấy tốc độ tốt để bù.

Resume phải tìm đúng việc đang dở, giữ quyết định/bằng chứng và không tự chạy lại thao tác chưa rõ kết quả. Phân tích thay đổi phải bắt đủ ảnh hưởng đã xác định trong bộ mẫu, kể cả nơi không đổi code.

**2. Tốc độ công cụ có ngưỡng cụ thể**

| Thao tác | Hồ sơ nhỏ: 100 task, 1 MiB | Hồ sơ vừa: 1.000 task, 10 MiB |
|---|---:|---:|
| Đọc/kiểm tra hồ sơ, tạo dữ liệu trạng thái | ≤ 2 giây | ≤ 5 giây |
| Sinh giao diện tiến độ | ≤ 3 giây | ≤ 10 giây |

Đây là **mức đề xuất, chưa đo**. Mỗi phép đo chạy 11 lần trên máy Windows tham chiếu, lưu tất cả kết quả. Không tính thời gian AI trả lời, chờ bạn, Git hoặc build sản phẩm vào các ngưỡng này.

**3. Bằng chứng phải kiểm tra lại được**

- Mọi biến thể bắt buộc phải đạt; thiếu môi trường hoặc bỏ chạy không được tính là đạt.
- Các tình huống AI trọng yếu—duyệt, quyền, resume và báo kết quả—phải đạt **3 lần độc lập ở phiên mới**.
- Lưu rõ đã thử gì, trên phiên bản/môi trường nào, kết quả trước/sau và giới hạn.
- Test công cụ không thay thử hành vi AI; thử AI không thay kiểm chứng pilot và thiết bị thật.

Mục tiêu là đủ chặt để bắt lỗi quan trọng, nhưng không biến bản đầu thành cam kết “không bao giờ sai” hoặc phải nhanh trên mọi máy.

### Trạng thái

Đã rà liên kết với 30 nhóm kịch bản, kiểm tra tài liệu và cập nhật GitHub. **Chưa chạy benchmark hoặc test Kidea. P01-T05 vẫn IN_PROGRESS**, chờ bạn duyệt.

Bạn duyệt gói r1 với các mức trên chứ?

<oai-mem-citation>
<citation_entries>
MEMORY.md:319-320|note=[preserve Human gate and scoped answer mirror]
MEMORY.md:328-328|note=[verify GitHub publication]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
