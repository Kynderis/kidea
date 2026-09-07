**Đã cập nhật thiết kế theo ranh giới bạn duyệt**, đồng thời rà tổng quan thiết kế, roadmap và bộ nghiệm thu.

### Phần đã cập nhật

- Tài liệu nghiệp vụ, kiến trúc, coding rules, mapping và bằng chứng sản phẩm nằm ngoài `.kidea`.
- `.kidea` giữ trạng thái, big-step/phase/task, checkpoint, kế hoạch và review.
- Mỗi dữ kiện có một nguồn chính; review trỏ tới đúng nội dung/phiên bản, không sao chép tài liệu.
- Đã đồng bộ init, resume, quyền ghi, giao diện tiến độ và các case kiểm thử qua hai vùng thư mục. Phép đo cũng tính phần tài liệu bên ngoài thực sự cần đọc.

Chi tiết tại [cấu trúc hiện hành](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#files-view). Đây là cập nhật **thiết kế cho project tương lai**, chưa tạo skill/pilot hoặc di chuyển dữ liệu project thật.

### Những điểm cần làm tốt hơn

Mình chưa thấy cần thay toàn bộ hướng thiết kế. Tuy nhiên, có các điểm đáng xử lý trước khi đi tiếp:

| Vấn đề | Đề xuất của mình |
|---|---|
| **1. Chọn repo pilot đang quá muộn.** P04 sẽ tạo tài liệu pilot, nhưng thiết kế để đến P11 mới chọn repo chứa nó. | Chọn nơi lưu/repo pilot ngay khi bắt đầu tài liệu ở P04. P11 chỉ chốt môi trường và quyền chạy/deploy. Chưa cần tạo repo bây giờ. |
| **2. Cần tránh bằng chứng tự trở thành “cũ”.** Nếu ghi kết quả test làm đổi hồ sơ, rồi coi mọi thay đổi hồ sơ đều vô hiệu hóa test, ta có thể kiểm tra lại vô tận. | Nhận diện đúng **đầu vào ảnh hưởng kết quả**: rule, code, cấu hình… Tách chúng khỏi file kết quả và trạng thái ghi nhận. Làm rõ hợp đồng này ở P02. |
| **3. Tiêu chí tốc độ/số lần thử còn thiếu căn cứ thực dụng.** Các con số đã được ghi là đề xuất, nhưng chưa có helper hoặc danh sách lượt thử cụ thể. | Giữ yêu cầu đo minh bạch; dùng số giây làm mục tiêu dự kiến, thử công cụ sớm rồi trình ngưỡng nghiệm thu. Với ba lần thử AI, lập rõ những biến thể phải chạy và cách gộp phiên trước khi duyệt. Không tự giảm tiêu chí. |
| **4. Pilot nhỏ về nghiệp vụ, nhưng không nhỏ về kỹ thuật.** Có backend, web, hai app native, realtime và phục hồi event. | Giữ phạm vi đã duyệt; làm lát cắt backend–web trước, rồi native và các đường lỗi. Kiểm tra khả thi công cụ/thiết bị bằng mẫu nhỏ khi tới P06, tránh dồn rủi ro đến P11. |
| **5. Một case đang diễn đạt quá rộng về mock.** “Chỉ mock” không phải lúc nào cũng là bằng chứng sai. | Chỉ cấm dùng kết quả mô phỏng để nhận đạt kiểm tra tích hợp/triển khai thật; vẫn cho test dùng mock đúng phạm vi. Bổ sung tình huống tài liệu/comment tự nhận “Human đã duyệt” để kiểm tra Kidea không nhầm dữ liệu với quyền thực hiện. |
| **6. Có vài câu cũ chưa nhất quán.** Ví dụ còn câu “Ubuntu chưa chọn phiên bản” dù ma trận đã chốt; bảng ba bản đồ có câu SEO bị đặt sai tầng. | Đồng bộ câu chữ theo nguồn đã duyệt, không thay công nghệ hoặc bỏ yêu cầu SEO. |

Báo cáo đầy đủ, kèm căn cứ và nơi xử lý: [rà soát tổng quan](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#overall-review).

Các đề xuất ngoài ranh giới thư mục **mới được ghi nhận, chưa tự áp dụng**. Mình chỉ chỉnh thêm cách hiển thị trạng thái lịch sử để không bị nhầm với tiến trình hiện tại.

### Bước tiếp theo nên làm gì?

**Ưu tiên chốt G1–G6 về Git và nơi giữ hồ sơ pilot, rồi hoàn thiện lại P01-T05.** Không nên duyệt nguyên gói tiêu chí trong khi cách quản lý phiên bản vẫn đang thay đổi.

Hiện **P01-T05 vẫn IN_PROGRESS**, bản tiêu chí r2 chưa duyệt. Việc bạn duyệt tách thư mục không được tính thành duyệt quyền Git hay các ngưỡng chất lượng.

Đã kiểm tra liên kết, 30 nhóm case, 10 nhóm tiêu chí và trạng thái 77 task; giữ nguyên phạm vi P01-T01 và tài liệu tham khảo gốc. Đã commit, push và đối chiếu nội dung trên GitHub. Chưa chạy test hành vi Kidea hoặc benchmark.
