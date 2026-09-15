# T10 — kiểm thử chức năng thu gọn trên Windows

Ngày 2026-09-15. Human đồng ý phương án trong `answer.md` tại commit `8756e3626e8a0c7bd1da7d3f82cd587461e052ec`: project giả trên D, kiểm đọc/ghi file trước–sau, không VM hoặc thay thiết lập bảo mật Windows. Human yêu cầu thực hiện liền mạch các việc đã đủ quyền, chỉ hỏi khi phát sinh quyền/quyết định mới.

## Kết quả luồng public CLI

**PASS 22/22 tình huống, 24 lần gọi public CLI**, từ Node 24.21.0 có hash đã khóa. Runner: `tests/r02-t10/functional-flow.mjs`; dữ liệu tóm tắt/hash: [functional-flow.json](r02-t10-functional-flow.json).

Lệnh: `.tools/node-v24.21.0-win-x64/node.exe tests/r02-t10/functional-flow.mjs`.

- Init tạo hồ sơ nháp, giữ ý tưởng chưa được chọn; init lại không đổi byte.
- File trong project tự nhận quyền không thay quyền truyền vào lệnh.
- CREATE → SUBMIT → FEEDBACK → REVISE → SUBMIT → APPROVE bằng sự kiện Human giả lập của script. Chỉ áp dụng fixture, không là approval thật của người dùng.
- Thiếu xác nhận/quyền hoặc sai digest/revision bị từ chối, không đổi file.
- Approval giữ lịch sử, không tự DONE/đổi task; approval lặp không đổi byte.
- SAVE rồi một tiến trình CLI mới READ nhận đúng điểm dở từ file; giữ review, task, return stack và tài liệu sản phẩm.
- File bắt buộc bị thiếu hoặc nguồn đã duyệt đổi thì dừng; marker pending không rõ không bị xóa/replay.
- Kết quả triển khai UNKNOWN vẫn UNKNOWN, không thành quyền thực thi.
- change/visualize trả NOT_IMPLEMENTED, không đổi hồ sơ; status cuối hợp lệ và chỉ đọc.

Raw report cuối: `.test-output/r02-t10/functional-flow-3q67aY/report.json`, giữ input/output/exit code và hash từng file trước–sau cho từng lệnh. Thời gian luồng đạt khoảng 21,2 giây; đây không phải benchmark/ngưỡng nghiệm thu hiệu năng mới.

## Lần đầu và điều chỉnh test

Lần đầu tại `.test-output/r02-t10/functional-flow-KtiirQ/report.json` dừng sau 14 tình huống đạt, ở lần gọi thứ 15: test đòi CONTEXT_READY nhưng thực tế WAITING. Init vẫn giữ blocker W-001; approve không có quyền tự xóa blocker hoặc chuyển task. Đối chiếu `resume.mjs` xác nhận WAITING đúng với trạng thái này. Sửa kỳ vọng thành WAITING và kiểm thêm blocker được giữ qua SAVE/READ; **không sửa runtime, không sửa fixture để ép PASS**. Giữ nguyên báo cáo thất bại; lần sau dùng root mới.

## Hồi quy bổ sung

**PASS 60/60, không fail/cancel/skip**, gồm 26 test review và 34 test resume, khoảng 235,9 giây. Lệnh: `.tools/node-v24.21.0-win-x64/node.exe --test --test-concurrency=1 tests/r02-t08/approve.test.mjs tests/r02-t09/resume.test.mjs`. [Toàn bộ output](r02-t10-functional-regression.txt).

Bao gồm: giữ approval khi thay đổi phi ngữ nghĩa đã được đối chiếu; không giữ approval cho thay đổi ngữ nghĩa/thiếu bằng chứng; không chạy lại DONE; không tự chọn task; ba điểm ngắt BEFORE_FIRST_WRITE/AFTER_PARTIAL_WRITE/AFTER_VERIFY; trạng thái Git thay đổi/xung đột; và luồng init → review → feedback → approve → SAVE bị ngắt → resume chẩn đoán. Chỉ tạo/thay đổi project Git giả trong các fixture của test, không tác động Git project thật ngoài lưu tài liệu/bằng chứng theo yêu cầu có sẵn.

Đây là 60 test hồi quy hiện có chạy mới, không phải 60 phiên AI và không chạy lại bộ benchmark status đã hết lượt. Tổng mới gồm 22 tình huống public CLI và 60 test hồi quy; hai nhóm có phần chức năng giao nhau, không gọi là 82 hành vi độc lập.

## Giới hạn

- Đây là kiểm thử script qua public entrypoint, dưới phiên điều phối hiện tại. Tiến trình CLI mới không phải phiên AI mới; không chứng minh AI tự đọc hiểu skill, quyết định semantic change hoặc hội thoại hai phiên độc lập.
- Không khởi chạy Codex CLI, thiết lập sandbox, tạo VM, đổi ACL/tài khoản/firewall, cài dependency hoặc thao tác dịch vụ/deploy. Test không dùng dữ liệu cá nhân; không chứng minh cách ly OS.
- Hash toàn bộ cây `.agents/skills/kidea` trước–sau luồng đạt trùng nhau. Không tuyên bố đã kiểm hash toàn máy.
- Kidea chưa có public change/visualize hoặc tự động chuyển việc; bài thử không mở thêm quyền này, không nghiệm thu toàn bộ R02. Kịch bản sáu phiên AI cũ vẫn riêng và chưa chạy.
