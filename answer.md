Đã kiểm tra máy hiện tại:

- **C còn 17,86 GiB; D còn 236,32 GiB.** Dung lượng chưa phải trở ngại cho dữ liệu thử; chưa cần dựng VM.
- Tài khoản và firewall sandbox đã có sẵn. Tuy nhiên, nhóm sandbox hiện có quyền đọc tại `Documents`, `Downloads` và `.codex`. Đây **không phải bằng chứng AI đã đọc dữ liệu cá nhân**, cũng chưa thể quy cho sự cố T07.
- CLI hỗ trợ profile quyền riêng. Vì vậy cần kiểm cả **giới hạn đọc lẫn ghi**, không chỉ đặt thư mục thử trên D. [OpenAI Docs](https://learn.chatgpt.com/docs/permissions).

**Chưa chạy sandbox/AI hoặc thay ACL/cấu hình.** Tôi đã lập [báo cáo và phạm vi dự kiến](D:/Code/kynderis/kidea/tests/evidence/r02-t10-native-host-check.md), lưu lên `master`.

Điểm chưa xác minh được là launcher có tự cập nhật quyền ngoài phạm vi đó khi áp profile hay không. Vì vậy **chưa có gói quyền đủ chắc để xin bạn duyệt chạy**; cần làm rõ đường thiết lập của launcher trước, không chạy thử rồi mới biết nó sửa gì.
