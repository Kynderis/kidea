# R08 C1 — kiểm độc lập host trên Google Cloud

**Kết quả:** [PASS_SCOPED/CLEANUP_VERIFIED](../tests/evidence/r08/cloud-execution-r1.md) trên manifest cuối `dfe4fd664f81b142554b231d01700cef5b7408fa29876c5ad1b079d589b738af` (c4).8VM tạo thành công qua4attempt, không quá2VM đồng thời;~50phút47giây cộng dồn trong deadline2giờ gốc. Ba FAIL giữ nguyên; mọi tài nguyên cloud lab đã thu hồi/đọc lại, manifest đã dùng. Không chạy lại cùng output/deadline hoặc xin Human tự dọn VM. R08 còn [nghiệm thu kết quả](../docs/R08_ACCEPTANCE.md).

2026-09-17. Thực hiện trong quyền Human đã cấp project `kidea-508908` và yêu cầu tiếp tục hoàn thành R08. Không production, không mở IP công khai hoặc cài công cụ lên Mac. SSH key dành riêng lab nằm trong `.test-output` quyền riêng; không dùng secret do Human gửi chat, không đưa key/session/CA private vào Git.

**Điều chỉnh thực thi trong cùng deadline/ngân sách:** attempt1 thiếu capacity e2-small ở us-central1-f; chuyển observer sang us-central1-c. Attempt2 tải đúng image nhưng Docker COS dùng config digest, khác OCI manifest ID mà Docker Desktop trả về. [Đối chiếu archive/config/layer](../tests/evidence/r08/b2-execution-r1/cloud-image-identity.json) chứng minh cùng image; sửa payload nhận diện bằng config digest `sha256:3cb8645544bb2ac9d0d5e76262ed142341ebfb798a593cc0b7c358eb6e0dc54b`, có readback sau load. Không pull/build/đổi dependency. Hai attempt lỗi đã cleanup/readback rỗng; giữ source/log/summary riêng. Attempt3 dùng tên c3 để tách SSH host key; workload zone-a, observer zone-c. Số lượt tạo thực tế có thể vượt3 dự kiến do retry, nhưng không vượt2VM cùng lúc; deadline tuyệt đối vẫn `2026-09-17T12:07:13.704Z`, không cộng thời gian/ngân sách. Các thông số gói ban đầu dưới đây giữ để truy vết.

## Gói cụ thể

**Sửa packaging sau attempt3:** runtime COS có `/var` noexec, đã đọc mount thực; bind binary từ đó trả permission denied trước khi backend chạy. Dùng volume payload do Docker quản lý, nạp bằng container tạm user0/cap-drop/readonly-root/network-none rồi runtime user1000 mount volume readonly. Không remount hoặc hạ bảo vệ COS. Smoke tái hiện noexec và cùng Caddy bytes chạy được trong volume; lượt đầu copy bị từ chối vì image mặc định user1000, đã giữ FAIL và kiểm lại init user0 cùng runtime user1000. [Mount thực](../tests/evidence/r08/cloud-execution-r1/66255bdcaf/mount-diagnostic.json), [smoke PASS](../tests/evidence/r08/b2-execution-r1/cloud-volume-smoke-2.json), [runtime không root](../tests/evidence/r08/b2-execution-r1/cloud-volume-runtime.json). Căn cứ [filesystem COS](https://docs.cloud.google.com/container-optimized-os/docs/concepts/disks-and-filesystem). Artifact/image/config ứng dụng và deadline không đổi; attempt kế tiếp phải chạy lại đầy đủ cloud.

Một workload `e2-standard-2` tại us-central1-a và observer `e2-small` tại us-central1-f, subnet riêng10.88.0.0/24,20GB pd-standard mỗi VM. Ảnh COS `cos-stable-121-18867-584-7`, x86_64, READY/10GB được đọc từ API. Docker/runtime dùng image ID B1 có sẵn, export/upload; không pull/build image hoặc cài package trên VM. Tối đa2VM cùng lúc, tối đa3lần tạo: workload gốc bị xóa rồi tạo replacement, observer giữ nguyên.

Manifest cố định deadline tuyệt đối2giờ, không cộng lại khi sửa runner hoặc tạo replacement. Mọi VM có instanceTerminationAction DELETE và boot-disk-auto-delete; đọc lại scheduling/disks/private NIC. Controller finally xóa VM/disks/firewall/subnet/network và đọc lại. Firewall chỉ IAP35.235.240.0/20→SSH22 và observer-tag→workload-tag TCP8443/9444. Không service account trên VM. IAP API có thể bật theo quyền hiện hành; không sửa cấu hình SSH chung trên Mac, dùng key/known-hosts riêng và IAP ProxyCommand.

Artifact backend/Web/Caddy từ B1/B2 đã khóa; tiện ích SQLite3.53.4 và job/observer có hash trong payload. Runtime fixture CA/session riêng, TLS được xác minh cả API ứng dụng và kênh backup; không bỏ certificate validation. Chỉ dữ liệu lab. Backup service có bearer token riêng và SQLite source connection READONLY, mount source readonly; dùng backup API với WAL thực, kiểm integrity/schema/counts và SHA256. Observer fsync dữ liệu/metadata/log tại VM khác, ghi cảnh báo local, không email/Slack.

## Phép kiểm

1. Deploy artifact thật; đọc hash executable đang chạy và database qua backend container.
2. Job admin ghi định kỳ, readback, TLS backup về observer; chứng minh tiến triển sau khi launcher SSH thoát.
3. Xóa workload VM và boot disk; observer còn chạy, ghi ALERT và giữ snapshot checksum hợp lệ.
4. Tạo workload mới cùng config/artifact từ payload đã khóa, restore bằng SQLite backup API từ snapshot lấy trên observer. So khớp integrity/schema/bốn bảng, rồi job và backup phục hồi.
5. Xuất evidence trước khi xóa mọi tài nguyên lab; kiểm danh sách instance/disk/address/firewall/network không còn tài nguyên mang tên lab.

Đây là lỗi mất VM/workload thực và tách zone, không là chứng nhận mọi sự cố vùng/production hoặc benchmark. Không cần tắt Mac để thực hiện; bằng chứng phải chỉ rõ không còn kết nối SSH điều khiển khi job tiến triển. Còn kiểm cuối và Human nghiệm thu R08.

## Ngân sách và căn cứ

Theo [bảng giá E2 chính thức](https://cloud.google.com/products/compute/pricing/general-purpose), Iowa on-demand: e2-standard-2 khoảng0.06701142USD/giờ, e2-small0.016752855USD/giờ. Hai giờ cho workload+replacement nối tiếp và observer khoảng0.168USD compute; disk/network tính riêng. Gói dự phòng nội bộ2USD, dưới mục tiêu10USD/đợt hiện hành; không coi đây là hard cap billing hoặc đã xác minh số dư300USD. Image/payload upload khoảng0.6GiB mỗi VM; download evidence giới hạn nhỏ, không external IP/static IP, GPU, commitment hoặc snapshot GCP.

Deadline DELETE dựa trên [tài liệu giới hạn runtime của VM](https://docs.cloud.google.com/compute/docs/instances/limit-vm-runtime), dùng termination-time cố định để không kéo dài khi restart/replacement. Network/firewall không có TTL tiền phí; controller thu hồi chúng, còn VM/disk có lịch xóa phía cloud nếu mất phiên điều khiển.
