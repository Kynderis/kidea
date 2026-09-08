**R01-T03-S01 đã soạn xong, đang chờ bạn duyệt hai quyết định nền tảng:**

| Quyết định | Đề xuất |
|---|---|
| **D1 — Máy chạy Kidea** | Windows 11 x64 là nền tảng hỗ trợ đầu tiên; làm việc local, không cần server Kidea. Chưa công bố hỗ trợ host macOS/Linux. |
| **D2 — Backend sản phẩm** | C++20, chạy trên Ubuntu 24.04 LTS amd64 làm nền kiểm chứng. Có thể soạn code trên Windows, nhưng build/test Linux và kiểm tra bản phát hành trên môi trường Ubuntu đích. |

**Điểm dễ nhầm:** C++ là ngôn ngữ backend của sản phẩm được quản lý, không bắt Kidea phải viết bằng C++. Runtime của Kidea sẽ chốt riêng.

Bạn chỉ cần đọc [gói S01 — host và backend](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current). Đây là giữ hướng đã chọn trước đó; chưa xác minh lại toolchain hoặc chạy build, chưa cài/nâng cấp gì.

Đã cập nhật GitHub; không tạo file tạm. Sau khi bạn duyệt, mình sẽ ghi nhận S01 và chuẩn bị gói **web/SEO ở S02**, không hỏi lại quyền bắt đầu soạn.

Bạn duyệt D1–D2 của gói này chứ?
