# R05 — Docker trên Mac Intel, lượt r4

2026-09-16. **IN_PROGRESS — dừng sau sự cố quota; chưa chấp nhận toàn lượt/R05.** Human duyệt nâng trần đĩa lên 24 GiB sau `fbbcf9168e1fee77ac20882c99de0aa8618eb347`; các trần khác giữ nguyên. [Quyền](backend-execution-r4/approval.md), [manifest/snapshot](backend-execution-r4/manifest.json), [nguyên nhân và sửa](backend-execution-r4/diagnosis.md), [sự cố quota](backend-execution-r4/resource-incident.md).

## Kết quả thực trước khi dừng

| Phần | Kết quả và giới hạn |
|---|---|
| Kidea core trên macOS Intel/Node 24.19.0 | 283/283 PASS, 0 skip, source unchanged; [log/summary](backend-execution-r4/core-local/summary.json) |
| C++ dev, ASan+UBSan, TSan, release | Mỗi preset 12/12 PASS trên nguồn cuối, cả sau sáu mutant; không suppression sanitizer |
| Backend thật dưới dev/ASan+UBSan/TSan | Idle, active write, stuck write đều đạt; drain khoảng 30 giây; restart xác nhận SUCCESS bền hoặc UNKNOWN không ghi; deadline exit không được tính là leak-check teardown |
| Sáu mutant | 6/6 bị bắt đúng oracle: dangling capture, ACK sớm, race, mất reference hook, bỏ Origin, bỏ CSRF token |
| Caddy | Build và 55 leaf tests PASS; adapt invariants PASS; canonical header 16383→200, 16385/22000→431 |
| Web nguồn khớp host/volume | Check/lint/build, 32 unit, 18 browser, 4 server PASS lại sau sửa đồng bộ source |
| HTTPS Node | 38/38 nhóm check PASS trên nguồn/config cuối; input/authority/CSRF/idempotency/body/SSR/socket |
| Upstream độc lập | 15/15 check PASS: Node/backend body biên declared/chunked và authorization, counts không đổi khi từ chối |
| TLS expiry | Valid control đạt; expired leaf bị từ chối trước HTTP; không bypass TLS |
| Chromium HTTPS | 7 nhóm đã PASS trước lượt cuối. Lượt cuối bổ sung kiểm cookie override HTTPS chưa chạy được vì NSS bootstrap bị kẹt; **không nhận 8/8** |
| Edge drain | Lượt trước đạt thường/treo với grace 30s. Lượt cuối bị ngắt khi dừng tài nguyên, **chưa chấp nhận lại trên config cuối** |
| clang-tidy | **FAIL**, một cảnh báo `performance-no-int-to-ptr` tại macro `SQLITE_TRANSIENT`; ngoại lệ một invocation mới chỉ đề xuất |
| Guard quota mới | 5/5 unit PASS, gồm topology gây sự cố; Docker integration sau sửa **NOT_RUN** |
| Hồ sơ pilot | 21 file/40 rule/20 nhóm/137 source cases/998 link hợp lệ; byte 21 hồ sơ và 27 file mẫu Web gốc giữ nguyên |

Raw `tests/r05/run-tests.mjs` cũ FAIL khi quét cả sample/node_modules mới và gặp symlink. Không sửa hoặc chạy lại để giả PASS: validator hiện hành được chạy riêng trên **toàn bộ `pilot/docs`**, giữ kiểm inventory 21 file, nguồn byte-for-byte và rule/link; không gọi đó là PASS của wrapper cũ hoặc toàn bộ negative fixture suite.

Các sửa runtime: kiểm header trước route, chặn Host/SNI/port sai, grace Caddy 30s; khóa Store chung theo writer authority; tên DB fixture CREATE-exclusive; dừng process ở deadline thay vì join worker vô hạn; signal handler chỉ đặt cờ lock-free, không gọi logger. Không sửa byte SQLite/Drogon, không bỏ ca/checker. [Snapshot cuối và hash](backend-execution-r4/manifest.json) phân biệt với artifact formatter/log trung gian.

## Sự cố và ranh giới kết luận

Agent khởi động client drain khi browser NSS cũ chưa thoát, khiến tổng **quota cấu hình 2,5 CPU/5 GiB** trong hai khoảng chồng lấn tổng khoảng 18,1 giây. Đây là lỗi điều phối của agent; không phải quota được duyệt và không đo chính xác mức CPU/RAM tiêu thụ thực. Đã dừng tất cả container của lượt. Không khởi động thêm workload Docker sau đó. Log lặp 173.680.568 byte được giữ nguyên bằng gzip lossless kèm SHA/length, không xóa FAIL.

Đã chuẩn bị lock/preflight quota trong runner và drain launcher; NSS bootstrap mới tạo thư mục riêng mỗi lần và timeout certutil. Guard được kiểm unit nhưng chưa kiểm tích hợp Docker. Browser cuối, cookie override HTTPS và edge drain cuối còn thiếu; do đó không tuyên bố full matrix PASS. Header guard đếm field đã decode, không chứng nhận đúng 16 KiB cho mọi biểu diễn byte thô OWS/HPACK.

Môi trường: macOS 14.7, Intel i7-9750H/x64, UID 501; Node hệ thống 22.22.2, core dùng runtime 24.19.0 có sẵn; Docker Linux/amd64 dùng Node 24.19.0, GCC13 và Go1.26.7 đã pin. Không cài công cụ/CA lên host, không sudo, cloud hoặc deploy. Quota đĩa cuối và trạng thái container/port nằm trong manifest; delta free-space là số đo toàn filesystem, không phải riêng workload. Cache/artifact logical sizes không thay số đo wire bytes; chỉ pull lại đúng browser digest trong r4, các build tiếp theo offline. Không vượt trần đĩa 24 GiB theo phép theo dõi đó; sự cố CPU/RAM được ghi riêng, không che bằng số đĩa.

## Điểm tiếp tục

1. Review [ngoại lệ hẹp R05-TIDY-01](../../../proposals/r05-sqlite-transient-tidy-r1.md); patch chỉ thêm comment, chưa áp. Quy tắc pilot yêu cầu Human duyệt ngoại lệ. Không xin tăng quota hoặc cài thêm công cụ.
2. Dùng runner có lock/quota guard; kiểm nó với Docker trước khi tiếp tục. Không restart browser container dùng bootstrap cũ. Tạo client mới chạy `scripts/browser-bootstrap-r4.sh`, kiểm HTTPS/browser đủ 8 nhóm, sau đó edge drain cuối với tên mới. Giữ các trần đã duyệt, đồng hồ 3h của mỗi run và log FAIL.
3. Sau khi áp ngoại lệ được duyệt, kiểm formatter/tidy và hồi quy phù hợp trên nguồn cuối; thu lại hash/log/teardown và review gate. Giữ R05/T03-S03 IN_PROGRESS; Apple Silicon NOT_RUN. Không suy bộ kiểm lab thành 137 ca sản phẩm, backup/host-loss, performance hoặc production.
