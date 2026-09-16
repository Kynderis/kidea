Dán nguyên prompt này vào phiên Codex mới, mở tại thư mục repo Kidea trên Mac:

```text
Tôi tiếp tục phát triển Kidea từ Windows sang MacBook Pro 2019 Intel này. Đây là phiên làm việc tiếp nối, không thiết kế lại từ đầu.

ĐỌC BỐI CẢNH
- Đọc docs/MAC_HANDOFF.md và các tài liệu được dẫn trong đó, đặc biệt phần trạng thái hiện hành của KIDEA_ROADMAP.md.
- Nếu có AGENTS.md áp dụng thì đọc thêm. Repo có thể không có file này; không có thì tiếp tục bình thường, không cần tạo.
- Lấy mã, tài liệu và bằng chứng hiện hành trong repo làm căn cứ; không suy quyết định từ lịch sử chat mà bạn không có.

CÔNG VIỆC TRƯỚC MẮT
1. Xác minh đúng repo Kynderis/kidea, remote, nhánh, phiên bản nguồn và thay đổi chưa commit. Bảo toàn mọi thay đổi có sẵn; không tự reset hoặc ghi đè.
2. Kiểm tra macOS, CPU, Node.js ≥24, npm, Git, dung lượng và quyền. Xác nhận checkout nằm trong thư mục local không đồng bộ; chạy bằng tài khoản thường, không sudo/root.
3. Khi đủ điều kiện, chuẩn bị dependency project theo lockfile bằng npm ci và chạy từ root repo:
   node tests/r02-t07/run-tests.mjs
4. Nếu có lỗi portability trong phạm vi LP-01, tìm và sửa nguyên nhân, bổ sung test rồi chạy lại đầy đủ trên nguồn cuối. Không bỏ ca, giảm kiểm an toàn hoặc sửa kỳ vọng chỉ để lấy PASS.
5. Lưu bằng chứng Mac mới, gồm môi trường thực, phiên bản nguồn, log cả FAIL/PASS và kết quả cuối. Không ghi đè bằng chứng Windows. Mac Intel PASS không đồng nghĩa Apple Silicon PASS.
6. Cập nhật trạng thái và điểm tiếp tục đúng kết quả; lưu câu trả lời cuối vào answer.md, commit/push theo quyền repo hiện hành sau khi kiểm phù hợp. Nếu thiếu quyền truy cập Git thì báo rõ, không yêu cầu tôi gửi secret vào chat.

GIỮ NGUYÊN HƯỚNG ĐÃ CHỐT
- Một bộ Kidea chung cho Windows, Mac Intel và Apple Silicon; không khóa đúng patch/binary Node hoặc đường dẫn công cụ của Windows.
- Chỉ hỗ trợ thư mục local. Ổ mạng/iCloud/OneDrive và nhiều máy cùng ghi nằm ngoài phạm vi, không phải việc để làm sau.
- Backend dùng Docker local; test nặng/performance trên cloud khi tôi cấp máy và quyền.
- Lượt kiểm lõi này không cần Docker, Xcode, SDK, VM hoặc pilot. Pilot là thư mục riêng ngoài repo, không tự xuất hiện khi clone; đọc hướng dẫn bàn giao trước khi cần khôi phục nó.
- Không tự cài công cụ hệ thống, thay cấu hình máy, thuê cloud, build/deploy ứng dụng hoặc chạy lại các phiên AI/benchmark lịch sử. Nếu thiếu công cụ, gom một đề xuất cài tối thiểu, nêu nguồn/phiên bản/dung lượng/quyền để tôi chốt.

CÁCH PHỐI HỢP
Làm liền mạch trong phạm vi trên, không hỏi lại từng lệnh hoặc quyết định đã duyệt. Chỉ hỏi khi thiếu thông tin/quyền thực sự ảnh hưởng công việc; gom các vấn đề đã biết thành một lần hỏi, giải thích dễ hiểu và đề xuất lựa chọn cụ thể.

Sau kiểm Mac, báo ngắn: đã làm gì, kết quả thực, phần còn thiếu và bước tiếp theo theo roadmap. Không tự coi R05 chưa duyệt là đã duyệt hoặc toàn Kidea đã hoàn tất.

Bắt đầu đọc hồ sơ và kiểm tra môi trường ngay.
```
