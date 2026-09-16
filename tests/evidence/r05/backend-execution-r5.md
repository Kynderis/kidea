# R05 — Hoàn tất kiểm mẫu backend/Web, lượt r5

2026-09-16. **PASS cho các vector lab đã chỉ định; chờ review phạm vi backend/Web, R05 vẫn IN_PROGRESS.** Human duyệt R05-TIDY-01 r1 và tiếp tục sau `9b93e10a632eae92eea22c381609e454279e2884`. [Quyền và giới hạn](backend-execution-r5/approval.md), [manifest nguồn/log](backend-execution-r5/manifest.json), [ma trận 22 nhóm và provenance](backend-execution-r5/matrix-status.json).

## Thay đổi và lỗi được giữ

- Áp đúng hai comment tại `SQLITE_TRANSIENT` theo [ngoại lệ đã duyệt](../../../proposals/r05-sqlite-transient-tidy-r1.md). Giữ SQLite copy-lifetime, mọi checker khác và warnings-as-errors; không suppression sanitizer.
- Lượt clang-tidy đầu r5 còn phát hiện `performance-unnecessary-value-param` tại `trim`. Đổi tham số sang `const std::string &`, không thay logic trim/authority. Lượt sau PASS cả bốn translation unit. [Diff hai file](backend-execution-r5/source-changes.patch) và raw FAIL/PASS được giữ.
- Guard quota chặn thực sự một client mới khi container 2 CPU/4 GiB đang chạy: preflight FAIL như mong đợi, container bị từ chối không được tạo. Năm unit test cũng PASS. Browser dùng NSS riêng mỗi invocation; hai lần chạy đầy đủ đều PASS, không cài CA lên macOS hoặc bypass TLS.
- Collector phát hiện helper drain r5 còn xuất nhầm thư mục r4. Đã chuyển nguyên log r5, khôi phục đúng file lịch sử từ HEAD sạch ban đầu, sửa đường xuất và chạy lại drain cuối. [Biên bản sửa đường bằng chứng](backend-execution-r5/evidence-path-correction.json). Git xác nhận không còn thay đổi evidence r4; sự cố quota r4 vẫn giữ nguyên, không được diễn giải thành lượt r4 tuân thủ quota.

## Kết quả trên nguồn cuối

| Kiểm | Kết quả thực |
|---|---|
| Core Kidea, Mac Intel / Node 24.19.0 | 283/283 PASS, 0 skip; hash đầu vào không đổi; [summary](backend-execution-r5/core-local/summary.json) |
| Formatter + clang-tidy 18.1.3 | PASS; đúng một invocation SQLite có ngoại lệ được duyệt |
| C++ dev / ASan+UBSan / TSan / release | Mỗi preset 12/12, chạy lại đủ sau mutation; [JUnit](backend-execution-r5/cpp-results/dev.xml) |
| Sáu mutant trên bản cuối | 6/6 bị bắt: dangling capture, ACK sớm, race, mất reference hook, bỏ Origin, bỏ CSRF token |
| Backend thật: idle / đang ghi / treo | Đạt dưới dev, ASan+UBSan và TSan; đóng admission, health còn phản hồi, dừng khoảng 30 giây khi treo; restart kiểm SUCCESS bền hoặc UNKNOWN không ghi |
| HTTPS Node / upstream độc lập / header | 38/38, 15/15 và 3/3; không hạ assertion |
| Chromium HTTPS với CA riêng | 8/8 hai lần; SSR tách actor, cookie thật và override create/read/replace/delete, giả role, cross-origin form/fetch, query token, logout |
| Caddy edge drain cuối | Thường 1.372 ms, treo 30.159 ms; exit 0, normal DONE/stuck UNKNOWN; [receipt](backend-execution-r5/edge-drain-final.json) |
| Nguồn/artifact | Hai file C++ đổi; 21 hồ sơ pilot và 27 file Web gốc nguyên hash. Source Web khớp volume; hash binary của bốn preset/Caddy được lưu |

Không chạy lại phần có đầu vào không đổi chỉ để cộng lượt: 55 leaf tests/config adaptation Caddy, Web check/lint/build + 32 unit/18 browser/4 server và TLS valid/expired paired control giữ provenance [r4](backend-execution-r4.md). Đã đối chiếu source/config và Caddy binary hash không đổi; kết quả tích hợp HTTPS/browser/drain ở r5 dùng artifact đó. Không gọi đây là toàn bộ test đều được chạy mới trong r5.

## Môi trường và teardown

[Môi trường thật](backend-execution-r5/environment.json): macOS 14.7 Intel x64, UID 501, đúng `Kynderis/kidea`, master. Node mặc định vẫn 22.22.2; core dùng Node 24.19.0 có sẵn. Yêu cầu Kidea vẫn ≥24, không khóa patch hoặc đường runtime của máy này. Docker Linux/amd64; không cài công cụ hệ thống, SDK, trust, cloud hay deploy.

[Quota](backend-execution-r5/quota-verification.json): reservation thành công tối đa 2 CPU/4 GiB; workload chạy tuần tự, không còn client chồng vượt trần. Từ đầu r5 tới collector khoảng 14,3 phút, trong 3 giờ. Không tải artifact mới. Delta dung lượng toàn filesystem từ baseline E2 khoảng 19,00 GiB/24 GiB; còn khoảng 360 GiB, cao hơn sàn 100 GiB. Đây là phép đo bảo thủ gồm hoạt động khác trên host, không phải số byte riêng workload. Các container đã dừng, port 8443 đóng; cache/volume giữ nguyên. Evidence được quét token/CSRF của fixture và PEM private-key marker.

## Giới hạn và điểm tiếp tục

Đủ bằng chứng review **22 nhóm vector hữu hạn của mẫu backend/Web**; không tự nghiệm thu profile hoặc toàn R05. Header đo field đã decode, không chứng nhận mọi biểu diễn raw-wire/HPACK; Markdown chỉ chứng minh vector đã nêu; deadline exit không thay leak-check teardown. Không suy ra 137 ca sản phẩm, host-loss/restore độc lập, benchmark cloud hoặc production đã đạt. Wrapper hồ sơ cũ gặp symlink trong r4 vẫn là FAIL lịch sử; không sửa để che lỗi.

Tiếp theo theo roadmap: review kết quả backend/Web, chuẩn bị gói môi trường/mẫu Android và iOS đúng quyền; iOS vẫn thiếu môi trường phù hợp. Chưa cài/nâng SDK hoặc macOS. T07-S02 và nghiệm thu R05 còn mở; Apple Silicon **NOT_RUN**. Ngoại lệ R05-TIDY-01 hết hiệu lực khi đóng gate R05 hoặc 2026-10-16, tùy mốc sớm hơn.
