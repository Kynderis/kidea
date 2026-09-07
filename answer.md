**Mình khuyến nghị đưa Git thành phần chính thức của Kidea.** Hướng bạn đề xuất giúp quản lý phiên bản rõ hơn và giữ bản ổn định tách khỏi phần đang làm. Nhưng cần chỉnh một điểm: **Git giúp khôi phục file đã lưu, không bảo đảm mọi thao tác của project đều có thể hoàn tác trọn vẹn.**

## 1. Dùng Git để quay về trước thao tác: ổn đến đâu?

Với thao tác chỉ sửa tài liệu/code, cách này rất hữu ích:

1. Có một mốc đã lưu và kiểm tra trước khi làm.
2. Thực hiện thay đổi trong khu vực riêng.
3. Kiểm tra kết quả.
4. Nếu đạt thì nhận bản mới; nếu lỗi thì sửa tiếp hoặc quay lại mốc trước.

Tuy nhiên, commit chỉ ghi những nội dung được đưa vào lần lưu đó. File mới chưa được lưu, file bị bỏ qua hoặc thay đổi còn ngoài commit không tự được bảo vệ. [Tài liệu Git commit](https://git-scm.com/docs/git-commit).

Quan trọng hơn, **quay lại code không đồng nghĩa quay lại thế giới bên ngoài code**:

| Thao tác đã xảy ra | Lấy lại commit cũ có hoàn tác được không? |
|---|---|
| Sửa file đã có trong mốc Git | Có thể khôi phục nội dung đã lưu |
| Gửi email, gọi API tạo giao dịch | Không tự thu hồi email hoặc giao dịch |
| Đổi dữ liệu/cấu trúc database | Không tự khôi phục database |
| Deploy một bản lên server | Không tự khiến server chạy bản cũ |

Ví dụ: hệ thống đã gửi email nhưng phiên AI bị ngắt trước khi ghi “đã gửi”. Nếu chỉ quay Git về rồi chạy lại, email có thể bị gửi hai lần.

Vì vậy, **resume và kiểm tra kết quả thao tác vẫn cần tồn tại**. Chúng giúp quyết định nên tiếp tục, sửa, chạy lại hay khôi phục.

Ngoài ra, test fail không phải lúc nào cũng cần bỏ toàn bộ việc vừa làm. Mặc định nên giữ dấu vết lỗi và sửa phần sai; chỉ quay lại khi phù hợp. Với thay đổi đã chia sẻ, có thể tạo commit hoàn tác để giữ lịch sử, thay vì xóa lịch sử cũ. [Tài liệu Git revert](https://git-scm.com/docs/git-revert).

**Mục tiêu đúng nên là: bản được chấp nhận không chứa công việc dở chưa kiểm chứng; khu vực đang làm được phép dở nhưng phải nhận diện và khôi phục được.**

## 2. Mô hình Git mình đề xuất cho Kidea

Với một người + AI, mình đề xuất **một nhánh chính, một nhánh công việc hiện hành; worktree để tách thư mục khi cần**, chưa cần thêm hệ thống nhiều nhánh phức tạp.

| Thành phần | Vai trò |
|---|---|
| `master` | Bản tích hợp đã đạt kiểm tra và các gate tương ứng; không đồng nghĩa đang chạy production |
| Branch công việc, ví dụ `codex/change-cancel-rule` | Nơi làm một thay đổi có phạm vi rõ; có thể gồm nhiều task nhỏ |
| Worktree riêng | Thư mục làm việc cho branch đó, giữ thư mục bản ổn định không bị sửa dở |
| Commit checkpoint | Mốc lưu tiến độ; được phép còn dở, không được gọi là bản đã nghiệm thu |
| Tag phát hành | Tên cố định cho một phiên bản đã được chấp nhận phát hành |

**Branch và worktree không phải hai phương án thay thế nhau.** Branch giữ dòng phiên bản; worktree là thư mục checkout riêng để làm trên dòng đó. Các worktree vẫn dùng chung repository Git; chúng không tự cô lập database, dịch vụ hay tài khoản. [Tài liệu Git worktree](https://git-scm.com/docs/git-worktree).

### Luồng làm việc

1. **Trước thay đổi:** xác định đúng repo/branch, mốc xuất phát và quyền được cấp; bảo toàn mọi chỉnh sửa sẵn có của bạn.
2. **Trong branch riêng:** lưu code cùng hồ sơ `.kidea`, commit tại các checkpoint có ý nghĩa—không cần mỗi lần AI đọc/sửa một dòng là một commit.
3. **Khi hoàn tất phần việc:** rà tài liệu–code–test, chạy kiểm tra và xin duyệt các gate cần thiết.
4. **Tích hợp vào `master`:** merge phần đã đạt, rồi kiểm tra chính bản sau tích hợp. Không mặc nhiên lấy kết quả test của branch trước merge làm kết quả của bản mới.
5. **Khi phát hành:** chọn đúng bản, tạo gói phát hành và tag; deploy theo quyền riêng, rồi xác nhận kết quả thực tế.

“Hoàn tất” ở đây theo phạm vi được duyệt: một gói thiết kế hoàn chỉnh có thể được tích hợp trước khi có ứng dụng; một chức năng còn code dở không được gọi là đã hoàn tất.

Commit để lưu tiến độ khác với **merge vào nhánh chính**; push chỉ là đưa các mốc Git lên remote. Ta có thể push branch đang dở để chuyển máy mà không đưa nó vào `master`.

Khi resume trên máy khác, Kidea phải lấy đúng **branch công việc**, không chỉ tải `master`. Hồ sơ trên mỗi branch phải đi cùng code của branch đó.

## 3. Version/tag cho production phải quản lý thế nào?

**Tag cho biết “đây là phiên bản nào”; hồ sơ triển khai cho biết “môi trường nào thực sự đang chạy phiên bản nào”.** Hai việc này không được nhập làm một.

Mình đề xuất:

- Dùng version dạng `v1.2.0`; bản thử có thể là `v1.2.0-rc.1`. Nếu dùng Semantic Versioning, phải chốt ranh giới tương thích: sửa lỗi, thêm chức năng tương thích, hoặc thay đổi không tương thích. [SemVer](https://semver.org/).
- Tag phát hành có chú thích, gắn đúng commit; đặt quy tắc **không di chuyển hoặc tái dùng tag đã phát hành**. Git có annotated tag lưu thông tin người tạo, ngày và mô tả, nhưng tính “không được sửa” cần quy trình/bảo vệ bổ sung. [Git tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging).
- Mỗi release có **hồ sơ phát hành**: tag/commit, gói chương trình chính xác, cấu hình không chứa secret, phiên bản database/migration liên quan, kết quả kiểm tra và cách khôi phục.
- Triển khai đúng gói đã kiểm tra; không build lại một gói khác rồi mặc nhiên coi bằng chứng cũ vẫn đúng.
- Chỉ ghi “đã chạy production” sau khi kiểm tra bản thực tế, chức năng cơ bản và tình trạng vận hành.

Ví dụ hoàn toàn có thể có:

- `master`: đã tích hợp việc cho bản 1.3.
- `v1.2.0`: bản phát hành trước đó.
- Production: vẫn đang chạy 1.2.0.

Với backend/web/Android/iOS, các thành phần còn có thể lên phiên bản khác thời điểm. Hồ sơ triển khai phải ghi **từng thành phần**, không dùng một nhãn “production mới nhất” để che việc mobile chưa cập nhật.

Nếu cần sửa nóng, bắt đầu từ **đúng bản production đang chạy**, phát hành bản sửa rồi đưa thay đổi tương ứng trở lại dòng phát triển. Khôi phục production cũng cần xét tương thích database; không chỉ đổi tag hoặc checkout code cũ.

Có thể dùng bảo vệ branch/tag trên GitHub để hỗ trợ thực thi quy tắc. Khả năng áp dụng cụ thể cần kiểm tra trên repo/gói tài khoản khi triển khai; mình chưa bật hay thay đổi cấu hình nào. [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).

## 4. “Tốc độ công cụ” thực chất là gì?

Đó là thời gian **chương trình phụ trợ của Kidea xử lý file trên máy**, chẳng hạn:

- Đọc hồ sơ, kiểm tra ID/link/trạng thái và tạo dữ liệu báo tiến độ.
- Tạo file HTML để bạn mở xem tiến độ.

Ví dụ: bạn yêu cầu xem tiến độ → công cụ xử lý hồ sơ → tạo xong HTML. Mốc 3 hoặc 10 giây được đề xuất cho đoạn **công cụ bắt đầu chạy đến khi tạo xong file**, không phải toàn bộ thời gian từ lúc bạn gửi tin nhắn.

Nó **không đo** thời gian AI suy nghĩ, phân tích toàn bộ code, chờ bạn duyệt, chạy Git hay tốc độ ứng dụng pilot.

Mục đích chỉ là tránh một thao tác quản lý hồ sơ đơn giản khiến bạn phải chờ quá lâu. Các số trong r1 là ngân sách đề xuất chưa đo; mình đã trình bày hơi kỹ thuật khiến chúng giống một cam kết tốc độ toàn Kidea.

## 5. “Bằng chứng kiểm tra lại được” nghĩa là gì?

Nói đơn giản: **sau này mở lại, ta biết vì sao đã kết luận bản đó đạt—không phải tin một câu “đã test rồi”.**

Ví dụ kiểm tra resume:

| Cần lưu | Ví dụ dễ hiểu |
|---|---|
| Đã kiểm tra việc gì? | Tiếp tục sau khi bị ngắt ở task T07 |
| Đúng bản nào? | Commit X, bản Kidea Y, hồ sơ của branch đang làm |
| Kết quả mong đợi? | Quay đúng T07, giữ gate đang chờ, không chạy lại thao tác đã thành công |
| Kết quả thực tế? | Phiên mới đã làm gì, file nào thay đổi, có vượt gate không |
| Căn cứ ở đâu? | Kết quả test hoặc đoạn ghi nhận hành động và đối chiếu trước/sau |

Git giúp gắn bằng chứng với **đúng phiên bản**, nhưng commit chỉ cho biết nội dung đã lưu; nó không tự chứng minh nội dung đúng hoặc đã được test.

Không cần bạn viết báo cáo dài cho mỗi chỉnh sửa. Kidea nên thu thập tự động phần có thể lấy được, lưu một bản kết quả ngắn và link tới chi tiết; không chép toàn bộ hội thoại vào hồ sơ.

Cũng cần giữ bằng chứng lỗi/triển khai khi hoàn tác source. Nếu quay lại code mà xóa luôn dấu vết “đã gửi yêu cầu/deploy”, lần resume sau có thể xử lý sai.

Và **Git không thay phân tích ảnh hưởng**: nó chỉ ra file đổi, còn việc một rule đổi khiến màn hình hoặc bên nhận event phải được kiểm tra vẫn cần Kidea phân tích.

## 6. Điều cần chốt trước khi sửa thiết kế

Mình đề xuất đổi từ “Kidea chỉ Git khi được yêu cầu từng lần” sang **quyền Git có phạm vi, được bạn duyệt trước**:

- Được tự tạo branch/worktree và commit checkpoint trong công việc đã giao, theo chính sách đã duyệt.
- Push branch làm việc được phép khi đã chốt remote và phạm vi dữ liệu được đưa lên.
- Merge vào `master`, gắn tag phát hành và deploy vẫn là các quyết định quan trọng cần bạn duyệt; có thể trình chung một gói nhưng phải ghi rõ từng quyền.
- Không tự force-push, xóa công việc chưa bảo toàn hoặc hoàn tác database/production chỉ vì một test lỗi.

**Đây là hướng mình khuyến nghị.** Nó giữ bản ổn định rõ ràng, cho phép lưu việc dở để không mất công, đồng thời quản lý chính xác bản đã phát hành và bản đang chạy.

P01-T05 chưa được duyệt. Nếu chốt hướng này, cần rà lại thiết kế Git/checkpoint/resume, phạm vi đã duyệt liên quan, bộ case và roadmap trước khi hoàn thiện gói tiêu chí mới—không chỉ thêm vài câu vào P01-T05. Lượt này mình chỉ phân tích, chưa đổi quy trình hoặc tạo branch/tag.

**Bạn đồng ý lấy mô hình Git và ranh giới quyền ở trên làm hướng để mình cập nhật thiết kế không?**
