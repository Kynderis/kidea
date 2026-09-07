# Tiêu chí kiến trúc web SEO-first

Ngày đối chiếu: 2026-09-07. Tư vấn tiếp nối: Human ưu tiên SEO tối đa cho website lớn, cả trang động/tĩnh, chấp nhận phức tạp nếu có lợi ích. Đọc trực tiếp nguồn chính thức bằng skill Search/Exa; không chạy benchmark hoặc đánh giá website thực.

## Đề xuất

SvelteKit + TypeScript làm nền web; prerender cho nội dung phù hợp, SSR cho trang động công khai, cập nhật realtime phía trình duyệt. C++20 giữ nghiệp vụ/dữ liệu; SSR có runtime triển khai riêng phù hợp. Đây là khuyến nghị AI, chưa phải gate công nghệ được Human duyệt. Trạng thái vẫn tại [P01-T02](../KIDEA_ROADMAP.md#p01-t02-review).

SvelteKit cung cấp các lựa chọn render theo route. Không có căn cứ trong khảo sát này để yêu cầu thêm Astro chỉ vì mục tiêu SEO. [SvelteKit page options](https://svelte.dev/docs/kit/page-options).

## Đầu ra cần chốt trước triển khai

- Danh mục loại URL: trang nào cần index, trang nào riêng tư, filter nào có giá trị tìm kiếm và filter nào không.
- Hợp đồng từng trang công khai: nội dung chính có trong HTML ban đầu, URL/canonical, metadata, trạng thái HTTP, internal links và dữ liệu có cấu trúc khi phù hợp.
- Quy tắc dữ liệu động: đơn vị, nguồn, timestamp, độ cũ cho phép, cache/invalidation, trạng thái mất luồng realtime; không gọi dữ liệu stale là live.
- Ngân sách hiệu năng theo nhóm trang và thiết bị/mạng đại diện; không dùng điểm kiểm tra local duy nhất làm bảo đảm trải nghiệm mọi người.
- Tải biểu đồ/hiệu ứng có chủ đích; tách phần cập nhật thường xuyên khỏi phần HTML/nội dung ổn định.
- Nội dung hữu ích và trách nhiệm biên tập/cập nhật; không coi hàng loạt trang chỉ thay tên hoặc giá là chiến lược SEO đầy đủ.
- Sitemap, liên kết, đa ngôn ngữ và phân trang theo phạm vi thực; xử lý URL trùng/lỗi, không áp canonical hoặc robots một cách máy móc.
- Chính sách bot tìm kiếm, CDN/WAF và quyền riêng tư; robots không thay xác thực.
- Test HTML và dữ liệu hiển thị, cùng kiểm tra crawler/index thực sau khi có quyền công khai website.
- Tách mức sẵn sàng kỹ thuật khỏi kết quả index/thứ hạng/trích dẫn AI; không coi test PASS là chứng nhận kết quả tìm kiếm.

Google cảnh báo bộ lọc sinh nhiều URL có thể gây crawl lãng phí và chậm khám phá trang có ích; cần quyết định phạm vi crawl thay vì cho index mọi tổ hợp. [Faceted navigation](https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation).

Đối với tính năng AI của Google, nguyên tắc SEO nền tảng tiếp tục áp dụng; yêu cầu nội dung hữu ích, truy cập được, văn bản quan trọng và structured data nhất quán vẫn có giá trị. Không có yêu cầu kỹ thuật bổ sung riêng cho việc đủ điều kiện xuất hiện. [Google AI features](https://developers.google.com/search/docs/appearance/ai-features).

## Thiết bị iOS được Human làm rõ

Human xác nhận MacBook Pro 16 inch 2019, RAM có thể là 16 GB, macOS dưới Tahoe nhưng chưa biết tên. Không coi RAM/phiên bản OS là đã kiểm tra. Model này hỗ trợ Tahoe; Xcode 26.6 yêu cầu Tahoe 26.2–26.x. Có thể tận dụng theo toolchain tương thích, sau khi kiểm tra máy và sao lưu trước mọi nâng cấp. [Apple compatibility](https://support.apple.com/en-us/122867), [Xcode requirements](https://developer.apple.com/xcode/system-requirements/).

Xcode 27 beta có giới hạn Apple Silicon; nâng macOS không loại bỏ giới hạn CPU này. Không cần mua máy ngay cho bước thiết kế hiện tại; khi cần toolchain 27, cần môi trường Apple Silicon phù hợp. [Intel Deprecation](https://developer.apple.com/documentation/xcode-release-notes/xcode-27-release-notes).

Không sửa thiết kế nguồn, đóng task, nâng OS hoặc mua/cài công cụ trong lượt tư vấn này.
