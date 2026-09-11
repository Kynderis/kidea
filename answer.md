Đã chốt hai quy ước về **version từng thành phần và tag phát hành**, đồng thời đồng bộ tài liệu.

**Tiếp theo: thống nhất cách lưu hồ sơ phát hành.** Mình đề xuất tách hai phần:

**1. Hồ sơ của bản định phát hành — “Chúng ta chọn đưa bản nào lên?”**

Mỗi bản sản phẩm, chẳng hạn **1.1.0**, có một hồ sơ chỉ rõ:

- Đúng gói web/backend/app nào, lấy từ bản nguồn nào.
- Cấu hình, bộ script và phần cập nhật dữ liệu sẽ dùng.
- Kết quả kiểm tra, xác nhận của bạn, thứ tự triển khai và cách xử lý nếu lỗi.

Hồ sơ dẫn đến tài liệu/bằng chứng đã có, không sao chép mọi thứ hoặc chứa mật khẩu. Khi bạn đã duyệt, không được âm thầm đổi gói hay cấu hình; thay đổi phải được ghi nhận và kiểm tra lại đúng phạm vi.

**2. Nhật ký từng lần triển khai — “Thực tế đã xảy ra chuyện gì?”**

Mỗi lần chạy ghi rõ triển khai đến đâu, dùng bản nào, lúc nào, bước nào thành công/thất bại/chưa xác nhận và kết quả kiểm tra sau triển khai. Giữ cả lần lỗi và lần thử tiếp, không xóa dấu vết để chỉ còn kết quả đẹp.

Ví dụ: **chọn bản 1.1.0, web cập nhật thành công nhưng backend lỗi** → ghi đúng tình trạng từng bên, không báo cả hệ thống đã lên 1.1.0. Nếu mất kết nối, kiểm tra thực tế trước khi chạy lại.

Nói ngắn gọn: **hồ sơ bản phát hành ghi điều được chọn; nhật ký triển khai ghi điều đã xảy ra.**

Bạn duyệt cách tổ chức này nhé? [Gói đang trình trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current). Hiện chưa tạo tag hoặc triển khai hệ thống.

<oai-mem-citation>
<citation_entries>
MEMORY.md:52-52|note=[repository scoped answer publication reverified]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
