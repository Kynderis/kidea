# R08 — kiểm cuối local

2026-09-17. **LOCAL_PASS_SCOPED** trên nguồn ứng dụng/artifact B1 giữ nguyên; cloud có báo cáo riêng và không suy nghiệm thu Human từ test PASS. Baseline repo `f51af4f7b4a3549bddd9a0e77d5cd9062200664a`, master/Kynderis/kidea. Nguồn lab mới được khóa riêng theo manifest B2/cloud.

| Bộ kiểm cuối | Kết quả thực |
|---|---|
| Lõi Kidea, Node24.19.0 / macOS14.7 Intel |283/283 PASS,0fail/skip;111.859giây; inputsUnchanged |
| Bốn binary C++ B1: dev/ASan+UBSan/TSan/release |12ca mỗi preset,48/48 PASS với sanitizer halt-on-error |
| Toàn bộ file Web unit/server |32unit+4server PASS; drain30giây giữ nguyên |
| Chromium từ ma trận B1 |18/18 PASS, workers1/retries0/forbid-only |
| Sáu mutation theo script/oracle R05 đã khóa |6/6 DETECTED: dangling capture, early ACK, queue race, lost reference hook, thiếu Origin, thiếu CSRF token |
| Guard source/artifact/manifest/target hiện hành |14/14 PASS |
| B2 tích hợp |Hai target đạt đầy đủ [báo cáo riêng](b2-execution-r1.md) |

[Core raw](final-r1/core-raw/summary.json), [C++/Web](final-r1/prebuilt-2.stdout.txt), [Chromium](final-r1/browser-2.stdout.txt), [mutation](final-r1/mutations-2.stdout.txt), [diagnostic từng mutant](final-r1/mutation-output/mutations-eight-final/), [guards](final-r1/guards.stdout.txt). [Driver prebuilt](../../r08/final-prebuilt.mjs) lấy danh sách12ca từ CMake nguồn, chạy mọi file unit/server. Không build lại ứng dụng hoặc dùng lại ngoại lệ clang-tidy đã hết hiệu lực; mutation compile bản sao âm riêng để chứng minh oracle, nguồn gốc mount readonly.

## FAIL và sửa harness

- Lượt prebuilt đầu đạt C++48/unit32 rồi server gặp EROFS vì ghi báo cáo vào `/work/test-results`. Giữ [stdout](final-r1/prebuilt.stdout.txt)/[stderr](final-r1/prebuilt.stderr.txt); mount riêng outputdir ghi được, nguồn/build/dependency vẫn readonly, chạy lại toàn bộ driver PASS.
- Chromium đầu16PASS/2FAIL vì screenshot/report cũng cần outputdir; giữ [stdout](final-r1/browser.stdout.txt)/[stderr](final-r1/browser.stderr.txt). Cùng sửa mount log riêng, chạy lại đủ18ca, không đổi assertion/retry.
- Mutation đầu bị guard từ chối runId `r08-final` do regex gốc chỉ nhận chữ và dấu gạch; chưa compile/chạy mutant. Dùng `eight-final` đúng giao thức rồi chạy đầy đủ6ca. Giữ [FAIL](final-r1/mutations.stderr.txt), không sửa regex/oracle.

## Bảo toàn và giới hạn

[Audit cuối chỉ đọc](final-r1/preservation-final.json) đối chiếu2.245file bằng chứng R05,4.088payload R07,21docs live pilot,1.051file source B1,109file Web build và5.252entry dependency: khớp. Backend/Caddy đúng SHA đã khóa; mọi container R08 local ở trạng thái dừng. Pilot chưa có `.kidea`, không sửa source ứng dụng/pilot, không chạy AI/benchmark lịch sử. [Môi trường](final-r1/environment.json); không cài hoặc đổi công cụ macOS.

Các sửa sau lượt local chỉ thuộc packaging/runner cloud (zone, cách nhận diện cùng image, volume COS), không đổi đầu vào core/B1/B2 local. Ma trận cloud phải chạy lại từ đầu trên manifest cuối, kèm HTTPS Web/API và process readback riêng ở VM gốc/phục hồi. Không suy lượt local đã kiểm mọi môi trường cloud, hoặc dùng lỗi harness làm lý do sửa kỳ vọng sản phẩm. Review cuối phải đối chiếu lại hash43file core và manifest B2/cloud.

Đây là test finite lab và regression, không gọi bộ này là137case ứng dụng thật, chứng nhận performance/production, hoặc kiểm Apple Silicon. R09 pilot thật và R09-T14 vẫn NOT_RUN; Android/iOS Future chưa roadmap. R08 chỉ có thể DONE sau review tổng hợp và Human nghiệm thu.

Kiểm whitespace source/docs đạt. Lệnh kiểm toàn staged diff báo một trailing space do định dạng nguyên bản AddressSanitizer tại dòng77 của stderr mutant; [giữ cả kết quả kiểm](final-r1/git-whitespace-check.json), không sửa raw diagnostic hoặc thay policy Git để giấu. Đây không phải test sản phẩm bị bỏ hoặc đổi oracle.
