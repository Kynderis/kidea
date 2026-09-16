# R05 — Android A1 trên Docker/Mac Intel, r1

Lượt2026-09-16 UTC, hoàn tất2026-09-17 giờ Việt Nam. **Android A1 PASS đúng phạm vi lab; R05 vẫn IN_PROGRESS.** Full positive trên nguồn hoàn chỉnh đã chạy lại từ đầu sau sáu mutant, không coi unit/build riêng lẻ là nghiệm thu toàn profile. Human “tôi duyệt” sau `ca5a96f` duyệt đúng [A1](../../../proposals/r05-native-build-r1.md); iOS/thiết bị và toàn R05 chưa nghiệm thu.

## Nguồn và môi trường

Nguồn repo `Kynderis/kidea`, master, HEAD lúc bắt đầu `ca5a96f87b471b495a02501b05a49744a440c62a`. [Môi trường thực](android-execution-r1/environment.json), [start/deadline](android-execution-r1/start.json), [approval](android-execution-r1/approval.md). macOS14.7 Intel x64, account501, checkout local APFS; host Node mặc định22.22.2 giữ nguyên. Helper dùng Node24.19.0 có sẵn trong runtime Codex. Image Linux/amd64 đã có, user1000, JDK17/Gradle9.4.1/SDK36.1/build-tools36 chỉ trong volume; không cài công cụ hệ thống hoặc đổi Docker Desktop.

## Chuỗi kiểm và lỗi giữ lại

