**3 phiên AI × 3 mẫu đều đạt**, dữ liệu không đổi; chạy lại 79 bài kiểm tra cũng đạt. Dùng skill [OpenAI Docs](https://learn.chatgpt.com/docs/non-interactive-mode) để cấu hình phiên chỉ đọc.

Tiếp theo là bảo vệ file khi ghi. Mình đề xuất:

1. **Khóa file lúc sửa**, bằng PowerShell/Windows có sẵn. Không lấy được khóa thì dừng; editor có thể tạm không lưu được. Bản đầu chỉ ghi trên ổ NTFS local, không ổ mạng/thư mục đồng bộ/đường dẫn liên kết.
2. **Giữ bản trước và nhận rõ phần ghi dở.** Chỉ tự phục hồi lỗi khi vẫn giữ khóa liên tục; sau ngắt, chưa rõ ai sửa thì giữ nguyên và hỏi. Không bảo đảm nhiều file đổi đồng thời hoặc chống mất điện.

Bạn duyệt [hai lựa chọn này](D:/Code/kynderis/kidea/KIDEA_ROADMAP.md#safe-write-review) để mình viết và thử trên dữ liệu giả nhé? Chưa ghi dự án thật.
