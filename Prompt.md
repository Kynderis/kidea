# Prompt tiếp tục công việc trên máy mới

Hãy coi toàn bộ nội dung dưới đây là yêu cầu làm việc của tôi trong project hiện tại.

## Bối cảnh

Tôi đang xây dựng một phương pháp dùng AI để tạo và duy trì **tài liệu nghiệp vụ cho các Feature đã chốt**. Hiện tại tôi chỉ tập trung vào phần này; tạm gác kiến trúc kỹ thuật, code, CI/CD và phát hành.

Trong project hiện chỉ có hai file Markdown đáng quan tâm:

- `cach_tao_dac_ta_nghiep_vu_voi_ai.md`: tài liệu phương pháp hiện tại và là **nguồn sự thật duy nhất** cho công việc này.
- `Prompt.md`: file bàn giao ngữ cảnh, không phải nguồn quy tắc nghiệp vụ.

Các tài liệu cũ đã bị xóa có chủ ý. Không khôi phục, viện dẫn hoặc suy đoán nội dung từ chúng.

## Mục tiêu

Hoàn thiện một cách làm thực tế để AI có thể:

1. nhận Feature Map đã được Human chốt theo `MVP / Future / Idea`;
2. đề xuất các nghiệp vụ dùng chung giữa nhiều Feature;
3. viết đặc tả nghiệp vụ dùng chung và phần riêng của từng Feature;
4. phân tích đệ quy cho tới khi có thể xác định rõ kết quả mong đợi;
5. liên kết các tài liệu thành bản đồ dependency và flow bằng link Markdown hai chiều;
6. sinh Business Test Specification có thể truy ngược về đúng rule, state, flow và dependency;
7. hỗ trợ impact analysis khi một mục thay đổi.

AI chịu trách nhiệm đọc, phân tích, đề xuất, soạn tài liệu, duy trì link, tìm ảnh hưởng và sinh test. Human chốt ý nghĩa nghiệp vụ, ranh giới, các điểm mơ hồ, phạm vi test và trạng thái `APPROVED`.

## Những nguyên tắc phải giữ

- Cách làm phải **đơn giản nhất có thể nhưng vẫn đủ chặt chẽ**, không sơ sài và không tạo thêm thuật ngữ, file hay công cụ nếu chưa có nhu cầu thực tế.
- Tài liệu hiện ở trạng thái `PROPOSED`; chưa được coi là quy chuẩn đã chứng minh đúng.
- Phải thử phương pháp trên một sản phẩm và Feature thật trước, rồi mới đúc rút để tạo Skill hoặc tự động hóa.
- AI có thể nhận diện ứng viên dùng chung từ toàn bộ Feature Map, nhưng chỉ đặc tả sâu phần thực sự cần cho cụm Feature MVP đang làm.
- Một phần có nơi dùng thứ hai chỉ kích hoạt **đề xuất tách dùng chung**. Chỉ tách sau khi kiểm tra cùng semantics, state ownership và được Human duyệt.
- Phân tích đệ quy phải làm rõ field, input/output, rule/công thức, state, lỗi, boundary, invariant và dependency; dừng khi với input/state cụ thể đã xác định được expected output/state và không còn `OPEN` làm thay đổi hành vi.
- Chỉ mô tả ý nghĩa nghiệp vụ. Cấu trúc dữ liệu, database, lock, transaction và framework test thuộc thiết kế kỹ thuật, trừ khi chúng làm thay đổi kết quả nghiệp vụ mà Human nhìn thấy.
- Markdown là nguồn sự thật. Graph chỉ là góc nhìn sinh ra từ ID ổn định, forward link và backlink; chưa xây graph database riêng.
- Không tự đặt `APPROVED`. Thay đổi semantics của nội dung đã duyệt phải quay lại `DRAFT`, kèm impact list để Human duyệt lại.
- Không cố vét cạn không gian test vô hạn. Bao phủ mô hình hữu hạn, lớp tương đương, ranh giới, rule/transition bắt buộc, invariant và rủi ro; dùng tổ hợp có chọn lọc cho phần còn lại.

## Cách cộng tác

- Luôn đọc toàn bộ `cach_tao_dac_ta_nghiep_vu_voi_ai.md` và kiểm tra trạng thái project trước khi nhận xét hoặc sửa.
- Viết bằng tiếng Việt, thẳng thắn, dễ hiểu và đủ ý. Giải thích thuật ngữ khó bằng ví dụ cụ thể.
- Phân biệt rõ nội dung đã được Human quyết định, đề xuất của AI và điểm còn `OPEN`.
- Khi tôi yêu cầu thay đổi, cập nhật trực tiếp file Markdown trong project, giữ nguyên các chỉnh sửa ngoài phạm vi và kiểm tra lại link liên quan.
- Với yêu cầu review hoặc tư vấn, hãy đọc và báo kết quả trước; không tự mở rộng phạm vi hoặc tạo thêm tài liệu.
- Chỉ hỏi Human những câu làm thay đổi semantics hoặc ranh giới. Làm hết phần không bị chặn trước rồi gom các câu hỏi ngắn, cụ thể.

## Việc cần làm ở lượt đầu tiên

1. Đọc toàn bộ `cach_tao_dac_ta_nghiep_vu_voi_ai.md`.
2. Tóm tắt lại cách bạn hiểu phương pháp trong khoảng 8–12 ý.
3. Chỉ ra ngắn gọn điểm nào đang mâu thuẫn, thiếu, quá phức tạp hoặc chưa thể kiểm chứng; phân biệt vấn đề thực tế với rủi ro mới chỉ suy đoán.
4. Đề xuất **một bước tiếp theo nhỏ nhất** để thử phương pháp trên sản phẩm thật.
5. Nếu chưa có Feature Map hoặc ví dụ sản phẩm cần thiết cho pilot, chỉ hỏi đúng thông tin tối thiểu còn thiếu.

Ở lượt đầu tiên chưa tạo Skill, chưa xây công cụ graph, chưa tạo hàng loạt template và chưa sửa tài liệu nếu tôi chưa yêu cầu. Mục tiêu là hiểu đúng tài liệu hiện có và bắt đầu một pilot thật, không tiếp tục mở rộng phương pháp chỉ bằng suy đoán.
