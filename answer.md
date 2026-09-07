Ý chính là: **bản đầu vẫn đi trọn quy trình từ ý tưởng đến vận hành, nhưng chỉ cam kết những phần kỹ thuật đã được kiểm chứng; một số tính năng mở rộng sẽ để sau.**

## 1. “Mức hỗ trợ” nghĩa là gì?

Cần tách hai lớp:

**Lớp phương pháp:** cách chốt Feature, viết nghiệp vụ, duyệt thiết kế, quản lý công việc, phân tích ảnh hưởng… dùng lại được cho nhiều project và lĩnh vực.

**Lớp kỹ thuật:** để áp dụng phương pháp đó vào code thực tế, Kidea cần những phần phù hợp với công nghệ của project, chẳng hạn:

- Quy tắc lập trình và cách kiểm tra chúng.
- Công cụ lấy quan hệ giữa file, hàm, module.
- Cách chạy build/test và đọc kết quả.
- Cách kiểm chứng trên môi trường triển khai.
- Các helper của chính Kidea phải chạy được trên máy bạn dùng.

**“Đã hỗ trợ” phải có nghĩa là chúng ta đã xây và thử những phần cần thiết đó**, không chỉ là AI biết viết code bằng ngôn ngữ ấy.

### Ví dụ cụ thể

Giả sử bản đầu chọn tổ hợp:

- Bạn chạy Kidea trên Windows.
- Sản phẩm có backend viết bằng C++.
- Backend được triển khai trên Ubuntu.

Đây chỉ là ví dụ, **chưa phải lựa chọn đã chốt**.

Khi ấy phải kiểm chứng cả việc Kidea hoạt động trên Windows lẫn quy tắc, công cụ phân tích và kiểm thử phù hợp với backend/môi trường đích. Máy chạy Kidea và máy chạy sản phẩm là hai việc khác nhau.

Nếu sau đó bạn muốn làm thêm ứng dụng mobile, không thể nói “backend đã chạy tốt, vậy mobile cũng được hỗ trợ”. Phần mobile cần bộ hướng dẫn, công cụ và kiểm chứng tương ứng.

**Chưa hỗ trợ không có nghĩa là cấm dùng công nghệ đó.** Nó nghĩa là chưa đủ căn cứ để cam kết. Kidea phải nói rõ phần nào dùng được, phần nào còn thiếu và cần bổ sung gì trước khi tiếp tục phần phụ thuộc.

Ở P01-T02, chúng ta sẽ chọn các tổ hợp thực sự cần cho bạn. Hiện chưa giới hạn cứng là chỉ một ngôn ngữ hoặc một nền tảng.

## 2. “Chưa làm” cụ thể là chưa làm gì?

### A. Chưa xây nền tảng làm việc nhiều người/song song

Bản đầu phục vụ bạn cùng AI, với một task hiện hành.

Chưa xây các chức năng như phân công cho nhiều thành viên, phân quyền người duyệt, xử lý nhiều người cùng sửa hồ sơ hoặc điều phối nhiều task triển khai đồng thời.

Điều này **không giới hạn số người dùng của sản phẩm bạn xây**. Sản phẩm có thể phục vụ nhiều người; người đang phát triển nó bằng Kidea vẫn là bạn cùng AI.

### B. Chưa xây một dịch vụ Kidea online

Bản đầu dùng hồ sơ trong project và xuất HTML để xem tiến độ.

Chưa làm một website Kidea có tài khoản đăng nhập, server riêng, nút duyệt hoặc nút deploy. Bạn vẫn trao đổi và duyệt trong phiên làm việc với AI.

Điểm quan trọng: **đây là giới hạn của công cụ Kidea, không phải của sản phẩm.** Backend, website, dashboard admin và monitoring của sản phẩm vẫn nằm trong quy trình nếu sản phẩm cần.

### C. Chưa tự đồng bộ công việc giữa các máy

Kidea vẫn phải resume được trên máy khác **khi máy đó có đủ hồ sơ, source và công cụ cần thiết**.

Nhưng bản đầu chưa có dịch vụ tự mang các file ấy từ máy A sang máy B. Việc chuyển dữ liệu cần được bạn thực hiện hoặc yêu cầu rõ.

Nói ngắn gọn: **có khả năng tiếp tục công việc, chưa có dịch vụ vận chuyển công việc tự động.**

### D. Chưa có sẵn bộ hỗ trợ cho mọi công nghệ

Không xây ngay một kho quy tắc và công cụ cho tất cả ngôn ngữ, framework, hệ điều hành.

Chúng ta làm kỹ những tổ hợp bạn cần trước. Khi cần thêm tổ hợp khác, bổ sung và kiểm chứng nó; không đổi nhãn “chưa hỗ trợ” thành “đã hỗ trợ” chỉ vì tạo được vài file code.

### E. Chưa tự động tiếp nhận toàn bộ dự án cũ

Ví dụ bạn đưa vào một repo đã có code và database, nhưng chưa có đặc tả hoặc hồ sơ Kidea.

Để quản lý đầy đủ dự án đó, cần:

1. Hiểu code hiện đang làm gì.
2. Hỏi lại bạn sản phẩm thực sự phải làm gì.
3. Phân biệt hành vi đúng, bug và phần còn thiếu.
4. Dựng đặc tả, mapping, test và trạng thái công việc tương ứng.
5. Review trước khi coi bộ hồ sơ ấy đáng tin.

**Không thể lấy code hiện tại làm bằng chứng rằng nghiệp vụ trong code là đúng.**

Đề xuất hiện tại chưa đưa toàn bộ quy trình tiếp nhận này vào phạm vi nghiệm thu bản đầu. Tuy nhiên, vẫn được đọc và tận dụng code có sẵn; cũng vẫn resume được project đã có hồ sơ Kidea hợp lệ.

Đây là giới hạn đáng cân nhắc nhất nếu bạn muốn dùng Kidea ngay cho một dự án đang phát triển dở.

## 3. Có những điều không phải “để bản sau làm”

Cách gom vào mục “Chưa làm” dễ gây hiểu nhầm ở điểm này:

- Không tự quyết định nghiệp vụ hoặc tự duyệt thay bạn.
- Không tự suy ra quyền commit/push/deploy từ việc bạn duyệt thiết kế.
- Không hứa phần mềm tuyệt đối hết lỗi, tìm đủ mọi dependency hoặc luôn đạt hiệu năng tốt nhất.

Đây là **nguyên tắc cần giữ**, không phải tính năng đang hoãn. Khi bạn cấp quyền cho thao tác cụ thể, AI có thể thực hiện trong phạm vi được phép; nhưng không được tự coi mình đã có quyền.

Tóm lại: **giữ đủ quy trình cốt lõi, làm chắc những công nghệ cần trước, chưa xây thêm một nền tảng quản lý đồ sộ xung quanh Kidea.**

Mình mới giải thích rõ đề xuất; chưa đổi phạm vi hoặc chuyển sang task tiếp theo. Câu trả lời đã được lưu và push vào [answer.md](https://github.com/Kynderis/kidea/blob/master/answer.md).

<oai-mem-citation>
<citation_entries>
MEMORY.md:180-181|note=[Preserve Human review and mirror the complete explanation only in this repository]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
