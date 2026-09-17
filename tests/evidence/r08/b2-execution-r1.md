# R08 B2 local — PASS_SCOPED

2026-09-17. Quyền: Human yêu cầu tiếp tục hoàn thành R08; [gói thực thi](../../../proposals/r08-b2-execution-r1.md). Giữ nguyên artifact B1, không sửa live pilot hoặc rebuild bản ứng dụng.

Lượt cuối manifest `c631566a19d9f37c48de85c357dab834e297981a60e59df87d54d85eec08edbb`: [summary](b2-execution-r1/attempt-3/summary.json), [source/manifest](b2-execution-r1/attempt-3/source/manifest.json).11nhóm kiểm đạt trên hai target LAB DEV/LAB PROD với cùng main/child, config riêng.71container của lượt cuối đều dừng; không download/host port. Runtime2CPU/4GiB tổng, network internal. Nguồn/artifact được kiểm hash trước/sau, helper/source readonly. Thời gian587.094ms là cộng dồn từ bắt đầu lượt đầu, không reset60phút khi sửa harness.

Mỗi target đạt HTTPS38/upstream15/header3/browser8 (128case HTTP/browser trên hai target), cùng các phép kiểm thực sau:

- Readback hash executable đang chạy của backend/Caddy và tiến trình Node Web, artifact/image/config cố định.
- Dừng Web: backend vẫn khỏe nhưng public request502; giữ PARTIAL rồi khôi phục. Mất phản hồi tại ranh giới controller sau POST thực: giữ UNKNOWN, đọc lại intent/counts, không replay.
- Backup SQLite3.53.4 bằng API, so integrity/schema/bốn bảng; ALTER TABLE trên bản sao riêng bị compatibility gate chặn. Thay dữ liệu sau backup, restore sang DB mới, kiểm số liệu và admin/viewer qua backend thật.
- Caddy drain normal/stuck: DEV1069ms/30321ms, LAB PROD902ms/30351ms. Ca thường giữ DONE; ca bị kẹt giữ UNKNOWN, không tạo DONE giả; exit0 và trong giới hạn5s/29–35s.

## FAIL và bản sửa được giữ

1. [Attempt1](b2-execution-r1/attempt-1/summary.json): image Playwright nền không có certutil. Container R05 trước đây có công cụ/Node được bổ sung ở writable layer; không coi image ID là đã bao gồm chúng. Export chỉ đọc certutil và Node24.19.0 từ container đang dừng, đối chiếu byte với archive R05 hiện có (deb hash đã khóa), mount readonly vào browser mới. [Hash/provenance](b2-execution-r1/browser-tools.json),0download/không cài macOS/không bỏ TLS. Exact source attempt1 được phục hồi từ bản sửa và kiểm khớp từng hash manifest.
2. [Attempt2](b2-execution-r1/attempt-2/summary.json): gửi SIGTERM trong docker exec làm Caddy kết thúc và Docker giết tiến trình gửi tín hiệu, trả137. Sửa giao thức điều khiển: xác minh PID/hash trước request, gửi tín hiệu qua exec tách rồi đọc docker wait/client riêng. Giữ kiểm exit0/thời gian/kết quả drain.
3. [Attempt3](b2-execution-r1/attempt-3/summary.json): chạy lại đầy đủ cả hai target trên nguồn cuối, PASS. Mọi FAIL/raw command/stdout/stderr/source snapshot được giữ; không sửa kỳ vọng hoặc bỏ ca.

## Chuẩn bị cloud và lượt cuối

Backup service TLS mới đã kiểm bốn kiểu token sai, CA thiếu, backup SHA256/schema/counts. Smoke đầu dùng file WAL đã đóng nhưng mount nguồn readonly thiếu SHM nên503; fixture sửa bằng backend thật đang mở WAL ở volume chia sẻ, backup vẫn mount readonly và dùng connection READONLY. [FAIL](b2-execution-r1/cloud-backup-smoke.stderr.txt), [PASS](b2-execution-r1/cloud-backup-smoke-2.stdout.txt). Không thay đổi kiểm quyền/TLS hoặc SQLite API.

B2 local không chứng minh host độc lập. [Gói cloud](../../../proposals/r08-cloud-execution-r1.md) và kiểm cuối được thực hiện riêng; R08 chưa DONE trước tổng hợp bằng chứng và Human nghiệm thu.
