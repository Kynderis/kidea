# R05 — Ma trận kiểm chứng Kidea bằng thiết bị mô phỏng, r1

Ngày 2026-09-17. **APPROVED hướng và phạm vi chuẩn bị**: Human “ok làm đi” sau đề nghị chỉnh ma trận R05 và chuẩn bị môi trường mô phỏng. **Cài/chạy môi trường: PROPOSED, chưa thực thi.** Gói này thay yêu cầu điện thoại thật làm điều kiện vào lượt lab trong [gói thiết bị r1](r05-native-device-r1.md). Không duyệt trước kết quả R05, không đổi expected nghiệp vụ của pilot.

**Sự kiện mới nhất:** Human “tôi hiểu rồi, làm đi nhé” qua annotation vào câu hỏi duyệt gói Android và hướng lab iOS đã **APPROVED A-SIM-BOOT r1** (bốn archive/hạn mức/cài và boot smoke bên dưới) và **chọn hướng lab iOS16.2**. Các chữ “đề nghị/chưa duyệt” bên dưới giữ lịch sử bản trình. Approval iOS mới chỉ chốt hướng, không cấp quyền tải/cài khi manifest còn thiếu. Không cần xin duyệt lại A-SIM-BOOT; runtime N01…N08 vẫn là gói sau bootstrap, chưa nghiệm thu R05.

**Kết quả:** [bootstrap Android](../tests/evidence/r05/android-sim-bootstrap-r1.md) đã PASS sau sửa harness trong cùng hạn mức; launcher/API/ABI/RAM thực được kiểm, công cụ và AVD giữ trong local lab, tiến trình/cổng đã dừng. Không phải PASS N01…N08. iOS vẫn chờ artifact trước gói cài.

## Phạm vi và quyền quyết định của project

R05 kiểm chứng hướng dẫn, profile và phương pháp kiểm của Kidea bằng mẫu nhỏ có thể chạy và mẫu sai phải bị bắt. Android Emulator/iOS Simulator được dùng làm môi trường runtime của các ca bên dưới. Thiếu điện thoại thật không chặn những ca đó. Kết quả luôn ghi rõ môi trường; chưa chạy vẫn NOT_RUN.

SDK, compiler, deployment target và thiết bị hỗ trợ là quyết định của từng project. API26/iOS16 và các tổ hợp phiên bản trong pilot chỉ thuộc cấu hình kiểm chứng đã chọn; không là mức tối thiểu Kidea áp đặt lên mọi ứng dụng. Tổ hợp chưa kiểm không được gọi là đã hỗ trợ. Không bỏ rule an toàn hoặc nâng kết quả mô phỏng thành chứng nhận phần cứng thật.

Test specs TC-01…20 của pilot mô tả nghĩa vụ ứng dụng đầy đủ. Ma trận dưới đây quy định **lát cắt mẫu R05**, không thay kết quả 137 ca ứng dụng, các ngưỡng R03/R04 hoặc kế hoạch thực thi R08/R09/R10. Hồ sơ pilot và snapshot lịch sử giữ nguyên; khi áp dụng vào project phải đọc cả phạm vi thực thi tương ứng.

## Ma trận đủ để trình review native R05

