# T07-S03 — quota đã duyệt, launcher chưa được chạy

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
