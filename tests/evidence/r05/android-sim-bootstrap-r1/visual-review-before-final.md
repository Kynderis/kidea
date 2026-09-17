# Review bổ sung — chưa nhận kết quả tự động là PASS đầy đủ

`boot-104` đã có ảnh launcher nhìn được ở raw screenshot137. Lượt kiểm lại `boot-142` có boot property/API/ABI/CPU/RAM đạt và collector tạo `collection-before-visual-review.json`, nhưng ảnh ở `178-guest-screenshot/stdout.log` là màn hình đen. Agent xem ảnh và **không chấp nhận kết quả này là PASS đầy đủ của boot smoke**. Receipt tự động được giữ nguyên tên mới; không sửa nó hoặc dùng ảnh lượt trước để thay ảnh nguồn cuối.

Nguyên nhân cần xử lý trong harness: `sys.boot_completed=1` không đảm bảo màn hình Awake và launcher đang resumed. Bổ sung KEYCODE_WAKEUP, dismiss keyguard của AVD lab không có tài khoản/khóa, HOME, assertion `mWakefulness=Awake` và launcher resumed trước chụp. Không cài app hoặc thay oracle screenshot. Chạy lại đầy đủ boot smoke trên helper cuối và xem ảnh mới trước kết luận.

Các lỗi khác giữ trong state/command logs: AppleDouble signing metadata mất ở bộ giải nén ZIP ban đầu; package.xml thêm vào thư mục emulator có seal làm chữ ký fail, được giữ riêng sau khi avdmanager đọc xong và reverify chữ ký vendor; ADB listener có hostname không được hỗ trợ; dựng hình software vượt RSS4GiB bị watchdog dừng; Emulator tự tăng guest RAM2560MiB dù yêu cầu2048, agent dừng và dùng tùy chọn `-lowram` được binary hỗ trợ để giữ mức đã duyệt; preflight một lần gặp cổng chưa dùng lại được ngay sau shutdown, chờ kiểm socket trống rồi thử lại. Không xóa FAIL, không tăng quota hoặc deadline.

`codesign --verify --strict -R=notarized --check-notarization` và lần cuối `--deep` kiểm chữ ký/notarization, không ký lại hoặc xóa quarantine. Diagnostic `spctl` ban đầu dùng trực tiếp với binary CLI báo “does not seem to be an app”; [Apple TN2206](https://developer.apple.com/library/archive/technotes/tn2206/) yêu cầu dùng spctl với top-level app bundle. Cách kiểm được sửa theo loại artifact, không coi lỗi diagnostic đó là PASS.

Log emulator có public ADB key; collector giữ raw bên ngoài Git trong thư mục lab và chỉ đưa bản che dòng public key vào repo kèm hash trước/sau. Private key và console auth token không thu vào evidence.
