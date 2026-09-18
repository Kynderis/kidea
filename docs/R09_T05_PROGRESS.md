# R09 T05 — tiến độ quản trị và phần vận hành còn lại

Ngày 2026-09-18. T04 đã được Human nghiệm thu bằng “phê duyệt T04 và làm tiếp nhé”. Public APPROVE/CLOSE/COMPLETE thành công; SELECT/START đưa `W-009-ADMIN-OPS` tới IN_PROGRESS. Không có yêu cầu duyệt lại quyền thực thi từng lượt; [quyền trọn R09](R09_EXECUTION_AUTHORITY.md) giữ nguyên.

## Đã triển khai trong pilot local

Trang danh sách/tạo/sửa dành cho admin, quyền xác minh phía server; bản nháp không ra public. Mỗi ý định lưu mã và nội dung trước một POST; mất phản hồi/tải lại chỉ GET cùng mã. ID bản tạo lấy từ kết quả có thẩm quyền, không tìm theo tên.

Sửa chỉ gửi trường đã đổi; lịch là một nhóm. Đổi trạng thái tách khỏi lưu nội dung. Giảm sức chứa/đổi lịch có đăng ký/đổi trạng thái cần xác nhận. Khi đã phát hiện nguồn thay đổi, giữ phần nhập và yêu cầu đối chiếu; khi chấp nhận bản mới chỉ giữ trường người dùng đã sửa, không ghi đè các trường của người khác. Cùng phiên bản khác nội dung khóa mutation tới khi đọc đối chiếu hợp lệ. Đổi actor/quyền ẩn nội dung riêng và không lộ kết quả cũ.

Có [bản vá Web cố định](../tests/evidence/r09/t05-admin-r1/source-patch.json) để đối chiếu nguồn ngoài repo. Nguồn pilot `05d4895cfa8f6b13e6fe1a0745f7a7dd8504f6e4` thêm admin; nguồn cuối xem [môi trường/source receipt](../tests/evidence/r09/t05-admin-r1/environment-final.json). Pilot chỉ Git local, không remote. Backend release T04 `c168eea24192827fe4545368164c0e38e42b4e27` được dùng nguyên artifact, không build lại hoặc đổi backend trong lát này.

## Bằng chứng

- 63 unit PASS, kiểm kiểu không lỗi/cảnh báo, lint và build PASS: [checks-3](../tests/evidence/r09/t05-admin-r1/checks-3.json).
- 18 SSR–Chrome Mac PASS trên nguồn cuối: [log](../tests/evidence/r09/t05-admin-r1/server-3.stdout.log). Lượt server-2 chỉ có 11 SSR vì chưa đặt biến chạy browser; không nhận là Chrome.
- HTTPS/backend thật r1/r2 FAIL: bài kiểm nhập ô Tên trước khi chuyển từ trang tạo sang sửa xong. Chỉ chờ reactive chưa đủ; r3 chờ đúng URL và heading trang sửa, giữ nguyên assertion khóa nút và toàn bộ kiểm cũ, 28 PASS.
- HTTPS/backend thật r4: **29/29 PASS trên nguồn cuối**, [kết quả](../tests/evidence/r09/t05-integration-r4/run/browser/result.json), [manifest cố định](../tests/evidence/r09/t05-integration-r4/manifest.json). Không bỏ kiểm, không bypass TLS. Harness giữ 18 kiểm cũ và thêm quản trị, có trường hợp tiêm phản hồi GET mâu thuẫn (phải phân biệt với phản hồi backend thật).
- Giữ log check/lint FAIL ban đầu: kiểu route mới chưa được sync; ESLint bắt kiểu RequestInit và each chưa key. Đã sync bằng dependency sẵn có và sửa mã, không giảm kiểm.
- Ảnh quản trị 360px của r3 đã xem trực tiếp: không tràn ngang, trường nhập/nút đầy đủ. Không phải kiểm đủ mọi viewport/zoom/admin case.

## Còn phải thực hiện, không coi T05 hoàn tất

1. Hoàn thiện và kiểm ma trận AD-T01–15, lỗi field từ server, concurrency, audit/crash và các trường hợp chưa có bằng chứng; các ca hiện tại không thay 137 nghĩa vụ toàn pilot.
2. Outbox worker, WSS đúng audience/phiên/epoch, queue hữu hạn và auth trước mỗi lần phát; heartbeat, reconnect, stale/unknown và đo độ trễ. Poll đọc form hiện tại chưa thay hợp đồng WSS.
3. Telemetry/observer độc lập, SQLite online backup, watermark/verified destination, readiness và restore; kiểm cục bộ không chứng minh mất cả Mac. Chỉ xin quyền khi thực sự cần workload/cloud/cấu hình ngoài quyền hiện hành.
4. T08 Human PROD lab, T09/T10 thay đổi sau release/hotfix, T11–T14 và G2/nghiệm thu cuối vẫn mở. Android/iOS Future, Apple Silicon NOT_RUN, phase R10 chưa mở.

Giới hạn TSan EX r2 đã nghiệm thu ở T04 giữ nguyên, không đổi thành TSan sạch. Chưa deploy hay cài công cụ hệ thống.

Ngân sách sau kiểm: phát sinh cộng dồn 11.18 GB/21.47 GB (byte thập phân), host còn 351.46 GB; baseline giữ nguyên. Không còn container/network kiểm sở hữu đang chạy. `git diff --check` chỉ báo whitespace trong hai raw log FAIL; giữ nguyên byte bằng chứng, tài liệu/code viết mới sạch. Xem [budget](../tests/evidence/r09/t05-admin-r1/budget-final.json), [audit checkpoint](../tests/evidence/r09/t05-admin-r1/checkpoint-audit.json).
