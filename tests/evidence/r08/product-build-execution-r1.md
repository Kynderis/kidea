# R08-B1 — build sạch backend/Web PASS_SCOPED

2026-09-17. Human đã duyệt B1 và R08-TIDY-01: “Duyệt B1 và R08-TIDY-01, làm tiếp R08.” **B1 PASS**, không là nghiệm thu toàn R08.

## Nguồn và môi trường

Repo Kynderis/kidea, master, source HEAD trước sửa harness `becb96fd42bcef0047b992e3b1d1057a341f50ac`; lúc bắt đầu không có thay đổi có sẵn. Node24.19.0 trên macOS14.7/Intel x86_64, uid501. Build thực trong Docker Linux/amd64, image toolchain/browser cố định theo manifest. [Môi trường thực](product-build-execution-r1/environment.json).

1051file source/vendor được giữ nguyên, khóa tại `tests/r08/product-build-r1/inputs.json`. Source ứng dụng và profile không sửa. [Manifest đã chạy](../../r08/product-build-r1/manifest.json) SHA256 `3cbf4f8f9ddea26b14e8a34b1724fd484f89e734a7578ca54ddda63ea93986b7`. Mốc sourceBase của gói chuẩn bị là `14597c9`; hash từng file và bản sửa harness mới là identity của lượt này.

## FAIL được giữ và nguyên nhân sửa

Manifest ban đầu `adb913ee7257a5bba9f41662eb5559164641105eadfa64b754d479392388d2d0` dừng với FILE_SET trước khi tạo output/lock hoặc chạy Docker. Verifier bỏ nhầm manifest.json của source. Sửa để chỉ loại manifest tự kê khai khi caller kiểm gói, còn source phải kiểm đủ file/hash. Thêm hồi quy thiếu/thừa/sửa manifest. [Chi tiết và quyền của lượt](product-build-execution-r1/preflight-amendment.md), [stderr FAIL](product-build-execution-r1/runner.stderr.txt), [manifest gốc](product-build-execution-r1/original-manifest.json). Không bỏ test hoặc giảm kiểm an toàn; không tiêu một lượt build thứ hai.

## Kết quả thực

| Phép kiểm | Kết quả |
|---|---|
| C++ formatter, clang-tidy4translation unit | PASS; đúng một NOLINT được R08-TIDY-01 cho phép, giữ checker/profile cũ |
| dev / ASan+UBSan / TSan / release | Mỗi cấu hình12/12 PASS,0fail/skip/disabled; tổng48 lượt ca |
| Web npm ci |187package từ cache offline, không download |
| Svelte sync/check, ESLint, Vite build |PASS; check0error/0warning, lint max-warnings0 |
| Web unit / Node server |32/32 và4/4 PASS; drain bị kẹt kết thúc sau30.003giây, trong tolerance5giây |
| Chromium |18/18 PASS, workers1/retries0/forbid-only |
| Lõi Kidea |283/283 PASS,117.119giây, inputsUnchanged=true |
| Guard B1/artifact và release hiện có |4/4 +8/8 PASS; không chạy lại lab R2-A |

Raw Docker command/exit/stdout/stderr: [logs](product-build-execution-r1/raw/logs/4.json) (C++), [Web](product-build-execution-r1/raw/logs/5.json), [Chromium](product-build-execution-r1/raw/logs/6.json). XML riêng cho mỗi preset nằm cùng thư mục raw. Vite có thông báo empty chunk/plugin timings; giữ nguyên stderr, không sửa cấu hình để giấu. [Core](product-build-execution-r1/core/summary.json), [test harness](product-build-execution-r1/harness.stdout.txt), [release guards](product-build-execution-r1/release-guard.stdout.txt).

## Thu hồi và artifact

[Summary](product-build-execution-r1/raw/summary.json):1.224.400ms (20phút24giây), trong60phút và giới hạn1700giây/container. Ba container tuần tự, không host port/network ngoài, không pull,2CPU/4GiB; đã đọc lại cả ba stopped/exit0/OOMKilled=false, lock đã gỡ, không container nào còn chạy. Khoảng345GiB trống. [Readback](product-build-execution-r1/readback.json). Giữ container/output/cache để truy vết, không prune dữ liệu lịch sử. R08-TIDY-01 đã dùng xong và hết hiệu lực cho lượt build khác.

Backend release4.405.008byte, SHA256 `adfa9d02ac8d293f726756690a5abd911522939302cb46bc1f13ff664e0b1104`. [Đầu vào B2 đã khóa](delivery-inputs-r1.json) có109file Web build,5252entry dependency, package/lock và Caddy đã đối chiếu. Binary/cache/node_modules không đưa vào Git; manifest chỉ giữ identity, không thay file artifact thực.

[Bảo toàn](product-build-execution-r1/preservation.json):2245file evidence R05,4088file evidence R07,21docs pilot khớp; không có `.kidea` tự tạo ở pilot. Source snapshot và package hash được kiểm lại sau build.

## Điểm tiếp tục

R08 IN_PROGRESS. B1 hoàn tất đúng build gates; [B2](../../../proposals/r08-local-delivery-ops-r1.md) đã có artifact identity và [rà source/config/restore](delivery-preparation-r1.md), còn main/child/config/target execution package, tích hợp HTTPS, restore SQLite, jobs/observer/cloud độc lập, kiểm G2 cuối và Human nghiệm thu. Chưa deploy B2 hoặc tạo VM. Không nhận137ca ứng dụng, production hoặc toàn R08 PASS. R09/R10 chưa mở; Android/iOS Future, Apple Silicon NOT_RUN.
