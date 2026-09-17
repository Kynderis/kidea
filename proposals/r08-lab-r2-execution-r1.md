# R08 R2-A — gói chạy lab release local, r1

2026-09-17. **APPROVED / EXECUTED_SCOPED_PASS — Human “Duyệt nhé” trên `d245799`; một lượt đã chạy, xem [kết quả](../tests/evidence/r08/lab-r2-execution-r1.md). Không còn quyền tự chạy lại cùng manifest.** Human “Ok làm đi” sau `34aa641` giao inventory chỉ đọc và chuẩn bị script/manifest. Đây là bước tiếp của R2; không phải quyền chạy ngầm hoặc nghiệm thu R08.

## Mục tiêu và giới hạn chứng minh

Chạy một lab giao thức phát hành có backend HTTP, Web HTTP và SQLite thật trong Docker local, dữ liệu giả. Cố định artifact, nhận diện từng lần triển khai, quan sát service/data thật, tạo lỗi và phục hồi. Hai target `lab-dev`/`lab-prod` cùng script nhưng config/data riêng; `lab-prod` chỉ là tên môi trường giả, không phải PROD của ứng dụng.

Lab Node nhỏ này **không thay baseline C++/Web của pilot** và không build lại mẫu R05/Caddy; không dùng lại ngoại lệ R05-TIDY-01. Nó kiểm hợp đồng release, chưa chứng minh profile build sạch của sản phẩm, browser/rendering, independent host/observer hoặc vận hành PROD. R08-T03–T06 vẫn cần đối chiếu các nghĩa vụ chưa có trước khép; R09-T14 giữ nguyên. Không dùng local PASS để đóng các mục đó.

## Gói nguồn và tài nguyên cụ thể

[Manifest](../tests/r08/lab-r2/manifest.json) chứa SHA256 toàn bộ main/child/config/HTML/migration và source base `34aa6411ce2704c2a3936dccfaa2b931bc188c17`. Gói mới được nhận diện bằng hash file trong manifest, không gán nó cho base commit. Manifest SHA256: `243a7024769d4cc5daef78f7b0996f53690b680a72af7d0b36105d7eb9558d6d`, là đối số bắt buộc trước chạy.

Image local đã inspect: `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`,linux/amd64,1.784.463.073byte, mặc định user1000:1000. Nguồn R05 đã ghi Node24.19.0 trong toolchain; entry lab vẫn kiểm Node≥24 và ghi version thực khi chạy. Không coi inspect image là đã chạy runtime. [Inventory](../tests/evidence/r08/lab-r2-preparation/inventory.json): Docker29.8.0, Desktop4.91.0,VM12CPU/~7.75GiB RAM; không container nào đang chạy tại thời điểm đọc.

| Hạn mức một lượt đề nghị | Giá trị / cách cưỡng chế |
|---|---|
| Tải/cài/build image | 0; image ID cố định, `--pull=never`; không apt/npm/build |
| Container đồng thời | 1,1CPU,512MiB RAM+swap tổng,64PID; dừng target trước khi chuyển |
| Đĩa mới | output/bind data≤128MiB được kiểm trước từng lệnh; tmpfs16MiB/container; Docker log≤2MiB/container; tối đa8container dừng giữ lại; trần dự phòng toàn gói256MiB, không xóa cache cũ |
| Sàn đĩa trống | 100GiB trước từng lệnh có tác dụng phụ |
| Thời gian | 1lượt tối đa15phút,60giây/lệnh Docker; mỗi container có TTL10phút; không tự mở lượt thứ hai cùng manifest |
| Mạng/quyền | `--network=none`,0host port, không Docker socket, không privileged/capability, root filesystem readonly, user1000:1000 |
| Mount | snapshot script readonly tại `/src`; chỉ data giả target thuộc output lượt đó được ghi tại `/data`; không mount pilot, volume cũ hoặc secret |

Mỗi lệnh có stdout/stderr/status/time giữ tại output mới. Không có process AI/agent mới hoặc cloud. Docker stats/footprint chỉ là quan sát giới hạn được cấp; nếu vượt hạn mức thì giữ FAIL và dừng, không tăng trần. Heartbeat/backup cùng host chỉ kiểm stale và phục hồi dữ liệu lab, không độc lập host.

## Lệnh chính và đồ thị tác dụng phụ

Sau khi Human duyệt **đúng manifest SHA256**, dùng Node≥24 sẵn có từ root:

