# Workshop — Feature Map

Bộ hồ sơ nghiệp vụ lab để kiểm cách Kidea viết/đọc đặc tả. Căn cứ: [phạm vi gốc](D:/Code/kynderis/kidea/KIDEA_DESIGN.md#pilot-scope), [gói quyết định R03](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md), [retry/thứ tự/đồng thời](D:/Code/kynderis/kidea/proposals/r03-registration-decisions-r1.md). Nội dung tài liệu không là bằng chứng code chạy hoặc Human duyệt đầu ra.

<a id="goal"></a>
## Mục tiêu

Người tham gia xem workshop, đăng ký/hủy chỗ và xem lịch sử của mình; admin quản lý workshop. Hệ thống phải giữ đúng chỗ và đối chiếu được số chỗ hiển thị. Khách chỉ xem công khai. Dữ liệu giả, không người dùng thật.

<a id="pil-f01"></a>
## PIL-F01 — Xem workshop — MVP

Danh sách/chi tiết, nội dung/lịch/sức chứa/số chỗ và thời điểm quan sát; chính sách hiển thị và luồng tại [Xem](business/features/view.md#flow).

<a id="pil-f02"></a>
## PIL-F02 — Đăng ký/hủy — MVP

Đăng ký, hủy chính chủ, đăng ký lại, lịch sử cá nhân, xử lý gửi lại yêu cầu và tranh chỗ; luồng tại [Đăng ký/hủy](business/features/register-cancel.md#flow). Quy tắc chỉ có một nguồn ở các mục shared, không riêng từng client.

<a id="pil-f03"></a>
## PIL-F03 — Quản trị — MVP

Tạo/sửa/xuất bản/tạm dừng/mở lại workshop, quản lý sức chứa; chỉ web admin. [Luồng và AC](business/features/admin.md#flow).

<a id="pil-f04"></a>
## PIL-F04 — Cập nhật/vận hành — MVP

Xử lý cập nhật bất đồng bộ, version, dữ liệu trễ/gián đoạn/phục hồi; monitoring web admin. [Luồng và AC](business/features/updates.md#flow). Hiển thị không có thẩm quyền nhận chỗ.

<a id="boundaries"></a>
## Nền tảng và giới hạn lab

Backend C++ Ubuntu sở hữu rule/dữ liệu; web SvelteKit/TypeScript, SSR không sở hữu rule thứ hai. Trang giới thiệu tĩnh kiểm prerender; danh sách/chi tiết công khai đọc được trước JavaScript. Android Kotlin/Compose và iOS Swift/SwiftUI cùng backend, mỗi app hai màn hình danh sách (lọc đăng ký của tôi) và chi tiết/đăng ký/hủy. Không thay native bằng web.

Seed đích: 3 workshop, 10 người tham gia giả, 1 admin giả, sức chứa 10; fixture tranh chỗ cuối còn 1 chỗ. Đây chưa là dữ liệu runtime đã tạo. Giới hạn C=1000 trong rule không là cam kết chịu tải. Không code/build/deploy trong gói hồ sơ R03.

Không thanh toán, email/SMS/push, waitlist, public release, dịch vụ tính phí; lab không cho lập chỉ mục, chưa nhận SEO đạt. Ngân sách phát sinh 0 đồng. Kiến trúc/giao thức/storage, ngưỡng đo số giây, UX/wireframe, môi trường/thiết bị và nghiệm thu thực thuộc phase sau.

<a id="later"></a>
## Future — hai bài change giữ nguyên

- Giới hạn hai ACTIVE trên toàn workshop: chưa áp dụng MVP.
- Cho hủy khi PAUSED nhưng không cho đăng ký mới khi PAUSED: chưa áp dụng MVP.

Không A/B trong pilot theo B8; không đặc tả thêm hai biến thể.

<a id="open"></a>
## Tra cứu và phần chưa chứng minh

[Mục lục nghiệp vụ](business/INDEX.md#candidates) liên kết nguồn chung và bốn Feature. [Test specification](business/tests.md#coverage) ghi coverage và phần chưa chạy. Không có OPEN nghiệp vụ mới được tự chốt ngoài quyết định nguồn; chi tiết kỹ thuật để lại đúng phạm vi đã hoãn, không giả là ứng dụng đã đạt.
