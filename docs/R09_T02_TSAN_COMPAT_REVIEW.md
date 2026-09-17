# R09-T02 — review tương thích SQLite–TSan và diagnostic r2

**Cập nhật: APPROVED và đã chạy một lượt theo “Duyệt diagnostic r2”.** [Kết quả thực](../tests/evidence/r09/t02-sqlite-diagnostic-r2.md); quyền lượt này đã tiêu thụ. Nội dung đề xuất bên dưới giữ lịch sử.

**Review đã hoàn tất; gói chạy r2 PROPOSED, chưa duyệt/chưa chạy.** Human “duyệt nhé” sau `3fe4764` duyệt bước review được nêu trong answer, chưa là quyền tắt cảnh báo hoặc chạy lại build. Đề xuất dưới đây giữ nguyên phạm vi instrumentation và tiêu chí nghiệm thu hiện hành.

## Kết luận và lựa chọn

[Diagnostic r1](../tests/evidence/r09/t02-sqlite-diagnostic-r1.md) tái hiện cùng cảnh báo bằng SQLite độc lập; control cố ý bị bắt; hai đối chiếu đạt. Nhưng WAL song song đã bị dừng trước tổng100/quick_check. Vì vậy còn thiếu kết quả dữ liệu sau cảnh báo và khả năng có báo cáo khác ở phần chạy tiếp.

| Phương án | Đánh giá |
|---|---|
| Đổi sang Clang / mở rộng SQLITE_NO_TSAN cho GCC | Không chọn ở bước này. Vendor có annotation dành cho Clang ở2hàm; annotation thay đổi vùng memory access được kiểm. Image có clang18 nhưng chưa xác minh runtime Clang TSan đầy đủ; không lấy đổi compiler làm cách chứng minh không còn race. |
| Suppress cả SQLite/hai hàm, bỏ6ca, chuyển DELETE hoặc ép tuần tự | Không chọn: mất quan sát hoặc thay workload/hành vi cần kiểm. Không đáp ứng yêu cầu giữ an toàn. |
| Patch thuật toán WAL/atomics của vendor | Không chọn: chưa có bằng chứng cần thay thuật toán; vượt phạm vi sửa ứng dụng, đòi hỏi review dependency độc lập. |
| Giữ GCC/instrumentation, cho diagnostic chạy tiếp sau báo cáo | **Đề xuất** để lấp khoảng trống bằng chứng; giữ toàn bộ warning và exit66. Chưa là cách khép TSan gate hoặc miễn trừ. |

[Clang18](https://releases.llvm.org/18.1.8/tools/clang/docs/ThreadSanitizer.html) và [GCC13](https://gcc.gnu.org/onlinedocs/gcc-13.3.0/gcc/Common-Function-Attributes.html) mô tả việc annotation loại bỏ một phần instrumentation. [TSan flags](https://github.com/google/sanitizers/wiki/ThreadSanitizerFlags) phân biệt dừng ở báo cáo đầu với việc ghi báo cáo và mã thoát lỗi. Review này không tuyên bố kết quả runtime từ tài liệu.

## Gói diagnostic r2 cụ thể

Chỉ thay diagnostic: `TSAN_OPTIONS=halt_on_error=0:exitcode=66:report_bugs=1`; ghi flags vào toolchain log. Giữ GCC13/SQLite3.53.4, `-fsanitize=thread`, mọi source vendor, concurrency,50transaction/thread, oracle tổng100/quick_check. Bốn mode như r1, mỗi mode một lần; positive control đổi nhãn thành `CONTROL_BODY_COMPLETED` và trả0 từ thân main để không giả định chương trình tới cuối nghĩa là detector không báo. Phải xem stderr và mã kết thúc sanitizer; một dòng stdout không là PASS. Không thay backend/full-suite/runner build r5.

Đọc kết quả bắt buộc:

- Control: phải có warning tại biến cố ý và exit66. Không bắt được/timeout/runtime fatal → INCONCLUSIVE, không cấp ngoại lệ.
- WAL song song: ghi **riêng** data oracle và báo cáo TSan. Đủ100/quick_check vẫn không phải TSan sạch nếu còn warning. Mọi stack khác cặp header đã biết phải được review, không gộp thành cùng một ngoại lệ.
- DELETE song song/WAL tuần tự: giữ oracle cũ, code0 và không warning là kết quả đối chiếu; không dùng để thay WAL song song.
- Crash/timeout/thiếu log/không nhận flags hoặc compile lỗi phải ghi rõ; không retry. Wrapper exit0 chỉ là đã thu quan sát, không component PASS. Giữ FAIL r5 nguyên trạng.

Pilot source `ae8a327f888004fcd4f7620333e69728c9a776e0`, HEAD `d3cb60255a0353033395156250608d12f87ee553`, master local sạch/không remote. [Manifest r2](../tests/evidence/r09/t02-sqlite-diagnostic-r2/manifest.json) SHA256 `33100182a56884d404b49526d8e0d45b134e867a674293db69b822e560b85b51`,54sourcefile/824vendor. [Diff nhỏ](../tests/evidence/r09/t02-sqlite-diagnostic-r2/source-change.patch), [script](../tests/evidence/r09/t02-sqlite-diagnostic-r2/source/scripts/t02/sqlite-diagnostic.sh), [runner](../tests/evidence/r09/t02-sqlite-diagnostic-r2/source/scripts/t02/sqlite-diagnostic.mjs), [probe](../tests/evidence/r09/t02-sqlite-diagnostic-r2/source/tests/t02/sqlite-diagnostic.cpp), [kiểm tĩnh](../tests/evidence/r09/t02-sqlite-diagnostic-r2/static-review.json).

Từ root `/Users/kendrick/Desktop/kidea-workshop-pilot`, dùng Node24 sẵn có:

```sh
node scripts/t02/sqlite-diagnostic.mjs /Users/kendrick/Desktop/kidea/tests/evidence/r09/t02-sqlite-diagnostic-r2/manifest.json --approved-manifest-sha256 33100182a56884d404b49526d8e0d45b134e867a674293db69b822e560b85b51
```

**Một lượt/một container≤15phút,2CPU/4GiB/256PID, đĩa mới≤1GiB, data/log≤128MiB, host free≥100GiB; mỗi mode≤90s+5s kill grace.** Output các lượt cũ3359296KiB (~3.20GiB) giữ nguyên; tổng sau r2≤1GiB+3359296KiB. Image Linux amd64 cũ `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`,0download/network/hostport, user1000/rootFS/source/vendorRO/capdrop/no-new-privileges. CREATE-only output, monitor2s không hard quota, cleanup chỉ IDs/labels của lượt, giữ DB/log/cache/source. Không cài/chỉnh macOS/cloud/Web/PROD/native/AItrial/full build.

**Đề nghị Human duyệt diagnostic r2 theo manifest trên.** Quyền r1 đã dùng; việc tiếp tục sau warning là thay đổi cách chạy chẩn đoán phải được duyệt rõ. Không đề nghị giảm kiểm an toàn, thay expected, miễn trừ hoặc khép R09. Sau r2 cần đánh giá bằng chứng rồi mới đề xuất cách xử lý gate còn lại; không hứa full build sẽ PASS.
