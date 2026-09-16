# R05 — Android trong Docker và điểm chặn iOS, r1

Ngày 2026-09-16. **APPROVED — Human “tôi duyệt” sau gói A1 tại `ca5a96f`.** Duyệt thực thi Android trong Docker, điều khoản SDK và các hạn mức A1 nêu dưới; không duyệt nâng macOS/iOS hoặc trước kết quả. Những chữ “đề nghị/chưa duyệt” bên dưới mô tả bản r1 lúc trình, được sự kiện này thay thế trong đúng phạm vi A1. Human “ok làm đi” sau `7ce22e0` trước đó chỉ giao review/chuẩn bị. [Roadmap](../KIDEA_ROADMAP.md#review-current), [baseline đã duyệt](r05-profile-method-r1.md), [manifest artifact](../tests/evidence/r05/native-plan-r1/manifest.json).

**Amendment hiện hành:** Human đã duyệt [SDK37.0/target37](r05-android-sdk37-r1.md) trong lúc kiểm A1, thay đúng baseline36.1/36 bên dưới. Các artifact/budget khác giữ nguyên; kết quả theo [báo cáo A1](../tests/evidence/r05/android-execution-r1.md). Bảng36.1 bên dưới giữ nguyên lịch sử bản trình đầu.

## Kết quả review backend/Web

Đối chiếu lại 78 hash nguồn mẫu, 21 hồ sơ pilot, bốn JUnit suite, sáu mutant, các lượt cuối HTTPS/browser/drain và provenance Web/Caddy: [review kỹ thuật PASS đúng phạm vi](../tests/evidence/r05/native-plan-r1/backend-review.json). Không chạy lại workload hoặc thay evidence r4/r5. Đây là review của agent hiện tại, không phải người review độc lập thứ hai hoặc Human nghiệm thu toàn R05. Ngoại lệ SQLite vẫn có thời hạn cũ. Không chuyển 22 nhóm vector mẫu thành 137 ca ứng dụng hoặc nghiệm thu production.

## Đề xuất một gói A1

Chuẩn bị công cụ Android **bên trong Docker Linux/amd64 hiện có**, tạo mẫu nhỏ và kiểm compile/lint/unit/debug/release không ký phát hành. Giữ macOS 14.7, JDK21 hệ thống và Node22 mặc định. Không cần Android Studio, emulator, ADB, NDK, tài khoản Google/Play hoặc cloud trong A1. Không cài APK lên điện thoại trong gói này.

**Đích mới, CREATE-only:** sibling `kidea-workshop-pilot/samples/r05/android-r1/` cho source/receipt được phép tạo sau duyệt; volume `kidea-r05-a1-work` chứa `/work/tools`, `/work/gradle-home`, `/work/android-sdk`, `/work/android-sample` và cache; evidence mới `tests/evidence/r05/android-execution-r1/`. Không ghi đè sibling/file/volume không khớp receipt; không sửa 21 hồ sơ pilot hoặc sample backend/Web. Repo Kidea chỉ giữ gói, helper, nguồn mẫu snapshot và bằng chứng; không SDK/binary/private key. Không tạo `.kidea` hoặc Git repo cho pilot.

Tái dùng image local `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`, Ubuntu 24.04, user `1000:1000`; đã kiểm image còn có. Không pull image mới hoặc dùng tag động. JDK giải nén bằng tar có sẵn; dùng `jar` của chính JDK để đọc/giải nén zip vào volume sau kiểm entry/path. Không cần apt hoặc cài thêm tiện ích trên host. Nếu thiếu thư viện native của tool thì ghi lỗi và trình phần bổ sung cụ thể, không tự apt latest.

## Artifact và tổ hợp cố định

| Gói | Phiên bản/kiến trúc | Tải theo metadata chính thức |
|---|---|---:|
| Temurin JDK | 17.0.20.1+1, Linux x64 | 193.252.603 byte |
| Gradle binary | 9.4.1 | 137.878.901 byte |
| Android platform | 36.1 revision 1 | 66.270.841 byte |
| Android build-tools | 36.0.0, Linux | 63.737.259 byte |
| Tổng bốn archive | Chưa gồm Maven/cache | **461.139.604 byte, khoảng 440 MiB** |

URL, size, hash và raw metadata nằm trong [manifest](../tests/evidence/r05/native-plan-r1/manifest.json). JDK SHA256 khớp cả release asset metadata và checksum sidecar. Gradle SHA256 từ Gradle. Hai SDK archive được Google XML công bố SHA1: kiểm SHA1/size qua nguồn HTTPS chính thức rồi tính/lưu SHA256 của binary khi tải được duyệt; không gọi SHA256 tự tính là chữ ký độc lập của nhà phát hành. Không tải SDK CLI “latest” đang khác revision giữa trang web và XML; A1 chỉ dùng hai archive SDK đã nêu.

[AGP 9.2](https://developer.android.com/build/releases/agp-9-2-0-release-notes) xác nhận Gradle 9.4.1, JDK17 và build-tools36.0.0. Giữ AGP9.2.1; compileSdk36.1, targetSdk36, minSdk26. Compose BOM2026.06.01, Compose compiler plugin/Kotlin2.3.10. Dependency trực tiếp bổ sung cho mẫu: activity-compose1.13.0, lifecycle-viewmodel-compose2.10.0, kotlinx-coroutines-test1.10.2, JUnit4.13.2; POM đúng tọa độ đều trả200, **chưa có graph đã resolve**.

**Điểm phải kiểm trước build:** POM và Gradle module AGP9.2.1 thực tế yêu cầu KGP2.2.10, khác baseline2.3.10 trong profile/release notes. Giữ baseline đã duyệt bằng khai báo classpath KGP2.3.10 tường minh theo [cách Google hỗ trợ chọn KGP cao hơn](https://developer.android.com/build/releases/agp-9-0-0-release-notes#kotlin-support); Compose compiler cũng2.3.10. Không thêm plugin `org.jetbrains.kotlin.android` trùng [built-in Kotlin](https://developer.android.com/build/migrate-to-built-in-kotlin). In resolved graph và assert compiler thực trước build; không suy POM tồn tại là tổ hợp chạy được. Nếu không resolve đúng bản thì dừng tại gate này, không tự đổi baseline.

## Quyền và hạn mức đề nghị mới

- Thêm tối đa **4 GiB download**, gồm archive, Maven, metadata và retry; **15 GiB đĩa tăng thêm** cho A1. Cộng nền E2 hiện khoảng19 GiB: đề nghị trần tích lũy **35 GiB từ baseline E2**, đồng thời sàn trống100 GiB. Đây là hạn mức mới chưa duyệt, không mặc nhiên kế thừa trần24 GiB của E2. Không dọn/prune cache cũ.
- Tổng workload Kidea đang chạy vẫn **2 CPU/4 GiB**, JVM heap2 GiB, workers2, timeout **3 giờ cho một lượt**; không tăng cấu hình Docker Desktop. Guard phải tính cả nhãn E2 và A1, dùng cùng lock; kiểm chặn topology vượt trần trước tải/build. Không tiếp tục âm thầm bằng nhiều lượt để vượt trần thời gian/tải.
- Container user1000, drop capabilities/no-new-privileges, rootfs read-only, tmpfs hữu hạn, chỉ volume/đích đã nêu; không mount Docker socket, home, Keychain hoặc SSH. Host chạy user thường. Không mở cổng host, publish/deploy, thiết bị/USB, telemetry/build scan chủ động hoặc dịch vụ trả phí.
- Network chỉ giai đoạn tải/resolve từ nguồn đã nêu và Google Maven/Maven Central; kiểm và lưu redirect. Không repository do dependency tùy ý thêm, không dynamic version/SNAPSHOT. Build/test chính thức chạy offline bằng graph đã giữ. Không nhận metadata/hash mới tự sinh là toàn bộ chuỗi cung ứng đã được chứng nhận.
- Human duyệt việc sử dụng SDK theo [điều khoản Google](https://developer.android.com/studio/terms) cùng gói này; chưa ghi license acceptance hoặc dùng `yes | sdkmanager --licenses`. Không xin tài khoản/secret. Archive SDK giữ trong volume local, không phân phối lại trong repo.

## Trình tự được đề nghị cho cùng một approval

1. Kiểm lại source/image/đích local, hash, đĩa và guard có nhận nhãn A1. Ghi môi trường/start/deadline/baseline trước thực thi. Mọi container phải qua cùng launcher; timeout dừng container, không chỉ dừng Docker CLI.
2. Tải bốn archive có counter và ngắt trước vượt trần; kiểm metadata/hash, kiểm entry archive trước giải nén. Tạo JDK/Gradle/SDK trong volume, biến môi trường chỉ ở container. Kiểm `java -version`, `/work/tools/gradle-9.4.1/bin/gradle --version`; không thay JDK21 host.
3. Tạo mẫu giới hạn bên dưới cùng source/config; explicit JDK17 và Kotlin/Compose2.3.10. Resolve tất cả configuration debug/release/test cần dùng, lưu graph, license/advisory phù hợp, Gradle dependency locks và verification metadata SHA256, gồm plugin classpath/artifact. **Graph chưa có hiện tại**; bootstrap được đề nghị trong A1 nhưng build chỉ tiếp tục khi graph đúng baseline, không có blocker chưa xử lý và artifact được đối chiếu nguồn. Không coi `dependencies` text đơn thuần là đã tải/kiểm mọi binary. Sai hash, artifact không rõ nguồn hoặc cần đổi dependency/phạm vi thì dừng và lưu bằng chứng.
4. Sau gate graph, chạy offline, `--no-daemon --max-workers=2`: `lintDebug lintRelease testDebugUnitTest testReleaseUnitTest assembleDebug assembleRelease`, full lint warnings-as-errors; source/lock hash trước–sau. Release bật shrinking, không upload/ký bằng danh tính phát hành. Debug key do tool sinh chỉ ở volume; không đưa key vào evidence. Ghi APK variant/version/hash và release signing status chính xác.
5. Chạy sáu mutant riêng biệt dưới bản copy, bắt đúng oracle; không sửa expected để lấy PASS. Chạy lại đầy đủ nguồn chuẩn sau mutant. Giữ raw FAIL/PASS, XML/lint/graph/hash/resource receipts; không dùng đơn thuần exit khác0 thay nhận diện lỗi mong đợi.
6. Dừng toàn bộ container/daemon do A1 tạo, kiểm không có listener, lưu đĩa/download/source, scan sentinel/private-key marker. Cache giữ theo receipt. Cập nhật roadmap/answer, commit/push repo trong quyền hiện hành; không coi A1 là toàn profile Android hoặc toàn R05 đạt.

Approval A1 bao gồm sửa lỗi mẫu/helper trong phạm vi trên và chạy lại trong trần; không cần xin từng lệnh. Không bao gồm nâng dependency ngoài manifest, bypass TLS/checker, tăng quota, công cụ host hoặc device tests.

## Mẫu và oracle Android

Mẫu một app lab dữ liệu giả, hai trạng thái xem/ý định N1/N2; repository giả có scheduler/barrier điều khiển thứ tự, ViewModel owner/generation, state immutable, Compose đọc state và chỉ phát intent qua callback. Không nối dịch vụ thật, không admin native. Không dùng mẫu để thay code sản phẩm.

| Nhóm | Thuận và nghịch cần bắt | Chứng minh được trong A1 / còn thiếu |
|---|---|---|
| A01 cancellation/generation | Logout/đổi actor giữa await; callback cũ bị bỏ; mutant bỏ generation guard | Unit scheduler; lifecycle Android thực còn thiếu |
| A02 owner/resource | Đóng owner hủy job/collector; callback đến muộn không publish; mutant bỏ cancel | Unit scheduler; rotation/process death thực còn thiếu |
| A03 command boundary | Render/read state không gọi mutation; callback intent mới gọi đúng1lần; mutant gửi lại trong state-read | Unit logic và Compose compile; recomposition/Back instrumentation chưa chạy |
| A04 identity/version | Tách actor/epoch/workshop; chuỗi uint64, >2^53, max và overflow; mutant gộp actor cache key | Unit vector, không nhận là toàn API contract |
| A05 UNKNOWN/retry | Mất response giữ nguyên intent ID/trạng thái UNKNOWN; đọc lại kết quả đúng quyền; mutant tạo mã mới | Unit fake repository; TLS/network thật chưa chạy |
| A06 thread/diagnostic | Dispatcher tiêm được, không swallowing cancellation; mutant nuốt cancel để publish | Unit/lint; StrictMode và observer count trên máy thật chưa chạy |
| A07 build/release | Kotlin/Compose resolved cùng bản, debug+release lint/unit/compile, shrinking, versionName/code | Compile/lint/artifact; cài/chạy release/device/signing chưa chạy |
| A08 privacy/UX | Manifest/config không cleartext/trust-all; label/semantics source rõ, không token/log thật | Kiểm tĩnh giới hạn; Keystore/TLS/revoke, TalkBack/font/Back/app-switcher cần thiết bị |

Các ca thiết bị là phần còn lại bắt buộc của profile, không bị bỏ hoặc tự đẩy hết sang R09. Chưa cần Human cắm điện thoại để thực hiện A1; gói device sẽ chọn serial/model/OS và quyền riêng trước khi chạy, không tự lấy thiết bị đầu tiên.

## iOS: chuẩn bị quyết định máy, chưa INSTALL_READY

Giữ Xcode26.6/Swift6.3, SDK26.5, deployment16 đã duyệt. [Apple](https://developer.apple.com/xcode/system-requirements) vẫn yêu cầu macOS Tahoe26.2–26.x cho tổ hợp này; host thực14.7 chưa đáp ứng. Không tự đổi sang Xcode16.2 hoặc Xcode27. Chưa có Xcode tại vị trí Applications đã kiểm. Docker Linux không cung cấp Xcode/iOS SDK để chứng minh profile SwiftUI này.

Máy thực `MacBookPro16,1`; Apple liệt kê [MacBook Pro16-inch2019 hỗ trợ Tahoe](https://support.apple.com/en-us/122867). Vì vậy không kết luận phải mua máy chỉ vì Intel. Hai lựa chọn khi đến iOS: (a) giữ máy hiện tại, Human nâng OS sau kế hoạch backup/restore/kiểm ứng dụng và quyền riêng; hoặc (b) dùng Mac khác đã đáp ứng baseline do Human cấp. Đề nghị **chưa nâng máy trong lượt A1**.

Chưa chọn iPhone/simulator destination, signing identity, exact Xcode installer/checksum/download size và ngân sách cài. Không đưa một con số ước lượng thành quyền cài Xcode. Bước chuẩn bị iOS tiếp theo phải bổ sung các mục này trên máy được chọn; simulator và iPhone ghi kết quả riêng. IOS-01…08 vẫn NOT_RUN; R05 giữ IN_PROGRESS.

## Cần duyệt gì

**Một xác nhận A1:** tải/cài công cụ chỉ trong Docker volume, tạo và kiểm mẫu Android theo manifest/gate ở trên, sử dụng SDK theo điều khoản Google, thêm4 GiB tải/15 GiB đĩa và trần tích lũy35 GiB; giữ2 CPU/4 GiB/3 giờ. iOS giữ chặn môi trường, không nâng/cài trong gói này.

Cần xác nhận vì chỉ thị Human ban đầu cấm tự cài công cụ/thay môi trường khi chưa duyệt gói cụ thể; quyền E2 backend/Web trước đó không bao gồm SDK Android hoặc tăng trần đĩa. Đây không phải yêu cầu phát sinh từ skill và không yêu cầu duyệt lại R05 r1/backend/Web.
