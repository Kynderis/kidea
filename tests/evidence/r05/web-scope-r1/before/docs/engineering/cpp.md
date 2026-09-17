# C++20 / Ubuntu — profile r1

**PROPOSED — chờ duyệt nội dung**, chưa compile/build. Áp dụng backend C++/Drogon và SQLite, không thêm service. [Rule chung/ngoại lệ](rules.md#exceptions); nguồn [storage](../design/architecture.md#storage), [API](../design/architecture.md#api), [admission](../design/architecture.md#admission), [recovery](../design/architecture.md#recovery).

<a id="toolchain"></a>
## Tổ hợp và lệnh dự kiến

Ubuntu 24.04 LTS userspace/Docker local; C++20, GCC 13.3, CMake 3.28.3, Ninja theo baseline thiết kế. Đề xuất Drogon 1.9.13, SQLite 3.53.3, Caddy 2.11.4; chưa khóa distro package revision, Trantor/OpenSSL/JsonCpp hoặc image digest nên **chưa đủ điều kiện cài/build**. Native `amd64` trên Intel; ARM build/kiểm riêng, không `-march=native` mặc định cho gói chuyển máy. Tra nguồn/giấy phép/cảnh báo tại báo cáo R05 trong repo Kidea; không nhận thư viện không có advisory là an toàn tuyệt đối.

Sau quyền build: đề nghị presets `dev`, `asan-ubsan`, `tsan`, `release`; `cmake --preset <preset>`, `cmake --build --preset <preset>`, `ctest --preset <preset> --output-on-failure`. Chưa có presets, không chạy các ví dụ này. ASan+UBSan và TSan chạy binary riêng; warning `-Wall -Wextra -Wpedantic -Wconversion -Wsign-conversion`, warnings của project là lỗi; ngoại lệ dependency theo rule chung. Formatter/static analyzer chốt binary/version trong gói build, không tải bằng lệnh mẫu.

<a id="rules"></a>
## Rule

| ID | Phạm vi / lý do / nguồn | Đúng | Sai | Kiểm |
|---|---|---|---|---|
| CPP-01 | Lifetime theo C++ Core Guidelines R.1; tài nguyên DB/callback | RAII giữ connection/statement, callback giữ ownership rõ | Capturing reference tới request đã hết đời; new/delete rời | TC-18: callback trễ/hủy/exception, ASan/UBSan và review ownership |
| CPP-02 | DB authority, architecture/storage | BEGIN IMMEDIATE → kiểm rule → domain/result/audit/outbox → COMMIT kiểm mã trả | ACK rồi ghi outbox ở transaction khác | TC-02/TC-04: barrier hai writer, fault từng điểm và crash trước/sau commit |
| CPP-03 | Đồng thời/event loop; architecture/storage | SQL blocking qua writer hữu hạn, không giữ lock qua await/callback ngoài | SQL trên event loop; retry busy vô hạn | TC-08/TC-18: queue đầy, deadlock watchdog, TSan riêng |
| CPP-04 | Lỗi và SQL; architecture/api | Bind parameter, kiểm mọi sqlite return, classify unknown khi chưa chắc | Ghép SQL từ title; SQLITE_IOERR thành domain reject | TC-04/TC-09: quote/injection và lỗi prepare/step/commit/rollback |
| CPP-05 | Số/Unicode; W-DATA và API | Đếm Unicode code point, validate UTF-8, uint64 serialize chuỗi | strlen đếm title hoặc cast version sang double | TC-06: emoji, combining marks, malformed bytes, biên số/lịch |
| CPP-06 | Văn bản thuần; W-DATA | Dùng grammar và vector bên dưới, giữ literal đã hợp lệ | Cấm mọi dấu * hoặc chỉ escape rồi nhận markup | TC-06: mẫu markup bị từ chối và dấu câu thuần được giữ |
| CPP-07 | Lifecycle/backup; architecture/delivery/recovery | Đóng admission, drain 30s, result/outbox bền; backup API và xác minh đích độc lập | Kill mặc định sớm, copy riêng .db đang WAL, replay RAM queue | TC-10/TC-11/TC-12: restart, backup gián đoạn, đổi epoch sau restore |
| CPP-08 | Admission/telemetry; architecture/admission | Giữ rate/count/body/frame/queue đúng nguồn và M7 bao gồm 429/503 | Nới limit hoặc loại timeout để p95 đẹp | TC-08/TC-13: biên dưới/bằng/trên từng limit; không biến lỗi kỹ thuật thành FINAL |

Ngoại lệ mặc định: không có; quy trình tại rules/exceptions. Không dùng sanitizer sạch thay chứng minh thứ tự commit/đúng nghĩa retry.

<a id="plain-text"></a>
## CPP-06 — Grammar đề xuất cần duyệt

Đề xuất dùng phân tích cú pháp theo [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/) để nhận dạng cấu trúc định dạng, không render hoặc viết regex chặn toàn dấu câu. Cho document/paragraph/text/softbreak và nhiều đoạn mô tả; từ chối emphasis/strong/link/image/code/list/heading/blockquote/thematic break/HTML và hardbreak định dạng. Reference-definition cũng là markup dù không còn node sau parse: cần kiểm source spans hoặc parser giữ loại đó. Title vẫn một dòng. Input hợp lệ lưu literal sau trim; không dùng text đã parse/entity decode thay dữ liệu gốc. JSON UTF-8 lỗi/duplicate key bị từ chối trước grammar; không sửa âm thầm NFC/NFD.

Vector thuận: `Lớp học thủ công`, `C++ & C#`, `2 * 3 < 10`, `a_b_c`, `https://example.test`, emoji một code point, mô tả hai dòng văn bản. Vector nghịch: `<b>abc</b>`, `**abc**`, `_abc_`, `[abc](https://example.test)`, `# Tiêu đề`, `- mục`, fenced code, HTML comment, autolink và link reference definition. Biên 1/120/121 title, 1/5000/5001 mô tả, whitespace-only, CRLF/newline title theo W-DATA; không nhận ví dụ thuận nếu sai điều kiện độ dài khác.

Đây là cụ thể hóa đề xuất, chưa biến thành rule nghiệp vụ đã duyệt. Khác biệt giữa grammar và ý nghĩa “văn bản thuần” phải trình cùng vector; thư viện parser/version/license chưa chọn/cài. Không tuyên bố một vài vector bao phủ toàn grammar.

<a id="samples"></a>
## Mẫu đúng–sai khi có quyền build

Mẫu thuận: resource RAII + transaction đóng đủ bốn phần, submit trả UNKNOWN khi chưa xác minh. Mẫu nghịch độc lập: dangling capture và ACK trước COMMIT. Kỳ vọng mẫu nghịch bị sanitizer hoặc oracle crash bắt, mẫu thuận qua cả hai; mỗi mẫu gắn nguồn/profile/target và log riêng, tất cả **NOT_RUN**. Căn cứ kỹ thuật: [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines), [SQLite transaction](https://www.sqlite.org/lang_transaction.html). Phép kiểm kiến trúc là yêu cầu pilot, không suy ra từ việc compiler chấp nhận.
