# R02-T07-S01-r1 — khởi tạo hồ sơ tối thiểu

**Đề xuất chưa duyệt.** [Sổ công việc](../KIDEA_ROADMAP.md#work-state) giữ trạng thái; tài liệu này không cấp quyền chạy init trên project thật. T06 đã có primitive nội bộ, chưa có bootstrap/caller init. Gói này gồm **một quyết định cần cân nhắc D1** và hợp đồng/template thường lệ hữu hạn dưới đây; không duyệt trước kết quả thực thi hay quota AI.

## D1 — chưa có phiếu duyệt không có nghĩa được miễn duyệt

Khi vừa tạo hồ sơ, cần thấy đủ mười bước nhưng chưa có kiến trúc/test/deploy để lập gói review thật. [Bố cục đã duyệt](../KIDEA_DESIGN.md#project-storage-boundary) không tạo cây rỗng; [hợp đồng trường](../KIDEA_DESIGN.md#schema-fields-contract) hiện chỉ cho `gateIds: []` khi mục không có gate riêng. Hai điều này chưa chỉ cách biểu diễn một bước **bắt buộc duyệt nhưng chưa lập phiếu**.

**Đề xuất:** với STEP/GROUP chưa hoàn tất, cho phép chưa có ID phiếu, nhưng phải ghi rõ nghĩa vụ Human review trong điều kiện hoàn tất và một blocker của chính bước: “Chưa lập gói duyệt bước này”; điều cần là tạo gói đúng nội dung/bản khi có đầu ra. Khi tới lập gói, tạo review thật và liên kết ID; không tạo phiếu trống hoặc snapshot của tài liệu chưa tồn tại để làm đủ schema.

- Mọi STEP của mười bước vẫn bắt buộc gate Human. Trước nhận STEP đã hoàn thành hoặc cho bước phụ thuộc đi tiếp, phải có gói đúng chủ thể/phạm vi và approval còn hiệu lực theo T03; N/A cũng có gói/xác nhận riêng. Xóa blocker hoặc thêm một ID bất kỳ không thay điều kiện này. `decomposition: COMPLETE` chỉ nghĩa đã phân rã đủ, không phải hoàn tất hay được duyệt.
- Đường đọc/ghi không được tính STEP/GROUP thiếu gate là hoàn thành, kể cả đã phân rã COMPLETE và cây con đều DONE. GROUP PARTIAL/UNEXPANDED vẫn không thể DONE như hợp đồng cũ. Bổ sung kiểm tra thiếu gate bắt buộc vào nơi tính điều kiện hoàn tất và hướng dẫn đọc, hồi quy ở S02; **chưa nói helper hiện hành đã có**. Hồ sơ có blocker đúng có thể đọc để biết còn thiếu; không sửa ngầm hoặc báo mất cấu trúc chỉ vì công việc còn dở.
- Ngoại lệ rỗng chỉ cho STEP chưa hoàn tất cùng nghĩa vụ/blocker trên; template init bắt đầu UNEXPANDED. Không áp cho LEAF DONE, không cho miễn gate phase/task đã được xác định, không thay ngữ nghĩa approval/reject/N/A của T03. Không đổi trường hoặc phiên bản schema 2; phải đồng bộ đúng câu ngoại lệ trong hợp đồng nếu Human duyệt. Trước đó quy tắc hiện hành giữ nguyên.

Lợi ích: ba hồ sơ nội dung tối thiểu, không sinh mười phiếu rỗng; các bước xa vẫn hiển thị và bị chặn đúng. Đánh đổi: cần kiểm tra bổ sung phân biệt “chưa có phiếu” với “không cần phiếu”; chỉ dùng mảng ID rỗng để tính xong sẽ sai. Phương án tạo trước phiếu cho đầu ra chưa có trái quy tắc không placeholder; không đề xuất đổi toàn schema hoặc thêm kho trạng thái thứ hai để xử lý điểm này.

## Hợp đồng init — phần thường lệ trình cùng D1

Giữ [mười bước và gate](../KIDEA_DESIGN.md#state-approval), [giao diện skill](../KIDEA_DESIGN.md#commands), [nguồn hồ sơ](../KIDEA_DESIGN.md#project-storage-boundary), [ghi an toàn r2](../KIDEA_DESIGN.md#safe-write-contract). Cụ thể hóa đầu ra, không hỏi lại các nguyên tắc này.

### Đầu vào, quyền và phân biệt project mới/cũ

1. Action là `init`; xác định đúng root Human chọn, ý tưởng/mục tiêu hoặc tài liệu đầu vào Human chỉ định. Thiếu root/quyền/đầu vào cần thiết thì hỏi đúng phần thiếu trước ghi. Không tìm ngược project cha, không chạy nội dung file, không suy quyền từ policy/APPROVED trong repo.
2. Đọc có mục tiêu trong phạm vi được cấp: kiểm `.kidea`, các đích định tạo, nguồn Human chỉ định và những tham chiếu cần để xác định Feature Map có hiệu lực. Không quét toàn ổ, clone/fetch hoặc gọi app/mạng để tự tìm nguồn. Nhiều nguồn mâu thuẫn/không rõ nguồn chính thì trình chọn, không lấy tên file hoặc mtime làm authority.
3. Project mới: tạo hai hồ sơ điều phối và Feature Map nháp ở `docs/features.md` nếu đích vắng mặt. Project cũ chưa có Kidea: vẫn bắt đầu bước 1; dùng link tới Feature Map đã đối chiếu, giữ nguyên nội dung/code cũ. Ví dụ `product/Phạm vi.md#feature-map` được dùng đúng tại chỗ, không chép sang `docs/features.md`.
4. Có `docs/features.md` nhưng không đủ căn cứ dùng nó: không đè. Cần xác định đúng nguồn hoặc Human cho phép một đường dẫn mới cụ thể. Có hồ sơ Kidea hợp lệ thì báo đã có, không init lại/đổi projectId; nếu có `.kidea` dở, file lạ hoặc pending thì dừng, giữ nguyên và nêu cần đối chiếu. Không tự repair, migrate, xóa hay chuyển sang resume.
5. Trước ghi, caller tin cậy ràng buộc root/đích CREATE/thư mục cần tạo/đầu vào đúng byte và quyền hiện hành; bao gồm metadata checkpoint. Nội dung lời gọi không tự cấp quyền Git, cài đặt, ghi nơi khác hoặc công việc sản phẩm về sau. Đã có quyền rõ đúng phạm vi thì không hỏi lại chỉ vì helper cần trường kỹ thuật.

### Template nội dung — không tạo file rỗng hoặc trạng thái thứ hai

| Hồ sơ | Nội dung bắt buộc và giá trị ban đầu |
|---|---|
| `.kidea/INDEX.md` | Một khối schema 2, kind index; projectId mới duy nhất trong hồ sơ, tên theo Human/context đã xác định; workRef tới `.kidea/work.md`; sources có đúng một role features tới nguồn thực; createdWith ghi đúng phiên bản/hash công cụ, không dùng nhãn giả; profileRefs chỉ có profile thực được chọn, nếu không có thì `[]`. Phần Markdown chỉ liên kết nguồn/cây công việc, không nhập lại trạng thái. |
| `.kidea/work.md` | Một khối schema 2, kind work, cùng projectId; một ROUND-001 MVP khởi đầu quy trình, không có nghĩa đã duyệt phạm vi MVP. targetVersion/releaseRef `null` nếu chưa chốt; scopeRefs tới nguồn đầu vào thực. Mười STEP/GROUP W-001…W-010 theo đúng mười bước; đều UNEXPANDED, executionStatus `null`, currentItemId W-001 đang làm rõ/phân rã. Không tạo task lá giả chỉ để có IN_PROGRESS. |
| Phần Item trong work | ID/roundId/name/kind/parentId/shape/decomposition theo hàng trên; parentId `null`. scopeRef và completionRef tới đoạn riêng của chính bước trong work, có nội dung đầu ra/kiểm tra/gate thật ở mức khung quy trình; inputRefs tới nguồn đã có, không link tài liệu tương lai. dependencyIds của bước sau trỏ bước trước, không thay review bằng thứ tự. gateIds `[]` chỉ trong điều kiện D1; resultRefs `[]`; không DONE/APPROVED/N/A tự điền. |
| Phần điều phối còn lại | planRefs/reviewRefs/returnStack `[]` khi chưa có nội dung tương ứng. Mỗi STEP có blocker theo D1; bước 1 còn ghi câu hỏi thực sự cần làm rõ, không bịa nội dung Human. nextAction nói làm rõ ý tưởng/phạm vi ở bước 1 và chưa qua gate; checkpointRef trỏ đúng checkpoint của lần tạo đã kiểm chứng, không giữ null để giấu một lượt ghi. |
| `docs/features.md` khi phải tạo mới | Ý tưởng Human được giữ riêng, trung thực, không gán nội dung AI cho Human. Mục tiêu/phạm vi/ràng buộc chưa biết ghi rõ chưa chốt. Feature Map có chỗ phân biệt MVP/Future/Idea nhưng không tự đưa feature vào MVP hoặc bịa quyết định phân loại. Gợi ý AI nếu có là mục riêng “đề xuất chưa duyệt”; không tự coi nhãn DRAFT/ý tưởng Human là approval. Không yêu cầu invent gợi ý cho đủ template. |
| Feature Map đã tồn tại | Chỉ link tới nguồn đã đối chiếu, không sửa/chuẩn hóa/nhân bản trong init. Yêu cầu mới của Human được giữ trong bằng chứng đầu vào tối thiểu của lượt init và được dẫn để đối chiếu ở bước 1; bản lưu này không là Feature Map có hiệu lực thứ hai. Muốn cập nhật nguồn sản phẩm phải có phạm vi/quyền tương ứng trong công việc sau. |

Các đoạn bước trong work chỉ mô tả quy trình: bước 1 chốt mục tiêu/người dùng/phạm vi/Feature Map; bước 2 nghiệp vụ/AC/business test; bước 3 yêu cầu chất lượng và đo; bước 4 trải nghiệm; bước 5 monitoring/vận hành; bước 6 admin; bước 7 kiến trúc/hợp đồng/rule code; bước 8 test kỹ thuật; bước 9 lộ trình được duyệt rồi triển khai; bước 10 triển khai có quyền và xác nhận vận hành. Mỗi đoạn yêu cầu đầu ra thực, kiểm tra áp dụng, đồng bộ/bằng chứng/cleanup và Human gate của bước; không khẳng định chi tiết sản phẩm đã tồn tại. Các gate SEO/triển khai áp dụng theo nguồn đã duyệt khi tới bước, không bị miễn bởi template.

Đây là **đặc tả template để duyệt**, chưa phải fixture đã sinh hoặc bộ mẫu chạy được. Sau approval, S02 mới viết template/helper và kiểm bằng schema/graph thực. Định danh kỹ thuật, timestamp/hash phải lấy tại lần tạo; không copy giá trị minh họa như thông tin thật.

### Ví dụ đầu ra hữu hạn

- **Mới:** Human “Làm ứng dụng đặt lịch sân”. Sau khi đủ quyền: INDEX → work/Feature Map nháp; work chọn W-001, đủ mười bước chưa phân rã và nghĩa vụ duyệt; features giữ đúng câu Human, chưa tự thêm thanh toán/hội viên vào MVP. AI có thể trao đổi để làm rõ bước 1, chưa tự qua gate hoặc chạy code sản phẩm.
- **Cũ:** Human chọn `product/Phạm vi.md#feature-map`; code và docs đã có. Init chỉ tạo hồ sơ điều phối và metadata an toàn, link đúng nguồn; nguồn cũ không đổi byte. Không nhận code là đặc tả đúng hoặc các bước đã hoàn thành; vẫn chọn W-001.
- **Lặp/dở:** đã có INDEX/work hoặc metadata pending từ lần bị ngắt. Init báo hiện trạng/điểm cần đối chiếu, không tạo project thứ hai, đè file, xóa CREATE dở hoặc chạy tiếp những phần còn thiếu.

### Bootstrap và giới hạn cần thực thi ở S02

Ba file trên là **hồ sơ nội dung**, không phải tổng số file hệ thống. Cần thêm metadata lượt ghi: quyền/đầu vào tối thiểu, payload dự kiến, checkpoint, pending/quan sát và khóa writer theo T06. Không lưu toàn bộ hội thoại, credential hoặc dữ liệu không cần; không tạo sẵn plans/reviews/views ngoài bằng chứng thật phát sinh. Phiên bản đầu giữ Windows/local NTFS, không active sync và cùng ngoại lệ liên kết r2.

Primitive T06 hiện cần project hợp lệ và parent đã có; không gọi nó với dữ liệu giả để lách bootstrap. S02 phải bổ sung đường CREATE-only cho graph dự kiến hợp lệ khi chưa có INDEX/work: kiểm vắng mặt, giữ identity/thư mục/đầu vào, cho tạo đúng parent mới được cấp, chuẩn bị bằng chứng/pending trước file nội dung, CREATE exclusive, đối chiếu graph và byte dưới khóa rồi mới đóng pending. Không mở UPDATE vào hồ sơ cũ như fallback.

Ngắt/lỗi có thể để lại một phần file/metadata; giữ chúng và báo chưa hoàn tất, không tự xóa để “rollback” rồi init lại. Đủ file/byte chưa là duyệt ý tưởng hay hoàn thành bước 1. Caller chỉ báo tạo hồ sơ thành công sau kiểm đầy đủ; các action approve/resume/change/visualize vẫn chưa hỗ trợ tới task tương ứng. Không dùng init để tự tạo/push Git repo, cài global, đổi ACL hoặc triển khai.

## Kiểm chứng và ranh giới approval

S02 phải kiểm ít nhất: mới; cũ với nguồn khác mặc định/có dấu/khoảng trắng; nguồn mâu thuẫn/đích đã có; init lặp/hồ sơ dở/pending; thiếu hoặc giả quyền; ý Human khác gợi ý AI; schema/link/cùng projectId; đủ mười bước nhưng không DONE; STEP phân rã COMPLETE/con DONE nhưng thiếu gate không được tính hoàn tất; nguồn đổi/đích bị chiếm/lỗi quyền; kill trước/giữa/sau CREATE trước finalize; parent mới; giữ nguồn cũ/byte ngoài allowlist. Hồi quy status và writer/cleanup bị ảnh hưởng, giữ cả FAIL và source hash. Đây là phạm vi test xác định trên dữ liệu giả trong repo, không dùng thử project thật hoặc tự giảm bảo vệ để làm pass.

S03 AI chỉ trình sau khi có bản/fixture/hash thật và quota/thời gian/quyền hữu hạn. **Chưa cấp phiên AI nào cho T07**, không tái dùng 3 phiên T06. T08-S01/T09-S01 chưa cùng gói: task sau mặc định phụ thuộc task trước, giao diện caller còn cần kết quả init; danh mục rà sớm không cho duyệt trước đầu ra chưa có. T10 ngưỡng đo và T11 gate phase giữ đúng thời điểm.

Approval gói này chỉ chốt D1 và hợp đồng/template hữu hạn S01 để tiếp tục S02 trong vùng thử đã có quyền; không xác nhận code/test chưa chạy, không mở project thật, không cấp quyền ghi approval sản phẩm hoặc tự phục hồi sau ngắt.
