# R05 — Android Emulator bootstrap trên Mac Intel, r1

Ngày2026-09-17. **PASS_BOOTSTRAP_ONLY**, sau Human duyệt gói Android/hướng lab iOS bằng “tôi hiểu rồi, làm đi nhé”; Human tiếp tục giao “tiếp tục đi” trong lượt kiểm. [Gói được duyệt](../../../proposals/r05-simulator-lab-r1.md), [state và mọi command](android-sim-bootstrap-r1/state.json), [receipt cuối](android-sim-bootstrap-r1/final-verification.json). Không cài APK ứng dụng; N01…N08 chưa được kiểm bởi lượt bootstrap này. R05 vẫn IN_PROGRESS.

## Nguồn, môi trường và công cụ

Repo Kynderis/kidea, master, nguồn lúc bắt đầu `bbe490ec71d2d0bfdaba74bd8869f35724a310e2`, working tree sạch trước tạo helper/evidence. Host macOS14.7 build23H124, Intel MacBookPro16,1,16GiB RAM, UID501, local APFS/internal PCIe, Hypervisor.Framework được `-accel-check` xác nhận dùng được. Không sudo/root hoặc thay PATH, JDK hệ thống, xcode-select, Docker Desktop hay macOS. Full Xcode chưa cài; iOS16.2 mới APPROVED hướng lab, còn thiếu manifest/bộ cài Apple.

Bốn archive Google đúng size/SHA1 publisher, giữ SHA256 thực: Emulator37.1.11 x64/build15917651, Platform Tools37.0.1, Command-line Tools23.0, AOSP API36x86_64 revision2. Tổng payload1481684124byte (~1.38GiB), không tải lại archive. Công cụ/AVD/key/cache ở `/Users/kendrick/Desktop/kidea-native-lab/android-sim-r1/`, không trong Git. JDK21.0.11 đã có chỉ dùng cho avdmanager. Build A1/compileSDK37/target37 không đổi.

## Kết quả cuối trên helper cuối

Lượt `boot-183` hoàn tất sau chỉnh harness: `sys.boot_completed=1`, API36, ABI x86_64;2CPU guest, MemTotal2067746816byte (~1.93GiB), hardware-qemu.ini2048MiB. Cờ `-lowram` giữ đúng mức RAM yêu cầu; `ro.config.low_ram` trả rỗng nên **không gọi đây là chứng minh Android Go hoặc low-RAM framework mode**. Dùng GLES host AMD Radeon Pro5300M; Vulkan vẫn SwiftShader theo log. Đây là cấu hình lab, không đại diện hiệu năng điện thoại.

`codesign --verify --deep --strict -R=notarized --check-notarization` PASS trước boot; Gatekeeper vẫn bật. Có assertion Awake và launcher resumed, rồi [ảnh launcher cuối](android-sim-bootstrap-r1/android-home.png) đã được agent xem trực tiếp, không phải chỉ kiểm header PNG. [Power](android-sim-bootstrap-r1/221-guest-power/stdout.log), [activity](android-sim-bootstrap-r1/222-guest-activity/stdout.log), [screenshot gốc lượt cuối](android-sim-bootstrap-r1/223-guest-screenshot/stdout.log).

Các cổng ADB/console5554/5555 chỉ loopback; gRPC không yêu cầu. ADB server thuộc lượt, chỉ target `emulator-5554`, mDNS auto-connect tắt. Không dùng/cài APK vào thiết bị USB. ADB còn cảnh báo interface USB của host không tạo được; boot qua loopback đạt, không cài driver để xử lý cảnh báo không liên quan.

Sau kiểm, emulator exit0, ADB foreground được dừng bằng SIGTERM, không còn process thuộc lab hoặc listener5037/5554/5555. Docker không có workload chạy trong lượt. [Guard10/10](android-sim-bootstrap-r1/guard-tests.stderr.log) kiểm chặn deadline/tải/đĩa/free-space/guest RAM tự tăng/CPU/missing config, gồm đúng khoảng trắng của hardware-qemu.ini. Không chạy lại core hoặc A1 vì không đổi nguồn tương ứng.

