Đã ghi nhận phần tồn đọng cũ để sau. Tôi đề xuất **gói A–E**:

| Mục | Đề xuất của tôi |
|---|---|
| **A — Nghiệm thu D1** | Chấp nhận kết quả 293/293 và hồi quy R06/R07 đã PASS; khép phần quản lý kế hoạch ban đầu. |
| **B — Hoàn thiện thao tác còn thiếu** | Bổ sung đổi kế hoạch/vòng làm việc, ghi hồ sơ phát hành và đối chiếu/phục hồi sau ngắt. Làm từng phần, kiểm đầy đủ bằng fixture local; giữ gate/quyền, không tự chạy lại lệnh chưa rõ kết quả. |
| **C — Chuẩn bị pilot** | Dùng thư mục workshop hiện có; sửa link, giữ hồ sơ/mẫu cũ, tạo Git local và `.kidea` bằng helper công khai, lập kế hoạch chạy. Chưa tạo remote GitHub hoặc mở build/deploy. |
| **D — Hai thay đổi nghiệp vụ** | T04: tối đa 2 đăng ký ACTIVE/người trên toàn bộ workshop; hủy giải phóng hạn mức, không tự hủy dữ liệu cũ vượt mức. T09: PAUSED vẫn cho chủ đăng ký hủy, tiếp tục chặn đăng ký mới. Áp dụng đúng thời điểm thử, không thêm ngay vào MVP. |
| **E — Phát hành lab** | Chỉ dữ liệu giả, noindex; N/A phần index công khai, vẫn kiểm SSR/SEO/UX liên quan. Tôi chuẩn bị và kiểm script; bạn chạy script vai PROD trên lab khi tới bước đó. |

Tôi đề xuất **duyệt cả A–E** theo [gói chi tiết r1](/Users/kendrick/Desktop/kidea/proposals/r09-next-decisions-r1.md). Bạn chưa cần cài gì hoặc ngồi máy ngay.

Gate nghiệm thu đầu ra và R09 cuối sẽ dựa trên kết quả thực. Gói build/cloud cụ thể được trình khi đủ nguồn, lệnh và giới hạn; chưa xin duyệt trước trong gói này. View pilot đang hoãn vẫn là gate trong roadmap, nên việc hoãn chưa đồng nghĩa R09 hoàn tất.

Bạn có thể trả lời **“Duyệt A–E”** hoặc sửa từng mục.
