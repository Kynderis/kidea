# R09-T02 build r2 — bản sửa lỗi biên dịch test

**APPROVED và đã thực thi — FAIL CTest JSON.** Human “duyệt nhé” cho gói tại e19cbd4. [Kết quả r2](../tests/evidence/r09/t02-build-r2.md); quyền một lượt đã dùng. [R3 chờ duyệt](R09_T02_BUILD_R3_REVIEW.md). Nội dung dưới giữ nguyên gói đã trình. [Lượt r1](../tests/evidence/r09/t02-build-r1.md) đã dùng đúng quyền một lượt, dừng khi compile FAIL. Đã sửa alias `Json` trùng namespace JsonCpp thành `JsonValue` và vòng lặp đọc chuỗi dùng const reference. Không đổi assertion/expected, ca kiểm, flags, dependency, runner hoặc nghiệp vụ. [Diff nguồn](../tests/evidence/r09/t02-build-r2/source-fix.patch); kiểm cơ học xác nhận chỉ hai phép sửa và định dạng.

## Bản nguồn cụ thể

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, source `762fb48b69d15ad795d21f13b2674b61d7940765`, local HEAD `c431bbdeb86572ba696a6369af832853452e6a06`, sạch và không remote. [Manifest r2](../tests/evidence/r09/t02-build-r2/build-manifest.json) SHA256 `f711b411cfcb592398a6782d9a3efde5fe84c38259cf8a493402c1ec091d379c`,51file source và824vendorfile. [Kiểm tĩnh](../tests/evidence/r09/t02-build-r2/static-review.json) qua, chưa xác nhận compile/runtime. R1 source/manifest/log giữ nguyên trong Git/receipt.

```sh
node scripts/t02/run.mjs docs/t02/build-manifest.json --approved-manifest-sha256 f711b411cfcb592398a6782d9a3efde5fe84c38259cf8a493402c1ec091d379c
```

Chạy từ root pilot bằng Node24 có sẵn. Image không đổi: `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92` linux/amd64. Không cài/pull/build image.

## Quyền đề nghị cho lượt mới

Một lượt mới tối đa2giờ,4container tuần tự dev/ASan+UBSan/TSan/release, mỗi container30phút,2CPU/4GiB/256PID. Đây là hạn mức mới cần duyệt, không coi quyền một lượt r1 còn dùng lại. R1 đã giữ22.5MiB build/log; r2 thêm tối đa8GiB đĩa (tổng hai lượt tối đa8GiB+22.5MiB), trong đó data/log tối đa2GiB. Giữ host free100GiB. Không download/network/hostport. Source/vendor read-only, output CREATE-only, cùng sandbox/cleanup/monitor2s như r1; không phải hard filesystem quota.

Chạy đầy đủ formatter18, CMake/build, CTest46nhóm, collector/JUnit, clang-tidy dev và HTTP trên nguồn r2; không skip hoặc retry để xanh. FAIL dừng và giữ log, không tự đổi nguồn rồi chạy lại bằng grant này. Cleanup chỉ đúng IDs/labels lượt mới; không prune, không xóa nguồn/cache/evidence. Không cloud/PROD/Web/native/AI trial hoặc mở R10. PASS chỉ backend component, chưa tự nghiệm thu T02/R09 hoặc137case ứng dụng.

**Đề nghị duyệt một lượt build r2 theo đúng manifest/giới hạn trên.** Gate này đến từ [gói r1 đã duyệt](R09_T02_BUILD_REVIEW.md): “Một lượt≤2giờ” và “lỗi dừng lượt, giữ FAIL. Source đổi cần manifest revision mới trước lượt khác.”
