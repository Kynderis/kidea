# Mục lục nghiệp vụ workshop

[Feature Map](../features.md#goal) là nguồn phạm vi; mục lục này chỉ điều hướng nội dung, không giữ tiến độ hoặc approval tracker.

<a id="candidates"></a>
## Ba trách nhiệm chung

| ID | Nguồn | Caller và mục đích |
|---|---|---|
| C-REG | [Đăng ký/sức chứa](shared/registration.md#invariant) | Đăng ký và admin cùng giữ dữ liệu có thẩm quyền |
| C-LIFE | [Workshop/quyền/vòng đời](shared/workshop.md#state) | Xem, đăng ký, admin, cập nhật dùng cùng state/quyền |
| C-VIEW | [Cập nhật và đối chiếu](shared/availability.md#publish) | Bên ghi giữ nghĩa vụ, bên hiển thị phục hồi đúng |

Đây là trách nhiệm nghiệp vụ, không sơ đồ service/database đã chọn.

<a id="cluster"></a>
## Cụm và Feature

Cụm đầu: [đăng ký/hủy](features/register-cancel.md#flow) cùng phần chung cần thiết và nghĩa vụ sang C-VIEW. Các MVP còn lại: [xem](features/view.md#flow), [admin](features/admin.md#flow), [cập nhật](features/updates.md#flow). Mỗi Feature có AC và link test; shared có nơi dùng ngược kèm mục đích.

<a id="questions"></a>
## Kiểm chứng và ảnh hưởng

[Coverage](tests.md#coverage), [quyền](tests.md#access), [đăng ký](tests.md#registration), [retry](tests.md#retry), [đồng thời](tests.md#concurrency), [dữ liệu](tests.md#data), [event](tests.md#events), [traceability](tests.md#trace).

Đổi rule phải đọc caller/AC/test trong bảng quan hệ của nguồn, tìm thêm nơi dùng trên hồ sơ để bắt backlink thiếu; lan tiếp khi có thay đổi nghĩa. Không đổi nguồn chỉ để khớp test. Chi tiết ngoài phạm vi đã hoãn ở [Feature Map](../features.md#boundaries); không coi chúng là tiêu chí đã đạt.
