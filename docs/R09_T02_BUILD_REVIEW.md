# R09-T02 build r1 — gói trình duyệt

**APPROVED và đã thực thi — FAIL compile.** Human “Tôi duyệt” cho gói tại b1d27b5. [Kết quả r1](../tests/evidence/r09/t02-build-r1.md); quyền một lượt đã dùng, [r2 chờ duyệt](R09_T02_BUILD_R2_REVIEW.md). Nội dung dưới giữ nguyên gói đã trình. Human đã duyệt authoring tại `cdd6ee5`; [kết quả viết nguồn/kiểm tĩnh](../tests/evidence/r09/t02-authoring-r1.md). Gói này xin đúng quyền build/test mới, không xin lại B/C hoặc nghiệp vụ.

## Nguồn và lệnh thực

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, local master, không remote. Source commit `db7b7efe9b48d265ca7b09ac9334779db2446f1e`; HEAD sau manifest/checkpoint `301d349f51aba0776ba541708e7000a818ffec89`. [Manifest bất biến](../tests/evidence/r09/t02-authoring-r1/build-manifest.json) khóa51file source/input và tham chiếu lock824file vendor, đã đối chiếu cả working tree/Git. SHA256 manifest:

`6d9c125316ad6d2c88ceba54cae8a93e6b29d7c6d6c49918ebb15ee12eb506f9`

Lệnh từ root pilot, chỉ sau khi Human duyệt:

```sh
node scripts/t02/run.mjs docs/t02/build-manifest.json --approved-manifest-sha256 6d9c125316ad6d2c88ceba54cae8a93e6b29d7c6d6c49918ebb15ee12eb506f9
```

Dùng Node24 đã có; runtime path không là binary lock đa máy. Docker image cố định `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`, linux/amd64. Không Dockerfile/build image/pull/download, không tái dùng exception/deadline R08.

## Quyền đề nghị

Một lượt≤2giờ,4container tuần tự dev/ASan+UBSan/TSan/release, mỗi container≤30phút;2CPU/4GiB/256PID. Đĩa mới cộng≤8GiB; data/log cộng≤2GiB; giữ host free≥100GiB. Networknone,0porthost,0download, user1000, rootFSread-only/cap-drop/no-new-privileges. Chỉ source/vendor mount đọc; build/out/tmp mới được ghi.

Output mới ở `/Users/kendrick/Desktop/kidea-t02-build-lab/t02-<UUID>/`. Lệnh có thật trong `scripts/t02/build.sh`: formatter/dev clang-tidy, CMake preset/build, CTest46nhóm, collector/JUnit và HTTP test với binary mới. Ghi source/tool/package/artifact identities và stdout/stderr. Không skip/retry cho xanh; lỗi dừng lượt, giữ FAIL. Source đổi cần manifest revision mới trước lượt khác. Giới hạn disk lấy mẫu2s, vượt ngưỡng thì dừng; không gọi là hard filesystem quota.

Cleanup chỉ stop/rm đúng container IDs/labels của lượt, có readback; giữ source/samples/cache/output/log/DBfake. Không prune, không cloud, không public deploy, không trust/cấu hình macOS. Không Web/browser/AItrial/GCP/PROD/native hoặc view đã hoãn.

## Kết quả được phép kết luận

PASS nếu các gate component đều qua trên chính source cuối và manifest/hash giữ nguyên. Đây là bằng chứng backend component T02, chưa đủ toàn137case, HTTPS/Web/outbox delivery/observer/backup/performance, không tự nghiệm thu T02/R09/R10. Có thể phát hiện lỗi compile/lint/runtime lần đầu; authoring chưa tuyên bố không có lỗi.

**Đề nghị Human duyệt T02 build r1 đúng manifest và giới hạn trên.** Lý do cần quyền mới: [gói authoring đã duyệt](../proposals/r09-t02-authoring-r1.md) ghi rõ “chưa cấp chạy build/container”.
