**Với loại sản phẩm bạn mô tả, mình chọn SvelteKit + TypeScript làm nền web chính, chưa thêm Astro. Với iOS, hãy tận dụng MacBook và iPhone hiện có trước; chưa bắt buộc mua Mac mini ngay.**

Mình đã đối chiếu 35 kết quả qua ba nhánh nghiên cứu bằng Exa, đặc biệt kiểm tra giới hạn Xcode trên Mac Intel.

## 1. Web lớn, realtime nhưng vẫn SEO: chọn một SvelteKit

Thông tin mới làm lựa chọn rõ hơn: đây là **ứng dụng lớn có nội dung công khai và dữ liệu động**, không phải website nội dung có thêm vài widget.

| Loại trang | Cách triển khai mình đề xuất |
|---|---|
| Giới thiệu sàn, sản phẩm, bài viết ít đổi | **Prerender:** tạo sẵn HTML |
| Giá BTC/USDT, giá vàng cần SEO | **SSR:** tạo HTML với dữ liệu ban đầu; sau đó cập nhật realtime |
| Biểu đồ, order book, giao diện giao dịch | Tương tác phía trình duyệt, chỉ tải thành phần nặng khi cần |
| Tài khoản, dữ liệu cá nhân | Xác thực/phân quyền; không đưa vào nội dung SEO |

