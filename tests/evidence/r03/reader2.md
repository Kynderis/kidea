# Phản hồi phiên 2 — nội dung trả về, không là Human approval

Đã đọc đầy đủ `prompt.txt` và cả 5 file trong `input`; không có phần chưa đọc. Chỉ đánh giá snapshot được cấp, không kiểm chứng các bằng chứng nằm ngoài `input`.

### 1. Sản phẩm và phạm vi đợt này

Pilot là ứng dụng workshop: khách xem; người tham gia đăng ký/hủy và xem đăng ký của mình; admin quản lý nội dung, sức chứa, trạng thái; hệ thống cập nhật số chỗ và theo dõi event/phục hồi.

MVP gồm đủ PIL-F01–F04, web và hai app native dùng chung backend C++ có thẩm quyền. Chỉ đăng ký/hủy khi OPEN; mỗi người tối đa một ACTIVE/workshop; không vượt sức chứa; retry không tạo tác dụng phụ lần hai. [Nguồn: `source.md`, “Phạm vi MVP ban đầu”; `docs/features.md:8–35`.]

Hồ sơ đang là **DRAFT để review**, chưa là nghiệp vụ chi tiết được Human duyệt, code/test đã chạy hoặc quyền triển khai. Cụm đăng ký/hủy mới là đề xuất thứ tự làm, không loại admin/monitoring/native khỏi MVP. [Nguồn: `docs/features.md:3`; `docs/business/INDEX.md:19–21`.]

Không thuộc MVP ban đầu: giới hạn hai ACTIVE toàn hệ thống; hủy khi PAUSED. Không thanh toán, email/SMS, danh sách chờ, push notification hoặc public release. A/B chưa có yêu cầu chốt. [Nguồn: `docs/features.md:35–42`.]

### 2. Ứng viên dùng chung và trách nhiệm/state

| Ứng viên | Đánh giá và phần còn thiếu |
|---|---|
| **C-REG** | Hợp lý để thống nhất ACTIVE và phép kiểm số đăng ký/sức chứa giữa đăng ký/hủy và admin sửa sức chứa. Cần làm rõ quyền thay đổi từng dữ liệu, state sau hủy/đăng ký lại, kết quả khi sửa sức chứa và đăng ký đồng thời; invariant không tự xác định thứ tự hay bên thắng. |
| **C-LIFE** | Hợp lý để thống nhất DRAFT/OPEN/PAUSED cho xem, đăng ký/hủy và quản trị. Còn thiếu kết quả chi tiết chuyển trạng thái và hiển thị theo actor; không suy tên trạng thái thành quyền hiển thị. |
| **C-VIEW** | Phân biệt đúng dữ liệu dẫn xuất/thời điểm quan sát với dữ liệu có thẩm quyền. Còn thiếu hợp đồng đầu ra/đầu vào: ai phát thông tin thay đổi, ai nhận, điều kiện đối chiếu, kết quả khi trễ/mất cập nhật. |

Căn cứ trực tiếp: `docs/business/INDEX.md:10–14,26–33`; đối chiếu `source.md`, chuỗi “rule đăng ký → dữ liệu đăng ký → event → số chỗ dẫn xuất → SSR/realtime/native và monitoring”.

Chưa thấy mâu thuẫn trực tiếp với phạm vi nguồn. Tuy nhiên, **bảng ứng viên chưa phải hợp đồng đủ để đặc tả/triển khai**: việc C-REG quản lý đăng ký/sức chứa và C-VIEW quản lý số chỗ dẫn xuất chưa phân định đầy đủ nghĩa vụ tại ranh giới event. Hồ sơ đã tự ghi OPEN này ở `INDEX.md:31`. Không có căn cứ chốt ba ứng viên thành ba module/service/database.

### 3. Cần hỏi Human trước phần đặc tả phụ thuộc

