# R02-T10 — tối ưu CPU trong status, chưa đo lại

Ngày 2026-09-15. Human **“Ok làm nhé”** sau [khuyến nghị tại 620cd71](https://github.com/Kynderis/kidea/blob/620cd716fc087a84aaecb5c54332f11b35bead15/answer.md) cho triển khai tối ưu `status` và kiểm thử hồi quy. Không suy thành ngân sách đo mới, ngưỡng nghiệm thu hoặc quyền AI/sandbox/ACL. Giữ nguyên toàn bộ dữ liệu và evidence D1.

## Thay đổi và ảnh hưởng

- Trong một lần gọi engine, lập bảng số lượng anchor theo byte vừa đọc. Tái sử dụng chỉ khi cùng đường nguồn **và byte bằng nhau hoàn toàn** (`Buffer.equals`), không dựa riêng vào path, mtime hoặc hash. Bản lịch sử và hiện hành khác byte phải quét lại. Giữ một bản byte độc lập cho mỗi đường nguồn; cache được bỏ khi lượt gọi kết thúc, đổi lại có thêm bộ nhớ cho byte và bảng anchor.
- Tra sự tồn tại của item con bằng `Set` lập một lần thay cho lọc toàn bộ item với từng item: riêng bước này từ O(n²) thành O(n). Không thay traversal cha/dependency, rule cấu trúc hoặc thứ tự diagnostic.
- Giữ nguyên `bytes`, kiểm từng thành phần đường dẫn/junction, đọc lại mỗi tham chiếu, SHA-256, so nguồn hiện hành, kiểm cuối file/Git/pending và public output. Không thêm dependency, ghi cache ra đĩa hoặc cơ chế bỏ qua nguồn. Caller writer/init/review/resume dùng cùng engine nên được hồi quy chung.
- Đây là tối ưu hai phần tính toán xác định từ rà code; chưa xác định tỷ trọng CPU/I/O bằng profiling. Không khẳng định giải quyết toàn bộ thời gian 9,61 giây của D1.

## Kiểm chứng

Bảy test mới: đếm anchor chính xác/case/Unicode/tên giống thuộc tính prototype; dùng chung một lần decode nhưng vẫn đọc từng ref và không giữ cache qua lượt; ba biến thể byte cùng đường dẫn đổi thành anchor trùng/thiếu/UTF-8 lỗi; bản lịch sử khác byte không dùng verdict của bản hiện hành; leaf có con và ID cha trùng vẫn bị chặn. Test decode đếm số lần thực, không dùng ngưỡng thời gian hoặc số đo benchmark.

Lượt targeted đầu: 6/7 đạt; một fixture mới dùng nhầm enum `PENDING`, bị schema chặn trước khi tới kiểm parent. Đổi fixture thành `TODO` theo schema hiện hành, không đổi validator/runtime để làm test đạt. Targeted sau sửa: 7/7 đạt, không skip.

Hồi quy nguồn cố định **241/241 đạt**, không fail/skip/cancel, exit 0, `inputsUnchanged: true`. Bao gồm helper, status (85 ca), writer hợp tác, init, approve và resume; 7 test mới đã nằm trong 241, không cộng lại lượt targeted. Chạy Node riêng v24.21.0 bằng `tests/r02-t07/run-tests.mjs`; SHA-256 runtime `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`.

- Log local: `.test-output/r02-t07/regression-AoAvfZ/`, bắt đầu `2026-09-15T02:26:50.855Z`; `stdout.txt`, `stderr.txt`, `before.json`, `summary.json` giữ nguyên.
- `stdout.txt` SHA-256: `cbe378b24eff72cb7cc2f9a75fea44ace1213466ef289600e6797c73fd1bcb75`; stderr rỗng.
- `summary.json` SHA-256: `a838bed5e152fac74596492e6655bfc5e45e8aa6769fb2ffa696bc8fb487b66e`.
- Chạy riêng `node --test tests/r02-t10/probe.test.mjs`: **9/9 đạt**, không fail/skip/cancel. Hai workload S/M khớp toàn bộ public output mong đợi và đọc đủ file khi kiểm graph in-memory. Đây là unit/regression, không gọi controller `prepare/run` và không lấy thời gian test làm benchmark.
- Tổng hai lệnh: **250/250 ca riêng biệt đạt**. Đối chiếu lại hash nguồn sau cả hai lệnh vẫn trùng full regression. `git diff --check` đạt. Không đổi skill interface/schema hoặc tài liệu hướng dẫn sử dụng.

## Việc còn mở

Loạt D1 đã dùng đủ 22/22 lượt; không gọi lại controller, không xóa/ghi đè manifest/log hoặc tự chọn run root mới. Số 1,57/9,61 giây là **baseline trước tối ưu**, không phải số của bản này. Cần duyệt loạt đo lại riêng trước khi kết luận mức cải thiện; ngưỡng T10-S03, nghiệm thu T10-S04, AI và khép R02 vẫn chưa được cấp/hoàn tất.

### D2 — đề xuất đo lại, chưa duyệt

Cho chuẩn bị và chạy **22 lượt mới (11 mỗi bộ), watchdog 30 giây/lượt, không retry/bù**, cùng máy/Node, workload, expected output và cách đo D1. Được sửa controller để hỗ trợ đúng lượt r2 và kiểm thử nó; chỉ CREATE fixture/manifest/log mới dưới `.test-output/r02-t10/probe-r2/`, dừng nếu root đã tồn tại. Generator giữ nguyên, từng byte fixture phải trùng manifest D1; không giảm tải. Khóa nguồn/runtime/host và manifest mới, công bố trước chạy, kiểm trước/sau mỗi mẫu như D1; giữ tất cả lỗi/số đo. D1 `probe-r1` chỉ đọc để đối chiếu, không sửa evidence/manifest cũ hoặc tái sử dụng quota của nó. Không thêm tối ưu runtime trong loạt đã khóa; sai nguồn hoặc điều kiện dừng thì dừng theo controller. Ngân sách watchdog tối đa 11 phút cho tiến trình đo, không gồm kiểm/hồi quy. Đây vẫn là thăm dò, không duyệt ngưỡng 2/5 giây, chạy nghiệm thu, AI/sandbox/ACL hoặc cài công cụ.
