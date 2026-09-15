# R02-T10 D2 — đo lại sau tối ưu status

Ngày 2026-09-15. **APPROVED**: Human **“Ok làm đi”** sau [answer 3e142f7](https://github.com/Kynderis/kidea/blob/3e142f7548bbb9f0bab08975f82e11a13e6a7f87/answer.md) duyệt loạt 22 lượt đo lại. [Phạm vi đã trình](../tests/evidence/r02-t10-status-optimization.md#d2--đề-xuất-đo-lại-chưa-duyệt) giữ nguyên như lịch sử; trạng thái hiện hành nằm ở [ROADMAP](../KIDEA_ROADMAP.md#r02-t10-review).

- Chuẩn bị và chạy **11 lượt mỗi bộ S/M, tổng 22**, tiến trình mới và tuần tự; watchdog 30 giây/lượt, không retry/bù hoặc tự mở loạt khác. Tối đa 11 phút chờ tiến trình đo, không gồm chuẩn bị/hồi quy/kiểm hash. Timeout và lỗi giữ trong kết quả; không tiếp tục nếu nguồn/host/output sai hoặc chưa xác nhận tiến trình trước đã dừng.
- Cùng máy Windows/NTFS/SSD và Node riêng 24.21.0 của D1. Không cài công cụ/dependency, đổi host, PATH, config, ACL hoặc sandbox. Ranh giới một lượt hợp tác giữ nguyên; không tuyên bố có khóa hệ điều hành hoặc kiểm soát mọi writer ngoài luồng.
- Bản runtime sau tối ưu tại `3e142f7548bbb9f0bab08975f82e11a13e6a7f87`. Không tối ưu thêm runtime trong D2. Được sửa controller và test để hỗ trợ chính lượt r2, cập nhật báo cáo/roadmap/answer và Git theo quyền hiện hành của repository xây Kidea.
- Chỉ CREATE dữ liệu phép đo dưới `.test-output/r02-t10/probe-r2/`; dừng nếu root tồn tại, không ghi đè hoặc tự chọn tên thay thế. Generator giữ nguyên; byte từng fixture, số liệu và expected output phải trùng manifest D1. Chỉ đọc `.test-output/r02-t10/probe-r1/` để đối chiếu; lưu fingerprint đầy đủ evidence cũ và xác nhận nguyên vẹn sau loạt mới.
- Chuẩn bị manifest mới gồm quyền, nguồn/test/controller/runtime, hash từng đầu vào, expected, host và điều kiện cache. Hồi quy trên nguồn cố định rồi mới chuẩn bị fixture; công bố hash manifest trước mẫu đo đầu, không cần xin lại từng hash nếu đúng phạm vi. Sai workload/quyền/phương pháp thì dừng và trình phần đổi.
- Giữ cách đo [D1](r02-t10-core-trial-r1.md): wall-clock bao gồm spawn, startup, đọc/kiểm hồ sơ, output và tiến trình kết thúc. Kiểm hash/host trước và sau mỗi mẫu được ghi riêng, ngoài elapsed. Chuẩn bị/đối chiếu làm nóng cache OS; lần đầu không phải cold disk. Read coverage được kiểm trước đo, không giả làm I/O telemetry từng mẫu.
- Giữ cả 11 mẫu mỗi bộ, lần đầu/trung vị/lớn nhất, timeout/error/not-run. Đối chiếu với D1 nhưng không quy toàn bộ chênh lệch cho patch từ hai loạt không xen kẽ và không profiling.

D1 manifest SHA-256: `c812d4fdb8cc06c2f6da2dc93e544a8f42c2169322f83d29bf1035e9b71d1fae`; summary SHA-256: `0b086738c801241c582cf776675cad9f3bc14a70c85a411c0bd43c5274e0f82a`.

Đây vẫn là thăm dò, **không** duyệt ngưỡng 2/5 giây, nghiệm thu T10-S04, phiên AI, quyền launcher hoặc khép R02/mở R03/pilot. Không dùng quota T07 hay D1 cho lượt mới.
