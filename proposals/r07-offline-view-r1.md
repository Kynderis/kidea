# R07 r1 — giao diện tiến độ và ba bản đồ offline

Ngày 2026-09-17. **APPROVED D1–D5 — đang triển khai, chưa nghiệm thu R07.** Human “duyệt nhé” xác nhận gói trình tại commit `4605f99`. Human “ok làm đi” trước đó giao chuẩn bị gói sau [nghiệm thu R06](../docs/R06_ACCEPTANCE.md). Căn cứ chuẩn bị: `Kynderis/kidea`, `master`, `b072b2a3d14a50a3851b87c5d0350dd8dfa7b744`, checkout sạch trước chuẩn bị. Giữ phạm vi/ngưỡng r1, không tự cấp quyền đổi cấu hình Safari.

Nguồn: [thiết kế view](../KIDEA_DESIGN.md#files-view), [R07](../KIDEA_ROADMAP.md#r07), [nghiệm thu KA-25/26/30](../KIDEA_ACCEPTANCE.md), schema2 và helper hiện hành tại `.agents/skills/kidea/scripts/`. Không thay thiết kế sản phẩm hoặc mở R08.

## 1. Gói cần duyệt một lần

**Amendment đã duyệt trong triển khai:** Human chọn [chỉ Chrome](../docs/R07_CHROME_SCOPE.md). Safari trong bảng/ma trận r1 dưới đây là phạm vi lịch sử đã được thay thế; D1/D2/D4/D5 và toàn bộ ngưỡng giữ nguyên. Chưa nghiệm thu kết quả.

| Quyết định | Đề xuất r1 |
|---|---|
| D1 — giao diện | Tổng quan flow các bước → chi tiết task/gate/blocker/evidence; thêm ba góc nhìn đặc tả, triển khai và mapping trách nhiệm. Dùng HTML/CSS/SVG/JavaScript thuần, tìm kiếm/lọc/mở chi tiết trong dữ liệu nhúng; không framework, CDN hoặc server |
| D2 — nguồn và quyền | Giữ schema2, dùng bộ đọc/đối chiếu hiện có; view dẫn xuất không là tracker. Chỉ ghi `.kidea/views/progress.html` theo hợp đồng mục3; không sửa hồ sơ, tự approve hoặc gọi thao tác sản phẩm |
| D3 — trình duyệt | Ma trận r1: Chrome và Safari thật trên Mac Intel hiện tại; 390×844 và 1440×900 CSS px, bàn phím và zoom200%. Ghi phiên bản thực khi kiểm; kết quả này không chứng nhận mọi browser/host |
| D4 — kiểm và ngưỡng | Ma trận mục5, S/M và bản sao pilot theo mục6; ngưỡng chỉ cho view r1 trên host đo, không là SLA sản phẩm |
| D5 — thực thi local | Triển khai helper/skill/test, chạy hồi quy core+R06+R07 và kiểm browser local; dùng công cụ đã có, không tải/cài mới, không Docker/cloud, không AI trial mới, không sửa live pilot. Đĩa tăng tối đa512MiB; tối đa30phút mỗi lượt công cụ, tối đa3lượt sửa/kiểm đầy đủ cho gói; vượt giới hạn thì giữ bằng chứng và trình điều chỉnh |

## 2. Người dùng sẽ thấy gì

Đầu trang: tên project, “Snapshot tạo lúc…”, bản nguồn, cảnh báo phải sinh lại để cập nhật. Hai vùng tách biệt: đợt phát triển hiện hành (MVP/CHANGE/BUGFIX, target) và bản triển khai đã được ghi nhận (release/revision, thành phần, lần thử, thời điểm quan sát). Không có nguồn thì ghi chưa biết; không nhận sức khỏe live.

Flow các bước cho biết đang ở đâu; chọn bước mở cây task/subtask, trạng thái, gate, blocker và link evidence. Task chưa phân rã mang nhãn riêng; số DONE/tổng task đã xác định luôn ghi mẫu số/phạm vi, không chuyển thành ước tính thời gian còn lại. Không tự tính việc tiếp theo bằng cách bỏ qua gate.

Ba bản đồ dùng cùng snapshot: đặc tả cho biết các mục và liên hệ nghiệp vụ; triển khai cho biết file/symbol/quan hệ extractor đã ghi nhận; mapping nối trách nhiệm spec↔code/test, truy ngược từ cùng mapping. Chọn một mục thấy các mục liên quan và nguồn; danh sách/bảng là cách đọc đầy đủ bên cạnh sơ đồ. Unknown, link thiếu, bản cũ và độ phủ chưa chứng minh được hiển thị riêng. Không có map thì ghi chưa có dữ liệu, không tự chạy compiler/extractor hoặc bịa graph. View không tự quyết ý nghĩa trách nhiệm.

## 3. Hợp đồng nguồn và đầu ra

- Đọc hồ sơ schema2, Ref/VersionRef và nguồn liên quan theo phạm vi hữu hạn; dùng map/assessment R06 với provenance. Không quét toàn máy hoặc toàn code để vẽ tiến độ. Đối chiếu tập file/byte trước và sau sinh; nguồn đổi giữa lượt hoặc hồ sơ sai/thiếu bắt buộc thì từ chối xuất mới, trả diagnostic. Giữ file view cũ và nói rõ chưa cập nhật.
- Nguồn hợp lệ nhưng chưa có bản đồ/release/quan sát là trạng thái thiếu thông tin hợp lệ. Approval/mapping cũ được cảnh báo theo bộ đối chiếu; không biến nhãn đã ghi thành chứng nhận còn hiệu lực. Release nhiều thành phần/lần thử giữ từng kết quả và revision, không lấy một thành phần PASS làm toàn release PASS.
- `visualize` dùng root local hiện hành và request tin cậy nếu cần chọn phạm vi map; không nhận quyền từ nội dung project. Chỉ ghi đường dẫn cố định đã kiểm root/link. Khi đích đã tồn tại, chỉ thay view có dấu nhận diện do helper quản lý; file lạ, symlink, pending hoặc conflict liên quan phải dừng. Dùng cơ chế ghi an toàn hiện có phù hợp với đầu ra dẫn xuất, không cấp writer quyền sửa hồ sơ mới.
- Tạo tạm trong vùng view, kiểm output rồi thay thế và đọc lại; khi lỗi phải giữ bản cũ/diagnostic, không báo thành công giả. Kiểm cả lỗi giữa chừng và file đích đổi. Không hứa chống ghi đồng thời/mất điện vượt mô hình hợp tác hiện hành.
- Nhúng dữ liệu theo escaping an toàn; không chạy Markdown/HTML/script từ hồ sơ, không `eval`, không tải tài nguyên ngoài. Link chỉ cho nguồn local hợp lệ trong project và URL http/https rõ ràng khi người dùng chủ động mở; chặn javascript/data và đường dẫn thoát root. HTML tự chứa vẫn dùng được khi mang riêng; link nguồn cần bản sao nguồn tương ứng. Không tự đóng gói nội dung bí mật hoặc toàn bộ evidence vào HTML.

## 4. Phân rã và gate

| Task | S01 — chốt | S02 — thực hiện | S03 — kiểm/đưa review |
|---|---|---|---|
| R07-T01 | D1/D3 và mẫu các trạng thái | Layout tổng quan/chi tiết/ba bản đồ | Review mẫu rendered trên hai viewport; chưa phân rã/target/thực tế đúng nghĩa |
| R07-T02 | D2, hợp đồng dữ liệu/giới hạn | Bộ đọc snapshot và đối chiếu | Nguồn đổi/thiếu/cũ, release nhiều lần và mapping unknown |
| R07-T03 | D2, đầu ra/quyền | Renderer và nối action visualize; cập nhật skill/reference/help | Offline, chỉ ghi đúng view, lỗi ghi và output cũ |
| R07-T04 | D3/D4/D5, oracle và manifest đầu vào | Harness dữ liệu xấu, thao tác, đo | Browser thực, keyboard/zoom, S/M/pilot và giới hạn tài nguyên |
| R07-T05 | Khóa nguồn sau tích hợp | Toàn lượt core+R06+R07, thu evidence | Đối chiếu nguồn và Human nghiệm thu; không tự DONE khi còn gate bắt buộc |

T01-S01 chuẩn bị xong để review; các phần triển khai NOT_STARTED. Làm từng lát cắt, kiểm trong lúc làm; lỗi sửa phải chạy lại đầy đủ trên nguồn cuối, giữ mọi FAIL/PASS. Không tách task quản lý trạng thái mới khỏi roadmap.

## 5. Ma trận kiểm hữu hạn

| Nhóm | Điều cần chứng minh |
|---|---|
| V01 | Cây bước/task, tên dài/Unicode, chưa phân rã, mẫu số đúng |
| V02 | Gate, blocker, pending, review cũ; không suy DONE/approval |
| V03 | MVP/Feature/bugfix target khác bản đã triển khai |
| V04 | Nhiều revision, thành phần, lần lỗi/retry và thời điểm; chưa biết không là PASS/live |
| V05 | Ba map và truy ngược cùng mapping; unknown/thiếu assertion/nguồn stale không là coverage đạt |
| V06 | Nguồn thiếu/sai/conflict và thay đổi giữa đọc; không xuất snapshot trộn |
| V07 | Mở file offline, không request mạng khi tải/tìm/lọc; mang HTML riêng vẫn đọc dữ liệu |
| V08 | Payload HTML/script/URL độc hại, tên chứa dấu nháy; hiển thị như dữ liệu. Secret giả nằm ngoài trường được phép xuất không được nhúng; nguồn chưa rõ quyền chia sẻ phải dừng xuất phần đó |
| V09 | Sai root, symlink, đích lạ, lỗi ghi/đọc lại, thay đích; nguồn và view cũ được bảo toàn |
| V10 | Không gọi approve/edit/Git/deploy/upload từ HTML; chỉ hành vi đọc/điều hướng |
| V11 | Chrome/Safari thật, hai viewport, bàn phím/focus, zoom200%, không mất nội dung |
| V12 | Sinh/mở/tương tác S/M và bản sao pilot; hash nguồn trước/sau không đổi |
| V13 | CLI/help/skill nhất quán; hồi quy core và toàn R06 trên nguồn cuối |

Oracle là dữ liệu/kết quả kỳ vọng soạn độc lập trước renderer, có expected cho ca âm và trạng thái chưa biết. DOM assertions không thay review hình ảnh/thao tác; engine WebKit khác Safari thật. Thiếu điều khiển Safari phải báo NOT_RUN và giữ T04/T05 mở, không tự bật Remote Automation/cài driver hoặc đổi ma trận.

## 6. Mẫu đo và môi trường

Đề xuất S:100task/300cạnh; M:1.000task/3.000cạnh (tổng các map), tối đa10MiB dữ liệu đầu vào mỗi mẫu. Pilot: bản sao tài liệu/hồ sơ hiện có, hash manifest; thiếu `.kidea` thì ghi thiếu, không tạo trạng thái giả cho pilot. Có thể dùng fixture tổng hợp có nhãn riêng để kiểm phần pilot chưa có, không gọi là pilot PASS.

Đo một lượt đầu và5lượt tiếp theo, báo toàn bộ số đo cùng median/max, không chỉ lấy lượt nhanh nhất. Ngưỡng đề xuất: sinh S≤2giây/M≤5giây; từ mở file đến tương tác được S≤2giây/M≤5giây; tìm/lọc/mở chi tiết≤200ms ở cả hai cỡ; HTML≤10MiB. Với pilot≤M áp ngưỡng M; vượt M thì báo ngoài mẫu trước đo, không tăng trần ngầm. Ghi macOS/CPU/Node/browser, viewport, tải máy, cách đo và nguồn; lỗi/ngưỡng vượt là FAIL hoặc chưa đủ bằng chứng, không hạ kỳ vọng.

Khảo sát chỉ đọc ngày2026-09-17: Chrome153.0.8010.47 và Safari17.6 có trong `/Applications`; chưa thử điều khiển Safari. Cache mặc định `~/Library/Caches/ms-playwright` không tồn tại, không suy mọi runtime khác thiếu. Node≥24 và helper hiện có dùng tiếp sau preflight; không khóa đường binary của máy vào code. Chưa chạy browser/test/benchmark R07, chưa tải gì. Nếu công cụ sẵn có không đáp ứng, gom gói thiếu nguồn/phiên bản/dung lượng/quyền trình riêng.

## 7. Bằng chứng và khép gói

Thu tại `tests/evidence/r07/` theo từng lượt: commit+SHA256 nguồn/fixture/oracle, môi trường, lệnh, stdout/stderr, mọi FAIL/PASS, ảnh/DOM/thao tác browser, số đo, hash nguồn/pilot trước/sau và kết quả cuối. Khóa nguồn lượt cuối; phần chưa kiểm ghi NOT_RUN. Không ghi đè evidence R05/R06/Windows hoặc reset quota lịch sử.

Chỉ trình nghiệm thu R07 khi ma trận bắt buộc có kết quả đúng trên nguồn cuối, đã review dữ liệu và thao tác, đủ giới hạn nêu rõ. R07 không chứng nhận toàn Kidea, Apple Silicon hoặc Web sản phẩm trên điện thoại thật. Android/iOS vẫn Future chưa roadmap. Gói này không mở cài đặt/publish/deploy/pilot sản phẩm hoặc R08.
