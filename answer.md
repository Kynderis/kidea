**Đúng, P01-T01 đã xong (DONE). P01-T02 đang thực hiện.** Và đúng như bạn nói: MacBook chỉ chốt phương án sử dụng; **đến lúc làm iOS mới kiểm tra và nâng macOS nếu cần**, không phải làm ngay.

### P01-T02 làm gì?

Chốt **Kidea bản đầu sẽ hướng dẫn phát triển trên những nền tảng/công nghệ nào, dùng môi trường nào và còn gì cần kiểm chứng**. Đây là bước thiết kế, không phải bước cài công cụ hay xây ứng dụng.

Hiện đã chốt:

| Thành phần | Quyết định |
|---|---|
| Kidea | Chạy trên Windows |
| Backend sản phẩm | C++20, triển khai Ubuntu |
| Web | SvelteKit + TypeScript; prerender/SSR và realtime; SEO và hiệu năng xuyên suốt |
| Mobile | Android/iOS native, code độc lập |
| Thiết bị iOS | Tận dụng MacBook và iPhone hiện có; chuẩn bị môi trường khi đến lúc làm |

### Bạn còn cần xác nhận gì?

**Còn hai nhóm quyết định:**

1. **Công nghệ mobile cụ thể:** Android dùng **Kotlin + Jetpack Compose**; iOS dùng **Swift + SwiftUI**. Chỉ bổ sung công nghệ giao diện/đồ họa chuyên biệt khi có nhu cầu và bằng chứng cần thiết.
2. **Cách đưa SEO vào quy trình:** giữ nguyên mười bước, tích hợp SEO xuyên suốt và thêm hai điểm duyệt:
   - Duyệt **thiết kế SEO** ở bước 4, trước kiến trúc.
   - Duyệt **sẵn sàng SEO** ở bước 10, trước phát hành công khai.

Nhóm 2 khác với việc chọn SvelteKit: đây là xác nhận **cách tổ chức quy trình và điểm duyệt**, không phải chọn lại giải pháp web.

**Bạn không cần tự chọn từng phiên bản SDK/compiler/runtime.** Mình sẽ hoàn thiện bảng đề xuất, ghi rõ môi trường dự kiến, phần kiểm chứng để sau và quyền cần xin khi thực hiện; sau đó đưa bạn duyệt đầu ra P01-T02 một lần trước khi đóng task.

Bạn xác nhận giúp mình **hai nhóm quyết định trên** nhé. Sau khi hoàn thiện và duyệt P01-T02, bước tiếp theo là **P01-T03: chọn một sản phẩm pilot nhỏ để kiểm chứng Kidea**.

Đã cập nhật cách xử lý MacBook vào tài liệu và đồng bộ GitHub; chưa nâng cấp hay cài đặt gì.

<oai-mem-citation>
<citation_entries>
MEMORY.md:319-320|note=[preserve sequential Human gates and scoped answer mirror]
MEMORY.md:328-328|note=[verify public answer publication]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
