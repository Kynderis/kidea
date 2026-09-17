# R09-T02 — review tương thích TSan r1

Human duyệt review sau3fe4764. Đã đối chiếu rawr5, diagnosticr1, vendor SQLite nguyên hash và tài liệu chính thức compiler/sanitizer. [Kết luận/phương án cụ thể](../../../docs/R09_T02_TSAN_COMPAT_REVIEW.md), [nguồn tham khảo](t02-sqlite-diagnostic-r2/primary-sources.json).

Không chọn đổi compiler/annotation/suppression hoặc đổi WAL/concurrency để hết báo cáo. Đề xuất diagnosticr2 giữ instrumentation,report_bugs=1/exit66, chỉ halt_on_error=0 để lấy oracle dữ liệu sau warning. Chỉ sửa3file diagnostic và2điểm bàn giao; backend/tests hiện hữu/contracts/vendor/scripts build không đổi. Manifest33100182,54source/824vendor;6kiểm tĩnh qua, chưa compile/chạy/container. Không dùng kết quả review làm nghiệm thu safety hoặc runtime.

Public SAVE CONTINUATION_SAVED, W-001/gates giữ; pilot sourceae8a327/HEADd3cb602 local sạch/không remote. R5 vẫn6FAIL TSan, release chưa chạy, R09 IN_PROGRESS/T02 chưa nghiệm thu/R10 chưa mở. Quyền diagnosticr2 chờ duyệt, r1 không replay; mọi bằng chứng cũ bảo toàn.
