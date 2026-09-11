Đã ghi nhận duyệt cách đánh số phiên bản và đồng bộ tài liệu.

**Tiếp theo có hai quy ước nhỏ cần chốt:**

**1. Thành phần phát hành độc lập có version riêng.**

Ví dụ bản sản phẩm **1.1.0** gồm:

- Web **1.1.0** — vừa thêm chức năng.
- Backend **1.0.0** — giữ nguyên vì không thay đổi.

Mình đề xuất dùng cùng nguyên tắc lớn.nhỏ.vá cho từng thành phần, theo những gì thành phần đó cam kết giữ tương thích. Không bắt tất cả tăng số theo sản phẩm.

Ngoài version, mỗi gói build cần dấu nhận diện riêng để biết chính xác file nào đã kiểm tra. Với Android/iOS, số build tuân theo quy định của nền tảng; không ép mọi nơi dùng cùng một định dạng.

**2. Tag bản phát hành đặt theo dạng `v<version>`.**

Ví dụ `v1.1.0` là “dấu mốc” trong Git cho bản nguồn được chọn phát hành sản phẩm 1.1.0.

Chỉ tạo khi bạn đã chọn bản, đủ kiểm chứng và có quyền thao tác; không tạo sau mỗi lần sửa. Tag đã phát hành không được chuyển sang nội dung khác.

**Tag đánh dấu source, không thay gói build và không có nghĩa production đã cập nhật.** Hồ sơ phát hành vẫn phải ghi đúng gói web, backend, cấu hình và kết quả triển khai.

Bạn duyệt hai quy ước này nhé? Sau đó mình trình phần hồ sơ phát hành: cần ghi những gì để không nhầm bản đã kiểm tra với bản thực sự đang chạy.

[Gói đang trình trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current). Hiện chỉ cập nhật tài liệu, chưa tạo tag hoặc deploy.

<oai-mem-citation>
<citation_entries>
MEMORY.md:52-52|note=[repository scoped answer publication reverified]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
