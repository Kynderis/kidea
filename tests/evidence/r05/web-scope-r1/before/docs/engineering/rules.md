# R05 — Quy tắc chung r1

**PROPOSED — chờ duyệt nội dung.** Quyền soạn/kiểm được duyệt ngày 2026-09-16 sau answer cfffe0c; không đồng nghĩa build hoặc hỗ trợ đã kiểm. Hồ sơ R03/R04 và amendment LP-01 là đầu vào đã duyệt, kể cả các nhãn lịch sử còn trong byte nguồn.

<a id="contract"></a>
## Hiệu lực và phạm vi

Profile `workshop-rules-r1`, revision 1; phạm vi pilot lab dữ liệu giả, không production. Nguồn chính: [kiến trúc](../design/architecture.md#components), [chất lượng](../design/quality.md#coverage), [nghiệp vụ](../business/tests.md#coverage). Bốn profile: [C++](cpp.md#rules), [web](web.md#rules), [Android](android.md#rules), [iOS](ios.md#rules); [đặc tả kiểm](tests.md#protocol).

Khi được duyệt, lưu revision + SHA của sáu file và nguồn rule trong manifest từng lượt. Đổi bất kỳ nghĩa/phiên bản/config/nguồn/binary nào phải xem lại bằng chứng; quy tắc repo có sẵn được đối chiếu trước, không bị một template mới đè lên. Hồ sơ này không chứa config thực thi được sao chép từ nơi khác. Command chỉ là đề xuất cho script project tương lai; chưa có script thì NOT_RUN.

<a id="rules"></a>
## Rule bắt buộc

| ID | Phạm vi / lý do / nguồn | Đúng | Sai | Kiểm |
|---|---|---|---|---|
| COMMON-01 | Mọi component; giữ một authority theo architecture/components | Client gửi ý định, C++ quyết định trên DB | Web tự trừ chỗ và nhận thành công cuối | TC-01/TC-02: so kết quả API với transaction, review luồng không diff cũng có dependency |
| COMMON-02 | Nguồn và revision; tránh tái dùng kết quả khác bản | Manifest gắn SHA nguồn/profile/config/lock/toolchain/artifact | Chỉ ghi branch master hoặc “latest” | TC-16: thay một SHA khiến kết quả cũ không còn đủ căn cứ |
| COMMON-03 | Quyền/rule; không tạo ngoại lệ ngầm | Ghi xung đột, trình đúng rule/phạm vi/test thay thế | Tắt kiểm quyền để demo xanh | TC-16: thiếu approval ngoại lệ bị chặn, không tự chọn rule dễ hơn |
| COMMON-04 | API; lỗi kỹ thuật không là quyết định nghiệp vụ | Timeout sau gửi giữ UNKNOWN và mã | 503 thành FULL hoặc sinh mã mới tự động | TC-03/TC-08: cắt phản hồi sau commit, kiểm không thực thi lần hai |
| COMMON-05 | Contract chung; phân biệt epoch/version/release | Version uint64 ở JSON là chuỗi, so trong đúng actor/epoch/workshop/audience | Number làm tròn hoặc so version giữa workshop | TC-07/TC-15: 9007199254740993, đổi actor/epoch và phản hồi cũ |
| COMMON-06 | Evidence; không che FAIL/skip | Giữ từng lần stdout/stderr/exit, status NOT_RUN khi thiếu target | Chỉ giữ lượt đẹp hoặc lấy mock thay máy thật | TC-16/TC-17: một ca skip hoặc sai target chặn kết luận đạt |
| COMMON-07 | Secret/quyền; architecture/api | Evidence dùng token giả được đánh dấu, secret thật ngoài source/log | Dump cookie/payload hay gửi credential lên Git | TC-09/TC-12: kiểm bề mặt public/SSR/socket/log/backup |
| COMMON-08 | Release/restore; architecture/delivery | Gắn từng lần deploy với revision/gói và đọc lại thực tế | Exit 0 thành đã chạy; rollback app tự restore DB | TC-14/TC-15: một component fail, mất kết nối, cặp cũ–mới |

Nguồn các rule là hợp đồng pilot được liên kết phía trên; cách kiểm cụ thể nằm trong [TC-01–TC-20](tests.md#cases). Các ví dụ là pseudocode/hành vi để review, **chưa compile/chạy**.

<a id="exceptions"></a>
## Ngoại lệ và gate

Mặc định mọi rule đều bắt buộc, chưa có ngoại lệ được duyệt. Đề nghị phải ghi ID/revision, đích, lý do, rủi ro, kiểm thay thế, Human, hạn dùng và điều kiện hết hiệu lực. Chưa duyệt thì không được áp. Không miễn invariant/quyền/authority/approval/ngưỡng Q bằng ngoại lệ kỹ thuật; muốn đổi phải quay nguồn sở hữu. Warning bên thứ ba chỉ được khoanh vùng theo file/version, không tắt warning code của project.

Mỗi task kiểm phần thay đổi và tác động; khi khép Feature chạy lượt G2 toàn project cuối, gồm phần không đổi, đúng bản sau sửa/merge/config/build. Build sạch, tích hợp, DEV readback và máy thật là các bằng chứng khác nhau. Không có app thì không tự tạo số PASS sản phẩm.

<a id="commands"></a>
## Quy ước thực thi đề xuất

Mỗi component có một command entrypoint trong repo sản phẩm khi tới triển khai, ghi cwd/args/env không secret, preconditions, timeout, exit semantics và nơi evidence. Profile chỉ trỏ đến command đó. Trên Windows dùng wrapper phù hợp host (ví dụ gradlew.bat); không lưu tuyệt đối đường máy trong rule dùng lại. Chưa tạo shell script, Dockerfile, package.json hoặc Xcode project ở pilot này.

Một run manifest gồm source/profile/config/dependency SHA, compiler/OS/CPU/target, dataset seed, command, bắt đầu/kết thúc, raw kết quả từng case, fail/skip/not-run, artifact SHA và người/quyền chạy. Giới hạn lab/chi phí/người vận hành theo Q/OP. Nguồn R04 không bị “cập nhật” bằng bản test thuận tiện hơn.