SvelteKit hỗ trợ phối hợp các cách render theo từng route trong cùng hệ thống. Vì vậy, **không cần Astro chỉ để có SEO**. [SvelteKit page options](https://svelte.dev/docs/kit/page-options), [SEO](https://svelte.dev/docs/kit/seo).

Ví dụ trang BTC/USDT:

- Khi mở trang, người dùng và crawler nhận ngay HTML có tên cặp, giá, đơn vị, thời điểm cập nhật và nội dung liên quan.
- Sau đó, trình duyệt nhận dữ liệu realtime để cập nhật giá/biểu đồ.
- **Không render lại toàn trang trên server mỗi lần giá đổi**, cũng không trả trang rỗng chỉ có khung biểu đồ.

Backend **C++20 vẫn sở hữu dữ liệu và nghiệp vụ**. SvelteKit đảm nhiệm web và phần tạo HTML; triển khai SSR cần runtime phù hợp, chẳng hạn Node. Cache phải có giới hạn độ cũ, mất kết nối phải báo rõ, dữ liệu cá nhân không được cache chung.

**Đây là phương án mình đánh giá hợp lý nhất cho nhu cầu hiện tại:** một hệ routing, UI, đăng nhập và triển khai; vẫn đáp ứng trang tĩnh, động và SEO. Không khẳng định nhanh nhất trong mọi benchmark. Astro chỉ nên xem xét lại nếu sau này có một khu nội dung thực sự độc lập, đáng tách riêng.

## 2. MacBook Pro 2019 và iPhone 12 Pro Max có dùng được không?

### MacBook: có thể bắt đầu, nhưng phải biết đúng phiên bản

| MacBook Pro 2019 | Khả năng theo hỗ trợ hiện tại |
|---|---|
| **16 inch** | Hỗ trợ macOS Tahoe; có đường chạy **Xcode 26.6** khi macOS phù hợp |
| **13 hoặc 15 inch** | Hỗ trợ Sequoia, không nằm trong danh sách Tahoe; có thể dùng **Xcode 26.3 trên Sequoia 15.6**, nhưng không đáp ứng OS của Xcode 26.6 |

Nguồn: [Mac hỗ trợ Tahoe](https://support.apple.com/en-us/122867), [Sequoia](https://support.apple.com/en-us/120282), [yêu cầu Xcode](https://developer.apple.com/xcode/system-requirements/).

**Giới hạn quan trọng:** tài liệu **Xcode 27, hiện ở giai đoạn beta**, ghi rõ chỉ cài và chạy trên **Apple Silicon**. Kể cả MacBook Intel 16 inch chạy Tahoe cũng không vượt qua giới hạn này. [Xcode 27 — Intel Deprecation](https://developer.apple.com/documentation/xcode-release-notes/xcode-27-release-notes).

Vì vậy:

- **Dùng trước mắt:** có thể, với toolchain tương thích; còn phải biết RAM, macOS và dung lượng trống.
- **Dùng dài hạn cho công cụ mới:** không nên dựa vào Intel 2019.
- Khi cần Xcode 27, cần **quyền sử dụng Mac Apple Silicon**—máy riêng, máy thuê hoặc CI phù hợp; **không bắt buộc phải mua Mac mini**.

### iPhone: giữ lại, chưa cần mua mới

**iPhone 12 Pro Max phù hợp để bắt đầu test trên thiết bị thật**, và được Apple liệt kê hỗ trợ iOS 26. [Danh sách tương thích](https://support.apple.com/en-gb/guide/iphone/iphe3fa5df43/26/ios/26).

Ta có thể dùng nó để kiểm tra giao diện, phản hồi và hiệu năng thực. Tuy nhiên, một máy chưa chứng minh app chạy tốt trên toàn bộ nhóm “máy yếu”; sau này phải chốt thêm thiết bị thấp nhất cần hỗ trợ.

## 3. Nếu mua Mac mini, mình chọn cấu hình nào?

**Lựa chọn chính: Mac mini M6 — RAM 32 GB — SSD 1 TB.**

Đây là cấu hình mình đề xuất cho IDE, simulator, build cache và đa nhiệm của dự án lớn; **không phải mức tối thiểu bắt buộc**.

| Nhu cầu | Cấu hình |
|---|---|
| Cân bằng để làm việc lâu dài | **M6 / 32 GB / 1 TB** |
| Tiết kiệm, Mac chủ yếu phục vụ iOS | **M6 / 24 GB / 512 GB** |
| Thường xuyên chạy nhiều bộ công cụ/build hoặc đồ họa chuyên sâu | Cân nhắc **M5 Pro / 48 GB / 1 TB** |

Các lựa chọn RAM/SSD này nằm trong [thông số Apple công bố](https://www.apple.com/vn/mac-mini/specs/). Mình **chưa thấy lý do bắt buộc lên Pro** chỉ vì ứng dụng cần hiệu ứng mượt; hiệu năng ứng dụng vẫn phải đo trên iPhone.

**Lưu ý thời điểm mua:** Apple công bố M6/M5 Pro ngày 25/08/2026, thông báo bắt đầu có hàng từ 22/09 ở các thị trường được nêu. Trang Việt Nam hiện ghi chờ hàng; mình chưa xác minh được giá Việt Nam cho cấu hình tùy chọn nên không đưa giá ước đoán. [Thông báo Apple](https://www.apple.com/newsroom/2026/08/apple-unveils-a-more-powerful-mac-mini-featuring-the-all-new-m6-and-m5-pro/).

**Link chính thức:** [Mua và chọn cấu hình Mac mini tại Apple Việt Nam](https://www.apple.com/vn/shop/buy-mac/mac-mini).

Trước khi quyết định mua, bạn cho mình biết **MacBook là bản 13/15/16 inch, RAM bao nhiêu và macOS hiện tại** nhé. Mình ưu tiên xác định phần máy cũ còn làm được, rồi mới đề xuất chi tiền.

Đã lưu và đẩy [bản phân tích đầy đủ](https://github.com/Kynderis/kidea/blob/master/exa-results/realtime-web-ios-hardware-2026-09-07.md) cùng câu trả lời lên GitHub. Chưa thay trạng thái roadmap, cài công cụ hay mua thiết bị.

<oai-mem-citation>
<citation_entries>
MEMORY.md:319-320|note=[preserve approval boundaries and scoped answer mirror]
MEMORY.md:326-328|note=[keep roadmap state and verify published response]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
