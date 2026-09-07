Mình đã dùng Exa rà 25 kết quả qua bốn nhánh và đối chiếu nguồn chính thức. **Android có thể phát triển trên Windows; iOS có dịch vụ Mac thuê. Còn cách chia Astro/SvelteKit của bạn hợp lý, nhưng chưa thể gọi là tối ưu nhất.**

## 1. Web: nên điều chỉnh tiêu chí chia

Điểm quan trọng: **Astro vẫn làm được tương tác/hiệu ứng; SvelteKit vẫn làm SEO tốt.** Vì vậy, không nên chia cứng “cần SEO → Astro, nhiều hiệu ứng → SvelteKit”.

Mình đề xuất:

| Loại màn hình/khu vực | Hướng ưu tiên |
|---|---|
| Trang sản phẩm, bài viết, giới thiệu; có form, bộ lọc hoặc hiệu ứng | **Astro + TypeScript**, thêm component **Svelte** khi cần |
| Khu ứng dụng nhiều màn hình, giữ trạng thái liên tục, thao tác dữ liệu phức tạp | **SvelteKit + TypeScript** |
| Web nhỏ hoặc hai khu gắn chặt với nhau | Cân nhắc **chỉ SvelteKit**, chọn cách tạo HTML theo từng route |

**Svelte khác SvelteKit:** Astro dùng được component Svelte trực tiếp, không cần dựng thêm cả SvelteKit. Ngược lại, SvelteKit cho phép trang marketing tạo sẵn HTML, trang động tạo HTML phía máy chủ và khu ứng dụng tương tác cùng tồn tại. [Astro components](https://docs.astro.build/en/guides/framework-components/), [SvelteKit page options](https://svelte.dev/docs/kit/page-options).

Nếu dùng cả hai, nên tách thành **khu nội dung và khu ứng dụng có ranh giới rõ**, không xen kẽ framework tùy từng hiệu ứng. Đổi lại, phải quản lý thêm routing, triển khai, đăng nhập và thành phần dùng chung.

**Khuyến nghị:** giữ Astro + Svelte cho khu công khai; chỉ thêm SvelteKit khi khu ứng dụng thực sự cần nó. Số lượng hiệu ứng không đủ để quyết định. Với sản phẩm nhỏ, một SvelteKit có thể tối ưu tổng thể hơn nhờ ít phức tạp—không có nghĩa hy sinh SEO.

## 2. Android trên Windows: đúng, có hỗ trợ chính thức

Android Studio hỗ trợ **Windows x64**. Tài liệu hiện tại nêu:

- RAM tối thiểu: **8 GB** cho Studio; **16 GB** nếu chạy cả emulator; khuyến nghị **32 GB**.
- Có thể dùng điện thoại Android thật thay emulator.
- Windows ARM hiện chưa được hỗ trợ theo trang yêu cầu hệ thống. [Android Studio](https://developer.android.com/studio/install).

Vì vậy, hướng **Kotlin + Compose trên Windows** là phù hợp. Mình chưa kiểm tra cấu hình máy của bạn trong lượt này nên chưa khẳng định mọi điều kiện đều đạt. Máy lập trình đủ mạnh và app chạy tốt trên điện thoại yếu là hai việc phải kiểm tra riêng.

## 3. iOS: thuê Mac được, nhưng phải chọn đúng loại

Có hai nhóm:

- **Mac remote:** điều khiển desktop macOS, mở Xcode/Simulator, lập trình và debug.
- **CI macOS:** tự động build/test/sign từ source; không phải desktop Xcode để làm việc cả ngày.

Giá tham khảo tại ngày **07/09/2026**, chưa coi là báo giá cuối:

| Dịch vụ | Phù hợp | Giá/điều kiện đáng chú ý |
|---|---|---|
| [MacinCloud Managed](https://www.macincloud.com/pages/managed.html) | Bắt đầu dùng Xcode từ Windows | M4/16 GB **từ 29 USD/tháng**; không tự quản trị toàn máy, tác vụ admin qua support |
| [MacStadium](https://macstadium.com/pricing) | Cần Mac riêng, toàn quyền | M4/16 GB niêm yết **149 USD/tháng**; cần xác nhận tồn kho và điều kiện thuê |
| [Codemagic](https://docs.codemagic.io/billing/pricing/) | Build/test tự động | Cá nhân có **500 phút M2 miễn phí/tháng**, sau đó **0,095 USD/phút**; Team không có phần miễn phí này |
| [Xcode Cloud](https://developer.apple.com/xcode-cloud/) | CI tích hợp hệ Apple | **25 giờ compute/tháng** kèm Apple Developer Program; khởi tạo workflow trong Xcode |

Codemagic hỗ trợ **native iOS**, không chỉ Flutter. [Hướng dẫn chính thức](https://docs.codemagic.io/yaml-quick-start/building-a-native-ios-app/).

### Phương án mình khuyên

**Trước mắt:** thử Mac remote ngắn hạn, chưa cần mua máy. MacinCloud có khu vực Singapore—đáng đưa vào danh sách thử từ Việt Nam, nhưng phải đo độ trễ thực, không mặc định sẽ mượt. [Vị trí máy](https://www.macincloud.com/).

Trước khi thuê, xác nhận **Xcode/Simulator đúng phiên bản, giới hạn giờ dùng, quyền cài công cụ, dung lượng và điều kiện tính phí**. Gói rẻ nhưng thiếu quyền cần thiết có thể không phù hợp.

**Nếu làm iOS thường xuyên:** mình nghiêng về **Mac mini Apple Silicon tại chỗ + iPhone thật**, dùng Windows làm máy chính nếu thích. Đây là lựa chọn thuận tiện hơn cho vòng lặp sửa–chạy–debug; chưa đủ dữ liệu để kết luận rẻ hơn thuê.

Đặc biệt với mục tiêu đồ họa/mượt:

- Video từ desktop remote **không phải số đo hiệu năng trên iPhone**.
- iPhone cắm vào Windows không tự trở thành thiết bị local của Mac thuê; cần chốt riêng cách cài bản thử và debug.
- Mac thuê/CI không thay thế toàn bộ kiểm tra trên thiết bị thật.

Apple Developer Program để phục vụ phân phối có phí **99 USD/năm**, tách khỏi tiền thuê Mac. [Apple membership](https://developer.apple.com/programs/whats-included/).

Phần bạn đã đồng ý được giữ nguyên. Lượt này chỉ tư vấn, **chưa chốt thêm kiến trúc, thuê dịch vụ hay đóng P01-T02**. Mình đã lưu và đẩy [bản nghiên cứu đầy đủ](https://github.com/Kynderis/kidea/blob/master/exa-results/web-split-ios-remote-2026-09-07.md) cùng câu trả lời lên GitHub.

<oai-mem-citation>
<citation_entries>
MEMORY.md:319-320|note=[preserve approval boundaries and scoped answer mirror]
MEMORY.md:326-328|note=[keep authoritative design and roadmap unchanged during advice]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
