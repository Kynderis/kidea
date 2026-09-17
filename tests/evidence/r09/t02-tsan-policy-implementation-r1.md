# EX-T02-WAL-01 r1 — triển khai offline và chuẩn bị build r6

Human “Tôi duyệt” cho đề xuất tại Kidea `7cdb089`. Phạm vi: ngoại lệ hẹp có điều kiện và authoring/kiểm offline harness, không chạy container. [Receipt](t02-tsan-policy-implementation-r1/receipt.json), [diff nguồn](t02-tsan-policy-implementation-r1/source-change.patch), [snapshot](t02-tsan-policy-implementation-r1/source/).

## Đầu ra

- Bộ phân loại kiểm đúng source SQLite, image, GCC và package inventory/flags; chỉ nhận hai cặp memcpy write/read 8 byte ở hai header WAL đã quan sát. Report phải đủ hai stack, vị trí shared-memory, summary và số cảnh báo. Cảnh báo chưa biết, trộn race khác, log thiếu/fatal, exit lạ, signal/timeout/OOM đều bị chặn.
- Launcher CTest giữ exit của chương trình gốc và stream stdout/stderr riêng từng ca; JUnit vẫn ghi FAIL khi exit66. Gate riêng yêu cầu đủ 46 ca và đối chiếu JUnit/CTest exit với capture, không sửa raw kết quả.
- Giữ đủ 796 assertion theo multiset case/variant/status; HTTP giữ 18 assertion và thu riêng initializer/server exit, signal, timeout và stderr. Không lấy exit0 của harness thành sanitizer sạch.
- CMake TSan preset đã sửa cờ ghi đè halt_on_error=1; build dùng halt_on_error=0:exitcode=66:report_bugs=1. Control được link riêng, không nằm trong backend release. Lượt TSan sẽ chạy detector cố ý, WAL serial và WAL parallel trong cùng container, kiểm bộ phân loại từ chối log mixed.
- Runner cuối chỉ ghi EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED khi toàn bộ giai đoạn hoàn tất; không tự ghi PASS_T02_COMPONENT_ONLY. Muốn kết luận PASS_WITH_APPROVED_LIMITATION vẫn cần review bằng chứng/điều kiện ngoại lệ.

## Kiểm và lỗi đã giữ

[42 ca classifier/oracle PASS](t02-tsan-policy-implementation-r1/policy-tests.log), [34 ca gate PASS](t02-tsan-policy-implementation-r1/gate-tests.log), tổng **76 kiểm offline**. Các ca nghịch kiểm log r5 chưa hoàn tất, race cố ý, report trộn, sai stack/line/offset/size/địa chỉ/hash/compiler/image/flags, process lỗi, thiếu assertion/case/HTTP, XML và exit không khớp, thiếu control.

Kiểm chéo baseline thực dev/ASan đã bắt [FAIL ban đầu](t02-tsan-policy-implementation-r1/baseline-initial-fail.log): 12 observation thuộc I09/C01–C05 có variant đính kèm response JSON chứa ID ngẫu nhiên/kết quả thắng tranh chỗ. Đọc tests.cpp: ba prefix `initial-same-intent-`, `race-initial-U-`, `race-initial-V-` là nhãn cộng dữ liệu chẩn đoán, không phải expected cố định. Bộ đối chiếu chỉ chuẩn hóa suffix của đúng case/prefix này sau khi parse JSON/state; giữ dữ liệu thô, multiplicity và mọi assertion final/reconcile/last-seat. Không đổi C++ assertion hoặc expected nghiệp vụ. Hai bộ 796 observation cũ đều đối chiếu được; ca mất assertion final, sai suffix và statusFAIL vẫn bị chặn.

[22 kiểm tĩnh](t02-tsan-policy-implementation-r1/static-checks.json): cú pháp Node/shell, source137 consistency và backend src/include/schema/contracts/tests.cpp nguyên. [Diff check](t02-tsan-policy-implementation-r1/diff-check.txt) qua. CMake/C++ compile và toàn harness trong Docker **NOT_RUN**; không suy chúng từ unit tests.

## Nguồn và điểm tiếp tục

Pilot source `763ab55cb238ab3ccdab4a984525a883b39b44f7`, local HEAD sau public SAVE `03b20b5e28fb5276a14dfc69ffc20661c4d567f9`, sạch, không remote/push. Public [SAVE](t02-build-r6/save.json) CONTINUATION_SAVED, [READ cuối](t02-build-r6/resume-final.json) WAITING giữ W-001/gates; không tự ghi DONE. Nguồn build 68 file/824 vendor đã được preflight đối chiếu Git/hash.

[Build r6 cụ thể](../../../docs/R09_T02_BUILD_R6_REVIEW.md) chờ duyệt một lượt. R5 vẫn sáu FAIL TSan, TSanHTTP/release chưa chạy; r2 chỉ là chẩn đoán đã hoàn tất. Không mở T03/R10 hoặc nghiệm thu R09.

Rà cuối bổ sung ba ca chống nhận nhầm control bị cắt, thiếu access stack hoặc lẫn fatal; cả34 ca gate đạt. Manifest draft fd787ed6 và checkpoint của nó được giữ dưới tên superseded/draft để truy lịch sử chuẩn bị; **chỉ manifest5685e999 là gói r6 hiện hành**, bản draft không còn khớp nguồn và không được chạy.

Kiểm staged Kidea toàn bộ báo4 dòng whitespace trong artifact source-change.patch: đó là dấu cách đầu dòng context trống của định dạng git diff. Giữ nguyên patch; [kiểm tách file biên soạn](t02-tsan-policy-implementation-r1/kidea-diff-verification.json) PASS. Không sửa raw artifact để che kết quả kiểm.