- **Duyệt ranh giới C-REG/C-LIFE/C-VIEW và cụm đầu**: chưa có approval; cần biết phạm vi trách nhiệm nào được dùng làm căn cứ. [`INDEX.md:21,26`; phương pháp Feature §3.]
- **Kết quả quan sát khi nhiều điều kiện cùng sai; nhận diện retry và kết quả trả sau gián đoạn**: thiếu đáp án sẽ không viết được rule/test expected chính xác. [`features.md:18,47`; `INDEX.md:27`.]
- **Hiển thị DRAFT/PAUSED theo actor và kết quả chuyển trạng thái**: ảnh hưởng nội dung công khai, quyền và hành vi caller. [`features.md:13`; `INDEX.md:11,28`.]
- **Kết quả khi admin sửa sức chứa đồng thời có đăng ký**: cần bổ sung nghĩa cho invariant đã chốt, không tự chọn thứ tự thực thi. [`INDEX.md:31`.]
- **Người dùng thấy gì khi số chỗ trễ/mất cập nhật, tiêu chí đối chiếu/phục hồi và nghĩa vụ hai phía event**: cần để hoàn thiện luồng, AC và test; chưa tự đặt ngưỡng thời gian. [`INDEX.md:29–31`.]

Không cần hỏi lại điều đã chốt: chỉ đăng ký/hủy khi OPEN, giữ native, không vượt sức chứa. Dependency OPEN chỉ chặn phần phụ thuộc; không đòi giải quyết mọi chi tiết toàn MVP trước khi làm phần độc lập. [Phương pháp nghiệp vụ §1, §4.]

### 4. Có lấy đề xuất thành approval, đặc tả Future hoặc dùng số chỗ hiển thị nhận đăng ký không?

**Không thấy trong snapshot.**

- `features.md:3` và `INDEX.md:3,21` phân biệt DRAFT/đề xuất với approval; hai phương pháp cũng giới hạn D1 là duyệt phương pháp, không duyệt rule/ranh giới pilot.
- Hai thay đổi tương lai chỉ được ghi nhận, chưa có đặc tả sâu hay áp dụng hiện tại. [`features.md:38–42`.]
- Quyết định nhận đăng ký được chỉ rõ dùng dữ liệu có thẩm quyền; C-VIEW không có quyền quyết định nhận đăng ký. [`features.md:28`; `INDEX.md:12`.]
- Ví dụ C=1 và BT-01–03 trong phương pháp nghiệp vụ chỉ minh họa; không phải seed thay thế hoặc bằng chứng coverage/test pilot đã chạy. [Phương pháp nghiệp vụ §2–3.]

### 5. Thiếu gì để phiên mới tiếp tục?

Snapshot đủ để tiếp tục **review hồ sơ và đặt câu hỏi**, chưa đủ để coi gói nghiệp vụ đã được duyệt hoặc bắt đầu thực thi:

- Bằng chứng review hiện hành của Feature Map, quyết định về ranh giới/cụm và câu trả lời cho OPEN.
- Hồ sơ nghiệp vụ chi tiết: miền dữ liệu, rule, state/transition, hợp đồng event, AC/test và expected có căn cứ. Hiện `docs` chỉ có Feature Map và INDEX.
- Điểm công việc hiện tại, dependency đang xử lý và điểm quay lại ở hồ sơ điều phối; `INDEX.md:3` nói chưa tạo `.kidea`, và không nên thêm tracker vào mục lục sản phẩm.
- Các nguồn bên ngoài snapshot mà tài liệu dẫn đến: review/quyền hồ sơ, bằng chứng phê duyệt và ma trận nền tảng. Không thể xác minh chúng trong phiên này.
- Nếu chuyển sang ghi/chạy/build/deploy: cần quyền cụ thể tương ứng và xác nhận tài nguyên/lab. Approval phương pháp hoặc phạm vi sản phẩm không cấp các quyền đó. [`source.md`, “Môi trường, chi phí và giới hạn”.]
