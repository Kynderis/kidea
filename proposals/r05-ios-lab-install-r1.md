# R05 — Hồ sơ cài iOS lab trên Mac Intel, r1

Ngày 2026-09-17. **Hướng APPROVED; BLOCKED_APPLE_AUTH_AND_ARTIFACT_METADATA**. Human đã chọn Xcode16.2/Swift6.0/SDK18.2/Simulator18.2 trên Mac Intel hiện tại; không hỏi lại hướng và không mặc định nâng macOS. Lượt này chỉ hoàn thiện thông tin. [Receipt mới](../tests/evidence/r05/native-runtime-plan-r1/receipt.json), [ma trận kiểm](r05-simulator-lab-r1.md).

## Dữ kiện đã xác minh và phần chưa biết

| Mục | Kết quả hiện hành | Cần trước tải/cài |
|---|---|---|
| Host | macOS14.7, x86_64; xcode-select là CommandLineTools trong receipt | Chọn đường local và kiểm dung lượng lại trước chạy |
| Xcode | Bản16.2; [release notes Apple](https://developer.apple.com/documentation/xcode-release-notes/xcode-16_2-release-notes) cho Sonoma14.5+ | Xác nhận build, tên archive, byte, URL nguồn Apple qua tài khoản |
| Archive | `https://download.developer.apple.com/Developer_Tools/Xcode_16.2/Xcode_16.2.xip`; HEAD mới trả302 tới trang unauthorized | Chưa có verified byte/digest; không coi Content-Length trang login là kích thước archive |
| Browser | Mở Apple Downloads trong in-app browser trả trang **Sign in to Apple Developer**, ô Email or Phone Number; chưa nhập thông tin | Human đăng nhập Apple tại máy; không gửi password/OTP/cookie vào chat |
| Runtime | Apple index có iOS18.2 build22C150, `downloadMethod=mobileAsset`, fileSize8724217632 byte (~8.13GiB) | Chưa có URL/hash/size của variant Intel/universal được chọn; số index không thay install footprint |
| First launch | Chưa thực thi, chưa nhận license/cài components | Ghi rõ bước yêu cầu quyền admin/điều khoản từ installer thực; Human xử lý nếu cần |

Nguồn runtime được tải lại dưới trần8MiB metadata; giữ raw plist và SHA256 trong receipt. Không tải archive Xcode/runtime. Không điền ước lượng thành số đã xác minh hoặc dùng metadata mirror thay Apple. Nếu Apple không công bố checksum thì ghi **publisher checksum unavailable**; nguồn HTTPS chính thức + xác minh chữ ký XIP/app và SHA256 tính sau tải là các bằng chứng khác nhau, không bịa “publisher SHA256”.

## Bạn cần làm trên máy

Mở [Apple Developer Downloads — Xcode16.2](https://developer.apple.com/download/all/?q=Xcode%2016.2), đăng nhập tài khoản Apple của bạn và để trang thông tin bản16.2 mở. Chỉ cần báo đã đăng nhập hoặc đường dẫn file nếu bạn đã có bộ cài local; chưa cần bấm tải/cài. Nếu có điều khoản tài khoản thì bạn tự đọc/chấp thuận trên trang. Không cần gửi thông tin đăng nhập vào chat.

Sau đó agent đọc đúng mục tải hiển thị và ghi manifest có ngày/nguồn/build/tên/byte/variant; không trích cookie hay auth token. Nếu trình duyệt đang dùng không truy cập được qua tool, có thể Human cung cấp tên file/kích thước hiển thị hoặc đích local sau một gói tải được duyệt. Không yêu cầu screenshot/secret.

## Phương án cài để hoàn thiện khi có metadata

Xcode ứng dụng dự kiến nằm trong thư mục lab local riêng, dùng `DEVELOPER_DIR` theo process; không đổi xcode-select/PATH toàn máy. Runtime Simulator có thể được Apple quản lý trong vùng hệ thống và cần quyền khi import/first launch; **không hứa toàn bộ cài đặt chỉ nằm trong thư mục user**. Ghi đường ghi thực và quyền từng bước trong amendment trước cài. Device set lab riêng, destination UUID rõ, kiểm runtime x86_64 thực; không lấy runtime arm64-only.

Manifest phải gồm: archive và runtime URL/byte/build/variant; cách kiểm chữ ký; đích tải/giải nén/import/cache/DerivedData; dung lượng đỉnh gồm bản nén và giải nén cùng tồn tại; sàn đĩa; trần tải/thời gian/CPU/RAM; license/first-launch/admin; cách dừng và giữ evidence. Các trường dung lượng/hạn mức hiện **OPEN**, không đủ INSTALL_READY. Không tự dọn cache để làm vừa ngân sách.

Sau approval cài cụ thể: tải/verify → giải nén/first launch theo quyền → kiểm `xcodebuild -version`, SDK/Swift, `simctl list` → tạo một simulator trong device set lab → boot/ảnh/shutdown → báo bootstrap. Build mẫu iOS N01…N08 là phần tiếp theo có source/command manifest, không tự là PASS khi Xcode cài xong. Simulator lab không cần danh tính ký App Store; nếu công cụ yêu cầu signing khác dự kiến thì dừng xác định đúng nguyên nhân, không thêm tài khoản production.

Tổ hợp16.2 là lab bổ sung đã chọn, không sửa baseline cũ trong pilot hoặc đặt deployment floor chung cho Kidea. Chuẩn bị amendment profile lab khi triển khai mẫu để mô tả chính xác tổ hợp đã kiểm. Apple Silicon NOT_RUN; R05 vẫn IN_PROGRESS.
