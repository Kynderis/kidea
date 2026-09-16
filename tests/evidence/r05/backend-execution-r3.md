# R05 — Caddy/CEL patch và kiểm HTTPS r3

2026-09-16. **PARTIAL / HEADER_BOUNDARY_FAIL / BUDGET_HOLD**, chưa PASS toàn E2. Human duyệt bản vá hai vị trí sau nguồn `308c0e8d5cb4048a9b91bbe4c242cb77845943d1`. [Quyền và hạn mức](backend-execution-r3/approval-and-limits.md), [manifest/log/hash](backend-execution-r3/manifest.json), [môi trường bắt đầu](backend-execution-r3/start.json), [trạng thái từng nhóm ma trận](backend-execution-r3/matrix-status.json).

## Đã đạt trên phạm vi kiểm thực

- Caddy source 2.11.4 + [bản vá đúng hai vị trí](backend-execution-r3/caddy-cel.patch) build bằng Go 1.26.7 trong Docker network none. [Hash binary/source/lock](backend-execution-r3/binary-and-source.sha256), [build-info thực](backend-execution-r3/build-info.txt). Đây là binary có patch local, không phải image Caddy official nguyên bản.
- Test matcher upstream và regression hai nhánh factory: **54 leaf test PASS**, 57 pass events kể cả nhóm cha, không FAIL. [Raw JSONL](backend-execution-r3/caddy-tests.jsonl). Regression kiểm kết quả true/false, truyền lỗi, constant được compile một lần và tái dùng lúc runtime.
- Caddy adapt/validate và invariant config cuối PASS; admin off, không forward_auth, CA không cài trust, h1/h2, chỉ loopback 8443 ở Docker publish. [Config thực](backend-execution-r3/adapted-source-final.json).
- C++ dev rebuild sau sửa server: **9/9 PASS**. [JUnit](backend-execution-r3/cpp-dev.xml). ASan/UBSan 9/9 thuộc nguồn/lượt r2; không gán kết quả đó cho binary server đã sửa ở r3. Các source domain/unit không đổi nhưng server mới chưa được chạy đầy đủ dưới sanitizer.
- Web trong Docker: type/check, lint, **32/32 unit** và build PASS, có chạy lại sau sửa SSR. Không suy thành browser regression PASS.
- Nhóm Node HTTPS trên nguồn cuối: **33/33 PASS**, gồm CA hợp lệ, thiếu CA/sai hostname bị từ chối; header giả; phiên hết hạn/quyền; Origin/token/CSRF; bốn bảng không đổi khi từ chối và commit đồng thời khi hợp lệ; scope cookie; body 131071/131072/131073 ở Content-Length và chunked; SSR cách ly 8 request hai actor; no-store/noindex; WebSocket từ chối Origin/session/proof sai, đóng sau revoke và không gửi sự kiện riêng tiếp theo. Đây là subset, không phải toàn H01–H12; chưa negative expired-leaf hoặc browser thật.

## FAIL đã tìm và sửa

Raw FAIL/PASS giữ nguyên trong 25 stage được manifest liệt kê:

1. Gofmt `-w` không ghi được file copy vào volume dưới UID khác. Xuất bản format sang evidence, test vẫn dùng cùng nội dung source; không nâng quyền container.
2. Adapt Caddyfile cho thấy `16KB` thành 16000 byte và guard header được xếp sau proxy. Dùng `16KiB`, route giữ thứ tự guard trước proxy; giữ FAIL invariant cũ và kiểm config mới. Đây chưa giải quyết giới hạn đọc thực tại biên, xem dưới.
3. Backend startup ghi lỗi upload vào filesystem chỉ đọc và filter SocketAuth chưa đăng ký. Đặt upload vào tmpfs `/tmp`, đăng ký filter rõ ràng và fail startup nếu không tìm thấy. HTTPS/WebSocket đã kiểm được việc từ chối request trái phép sau sửa.
4. SSR gọi backend bằng fetch không giữ Host override trên runtime này, trả 400. Dùng HTTP request tới đích backend cố định, chuyển đúng cookie của caller và Host, có timeout/giới hạn response; giữ nguyên kiểm quyền backend.
5. Header cache bị lặp `no-store, no-store`; đổi Caddy response header sang deferred set để chuẩn hóa sau upstream. Không nới assertion; full subset HTTPS chạy lại đạt.

## FAIL còn mở và giới hạn tài nguyên

Biên header cuối đo riêng phần header, không gồm request line 26 byte: 16383 byte → 200 đúng; **16385 byte → 200, kỳ vọng 431: FAIL**; 22000 byte → 431 đúng. [Ca kiểm cuối](backend-execution-r3/sample/scripts/header-boundary.mjs). Ca đầu tính chung request line đã được giữ riêng, không dùng làm bằng chứng biên cuối. Đọc source Go 1.26.7 xác nhận `initialReadLimitSize()` cộng 4096 byte đệm vào MaxHeaderBytes; đây là nguyên nhân phù hợp với quan sát, chưa phải bản sửa. Không giảm kỳ vọng hoặc đánh dấu H07 đạt.

TSan capability probe với hai thread dùng mutex PASS. Full TSan build bị dừng chủ động khi mức giảm free space tiến tới trần 16 GiB; exit 137, OOMKilled false. Chưa chạy CTest TSan, không coi là lỗi chương trình hay PASS sanitizer. Release, clang-tidy/format cuối, CommonMark conformance đầy đủ, sáu mutant, browser regression, expired TLS control, drain/stuck đầy đủ và full matrix còn chưa hoàn tất.

[Đề xuất nâng riêng trần đĩa lên 24 GiB](../../../proposals/r05-docker-disk-budget-r1.md) để tiếp tục; chưa được duyệt. Không chạy tiếp phần tăng dung lượng hoặc tự xóa cache để che mức dùng. Source/runtime sample có thật, nhưng đây vẫn là mẫu tổng hợp, không chứng nhận sản phẩm hay production.

## Bảo toàn và bàn giao

Collector xác minh 27 file Web r2 gốc, 21 hồ sơ pilot và 55 file mẫu nền không bị đổi ngoài thay đổi đã ghi. Snapshot nguồn thay đổi và SHA lưu cùng manifest; credential synthetic được kiểm không xuất hiện trong evidence, private CA key không đưa sang client hoặc host trust. Lượt r1/r2 và Windows giữ nguyên.

Container r3 đã dừng, cổng 8443 đóng. Giữ volume/image/cache và fixture riêng để tiếp tục; không prune hoặc cài hệ thống. R05/T03-S03 vẫn IN_PROGRESS; LP-01 Apple Silicon NOT_RUN. Bước tiếp theo là xử lý FAIL header và hoàn tất phần còn lại sau khi trần đĩa được chốt.
