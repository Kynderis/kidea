# P01-T02 — Đối chiếu cấu hình nền và môi trường

Ngày kiểm tra: 2026-09-07. Vai trò: bằng chứng nghiên cứu cho [ma trận thiết kế](../KIDEA_DESIGN.md#platform-matrix); trạng thái duyệt chỉ nằm trong [roadmap](../KIDEA_ROADMAP.md#p01-t02-review). Không phải thiết kế/tracker thứ hai hoặc chứng nhận chạy được.

## Cách kiểm tra và giới hạn

- Dùng Exa khảo sát 20 kết quả từ 4 truy vấn về web/Node, Android toolchain, Ubuntu/C++ và Apple/Xcode; đọc sâu các trang chính thức liên quan. Chỉ dùng nhà phát hành, tài liệu chính thức và metadata package làm căn cứ tương thích; không lấy snippet, bài tổng hợp hoặc tên “latest” làm bằng chứng build.
- Đọc registry npm và danh sách phát hành Node bằng HTTP GET để xác nhận phiên bản đã xuất bản, engines và peerDependencies. Không cài dependency, tạo app hoặc chạy build.
- Kiểm tra read-only Windows/CPU/RAM, phiên bản Git/Node/npm và danh sách WSL; không khởi động distro, emulator, sửa cấu hình hay truy cập Mac.
- Các phiên bản ở đây là snapshot. Lựa chọn cấu hình nền là đề xuất kỹ thuật; phải kiểm tra lại và khóa phiên bản thực khi đến bước thực thi. Metadata tương thích chỉ là điều kiện đầu vào, không thay test.

## Nguồn lực đã quan sát

| Dữ kiện | Bằng chứng và giới hạn |
|---|---|
| Windows hiện tại | Windows 11 Pro 25H2, x64, build 26200; RAM 16 GiB, CPU Intel i5-11400F — đọc thông tin hệ thống trong lượt này; không công bố đã đủ hiệu năng cho workload lớn |
| Công cụ trong phiên shell | Git 2.50.1.windows.1, Node 22.18.0, npm 10.9.3; không phải Node 24 đề xuất. Không thấy cmake/ninja/g++/clang++/java/adb trong PATH; điều đó không chứng minh chúng chưa được cài ở nơi khác |
| WSL | Có distro `Ubuntu` và `docker-desktop`, WSL2, đang dừng tại thời điểm đọc; không suy ra Ubuntu 24.04 từ tên distro. Không khởi động hoặc cập nhật chúng |
| Mac và iPhone | Theo Human: MacBook Pro 16 inch 2019 Intel, Sonoma, RAM 16 GB, khoảng 512 GB trống; iPhone 12 Pro Max. Chưa kiểm tra máy, bản iOS hoặc Xcode. Human yêu cầu chỉ chuẩn bị khi đến lúc làm iOS |
| Thiết bị Android | Chưa được Human cung cấp; chưa có bằng chứng hiệu năng trên máy yếu |

Không lưu đường dẫn tài khoản, serial, khóa ký, thông tin đăng nhập hoặc dữ liệu project khác trong báo cáo.

## Đối chiếu theo thành phần

### Web

- [Node release policy](https://nodejs.org/en/about/previous-releases) xác định dòng 24 là LTS; [danh sách bản phát hành](https://nodejs.org/dist/index.json) có 24.20.0 ngày 2026-08-26, npm 11.19.0. Chọn Node 24 làm cấu hình nền, không đổi Node global đang có.
- [adapter-node](https://svelte.dev/docs/kit/adapter-node) xuất server Node độc lập; môi trường production phải có artifact và dependency runtime, cấu hình origin/proxy đúng. Header forwarded chỉ được tin qua proxy được kiểm soát; CDN không thay nghĩa vụ bảo vệ dữ liệu riêng.
- Metadata đã đọc: [SvelteKit 2.70.3](https://registry.npmjs.org/@sveltejs%2Fkit/2.70.3), [Svelte 5.57.0](https://registry.npmjs.org/svelte/5.57.0), [TypeScript 6.0.3](https://registry.npmjs.org/typescript/6.0.3), [Vite 8.2.2](https://registry.npmjs.org/vite/8.2.2), [vite-plugin-svelte 7.3.0](https://registry.npmjs.org/@sveltejs%2Fvite-plugin-svelte/7.3.0), [adapter-node 5.5.7](https://registry.npmjs.org/@sveltejs%2Fadapter-node/5.5.7).
- Các peer/engine chính không mâu thuẫn với tổ hợp đề xuất: kit nhận Svelte 5, TypeScript 6, Vite 8 và plugin 7; plugin 7.3.0 nhận Svelte từ 5.46.4 và Vite 8; adapter nhận kit từ 2.4.0; Node 24 nằm trong engine của các gói được kiểm tra.
- Điểm cần tránh: TypeScript latest ở registry là 7.0.2 nhưng peer của kit đang nhận 5/6. Vì vậy đề xuất 6.0.3, không ghép latest tự động. Source main của Svelte hiển thị 5.56.10 trong dữ liệu fetch trong khi registry đã có 5.57.0; dùng metadata phiên bản đã xuất bản làm mốc, không nhận snapshot main là trạng thái phát hành.
- Chưa resolve/install toàn bộ dependency tree, audit vulnerability hoặc build ứng dụng. Phải kiểm tra lại trước dùng; không coi bảng peer là bằng chứng không có lỗi/bảo mật.

### Backend và host Linux

- [Ubuntu lifecycle](https://ubuntu.com/about/release-cycle): Ubuntu 24.04 LTS có standard security maintenance đến tháng 5-2029; 26.04 LTS đã tồn tại. Chọn 24.04 vì là nền trưởng thành đáp ứng phạm vi C++20 hiện tại, không tuyên bố nó mới nhất. Cần theo dõi lifecycle nếu triển khai muộn.
- Package chính thức cho amd64: [G++ 13](https://packages.ubuntu.com/noble/g++-13) có 13.3.0; [CMake](https://packages.ubuntu.com/noble/cmake) có 3.28.3. Patch distro được ghi nhận khi tạo môi trường. Chưa chứng minh mọi tính năng C++20/library/ABI hoạt động; tính năng sử dụng phải có test, không mặc định C++ modules hoặc extension.
- [Microsoft WSL](https://learn.microsoft.com/en-us/windows/wsl/about) cho phép chạy môi trường Linux trên Windows. WSL2 là môi trường build/dev đề xuất, không thay kiểm tra artifact và vận hành trên Ubuntu đích. Không tự nâng/xóa distro hiện hữu.

### Android

- [AGP 9.2 release notes](https://developer.android.com/build/releases/agp-9-2-0-release-notes): có bản sửa 9.2.1; dòng 9.2 dùng Gradle 9.4.1, JDK 17, Build Tools 36.0.0 và hỗ trợ API tối đa 37.0; release notes nêu cập nhật dependency Kotlin Gradle plugin thành 2.3.10.
- [Bảng tương thích Android Studio/AGP/API](https://developer.android.com/build/releases/about-agp): Quail 1 (2026.1.1) hỗ trợ AGP đến 9.2; API 36.1 cần tối thiểu AGP 8.13. Cấu hình nền compileSdk 36.1/targetSdk 36 tránh lấy SDK preview làm chuẩn nghiệm thu.
- [Kotlin tích hợp](https://developer.android.com/build/migrate-to-built-in-kotlin) bật mặc định từ AGP 9, thay kotlin-android plugin; không áp cả hai theo mẫu cũ. [Compose compiler](https://developer.android.com/develop/ui/compose/compiler) phải khớp Kotlin; [BOM](https://developer.android.com/develop/ui/compose/bom) không bao gồm compiler. Khi tạo build phải đối chiếu phiên bản Kotlin thực được resolve, không trộn compiler từ ví dụ mới hơn.
- [BOM mapping](https://developer.android.com/develop/ui/compose/bom/bom-mapping) có 2026.06.01; đây là mốc stable đề xuất, không alpha/beta. Các AAR dependency thực phải được resolve và kiểm tra yêu cầu SDK ở bước build; chưa có project Android để làm phép kiểm này.
- [Google Play target API](https://support.google.com/googleplay/android-developer/answer/11926878): từ 2026-08-31 app điện thoại mới/update cần target API 36+. Đây là target để build/phát hành, khác minSdk được chọn cho OS người dùng. minSdk 26 là lựa chọn phạm vi đề xuất, không phải yêu cầu bắt buộc của Google.
- [Android Studio requirements](https://developer.android.com/studio/install) nêu Windows 64-bit, RAM tối thiểu 16 GB khi dùng Studio + emulator, khuyến nghị 32 GB; còn điều kiện CPU/ảo hóa/GPU. Máy Windows hiện có 16 GB chưa phải bằng chứng trải nghiệm thoải mái với nhiều emulator. Dùng tuần tự và bổ sung máy thật khi đo.

### iOS

- [Apple Xcode matrix](https://developer.apple.com/xcode/system-requirements/): 26.6 cần Tahoe 26.2–26.x, có Swift compiler 6.3 và iOS SDK 26.5; iOS 16 nằm trong dải deployment target. Chọn Swift 6 language mode và iOS 16 làm nền đề xuất; API UI mới hơn cần availability/fallback hoặc thay phạm vi có duyệt.
- Theo [yêu cầu upload Apple](https://developer.apple.com/news/upcoming-requirements/?id=02032026a), từ 2026-04-28 cần Xcode 26+/SDK iOS 26+. Sonoma/Xcode 16.2 không phải đường phát hành hiện hành.
- [Xcode 27 release notes](https://developer.apple.com/documentation/xcode-release-notes/xcode-27-release-notes), mục Intel Deprecation, xác nhận 27 chỉ cài/chạy trên Apple Silicon. Không lấy khả năng nâng macOS của Mac Intel để suy ra dùng được toolchain này.
- Tại lúc thực hiện phải kiểm tra lại yêu cầu store/SDK/toolchain, bản OS thiết bị thật, simulator, signing/account và backup. Chưa có quyền nâng/cài/mua/thuê/phát hành. Nếu toolchain đòi Apple Silicon thì trình phương án nguồn lực, không hứa Mac 2019 đáp ứng vô thời hạn.

## Kết luận bằng chứng

Đã có căn cứ tài liệu và snapshot host để trình duyệt cấu hình nền P01-T02. Chưa có bằng chứng build/runtime/hiệu năng hoặc hỗ trợ đầy đủ của Kidea. Các kiểm chứng, trách nhiệm phase và quyền còn thiếu được định nghĩa tại ma trận nguồn; không đánh dấu PASS từ việc nhà cung cấp có tài liệu tương thích.
