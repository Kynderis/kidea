Android A1 trong Docker đã đạt trên SDK37.0:

- Lint, build debug/release và shrinking: **PASS**.
- Unit: **11/11 mỗi bản**; **6/6 biến thể lỗi** bị bắt.
- Đã sửa lỗi trùng khóa cache, giữ log FAIL/PASS và kiểm lại toàn bộ nguồn cuối.

[Bằng chứng](tests/evidence/r05/android-execution-r1.md) đã lưu; cập nhật roadmap/answer.md và push master. Container đã dừng, không cài thêm công cụ lên macOS.

Còn kiểm Android trên thiết bị và môi trường iOS; Apple Silicon chưa kiểm. **R05 chưa hoàn tất**. Bước tiếp theo là chuẩn bị các phần này theo roadmap.
