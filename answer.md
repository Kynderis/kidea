Đã sửa mã, đồng bộ tài liệu và đẩy lên `master`:

- Chỉ hỗ trợ thư mục local; loại ổ mạng/iCloud/OneDrive khỏi phạm vi.
- Bỏ khóa Windows, bản Node cố định và đường dẫn Git cố định. Windows/Mac dùng chung helper, yêu cầu Node ≥24.
- Giữ kiểm quyền ghi, chống ghi đè, bản trước và xử lý ghi dở.
- Backend theo Docker local; cloud khi bạn cấp máy. Chưa cài thêm Docker/VM hoặc SDK.

Kiểm chứng: **283/283 ca trên mỗi bản Node 24.19 và 24.21**, cùng **24/24 ca tài liệu** đều đạt. [Báo cáo chi tiết](D:/Code/kynderis/kidea/tests/evidence/local-portability-r1.md).

**Còn kiểm trên Mac thật**, chưa thể nhận Windows PASS thay cho Mac Intel/Apple Silicon. Để làm tiếp trên MacBook của bạn, tôi cần cách kết nối tới máy, hoặc bạn chạy theo [hướng dẫn một lệnh kiểm](D:/Code/kynderis/kidea/tests/local-portability/README.md) rồi gửi kết quả. Không cần duyệt lại thiết kế.
<oai-mem-citation>
<citation_entries>
MEMORY.md:482-482|note=[Use current code and approved documents rather than forgotten Kidea decisions]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>
