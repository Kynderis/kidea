**Mình ghi nhận thiết kế tổng thể trước đã được bạn đồng ý.** Các yêu cầu mới đều phù hợp với mục tiêu Kidea; mình đã bổ sung vào tài liệu, còn cách thực hiện chi tiết dưới đây để bạn review.

Và đúng rồi 😄 Quy tắc không tự thao tác Git dành cho **project được Kidea quản lý**. Repo xây Kidea này vẫn tiếp tục lưu và push câu trả lời lên GitHub.

## 1. Giao diện tiến độ: nên làm bằng HTML sinh từ hồ sơ

Mình đề xuất thêm `$kidea visualize`, hoạt động như sau:

```text
Đọc trạng thái trong .kidea
→ Kiểm tra dữ liệu
→ Sinh .kidea/views/progress.html
→ Mở bằng trình duyệt
```

Bản đầu chỉ cần **một file HTML mở được offline**, không server, không database riêng. Bấm vào một big-step để mở/thu gọn các bước con và task.

Giao diện nên hiển thị:

- Project đang hoàn thiện MVP hay đang bổ sung Feature nào.
- Bản production được ghi nhận, tách riêng với bản đang phát triển.
- Tên và trạng thái từng big-step, bước con, task; cả phần đã xong lẫn chưa xong.
- Việc đang làm, điểm bị chặn, mục chờ Human duyệt và liên kết đến tài liệu/bằng chứng.
- Thời điểm sinh giao diện và phiên bản dữ liệu nguồn.

Có ba nguyên tắc quan trọng:

**HTML chỉ là bản xem, không phải nguồn trạng thái.** Sửa hoặc sinh lại giao diện không được làm thay đổi hồ sơ. Bản đầu không có nút approve, sửa tiến độ hay thao tác production.

**Đây là bản chụp tại lúc sinh, không phải màn hình trực tiếp.** Muốn xem tiến độ mới nhất thì chạy lại lệnh. File HTML cũ không tự biết các file nguồn đã đổi; trạng thái “đã triển khai production” cũng không chứng minh production hiện đang khỏe.

**Script đọc dữ liệu có cấu trúc, không đoán từ văn xuôi.** Những trường như ID, tên, bước cha và trạng thái cần định dạng cố định trong hồ sơ. Không tạo thêm một bộ trạng thái riêng để HTML và Markdown có thể lệch nhau.

Chưa cần chốt Python hay Node.js lúc này. Quan trọng trước là định dạng dữ liệu và hành vi đúng; sau đó chọn một runtime phù hợp môi trường Kidea hỗ trợ.

## 2. Rule code: cần có, nhưng phải theo đúng ngữ cảnh

Mình đồng ý có bộ rule sẵn, tổ chức theo các lớp:

| Lớp | Ví dụ nội dung |
|---|---|
| Ngôn ngữ | Phiên bản, style, kiểu dữ liệu, quản lý tài nguyên, xử lý lỗi |
| Thành phần | Backend, web, mobile; ranh giới module và cách kiểm tra tương ứng |
| Môi trường chạy | Compiler/runtime, hệ điều hành, CPU/thiết bị, framework, cấu hình build |
| Project cụ thể | Rule thực sự áp dụng, phạm vi code, mục tiêu hiệu năng và ngoại lệ đã duyệt |

Theo hướng tổ chức từ `skill-creator`, **AI chỉ đọc bộ rule liên quan tới task**, không nạp toàn bộ hướng dẫn C++, web, Android, iOS cùng lúc. Kidea cũng không cần xây sẵn mọi tổ hợp ngôn ngữ/môi trường ngay từ bản đầu.

Sau khi chọn công nghệ ở bước kiến trúc, AI đề xuất bộ rule hiệu lực để Human duyệt trước khi code. Nếu project đã có quy ước, phải đối chiếu và giải quyết xung đột, không tự ghi đè bằng chuẩn mặc định.

Mỗi rule cần trả lời được:

> Áp dụng ở đâu? Phải tuân thủ điều gì? Kiểm tra bằng cách nào? Có ngoại lệ nào được duyệt?

Ví dụ C++ có thể dùng RAII — gắn việc quản lý và giải phóng tài nguyên với vòng đời đối tượng — làm một nguyên tắc nền. Nhưng vẫn phải kiểm tra vòng đời và quyền sở hữu thực tế, không coi chọn một kiểu viết là tự hết lỗi bộ nhớ. [C++ Core Guidelines — R.1](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii).

**Riêng “performance luôn tốt nhất”, mình muốn chỉnh cách đặt yêu cầu:** đạt mục tiêu hiệu năng đã chốt, rồi tối ưu phần quan trọng bằng số đo. Không có bộ cú pháp nào tự bảo đảm nhanh nhất với mọi dữ liệu và môi trường.

