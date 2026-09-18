# R09-T04-OUTPUT-r1 — đầu ra hạn mức hai đăng ký

Ngày 2026-09-18. **Chờ Human review đầu ra, không phải xin phép build lại.** ID `R09-T04-OUTPUT-r1`, revision 1; mười owner là các nghĩa vụ trong public impact plan T04. Đã ghi đủ 10/10 kết luận qua public ASSESS, chưa CLOSE. Cây MVP còn dở và điểm quay lại `W-009-MAX2` được giữ nguyên. Xem identity/digest và danh sách owner trong [gói cố định](../tests/evidence/r09/t04-output-review-r1/prepared.json), [review thực](../tests/evidence/r09/t04-output-review-r1/review-file.md).

Whole-file SHA-256 của review revision 1: `ac2826b416a862e7b99659bbaa314cbd77d6ebf55e678d565fd90b25cb84e36b`. Purpose CONTENT; subject gồm báo cáo T04, nguồn/test cuối, responsibility mapping và 10 assessment; input gồm scope/completion/đầu vào của toàn bộ 10 owner cùng receipt cố định.

## Nội dung nghiệm thu giới hạn

- Backend và Web áp dụng tối đa hai đăng ký ACTIVE/người; đăng ký thứ ba bị từ chối, không chiếm chỗ.
- Hủy giải phóng hạn mức; yêu cầu cũ giữ nguyên kết quả, yêu cầu mới xét trạng thái mới. Giữ dữ liệu cũ vượt hai, không tự xóa/hủy.
- Đã kiểm lại toàn bộ code hiện có; không coi phần quản trị/sự kiện/vận hành chưa triển khai là hoàn tất.

## Bằng chứng trên nguồn cuối

Backend `c168eea24192827fe4545368164c0e38e42b4e27`, Web `de26fb6e646e57891464fc86a3058e635af336bf`; pilot là Git local không remote. [Receipt backend](../tests/evidence/r09/t04-build-r1/execution-receipt.json) xác nhận 91 file nguồn trong manifest không đổi sau chạy.

| Kiểm | Kết quả |
|---|---|
| dev, ASan/UBSan, release | Mỗi cấu hình 50 case/856 assertion PASS; giữ đủ 796 assertion gốc |
| TSan | Đủ 856 assertion; 43 case sạch, 7 case/14 report đúng hai cặp WAL EX r2 đã duyệt; không phải TSan sạch |
| HTTP/session/shutdown | Mỗi cấu hình 18/8/2 PASS |
| Policy/gate offline | 113 PASS |
| Web trên Mac | 34 unit, check/lint/build và 18 SSR–Chrome PASS |
| HTTPS với backend thật | [18 kiểm PASS](../tests/evidence/r09/t04-integration-r1/run/browser/result.json), TLS không bypass; Chromium Linux tách riêng Mac Chrome |
| Test lỗi cố ý | [4 mutant đều bị phát hiện](../tests/evidence/r09/t04-mutations-r1/run/result.json) |
| Truy vấn quota | [Dùng chỉ mục sẵn có](../tests/evidence/r09/t04-query-plan-r2/stdout.txt), không đổi schema |

Giữ raw FAIL decoder trước thay đổi, fixture policy cũ, query-plan r1 noexec và TSan CTest. Không bỏ case, thay expected gốc hoặc mở rộng ngoại lệ sanitizer.

## Phạm vi còn thiếu

Ba bản đồ đã cập nhật theo nguồn thật; implementation/traceability vẫn INCOMPLETE, giữ diagnostic về quan hệ chưa xác định và event chưa triển khai. [Kết luận từng consumer](../tests/r09/t04/semantic-assessments.json) chỉ áp dụng thay đổi quota. 137 nghĩa vụ toàn ứng dụng, performance/khôi phục độc lập, T05, T08 Human PROD, T09/T10, T11–14 và nghiệm thu R09 cuối vẫn còn. Apple Silicon NOT_RUN; Android/iOS Future không lịch; R10 chưa mở.

## Sau phản hồi

Nếu Human chấp nhận đúng gói trên: public APPROVE → CLOSE → quay lại W-009-MAX2, ghi kết quả thực rồi tiếp tục T05 theo quyền trọn R09. Không tái xin phép từng lệnh/build. Nếu có sửa nội dung: giữ bằng chứng cũ, REVISE gói và chỉ kiểm lại phần thực sự bị ảnh hưởng.

Đây là gate đầu ra được giữ trong [quyền thực thi](R09_EXECUTION_AUTHORITY.md) và hợp đồng [change](../.agents/skills/kidea/references/change.md): “CLOSE requires all current obligations resolved, no graph diagnostic/blocker, current source versions and approved gates for every impact item.” Test PASS không tự là Human approval theo [skill Kidea](../.agents/skills/kidea/SKILL.md).
