# Kidea — Lộ trình xây dựng và theo dõi tiến trình

Trạng thái lộ trình: `IN_REVIEW` — chờ Human duyệt kế hoạch trước khi thực hiện.

Ngày cập nhật: 2026-09-06.

Căn cứ: [KIDEA_DESIGN.md](KIDEA_DESIGN.md), thiết kế tổng thể và các đề xuất đã được Human đồng ý. Việc chia phase/task dưới đây là kế hoạch mới, không phải kết quả triển khai hoặc approval có sẵn.

## 1. Phạm vi và cách đi

Đây là lộ trình **xây dựng chính skill Kidea**. Nó khác mười bước Kidea sẽ hướng dẫn trong một sản phẩm được quản lý. Ví dụ P05 dưới đây xây hướng dẫn cho các bước 3–7 của sản phẩm; không có nghĩa được gộp hoặc bỏ các Human gate của sản phẩm đó.

Đích đến là bản Kidea đầu tiên có thể cài, dùng, kiểm tra và tiếp tục công việc an toàn trong phạm vi hỗ trợ đã chốt: đủ sáu hành động, hướng dẫn mười bước, ba bản đồ liên thông, coding rules theo môi trường và HTML tiến độ. Không gọi bản đầu là hỗ trợ mọi ngôn ngữ/mọi nền tảng. Các tổ hợp bổ sung sẽ có đợt thay đổi riêng.

Nguyên tắc thực hiện:

- Đi tuần tự, tối đa một task triển khai `IN_PROGRESS`. Kiểm tra độc lập có thể hỗ trợ task đó; không mở nhiều luồng triển khai thiếu kiểm soát.
- Chốt hợp đồng dữ liệu và điều kiện kiểm tra trước công cụ phụ thuộc; làm lát cắt nhỏ chạy được và thử sớm, không đợi cuối lộ trình mới kiểm chứng.
- Mỗi task có đầu ra và tiêu chí đạt. Nếu task vẫn quá lớn khi bắt đầu, chia tiếp ngay trong file này, giữ quan hệ cha-con và Human duyệt thay đổi gate/phạm vi trước khi làm.
- Không tự bỏ kiểm tra vì tốn công. Nếu cần thay phạm vi, công nghệ hoặc mức chất lượng, đưa quyết định về Human review và cập nhật thiết kế nguồn.
- Không đặt thời hạn hoặc phần trăm hoàn thành giả. Số task chỉ phản ánh phần việc đã phân rã, không phải số giờ còn lại.
- Chỉ dùng dữ liệu thử và môi trường được phép. Duyệt kế hoạch không cấp quyền cài đặt vào môi trường cá nhân, publish, thao tác production hoặc sửa dữ liệu thật.

## 2. Điểm tiếp tục hiện hành

| Trường | Giá trị hiện hành |
|---|---|
| Gate đang chờ | `G-ROADMAP`: Human review lộ trình này |
| Phase/task đang thực hiện | Chưa có |
| Việc tiếp theo sau approval | `P01-T01` — chốt phạm vi bản đầu |
| Điều kiện để bắt đầu | Ghi nhận Human đồng ý đúng phiên bản/phạm vi lộ trình |
| Điểm quay lại | Chưa có |
| Vướng mắc khác | Chưa ghi nhận; các lựa chọn triển khai còn mở được giao cho task cụ thể |

Viết xong tài liệu thiết kế/roadmap ở lượt này không làm các task xây Kidea bên dưới thành `DONE`. Chưa có skill, helper hoặc pilot được tạo theo lộ trình này.

## 3. Quy ước cập nhật, bằng chứng và Human gate

### 3.1. Một nguồn trạng thái

- File này quản lý trạng thái xây Kidea. Bảng tổng quan giữ trạng thái phase; bảng chi tiết giữ trạng thái task. Phần điểm tiếp tục chỉ trỏ tới việc hiện hành, không chép lại checklist.
- Phase: `PENDING → IN_PROGRESS → IN_REVIEW → APPROVED`.
- Task: `TODO → IN_PROGRESS → DONE`. `DONE` cần đạt tiêu chí của task và có bằng chứng; không tự duyệt phase.
- Có blocker thì ghi lý do, cần ai/quyết định gì và điểm tiếp tục, bên cạnh trạng thái hiện tại. Không đổi blocker thành kết quả đạt.
- Nếu một hạng mục thật sự không áp dụng, chỉ ghi `N/A` cùng lý do và xác nhận Human sau khi review; không tự dùng `N/A` để bỏ năng lực thuộc bản đầu đã chốt.
- Giữ ID, tên, cha-con, trạng thái và link kết quả của task hoàn thành. Dọn log thừa, không xóa dấu vết cần để kiểm chứng hoặc biết đã làm gì.

### 3.2. Thứ tự và gate

Mặc định task sau phụ thuộc task trước trong cùng phase; phase sau chỉ bắt đầu khi phase trước `APPROVED`. Nếu cần đổi thứ tự, ghi dependency mới và lý do, duyệt trước phần việc bị ảnh hưởng. Không suy ra từ bảng rằng có thể chạy mọi task cùng lúc.

Task có nhãn **[H]** là điểm dừng bên trong phase: trình đầu ra cho Human duyệt trước task phụ thuộc. Bằng chứng review phải chỉ rõ phạm vi, nội dung/phiên bản, thời điểm và xác nhận Human. Kiểm tra đạt không thay xác nhận này. Task cuối mỗi phase chuẩn bị gói review; phase chỉ `APPROVED` khi Human duyệt gói đó.

`G-ROADMAP` cho phép bắt đầu kế hoạch; không duyệt trước runtime, schema, phương pháp nghiệp vụ hoặc các lựa chọn được đánh dấu [H]. Các gate mới phát hiện phải được chốt trước khi vượt qua, không tự thêm approval sau khi đã thực hiện quyết định.

