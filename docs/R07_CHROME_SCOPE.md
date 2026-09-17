# R07 — chỉ hỗ trợ Chrome

Ngày2026-09-17, trong triển khai gói r1 đã duyệt, Human quyết định nguyên văn: “chỉ cần phát triển giao diện chạy trên Chrome thôi nhé, Safari bỏ qua”.

Quyết định này thay D3 và các dòng yêu cầu Safari ở [gói R07 r1](../proposals/r07-offline-view-r1.md): giao diện HTML offline của Kidea chỉ hỗ trợ Chrome trong phạm vi hiện hành. Ma trận r1 là Chrome thật trên Mac Intel,390×844/1440×900 và zoom200%, bàn phím, dữ liệu và số đo như đã duyệt. Safari được loại khỏi phạm vi, không là gate còn thiếu hoặc việc hẹn làm sau. Không biến preflight Safari thất bại thành PASS.

Không thay các ngưỡng/quota D4/D5, schema2, gate Human nghiệm thu R07 hoặc ma trận browser của ứng dụng Web do từng project xây. Apple Silicon/Windows vẫn cần bằng chứng host tương ứng. Android/iOS Future chưa roadmap; không mở R08.

[Lỗi Safari nguyên bản](../tests/evidence/r07/implementation-r1/safari-preflight.json) được giữ. Không bật Remote Automation, cài driver hoặc thay cấu hình Safari.
