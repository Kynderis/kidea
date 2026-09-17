# R05 — Chuẩn bị kiểm thiết bị Android và chọn môi trường iOS, r1

Ngày 2026-09-17. **PREPARED / IOS_INTEL_SELECTED — chưa INSTALL_READY hoặc duyệt thực thi thiết bị.** Human “ok làm tiếp đi” giao tiếp tục sau Android A1; A1/SDK37 đã được duyệt và hoàn tất, không xin duyệt lại. Gói này giữ R05 IN_PROGRESS.

**Được thay về điểm tiếp tục bởi [ma trận mô phỏng r1](r05-simulator-lab-r1.md)** theo chỉ đạo Human tiếp theo. A2/A3 bên dưới đã trộn yêu cầu ứng dụng và mẫu Kidea: không còn dùng điện thoại thật làm điều kiện vào toàn bộ R05, không mặc định nâng macOS. Nội dung dưới giữ lịch sử đề xuất; rule/ngưỡng ứng dụng chưa bị xóa hoặc ghi PASS. Review A1 vẫn giữ hiệu lực đúng source/phạm vi.

## Review A1 đã làm

[Receipt kiểm lại](../tests/evidence/r05/native-device-plan-r1/a1-review.json) đối chiếu nguồn HEAD2509e4f: 23 file snapshot và nguồn sibling khớp manifest; 21 hồ sơ pilot khớp amendment SDK37; đọc XML hai suite mỗi suite11ca, fail/error/skip0, hai lint XML không issue và kết quả sáu mutant đều bắt đúng oracle. Không chạy lại workload. Đây là review bằng chứng của agent hiện tại, không reviewer độc lập hoặc Human nghiệm thu. Không đọc lại APK trong volume; hash/signing/build/resource vẫn viện dẫn [lượt A1](../tests/evidence/r05/android-execution-r1.md), không giả thành phép đo mới.

## Hai phần Android còn phải kiểm

| Phần | Oracle phải đạt | Điều kiện trước chạy |
|---|---|---|
| A2: UI/lifecycle trên điện thoại được chọn | Rotation10lần, background/foreground, Back/relaunch không thêm mutation; callback cũ không ghi vào actor mới; observer/job trở về mức ban đầu; StrictMode không I/O main | Model/OS/API/ABI/serial chính xác; fixture điều khiển await và bộ đếm; package lab riêng, quyền cài rõ |
| A2: process recreation và UX | UNKNOWN giữ cùng intent theo chính sách; không lẫn dữ liệu actor; TalkBack đọc đúng nhãn/trạng thái; font lớn không che nút; app-switcher không lộ sentinel | Cần hoàn thiện mẫu vì A1 chỉ có fake repository và state trong bộ nhớ; lưu FAIL thật nếu chưa đáp ứng, không đổi oracle |
| A2: artifact release | APK shrink đã ký bằng khóa lab cài và chạy trên thiết bị; version/hash/certificate được ghi riêng debug/release | Release A1 hiện unsigned, chưa cài được; chốt khóa lab trong volume, không dùng danh tính production; mở lại dependency gate trước ký |
| A3: network/storage/security | TLS sai phải bị từ chối; token không log/URL/backup/snapshot; revoke chặn đọc; mất response sau commit giữ mã UNKNOWN, reconnect không gửi mã mới | Adapter thật/Keystore và backend fixture, endpoint/TLS/certificate/test account giả, quyền mở kết nối được chốt trước; không dùng dữ liệu thật |

A2 không thay A3; cả hai là phần còn lại của R05/profile Android, không tự dời sang R09. Một điện thoại không chứng minh toàn dải minSdk26…target37 hoặc mọi ABI. Emulator, nếu cần phủ phiên bản khác, phải có gói tài nguyên riêng; chưa có quyền cài/chạy.

## Cách kết nối đề xuất và giới hạn quyền

