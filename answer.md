Đã khép **R01**, mở bước chuẩn bị **R02** và ghi yêu cầu giải thích dễ hiểu vào quy tắc review.

Lần này mình cần bạn duyệt **công cụ chạy các chương trình phụ trợ của Kidea**, chưa phải cài đặt.

Có thể hiểu Kidea gồm: **hướng dẫn cho AI** và **chương trình nhỏ làm việc cố định**. Ví dụ bạn hỏi tiến độ: chương trình đọc, kiểm tra hồ sơ; AI giải thích kết quả. Chương trình không tự duyệt thay bạn. Cách tách này phù hợp hướng dẫn [OpenAI về skill](https://learn.chatgpt.com/docs/build-skills).

Hai đề xuất:

1. **Dùng JavaScript chạy bằng Node.js 24 LTS.** Node là phần mềm chạy JavaScript ngoài trình duyệt; LTS là dòng hỗ trợ dài hạn. Mình chọn vì phù hợp xử lý file và cùng ngôn ngữ với phần tương tác HTML sau này. Python cũng làm được, không phải Node luôn nhanh hơn. Đánh đổi: cần chuẩn bị đúng bản Node; không đổi backend C++ hay công nghệ sản phẩm. [Trạng thái LTS chính thức](https://nodejs.org/en/about/previous-releases).
2. **Bắt đầu với ít thành phần phải cài thêm.** Khung chương trình dùng chức năng và [bộ chạy test có sẵn của Node](https://nodejs.org/docs/latest-v24.x/api/test.html), chưa thêm framework/thư viện ngoài. Nếu về sau cần thư viện, mình sẽ giải thích lợi ích và trình lựa chọn; không tự viết một hệ thống phức tạp để cố tránh thư viện.

**Duyệt lần này chưa cho phép cài/nâng công cụ.** Gói kế tiếp mới chốt bản cụ thể, nơi cài thử và quyền thao tác, bảo toàn công cụ bạn đang dùng.

[Gói review trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current). Bạn đồng ý hai lựa chọn này nhé?
