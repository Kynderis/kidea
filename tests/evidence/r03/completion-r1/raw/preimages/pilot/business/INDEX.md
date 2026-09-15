# Mục lục nghiệp vụ — ranh giới cụm đăng ký/hủy

Ranh giới ba nhóm và cụm đầu theo [xác nhận Human](D:/Code/kynderis/kidea/proposals/r03-pilot-boundary-review-r1.md); chưa có rule/test chi tiết được duyệt. Đây là mục lục nội dung, không chứa current task, returnStack hoặc approval tracker. Phạm vi ở [Feature Map](../features.md#goal); không sao chép rule thành nguồn có hiệu lực thứ hai. Chưa tạo `.kidea` trong lượt thử phương pháp này. Preimage trước cập nhật giữ trong snapshot phiên đọc 2 của repo Kidea.

<a id="candidates"></a>
## Nhóm trách nhiệm dùng chung

| ID / trách nhiệm đề xuất | Feature sử dụng | State và ranh giới cần thống nhất | Lý do / điểm mở |
|---|---|---|---|
| C-REG — đăng ký và sức chứa có thẩm quyền | [Đăng ký/hủy](../features.md#pil-f02), [quản trị](../features.md#pil-f03) | ACTIVE và phép kiểm số đăng ký so sức chứa; admin sửa sức chứa không được phá invariant | Cùng trách nhiệm giữ không vượt chỗ. Chưa chọn transaction/database, chưa chốt retry/lỗi kết hợp |
| C-LIFE — vòng đời workshop | [Xem](../features.md#pil-f01), [đăng ký/hủy](../features.md#pil-f02), [quản trị](../features.md#pil-f03) | DRAFT/OPEN/PAUSED và điều kiện nghiệp vụ áp dụng | Không sao chép rule trạng thái ở từng client. Hiển thị PAUSED và kết quả chi tiết chuyển trạng thái còn OPEN |
| C-VIEW — số chỗ hiển thị và cập nhật | [Xem](../features.md#pil-f01), [cập nhật/vận hành](../features.md#pil-f04) | Dữ liệu dẫn xuất/thời điểm quan sát, không có quyền quyết định nhận đăng ký | Phân biệt dữ liệu thật và hiển thị có thể trễ; cần hợp đồng event, lỗi/lặp/đảo thứ tự và đối chiếu |

Các mã trên nhận diện trách nhiệm nghiệp vụ đã chọn, không module/service/bảng dữ liệu được chốt. Không tách file chỉ vì có mã hoặc hai caller. Quyền actor cần nhất quán xuyên các nhóm; chưa đề xuất module identity riêng khi chưa cần trách nhiệm riêng. Nguồn hiện tại chỉ quy định backend kiểm quyền, không tin role client.

<a id="cluster"></a>
## Cụm đầu

Đăng ký/hủy cùng phần C-REG và C-LIFE cần dùng; đồng thời xác định đầu ra sang C-VIEW, không để event/số chỗ hiển thị thành việc không có người nhận trách nhiệm. Chỉ đặc tả sâu phần bắt buộc của cụm, không chờ toàn admin/monitoring hoặc Future. Các Feature còn lại vẫn giữ trong MVP, không bị loại vì chưa là cụm đầu.

Ranh giới và cụm theo xác nhận được dẫn ở đầu file; approval đó không duyệt các chi tiết còn mở dưới đây. Không có quyền tự chuyển task hoặc khai báo bước 1/2 hoàn tất.

<a id="questions"></a>
## Những điều chưa chốt

1. C-REG chịu trách nhiệm thống nhất đăng ký/sức chứa; cần cụ thể hóa quyền và kết quả các thao tác bên trong ranh giới đã chọn, không hỏi lại việc chia nhóm.
2. Thứ tự lỗi khi nhiều điều kiện cùng sai; cách nhận diện retry và kết quả trả lại sau gián đoạn: cần kết quả nghiệp vụ trước chọn kỹ thuật.
3. C-LIFE cần quy định hiển thị PAUSED/DRAFT cho từng actor; không suy rằng trạng thái có nghĩa giống nhau ở mọi caller.
4. C-VIEW cần quy định thông tin người dùng thấy khi số chỗ trễ/mất cập nhật, hợp đồng sự kiện và đối chiếu; chưa tự chốt ngưỡng thời gian.

5. C-REG cần làm rõ kết quả khi sửa sức chứa và đăng ký diễn ra đồng thời; invariant đã có không tự xác định mọi thứ tự/kết quả. Giữa C-REG/C-LIFE và C-VIEW cần chỉ rõ bên phát sinh thông tin thay đổi, bên nhận và nghĩa vụ đối chiếu. Đây là OPEN được làm rõ sau review hồ sơ, không thêm quyết định về module, event transport hoặc thuật toán.

Không hỏi lại rule MVP chỉ đăng ký/hủy khi OPEN hoặc việc giữ native: các phần đó đã có căn cứ trong Feature Map. Khi đi vào chi tiết phải đọc nguồn và giải quyết OPEN có ảnh hưởng, không lấy bảng ứng viên làm đặc tả hoàn chỉnh.
