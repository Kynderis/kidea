Được, ta chuyển sang AC/test và đi từng phần. Mình đã đọc lại toàn bộ tài liệu; hiện mục 8 mô tả cách thiết kế test khá nhiều, nhưng **AC mới được nhắc tên ở mục 6.3, chưa có quy tắc viết và liên kết cụ thể**. Nên bắt đầu từ chỗ này.

Mình đề xuất thứ tự:

1. AC viết thế nào, nằm ở đâu và liên kết với nghiệp vụ ra sao.
2. Một Business Test Specification cần ghi những gì.
3. Test phần dùng chung và test Feature khác nhau thế nào để tránh trùng lặp.
4. Cách xác định đủ coverage và cập nhật test khi nghiệp vụ thay đổi.

**Trước hết, AC có vai trò gì khi đã có đặc tả nghiệp vụ?**

AC là tiêu chí chấp nhận: diễn đạt hành vi cần đạt ở góc nhìn người sử dụng hoặc kết quả nghiệp vụ. Nó giúp Human kiểm tra Feature có đáp ứng mục tiêu hay không.

Đặc tả chi tiết giải thích từng rule và cách các bước phối hợp. AC chọn ra những kết quả cần được chấp nhận; test đưa tình huống cụ thể để kiểm tra các kết quả đó.

Ví dụ minh họa Feature “Hủy đơn hàng”, giả sử nghiệp vụ đã chốt:

- Chỉ chủ đơn được yêu cầu hủy.
- Đơn ở trạng thái `CHỜ_XỬ_LÝ` được hủy.
- Hủy thành công chuyển đơn sang `ĐÃ_HỦY`.
- Đơn `ĐANG_GIAO` không được hủy; từ chối thì trạng thái giữ nguyên.

AC có thể viết:

| AC | Tiêu chí chấp nhận | Căn cứ nghiệp vụ |
|---|---|---|
| `CANCEL-AC-01` | Chủ đơn hủy đơn đang chờ xử lý thì nhận kết quả thành công và đơn chuyển sang đã hủy. | Quyền hủy + chuyển trạng thái |
| `CANCEL-AC-02` | Yêu cầu hủy của người không phải chủ đơn bị từ chối; đơn giữ nguyên trạng thái. | Quyền hủy |
| `CANCEL-AC-03` | Chủ đơn yêu cầu hủy đơn đang giao thì bị từ chối; đơn vẫn đang giao. | Giới hạn trạng thái được hủy |

Một test cụ thể cho `CANCEL-AC-01`:

| Thành phần | Nội dung |
|---|---|
| Căn cứ | `CANCEL-AC-01` và các rule quyền hủy/chuyển trạng thái |
| Trạng thái ban đầu | Đơn `O-01` thuộc người dùng `U-01`, trạng thái `CHỜ_XỬ_LÝ` |
| Sự kiện | `U-01` yêu cầu hủy `O-01` |
| Kết quả mong đợi | Hủy thành công |
| Trạng thái cuối | `O-01` thành `ĐÃ_HỦY`; chủ đơn vẫn là `U-01` |

Đây chỉ là ví dụ cho một nhánh thành công. Các nhánh từ chối và trường hợp khác cần test riêng theo phạm vi nghiệp vụ đã chốt.

**Để AC hữu ích mà tài liệu vẫn gọn, mình đề xuất:**

- Đặt AC và Business Test Specification ngay trong file Feature; chưa tạo file riêng.
- Mỗi AC ghi rõ hoàn cảnh, hành động và kết quả quan sát được. Tránh câu như “hủy đơn hoạt động đúng”.
- AC liên kết tới rule/flow nguồn, không sao chép toàn bộ công thức hoặc đặc tả dùng chung.
- Test liên kết trực tiếp tới rule/state/flow được kiểm tra, và tới AC nếu có. Không bắt mọi test chi tiết phải đi vòng qua một AC.
- Nghiệp vụ dùng chung có test cho contract của chính nó. Chưa cần thêm một lớp AC riêng nếu nó chỉ lặp lại contract.
- Nếu viết AC hoặc test làm lộ một câu hỏi chưa chốt — chẳng hạn “hủy lại đơn đã hủy thì trả gì?” — ghi `OPEN` và làm rõ nghiệp vụ trước khi điền kết quả mong đợi.

Điểm đáng bàn đầu tiên là **AC nên là một danh sách tiêu chí chấp nhận ngắn trong Feature, còn độ chi tiết và bao phủ nằm ở rule cùng test liên quan**. Như vậy Human có phần đọc nhanh mà AI vẫn truy ngược được đầy đủ.

Đây là đề xuất để ta bàn tiếp, chưa sửa mục AC/test trong tài liệu phương pháp. Câu trả lời đã được lưu vào [answer.md](https://github.com/Kynderis/kidea/blob/master/answer.md) và push lên GitHub.
