# R05 — Gói môi trường và build trên Mac Intel r1

Ngày 2026-09-16. **PROPOSED — chưa có quyền cài hoặc build.** Nội dung R5-1–R5-4 tại commit `a39f79f97ad0dc193052c95a5dd7bbef7e89fa64` đã được Human duyệt bằng câu “Duyệt nội dung R05 r1, tiếp tục chuẩn bị gói môi trường/build.” Bản này thực hiện quyền chuẩn bị đó. [Phương pháp đã duyệt](r05-profile-method-r1.md); [metadata chỉ đọc](../tests/evidence/r05/environment-r1/metadata.json).

**Cập nhật sau 88ae03b:** Human đang không ngồi trực tiếp tại máy, sẽ tự cài Docker khi về; E1 hoãn, chưa có quyền cài/chạy Docker. Node mặc định đã có22.22.2, npm12.0.2; Node24.19.0 x64 cũng đã có trong runtime Codex. Dùng bản24 có sẵn qua đường tuyệt đối để tiếp tục Kidea; không cần cài Node24.20 hoặc đổi PATH cho việc này. Node24.20/npm11.19 ở bảng dưới chỉ là ứng viên toolchain sản phẩm Web, chưa là điều kiện để làm Kidea, chưa được duyệt cài. [Kiểm thực Node](../tests/evidence/r05/node-check-2026-09-16.json).

## Đề nghị thực tế

Giữ Sonoma hiện tại; chuẩn bị Docker và Node riêng cho backend/Web trước. Android và iOS vẫn thuộc R05 nhưng chưa chạy trong gói tối thiểu E1. Không cần cloud để kiểm mẫu nhỏ. E1 là gói **cài công cụ và kiểm khởi động**, có artifact cụ thể; E2 là kế hoạch build với các điều kiện chưa đủ được nêu rõ, chưa xin duyệt trước dependency chưa biết. Việc tách này không đổi điều kiện nghiệm thu R05.

## Máy đã kiểm

`Kynderis/kidea`, master, nguồn `a39f79f`; working tree sạch trước lượt chuẩn bị. Máy `MacBookPro16,1`, Intel x86_64, macOS14.7 build23H124, RAM16GiB, APFS còn383GiB, uid501. Không thấy Docker/Xcode/Android Studio tại vị trí Applications thông thường hoặc Docker trên PATH. Có JDK21.0.11, không tự coi là JDK17 trong baseline. Node24.19 có sẵn cho kiểm Kidea; không đổi Node22 mặc định hệ thống. [Kết quả lệnh môi trường](../tests/evidence/r05/environment-r1/environment.json).

Pilot vẫn đúng 21 file snapshot r1. Approval gắn vào SHA trong manifest r1; không sửa chữ PROPOSED trong snapshot hoặc sửa bằng chứng cũ để phản ánh một sự kiện xảy ra sau đó. Sổ trạng thái này và roadmap ghi sự kiện duyệt mới.

## E1 — Đề xuất cũ, hiện hoãn theo Human

