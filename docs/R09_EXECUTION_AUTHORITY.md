# Quyền thực thi trọn R09

Human: **“Duyệt phạm vi trọn R09 như trên”** (2026-09-18).

Cho phép làm liền mạch phần R09 còn lại: sửa code, bổ sung test, build Docker, kiểm Chrome, hồi quy, lưu bằng chứng, cập nhật tài liệu, commit/push Kidea. Pilot Git local không remote. Được chạy lại sau sửa lỗi, không xin duyệt từng manifest/lượt; bao gồm build r7 đã chuẩn bị. Manifest vẫn phải đóng băng nguồn và lưu bằng chứng mỗi lần.

Giới hạn chung: máy/Docker hiện có, ≤4 giờ mỗi lượt kiểm, ≤2CPU/4GiB mỗi container; đĩa phát sinh cộng dồn≤20GiB tính từ [baseline](../tests/evidence/r09/full-scope/authorization.json), host còn≥100GiB. Không reset ngân sách sau lỗi; giữ bằng chứng. Các giới hạn hẹp của runner hiện hành vẫn giữ nếu không cần thay.

Chỉ dừng hỏi khi đổi nghiệp vụ/phạm vi đã chốt; nới tiêu chí an toàn hoặc thêm ngoại lệ ngoài EX r2; cài công cụ/thay cấu hình máy; phát sinh chi phí/cloud/deploy; phá huỷ dữ liệu; vượt giới hạn. Không tự nghiệm thu; khi đủ bằng chứng trình một gói nghiệm thu R09 cuối. Những gate thực sự cần Human đóng vai PROD còn hiệu lực. Android/iOS Future, Apple Silicon NOT_RUN, R10 chưa mở.

Quyền này thay yêu cầu xin duyệt riêng từng lượt build trong hồ sơ cũ, gồm EX r2/build r7 và các hạn chế authoring-only trước đó trong phạm vi nêu trên. Không phải cho phép nới ngoại lệ hoặc tự duyệt sản phẩm.

## Grant bổ sung — recovery observer r1, 2026-09-19

Human “tôi duyệt, làm tiếp đi” sau gói [recovery r1](../proposals/r09-observer-checkpoint-recovery-r1.md) cho phép đồng bộ prepared-request nội bộ 128 MiB, giữ source/copy/checkpoint 64 MiB; áp đúng patch đóng băng và chuyển đúng hai module/hash của operation `bef9054c-51f3-4f07-a54b-0892fc95247d`, plan `c176db9833e9359afde230eb0e620e40a4264896690a562c73260ac1e075589d`. Quyền completion mới chỉ UPDATE `.kidea/work.md` về retained planned bytes (nextAction/checkpointRef), readback/journal/retirement marker đúng operation; commit pilot local và commit/push Kidea sau kiểm. [Grant và phạm vi](../tests/evidence/r09/t05-observer-recovery-r1/authorization.json), [kết quả](../tests/evidence/r09/t05-observer-recovery-r1/preservation.json).

Đây không là migration tool tùy ý, thay runtime/module khác, miễn kiểm source/basis/owner/graph hoặc replay external effects. Không reset baseline tải/đĩa, tăng trần 4 giờ/20 GiB/free 100 GiB/container, cấp PROD/oncall hoặc nghiệm thu R09. Các quy tắc dừng hỏi cho phát sinh mới thật sự ở trên còn hiệu lực.