| Gate khởi đầu | Phạm vi | Xác nhận Human |
|---|---|---|
| G-ROADMAP | Thứ tự phase, task, gate và phạm vi kế hoạch hiện hành | Chưa có |

### 3.3. Cách cập nhật mỗi task

1. Trước khi làm: đọc thiết kế/đầu vào liên quan, kiểm tra dependency và approval còn hiệu lực; cập nhật task đang làm và điểm tiếp tục.
2. Chốt phạm vi nhỏ, file dự kiến tác động, kiểm tra sẽ chạy và thao tác nào cần quyền riêng. Không để code phát sinh trước quyết định [H].
3. Sau khi làm: đối chiếu đầu ra với tiêu chí, chạy kiểm tra thực tế, lưu kết quả và phiên bản/môi trường. Nếu bị ngắt, ghi điều chưa xác nhận; kiểm tra thực tế trước khi chạy lại tác dụng phụ.
4. Chỉ chuyển `DONE` khi đủ bằng chứng. Điền cột bằng chứng bằng đường dẫn/mục kết quả thực, không chỉ ghi “đã test”. Test chưa chạy, fail, skip hoặc chỉ mô phỏng phải nói đúng.
5. Cập nhật việc tiếp theo hoặc gate chờ. Nếu thay đổi làm sai căn cứ cũ, mở lại task/phase liên quan và đánh giá dây chuyền, kể cả task không có diff.

Một bản ghi bằng chứng cần đủ: task/case, đầu ra được kiểm tra, phiên bản source/cấu hình/đặc tả, lệnh hoặc quy trình, môi trường, kết quả thực tế và giới hạn. Approval gắn với nội dung hiện hành, không bắt buộc tạo Git commit. Bằng chứng nhạy cảm không đưa vào repo public.

### 3.4. Điều kiện chung để đóng phase

- Các task trong phạm vi đã đạt; không còn blocker, lỗi hoặc quyết định mở có thể làm sai đầu ra bắt buộc.
- Tài liệu, code, test, mapping và bằng chứng liên quan thống nhất ở mức năng lực phase đó đã xây; phần chưa đến phase sau được ghi rõ, không nhận là đã hoàn tất.
- Chạy lại kiểm tra tích hợp/hồi quy phù hợp, không chỉ cộng PASS đơn lẻ của các task.
- Có gói review: thay đổi, kết quả, giới hạn, ảnh hưởng tới phần đã làm và đề nghị bước tiếp theo.
- Human duyệt đúng gói hiện hành. Nếu Human yêu cầu sửa, quay về `IN_PROGRESS`; sau sửa phải kiểm tra và review lại.

## 4. Tổng quan phase

