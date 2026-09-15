# R02-T10 D4 — đo sau native resolver

Ngày 2026-09-15. **APPROVED**: Human **“Ok nhé”** sau [answer 090290a](https://github.com/Kynderis/kidea/blob/090290a37ec088c9faa530ddebcaa2de12c0046c/answer.md) duyệt [D4 đã trình](../tests/evidence/r02-t10-native-resolver.md#d4--đề-xuất-đo-lại-chưa-duyệt). Không chuyển quota đã hết của D1/D2/D3 sang lượt này.

- Chuẩn bị và chạy **22 lượt mới, 11 mỗi bộ S/M**, tiến trình mới, tuần tự, watchdog **30 giây/lượt**, không retry/bù hoặc profiler. Tối đa 11 phút chờ tiến trình đo, không gồm chuẩn bị/hồi quy/hash. Timeout/error giữ trong kết quả; không mở mẫu tiếp nếu chưa xác nhận dừng hoặc nguồn/host/output sai theo controller D2.
- Cùng máy Windows/NTFS/SSD, Node riêng 24.21.0 và phương pháp public status D2. Bản native tại `090290a37ec088c9faa530ddebcaa2de12c0046c`; `status.mjs` SHA-256 `5ccac5c47977f26ff4cf76aa493bddafe324649acf04a7376b0818408b94de13`. Không sửa thêm runtime trong loạt khóa, cài công cụ, đổi cấu hình/quyền máy, gọi AI hoặc sandbox.
- Được cập nhật controller/test chỉ phục vụ `.test-output/r02-t10/probe-r3/`. Chỉ CREATE fixture/manifest/log tại root mới; root tồn tại thì dừng, không ghi đè/xóa hoặc tự chọn tên khác. Generator giữ nguyên; từng byte/stats/expected fixture phải trùng manifest D2. D1/D2/D3 chỉ đọc, fingerprint đầy đủ trước/sau; giữ toàn bộ bằng chứng cũ.
- Hồi quy trên nguồn cố định trước manifest; khóa runtime/harness/test/host/fixture/expected/lệnh/quyền, công bố hash trước mẫu đầu. Nếu đúng phạm vi thì không xin lại từng hash. Kiểm nguồn, binary Node, host và fixture trước/sau từng mẫu, ngoài elapsed. Không có `NODE_OPTIONS`/coverage/profiler thêm vào lệnh đo.
- Wall-clock gồm spawn/startup/đọc kiểm hồ sơ/output/close, không gồm audit pre/post như D2. Kiểm coverage bằng graph trước đo. Hash/preparation làm nóng cache OS; mẫu đầu không phải cold disk. Giữ tất cả 11 số mỗi bộ, lần đầu/trung vị/lớn nhất, lỗi/timeout/not-run; không gọi p95 hoặc bỏ mẫu chậm.
- Đây là thăm dò, chưa duyệt ngân sách nháp 2/5 giây, nghiệm thu T10-S04, profiling/AI mới hoặc khép R02. So với D2 trên cùng dữ liệu/máy, không ngoại suy mọi project/host hay coi hai loạt nối tiếp là A/B xen kẽ.

Nguồn baseline: [D2](../tests/evidence/r02-t10-probe-r2.md); nguyên nhân chọn resolver: [D3](../tests/evidence/r02-t10-profile-r1.md). Git/roadmap/answer của repo xây Kidea tiếp tục theo quyền hiện hành.
