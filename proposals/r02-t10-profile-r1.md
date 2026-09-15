# R02-T10 D3 — profiling bộ vừa

Ngày 2026-09-15. **APPROVED**: Human **“Ok duyệt”** sau [answer 8a2aea3](https://github.com/Kynderis/kidea/blob/8a2aea3159eb9137646ae42832e7d8fc6cb02d2a/answer.md) duyệt đúng D3 dưới đây. Phản hồi “Ok làm đi” sau 01e3fb1 trước đó chỉ mở chuẩn bị gói; nay được chuẩn bị và chạy một lượt theo phạm vi đã trình, không xin lại từng hash. Không lấy lại quota D1/D2 đã hết.

## Kết quả rà chỉ đọc

- `status.mjs` tại bản hiện hành: `absolute()` gọi `realpathSync` với từng đoạn path (dòng 66–78); `bytes()` tiếp tục resolve đích, stat và đọc file (dòng 91–114); mỗi ref và kiểm cuối vẫn gọi đường đọc này. Đây là kiểm tra an toàn hiện hành, không được bỏ chỉ để giảm thời gian.
- Đọc mã `fs` tích hợp trong đúng Node riêng v24.21.0 thấy `realpathSync()` tự duyệt các đoạn đường dẫn và gọi `binding.lstat`, kể cả kiểm root trên Windows. Vì vậy có việc duyệt lồng nhau trong code; **chưa biết tỷ trọng hoặc xác nhận đây là nguyên nhân chi phối**. Không thay sang `.native`, thêm cache I/O hoặc sửa runtime trong lượt này.
- `node --help` của runtime đã xác nhận có `--cpu-prof`, `--cpu-prof-dir`, `--cpu-prof-name`, `--cpu-prof-interval` (mặc định 1000 microsecond). Chưa chạy profiler hoặc `status` mới; các kiểm tra trên chỉ đọc code/help, không phải số đo hiệu năng.

## Quyết định đã duyệt — D3

**Cho chuẩn bị harness/manifest và chạy đúng 1 lượt profiling trên QF-M-R02 (1.000 task), watchdog 30 giây, không retry/bù.** Bộ vừa là phần đang mất khoảng 9,76 giây; không cần lặp cả bộ nhỏ để bắt đầu xác định vùng tốn thời gian.

### Phạm vi

- Runtime/skill giữ nguyên bản `01e3fb1d2902f91acf4db115d54f0a08bc193bfd` (runtime tối ưu không đổi từ 3e142f7), Node riêng v24.21.0 trên cùng host. Không cài công cụ/dependency, AI, sandbox, ACL, mạng, Git trong fixture hoặc thay cấu hình máy.
- Chỉ đọc fixture M và expected hiện có dưới `.test-output/r02-t10/probe-r2/`; từng byte phải khớp manifest D2 SHA-256 `bbe5bae6df558b4f75ea29a1a254182815e2c3d01cc21a000f229a803629f40d`. Summary D2 SHA-256 `f9fde4d6089e7cc8fd51a7f20924054d9e4f5925cc7473dd29a6e7b3af422986`. Fingerprint evidence D1/D2 trước/sau để giữ nguyên bằng chứng cũ.
- Được thêm harness/test cho phép chẩn đoán trong `tests/r02-t10/`, báo cáo trong `tests/evidence/`; không sửa runtime, generator hoặc controller D1/D2. Chỉ CREATE manifest, marker, stdout/stderr, CPU profile và kết quả dưới `.test-output/r02-t10/profile-r1/`. Root tồn tại thì dừng, không ghi đè/xóa hoặc tự chọn root mới. Git/roadmap/answer theo quyền hiện hành của repo xây Kidea.
- CPU profile phải ghi vào đường tuyệt đối thuộc root mới qua `--cpu-prof-dir`, tên cố định `QF-M-R02.cpuprofile`; **không dùng thư mục mặc định là cwd fixture D2**. Lấy mẫu 1000 microsecond như mặc định đã kiểm; chạy public `kidea.mjs status`, không gọi helper nội bộ thay đường public.
- Chuẩn bị kiểm thử harness và hồi quy trên nguồn cố định, khóa manifest nguồn/runtime/host/fixture/expected/lệnh/quyền và công bố trước chạy. Không xin lại từng hash nếu đúng phạm vi đã duyệt. Controller có dấu started exclusive; một lượt đã bắt đầu tính là đã dùng kể cả lỗi/timeout/profile thiếu.
- Watchdog 30 giây, chờ xác nhận tiến trình dừng; giữ mọi output/profile chưa hoàn tất khi lỗi, không tạo profile giả hoặc chạy lại để bù. Không mở lần `status` khác để lấy baseline, timing, warm-up hay kiểm tra bổ sung ngoài một lượt chẩn đoán. Các kiểm hash và test harness không được lén gọi thêm `status` trên workload đo.
- Kiểm toàn bộ output với expected D2, exit code, nguồn/fixture/host trước/sau. Nếu profile hợp lệ, đọc JSON bằng công cụ hiện có và tổng hợp stack/hàm nổi bật, phân biệt self và inclusive để không cộng trùng; giữ phần không gán được. Không sửa nguồn hoặc tối ưu trong cùng lượt đã khóa.

### Kết luận được phép và giới hạn

Đây là profile lấy mẫu của tiến trình có instrumentation, gồm startup và output; không phải đo chính xác từng thao tác I/O, số syscall hay CPU time của hệ điều hành. Phần chờ/native/unattributed có thể không tách được đầy đủ. Không dùng thời gian lượt có profiler để so tốc độ với D1/D2, chốt ngưỡng hoặc chứng nhận tối ưu. Nếu chưa đủ dữ kiện thì báo giới hạn và đề xuất phép kiểm tiếp theo, không tự mở thêm lượt.

Đầu ra: vùng code/stack chi phối nếu bằng chứng cho phép, các phần chưa phân biệt được và hướng sửa cần kiểm chứng. Raw profile giữ local; báo cáo chỉ trích dữ kiện cần thiết. D3 không duyệt sửa runtime, benchmark lại, nghiệm thu T10-S04, AI hoặc khép R02.
