# R03-T02 — từ ý tưởng đến phạm vi và nghiệp vụ dùng chung

Ngày 2026-09-15. Gói `R03-T02-S02-r1`: **IN_REVIEW**. Bản đề xuất phương pháp, chưa tích hợp vào skill hoặc áp dụng để duyệt nghiệp vụ pilot.

Căn cứ: [thiết kế hiện hành](../KIDEA_DESIGN.md), [kế hoạch R03](r03-method-entry-r1.md), [nguồn tham khảo và giới hạn](../references/business-spec/README.md). Human “ok làm đi” sau answer `5a9fbdb5620bd8098114dac4f410116a7a970f91` cho soạn bản này, không duyệt trước kết quả.

## 1. Kidea sẽ làm gì

Human nói ý tưởng bằng lời bình thường. AI đọc hồ sơ đã có, chỉ hỏi những điều còn thiếu có thể làm đổi sản phẩm. AI viết một bản phạm vi dễ đọc, đề xuất phần nghiệp vụ cần thống nhất chung, rồi làm từng cụm nhỏ sau khi được duyệt. Không yêu cầu Human điền JSON hoặc một bộ biểu mẫu dài.

Giữ nguyên nguyên tắc đã chốt: Human chọn MVP/Future/Idea; không đặc tả sâu Future; không lấy code cũ làm yêu cầu; không tự duyệt; nghiệp vụ ở nguồn sản phẩm, tiến độ và căn cứ review ở `.kidea`. Bản này chỉ cụ thể hóa cách thực hiện bước 1 và cách vào bước 2.

## 2. Nhận ý tưởng và ghi phạm vi

AI đọc mục tiêu, Feature Map và xác nhận còn hiệu lực trước khi hỏi. Với project cũ, ghi riêng hành vi quan sát được và nhu cầu Human muốn; điểm khác nhau cần làm rõ, không tự sửa yêu cầu để khớp code.

Thông tin cần đủ để đề xuất phạm vi:

- Ai dùng, gặp vấn đề gì, kết quả nào cho thấy vấn đề được giải quyết.
- Đợt hiện tại muốn làm gì, không làm gì; ràng buộc đã biết về quyền, dữ liệu, nền tảng hoặc vận hành có ảnh hưởng phạm vi.
- Nội dung nào công khai, nội dung nào riêng tư và ai được thay đổi; có nhu cầu thử hai biến thể A/B hay không. Chỉ đặc tả A/B sâu khi có nhu cầu thực, không mặc định thêm vào sản phẩm.
- Điều nào Human đã quyết; điều nào AI đang đề xuất; điều nào còn OPEN. Thiếu câu trả lời không trở thành sự đồng ý.

Đề xuất dùng một bảng Feature trong nguồn đang có, không tạo file riêng cho từng ý tưởng:

| Mục | Nội dung tối thiểu |
|---|---|
| ID và tên | Mã ổn định cùng tên Human hiểu được |
| Người dùng và kết quả | Ai làm gì và nhận được gì, không phải danh sách màn hình |
| Phân loại | MVP/Future/Idea theo xác nhận; chưa chọn thì ghi rõ chưa chốt, không tự đưa vào MVP |
| Ranh giới | Bao gồm, không bao gồm, ràng buộc quan trọng và nguồn xác nhận |
| Liên quan / còn mở | Phần dùng chung dự kiến, điểm còn thiếu có thể đổi phạm vi |

Giữ lời yêu cầu gốc hoặc tham chiếu tới bằng chứng của nó; diễn giải của AI không thay lời Human. Không nhân bản trạng thái APPROVED trong bảng: bảng dẫn tới review hiện hành khi cần tra.

**Điểm dừng bước 1:** Human duyệt phạm vi đợt hiện tại và Feature Map. Câu hỏi làm đổi lựa chọn Feature, đối tượng dùng hoặc ranh giới phải giải quyết trước gate. Chi tiết rule bên trong phạm vi đã chọn có thể còn OPEN để làm ở bước 2; không bắt đặc tả xong mới cho chốt phạm vi.

## 3. Tìm phần dùng chung và chọn cụm

AI xem toàn Feature Map để tìm ứng viên nhưng chỉ viết sâu phần cần cho cụm hiện tại. Mỗi ứng viên cần nêu trách nhiệm, các Feature thực sự sử dụng, dữ liệu/trạng thái mà nó chịu trách nhiệm, điều luôn phải đúng, lý do tách hoặc giữ chung, và điểm còn mở.

Hai nơi có tên giống nhau chưa đủ để gộp. So sánh mục đích, đầu vào/kết quả, quy tắc và bên chịu trách nhiệm trạng thái. Nếu chỉ một nơi dùng và không có quy tắc trạng thái chung quan trọng, ưu tiên giữ trong Feature. Nếu sau này có nơi thứ hai dùng, trình đề xuất tách cùng ảnh hưởng; không tự refactor tài liệu.

**Đề xuất cách chọn cụm:** chọn một kết quả người dùng đủ nhỏ, nhưng gồm đủ phần dùng chung bắt buộc để mô tả chính xác. Không chờ viết hết tất cả nghiệp vụ chung của toàn MVP. AI đề xuất thứ tự dựa trên dependency thật và rủi ro, không coi đây là quyền thay ưu tiên Human.

Human duyệt danh sách/ranh giới phần dùng chung và cụm đầu trước khi đặc tả phụ thuộc. Có thể duyệt cùng gói phạm vi khi các đầu ra đã đủ căn cứ; không bắt hai lượt hỏi riêng. Duyệt ranh giới không đồng nghĩa duyệt các rule chi tiết chưa viết.

