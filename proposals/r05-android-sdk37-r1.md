# R05 — Đề nghị đổi baseline Android A1 sang SDK 37.0

Ngày 2026-09-16. **APPROVED — Human “Duyệt đổi SDK 37.0 và kiểm lại” qua câu hỏi async trong lượt A1.** Quyền đổi baseline và kiểm lại trong các trần dưới đã có; chưa nghiệm thu trước kết quả. Các câu “chưa duyệt/chưa áp” bên dưới giữ bối cảnh bản trình, được sự kiện này thay thế trong đúng phạm vi. Gói A1 gốc đã được Human duyệt; đây chỉ là thay đổi phát sinh từ kết quả lint thực, không xin duyệt lại toàn R05.

## Vấn đề đã xác minh

AGP9.2.1 lint với warnings-as-errors báo `OldTargetApi` tại target36 và `GradleDependency` tại compile36.1: SDK37 có sẵn. Hai thiếu sót riêng của mẫu (icon/data extraction rules) đã sửa đúng nguồn. Giữ nguyên log FAIL và không tạo suppression/lint baseline, không đổi mức lỗi hoặc kỳ vọng để đạt PASS. [Bằng chứng ban đầu](../tests/evidence/r05/android-execution-r1/lint-initial-debug.txt).

## Một thay đổi cần duyệt

- Thêm **Android SDK Platform37.0 revision2** vào chính volume `kidea-r05-a1-work`; giữ platform36.1 cũ để truy vết. Archive chính thức Google `platform-37.0_r02.zip`, **67.281.901 byte (~64,2 MiB)**, SHA1 do Google công bố `ed8ebf7f8822a4de5686d427f237d2fa30ff7410`. Kiểm size/SHA1 trước giải nén, tính SHA256 lưu receipt; không gọi SHA256 tự tính là chữ ký nhà phát hành. [Manifest và metadata đã đọc](../tests/evidence/r05/android-execution-r1/sdk37-proposal-manifest.json).
- Đổi compileSdk36.1→37.0, targetSdk36→37; minSdk26 giữ nguyên. Đây là thay đổi hành vi nền tảng mục tiêu, cần kiểm thiết bị riêng sau này; build/unit không chứng minh tương thích Android17 trên máy thật.
- Giữ AGP9.2.1, Gradle9.4.1, JDK17, Kotlin/Compose2.3.10, BOM và dependency đã đóng băng, build-tools36.0.0. [Google AGP9.2](https://developer.android.com/build/releases/agp-9-2-0-release-notes) công bố hỗ trợ tối đa API37.0 và build-tools mặc định/tối thiểu36.0.0. Không chọn37.1/37.2 chỉ vì metadata mới hơn.
- Cập nhật đúng mục baseline Android trong hồ sơ/profile/roadmap sau duyệt, giữ lịch sử36.1 và kết quả r1. Không đổi nguồn backend/Web hoặc core Kidea.
- Resolve/kiểm bổ sung nếu graph thực thay đổi; chạy lại **toàn bộ** lintDebug/lintRelease, testDebugUnitTest/testReleaseUnitTest, assembleDebug/assembleRelease, shrinking và sáu mutant trên nguồn mới; full positive cuối giữ mọi checker.

## Quyền và trần

Chỉ Docker volume/user1000, không SDK/JDK/Studio trên macOS, không thiết bị/emulator/ADB/NDK, không cổng host, không signing phát hành hoặc deploy. Điều khoản SDK và phạm vi cô lập A1 giữ nguyên. Mọi lệnh run/start/restart qua guard chung2CPU/4GiB; JVM2GiB/workers2; build/test network=none.

Nếu duyệt trong deadline A1 hiện hành, dùng **phần còn lại của cùng trần**4GiB tải/15GiB đĩa thêm/35GiB tích lũy/sàn100GiB/3giờ; không reset start hoặc counter. Nếu quay lại sau deadline, việc duyệt gói này cho phép **một lượt tiếp tục tối đa90phút**, vẫn dùng counter tải và baseline đĩa cũ (không cấp thêm4GiB/15GiB), receipt mới tham chiếu lượt r1. Không dùng nhiều lượt để tự vượt quota. Nếu thiếu dung lượng, artifact/hash sai, có blocker dependency mới hoặc cần đổi công cụ khác thì dừng và trình cụ thể.

## Nội dung xác nhận ngắn

**Duyệt thay SDK Android sang37.0/target37 trong Docker và kiểm lại gói A1, giữ các giới hạn trên.**

Cần xác nhận vì [A1 đã duyệt](r05-native-build-r1.md) quy định dừng khi cần đổi dependency/baseline ngoài manifest. Đây là thay đổi SDK thực, không yêu cầu từ skill hoặc một bước cài lên macOS.
