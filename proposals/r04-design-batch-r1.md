# R04-DESIGN-BATCH-r1 — Gói phương pháp, quyền và kiểm chứng

Ngày 2026-09-15. **APPROVED D1–D6/P1–P3 và protocol:** Human “Duyệt gói R04” sau answer tại `7ef7f1b5a91deed4cd100c275b9fde45e66d320d`. D3 N/A kết quả tìm kiếm thật có hiệu lực cho lab; các gate đầu ra vẫn giữ. Đã mở soạn chất lượng, chưa dùng phiên AI. Những chữ đề xuất/chưa thực thi bên dưới giữ nội dung bản đã được duyệt, không tự xác nhận đầu ra mới. [Kế hoạch vào phase](r04-method-entry-r1.md); [nguồn quy trình](../KIDEA_DESIGN.md#workflow); [phạm vi R04](../KIDEA_ROADMAP.md#r04).

## 1. Chốt gì trong một lượt?

Cập nhật thực thi: năm gate bản đầu đến K1–K7/AR-r1 đã được Human duyệt; M0–M5 đã tích hợp, kiểm lõi/tài liệu/validator đã chạy. D5 đã dùng đúng một reviewer và hai lượt recheck trong cùng cửa sổ; chưa cấp phiên mới. Findings đưa kiến trúc trở lại gate cho [C1–C5](../tests/evidence/r04/design-r1/correction-request.md); bản sửa còn đề xuất, không tự áp vào pilot. Các mục quyền/protocol bên dưới giữ nguyên bản được duyệt.

R03 giúp Kidea viết rõ sản phẩm phải làm gì. R04 bổ sung cách thiết kế sản phẩm trước khi code. Workshop vẫn chỉ là bài mẫu kiểm chứng Kidea. Không xây workshop hoặc thêm hạ tầng trong gói này.

| ID | Đề xuất cần chốt | Ví dụ / điều phải chấp nhận |
|---|---|---|
| D1 | Dùng năm mẫu ngắn ở mục 2; chỉ viết phần có ích, truy nguồn nghiệp vụ, không sinh một file cho mỗi yêu cầu | Quy tắc “không vượt chỗ” có một nguồn; màn hình/API/test dẫn tới nguồn đó, không chép ba phiên bản |
| D2 | Chốt mục tiêu chất lượng theo bài thử có tải và môi trường rõ; không dùng seed nhỏ làm cam kết tải. Ngưỡng chưa đủ căn cứ phải đề xuất riêng trong kết quả bước 3 | “Phản hồi nhanh” chưa đủ; phải ghi loại thao tác, tải, thời gian đo và giới hạn. Chưa đo thì ghi chưa đo, không PASS |
| D3 | Trong pilot kín, đánh dấu **N/A cho kết quả indexing/xếp hạng/trích dẫn tìm kiếm thật**; vẫn thiết kế và kiểm HTML, URL, metadata, public/private và cấm index lab | Không công khai website chỉ để thử Google; N/A này không bỏ thiết kế SEO hoặc khả năng hướng dẫn SEO của Kidea |
| D4 | Cấp quyền soạn đúng năm tài liệu pilot ở mục 3, cập nhật liên kết trong mười tài liệu R03; tích hợp hướng dẫn vào skill sau khi nội dung được duyệt | Chỉ thêm tài liệu thiết kế và đường truy nguồn. Không sửa rule đăng ký, không thêm runtime, không cài VM |
| D5 | Cấp **một phiên AI kiểm độc lập, tối đa 15 phút**, sau khi đủ thiết kế; cùng phiên được kiểm lại sửa lỗi trong thời gian còn lại | Nếu hết giờ mà còn thiếu, báo PARTIAL rõ phần nào; không tự thêm phiên hoặc nâng giới hạn |
| D6 | Duyệt phương pháp/quyền trước, duyệt đầu ra đúng bản sau; gom các mục đủ điều kiện cùng lượt nhưng giữ gate bước 3–7 và SEO | Duyệt cách thiết kế không đồng nghĩa đã duyệt database chưa chọn. Chỉ hỏi lại vì đầu ra cần duyệt hoặc vấn đề mới thật sự |

Khuyến nghị duyệt D1–D6 cùng nhau. Có thể loại/sửa từng ID. Không đề nghị duyệt trước kiến trúc, ngưỡng số, tên dịch vụ hoặc kết quả chưa có. Quyền và protocol mục 3–4 là phần của D4–D5, không phải phụ lục tùy ý mở rộng.

## 2. Phương pháp và mẫu dùng ngay

### M0 — Cách làm chung

1. Đọc nguồn nghiệp vụ liên quan và ràng buộc đã duyệt, không chỉ đọc trạng thái/link. Với project đã có code, phân biệt thực tế quan sát với yêu cầu mong muốn.
2. Mỗi vấn đề ghi nguồn → lựa chọn → lý do → tác động → cách kiểm. Phân loại **giữ nguyên / đề xuất mới / thiếu căn cứ / đã kiểm**; không coi đề xuất là nguồn có hiệu lực.
3. Chọn ví dụ bình thường, biên và lỗi làm lộ thiết kế sai. Nội dung không áp dụng có lý do và Human xác nhận; không điền nội dung giả để đủ mẫu.
4. Link đến đúng rule/AC và thêm đường truy ngược từ nguồn bị dùng; đổi nội dung thì rà consumer kể cả file không đổi code. Kiểm link không thay review ý nghĩa.
5. Gặp rule mới, mâu thuẫn hoặc thiếu quyền: ghi vấn đề, quay đúng bước sớm nhất bị ảnh hưởng; tiếp tục phần độc lập. Không âm thầm sửa R03 hoặc reset toàn phase.
6. Trình gói đủ căn cứ theo D6. Tài liệu sản phẩm ở docs, review chỉ tham chiếu. Không tạo schema, map thứ tư hoặc bảng trạng thái sản phẩm có hiệu lực thứ hai.

### M1 — Chất lượng (bước 3)

Mẫu một yêu cầu: **ID | nguồn/mục đích | thao tác và tải | môi trường/thiết bị/mạng | chỉ số/đơn vị/cửa sổ đo | ngưỡng và lý do | cách đo/case lỗi | giới hạn | trạng thái và bằng chứng**. Có thể bỏ cột không áp dụng với lý do; ngưỡng áp dụng còn thiếu chặn việc duyệt yêu cầu đó.

Phải xét: độ trễ và tải/công suất; khả dụng; bảo mật/quyền riêng tư; lưu giữ dữ liệu; mất dữ liệu cho phép và thời gian phục hồi; chi phí; hiệu năng web/native và SEO. Không áp ngưỡng chất lượng công cụ Kidea sang workshop.

- Độ trễ: phân biệt thời gian backend xử lý với người dùng thấy kết quả; số mẫu, phân vị (ví dụ p95 là 95% mẫu không vượt ngưỡng), thời gian chạy và tỷ lệ lỗi đi cùng nhau. Không đo riêng lượt thành công để che lỗi hoặc dùng trung bình che đuôi chậm.
- Tải: khai báo số người đồng thời, tỷ lệ xem/ghi, kích thước dữ liệu, nhịp gửi và điểm nóng tranh chỗ; không suy 10 tài khoản seed là 10 người dùng tối đa.
- Phục hồi: tách crash tiến trình với mất ổ lưu trữ; kết quả đã xác nhận thành công và nghĩa vụ cập nhật phải được bảo toàn theo R03. Không hứa “không mất gì” cho mọi loại sự cố khi chưa có giải pháp/diễn tập. Backup không tự chứng minh restore được.
- Bảo mật: ai đọc/ghi gì, xác thực server, ranh giới public/private, dữ liệu được log và thời hạn giữ; tuyệt đối không chép secret/PII vào bằng chứng. Không tự thêm chính sách xóa lịch sử pilot.
- Ngưỡng số: AI phải đề xuất giá trị cùng căn cứ ở kết quả bước 3, hoặc ghi rõ thông tin còn thiếu và quyết định bị chặn. Không dùng D2 để bỏ ngưỡng đến vô thời hạn. Mục tiêu có thể được duyệt trước đo; khả năng đạt mục tiêu vẫn CHƯA ĐO cho tới đúng môi trường ở phase thực thi.

Ví dụ được lấy từ R03: tranh một chỗ cuối không được có hai đăng ký ACTIVE; đây là điều kiện đúng/sai, không cần bịa giới hạn mili-giây để viết được. Thời gian phản hồi và thời gian số chỗ hiển thị bắt kịp là hai yêu cầu số riêng cần chốt.

### M2 — Trải nghiệm và SEO (bước 4)

Mẫu hành trình: **người dùng/mục tiêu → màn hình/nền tảng → dữ liệu và nguồn → thao tác → loading/rỗng/thành công/lỗi/thiếu quyền/mất mạng → hướng tiếp tục → rule/AC/test**. Có phác thảo màn hình bằng bố cục đơn giản, không chỉ danh sách tên trang. Xét bàn phím, focus, nhãn lỗi, màn hẹp và trạng thái không chỉ phân biệt bằng màu; tiêu chuẩn cụ thể còn mới phải đưa review.

Ví dụ retry: sau khi gửi đăng ký rồi mất kết nối, hiển thị “Chưa xác nhận kết quả”; giữ danh tính yêu cầu cũ khi kiểm/gửi lại, không khẳng định thất bại hoặc tự tạo yêu cầu mới. Sau khi có kết quả cuối, cập nhật lịch sử và dữ liệu hiện tại theo đúng phiên bản; kết quả cũ không thay trạng thái mới.

Mẫu SEO: **loại trang/audience | mục đích/nội dung và người phụ trách | URL/định danh | tiêu đề/mô tả | liên kết | rendering | canonical/status/redirect | index/bot | case kiểm**. Thiết kế UX ghi yêu cầu, kiến trúc sau gate mới chốt cơ chế.

Giữ phạm vi web: giới thiệu, danh sách/chi tiết, đăng ký của tôi, admin, vận hành; native hai màn hình với bộ lọc của tôi. Phần riêng tư không được nằm trong HTML/cache dùng chung. Lab không index; cấm index không thay xác thực. Xét sitemap/structured data theo nội dung thật, không thêm đánh giá hoặc dữ kiện giả; tách policy search bot và training bot. D3 chỉ miễn kết quả tìm kiếm thật của pilot kín, không miễn các phần kỹ thuật hoặc gate sẵn sàng SEO trước phát hành.

### M3 — Theo dõi và điều khiển vận hành (bước 5)

Mẫu tín hiệu: **nguồn nhu cầu | ý nghĩa/đơn vị | nơi quan sát | độ mới/cửa sổ | ngưỡng | người nhận/hành động | kênh và thời hạn nhận | lỗi thu thập | quyền/dữ liệu nhạy cảm | test**. Chọn tín hiệu có hành động; không bắt tạo dashboard riêng cho từng loại.

Ví dụ: số event chờ, tuổi event cũ nhất và lần xử lý thành công gần nhất phải phân biệt với lần thu thập thành công gần nhất. Mất đường thu thập → chưa biết/lỗi, giữ số cũ kèm thời điểm, không biến thành 0 hoặc xanh. Phát hiện dashboard hỏng không chỉ dựa vào chính dashboard đó.

Hồ sơ phải nêu người chịu trách nhiệm, giờ trực/giới hạn lab và đường cảnh báo còn hoạt động khi đóng phiên AI; chưa xác nhận người/kênh thì ghi thiếu, không nhận sẵn sàng vận hành. Không tự gán Human trực 24/7 hoặc tạo dịch vụ theo dõi. Mọi điều khiển truy nguồn nghiệp vụ/quyền; pilot hiện không có nút replay/xóa event hoặc dừng tiến trình. Nếu cần thêm phải quay review nghiệp vụ, không lén thêm vào UI vận hành.

### M4 — Admin (bước 6)

Mẫu thao tác: **actor/quyền và phạm vi dữ liệu | rule/flow nguồn | dữ liệu nhập | xác nhận nếu cần và lý do | kết quả/trạng thái | lỗi/retry/concurrency | audit | case kiểm**.

Ví dụ sửa sức chứa: đọc trạng thái hiện tại, ghi theo quyền server và ràng buộc không dưới số ACTIVE; số chỗ cũ trên màn hình không cấp quyền ghi. Thiếu quyền hoặc xung đột hiển thị theo rule, không tự ưu tiên admin. Audit chỉ thông tin cần truy ai/làm gì/khi nào/kết quả; chi tiết lưu trữ/retention phải được chốt, không mặc định log toàn payload. Không bắt hộp xác nhận mọi lần sửa chữ; thao tác nhạy cảm cần giải thích tác động trước xác nhận.

### M5 — Kiến trúc và hợp đồng (bước 7)

Chỉ mở sau gate đầu vào. Mẫu: **yêu cầu nguồn | thành phần/trách nhiệm | chủ dữ liệu | hợp đồng input/output/lỗi | dependency đồng bộ/bất đồng bộ | quyền | consistency/retry | rendering/cache | triển khai/tương thích | phục hồi | test và quyết định chưa rõ**.

Ưu tiên xem xét ứng dụng chia module rõ; chỉ thêm service/broker nếu yêu cầu chứng minh cần. Đây là phương pháp lựa chọn, không chốt DB/framework/transport tại gói này. Giữ C++/Ubuntu sở hữu rule; SvelteKit/TypeScript, Kotlin/Compose, Swift/SwiftUI là các nền tảng đã chọn. Đề xuất công nghệ cụ thể sau này phải đối chiếu tài liệu chính thức hiện hành, ràng buộc và quyền.

Hợp đồng phải làm rõ kiểu/miền/đơn vị/null, định danh, xác thực/ủy quyền, các lỗi, version và tương thích client cũ–mới. Chuỗi bắt buộc: nhận đăng ký → lưu kết quả và nghĩa vụ cập nhật → xử lý event → số chỗ dẫn xuất → SSR/realtime/native/monitoring. Xét crash giữa các chặng, dupe/đảo thứ tự/gap/same-version-conflict, cache riêng tư, truy vấn lại và reconciliation; không nhận cache làm dữ liệu quyết định đăng ký.

Mỗi thành phần ghi nền chạy, đóng gói/start/stop/health/config/secret, dữ liệu bền vững, backup/restore, giới hạn scaling/chi phí và ai được thao tác. Tách rollback app với restore dữ liệu; có thứ tự và điều kiện dừng khi nâng cấp không tương thích. Quy ước Git/test/rule code hiệu lực và môi trường đích được tham chiếu; R05 hoàn thiện profile/toolchain, không dùng R04 để bỏ gate hoặc cài sớm. Không thêm A/B cho pilot; phương pháp phải nhận diện nhu cầu A/B ở project khác và đòi giả thuyết/nhóm/chỉ số/quyền khi có.

## 3. Quyền hữu hạn đề xuất — chưa thực thi

### P1 — Hồ sơ pilot

Root duy nhất: `D:/Code/kynderis/kidea-workshop-pilot`. Tạo đúng năm file:

- `docs/design/quality.md` — M1 và case tương ứng.
- `docs/design/experience.md` — M2 gồm UX, phác thảo và SEO.
- `docs/design/operations.md` — M3.
- `docs/design/admin.md` — M4.
- `docs/design/architecture.md` — M5, chỉ sau gate đầu vào.

Cho sửa **chỉ mục/link/backlink**, không sửa rule/AC/test nghiệp vụ đã duyệt, trong đúng mười file R03: `docs/features.md`, `docs/business/INDEX.md`, `docs/business/shared/registration.md`, `docs/business/shared/workshop.md`, `docs/business/shared/availability.md`, `docs/business/features/view.md`, `docs/business/features/register-cancel.md`, `docs/business/features/admin.md`, `docs/business/features/updates.md`, `docs/business/tests.md`. Case thiết kế mới đặt tại năm file mới, không chép rule thành nguồn thứ hai. Không thêm Git/remote/.kidea/source cho pilot.

Trước ghi: kiểm root thực không trỏ ngoài phạm vi, không reparse/symlink bất ngờ, danh sách file và bản nguồn; giữ snapshot byte/hash của 10 file. File mới đã tồn tại hoặc nội dung đổi ngoài lượt thì đối chiếu, không ghi đè mù. Giữ pre/post và diff trong evidence repo; không tự restore sau gián đoạn. Không xóa hồ sơ/snapshot R03.

### P2 — Repo xây Kidea

Cho cập nhật các nguồn `KIDEA_DESIGN.md`, `KIDEA_ROADMAP.md`, `KIDEA_ACCEPTANCE.md` chỉ để tích hợp phương pháp/traceability đã duyệt; `answer.md` và gói này để giữ trạng thái/lịch sử. Không đổi tiêu chí nghiệm thu tổng hoặc schema/runtime.

Cho sửa `.agents/skills/kidea/SKILL.md` để dẫn hướng và tạo `.agents/skills/kidea/references/product-design.md` chứa M0–M5 sau review. Dùng skill-creator khi thực sự sửa skill. Không quảng cáo thêm action public hoặc biến soạn tài liệu theo quyền riêng thành runtime đã hỗ trợ product writing.

Cho tạo bộ kiểm tại `tests/r04/design-docs.test.mjs`, harness `tests/r04/evidence.mjs`, prompt `tests/r04/prompt-review.md`; evidence dưới `tests/evidence/r04/design-r1/` và báo cáo `tests/evidence/r04/design-r1.md`; output tạm duy nhất `.test-output/r04/` với từng run riêng. Chỉ dùng Node/Python/dependency hiện có; không tải/cài thêm. Git commit/push riêng repo Kidea tiếp tục theo quyền hiện hành, không đẩy dữ liệu bí mật.

### P3 — Phiên kiểm độc lập

Một subagent mới chỉ đọc, tối đa 15 phút tính từ lúc dispatch, không tự sinh subagent hoặc mở lại sau deadline. Controller soạn và sửa tuần tự; reviewer không ghi pilot. Có thể gửi lại cùng agent khi còn thời gian, không dùng agent khác hoặc ngân sách R03. Chỉ chạy khi năm hồ sơ đã đủ đầu vào/gate, hướng dẫn đã tích hợp và kiểm tự động qua.

Đầu vào reviewer: yêu cầu bài toán, nguồn R03 đúng bản, M0–M5/hướng dẫn và năm hồ sơ thiết kế, rubric mục 4. Không gửi kết luận tự chấm/đáp án mong muốn. Reviewer tự truy rule, tìm thiếu/mâu thuẫn; không chỉ xác nhận checklist của tác giả. Prompt và scope được giữ nguyên trong evidence.

## 4. Kiểm chứng và điều kiện kết luận

### Rubric độc lập — 8 tiêu chí

| ID | PASS khi có bằng chứng | Tình huống phải xét |
|---|---|---|
| V1 | Chất lượng có tải/môi trường/chỉ số/ngưỡng/cách đo và trạng thái thật; không bỏ yêu cầu bắt buộc | Mục tiêu chưa đo; lượt lỗi; crash so với mất ổ |
| V2 | UX đủ hành trình/nền tảng/trạng thái, thao tác truy đúng rule | Không JS, mất mạng sau gửi, lịch sử và số chỗ khác phiên bản |
| V3 | SEO giữ public/private, nội dung/URL/metadata và N/A đúng phạm vi | HTML/cache riêng tư, lab cấm index, không giả ranking |
| V4 | Monitoring biết dữ liệu cũ/mất tín hiệu; có ngưỡng/action/owner và đường cảnh báo | Dashboard/collector hỏng, phiên AI đóng, backlog hồi phục |
| V5 | Admin không thêm nghiệp vụ; quyền/xác nhận/audit/lỗi đúng | Sửa sức chứa cạnh tranh đăng ký, no-op, role giả từ client |
| V6 | Hợp đồng/owner đầy đủ qua chuỗi và nền tảng; vận hành/tương thích/khôi phục rõ | Retry/dupe/gap, crash, client cũ, rollback khác restore |
| V7 | Rule → thiết kế → case và truy ngược đủ nghĩa; đổi nguồn được rà lại | Link tồn tại nhưng thiếu nhánh/consumer hoặc sai rule |
| V8 | Quyền/gate/bằng chứng đúng bản; phương pháp tái dùng được, không giả runtime | Đầu ra chưa duyệt, công cụ chưa có, scope mới, hết giờ |

Mỗi tiêu chí ghi PASS/PARTIAL/FAIL, bằng chứng file/section, finding và ảnh hưởng. PARTIAL = còn thiếu bằng chứng/phạm vi kiểm; FAIL = phát hiện sai. Không lấy tổng điểm bù lỗi quyền hoặc mâu thuẫn. Hết giờ/thiếu đầu vào báo phần chưa kiểm, không tự gia hạn. Chỉ nhận kết quả kiểm lại trên đúng bản; sửa sau review mà chưa review lại phải ghi rõ chưa kiểm bản mới.

Kiểm tự động: đường dẫn/anchor duy nhất và tồn tại, reference hai chiều theo section, allowlist và hash các file không được sửa, vẫn giữ 10 hồ sơ R03; test âm bắt link sai, backlink sai rule và thiếu reference. Root reviewer còn phải rà quan hệ **chưa được viết**, vì checker không thể phát hiện mọi cạnh thiếu. Chạy lại tám test R03; validator skill và 265 test lõi theo lệnh hiện có sau tích hợp; giữ run/error/skip thực tế, không hạ assertion để đạt. Không nhận các kiểm này là test ứng dụng hoặc bằng chứng tải/phục hồi thật.

Evidence giữ input hash/bytes, diff, prompt, dispatch/deadline/observed completion, raw review và mọi followup, kết quả kiểm tự động/phiên bản công cụ, bản sửa và finding closure. Không ghi đè run cũ. Nếu cần sửa ngoài D4, đổi nghiệp vụ/tiêu chí hoặc thêm phiên, gom phần phát sinh xin duyệt rồi mới làm. Hết quota không chặn sửa thường lệ trong quyền, nhưng kết quả sau sửa phải nói rõ còn thiếu kiểm độc lập nếu có.

## 5. Trình tự sau khi duyệt gói

1. Soạn mục tiêu chất lượng cụ thể (bước 3), gồm đề xuất ngưỡng có căn cứ hoặc thông tin thật sự còn thiếu; trình kết quả. Không xin lại quyền file.
2. Sau gate bước 3, hoàn thiện trải nghiệm và SEO (bước 4); trình cùng một lượt cho hai phạm vi xác nhận. N/A tìm kiếm thật theo D3 không thay gate thiết kế SEO.
3. Sau gate bước 4, hoàn thiện monitoring (bước 5), duyệt rồi admin (bước 6). Nếu các đầu ra độc lập đã đủ căn cứ, có thể trình chung và ghi riêng approval; không suy bước 6 đã dùng được nguồn bước 5 còn chưa duyệt.
4. Sau các gate trên, hoàn thiện kiến trúc (bước 7), trình kết quả với tất cả lựa chọn công nghệ/quyền còn mới được nhận diện. Không cài/chạy theo bản thiết kế.
5. Sau gate bước 7, tích hợp hướng dẫn, chạy kiểm chứng và phiên độc lập đã cấp; sửa trong phạm vi, báo kết quả/giới hạn để Human khép R04. Finding đổi đầu vào đã duyệt phải quay đúng gate; không tự sửa nội dung đã chốt rồi xin chấp nhận chung ở cuối.

Các lượt trên là **duyệt kết quả cụ thể**, không xin thêm từng thao tác. Không thể hứa chỉ còn một lượt duyệt cho cả phase mà vẫn giữ nguyên quy trình hiện hành. D1–D6 không thay năm gate sản phẩm. Giới hạn 0 đồng phát sinh, lab giả, không VM/cài đặt/code/deploy/dữ liệu thật giữ nguyên.
