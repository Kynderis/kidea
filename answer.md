Đã ghi lại: **Docker hoãn, bạn sẽ tự cài khi về máy**. Tôi chưa cài hoặc đổi cấu hình gì.

Máy đang có:

- **Node22.22.2** mặc định tại `/usr/local/bin/node`; npm12.0.2.
- **Node24.19.0** x64 có sẵn trong runtime Codex, đã dùng cho lượt kiểm lõi Mac trước.

Về mức “22 trở lên”: **Kidea hiện yêu cầu≥24**, nhất quán trong package.json, runtime.mjs và test. Thử trực tiếp bằng22.22.2 trả `UNSUPPORTED_RUNTIME`; bằng24.19.0 chạy được. Đây là phạm vi hỗ trợ hiện hành, không chứng minh mọi API đều cần24. Muốn hỗ trợ22 cần một thay đổi có kiểm chứng, không chỉ hạ số trong package.

**Hiện không cần cài thêm Node:** tôi dùng24.19 có sẵn để tiếp tục Kidea. Đề xuất Node24.20 trước đó dành cho toolchain Web của pilot, không phải yêu cầu cài lại Node để làm Kidea. Node22.22.2 đáp ứng engine range của các package Web đã lưu metadata, nhưng chưa chứng minh toàn bộ lock/build; cũng không thể nói mọi bản22 đều phù hợp (Vite/plugin yêu cầu nhánh22 từ22.12).

Đã cập nhật roadmap và gói môi trường. Bạn chưa cần xác nhận hoặc thao tác gì thêm lúc này.
