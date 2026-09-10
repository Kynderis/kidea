Hiểu đơn giản: **quyền 1 cho Kidea tự lưu công việc đang làm; quyền 2 cho Kidea đưa phần đã hoàn thiện vào bản tích hợp chung.** Cả hai đều không tự cho phép đưa thay đổi tới người dùng thật.

Lấy ví dụ bạn giao: **“Thêm tính năng hủy đăng ký workshop.”**

### 1. Quyền tự lưu: làm đến đâu, lưu tiến độ đến đó

Kidea làm trên một **nhánh riêng** — nơi giữ thay đổi của tính năng này, tách khỏi nhánh tích hợp chung `master`.

Nếu bạn đã cho phép tự lưu trong đợt này, Kidea có thể:

- Sửa đặc tả rồi lưu một mốc.
- Viết backend rồi lưu một mốc.
- Sửa giao diện và test rồi lưu tiếp.

Các mốc đó gọi là **commit**: ghi lại một phiên bản của những file thuộc công việc, giúp biết đã thay đổi gì và tiếp tục sau này. Kidea không phải hỏi “Cho mình lưu nhé?” sau mỗi lần.

**Lưu được không có nghĩa làm xong.** Ví dụ backend đã làm nhưng giao diện chưa xong, Kidea vẫn được lưu tiến độ, nhưng phải ghi rõ tính năng còn dở.

Quyền này cũng không cho Kidea tự xóa hoặc ghi đè thay đổi có sẵn của bạn, sửa lịch sử, hay commit trực tiếp vào master.

### 2. Quyền merge: đủ điều kiện thì đưa vào bản tích hợp chung

**Merge** là ghép thay đổi từ nhánh tính năng vào `master`.

Nếu bạn đã cho phép merge cho đợt “hủy đăng ký workshop”, Kidea chỉ thực hiện khi:

1. Đặc tả, code, test và các phần bị ảnh hưởng đã được xử lý đầy đủ.
2. Mọi review, kiểm tra toàn dự án và các điểm cần bạn duyệt đều đã đạt.
3. Bản kết hợp giữa tính năng mới và master hiện tại đã được kiểm chứng.

Khi đủ các điều kiện đó, Kidea tự merge rồi xác nhận kết quả; **không hỏi thêm chỉ để bạn đồng ý bấm nút merge**.

Ví dụ có tình huống phát sinh:

- Tính năng đã qua test, nhưng master vừa nhận một bản sửa khác.
- Khi ghép lại, ta có một bản kết hợp mới.
- Nếu đầu vào kiểm chứng thay đổi, Kidea phải chạy lại toàn bộ lượt kiểm tra theo G2. Có lỗi hoặc thiếu căn cứ thì dừng, không lấy kết quả cũ để thông qua.

**Không cấp quyền merge thì dù test đạt, Kidea vẫn phải chờ. Cấp quyền merge rồi nhưng test chưa đạt thì cũng phải chờ.**

### Bạn đang giao quyền gì, và chưa giao quyền gì?

| Cho phép | Kidea được làm | Chưa được suy ra |
|---|---|---|
| Tự lưu | Lưu tiến độ trên nhánh làm việc ở máy đang dùng | Đưa vào master hoặc gửi lên GitHub |
| Merge | Ghép bản đủ điều kiện vào nhánh tích hợp đã chỉ định | Phát hành cho người dùng |
| Push — quyền riêng | Gửi thay đổi tới remote, chẳng hạn GitHub, đúng phạm vi cho phép | Tự deploy |
| Deploy — quyền riêng | Triển khai lên môi trường được chỉ định | Tự mở rộng sang môi trường khác hoặc sửa dữ liệu thật ngoài quyền |

Lưu ý: nếu merge trực tiếp trên GitHub thì thao tác đó thay đổi repository trên GitHub, nên còn cần quyền ghi tới remote/nhánh đích. Nếu push hoặc merge kích hoạt tự động deploy, Kidea cũng phải kiểm tra quyền cho tác động đó; không được dùng quyền Git để lách quyền production.

**Tóm lại: bạn không phải duyệt từng lần lưu hoặc từng cú bấm merge, nhưng vẫn giữ quyền chốt nội dung, điều kiện chất lượng và việc phát hành.**

Hiện ta đang chốt **chính sách Kidea sẽ tuân theo**; chưa cấp quyền thao tác trên pilot hay production cụ thể.
