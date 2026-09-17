# Nghiệm thu R08 — kế hoạch, code, phát hành và vận hành

2026-09-17. **APPROVED / R08 DONE trong phạm vi đã kiểm.** Human xác nhận nguyên văn: “Nghiệm thu R08”, chấp nhận gói kết quả tại commit `16b2223a75d96405cb2a9470f01f02e337c0d430`, master/Kynderis/kidea. Khép R08-T01–T06 cùng gate nghiệm thu phase; giữ đầy đủ giới hạn bên dưới. [Review cuối](../tests/evidence/r08/final-r1/review.json) và bằng chứng FAIL/PASS không sửa.

Trước ghi nhận đã đối chiếu30file source/docs và1.212file bằng chứng trong receipt: toàn bộ khớp. Receipt SHA256 `cfb4b9bff6c55e1a0af7a799b5acb50a2a8185a31bb075083031863d90c51b77`. Receipt lưu gói trước nghiệm thu; các thay đổi trạng thái trong biên bản/roadmap/bàn giao sau xác nhận này không ghi đè receipt lịch sử.

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

**Điểm tiếp tục:** chuẩn bị gói R09 — pilot thật và đường lỗi, giữ gate bắt buộc R09-T14; sau đó R10 — đóng gói, nghiệm thu, bàn giao. Nghiệm thu R08 không tự cấp quyền thực thi pilot, mở workload/build/AI mới hoặc production. Các nhãn chờ Human trong báo cáo/proposal/receipt cũ là lịch sử; biên bản này và roadmap là trạng thái hiện hành.
