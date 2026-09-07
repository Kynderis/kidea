Mình đã dùng Exa rà 55 kết quả qua bốn nhánh nghiên cứu và đối chiếu tài liệu chính thức. **Hướng mình đề xuất: Android dùng Kotlin, iOS dùng Swift, web ưu tiên HTML nhẹ; SEO trở thành yêu cầu xuyên suốt, có điểm duyệt riêng.**

## 1. Công nghệ mobile và web

| Thành phần | Đề xuất | Lý do |
|---|---|---|
| Android | **Kotlin + Jetpack Compose** | Phù hợp codebase native mới và định hướng Kotlin/Compose-first hiện tại của Android. [Kotlin](https://developer.android.com/kotlin/first), [Compose](https://developer.android.com/develop/ui/compose/first). |
| iOS | **Swift + SwiftUI** | Nền native; có thể tích hợp UIKit cho thành phần đặc thù. [SwiftUI](https://developer.apple.com/swiftui/), [UIKit integration](https://developer.apple.com/documentation/swiftui/uikit-integration). |
| Web công khai, SEO là trọng tâm | **Astro + TypeScript**, thêm Svelte khi cần | Phần lớn trang là HTML; chỉ tải JavaScript cho các vùng tương tác cần thiết, gọi là “islands”. [Astro islands](https://docs.astro.build/en/concepts/islands/). |

Với mobile, mình không đề xuất dùng công cụ đồ họa nặng cho mọi màn hình. UI/animation thông thường dùng nền tảng UI; phần đồ họa chuyên biệt mới cân nhắc giải pháp riêng, chẳng hạn [Metal trên iOS](https://developer.apple.com/metal/).

**“Chạy tốt trên máy yếu” phải được kiểm chứng**, không thể bảo đảm chỉ bằng Kotlin/Swift. Ta cần chốt thiết bị thấp nhất, tình huống sử dụng, rồi đo độ giật, khởi động, bộ nhớ, dung lượng và pin trên bản release. Compose có chi phí khởi động; Baseline Profiles là một hướng tối ưu cần đo thực tế. [Android performance](https://developer.android.com/develop/ui/compose/performance/baseline-profiles).

Một ràng buộc quan trọng: **Kidea chạy Windows, nhưng build/test/sign iOS cần Mac hoặc Mac CI phù hợp**, vì Xcode chạy trên macOS. [Yêu cầu Xcode](https://developer.apple.com/xcode/system-requirements/).

Với web:

- Nếu chủ yếu giới thiệu sản phẩm, nội dung công khai và thu hút khách từ tìm kiếm: mình nghiêng về **Astro**.
- Nếu chủ yếu là ứng dụng tương tác nhiều màn hình/trạng thái: cân nhắc **SvelteKit + TypeScript**, giữ HTML phía máy chủ cho trang cần SEO. Không mặc định phải dùng cả hai framework. [SvelteKit SEO](https://svelte.dev/docs/kit/seo).
- Backend C++20 vẫn giữ nguyên. Astro xuất tĩnh không cần server JavaScript khi phục vụ; nếu tạo trang động phía máy chủ, cần runtime/adapter tương ứng, có thể thêm Node. [Astro rendering](https://docs.astro.build/en/guides/on-demand-rendering/).

## 2. SEO tốt có xung đột với web mượt không?

**Thông thường không; nhiều tối ưu giúp cả hai:** nội dung xuất hiện sớm, ít JavaScript, ảnh hợp lý và phản hồi nhanh. Google có thể xử lý JavaScript, nhưng vẫn khuyến nghị HTML tạo sẵn hoặc tạo phía máy chủ; không phải mọi bot đều chạy JavaScript. [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

Xung đột thường đến từ hiệu ứng quá nặng hoặc nội dung chỉ xuất hiện sau thao tác. Mình đề xuất: **nội dung và chức năng chính luôn truy cập được; hiệu ứng bổ sung sau.** Nếu phải giảm bớt, giảm hiệu ứng trang trí theo ưu tiên SEO bạn đã chọn.

Để được Google/Bing và AI search tìm thấy, cần ba lớp:

1. **Nội dung hữu ích, đáng tin:** trả lời đúng nhu cầu, thông tin sản phẩm rõ và nhất quán; không chỉ tối ưu mã nguồn. Google xác nhận nền tảng SEO vẫn áp dụng cho tính năng AI, không yêu cầu một “markup AI” đặc biệt. [Google AI optimization](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
2. **Website dễ thu thập và hiểu:** HTML, URL/liên kết, metadata, sitemap và dữ liệu có cấu trúc đúng nội dung. Bing cũng áp dụng nền tảng crawl/index cho Copilot; IndexNow giúp thông báo URL thay đổi. [Bing guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a).
3. **Không vô tình chặn bot tìm kiếm:** kiểm tra robots và lớp bảo vệ website cho OAI-SearchBot/PerplexityBot. Quyền cho bot tìm kiếm **khác** quyền cho bot huấn luyện. [OpenAI bots](https://developers.openai.com/api/docs/bots), [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

Không công nghệ hay cấu hình nào bảo đảm lên hạng hoặc được AI trích dẫn. Mục tiêu là tăng khả năng tiếp cận và chất lượng nội dung công khai, không mở dữ liệu riêng tư để lấy SEO.

## 3. Nên đưa SEO vào quy trình thế nào?

Mình đề xuất **giữ 10 bước, bổ sung hai điểm Human duyệt rõ ràng**:

| Điểm duyệt | Nội dung |
|---|---|
| Trong bước 4, trước kiến trúc | Duyệt thiết kế SEO: người tìm, nội dung cần tìm thấy, cấu trúc trang/URL và cách tiếp cận |
| Trong bước 10, trước phát hành công khai | Duyệt sẵn sàng SEO: nội dung, HTML, metadata, liên kết và cấu hình crawler |

Yêu cầu SEO được nhận diện từ bước 1, có tiêu chí ở bước 3, đi vào kiến trúc/test/code và được theo dõi sau deploy. **Không để đến cuối mới “làm SEO”.** Kết quả được index hoặc AI trích dẫn phải quan sát sau khi công khai, không thể lấy test local thay thế.

## 4. Những điểm bạn đã chốt

Mình đã cập nhật vào thiết kế:

- Kidea chạy **Windows**; backend **C++20 → Ubuntu**; Android/iOS native, code độc lập.
- Không định hướng xây nền tảng nhiều người hoặc dịch vụ Kidea online. Cụm orchestrator–agent được ghi riêng ở mức **Idea**, ngoài bản đầu.
- Dùng Git chuyển **cả `.kidea` và source**. Sau pull, resume tự đọc và kiểm tra hồ sơ; không tự pull/push, bỏ qua conflict hay tin một dòng trạng thái.
- Dự án cũ vẫn đi từ **bước 1 và đủ gate**; tài liệu/code hiện có chỉ giúp bổ sung context.

Theo hướng dẫn skill-creator, phần công nghệ được tách khỏi lõi quy trình dùng lại. **P01-T01 đã hoàn tất; P01-T02 đang làm rõ**, chưa code/cài skill và chưa coi các stack đề xuất là đã duyệt.

Đã kiểm tra liên kết/trạng thái và đẩy tài liệu cùng câu trả lời lên `origin/master`: [thiết kế](D:/Code/kynderis/kidea/KIDEA_DESIGN.md), [roadmap](D:/Code/kynderis/kidea/KIDEA_ROADMAP.md), [bản tư vấn đầy đủ trên GitHub](https://github.com/Kynderis/kidea/blob/master/exa-results/kidea-platform-seo-2026-09-07.md).

Bạn duyệt hướng mobile và cách tích hợp SEO này để mình tiếp tục hoàn thiện ma trận công nghệ trong P01-T02 nhé?

<oai-mem-citation>
<citation_entries>
MEMORY.md:319-320|note=[preserve Human gates and scoped answer mirror]
MEMORY.md:326-328|note=[keep design and roadmap authoritative and verify publication]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
