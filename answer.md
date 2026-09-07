**Mình khuyến nghị tách theo hướng bạn vừa nêu: tài liệu của sản phẩm nằm ngoài `.kidea`; hồ sơ điều phối công việc của Kidea nằm trong `.kidea`.** Ranh giới này rõ và hợp lý hơn cách gom toàn bộ hồ sơ vào `.kidea` hiện tại.

### Vì sao trước đây mình để chung?

Thiết kế cũ chia theo **“hồ sơ do Kidea quản lý”** và **“code/test thực thi”**. Cách đó gom mọi thứ Kidea cần đọc vào một chỗ, nhưng trộn hai loại thông tin:

- **Sản phẩm là gì, phải hoạt động thế nào?**
- **Chúng ta đang xây sản phẩm đến đâu, đang chờ ai, tiếp tục từ đâu?**

Sau khi phân biệt rõ như bạn đề xuất, mình thấy nên chia theo **vai trò của thông tin**, không theo công cụ nào tạo ra nó. Tài liệu nghiệp vụ vẫn là tài sản của sản phẩm, dù được Kidea hỗ trợ viết.

## Ranh giới mình đề xuất

Ví dụ cấu trúc, vẫn trong **một Git repo**:

```text
project/
├── .kidea/
│   ├── INDEX.md          Điểm vào và trạng thái tổng quan
│   ├── work.md           Việc hiện hành, blocker, điểm quay lại
│   ├── plans/            Big-step, phase, task và tiến trình
│   ├── reviews/          Gói review, xác nhận duyệt, bản được duyệt
│   └── views/            Giao diện tiến độ được sinh
│
├── docs/
│   ├── features.md       Mục tiêu, phạm vi, Feature Map
│   ├── business/         Nghiệp vụ, rule, flow, AC
│   ├── requirements/     Yêu cầu chất lượng sản phẩm
│   ├── experience/       UX, luồng màn hình
│   ├── architecture/     Kiến trúc, API, dữ liệu, coding rules
│   ├── testing/          Đặc tả và chiến lược kiểm thử
│   └── operations/       Vận hành, triển khai, khôi phục
│
├── backend/              Code và test của backend
├── web/                  Code và test của web
├── android/
├── ios/
├── tests/                Test tích hợp/toàn hệ thống khi cần
└── deploy/               Cấu hình và script triển khai
```

Tên file/folder là minh họa; Kidea bổ sung dần khi cần, không tạo sẵn toàn bộ cây và không ép project có quy ước tốt phải đổi tên.

**Quy tắc dễ nhớ:**

> Mô tả sản phẩm → `docs/`.  
> Điều phối quá trình làm sản phẩm → `.kidea/`.  
> Thực thi sản phẩm và kiểm thử → các thư mục code/test phù hợp.

### Những chỗ dễ nhầm cần quy định rõ

| Nội dung | Đặt ở đâu? |
|---|---|
| Feature có ý nghĩa gì, thuộc MVP/Future/Idea | `docs/features.md` |
| Feature đang ở bước nào, task nào xong/chưa xong | `.kidea/` |
| Quy tắc nghiệp vụ và kết quả cần đạt | `docs/business/` |
| Ai duyệt quy tắc ấy, duyệt bản nào, còn hiệu lực không | Hồ sơ review trong `.kidea/`, trỏ tới đúng tài liệu/phiên bản |
| Hướng dẫn triển khai và xử lý sự cố | `docs/operations/` |
| Task triển khai đang chờ quyền hay đã kiểm tra xong | `.kidea/` |

**Không lưu hai bản của cùng một nội dung.** Ví dụ `.kidea` chỉ trỏ đến đặc tả nghiệp vụ và bản được duyệt, không chép lại rule. Nếu tài liệu hiện nhãn “đã duyệt”, nhãn đó phải tham chiếu hoặc được suy ra từ hồ sơ duyệt, không là một trạng thái nhập tay độc lập.

Bản đồ liên kết đặc tả–code–test và bằng chứng chất lượng cũng cần phân biệt: phần phục vụ hiểu/kiểm chứng sản phẩm thuộc hồ sơ sản phẩm; danh sách ảnh hưởng đang xử lý, mục chờ review và tiến độ xử lý thuộc `.kidea`. Không tạo thêm bản đồ hoặc nguồn dữ liệu trùng.

## Cách này tốt hơn ở đâu?

- Người đọc mở `docs/` sẽ tìm thấy tài liệu sản phẩm, không cần hiểu cách Kidea điều phối.
- Có thể dùng tài liệu với công cụ khác; cấu trúc không phụ thuộc quá nhiều vào Kidea.
- `.kidea` gọn và đúng vai trò quản lý công việc.
- Git vẫn lưu **tài liệu + trạng thái + code + test cùng phiên bản**, nên không mất lợi ích đồng bộ.

Đổi lại, Kidea cần liên kết và kiểm tra đường dẫn giữa các thư mục. Đây là phần quản lý cần làm rõ, không phải lý do phải nhét tất cả vào một folder. Và `.kidea` vẫn là dữ liệu quan trọng, **không phải cache có thể tùy tiện xóa**: mất nó có thể mất tiến trình, điểm resume và căn cứ approval.

**Mình đề xuất dùng ranh giới mới này.** Nếu bạn đồng ý, mình sẽ cập nhật đồng bộ cấu trúc, quyền sở hữu trạng thái/approval, mapping, resume, các case và tiêu chí chất lượng. Phép đo đọc hồ sơ cũng phải tính đúng cả tài liệu ngoài `.kidea` khi cần, không chỉ đo folder quản lý đã thu nhỏ.

Lượt này chưa chuyển file hoặc sửa thiết kế; đây là thay đổi bổ sung vào hướng Git đang thảo luận, chưa đồng nghĩa bạn đã duyệt G1–G6 hoặc P01-T05.
