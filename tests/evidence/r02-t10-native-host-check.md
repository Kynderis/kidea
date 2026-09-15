# Kiểm tra máy hiện tại cho bài thử AI — 2026-09-15

Human “Ok bạn làm đi” sau answer 70562b5 cho kiểm tra launcher và xác định phạm vi trước xin quyền preflight. **Đã kiểm tra chỉ đọc; chưa chạy sandbox/model hoặc thay ACL/config.** Chỉ gọi trợ giúp CLI bằng cú pháp help xác minh bên dưới. Không dựng VM, dọn ổ hoặc di chuyển dữ liệu.

## Kết quả mới

| Hạng mục | Quan sát |
|---|---|
| C: NTFS | Tổng 99,32 GiB, trống **17,86 GiB** |
| D: NTFS | Tổng 267,78 GiB, trống **236,32 GiB** |
| Local users | `CodexSandboxOffline`, `CodexSandboxOnline` có sẵn và Enabled |
| Local group | `CodexSandboxUsers` có sẵn |
| Firewall | Ba rule `codex_sandbox_offline_block_outbound`, `codex_sandbox_offline_block_loopback_tcp`, `codex_sandbox_offline_block_loopback_udp` Enabled, Outbound, Block; chỉ là kiểm cấu hình, chưa thử kết nối |
| ACL Documents, Downloads, `.codex` của user | Có Allow `ReadAndExecute, Synchronize` cho `CodexSandboxUsers`, entry không kế thừa ở từng thư mục được kiểm |
| ACL repo, skill, Node và `C:/Users/Default` | Không thấy entry mang tên Codex trong ACL của chính các thư mục được kiểm; **không** chứng minh token bị từ chối, vì còn group/ACE/cơ chế khác |
| Sandbox marker/state | Marker v5 từ tháng 7, read/write roots rỗng; deny-read state `principals: {}`. Không suy thành policy hiệu lực của một phiên mới |

Không công bố SID hoặc toàn bộ ACL cá nhân. Không đọc nội dung Documents/Downloads/auth/secrets. Dung lượng là snapshot khi kiểm, không cam kết mức trống khi chạy sau này. D đủ chỗ cho dữ liệu thử nhỏ hiện có; chưa tính dung lượng một VM cụ thể, không tự cài VM.

## Ý nghĩa của ACL hiện có

Log `sandbox.2026-07-08.log` dòng 8–37 ghi setup cấp read ACE cho nhiều đường trong hồ sơ user, gồm Documents, Downloads và `.codex`; có grant khác thất bại. Kiểm ACL hiện tại xác nhận các entry nói trên còn hiện diện, **không xác định chúng do sự cố T07 tạo**, cũng không chứng minh AI đã truy cập nội dung cá nhân. Quyền hiệu lực còn phụ thuộc token và policy từng phiên.

Điểm kiểm chứng bắt buộc mới được làm rõ: không chỉ kiểm agent không ghi ngoài fixture; phải kiểm **không đọc oracle, lượt khác và vùng cá nhân ngoài allowlist**, bằng canary tổng hợp chứ không thử mở dữ liệu thật. Một thư mục riêng ở D hoặc policy “workspace-write” không tự chứng minh điều này.

## Trợ giúp được kiểm tra, không kích hoạt sandbox

Binary trực tiếp `C:/Users/vuhoa/AppData/Local/OpenAI/Codex/bin/7ac07f4ce733f89a/codex.exe`, SHA-256 vẫn `3d6ca7085c932b62ef4ee4877e92f15b050fb94b2eb8e6c10a346a06248c6004`.

- `--help`: có command `help`, `sandbox`, override cấu hình `-c`.
- `help sandbox`: cú pháp Windows là `sandbox [OPTIONS] [COMMAND]...`; có `-P/--permission-profile`, `-C/--cd`, `--sandbox-state-json`. Không có tầng subcommand `windows`; đây giải thích vì sao cú pháp cũ bị coi là command thực.
- `help debug`, `help doctor`: chỉ xem trợ giúp, không chạy doctor/models/app-server. Không đọc credential hoặc gọi dịch vụ.
- Danh sách/tổng byte các file trong `.sandbox` sau help khớp inventory trước help, không có log sandbox ngày mới. Đây không phải chứng minh toàn filesystem/ACL không đổi; lệnh thực hiện không yêu cầu thay đổi chúng.

[OpenAI Docs — Permissions](https://learn.chatgpt.com/docs/permissions) mô tả profile với deny mặc định, chỉ đọc runtime tối thiểu và allowlist workspace. Có thể dùng làm thiết kế candidate; **hỗ trợ option ở CLI chưa chứng minh policy hiệu lực hoặc phạm vi setup ACL của binary**. Chưa truyền profile cho launcher.

## Phạm vi định hướng cho preflight — chưa phải quyền chạy

| Vùng | Định hướng quyền, chưa áp dụng |
|---|---|
| `D:/Code/kynderis/kidea/.test-output/r02-t10/launcher-preflight-r1/work` | Child chỉ đọc/ghi canary tổng hợp ở đây; root cha mới chưa tồn tại |
| `.../launcher-preflight-r1/forbidden` | Canary ngoài quyền, child phải không đọc/ghi được; không dùng file cá nhân làm probe |
| `.../launcher-preflight-r1/evidence` | Chỉ controller ghi transcript/baseline; child không đọc oracle hoặc sửa kết quả |
| Node riêng dưới `.tools/node-v24.21.0-win-x64` | Chỉ đọc/thực thi; không sửa binary/source repo |
| `C:/Users/vuhoa/.codex/.sandbox`, `.sandbox-bin` | Là các vị trí hạ tầng đã quan sát; launcher có thể ghi state/log/copy helper. Chưa cấp quyền ở lượt này |
| Các vùng cá nhân và `C:/Users/Default` | Không là dữ liệu thử; không tự cấp đọc hoặc đổi ACL/thuộc tính để chạy được |

**Danh sách trên chưa đầy đủ để cấp thực thi.** Chưa xác minh launcher có thể áp profile mà không refresh quyền ngoài các đích cho phép, runtime tối thiểu thực tế gồm những đường nào, hoặc deny-read canary tác động ACL ra sao. Không coi có account/firewall sẵn là không có setup/refresh mới. Snapshot sau chạy không ngăn side effect xảy ra trước khi phát hiện.

Kết luận: dung lượng không phải blocker của hướng thử trực tiếp; blocker còn lại là phạm vi setup và quyền đọc thực tế. Không xin quyền sửa ACL rộng, không chạy rồi mới tìm phạm vi. Cần làm rõ đường áp profile/setup trước khi trình lệnh/quota preflight có thể thực thi. Không nâng giả định thành READY hoặc mở sáu phiên AI; T07 0/3, các kết quả status và evidence cũ giữ nguyên.
