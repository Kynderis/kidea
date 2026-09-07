**Đúng, một project nằm trong một Git repo duy nhất là hướng mình đang thiết kế và cũng là phương án mình khuyến nghị.** Không cần tách repo tài liệu, repo hồ sơ Kidea và repo code cho cùng một sản phẩm.

Điểm chưa được thiết kế đầy đủ là **cách Kidea chủ động dùng Git để lưu tiến độ, tích hợp thay đổi và quản lý phát hành**, chứ không phải việc gom các phần vào cùng repo.

## 1. Cấu trúc một project sẽ như thế nào?

Ví dụ minh họa, không phải cấu trúc cứng áp cho mọi framework:

```text
project/
├── .kidea/          Hồ sơ Kidea: phạm vi, nghiệp vụ, kế hoạch,
│                   trạng thái, thiết kế, chỉ mục test/bằng chứng
├── docs/            Hướng dẫn sử dụng/phát triển khi cần
├── backend/         Code backend
├── web/             Code web
├── android/         Code Android
├── ios/             Code iOS
├── tests/           Test tích hợp/toàn hệ thống khi phù hợp
├── deploy/          Cấu hình, script triển khai và migration
├── .gitignore
└── README.md
```

**Tất cả các phần này được quản lý trong cùng một repo và cùng dòng phiên bản.** Một thay đổi nghiệp vụ có thể sửa cả đặc tả, backend, giao diện và test trong cùng một gói thay đổi.

Ba điểm cần phân biệt:

- **`.kidea` không chỉ chứa trạng thái.** Theo thiết kế hiện tại, nó còn chứa đặc tả nghiệp vụ, kiến trúc, kế hoạch và đặc tả test. `docs/` không sao chép lại những tài liệu đó; chỉ chứa nội dung có mục đích riêng, như hướng dẫn sử dụng. Mỗi nội dung có một nơi làm nguồn chính.
- **Test specification khác test chạy được:** mô tả cần kiểm tra gì ở `.kidea/tests/`; code kiểm thử nằm ở vị trí phù hợp của project, có thể ngay cạnh từng thành phần.
- Kidea sinh hồ sơ và bổ sung cấu trúc **theo giai đoạn**, không tạo ngay toàn bộ cây thư mục hoặc ép dự án có sẵn đổi cấu trúc.