## FAIL/giới hạn được giữ

1. Bộ giải nén ZIP đầu không khôi phục AppleDouble xattrs: codesign fail tại NOTICE.csv. Giữ nguyên bản giải nén đầu trong lab; `ditto` khôi phục metadata từ chính archive đã xác minh, chữ ký/notarization sau đó đạt. Không ký lại, xóa quarantine hoặc bỏ gate. `spctl` thử trực tiếp CLI báo không phải app; dùng kiểm codesign đúng loại artifact theo [Apple TN2206](https://developer.apple.com/library/archive/technotes/tn2206/).
2. avdmanager cần đăng ký package emulator; thêm package.xml vào thư mục signed khiến seal fail. Metadata tự tạo được dùng cho avdmanager rồi chuyển ra evidence lab; trước chạy emulator kiểm lại toàn bộ chữ ký publisher đạt. Không sửa bundle để hợp thức hóa chữ ký sai.
3. ADB không chấp nhận hostname trong listen socket đã chỉ định; sửa thành `tcp:5037` theo cú pháp hỗ trợ, không dùng `-a`; kiểm lại listener thực chỉ localhost.
4. Lượt software renderer chạm4306325504byte RSS (~4.01GiB) và watchdog dừng. Đây là **lượt FAIL do vượt ngưỡng lấy mẫu**, không hard cap tuyệt đối như cgroup; chuyển GLES host và giữ trần4GiB. Lượt cuối peak3037343744byte (~2.83GiB), monitor gồm crashpad reparented. Các sample/FAIL cũ giữ nguyên.
5. Emulator tự tăng RAM guest2048→2560MiB. Agent phát hiện từ log, dừng lượt host-renderer đó; lần tiếp dùng `-lowram` chính thức và thêm assertion RAM thực/ini, không tăng hạn mức. Một preflight port ngay sau shutdown fail rồi kiểm port trống mới thử lại.
6. Một lượt đạt kiểm tự động nhưng screenshot đen. [Review hình](android-sim-bootstrap-r1/visual-review-before-final.md) bác kết luận đầy đủ; receipt cũ giữ ở [collection-before-visual-review](android-sim-bootstrap-r1/collection-before-visual-review.json). Thêm wake/dismiss-keyguard/HOME và assertion Awake/resumed; lượt cuối chạy lại đủ và ảnh đã xác minh.

Raw log có public ADB key được giữ ngoài Git, bản repo che đúng dòng public key và giữ hash trước/sau trong receipt. Không đưa private key, console token hoặc SDK archive vào Git. Collector lần đầu cũng giữ nguyên receipt; không thay FAIL bằng kết quả của lượt khác.

## Tài nguyên, bảo toàn và điểm tiếp tục

Payload1.38GiB; dành thêm64MiB headroom cho metadata/trust-service dưới trần2GiB, không nhận đó là số byte toàn mạng đã đo (không packet capture dịch vụ OS). Đĩa tăng~8.25/12GiB; tích lũy từ E2~30.38/47GiB; còn~348.65GiB (>100). Free-space delta có thể gồm hoạt động máy khác. Tổng đến collection cuối~22.7/90phút; start/deadline/counter không reset qua các retry. Bản giải nén lỗi/cache/AVD giữ theo receipt, không prune.

23file snapshot/live Android A1 và21hồ sơ pilot khớp hash cũ; không thay nguồn/evidence Windows, backend/Web hoặc profile pilot. Cài/boot Android lab đã hoàn tất đúng phạm vi. Image AOSP có launcher/accessibility-menu nhưng không có package TalkBack trong inventory; chưa nhận accessibility thực thi là đạt.

Tiếp theo chuẩn bị fixture và gói runtime N01…N08 (gồm graph/advisory khi thêm instrumentation, APK lab, TLS endpoint và các oracle); không chạy gói này từ approval bootstrap. iOS hướng Xcode16.2/Simulator18.2 đã được Human chọn, không xin lại; cài iOS chờ artifact/manifest/đăng nhập Apple tại máy. Apple Silicon NOT_RUN. Không coi Android boot PASS là mẫu Kidea PASS hoặc R05 đã khép.
