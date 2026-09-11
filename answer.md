Đã ghi nhận duyệt hai quy tắc và khép phần **lưu/khôi phục việc dang dở**. Thiết kế, lộ trình và các ca kiểm tra liên quan đã được đồng bộ; chưa chạy skill hoặc pilot.

**Tiếp theo là cách đánh số phiên bản sản phẩm.** Lần này chỉ cần chốt một lựa chọn.

Mình đề xuất dùng ba số, ví dụ `1.0.0`:

| Loại thay đổi | Ví dụ phiên bản mới |
|---|---|
| Sửa lỗi, vẫn giữ cách dùng/kết nối cũ | `1.0.0 → 1.0.1` |
| Thêm chức năng, vẫn tương thích với bản cũ | `1.0.1 → 1.1.0` |
| Thay đổi khiến cách dùng/kết nối cũ không còn hoạt động | `1.1.0 → 2.0.0` |

Đây là nguyên tắc của [SemVer](https://semver.org/spec/v2.0.0.html). Ví dụ bỏ API mà ứng dụng cũ đang dùng là thay đổi phá tương thích; sửa nhiều dòng code chưa chắc là thay đổi loại này. Project cần xác định rõ những gì cam kết giữ tương thích.

**Số phiên bản chung không bắt mọi thành phần phải build lại.** Chẳng hạn bản sản phẩm 1.1.0 chỉ đổi web thì hồ sơ phát hành ghi web mới đi cùng đúng gói backend cũ. Các quy tắc nhận diện gói, tag và phiên bản riêng từng nền sẽ được trình tiếp.

Đây là phương án mặc định cho project mới; project có quy ước phù hợp vẫn có thể giữ sau đối chiếu. Bản thử ban đầu có thể dùng `0.x.y`, nhưng không được bỏ các kiểm tra đã chốt.

Bạn duyệt cách đánh số này nhé? [Gói đang trình trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current).

<oai-mem-citation>
<citation_entries>
MEMORY.md:52-52|note=[repository scoped answer publication reverified]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