Đây đã là hướng trong [thiết kế cấu trúc hồ sơ](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#files-view) và [resume cùng source qua Git](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#resume). Hiện mới là thiết kế, chưa có skill được xây để sinh project thật.

**Một repo không có nghĩa đưa mọi dữ liệu vào Git:** secret, database đang chạy, cache, thư viện tải về và log nhạy cảm không nên được commit. Gói build/bằng chứng lớn có thể lưu ở kho phát hành hoặc nơi được phép, còn repo giữ thông tin nhận diện và đường dẫn—không cần thêm một Git repo khác.

Repo xây **chính skill Kidea** và repo một **sản phẩm dùng Kidea** là hai project khác nhau. Không có chuyện mỗi sản phẩm phải tách riêng repo `.kidea` của nó.

Worktree cũng không phá nguyên tắc một repo: đó là thư mục checkout bổ sung của **cùng repository**, không phải một repo sản phẩm mới. [Git worktree](https://git-scm.com/docs/git-worktree).

## 2. Bạn nên đọc những nơi nào?

Đọc theo thứ tự này; không cần đọc lại toàn bộ tài liệu:

| Nơi đọc | Đọc để hiểu gì? |
|---|---|
| **[Thiết kế mục 5 — Cấu trúc hồ sơ](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#files-view)** | Cái gì nằm trong `.kidea`, cái gì nằm ngoài; đâu là nguồn trạng thái/tài liệu. Đây là phần quan trọng nhất cho câu hỏi hiện tại. |
| **[Thiết kế mục 6 — Resume](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#resume)** | Hồ sơ và code đi cùng nhau thế nào khi đổi phiên/máy. Lưu ý: phần quyền Git ở đây vẫn là quy tắc cũ, chưa cập nhật đề xuất mới. |
| **[Thiết kế mục 7, đặc biệt 7.3](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#change)** | Phân biệt bản đang phát triển với bản thực tế đang chạy. |
| **[Đề xuất Git ở câu trả lời trước — bản lưu cố định](https://github.com/Kynderis/kidea/blob/57daffdef56f03908793eb2ebb0901c35fbafe10/answer.md)** | Đọc mục 1–3 và 6: giới hạn khôi phục, branch/worktree, release và quyền thao tác. Đây là đề xuất, chưa phải thiết kế đã duyệt. |
| **[P01-T05 — Bộ tiêu chí chất lượng](https://github.com/Kynderis/kidea/blob/master/KIDEA_QUALITY.md)** | Đọc sau khi chốt hướng Git. Bộ r1 hiện chưa duyệt và cần điều chỉnh để khớp chính sách mới. |

## 3. Những vấn đề còn cần bạn chốt

**“Một project, một repo” bạn đã nói rõ; mình không yêu cầu bạn duyệt lại điểm đó.** Sáu quyết định còn lại là:

| Mã / vấn đề | Đề xuất của mình | Ý nghĩa đối với cách làm việc |
|---|---|---|
| **G1 — Nhánh và worktree** | Một `master`, một branch hiện hành cho mỗi thay đổi có phạm vi rõ; dùng worktree riêng khi cần giữ thư mục ổn định. Chưa thêm `develop` hoặc nhiều nhánh thường trực. | Tách phần đang làm khỏi bản đã nhận, nhưng vẫn giữ một công việc hiện hành; không tạo branch cho từng thao tác nhỏ. |
| **G2 — Khi nào được vào master?** | Chỉ tích hợp phần hoàn chỉnh theo phạm vi, đủ test/review/gate; kiểm tra lại bản tích hợp. Giai đoạn thiết kế được nhận gói tài liệu hoàn chỉnh; khi đổi chức năng, phải đồng bộ hồ sơ–code–test của thay đổi ấy. | `master` không chứa chức năng nửa vời được gọi là đã xong. Nhưng `master` cũng không mặc nhiên là bản production. |
| **G3 — Kidea được tự làm Git đến đâu?** | Cho tự tạo branch/worktree và commit checkpoint trong task được giao. Push branch khi đã chốt remote, quyền truy cập và dữ liệu được chia sẻ. Merge `master`, tag phát hành và deploy cần bạn duyệt rõ. | Bạn không phải xác nhận mỗi lần lưu; các quyết định phát hành và chia sẻ dữ liệu vẫn được kiểm soát. Không mặc định mọi project đều public như repo Kidea hiện tại. |
| **G4 — Lưu dở và xử lý lỗi** | Cho commit checkpoint còn dở, ghi rõ chưa đạt. Khi lỗi, giữ bằng chứng và kiểm tra thực tế rồi sửa tiếp hoặc khôi phục có phạm vi; không tự xóa/reset cả project. | Không mất công đang làm; phân biệt “đã lưu” với “đã kiểm chứng”. Git không thay backup database hoặc xác minh thao tác bên ngoài. |
| **G5 — Version/tag** | Bản đầu ưu tiên một version cho gói phát hành project, ví dụ `v1.2.0`; từng thành phần có mã build riêng. Bản thử dùng nhãn như `v1.2.0-rc.1`. Tag đã phát hành không đổi/tái dùng. | Có một mốc chung để nói “bản này gồm những gì”, nhưng vẫn truy được từng gói backend/web/mobile. Version Kidea tách khỏi version sản phẩm. |
| **G6 — Production và khôi phục** | Mỗi release ghi đúng commit, gói build, cấu hình/schema và bằng chứng. Ghi bản chạy thực tế theo từng thành phần sau khi xác minh. Sửa nóng từ bản đang chạy; khôi phục phải xét cả dữ liệu. | Biết chính xác production đang dùng gì, kể cả mobile cập nhật chậm hơn backend; không nhầm “đã có tag” với “đã deploy thành công”. |

G5 không bắt mọi thành phần phải triển khai cùng lúc: version chung mô tả **gói phát hành**, còn G6 ghi **trạng thái triển khai thực tế**. Nếu sau này thật sự cần phát hành các thành phần độc lập, ta mới xem xét version riêng; chưa tăng độ phức tạp ngay.

Bạn **chưa cần chốt** tên từng folder, cách đặt tên mọi branch, định dạng file release hay công cụ CI. Những chi tiết đó mình sẽ đề xuất ở task thiết kế tương ứng.

**Bạn có thể duyệt cả G1–G6 hoặc góp ý theo mã từng mục.** Sau khi chốt, mình sẽ cập nhật đồng bộ thiết kế, các case Git/resume, roadmap và gói P01-T05 để trình lại. Duyệt hướng Git **không đồng nghĩa** duyệt luôn các ngưỡng tốc độ/số lần thử của P01-T05.

Hiện chưa thay đổi quy trình hoặc tạo branch/worktree/tag; P01-T05 vẫn đang chờ làm rõ và review.
