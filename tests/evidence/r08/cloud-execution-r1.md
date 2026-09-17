# R08 — job/backup/cảnh báo/phục hồi trên host độc lập

2026-09-17. **PASS_SCOPED / CLEANUP_VERIFIED; chờ Human nghiệm thu R08.** [Summary cuối](cloud-execution-r1/dfe4fd664f/summary.json), [review tổng hợp](final-r1/review.json), [đọc lại toàn bộ prefix lab](final-r1/cloud-cleanup-all.json). Quyền [GCP hiện hành](../../../docs/R08_GCP_AUTHORITY.md), [gói thực thi và sửa packaging](../../../proposals/r08-cloud-execution-r1.md). Không production thật hoặc chứng nhận performance.

## Nguồn và giới hạn thực thi

Baseline repo `f51af4f7b4a3549bddd9a0e77d5cd9062200664a`; artifact backend/Web B1 và Caddy không thay. Cloud dùng image B1 export, archive SHA256 `0e5b736b7aeb38a7dc1d84d7b8379c65c4234a46fa3953220b887cd414b5bf09`. [Chuỗi OCI manifest→config→rootfs](b2-execution-r1/cloud-image-identity.json) giải thích ID khác giữa Docker Desktop/containerd và COS/classic Docker; không đổi image/dependency hoặc rebuild.

Mỗi attempt có source/manifest/raw command/exit/stdout/stderr và summary riêng. Deadline chung `2026-09-17T12:07:13.704Z` áp dụng VM DELETE/boot-disk-auto-delete và kiểm phía controller; không reset khi retry. `durationMs` trong summary là thời gian cộng dồn từ10:07:13.704Z, không cộng các summary để tính thời gian hoặc tiền. Tối đa2VM đồng thời; workload e2-standard-2, observer e2-small;20GB pd-standard mỗi VM. VM không external IP/service account, firewall chỉ IAP SSH và observer-tag→workload8443/9444. Không cài macOS, không email/Slack/public callback.

## Các FAIL được giữ

