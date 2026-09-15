# Workshop — phạm vi để review

Bản soạn theo phạm vi đã chốt trong Kidea; **DRAFT của hồ sơ pilot**, chưa phải xác nhận Human cho bản tài liệu này. Không có code/test đã chạy hoặc quyền triển khai. Nguồn: [DESIGN pilot](D:/Code/kynderis/kidea/KIDEA_DESIGN.md#pilot-scope), [quyền hồ sơ r1](D:/Code/kynderis/kidea/proposals/r03-pilot-permission-r1.md). Các đề xuất mới ở [mục lục nghiệp vụ](business/INDEX.md) cần review riêng.

<a id="goal"></a>
## Mục tiêu và người dùng

Người tham gia xem workshop, đăng ký/hủy chỗ và xem đăng ký của mình; admin quản lý workshop/sức chứa/trạng thái. Khách chỉ xem; người tham gia chỉ thay đổi đăng ký của mình; admin quản lý workshop, không mặc định có quyền hủy hộ. Dữ liệu giả trong lab, không người dùng thật hoặc thanh toán. Kết quả đích cần cả xử lý đăng ký đúng và số chỗ hiển thị có thể đối chiếu được; hồ sơ hiện tại chưa chứng minh kết quả đó.

<a id="pil-f01"></a>
## PIL-F01 — Xem workshop — MVP theo nguồn

Danh sách/chi tiết workshop đã xuất bản: mô tả, lịch hiển thị, sức chứa, chỗ còn và thời điểm cập nhật. Trang giới thiệu tĩnh để kiểm prerender; danh sách/chi tiết kiểm SSR, đọc được nội dung khi chưa chạy JavaScript. Ranh giới công khai: nội dung workshop đã xuất bản; không công khai danh sách đăng ký cá nhân. Chính sách hiển thị DRAFT/PAUSED chi tiết còn cần làm rõ, không suy từ tên trạng thái.

<a id="pil-f02"></a>
## PIL-F02 — Đăng ký/hủy — MVP theo nguồn

Một người tối đa một ACTIVE trên mỗi workshop; hủy rồi được đăng ký lại. Chỉ đăng ký/hủy khi OPEN. Có danh sách đăng ký của mình. Backend kiểm quyền sở hữu, trạng thái và sức chứa; tranh chỗ cuối không vượt sức chứa; retry cùng yêu cầu không tạo tác dụng phụ lần hai. Chưa chọn cách nhận diện retry, thứ tự lỗi hoặc kết quả chi tiết cho yêu cầu lặp.

<a id="pil-f03"></a>
## PIL-F03 — Quản trị — MVP theo nguồn

Tạo/sửa mô tả/sức chứa; xuất bản DRAFT→OPEN, tạm dừng PAUSED rồi mở lại. Không giảm sức chứa dưới số đăng ký ACTIVE. Không xóa workshop hoặc tự chuyển trạng thái theo thời gian. Admin chỉ trên web; không có quyền hủy hộ được cấp trong phạm vi này.

<a id="pil-f04"></a>
## PIL-F04 — Cập nhật/vận hành — MVP theo nguồn

Thay đổi đăng ký/sức chứa phát event; xử lý bất đồng bộ tạo số chỗ hiển thị, cập nhật client. Theo dõi event chờ/lỗi, độ trễ và lần xử lý thành công gần nhất; có thử gián đoạn/phục hồi. Quyết định nhận đăng ký dùng dữ liệu có thẩm quyền, không dùng cache hiển thị. Event lặp không đếm đôi, event trễ/đảo thứ tự không làm lùi trạng thái; sau gián đoạn phải đối chiếu đúng. Chưa chọn broker, giao thức, storage hoặc thuật toán. Monitoring chỉ trên web.

<a id="boundaries"></a>
## Ranh giới giữ nguyên

Backend C++ trên Ubuntu sở hữu rule/dữ liệu có thẩm quyền. Web SvelteKit/TypeScript; SSR không sở hữu rule thứ hai. Android Kotlin/Compose và iOS Swift/SwiftUI cùng backend, mỗi app hai màn hình danh sách (có lọc đăng ký của mình) và chi tiết/đăng ký/hủy. Đây là phạm vi đích đã chọn, chưa có quyền build/chạy ở máy tương ứng.

Phạm vi dữ liệu thử theo nguồn: 3 workshop, 10 người tham gia giả, 1 admin giả; sức chứa 10, fixture tranh chỗ cuối có 1 chỗ. Chưa tạo tài khoản, dữ liệu runtime hoặc cam kết performance. Không email/SMS, danh sách chờ, push notification, public release, dịch vụ tính phí. Lab không cho lập chỉ mục; không nhận SEO thực tế đã đạt. Ngân sách phát sinh 0 đồng, không tự dùng credential/tài nguyên ngoài quyền.

<a id="later"></a>
## Chưa thuộc MVP ban đầu

- Giới hạn hai ACTIVE trên toàn bộ workshop: bài change giữa MVP về sau, chưa áp dụng hiện tại.
- Hủy khi PAUSED, vẫn cấm đăng ký mới khi PAUSED: bài change sau release thử, chưa áp dụng hiện tại.
- Chưa có yêu cầu A/B được chốt. Cần xác nhận có nhu cầu hay không trước khi mở đặc tả A/B; không tự thêm hai biến thể.

<a id="open"></a>
## Điểm cần làm rõ khi đặc tả

Ranh giới/cụm nghiệp vụ dùng chung tại [INDEX](business/INDEX.md#candidates) là đề xuất. Retry, lỗi kết hợp, hiển thị PAUSED, độ tươi số chỗ và hành vi khi mất cập nhật chưa có kết quả chi tiết được duyệt. Không tự chọn đáp án để viết test. Điểm đổi phạm vi quay lại review phạm vi; chi tiết bên trong phạm vi làm rõ ở bước 2.
