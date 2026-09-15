# R03 — mở phần phương pháp và đối chiếu nguồn

Ngày 2026-09-15. Trạng thái: đối chiếu đầu vào hoàn tất; phương pháp chi tiết chưa được duyệt hoặc tích hợp vào skill.

## Quyền và căn cứ

Human “Duyệt R02, mở R03” sau answer tại `158f24e9a151184107354e7077c2d1dd67c38f4c` chấp nhận kết quả lõi R02 trong giới hạn đã trình và mở R03 phần phương pháp bước 1–2. Không cấp quyền tạo hồ sơ pilot, thêm phiên AI, cài đặt, code hoặc deploy sản phẩm. Không dùng gói này để khởi tạo `.kidea` cho repo xây Kidea.

Nguồn hiện hành: [DESIGN](../KIDEA_DESIGN.md), [R03](../KIDEA_ROADMAP.md#r03), [ranh giới pilot](../KIDEA_DESIGN.md#pilot-lab-baseline), [nguồn tham khảo](../references/business-spec/README.md). Ba file tham khảo đã được đọc, giữ nguyên; prompt cũ chỉ là dữ liệu lịch sử, không thay phạm vi hiện tại.

## Kết quả đối chiếu T01-S01

| Nội dung tham khảo | Kết luận khi xây R03 | Căn cứ/phần xử lý |
|---|---|---|
| Feature Map → ứng viên dùng chung → cụm MVP → đặc tả riêng | Giữ hướng làm theo cụm; Future/Idea không kéo theo đặc tả sâu | DESIGN quy trình/MVP; T02 |
| Có nơi dùng thứ hai thì tách | Chỉ đề xuất sau đối chiếu ý nghĩa, trách nhiệm và state; Human duyệt ranh giới trước tách | Prompt cũ đã điều chỉnh phác thảo ban đầu; T02 |
| Trạng thái, approved-by/at nằm trong file nghiệp vụ | Không sao chép thành trạng thái có hiệu lực thứ hai; review/confirmation ở `.kidea`, trỏ đúng nguồn/bản | DESIGN state-approval/files-view; hợp đồng R02 |
| Mục lục nghiệp vụ giữ đang xử lý/điểm quay lại | Mục lục chỉ tra cứu nội dung; current task/returnStack ở work. Không dựng tracker song song | DESIGN một việc hiện hành và mô hình hồ sơ R02 |
| ID/anchor, forward link và backlink | Giữ link đúng mục; không ALL/NEXT hoặc thêm loại quan hệ. Thay ID phải xử lý toàn bộ caller/test và giữ căn cứ bản cũ theo R02 | DESIGN dependency/version; T03, không lấy việc tái dùng tên trong nguồn cũ làm quyền tái dùng identity hồ sơ |
| Phân tích đến expected output/state rõ | Giữ điều kiện không còn OPEN đổi hành vi; công thức cần đơn vị/biên/làm tròn khi liên quan | T03 |
| Flow table, Mermaid, AC và business test | Bảng flow là nguồn, hình là góc nhìn. AC là điều kiện chấp nhận; test cụ thể truy đúng rule/nhánh/state. Không lấy n+1 làm công thức chung | DESIGN testing; T03/T04 |
| Vét cạn toàn bộ tổ hợp | Không hứa bao phủ không gian vô hạn. Chọn mô hình hữu hạn, biên, transition và rủi ro; mức tổ hợp cụ thể cần review theo mẫu | T04; chưa chốt ngưỡng hay công cụ sinh test |
| Thử rồi mới đóng phương pháp | Giữ kiểm chứng trên hồ sơ pilot và gate riêng; nguồn đề xuất không thành năng lực đã kiểm chứng | T05/T06 |

Kiểm tra chỉ đọc ngày 2026-09-15: `D:\Code\kynderis\kidea-workshop-pilot` chưa tồn tại. Root này đã được chọn tại R01-T04-S03; không hỏi lại chọn pilot hoặc chuyển sang Thuận Thiên. Quyền tạo/ghi lần đầu chưa có. Việc này không chặn soạn phương pháp trong repo Kidea.

## Lát cắt thực hiện và gate

| Subtask | Đầu ra / kiểm tra | Gate và trạng thái lúc mở |
|---|---|---|
| T01-S01 | Đối chiếu nguồn cũ/hiện hành, phạm vi pilot và quyền | DONE, kết quả tại tài liệu này; không có nguồn cũ nào được nâng thành quy chuẩn |
| T01-S02 | Gói quyền hữu hạn, kiểm root trước ghi; nêu Git/AI riêng | DONE; [docs r1 APPROVED và đã tạo](r03-pilot-permission-r1.md), chưa `.kidea`/Git |
| T02-S01 | Bản phương pháp ý tưởng → Feature Map → ứng viên dùng chung/cụm; mẫu phân biệt lời Human, đề xuất và OPEN | DONE; [bản đề xuất](r03-feature-method-r1.md), chưa tích hợp skill |
| T02-S02 | Review cách xác định ranh giới dùng chung, điểm dừng và gói Feature | DONE; [D1 APPROVED](r03-feature-method-r1.md) sau answer dc2d196, không duyệt ranh giới nghiệp vụ pilot |
| T03-S01 | Mẫu nhỏ rule/state/flow/data và link hai chiều, ví dụ có success/rejection | DONE; [mẫu đề xuất](r03-business-template-r1.md), không chọn database/lock |
| T04-S01 | Mẫu AC/business test và bảng bao phủ có lý do loại tổ hợp | DONE; [mẫu đề xuất](r03-business-template-r1.md), không báo test sản phẩm đã chạy |
| T03/T04-S02 | Gói review mẫu phương pháp + cách ghi phạm vi bao phủ hữu hạn | DONE; D1 APPROVED sau answer c91fba7, không duyệt coverage pilot bằng ví dụ |
| T05-S01 | Chuẩn bị gói kiểm chứng hồ sơ pilot: phiên mới, kịch bản, số lần/thời gian, quyền và log | DONE cho [lượt đầu](r03-pilot-permission-r1.md), 2/2 phiên đã dùng; không bao trùm loạt sau |
| T05-S02 | Thực hiện lát cắt nghiệp vụ pilot qua phương pháp, đối chiếu đầu ra | IN_PROGRESS; Feature Map/ứng viên đã đọc qua hai phiên, [chờ review ranh giới](r03-pilot-boundary-review-r1.md); chưa toàn rule/flow/test |
| T06-S01 | Sửa mơ hồ theo bằng chứng, tích hợp skill và hồi quy lõi đúng nguồn cuối | TODO; dùng skill-creator khi thực sự sửa skill; chưa thực hiện ở gói mở phase |
| T06-S02 | Review kết quả/giới hạn phương pháp, quyết định mở R04 | TODO; Human, không đồng nhất approval phương pháp với sản phẩm pilot |

## Việc tiếp theo và phần chưa cần quyết

T02-S01 sẽ soạn cách hỏi để đi từ ý tưởng đến phạm vi đợt hiện tại, nhận diện phần dùng chung và biết lúc nào đủ rõ để viết nghiệp vụ. Ví dụ workshop chỉ minh họa phương pháp trên phạm vi đã có, không tự quyết thứ tự lỗi, chi tiết retry hoặc rule còn mở của pilot.

Giữ MVP workshop: mỗi người tối đa một ACTIVE trên mỗi workshop; đăng ký/hủy khi OPEN; không vượt sức chứa; retry không tác dụng phụ lần hai. Giới hạn hai ACTIVE toàn hệ thống và hủy khi PAUSED là bài change về sau, không kéo vào MVP đầu. Không đặc tả Future trước chỉ để lấp template.

Chưa cần Human cài hoặc chuẩn bị môi trường. Khi đã có mẫu đủ cụ thể, gom các lựa chọn phương pháp còn mới và quyền hồ sơ pilot cần dùng thành gói trước chạy; không xin lại thao tác đọc/soạn thông thường trong repo này. Chưa đặt số phiên AI hoặc hứa thời gian hoàn thành khi chưa chuẩn bị protocol.
