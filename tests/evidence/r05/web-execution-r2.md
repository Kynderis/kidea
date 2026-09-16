# R05 Web r2 — Dữ liệu/phiên, giao diện và giới hạn Node

Ngày 2026-09-16. Human duyệt “Ok làm 1,2,3 nhé” sau5611c77. Đã thực hiện ba phần trên mẫu Web local hiện có; không Docker, không dependency mới, không cài công cụ hệ thống. [Phạm vi và hash đầu lượt](web-execution-r2/start.json). **Kết quả mẫu Web, không nghiệm thu toàn R05 hoặc backend.**

## Kết quả nguồn cuối

Node24.19.0/npm12.0.2 có sẵn, macOS14.7 Intel x64; cùng lock237entry và Chromium của r1. [Manifest nguồn/kết quả](web-execution-r2/manifest.json); [chuỗi kiểm](web-execution-r2/pipeline-2.json).27file nguồn mẫu khớp hash trước–sau của toàn chuỗi check/lint/unit/build/browser/server. Bước sync được kiểm lại trên cùng nguồn, không thay mã.

| Kiểm | Kết quả |
|---|---|
| TypeScript/Svelte check, ESLint | PASS,0error/0warning ở lượt cuối |
| Production adapter-node build | PASS |
| Unit | **32/32 PASS**, gồm14ca r1 và18ca dữ liệu/phiên mới |
| Chromium SSR/browser | **18/18 PASS**, gồm11ca r1 và7ca mới |
| Server Node thực | **4/4 PASS** |
| Hai mutation mới | **2/2 bị phát hiện**, exit1 đúng dự kiến; nguồn nguyên byte được khôi phục |

Không skip/cancel/todo/retry ở các suite cuối. Lần lint đầu phát hiện chưa khai báo hai kiểu DOM trong scope Svelte của ESLint; bổ sung HTMLDialogElement/HTMLButtonElement globals đúng môi trường, không tắt rule. [Chuỗi lỗi đầu](web-execution-r2/pipeline-1.json) và raw từng lượt giữ nguyên. Cảnh báo empty env chunk và NO_COLOR/FORCE_COLOR còn trong raw log, không được xóa để gọi là zero-warning toàn bộ công cụ.

## 1. Dữ liệu và phiên

[Model/decoder](web-execution-r2/sample/src/lib/model.ts) nhận JSON qua unknown, kiểm cấu trúc trước dùng; reject malformed/null/array/scalar, trường thiếu/sai kiểu, actor/workshop trống, generation không safe integer dương, audience lạ. Version là chuỗi thập phân canonical unsigned64: không Number, không số âm/số mũ/leading zero hoặc lớn hơn18446744073709551615. Trường bổ sung hợp lệ được bỏ qua, không chép quyền tùy ý vào state.

Reply chỉ hiện SUCCESS/REJECTED khi FINAL khớp actor/epoch/generation/namespace/intent; sai hoặc chưa rõ vẫn UNKNOWN. Đây là kiểm phía client trên payload giả, không xác minh authority hoặc chữ ký của backend. Dữ liệu snapshot cũ khác phiên không thay state. Saved intent JSON hỏng không phát lại POST: vẫn UNKNOWN và GET đối chiếu.

[Unit dữ liệu](web-execution-r2/sample/tests/unit/input.test.mjs), [browser](web-execution-r2/sample/tests/browser/extended.spec.ts) kiểm cả đường hợp lệ và sai. [Mutation](web-execution-r2/input-mutations-3qma8x/summary.json) bỏ giới hạn uint64 hoặc bỏ ràng buộc reply đều tạo assertion failure; không dùng lỗi import/khởi động làm chứng cứ bắt bug. Tám mutation r1 giữ bằng chứng lịch sử riêng, không cộng thành mười mutation chạy mới ở r2.

## 2. Giao diện và HTML

[DataLab](web-execution-r2/sample/src/lib/DataLab.svelte) có label thật, output aria-live, nút semantic và dialog native. Browser dùng Enter mở dialog, Tab kiểm focus còn trong dialog, Escape đóng và trả focus về nút mở. Mẫu không gửi mutation khi mở/đóng dialog.

Kiểm360/1280px tại font200%: không tràn ngang, nút trong viewport và có diện tích; đã xem trực tiếp hai ảnh render. [Ảnh360px](web-execution-r2/test-artifacts/layout-360-200.png), [ảnh1280px](web-execution-r2/test-artifacts/layout-1280-200.png). Đây là tăng font CSS để kiểm reflow, không tuyên bố đã kiểm mọi chế độ zoom/OS accessibility hoặc audit WCAG toàn bộ.

Khi tắt JavaScript vẫn có title, main landmark, label và literal đã escape; meta robots và header X-Robots-Tag noindex cho lab, không Event JSON-LD. Không biến mẫu kỹ thuật thành giao diện Workshop đã nghiệm thu. [Browser report đầy đủ](web-execution-r2/test-artifacts/results.json).

## 3. Node server

[Kiểm server](web-execution-r2/sample/tests/server/lifecycle.test.mjs) chạy production bundle trong process riêng theo từng ca, chỉ127.0.0.1:4173. BODY_SIZE_LIMIT=131072, SHUTDOWN_TIMEOUT=30; không đổi ngưỡng thiết kế.

- Body đúng128KiB được nhận, lớn hơn1byte trả413; chạy cả Content-Length và chunked.
- ORIGIN cố định loopback. Host khác và Forwarded/X-Forwarded-Host/Proto/For gửi trực tiếp bị400; mẫu không có trusted proxy. Không suy cấu hình này thay trusted-proxy contract khi có Caddy.
- SIGTERM khi request đã bắt đầu: listener từ chối kết nối mới, request hiện tại hoàn tất START/DONE, process exit0 trước hạn.
- Request streaming bị kẹt: SIGTERM đóng connection sau **29,999ms đo được**, không DONE giả; process exit0. Cấu hình vẫn30,000ms; assertion dùng khoảng29–35giây để tính sai số đo/scheduling, không nới cấu hình drain lên35giây. Dữ liệu streaming giả không chứng minh rollback/commit/UNKNOWN của transaction C++.

[Log process server](web-execution-r2/test-artifacts/server/4.json). Runner/teardown dừng process do test sở hữu; cổng4173 đã đóng ở cuối. Không chạm process khác, không dịch vụ chạy nền sau lượt kiểm.

## Bảo toàn, phạm vi và bước tiếp tục

Lock không đổi,21hồ sơ pilot và36file core nguyên byte;496file bằng chứng lịch sử khớp HEAD. Nguồn mẫu mới được chụp dưới [sample](web-execution-r2/sample/README.md); không commit node_modules/browser/cache/build output, không chạy lại core hoặc benchmark lịch sử. Raw FAIL/PASS và ảnh mới riêng r2, không ghi đè r1.

Ba phần được giao đã hoàn tất trong mẫu Web. R05-T03-S03 tiếp tục IN_PROGRESS: HTTPS/cookie-policy/CSRF end-to-end, trust qua Caddy, quyền/transaction C++, integration và các yêu cầu đầy đủ vẫn chưa được chứng minh. Không đóng R05, không tích hợp skill hoặc mở phase mới. Docker vẫn hoãn đến Human báo; Android/iOS, tải/restore và Apple Silicon giữ điều kiện môi trường riêng.
