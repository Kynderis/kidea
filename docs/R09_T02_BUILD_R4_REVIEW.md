# R09-T02 build r4 — sửa sao chép kết quả HTTP

**PROPOSED — chưa duyệt/chưa chạy.** [R3](../tests/evidence/r09/t02-build-r3.md) build/CTest46/46/collector qua, dừng do clang-tidy `performance-unnecessary-value-param` tại respond. Giữ FAIL và tất cả log. Không dùng lại grant một lượt r3.

## Nguồn cụ thể

Sửa `respond` và lambda `finish` nhận `const workshop::Response &`, bỏ `std::move(result)` khi chỉ chuyển sang hàm đọc đồng bộ. Không lưu reference sau return; không đổi payload/status/lifecycle/nghiệp vụ, test/oracle, flags/dependency/runner. [Diff](../tests/evidence/r09/t02-build-r4/source-fix.patch). Test HTTP hiện có sẽ kiểm response trên nguồn mới; không coi kiểm tĩnh thay runtime.

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, source `1be7797b7a60a5d15d6a952daacbc17d664a66fc`, HEAD `506b426bd7c14687ba146ab15d1f281f415951e1`, local master sạch/không remote. [Manifest r4](../tests/evidence/r09/t02-build-r4/build-manifest.json), SHA256 `4d5f915116af6d35bc824017fadb77ea5357678f510fd4e0fe1c5c324c61e6e0`,51file source/824vendor. [Kiểm tĩnh](../tests/evidence/r09/t02-build-r4/static-review.json) qua; chưa compile/runtime bản sửa.

```sh
node scripts/t02/run.mjs docs/t02/build-manifest.json --approved-manifest-sha256 4d5f915116af6d35bc824017fadb77ea5357678f510fd4e0fe1c5c324c61e6e0
```

Chạy từ root pilot bằng Node24 có sẵn; image Linux amd64 không đổi `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`.

## Quyền đề nghị

Một lượt mới≤2giờ,4container tuần tự dev/ASan+UBSan/TSan/release, mỗi container≤30phút,2CPU/4GiB/256PID. Đĩa mới≤8GiB, data/log≤2GiB, host free≥100GiB. R1–r3 giữ938904KiB (~916.90MiB) output cũ; tổng output bốn lượt tối đa8GiB+938904KiB. Đây là đề nghị lượt mới, không tự reset grant đã dùng. Networknone/0download/0hostport, source/vendorRO/rootFSRO/capdrop/user1000; runner monitor2s không là hard filesystem quota; output CREATE-only.

Kiểm đủ formatter18/CMake/build/CTest46/collector/JUnit/dev clang-tidy/HTTP và các preset còn lại trên r4. FAIL dừng, giữ log; không skip/đổi expected/tắt warning hoặc đổi source rồi chạy lại bằng grant này. Cleanup chỉ exact IDs/labels, giữ nguồn/log/DBfake/cache. Không cài host/pull/build image/cloud/Web/PROD/native/AI trial/R10. PASS chỉ backend component, không tự nghiệm thu T02/R09/137nghĩa vụ.

**Đề nghị duyệt một lượt build r4.** Cần quyền vì [gói r3](R09_T02_BUILD_R3_REVIEW.md) đã chốt một lượt và “FAIL dừng và giữ bằng chứng; không skip/đổi expected hoặc đổi source rồi chạy lại bằng grant này.” Không xin lại B/C/nghiệp vụ.
