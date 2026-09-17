# R09 — đề xuất các quyết định tiếp theo r1

Ngày 2026-09-17. **APPROVED A–E.** Human: “Tôi duyệt tất cả mục trên nhé”, cho gói tại `77f5caf`. A nghiệm thu D1 tại `26dffeb`; B/C được mở theo đúng giới hạn, D/E áp dụng đúng thời điểm. Không nghiệm thu trước đầu ra B/C hoặc R09. [Kết quả D1](../tests/evidence/r09/d1-r1.md), [gói R09](r09-pilot-r1.md), [roadmap](../KIDEA_ROADMAP.md#r09).

Human yêu cầu: “Phần tồn đọng cũ mà bạn nêu thì để sau, các phần còn lại cần phê duyệt thì nêu đề xuất của bạn ra”. Áp dụng phần tồn đọng được nêu ở đoạn cuối câu trả lời trước: view pilot kế thừa R07, Windows/Apple Silicon và native. Chưa thực hiện chúng trong gói này. Việc hoãn không là PASS hoặc tự chuyển gate bắt buộc sang phase khác; khi khép R09 vẫn phải giải quyết phạm vi gate view còn ghi trong roadmap. Các thiếu hụt thao tác phục vụ R09 được nêu riêng ở phần công việc kỹ thuật vẫn thuộc đề xuất dưới đây.

## Gói có thể duyệt theo từng mục hoặc gộp A–E

### A — Nghiệm thu D1

Đề xuất chấp nhận kết quả tại `26dffeb`: core293/293, R06 và 5 nhóm boundaries, R07 đạt trên Mac Intel; log FAIL/PASS giữ nguyên. Khép S02 đúng phạm vi phân rã ban đầu và chuyển tiến độ. Không suy thành pilot PASS, chứng nhận host khác hoặc khép R09.

### B — Bổ sung thao tác còn thiếu trước các lát pilot phụ thuộc

Đề xuất mở ba subtask hữu hạn tại runtime R02/liên quan R06/R08 theo cơ chế R09-T14. Giữ sáu hành động, một cây công việc có thẩm quyền, schema2 khi tương thích và quyền tách biệt với thao tác môi trường. AI hoàn thiện hợp đồng chi tiết và triển khai trong các giới hạn sau; không cần hỏi lại tên hàm/trường thường lệ. Nếu cần đổi schema không tương thích, bỏ gate hoặc mở quyền môi trường, trình đúng phần đó trước.

| Subtask | Hành vi được đề xuất | Kiểm bắt buộc |
|---|---|---|
| B1 — Sửa kế hoạch và quản lý vòng làm việc | Thay đổi cây đã phân rã theo impact và approval hiện hành; giữ ID/tiến độ còn hợp lệ, lịch sử việc bị thay thế và điểm tiếp tục. Tạo/chọn vòng CHANGE/BUGFIX với baseline rõ, không làm DONE vòng MVP/Feature dở. Không nhập trạng thái hoàn tất từ một lời yêu cầu. | Thêm Feature giữa MVP; đổi input làm review cũ mất hiệu lực; consumer không diff; loại/di chuyển task phải có disposition; sai round/dependency/cycle bị chặn; giữ Feature dở khi hotfix và quay lại đúng việc. |
| B2 — Hồ sơ phát hành và từng lần thao tác | Qua giao diện công khai ghi release/revision và operation/observation theo schema hiện có, bind source/artifact/config/schema/script/target. Mỗi lần thử có identity riêng; UNKNOWN/FAILED giữ lịch sử, readback mới đủ căn cứ mới ghi kết quả tương ứng. Helper chỉ ghi hồ sơ, không tự deploy. | Sai artifact/target/revision/script, lỗi một phần, mất phản hồi, retry có attempt riêng, tổ hợp cũ–mới; không lấy exit0 hoặc dự định thay running state. |
| B3 — Đối chiếu sau gián đoạn | Đọc pending/preimage/planned/current và nhận quyết định xử lý đúng phạm vi. Chỉ cho hoàn tất ghi nhận hoặc một thao tác phục hồi được chọn rõ khi precondition còn khớp; giữ toàn bộ chứng cứ cũ. Ngoại tác phải có observation thực, không tự gửi lại lệnh. | Before/planned/other/unknown, đổi nguồn/quyền/checkout, tiến trình mới, ghi một phần, retry và ngắt ngay trong recovery; trạng thái không rõ vẫn chặn, không xóa marker để lấy PASS. |

File dự kiến: helper/validator dưới `.agents/skills/kidea/scripts/`, reference/SKILL liên quan, tests mới dưới `tests/r09/`, runner hồi quy, thiết kế/roadmap và evidence mới. Không viết vào pilot bằng writer nội bộ. Mỗi subtask có test tập trung, rồi core đầy đủ và các bộ R06/R07/R08 thực sự bị ảnh hưởng trên nguồn cuối; giữ FAIL, không thay oracle để xanh. Kiểm hợp đồng R08 local không tự mở lại B1/B2/cloud workload lịch sử.

Quyền B đề xuất: chỉ repo Kidea, fixture local riêng và công cụ đã có; không tải/cài hệ thống, không Docker/cloud workload hoặc AI trial mới. Commit/push Kidea theo quyền hiện hành. Một subtask triển khai tại một thời điểm. Không refactor ngoài ba chức năng hoặc tự thêm executor sản phẩm. Kết quả vẫn cần review đúng gate, approval kế hoạch B không nghiệm thu trước mã chưa viết.

### C — Chuẩn bị và khởi tạo pilot local

Đề xuất dùng đúng sibling `/Users/kendrick/Desktop/kidea-workshop-pilot`, giữ `docs/` và `samples/` có sẵn. Tạo Git **local**, nhánh `master`, chưa tạo repository GitHub/remote hoặc push pilot. Không thay Git global, dùng danh tính Git có sẵn nếu hợp lệ; thiếu danh tính thì báo, không giả tác giả.

Thứ tự và danh sách ghi:

1. Đọc đủ 21 docs/137 case, đối chiếu approval R03–R05 và ngữ nghĩa hiện hành; lập bảng kế thừa, không hỏi lại quyết định đã duyệt. Chốt kế hoạch theo lát cắt T02→T03→T04→T05 rồi release/change/hotfix; các ca quyền/ngắt/handoff xuyên suốt.
2. Sửa **chỉ đường dẫn Windows đã hỏng** trong 8 docs được liệt kê ở `windowsLinkFiles` của [inventory](../tests/evidence/r09/preparation-r1/inventory.json), giữ nội dung nghiệp vụ; thêm `docs/kidea-handoff.md` để dẫn đúng nguồn/approval và `docs/implementation-plan.md` cho kế hoạch. Lưu preimage/hash và kiểm link; nếu nội dung mâu thuẫn thì trình phần có ảnh hưởng thay vì tự chốt nghĩa.
3. Tạo `.gitignore`, bỏ khỏi Git pilot các cache/binary/secret và `/samples/` lịch sử; giữ samples nguyên trên đĩa. Tạo `.git/` local và commit các tài liệu/quy ước đã chọn; không gom file ngoài allowlist.
4. Khi đủ đầu vào và B liên quan đã kiểm, chạy public `init` với Feature Map hiện có; cho phép tạo `.kidea/INDEX.md`, `.kidea/work.md`, checkpoint/evidence của public helper. Các lần ghi review/plan/work tiếp theo chỉ qua public API trong phạm vi gói và xác nhận thật. Đối chiếu status/resume; không chuyển 137 case NOT_RUN thành PASS hoặc nhập kết quả sample vào tiến độ sản phẩm.

Đầu ra C: checkout pilot có provenance và checkpoint hợp lệ, kế hoạch/test/lệnh và manifest thực thi **được chuẩn bị để review**. C chưa mở code/build/deploy workshop hoặc phiên AI kiểm độc lập mới. Các quyền thực thi đó phải đi với workload/lệnh/target/quota có căn cứ sau khi nguồn đã rõ. Không tái dùng deadline/waiver/cache mutable làm bằng chứng từ R08. Quyền cloud đã cấp giữ nguyên, không xin lại từng lệnh; workload mới vẫn phải có gói cụ thể trước chạy.

### D — Chốt hai thay đổi nghiệp vụ thử nghiệm theo thời điểm

Đề xuất duyệt ý nghĩa nghiệp vụ sau, ghi nhận trước nhưng chỉ đưa vào scope sản phẩm ở đúng T04/T09; không thêm ngay vào MVP ban đầu và không giả đây là phản hồi Human phát sinh muộn:

- **T04:** mỗi người tối đa **2 đăng ký ACTIVE trên toàn bộ workshop**. Bản CANCELLED không chiếm hạn mức; hủy hợp lệ giải phóng một suất trong hạn mức cá nhân. Đăng ký workshop thứ ba khi đủ 2 ACTIVE bị từ chối; kiểm trong cùng transaction với quyền, idempotency và sức chứa, kể cả hai yêu cầu đồng thời. Retry cùng mã vẫn đọc đúng kết quả cũ, không tính thêm lượt. Nếu dữ liệu lúc chuyển phiên bản đã có hơn 2 ACTIVE thì giữ dữ liệu, chặn đăng ký mới đến khi giảm dưới 2, không tự hủy đăng ký của người dùng.
- **T09:** khi workshop PAUSED, người có quyền **được hủy đăng ký của chính mình**, nhưng không được đăng ký mới. Giữ kiểm quyền/ownership, hủy đúng ID, idempotency, lịch sử và atomicity; không mở quyền hủy hộ. Các trạng thái/điều kiện khác giữ nguyên.

Impact và bảng thứ tự từ chối/test phải được đồng bộ trước code, vẫn kiểm toàn dự án theo G2. Nếu phát hiện mâu thuẫn nguồn chưa được giải bởi các quy tắc trên, trình riêng phần mâu thuẫn. D không là nghiệm thu output/test hoặc giấy phép deploy.

### E — Chốt phạm vi phát hành lab và SEO

Đề xuất chỉ dữ liệu giả, môi trường phi production; AI vận hành DEV trong quyền, Human trực tiếp chạy bộ script vai PROD đã kiểm trên lab theo T08. AI chuẩn bị hướng dẫn ngắn, exact artifact/config/script/revision và readback trước lúc Human thao tác; chưa cần Human ngồi máy ngay.

Đề xuất **N/A cho crawl/index công khai của lab**, dùng noindex; vẫn kiểm SSR/prerender, HTML/URL/metadata, khả năng truy cập và UX đã chốt. Không N/A toàn SEO, không bỏ gate thiết kế hoặc readiness. Ghi quyết định này vào đúng gói sản phẩm khi đầu vào đã khớp; không coi approval chính sách lab là xác nhận ứng dụng đã sẵn sàng phát hành. Chưa xin DNS, public production, credential mới hoặc rollout thật.

## Những điều không thể duyệt trước bằng gói này

Gate đầu ra từng bước, các phản hồi reject/approval thật khi thử, exact release readiness và nghiệm thu R09 cuối vẫn dựa trên kết quả thực. Các gói build/performance/cloud/AI trial mới phải có manifest, quyền và giới hạn trước thực thi; hiện chưa xin một hạn mức tưởng tượng hoặc quyền chạy cả phase trong một lượt. Khi đủ đầu vào, gộp các quyết định còn thiếu vào một lần review.

Human đã duyệt A–E đúng phạm vi nêu trên; không xin lại từng mục, không nghiệm thu trước R09 hoặc bỏ gate đang hoãn.
