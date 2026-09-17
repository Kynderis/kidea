Đã hoàn thành phần R08 r1 được duyệt:

- Tích hợp hướng dẫn kế hoạch → code → phát hành/vận hành; review đủ14tình huống.
- Core283/283PASS trên Mac Intel, không đổi runtime hoặc dữ liệu pilot. Giữ log lỗi validator thiếu PyYAML; kiểm YAML thay thế đạt.
- Đã chuẩn bị đầu vào lab R2; chưa chạy Docker/deploy.

R08 chưa hoàn tất: còn bộ script/manifest lab, diễn tập lỗi–đọc lại–phục hồi thật và nghiệm thu. Bước tiếp cần duyệt lát cắt chuẩn bị R2 gồm kiểm Docker chỉ đọc và xây bộ script lab; gói chạy cụ thể sẽ trình sau, chưa mở workload.

Chi tiết: [báo cáo r1](tests/evidence/r08/implementation-r1.md), [R2 draft](proposals/r08-lab-r2-draft.md).
