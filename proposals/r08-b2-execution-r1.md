# R08-B2 r1 — thực thi lab trên artifact B1

**Kết quả:** [PASS_SCOPED](../tests/evidence/r08/b2-execution-r1.md), manifest cuối `c631566a19d9f37c48de85c357dab834e297981a60e59df87d54d85eec08edbb` đã dùng; hai FAIL và lượt chạy lại đầy đủ được giữ. [Cloud](../tests/evidence/r08/cloud-execution-r1.md) và [kiểm cuối](../tests/evidence/r08/final-r1.md) cũng đã đạt; còn Human nghiệm thu R08. Không chạy lại cùng output/quota/deadline.

2026-09-17. Human yêu cầu “làm tiếp để hoàn thành R08”, trong quyền Docker lab và GCP đã cấp. Gói này cụ thể hóa phần local của B2; không production thật, không ghi pilot. Không áp lại R08-TIDY-01 hoặc rebuild ứng dụng.

Nguồn artifact: `tests/evidence/r08/delivery-inputs-r1.json`, B1 PASS. Main `tests/r08/delivery-r1/run.mjs` gọi child.mjs cho lab-dev.json/lab-prod.json; manifest khóa toàn bộ script/config trước chạy. Kiểm artifact/source đầu-cuối và script trước từng lệnh Docker. Lệch target/revision/source thì dừng. Mỗi lần chạy có output CREATE-only theo digest; giữ cả FAIL. Không chạy đè output cũ.

Hai target tuần tự, Docker internal network riêng, cùng backend/Web/Caddy thực. Không host port,0download, image ID cố định/pull=never, user1000, readonly root/cap-drop/no-new-privileges. Source/artifact readonly; DB/CA/tools/log fixture mới được ghi. Tối đa4container đồng thời: backend0.5CPU/768MiB, Web0.5/768MiB, Caddy0.25/512MiB, checker0.75/2GiB; tổng2CPU/4GiB. Container service timeout3300giây, checker180giây; controller60phút,8GiB đĩa thêm, giữ100GiB trống, log≤16MiB/lệnh/container. Giữ container dừng/network cách ly để truy vết; không prune dữ liệu cũ.

Tiện ích database.c chỉ dùng cho lab: compile bằng GCC13 trong image đã có, link đúng SQLite3.53.4 static library từ B1. Backup/restore qua sqlite3_backup vào đích CREATE-only, retry≤10giây; kiểm integrity/schema/bốn bảng. ALTER TABLE chỉ tạo DB lỗi riêng để chứng minh schema gate chặn; không deploy schema đó. Bản backup đã đóng được copy sang vùng restore rồi dùng backup API tạo database mới. Không copy riêng database đang WAL.

Mỗi target chạy HTTPS38/upstream15/header3/browser8; browser dùng NSS riêng, không bỏ TLS. Kiểm process/executable thực, Web artifact/image/config; dừng Web để quan sát PARTIAL; cố tình mất phản hồi ở ranh giới controller sau POST thành công, giữ UNKNOWN rồi đọc lại intent/counts trước retry, không replay. Backup, thay đổi dữ liệu, restore rồi kiểm dữ liệu/admin/viewer thật. Drain Caddy normal/stuck, lưu thời gian/kết quả. Session B được tạo lại trước browser vì HTTPS test đã revoke.

Đây là local B2, chưa có bằng chứng độc lập host. Tiếp theo đóng gói job/observer/backup trên GCP với thời hạn/thu hồi phía cloud và dự toán≤10USD/đợt. Còn kiểm cuối theo ma trận R08 và Human nghiệm thu; không tự đổi R08 thành DONE hoặc mở R09.