Build vẫn trong Docker. [Docker xác nhận](https://docs.docker.com/desktop/troubleshoot-and-support/faqs/general/) Desktop không hỗ trợ USB passthrough trực tiếp. Đề xuất ADB Platform Tools của Google trong một thư mục local thuộc user macOS, dùng USB tới đúng điện thoại; không suy `--device` là đủ trên Mac, không tự thêm USB/IP/VM hoặc privileged container. [Google hướng dẫn](https://developer.android.com/studio/run/device) macOS không cần USB driver bổ sung; điện thoại vẫn cần bật USB debugging và Human xác nhận kết nối trên máy.

Đây là thay đổi so với A1 chỉ dùng Docker nên **chưa cài ADB**. Khi biết model/OS, chốt archive macOS hỗ trợ Intel, phiên bản, URL chính thức, size/hash, license, dung lượng giải nén và trần tải/đĩa/thời gian trong amendment để duyệt một lần. Không gọi URL latest là bản cố định. Không cần Android Studio hoặc thay PATH toàn máy. Nếu ADB đã có, kiểm nguồn/version trước đề nghị tải.

Trước thực thi phải chọn serial chính xác; mọi lệnh tác động dùng `adb -s <selected-serial>`, không tự lấy thiết bị đầu tiên. Chỉ cài/gỡ/force-stop/clear dữ liệu package lab theo quyền được duyệt; không wipe điện thoại, đọc dữ liệu app khác hoặc xóa log toàn máy. Log giới hạn PID/package và sentinel giả. Không bật wireless debugging hoặc mở ADB server ra mạng. Dừng server do lượt này tạo và hướng dẫn Human thu hồi quyền debug sau kiểm; không giết server dùng chung không thuộc lượt này.

Không tự khởi động lại A1 hoặc dùng quyền tiếp tục90phút của SDK37 làm ngân sách A2/A3. Giữ counter/baseline cũ; ngân sách mới phải tính tài nguyên tích lũy và shared guard2CPU/4GiB cho workload Docker. Tất cả48advisory tooling của A1 phải đánh giá lại theo graph/route mới trước device/network/signing; UTP chưa chạy trong A1 không mặc nhiên an toàn khi bật instrumentation.

## iOS: chọn máy trước gói cài

Baseline đã duyệt giữ Xcode26.6/Swift6.3/SDK26.5, deployment16. [Bảng Apple kiểm ngày2026-09-17](https://developer.apple.com/xcode/system-requirements) yêu cầu macOS Tahoe26.2–26.x. Host14.7 trong receipt A1 chưa đáp ứng; Docker Linux không thay Xcode. Không tự chọn Xcode27 chỉ vì mới hơn.

Hai hướng cần Human chọn: chuẩn bị nâng macOS trên Mac Intel hiện tại, hoặc dùng Mac khác do Human cấp đã đáp ứng baseline. Chọn hướng chưa phải quyền nâng/cài. Với máy hiện tại, phải kiểm model được Apple hỗ trợ, backup/restore và tương thích ứng dụng trước đề xuất OS cụ thể. Với máy khác, phải kiểm môi trường thực và checkout local.

Trước INSTALL_READY còn cần: installer Xcode chính xác/build number/nguồn/hash/size, sàn đĩa và thời gian; destination simulator/iPhone và OS; quyền signing lab/account trên máy nếu cần. Không yêu cầu gửi Apple ID password, private key hoặc secret vào chat. Không bịa dung lượng Xcode khi chưa có metadata phù hợp; không cài hoặc thay OS trong gói chuẩn bị này. Simulator và iPhone ghi bằng chứng riêng. IOS-01…08 vẫn NOT_RUN.

## Điểm tiếp tục

Human xác nhận không có điện thoại Android; tiếp tục chuẩn bị iOS trên Mac Intel hiện tại, Apple Silicon để sau. Android device giữ BLOCKED_DEVICE_UNAVAILABLE; không tự cài emulator hoặc coi emulator thay nghiệm thu thiết bị thật. ADB/USB ở trên chỉ là phương án khi có thiết bị, không còn là việc cần cài ngay.

Kiểm lại host: macOS14.7 build23H124, MacBookPro16,1/x86_64, khoảng358GiB trống; không có /Applications/Xcode.app. [Apple liệt kê MacBook Pro16-inch2019 hỗ trợ Tahoe](https://support.apple.com/en-us/122867), nên máy có hướng nâng OS phù hợp, chưa xác nhận toàn bộ ứng dụng đang dùng tương thích. Bước tiếp theo là chuẩn bị gói nâng OS/Xcode trên chính máy này: xác định bản OS ổn định cụ thể/installer và checksum-size, backup có thể khôi phục, ứng dụng thiết yếu và thời điểm Human có thể thao tác; chọn iPhone/OS hoặc simulator sau đó. Chưa có quyền thực hiện nâng OS từ việc chọn máy. Các mục chưa xác minh giữ OPEN, không đưa gói thành INSTALL_READY. Hiện không cần Human duyệt lại R05 r1, A1 hoặc SDK37. Apple Silicon NOT_RUN; chưa nghiệm thu toàn Kidea.
