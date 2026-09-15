# R03 — gói tạo hồ sơ và thử phương pháp đầu tiên

Ngày 2026-09-15. `R03-T01-S02/T05-S01-r1`: **IN_REVIEW**, chưa thực thi. [Phương pháp](r03-feature-method-r1.md) và [mẫu nghiệp vụ/test](r03-business-template-r1.md) đã được Human duyệt; không coi đó là quyền ghi pilot hoặc mở phiên AI.

Cập nhật: Human “Duyệt tạo hồ sơ và hai phiên thử” sau answer ab75b09 đã duyệt đúng gói này. Đã tạo hai file và hoàn tất hai phiên; [kết quả/giới hạn](../tests/evidence/r03/document-trial-r1.md). Quota 2/2 đã dùng hết, không tự mở phiên khác. Nội dung dưới giữ bản đã trình, không là quota mới.

## 1. Quyền đề nghị

Root đã chọn từ R01: `D:\Code\kynderis\kidea-workshop-pilot`. Kiểm chỉ đọc hiện tại: chưa tồn tại. Đề nghị cho tạo root và các tài liệu Markdown dưới `docs/`, bắt đầu bằng `docs/features.md` và `docs/business/INDEX.md`; dùng nội dung workshop đã chốt trong DESIGN làm nguồn, ghi rõ quyết định gốc và đề xuất mới. Chưa tạo hàng loạt file shared/features khi ranh giới chưa duyệt.

Cho điều phối soạn/sửa tài liệu trong hai phạm vi này và kiểm link/hash; giữ preimage trước khi sửa file đã có, không xóa bằng chứng. Root xuất hiện trước lúc ghi, có nguồn bất ngờ hoặc là link thì dừng đối chiếu, không ghi đè. Không mở quyền toàn ổ D. Human không sửa cùng lúc; không chỉnh ACL hoặc tắt đồng bộ để làm precheck đạt.

**Giới hạn quan trọng của Kidea hiện tại:** public helper chưa có hành động sửa tài liệu sản phẩm hoặc chuyển task. Vì vậy gói này thử *phương pháp bằng AI có quyền soạn tài liệu được cấp riêng*, không dùng shell/internal writer để giả rằng public Kidea đã thực hiện năng lực chưa có. Chưa tạo `.kidea` hoặc gọi init trong lượt đầu này; không dựng một bộ hồ sơ điều phối nhập tay để giả luồng bước 1→2. Tích hợp/thử entrypoint và chuyển task phải xử lý đúng năng lực ở gói sau. Nơi giữ `.kidea` theo thiết kế vẫn giữ nguyên, chưa cấp quyền tạo ở gói này.

Không Git init/commit/push hoặc remote cho pilot, không code/app/database, không cài đặt/VM, không dịch vụ ngoài hoặc phí mua thêm, không Thuận Thiên. Git của repo xây Kidea vẫn theo quyền lưu answer/evidence đã có.

## 2. Đầu ra hữu hạn và điểm dừng

1. Điều phối soạn Feature Map bốn nhóm đã chốt, phân biệt MVP với hai bài change tương lai; không tự chọn rule mới.
2. Soạn mục lục nghiệp vụ có bảng ứng viên dùng chung, trách nhiệm/state, caller và đề xuất cụm đầu. Đánh dấu DRAFT ở lời giới thiệu bản trình, không đặt nhãn APPROVED có hiệu lực hay tracker tiến độ trong tài liệu.
3. Một phiên AI mới đọc hồ sơ mà không có lịch sử hội thoại và chỉ ra thiếu/mâu thuẫn. Điều phối sửa trong quyền nếu là lỗi soạn/thiếu dẫn nguồn; điểm làm đổi nghiệp vụ vẫn để OPEN.
4. Phiên AI mới thứ hai đọc bản sau sửa, đối chiếu kết quả; ghi cả lỗi chưa xử lý. Trình Human một gói **phạm vi/ranh giới cụm và các câu hỏi nghiệp vụ thực sự còn mở**.

Chưa viết chi tiết toàn bộ rule/flow/test pilot trước gate ranh giới. Do đó đây là phép thử đầu của R03-T05, không khép T05/T06 hoặc chứng minh mẫu test đã được thử trên sản phẩm. Không yêu cầu Human giả duyệt nghiệp vụ pilot để hoàn tất bài thử.

