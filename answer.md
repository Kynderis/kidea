Đã hoàn tất cả **1,2,3** trên mẫu Web, không dùng Docker hoặc cài thêm dependency:

- Dữ liệu/phiên: JSON sai, version vượt64bit, reply khác actor/epoch/intent và dữ liệu phiên hỏng được xử lý đúng.
- Giao diện/HTML: bàn phím, focus/dialog,360/1280px với chữ200%, HTML không JavaScript và noindex đạt.
- Node: chặn body vượt128KiB/header giả; shutdown hoàn tất request đang chạy và ngắt request kẹt sau khoảng30giây.

**32/32unit +18/18SSR/browser +4/4serverPASS**; type/lint/build đạt. Hai biến thể cố ý sai đều bị phát hiện. Giữ log lỗi, ảnh và snapshot trong [báo cáo Web r2](tests/evidence/r05/web-execution-r2.md).

Server đã dừng; nguồn lõi và bằng chứng cũ được bảo toàn. HTTPS/CSRF/Caddy/C++ còn chưa kiểm, nên **R05 chưa hoàn tất**. Docker vẫn chờ bạn báo.