Ubuntu 24.04 LTS chưa đủ để chọn tối ưu: còn CPU, compiler, thư viện và tải thực tế. Ví dụ GCC `-march=native` tối ưu theo CPU máy build nhưng có thể khiến chương trình không chạy trên máy khác; không nên bật mặc định chỉ vì đều là Ubuntu. [GCC — x86 Options](https://gcc.gnu.org/onlinedocs/gcc/x86-Options.html).

Luồng áp dụng sẽ là: **chốt mục tiêu chất lượng → duyệt rule theo kiến trúc → xác định kiểm tra → code và đo → xác nhận môi trường phát hành**. Bộ rule nền được cập nhật sau này cũng không tự thay đổi quy tắc của project đang chạy.

## 3. Human approval phải xuống tới bước con quan trọng

Mình đồng ý, và không nên để AI tùy hứng quyết định cái gì là quan trọng.

Khi phân rã big-step, AI phải liệt kê trước **điểm nào cần dừng để Human duyệt, duyệt nội dung gì và dựa trên đầu ra nào**.

Những nhóm nên có điểm duyệt bắt buộc:

- Phạm vi, rule, flow hoặc kết quả nghiệp vụ.
- Ranh giới dùng chung, quyền sở hữu dữ liệu, hợp đồng API ảnh hưởng bên sử dụng.
- Công nghệ, môi trường, bảo mật, chi phí hoặc tối ưu có đánh đổi đáng kể.
- Tiêu chí chấp nhận, phạm vi test, bộ rule code và ngoại lệ quan trọng.

Chỉnh format hoặc code đúng theo thiết kế đã duyệt không cần thêm một lần hỏi cho từng thao tác. Nhưng nếu xuất hiện quyết định quan trọng chưa được dự liệu, AI phải ghi nhận và dừng phần phụ thuộc để hỏi.

**Test đạt khác với Human đã duyệt. Duyệt một bước con cũng không tự duyệt cả big-step.** Hai trạng thái này cần hiển thị rõ trong hồ sơ và giao diện.

## 4. Tính nhất quán phải xuyên suốt tới code và vận hành

Đây nên là nguyên tắc lõi của Kidea, không phải một tính năng phụ:

> Từ một yêu cầu/rule phải tìm được thiết kế, test, code và phần vận hành liên quan; từ nơi triển khai cũng phải lần ngược được về căn cứ.

Ví dụ đổi quy tắc hủy đơn để cho phép hủy phần chưa xử lý của một đơn đã xử lý một phần, các nơi cần kiểm tra có thể gồm:

- State/flow đơn và nghiệp vụ giải phóng tiền.
- AC, business test, test tích hợp.
- Màn hình, API và code xử lý.
- Monitoring/admin nếu đang dựa trên hành vi cũ.

Không mặc định tất cả phải sửa, nhưng từng nơi liên quan phải có kết luận sau khi đọc và phân tích.

Một điểm dễ bỏ sót: **không sửa câu chữ của A chưa chắc hành vi của A không đổi**. Nếu A dùng công thức B, B đổi cách làm tròn thì đầu ra A có thể đổi dù file A vẫn nguyên vẹn. Những nơi dùng đầu ra A vẫn phải được kiểm tra tiếp.

Vì vậy cần cả hai:

- **Bản đồ liên kết/mapping** để tìm đường ảnh hưởng.
- **Tìm kiếm và đọc tài liệu, source thực tế** để bắt cả quan hệ bị thiếu trong bản đồ.

Script giúp phát hiện link hỏng, mapping bắt buộc bị thiếu hoặc bằng chứng sai phiên bản; nó không thay thế việc phân tích ý nghĩa. Chưa xử lý hết ảnh hưởng thì chưa đóng thay đổi.

## 5. Giữ Kidea tinh gọn bằng cách nào?

Mình sẽ dùng ba tiêu chí:

- **Tinh gọn:** mỗi thông tin có một nguồn có hiệu lực; chỉ thêm file, rule và công cụ có công dụng rõ.
- **Mạnh mẽ:** trạng thái kiểm tra được, resume được và không báo hoàn thành khi thiếu căn cứ.
- **Chỉn chu:** tài liệu, giao diện, code và bằng chứng khớp nhau; phần chưa biết phải được nói rõ.

Không đồng nhất “tinh gọn” với ít kiểm tra. Ví dụ vẫn giữ bản ghi ngắn của task đã hoàn thành để giao diện thể hiện đúng tiến độ, nhưng không giữ những log dài không còn cần thiết.

Đã cập nhật và push [bản thiết kế Kidea](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md) cùng [answer.md](https://github.com/Kynderis/kidea/blob/master/answer.md). Các tài liệu nghiệp vụ chuyển thư mục ở lượt trước cũng đã được đưa lên, giữ nguyên nội dung. **Chưa triển khai skill hoặc giao diện.**

Bước tiếp theo nên chốt **mô hình dữ liệu trạng thái và approval**: đây là phần dùng chung cho init, resume, visualize và kiểm soát chuyển bước.

<oai-mem-citation>
<citation_entries>
MEMORY.md:50-50|note=[Answer mirror update and push verification procedure]
</citation_entries>
<rollout_ids>
01a0389b-4126-7403-a368-d79d5bac0d69
</rollout_ids>
</oai-mem-citation>
