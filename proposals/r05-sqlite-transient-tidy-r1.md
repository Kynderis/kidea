# R05 — Ngoại lệ hẹp cho macro SQLite trong clang-tidy

Ngày 2026-09-16. **PROPOSED — chưa áp dụng, chờ Human duyệt.** ID `R05-TIDY-01`, revision 1, chỉ mẫu backend tổng hợp `backend-integration-r1`.

## Quyết định cần duyệt

Cho phép đúng một chú thích `NOLINTNEXTLINE(performance-no-int-to-ptr)` tại lần dùng `SQLITE_TRANSIENT` trong `Statement::bind`, `cpp/domain.cpp`. [Patch cụ thể](../tests/r05/fixtures/backend-build-r4/sqlite-transient-tidy.patch) chỉ thêm comment, không đổi mã thực thi. Giữ nguyên `WarningsAsErrors: '*'`, toàn bộ checker khác, compiler warnings, ASan/UBSan/TSan và mọi ca test. Không áp ngoại lệ cho SQLite WAL hoặc race; phần đó đã sửa bằng khóa writer chung trong mẫu, không suppression.

## Căn cứ và rủi ro

SHA256 nguồn trước patch: `e96568cb8b9612b4be60af237099189a8efa2e42dd6091f8bb75a3d958b06618`. SHA256 patch: `8a96b07173ad62be44439764b59623a9062a45592dbd818fbfba2c95226aa5ab`. `git apply --check` đạt; chưa apply và chưa chạy checker với ngoại lệ.

clang-tidy 18.1.3 báo `performance-no-int-to-ptr` tại macro `SQLITE_TRANSIENT`, mở rộng từ `vendor/sqlite/sqlite3.h` dòng 6430, SQLite 3.53.4 đã pin. Đây là hằng sentinel do API SQLite định nghĩa bằng cách cast `-1` sang kiểu destructor. Nó yêu cầu SQLite sao chép dữ liệu trước khi hàm bind trả về; không phải con trỏ do ứng dụng tính toán để dereference. [Hợp đồng chính thức của SQLite](https://www.sqlite.org/c3ref/bind_blob.html), [mục đích checker LLVM](https://clang.llvm.org/extra/clang-tidy/checks/performance/no-int-to-ptr.html).

Không thay bằng `SQLITE_STATIC` để làm lint xanh: cách đó đổi hợp đồng lifetime của dữ liệu. Cũng không thêm bộ cấp phát/copy thủ công chỉ để tránh một macro API chuẩn. Rủi ro ngoại lệ là người sau hiểu nhầm comment thành quyền bỏ qua cast khác; vì vậy phạm vi chỉ đúng invocation này, không tắt checker trên file hoặc project.

Kiểm thay thế/giữ nguyên: bound SQL và quote/injection; transaction bốn bảng; lifetime/cancellation/exception; busy timeout; bốn preset; sáu mutant độc lập; HTTPS/browser/drain trên nguồn cuối. Raw clang-tidy FAIL vẫn được giữ trong evidence r4. Hiện chưa có kết quả clang-tidy PASS cho patch đề xuất.

## Quyền, thời hạn và hết hiệu lực

Người duyệt: Human của Kidea, **chưa duyệt**. Chỉ hiệu lực cho profile `workshop-rules-r1`/mẫu lab với SQLite 3.53.4 và clang-tidy 18.1.3 hiện tại, tới khi khép gate R05 hoặc 2026-10-16, tùy mốc đến trước. Đổi dependency/checker, vị trí bind, lifetime, phạm vi sản phẩm hoặc patch khác thì phải review lại; không kế thừa sang production/native.

Lý do cần xác nhận riêng: hồ sơ `kidea-workshop-pilot/docs/engineering/rules.md#exceptions` quy định: “Chưa duyệt thì không được áp.” Đây là ngoại lệ của checker nên quyền sửa lỗi thông thường chưa thay thế approval đó. Đề xuất không miễn invariant nghiệp vụ hay kiểm an toàn.

Sau duyệt: kiểm hash/ngữ cảnh còn đúng, áp đúng comment, chạy formatter + clang-tidy rồi kiểm cuối phù hợp trên nguồn sau comment, cập nhật bằng chứng và trạng thái. Không cần cài thêm gì trên Mac.

Lượt r4 sau đó đã dừng vì [sự cố điều phối quota](../tests/evidence/r05/backend-execution-r4/resource-incident.md). Phần tiếp tục dùng guard quota mới, NSS riêng mỗi lần, giữ đúng 2 CPU/4 GiB và các trần đã duyệt; không đề nghị tăng CPU/RAM. Kiểm Docker của guard/bootstrap, browser cuối và edge drain cuối còn phải chạy, không được coi unit guard hoặc các lượt PASS trước là thay thế.
