# R08 — gói kết quả để Human nghiệm thu

2026-09-17. **REVIEW_READY_PENDING_HUMAN / R08 IN_PROGRESS; phần triển khai và kiểm trong phạm vi R08 đã hoàn tất.** Human đã cho tiếp tục B1/B2 và dùng/thu hồi VM GCP; quyền thực thi không tự là nghiệm thu kết quả. Baseline trước lượt này `f51af4f7b4a3549bddd9a0e77d5cd9062200664a`, master/Kynderis/kidea. [Review cuối](../tests/evidence/r08/final-r1/review.json) xác nhận nguồn/bằng chứng khớp; còn đúng gate Human nghiệm thu kết quả, không thiếu quyền kỹ thuật hoặc công cụ.

## Nội dung nghiệm thu

[Bản kê hash của gói](../tests/evidence/r08/final-r1/receipt.json) ràng buộc source/docs và payload bằng chứng được bàn giao; giữ mọi lần FAIL/PASS, không dùng baseline Git trước lượt này thay hash nguồn thực thi cuối.

| Task | Đầu ra và bằng chứng |
|---|---|
| R08-T01 — Kế hoạch sản phẩm | Hướng dẫn phân rã, dependency/output/test/gate và quyền plan khác code;14tình huống [review r1](../tests/evidence/r08/implementation-r1.md). Đây là self-review có phạm vi, không là trial agent độc lập. |
| R08-T02 — Code và bằng chứng | Vòng code/rule/map/review, G2 toàn dự án; [B1 sạch](../tests/evidence/r08/product-build-execution-r1.md), [lượt cuối local](../tests/evidence/r08/final-r1.md),6mutation phát hiện đầy đủ; giữ mọi FAIL. |
| R08-T03 — Build/môi trường/deploy | Artifact B1 đã khóa; [B2](../tests/evidence/r08/b2-execution-r1.md) cùng main/child trên LAB DEV và LAB PROD, config/network/data riêng; HTTPS/browser/drain thật. |
| R08-T04 — Release/phục hồi | [R2-A15vector](../tests/evidence/r08/lab-r2-execution-r1.md) cho revision/quyền/target/attempt/unknown; B2 dùng SQLite backup API, kiểm schema/integrity/bốn bảng, restore và quyền admin/viewer. LAB PROD không phải production và không cấp quyền AI chạy PROD thật. |
| R08-T05 — Bản thực chạy | B2 đọc hash executable/process/artifact/config, smoke và dữ liệu sau restore; lỗi Web giữ PARTIAL, mất reply sau commit giữ UNKNOWN rồi reconcile, không replay. [Cloud](../tests/evidence/r08/cloud-execution-r1.md) đọc executable thật và HTTPS Web/API trên cả VM gốc/phục hồi. |
| R08-T06 — Khép hướng dẫn/ops | Hướng dẫn incident/cleanup/SEO và lỗi quyền/target/script; cloud job/backup tiếp tục khi SSH đóng, observer cảnh báo sau mất VM/disk thật, VM mới restore đúng snapshot56record/bảng rồi job tăng65. [Cleanup toàn bộ prefix lab](../tests/evidence/r08/final-r1/cloud-cleanup-all.json) xác nhận7loại tài nguyên rỗng; mọi container R08 local đã dừng. |

## Giới hạn giữ nguyên

- Đây là hướng dẫn Kidea cùng bộ script/diễn tập hữu hạn bằng sample và artifact thực. Không biến action Kidea thành engine tự code/deploy sản phẩm; runtime vẫn giữ giới hạn hiện hành.
- Không production thật, không chứng nhận performance, không suy đủ137ca ứng dụng pilot từ sample. Review14tình huống không thay thực nghiệm agent độc lập.
- R09 pilot thật và R09-T14 vẫn NOT_RUN, bắt buộc theo roadmap. R09 và R10 chưa được mở bởi gói này; đó là hai phase lớn còn lại sau khi R08 được nghiệm thu.
- Android/iOS Future chưa roadmap. Apple Silicon NOT_RUN. Windows không có lượt hồi quy mới từ bằng chứng Mac Intel/Linux này; Chrome-only của view Kidea không tự thu hẹp browser matrix ứng dụng.
- Giữ bằng chứng Windows/R05/R06/R07,21docs pilot và source/artifact B1. Không sửa live pilot, khởi tạo `.kidea`, chạy lại AI/benchmark lịch sử, cài công cụ macOS hoặc mở public service.

**Phần Human cần xác nhận:** chấp nhận kết quả R08-T01–T06 và các giới hạn ở đây để khép R08. Có thể trả lời “Nghiệm thu R08”. Đây là gate Human của roadmap, không xin lại quyền B1/B2/GCP hoặc yêu cầu chạy lệnh/cài thêm. Khi chưa có xác nhận đó, phase giữ IN_PROGRESS; không tự ghi DONE. Sau nghiệm thu mới chuẩn bị/mở gói R09 theo quyền riêng, rồi R10.
