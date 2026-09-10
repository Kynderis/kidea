# Kidea — Tư vấn một master, quyền dev và kiểm chứng trước production

Ngày: 2026-09-10.

**Trạng thái: NGHIÊN CỨU / ĐỀ XUẤT, CHƯA DUYỆT.** Yêu cầu hiện hành hỏi cách đơn giản hóa; không phải lệnh áp dụng chính sách hoặc cấp quyền thao tác mới. G1/G2 đã duyệt vẫn là căn cứ hiện hành; R01-T06-S01-r2 vẫn IN_REVIEW. Không xây/cài skill, chạy pilot, đổi branch protection, tạo tag hoặc deploy trong lượt này.

## 1. Câu hỏi và tiêu chí quyết định

Human cần giải thích dễ hiểu “đầu vào kiểm chứng”, G2; cân nhắc một master duy nhất, giao Feature mặc định cho AI sửa/commit/push/deploy dev, sau đủ review/test mới báo Human chốt version/production. Tiêu chí: đơn giản nhất có thể nhưng chất lượng cao, nhất quán, đầy đủ, không bỏ kiểm tra hoặc thông tin liên quan.

Khuyến nghị là **một nhánh thường trực master, không branch Feature mặc định; giữ ngoại lệ hotfix tạm khi bản production cần được vá độc lập**. Đây là suy luận thiết kế cho Kidea từ nguồn dưới đây, không phải kết luận mọi dự án đều phải dùng direct push.

## 2. Nội dung tư vấn

Tôi nghiêng về phương án bạn đề xuất: **một nhánh phát triển chính `master`, AI tự làm việc và triển khai dev trong phạm vi được giao; Human quyết định bản nào được lên production.** Không cần nhánh riêng cho từng Feature.

Nhưng tôi khuyên dùng quy tắc **“một nhánh thường trực”**, không phải “cấm mọi nhánh khác”: nên giữ ngoại lệ nhánh hotfix tạm khi cần vá production mà master đang chứa việc chưa được phát hành.

Tôi dùng skill Search với Exa để đối chiếu 35 kết quả qua ba hướng nghiên cứu. Khuyến nghị dưới đây ưu tiên giảm thao tác, giữ nguyên các nghĩa vụ chất lượng đã chốt. Chất lượng cao đến từ các kiểm soát này, không từ số lượng nhánh; không quy trình nào bảo đảm tuyệt đối không còn lỗi.

### 1. “Đầu vào kiểm chứng” và “G2” là gì?

**“Đầu vào kiểm chứng” đơn giản là: đúng bộ thứ chúng ta đem ra kiểm tra.** Không chỉ là dữ liệu nhập vào ứng dụng.

Ví dụ kiểm tra chức năng “mỗi người đăng ký tối đa hai workshop”:

| Thứ được kiểm tra hoặc ảnh hưởng đến kết quả | Ví dụ |
|---|---|
| Yêu cầu | Giới hạn là hai lượt đăng ký đang hiệu lực, hay hai lượt trong cả đời tài khoản? |
| Code và test | Backend tính số lượt thế nào; test có thực sự kiểm tra giới hạn không? |
| Thư viện và cách build | Dùng thư viện, compiler và tùy chọn build nào? |
| Cấu hình, dữ liệu và môi trường thử | Có bật giới hạn không; dữ liệu thử có người đã đăng ký đủ hai lượt không? |

