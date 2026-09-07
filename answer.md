**Đã hoàn thiện gói P01-T02, hiện cần bạn duyệt đầu ra.** Chưa cài công cụ, nâng macOS hay bắt đầu pilot.

[Cấu hình đầy đủ nằm ở thiết kế mục 1.2](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#platform-matrix). Các điểm chính:

| Thành phần | Cấu hình nền đề xuất |
|---|---|
| Kidea | Windows 11 x64, dùng máy hiện có; runtime/helper chọn riêng ở P02 |
| Backend | Ubuntu 24.04 LTS, C++20, GCC 13.3, CMake 3.28.3; build Linux và kiểm tra lại trên môi trường đích |
| Web | SvelteKit 2 + Svelte 5 + TypeScript 6, Node 24 LTS; đã ghi bộ phiên bản cụ thể cho SSR/prerender |
| Android | Kotlin + Compose; bộ công cụ tương thích đã ghi rõ; đề xuất hỗ trợ từ Android 8/API 26, target API 36 |
| iOS | Swift + SwiftUI; đề xuất hỗ trợ từ iOS 16; tận dụng MacBook/iPhone, chỉ chuẩn bị Xcode/macOS khi đến lúc làm |

Đã đối chiếu nguồn chính thức và metadata để chọn phiên bản tương thích, **chưa coi đó là bằng chứng build hay hiệu năng**. [Báo cáo đối chiếu](https://github.com/Kynderis/kidea/blob/master/exa-results/p01-t02-platform-baseline-2026-09-07.md).

Gói này cũng quy định:

- Kiểm tra lại và khóa phiên bản khi thực hiện; không đóng băng các số phiên bản hôm nay vô thời hạn.
- Thiết bị Android thật, phiên bản iOS hiện tại và các phép đo còn chờ được ghi rõ thời điểm xử lý.
- Cài đặt, nâng cấp, mua/thuê và phát hành đều cần quyền riêng; duyệt ma trận không cấp các quyền đó.
- Phạm vi OS trên là nền kiểm chứng ban đầu, không phải cam kết mượt trên mọi thiết bị hoặc giới hạn cứng cho mọi sản phẩm.

**Đã kiểm tra:** 69 liên kết nội bộ hợp lệ; giữ 77 task, gồm 1 DONE, 1 IN_PROGRESS và 75 TODO. Tài liệu và câu trả lời đã đồng bộ GitHub, nội dung được đối chiếu khớp.

Bạn duyệt **gói `P01-T02-PLATFORM-r3`** này nhé; sau xác nhận mình sẽ đóng P01-T02 và chuyển sang P01-T03 — chọn pilot nhỏ để kiểm chứng Kidea.

<oai-mem-citation>
<citation_entries>
MEMORY.md:319-320|note=[preserve sequential Human review and scoped answer mirror]
MEMORY.md:328-328|note=[verify public publication]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
