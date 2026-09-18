# Quyền thực thi trọn R09

Human: **“Duyệt phạm vi trọn R09 như trên”** (2026-09-18).

Cho phép làm liền mạch phần R09 còn lại: sửa code, bổ sung test, build Docker, kiểm Chrome, hồi quy, lưu bằng chứng, cập nhật tài liệu, commit/push Kidea. Pilot Git local không remote. Được chạy lại sau sửa lỗi, không xin duyệt từng manifest/lượt; bao gồm build r7 đã chuẩn bị. Manifest vẫn phải đóng băng nguồn và lưu bằng chứng mỗi lần.

Giới hạn chung: máy/Docker hiện có, ≤4 giờ mỗi lượt kiểm, ≤2CPU/4GiB mỗi container; đĩa phát sinh cộng dồn≤20GiB tính từ [baseline](../tests/evidence/r09/full-scope/authorization.json), host còn≥100GiB. Không reset ngân sách sau lỗi; giữ bằng chứng. Các giới hạn hẹp của runner hiện hành vẫn giữ nếu không cần thay.

Chỉ dừng hỏi khi đổi nghiệp vụ/phạm vi đã chốt; nới tiêu chí an toàn hoặc thêm ngoại lệ ngoài EX r2; cài công cụ/thay cấu hình máy; phát sinh chi phí/cloud/deploy; phá huỷ dữ liệu; vượt giới hạn. Không tự nghiệm thu; khi đủ bằng chứng trình một gói nghiệm thu R09 cuối. Những gate thực sự cần Human đóng vai PROD còn hiệu lực. Android/iOS Future, Apple Silicon NOT_RUN, R10 chưa mở.

Quyền này thay yêu cầu xin duyệt riêng từng lượt build trong hồ sơ cũ, gồm EX r2/build r7 và các hạn chế authoring-only trước đó trong phạm vi nêu trên. Không phải cho phép nới ngoại lệ hoặc tự duyệt sản phẩm.
