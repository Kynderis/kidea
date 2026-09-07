# Tư vấn nền tảng native/web và SEO cho Kidea

Ngày đối chiếu nguồn: 2026-09-07. Dùng Exa rà 55 kết quả tìm kiếm qua bốn nhánh mobile, web, SEO và AI search; loại trùng và ưu tiên tài liệu chính thức. Con số 55 là tổng kết quả tìm kiếm được rà, không phải 55 nguồn độc lập đã xác minh. Đã mở 19 URL tài liệu chính thức để kiểm tra các luận điểm liên quan; nguồn cho từng kết luận được dẫn ngay bên dưới.

Đây là bản nghiên cứu phục vụ lựa chọn, không phải benchmark hoặc xác nhận hỗ trợ. Quyết định hiện hành và đề xuất chờ duyệt chỉ nằm trong [thiết kế](../KIDEA_DESIGN.md#platform-matrix); trạng thái công việc chỉ nằm trong [roadmap](../KIDEA_ROADMAP.md#p01-t02-review).

## 1. Kết luận đề xuất

| Phần | Hướng ưu tiên | Điều kiện/giới hạn |
|---|---|---|
| Android native | Kotlin + Jetpack Compose | Đo trên thiết bị yếu; không mặc định UI khai báo luôn nhẹ nhất |
| iOS native | Swift + SwiftUI | UIKit cho nhu cầu cụ thể; Metal chỉ khi thật sự có bài toán GPU/đồ họa nặng |
| Web công khai, ưu tiên SEO | Astro + TypeScript; HTML/CSS trước, Svelte islands khi cần | Nội dung quan trọng có sẵn trong HTML; không biến toàn trang thành ứng dụng chỉ xuất hiện sau JavaScript |
| Web thiên về ứng dụng tương tác | SvelteKit + TypeScript, giữ SSR cho trang cần được tìm thấy | Đây là nhánh thay thế theo nhu cầu, không đề xuất mặc định dùng cả hai framework |
| Cách đưa SEO vào Kidea | Yêu cầu xuyên các bước, có hai gate SEO riêng | Giữ mười bước chính; chưa tự thêm phase hoặc sửa gate đã duyệt |

Thứ tự lựa chọn là mức phù hợp với yêu cầu, cách hỗ trợ nền tảng và khả năng kiểm chứng, không phải bảng xếp hạng tốc độ. Chưa có sản phẩm/workload hoặc thiết bị đích để chứng minh công nghệ nào nhanh nhất. Hai codebase Android/iOS độc lập không cản việc dùng chung hợp đồng API và tiêu chí nghiệp vụ; không mặc định chia sẻ code triển khai.

## 2. Native: ngôn ngữ phù hợp, nhưng hiệu năng phải đo

### Android

Google khuyến nghị Kotlin cho ứng dụng Android mới và hiện định hướng phát triển UI theo Compose-first. Vì vậy, với một codebase native mới, đề xuất Kotlin + Jetpack Compose làm nền; không chọn Views làm mặc định chỉ dựa trên quan niệm cũ rằng Compose chưa trưởng thành. Views vẫn có đường tích hợp khi cần. [Android Kotlin-first](https://developer.android.com/kotlin/first), [Compose-first](https://developer.android.com/develop/ui/compose/first).

Compose không miễn phí về tài nguyên: thư viện UI có chi phí khởi động. Baseline Profiles có thể tối ưu các hành trình quan trọng, nhưng phải đo bằng build release và benchmark, không suy diễn từ cảm giác khi chạy debug. Không áp một tỷ lệ cải thiện quảng cáo như cam kết cho app chưa tồn tại. [Compose Baseline Profiles](https://developer.android.com/develop/ui/compose/performance/baseline-profiles).

Đề xuất kiểm soát cập nhật UI không cần thiết, khối lượng công việc trên luồng giao diện, ảnh/bộ nhớ và việc tải dữ liệu; chỉ thêm thành phần vẽ chuyên biệt nếu profile chỉ ra nút thắt. Không dùng C++ cho toàn bộ UI chỉ vì backend đã chọn C++20.

### iOS

Đề xuất Swift + SwiftUI làm nền. Apple cung cấp khả năng tích hợp UIKit với SwiftUI, nên có thể xử lý một màn hình/thành phần đặc thù mà không thay toàn bộ kiến trúc UI. Metal là công cụ GPU cho đồ họa/tính toán chuyên biệt, không phải thứ cần thêm cho mọi chuyển cảnh hoặc animation thông thường. [SwiftUI](https://developer.apple.com/swiftui/), [UIKit integration](https://developer.apple.com/documentation/swiftui/uikit-integration), [Metal](https://developer.apple.com/metal/).

Apple hướng dẫn đo cập nhật view, chậm trên luồng chính và giật khung hình bằng Instruments. Do đó, khả năng mượt của ứng dụng phụ thuộc cách triển khai và dữ liệu thực tế, không chỉ tên ngôn ngữ/framework. [SwiftUI performance](https://developer.apple.com/documentation/xcode/understanding-and-improving-swiftui-performance).

Ràng buộc cần đưa vào ma trận: Xcode chạy trên macOS. Kidea chạy trên Windows vẫn có thể hướng dẫn công việc, nhưng chuỗi build/test/sign iOS cần Mac hoặc Mac CI với phiên bản tương thích. Chưa kiểm tra máy/tài khoản hiện có và chưa cấp quyền cài, mua hay thuê môi trường. [Xcode system requirements](https://developer.apple.com/xcode/system-requirements/).

### Biến “nhẹ, mượt, máy yếu” thành tiêu chí

Đề xuất chốt trước thiết bị thấp nhất được hỗ trợ và những tình huống đại diện: mở lạnh ứng dụng, cuộn danh sách dài, đổi màn hình, hiển thị ảnh/biểu đồ, mất mạng hoặc mạng chậm. Sau đó đặt ngân sách cho thời gian phản hồi/khung hình, bộ nhớ, dung lượng cài, pin và nhiệt khi phù hợp. Không tự chọn FPS, RAM tối thiểu hoặc phiên bản OS thay Human trong lượt tư vấn này.

Hiệu ứng cần có mức giảm theo năng lực thiết bị và tùy chọn giảm chuyển động; thao tác chính không được phụ thuộc vào hiệu ứng. Đồ họa 3D liên tục là bài toán khác với UI có transition đẹp: cần biết loại đồ họa trước khi chốt công cụ và cam kết máy yếu.

## 3. Web: HTML trước, tương tác đúng nơi

### Khi web công khai là trọng tâm

Đề xuất Astro + TypeScript. Astro islands cho phép phần lớn trang là HTML, chỉ tải JavaScript cho các vùng tương tác cần thiết. Svelte là lựa chọn đề xuất cho các vùng tương tác phức tạp; nút/menu/animation đơn giản không nhất thiết cần component framework. Đây là lý do kiến trúc phù hợp mục tiêu nhẹ và dễ được đọc, không phải khẳng định Astro luôn thắng mọi framework trong benchmark. [Astro islands](https://docs.astro.build/en/concepts/islands/).

Lựa chọn cách tạo trang theo độ tươi dữ liệu:

- **SSG:** tạo HTML lúc build, phù hợp nội dung không đổi liên tục; xuất file tĩnh để phục vụ, nhưng cần cơ chế cập nhật đúng khi nội dung đổi.
- **SSR:** tạo HTML phía máy chủ khi cần, phù hợp trang cần dữ liệu mới; phải chốt runtime/adapter, caching và thời gian phản hồi.

Astro mặc định pre-render và hỗ trợ render theo yêu cầu ở từng route. Dùng SSR có thể thêm runtime Node bên cạnh C++ backend; xuất tĩnh không cần server JavaScript lúc phục vụ, dù vẫn có công cụ build. Chọn Astro không có nghĩa bỏ backend C++20 hoặc chép nghiệp vụ sang hai nơi. [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/).

Ví dụ nguyên tắc thiết kế: thông tin giá/tồn kho hoặc điều kiện dịch vụ phải nhất quán giữa HTML, dữ liệu có cấu trúc và API theo hợp đồng độ tươi đã chốt. Không lấy tốc độ/cache làm lý do cố ý hiển thị thông tin sai.

### Khi ứng dụng tương tác là trọng tâm

Nếu phần lớn website là công việc có trạng thái, tương tác liên tục và nhiều màn hình ứng dụng, SvelteKit + TypeScript là phương án thay thế đáng cân nhắc. SvelteKit hỗ trợ SSR và prerender theo trang; tắt SSR cho trang cần SEO sẽ làm mất HTML nội dung ban đầu. Chọn theo cấu trúc sản phẩm, không mặc định chia thành hai hệ Astro/SvelteKit trước khi có nhu cầu. [SvelteKit SEO](https://svelte.dev/docs/kit/seo), [Page options](https://svelte.dev/docs/kit/page-options).

Nếu có cả khu công khai và khu đăng nhập, chỉ khu được phép công khai là đích SEO. Có thể dùng cùng một nền tảng, chọn rendering theo route; chỉ tách hệ thống khi lợi ích thực tế đáng kể.

## 4. SEO có xung đột với sự mượt mà không?

Thông thường không: trả HTML hữu ích sớm, ít JavaScript, ảnh hợp lý và phản hồi tốt giúp cả người dùng lẫn crawler. Google có thể xử lý JavaScript, nhưng khuyến nghị server-side rendering hoặc pre-rendering vì lợi ích cho người dùng/bot; không phải mọi bot đều chạy JavaScript. [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

Xung đột dễ xảy ra khi nội dung chỉ xuất hiện sau click/scroll, toàn trang là canvas không có nội dung đọc được, tải quá nhiều thư viện hiệu ứng hoặc animation làm chậm nội dung chính. Đề xuất giữ nội dung/URL có thể truy cập trước, tăng cường hiệu ứng sau; nếu phải bỏ bớt, giảm hiệu ứng trang trí theo ưu tiên Human đã nêu.

Core Web Vitals đo tốc độ hiển thị, khả năng phản hồi và độ ổn định bố cục. Mốc tham khảo Google đưa ra là LCP khoảng 2,5 giây trở xuống, INP dưới 200 ms và CLS dưới 0,1; đây chưa phải ngưỡng nghiệm thu được Human duyệt cho sản phẩm này. Điểm hiệu năng tốt không bảo đảm thứ hạng cao. [Google Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals).

## 5. Google/Bing và AI search: tối ưu nền tảng chung

### Nội dung và cấu trúc

Google nói nền tảng SEO truyền thống vẫn áp dụng cho các tính năng AI: nội dung hữu ích, rõ ràng, có giá trị riêng và có thể truy cập. Không có loại markup AI bắt buộc hay việc phải thêm `llms.txt` để được Google Search dùng. Structured data phải đúng nội dung người đọc nhìn thấy; nó không thay thế nội dung chất lượng. [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features).

Bing cũng gắn khả năng được dùng trong Copilot với nền tảng crawl/index/ranking. URL rõ, liên kết nội bộ thật, thông tin thương hiệu/sản phẩm nhất quán, sitemap và nội dung đáng tin đều có vai trò; IndexNow báo URL thêm/đổi/xóa cho các máy tìm kiếm tham gia, không bảo đảm index và không nên diễn giải là cơ chế chung của mọi search engine. [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a).

Khuyến nghị: đầu tư trang trả lời đúng nhu cầu tìm sản phẩm, thông tin có nguồn/chủ thể rõ và được cập nhật. Không dùng hàng loạt nội dung AI trùng lặp, nhồi từ khóa, review giả hoặc nội dung khác nhau để đánh lừa bot. Không có công nghệ frontend nào tự tạo uy tín hoặc bảo đảm được nhiều nơi đề xuất.

### Quyền truy cập của bot

OpenAI tách `OAI-SearchBot` phục vụ tìm kiếm khỏi `GPTBot` phục vụ huấn luyện. Có thể cho phép tìm kiếm mà vẫn có chính sách huấn luyện riêng; không cần coi “mở cho ChatGPT search” là cho phép mọi bot OpenAI. Kiểm tra cả robots và cơ chế chặn ở CDN/WAF theo thông tin bot/IP chính thức. [OpenAI bots](https://developers.openai.com/api/docs/bots).

Perplexity phân biệt crawler `PerplexityBot` phục vụ search với yêu cầu do người dùng khởi tạo. Hướng dẫn chính thức có thông tin xác minh bot/IP khi cấu hình bảo vệ; không chỉ tin chuỗi User-Agent hoặc tắt toàn bộ firewall. [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

`robots.txt` không phải lớp kiểm soát truy cập dữ liệu riêng tư. Admin/tài khoản và dữ liệu nhạy cảm vẫn cần xác thực/phân quyền. Việc bot được phép đọc chỉ mở khả năng tiếp cận, không bảo đảm được index, trích dẫn, đứng đầu hay tăng chuyển đổi. Không có một policy có thể cam kết bao phủ mọi AI agent hiện tại/tương lai.

## 6. Đề xuất đưa SEO vào quy trình

Đề xuất giữ mười bước chính, gắn SEO vào phạm vi, chất lượng, trải nghiệm/nội dung, vận hành, kiến trúc, test và phát hành. Hai điểm Human duyệt riêng giúp SEO không bị chìm trong checklist kỹ thuật:

1. **Duyệt thiết kế SEO ở bước 4:** nội dung cần được tìm thấy, người tìm, cấu trúc trang/URL và cách tiếp cận; đầu vào đủ trước khi chọn kiến trúc.
2. **Duyệt sẵn sàng SEO ở bước 10, trước phát hành công khai:** HTML/metadata/link/config bot đúng, không rò nội dung riêng; sau deploy mới kiểm tra website thật và theo dõi indexing/kết quả search.

Không chặn phát hành bằng yêu cầu “đã được index” khi website chưa công khai; cũng không báo nghiệm thu index từ một môi trường thử riêng tư. Test kỹ thuật có thể dùng fixture; kết quả tìm kiếm cần môi trường được phép công khai và dữ liệu quan sát thực. Quyền public website, quản lý tài khoản webmaster hoặc gọi dịch vụ ngoài vẫn cần được cấp riêng.

Danh sách tác động đến các task xây Kidea nằm duy nhất trong [đề xuất thiết kế mục 2.5](../KIDEA_DESIGN.md#seo-proposal). Nếu Human duyệt, cập nhật tại nguồn và phân nhỏ công việc khi cần; bản tư vấn này không tự thay quy trình đã duyệt.
