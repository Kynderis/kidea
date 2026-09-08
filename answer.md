Đã ghi nhận duyệt và đồng bộ thiết kế, kịch bản nghiệm thu, lộ trình cho **kiểm tra toàn dự án, điều chỉnh MVP và sửa bug production**. Phần này đã khép; chưa triển khai pilot.

Tiếp theo là **quyền thao tác Git**: Kidea được tự lưu công việc đến đâu, và lúc nào cần bạn cho phép. Mình đề xuất hai điểm:

| Nội dung cần chốt | Đề xuất |
|---|---|
| **1. Lưu và quản lý nhánh trên máy** | Khi bạn cho phép Git local cho đúng repo và đợt công việc, Kidea được tạo/chuyển nhánh làm việc, dùng worktree khi cần và commit tiến độ, không hỏi lại mỗi lần lưu. Chỉ lưu phần thuộc nhiệm vụ, giữ mọi thay đổi có sẵn; không tự xóa/reset hay viết lại lịch sử. |
| **2. Đưa lên GitHub, tích hợp và phát hành** | Push cần bạn cho phép rõ nơi nhận, nhánh và nội dung chia sẻ; có thể cho cả đợt làm việc. Merge vào master, tạo tag và deploy cần phép rõ cho từng thao tác/đợt phát hành. Đủ test không tự thay cho quyền này. |

Ví dụ: bạn cho lưu local đợt “hủy khi PAUSED”, Kidea có thể tự commit các phần đang làm, nhưng chưa được push hoặc merge master. **Đã lưu không có nghĩa đã hoàn tất hay đã test đạt.**

[Gói đang chờ duyệt — quyền Git](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current). Đây là duyệt chính sách, chưa cấp quyền thao tác trong pilot. Ma trận Future vẫn để chốt riêng.

Bạn duyệt hai điểm này nhé? Sau đó mình sẽ chuẩn bị phần lưu việc dở và xử lý lỗi/khôi phục.
