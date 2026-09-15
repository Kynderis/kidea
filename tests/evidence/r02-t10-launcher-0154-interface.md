# Launcher 0.154 — kiểm tra giao diện trước thực thi

Ngày 2026-09-15. Human “bạn làm đi” sau fe14c7b cho tiếp tục làm rõ setup; chưa cấp sandbox/model/ACL mới. **Chưa chứng minh được setup chỉ thay quyền trong fixture.** Lượt này phát hiện binary thay đổi và kiểm schema của chính bản hiện tại, không audit mã nguồn native hoặc thử policy bằng thực thi.

## Thay đổi phiên bản được xác minh

- Đường cũ `C:/Users/vuhoa/AppData/Local/OpenAI/Codex/bin/7ac07f4ce733f89a` không còn tồn tại. Không khôi phục/cài lại hoặc tự sửa controller T06 cũ.
- PATH hiện trỏ tới `C:/Users/vuhoa/AppData/Local/OpenAI/Codex/bin/12219cbfbcbddde7/codex.exe`, 297.858.352 byte, SHA-256 `960c111d47afd61669954b9df9e56083e302edbfa3ef6962d81dcc14a30051dc`.
- `--version` trả `codex-cli 0.154.0-alpha.6.2`. Không xác định ai/thời điểm cập nhật từ việc này; báo cáo binary 0.153.4 trước đó chỉ còn giá trị lịch sử.
- Thư mục binary gồm CLI, code-mode host, command runner và setup helper; không có mã nguồn native đi kèm trong thư mục được kiểm. Không suy cùng tên helper là cùng hành vi.

## Các lệnh đã thực hiện

Chỉ `--version`, `help sandbox`, `help debug`, `help app-server`, `help debug app-server`, `help app-server generate-json-schema`, rồi:

`codex app-server generate-json-schema --experimental --out D:/Code/kynderis/kidea/.test-output/r02-t10/launcher-schema-0154-r1`

Đây là xuất schema theo [OpenAI Docs — App Server](https://learn.chatgpt.com/docs/app-server), không khởi động server/daemon, gửi thread/turn hoặc chạy sandbox. Root mới được kiểm chưa tồn tại; xuất một lần thành công, 426 file/4.210.655 byte trên D. Không ghi đè schema/evidence cũ. Không gọi doctor, models, setupStart, sandbox command hoặc đọc auth.

## Kết quả kiểm giao diện

| Giao diện | Điều xác minh được | Không chứng minh được |
|---|---|---|
| `sandbox -P/--permission-profile`, `-C/--cd` | Binary nhận lựa chọn profile/cwd và sandbox-state | Enforcement đúng hoặc setup không đụng ACL ngoài scope |
| `windowsSandbox/readiness` | Response chỉ có `ready/notConfigured/updateRequired` | Không trả danh sách quyền/đường dẫn sắp thay đổi |
| `windowsSandbox/setupStart` | Request có `mode` và `cwd`; mode elevated/unelevated | Không có trường ACL allowlist/dry-run trong request này |
| `permissionProfile/list` | Liệt kê profile theo cwd/cursor/limit | Không là preview side effect của setup |

Không tìm thấy giao diện preview ACL trong schema công khai đã xuất. Đây là giới hạn quan sát của giao diện, **không** là kết luận tuyệt đối rằng binary không có bất kỳ cơ chế nội bộ nào. Schema không thay mã nguồn đúng build hoặc preflight có quyền.

Hash bằng chứng local:

- `v2/WindowsSandboxReadinessResponse.json`: `077f60a3d6d1fc226c45059472b29caf675fdc3fdebb29569eaab94bd05ceb00`.
- `v2/WindowsSandboxSetupStartParams.json`: `8610d077fff4fc5811f2e33dea82617a15ffb82f08e55e1540aef877133f5b4f`.
- `ClientRequest.json`: `4b1ea47e8a389402556b23451b5a690944e498dc31557b1bca3525631655f1f4`.

Inventory `.sandbox` sau kiểm tra vẫn là các file/byte đã quan sát, không có log ngày mới. Không có baseline toàn máy để tuyên bố mọi trạng thái hệ thống tuyệt đối không đổi. Không thực hiện lệnh sửa ACL/config; chỉ tạo schema và báo cáo.

## Quyết định cần phân biệt

[OpenAI Docs — Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox) mô tả setup elevated dùng tài khoản sandbox, ACL, firewall/local policy. Quyền cho **Codex chuẩn bị sandbox tiêu chuẩn trên máy** khác với quyền cho **AI đọc/ghi dữ liệu**. Có thể giữ quyền agent hẹp trong khi setup có thay đổi hạ tầng ngoài fixture; không được hứa cả hai cùng bị giới hạn bởi thư mục D.

Nếu Human vẫn yêu cầu mọi thay đổi ACL chỉ trong fixture: tiếp tục dừng, chưa có cách được chứng minh đáp ứng bằng binary này. Nếu Human chấp nhận cơ chế thiết lập sandbox tiêu chuẩn ngoài fixture: cần ghi rõ ngoại lệ mới, khóa đúng binary và chuẩn bị preflight không-model hữu hạn trước AI; không tự suy “làm đi” ở lượt chỉ đọc thành ngoại lệ đó. Không tự tạo/gỡ account, firewall, đổi ACL người dùng, rollback đoán hoặc cấp danger-full-access cho AI.

T07 cũ 0/3, sự cố chưa khép; kế hoạch sáu phiên tích hợp vẫn DRAFT. Kết quả status/nguồn Kidea không đổi. Không dùng schema này làm chứng nhận sandbox an toàn hoặc nguồn mới đã nghiệm thu.
