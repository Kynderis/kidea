# R02-T10 — kết quả D4 sau native resolver

Ngày 2026-09-15. Human **“Ok nhé”** sau [answer 090290a](https://github.com/Kynderis/kidea/blob/090290a37ec088c9faa530ddebcaa2de12c0046c/answer.md) duyệt [D4](../../proposals/r02-t10-probe-r3.md): 22 lượt mới, 11 S + 11 M, watchdog 30 giây/lượt, không retry/bù hoặc profiler. Không sửa runtime trong lượt này, không gọi AI, đổi máy/quyền, cài công cụ hoặc mở sandbox/pilot.

## Kết luận

**22/22 mẫu đúng output**, không timeout/error/not-run; mọi mẫu khớp nguồn/host và xác nhận tiến trình đã dừng. **Tốc độ quan sát cải thiện rõ so với D2**, trên cùng dữ liệu và máy.

| Bộ | Trung vị D2 (ms) | Trung vị D4 (ms) | Giảm thời gian | Lần đầu D4 (ms) | Lớn nhất D4 (ms) |
|---|---:|---:|---:|---:|---:|
| S — 100 task, 1,88 MiB | 1566.313 | 596.346 | 61,93% | 580.268 | 624.479 |
| M — 1.000 task, 14,54 MiB | 9756.685 | 3095.327 | 68,27% | 3124.589 | 3129.433 |

Tính từ số chưa làm tròn: `(1 - D4 / D2) × 100`; tỷ lệ trung vị D2/D4 lần lượt 2,63× và 3,15×. Hai loạt nối tiếp, không phải A/B xen kẽ; chưa kiểm soát hoàn toàn tải nền/xung CPU và không suy rộng sang mọi máy/project. Không so thời gian D4 với D3 có profiler.

Tất cả mẫu thấp hơn số nháp 2/5 giây, nhưng **chưa phải nghiệm thu tốc độ**: ngưỡng chưa được Human duyệt, watchdog không là chuẩn chất lượng, D4 không thay T10-S04. Khuyến nghị dừng tối ưu thêm ở đây và chuyển sang trình tiêu chí/ngưỡng T10-S03, giữ đề xuất 2/5 giây với yêu cầu mọi mẫu đúng và trong ngưỡng; chưa tự cấp thêm lượt nghiệm thu hoặc AI.

## Nguồn và kiểm thử

- Runtime native tại `090290a37ec088c9faa530ddebcaa2de12c0046c`, giữ nguyên trong D4. `status.mjs` SHA-256 `5ccac5c47977f26ff4cf76aa493bddafe324649acf04a7376b0818408b94de13`; các kiểm tra đường dẫn/byte/final recheck vẫn theo [báo cáo triển khai](r02-t10-native-resolver.md).
- Controller chuyển sang root D4 cố định, kiểm generator/fixture/expected với D2 và bảo toàn cả D1/D2/D3; thêm Node binary vào fingerprint mỗi mẫu, từ chối `NODE_OPTIONS`/coverage. Audit ngoài elapsed. Không đổi generator, dependency hoặc runtime.
- Unit controller/profile **17/17 đạt** trước chuẩn bị; không cộng lại vào tổng hồi quy. **264/264 hồi quy đạt** trên nguồn cố định, tám suite: helper/status/writer/init/approve/resume/probe/profile. Exit 0, không fail/skip/cancel, `inputsUnchanged: true`, suite `144981.1222 ms`; thời lượng suite không phải số đo status. Suite profile kiểm controller, không chạy lượt profile workload mới.
- Khóa **61 file** nguồn/công cụ/chính sách, đối chiếu trước/sau từng mẫu và kiểm lại sau loạt: không sai hash. D1/D2/D3 fingerprint toàn bộ trước/sau chuẩn bị và loạt đo; kiểm độc lập sau hoàn tất: D1 513 file/16 thư mục, D2 513/16, D3 11/1, tổng **1.037 file/33 thư mục**, không mất/thêm/sai hash hoặc đổi cây. `baselineUnchanged: true`.

## Manifest, dữ liệu và điều kiện

Root mới exclusive `.test-output/r02-t10/probe-r3/`. Manifest SHA-256 đã công bố trước mẫu đầu:

`cfd607a62703e3ff00dacf13642c0d121272396def62dca8ae07ea4b5bc965eb`

| Bộ | File / Markdown | Byte | TASK / STEP | Ref có kiểu | DONE / test case | File đọc preflight |
|---|---:|---:|---:|---:|---:|---:|
| QF-S-R02 | 73 / 56 | 1.969.876 | 100 / 10 | 390 | 30 / 2.700 | 73/73 |
| QF-M-R02 | 343 / 326 | 15.249.496 | 1.000 / 10 | 3.570 | 330 / 27.000 | 343/343 |

Từng byte/hash, cây thư mục, stats và expected trùng manifest D2; generator SHA-256 `e5b0a1feb5237cca54209a4f74f5dbcc2c719e0046ae27810c93c3ab20870239` (14.497 byte). Expected S `085f016bc85ed994013d2af172c9ba79928bf97a36855233158dcac474873d3b`; M `1dd1ea0783ae439686d2451298a42e68aaf270523a1642b1c9e79b33e6164d00`. So toàn bộ public output, chỉ bỏ `observedAt`; không đọc Git hoặc thiếu nguồn trong preflight.

Máy như D2: Windows 11 Pro 10.0.26200, i5-11400F 6 nhân/12 luồng, RAM OS nhận 16.610.796 KiB; D: NTFS Fixed/Healthy, Samsung SSD 980 500GB NVMe. Node riêng v24.21.0, binary SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`. Một lượt hợp tác, root ngoài OneDrive cấu hình; không chứng minh cách ly mọi writer/sync ngoài luồng.

Mỗi mẫu tiến trình mới gọi public `kidea.mjs status`, tuần tự 11 S rồi 11 M; wall-clock từ trước spawn đến close sau nhận hết output. Audit/hash/host trước và sau mẫu ghi riêng, không nhập elapsed. Chuẩn bị và hash làm nóng cache OS; mẫu đầu không là cold disk, không xóa cache. Coverage được kiểm trước đo, không là telemetry I/O từng mẫu.

## Đủ 22 số đo

Đơn vị ms, làm tròn ba chữ số. Không bỏ mẫu chậm hoặc gọi p95; tất cả success, stderr rỗng.

| Lượt | S | M |
|---|---:|---:|
| 1 | 580.268 | 3124.589 |
| 2 | 619.086 | 3129.433 |
| 3 | 566.660 | 3128.714 |
| 4 | 574.707 | 3046.841 |
| 5 | 617.815 | 3114.227 |
| 6 | 590.412 | 3095.327 |
| 7 | 605.458 | 3084.075 |
| 8 | 624.479 | 3023.245 |
| 9 | 596.346 | 3119.207 |
| 10 | 572.594 | 3057.385 |
| 11 | 620.356 | 3093.239 |

## Bằng chứng local

- `preparation-start.json`: `2026-09-15T03:45:31.206Z`. `checks.stdout.txt` SHA-256 `8ca4c4c69f789d9c8ee7645877238baf53f3f32346fbe46040097521ec95b1c9`; stderr rỗng. `checks.result.json` SHA-256 `d758d07033c39e57e7369d3dec7d5561105ff5e20f8defb848d63f11961ee7bf`.
- Giữ manifest, hai expected JSON, run-start và đủ 22 `.started.json` cùng stdout/stderr/result. Lệnh Node riêng: `tests/r02-t10/probe.mjs prepare`, sau đó `run cfd607a62703e3ff00dacf13642c0d121272396def62dca8ae07ea4b5bc965eb`, mỗi lệnh một lần. Không gọi lại controller sau hoàn tất.
- `summary.json`: `2026-09-15T03:53:52.863Z`, SHA-256 `f6d8e0a7ace1872ea43b6e5aafdec3ce2f906e4cce01f33c2eba61f1fa08101c`; attempted 22, notRun 0, stopReason null, baselineUnchanged true. Kiểm độc lập đủ 22 starts, mọi row `success/outputValid/sourcesMatch/hostMatches/confirmedStopped` true.

D4 hết 22/22 lượt. T10-S01/S02 còn phần AI DRAFT, T07 cũ 0/3 và vấn đề launcher chưa khép. Ngưỡng T10-S03, nghiệm thu T10-S04 và Human review T11 vẫn mở; không khép R02 hoặc mở R03/pilot.
