# Swift / SwiftUI — profile r1

**Amendment Web r2, 2026-09-17 — theo quyết định Human:** client hiện hành chỉ Web; app Android/iOS là Future chưa roadmap/thời hạn. Giữ nghiệp vụ, ngưỡng backend/Web, 137 source ID và 20 nhóm TC; A/I/N1/N2 chỉ là biến thể Future, không PASS/N/A mới. Hồ sơ r1 và kết quả lab cũ giữ đúng nguồn; amendment không là nghiệm thu ứng dụng hoặc R05. Nguồn quyết định và snapshot/hash trước–sau: repo Kynderis/kidea, `KIDEA_DESIGN.md#client-web-scope-approved`, `tests/evidence/r05/web-scope-r1/manifest.json`.

**Toàn bộ nội dung dưới đây là profile lịch sử Future.** Không tiếp tục tải/cài/build/runtime, không xin thiết bị/Apple login; các nhãn APPROVED/PROPOSED/BLOCKED_ENV_PENDING/NOT_RUN phía dưới thuộc bản và thời điểm cũ, không phải việc cần làm hiện tại.

**PROPOSED — chờ duyệt nội dung**, chưa build/simulator/iPhone test. Chỉ màn N1/N2; không admin native. [Rule chung/ngoại lệ](rules.md#exceptions); nguồn [UX](../design/experience.md#screens), [API](../design/architecture.md#api), [merge/lifecycle](../design/architecture.md#updates).

<a id="toolchain"></a>
## Tổ hợp và khoảng trống trên máy Intel

Giữ baseline Xcode 26.6/Swift compiler 6.3, Swift 6 language mode, SDK iOS 26.5; deployment target iOS 16.0. [Bảng Apple](https://developer.apple.com/xcode/system-requirements) yêu cầu macOS Tahoe 26.2–26.x cho Xcode 26.6; máy hiện tại macOS 14.7 nên **BLOCKED_ENV_PENDING** cho tổ hợp này, không phải Kidea không chạy Intel. Chưa xin nâng OS hoặc đổi baseline. Xcode 16.2 có hỗ trợ Sonoma theo bảng, nhưng không tự thay cho 26.6: thay tổ hợp cần review riêng, xác minh SDK/device/security và phạm vi hỗ trợ.

Sau có quyền/toolchain: `xcodebuild -version`, `xcodebuild -list -project <project>`, rồi `xcodebuild test -project <project> -scheme <scheme> -destination 'id=<approved-device-or-simulator>' -resultBundlePath <unique-result>`. Các placeholder phải được chốt, không chọn mặc định máy đầu tiên; chưa có project/scheme, chưa chạy. Simulator và device kết quả tách riêng; iPhone hiện có cần xác minh OS/khả năng kết nối/signing, không suy từ tên model. Build/archive/sign chỉ khi được cấp quyền; không đưa private key/provisioning secret vào repo.

<a id="rules"></a>
## Rule

| ID | Phạm vi / lý do / nguồn | Đúng | Sai | Kiểm |
|---|---|---|---|---|
| IOS-01 | Isolation, Swift concurrency/architecture | UI state MainActor; dữ liệu qua actor/Sendable đúng ownership | unchecked Sendable để dập lỗi, mutate UI từ callback tùy ý | TC-18/TC-20: Swift6 strict diagnostics và race/lifecycle test |
| IOS-02 | Task lifecycle, architecture/updates | Task có owner và generation, cancel + guard sau await | Detached task sống sau logout rồi ghi cache mới | TC-20: logout/relaunch/navigation giữa các await |
| IOS-03 | Identity, architecture/updates | Cache key actor/epoch/workshop/audience, UInt64 kiểm decode chuỗi | Double version, gộp public/private hoặc replace history theo response cũ | TC-07: CANCELLED/rebook, 2 workshop và số >2^53 |
| IOS-04 | Secret/TLS, architecture/api | Keychain cho token, ATS/TLS xác minh, log được che | UserDefaults token, token querystring, trust-all delegate | TC-09: revoke, cert sai, log/backup/UI snapshot chứa sentinel |
| IOS-05 | SwiftUI side effects, UX/action | Chỉ gửi mutation từ ý định rõ; view task chỉ load có thể hủy | onAppear mỗi lần gửi lại đăng ký hoặc auto retry mã mới | TC-03/TC-19: appear/disappear nhiều lần không thêm mutation |
| IOS-06 | Error/unknown, R-RETRY | Phân biệt decoding/transport/domain và đọc lại đúng mã | Catch mọi lỗi thành thất bại cuối; cancel task nhận đã rollback | TC-03/TC-05: response mất sau commit và quyền thu hồi |
| IOS-07 | Release compatibility, rules/commands | CFBundleShortVersionString và CFBundleVersion có nguồn, scheme/target/SDK/artifact SHA | Version hiển thị giống nhau coi cùng build; chỉ simulator làm device PASS | TC-15/TC-17: sai build number/SDK/target phải lộ, cặp cũ–mới |
| IOS-08 | UX/accessibility, experience/usability | Text nguyên nghĩa, Dynamic Type/VoiceOver/Back đúng state | Force unwrap response, chữ cắt thao tác hoặc mất riêng tư app switcher | TC-19/TC-20: font lớn, VoiceOver, background/foreground và process restart |

Không ngoại lệ mặc định; theo rules/exceptions. Dùng SwiftUI không tự chứng minh accessibility hoặc an toàn vòng đời.

<a id="samples"></a>
## Mẫu đúng–sai

Mẫu thuận đề xuất: MainActor model có generation token và actor repository, kiểm cancel sau await. Mẫu sai: detached task capture model, callback của actor A áp vào state B; một mẫu khác vi phạm actor isolation phải bị compiler chặn. Khi có quyền, lưu diagnostics/xcresult cho cả mẫu thuận và mẫu nghịch; cố tình nghịch là đạt oracle khi công cụ bắt đúng lỗi, không ghi app đạt. Hiện tất cả **NOT_RUN**. [Swift concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) là nguồn kỹ thuật, còn oracle actor/epoch theo pilot.