1. Guard E2/A1 dùng cùng lock và trần tổng2CPU/4GiB:6/6 unit PASS; Docker thực từ chối thêm client0.5CPU/1GiB khi A1 đã giữ2CPU/4GiB, trước tạo container.
2. Bốn archive461.139.604byte khớp size/hash nhà phát hành; Java/Gradle chạy được. [Toolchain](android-execution-r1/toolchain.json). Hai SDK đối chiếu SHA1 từ Google XML rồi giữ SHA256 tự tính, không gọi đó là chữ ký độc lập.
3. Những FAIL cấu hình đầu giữ nguyên: Java user.home mặc định không ghi được; Gradle không cho failOnDynamicVersions cùng locking; resolve AndroidTest chạm variant project không thuộc A1; SDK archive thiếu package metadata. Sửa home trong volume; giữ locks và kiểm dynamic/changing tường minh; chỉ resolve module artifacts và loại instrumentation ngoài A1; đăng ký metadata từ Google XML. Lượt đăng ký SDK exit1 vì build-tools package.xml đã được AGP tạo: không ghi đè, platform đã đăng ký; resolve sau đó PASS.
4. Kotlin Gradle plugin, compiler và Compose compiler resolve đúng2.3.10, không dùng plugin kotlin-android trùng built-in Kotlin. Bật `android.onlyEnableUnitTestForTheTestedBuildType=false` vì AGP9 mặc định chỉ bật unit cho build type debug; cả debug/release được kiểm. [Google AGP9](https://developer.android.com/build/releases/agp-9-0-0-release-notes).
5. Build offline đầu FAIL vì AAPT2 là cấu hình detached được AGP yêu cầu muộn. Tải chính xác `com.android.tools.build:aapt2:9.2.1-15009934:linux`, cùng AGP đã duyệt; kiểm publisher checksum/license/advisory rồi chạy lại offline. Không đổi baseline hoặc mở mạng trong build.
6. Lint lần đầu4lỗi: OldTargetApi, GradleDependency, DataExtractionRules, MissingApplicationIcon. Sửa hai lỗi mẫu bằng icon vector và quy tắc loại dữ liệu khỏi cloud/device-transfer; giữ allowBackup=false cho phiên bản cũ. [Log4lỗi](android-execution-r1/lint-initial-debug.txt). Hai lỗi SDK còn nguyên; không suppression/lint-baseline/giảm warnings-as-errors.
7. Dùng `--continue` để chạy các task độc lập và lưu đủ kết quả; tổng exit1 vẫn FAIL. Task instrumentation/vital tự ghi SKIPPED theo AGP không là ca unit bị bỏ; A1 không có instrumentation và full lint debug/release vẫn chạy.

Gradle còn thông báo platform-tools không có (A1 không cài ADB), API Gradle deprecated và không strip được thư viện có sẵn `libandroidx.graphics.path.so`; binary được đóng gói nguyên trạng, không tự cài NDK. Đây không phải kiểm hiệu năng/kích thước hoặc chứng minh chạy ABI trên thiết bị. Không đổi lint warnings-as-errors.

8. Human duyệt SDK37.0/target37 qua câu hỏi async. Archive37.0 revision2 khớp size/SHA1 Google; giữ SHA256 tự tính và SDK36.1 cũ. Graph Maven304tọa độ không đổi; lượt đầy đủ đầu SDK37 PASS mà không hạ lint. [Approval](android-execution-r1/sdk37-approval.json), [receipt](android-execution-r1/sdk37-download.json), [graph comparison](android-execution-r1/sdk37-graph-comparison.json).
9. Rà mẫu phát hiện khóa cache nối chuỗi có thể trùng khi ID chứa dấu `:`. Thêm ca kiểm tái hiện:11ca, đúng1FAIL ở `cacheSeparatesIdentitiesContainingDelimiters`; đổi map key sang cấu trúc `Identity`, giữ kỳ vọng, debug/release11/11PASS. Test dispatcher cũng kiểm trực tiếp lời gọi dispatcher được tiêm. [FAIL XML](android-execution-r1/identity-collision-red.xml), [patch](android-execution-r1/identity-cache-fix.patch), [PASS debug](android-execution-r1/identity-collision-green-debug.xml), [PASS release](android-execution-r1/identity-collision-green-release.xml).

10. Hoàn thiện UI hai trạng thái xem/ý định: nút đăng ký chỉ phát ý định khi chưa có; trạng thái UNKNOWN hiển thị nút đối chiếu cùng mã, xác nhận hiển thị kết quả. Không thêm dependency, không tự retry. Sau thay đổi UI, chạy lại cả hai unit suite, sáu mutant riêng và full positive với `--rerun-tasks`; các lượt có tên `positive-final`/`mutations-final` trước đó giữ riêng, nguồn hoàn chỉnh dùng hậu tố `complete`. [Patch UI](android-execution-r1/intent-ui-completion.patch). UI runtime/device vẫn NOT_RUN.

## Dependency và phạm vi advisory

304tọa độ/binary Maven gồm AAPT2 đã đối chiếu checksum công bố, graph/Gradle locks/SHA256 verification metadata giữ trong evidence. [Graph](android-execution-r1/resolved-graph.json), [publisher checksums](android-execution-r1/publisher-checksums.json), [POM/license inventory](android-execution-r1/pom-license-inventory.json). 303tọa độ ban đầu truy được license trực tiếp hoặc từ parent POM; AAPT2 có license riêng trong [gate bổ sung](android-execution-r1/dependency-gate-aapt2.json). Local lab không phân phối artifact; nghĩa vụ phân phối phải review trước release.

OSV trả48advisory độc nhất trên19tọa độ tooling; **không phải graph sạch lỗ hổng**. [Từng disposition và phạm vi](android-execution-r1/dependency-gate.json), raw OSV/advisories giữ nguyên. Không tọa độ trúng nào ở debug/release app runtime. Netty thuộc cấu hình UTP device/emulator không chạy; các đường JWE/GOST/LDAP/composite-signature/HTTP/XML hostile không có đầu vào trong mẫu đóng này. Lỗi Kotlin đối chiếu [bản vá JetBrains](https://github.com/JetBrains/kotlin/commit/bf51df665b458fda7c3eaf436c4d88dc119d7ec6) nằm ở KAPT incremental cache; inventory không có KAPT plugin/task, cache không nhập từ ngoài, Gradle caching và Kotlin incremental tắt rõ. Đây là đánh giá agent theo khả năng tiếp cận của đúng lab, không vá vendor hoặc ngoại lệ production; phải mở lại gate trước thêm network/device/KAPT/cache ngoài/dữ liệu lạ/signing.

Build/test chạy `--offline`, network=none, no host ports, không mount host home/socket/keys. Chỉ resolve dùng bridge Maven loopback bên trong container; upstream Google/Maven Central vẫn HTTPS có kiểm chứng. Không cài scanner/công cụ host; query OSV chỉ là đọc metadata dependency công khai, bytes được tính thêm vào receipt cuối.

## Kết quả cuối và điểm tiếp tục

[Manifest nguồn/32stage/container/quota](android-execution-r1/manifest.json), [nguồn mẫu snapshot](android-execution-r1/sample/README.md), [full positive cuối](android-execution-r1/positive-final-complete-kGlEZ1/stdout.log). Lệnh cuối dùng `--offline --rerun-tasks --continue`, mọi task bắt buộc đạt, exit0; không sửa kỳ vọng hoặc giảm lint. Các ca Gradle NO-SOURCE/SKIPPED thuộc task không có source/instrumentation ngoài A1; hai JUnit suite không skip testcase.

| Kiểm trên nguồn cuối | Kết quả |
|---|---|
| lintDebug / lintRelease | PASS, XML không có issue, warnings-as-errors giữ nguyên |
| testDebugUnitTest / testReleaseUnitTest | Mỗi variant11/11; fail/error/skip đều0 |
| assembleDebug / assembleRelease | PASS; release chạy R8 và resource shrinking |
| Sáu mutant `complete` |6/6bị bắt đúng oracle; mỗi mutant đủ11ca, không lỗi biên dịch hoặc skip |
| Source/lock | Nguồn volume khớp nguồn canonical readonly; trước/sau nguồn cuối khớp; graph304tọa độ không đổi qua SDK37 |
| Quota guard |6/6unit và chặn Docker thật topology vượt2CPU/4GiB |

[XML và lint cuối](android-execution-r1/final-artifacts/files.json), [sáu mutant](android-execution-r1/mutations-complete/results.json), [source check](android-execution-r1/final-artifacts/source-verification.json), [signing](android-execution-r1/final-artifacts/signing.json). Mẫu23file được snapshot; SDK/JDK/Gradle/cache/APK/debug key không đưa vào Git.

| APK | Byte | SHA256 | Signing |
|---|---:|---|---|
| debug |9094746|`4322b9c34a872f3c51dd7bc059834915f750b8b1a1e18d444eb690ed87bcac09`|Chữ ký Android Debug hợp lệ, v2; key chỉ ở volume|
| release |727442|`8ff8d779018deb6c490fbfa2e253b5b8844292ef4a05d19de1232125acda0724`|Unsigned; apksigner exit1/Missing META-INF/MANIFEST.MF là kết quả đúng của kiểm không ký, không phải build FAIL|

Hai APK là `org.kidea.lab`, versionCode1/versionName0.0.1-lab, minSdk26/target37/compile37. Chứa bốn ABI từ dependency không chứng minh chạy trên bốn ABI; không cài APK. UI có nhãn/trạng thái UNKNOWN/xác nhận và callback tách biệt, mới được compile/kiểm tĩnh; unit chỉ kiểm controller/repository giả.

Collector lần đầu FAIL do shell wrapper apksigner tìm `java` trên PATH container; giữ nguyên [attempt1](android-execution-r1/collection-attempt-1/signing-debug.stderr.log). Sửa riêng collector gọi JDK17 `java -jar` tường minh, không sửa APK/nguồn ứng dụng/host PATH; collect-fixed PASS. Lỗi gõ sai đường Docker của một lệnh đọc trên host cũng được ghi riêng, không chạy được process hoặc đổi máy.

Toàn bộ31container A1 đã dừng; không cổng host, rootfs readonly, user1000, dropALL/no-new-privileges. [Cgroup thực](android-execution-r1/final-artifacts/container-runtime.json) ghi2CPU/4GiB/pids256. Không có workload E2 còn chạy; cache/volume giữ theo receipt, không prune. Thời lượng70.1phút trong deadline3giờ gốc; không dùng quyền lượt tiếp tục90phút.

Tải đã tính 0.845GiB payload qua counter; cộng metadata audit và64MiB headroom thành0.909GiB, dưới4GiB. Đĩa tăng thêm4.09/15GiB, tích lũyE2 23.10/35GiB, còn355.93GiB (>100). Free-space delta là đo toàn filesystem, gồm hoạt động máy khác và allocation overhead, không khẳng định phân bổ byte tuyệt đối cho riêng workload.

78nguồn backend và27nguồn Web nguyên hash. 21hồ sơ pilot nguyên hash ở đầu lượt; sau approvalSDK37 chỉ `docs/engineering/android.md` chuyển profile r2/baseline37.0/37, tám rule giữ nguyên,20file khác không đổi. [Amendment phục hồi](android-execution-r1/pilot-amendment-sdk37.json), [kiểm bảo toàn cuối](android-execution-r1/preservation-after-amendment.json). Không sửa evidence Windows/r4/r5/native-plan/profile-r1 lịch sử. Core Kidea/package/lock không đổi so với ca5a96f; không chạy lại283ca lõi trong lượt Android này, kết quả Mac Intel283/283 trước đó giữ đúng nguồn/phạm vi cũ.

[Gói SDK37.0](../../../proposals/r05-android-sdk37-r1.md) đã APPROVED/applied; không cần duyệt lại SDK hoặc quota để ghi nhận kết quả này. Còn review kết quả A1 và phần thiết bị của Android, rồi môi trường/mẫu iOS theo roadmap; không tự mở R06/R09 hoặc nghiệm thu toàn R05.

A1 không chứng minh install/run trên Android thật, lifecycle/rotation/process death, recomposition/Back/TalkBack/font/app-switcher, Keystore/TLS/revoke/network thật, release ký phát hành hoặc hiệu năng. Unit release kiểm JVM logic, không chạy APK đã shrink. iOS vẫn BLOCKED_ENV_PENDING; không nâng OS/Xcode. Mac Intel không chứng minh Apple Silicon. R05 giữ IN_PROGRESS.
