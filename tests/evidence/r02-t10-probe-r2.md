# R02-T10 — kết quả D2 sau tối ưu status

Ngày 2026-09-15. Human **“Ok làm đi”** sau [answer 3e142f7](https://github.com/Kynderis/kidea/blob/3e142f7548bbb9f0bab08975f82e11a13e6a7f87/answer.md) duyệt [D2](../../proposals/r02-t10-probe-r2.md): 22 lượt mới, cùng workload/Node/máy/cách đo D1, không chạy bù. Không thêm tối ưu runtime, ngưỡng nghiệm thu, AI, sandbox, ACL hoặc cài công cụ.

## Kết luận

**22/22 mẫu đúng output**, 0 timeout/error/not-run, không có lý do dừng; nguồn và host khớp trước/sau từng mẫu. **Chưa thấy cải thiện tốc độ tổng thể** so với [D1](r02-t10-probe.md).

| Bộ | Trung vị D1 (ms) | Trung vị D2 (ms) | Chênh lệch trung vị | Lớn nhất D2 (ms) |
|---|---:|---:|---:|---:|
| S — 100 task, 1,88 MiB | 1566.105 | 1566.313 | +0,01% | 1618.172 |
| M — 1.000 task, 14,54 MiB | 9610.520 | 9756.685 | +1,52% | 9858.891 |

Tỷ lệ tính từ số chưa làm tròn: `(trung vị D2 / trung vị D1 - 1) × 100`. Đây là chênh lệch quan sát giữa hai loạt nối tiếp, **không chứng minh patch gây tăng 1,52%**: không chạy xen kẽ A/B, không kiểm soát hoàn toàn tải nền/xung CPU, chưa profiling. Không gọi tối ưu thành công về tốc độ chỉ vì test chức năng đạt. Ngân sách 2/5 giây vẫn là nháp; watchdog 30 giây không phải chuẩn chất lượng và D2 không phải nghiệm thu T10-S04.

**Khuyến nghị:** phân rã chi phí đọc/kiểm đường dẫn, hash/anchor và parse bằng một lượt chẩn đoán riêng trước khi tối ưu tiếp. Chưa xác định thành phần chi phối, chưa chạy profiling, sửa thêm hoặc tự cấp lượt đo mới. Không đổi ngưỡng để lấy đạt.

## Nguồn và kiểm thử

- Runtime tối ưu tại `3e142f7548bbb9f0bab08975f82e11a13e6a7f87`; không sửa `.agents/skills/kidea` trong D2. `status.mjs` SHA-256: `7a19624105026812ad7c3c219a2e71c40fc65149ab1e271984e1b5cd7ad2d069`. Nền commit không thay manifest hash của byte thực được đo.
- Generator không đổi so với D1, SHA-256 `e5b0a1feb5237cca54209a4f74f5dbcc2c719e0046ae27810c93c3ab20870239`, 14.497 byte. Controller chỉ phục vụ root D2 cố định, kiểm workload/expected với D1 và bảo toàn evidence cũ; không thêm dependency.
- Hai test bổ sung kiểm guard từ chối stats/file/hash/expected khác baseline và root cố định `probe-r2`. Unit bộ đo 11/11 đạt trước chuẩn bị; không cộng lần unit này vào tổng hồi quy.
- **252/252 hồi quy đạt** trên nguồn cố định: 241 ca helper/status/writer/init/approve/resume và 11 ca bộ đo. Exit 0, 0 fail/skip/cancel; `inputsUnchanged: true`, thời lượng suite `201552.1651 ms`. Thời gian chạy suite không dùng làm số đo status.
- 54 file nguồn/công cụ/chính sách được khóa và kiểm mỗi mẫu, gồm manifest/summary D1. Toàn bộ 513 file và 16 thư mục evidence D1 được fingerprint trước chuẩn bị, đối chiếu sau chuẩn bị, trước và sau loạt D2: `baselineUnchanged: true`. Không xóa hoặc sửa file D1; không tạo mẫu bù. Sau loạt đo, kiểm lại hash 54 file vẫn khớp.

## Manifest, dữ liệu và điều kiện

Run root: `.test-output/r02-t10/probe-r2/`, tạo exclusive. Manifest được công bố trước mẫu đo đầu, SHA-256:

`bbe5bae6df558b4f75ea29a1a254182815e2c3d01cc21a000f229a803629f40d`

| Bộ | File / Markdown | Byte | TASK / STEP | Ref có kiểu | File đọc trong preflight |
|---|---:|---:|---:|---:|---:|
| QF-S-R02 | 73 / 56 | 1.969.876 | 100 / 10 | 390 | 73/73 |
| QF-M-R02 | 343 / 326 | 15.249.496 | 1.000 / 10 | 3.570 | 343/343 |

Từng file/hash/byte, cây thư mục, stats và expected output trùng D1; không chỉ khớp tải tối thiểu. Nội dung ngữ nghĩa/vùng dữ liệu giữ như [D1](r02-t10-probe.md#manifest-và-workload-thực). Preflight không đọc Git và không thiếu nguồn. Mỗi mẫu so toàn bộ public output, chỉ bỏ `observedAt` khi so với expected như D1.

Máy khớp manifest D1: Windows 11 Pro 10.0.26200, i5-11400F 6 nhân/12 luồng, RAM OS nhận 16.610.796 KiB; D: NTFS Fixed/Healthy, Samsung SSD 980 500GB NVMe. Node riêng v24.21.0, SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`. Không đổi quyền/config/launcher. Root ngoài OneDrive được cấu hình, một lượt hợp tác; không phải bảo đảm cách ly với mọi chương trình ngoài luồng.

Mỗi mẫu là tiến trình mới gọi public `kidea.mjs status`, đo từ trước spawn tới close sau nhận hết output. Precheck/postcheck nguồn/host/log ghi riêng, không nhập vào elapsed. Chuẩn bị và đọc hash làm nóng cache OS; mẫu đầu không phải cold disk. Inventory file đọc được xác nhận trước đo, không phải telemetry I/O của từng mẫu. Không gọi AI hoặc Git trong fixture.

## Đủ 22 số đo

Đơn vị ms, làm tròn ba chữ số; tất cả mẫu success, không timeout. S chạy đủ trước M, không xen kẽ với D1.

| Lượt | S | M |
|---|---:|---:|
| 1 | 1549.561 | 9814.206 |
| 2 | 1568.417 | 9858.891 |
| 3 | 1571.135 | 9735.432 |
| 4 | 1568.481 | 9698.897 |
| 5 | 1543.036 | 9798.479 |
| 6 | 1566.313 | 9833.323 |
| 7 | 1556.112 | 9756.685 |
| 8 | 1573.335 | 9475.400 |
| 9 | 1563.272 | 9700.106 |
| 10 | 1618.172 | 9839.123 |
| 11 | 1548.702 | 9742.128 |

## Bằng chứng local

- `preparation-start.json` từ `2026-09-15T02:49:51.292Z`; `checks.stdout.txt`, `checks.stderr.txt`, `checks.result.json` giữ hồi quy đầy đủ. Stdout SHA-256 `bce41e9b22806fa563107ac4f6540b16d4c3a0db4db6a845856fee137470482a`, stderr rỗng; checks.result SHA-256 `39d9790a2d8afe15430657dbdf4bbd64bc6a8b6e41ccc6717d21126b12324ccc`.
- `manifest.json`, hai expected JSON, `run-start.json`, đủ 22 `.started.json` và bộ stdout/stderr/result tương ứng. Lệnh Node riêng: `tests/r02-t10/probe.mjs prepare`, rồi `run bbe5bae6df558b4f75ea29a1a254182815e2c3d01cc21a000f229a803629f40d`. Không gọi lại controller sau hoàn tất.
- `summary.json` tạo `2026-09-15T03:00:36.639Z`, SHA-256 `f9fde4d6089e7cc8fd51a7f20924054d9e4f5925cc7473dd29a6e7b3af422986`. Tất cả row có `outputValid`, `sourcesMatch`, `hostMatches`, `confirmedStopped` đúng; đủ 22 mẫu đã bắt đầu, `notRun: 0`, `stopReason: null`, `baselineUnchanged: true`.

D2 hết 22/22 lượt. T10-S01/S02 còn phần AI chưa chạy; T10-S03 ngưỡng, T10-S04 nghiệm thu và T11 Human review vẫn mở. Không khép R02 hoặc mở R03/pilot từ các kết quả xác định này.