Nếu hôm nay bộ này đạt, nhưng sau đó đổi giới hạn, code, thư viện hoặc cấu hình có ảnh hưởng, thì **kết quả hôm nay chưa chứng minh bản đã đổi cũng đạt**. Vì vậy phải kiểm tra lại đúng bản mới. Việc nhận diện nguồn và các thành phần tạo ra bản build cũng là nguyên tắc của [SLSA build provenance](https://slsa.dev/spec/v1.2/build-provenance); Kidea không cần bê toàn bộ chuẩn đó vào chỉ để diễn đạt nguyên tắc này.

**G2 chỉ là mã của nhóm quy tắc kiểm tra và tích hợp trong thiết kế Kidea.** Nó không phải công cụ hay lệnh Git. Với cách làm mới, nên gọi dễ hiểu là **“quy tắc kiểm tra để hoàn tất một Feature”**; mã G2 chỉ giữ để tra cứu.

Phần chất lượng [chúng ta đã chốt](https://github.com/Kynderis/kidea/blob/eefce84a10bd1d35f0560d535ca58a64395e6786/KIDEA_DESIGN.md#feature-final-check) là:

- Trong lúc làm: sửa phần nào, kiểm tra phần đó và các nơi bị ảnh hưởng.
- Khi một Feature thêm/sửa/xóa đã hoàn chỉnh: review và kiểm tra lại **toàn dự án hiện hành, kể cả phần không sửa**, theo đầy đủ yêu cầu bắt buộc đã xác định.
- Nếu lượt cuối phát hiện lỗi: sửa, kiểm tra bản sửa, rồi chạy lại toàn bộ lượt cuối. Không lấy lượt test cục bộ thay thế.
- Có kiểm tra bắt buộc bị lỗi, bỏ qua hoặc thiếu bằng chứng: chưa được báo Feature hoàn tất.

**Không phải sửa một dòng cũng chạy lại toàn dự án.** Lượt toàn dự án nằm ở lúc khép Feature; nếu sửa thứ có ảnh hưởng sau lượt đó thì phải làm mới kết quả. Chỉ ghi thêm báo cáo test không khiến quy trình rơi vào vòng kiểm tra vô tận.

### 2. Một master là hợp lý, nhưng master không đồng nghĩa production

Mô hình này phù hợp hướng phát triển trên một nhánh chính, đặc biệt với nhóm nhỏ và các phần thay đổi nhỏ được kiểm tra thường xuyên. Không bắt buộc có nhánh Feature dài hạn. [DORA](https://dora.dev/capabilities/trunk-based-development/), [Trunk-Based Development](https://trunkbaseddevelopment.com/).

Tôi đề xuất phân biệt bốn điều:

| Trạng thái | Ý nghĩa |
|---|---|
| Đã commit/push lên master | Đã lưu một phần thay đổi đủ điều kiện đưa lên nhánh chung; chưa có nghĩa cả Feature đã xong. |
| Đã triển khai dev | Một bản xác định đang chạy ở dev để kiểm tra; chưa đủ điều kiện production. |
| Feature đã kiểm chứng đầy đủ | Đã đạt toàn bộ nghĩa vụ cuối Feature và có bằng chứng gắn đúng bản. |
| Đã phát hành production | Human đã duyệt đúng bản; đã triển khai và xác minh kết quả trên production. |

**Master có thể chứa Feature chưa hoàn chỉnh, nhưng không nên là nơi đẩy code hỏng tùy ý.** Ví dụ backend đã có API mới được test, UI chưa dùng đến: có thể là một phần hợp lệ. Ngược lại, code không build được hoặc migration thay dở thì chưa nên push chỉ để lưu tiến độ.

Chia nhỏ thay đổi và giữ tính năng mới chưa mở là cách hỗ trợ luồng này. Tuy nhiên, “flag đang OFF” không tự bảo đảm an toàn: database, dependency, tác vụ nền và khởi động vẫn có thể bị ảnh hưởng. [DORA về thay đổi nhỏ](https://dora.dev/capabilities/working-in-small-batches/).

Một nhánh giúp bỏ phần lớn chuyện đồng bộ/merge nhánh, **không loại bỏ việc bản đang kiểm tra tiếp tục thay đổi**. Chính AI có thể test commit C100 rồi sửa thêm thành C101; kết quả C100 không tự áp dụng cho C101.

### 3. Quy trình tối giản tôi khuyên dùng

**Bước 1 — Chốt phạm vi project và quyền thường lệ một lần.**

Xác định repo, remote, master, môi trường dev, loại dữ liệu được dùng và giới hạn chi phí. Sau đó, khi Human thực sự giao việc thêm/sửa/xóa Feature trong phạm vi này, AI mặc định được sửa file, chạy kiểm tra, commit, push và deploy dev; không hỏi lại từng thao tác.

Một câu hỏi tư vấn hoặc ý tưởng đang bàn chưa tự trở thành lệnh triển khai. Thay repo, đích deploy, quyền nhạy cảm hoặc vượt ngân sách vẫn phải xác nhận.

**Bước 2 — Hiểu yêu cầu và xử lý ảnh hưởng trước khi viết code phụ thuộc vào quyết định đó.**

Giữ luồng từ yêu cầu → nghiệp vụ/tiêu chí → thiết kế → triển khai → kiểm chứng. Chỗ đã rõ thì AI làm; chỗ cần Human chọn nghiệp vụ, kiến trúc hoặc mức chấp nhận rủi ro thì trình đúng điểm đó.

Tôi **không khuyên hiểu “Human duyệt production ở cuối” là bỏ hết các điểm duyệt quan trọng ở giữa**. Có thể gom quyết định thành gói ngắn; không nên để AI tự chọn một nghiệp vụ khác rồi đợi đến production mới hỏi.

**Bước 3 — Làm từng phần nhỏ, kiểm tra rồi push master.**

AI cập nhật đồng bộ code, tài liệu, test và thông tin theo dõi trong phạm vi; chạy review/kiểm tra cần thiết cho phần đó trước push. Việc còn dở chưa đạt kiểm tra tối thiểu được giữ ở checkpoint local có nhận diện, không tự đưa lên dev.

Việc ghi/tích hợp cần có một đầu mối; không để một thay đổi khác chen vào bản đang được xác nhận cuối mà vẫn giữ kết quả cũ.

**Bước 4 — Đạt kiểm tra trước deploy thì tự đưa đúng bản đó lên dev, kiểm tra và sửa lỗi.**

CI là hệ thống chạy kiểm tra tự động trên máy thực thi. Trước deploy dev, phải đạt nhóm kiểm tra dành cho bước đó; những bài cần bản đang chạy ở dev được thực hiện sau deploy. Điều này không thay lượt kiểm chứng đầy đủ cuối Feature. Không nhất thiết deploy mọi commit: thay nội dung trao đổi thuần túy thường không cần dựng lại ứng dụng; tiêu chí bỏ deploy phải rõ, không được dùng để bỏ kiểm tra tài liệu cần thiết.

Nếu build/test/deploy thất bại, giữ rõ trạng thái thất bại; dev đang chạy bản cũ thì phải ghi là bản cũ. Không được thấy pipeline “đã chạy” rồi báo “bản mới đã lên dev”.

**Bước 5 — Hoàn tất Feature, chạy toàn bộ lượt kiểm chứng cuối.**

Không bỏ review, test hay Human gate bắt buộc. Thiếu công cụ, test bị skip hoặc chỉ có lời AI nói “đã kiểm tra” đều chưa đủ.

Kết quả phải gắn với commit cụ thể, gói build cụ thể và cấu hình liên quan. Với sản phẩm nhiều thành phần, ghi đủ bản của web/backend/app cùng điều kiện database/cấu hình, không chỉ một tên version chung.

**Bước 6 — Báo Human một bản cụ thể để quyết định phát hành.**

Ví dụ: “Feature đã hoàn tất; đề nghị phát hành commit C123, gói build B456; các kiểm tra bắt buộc đạt; đây là thay đổi, rủi ro còn lại và cách rollback.”

Đó chính là **bản đề nghị phát hành**, hay “candidate”; không cần tạo thêm một nhánh cho nó.

Human có thể duyệt phát hành, chưa phát hành, hoặc yêu cầu đổi. Feature đạt không bắt buộc phải release ngay. Nếu master đã đi tới C124 trong lúc chờ, approval cho C123 **không tự trở thành approval cho C124**.

**Bước 7 — Gắn version/tag đúng bản đã duyệt, triển khai, kiểm tra production và theo dõi.**

Dùng đúng gói đã kiểm chứng, triển khai/rollout theo kế hoạch và quyền được duyệt; kiểm tra phiên bản thực chạy, luồng chính và tín hiệu vận hành. Có lỗi thì dừng tăng rollout, rollback hoặc sửa tiếp theo phương án đã chốt — không mặc định tự làm mọi thao tác production.

Nếu số version được nhúng vào ứng dụng lúc build, phải đưa số đó vào bản build được kiểm tra từ trước. Không đợi Human duyệt rồi đổi version, build một gói khác và coi nó vẫn là gói đã test. Nếu Human chọn số khác làm thay đổi gói, phải build và kiểm chứng lại trước production.

### 4. Điểm đánh đổi cần nói thẳng: push trực tiếp và CI

Nếu luồng là:

**Kiểm tra local → push master → CI chạy → deploy dev khi đạt**

thì có thể xảy ra: kiểm tra local đạt nhưng CI thất bại. Lúc ấy **master đã nhận commit lỗi theo kết quả CI**, dù dev và production chưa nhận bản đó.

Tôi vẫn thấy luồng này hợp lý cho mô hình một người + AI, nếu:

- Kiểm tra trước push nghiêm túc; master lỗi thì ưu tiên sửa, không tiếp tục chồng Feature.
- CI thất bại hoặc thiếu kiểm tra thì không publish bản đạt/deploy bản mới.
- Production chỉ nhận bản có đủ bằng chứng và được Human duyệt.

Nhưng nếu bạn yêu cầu **“server tuyệt đối không nhận commit vào master trước khi CI đạt”**, thì phải cho CI kiểm tra commit trước ở một ref/nhánh tạm hoặc cơ chế preflight tương đương. Không thể vừa chạy CI chỉ sau push vừa nói CI đã chặn chính lần push đó. GitHub cũng mô tả ràng buộc kiểm tra trước cập nhật nhánh trong [quy tắc required status checks](https://docs.github.com/en/rest/orgs/rules).

**Đề xuất của tôi:** bắt đầu bằng direct-to-master có kiểm tra local và chặn deploy bằng CI; không dựng thêm hệ thống chỉ để tránh một tên nhánh tạm. Nếu project có yêu cầu bảo vệ master chặt hơn hoặc đã có rule đó, dùng nhánh ngắn/preflight phù hợp, không âm thầm bypass hoặc tắt bảo vệ.

### 5. Vì sao tôi giữ ngoại lệ hotfix?

Giả sử:

- Production đang chạy `v1.0.0`.
- Master đã có một phần Feature cho `v1.1.0`, chưa được phép phát hành.
- Production cần vá gấp thành `v1.0.1`.

**Tag v1.0.0 giúp tìm lại đúng bản cũ, nhưng không tự giải quyết cách sửa nó mà không kéo theo Feature đang dở.**

Cách đơn giản, rõ ràng nhất lúc đó là:

1. Tạo nhánh hotfix tạm từ đúng bản production.
2. Sửa và kiểm chứng đầy đủ bản vá; Human duyệt phát hành.
3. Bảo đảm bản sửa được đưa phù hợp về master và kiểm chứng bản kết hợp, rồi tiếp tục Feature đang làm.

Việc tạo nhánh từ tag chỉ khi cần vá bản cũ được mô tả trong [hướng dẫn phát hành của Trunk-Based Development](https://trunkbaseddevelopment.com/branch-for-release/). Không cần thêm nhánh dev/prod thường trực.

Nếu master đã đủ an toàn và Human đồng ý phát hành toàn bộ nội dung của nó, vá và phát hành ngay từ master là đủ. Chỉ dùng nhánh hotfix khi cần tách bản sửa khỏi phần chưa được phát hành.

Cấm tuyệt đối nhánh tạm vẫn có cách xoay xở — sửa ở trạng thái detached hoặc gỡ rồi đưa lại các thay đổi đang dở — nhưng không làm công việc đơn giản hơn. Tôi không khuyên chọn cách đó chỉ để giữ con số nhánh bằng một.

### 6. Quyền AI cần rộng ở dev, nhưng ranh giới production phải thật

Sau khi cấu hình và duyệt chính sách cho project, **giao Feature nên bao hàm các quyền kỹ thuật thường lệ bạn vừa nêu**. Nhưng không bao hàm:

- Force-push, reset/xóa lịch sử hoặc xóa công việc ngoài phạm vi.
- Đẩy secret/dữ liệu riêng lên remote, kể cả repo đã được phép push.
- Tự đổi nghiệp vụ quan trọng, giảm tiêu chí hoặc bỏ kiểm tra để lấy PASS.
- Tự phát hành, sửa dữ liệu production, mua dịch vụ hoặc tăng chi phí ngoài phạm vi.

Dev cũng cần được nhận diện đúng: dữ liệu giả/đã làm sạch, tài khoản thử và cách ly các tác dụng phụ như gửi thư thật, thu tiền thật.

Quan trọng hơn, nếu AI vừa sửa được pipeline vừa dùng được toàn quyền production, thì câu “đợi Human duyệt” mới chỉ là lời dặn. **Cổng phát hành và quyền production phải được bảo vệ ngoài quyền sửa thông thường của AI.** Có thể do nền tảng triển khai hoặc cấu hình kiểm soát truy cập thực thi; phải kiểm tra khả năng thực tế của công cụ/gói dịch vụ, không mặc định một nút “Run workflow” là cổng Human-only. [GitHub về bảo vệ môi trường](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments), [an toàn workflow và runner](https://docs.github.com/en/actions/reference/security/secure-use).

Tag/version cũng cần được bảo vệ: Git cho phép thay tag bằng force, nên phải có quy tắc và quyền ngăn thay/xóa nhãn đã phát hành. Đồng thời giữ gói build và nhận diện nội dung của nó; **tag không phải bản backup và không hoàn tác database**. [Git tag](https://git-scm.com/docs/git-tag.html).

**Tóm lại, tôi khuyên chốt hướng: một master thường trực; AI tự sửa–kiểm tra–commit–push–deploy dev trong phạm vi; kiểm chứng đầy đủ mỗi Feature; Human duyệt đúng bản để phát hành; chỉ dùng nhánh hotfix tạm khi thật sự cần.**

Điều này đơn giản hơn đề xuất nhánh Feature trước đây mà không phải giảm yêu cầu chất lượng. Tuy nhiên, cần sửa đồng bộ phần tổ chức Git, vị trí kiểm tra cuối và quyền thực thi — không chỉ sửa một dòng “được push master”. Tôi chưa coi trao đổi này là approval hay quyền triển khai mới; G3-r2 vẫn đang review.


## 3. Các ràng buộc triển khai cần giữ khi chốt gói sau

| Tình huống | Hợp đồng cần có |
|---|---|
| Master nhận CI fail sau push | Không tuyên bố CI chặn trước push. Dừng bản deploy mới; ưu tiên sửa/revert theo quyền. Không tắt required checks đang có để ép mô hình. |
| CI xanh nhưng job bắt buộc skip hoặc workflow đã bị hạ chuẩn | Đối chiếu danh mục kiểm tra bắt buộc, nguồn thực thi và log/kết quả đúng bản; không dùng mỗi biểu tượng xanh. |
| AI sửa được pipeline | Tách dev khỏi production credential/controller; thay đổi quyền/gate/tiêu chí bắt buộc phải qua Human, không coi CODEOWNERS là khóa direct push. |
| Công việc khác hoặc hotfix chen vào | Một đầu mối ghi/tích hợp; giữ checkpoint và trạng thái công việc, kiểm chứng đúng bản kết hợp sau thay đổi; không bỏ gate vì không còn merge branch. |
| CI của C123 xong muộn sau C124 | Job triển khai phải dùng commit/artifact đã chọn và kiểm soát thứ tự; không để job cũ âm thầm ghi đè dev mới. |
| Dev deploy lỗi giữa chừng | Báo trạng thái thực tế và phần chưa xong; retry phải đối chiếu operation/bản đã triển khai, không lặp migration mù quáng. |
| Human duyệt nhưng master đã thay đổi | Approval gắn commit/artifact/config cụ thể, không gắn đầu master trôi. Bản bị thay đầu vào cần bằng chứng mới và đối chiếu lại phạm vi approval. |
| Version nhúng trong binary | Đưa version vào trước build cuối, kiểm tra đúng gói cuối. Nếu tool cần tag để build, tag candidate chưa đồng nghĩa phát hành. |
| API CLI tự chọn default branch | Chỉ rõ commit đã duyệt hoặc xác minh tag; không dựa vào default branch HEAD. |
| Hotfix production cũ | Nền là bản thực chạy, kiểm chứng bản vá và đưa fix phù hợp về master; tránh mất fix hoặc kéo Feature chưa được duyệt lên production. |
| Đổi database/config hoặc tác dụng phụ | Version code không đủ hoàn tác dữ liệu; rollback phải tương thích. Quyền dev không bao gồm dữ liệu/credential/thư/thu tiền thật. |
| Feature còn trong MVP dở | Giữ nghĩa vụ chưa đến hạn đúng trạng thái; kiểm tra toàn bản hiện hành khi khép Feature, không tuyên bố cả MVP đã hoàn tất. |

Các nghĩa vụ trên bổ sung cách thực thi, không thêm tracker thứ tư. Tiếp tục bản đồ đặc tả, bản đồ triển khai và bản đồ đối chiếu hai chiều; test/bằng chứng nằm trong các map hiện có, cùng hồ sơ trạng thái/review đã có.

### 3.1. Khả năng GitHub cần xác minh ở project trước khi hứa triển khai

GitHub ở đây là ví dụ đã đối chiếu, không phải lựa chọn nền tảng được duyệt.

- Required reviewers cho environment trên Free/Pro/Team chỉ có ở repo public theo [environment reference](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments). Private repo không mặc nhiên có gate này dù có environment secrets. Nếu không có gate thích hợp, production có thể do công cụ/tài khoản Human riêng kiểm soát.
- Prevent self-review có thể khóa luồng một Human vừa trigger vừa approve. Cần danh tính trigger/approver và cấu hình phù hợp, không bật theo mẫu mà chưa thử luồng thực.
- Không cấp admin/bypass cho actor dev rồi coi gate là ranh giới. Không dùng chung runner có credential hoặc network production với code dev không được duyệt. Xem [secure use](https://docs.github.com/en/actions/reference/security/secure-use).
- [Available rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets) hỗ trợ nguồn status check, nhưng workflow do cùng App chạy mà bị sửa để bỏ test vẫn cần kiểm soát nội dung. [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) phân biệt branch/tag ruleset với push ruleset; hỗ trợ và giới hạn plan không giống nhau.
- [GitHub CLI release create](https://cli.github.com/manual/gh_release_create) có thể tạo tag chưa tồn tại từ đầu default branch: phải pin target hoặc verify tag để không phát hành nhầm.
- [Immutable releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases) khóa tag/assets sau publication, không phải lúc draft; cần bật và xác minh khả dụng thực tế. Tính năng này không chứng minh phần mềm đúng và không thay backup. [Hướng dẫn bật](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/preventing-changes-to-your-releases).

### 3.2. Tại sao không chọn cấm nhánh tuyệt đối

Nếu production P, master P→F1→F2, còn bản vá cần P→H mà không có F1/F2, về bản chất cần dòng commit khác. Detached worktree chỉ bỏ tên branch, không bỏ nghĩa vụ giữ bản sửa, kiểm tra, công bố và tích hợp. Revert/reapply làm tăng thao tác/rủi ro. [Git worktree](https://git-scm.com/docs/git-worktree.html), [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging).

Tác giả [Branch for release](https://trunkbaseddevelopment.com/branch-for-release/) ưu tiên sửa kèm test trên trunk rồi cherry-pick bản vá tới release branch nếu phù hợp. Với Kidea, phải xác định bug có tái hiện và bản sửa có tương thích trên từng nền; chiều tích hợp tùy tình huống, nhưng cả bản vá production và master cuối đều cần kiểm chứng, không chỉ cherry-pick thành công.

## 4. Ảnh hưởng đến thiết kế hiện hành — chưa áp dụng

Nguồn baseline: commit eefce84a10bd1d35f0560d535ca58a64395e6786, trước lượt tư vấn này.

| Chủ sở hữu | Nội dung cần điều chỉnh nếu Human chọn hướng mới |
|---|---|
| DESIGN G1 / R01-T05 | Đổi branch Feature mặc định thành một master thường trực; ngoại lệ hotfix; không tự đổi tên nhánh project có sẵn. Đây là sửa một lựa chọn đã duyệt, phải có approval mới đúng phạm vi. |
| DESIGN G2 / R01-T05 | Chuyển điều kiện từ trước merge sang trước xác nhận Feature hoàn tất/bản đủ điều kiện; giữ nguyên toàn bộ lượt cuối mỗi Feature, phần không sửa, reviews/Human gates và chạy lại khi đầu vào thay đổi. Không cần duyệt lại nghĩa vụ chất lượng đã chốt. |
| DESIGN G3/G4 / R01-T06 | Quyền thường lệ theo project; ranh giới push/dev/production; checkpoint dở; fail/recovery; thay gói r2 đang nghiêng về branch+merge nếu Human duyệt hướng này. |
| DESIGN G5/G6 / R01-T07 | Bản đề nghị phát hành cố định, version/artifact đa thành phần, approval, hotfix và bản thực chạy. |
| R02-T02/T03/T04/T09 | Nhận diện phiên bản, evidence, approval, quyền và resume phải dùng cùng hợp đồng; không tạo nguồn trạng thái nhập tay thứ hai. |
| R06-T07/T10 | Rà ảnh hưởng/change và đưa bản sửa về dòng phát triển không được phụ thuộc bắt buộc vào một branch Feature. |
| R08-T02–T06 | Vòng code, gate toàn Feature, commit/push/dev, release và kiểm chứng thực thi đúng mô hình mới. |
| R09-T04/T09–T13 | Ca MVP dở, đổi sau release, hotfix, WIP, mất phiên và phối hợp; thêm kiểm chứng CI đỏ sau push, job deploy lỗi/lệch bản và approval cũ. |
| ACCEPTANCE KA-08/12/13/17/18/19/24/28 | Đồng bộ quyền, gate, bản làm/bản chạy, thay đổi/MVP/hotfix/resume/evidence. Giữ KA-05–07 về đúng phạm vi và approval. |

Lượt hiện tại chỉ ghi báo cáo tư vấn, con trỏ trao đổi trong ROADMAP và answer.md theo thỏa thuận repo. Không đổi DESIGN/ACCEPTANCE/QUALITY, không chuyển G3-r2 sang APPROVED/DONE và không mở quyền runtime/pilot/production.

## 5. Phương pháp, nguồn và giới hạn

Dùng skill Search/Exa, 7 truy vấn tổng cộng: một truy vấn về đầu vào build, ba về trunk/hotfix, ba về CI/quyền/release. `sources_reviewed = 35` là tổng numResults theo quy tắc accounting của skill, không phải 35 tài liệu độc lập đều được đọc toàn văn hoặc cùng hỗ trợ kết luận. 35 URL kết quả khác nhau theo so sánh chuỗi; có URL redirect/biến thể/phiên bản của cùng tài liệu. Fetch để xác minh không cộng vào số tìm kiếm; không có retry tìm kiếm. Ưu tiên tài liệu chính thức GitHub/Git/SLSA và DORA; Trunk-Based Development dùng như nguồn của tác giả phương pháp. Loại blog tổng hợp/domain mirror khỏi bằng chứng kết luận.

Không có benchmark hay pilot thực thi trong lượt này. Không xác nhận plan, branch protection, runner hoặc môi trường dev/production cụ thể của một project. Những lựa chọn công cụ và cơ chế quyền cần kiểm chứng sau khi được Human chốt phạm vi.

### Đầu vào build và bằng chứng — 5 kết quả

- [slsa.dev/spec/v1.2/build-provenance](https://slsa.dev/spec/v1.2/build-provenance)
- [slsa.dev/spec/draft/build-provenance](https://slsa.dev/spec/draft/build-provenance)
- [slsa.dev/spec/v1.2-rc2/build-provenance](https://slsa.dev/spec/v1.2-rc2/build-provenance)
- [slsa.dev/spec/v1.0/provenance](https://slsa.dev/spec/v1.0/provenance)
- [slsa.dev/spec/v1.1/provenance](https://slsa.dev/spec/v1.1/provenance)

### Một trunk, phần thay đổi nhỏ, tag và hotfix — 15 kết quả

- [dora.dev/capabilities/trunk-based-development/](https://dora.dev/capabilities/trunk-based-development/)
- [dora.dev/capabilities/working-in-small-batches/](https://dora.dev/capabilities/working-in-small-batches/)
- [dora.dev/research/2023/dora-report/2023-dora-accelerate-state-of-devops-report.pdf](https://dora.dev/research/2023/dora-report/2023-dora-accelerate-state-of-devops-report.pdf)
- [dojoconsortium.org/docs/cd/dora-recommendations/](https://dojoconsortium.org/docs/cd/dora-recommendations/)
- [docs.aws.amazon.com/wellarchitected/latest/devops-guidance/dl.scm.2-keep-feature-branches-short-lived.html](https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/dl.scm.2-keep-feature-branches-short-lived.html)
- [trunkbaseddevelopment.com/branch-for-release/](https://trunkbaseddevelopment.com/branch-for-release/)
- [trunkbaseddevelopment.com/](https://trunkbaseddevelopment.com/)
- [book.trunkbaseddevelopment.com/trunk_based_development_book.pdf](https://book.trunkbaseddevelopment.com/trunk_based_development_book.pdf)
- [paulhammant.com/files/Trunk_Correlated_Practices_v2.7.pdf](https://paulhammant.com/files/Trunk_Correlated_Practices_v2.7.pdf)
- [scalhive.com/en/blog/post-2/](http://scalhive.com/en/blog/post-2/)
- [git-scm.com/docs/git-worktree.html](https://git-scm.com/docs/git-worktree.html)
- [git-scm.com/docs/git-tag.html](https://git-scm.com/docs/git-tag.html)
- [git-scm.com/book/en/v2/Git-Basics-Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
- [github.com/git/git/blob/master/Documentation/git-worktree.adoc](https://github.com/git/git/blob/master/Documentation/git-worktree.adoc)
- [git-scm.dev/docs/git-tag](https://git-scm.dev/docs/git-tag)

### CI, quyền dev/production và release bất biến — 15 kết quả

- [docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
- [docs.github.com/actions/deployment/targeting-different-environments/managing-environments-for-deployment](https://docs.github.com/actions/deployment/targeting-different-environments/managing-environments-for-deployment)
- [docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment](https://docs.github.com/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/review-deployments)
- [docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository](https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [docs.github.com/en/rest/orgs/rules](https://docs.github.com/en/rest/orgs/rules)
- [docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository)
- [docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases](https://docs.github.com/en/code-security/concepts/supply-chain-security/immutable-releases)
- [docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [cli.github.com/manual/gh_release_create](https://cli.github.com/manual/gh_release_create)
- [github.blog/changelog/2025-10-28-immutable-releases-are-now-generally-available/](https://github.blog/changelog/2025-10-28-immutable-releases-are-now-generally-available/)
- [docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository?tool=webui](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository?tool=webui)

### Nguồn đọc bổ sung ngoài kết quả tìm kiếm

- [GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use).
- [GitHub Docs source: about rulesets](https://raw.githubusercontent.com/github/docs/main/content/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets.md).
- [GitHub Docs source: plan gate](https://raw.githubusercontent.com/github/docs/main/data/reusables/gated-features/repo-rules.md).
- [Preventing changes to releases](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/preventing-changes-to-your-releases).

Ba URL fetch thử không có nội dung dùng được, không dùng làm căn cứ: GitHub Docs raw immutable-releases.md; raw gated-features/immutable-releases.md; đường dẫn how-tos/secure-your-supply-chain/manage-your-dependency-security/prevent-changes-to-releases. Đã thay bằng trang docs chính thức hiện hành liên kết ở trên.
