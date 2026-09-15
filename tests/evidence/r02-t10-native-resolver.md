# R02-T10 — thử resolver native, chưa đo lại

Ngày 2026-09-15. Human **“Ok làm đi”** sau [answer ee0551c](https://github.com/Kynderis/kidea/blob/ee0551ce8490f1f7b83bdeab5568466de2723f0b/answer.md) cho thử `realpathSync.native`, giữ kiểm tra an toàn và kiểm chứng lại. Không suy thành ngân sách benchmark/profiling mới; D1/D2/D3 đã hết lượt.

## Thay đổi và ranh giới

- Đổi đúng ba chỗ trong `status.mjs`: resolve root, từng thành phần đường dẫn trong `absolute`, và đích đọc trong `bytes`. Dùng native nhất quán cho cả root/đích; không thêm cache I/O, bỏ vòng kiểm path hoặc giảm số lần đọc lại.
- Giữ `validPath`, so nằm trong root, junction, kiểm file thường, nội dung byte, SHA-256, nguồn hiện hành/lịch sử, final recheck và pending/Git checks. Không đổi schema, public output hay quyền writer. Các caller dùng engine được hồi quy cùng nhau.
- Không thêm dependency hoặc sửa helper khác để mở rộng tối ưu. Chỉ điều chỉnh runner hồi quy thường lệ để bao gồm cả test probe/profile hiện có và hash các module hỗ trợ; runner **không gọi controller benchmark/profiling**.
- `status.mjs` đã kiểm có SHA-256 `5ccac5c47977f26ff4cf76aa493bddafe324649acf04a7376b0818408b94de13`. Đây là thay đổi sau profile D3, không diễn giải 87,6% của D3 như số đo cho bản mới.

## Kiểm chứng

Sáu test mới đạt ngay lượt targeted đầu: Unicode/khoảng trắng và cwd khác chữ hoa/thường; junction trong root; retarget junction sang đích trong root nhưng byte giống; retarget ra ngoài root dù byte giống; thư mục bị dùng làm file; nguồn mất trước final recheck. Các trường hợp đổi nguồn vẫn bị chặn, không restore hoặc tự sửa. Fixture lỗi được giữ lại; không xóa dữ liệu.

**264/264 hồi quy đạt**, exit 0, không fail/skip/cancel, `inputsUnchanged: true`. Gồm tám suite helper/status/writer/init/approve/resume/probe/profile, tăng sáu test từ 258 trước đó; không cộng lại targeted. Các test workload S/M của probe là kiểm graph in-memory, không tạo thêm mẫu benchmark.

- Node riêng v24.21.0, SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`; kiểm trên Windows/NTFS đã duyệt. Không tuyên bố đã kiểm UNC/network share hoặc hệ điều hành khác.
- Runner: `tests/r02-t07/run-tests.mjs`; log local `.test-output/r02-t07/regression-57Smr9/`, bắt đầu `2026-09-15T03:35:06.725Z`.
- Stdout SHA-256 `1e1613c7d7777a03bb07f380e4e120386807a678b6f0a848628546ea24f90f16`; stderr rỗng. Summary SHA-256 `54b8564eebb61bf49ffc56ad316422e39befd9f2e1c16271600eeb23ace42a70`.
- Thời lượng suite 144386,0358 ms chỉ là log chạy test, **không dùng để kết luận tăng tốc status**. Kiểm lại hash nguồn sau hồi quy vẫn khớp; `git diff --check` đạt.
- Không gọi lại D1/D2/D3, không sửa evidence của chúng. Hash summary ba lượt vẫn khớp báo cáo cũ. Chưa thêm AI, sandbox/ACL, cài công cụ, mở pilot hoặc nghiệm thu R02.

## D4 — đề xuất đo lại, chưa duyệt

Cho chuẩn bị và chạy **22 lượt mới: 11 mỗi bộ S/M, watchdog 30 giây/lượt, không retry/bù**, cùng máy/Node và phương pháp D2, không profiler. Tối đa 11 phút chờ tiến trình đo, không gồm chuẩn bị/hồi quy/kiểm hash.

Được cập nhật controller/test phục vụ đúng root mới `.test-output/r02-t10/probe-r3/`; chỉ CREATE fixture/manifest/log tại đó, root tồn tại thì dừng, không tự thay tên. Generator giữ nguyên; từng byte, stats và expected fixture phải khớp manifest D2. Evidence D1/D2/D3 chỉ đọc và fingerprint trước/sau, không sửa/xóa.

Khóa bản native hiện hành, harness/test/runtime/host/đầu vào; hồi quy trước manifest và công bố hash trước đo. Giữ cách đo public status và kiểm hash/output trước/sau mỗi mẫu như D2; lỗi/quyền/nguồn đổi hoặc chưa xác nhận dừng thì dừng loạt theo controller. Giữ mọi mẫu, kể cả chậm/timeout; không thêm tối ưu giữa loạt. D4 vẫn là thăm dò, không duyệt ngân sách nháp 2/5 giây, nghiệm thu T10-S04, AI hoặc profiling mới.
