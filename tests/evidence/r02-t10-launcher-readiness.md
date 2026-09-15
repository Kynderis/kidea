# T10 — kiểm tra chỉ đọc launcher, 2026-09-15

**Kết luận: chưa đủ căn cứ cho chạy AI với ranh giới quyền hiện tại.** Human “Ok làm đi” sau answer a8524fd cho chuẩn bị bài thử và xác minh launcher, không cấp phiên AI, ACL, cài đặt hoặc cấu hình mới. Lượt này không gọi bất kỳ binary Codex/sandbox/helper nào, kể cả `--help`; không đọc auth/secrets hoặc thay ACL/config.

## Kết quả kiểm tra hiện tại

| Thành phần | Quan sát xác minh chỉ đọc |
|---|---|
| CLI trên PATH | `C:/Users/vuhoa/AppData/Local/OpenAI/Codex/bin/7ac07f4ce733f89a/codex.exe`, 295.408.944 byte |
| SHA-256 CLI | `3d6ca7085c932b62ef4ee4877e92f15b050fb94b2eb8e6c10a346a06248c6004`, trùng binary controller T06 đã khóa; version 0.153.4 lấy từ hồ sơ cũ, không chạy `--version` lần này |
| Setup helper cạnh CLI | `codex-windows-sandbox-setup.exe`, SHA-256 `2eba3bc67a92884fd5a21fc51efa3c2646dd6ae50a2858000a59518edd0d3f2a` |
| Runner cạnh CLI | `codex-command-runner.exe`, SHA-256 `2fc383a7ce263b2de37fcbb318bb3a9bd420e9716bd51499eca771a1f1208e81` |
| Cấu hình đọc chọn lọc | `config.toml` dòng 140–141: `[windows] sandbox = "elevated"` |
| Setup marker | Version 5, ngày tạo 2026-07-08, `read_roots: []`, `write_roots: []`; không chứng minh allowlist mới đã được áp dụng |
| Log sự cố còn hiện hữu | `sandbox.2026-09-14.log`, dòng 280–289: `START: windows --help`, setup helper với cwd root repo, áp read ACL, dùng runner dưới `.sandbox-bin`, thử đổi thuộc tính `C:/Users/Default` rồi Access denied |

Đã đọc controller T06, protocol/preflight T07 và thiết kế AI T10. Không có mã nguồn native launcher trong các file được kiểm tra để truy chính xác mọi đích ACL; hash không chứng minh hành vi an toàn. Một binary khác hiện diện trong `.sandbox-bin` không phải căn cứ tự thay launcher. Không suy marker rỗng, cờ read-only hoặc không chạy `icacls` thành bảo đảm launcher không sửa quyền.

[Hồ sơ T07](../r02-t07/launcher-preflight.md) vẫn giữ nguyên: 0/3 AI, thiếu baseline ACL trước sự cố, chưa xác định ACL nào thực sự thay đổi; không rollback bằng phỏng đoán. Lượt chỉ đọc này không giải quyết hồi tố sự cố.

## Đối chiếu OpenAI Docs

- Native `elevated` dùng sandbox user, quyền filesystem, firewall và local policy; `unelevated` vẫn dùng ACL. Tài liệu không cung cấp bảo đảm setup chỉ tác động cây fixture. Vì vậy không tự chuyển mode để né điều kiện. [Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox).
- `exec --ephemeral` chỉ mô tả không giữ rollout phiên; không bảo đảm không ghi log/cache/state/ACL. `--ignore-user-config`, `--ignore-rules` và JSONL hỗ trợ automation nhưng không chứng minh binary local này đáp ứng toàn bộ ranh giới. [Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode).

Theo hướng dẫn OpenAI Docs, kiểm tra dừng ở tài liệu chính thức và bằng chứng local trước khi thực thi launcher. Tài liệu hiện hành không được coi là source-code audit của binary cũ.

## Những điều còn thiếu trước preflight và quota AI

1. **Môi trường chạy được Human chọn**: máy hiện tại hay Windows thử nghiệm riêng. Khuyến nghị môi trường thử riêng nếu không muốn launcher chuẩn bị quyền trên máy làm việc; chưa xác minh có sẵn máy/VM và chưa cấp cài đặt/chuyển môi trường.
2. Phạm vi thực của launcher: fixture, skill/runtime đọc, config/auth/cache/log/temp/helper copies, setup user/firewall/ACL và network phục vụ model. Đích chính xác cùng quyền từng loại cần được kiểm trên môi trường đã chọn; không xin quyền rộng bằng danh sách giả định.
3. Preflight hữu hạn **không gọi model**: baseline quyền/file, kiểm canary đọc/ghi được phép và bị cấm, chống đọc expected/đầu ra lượt khác, log và xác nhận dừng cả process tree. Chỉ so hash sau chạy không phát hiện đọc lén hoặc ghi rồi phục hồi; prompt cấm không thay isolation. Chưa khóa lệnh/đích/quota preflight khi môi trường chưa được chọn.
4. Transport nhiều lượt cho A04 và phiên B không lịch sử A. Controller T06 chỉ có một `exec` prompt/phiên; không tái sử dụng nguyên trạng để giả Human feedback nhiều lượt. Phải khóa cách continuation trong A và mở B sạch, không đưa transcript A/expected cho B.

Chưa tạo fixture/manifest chạy thật hoặc controller thực thi mới vì các đầu vào chi phối đó chưa xác định. [Protocol chuẩn bị](../../proposals/r02-t10-ai-integration-r1.md) giữ DRAFT, không nhận READY và không xin chạy sáu phiên ngay lúc này. Status acceptance và nguồn runtime không bị sửa; không chạy lại tests hoặc benchmark trong lượt tài liệu/chỉ đọc này.
