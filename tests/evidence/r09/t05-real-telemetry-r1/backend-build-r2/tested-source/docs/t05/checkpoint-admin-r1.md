# T05 checkpoint quản trị Web

T04 đã được Human nghiệm thu “phê duyệt T04 và làm tiếp nhé”; public APPROVE/CLOSE/COMPLETE và SELECT/START hoàn tất. W-009-ADMIN-OPS IN_PROGRESS, không đổi T05 thành COMPLETE.

Nguồn Web `e613270` có 63 unit, kiểm kiểu/lint/build PASS; 18 SSR–Chrome Mac PASS. HTTPS/backend T04 thực với Web mới: r1/r2 FAIL vì bài kiểm nhập trước khi chuyển trang xong; r3 28 PASS; r4 trên nguồn cuối 29 PASS, thêm GET mâu thuẫn cùng version phải khóa mutation. Giữ nguyên kiểm cũ và bằng chứng FAIL. Không bypass TLS. R4 không là G2 toàn ứng dụng.

Receipt đầy đủ ở repo Kidea `tests/evidence/r09/t05-admin-r1` và `t05-integration-r1`…`r4`; báo cáo `docs/R09_T05_PROGRESS.md`. Manifest r4 SHA256 `2f7371aa1343c06dacd2a7b0e85080a4cf9ff652f93375454813895bd97881e3` đóng băng source/build/dependencies và backend artifact T04.

Tiếp tục: hoàn thiện AD-T01–15, outbox/WSS/heartbeat/reconcile, observer/backup/readiness/restore và kiểm tương ứng. Hiện admin form dùng đọc đối chiếu; chưa đáp ứng toàn hợp đồng cập nhật trực tiếp. Các gate T08 Human PROD, G2/nghiệm thu cuối giữ nguyên; không xin lại quyền chạy kỹ thuật từng lượt. Không cloud, deploy hoặc cài hệ thống trong lát này.
