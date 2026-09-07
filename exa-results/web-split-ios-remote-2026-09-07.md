# Web Astro/SvelteKit và phát triển mobile từ Windows

Đối chiếu ngày 2026-09-07. Dùng skill Search/Exa rà 25 kết quả qua bốn nhánh web, Android, Mac thuê và CI iOS; loại trùng và chỉ dựa vào tài liệu nền tảng/nhà cung cấp cho thông tin kỹ thuật, giá và điều kiện. Đây là nghiên cứu, không phải trải nghiệm dịch vụ hay benchmark. Giá USD là niêm yết tham khảo, không phải báo giá cuối gồm thuế, add-on và mọi điều kiện.

Các quyết định đã được Human xác nhận không thay đổi: xem [thiết kế](../KIDEA_DESIGN.md#first-release-scope). Đề xuất dưới đây chưa chốt kiến trúc web, nhà cung cấp hoặc quyền thuê/cài đặt. [P01-T02](../KIDEA_ROADMAP.md#p01-t02-review) vẫn đang làm rõ; không tự đóng gate SEO hoặc công nghệ.

## 1. Không chia cứng “SEO = Astro; hiệu ứng = SvelteKit”

Astro có thể render component Svelte thành HTML và chỉ nạp JavaScript tại vùng cần tương tác. Component Svelte dùng trong Astro không đồng nghĩa nhúng toàn bộ SvelteKit. [Astro framework components](https://docs.astro.build/en/guides/framework-components/).

SvelteKit cho phép chọn SSR, prerender và CSR theo route hoặc nhóm route. Tài liệu chính thức mô tả việc kết hợp trang marketing tạo sẵn, trang động render phía server và khu admin dạng ứng dụng trong cùng một hệ. Vì vậy, dùng SvelteKit không mặc nhiên làm kém SEO, còn một trang cần SEO vẫn có thể cần tương tác phức tạp. [SvelteKit page options](https://svelte.dev/docs/kit/page-options).

Khuyến nghị kiến trúc của AI:

| Tình huống | Hướng ưu tiên |
|---|---|
| Nội dung công khai, vài widget/form/hiệu ứng | Astro + TypeScript; component Svelte nếu cần |
| Khu ứng dụng nhiều màn hình, giữ trạng thái liên tục, thao tác dữ liệu phức tạp | SvelteKit + TypeScript |
| Web nhỏ hoặc public/app gắn chặt | Cân nhắc một SvelteKit, chọn SSR/prerender theo route để giảm vận hành |
| Khu nội dung và khu ứng dụng lớn, ranh giới ổn định | Có thể tách Astro và SvelteKit |

Không dùng số lượng hiệu ứng làm tiêu chí chính. Lựa chọn framework điều phối trang không tự tối ưu GPU, ảnh, animation hoặc khối lượng JavaScript. Phải đo trải nghiệm và HTML/nội dung thực tế trước khi nói phương án nào tốt hơn.

Nếu tách hai hệ, đề xuất phân theo khu vực route rõ ràng, không xen kẽ tùy hứng từng màn hình. Cần chốt routing/deploy, đăng nhập/session, navigation xuyên khu vực, component dùng chung và cách cập nhật phiên bản; không sao chép nghiệp vụ C++20 vào hai frontend. Không có một con số hiệu năng hay SEO trong nghiên cứu này chứng minh hai framework tốt hơn một.

Ví dụ ranh giới để thảo luận, chưa phải URL được duyệt: khu giới thiệu/sản phẩm/bài viết do Astro phục vụ; khu workspace thao tác liên tục do SvelteKit phục vụ. Trang sản phẩm có bộ cấu hình tương tác vẫn có thể dùng Astro + Svelte island; không buộc chuyển sang SvelteKit chỉ vì có animation.

## 2. Android trên Windows

Android Studio hỗ trợ Windows x64; tài liệu hiện tại ghi Windows ARM chưa được hỗ trợ. Yêu cầu RAM tối thiểu là 8 GB cho Studio, 16 GB cho Studio cùng emulator; khuyến nghị 32 GB. Dùng điện thoại Android thật là một lựa chọn khi không muốn chạy emulator; emulator còn có yêu cầu CPU/ảo hóa/GPU. [Android Studio installation](https://developer.android.com/studio/install).

Kết luận: có chuỗi công cụ chính thức để phát triển Android native từ Windows. Chưa kiểm tra cấu hình máy hiện tại, nên không khẳng định mọi điều kiện đã đạt. RAM của máy lập trình khác với RAM của điện thoại mục tiêu; app chạy máy yếu vẫn cần test trên thiết bị yếu đại diện.

## 3. Hai loại dịch vụ iOS cần phân biệt

- **Mac điều khiển từ xa:** mở desktop macOS, dùng Xcode/Simulator để làm việc và debug tương tác.
- **CI trên macOS:** nhận source, chạy build/test/sign, tạo bản phân phối; không phải một desktop Xcode làm việc cả ngày.

### Các lựa chọn đã kiểm tra

| Dịch vụ | Loại | Thông tin niêm yết | Điểm cần lưu ý |
|---|---|---|---|
| MacinCloud Managed | Mac remote | M4/16 GB từ 29 USD/tháng; M2/16 GB từ 26 USD/tháng | Tài khoản managed, tác vụ admin do support xử lý; xác nhận giới hạn sử dụng, Xcode và phần mềm cần trước khi thuê |
| MacinCloud Pay-As-You-Go | Mac remote | Từ 1 USD/giờ hoặc 4 USD/ngày | Có giới hạn và tự nạp tiền; không có quyền admin/root |
| MacStadium | Mac riêng | M2/8 GB 109 USD/tháng; M4/16 GB 149 USD/tháng | Root, toàn quyền máy; trang giá đồng thời cảnh báo nguồn cung M4 hạn chế, cần xác nhận tồn kho/điều kiện |
| Codemagic | CI mobile | Tài khoản cá nhân có 500 phút M2 miễn phí/tháng; sau đó 0,095 USD/phút M2 | Team không có phần miễn phí này; không thay desktop remote. Có hướng dẫn native iOS, không chỉ Flutter |
| Xcode Cloud | CI của Apple | 25 compute hours/tháng kèm Apple Developer Program | Khởi tạo workflow trong Xcode; không phải dịch vụ cho thuê màn hình Mac |

Nguồn giá/quyền: [MacinCloud Managed](https://www.macincloud.com/pages/managed.html), [MacinCloud checkout](https://checkout.macincloud.com/select), [MacStadium pricing](https://macstadium.com/pricing), [Codemagic pricing](https://docs.codemagic.io/billing/pricing/), [native iOS trên Codemagic](https://docs.codemagic.io/yaml-quick-start/building-a-native-ios-app/), [Xcode Cloud](https://developer.apple.com/xcode-cloud/).

MacinCloud công bố có khu vực Singapore. Đây là một ứng viên để thử từ Việt Nam, không phải bằng chứng mạng chắc chắn nhanh: độ trễ và ổn định phải đo bằng kết nối thực. [MacinCloud locations](https://www.macincloud.com/).

Apple Developer Program có phí 99 USD/năm hoặc tiền địa phương khi áp dụng; chi phí này tách khỏi tiền thuê Mac. TestFlight/App Store thuộc quy trình tài khoản/phân phối của Apple. Có đường thử cá nhân miễn phí trong Xcode nhưng có giới hạn, không nên coi nó tương đương gói phát hành. [Membership](https://developer.apple.com/programs/whats-included/), [Developer account overview](https://developer.apple.com/support/compare-memberships/).

### Khuyến nghị theo giai đoạn

1. **Chưa muốn mua Mac:** thử một Mac remote ngắn hạn. Với gói managed, xác nhận Xcode/Simulator tương thích và quyền cài công cụ cần dùng; nếu cần quyền tự quản trị, so sánh dedicated. Không chọn gói rẻ nhất trước khi kiểm tra giới hạn.
2. **Đã có dự án chạy được:** thêm Codemagic hoặc Xcode Cloud để build/test tự động khi thực sự cần; không phải thuê cả hai dịch vụ CI.
3. **Làm iOS thường xuyên, coi trọng độ mượt/đồ họa:** cân nhắc một Mac mini Apple Silicon tại chỗ kết hợp iPhone thật. Đây là khuyến nghị về vòng lặp làm việc, chưa phải phân tích tổng chi phí hoặc đề nghị mua ngay.

Mac remote giúp tránh mua máy ban đầu nhưng có độ trễ điều khiển và phụ thuộc mạng. Video desktop không phải số đo FPS của ứng dụng trên iPhone; iPhone cắm vào Windows không tự xuất hiện như thiết bị local của Mac thuê. Cần chốt riêng cách đưa bản thử lên iPhone, debug thiết bị và đo hiệu năng. CI hoặc Simulator không thay được mọi kiểm tra phần cứng thật.

Trước khi thuê cần hỏi: phiên bản Xcode/macOS, CPU/RAM/quota, phiên đồng thời/giờ sử dụng, admin/SSH và quyền cài công cụ, vị trí máy, lưu giữ/xóa dữ liệu, billing/tự gia hạn, cách dùng thiết bị thật. Signing keys và thông tin tài khoản phải được quản lý bí mật, không commit vào Git hoặc trao mật khẩu Apple Account tùy tiện.

Không cần đổi hướng native sang framework đa nền tảng chỉ để tránh mua Mac: Mac thuê/CI giải quyết vị trí môi trường Apple mà vẫn giữ Swift/SwiftUI. Chưa thuê, đăng ký, kết nối repo, upload source hoặc cấp quyền dịch vụ nào trong lượt nghiên cứu.