| Nhóm / rule | Mẫu và oracle bắt buộc của R05 | Môi trường và giới hạn |
|---|---|---|
| N01 — AND-07, IOS-01/07, TC-17 | Build sạch đúng tổ hợp, lint/strict concurrency, unit; mẫu config/actor isolation sai phải bị bắt đúng lỗi. Ghi compiler, SDK, target, source/config/dependency/artifact hash. | Android A1 đã có bằng chứng riêng; iOS còn NOT_RUN. Simulator build không chứng minh device archive/signing. |
| N02 — AND-01/06, IOS-01/02, TC-18/20 | Barrier giữ await; đổi actor/logout/đóng owner rồi trả callback cũ. State không bị ghi lại, job/collector được hủy. Android rotate10lần; iOS thay view/background/foreground. Mutant bỏ guard/cancel phải bị bắt. | Unit kết hợp runtime mô phỏng để kiểm wiring; đo số observer và diagnostics, không suy thành pin/hiệu năng phần cứng. |
| N03 — AND-02/05, IOS-05/06, TC-03/05/19 | Recomposition/appear/Back/read không gửi mutation; ý định rõ gửi một lần; mất response giữ UNKNOWN và cùng intent ID khi đối chiếu. Mutant tự gửi/lấy mã mới phải bị bắt. | Fake repository điều khiển lỗi cho unit; thêm endpoint lab cho đường transport thật ở N05. Không gọi fake là kiểm mạng. |
| N04 — AND-03, IOS-03, TC-07/09/20 | Actor/epoch/workshop/audience tách đúng; số uint64 >2^53/overflow; recreate/relaunch không lẫn payload hoặc tự gửi lại ý định. Mẫu cache key sai bị bắt. | Kiểm restart có điều khiển; không tuyên bố mô phỏng mọi kiểu OS kill hoặc mọi đời máy. |
| N05 — AND-04/05, IOS-04/06, TC-09 | Fixture local HTTPS: cert sai bị từ chối, mất response sau commit/đối chiếu đúng mã, revoke chặn đọc; sentinel không ở URL/log/plain preferences. Kiểm API lưu trữ OS theo môi trường. | Emulator/Simulator + backend lab; chưa chạy. Cần endpoint/cert/advisory/quyền trong gói execution sau bootstrap. Không chứng nhận Secure Enclave/StrongBox/backup trên máy thật. |
| N06 — AND-08, IOS-08, TC-19/20 | N1/N2 giữ nghĩa; semantics/label/focus và font lớn, Back/relaunch, app-switcher ở môi trường có khả năng đo. Ghi ảnh/assertion và hành vi mong đợi. | Automation/accessibility tree không tự thay TalkBack/VoiceOver thực tế. Ca nào image/runtime không hỗ trợ phải ghi thiếu và chọn phép kiểm tương đương có lý do, không bỏ rồi nhận PASS. |
| N07 — AND-07, IOS-07, TC-15/17 | Version/build/config đúng nguồn; bản tối ưu chạy ở môi trường lab, sai build/SDK/artifact bị phát hiện. Android release ký khóa lab riêng; iOS Release simulator ghi đúng simulator target. | Không yêu cầu danh tính App Store/Play hoặc cắm máy cho lát cắt này; device signing/phân phối thuộc lần kiểm project tương ứng. |
| N08 — phương pháp bằng chứng Kidea | Fixture phân biệt cùng PASS nhưng khác source/runtime/ABI; thiếu tool/skip/mutant lỗi compile sai oracle phải bị từ chối. Mọi mutant có oracle cụ thể; full positive chạy lại trên nguồn cuối. | Đây là yêu cầu phương pháp cần kiểm trước T07-S02; không suy từ bảng tài liệu thành đã có test. |

N01…N08 áp dụng riêng Android và iOS, không lấy Android đại diện iOS. Chỉ phần nào khớp nguồn/oracle mới được tái dùng evidence A1. Muốn trình khép T04/T05-S03 phải có đủ phần bắt buộc của lát cắt, giải thích mọi giới hạn và không có FAIL/NOT_RUN bị che. T07-S02 vẫn cần tích hợp/kiểm môi trường sạch, hồi quy và Human review đúng phạm vi; không tự DONE vì máy ảo boot được.