| Thành phần | Artifact đã xác minh qua metadata chính thức | Download / đĩa / quyền |
|---|---|---|
| Docker Desktop Intel4.91.0 build239619 | [DMG cố định](https://desktop.docker.com/mac/main/amd64/239619/Docker.dmg); SHA256 `19c1b4483900b4d14d07dd638fb18ccbdc35fb91eccf1a6de274e74697309d97`; feed công bố minimum macOS14.0.0 | 642,203,617 byte; đề nghị ngân sách đĩa50GiB gồm app/cache/VM, không phải kích thước cài đo được. RAM4GiB, CPU2, disk image tối đa32GiB; chưa pull image trong E1 |
| Node24.20.0 darwin-x64 | [tar.gz](https://nodejs.org/dist/v24.20.0/node-v24.20.0-darwin-x64.tar.gz); SHA256 `9e5b2644cf107befb6aefca676b96d3296bc10138096f022ed378d6233ed81f4` từ [SHASUMS](https://nodejs.org/dist/v24.20.0/SHASUMS256.txt) | 54,021,618 byte; giải nén user-local; dự trù1GiB cho Node/npm/download, không sửa binary hệ thống |
| npm11.19.0 | [tarball](https://registry.npmjs.org/npm/-/npm-11.19.0.tgz); integrity SHA512 trong metadata; package công bố unpacked12,200,542 byte | HEAD không trả Content-Length: chưa có số nén chính xác; đặt trần tải20MiB, ngắt nếu vượt. Nằm trong ngân sách1GiB phía trên; không npm install -g |

Nguồn Docker: [feed Intel](https://desktop.docker.com/mac/main/amd64/appcast.xml), [checksum](https://desktop.docker.com/mac/main/amd64/239619/checksums.txt), [release notes](https://docs.docker.com/desktop/release-notes/). Đây là kiểm metadata, chưa tải hoặc kiểm chữ ký trên binary. E1 chỉ được thực thi khi Human duyệt và bản tải khớp checksum; không tự chuyển sang latest nếu URL lỗi.

Đích mới đề nghị: `/Users/kendrick/kidea-local-tools/r05-r1/` chứa `downloads/`, `node/`, `npm/`, `cache/` và receipt. CREATE-only, nếu đã tồn tại thì kiểm và dừng khi khác, không ghi đè. Node và npm gọi bằng đường tuyệt đối; PATH nếu cần chỉ trong tiến trình con, không sửa shell profile. Không chép tool vào repo/pilot hoặc thay runtime Codex.

Docker đặt tại `/Applications/Docker.app` nếu user hiện có quyền ghi; nếu không, dừng để Human thực hiện bước GUI, không sudo. Advanced setup: CLI user directory, không bật default socket/privileged ports/helper nếu không cần; không sửa hosts/firewall, không Kubernetes/extensions/AI/cloud/auto-start login. Docker sẽ có dữ liệu riêng trong user Library và chạy Linux VM do Docker quản lý; không thêm VM Ubuntu riêng. [Quyền Docker chính thức](https://docs.docker.com/desktop/setup/install/mac-permission-requirements/).

Human cần xác nhận điều kiện sử dụng Docker: cá nhân/giáo dục/nguồn mở phi thương mại hoặc doanh nghiệp đủ điều kiện miễn phí; nếu cần subscription thì dừng, không mua. Human tự chấp nhận điều khoản trên máy; không gửi tài khoản/mật khẩu vào chat. [Điều kiện sử dụng](https://docs.docker.com/desktop/setup/install/mac-install/).

Trình tự sau duyệt E1: kiểm đích/đĩa → tải ba artifact có giới hạn → so checksum/integrity → kiểm chữ ký Docker bằng công cụ macOS có sẵn → giải nén/cài → Human chấp nhận điều khoản → kiểm Node/npm version, `docker version`, `docker info` → quit Docker. Không gọi remote install script. Thời hạn90phút; tối đa1GiB network E1, tối đa51GiB đĩa tăng thêm theo ngân sách, giữ ít nhất100GiB trống. Hết giờ/vượt trần/checksum lệch/quyền admin thì dừng và lưu lỗi. Không tự dọn dữ liệu người dùng; rollback chỉ gỡ những đích mới theo receipt và quyết định Human, không dùng Docker prune.

## E2 — Kế hoạch build hữu hạn, chưa INSTALL_READY

Chỉ xin thực thi sau có manifest dependency/image/command thật và kiểm license/advisory phù hợp. Chưa tạo source/config sản phẩm trong lượt này. Không suy duyệt E1 thành duyệt E2.

| Phần | Mẫu và lệnh cần hiện thực trong script project | Gate còn thiếu / hạn mức đề nghị |
|---|---|---|
| C++ | Ubuntu24.04 linux/amd64, GCC13.3/CMake3.28.3; `cmake --build` và `ctest --output-on-failure`; mẫu RAII/transaction đúng–sai, lỗi rollback, grammar vectors | Pin image digest, exact apt revisions, Drogon1.9.13/Trantor/OpenSSL/JsonCpp, SQLite3.53.3 và parser CommonMark được chọn; checksum/license/NOTICE và compiler flags; 2CPU4GiB, 60phút/build, không `-march=native` |
| Web | Sáu package đúng profile; `npm ci`, check/lint/unit/build rồi production SSR/browser smoke; mẫu bỏ phản hồi actor/generation cũ, âm global state | Lock transitives; chọn exact svelte-check/linter/browser runner+browser artifact; review install scripts trước cho chạy; trần cache8GiB, 30phút/lượt, server loopback hữu hạn |
| Android | AGP9.2.1/Gradle9.4.1/JDK17, SDK36.1/build-tools36.0.0; `assembleDebug`, `testDebugUnitTest`, `lintDebug`; mẫu hủy coroutine/Compose và generation | Maven graph/Kotlin built-in/BOM phải resolve; chọn thiết bị thật để kiểm lifecycle sau compile, chưa emulator. Trần công cụ/cache15GiB, JVM heap2GiB, workers2, 60phút/lượt |
| iOS | Xcode26.6/Swift6.3/SDK26.5, deployment16; `xcodebuild build/test` trên scheme và destination cụ thể; mẫu actor/cancel và MainActor | Máy/OS, Xcode download, SDK/destination/device/signing chưa sẵn sàng; chưa có quyền nâng OS/cài/build. Không dùng kết quả compile thay device lifecycle |

Đích mẫu dự kiến là thư mục mới `samples/r05/` trong sibling pilot, nguồn/chạy riêng từng nền tảng; không ghi source vào `.kidea`. Mỗi mẫu có thuận PASS và âm phải bị checker/test bắt, giữ raw cả hai, hash nguồn/lock/toolchain. Dữ liệu giả, không account thật; không publish/deploy. Cổng loopback cụ thể và việc cấp local TLS phải xuất hiện trong E2 trước khi mở server; không tự trust CA hệ thống. Load/performance/host-loss/observer độc lập vẫn NOT_RUN, cần gói cloud riêng khi Human cấp.

Kết quả E2 chỉ chứng minh mẫu profile theo đúng ma trận, không chứng nhận137ca ứng dụng hoặc đóng R05; các ca chưa thực thi vẫn NOT_RUN. Lỗi inventory R03 19/20 lịch sử giữ nguyên, chưa có quyền sửa test cũ để che lỗi.

## Android — artifact đã tìm được, chưa xin cài

- Temurin17.0.20.1+1 macOS x64 tar.gz:180,578,248byte, SHA256 `c01975da12ed4235250ff891fe8bba73a9e73037d444b269c9d0922b5dbc8e0a`, [asset chính thức](https://github.com/adoptium/temurin17-binaries/releases/tag/jdk-17.0.20.1%2B1). API Adoptium trả403; fallback GitHub metadata được giữ trong [receipt](../tests/evidence/r05/environment-r1/additional-metadata.json). Chưa kiểm binary hoặc khả năng chạy host; không thay JDK21 hệ thống.
- Gradle9.4.1: [checksum chính thức](https://services.gradle.org/distributions/gradle-9.4.1-bin.zip.sha256) `2ab2958f2a1e51120c326cad6f385153bb11ee93b3c216c5fccebfdfbb7ec6cb`; chưa tải, chưa xác minh size.
- SDK platform36.1r1:66,270,841byte; build-tools36.0.0 Mac:79,121,749byte từ [repository metadata](https://dl.google.com/android/repository/repository2-3.xml), đã lưu [các entry](../tests/evidence/r05/environment-r1/android-packages.json). Nguồn hiện cung cấp SHA1 cho hai archive, chưa nhận là đã kiểm SHA256 binary.
- [Trang tải Android](https://developer.android.com/studio#downloads) hiển thị CLI build15859902 Intel156.3MB với SHA256, trong khi XML live chỉ latest16111833/revision23.0 Intel155,582,504byte. Giữ rõ hai nguồn khác thời điểm; chưa chọn latest động. Cần pin một CLI và xác minh yêu cầu Java tương ứng trước E2. Không cần Android Studio/emulator cho compile/unit đầu tiên; device tests vẫn phải có nơi chạy thực.

## iOS — quyết định máy, không tự nâng

[Xcode26.6 yêu cầu Tahoe26.2–26.x](https://developer.apple.com/xcode/system-requirements). Máy hiện14.7 nên chưa chạy baseline. Apple liệt kê [MacBook Pro16-inch2019 hỗ trợ Tahoe](https://support.apple.com/en-us/122727): Intel tự nó không phải lý do kết luận phải mua máy khác. Khả năng nâng OS không chứng minh mọi công cụ/thiết bị đã tương thích.

Đề nghị trước mắt giữ OS, làm E1 rồi hoàn thiện E2 backend/Web. Khi cần iOS, Human chọn nâng chính máy này sau backup/restore plan hoặc cấp Mac khác đáp ứng baseline. Chưa cần quyết định ngay; iOS vẫn BLOCKED_ENV_PENDING trong R05, không bị bỏ hoặc đổi sang Xcode16.2 ngầm. Chưa có installer Xcode exact size/SDK download/device/signing nên chưa xin quyền cài iOS. Không cần thuê cloud hoặc mua máy trong gói này.

## Xác nhận cần thiết

Đề nghị trước khi Human hoãn (không còn là yêu cầu xác nhận hiện tại): **E1: Docker4.91.0 + Node24.20/npm11.19 user-local, giới hạn và kiểm khởi động như trên**, đồng thời xác nhận mục đích dùng Docker để kiểm điều kiện license. Giữ Android/iOS chưa cài; E2 chưa được duyệt thực thi. Không xin duyệt lại nội dung R05 r1.

Cần xác nhận vì yêu cầu Human ban đầu cấm tự cài công cụ/thay cấu hình, và approval mới chỉ cho chuẩn bị gói môi trường/build. Không phải một yêu cầu do skill thêm vào.
