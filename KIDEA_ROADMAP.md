# Kidea — Lộ trình xây dựng, vòng R2

Ngày cập nhật: 2026-09-08.

Lộ trình được chia lại theo yêu cầu Human ngày 2026-09-08: bắt đầu vòng rà soát mới từ đầu, mỗi lần đọc/duyệt chỉ vài đầu mục. **Chưa xây/cài skill hoặc code pilot.** R01 chuẩn bị lại căn cứ; kế hoạch triển khai R02–R10 chỉ được mở sau gate R01. Đây là lộ trình xây chính Kidea, không thay mười bước Kidea hướng dẫn trong sản phẩm.

<a id="current"></a>

## 1. Chỉ cần đọc phần này ở lượt hiện tại

Việc hiện hành: [R01-T02-S01 — Ranh giới hồ sơ](#review-current). Chỉ duyệt hai quyết định bên dưới; không cần đọc toàn file. [Sổ công việc](#work-state) giữ trạng thái duy nhất.

<a id="review-current"></a>

### R01-T02-S01-r1 — Tài liệu sản phẩm và hồ sơ điều phối

**Mục đích:** phân biệt “sản phẩm phải làm gì/được xây thế nào” với “công việc đang ở đâu”. Một project vẫn dùng một repo chứa cả tài liệu, .kidea, code và test; không tách repo quản lý riêng.

| Quyết định | Đề xuất | Ý nghĩa thực tế |
|---|---|---|
| D1. Tài liệu sản phẩm nằm đâu? | Ngoài `.kidea`, mặc định trong `docs/`: Feature, nghiệp vụ/AC, yêu cầu chất lượng, UX, kiến trúc, coding rules, mapping, đặc tả test, runbook và bằng chứng sản phẩm. | Tài liệu vẫn dùng được khi không dùng Kidea. Code/test chạy được và cấu hình ở vị trí chuẩn của công nghệ, không ép vào docs. |
| D2. Hồ sơ điều phối nằm đâu? | Trong `.kidea`: tiến trình bước/phase/task/subtask, kế hoạch công việc, checkpoint, blocker/điểm quay lại và gói review/xác nhận Human. | Kidea biết đang làm gì và chờ gì. Ví dụ rule “không vượt sức chứa” thuộc tài liệu sản phẩm; task thực hiện rule và bản ghi duyệt nó thuộc .kidea. |

**Đọc nguồn khi cần:** [ranh giới lưu trữ](KIDEA_DESIGN.md#project-storage-boundary). Đây là xác nhận lại hướng PROJECT-FILES-r1 của vòng trước, không đề xuất thêm cây thư mục phức tạp.

**Không duyệt kèm:** tên/schema từng file, cách bảo đảm nguồn duy nhất và đọc/ghi xuyên vùng (S02), chọn repo pilot, di chuyển file hiện có hoặc quyền Git/cài/deploy. Không tạo cả cây rỗng; project có bố cục hợp lý không bị ép đổi thư mục.

Đã đối chiếu thiết kế và các điểm nối init/resume/view; chưa sửa quy tắc hoặc chạy skill. Gói chờ Human duyệt D1–D2 trước khi đóng S01.

<a id="working-rules"></a>

## 2. Cách làm mới

### 2.1. Phase → task → subtask

- **Phase:** một nhóm năng lực có thể kiểm chứng tích hợp; cuối phase có Human gate.
- **Task:** một đầu ra cụ thể. **Subtask:** một lát cắt đủ nhỏ để làm, kiểm tra và nếu cần thì duyệt độc lập.
- Gói review tối đa **3 quyết định thực sự độc lập**, thường 2; một quyết định thì chỉ hỏi một. Không giấu sáu lựa chọn trong một dòng “duyệt cả gói”. Mỗi quyết định có đề xuất, hệ quả và link đúng đoạn.
- Phần bắt buộc Human đọc khoảng 200–350 từ tiếng Việt, tối đa 3 đầu mục quyết định và 3 mục nguồn ngắn. Nếu chưa đủ để hiểu mà phải mở nhiều đoạn dài, chia tiếp trước khi trình; không dùng giới hạn chữ để lược mất rủi ro quan trọng. Nội dung chuyên sâu là phần mở thêm, không là quyết định ngầm.
- AI vẫn đọc đủ nguồn/phụ thuộc, kiểm tra ngữ nghĩa và ảnh hưởng xuyên chuỗi. Bản tóm tắt cho Human không thay đầu vào phân tích của AI.
- Phân rã chi tiết **phase gần nhất**; các phase xa có task/đầu ra/kiểm chứng, subtask ghi **chưa phân rã**, không phải đã hoàn tất. Trước khi mở task ở đó, ghi các subtask, test và gate tại đúng hàng nguồn; không dùng task lớn làm giấy phép thực hiện một lượt.
- Chỉ một subtask triển khai hiện hành. Review độc lập có thể hỗ trợ nhưng không tạo nhiều luồng sửa ngoài kiểm soát. Không cố định số task như cam kết thời gian hoặc phần trăm hoàn thành.

### 2.2. Bắt đầu, review và đóng đơn vị

1. Trước khi bắt đầu: nói ngắn mục đích, đầu ra, cần xác nhận trước hay không; kiểm tra dependency, phiên bản, quyền và file dự kiến tác động.
2. **[H]** là gói dừng chờ Human; **[A]** là thực hiện/kiểm tra trong thiết kế và quyền đã có. Mỗi gói chỉ định ID/r1/r2, nguồn, đề xuất, kết quả/giới hạn và điều chưa duyệt. Góp ý, im lặng hoặc PASS không là approval.
3. Chỉ ghi DONE khi đạt đầu ra/test bắt buộc, đã đồng bộ tài liệu/map/bằng chứng liên quan và dọn tạm. Subtask [H] còn phải có xác nhận Human cho đúng gói hiện hành trước DONE hoặc mở việc phụ thuộc. Task không cần một approval thừa nếu các gate con đã đủ; chỉnh format hoặc test theo đặc tả không tự tạo gate mới.
4. Cuối phase: review tối đa 2 quyết định — chấp nhận kết quả tích hợp/giới hạn và cho mở phase kế theo phạm vi nêu rõ. Không yêu cầu đọc lại từng đoạn đã duyệt; có thay đổi làm sai căn cứ thì chỉ rõ gói bị ảnh hưởng và duyệt lại phần đó.
5. Phát hiện quyết định lớn chưa chốt thì dừng phần phụ thuộc, thêm subtask tại nơi sở hữu và xin Human quyết định trước khi làm. Không hạ chuẩn hoặc đổi scope để làm xanh.

### 2.3. Một nguồn trạng thái và bằng chứng

- Chỉ [sổ công việc](#work-state) giữ trạng thái các subtask đã mở. Subtask đã định nghĩa nhưng chưa có dòng trong sổ mặc định TODO; task chưa phân rã luôn còn việc, không được suy là DONE.
- Trạng thái subtask: TODO → IN_PROGRESS → DONE. Gate có DRAFT/IN_REVIEW/APPROVED và bằng chứng xác nhận riêng trong cùng dòng/đích được dẫn. Có blocker ghi cạnh công việc hiện hành, không đổi thành PASS.
- Trạng thái cha được tính từ con: task chỉ DONE khi mọi con bắt buộc DONE; phase chỉ APPROVED sau kiểm tra tích hợp và xác nhận Human. Không nhập bản sao trạng thái ở từng đoạn mô tả.
- Giữ ID, tên, cha-con và link kết quả của việc đã hoàn thành. Phần “hiện tại” chỉ là con trỏ; review hiện tại là bản trình bày, không là thiết kế hoặc tracker thứ hai.
- Evidence đủ để tái kiểm tra: ID/biến thể, đầu vào thực, bản nguồn/cấu hình/môi trường, quy trình, expected–actual, kết quả và giới hạn. Không xóa log lỗi để giữ riêng lần đạt; không đưa secret/dữ liệu riêng vào repo public.
- Đây là quy ước theo dõi **repo xây Kidea**; schema/runtime và cách Kidea ghi hồ sơ sản phẩm vẫn phải được chốt ở R02.

<a id="cleanup"></a>

### 2.4. Dọn file tạm tại mỗi điểm kết thúc

- Khi tạo scratch/cache/bản nháp dùng một lần, ghi **đường dẫn cụ thể + đơn vị sở hữu + mục đích + lúc được xóa** trong bản ghi công việc. Không tạo cả thư mục rỗng để quản lý việc này.
- Trước đóng subtask/task/phase: chuyển kết luận hoặc bằng chứng cần giữ vào nguồn chính thức, kiểm tra không còn link/phụ thuộc hay nhu cầu khôi phục, rồi xóa đúng danh sách file tạm của đơn vị. Dọn cả thư mục chỉ khi đã xác minh đường dẫn và toàn bộ nội dung thuộc danh sách đó.
- Không xóa tài liệu nguồn, test/fixture dùng lại, checkpoint MVP, log lỗi/evidence cần nghiệm thu, bản release/backup còn cần hoặc nội dung do Human tạo chỉ vì đã cũ. Chưa rõ sở hữu/giá trị thì giữ và hỏi, không quét xóa theo tên folder.
- Không tạo bản archive trùng toàn tài liệu sau mỗi review; Git giữ lịch sử, còn bản hiện hành giữ nguồn chuẩn và link bằng chứng cần thiết. Quyền Git không thay đổi vì quy tắc dọn tạm.
- Lần tái lập này đã kiểm tra 15 file tracked và working tree ban đầu sạch: **không có file tạm xác định được để xóa**. `exa-results/`, `references/`, `ideas/` là nguồn/bằng chứng, không phải rác mặc định. `answer.md` tiếp tục latest-only theo yêu cầu riêng của repo.

<a id="work-state"></a>

## 3. Sổ công việc hiện hành

Vòng R2 bắt đầu lại; không chuyển 4 DONE và 1 IN_PROGRESS của vòng cũ sang đây. Các lựa chọn cũ vẫn là căn cứ có lịch sử; chỉ kiểm tra/xác nhận lại đúng phạm vi khi đến lượt, không làm lại nghiên cứu hoặc test không cần thiết.

| Subtask | Trạng thái | Gói/gate | Kết quả, bằng chứng hoặc blocker |
|---|---|---|---|
| R01-T01-S01 | DONE | R01-T01-S01-r1 — APPROVED | Human: “Mình duyệt nhé”; chỉ D1–D2 ở commit 5aa4e5b; [bằng chứng](#r01-t01-result) |
| R01-T01-S02 | DONE | [A] — không có quyết định mới | Đối chiếu DESIGN, danh mục KA và bảng bao phủ; không đổi scope hoặc ngưỡng; [kết quả](#r01-t01-result) |
| R01-T01-S03 | DONE | [A] — không có quyết định mới | Đồng bộ căn cứ approval, kiểm tra tài liệu và dọn tạm; [kết quả](#r01-t01-result) |
| R01-T02-S01 | IN_PROGRESS | R01-T02-S01-r1 — IN_REVIEW | [Hai quyết định ranh giới](#review-current); Human cho bắt đầu bằng “Ok bạn làm đi”, chưa duyệt đầu ra |

Các subtask R01 khác mặc định TODO. R02–R10 chưa mở và chưa phân rã subtask; không có code/runtime/pilot mới. Tái lập roadmap là thao tác điều phối theo yêu cầu, không được cộng thành nghiệm thu năng lực Kidea.

<a id="r01-t01-result"></a>

### Kết quả R01-T01 — ngày 2026-09-08

- S01: Human phản hồi “Mình duyệt nhé” ngay sau gói D1–D2 tại [commit 5aa4e5b](https://github.com/Kynderis/kidea/blob/5aa4e5b5a69b9305821e43bb5d4b3151ee2a271d/KIDEA_ROADMAP.md#review-current). Chỉ xác nhận đích bản đầu đầy đủ và ranh giới đã trình; không duyệt công nghệ, pilot, Git G1–G6, QUALITY, runtime/schema hoặc cấp quyền thao tác.
- S02: đối chiếu DESIGN mục 1.1, bảng bao phủ roadmap và danh mục KA: sáu hành động → R02/R06/R07; mười bước → R03–R05/R08/R09; ba bản đồ/change → R06/R09; rules/view/cài/giới hạn → R05/R07/R10. Không phát hiện nghĩa vụ bị cắt; chưa cần sửa case/ngưỡng hoặc nghiên cứu lại nền tảng vì D1–D2 giữ hướng đang có.
- S03: DESIGN dẫn về đúng bằng chứng approval, sổ công việc đóng đủ ba subtask. Kiểm tra link/anchor liên quan và diff; không có file tạm tạo ra hoặc untracked cần xóa. Đây là kiểm chứng tài liệu, không phải test Kidea hoặc đóng phase R01.
- Tại thời điểm đóng R01-T01, việc tiếp theo là R01-T02-S01; trạng thái hiện hành xem sổ công việc, không giữ bản sao trong kết quả lịch sử này.

<a id="phase-overview"></a>

## 4. Tổng quan 10 phase mới

| Phase | Kết quả cần đạt | Điều kiện mở |
|---|---|---|
| [R01](#r01) | Xác nhận lại căn cứ, tách Git và tiêu chí thành gói nhỏ | Yêu cầu tái lập ngày 2026-09-08 |
| [R02](#r02) | Lõi đọc/ghi/init/status/approve/resume thử sớm | R01 APPROVED và quyền cụ thể |
| [R03](#r03) | Phương pháp nghiệp vụ/AC và hồ sơ pilot bước 1–2 | R02 APPROVED |
| [R04](#r04) | Chất lượng, UX/SEO, monitoring/admin, kiến trúc | R03 APPROVED |
| [R05](#r05) | Profile từng nền tảng và technical test | R04 APPROVED |
| [R06](#r06) | Ba bản đồ, change/no-diff/cycle và resume sâu | R05 APPROVED |
| [R07](#r07) | HTML offline, an toàn, đúng dữ liệu và đo được | R06 APPROVED |
| [R08](#r08) | Hướng dẫn plan/code/release/restore/vận hành | R07 APPROVED |
| [R09](#r09) | Pilot thật theo lát cắt và từng kịch bản lỗi | R08 APPROVED; gate/quyền pilot riêng |
| [R10](#r10) | Cài/nâng cấp/ma trận/hồi quy và bàn giao | R09 APPROVED |

Mặc định task sau cần task trước trong phase. Ngoại lệ hoặc quay về sửa căn cứ phải được ghi trước, không thực hiện dựa trên suy đoán. Test helper/phiên AI được thực hiện ngay tại task sở hữu rồi hồi quy cuối; không dồn mọi bằng chứng đến R09.

<a id="r01"></a>

## R01 — Tái lập căn cứ bằng các gói nhỏ

Bảng dưới là phân rã cụ thể của phase gần nhất. Mã con có dạng `R01-Txx-S01/S02/S03`; mỗi dấu [H] là **một lượt riêng**, không gửi cả hàng cho Human duyệt cùng lúc. Không tự coi khuyến nghị từ audit cũ là quyết định đã duyệt.

| Task / đầu ra | S01 | S02 | S03 |
|---|---|---|---|
| R01-T01 — Đích và ranh giới | [H] Năng lực bắt buộc; ngoài phạm vi | [A] Đối chiếu thiết kế và nghĩa vụ nghiệm thu theo D1/D2 | [A] Đồng bộ nguồn, bằng chứng và dọn tạm |
| R01-T02 — Một repo, hai vùng hồ sơ | [H] Xác nhận nội dung sản phẩm ngoài .kidea; điều phối/review trong .kidea | [H] Nguồn duy nhất và cách đọc/ghi xuyên vùng | [A] Đồng bộ ví dụ/link; không chuyển file project thật |
| R01-T03 — Nền tảng bản đầu | [H] Host Windows và backend Ubuntu | [H] Web/rendering và nhánh SEO đã chọn | [H] Android/iOS native; chính sách kiểm tra thiết bị/toolchain đúng lúc |
| R01-T04 — Pilot và nơi giữ hồ sơ | [H] Bài toán workshop và MVP giới hạn | [H] Chuỗi event/đường lỗi cần chứng minh; thứ tự backend–web rồi native | [H] Nơi giữ tài liệu trước khi ghi; lab/chi phí/quyền (tách tiếp nếu cần lựa chọn môi trường cụ thể) |
| R01-T05 — Git: bản đang làm và bản tích hợp | [H] G1: một branch làm việc; worktree chỉ khi cần | [H] G2: điều kiện tích hợp vào master, khác bản production | [A] Đồng bộ đúng phần được duyệt; chưa áp dụng quyền Git mới |
| R01-T06 — Git: quyền và checkpoint | [H] G3: quyền local; push/merge/tag/deploy riêng | [H] G4: WIP/checkpoint, fail và phục hồi có giới hạn | [A] Đồng bộ hợp đồng và case; không dùng Git để giả undo dữ liệu/tác dụng phụ ngoài repo |
| R01-T07 — Git: version và bản đang chạy | [H] G5: version/tag chung và nhận diện thành phần | [H] G6: artifact/config/schema/deploy record và đường hotfix/restore | [A] Đồng bộ kế hoạch release/test, không tạo tag/deploy |
| R01-T08 — Kịch bản và chuẩn đúng/an toàn | [H] Nhóm điều phối/quyền/ghi/resume: phạm vi case và điều kiện chặn | [H] Nhóm nghiệp vụ/map/change: phạm vi case và giới hạn chứng minh | [H] Nhóm rule/evidence/view/release: phạm vi case và cách dùng mock đúng mức |
| R01-T09 — Bằng chứng và cách chốt số đo | [H] Đầu vào chi phối kết quả; trường bằng chứng và việc ghi output không tự làm cũ kết quả | [H] Chính sách benchmark sớm rồi chốt ngưỡng; fixture đại diện (không duyệt ngầm 2/5/3/10 giây) | [H] Manifest biến thể/lặp AI; watchdog cycle (không duyệt ngầm 3 lần/20 lượt) |
| R01-T10 — Khép căn cứ | [A] Đồng bộ DESIGN/ACCEPTANCE/QUALITY và toàn bộ dependency/gate theo quyết định thực | [A] Rà bao phủ, link, trạng thái và file tạm; chưa chạy skill | [H] Duyệt căn cứ cùng thứ tự/gate R02–R10; cho mở R02 đúng phạm vi, không cấp quyền cài/deploy ngầm |

Ở R01-T03, Human không phải duyệt lại từng số phiên bản trong ma trận dài: trình hướng và rủi ro/thay đổi có hệ quả; số phiên bản được kiểm tra lại khi thực hiện theo chính sách đã chốt. Phát hiện thay đổi lớn thì mở gói riêng.

R01-T08/T09 không gom nhiều thay đổi tiêu chí vào hai dòng hình thức: mỗi lần chỉ chốt tối đa 3 quyết định còn mở. Nếu các nhóm trên phát sinh thêm lựa chọn độc lập, tách thêm ID con trước khi trình.

Phần đóng [A] của một subtask [H] gồm đồng bộ đúng quyết định đã duyệt, kiểm tra và cleanup; không cần thêm task cleanup. Các giá trị QUALITY cũ vẫn chưa có hiệu lực; thời điểm chốt ngưỡng thực thi sẽ theo quyết định R01-T09, trước nghiệm thu phần liên quan.

<a id="r02"></a>

## R02 — Lõi Kidea, kiểm chứng theo từng lát cắt

Chốt hợp đồng nhỏ trước phần code phụ thuộc; thử helper và hành vi phiên AI mới ngay khi lát cắt có thể chạy. Không chờ hoàn thiện mọi schema mới thử lõi.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R02-T01 — Runtime và khung skill | Chọn runtime/dependency, nơi cài thử và quyền; khung một skill, routing và bộ test tối thiểu. | Khả dụng trên Windows được kiểm tra; chưa có quyền thì không cài. |
| R02-T02 — Schema nguồn tối thiểu | INDEX/work/review và link tới tài liệu sản phẩm; ID, cây công việc, target/release, trạng thái chưa phân rã. | Một nguồn mỗi dữ kiện; mẫu hợp lệ/sai và đường dẫn khác mặc định. |
| R02-T03 — Hợp đồng approval | Chuyển trạng thái, reject/N/A, đúng gói/nội dung và hiệu lực khi đầu vào đổi. | PASS không thành approval; tài liệu/comment không tự cấp quyền. |
| R02-T04 — Checkpoint, phiên bản và ghi dở | Quyền ghi, input/output evidence, tương thích skill/schema/profile và phục hồi. | Diễn tập ghi dở, nguồn đổi, đường dẫn ngoài phạm vi, tác dụng phụ chưa rõ. |
| R02-T05 — Đọc, validator và status | Lát cắt chỉ đọc trên fixture hai vùng .kidea + tài liệu sản phẩm. | Dữ liệu thiếu/sai có vị trí; status không sửa nguồn; thử lệnh sai. |
| R02-T06 — Ghi an toàn | Helper ghi đúng danh sách đích theo hợp đồng đã duyệt. | Thử lỗi quyền, gián đoạn và nguồn đổi; nội dung ngoài phạm vi nguyên vẹn. |
| R02-T07 — Init | Ba file tối thiểu hoặc dùng nguồn cũ đã đối chiếu; tách ý Human/gợi ý AI. | Không init đè; dự án cũ bắt đầu bước 1, không tự chứng nhận từ code. |
| R02-T08 — Approve | Hành động ghi đúng xác nhận Human cho gói đủ điều kiện. | Thử đúng/sai ID, reject, nội dung cũ, gate con khác gate cha. |
| R02-T09 — Resume cơ bản | Đọc đủ nguồn, task và chuỗi điểm quay lại; kiểm tra thực tế trước tiếp tục. | Phiên mới không cần kể lại; thiếu docs/công cụ hoặc side effect chưa rõ phải dừng đúng chỗ. |
| R02-T10 — Đo sớm và thử luồng lõi | Manifest biến thể, benchmark đọc/status và phiên AI mới dùng bản cài thử. | Trình ngưỡng đọc/status theo chính sách R01; giữ toàn bộ mẫu, không tự nâng chuẩn để đạt. |
| R02-T11 — Khép lõi | Hồi quy init → status → reject/sửa/approve → ngắt/resume. | Human review tích hợp; change/visualize chưa có phải báo chưa hỗ trợ. |

<a id="r03"></a>

## R03 — Phương pháp nghiệp vụ và hồ sơ pilot

Xây hướng dẫn bước 1–2. Phê duyệt phương pháp không tự duyệt nghiệp vụ của pilot; hồ sơ pilot phải có nơi giữ và quyền trước khi ghi.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R03-T01 — Nguồn tham khảo và nơi giữ pilot | Đối chiếu phương pháp cũ; xác nhận repo/root tài liệu pilot theo quyết định R01. | Giữ/đổi/chưa chốt có lý do; không sửa nguyên bản tham khảo hoặc tạo repo ngoài quyền. |
| R03-T02 — Feature và phần dùng chung | MVP/Future/Idea, cụm đang làm, shared rule/state và điểm quay lại. | Không đặc tả hết Future; không ép dự án cũ theo code; nhận diện nội dung công khai/riêng tư. |
| R03-T03 — Rule, state, flow và dữ liệu | Mẫu nhỏ đủ input/output, đơn vị, biên, lỗi, invariant và link/backlink. | Bảng flow là nguồn; không ALL/NEXT hoặc thêm loại quan hệ đã loại bỏ. |
| R03-T04 — AC và business test | Mẫu AC và cách chọn test theo biên/nhánh/state/dependency/rủi ro. | Expected result truy về căn cứ; flow lỗi đầu tiên không thành công thức cho mọi flow. |
| R03-T05 — Lát cắt nghiệp vụ pilot | Dùng Kidea trong phiên mới làm từng cụm; review nhỏ từng đầu ra bước 1–2. | Không còn điểm mở làm đổi hành vi đang duyệt; không code pilot. |
| R03-T06 — Khép phương pháp | Tích hợp hướng dẫn, sửa mơ hồ có căn cứ và hồi quy lõi. | Human duyệt phương pháp; gate riêng của tài liệu pilot được giữ. |

<a id="r04"></a>

## R04 — Chất lượng, trải nghiệm và kiến trúc sản phẩm

Xây bước 3–7 với từng gate riêng. Tài liệu sản phẩm ở nguồn ngoài .kidea; review chỉ tham chiếu.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R04-T01 — Yêu cầu chất lượng | Tải/độ trễ, bảo mật/riêng tư, chi phí, mất dữ liệu/thời gian phục hồi và SEO. | Từng yêu cầu áp dụng có workload/cách đo; đây khác tiêu chí chất lượng của Kidea. |
| R04-T02 — Trải nghiệm và thiết kế SEO | Luồng/màn hình, loading/rỗng/lỗi/quyền; nội dung/URL/liên kết/metadata. | Giữ Human gate thiết kế SEO trước kiến trúc; N/A cần lý do và xác nhận. |
| R04-T03 — Monitoring và điều khiển | Ý nghĩa/độ mới tín hiệu, ngưỡng/hành động, lỗi thu thập và quyền. | Mất tín hiệu không xanh giả; giám sát/cảnh báo quan trọng có đường phát hiện phù hợp. |
| R04-T04 — Admin | Mỗi thao tác có nguồn nghiệp vụ, quyền, xác nhận, audit và lỗi. | Không định nghĩa nghiệp vụ mới trong UI; phát hiện thiếu thì quay bước 1–2. |
| R04-T05 — Kiến trúc và hợp đồng | Thành phần/owner dữ liệu, API/event, lỗi, rendering/cache, môi trường và recovery. | Không mặc định microservices; giữ C++ sở hữu rule chung và ranh giới SEO/riêng tư. |
| R04-T06 — Khép thiết kế sản phẩm | Diễn tập bước 3–7 trên hồ sơ pilot và hồi quy hướng dẫn. | Giữ đủ năm gate và gate SEO; tài liệu có thiết kế không đồng nghĩa dashboard đã tồn tại. |

<a id="r05"></a>

## R05 — Quy tắc code theo nền tảng và đặc tả test

Mỗi profile là một task riêng. Mẫu build nhỏ chỉ kiểm tra khả thi, không thay pilot; đến phần iOS mới kiểm tra/cài/nâng Mac khi có quyền.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R05-T01 — Hợp đồng profile | Scope/version/rule/cách kiểm tra/ngoại lệ; ưu tiên quy ước project và cách giải quyết xung đột. | Bản nền cố định, hồ sơ hiệu lực ngoài .kidea, config thực thi không bị sao chép. |
| R05-T02 — C++ / Ubuntu | Profile C++20, tài nguyên/concurrency, build/test và cấu hình đích. | Mẫu đúng/sai; toolchain thực; không mặc định -march=native; đo khi có yêu cầu. |
| R05-T03 — Web | Profile SvelteKit/TypeScript, SSR/prerender/realtime, state/tài nguyên và SEO. | Mẫu build/test theo tổ hợp thực; quyền riêng tư và HTML kiểm tra được. |
| R05-T04 — Android | Profile Kotlin/Compose và vòng đời/tài nguyên/thiết bị. | Mẫu build đúng toolchain khi được phép; emulator không chứng minh hiệu năng máy thật. |
| R05-T05 — iOS | Profile Swift/SwiftUI, môi trường Mac và vòng đời/tài nguyên. | Kiểm tra toolchain khi đến đây; thiếu quyền/thiết bị là blocker, không tự bỏ iOS. |
| R05-T06 — Technical test specification | Contract/integration/E2E/tải/lỗi/bảo mật/restore khi áp dụng; map về yêu cầu. | Setup/input/assertion/expected rõ; mock đúng phạm vi; test chờ code ghi đúng là chưa chạy. |
| R05-T07 — Khép rule và test | Hồ sơ pilot, bản rule mang sang môi trường sạch và hồi quy bước 3 → 7 → 8 → 9 → 10. | Human duyệt đúng profile/phạm vi đã chứng minh; không ngoại suy hỗ trợ mọi nền tảng. |

<a id="r06"></a>

## R06 — Ba bản đồ, change và resume nâng cao

Chứng minh cả quan hệ cơ học lẫn đối chiếu ngữ nghĩa; không coi graph hợp lệ là tìm hết mọi ảnh hưởng.

Kiểm chứng chung cho các task đọc/đối chiếu triển khai: đổi tên/di chuyển/xóa symbol, thay cấu hình build, thiếu file sinh hoặc công cụ; nguồn bổ sung cho event/shared data/config phải có căn cứ. Không chỉ thử mẫu thuận rồi nhận adapter đầy đủ.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R06-T01 — Hợp đồng ba bản đồ | Nguồn hồ sơ, triển khai, đối chiếu; bộ đọc ID/link/backlink xuyên vùng, symbol, revision và unknown. | Một nguồn mỗi quan hệ; không map test thứ tư hoặc chép tay mọi caller. |
| R06-T02 — Quan hệ triển khai C++ | Chọn và thử adapter/cách trích xuất đầu tiên trên code mẫu. | So với bộ chuẩn; ghi rõ phạm vi, giới hạn và quan hệ không hỗ trợ. |
| R06-T03 — Quan hệ triển khai web | Thử cách đọc module/API/event/config và mapping của web. | Không lấy adapter C++ làm bằng chứng web; thiếu quan hệ phải lộ rõ. |
| R06-T04 — Quan hệ triển khai Android | Thử cách đọc/mapping phần native Android được hỗ trợ. | Bộ mẫu đúng/sai và phiên bản công cụ; không ngầm nhận bao phủ đầy đủ. |
| R06-T05 — Quan hệ triển khai iOS | Thử cách đọc/mapping phần native iOS được hỗ trợ. | Bộ mẫu đúng/sai và giới hạn; không tự cài công cụ ngoài quyền. |
| R06-T06 — Đối chiếu hai chiều | Spec → code/test/assertion và chiều ngược, gồm event/shared data/config. | Phát hiện/đưa review link đúng nhưng sai nghĩa, snapshot cũ, thiếu assertion. |
| R06-T07 — Change hay bugfix | Feature giữa MVP/sau release, bugfix giữ đặc tả và ý định chưa rõ. | Giữ việc cũ; change quay bước 1, bugfix không hợp thức hóa code bằng đổi rule. |
| R06-T08 — Hàng đợi impact | Input revision, kết luận có căn cứ, điểm quay lại, đóng/mở lại và tìm ngoài mapping. | Không coi quét hết cạnh là đủ; nguồn đổi phải xét lại kết luận phụ thuộc. |
| R06-T09 — No-diff, chu kỳ và requeue | Mẫu B đổi → A không diff → D vẫn bị ảnh hưởng; cycle và input đổi giữa lượt. | Đủ ảnh hưởng, không lặp vô ích/đóng sớm; kiểm tra ngưỡng đã duyệt đúng fixture. |
| R06-T10 — Di chuyển và resume sâu | Migrate ID/link/symbol giữa docs/source/review; resume qua Git, thiếu bản rule và conflict. | Không giữ hai nguồn có hiệu lực; quyền Git theo gói được duyệt, không replay mù. |
| R06-T11 — Khép maps/change | Hồi quy helper và phiên AI mới trên bộ đối chứng cùng hồ sơ pilot. | Map pilot chưa có code vẫn ghi chờ; Human review ngữ nghĩa và giới hạn. |

<a id="r07"></a>

## R07 — Giao diện tiến độ offline

Giao diện chỉ đọc của Kidea, không phải admin/monitoring sản phẩm.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R07-T01 — Layout và ma trận trình duyệt | Tổng quan → chi tiết task/gate/blocker/evidence, MVP/target/release. | Review nhỏ trên mẫu; task chưa phân rã khác 0 việc còn lại. |
| R07-T02 — Nguồn dữ liệu view | Đọc/đối chiếu .kidea và tài liệu sản phẩm liên quan; snapshot có phiên bản. | Nguồn thiếu/sai/đổi giữa đọc phải báo; không nhập trạng thái thứ hai. |
| R07-T03 — Renderer và visualize | HTML tự chứa, đầu ra quản lý riêng, link nguồn và giới hạn khi mang riêng HTML. | Offline không server/CDN; lỗi ghi không phá nguồn hoặc giả view mới. |
| R07-T04 — An toàn, thao tác và tốc độ | Escape dữ liệu/URL, bàn phím, màn hẹp/rộng, tên dài; đo S/M và pilot. | Không approve/edit/Git/deploy/upload; trình ngưỡng view rồi chạy theo chuẩn đã duyệt. |
| R07-T05 — Khép view | So từng trạng thái với nguồn trên ma trận trình duyệt. | Human review dữ liệu/thao tác, không chỉ ảnh đẹp; snapshot không giả sức khỏe live. |

<a id="r08"></a>

## R08 — Kế hoạch, code, phát hành và vận hành

Hoàn thiện hướng dẫn bước 9–10; chưa cấp quyền code/deploy pilot.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R08-T01 — Phân rã kế hoạch sản phẩm | Phase/task/subtask nhỏ, dependency/output/test/gate và gói review 2–3 quyết định. | Duyệt plan khác bắt đầu code; bao phủ backend/web/native/ops/admin/SEO. |
| R08-T02 — Vòng code và bằng chứng | Checkpoint → code/rule/test → map/evidence → review và dọn tạm. | Không DONE khi kiểm tra bắt buộc fail; hồi quy task/phase/release. |
| R08-T03 — Build/CI và môi trường sớm | Build/test tái tạo được, config/version, kiểm tra local khác môi trường đích. | Lab kín không bị mở index; không đợi code xong mới chuẩn bị triển khai. |
| R08-T04 — Release và phục hồi | Theo quyết định Git/version R01; migration/rollback/restore, quyền và điều kiện dừng. | Git không khôi phục tác dụng phụ bên ngoài; gate sẵn sàng SEO trước công khai. |
| R08-T05 — Xác nhận bản đang chạy | Artifact/config/schema thật, smoke, admin/monitor/alert và dữ liệu sau restore. | Build/tag không phải deploy; mất tín hiệu hoặc chưa có dữ liệu SEO không thành PASS. |
| R08-T06 — Khép hướng dẫn | Diễn tập thiếu quyền, deploy lỗi và kết quả tác dụng phụ chưa rõ. | Giữ gate plan/code/deploy riêng; Human review, không thao tác production thật. |

<a id="r09"></a>

## R09 — Pilot thật, từng lát cắt và từng đường lỗi

Dùng Kidea trong phiên mới; gate của lộ trình này không thay gate từng bước/phase của sản phẩm pilot. Mỗi task code dưới đây phải tách theo kế hoạch pilot được duyệt, không phải một lượt xây cả ứng dụng.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R09-T01 — Gói chạy pilot | Đúng repo/source/skill, duyệt lại đầu vào cần thiết, môi trường/quyền/kế hoạch bước 9. | Dữ liệu giả, ngân sách và thiết bị thực; thiếu quyền thì chưa chạy/cài/deploy. |
| R09-T02 — Backend lát cắt đăng ký | Code/test phần backend theo task pilot, rule dùng chung và tranh chỗ cuối. | Build Ubuntu, quyền/atomicity/idempotency có bằng chứng; chưa nhận toàn MVP xong. |
| R09-T03 — Web lát cắt đầu tiên | Intro/list/detail/đăng ký theo task pilot; SSR/prerender và UI tối thiểu. | Test thật, map/assertion; giữ checkpoint MVP còn thiếu admin/event/native cho task kế. |
| R09-T04 — Thêm Feature giữa MVP | Chạy yêu cầu giới hạn 2 đăng ký trên checkpoint còn dở ở task trước. | Quay bước 1, giữ gate và resume đúng; lưu baseline/đích sau thử rõ ràng, không làm lẫn hai trạng thái. |
| R09-T05 — Event, admin và monitoring | Hoàn thiện phạm vi còn lại theo task pilot; bất đồng bộ/số chỗ/realtime/đường điều khiển. | Event lặp/trễ/đảo thứ tự/gián đoạn, đối chiếu dữ liệu và mất tín hiệu; không chỉ call graph. |
| R09-T06 — Android pilot | Từng luồng/màn hình native theo kế hoạch, cùng backend. | Build/test và thiết bị theo ma trận; không dùng emulator thay bằng chứng máy thật bắt buộc. |
| R09-T07 — iOS pilot | Từng luồng/màn hình native theo kế hoạch, cùng backend. | Build/sign/test trên môi trường được phép; thiết bị/phiên bản thực được ghi nhận. |
| R09-T08 — Release lab và restore | Triển khai phi production có quyền, smoke/admin/monitor và diễn tập khôi phục. | Xác nhận đúng bản/config/dữ liệu; gate SEO giữ nguyên, N/A index cần Human duyệt. |
| R09-T09 — Đổi sau release | Cho hủy khi PAUSED; xử lý cả consumer không diff. | Target mới khác bản đang chạy; change/map/test/approval và deploy đúng quyền. |
| R09-T10 — Bugfix giữ nguyên đặc tả | Fixture vượt sức chứa cô lập, sửa đúng rule hiện hành. | Không đổi rule để xanh; hồi quy và phân biệt lỗi pilot/lỗi Kidea. |
| R09-T11 — Reject, approval và quyền | Từng case reject/góp ý/im lặng, approval cũ/sai, thiếu quyền và fail/skip. | Không vượt gate/báo đạt giả; biến thể tài liệu/comment giả chỉ thị theo gate đã chốt. |
| R09-T12 — Ngắt phiên và pending side effect | Gián đoạn nhiều cấp/thiếu công cụ, kết quả thao tác đã hoặc chưa xảy ra. | Phiên mới đối chiếu thực tế trước tiếp tục; không tác giả sửa hộ trạng thái để PASS. |
| R09-T13 — Git và chuyển môi trường | Chuyển đủ .kidea + tài liệu sản phẩm + code/test/config; thử thiếu/conflict/sai repo. | Hồ sơ/rule/phiên bản còn truy được; chỉ thao tác Git đúng quyền đã duyệt. |
| R09-T14 — Khép pilot và sửa lỗi Kidea | Tổng hợp toàn bộ bằng chứng, lỗi, impact và hồi quy. | Mỗi sửa lỗi tách subtask có phạm vi; Human quyết định quay phase nào, không mở refactor vô hạn. |

<a id="r10"></a>

## R10 — Đóng gói, tương thích và nghiệm thu

Chỉ công bố mức hỗ trợ đã chứng minh; không lấy pilot xanh làm kết quả của toàn ma trận.

Subtask: **chưa phân rã**. Trước mở từng task, ghi lát cắt/đầu ra/test và các gói [H] ≤3 quyết định; không dùng một hàng để làm hoặc duyệt cả cụm.

| Task | Đầu ra hữu hạn | Kiểm chứng bắt buộc |
|---|---|---|
| R10-T01 — Version và tương thích | Ma trận skill/schema/profile được hỗ trợ, cách nâng cấp và phục hồi. | Schema quá mới phải dừng; đổi hợp đồng nền mở lại nơi sở hữu. |
| R10-T02 — Gói cài và gỡ | Cài sạch/nhận skill/sáu hành động, không đè bản khác; gỡ đúng phạm vi. | Host thực được kiểm tra; gỡ skill không xóa hồ sơ/source sản phẩm. |
| R10-T03 — Nâng cấp và rollback lỗi | Từng đường nâng cấp được hỗ trợ, lỗi giữa chừng và khôi phục. | Bảo toàn nguồn/bằng chứng, chạy kiểm tra sau phục hồi. |
| R10-T04 — Ma trận môi trường cuối | Chia subtask từng host/đích được cam kết, gồm Git/resume và docs khác vị trí mặc định. | Máy thật/mô phỏng tách rõ; thiếu một mục bắt buộc vẫn là khoảng trống. |
| R10-T05 — Hướng dẫn tiếng Việt | Bắt đầu/gate/resume/change/view, xử lý lỗi, backup/giới hạn và SEO. | Ví dụ/link thực; SKILL.md gọn, không cần nhớ hội thoại. |
| R10-T06 — Bản ứng viên và review độc lập | Chạy nghiệm thu đúng bản cố định: helper, AI, map/change/view/install và tích hợp. | Rà secrets/quyền/link; mọi case áp dụng có kết quả còn hiệu lực, không chọn lần chạy đẹp. |
| R10-T07 — Bàn giao | Version, phạm vi chứng minh, kết quả/giới hạn và hướng dùng. | Human nghiệm thu; publication/cài thật vẫn cần quyền riêng, không tự mở phạm vi mới. |

<a id="coverage"></a>

## 5. Đối chiếu bao phủ, không phải tracker thứ hai

Toàn bộ 77 task của lộ trình cũ được giữ nghĩa vụ trong bảng dưới; [bản cũ cố định tại ec462eb](https://github.com/Kynderis/kidea/blob/ec462eb/KIDEA_ROADMAP.md) giữ mô tả/approval chi tiết. Mã Pxx là lịch sử, mã Rxx là công việc hiện hành; không dùng bảng này để chuyển trạng thái cũ sang mới.

| Nhóm cũ / số task | Nơi xây mới | Nơi kiểm chứng trọng yếu |
|---|---|---|
| P01-T01–T06 / 6 | R01-T01–T10 | Gate căn cứ R01; ngưỡng chỉ chốt theo chính sách được duyệt, không kế thừa QUALITY cũ |
| P02-T01/T02; P03-T01/T02/T05 / 5 | R02-T01/T02/T05 | Validator/status, cài thử và benchmark sớm R02-T10/T11 |
| P02-T03–T06; P03-T03/T04/T06–T08 / 9 | R02-T03/T04/T06–T09 | Ghi/approval/resume trong phiên mới R02-T11; R09-T11–T13, R10 |
| P04-T01–T06 / 6 | R03 | Hồ sơ/phiên mới R03-T05/T06 và pilot R09 |
| P05-T01–T06 / 6 | R04 | Giữ từng gate bước 3–7 và SEO; thực thi R09 |
| P06-T01–T06 / 6 | R05 | Mẫu đúng/sai từng nền tảng, rule portability; test thật R09/R10 |
| P07-T01–T07 / 7 | R06-T01–T06/T11 | Map thiếu/cũ/sai nghĩa, event/data/config; tích hợp R09 |
| P08-T01–T07 / 7 | R06-T07–T11 | No-diff/cycle/requeue, migration và R09-T04/T09–T13 |
| P09-T01–T06 / 6 | R07 | View/source, offline/an toàn/thao tác/browser/tốc độ; R10 hồi quy |
| P10-T01–T06 / 6 | R08 | Plan trước code, quyền, build/CI sớm, release/restore/SEO; R09 |
| P11-T01–T07 / 7 | R09-T01–T14 | Pilot thật, đủ nền tảng và từng lỗi/change; gate sản phẩm riêng |
| P12-T01–T06 / 6 | R10 | Cài/gỡ/nâng cấp/ma trận/RC/review độc lập/bàn giao |

| Nghĩa vụ nguồn | Nơi sở hữu | Nơi xác nhận cuối |
|---|---|---|
| Sáu hành động, state/gate/quyền, KA-01–09; KQ-01 | R02, change R06, visualize R07 | R09/R10, không cộng PASS rời thay KA-04 đầu-cuối |
| Ghi/resume/Git/pending side effect, KA-10–13; KQ-02/03 | R02/R06 | R09-T12/T13, R10-T03/T04 |
| Shared/AC/test, KA-14 | R03 | Hồ sơ được duyệt và pilot thật R09 |
| Ba bản đồ/unknown/no-diff/cycle/di chuyển, KA-15/16/20–22; KQ-04/09 | R06 | R09, cả đường event và consumer không diff |
| Feature giữa MVP/sau release/bugfix, KA-17–19 | R06 | R09-T04/T09/T10; checkpoint và release thực giữ lại |
| Rule/test/evidence, KA-23/24; KQ-05/08/10 | R01/R02/R05/R06/R08 | Phiên mới ngay tại nơi sở hữu và RC R10 |
| View, KA-25/26; KQ-06/07 | R07; đo status ở R02 | R10 trên trình duyệt/phạm vi đã duyệt |
| SEO/ops/release, KA-27/28 | R03–R05/R08 | R09/R10, giữ hai gate SEO và giới hạn index |
| Cài/ma trận/nghiệm thu, KA-29/30 | R02 thử sớm, R10 hoàn thiện | R10 trên bản ứng viên cố định |

Mười bước sản phẩm không bị gộp bởi cách chia phase xây skill: bước 1–2 ở R03, 3–7 ở R04 (rule hiệu lực nối R05), 8 ở R05, 9–10 ở R08; R09 dùng thật và đi đủ gate. Danh mục [KA](KIDEA_ACCEPTANCE.md) và đề xuất [KQ](KIDEA_QUALITY.md) là nguồn tiêu chí; bảng này chỉ điều hướng.

<a id="overall-review"></a>

### Những vấn đề cũ được đưa về đúng gói nhỏ

| Vấn đề | Nơi xử lý mới | Giới hạn tại lượt tái lập |
|---|---|---|
| RV-01 — Git G1–G6 | R01-T05/T06/T07 | Chưa duyệt, chưa mở quyền |
| RV-02 — Nơi giữ hồ sơ pilot trước khi code | R01-T04-S03, kiểm tra lại R03-T01 | Chỉ lên kế hoạch chốt sớm; chưa tạo repo/chọn root thay Human |
| RV-03 — Evidence không tự làm cũ chính mình | R01-T09-S01 → R02-T04 | Chưa chọn fingerprint/schema |
| RV-04 — Ngưỡng và chi phí thử thiếu căn cứ | R01-T09-S02/S03 → R02-T10/R06-T09/R07-T04 | Các số cũ vẫn chưa duyệt; không tự hạ ngưỡng |
| RV-05 — Pilot nhỏ nghiệp vụ nhưng rộng nền tảng | R05 từng profile; R09 từng lát cắt/nền tảng | Thay cách phân rã, không bỏ mobile hoặc chứng minh bằng mô phỏng thay thực |
| RV-06 — Mock đúng phạm vi; tài liệu tự nhận approval | R01-T08 → R02/R05/R09 | Chuẩn mô phỏng vẫn theo DESIGN; biến thể bổ sung cần review cùng nhóm |
| RV-07 — Câu Ubuntu và câu SEO dán nhầm tầng | Đồng bộ câu chữ trong DESIGN theo nguồn đã duyệt | Không đổi ma trận hoặc bỏ yêu cầu SEO |

<a id="previous-round"></a>
<a id="p01-t01-review"></a>
<a id="p01-t02-review"></a>
<a id="p01-t03-review"></a>
<a id="p01-t04-result"></a>
<a id="p01-t05-review"></a>
<a id="project-files-review"></a>

## 6. Căn cứ vòng trước — giữ lịch sử, không giữ tiến độ cũ

| Căn cứ | Ý nghĩa lịch sử / nguồn cố định |
|---|---|
| Yêu cầu làm lại ngày 2026-09-08 | Human yêu cầu rà toàn bộ, chia phase/task/subtask nhỏ để mỗi lần đọc đủ 2–3 quyết định, gửi đúng mục và xóa file tạm khi kết thúc đơn vị. Không có yêu cầu xóa tài liệu nguồn/lịch sử hoặc tự duyệt lựa chọn mới |
| G-ROADMAP cũ | Lộ trình 12 phase/77 task tại d6dbc20 đã cho bắt đầu vòng cũ; thay bằng vòng R2 này, không tiếp tục P01-T05 |
| P01-T01-SCOPE-r2 | Phạm vi được duyệt ngày 2026-09-07; [bằng chứng scope](https://github.com/Kynderis/kidea/blob/ec462eb/KIDEA_ROADMAP.md#p01-t01-review). Nay là đầu vào R01-T01 |
| P01-T02-PLATFORM-r3 và SEO-WORKFLOW-r1 | Nền tảng/SEO được duyệt ở vòng trước, không phải đã build; [bằng chứng nền tảng](https://github.com/Kynderis/kidea/blob/ec462eb/KIDEA_ROADMAP.md#p01-t02-review). Nay R01-T03; không tự nâng Mac ngay |
| P01-T03-PILOT-r1 | Workshop pilot được duyệt, chưa tạo ứng dụng; [bằng chứng pilot](https://github.com/Kynderis/kidea/blob/ec462eb/KIDEA_ROADMAP.md#p01-t03-review). Nay R01-T04 |
| PROJECT-FILES-r1 | Một repo, tài liệu sản phẩm ngoài .kidea và điều phối trong .kidea đã được duyệt; [bằng chứng ranh giới](https://github.com/Kynderis/kidea/blob/ec462eb/KIDEA_ROADMAP.md#project-files-review). Không phải approval Git/QUALITY; nay R01-T02 |
| ACCEPTANCE-r2 và QUALITY-r2 | Đã có danh mục 30 họ case nhưng chưa chạy; QUALITY chưa duyệt. Nay rà từng nhóm R01-T08/T09, không coi draft hoặc kiểm tra Markdown là PASS hành vi |
| Git G1–G6 | [Đề xuất chưa duyệt](https://github.com/Kynderis/kidea/blob/b0a825f/answer.md); nay tách R01-T05/T06/T07, không tự áp dụng |
| Nghiên cứu, tham khảo và Idea | Giữ nguồn gốc, báo cáo theo thời điểm, đề xuất nhiều agent vẫn ngoài bản đầu. Không nghiên cứu lại mọi phiên bản trong lần tái lập kế hoạch này |

Không thêm file archive/tracker thứ hai. Các anchor P01 ở đây chỉ giúp liên kết bằng chứng cũ không bị đứt; mọi việc đang làm nằm ở mã Rxx và sổ hiện hành.

## 7. Kiểm chứng lần tái lập

- Đối chiếu đủ 77 task cũ, 30 họ KA và 10 KQ với nơi xử lý/kiểm chứng mới; giữ sáu hành động, mười bước, ba bản đồ và các gate bắt buộc.
- Kiểm tra cấu trúc Markdown, ID/anchor/link nội bộ, tham chiếu task mới, một việc hiện hành và diff. Đây là kiểm tra tài liệu, không phải test skill, benchmark hoặc test pilot.
- Giữ nguyên ba tài liệu tham khảo gốc, năm báo cáo nghiên cứu và file Idea; không cài, tạo repo/branch/worktree/tag, deploy hoặc xóa file nguồn.