Hiệu năng/frame/pin/nhiệt thực, phần cứng bảo mật, camera/sensor và trải nghiệm trên model thật vẫn phải được project có yêu cầu đó kiểm. Trong R05 phải có hướng dẫn và oracle rõ cho chúng; không buộc thực hiện toàn bộ nghiệm thu ứng dụng để hoàn thành mẫu phương pháp. [Apple phân biệt mô phỏng và phần cứng](https://developer.apple.com/documentation/Xcode/running-your-app-on-simulated-or-physical-devices).

## Máy và dữ kiện đã kiểm

[Manifest và raw metadata](../tests/evidence/r05/simulator-plan-r1/manifest.json): macOS14.7 Intel MacBookPro16,1,16GiB RAM; `kern.hv_support=1`; JDK21.0.11 x86_64 sẵn có; xcode-select đang trỏ CommandLineTools, không phải full Xcode. Đường JDK chỉ là receipt máy này, không yêu cầu portable của Kidea. Chưa cài ADB/Emulator hoặc Xcode trong lượt này.

[Google](https://developer.android.com/studio/run/emulator-acceleration) yêu cầu emulator tăng tốc chạy trực tiếp trên host; macOS dùng Hypervisor.Framework. Vì vậy Android build vẫn trong Docker, Emulator chạy trên macOS; không chạy nested emulator trong Docker hoặc cài HAXM. Intel cần image x86_64. `kern.hv_support=1` chưa thay phép thử `emulator -accel-check` sau cài.

## Gói A-SIM-BOOT r1 đề nghị duyệt

Đây là gói cài tối thiểu và boot smoke, chưa duyệt trước runtime N01…N08. Dùng archive stable đúng metadata Google; không Android Studio, không JDK host mới, không Play Store/account.

| Artifact macOS Intel | Phiên bản | Archive byte |
|---|---|---:|
| Emulator | 37.1.11, build15917651 x64 | 465773989 |
| Platform Tools / ADB | 37.0.1 | 16110554 |
| Command-line Tools / avdmanager | 23.0, build16111833 x86_64 | 155582504 |
| AOSP system image x86_64 | API36 revision2 | 844217077 |
| Tổng | URL và SHA1 publisher trong manifest | 1481684124 (~1.38GiB) |

API36 là OS của AVD, **không hạ compileSDK37/target37 của mẫu A1**. Có thể chạy app min26/target37 trên API36 nếu dùng API phù hợp, nhưng phải đo thực tế; không nhận là đã kiểm API26 hoặc37. Metadata AOSP đã đọc không có image API37 x86_64 tương ứng; không đổi sang ARM/beta một cách âm thầm. AOSP image không được giả định có TalkBack; bootstrap ghi inventory, chuẩn bị riêng nếu bài runtime cần thành phần bổ sung.

Đích CREATE-only `/Users/kendrick/Desktop/kidea-native-lab/android-sim-r1/`, gồm `downloads`, `sdk`, `avd`, `user-home`, `evidence`; xác minh local/không đồng bộ trước tạo. Không ghi vào SDK hoặc `.android` đang dùng của Human. ADB key/console token ở thư mục lab, không commit. `ANDROID_USER_HOME`, `ANDROID_AVD_HOME`, `ANDROID_SDK_ROOT`, `JAVA_HOME` chỉ áp cho tiến trình; không đổi shell config/PATH/global Java.

Hạn mức đề nghị: **2GiB tải gồm retry/metadata; 12GiB đĩa tăng thêm; trần tích lũy47GiB từ baseline E2; sàn trống100GiB; tối đa90phút một lượt**. 12GiB là ngân sách, chưa phải kích thước giải nén đo thực. Không reset counter cũ hoặc dùng quyền90phút SDK37. Một AVD cấu hình2vCPU/2048MiB RAM; không chạy workload Docker/iOS cùng lúc trong bootstrap. Emulator là process host: vCPU/RAM guest không phải hard cap CPU/RSS host như cgroup. Theo dõi tổng RSS cây process lab, dừng khi vượt4GiB hoặc memory pressure nghiêm trọng; nếu cần giới hạn khác thì dừng báo. Không thay Docker Desktop.

Một approval bao gồm tải bốn archive, điều khoản [Android SDK](https://developer.android.com/studio/terms), giải nén ở đích lab, tạo AVD và chạy boot smoke. Trước giải nén kiểm size/SHA1 từ HTTPS publisher và tính SHA256 thực; không gọi SHA256 tự tính là chữ ký publisher. Kiểm entry/path, receipt, code signature/Gatekeeper và `-accel-check`; không bypass quarantine/Gatekeeper khi bị chặn. Không tự tải dependency/phụ kiện qua sdkmanager hoặc chấp nhận mọi license bằng pipe `yes`.

Trình tự sau duyệt: kiểm nguồn/đích/free-space/cổng/PID → tải/kiểm archive → chạy version/acceleration → avdmanager tạo đúng image local → boot AVD tên `kidea-r05-api36-x64-r1`, chọn serial tường minh → kiểm `sys.boot_completed`, API/ABI, screenshot mẫu màn home → shutdown đúng AVD/server thuộc lượt → thu log/hash/disk/download/elapsed. Chọn loopback console/ADB không trùng và kiểm listener; không mở LAN hoặc kết nối điện thoại. Dừng trước tác động nếu không cô lập được ADB hiện có. Không cài APK/cấp dữ liệu thật trong bootstrap.

Sau bootstrap, phần source/fixture còn thiếu, dependency gate48advisory cũ (đặc biệt UTP khi thêm instrumentation), ký APK lab và endpoint HTTPS được cụ thể hóa thành gói runtime N01…N08. Chưa dùng runtime graph mới hoặc tải dependency từ quyền bootstrap.

## iOS: phương án lab trên Sonoma, chưa INSTALL_READY

Đề xuất **Xcode16.2 + Swift6.0 ở Swift6 language mode + SDK18.2 + iOS18.2 Simulator**, dự kiến device type iPhone16 trên Intel. [Apple xác nhận Xcode16.2 chạy từ Sonoma14.5](https://developer.apple.com/documentation/xcode-release-notes/xcode-16_2-release-notes/). Đây là tổ hợp lab bổ sung đề nghị chấp thuận; không tự sửa baseline26.6 cũ hoặc đổi deployment16 của mẫu. Runtime18.2 PASS không chứng minh OS tối thiểu16. Project khác vẫn tự chọn target.

Đề xuất tránh nâng OS trong lượt lab này. Cần full Xcode và runtime **universal có Intel**, không dùng runtime chỉ arm64; [Apple mô tả variant](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components). Khi chạy dùng `DEVELOPER_DIR` theo process, destination UUID tường minh và device set lab riêng; không đổi xcode-select global. First-launch components/license có thể cần Human thao tác/quyền máy, phải ghi trong gói cài cuối.

Metadata Apple có iOS18.2 stable build22C150, index fileSize8724217632byte (~8.13GiB), nhưng entry là mobileAsset, chưa xác minh URL/hash/size của variant universal được chọn. Không coi số index là tổng dung lượng cài. HEAD archive Xcode16.2 trả302 tới `developer.apple.com/unauthorized/`; chưa lấy được size/hash chính thức của archive qua phiên không đăng nhập. Không tải beta/runtime khác thay thế.

Vì vậy iOS **chưa đủ dữ kiện để duyệt tải/cài**: cần Human đăng nhập Apple Developer bằng trình duyệt trên máy khi thuận tiện để lấy đúng Xcode16.2; không gửi password/cookie vào chat. Sau có metadata/artifact hợp lệ, chốt dung lượng giải nén/cache/runtime, nguồn/chữ ký, hạn mức tải/đĩa và first-launch rights trong một amendment. Không xin nâng macOS chỉ để chuẩn bị gói này. Chưa chạy mẫu iOS; không nhận khả năng đọc docs là build PASS. Xcode16.2 cũng không phải tổ hợp gửi App Store Connect hiện hành.

## Điểm duyệt tiếp theo

Có thể duyệt **A-SIM-BOOT r1** theo bốn artifact và hạn mức trên để cài/boot Android trên host. iOS chỉ cần chốt hướng lab16.2 trên Sonoma trước; quyền tải/cài iOS chờ manifest đầy đủ. Cần approval cài vì chỉ thị Human ban đầu cấm tự cài công cụ/thay môi trường, và approval mới nhất chỉ giao chỉnh ma trận/chuẩn bị gói. Không phải gate do skill tự đặt. Không xin lại quyền chỉnh ma trận, A1 hoặc SDK37.
