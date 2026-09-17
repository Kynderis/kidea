# R08-B1/B2 — chuẩn bị build và vận hành local

2026-09-17. **B1 PREPARED / BUILD_NOT_RUN; B2 PLAN_ONLY.** Human giao “Làm đi” sau `14597c9`, rồi xác nhận chưa có server và “bạn dùng docker trên máy đi”. Dùng Docker local, không yêu cầu server lúc này; chưa coi cùng Mac là host độc lập. [Gói B1 để duyệt](../../../proposals/r08-product-build-r1.md), [ma trận B2](../../../proposals/r08-local-delivery-ops-r1.md).

## Đã làm trong phạm vi chuẩn bị

- Đọc roadmap/handoff, nghiệm thu R05 và giới hạn R2-A.78file backend khớp nguồn R05 r5. Snapshot riêng1051file/18.288.846byte gồm vendor và Web, không sửa live pilot; [input manifest](../../r08/product-build-r1/inputs.json).
- Export npm cache từ container đã dừng qua Docker cp chỉ đọc:31.351.296byte. Không start/exec container, không tải package. [Receipt](product-preparation-r1/cache-export.json), [kiểm tar/SHA512](product-preparation-r1/cache-integrity.json):187đối tượng content khớp, không symlink/path traversal. Cache đủ cho npm offline hay không còn phải chạy B1; không tự tải bù.
- [Inventory image local](product-preparation-r1/inventory.json) xác nhận toolchain/browser ID/amd64 hiện còn. Không build/pull image. Snapshot/cache ở `.test-output/r08-product-inputs-r1`, không commit cache hoặc vendor trùng; manifest giữ hash để từ chối input trôi.
- Viết main/child/guard cho3stage C++/Web/browser trong Docker, nguồn readonly, đầu ra sạch,1container mỗi lúc. Có gate digest+ngoại lệ, source closure/symlink, deadline/disk guard trước lệnh và theo dõi2giây; dừng container thuộc gói nếu lỗi, giữ output.
- [21docs pilot](product-preparation-r1/pilot-integrity.json) nguyên hash, chưa có `.kidea`; không thay rule/profile hoặc giả checkpoint. Không sửa helper runtime/schema Kidea.

## Kiểm local trên nguồn cuối

Round1 đã có2/2unit, shell syntax, gate thiếu approval và core283PASS. Sau review bổ sung disk check trước mỗi lệnh (ngoài monitor khi chạy), chạy lại đầy đủ tại [round2](product-preparation-r1/round-2/verification.json):2/2unit, Node/shell syntax, gate từ chối thiếu approval và core283/283PASS,0skip; source không đổi. Raw cả hai lượt giữ nguyên. Đây là kiểm code chuẩn bị, **không là build C++/Web hoặc Docker guard live PASS**. Không chạy AI/benchmark lịch sử.

Manifest cuối: `adb913ee7257a5bba9f41662eb5559164641105eadfa64b754d479392388d2d0`. Lệnh đề nghị sau duyệt:

```text
node tests/r08/product-build-r1/run.mjs --approved-manifest adb913ee7257a5bba9f41662eb5559164641105eadfa64b754d479392388d2d0 --approved-exception R08-TIDY-01
```

## Một lần duyệt còn cần

1. B1 một lượt Docker local tối đa60phút,2CPU/4GiB,đĩa thêm≤8GiB,giữ≥100GiB trống;0download/cài,0host port, không cloud. Build không là quyền deploy; artifact có hash rồi mới chốt B2.
2. R08-TIDY-01 chỉ đúng invocation SQLITE_TRANSIENT trong file domain hash đã khóa, SQLite3.53.4/clang-tidy18.1.3; chỉ hiệu lực lượt B1 này. R05-TIDY-01 đã hết hiệu lực nên chưa được áp lại. Giữ copy lifetime, warnings-as-errors/sanitizer và mọi ca kiểm; không miễn an toàn hoặc sửa nguồn để lấy PASS.

Lý do cần approval này: ngoại lệ mới và ngân sách build mới ngoài lượt R2-A đã dùng; nguyên tắc ngoại lệ tại rules/exceptions của pilot bắt buộc có duyệt. Gói đã có nguồn/cache/lệnh/giới hạn, không xin quyền chạy mơ hồ.

B2 đã phân rã deploy đúng artifact, HTTPS/role/Origin/CSRF/lifecycle, backup/restore đúng contract, job/alert tiếp tục sau launcher exit và toàn lượt G2. Chưa thể khóa artifact B2 trước build thật; không nhận nó EXECUTION_READY hoặc thay bằng bản cũ. Dùng Docker local theo Human chọn; mất cả Mac/observer độc lập vẫn NOT_PROVEN. R08 còn mở và cần nghiệm thu phạm vi cuối, không tự chuyển hết gate sang R09.
