Ở điểm MVP, **bạn hiểu đúng và mình đồng ý sửa cách diễn đạt trước đó**. Khi thêm tính năng vào chính MVP, ta đang cập nhật cùng một kế hoạch:

**Chốt lại phạm vi → rà từ đầu qua các bước → giữ phần còn đúng, sửa/bổ sung phần cần thiết → cập nhật kế hoạch → tiếp tục theo kế hoạch mới.**

Không cần tạo thêm một việc “MVP cũ đang tạm dừng” để sau đó quay lại. Task từng đang làm có thể đã đổi hoặc không còn cần nữa.

Tuy nhiên, vẫn phải giữ thông tin **đã làm xong gì, đang dở gì, code/tài liệu ở bản nào và kết quả kiểm tra nào còn giá trị**. Đây là tiến độ vốn cần được cập nhật thường xuyên; không cần thêm file checkpoint, sao chép project hoặc một thủ tục lưu riêng mỗi khi quay lại rà yêu cầu.

Vì vậy, ở trường hợp này mình sẽ dùng cách gọi **“bảo toàn tiến độ và cập nhật kế hoạch MVP”** cho rõ nghĩa.

Về bug production, **mình đồng ý với hướng sửa trên một nhánh riêng, kiểm tra toàn dự án rồi đưa bản sửa vào các nhánh cần thiết**. Nhưng chỗ “luôn tạo từ master mới nhất” cần một điều kiện:

| Hiện trạng | Nên tạo nhánh sửa lỗi từ đâu? |
|---|---|
| `master` khớp bản đang chạy production | Từ `master` mới nhất, đúng như bạn đề xuất. |
| `master` đã có thay đổi chưa phát hành | Từ phiên bản thực sự đang chạy production, nếu mục tiêu là chỉ phát hành bản vá lỗi. |

Ví dụ: production đang là **1.0**, còn `master` đã có tính năng của **1.1**. Nếu vá lỗi từ `master` rồi triển khai, ta có thể đưa cả tính năng 1.1 lên cùng. Muốn phát hành riêng **1.0.1**, nên sửa từ bản 1.0. Nếu chủ động chọn phát hành luôn các thay đổi mới thì mới dùng nền `master`.

Luồng sửa lỗi mình khuyến nghị:

1. **Xác nhận và tái hiện bug**, thêm test bắt được lỗi; chọn đúng bản nguồn cần sửa.
2. **Sửa và đồng bộ mọi ảnh hưởng**, rồi chạy lượt kiểm tra toàn dự án trên bản vá, kể cả phần không đổi.
3. **Đưa bản sửa vào bản phát hành và `master`.** Nếu master đi trước production thì bản vá production và bản tích hợp master cần được kiểm chứng theo đúng nội dung của từng bản. Triển khai xong vẫn phải kiểm tra môi trường đang chạy.
4. **Cập nhật nhánh Feature từ `master` đã có bản sửa**, nếu nhánh đó tồn tại. Rà cả code, tài liệu, test và tiến độ; merge không báo xung đột chưa có nghĩa mọi thứ đã đúng.
5. **Tiếp tục Feature.** Ngay khi nhận bản sửa, kiểm tra bug và các tương tác bị ảnh hưởng. Khi Feature hoàn chỉnh, vẫn chạy lại toàn bộ lượt kiểm tra dự án của chính Feature đó.

Nếu nhánh Feature đã đổi cách hoạt động, cần tích hợp bản sửa phù hợp với yêu cầu mới, tránh chép nguyên quy tắc cũ làm mất phần đang phát triển.

**Chính lúc ngắt một Feature để sửa bug độc lập mới cần lưu rõ điểm tiếp tục của Feature.** Trong thời gian sửa bug, Feature tạm dừng; vẫn chỉ một việc được triển khai.

Mình đã cập nhật phần giải thích về [điều chỉnh MVP](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#mvp-replanning-state) và [luồng sửa bug production](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#production-bugfix-flow). Hai điểm này vẫn được ghi là đề xuất đang làm rõ.
