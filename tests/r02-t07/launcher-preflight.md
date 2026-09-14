# T07-S03 — quota và ngoại lệ ACL hẹp đã duyệt; thử AI tạm dừng

Human “Còn phần trên tôi duyệt nhé” sau [answer 38daef8](https://github.com/Kynderis/kidea/blob/38daef8294d0123cf96e0bf213bd2b95a6f2d20f/answer.md) cấp đúng ba phiên theo trial-r1; không cấp thêm ACL, install hoặc quyền ngoài gói. **0/3 phiên đã tiêu thụ.** Không sửa protocol/manifest đã khóa để làm chúng trông như đã có thêm quyền.

## Kiểm tra chỉ đọc

- CLI đã có hỗ trợ `exec --sandbox` và `sandbox`; chỉ đọc `--help`, không gọi model hoặc chạy command qua sandbox.
- Cấu hình hiện hành ghi `[windows] sandbox = "elevated"`. `setup_marker.json` phiên bản 5 đã tồn tại từ 2026-07-08; tại lúc đọc, `write_roots: []` và `read_roots: []`. Dấu này **không chứng minh** đã có quyền ghi cô lập cho các root F01 mới.
- ACL của `ai-fixtures-r1/session-1/F01` chỉ hiển thị các entry kế thừa Administrators/SYSTEM/Authenticated Users/Users; chưa có bằng chứng cấu hình sandbox ghi riêng tại root này đã được áp dụng.
- Log sandbox ngày 2026-09-14, các dòng 258–270 của log local, ghi launcher T06 gọi `codex-windows-sandbox-setup.exe`, `setup refresh: processed 0 write roots (read roots delegated)` và `read-acl-only mode: applying read ACLs`. Đây là bằng chứng helper ACL đã được gọi ở lượt trước, **không phải** so sánh trước/sau chứng minh cụ thể ACL nào đã đổi. Những mô tả cũ “không đổi ACL” không được hiểu là đã chứng nhận không có side effect tự động của launcher; cần phân biệt không chạy lệnh sửa ACL thủ công với không có thay đổi ACL thực tế.
- Manifest trial-r1 vẫn có SHA-256 `4105197f29250cfbf6ecbe6ec74f1052403e6c212ffd96bdb7a73344bc0f15de`. Chưa gọi init trong các root AI, chưa sửa dữ liệu hoặc khởi động phiên.

[OpenAI Docs — Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox) mô tả native sandbox sử dụng ranh giới quyền filesystem; mode unelevated cũng dựa vào ACL. Vì vậy chuyển mode không là căn cứ cho rằng có thể tránh hoàn toàn tác động tới ACL. Không chuyển sang unrestricted, WSL/VM, cài đặt hay thay cấu hình máy để lách điều kiện.

## Điểm cần Human quyết định

Gói trial-r1 cấm ACL nhưng yêu cầu chứng minh isolation trước chạy; kiểm tra trên máy cho thấy không thể mặc định launcher là thao tác không đụng ACL. Tạm dừng trước mở phiên theo chính điều kiện của gói, không phải thất bại của init hoặc hết quota.

Đề nghị cho phép **chuẩn bị/kiểm chứng sandbox có thể tự thiết lập ACL chỉ trong cây dữ liệu giả `.test-output/r02-t07/ai-fixtures-r1`**. Giữ F01 là phần được ghi, F02/F03 chỉ đọc; không cấp quyền thay ACL source repo, runtime, project thật, thư mục người dùng hoặc cấu hình hệ thống. Nếu kiểm tra cho thấy cần phạm vi ngoài cây đó, dừng và trình đúng đích/ảnh hưởng trước làm. Không hứa launcher hiện có chắc chắn đáp ứng ngoại lệ hẹp này.

Nếu được duyệt, ghi snapshot ACL/baseline riêng trước preflight; không sửa manifest nội dung gốc, không tự lấy quyền thử thành quyền áp ACL ở mọi nơi. Quota giữ 3 phiên × tối đa 3 phút, chưa dùng; không cần duyệt lại quota hoặc D1.

## Xác nhận và sự cố ngày 2026-09-14

Human “Ok hiểu rồi. Tôi duyệt phần ACL phía trên nhé” đã duyệt đúng ngoại lệ tại bản 86f15c81ff3f62e92f2d31327bcfed34f240867c: chỉ cây `ai-fixtures-r1`, F01 được ghi, F02/F03 chỉ đọc; không cấp ACL ngoài cây đó. Các mục “đề nghị/chưa duyệt” phía trên là lịch sử bản trình, không phải trạng thái hiện hành.

Trong lúc kiểm tra trợ giúp, người thực hiện gọi nhầm `codex sandbox windows --help` tại cwd `D:\Code\kynderis\kidea`. CLI Windows 0.153.4 nhận `windows --help` là command chứ không phải subcommand trợ giúp. Launcher thực sự chạy; command con thất bại `CreateProcessAsUserW failed: 2`. Đây là lỗi thao tác của người thực hiện, không phải lỗi init hoặc phiên AI; không được coi là preflight đã đạt hay được ngoại lệ hẹp cho phép.

Log local `C:\Users\vuhoa\.codex\.sandbox\sandbox.2026-09-14.log`, 15:07:43–15:07:44 +07:00, ghi setup helper chạy từ root repo, xử lý 0 write roots, `read-acl-only mode: applying read ACLs`, hoàn tất lượt read ACL; runner còn thử đặt thuộc tính ẩn cho `C:\Users\Default` và bị Access denied. Không có snapshot ACL trước lần gọi nhầm nên **chưa xác định được ACL nào thực sự thay đổi**, không tuyên bố ngoài fixture không đổi và không tự rollback bằng ACL đoán.

Đã dừng mọi launcher/AI tiếp theo. Chỉ đọc đối chiếu sau sự cố: toàn bộ 14 source trong manifest và cây file/thư mục của cả 9 fixture vẫn khớp; manifest SHA-256 giữ `4105197f29250cfbf6ecbe6ec74f1052403e6c212ffd96bdb7a73344bc0f15de`. Snapshot 104 mục ACL hiện tại và trích log lưu local tại `.test-output/r02-t07/acl-post-launch-20260914.json`; đây là **snapshot sau sự cố**, không phải baseline trước. Không push ACL/SID máy lên Git.

Trạng thái: 0/3 phiên AI đã dùng; ngoại lệ hẹp đã duyệt nhưng chưa chứng minh launcher giữ được nó. Không sửa config máy, không chạy lại sandbox, không sửa protocol/manifest đã khóa. Cần xác định trước phạm vi side effect của launcher và xử lý sự cố trước khi mở thử AI; không tự xin quyền rộng bằng một danh sách đích chưa xác minh.
