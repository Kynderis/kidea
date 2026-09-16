# Kotlin / Compose — profile r1

**PROPOSED — chờ duyệt nội dung**, chưa build/emulator/device test. Chỉ màn người tham gia N1/N2; không admin native. [Rule chung/ngoại lệ](rules.md#exceptions); nguồn [màn hình](../design/experience.md#screens), [API](../design/architecture.md#api), [merge/lifecycle](../design/architecture.md#updates).

<a id="toolchain"></a>
## Tổ hợp và command dự kiến

AGP 9.2.1, Gradle wrapper 9.4.1, JDK 17, Kotlin tích hợp AGP (baseline 2.3.10), Compose BOM 2026.06.01; compiler Compose phải khớp Kotlin thực. compileSdk/targetSdk 36.1/36, minSdk 26 giữ baseline; SDK Build Tools 36.0.0 theo bảng AGP. Chưa verify resolved Kotlin/BOM artifact hoặc toolchain trên Mac; không nhận chúng thành tổ hợp đã build. Không thêm KMP/NDK. [AGP 9.2 compatibility](https://developer.android.com/build/releases/agp-9-2-0-release-notes) xác nhận Gradle/JDK; [built-in Kotlin](https://developer.android.com/build/migrate-to-built-in-kotlin) yêu cầu bỏ plugin kotlin-android trùng khi dùng built-in.

Sau quyền build và có wrapper được xác minh checksum: `./gradlew --version`, `./gradlew lint testDebugUnitTest assembleDebug`, `./gradlew connectedDebugAndroidTest` trên thiết bị được chọn; Windows dùng `gradlew.bat`. Không tạo wrapper/config hoặc chạy lệnh trong lượt hồ sơ. Build debug không thay test release shrinking/signing; mẫu release có quyền và khóa giả phù hợp lab mới được chạy. APK/AAB phải ghi variant, versionName/versionCode, dependency graph, signing identity không secret và SHA.

<a id="rules"></a>
## Rule

| ID | Phạm vi / lý do / nguồn | Đúng | Sai | Kiểm |
|---|---|---|---|---|
| AND-01 | Coroutine/lifecycle; architecture/updates | Scope theo owner, cancel khi đóng/đổi actor và check generation trước apply | GlobalScope request sống qua logout rồi render dữ liệu cũ | TC-20: rotate/background/process recreation/logout ở từng điểm await |
| AND-02 | Compose state, experience/screens | UiState immutable, state hoisted; mutation phát từ ý định xác nhận | Recomposition tự gọi POST | TC-03/TC-19: nhiều recomposition không tăng số request mutation |
| AND-03 | Epoch/cache, architecture/updates | Kho ý định theo actor, epoch; version chuỗi/64-bit kiểm overflow | SavedState chứa token/response riêng cho actor kế | TC-07/TC-09: process death và đổi phiên không lẫn payload |
| AND-04 | Transport/storage, architecture/api | TLS xác minh, token trong cơ chế OS/Keystore phù hợp, không URL/log | Trust-all cert hoặc credential plain preferences | TC-09: cert không tin, backup/log inspection, thu hồi quyền |
| AND-05 | API/unknown, R-RETRY | Giữ cùng mã khi kết quả chưa biết; đối chiếu đúng quyền | WorkManager tự gửi lại admin/mã mới hoặc 404 coi chưa thực hiện | TC-03/TC-05: network loss, reconnect, duplicate/old result |
| AND-06 | Thread/resource, architecture/components | I/O ngoài main; Flow thu theo lifecycle; dispose socket đúng owner | DB/network blocking main hoặc nhiều collector không hủy | TC-18/TC-20: strict-mode diagnostics, rotate 10 lần, observer count |
| AND-07 | Toolchain/release, rules/contract | Wrapper/config cố định, Compose compiler cùng Kotlin, versionCode tăng theo bản phát hành | Dynamic dependency `+`, plugin Kotlin Android trùng AGP9, chỉ test debug | TC-15/TC-17: mẫu config đúng/sai, variant release và cặp API |
| AND-08 | UX/accessibility, experience/usability | Semantics/label, cỡ chữ hệ thống lớn, Back giữ state đúng actor | Chỉ icon không label, Back phát mutation, text cắt nút | TC-19/TC-20: TalkBack, font lớn, back/relaunch trên thiết bị thật |

Không ngoại lệ mặc định; mọi rule theo rules/exceptions. Hủy coroutine không chứng minh server rollback; vẫn giữ trạng thái UNKNOWN của ý định đã gửi.

<a id="samples"></a>
## Mẫu đúng–sai

Mẫu thuận: ViewModel + state stream có owner/generation và dependency dispatcher tiêm được. Mẫu sai: catch CancellationException rồi tiếp tục publish, hoặc mutation trong thân composable. Khi được phép build, compiler/lint và test scheduler điều khiển thứ tự await phải bắt mẫu sai; UI instrumentation kiểm wiring lifecycle. Tất cả **NOT_RUN**. [Hướng dẫn coroutine Android](https://developer.android.com/topic/libraries/architecture/coroutines) là nguồn kỹ thuật; không thay các oracle nghiệp vụ pilot.
