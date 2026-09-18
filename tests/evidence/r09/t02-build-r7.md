# R09-T02 build r7 — FAIL khi dừng HTTP server dưới TSan

Quyền: Human đã duyệt thực thi trọn R09, thay yêu cầu duyệt từng lượt. [Manifest](t02-build-r7/build-manifest.json) SHA2568e1dd7e7de27da211c3132c8d67258dcfc53ce61b72fe2e2bf4de036ea9d5793; source55640a5,75file/824vendor. [Receipt](t02-build-r7/execution-receipt.json), [raw run](t02-build-r7/run/results.json). Run t02-f692cc61-8e2c-4fcb-92c9-80647c53ebce, Mac Intel → Docker Linux amd64, image6fba0f63 đã pin.

- Dev và ASan/UBSan:46CTest/796assertions/18HTTP PASS, dev formatter/tidy PASS.
- TSan: controls PASS, đủ796assertions;40case CLEAN,6case/12report đúng hai cặp trong EX r2, giữ raw CTest FAIL/exit66. Gate cases cho tiếp tục đúng phạm vi.
- HTTP TSan:18assertions chức năng PASS nhưng server exit66 do **hai signal-unsafe allocation** trong SIGTERM handler mặc định Drogon→quit→queueInLoop→operator new. Gate chặn đúng, không miễn trừ cảnh báo mới.
- Release NOT_RUN do fail-stop.3container đã thu hồi, nguồn75file nguyên hash sau run. Output1.961.284KiB giữ local, copy out/log/state/manifest vào evidence, không ghi đè r6.

Đã sửa đường xử lý tín hiệu trong backend của pilot: chặn SIGTERM/SIGINT trước tạo worker; poll sigtimedwait không chặn trong main event loop; gọi quit ở ngữ cảnh bình thường. Tắt handler mặc định qua API công khai của Drogon. Không sửa vendor/DB logic/EX r2/sanitizer flags hoặc giảm kiểm. Thêm regression2signal mỗi preset, yêu cầu exit0/stderr sạch; report r7 làm fixture âm và vẫn BLOCKED.100kiểm offline PASS (66policy+34gate).

R8 source1a4dc77, HEAD6be33d1 bao gồm Web authoring riêng, [preflight](t02-build-r8/preflight.json)78source/824vendor. Manifestffcaa8889ec47d0aa62bf95860a704225d54af5015586d9c4a0754fda8b97aef. R8 được chạy theo quyền trọn phase, không cần duyệt thêm. Kết quả runtime mới còn chờ; R09 chưa hoàn tất.