1. [18b70f1edf](cloud-execution-r1/18b70f1edf/summary.json): e2-small us-central1-f thiếu capacity. Workload đã tạo được, chưa deploy; cleanup/readback sạch. Chuyển observer sang us-central1-c trong cùng quyền/giới hạn.
2. [46e184075a](cloud-execution-r1/46e184075a/summary.json): exact archive load thành công nhưng caller dùng OCI manifest ID thay classic Docker config ID. Đối chiếu config/rootfs từ archive rồi sửa identity. Hai VM cleanup sạch.
3. [66255bdcaf](cloud-execution-r1/66255bdcaf/summary.json): backend bị permission denied trước khi chạy vì bind artifact từ `/var` noexec. [Mount thực](cloud-execution-r1/66255bdcaf/mount-diagnostic.json) và [filesystem COS chính thức](https://docs.cloud.google.com/container-optimized-os/docs/concepts/disks-and-filesystem) xác nhận nguyên nhân. Dùng Docker-managed volume, init copy bằng container tạm user0/cap-drop/network-none/readonly-root; runtime vẫn user1000/readonly payload. Không remount hoặc hạ bảo vệ COS. [Smoke noexec](b2-execution-r1/cloud-volume-smoke-2.json), [runtime user1000](b2-execution-r1/cloud-volume-runtime.json), [copy toàn payload/diff](b2-execution-r1/cloud-full-copy.json) đạt; FAIL copy đầu do image mặc định user1000 được giữ. Hai VM cleanup sạch.

Các lỗi SSH IAP tạm thời lúc VM vừa tạo được lưu nguyên; runner chỉ retry kết nối có giới hạn, không bỏ kiểm host key. Tar có cảnh báo xattr macOS không được COS hiểu; giữ log, archive checksum và byte comparison payload vẫn bắt buộc.

## Kết quả cuối

Attempt4 `dfe4fd664f81b142554b231d01700cef5b7408fa29876c5ad1b079d589b738af` đạt toàn bộ phép kiểm runtime và cleanup. Tổng thời gian cộng dồn cloud3.046.552ms (~50phút47giây), trong deadline2giờ gốc. Cả4attempt đều có cleanup=true; ba FAIL giữ nguyên.

| Phép kiểm | Kết quả thực |
|---|---|
| VM/image/artifact | COS121/build18867.584.7, Linux x86_64; Docker server27.4.1. Ba lần load cùng config/rootfs; backend/Caddy `/proc/1/exe` khớp artifact B1/B2. [Môi trường](cloud-execution-r1/dfe4fd664f/environment.json), [provenance payload](final-r1/cloud-provenance-final.json). |
| Web/API thật | VM gốc và VM phục hồi cùng HTTPS200, TLS CA/SNI được kiểm, noindex; Node process hash và entrypoint đúng. [Gốc](cloud-execution-r1/dfe4fd664f/workload-web-readback.json), [phục hồi](cloud-execution-r1/dfe4fd664f/recovery-web-readback.json). |
| Độc lập launcher | [Trước](cloud-execution-r1/dfe4fd664f/logs/040-before-disconnect.json)4nhịp khỏe → [sau SSH đóng](cloud-execution-r1/dfe4fd664f/logs/042-independent-progress.json)16nhịp; counts cả4bảng tăng4→16. Không có SSH điều khiển trong cửa sổ chờ20giây. |
| Mất host/disk | VM gốc bị xóa thật, [disk readback rỗng](cloud-execution-r1/dfe4fd664f/logs/044-command.json); [observer ALERT/UNKNOWN](cloud-execution-r1/dfe4fd664f/logs/046-host-loss-alert.json) vẫn giữ snapshot trên VM khác zone. |
| Restore VM mới | [Snapshot](cloud-execution-r1/dfe4fd664f/logs/050-off-host-backup.json) SHA `39d0db97da622b48ac625d1166b0ef90097364efd78d9255ce4acb206bd1bdc0`,56record mỗi bảng; [restore](cloud-execution-r1/dfe4fd664f/logs/067-restored-database.json) khớp cả schema/version/integrity/4counts qua SQLite API. |
| Job/backup hồi phục | [HEALTHY, counts65 mỗi bảng](cloud-execution-r1/dfe4fd664f/logs/070-recovery.json); không chỉ kiểm VM đã boot. [Archive trạng thái cuối](cloud-execution-r1/dfe4fd664f/state-final.tar.gz) đã tải trước cleanup; checksum DB đối chiếu metadata, [events](cloud-execution-r1/dfe4fd664f/final-events.jsonl) và [metadata cuối](cloud-execution-r1/dfe4fd664f/final-latest.json). |

Tổng8VM được tạo thành công qua4attempt (một yêu cầu tạo observer thiếu capacity); không quá2VM đồng thời. Mọi lần tạo/recovery dùng cùng deadline; không tăng ngân sách hoặc bật external IP. IAP API đã bật theo quyền, không tắt API dùng chung sau lab. Chưa xác minh số dư credit/hóa đơn thực; không coi dự toán nội bộ là hard cap billing.

Readback cuối cho mọi prefix `kidea-r08-` trong project: **instances/disks/addresses/firewall-rules/networks/subnets/snapshots đều rỗng**. Không còn tài nguyên compute/storage lab cần Human tự dọn; không chạm tài nguyên ngoài phạm vi. Local137container R08 đều dừng, giữ cache/log/volume phục vụ truy vết. [Bảo toàn cuối](final-r1/preservation-final.json) và [payload cuối](final-r1/cloud-provenance-final.json) đều PASS.

Phép kiểm không tắt Mac thực hoặc mô phỏng mọi thảm họa vùng. Khôi phục đúng snapshot gần nhất không đồng nghĩa không mất mọi write sau snapshot; không đưa ra RPO/RTO production. R08 còn Human nghiệm thu; R09 pilot thật/R09-T14 vẫn NOT_RUN.