## 4. Ví dụ workshop — chỉ minh họa, không thêm quyết định pilot

Phạm vi đã có trong [DESIGN](../KIDEA_DESIGN.md#pilot-scope): xem workshop; đăng ký/hủy; quản trị; cập nhật/vận hành. Thanh toán không thuộc MVP đã chốt. Hai ACTIVE toàn hệ thống và hủy khi PAUSED là tình huống change về sau.

Ứng viên minh họa để kiểm phương pháp:

| Ứng viên | Nơi dùng / trách nhiệm | Vì sao cần làm rõ chung |
|---|---|---|
| Đăng ký và sức chứa | Đăng ký/hủy, sửa sức chứa; trạng thái đăng ký ACTIVE và số chỗ có thẩm quyền | Cùng phải giữ số đăng ký không vượt sức chứa; không để hai nơi định nghĩa hai cách đếm |
| Trạng thái workshop | Xem, đăng ký/hủy, quản trị | DRAFT/OPEN/PAUSED có tác động khác nhau; quyền chuyển và hành vi từng trạng thái cần nhất quán |
| Số chỗ hiển thị | Xem workshop và cập nhật/vận hành | Là dữ liệu dẫn xuất có thể trễ, không được dùng thay số chỗ có thẩm quyền để nhận đăng ký |

Đề xuất cụm đầu để đánh giá: đăng ký/hủy cùng phần sức chứa và trạng thái cần dùng. Không cần đặc tả toàn bộ màn hình admin/monitoring trước, nhưng phải đọc các ràng buộc của chúng và ghi dependency; không bỏ nghĩa vụ event/số chỗ hiển thị. Đây là ứng viên, chưa tự chốt thành ba module hoặc ba bảng database.

Câu hỏi minh họa cần bước 2: khi một yêu cầu đồng thời không đủ quyền và workshop không OPEN, kết quả từ chối nào được trả? Cách nhận diện một yêu cầu retry và kết quả trả lại là gì? Những chi tiết này không được tự điền từ suy đoán hoặc che bằng từ “xử lý lỗi”. Không cần hỏi lại việc MVP có hủy khi PAUSED hay không vì đã chốt là không.

## 5. Bàn giao vào bước 2 và điều kiện review

AI đọc từng nguồn liên quan đầy đủ, phân loại phần cần viết mới / tái sử dụng / còn mở. Với tái sử dụng, dẫn đúng mục và kiểm hợp đồng, không chép rule sang nơi thứ hai. Mục lục nghiệp vụ chỉ giữ ID, mô tả và link; current item/đường quay lại giữ ở work, không tạo tracker riêng trong mục lục.

Đầu vào cho T03/T04: phạm vi, cụm và ranh giới đã được duyệt; nguồn rule/state liên quan; danh sách OPEN và các kết quả người dùng cần kiểm. Mẫu rule/flow, AC (điều kiện chấp nhận) và business test được soạn ở T03/T04, không xem bản này là approval cho mẫu chưa tồn tại.

## 6. Rà soát bàn giấy của bản đề xuất

Đây là đối chiếu phương pháp bằng tình huống, **không phải thử AI độc lập hoặc test sản phẩm chạy được**.

| Tình huống rà | Kết quả phương pháp yêu cầu / đối chiếu |
|---|---|
| Human chỉ nhắc ý tưởng thanh toán | Chưa chọn thì không vào MVP; nguồn ghi rõ đề xuất/chưa chốt |
| Code cũ có hành vi khác yêu cầu | Nêu sai khác và làm rõ; không chốt theo code |
| Cùng tên nhưng khác quyền/state | Không gộp tự động; giữ OPEN/đề xuất ranh giới |
| Phần chung chỉ phục vụ cụm MVP sau | Ghi nhận ứng viên, chưa đặc tả sâu |
| Từ Feature chuyển sang làm dependency | Ghi điểm quay lại ở work, không thêm trạng thái ở INDEX nghiệp vụ |
| Số chỗ cache còn một nhưng thực tế đã hết | Không dùng số dẫn xuất để quyết định; phân biệt trách nhiệm hai nguồn |
| Chưa rõ thứ tự lỗi | OPEN ở rule bước 2; không tự sinh expected result |
| Human duyệt phạm vi | Chỉ khép đúng gate phạm vi; chưa duyệt rule/test, task DONE hay quyền triển khai |

Kết quả: tám tình huống có cách xử lý rõ trong bản đề xuất; chưa có bằng chứng hành vi thực qua skill. Không đổi runtime, schema, nguồn tham khảo hoặc hồ sơ pilot.

## 7. Gói cần Human quyết

**D1 — Duyệt cách làm tại mục 2–3 và 5:** một bảng phạm vi vừa đủ, chỉ hỏi điều làm đổi quyết định; chốt phạm vi trước rồi làm rõ rule theo cụm; duyệt ranh giới dùng chung trước phần phụ thuộc. Lợi ích là không phải trả lời mọi chi tiết ngay từ đầu; điều cần chấp nhận là bước 2 vẫn có thể phát hiện vấn đề buộc quay lại sửa phạm vi và review phần bị ảnh hưởng.

Mục 4 chỉ là ví dụ kiểm phương pháp, **không xin duyệt ranh giới nghiệp vụ pilot**. Mục 6 không là nghiệm thu AI. Sau D1, tiếp tục soạn mẫu rule/state/flow và AC/test trong repo; chưa tạo hồ sơ pilot, thêm AI hoặc tích hợp skill. Quyền pilot và loạt kiểm chứng được trình một gói cụ thể trước khi cần thực thi.