```text
node tests/r08/lab-r2/run.mjs --approved-manifest 243a7024769d4cc5daef78f7b0996f53690b680a72af7d0b36105d7eb9558d6d
```

Đối số không là một nguồn/target còn TBD: đó là khóa đối chiếu nội dung đã review, giá trị cụ thể trong báo cáo. Không nhận target/path/command tùy ý từ CLI.

1. `run.mjs` xác minh approval digest, toàn bộ tập file, user/local path; tạo lock độc quyền và output CREATE-only `.test-output/r08-lab-r2-<time>-<pid>`, snapshot và receipt. Từ chối chạy lại cùng manifest nếu đã dùng lượt; lock stale không tự xóa.
2. Docker `ps`/`image inspect` xác minh không workload đang chạy và image đúng. Không sửa container lịch sử.
3. `guard.mjs` kiểm target/grant/revision/ID/overlap; `deploy.mjs` tạo đúng tham số container offline, bind riêng, artifact/config cố định. Trước thay target giữ observed old state, attempt receipt và dừng container thuộc lượt đó.
4. `entry.mjs` chạy `backend.mjs` + `web.mjs`. Backend dùng `migration.mjs`, config target, SQLite trong data riêng; Web đọc HTML A/B đúng artifact, kiểm schema backend trước phục vụ. Hai HTML có cùng display version nhưng hash khác.
5. `client.mjs` qua `docker exec` chỉ gọi HTTP loopback nội bộ8011/8012 với timeout; không truy cập Internet hoặc host port. Mã HTTP/artifact/config/schema/admin/data thực là bằng chứng; `docker run` exit0 không đủ.
6. Main chạy các vector bảng dưới; finally unpause nếu cần, stop container thuộc đúng label run, giữ data/log/stopped container. `recover.mjs` là đường dừng sau controller crash, chỉ chọn exact run label từ receipt và không xóa dữ liệu/lock.

## Oracle diễn tập bắt buộc

| Vector | Kết quả cần đạt qua thực thi, chưa quan sát trong preparation |
|---|---|
| Baseline/reuse | Web A→B, backend artifact giữ nguyên; config/target/schema/service và HTTP response đúng |
| Target/grant/revision/ID/overlap | Từ chối trước gửi deploy, actual backend state giữ nguyên; không biến credential/reachability thành quyền |
| Child thay đổi | Copy có migration đổi hash bị chặn trước tác dụng phụ |
| Partial + retry | Web process exit17, backend vẫn đọc được; toàn release không VERIFIED; ID retry mới được giữ riêng |
| Lost receipt | Backend commit migration rồi đóng socket trước response; client UNKNOWN, đọc SQLite schema2/ledger1, quyết định DO_NOT_REPLAY |
| App rollback | Deploy Web A không đảo schema2; Web trả503, không nhận restored |
| Restore | Restore snapshot dữ liệu giả đã có trong đúng grant; schema1, nội dung original, admin role và luồng Web đọc lại đúng |
| Observer | Heartbeat tăng khi không có client request; Docker pause thật làm heartbeat stale→không healthy; unpause rồi tiếp tục. Không chứng minh host độc lập |
| LAB PROD | Cùng deploy code, config/data riêng, actual target readback lab-prod; không PROD thật |

Đây là suite hữu hạn, không bao phủ mọi race, mọi database hoặc ứng dụng. Negative unit tests preparation không thay các dòng lab trên. Không test browser ở lượt này.

## Dừng, recovery và phần còn sau lab

Mọi fail giữ receipt và làm lượt không PASS; không bỏ case hoặc đổi expected để đạt. Container readonly/TTL giới hạn hậu quả nếu mất controller. **Container đang pause sẽ không chạy TTL:** nếu controller mất đúng cửa sổ pause, cần chạy recovery đúng run sau đối chiếu receipt:

```text
node tests/r08/lab-r2/recover.mjs <run từ approval-basis.json> <manifest SHA256 đã duyệt>
```

Lệnh này chỉ unpause/stop tài nguyên mang exact label/name của lượt; giữ container/data/evidence/lock để review. Không `prune`, không xóa volume lịch sử. Sau thành công tự dừng workload; không tự dọn bằng chứng.

Sau lab, thu raw logs, source freeze, migration/readback/recovery và quota; đánh giá nghĩa vụ KA-28 đã/chưa chứng minh. Build/profile sản phẩm và độc lập host còn gate riêng; chưa có quyền cloud. R08 chỉ DONE khi đủ nghĩa vụ và Human nghiệm thu, không tự chuyển chúng hết sang R09.
