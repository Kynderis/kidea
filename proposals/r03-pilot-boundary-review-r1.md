# Pilot workshop — phạm vi và ranh giới cụm đầu

Ngày 2026-09-15. `R03-PILOT-BOUNDARY-r1`, **IN_REVIEW**. Nguồn sản phẩm: [Feature Map](D:/Code/kynderis/kidea-workshop-pilot/docs/features.md), [ứng viên nghiệp vụ](D:/Code/kynderis/kidea-workshop-pilot/docs/business/INDEX.md). Bản chụp phục vụ kiểm chứng sẽ giữ ở [bằng chứng lượt đầu](../tests/evidence/r03/document-trial-r1.md), không là nguồn sản phẩm thứ hai.

Cập nhật: **D1 APPROVED** ngày 2026-09-15. Human “Duyệt ba nhóm và cụm đăng ký/hủy” sau answer `d539cc980d2b63513b69ae600550301132384ff9` duyệt ranh giới C-REG/C-LIFE/C-VIEW và cụm đầu; chưa duyệt các rule OPEN, tạo file mới, AI hoặc thực thi. Bản trình phía dưới được giữ nguyên để đối chiếu phạm vi.

## Phần giữ nguyên, không hỏi lại

Bốn nhóm MVP đã chốt: xem workshop, đăng ký/hủy, quản trị, cập nhật/vận hành. Một ACTIVE/người/workshop, chỉ đăng ký/hủy khi OPEN; hai ACTIVE toàn hệ thống và hủy khi PAUSED vẫn là change về sau. Native và chuỗi event/số chỗ không bị cắt khỏi MVP. Feature Map ghi lại phạm vi đó, không mở phạm vi mới.

## D1 — cách chia trách nhiệm và cụm đầu đề nghị

| Nhóm trách nhiệm | Nói đơn giản | Không được làm |
|---|---|---|
| C-REG — đăng ký/sức chứa có thẩm quyền | Quyết định có nhận chỗ không; đăng ký/hủy và admin sửa sức chứa cùng tuân giới hạn số ACTIVE | Để admin hoặc một client có cách đếm khác; chọn database/lock chỉ từ nhóm này |
| C-LIFE — vòng đời workshop | Giữ nghĩa nhất quán của DRAFT/OPEN/PAUSED và các hành vi phụ thuộc | Tự suy tất cả actor đều thấy hoặc làm được cùng điều ở mỗi trạng thái |
| C-VIEW — dữ liệu hiển thị/cập nhật | Đưa số chỗ và thời điểm cập nhật tới client, giữ nghĩa vụ xử lý lặp/trễ và đối chiếu | Dùng số chỗ hiển thị có thể cũ để nhận đăng ký |

Đề nghị làm rõ **đăng ký/hủy trước**, với các phần C-REG/C-LIFE bắt buộc và đầu ra sang C-VIEW. Chưa cần đặc tả hết màn hình admin/monitoring, nhưng phải đọc các ràng buộc của chúng và ghi dependency. Đây là nhóm nghiệp vụ để viết tài liệu, không yêu cầu ba service/module/file/database riêng.

Lợi ích: quy tắc quan trọng được thống nhất trước khi viết các Feature sử dụng nó; giảm sao chép và tránh dùng dữ liệu hiển thị làm quyết định thật. Đánh đổi: phải chốt hợp đồng giữa các trách nhiệm và có thể sửa ranh giới nếu flow thực tế cho thấy nhóm hiện tại chưa phù hợp. Không thiết kế trước toàn Future.

## Chưa xin chốt tất cả rule ở gói này

Các câu hỏi sau cần đề xuất kết quả cụ thể khi viết rule; hiện giữ OPEN, không tự chọn đáp án:

- Retry được nhận diện và trả kết quả thế nào; khi nhiều điều kiện cùng sai thì báo lỗi nào trước.
- PAUSED/DRAFT hiển thị cho ai và thế nào; kết quả chi tiết của việc đổi trạng thái.
- Đăng ký đồng thời với sửa sức chứa được quan sát như thế nào; ai phát sinh thông tin thay đổi, ai nhận/đối chiếu.
- Người dùng thấy gì khi số chỗ trễ hoặc mất cập nhật; mức độ tươi cần chấp nhận.

Duyệt D1 chấp nhận ranh giới/cụm làm căn cứ đặc tả, không duyệt rule/test còn chưa viết. Phạm vi quyền tài liệu hiện có chỉ cho hai file đã trình; chưa tạo thêm file nghiệp vụ chung hoặc `.kidea`, chưa tích hợp skill, không chạy AI thêm hoặc code/deploy. Trước mở nhánh cần thêm quyền/khả năng helper phải nói rõ, không diễn giải gate nghiệp vụ thành quyền mới.
