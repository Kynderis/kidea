# R05 — Chuẩn bị Android runtime và iOS installer, r1

Ngày 2026-09-17; nguồn bắt đầu `394d78474094e5bed5e0b6a10cdbc08879eca327`, working tree sạch. [Receipt](native-runtime-plan-r1/receipt.json). Phạm vi PREPARATION_ONLY theo Human giao chuẩn bị gói Android và hoàn thiện metadata iOS. Không build, sign, install APK, start Docker/ADB/emulator hoặc cài Xcode trong lượt này.

## Đầu ra

- [Android runtime r1](../../../proposals/r05-android-runtime-r1.md): tám nhóm kiểm với input/assertion/mutant/evidence, source gap thực, đường ADB trực tiếp, HTTPS Docker loopback, release lab, dependency gate, hạn mức dự kiến và điều kiện trình chạy. **PREPARED_SPEC / EXECUTION_DRAFT**, chưa source/runner đầy đủ, chưa execution approval hoặc runtime PASS.
- [iOS lab install r1](../../../proposals/r05-ios-lab-install-r1.md): giữ hướng đã duyệt; Apple HEAD302 unauthorized và browser yêu cầu Sign in to Apple Developer. Index iOS18.2 lấy lại, vẫn chưa metadata Intel/universal archive đủ. Không tải binary. Human cần đăng nhập Apple tại máy để tiếp tục phần này; không cần gửi credential.
- [Gate N08 host](../../r05/native-evidence-gate.py) và [12 test](../../r05/native-evidence-gate.test.py): kiểm source/config/dependency/artifact/runtime/ABI/variant/toolchain, case inventory, exit/skip, hash/path của raw evidence và mutant đúng assertion. PASS12/12 trong [raw log](native-runtime-plan-r1/gate-tests.stderr.log). Đây là fixture synthetic kiểm phương pháp thu bằng chứng; chưa collector device, chưa làm N08 Android/iOS hoàn tất. Producer có thể nói sai trong raw log nên validator không tự chứng minh runtime thật.

## Bảo toàn và giới hạn

[Receipt](native-runtime-plan-r1/receipt.json) đối chiếu23file A1 snapshot/live khớp; [preservation](native-runtime-plan-r1/preservation.json) kiểm21hồ sơ pilot và12file project theo source-verification cuối A1 đều khớp. Không lấy manifest trung gian trước sửa UI làm nguồn cuối. Gate A1 cũ48advisory/19tọa độ được dẫn như lịch sử cần review lại, không nhận scan mới hoặc graph sạch.

Chỉ metadata Apple và web docs chính thức được đọc. Browser chỉ mở trang đăng nhập, không nhập email/password/OTP hoặc lấy cookie. Hash plist là hash bytes nhận được, không chữ ký Apple. Không có quyền tải/cài iOS mới; không đặt quota installer khi chưa biết kích thước/variant.

R05/T04/T05/T07-S02 vẫn mở. Bước tiếp là triển khai source/harness theo bản thiết kế Android, cố định manifest/lệnh rồi trình execution cụ thể; iOS tiếp khi có phiên Apple tại máy. Không cần xin lại hướng simulator, Android bootstrap hoặc SDK37.
