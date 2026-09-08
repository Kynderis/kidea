Về kiểm tra, **mình đồng ý với bạn: sau mỗi Feature hoàn chỉnh phải có một lượt kiểm tra lại toàn dự án, kể cả những phần không thay đổi.** Cần ghi thành hai nghĩa vụ bắt buộc:

- **Trong lúc làm:** tìm đầy đủ nơi bị ảnh hưởng, cập nhật và kiểm tra chúng; tiếp tục lần theo dữ liệu, API/event, cấu hình và phần dùng chung, kể cả nơi không đổi code.
- **Trước khi khép Feature:** rà lại toàn bộ tài liệu, code, test, cấu hình, các bản đồ liên kết và chạy toàn bộ kiểm tra của bản project hiện tại. Không lấy kết quả “phần này không bị ảnh hưởng” để bỏ qua lượt cuối.

Lượt cuối phải kiểm tra cả **ý nghĩa có nhất quán không**: tài liệu yêu cầu A, code có thực hiện A và test có thật sự kiểm tra A không. Chỉ chạy test xanh hoặc kiểm tra link chưa đủ.

Nếu phát hiện lỗi, sửa và xử lý ảnh hưởng của lỗi đó, rồi **chạy lại lượt toàn dự án trên bản đã sửa**. Bản cuối đạt mới đủ điều kiện merge. Cách này tốn thêm thời gian nhưng phù hợp ưu tiên chất lượng của bạn. Tuy vậy, nó vẫn không chứng minh tuyệt đối rằng mọi tình huống chưa biết đều đã được bao phủ.

Về yêu cầu mới, cách chia MVP/production của bạn hợp lý. Mình đề xuất thêm một câu hỏi quyết định: **yêu cầu này được đưa vào bản đang làm, hay ghi nhận cho bản sau?** “Có liên quan” giúp xác định ảnh hưởng, nhưng chưa đủ để tự quyết định làm ngay.

| Tình huống | Cách xử lý mình khuyến nghị |
|---|---|
| **Đang MVP — bổ sung vào chính MVP** | Lưu điểm dừng, quay bước 1 chốt phạm vi mới, rồi rà lại toàn bộ chuỗi nghiệp vụ → thiết kế → kiến trúc → test → kế hoạch/code. Cập nhật đủ phần bị ảnh hưởng rồi tiếp tục MVP. |
| **Đang MVP — bổ sung vào FUTURE** | Ghi yêu cầu đủ rõ và đánh giá sơ bộ ảnh hưởng tới quyết định hiện tại. Nếu không có ràng buộc cần xử lý ngay thì tiếp tục MVP. Chỉ mở lại kiến trúc khi có lý do cụ thể. |
| **Đã có production — yêu cầu làm đổi phần đang phát triển** | Nếu đưa vào cùng đợt: quay lại chốt yêu cầu, sửa tài liệu nguồn, ghi rõ những phần đã làm bị ảnh hưởng và xử lý lại chúng. Production vẫn giữ trạng thái của bản đã phát hành cho tới khi triển khai bản mới. |
| **Đã có production — yêu cầu độc lập với việc đang làm** | Mặc định đề xuất đưa vào FUTURE để hoàn tất việc hiện hành trước. Khi bạn chọn triển khai, mở một đợt thay đổi tiếp theo. Nếu bạn ưu tiên nó ngay, lưu điểm dừng và đổi thứ tự; vẫn chỉ làm một việc. |

**“Làm lại từ đầu” nên hiểu là quay lại chốt phạm vi và rà lại chuỗi, giữ những phần vẫn đúng.** Không cần xóa code, viết lại mọi tài liệu hay duyệt lại phần không thay đổi. Chẳng hạn bổ sung điều kiện hủy đăng ký có thể làm đổi rule, API, giao diện và test; phần đăng nhập vẫn được giữ nếu đã đối chiếu và không bị ảnh hưởng.

Riêng **FUTURE, mình không khuyến nghị tự động bắt đầu từ thiết kế kiến trúc**. Kiến trúc cần căn cứ từ yêu cầu. Ví dụ dự kiến sau này có workshop trả phí: có thể rà xem mô hình dữ liệu hiện tại có gây trở ngại lớn không, nhưng chưa vì thế mà xây sẵn hệ thống thanh toán. Khi Feature FUTURE thực sự được chọn làm, vẫn bắt đầu từ bước chốt phạm vi.

Có hai trường hợp cần phân biệt thêm:

- **Trùng hoàn toàn yêu cầu đã có:** dẫn về yêu cầu đó và kiểm tra trạng thái, không tạo Feature mới. Cùng tên nhưng đổi điều kiện/quyền/hành vi thì vẫn là thay đổi.
- **Lỗi nghiêm trọng ở production:** cần xem xét ưu tiên xử lý, không mặc định xếp FUTURE chỉ vì không liên quan việc hiện hành.

Mỗi lần đổi sẽ ghi rõ **đổi gì, vì sao, nguồn nào đổi, phần đã làm nào bị ảnh hưởng, việc cần xử lý lại và kết quả duyệt/test nào cần cập nhật**. Ghi chú phải đi cùng việc xử lý, không thay cho việc xử lý.

Mình đã cập nhật [đề xuất kiểm tra toàn dự án](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#feature-final-check) và [bảng tiếp nhận yêu cầu mới](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#new-request-intake-proposal) để trao đổi tiếp, chưa ghi nhận các phương án này là đã được duyệt.
