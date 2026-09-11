Đã ghi nhận bạn duyệt **Node.js 24 LTS và khung phụ trợ tối giản**.

Giờ cần chốt **đặt các phần ở đâu và cho phép mình bắt đầu tạo/thử khung**. Đề xuất ba điểm:

1. **Skill nằm ngay trong repo Kidea**, tại `.agents/skills/kidea/`. Chỉ giữ một bản mã nguồn; sửa ở đây rồi lưu lên GitHub. Codex có cơ chế tìm skill theo repo, nên chưa cần cài vào nơi dùng chung cho mọi project. [Tài liệu OpenAI](https://learn.chatgpt.com/docs/build-skills).
2. **Node chạy riêng, không thay bản đang dùng.** Tải bản **24.21.0 cho Windows x64** vào `.tools/node-v24.21.0-win-x64/`, kiểm tra dấu nhận diện file tải về rồi mới chạy. Không dùng bộ cài, không sửa cấu hình tìm lệnh của máy; Node 22 hiện có giữ nguyên. Bản Node này chỉ nằm local, không đẩy lên GitHub. [Nguồn Node chính thức](https://nodejs.org/en/blog/release/v24.21.0).
3. **Cho mình tạo và thử khung ban đầu trong repo này.** Mã/hướng dẫn ở thư mục skill; bài thử và bằng chứng ở `tests/`; file sinh ở `.test-output/`; thêm cấu hình chạy/loại trừ Git khi cần. Thử bằng dữ liệu giả, kiểm tra các lệnh chưa xây phải báo “chưa hỗ trợ”, không tự sửa hồ sơ thật. Chỉ lưu nguồn/bằng chứng cần giữ lên GitHub và dọn đúng file tạm của lượt thử.

**Khác lần trước:** duyệt lần này sẽ cho phép mình tải Node, viết khung và chạy thử trong phạm vi trên. Vẫn không cài toàn máy, tạo/chạy pilot, sửa project khác hoặc deploy.

Mình đã kiểm tra các vị trí dự kiến chưa có dữ liệu; chưa tải hoặc tạo gì. [Gói duyệt trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current).

Bạn duyệt ba điểm này nhé?
