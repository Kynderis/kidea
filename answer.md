Đã hiện thực và chạy mẫu Web trên Mac Intel, không cần Docker:

- Kiểm kiểu, lint và production build: **PASS**.
- **14/14 unit,11/11 SSR/browser PASS**, thêm một kiểm SSR trên process mới.
- **8/8 phiên bản cố ý sai bị phát hiện**; giữ cả log lỗi và kết quả cuối.

Dependency/browser chỉ nằm trong thư mục mẫu riêng; không cài công cụ hệ thống. Server đã dừng, nguồn Kidea và hồ sơ pilot cũ được bảo toàn. [Báo cáo và snapshot mã](tests/evidence/r05/web-execution-r1.md).

Phần Web mẫu đã có bằng chứng thực. HTTPS/CSRF/backend, các nền tảng khác và Apple Silicon chưa kiểm; R05 chưa hoàn tất. Docker vẫn chờ bạn báo khi ngồi máy.
