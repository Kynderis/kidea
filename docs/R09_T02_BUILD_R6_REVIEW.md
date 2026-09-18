# R09-T02 build r6 — gate TSan với ngoại lệ có điều kiện

**APPROVED và đã thực thi — FAIL tại gate TSan.** Human “Duyệt r6” cho gói tại f67626a. [Kết quả thực](../tests/evidence/r09/t02-build-r6.md); quyền một lượt đã dùng, TSanHTTP/release chưa chạy. Nội dung đề xuất bên dưới giữ lịch sử.

**PROPOSED — chưa chạy, chờ quyền thực thi một lượt.** Human đã duyệt EX-T02-WAL-01 r1 và phần viết/kiểm offline tại `7cdb089`; không hỏi lại quyết định ngoại lệ đó. [Kết quả triển khai](../tests/evidence/r09/t02-tsan-policy-implementation-r1.md): 76 kiểm offline và 22 kiểm tĩnh PASS, giữ FAIL ban đầu khi đối chiếu nhãn chứa ID ngẫu nhiên. CMake/C++/harness runtime mới chưa được chạy.

## Nguồn/lệnh cụ thể

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, source `763ab55cb238ab3ccdab4a984525a883b39b44f7`, HEAD `03b20b5e28fb5276a14dfc69ffc20661c4d567f9`, master local sạch/không remote. [Manifest](../tests/evidence/r09/t02-build-r6/build-manifest.json) SHA256 `5685e9990b63c69fe943c2351e2badb25f6737a3e944d48f0420ecdda9c211c9`. [Preflight](../tests/evidence/r09/t02-build-r6/preflight.json):68source/824vendor. Manifest bind ID ngoại lệ và policy hash; code/flags/source/limits đổi sẽ bị từ chối. Đọc [diff](../tests/evidence/r09/t02-tsan-policy-implementation-r1/source-change.patch) và [policy](../tests/evidence/r09/t02-tsan-policy-implementation-r1/source/tests/t02/tsan/policy.json).

Từ root pilot, dùng Node ≥24 sẵn có (phiên này dùng Node24.19.0 trong runtime Codex):

```sh
node scripts/t02/run.mjs /Users/kendrick/Desktop/kidea/tests/evidence/r09/t02-build-r6/build-manifest.json --approved-manifest-sha256 5685e9990b63c69fe943c2351e2badb25f6737a3e944d48f0420ecdda9c211c9
```

Không chạy `docs/t02/build-manifest.json` cũ: nó giữ nguồn lịch sử, không khớp nguồn r6. Image Linux amd64 sẵn có `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`; đã đọc lại ID/OS/architecture, không pull/build image.

## Gói chạy và điều kiện kết quả

Một lượt mới ≤2 giờ, 4 container tuần tự dev/ASan+UBSan/TSan/release, mỗi container ≤30 phút; 2 CPU/4 GiB/256 PID; đĩa mới ≤8 GiB, data/log ≤2 GiB, host free ≥100 GiB. Đã đo free363929948160byte (~339GiB); output cũ thực đo3366444KiB (~3.21GiB), giữ nguyên, tổng tối đa output cũ +8GiB. Monitor2s là guard mềm, không hard disk quota. Không network/download/hostport, không cài/chỉnh host/cloud/Web/native/AI trial/PROD.

Source/vendor/rootFS read-only, user1000, capdrop/no-new-privileges, tmpfs256MiB. CREATE-only output `kidea-t02-build-lab/t02-UUID`, thu hồi đúng container ID/labels, giữ log/DBfake/artifact/source. Không reset quota/retry sau lỗi hoặc tái dùng output/grant lịch sử.

Chạy đủ formatter, CMake/build, 46 CTest, collector/796 assertion, dev clang-tidy, 18 HTTP mỗi preset. TSan có ba control trong cùng container, từng control tối đa90s; case launcher55s trong timeoutCTest60s. Mọi process/log/control/oracle không đủ → FAIL/INCONCLUSIVE và dừng lượt. Chỉ report WAL đúng phạm vi đã duyệt được phân loại riêng để tiếp tục HTTP/release; raw CTest/JUnit/exit66 giữ nguyên. Cảnh báo mới không được gộp vào ngoại lệ.

Kết quả tốt nhất tự động là **EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED**, chưa là TSan sạch hoặc T02/R09 nghiệm thu. Sau chạy phải review raw reports, controls, đủ oracle và phạm vi ngoại lệ trước kết luận PASS_WITH_APPROVED_LIMITATION. Không đổi sáu FAIL r5 thành PASS. Nếu nguồn/runtime phát sinh vấn đề, giữ bằng chứng, sửa trong phạm vi authoring rồi trình đúng phần chạy mới; không tự mở thêm lượt.

**Đề nghị duyệt một lượt build r6 theo manifest trên.** Cần quyền chạy vì gói EX-T02-WAL-01 đã duyệt chỉ mở authoring/kiểm offline và yêu cầu manifest nguồn cuối trước Docker. R09 còn mở, R10 chưa mở; không xin lại ngoại lệ/nghiệp vụ.
