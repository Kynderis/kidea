**P01-T05 là task xây “thước đo đạt/chưa đạt” cho Kidea.** Nó giúp sau này ta có căn cứ quyết định Kidea đã đủ tin cậy để dùng hay còn phải sửa, thay vì chỉ cảm thấy “có vẻ chạy tốt”.

### 1. Khác gì với P01-T04 vừa làm?

- **P01-T04:** xác định **những tình huống cần kiểm tra**.
- **P01-T05:** xác định **kiểm tra thế nào, thế nào mới được tính là đạt và cần lưu gì để chứng minh**.

Ví dụ P01-T04 đã có tình huống: “Ngắt phiên rồi tiếp tục công việc ở phiên mới”.

P01-T05 sẽ làm rõ: phiên mới phải tìm đúng task đang dở, giữ các quyết định đã duyệt, không làm lại việc đã xong, không tự chạy lại thao tác chưa rõ kết quả; phải quan sát và lưu những gì để xác nhận các điều đó. Chỉ nói “resume được” thì chưa đủ rõ.

### 2. Cụ thể mình sẽ làm những gì?

| Phần cần chốt | Hiểu đơn giản |
|---|---|
| **Độ đúng của trạng thái** | Hồ sơ nói đang làm/chờ duyệt/đã xong có đúng với thực tế không? Không được báo hoàn thành khi còn test bắt buộc chưa đạt. |
| **An toàn khi ghi file** | Khi lưu lỗi hoặc bị ngắt giữa chừng, có làm mất nội dung hay ghi đè sai không? Có nhận ra phần cập nhật dở và biết cách tiếp tục an toàn không? |
| **Khả năng resume** | Sang phiên hoặc máy khác, có tiếp tục đúng việc từ hồ sơ không? Thiếu file/công cụ thì phải báo rõ, không tự đoán. |
| **Tốc độ xử lý** | Với một bộ hồ sơ có quy mô xác định, đọc trạng thái, kiểm tra hồ sơ hoặc sinh giao diện tiến độ mất bao lâu là chấp nhận được? |
| **Bằng chứng tối thiểu** | Muốn ghi “đạt” thì cần kết quả chạy, phiên bản, môi trường và trạng thái trước/sau nào? Phần nào phải thử bằng phiên AI mới hoặc môi trường thật? |

“Tốc độ xử lý” ở đây là của **Kidea**, không phải tốc độ ứng dụng workshop. Mình cũng phải tách thời gian công cụ xử lý file khỏi thời gian AI trả lời hoặc chờ bạn duyệt; không gộp tất cả thành một con số thiếu ý nghĩa.

### 3. Một tiêu chí hoàn chỉnh sẽ trông thế nào?

Ví dụ minh họa cho việc xem trạng thái:

- **Điều kiện thử:** hồ sơ có một task đang làm và một gói đang chờ bạn duyệt.
- **Hành động:** yêu cầu Kidea báo trạng thái.
- **Điều kiện đạt:** báo đúng task và gói chờ; không sửa hồ sơ nguồn.
- **Cách chứng minh:** lưu câu trả lời và đối chiếu nội dung file trước/sau.

Nếu cần tiêu chí về thời gian, phải bổ sung quy mô hồ sơ, môi trường đo, cách đo và ngưỡng chấp nhận. **Chưa tự chốt một số giây bất kỳ trong phần giải thích này.**

### 4. Vì sao cần chốt trước khi xây?

Để tránh đến lúc test thất bại mới đổi định nghĩa “đạt” cho dễ vượt qua.

Các lỗi như **tự vượt gate, làm mất dữ liệu hoặc báo PASS sai** không nên được bù bằng việc những phần khác chạy nhanh. Còn ngưỡng tốc độ cần thực tế, gắn với phạm vi bản đầu, không đặt quá cao khiến ta tối ưu không cần thiết.

### 5. Bạn cần quyết định gì?

**Hiện chưa cần bạn cung cấp thêm thông tin hoặc xác nhận lại quyền bắt đầu.** Bạn đã cho phép làm P01-T05.

Mình sẽ chuẩn bị bộ tiêu chí và giải thích các mức đề xuất. **Bạn duyệt đầu ra đó trước khi đóng task**, vì chúng quyết định mức chất lượng ta chấp nhận cho Kidea.

Lượt này mình chỉ giải thích theo yêu cầu “trước khi làm”; chưa xây bộ tiêu chí, chưa chạy thử hay thay đổi trạng thái P01-T05. Khi hoàn tất task, ta có **bộ thước đo đã chốt**, chứ chưa có kết luận rằng Kidea đã đạt các thước đo ấy.

<oai-mem-citation>
<citation_entries>
MEMORY.md:319-320|note=[preserve Human review and scoped answer mirror]
MEMORY.md:328-328|note=[verify answer publication]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
