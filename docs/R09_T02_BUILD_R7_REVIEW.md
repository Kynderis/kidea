# R09-T02 build r7 — EX-T02-WAL-01 r2

**PROPOSED — chưa chạy, chờ quyền một lượt.** Human đã duyệt EX r2; [99 kiểm offline và 5 kiểm tĩnh PASS](../tests/evidence/r09/t02-tsan-policy-r2.md). Không xin lại ngoại lệ. Lượt r6 vẫn FAIL; r7 mới sẽ kiểm thực trên nguồn cuối.

## Nguồn/lệnh cụ thể

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, source `55640a5ed9668a13f22d6262cdc00460415ecd6a`, HEAD `e5265da58faf82ce245a24ba51bc43adf3d1ad40`, master local sạch/không remote. [Manifest](../tests/evidence/r09/t02-build-r7/build-manifest.json) SHA256 `8e1dd7e7de27da211c3132c8d67258dcfc53ce61b72fe2e2bf4de036ea9d5793`. [Preflight](../tests/evidence/r09/t02-build-r7/preflight.json):75source/824vendor. Manifest bind ID ngoại lệ và policy hash; code/flags/source/limits đổi sẽ bị từ chối. Đọc [diff](../tests/evidence/r09/t02-tsan-policy-r2/source-change.patch) và [policy](../tests/evidence/r09/t02-tsan-policy-r2/source/tests/t02/tsan/policy.json).

Từ root pilot, dùng Node ≥24 sẵn có (phiên này dùng Node24.19.0 trong runtime Codex):

```sh
node scripts/t02/run.mjs /Users/kendrick/Desktop/kidea/tests/evidence/r09/t02-build-r7/build-manifest.json --approved-manifest-sha256 8e1dd7e7de27da211c3132c8d67258dcfc53ce61b72fe2e2bf4de036ea9d5793
```

Không chạy `docs/t02/build-manifest.json` cũ: nó giữ nguồn lịch sử, không khớp nguồn r7. Image Linux amd64 sẵn có `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`; sẽ kiểm lại ID/OS/architecture trước chạy, không pull/build image.

## Gói chạy và điều kiện kết quả

Một lượt mới ≤2 giờ, 4 container tuần tự dev/ASan+UBSan/TSan/release, mỗi container ≤30 phút; 2 CPU/4 GiB/256 PID; đĩa mới ≤8 GiB, data/log ≤2 GiB, host free ≥100 GiB. Đã đo free361112252416byte (~336GiB); output cũ thực đo5281528KiB (~5.04GiB), giữ nguyên, tổng tối đa output cũ +8GiB. Monitor2s là guard mềm, không hard disk quota. Không network/download/hostport, không cài/chỉnh host/cloud/Web/native/AI trial/PROD.

Source/vendor/rootFS read-only, user1000, capdrop/no-new-privileges, tmpfs256MiB. CREATE-only output `kidea-t02-build-lab/t02-UUID`, thu hồi đúng container ID/labels, giữ log/DBfake/artifact/source. Không reset quota/retry sau lỗi hoặc tái dùng output/grant lịch sử.

Chạy đủ formatter, CMake/build, 46 CTest, collector/796 assertion, dev clang-tidy, 18 HTTP mỗi preset. TSan có ba control trong cùng container, từng control tối đa90s; case launcher55s trong timeoutCTest60s. Mọi process/log/control/oracle không đủ → FAIL/INCONCLUSIVE và dừng lượt. Chỉ report WAL đúng phạm vi đã duyệt được phân loại riêng để tiếp tục HTTP/release; raw CTest/JUnit/exit66 giữ nguyên. Cảnh báo mới không được gộp vào ngoại lệ.

Kết quả tốt nhất tự động là **EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED**, chưa là TSan sạch hoặc T02/R09 nghiệm thu. Sau chạy phải review raw reports, controls, đủ oracle và phạm vi ngoại lệ trước kết luận PASS_WITH_APPROVED_LIMITATION. Không đổi sáu FAIL r5 thành PASS. Nếu nguồn/runtime phát sinh vấn đề, giữ bằng chứng, sửa trong phạm vi authoring rồi trình đúng phần chạy mới; không tự mở thêm lượt.

**Đề nghị duyệt một lượt build r7 theo manifest trên.** Cần quyền chạy vì gói EX-T02-WAL-01 đã duyệt chỉ mở authoring/kiểm offline và yêu cầu manifest nguồn cuối trước Docker. R09 còn mở, R10 chưa mở; không xin lại ngoại lệ/nghiệp vụ.
