# R02-T10-S04 — nghiệm thu status local r1

Ngày 2026-09-15. **PASS — chỉ phần status local trên fixture/máy tham chiếu.** Human “Duyệt” sau [answer 85866d9](https://github.com/Kynderis/kidea/blob/85866d92de0a05c257818fc1114f46f87ccf896f/answer.md) chốt [tiêu chí và 22 lượt mới](../../proposals/r02-t10-status-acceptance-r1.md) trước chạy. Đây là loạt riêng, không chuyển kết quả thăm dò D4 thành nghiệm thu.

## Kết quả theo tiêu chí đã duyệt

| Bộ | Ngưỡng mỗi mẫu (ms) | Số đạt | Lần đầu (ms) | Trung vị (ms) | Lớn nhất (ms) |
|---|---:|---:|---:|---:|---:|
| QF-S-R02 | ≤ 2000 | 11/11 | 659.027 | 616.614 | 659.027 |
| QF-M-R02 | ≤ 5000 | 11/11 | 3158.639 | 3115.577 | 3173.651 |

Đủ **22/22 output đúng**, exit 0, stderr rỗng, mọi mẫu trong ngưỡng và xác nhận tiến trình đã dừng. Không timeout/error/not-run hoặc lý do dừng; không bỏ mẫu chậm/retry/bù. Verdict controller và kiểm tra độc lập đều đạt. Hồi quy **265/265** đạt, nguồn/fixture/host và bằng chứng cũ không đổi. Không dùng trung vị thay điều kiện từng mẫu.

Không ngoại suy sang mọi máy/project, cold disk, AI, mạng, Git, build, sinh HTML hoặc pilot. T10-S01/S02 còn AI DRAFT; T10-S04 chỉ hoàn tất lát cắt status, không DONE toàn task/R02. T07 cũ 0/3 và sự cố launcher chưa khép; T11 Human review vẫn cần thiết. Quota nghiệm thu này đã hết 22/22, không tự mở loạt mới.

## Bản cố định và phương pháp

- Root CREATE exclusive `.test-output/r02-t10/acceptance-r1/`, trước chuẩn bị chưa tồn tại. Manifest SHA-256 công bố trước mẫu đầu: `c27f35c286c79e953e14637fa8d353f87d3667e467a725c3ae6c86f2f8bb324a`.
- Runtime và generator giữ nguyên D4; kiểm toàn bộ file `.agents/skills/kidea` với manifest D4 trước tạo root. `status.mjs` SHA-256 `5ccac5c47977f26ff4cf76aa493bddafe324649acf04a7376b0818408b94de13`. Không tối ưu thêm hoặc đổi dependency. Controller/test cập nhật root, bảo toàn D1–D4, khóa ngưỡng và tính verdict; QUALITY chốt đúng phạm vi approval trước khóa nguồn.
- Khóa **63 file** nguồn/công cụ/chính sách, gồm binary Node và manifest/summary D1–D4. Kiểm trước/sau từng mẫu và độc lập sau hoàn tất: 0 sai hash. Hồi quy trước manifest gồm tám suite helper/status/writer/init/approve/resume/probe/profile, **265/265**, 0 fail/skip/cancel, `inputsUnchanged: true`, `144282.0875 ms`; thời lượng suite không là benchmark. Unit 18/18 trước chuẩn bị không cộng lần nữa vào tổng. Test mới từ chối vượt ngưỡng, sai output, thiếu/trùng lượt, thời gian không hợp lệ, không xác nhận dừng, nguồn cũ đổi và stopReason.
- Generator SHA-256 `e5b0a1feb5237cca54209a4f74f5dbcc2c719e0046ae27810c93c3ab20870239`. S: 73 file/56 Markdown, 1.969.876 byte, 100 task, 10 step, 390 ref, 30 DONE, 2.700 case. M: 343 file/326 Markdown, 15.249.496 byte, 1.000 task, 10 step, 3.570 ref, 330 DONE, 27.000 case. Từng byte/cây/stats/expected trùng D4; preflight đọc đủ 73/73 và 343/343, không Git hoặc thiếu nguồn.
- Máy khớp D4: Windows 11 Pro 10.0.26200, i5-11400F 6 nhân/12 luồng, RAM OS 16.610.796 KiB, D: NTFS Fixed/Healthy, Samsung SSD 980 500GB NVMe. Node riêng 24.21.0, binary SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`. Không thay quyền/config/cài công cụ; một lượt hợp tác, ngoài OneDrive cấu hình, không bảo đảm chống mọi writer/sync ngoài luồng.
- 11 S rồi 11 M tuần tự, mỗi mẫu tiến trình mới public `kidea.mjs status`, watchdog 30 giây. Wall-clock từ trước spawn tới close sau output, gồm đọc/kiểm hồ sơ và tài liệu sản phẩm; audit/hash/host ngoài elapsed, ghi riêng. Không profiler/cờ bổ sung/AI. Preflight/hash làm nóng cache OS; không xóa cache, mẫu đầu không là cold disk. So toàn bộ output chỉ bỏ `observedAt`; coverage preflight không là telemetry I/O từng mẫu.

## Toàn bộ 22 số đo

Đơn vị ms, làm tròn ba chữ số. Không loại outlier hoặc gọi p95.

| Lượt | S | M |
|---|---:|---:|
| 1 | 659.027 | 3158.639 |
| 2 | 598.472 | 3102.728 |
| 3 | 629.809 | 3140.618 |
| 4 | 567.725 | 3173.651 |
| 5 | 616.614 | 3044.527 |
| 6 | 646.579 | 3097.104 |
| 7 | 610.227 | 3069.304 |
| 8 | 641.046 | 3119.647 |
| 9 | 607.117 | 3115.577 |
| 10 | 647.356 | 3129.965 |
| 11 | 586.559 | 3109.646 |

## Bằng chứng và bảo toàn

- `checks.stdout.txt` SHA-256 `312e3756837bea485cb63d71987a68cef2b4bc3bcd7e4b2853dbc8138c432238`; stderr rỗng. `checks.result.json` SHA-256 `3552758526ce1f5fa044123d443dba224c933b213514ea4a59f23e58a5826ca4`, lúc `2026-09-15T04:07:44.614Z`.
- `summary.json` lúc `2026-09-15T04:13:45.682Z`, SHA-256 `fe551562c8bec97b6d54888631636d7b9634616550c7befd943c3367a8cf9f74`. `acceptance.accepted: true`, hai nhóm withinThreshold 11, overThreshold 0, baselineUnchanged true, notRun 0, stopReason null.
- Giữ đủ 22 starts/stdout/stderr/result, manifest và expected riêng; controller prepare và run mỗi lệnh một lần. Không gọi lại sau hoàn tất. Kiểm độc lập 22 starts và mọi row success/outputValid/sourcesMatch/hostMatches/confirmedStopped true, từng elapsed trong ngưỡng.
- Fingerprint D1/D2/D3/D4 trước/sau chuẩn bị và loạt đo; kiểm độc lập sau loạt: D1 513 file/16 thư mục, D2 513/16, D3 11/1, D4 513/16. Tổng **1.550 file/49 thư mục**, không thêm/mất/sai hash hoặc đổi danh sách thư mục. Raw evidence vẫn local; báo cáo được commit, không đưa toàn bộ fixture/log vào Git.