| Phase | Kết quả chính | Phụ thuộc | Trạng thái | Xác nhận Human cuối phase |
|---|---|---|---|---|
| [P01](#p01) | Phạm vi bản đầu và bộ kịch bản nghiệm thu | G-ROADMAP | PENDING | — |
| [P02](#p02) | Hợp đồng trạng thái, lưu trữ và runtime | P01 | PENDING | — |
| [P03](#p03) | Khung skill và vòng init/status/resume/approve tối thiểu | P02 | PENDING | — |
| [P04](#p04) | Phương pháp Feature → nghiệp vụ → AC/business test | P03 | PENDING | — |
| [P05](#p05) | Hướng dẫn chất lượng, UX, vận hành, admin và kiến trúc | P04 | PENDING | — |
| [P06](#p06) | Coding rules hiệu lực và đặc tả kiểm thử kỹ thuật | P05 | PENDING | — |
| [P07](#p07) | Ba bản đồ và đối chiếu ngữ nghĩa | P06 | PENDING | — |
| [P08](#p08) | Change, lan truyền ảnh hưởng và phục hồi công việc | P07 | PENDING | — |
| [P09](#p09) | HTML tiến độ offline, chỉ đọc | P08 | PENDING | — |
| [P10](#p10) | Hướng dẫn lập kế hoạch, code, release và vận hành | P09 | PENDING | — |
| [P11](#p11) | Pilot đầu-cuối và thử các đường lỗi/thay đổi | P10 | PENDING | — |
| [P12](#p12) | Cài đặt, tương thích, tài liệu và nghiệm thu bản đầu | P11 | PENDING | — |

Các dấu `—` ở bằng chứng/xác nhận nghĩa là chưa có, không phải PASS hoặc N/A.

<a id="p01"></a>

## P01 — Chốt phạm vi và tiêu chí nghiệm thu bản đầu

Mục tiêu: biết chính xác bản đầu cần làm được gì và kiểm chứng bằng cách nào trước khi chọn cách triển khai. Chưa code skill trong phase này.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P01-T01 [H] | Phạm vi bản đầu, điều không làm, nhóm người dùng và mức hỗ trợ | Đối chiếu đủ sáu hành động/mười bước/ba bản đồ; giới hạn tổ hợp hỗ trợ rõ, không âm thầm bỏ yêu cầu đã duyệt | TODO | — |
| P01-T02 [H] | Ma trận host, OS, ngôn ngữ/thành phần đầu tiên và môi trường chạy thử | Ghi cái nào cần kiểm chứng thực, cái nào chưa hỗ trợ; xác định quyền/công cụ cần mà chưa tự cài | TODO | — |
| P01-T03 [H] | Phạm vi một sản phẩm pilot nhỏ dùng dữ liệu giả | Có nghiệp vụ dùng chung, ít nhất một dependency ngoài lời gọi trực tiếp, giao diện và nhu cầu admin/monitoring vừa đủ; môi trường phi production, chi phí và ranh giới được chốt | TODO | — |
| P01-T04 | Danh mục kịch bản nghiệm thu Kidea, tách khỏi test của pilot | Có đường đúng, Human reject, approval cũ, dữ liệu sai, ngắt/resume, thay đổi giữa MVP và sau release; mỗi case có hành vi mong đợi quan sát được | TODO | — |
| P01-T05 [H] | Tiêu chí chất lượng Kidea và mức bằng chứng tối thiểu | Chốt cách đo độ đúng trạng thái, an toàn ghi, khả năng resume, thời gian đọc/chạy trên hồ sơ đại diện; không dùng “nhanh/tốt/đầy đủ” không kiểm tra được | TODO | — |
| P01-T06 | Gói review phạm vi, pilot, acceptance và rủi ro | Mỗi yêu cầu thiết kế có task/kiểm tra dự kiến; lựa chọn chưa chốt không bị thể hiện là đã hỗ trợ | TODO | — |

Gate cuối: Human duyệt phạm vi và tiêu chí nghiệm thu. Nếu không có pilot đủ nhỏ, thu gọn pilot có chủ đích trước, không bỏ kiểm tra quan trọng để giữ lịch.

<a id="p02"></a>

## P02 — Thiết kế hợp đồng trạng thái và lưu trữ

Mục tiêu: một bộ hồ sơ đọc được bằng mắt lẫn máy, biết ai có quyền ghi và resume được khi dữ liệu chưa hoàn tất. Đầu ra vẫn là thiết kế, mẫu dữ liệu và diễn tập thủ công; chưa viết helper.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P02-T01 [H] | Chọn runtime/helper, cấu trúc skill, vị trí cài thử và dependency tối thiểu | Phù hợp P01; kiểm tra khả dụng trên host đích, lý do chọn Python/Node hoặc phương án được duyệt; không phụ thuộc ngôn ngữ pilot | TODO | — |
| P02-T02 [H] | Schema nguồn cho INDEX/work/features, ID, task cha-con và trạng thái tài liệu | Mỗi dữ kiện có một nơi ghi có hiệu lực; task DONE vẫn truy được; chưa phân rã khác với hoàn tất; phân biệt target và bản đã release | TODO | — |
| P02-T03 [H] | Hợp đồng chuyển trạng thái, review ID, nội dung được duyệt và hiệu lực approval | Bảng đủ chuyển hợp lệ/không hợp lệ; reject, N/A, gate bước con, approval sai mục/cũ và thay đổi ngữ nghĩa; không dùng test PASS làm Human approval | TODO | — |
| P02-T04 [H] | Hợp đồng checkpoint, quyền ghi, khôi phục và phiên bản skill/schema/profile | Chốt nhận diện phiên bản/tương thích từ đầu; xử lý ghi dở/xung đột/sai root/path thoát phạm vi, bản chưa hỗ trợ và thao tác chưa biết kết quả; không yêu cầu Git để lưu trạng thái | TODO | — |
| P02-T05 | Bộ hồ sơ mẫu hợp lệ/không hợp lệ và diễn tập đọc/chuyển bằng tay | Thử chuỗi dependency nhiều cấp, trạng thái mâu thuẫn, file thiếu, nguồn sửa ngoài luồng và máy mới; cùng dữ liệu phải dẫn tới cùng kết luận cấu trúc | TODO | — |
| P02-T06 | Gói review hợp đồng và danh sách test cho helper | Mẫu không chứa trường trang trí/nguồn trùng; mỗi rủi ro P02 có case kiểm tra; quyết định đủ để bắt đầu P03 | TODO | — |

Gate cuối: Human duyệt hợp đồng dữ liệu và quyền thao tác. Schema các phần chuyên biệt được mở rộng tại phase tương ứng, phải theo quy tắc tương thích đã chốt ở đây.

<a id="p03"></a>

## P03 — Xây lõi skill và vòng làm việc tối thiểu

Mục tiêu: cài thử trong vị trí được Human cho phép và chứng minh lõi trạng thái hoạt động trên hồ sơ nhỏ. Chưa nhận là có đủ hướng dẫn mười bước hoặc đủ sáu hành động.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P03-T01 | Khung một skill, SKILL.md ngắn, bộ test và bản cài thử khi có quyền | Khai báo/routing hợp lệ; chỉ cài khi Human cho phép đúng vị trí; đọc hướng dẫn theo việc hiện hành; nhận diện lời gọi chủ động và không chiếm yêu cầu ngoài phạm vi | TODO | — |
| P03-T02 | Bộ đọc/kiểm tra schema và mẫu khởi đầu | Test dữ liệu hợp lệ/sai/thiếu/không hỗ trợ; lỗi rõ vị trí; không sửa nguồn khi chỉ kiểm tra | TODO | — |
| P03-T03 | Helper ghi an toàn theo P02 | Test từ chối sai root/path, không ghi đè file không sở hữu, lỗi giữa ghi và nguồn đổi trong lúc xử lý; kiểm tra file gốc không hỏng | TODO | — |
| P03-T04 | Hành động init tối thiểu | Chỉ tạo INDEX/work/features cần thiết; tách ý tưởng Human và gợi ý AI; gọi lại không init đè hoặc mở hai việc hiện hành | TODO | — |
| P03-T05 | Hành động status chỉ đọc | Báo đúng bước/task/gate/blocker; không ghi nguồn, chạy code sản phẩm hay thực hiện việc kế tiếp | TODO | — |
| P03-T06 | Hành động resume tối thiểu | Phiên mới đọc đủ nguồn và điểm quay lại; phát hiện gián đoạn/approval cũ/thiếu công cụ; không đoán DONE hoặc tự thao tác Git | TODO | — |
| P03-T07 | Hành động approve đúng phạm vi | Chỉ ghi xác nhận Human cho review hiện hành đủ điều kiện; sai ID/phiên bản/mục thiếu kiểm tra phải dừng; approve bước con không duyệt bước lớn | TODO | — |
| P03-T08 | Test tích hợp lõi và phiên AI mới dùng bản cài thử | Đi init → làm mẫu → review/reject → sửa → approve → ngắt/resume; test command sai/thiếu args không chuyển thành hành động khác; change/visualize chưa có phải báo chưa hỗ trợ | TODO | — |

Gate cuối: Human review bằng chứng lõi. Test script không chứng minh AI luôn tuân thủ; phải có kết quả hành vi trong phiên dùng skill thực tế, không chỉ chạy helper trực tiếp.

<a id="p04"></a>

## P04 — Hoàn thiện phương pháp nghiệp vụ và thử sớm

Mục tiêu: một cách đặc tả có thể dùng lặp lại, đủ sâu để test nhưng không phình tài liệu. Xây hướng dẫn bước 1–2; không viết lại nguyên bộ tài liệu cũ như thể đã được duyệt toàn bộ.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P04-T01 | Đối chiếu tài liệu tham khảo với thiết kế hiện hành | Ghi giữ/điều chỉnh/cần chốt có lý do; phân biệt đề xuất v0.2 với quyết định đã duyệt; không khôi phục phạm vi cũ đã bỏ | TODO | — |
| P04-T02 [H] | Hướng dẫn Feature Map, cụm đang làm và ranh giới nghiệp vụ chung/riêng | Thử MVP/Future/Idea, shared state, bên dùng thứ hai và dependency nhiều cấp; không đặc tả toàn Future hoặc tự tách shared module | TODO | — |
| P04-T03 [H] | Mẫu rule/state/flow/data và link/backlink có mục đích | Ví dụ đủ input/output/đơn vị/biên/lỗi/invariant; bảng flow là nguồn; ID cụ thể, không ALL/NEXT hay thêm loại quan hệ bị loại | TODO | — |
| P04-T04 [H] | Cách viết AC và chọn business test specification | Expected result truy về rule/nhánh/invariant; có ví dụ flow lỗi đầu tiên và flow khác; phạm vi test hữu hạn được giải thích, không hứa test mọi tổ hợp | TODO | — |
| P04-T05 | Áp dụng bước 1–2 lên lát cắt pilot, tích hợp hướng dẫn vào skill | Có phiên Human review từng gate, reuse và điểm quay lại; không còn OPEN ảnh hưởng hành vi đang duyệt; tìm ngược test tới căn cứ được | TODO | — |
| P04-T06 | Gói review phương pháp và hồi quy lõi | Sửa điểm mơ hồ phát hiện trong pilot; dữ liệu mới vẫn qua validator P03; hướng dẫn đủ dùng ở phiên mới, không cần nhớ cuộc trao đổi cũ | TODO | — |

Gate cuối: Human duyệt phương pháp và đầu ra thử. Chi tiết chưa giải quyết không được đưa thành quy tắc bắt buộc trong skill.

<a id="p05"></a>

## P05 — Hướng dẫn chất lượng, trải nghiệm và kiến trúc

Mục tiêu: xây hướng dẫn/template cho bước 3–7 của sản phẩm, với gate riêng từng bước. Dùng lát cắt pilot để phát hiện thiếu đầu vào trước khi code sản phẩm.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P05-T01 [H] | Hướng dẫn yêu cầu chất lượng và tiêu chí đo | Phân biệt tải/độ trễ, bảo mật/quyền riêng tư, chi phí, mất dữ liệu/thời gian phục hồi; mỗi yêu cầu áp dụng có phép đo và điều kiện test | TODO | — |
| P05-T02 [H] | Hướng dẫn UX/nền tảng và đầu ra màn hình | Có luồng đúng/lỗi/rỗng/loading/thiếu quyền; mapping về hành vi, trạng thái và test; nền tảng không áp dụng có lý do Human duyệt | TODO | — |
| P05-T03 [H] | Hướng dẫn monitoring/điều khiển vận hành | Chỉ số có ý nghĩa/độ mới/ngưỡng/hành động; nhận diện mất thu thập, lỗi dashboard và quyền điều khiển; không coi thiếu tín hiệu là khỏe | TODO | — |
| P05-T04 [H] | Hướng dẫn admin | Mỗi thao tác có nguồn nghiệp vụ, quyền, xác nhận, audit và lỗi; nếu phát sinh nghiệp vụ mới phải quay lại bước 1–2, không tự định nghĩa trong UI | TODO | — |
| P05-T05 [H] | Hướng dẫn kiến trúc và hợp đồng kỹ thuật | Đủ các thành phần đã chốt, owner dữ liệu, API/event/lỗi, môi trường và deploy/recovery; công nghệ theo nhu cầu, không mặc định microservices | TODO | — |
| P05-T06 | Diễn tập bước 3–7 trên hồ sơ pilot và gói review | Giữ năm gate tách biệt; nguồn NFR/UX/ops/admin truy tới kiến trúc; thiếu đầu vào được phát hiện, không tạo hồ sơ giả cho đủ mẫu | TODO | — |

Gate cuối: Human review hướng dẫn và kết quả diễn tập; chưa coi việc có thiết kế monitoring/admin là các dashboard đã tồn tại.

<a id="p06"></a>

## P06 — Coding rules hiệu lực và kiểm thử kỹ thuật

Mục tiêu: biến yêu cầu chất lượng thành quy tắc áp dụng được và test có kết quả mong đợi rõ; xây hướng dẫn bước 8. Chỉ xây bộ profile nằm trong ma trận đã duyệt.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P06-T01 [H] | Hợp đồng profile rule theo ngôn ngữ/thành phần/môi trường | Có scope, phiên bản, yêu cầu, cách kiểm tra, ngoại lệ; tách rule nền với quyết định project và config thực thi | TODO | — |
| P06-T02 [H] | Profile đầu tiên và cách chốt xung đột với project hiện có | Compiler/runtime/OS/CPU/framework đủ cụ thể; không tự đè conventions; rule chất lượng đo được, không mặc định tối ưu native hoặc bảo đảm hết leak | TODO | — |
| P06-T03 | Ví dụ config và kiểm tra rule trên code mẫu nhỏ | Formatter/linter/build/test ở vị trí chuẩn; có mẫu vi phạm phải bị phát hiện và mẫu đúng; kiểm tra thủ công không bị ghi thành tự động | TODO | — |
| P06-T04 [H] | Hướng dẫn technical test specification và mapping từ nguồn yêu cầu | Có contract/integration/E2E, tải/lỗi/bảo mật/restore khi áp dụng; mỗi case có setup/input/assertion/expected result, phân biệt chạy được và đang chờ code | TODO | — |
| P06-T05 | Áp dụng hồ sơ rule/test vào pilot và thử mang hồ sơ sang môi trường sạch | Truy đúng bản rule nền/config đã chốt; thiếu phiên bản/công cụ phải báo; kết quả mock không thay tích hợp thật; test fail/skip không thành PASS | TODO | — |
| P06-T06 | Gói review rule/test và hồi quy hướng dẫn | Đủ điểm nối bước 3 → 7 → 8 → 9 → 10; task không thể báo DONE khi vi phạm rule bắt buộc chưa có ngoại lệ Human duyệt | TODO | — |

Gate cuối: Human duyệt profile hỗ trợ và phương pháp test. Bổ sung ngôn ngữ/môi trường khác là thay đổi phạm vi có gate, không chép một profile rồi tuyên bố hỗ trợ.

<a id="p07"></a>

## P07 — Xây ba bản đồ và đối chiếu ngữ nghĩa

Mục tiêu: truy được quan hệ hai chiều với nguồn/giới hạn rõ. Dùng hồ sơ pilot và code mẫu thử nhỏ đã được duyệt ở P06, chưa code sản phẩm pilot trước kế hoạch P10/P11. Phần map của pilot chưa có triển khai phải ghi đang chờ, không coi code mẫu là triển khai đã hoàn thành. Không tạo một cơ sở dữ liệu thứ hai phải nhập lại mọi thông tin.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P07-T01 [H] | Hợp đồng dữ liệu ba góc nhìn, ownership và phiên bản snapshot | Đặc tả/testspec ở map 1; triển khai/testcode/config ở map 2; đối chiếu nhiều–nhiều ở map 3; có phạm vi trích xuất/giới hạn, không thêm map test thứ tư | TODO | — |
| P07-T02 | Bộ đọc map hồ sơ và kiểm tra link/ID | Bao phủ nghiệp vụ, NFR, UX, kiến trúc, API/event/data/ops/testspec; bắt thiếu đích, ID trùng, backlink sai; không suy diễn từ prose tự do | TODO | — |
| P07-T03 [H] | Chọn adapter triển khai đầu tiên và thử khả năng trích xuất | Chạy trên source/build của code mẫu thuộc ma trận P01, không dùng graph bịa; nếu C++ có thể thử Doxygen/XML; ghi rõ caller/callee, event, callback hoặc quan hệ nào lấy được/chưa lấy được | TODO | — |
| P07-T04 | Tích hợp adapter cùng nguồn bổ sung có căn cứ | Test đổi tên/di chuyển/xóa symbol, config build khác, file sinh/công cụ thiếu; thiếu phân tích không thành graph đầy đủ hoặc không có ảnh hưởng | TODO | — |
| P07-T05 | Mapping đặc tả ↔ triển khai/test và chỉ mục ngược | Trỏ đúng file/module/symbol/test theo trách nhiệm; không bắt ID riêng mọi utility, không nhập lại từng lời gọi hàm; mỗi quan hệ một nơi có hiệu lực | TODO | — |
| P07-T06 | Bộ kiểm tra cấu trúc và review ngữ nghĩa trên case đối chứng | Phát hiện hoặc đưa về review mapping đúng đường dẫn nhưng sai ý nghĩa, test gọi code nhưng thiếu assertion, snapshot cũ và test evidence sai phiên bản; nêu rõ phần cần Human/AI đọc | TODO | — |
| P07-T07 | Gói review ba bản đồ trên bộ mẫu và hồ sơ pilot, cùng hồi quy | Truy hai chiều trên bộ mẫu; map pilot chưa có code phải ghi chờ P11; map rỗng/không hỗ trợ không được coi hoàn tất; không sửa đặc tả để khớp code lỗi | TODO | — |

Gate cuối: Human duyệt hợp đồng mapping, adapter và mức hỗ trợ đã được chứng minh. Link hợp lệ/coverage cao không được trình bày như bằng chứng tuân thủ nghiệp vụ đầy đủ.

<a id="p08"></a>

## P08 — Change, lan truyền ảnh hưởng và resume nâng cao

Mục tiêu: thay đổi không bỏ sót các bên liên quan đã xác định; trạng thái đủ để tiếp tục khi phân tích qua nhiều lượt. Không tuyên bố tìm được mọi dependency ngầm chỉ nhờ graph.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P08-T01 [H] | Hợp đồng change: Feature mới/đổi, bugfix và checkpoint việc cũ | Thêm Feature giữa MVP/sau release quay bước 1; bugfix chỉ đi đường sớm nhất khi giữ đúng đặc tả; ý định chưa rõ phải làm rõ, không tự triển khai hoặc đẩy sang Idea | TODO | — |
| P08-T02 [H] | Hợp đồng impact list, điểm quay lại và điều kiện đóng/mở lại | Kết luận có input revision, lý do và bằng chứng; nguồn thay lại phải tái kiểm tra; phân biệt graph traversal với kết luận ngữ nghĩa | TODO | — |
| P08-T03 | Luồng change và tìm ảnh hưởng xuyên ba bản đồ | Truy dependency/caller, API/event/shared data/config; tìm bổ sung trong source/hồ sơ để bắt mapping thiếu; từng nơi có CẦN SỬA hoặc ĐÃ KIỂM TRA — KHÔNG CẦN SỬA | TODO | — |
| P08-T04 | Xử lý chu kỳ và lan truyền khi không có diff trung gian | Test B đổi quy tắc làm tròn → A không sửa chữ nhưng đầu ra đổi → D phải được kiểm tra; dependency có vòng lặp không chạy vô hạn và không đóng sớm; input đổi phải requeue | TODO | — |
| P08-T05 | Đồng bộ approval, mapping và nội dung hiện hành khi đổi/xóa/di chuyển | Migrate đủ link trước bỏ nội dung cũ; ID tái dùng chỉ khi tham chiếu hiện hành đúng nghĩa; không tạo retired-ID registry; approval/test cũ mất hiệu lực đúng phạm vi | TODO | — |
| P08-T06 | Resume sau change dở và trên môi trường sạch | Giữ task DONE/điểm quay lại nhiều cấp; phát hiện source sửa ngoài luồng, bản rule thiếu, sai repo/branch, pending side effect; không tự pull/đổi branch/replay nguy hiểm | TODO | — |
| P08-T07 | Bộ case thay đổi và gói review | Mọi ảnh hưởng đã xác định được xử lý hoặc còn blocker rõ; target mới tách khỏi release cũ; không đóng vì đã quét hết cạnh hoặc giữ APPROVED khi căn cứ sai | TODO | — |

Gate cuối: Human review cả đường đúng và đường khó, bao gồm thay đổi ngữ nghĩa không có diff. Nếu chưa xử lý xong tác động bắt buộc thì phase chưa đủ điều kiện duyệt.

<a id="p09"></a>

## P09 — Giao diện tiến độ offline, chỉ đọc

Mục tiêu: Human xem tổng quan rồi mở chi tiết từ chính hồ sơ có hiệu lực. Đây không phải monitoring/admin của sản phẩm và không phải giao diện điều khiển Kidea.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P09-T01 [H] | Layout tổng quan/chi tiết và ma trận trình duyệt cần thử | Thấy MVP/đợt thay đổi, bản release được ghi nhận, task đã xong/chưa xong/chưa phân rã, blocker/gate/evidence; dễ đọc với hồ sơ đại diện | TODO | — |
| P09-T02 | Bộ dựng dữ liệu view từ schema nguồn | Không có trạng thái nhập tay thứ hai; đầu vào thiếu/sai/mâu thuẫn/đổi giữa đọc phải báo; không suy ra hoàn thành từ số task bằng 0 | TODO | — |
| P09-T03 | Renderer HTML tự chứa và hành động visualize | Mở offline không server/CDN; ghi đúng output quản lý; tái sinh không sửa nguồn; lỗi ghi không phá nguồn hoặc giả báo view mới | TODO | — |
| P09-T04 | Hiển thị snapshot, chi tiết và liên kết nguồn | Có thời điểm/phiên bản sinh; view cũ không giả live; release ghi nhận không giả sức khỏe hiện tại; mang riêng HTML vẫn xem tiến độ, link nguồn có giới hạn rõ | TODO | — |
| P09-T05 | Kiểm tra an toàn dữ liệu và khả năng sử dụng | Escape nội dung độc hại, chặn URL/script không an toàn; bàn phím, hẹp/rộng, tên dài, nhiều task; không có approve/edit/Git/deploy/upload trong view | TODO | — |
| P09-T06 | So sánh view với hồ sơ pilot và gói review | Từng trạng thái/task/gate khớp nguồn; dữ liệu unknown/stale/fail rõ, không chỉ dựa màu; kiểm tra thực trên ma trận P09-T01 | TODO | — |

Gate cuối: Human review giao diện và bằng chứng dữ liệu/an toàn. Hình đẹp không bù được trạng thái sai.

<a id="p10"></a>

## P10 — Hướng dẫn kế hoạch, code, release và vận hành

Mục tiêu: hoàn thiện hướng dẫn bước 9–10 của sản phẩm. Kế hoạch riêng của pilot phải được Human duyệt trước khi dùng Kidea để code pilot ở P11.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P10-T01 [H] | Hướng dẫn phân rã phase/task và gói duyệt kế hoạch sản phẩm | Mỗi task có dependency/đầu ra/test/gate; bao phủ backend/web/mobile/ops/admin thuộc phạm vi; không gộp duyệt kế hoạch với bắt đầu code | TODO | — |
| P10-T02 | Hướng dẫn vòng code → rule/test → evidence → review | Có checkpoint trước/sau, cập nhật mapping, hồi quy task/phase/release; không tự chọn task song song hoặc DONE khi kiểm tra bắt buộc fail | TODO | — |
| P10-T03 | Hướng dẫn build/test tự động và môi trường kiểm thử sớm | Có cách tái tạo, config và version rõ; phân biệt kiểm tra local với môi trường đích; không đợi cuối code mới nghĩ CI/deploy | TODO | — |
| P10-T04 [H] | Hợp đồng release, migration/rollback/restore và quyền môi trường | Tách duyệt nội dung với quyền deploy/Git/dữ liệu; chỉ diễn tập nơi được phép; nêu điều kiện dừng/khôi phục và dữ liệu cần giữ | TODO | — |
| P10-T05 | Hướng dẫn kiểm chứng sau deploy và ghi nhận bản đang chạy | Smoke test, config/version thực, monitoring/alert/admin cần thiết, kết quả restore; không dùng bản build mới nhất thay xác nhận bản đã deploy | TODO | — |
| P10-T06 | Diễn tập thiếu quyền/lỗi deploy và gói review hướng dẫn | Không tự deploy/retry tác dụng phụ khi chưa rõ; không báo release thành công khi smoke/restore chưa đạt; bước 9a/9b/10 và gate vẫn riêng | TODO | — |

Gate cuối: Human duyệt hướng dẫn toàn chu trình. Không có thao tác production thật trong phase này.

<a id="p11"></a>

## P11 — Pilot đầu-cuối và kiểm chứng hành vi

Mục tiêu: dùng chính bản Kidea đang xây trong phiên mới để dẫn một sản phẩm nhỏ đi hết chu trình. Không thay hành vi skill bằng việc người viết tự sửa mọi hồ sơ mẫu rồi chỉ chạy validator.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P11-T01 [H] | Gói chạy pilot: baseline, bản skill, môi trường, kế hoạch và quyền | Kiểm tra lại đầu ra bước 1–8 đã có, đi đủ gate còn thiếu; duyệt kế hoạch bước 9 trước code; dữ liệu giả và môi trường riêng đã được cho phép | TODO | — |
| P11-T02 | Thực hiện từng task pilot bằng Kidea và ghi nhận kết quả | Có source/test chạy thật, mapping/assertion đúng, build/CI sớm; lưu checkpoint MVP đang dở có thể tái tạo cho T04; review cuối từng phase pilot, không dùng một approval P11 thay mọi gate bên trong | TODO | — |
| P11-T03 | Deploy pilot vào môi trường thử được phép và xác nhận release | Có bản đang chạy thực, smoke/monitor/admin, diễn tập rollback/restore áp dụng; không gắn nhãn production thật | TODO | — |
| P11-T04 | Kịch bản thêm Feature khi MVP đang dở | Chạy trên checkpoint MVP có thể tái tạo; quay bước 1, giữ việc cũ, đánh giá đủ bước liên quan, Human gate và resume đúng điểm; không chỉ kể giả định | TODO | — |
| P11-T05 | Kịch bản đổi Feature sau release và bugfix giữ nguyên đặc tả | Hai nhánh phân biệt rõ; xử lý impact/test/approval, target mới khác bản đang chạy; bug code không được hợp thức hóa bằng sửa rule | TODO | — |
| P11-T06 | Kịch bản lỗi, ngắt phiên và chuyển môi trường/máy | Thực hiện Human reject, test fail/skip, mất công cụ, approval cũ, nguồn đổi ngoài luồng và pending side effect; bản rule/source đúng; không thực hiện Git/production ngoài quyền | TODO | — |
| P11-T07 | Báo cáo nghiệm thu pilot, sửa lỗi Kidea phát hiện và chạy lại | Mỗi lỗi có phạm vi sửa nhỏ, impact review và bằng chứng hồi quy; tách lỗi Kidea/lỗi pilot; đủ case P01, không dùng mẫu chạy xanh duy nhất thay toàn ma trận | TODO | — |

Gate cuối: Human quyết định bản Kidea đủ điều kiện đóng gói hay phải quay phase trước. Chứng minh giả lập chỉ được ghi là giả lập; hạng mục cần máy/môi trường thực còn thiếu thì chưa đạt tiêu chí tương ứng.

P11-T02 được thực hiện theo từng task trong kế hoạch sản phẩm pilot đã duyệt, không phải một lượt code toàn sản phẩm. Với lỗi Kidea phát hiện ở P11-T07, tạo task con cho từng sửa chữa đủ nhỏ ngay trong roadmap này; nếu đổi thiết kế phải review lại nguồn và phần phụ thuộc trước khi sửa. Không dùng nhãn “sửa lỗi pilot” để mở một đợt refactor không giới hạn.

<a id="p12"></a>

## P12 — Cài đặt, tương thích và nghiệm thu bản đầu

Mục tiêu: người dùng có thể cài đúng bản, dùng từ đầu hoặc resume với hồ sơ đã có, hiểu rõ giới hạn và cách xử lý lỗi. Không mở rộng phạm vi hỗ trợ ở phút cuối.

| Task | Đầu ra cần tạo | Điều kiện kiểm chứng | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| P12-T01 [H] | Ma trận phiên bản phát hành, nâng cấp và khôi phục theo hợp đồng P02 | Chốt các version thực sự hỗ trợ, cách bảo toàn hồ sơ và quyền nâng cấp; schema quá mới phải dừng rõ; nếu cần đổi hợp đồng nền phải mở lại P02 và phần phụ thuộc | TODO | — |
| P12-T02 | Gói cài và hướng dẫn cài/gỡ trong phạm vi được phép | Cài sạch, kiểm tra phát hiện skill/sáu hành động, tránh đè bản khác; gỡ skill không xóa hồ sơ/source sản phẩm; không tự nhận /kidea được host hỗ trợ | TODO | — |
| P12-T03 | Test cài/resume/nâng cấp trên ma trận hỗ trợ | Dùng đúng version source/rule/công cụ ở môi trường sạch; test từ chối bản không tương thích và rollback nâng cấp; nêu rõ phần mới mô phỏng/chưa chạy thực | TODO | — |
| P12-T04 | Tài liệu sử dụng tiếng Việt, ví dụ nhỏ và xử lý sự cố | Người dùng mới biết bắt đầu/gate/resume/change/view, backup và giới hạn; link/file thật, không lệ thuộc cuộc hội thoại; SKILL.md giữ gọn và routing đúng | TODO | — |
| P12-T05 | Chạy bộ nghiệm thu cuối và review độc lập | Validator skill, tests helper, hành vi AI, maps/change/view/install đều gắn bản release candidate; rà secrets/quyền ghi/link lỗi, không còn lỗi chặn nghiệm thu | TODO | — |
| P12-T06 | Gói bàn giao bản đầu và đề nghị Human nghiệm thu | Có version, phạm vi hỗ trợ đã chứng minh, kết quả, giới hạn/rủi ro và hướng dùng; publication/cài môi trường thật chỉ thực hiện nếu Human cấp quyền cụ thể | TODO | — |

Gate cuối: Human nghiệm thu bản đầu. Mọi yêu cầu mới, tổ hợp chưa hỗ trợ hoặc cải tiến sau đó được chốt thành đợt tiếp theo; không tự kéo dài lộ trình bằng scope chưa được đồng ý.

## 5. Đối chiếu thiết kế → nơi xây và nơi kiểm chứng

Bảng này là chỉ mục bao phủ, không giữ thêm trạng thái task. Trạng thái nằm ở các bảng trên.

| Phần thiết kế có hiệu lực | Task xây/định nghĩa chính | Kiểm chứng trọng yếu |
|---|---|---|
| [Mục tiêu, ranh giới và một người + AI](KIDEA_DESIGN.md#scope) | P01-T01, P03-T01 | P03-T08, P11-T06: không chiếm task ngoài phạm vi, không tự Git/production |
| [Mười bước và từng Human gate](KIDEA_DESIGN.md#workflow) | P04–P06, P10 | P05-T06, P11-T01–T03: đi đủ gate, plan trước code |
| [State, approval theo phiên bản và gate bước con](KIDEA_DESIGN.md#state-approval) | P02-T02–T04, P03-T07 | P03-T08, P08-T05, P11-T06: reject/sai ID/approval cũ không được vượt gate |
| [Một nguồn hồ sơ, cây task và view dẫn xuất](KIDEA_DESIGN.md#files-view) | P02-T02, P03-T02–T05, P09 | P09-T02–T06: task DONE còn thấy, thiếu dữ liệu không thành DONE |
| [Resume qua phiên/máy](KIDEA_DESIGN.md#resume) | P02-T04, P03-T06, P08-T06 | P11-T06, P12-T03: ngắt giữa thao tác, thiếu bản rule, sai repo |
| [Change và current-only](KIDEA_DESIGN.md#change) | P08 | P08-T04–T07, P11-T04–T05: no-diff, cycle, requeue, migrate ID và tách target/release |
| [Ba bản đồ liên thông](KIDEA_DESIGN.md#three-maps) | P07 | P07-T04–T07, P08-T03: event/shared data/config, unknown, mapping sai ngữ nghĩa |
| [AC/business test và phương pháp nghiệp vụ](KIDEA_DESIGN.md#business-method) | P04 | P04-T05–T06: shared trước phần riêng, flow canonical, bao phủ có lý do |
| [Test specification, test thực thi và evidence](KIDEA_DESIGN.md#testing) | P06-T04, P07-T05, P10-T02 | P07-T06, P11-T02/T06: thiếu assertion, mock, fail/skip và sai phiên bản |
| [Monitoring và admin](KIDEA_DESIGN.md#operations) | P05-T03–T05, P10-T05 | P11-T03: mất tín hiệu, quyền thao tác, hành vi thực sau deploy |
| [Sáu cách gọi](KIDEA_DESIGN.md#commands) | P03, P08, P09 | P03-T08, P12-T02/T05: args sai, status chỉ đọc, host thực tế |
| [Một skill, đọc hướng dẫn theo việc](KIDEA_DESIGN.md#skill-structure) | P03-T01, P04–P06, P10 | P11 dùng phiên mới, P12-T04–T05 kiểm tra routing/đóng gói |
| [Coding rules theo môi trường](KIDEA_DESIGN.md#code-rules) | P06 | P06-T03/T05, P12-T03: vi phạm rule, xung đột, đúng phiên bản trên máy mới |
| [Quyết định triển khai còn mở](KIDEA_DESIGN.md#open-decisions) | Các task [H] ở P01/P02/P04/P06/P07/P08/P09/P12 | Không làm task phụ thuộc khi quyết định tương ứng chưa được Human duyệt |

## 6. Cách xử lý phát hiện mới và rủi ro

- Nếu kiểm tra cho thấy thiết kế sai: ghi vấn đề, dừng phần phụ thuộc, đề xuất sửa đúng mục của KIDEA_DESIGN.md, lấy Human quyết định rồi cập nhật impact/task/gate. Không sửa roadmap để âm thầm đổi hành vi đã duyệt.
- Nếu chỉ thiếu cách triển khai: chia task nhỏ và bổ sung test trong phase sở hữu; không mở framework hoặc hỗ trợ hàng loạt nền tảng để giải một ví dụ.
- Nếu công cụ không tìm đủ quan hệ: giữ trạng thái thiếu căn cứ, bổ sung tìm kiếm/review và giới hạn hỗ trợ; không hạ tiêu chí thành “graph không lỗi”.
- Nếu AI bỏ qua gate dù helper đúng: coi là lỗi hành vi Kidea, sửa hướng dẫn/routing và chạy lại phiên thử độc lập. Skill và file không tạo bảo đảm tuyệt đối, cần nói đúng phạm vi bằng chứng.
- Nếu test đòi môi trường/quyền chưa có: ghi blocker và yêu cầu cụ thể, không tự cài/deploy/thu thập dữ liệu ngoài quyền hoặc đổi test thành PASS.
- Khi cập nhật tiến trình, giữ tài liệu hiện hành rõ ràng: quyết định cũ không còn hiệu lực phải được thay/migrate đủ tham chiếu; giữ bằng chứng cần thiết cho nghiệm thu và khôi phục, không tích lũy các quy tắc cũ mâu thuẫn.

**Bước kế tiếp:** Human review lộ trình; sau khi được duyệt, bắt đầu đúng `P01-T01`, chưa nhảy sang viết SKILL.md hoặc helper.
