# R02-T10-S03 — tiêu chí nghiệm thu status r1

Ngày 2026-09-15. **APPROVED**: Human “Duyệt” sau [answer 85866d9](https://github.com/Kynderis/kidea/blob/85866d92de0a05c257818fc1114f46f87ccf896f/answer.md) chốt tiêu chí và cấp đúng 22 lượt nghiệm thu dưới đây. Approval trước đó sau 44da82d chỉ cho trình gói; approval lần này mới cấp lượt chạy. Không cấp tối ưu runtime hoặc AI.

## Quyết định xin duyệt

Chốt chuẩn **public status local R02** trên hai fixture S/M và máy tham chiếu, đồng thời cho thực hiện **một loạt nghiệm thu mới 22 lượt, 11 mỗi bộ**. Không dùng lại D4 làm lượt nghiệm thu sau khi chốt chuẩn.

| Bộ | Ngưỡng từng lượt | Điều kiện đúng |
|---|---:|---|
| QF-S-R02 — 100 task, 73 file, 1.969.876 byte | ≤ 2.000 ms | Cả 11 lượt đúng toàn bộ expected output |
| QF-M-R02 — 1.000 task, 343 file, 15.249.496 byte | ≤ 5.000 ms | Cả 11 lượt đúng toàn bộ expected output |

**Đạt phần status khi đủ 22/22 lượt đúng và từng lượt trong ngưỡng**, exit 0, stderr rỗng, nguồn/host/fixture không đổi, tiến trình xác nhận đã dừng; hồi quy và kiểm tra bảo toàn bằng chứng đều đạt. Không dùng trung vị để che một lượt vượt ngưỡng. Lỗi/timeout/vượt ngưỡng là không đạt; thiếu lượt hoặc sai điều kiện không đủ căn cứ nghiệm thu, không tính đạt.

Căn cứ: ngân sách chờ local đã đề xuất trong [QUALITY](../KIDEA_QUALITY.md), không là chuẩn ngành. [D4](../tests/evidence/r02-t10-probe-r3.md) có lớn nhất S 624,479 ms và M 3.129,433 ms, nên giữ 2/5 giây có dư địa quan sát, không cần nới chuẩn hoặc tối ưu tiếp. Không cam kết mọi máy/project đều đạt; không áp dụng cho AI, mạng, Git, build hoặc sinh HTML 3/10 giây.

## Quyền và điều kiện nếu được duyệt

- Giữ runtime native D4, `status.mjs` SHA-256 `5ccac5c47977f26ff4cf76aa493bddafe324649acf04a7376b0818408b94de13`; không tối ưu thêm. Giữ generator, toàn bộ byte/cây/stats/expected S/M của manifest D4 `cfd607a62703e3ff00dacf13642c0d121272396def62dca8ae07ea4b5bc965eb`.
- Cùng máy Windows 11 Pro 10.0.26200, i5-11400F, RAM OS 16.610.796 KiB, D: NTFS/Samsung SSD 980 NVMe; Node riêng 24.21.0 như D4. Không đổi cấu hình/quyền hoặc cài công cụ. Root ngoài sync cấu hình; một lượt hợp tác, không tuyên bố khóa OS chặn mọi writer.
- Cho cập nhật controller/test chỉ phục vụ nghiệm thu và đồng bộ tiêu chí đã duyệt trong QUALITY/roadmap. Chỉ tạo fixture/manifest/log trong root mới cố định `.test-output/r02-t10/acceptance-r1/`; tồn tại thì dừng, không xóa/ghi đè/chọn tên khác. D1/D2/D3/D4 chỉ đọc, fingerprint đầy đủ trước/sau; không sửa bằng chứng lịch sử.
- Hồi quy đầy đủ trên nguồn cố định trước manifest; khóa nguồn, binary Node, controller/test/chính sách, host, fixture/expected và lệnh. Công bố manifest hash trước mẫu đầu; đúng phạm vi thì không xin lại từng hash, sai khác trọng yếu phải trình lại. Kiểm coverage 73/73 và 343/343 file trong preflight.
- Mỗi mẫu tiến trình mới gọi public `kidea.mjs status`, tuần tự 11 S rồi 11 M; không profiler hoặc cờ môi trường bổ sung. Wall-clock gồm spawn/startup/đọc kiểm hồ sơ và tài liệu sản phẩm/output/close. Audit hash/host/fixture trước/sau mỗi mẫu nằm ngoài elapsed, ghi riêng như D4.
- Không xóa cache OS; preflight/hash làm nóng cache. Mẫu đầu không phải cold disk. So toàn bộ output, chỉ bỏ `observedAt` như D4; inventory preflight không phải telemetry I/O từng mẫu.
- Watchdog **30 giây/lượt**, tối đa **11 phút chờ 22 tiến trình đo**, không gồm chuẩn bị/hồi quy/audit. Không mở mẫu tiếp nếu chưa xác nhận tiến trình trước dừng hoặc nguồn/host/output sai. Lượt vượt ngưỡng nhưng output đúng được giữ và có thể tiếp tục mẫu còn lại; cả bộ vẫn không đạt.
- **Không retry/bù hoặc tự mở loạt khác**, kể cả do nhiễu. Giữ mọi lỗi/chậm/timeout/not-run, lần đầu/trung vị/lớn nhất và số từng mẫu; không bỏ outlier, không gọi p95. Không đạt thì báo căn cứ và trình hướng xử lý/quyền mới; không tự sửa runtime hoặc nới chuẩn.

## Ranh giới kết luận

Chỉ chốt và cấp một loạt nghiệm thu phần status local. Không cấp AI trial/model/launcher, ACL/sandbox, sinh view, pilot/deploy hoặc R03. T10-S01/S02 còn phần AI; T10-S04 chỉ ghi kết quả lát cắt status, không tự DONE toàn task. T07 cũ 0/3 và sự cố launcher giữ nguyên; T11 Human review khép R02 vẫn bắt buộc.
