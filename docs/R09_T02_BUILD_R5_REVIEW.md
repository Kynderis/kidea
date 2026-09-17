# R09-T02 build r5 — sửa cảnh báo trong bộ test

**APPROVED và đã thực thi — dev/ASan+UBSan PASS, TSan FAIL6ca SQLite WAL.** Human “duyệt nhé” cho gói tại e8231b0. [Kết quả r5](../tests/evidence/r09/t02-build-r5.md); quyền một lượt đã dùng. [Diagnostic chờ duyệt](R09_T02_SQLITE_DIAGNOSTIC_REVIEW.md). Nội dung dưới giữ nguyên gói đã trình. [R4](../tests/evidence/r09/t02-build-r4.md) build/CTest46/46/collector/backend clang-tidy qua, dừng tại12warning performance trong test. Giữ FAIL/log, không dùng lại grant một lượt r4.

## Nguồn cụ thể

Sửa2tham số JsonValue sang const reference,8chuỗi nối sang append,2endl sang newline+explicit flush. Giữ toàn bộ assertion, expected, nội dung variant/log và flush sau từng dòng (quan trọng với crash/fork); không giảm kiểm, không đổi code backend/nghiệp vụ/flags/dependency/runner. [Diff](../tests/evidence/r09/t02-build-r5/source-fix.patch). Không thêm test giả để kiểm cú pháp; bộ46nhóm/HTTP hiện có phải chạy lại trên nguồn mới.

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, source `539e2b3e378eba614186a6db1de08271b4d8f9fa`, HEAD `4d30799988de316534a88445dc4c794eadcc50ef`, local master sạch/không remote. [Manifest r5](../tests/evidence/r09/t02-build-r5/build-manifest.json) SHA256 `1fc4125af9d8aa4ee3f39d2fccc0d2219c7a6f6a482ad45f411773b2c2f6ecee`,51file source/824vendor. [Kiểm tĩnh](../tests/evidence/r09/t02-build-r5/static-review.json) qua, chưa compile/runtime bản sửa.

```sh
node scripts/t02/run.mjs docs/t02/build-manifest.json --approved-manifest-sha256 1fc4125af9d8aa4ee3f39d2fccc0d2219c7a6f6a482ad45f411773b2c2f6ecee
```

Chạy root pilot bằng Node24 sẵn có; image Linux amd64 không đổi `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`.

## Quyền đề nghị

Một lượt mới≤2giờ,4container tuần tự dev/ASan+UBSan/TSan/release, mỗi container≤30phút,2CPU/4GiB/256PID. Đĩa mới≤8GiB, data/log≤2GiB, host free≥100GiB. R1–r4 giữ1396104KiB (~1.33GiB) output cũ; tổng output năm lượt tối đa8GiB+1396104KiB. Đây là grant mới đề nghị, không tự reset quyền đã dùng. Networknone/0download/0hostport, source/vendorRO/rootFSRO/capdrop/user1000, monitor2s (không hard disk quota), CREATE-only output.

Chạy đủ formatter18/CMake/build/CTest46/collector/JUnit/dev clang-tidy/HTTP và các preset còn lại trên r5. FAIL dừng/giữ log; không skip/đổi expected/tắt warning hoặc đổi source rồi chạy lại bằng grant này. Cleanup chỉ exact IDs/labels, giữ nguồn/log/DBfake/cache. Không cài host/pull/build image/cloud/Web/PROD/native/AI trial/R10. PASS chỉ backend component, không tự nghiệm thu T02/R09/137nghĩa vụ.

**Đề nghị duyệt một lượt build r5.** Cần quyền vì [gói r4](R09_T02_BUILD_R4_REVIEW.md) chốt một lượt và “FAIL dừng, giữ log; không skip/đổi expected/tắt warning hoặc đổi source rồi chạy lại bằng grant này.” Không xin lại B/C/nghiệp vụ.
