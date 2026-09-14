# Giữ approval sau đối chiếu không đổi nghĩa

Ngày 2026-09-15. [Phạm vi Human cho triển khai](../../KIDEA_ROADMAP.md#nonsemantic-preservation-approved). Chỉ kiểm thử xác định trên dữ liệu giả tại Windows/local NTFS; không chạy AI trial, launcher/sandbox, ACL/VM, pilot hoặc môi trường thật.

## Hành vi và giới hạn

- REVALIDATE chỉ nhận review APPROVED đúng ID/revision/digest/owners, quyền giữ approval và đánh giá NON_SEMANTIC. Bản cũ, nguồn hiện tại và năm mặt phạm vi/quyền/điều kiện/kiểm tra/dependency phải được ràng buộc. Giữ nguyên confirmationRef/revision/purpose/owners; lưu lịch sử và trước–sau. N/A giữ nguyên lý do miễn và nghĩa vụ còn lại; không thành DONE.
- SAVE tùy chọn giữ review của work theo đúng note và READ basis, với danh sách review được cấp quyền. Work, review và evidence cùng checkpoint; không đổi task/gate/blocker/returnStack. Không có phép đối chiếu thì projected graph vẫn chặn, không âm thầm giữ approval. Không tự xử lý review phụ thuộc bị làm cũ hoặc review đang chờ duyệt.
- UNKNOWN/REOPEN, đánh giá thiếu hoặc điều kiện đổi, sai bản/nguồn/quyền/note bị từ chối trước ghi. Nguồn đổi sau prepare bị chặn khi execute. Giữ marker pending kể cả khi mọi đích đã khớp PLANNED sau verify; không tự chứng nhận hoàn tất, replay hoặc phục hồi.
- Hash/JSON kiểm tra sự nhất quán của lời đánh giá, không chứng minh lời đánh giá đúng. Caller vẫn phải đọc/so nội dung và dependency, xác định quyền thật. Test giả có assessment dựng sẵn không phải bằng chứng AI phân biệt được đổi nghĩa. Kiểm chứng AI và gate R02-T10/T11 vẫn riêng.
- Giữ mô hình một lượt ghi hợp tác: không phải giao dịch filesystem nguyên tử, khóa chống editor khác hay bảo đảm power-loss. Bằng chứng approval lưu riêng dưới review/evidence hoặc Git đúng byte; không dùng bản recovery có thể dọn làm lịch sử review.

## Lượt thử trước kết quả cuối

Lượt tập trung đầu: 56/58 đạt. Hai lỗi SAVE là fixture vẫn IN_REVIEW trong khi ca thử yêu cầu giữ APPROVED; runtime từ chối đúng REVIEW_NOT_APPROVED. Đã sửa riêng fixture thành APPROVED với confirmation giả được giữ, không nới precondition. Fixture cũ giữ tại `.test-output/r02-t09/resume-9CTpx6/`; review fixtures tại `.test-output/r02-t08/review-MYXiDV/`.

Lượt tập trung lại: 3/3 đạt, `14683.2247 ms`, tại `.test-output/r02-t09/resume-u7eUwa/`: SAVE giữ xác nhận, ràng buộc note/grant/bản/assessment, và ngắt sau verify vẫn pending. Không cộng những kết quả này vào hồi quy cuối.

Lượt toàn bộ `.test-output/r02-t07/regression-8Au4dQ/` đạt 234/234 ở các tiến trình test nhưng `inputsUnchanged: false`, runner exit 1: trong lúc chạy đã bổ sung chốt thiếu nguồn/thư mục evidence ở SAVE và case nguồn null. Vì vậy không dùng lượt này làm bằng chứng bản cuối; chạy lại toàn bộ, không chỉ test phần thay đổi.

Lượt cố định `.test-output/r02-t07/regression-ytAIeh/`: 233/234, một kỳ vọng test sai. Nguồn null bị READ_BLOCKED từ graph và SAVE trả CONTINUATION_NOT_AVAILABLE trước khi đến phép so sánh; test lại mong COMPARISON_SOURCE_DIFFERS. Sửa test để kiểm tra chốt sớm này và không ghi; không nới runtime. Chạy riêng ca đó đạt 1/1 tại `.test-output/r02-t09/resume-5RAPS9/`, `6025.5999 ms`; tiếp tục chạy lại toàn bộ.

## Hồi quy cuối

**234/234 PASS**, 0 fail/skipped/cancelled; runner exit 0, `inputsUnchanged: true` trên 27 file theo dõi. Bắt đầu `2026-09-14T23:29:10.044Z`, thời gian test `195429.4338 ms`. Không cộng ca từ lượt trước.

| Suite | Ca đạt |
|---|---:|
| Public helper | 15 |
| Status/schema/version/gate | 78 |
| Writer hợp tác/Git/cleanup | 61 |
| Init | 20 |
| Review | 26 |
| Resume/context/SAVE/pending | 34 |

Raw output, danh sách/hash đầu vào trước–sau tại `.test-output/r02-t07/regression-wCcqaG/`. Lệnh tái lập: `.tools/node-v24.21.0-win-x64/node.exe tests/r02-t07/run-tests.mjs`. Node `v24.21.0`, SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`. Skill validator chính thức và `git diff --check` đạt; không cài dependency mới.

- `summary.json`: SHA-256 `d294d707bcb3021071eba9223b95bf60ab68707f8a46eb68b8d6ce61be1c5009`.
- `stdout.txt`: SHA-256 `384510ab3ec967a5ada949b793006a24ab34f5fae33d1db872a83487d33c5333`.
- `stderr.txt`: rỗng, SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
