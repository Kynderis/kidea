# Lát cắt đăng ký/hủy workshop

Đây là bản soạn độc lập để review nội dung; chưa có Human duyệt đầu ra này, chưa thực thi test trên sản phẩm. Quyền soạn riêng của phiên A chỉ tạo Markdown trong thư mục này, không phải khả năng ghi sản phẩm của public helper Kidea.

## Nguồn và cách đọc

Nguồn đóng băng được controller xác nhận đã duyệt: [phương pháp Feature, mục 2–3 và 5](../inputs/proposals/r03-feature-method-r1.md), [mẫu business, mục 1 và 3–4](../inputs/proposals/r03-business-template-r1.md), [quyết định đăng ký D1–D3](../inputs/proposals/r03-registration-decisions-r1.md), [completion batch A, B1–B8 và D](../inputs/proposals/r03-completion-batch-r1.md). Các nhãn IN_REVIEW và câu “đề xuất” cũ là lịch sử, không phủ định xác nhận của controller. Không dùng các liên kết ra ngoài snapshot để bổ sung sự thật.

Áp dụng [business method](../inputs/.agents/skills/kidea/references/business.md) cùng [giới hạn skill](../inputs/.agents/skills/kidea/SKILL.md). Mỗi quy tắc của lát cắt có một mục sở hữu trong rules; flow và test chỉ dẫn lại mục đó. Không tạo tracker tiến độ/approval trong bộ business.

## Phạm vi

| ID | Người dùng và kết quả | Phân loại và ranh giới |
|---|---|---|
| F-RC | Người tham gia đăng ký một workshop hoặc hủy đúng lần đăng ký của mình | MVP; web và native cùng quy tắc; chỉ thao tác mới khi OPEN |
| DEP-W | Quản trị thay trạng thái/sức chứa; đăng ký sử dụng trạng thái có thẩm quyền | Dependency MVP; chỉ mô tả hợp đồng cần thiết và các lịch tranh chấp, không soạn toàn Feature admin |
| DEP-A | Người xem nhận số chỗ và trạng thái quan sát được | Dependency MVP; mô tả nghĩa vụ cập nhật/phục hồi/riêng tư liên quan lát cắt, không soạn toàn Feature xem và vận hành |
| FUT-1 | Giới hạn hai ACTIVE trên toàn hệ thống | Change về sau, ngoài MVP; không thêm bộ đếm hay chặn đăng ký liên workshop |
| FUT-2 | Hủy khi PAUSED | Change về sau, ngoài MVP; đọc lại kết quả cũ không phải quyền hủy mới |

Toàn MVP có bốn nhóm xem, đăng ký/hủy, quản trị, cập nhật/vận hành theo completion A; bộ này chỉ bàn giao lát cắt F-RC với dependency bắt buộc. Không có thanh toán, email/SMS/push, waitlist, admin hủy hộ, trang admin xem danh tính người tham gia, A/B. Không đặc tả sâu Future; không tạo kiến trúc, code, Git, deployment hay chứng nhận hoàn thành toàn R03.

## Mục lục nội dung

| Mục | Mô tả |
|---|---|
| [DATA và INV](rules.md#data) | Miền dữ liệu, authority và invariant |
| [R-ENTRY](rules.md#entry) | Nhận diện, quyền và thông tin không được tiết lộ |
| [R-RETRY](rules.md#retry) | Kết quả lịch sử, pending/unknown, xung đột mã |
| [R-MUTATE và STATE](rules.md#mutate) | Kết quả mới và bảng chuyển trạng thái |
| [R-SERIAL](rules.md#serial) | Thứ tự kết quả hợp lệ giữa các thao tác |
| [R-UPDATE](rules.md#update) | Nghĩa vụ cập nhật và phục hồi |
| [FLOW và AC](flow-ac.md#flow) | Nhánh nghiệp vụ và tiêu chí quan sát |
| [TESTS và COVERAGE](tests.md#coverage) | Nghĩa vụ, bộ ca và phần chưa bao phủ |
| [OPEN](rules.md#open) | Những kết luận chưa đủ căn cứ |
| [IMPACT](rules.md#impact) | Caller ngược và cách lan truyền thay đổi |

Không có kết quả chạy sản phẩm trong bộ này. Expected ở tests là đặc tả suy ra từ nguồn, không phải reviewer oracle hay điểm tự chấm.
