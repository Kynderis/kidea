# EX-T02-WAL-01 r2 — triển khai offline

Human “duyệt” sau commit Kidea13073e3 đã chấp thuận đúng gói r2: authoring/classifier, kiểm offline và chuẩn bị manifest, chưa cấp lượt Docker mới.

Đã bổ sung đúng cặp walIndexWriteHdr:68471 (memcpy115/107) ↔ walTryBeginRead:70780 (memcmp844/840), read/write8byte cùng địa chỉ, mapping shm offset0; giữ hai cặp r1 và mọi kiểm provenance/report/oracle. Không sửa backend/vendor/contract/build runner/assertion gốc. Cảnh báo không khớp, hỗn hợp, thiếu dữ liệu vẫn BLOCKED; raw exit66/JUnit FAIL giữ nguyên.

- [Policy tests](t02-tsan-policy-r2/policy-tests.log):65 PASS, gồm log thật sáu ca r6 và mutation function/line/interceptor/offset/size/hash/policy/mixed/truncated/missing/data.
- [Gate tests](t02-tsan-policy-r2/gate-tests.log):34 PASS. Tổng99.
- [Kiểm tĩnh](t02-tsan-policy-r2/static-checks.json):5 PASS.
- [Review offline r6](t02-tsan-policy-r2/offline-r6-review.json):46ca/796assertion khớp;40 CLEAN/6 KNOWN_WAL_REPORT_REVIEW_REQUIRED. Context policy r1 được thay bằng r2 chỉ trong phép review offline. Không phải runtime mới hoặc sửa kết quả r6 FAIL.
- Giữ [FAIL trước triển khai](t02-tsan-policy-r2/before-implementation-fail.log), [lỗi cú pháp lúc sửa](t02-tsan-policy-r2/implementation-syntax-fail.log), [mutation trúng caller phụ](t02-tsan-policy-r2/mutation-target-fail.log). Đã sửa cú pháp và mutation đúng access frame #2; không nới classifier để làm test qua.

[Receipt](t02-tsan-policy-r2/implementation-receipt.json), [diff nguồn](t02-tsan-policy-r2/source-change.patch), snapshot các file thay đổi trong source/. Nguồn55640a5, pilot HEADe5265da sạch, không remote. Mac Intel/Darwin x86_64/Node24.19.0. Không chạy container mới.

[Build r7](../../../docs/R09_T02_BUILD_R7_REVIEW.md) chuẩn bị manifest8e1dd7e7,75source/824vendor; preflight PASS. Public SAVE trả CONTINUATION_SAVED và READ cuối đã lưu trong t02-build-r7/, giữ WAITING W-001/gates. TSanHTTP/release nguồn mới NOT_RUN. T02/R09 chưa nghiệm thu, R10 chưa mở.

Kiểm hồ sơ: links/JSON PASS; staged diff check chỉ báo bốn dòng context rỗng của raw source-change.patch (7/11/19/23), giữ nguyên patch. Kiểm phần authored sau loại đúng raw patch này PASS.
