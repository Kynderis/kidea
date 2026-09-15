# R02-T10 D3 — profile bộ 1.000 task

Ngày 2026-09-15. Human **“Ok duyệt”** sau [answer 8a2aea3](https://github.com/Kynderis/kidea/blob/8a2aea3159eb9137646ae42832e7d8fc6cb02d2a/answer.md) duyệt [D3](../../proposals/r02-t10-profile-r1.md). Đã dùng đúng **1/1 lượt**, không retry/warm-up hoặc chạy thêm `status` trên workload đo. Runtime, generator và controller D1/D2 không sửa.

## Kết luận và hướng tiếp

**Điểm nóng của profile này là phân giải đường dẫn/tra metadata, không phải parse hồ sơ hay quét anchor.** `realpathSync` chiếm **87,60% thời gian lấy mẫu có trọng số**, gồm toàn bộ 84,69% được gán trực tiếp cho frame native `lstat`. Đọc nội dung file qua `readFileSync` chiếm 5,42% inclusive. Đây là tỷ trọng trong **lượt có profiler**, không phải 87,60% CPU time thực hoặc bằng chứng rằng thay resolver sẽ giảm 87,60% thời gian benchmark.

Đối chiếu code: `status.absolute()` gọi `realpathSync` cho từng đoạn path, rồi `bytes()` gọi resolver thêm cho đích. Mã `fs` tích hợp trong Node 24.21.0 cho thấy `realpathSync` tự đi qua các đoạn đường dẫn và `binding.lstat`. Profile xác nhận đường gọi này chi phối mẫu, phù hợp với ứng viên duyệt path lồng nhau đã tìm khi rà code. Không đủ bằng chứng để quy chi phí cho SSD, antivirus, sync hoặc một syscall cụ thể của Windows.

**Ưu tiên thử tiếp:** dùng `realpathSync.native` của Node để tránh vòng duyệt JavaScript bên trong resolver, nhưng giữ nguyên việc kiểm từng đoạn path, nằm trong root, junction, file type, byte và kiểm cuối. Đây là phương án cần triển khai/kiểm chứng, **chưa được áp dụng trong D3 và chưa có lời hứa tăng tốc**. Trước dùng cần hồi quy caller status/writer/init/review/resume và các biên đường dẫn Unicode, liên kết trong/ngoài root, thiếu/đổi nguồn; benchmark mới cần phạm vi/lượt riêng. Không cache filesystem hoặc bỏ chốt an toàn để lấy số đẹp.

## Phân bố quan sát được

Profile có **8.676 mẫu**. Trọng số là `timeDeltas` (microsecond giữa các thời điểm lấy mẫu): tổng 14.363.775 µs; khoảng profile `endTime-startTime` là 14.363.977 µs, còn 202 µs đuôi không gán cho mẫu. Vị trí dòng trong bảng đã đổi từ zero-based của profile sang one-based.

| Frame | Vị trí | Self | Inclusive |
|---|---|---:|---:|
| `lstat` native | Không có URL/dòng trong profile | 84,692% | 84,692% |
| `realpathSync` | Node `fs`, dòng 2781 | 1,833% | 87,599% |
| `absolute` | `status.mjs:66` | 0,562% | 66,469% |
| `readFileSync` | Node `fs`, dòng 473 | 0,011% | 5,421% |
| `statSync` | Node `fs`, dòng 1793 | 0,024% | 2,460% |
| `parse` | `status.mjs:116` | 0,000% | 0,487% |
| `anchor` | `status.mjs:152` | 0,025% | 0,456% |
| `snapshotAnchors` | `status.mjs:17` | 0,033% | 0,222% |
| `integrity` | `status.mjs:166` | 0,000% | 0,009% |

Self chỉ tính mẫu tại frame lá; inclusive gồm các frame con nên **không cộng các hàng với nhau**. `lstat` nằm trong `realpathSync`; `absolute` cũng bao gồm thời gian resolver. Frame cùng URL/tên/vị trí được gộp; đệ quy không được ghi inclusive hai lần trong một mẫu. Tỷ lệ self bằng 0 chỉ là không trúng frame lá ở lần lấy mẫu này, không có nghĩa thao tác miễn phí.

Đối chiếu độc lập trực tiếp từ raw `nodes`/`samples`/`timeDeltas`, không gọi lại profiler hoặc hàm tổng hợp của harness: 7.578 mẫu có ancestor `realpathSync` (`node:fs`), tổng 12.582.479 µs; 7.325 mẫu lá `lstat`, tổng 12.164.933 µs, **toàn bộ nằm dưới resolver**. Hai tổng khớp `analysis.json`. Phần có native/URL trống và phần đuôi được giữ, không phân bổ lại để làm tỷ lệ đẹp.

## Điều kiện và tính đúng

- Một tiến trình public `kidea.mjs status` trên fixture D2 `QF-M-R02`: 1.000 TASK, 10 STEP, 343 file, 15.249.496 byte, 3.570 ref có kiểu. Cwd là fixture cũ chỉ đọc; từng file/expected khớp manifest D2. Không giảm tải hoặc sinh fixture thay thế.
- Node riêng 24.21.0, CPU profiler lấy mẫu 1000 µs; `--cpu-prof-dir` là đường tuyệt đối trong root D3 mới, tên cố định `QF-M-R02.cpuprofile`. Không để profiler ghi vào cwd D2. Không cài công cụ/dependency hoặc thay ACL/config/launcher.
- Cùng host của D2: Windows 11 Pro 10.0.26200, i5-11400F 6 nhân/12 luồng, RAM OS nhận 16.610.796 KiB, D: NTFS Fixed/Healthy, Samsung SSD 980 500GB NVMe. Root ngoài OneDrive được cấu hình; điều kiện một lượt hợp tác không là khóa hệ điều hành chống mọi writer.
- Exit 0, stdout khớp toàn bộ expected (chỉ bỏ `observedAt` như D2), stderr rỗng; profile hợp lệ, tiến trình đã đóng, không timeout/overflow. Wall-clock có profiler **14.456,8654 ms**, dưới watchdog 30 giây. Số này gồm instrumentation/startup/output và **không dùng so tốc độ với D1/D2 hoặc chốt ngưỡng**.
- 54 file nguồn/công cụ/chính sách không đổi; host khớp; toàn bộ **1.026 file bằng chứng D1/D2** và cây thư mục giữ nguyên. Đối chiếu thêm Node binary sau lượt chạy vẫn trùng SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`.
- Profiler là phép lấy mẫu, không ghi số lần gọi filesystem, số syscall, I/O latency riêng hoặc thời gian CPU của hệ điều hành. Instrumentation có thể làm thay đổi cả thời lượng và tỷ trọng; một profile đủ chỉ ra vùng cần ưu tiên kiểm, không xác nhận mức cải thiện của một bản sửa chưa tồn tại. Cache đã được làm nóng bởi đọc hash; không phải cold disk.

## Kiểm thử và bằng chứng

Harness/test mới `tests/r02-t10/profile.mjs` và `profile.test.mjs`; không sửa `.agents/skills/kidea`, generator hoặc `probe.mjs`. Sáu test mới kiểm self/inclusive/đệ quy, frame không có tên/URL, mẫu thời gian 0, dữ liệu lỗi/chu trình, output directory cố định và từ chối reset. Unit 6/6 đạt, sau đó **258/258 hồi quy đạt** (252 hiện hành + 6 mới), không fail/skip/cancel, exit 0, `inputsUnchanged: true`, 200676,7445 ms. Không cộng lại sáu test unit vào tổng.

Root local `.test-output/r02-t10/profile-r1/`, tạo exclusive. Manifest đã công bố trước lượt duy nhất; dữ liệu/nguồn khóa bằng hash, không chỉ dựa tên commit (`8a2aea3` là nền chuẩn bị).

| Artifact | SHA-256 |
|---|---|
| `manifest.json` | `9c72b628a4ad22c20cbf385820716c8b38ce9fa5c948d0aec304875fb58dbfbb` |
| `profiles/QF-M-R02.cpuprofile` — 223.867 byte | `285d6a4289bcf5b3ac4e4642e4dd1c05ad52b82082a3c174938b13b4fc3e1f74` |
| `analysis.json` | `632eeaa5e3c8010865b8270155fae44bb4c77f142583b1c7ac471d2fad92a8a1` |
| `summary.json` | `f561cfebe3a92c2d653d89243412160664840dc9f2c42cf850d16103aadf86ba` |
| `checks.stdout.txt` | `5256e6effefb8a8dd2acfadc9e1efc8927faab19241c28d1eb48397e12543b7d` |
| `checks.result.json` | `3e1800d181f837c8f1ad68ee42552b94a0c728dde86e8dd28133108ec327e036` |

`preparation-start.json` từ `2026-09-15T03:21:22.261Z`; `run-start.json` giữ lệnh/cwd/manifest của một lượt; summary tạo `2026-09-15T03:26:25.030Z`. Raw profile/host metadata/stdout/stderr giữ local, không push nội dung đường dẫn cá nhân của profile. Lệnh đã chạy bằng Node riêng: `tests/r02-t10/profile.mjs prepare`, rồi `run 9c72b628a4ad22c20cbf385820716c8b38ce9fa5c948d0aec304875fb58dbfbb`. Không gọi lại controller sau hoàn tất.

D3 hết 1/1 lượt. Chưa sửa runtime, thêm benchmark/AI trial, nâng ngân sách nháp 2/5 giây hoặc nghiệm thu T10-S04. T10-S01/S02 còn AI, T11 còn Human review; không khép R02/mở R03 từ kết quả này.
