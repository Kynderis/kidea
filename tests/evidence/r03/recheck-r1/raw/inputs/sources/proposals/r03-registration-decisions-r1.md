# Đăng ký/hủy — ba quyết định hành vi đầu tiên

Ngày 2026-09-15. `R03-REG-RULES-r1`: **IN_REVIEW**. Đề xuất để Human chốt, chưa là rule sản phẩm hiện hành. Căn cứ [ranh giới đã duyệt](r03-pilot-boundary-review-r1.md) và [Feature Map](D:/Code/kynderis/kidea-workshop-pilot/docs/features.md). Chưa tạo file nghiệp vụ mới trong pilot hoặc sửa skill.

Cập nhật: **D1–D3 APPROVED** ngày 2026-09-15. Human “duyệt tất cả” sau answer `2659512` chấp nhận ba quyết định đã trình, đồng thời yêu cầu gom toàn bộ quyết định/quyền/kiểm chứng trước thực hiện. Không mở rộng approval sang rule chưa trình, file mới hoặc quota AI. Nội dung phía dưới giữ bản đã duyệt.

Giữ nguyên: chỉ đăng ký/hủy khi OPEN; một ACTIVE/người/workshop; không vượt sức chứa; admin không có quyền hủy hộ; cache không quyết định nhận đăng ký. D1 bên dưới phân biệt *đọc lại kết quả thao tác cũ* với *thực hiện thao tác mới*, không thêm quyền hủy khi PAUSED.

## D1 — gửi lại cùng yêu cầu không thực hiện lần hai

Đề xuất mỗi ý định đăng ký/hủy có mã yêu cầu, gắn với người dùng và nội dung thao tác. Client giữ cùng mã khi chỉ gửi lại do mất phản hồi. Sau khi xác thực quyền truy cập kết quả:

- Cùng mã và cùng nội dung, đã có kết quả cuối: trả lại kết quả cũ, không sửa đăng ký/số chỗ và không tạo tác dụng nghiệp vụ lần hai.
- Cùng mã nhưng nội dung khác: từ chối xung đột, không thực hiện yêu cầu mới.
- Đang xử lý hoặc chưa xác định kết quả: báo chưa có kết quả cuối; tra/tiếp tục cùng yêu cầu, không tự coi thất bại và gửi một yêu cầu mới.
- Muốn thực hiện ý định mới, kể cả thử lại sau lần từ chối hết chỗ: dùng mã mới và kiểm toàn bộ điều kiện hiện tại.

Giữ kết quả cuối của mã trong vòng đời dữ liệu pilot, không tự hết hạn/xóa; thời điểm xử lý lỗi kỹ thuật chưa xác định không được ghi thành kết quả nghiệp vụ cuối. Tách kết quả lịch sử khỏi trạng thái đăng ký hiện tại khi hiển thị. Cơ chế lưu/mã/giao thức được chốt ở kỹ thuật sau, nhưng không được làm thay đổi hành vi này.

Ví dụ: đăng ký đã thành công nhưng điện thoại mất phản hồi. Gửi lại cùng mã chỉ đọc lại thành công cũ; nếu workshop nay PAUSED hoặc đăng ký đã được hủy, không tạo ACTIVE mới và không nói trạng thái hiện tại vẫn ACTIVE. Một lần đăng ký mới dùng mã mới và bị kiểm theo trạng thái hiện tại.

Đánh đổi: phải giữ lịch sử yêu cầu và làm rõ trạng thái chưa biết; đổi lại không mất thêm chỗ hoặc lặp tác dụng phụ vì mạng chập chờn. Chưa chọn TTL hay cơ chế cleanup.

## D2 — thứ tự kết quả từ chối cho yêu cầu mới

Đề xuất xử lý tuần tự; điều kiện trước chưa đạt thì không dùng lỗi sau để báo thay:

1. Kiểm nhận diện người dùng và dữ liệu đủ để hiểu yêu cầu; dữ liệu sai hình thức được báo riêng, chưa là từ chối nghiệp vụ. Không đọc lại kết quả của người khác.
2. Kiểm quyền truy cập đối tượng/quyền thao tác; không đủ quyền hoặc không có đối tượng trong phạm vi được truy cập thì báo không thể thực hiện, không tiết lộ chi tiết nguồn không được phép.
3. Workshop có OPEN không: không OPEN thì báo hiện không nhận thao tác đăng ký/hủy.
4. Trạng thái đăng ký: đăng ký mới khi đã ACTIVE thì báo đã đăng ký, không tạo thêm; hủy bản đã hủy thì báo đã hủy, không thay đổi. Hủy phải nhận diện đúng lần đăng ký, không được hủy nhầm lần đăng ký lại mới hơn.
5. Với đăng ký mới chưa ACTIVE: kiểm sức chứa; đầy thì báo hết chỗ, còn thì nhận. Hủy ACTIVE hợp lệ làm mất hiệu lực ACTIVE đó và giải phóng một chỗ.

D1 đọc lại kết quả cũ sau kiểm quyền không đi qua thứ tự kiểm yêu cầu mới này; quyền hiện tại vẫn phải hợp lệ. Một yêu cầu mới bị từ chối không thay dữ liệu nghiệp vụ và không phát sinh thay đổi chỗ.

Ví dụ: workshop PAUSED và đã đầy → báo tạm dừng, không báo hết chỗ. Nếu không đủ quyền → báo không thể thực hiện trước, không cho biết workshop còn bao nhiêu chỗ. Nếu cùng mã đã có kết quả thành công trước đây → D1 trả kết quả lịch sử, không nhận thêm chỗ.

Đánh đổi: thứ tự này quyết định thông báo người dùng thấy. Chưa chốt câu chữ UI/mã HTTP; không lấy thứ tự này làm công thức test mọi tổ hợp.

## D3 — đăng ký và sửa sức chứa đồng thời

Đề xuất các thay đổi có kết quả tương đương một thứ tự hợp lệ trên dữ liệu có thẩm quyền. Mỗi thao tác xét trạng thái sau các thao tác đã được chấp nhận trước nó. Không ưu tiên mặc định admin hoặc người tham gia và không hứa “ai bấm trước thắng”.

Ví dụ C=10,N=9, admin giảm C xuống 9 cùng lúc người mới đăng ký:

- Đăng ký được chấp nhận trước → N=10; giảm C xuống 9 bị từ chối, C vẫn 10.
- Giảm C được chấp nhận trước → C=9,N=9; đăng ký mới bị từ chối vì đầy.

Cả hai kết quả đều hợp lệ; không được cùng chấp nhận và tạo N>C. Khi hai người tranh một chỗ, không nhận cả hai; thứ tự kết quả cụ thể do hệ thống xác lập, không do số chỗ cache. Quy tắc cũng phải giữ khi thay trạng thái workshop; điều kiện OPEN được xét ở thời điểm quyết định, không chỉ lúc màn hình tải.

Đánh đổi: một người có thể thấy còn chỗ rồi bị từ chối do dữ liệu đã đổi; đổi lại không nhận vượt chỗ. Chưa chọn lock/transaction/database hoặc quy tắc công bằng/latency; các phần đó không được tự suy là đã đạt.

## Kiểm tra đề xuất và giới hạn gói

Rà bàn giấy các cặp: mất phản hồi/gửi lại; cùng mã khác nội dung; PAUSED+đầy; không đủ quyền+PAUSED; hủy lặp; hủy bản cũ sau đăng ký lại; giảm chỗ đồng thời đăng ký theo hai thứ tự. Đề xuất có kết quả dự kiến, chưa là test chạy được hoặc coverage đã nghiệm thu. Chi tiết chuyển trạng thái đăng ký, miền dữ liệu/mã lỗi, hợp đồng event và phục hồi vẫn cần đặc tả/test sau approval.

Hiển thị DRAFT/PAUSED, số chỗ trễ/mất kết nối và tiêu chí độ tươi chưa thuộc ba quyết định này. Không thay chúng bằng mặc định ngầm. Human có thể duyệt cả D1–D3 hoặc chỉ chọn từng mục; approval không cấp file mới, AI, Git/`.kidea` pilot hoặc code/deploy.
