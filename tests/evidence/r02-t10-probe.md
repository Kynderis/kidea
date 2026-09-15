# R02-T10 — đo thăm dò status theo D1

Ngày 2026-09-15. Human **“Duyệt nhé”** sau answer `8aad5d2297195400a2cc3421af5654185e2531b3` duyệt [D1](../../proposals/r02-t10-core-trial-r1.md): chuẩn bị fixture/runner và 22 mẫu thăm dò, không duyệt ngưỡng, AI trial, launcher/sandbox, ACL hoặc sửa runtime.

## Nguồn và phạm vi kiểm chứng

- Runtime/schema/skill không sửa; nền runtime `5611f86c5dcbf36e533c16d96260a007b9c6930f`. Generator/runner/test mới ở `tests/r02-t10/`; không dependency mới. Node riêng `v24.21.0`, SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`.
- Hồi quy trước manifest: **243/243 PASS**, 0 fail/skipped/cancelled, `196660.1412 ms`, exit 0; 52 file nguồn/công cụ/chính sách theo dõi không đổi. Gồm 234 ca hiện hành và 9 ca mới; không cộng lượt unit chạy riêng trước đó.
- Ca mới kiểm workload/coverage, byte sinh xác định, expected status đầy đủ, thiếu docs/nguồn review đổi, thống kê không loại timeout/error, watchdog chờ tiến trình con dừng, output vượt giới hạn và từ chối reset. Dữ liệu được kiểm đúng cấu trúc/bất biến; không phải AI chứng minh ngữ nghĩa hoặc sản phẩm thật được duyệt.
- Thử in-memory đầu tiên gặp khác prototype object giữa parser và expected object JS; đã chuẩn hóa qua JSON tại bộ so sánh đầu ra, đúng định dạng public CLI. Không sửa parser/runtime hoặc bỏ field khỏi expected. Đây là sửa harness trước tạo fixture/manifest và trước mẫu đo; không tiêu thụ hoặc chạy bù mẫu benchmark.

## Manifest và workload thực

Run root local: `.test-output/r02-t10/probe-r1/`. Manifest được tạo exclusive sau hồi quy và preflight, trước mẫu đo đầu. SHA-256:

`c812d4fdb8cc06c2f6da2dc93e544a8f42c2169322f83d29bf1035e9b71d1fae`

| Bộ | Tổng file | Markdown | Byte đầu vào | TASK | STEP | Tham chiếu có kiểu | Task có nhãn DONE |
|---|---:|---:|---:|---:|---:|---:|---:|
| QF-S-R02 | 73 | 56 | 1.969.876 | 100 | 10 | 390 | 30 |
| QF-M-R02 | 343 | 326 | 15.249.496 | 1.000 | 10 | 3.570 | 330 |

Các mức đã duyệt là **tối thiểu**, không phải đúng 30/300 file hay đúng 1/10 MiB. Tải thực tương ứng khoảng 1,88/14,54 MiB. Mỗi bộ có 10 plan, 10 review với các nhãn APPROVED/IN_REVIEW/DRAFT, lịch sử review/snapshot, một checkpoint giả, blocker và returnStack hai cấp. Tên task dài 200 ký tự; Unicode có trong nội dung và đường dẫn. DONE là dữ kiện giả kèm resultRef, không là xác nhận tiến độ thật.

| Vùng dữ liệu | S: file / byte | M: file / byte |
|---|---:|---:|
| Docs sản phẩm | 32 / 1.379.191 | 302 / 13.795.991 |
| Hồ sơ điều phối | 22 / 125.777 | 22 / 988.396 |
| Bằng chứng review | 16 / 461.753 | 16 / 461.954 |
| Checkpoint và bản trước/dự định | 3 / 3.155 | 3 / 3.155 |

Tham chiếu đếm theo item + vai trò + đích; không cộng parent/STEP vào TASK, không gọi ref là mapping nghiệp vụ đã được kiểm chứng. S: scope/input/completion mỗi loại 110, dependency 20, gate 10, result 30. M: mỗi loại đầu 1.010, dependency 200, gate 10, result 330. Mọi đích/anchor được validator đối chiếu.

Docs gồm 30/300 sân tổng hợp, mỗi sân 90 tình huống tham số hóa với input và expected cụ thể về số chỗ, cutoff hủy, quyền, giao thời gian, số tiền và chống lặp giao dịch. Không dùng file trống hoặc file không tham gia graph để tăng dung lượng. Preflight bằng `inspectStatusGraph` của runtime không sửa đã xác nhận **đọc đủ 73/73 và 343/343 file**; manifest giữ từng đường dẫn/hash/byte. Đây là inventory file duy nhất đọc trong preflight, **không phải trace I/O hệ điều hành của từng mẫu đo**. 22 mẫu dùng cùng public status, fixture và nguồn cố định, so toàn bộ expected output.

## Máy và cách đo

- Windows 11 Pro `10.0.26200`, Intel Core i5-11400F, 6 nhân/12 luồng; OS nhận 16.610.796 KiB RAM. Ổ D: NTFS, Fixed/Healthy, Samsung SSD 980 500GB, NVMe/SSD.
- Root mới tạo riêng, không link/reparse, nằm ngoài root OneDrive được cấu hình. Đây là quan sát và điều kiện một lượt hợp tác đã duyệt, không chứng minh không tồn tại mọi chương trình sync/editor bên thứ ba. Không đổi ACL/config/VM/launcher; raw host metadata chỉ giữ local, không push SID/credential.
- Mỗi mẫu là tiến trình Node mới gọi `kidea.mjs status` với cwd của fixture. Wall-clock từ trước spawn đến close sau khi nhận hết stdout/stderr; gồm startup, đọc/kiểm tra toàn graph cần thiết và tạo dữ liệu output. Không gọi AI, mạng, build sản phẩm hoặc Git trong fixture.
- Chuẩn bị và hash precheck đọc dữ liệu, làm nóng cache hệ điều hành; không ép xóa cache. “Mẫu đầu” là mẫu đo đầu, không phải cold disk. Kiểm tra hash/host và ghi log hậu kỳ được đo riêng bằng precheckMs/postcheckMs, không nhập vào elapsedMs của public status.
- 11 mẫu/bộ, tổng 22, tuần tự. Watchdog 30 giây chỉ là chốt dừng, không là ngưỡng nghiệm thu. Không chạy bù, không bỏ mẫu chậm và không đổi máy. Runner đòi hash manifest đã trình và `run-start.json` tạo exclusive; không có reset/retry/recovery mode.
- Giữ stdout/stderr/result và dấu started từng mẫu, đối chiếu đầy đủ output/nguồn/host. Chỉ mở mẫu tiếp theo sau khi tiến trình cũ đã dừng; sai nguồn/host/expected thì dừng cả loạt. Những kiểm tra này không phải chứng nhận an toàn toàn máy hay ổn định mọi tải.

## Kết quả đo

**22/22 mẫu có output đúng**, exit 0; 0 timeout/error/NOT_RUN. Tất cả mẫu xác nhận nguồn/fixture và host khớp manifest trước–sau; không chạy bù. Đây là loạt thăm dò, **không phải PASS ngưỡng tốc độ**.

| Bộ | Mẫu đầu (s) | Trung vị (s) | Lớn nhất (s) |
|---|---:|---:|---:|
| QF-S-R02 | 1,566105 | 1,566105 | 1,593701 |
| QF-M-R02 | 9,701764 | 9,610520 | 9,741697 |

Toàn bộ 11 mẫu mỗi bộ, đơn vị ms (làm tròn 3 chữ số; raw JSON giữ số gốc):

| Mẫu | QF-S-R02 | QF-M-R02 |
|---|---:|---:|
| 1 | 1566.105 | 9701.764 |
| 2 | 1553.653 | 9569.699 |
| 3 | 1571.428 | 9550.635 |
| 4 | 1545.698 | 9610.520 |
| 5 | 1577.667 | 9646.576 |
| 6 | 1568.678 | 9683.183 |
| 7 | 1538.262 | 9594.384 |
| 8 | 1589.668 | 9580.988 |
| 9 | 1558.805 | 9663.009 |
| 10 | 1532.224 | 9589.435 |
| 11 | 1593.701 | 9741.697 |

`summary.json` SHA-256: `0b086738c801241c582cf776675cad9f3bc14a70c85a411c0bd43c5274e0f82a`.

### Diễn giải và khuyến nghị

Bộ vừa mất khoảng 9,6 giây trên máy/corpus này, đáng lưu ý cho thao tác tương tác. So với **ngân sách nháp chưa duyệt** 2/5 giây, bộ nhỏ nằm dưới 2 giây và bộ vừa vượt 5 giây; không được gọi đây là thất bại chuẩn đã duyệt hoặc tự đổi chuẩn lên 10 giây. Workload thực lớn hơn mức tối thiểu và cache đã nóng; không ngoại suy mọi project/máy hoặc cold-start.

Rà tĩnh thấy `status.mjs` đọc/kiểm đường dẫn và byte lại tại mỗi tham chiếu (`bytes`), quét lại anchor (`snapshotAnchorCount`), và tìm con bằng lọc toàn tập item. Đây là các ứng viên cần phân tích/tối ưu, **chưa profiling nên chưa chứng minh tỷ trọng hoặc nguyên nhân chi phối**. Đề xuất tối ưu trong phạm vi một lượt đọc, giữ chốt thay đổi nguồn/path và kiểm tra cuối; phải có quyền sửa runtime, đánh giá ảnh hưởng, hồi quy G2 và loạt đo mới được cấp. D1 hiện tại không cho sửa runtime, không mở quota đo lại và chưa cấp ngưỡng T10-S03; không thực hiện các việc đó trong lượt này.

## Bằng chứng local và tái lập

- `checks.stdout.txt`, `checks.stderr.txt`, `checks.result.json`: hồi quy 243 ca; stdout SHA-256 `45822b4c30efd92d708fd32a03d966598a70e28600b9601a1bd1aa6be01f9b51`, stderr rỗng.
- `preparation-start.json`, `manifest.json`, `QF-*.expected.json`: quyền/host/source trước chuẩn bị, danh sách file/hash, expected tính từ generator độc lập với output status.
- `QF-*-NN.started.json`, `.stdout.txt`, `.stderr.txt`, `.result.json`: từng mẫu thực tế; `summary.json` chỉ được tạo khi controller kết thúc loạt hoặc dừng có lý do.
- Lệnh đã dùng: Node riêng chạy `tests/r02-t10/probe.mjs prepare`, sau đó `run <hash-manifest-đã-trình>`. Không chạy lại trên root đã có. Muốn đo lại phải có phạm vi/lượt mới được cấp; không xóa marker/log hoặc tự chọn tên root mới.

Báo cáo này không đóng toàn T10-S01/S02 hoặc R02: manifest/quyền/quota AI vẫn chưa đủ. Ngưỡng status tại T10-S03 và loạt nghiệm thu mới T10-S04 cần gate riêng; T11 còn review tích hợp/Human trước mở R03.
