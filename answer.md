Mình đã nói thiếu phần quan trọng: **task làm gì và bạn có cần phản hồi ngay không**. Từ sau mình sẽ nói rõ, không chỉ đưa mã task.

### R01-T02 làm gì?

Chốt **cách tổ chức và quản lý tài liệu trong một project**, để tài liệu sản phẩm và tiến trình Kidea không bị trộn hoặc mâu thuẫn.

| Phần | Nội dung | Hiện tại |
|---|---|---|
| S01 | Tài liệu sản phẩm ở ngoài `.kidea`; hồ sơ điều phối ở trong | Bạn đã duyệt, đã xong |
| S02 | Mỗi thông tin có một nguồn chính; Kidea đọc những gì và được sửa những gì | Chưa bắt đầu |
| S03 | Đồng bộ tài liệu/ví dụ, kiểm tra liên kết và dọn file tạm theo phần đã duyệt | Chưa làm |

Ví dụ S02: rule nghiệp vụ nằm ở tài liệu sản phẩm; hồ sơ tiến trình chỉ dẫn tới rule, không chép thêm một bản có thể bị lệch. Được đọc tài liệu để kiểm tra không đồng nghĩa được sửa mọi file.

### Đọc ở đâu?

Bạn chỉ cần xem [mục “Nguồn có hiệu lực và ranh giới ghi”](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#source-authority-and-write-boundary). Đây là căn cứ để soạn S02, **không phải yêu cầu bạn duyệt cả mục ngay**.

### Có cần xác nhận trước khi mình làm không?

**Không cần xác nhận thêm để mình chuẩn bị đề xuất S02.** Hiện chưa có gói S02 nào đang chờ bạn duyệt. Bước tiếp theo là soạn gói nhỏ, nêu rõ 2–3 quyết định và đề xuất; lúc đó mới cần bạn duyệt đầu ra trước phần phụ thuộc.

R01-T02 chỉ chốt thiết kế hồ sơ, chưa chuyển file project thật, cài công cụ hay thay quyền Git. Mình đã bổ sung quy tắc giải thích rõ như trên vào cách làm chung.
