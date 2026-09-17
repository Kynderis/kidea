# R08 R2-A — kết quả chuẩn bị lab

2026-09-17. **PREPARED / EXECUTION_NOT_RUN.** Human “Ok làm đi” sau commit `34aa6411ce2704c2a3936dccfaa2b931bc188c17` giao Docker inventory chỉ đọc và xây script/manifest để trình gói chạy. Checkout sạch lúc đầu, master/Kynderis/kidea. Không diễn giải thành quyền thực thi lab hoặc nghiệm thu r1/R08.

## Đã làm

- Đọc lại đầu vào R2, source/manifest R05 và gate KA-28. [Inventory thực](lab-r2-preparation/inventory.json): Docker Desktop/engine phản hồi, không container chạy; image toolchain đã inspect đúng ID/amd64/1.784.463.073byte,8volume lịch sử còn nguyên danh sách. Không start/exec/cp vào container lịch sử, không pull/build/prune.
- Viết [bộ script](../../r08/lab-r2/run.mjs): main/guard/deploy/client/service/migration/recovery, hai config và hai Web artifact khác hash nhưng cùng display version; không sửa helper/schema Kidea.
- Cố định [manifest](../../r08/lab-r2/manifest.json), SHA256 `243a7024769d4cc5daef78f7b0996f53690b680a72af7d0b36105d7eb9558d6d`. Source base là điểm xuất phát, file hashes nhận diện nguồn mới. [Gói xin chạy](../../../proposals/r08-lab-r2-execution-r1.md) có command graph, target/mount/permission, fault oracle, quota và recovery.

Đây là fixture giao thức release mới trên image có sẵn, không build lại Caddy/mẫu C++ R05, không đổi stack pilot. Không tái sử dụng waiver R05-TIDY-01. Backend là HTTP+SQLite dữ liệu giả; migration đổi version hợp đồng trong metadata và nội dung/role, không diễn tập ALTER TABLE hoặc mọi loại schema. Backup/restore là snapshot logic của fixture; kiểm admin là role giả của fixture, không chứng nhận RBAC sản phẩm. Những giới hạn này phải giữ cả khi lab PASS.

## Kiểm chuẩn bị

[Round1](lab-r2-preparation/verification.json): syntax,8unit, gate thiếu approval và core283PASS. Sau review đã bổ sung kiểm hash toàn package/non-root/local output vào recovery; không dùng PASS cũ cho nguồn mới.

[Round2 cuối](lab-r2-preparation/round-2/verification.json): syntax toàn script,8/8unit, hai entry từ chối thiếu approval và core283/283PASS,0skip. [Nguồn cố định](lab-r2-preparation/round-2/source-freeze.json). Hai lượt đầy đủ, giữ cả raw stdout/stderr và source-freeze; không chạy service Docker hoặc giả test Docker bằng mock. Expected exit1 cho thiếu approval là test âm, không phải lỗi lab. Node24 `node:sqlite` phát ExperimentalWarning trong unit, giữ nguyên stderr, không gọi zero-warning.

[Unit tests](../../r08/lab-r2.test.mjs) kiểm authority/revision/ID/overlap/source, closure file/hash/symlink, actual readback classification, unknown/replay, stale observer, Docker command isolation, transaction migration/replay bằng SQLite in-memory. Tự review code, không phiên AI/reviewer độc lập mới. Các test này không chứng minh HTTP/transport/restore/service lab đã chạy.

[Integrity](lab-r2-preparation/integrity.json):2.245evidence R05,4.088payload R07,21docs pilot,59runtime/test nguồn cũ khớp. Không thay live pilot hoặc evidence Windows/R05–R07. Core Node24 trên Mac Intel; Apple Silicon NOT_RUN.

## Phần cần duyệt tiếp

Chỉ xin **một lượt R2-A theo manifest trên**:0tải/cài,0host port,0cloud; tối đa1container/1CPU/512MiB,15phút,256MiB dự phòng toàn gói, giữ≥100GiB trống. Dữ liệu giả riêng, không mount pilot/secret/volume cũ. Có stop/recovery chỉ theo label exact run, giữ FAIL và data/log; không xóa tài nguyên lịch sử. R2-A chưa thực thi.

Sau R2-A vẫn phải đánh giá phần build/profile sản phẩm, tính độc lập host/observer và nghĩa vụ KA-28 chưa có; chưa đóng R08-T03–T06 hoặc tự chuyển hết sang R09. Human nghiệm thu cuối vẫn cần. R09-T14 giữ lượt view pilot thật, client Web/Chrome của Kidea và native Future không đổi.