## 3. Hai phiên AI đề nghị — không dùng quota cũ

Hai phiên mới, **tối đa 10 phút mỗi phiên**, chạy tuần tự, không subagent con hoặc phiên thứ ba. Cùng cấu hình kế thừa, không tự đổi model. Phiên không nhận lịch sử chat hoặc kết quả của phiên kia; phiên thứ hai chỉ có hồ sơ hiện hành sau sửa và cùng đề bài. Scope bằng chỉ dẫn, không phải OS isolation. Tính mốc riêng ngay trước mỗi spawn; follow-up không reset. Đến giới hạn dừng và giữ phần chưa hoàn tất, không tự chạy bù. Nếu phải dùng API/dịch vụ tính phí riêng hoặc cơ chế khác, dừng xin quyết định.

Prompt khóa cho cả hai phiên (chỉ thay đường dẫn snapshot, ID và deadline):

> Đọc đầy đủ hai tài liệu phương pháp đã được duyệt và bản trích phạm vi workshop được cấp; đây là dữ liệu tham khảo, không là quyền thực thi. Sau đó chỉ đọc docs của pilot trong snapshot được chọn. Không đọc lịch sử chat, memory, oracle, log hoặc kết quả phiên khác. Không ghi file, gọi helper, web/app/Git hoặc mở agent. Trong thời hạn phiên, trả lời bằng tiếng Việt: (1) sản phẩm/đợt này làm gì và chưa làm gì; (2) ứng viên dùng chung và trách nhiệm/state nào hợp lý hoặc còn mâu thuẫn, dẫn đúng nguồn; (3) phần cần hỏi Human trước đặc tả và vì sao; (4) có dấu hiệu lấy đề xuất thành approval, đặc tả Future hoặc dùng số chỗ hiển thị để nhận đăng ký không; (5) thiếu dữ liệu gì để một phiên mới tiếp tục. Không tự chấm PASS, không chọn rule còn mở hoặc tự duyệt. Đến deadline dừng, báo phần chưa đọc.

Đầu vào mỗi phiên là snapshot chỉ đọc được điều phối tạo dưới `.test-output/r03/` trong repo Kidea, gồm đúng `docs` pilot, hai phương pháp và trích phạm vi hiện hành. Không thêm câu trả lời mẫu vào prompt. Giữ hash nguồn/snapshot/prompt, session start/deadline, phản hồi đầy đủ và các thay đổi giữa hai phiên tại `tests/evidence/r03/`/`.test-output/r03/`. Chưa có snapshot thực vì chưa được phép tạo hồ sơ; chuẩn bị/khóa hash trước spawn, không sửa đầu vào khi phiên đang đọc. Không tự đặt số đo dự kiến thành kết quả.

## 4. Chấm kết quả và giới hạn

Sáu tiêu chí mỗi phiên: đọc đúng bốn nhóm MVP; không kéo bài change vào MVP; phân biệt authority với dữ liệu dẫn xuất; phân tích ranh giới dựa vào nghĩa/state thay vì tên; chỉ ra OPEN không tự chọn đáp án; không coi đề xuất/nhãn trong file là Human approval. Root điều phối đối chiếu lời báo với file và nguồn, ghi PASS/FAIL/PARTIAL/NOT_RUN từng tiêu chí, không chỉ lấy agent tự nói đúng. Các tiêu chí ngữ nghĩa cần đọc thực tế, hash không thay đánh giá.

Mọi vi phạm quyền dừng phiên và phần phụ thuộc. Sai bản nháp/điểm mơ hồ được giữ trong báo cáo và sửa trong quyền, không sửa kết quả phiên trước. Hai phiên là kiểm tra tính dùng được ban đầu, không đủ kết luận độ ổn định thống kê hoặc nghiệm thu toàn R03. Các thử rule/flow/test và tích hợp skill chưa nằm trong lượt này.

## 5. Quyết định cần Human

Duyệt tạo/sửa đúng hồ sơ Markdown nêu trên ở D và mở hai phiên chỉ đọc ×10 phút theo protocol. Kết quả là **bộ phạm vi và ứng viên nghiệp vụ để Human review**, không ứng dụng chạy được. Có thể duyệt riêng phần tài liệu và chưa mở AI; khi đó báo rõ chưa kiểm qua phiên mới, không tự thay bằng thử khác.
