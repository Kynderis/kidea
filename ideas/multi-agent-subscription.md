# Ý tưởng để xem xét sau — Điều phối nhiều AI agent bằng subscription

Ngày ghi nhận: 2026-09-07.

Phân loại: `Idea` — chỉ xem xét sau khi Kidea bản đầu hoàn thiện và được nghiệm thu. Chưa duyệt thiết kế hoặc đưa vào kế hoạch triển khai; không thuộc MVP hiện hành, không thêm task vào roadmap.

Chỉ dẫn có hiệu lực hiện tại của Human: lưu lại ý tưởng để xem xét sau. Các câu yêu cầu hợp nhất tài liệu, phân loại MVP, vẽ Mermaid và đề xuất test trong nguyên văn bên dưới là nội dung được lưu, **không phải lệnh thực hiện trong lượt này**. Không thay cơ chế một việc hiện hành, Human gate, phạm vi bản đầu hoặc chính sách quyền đang có.

Tóm tắt để tìm lại: một trưởng nhóm điều phối worker/model theo độ khó và rủi ro; chỉ dùng subscription ChatGPT/Claude, không API trả phí hoặc phát sinh phí; giao việc có hợp đồng và bằng chứng, giới hạn sửa/chuyển model/song song, lưu trạng thái và đánh giá hiệu quả. Tên model là mong muốn trong ý tưởng, chưa xác minh khả dụng hoặc tích hợp. Khi xem xét lại cần kiểm tra tài liệu chính thức, quyền tài khoản và xung đột với thiết kế lúc đó, rồi xin Human duyệt riêng.

Liên hệ: [thiết kế hiện hành](../KIDEA_DESIGN.md#platform-matrix), [lộ trình hiện hành](../KIDEA_ROADMAP.md). File này chỉ lưu ý tưởng, không phải nguồn trạng thái xây dựng Kidea.

---

## Nguyên văn ý tưởng Human cung cấp

Tôi muốn bổ sung vào Kidea một yêu cầu xuyên suốt:

# Điều phối nhiều AI agent, nhiều model theo độ khó và rủi ro, chỉ dùng subscription

Hãy đọc lại đặc tả và các quyết định đã chốt của Kidea, sau đó hợp nhất yêu cầu dưới đây vào đúng phần liên quan của tài liệu nguồn sự thật.

Đây là cơ chế thực thi bên dưới quy trình Kidea, không phải một quy trình sản phẩm mới. Giữ nguyên các giai đoạn, checkpoint, phân loại MVP/Future/Idea và nguyên tắc human approval đã chốt. Không tự ý thay thế kiến trúc hoặc mở rộng phạm vi dự án.

Trước mắt hãy cập nhật yêu cầu và đề xuất thiết kế, chưa cài đặt công cụ hoặc triển khai code.

## 1. Mục tiêu và ràng buộc bắt buộc

Tôi muốn một agent trưởng nhóm sử dụng GPT-6 Astra để hiểu yêu cầu, chia việc, chọn agent/model phù hợp, kiểm tra kết quả và tổng hợp.

Các worker có thể sử dụng GPT-5.6 Luna, GPT-5.6 Sol, Claude Opus 4.8 hoặc một phiên GPT-6 Astra riêng, tùy tính chất công việc.

Mục tiêu tối ưu là:
“Hoàn thành nhiều công việc đạt yêu cầu nhất trong hạn mức subscription hiện có”, không phải giảm token bằng mọi giá.

Ràng buộc:
- Chỉ sử dụng các gói subscription ChatGPT và Claude tôi đang có.
- Không dùng API key, API trả phí, credits mua thêm hoặc cơ chế tự động phát sinh phí ngoài subscription.
- Không tự đổi phương thức đăng nhập/thanh toán khi hết hạn mức.
- Không trích xuất token đăng nhập để giả lập API hoặc sử dụng ngoài cơ chế được hãng hỗ trợ.
- Ưu tiên Codex chính thức cho agent GPT và Claude Code chính thức cho agent Claude.

Các tên model phía trên là mong muốn của tôi, không phải bằng chứng rằng tất cả đều khả dụng. Phải kiểm tra tài liệu chính thức và khả năng thực tế của phiên bản công cụ/tài khoản trước khi chốt cách tích hợp. Không tự bịa model ID, lệnh CLI hoặc khóa cấu hình.

Nếu model/tính năng không khả dụng, báo rõ và đề xuất phương án vẫn nằm trong subscription; không âm thầm thay thế.

## 2. Vai trò và lựa chọn model

Thiết kế chính sách phân việc có thể cấu hình, tách biệt với phần tích hợp Codex/Claude Code.

Định hướng khởi đầu:

- Astra điều phối:
  Giữ mục tiêu, phạm vi, dependency, tiêu chí nghiệm thu; chọn worker; giải quyết ngoại lệ; tổng hợp kết quả. Không giám sát từng thao tác nhỏ.

- Luna:
  Việc nhỏ, rõ ràng, ít rủi ro, dễ kiểm chứng: tìm thông tin, cập nhật tài liệu, sửa theo mẫu, viết test từ các trường hợp đã chốt.

- Sol:
  Lựa chọn mặc định cho triển khai cần suy luận: tính năng có logic, sửa bug đã khoanh vùng, refactor có phạm vi rõ, thiết kế kiểm thử thông thường.

- Opus:
  Lựa chọn bổ sung cho triển khai khó, phản biện hoặc review độc lập; dùng khi phù hợp với task và hạn mức, không mặc định gọi cho mọi việc.

- Astra chuyên trách:
  Một agent với ngữ cảnh riêng để xử lý bài toán đặc biệt khó, mơ hồ hoặc ảnh hưởng lớn; không lặp lại toàn bộ công việc của trưởng nhóm.

Không mặc định một thứ tự năng lực tuyệt đối giữa các model. Chính sách cần điều chỉnh bằng kết quả thực tế trên dự án.

Việc cực nhỏ mà trưởng nhóm đã đủ ngữ cảnh có thể được làm trực tiếp, tránh chi phí tạo worker không cần thiết.

## 3. Quy tắc định tuyến task

Trước khi giao việc, đánh giá tối thiểu:
- Độ phức tạp và mức mơ hồ.
- Phạm vi ảnh hưởng, hậu quả nếu sai.
- Khả năng kiểm chứng bằng công cụ/test.
- Ngữ cảnh và công cụ cần thiết.
- Hạn mức còn lại nếu quan sát được.

Không dùng số dòng code hoặc số file làm thước đo duy nhất. Một thay đổi nhỏ liên quan số dư, bảo mật hoặc dữ liệu có thể cần mức kiểm soát cao.

Task khó hoặc rủi ro cao được giao đúng model ngay từ đầu, không bắt buộc thử model nhỏ trước.

Cho phép cấu hình mức suy luận khi công cụ/model hỗ trợ. Không mặc định dùng mức cao nhất cho tất cả task.

## 4. Hợp đồng giao việc và kết quả

Mỗi task cần một gói thông tin gọn, đủ dùng:
- ID, giai đoạn, mục tiêu và phạm vi không được làm.
- Tài liệu nguồn sự thật, file liên quan và dependency.
- Quyền được cấp, tiêu chí nghiệm thu và cách kiểm chứng.
- Agent/model được chọn cùng lý do ngắn gọn.
- Giới hạn thực thi, số lần sửa và điều kiện dừng.

Worker phải trả:
- Kết quả và các file/artifact đã thay đổi.
- Lệnh kiểm tra đã chạy, kết quả thực tế và bằng chứng.
- Vấn đề còn lại, phần chưa kiểm chứng và trở ngại.

Phân biệt rõ model được yêu cầu với model thực tế đã xác nhận. Không chỉ đổi tên vai trò trong prompt rồi báo rằng đã chạy một model khác.

Lưu trạng thái task để có thể tiếp tục sau gián đoạn và tránh thực thi trùng.

## 5. Sửa lỗi, nâng cấp model và hết hạn mức

Chính sách khởi đầu, cho phép cấu hình:
- Tối đa một lần tự sửa khi lỗi và hướng sửa đã rõ.
- Nếu vẫn không đạt, tối đa một lần chuyển model phù hợp hơn.
- Nếu vẫn bế tắc, trưởng nhóm đánh giá lại cách chia việc, yêu cầu hoặc môi trường; không lặp vô hạn.

Khi bàn giao phải chuyển cả bằng chứng lỗi và các hướng đã thử, tránh điều tra lại từ đầu. Agent sau vẫn phải kiểm chứng, không mặc định tin kết luận trước.

Phân biệt lỗi do chất lượng lời giải với lỗi môi trường, thiếu quyền hoặc hết hạn mức. Không đổi model liên tục để xử lý một lỗi công cụ.

Khi hết hạn mức:
- Chỉ chuyển sang model còn khả dụng nếu vẫn đáp ứng chất lượng/rủi ro.
- Nếu không có lựa chọn phù hợp, lưu trạng thái và báo chờ.
- Không tự mua thêm usage, dùng API hoặc hạ tiêu chuẩn nghiệm thu.

## 6. Hiệu quả ngữ cảnh và chạy song song

- Chỉ chuyển ngữ cảnh cần thiết, không sao chép toàn bộ hội thoại cho mọi worker.
- Ưu tiên tài liệu chuẩn, đường dẫn file, diff và báo cáo ngắn; log dài lưu riêng.
- Gom các việc liên quan thành task vừa đủ, không chia vụn thành hàng chục lượt giao việc.
- Chạy build, lint, test bằng công cụ trước; model phân tích kết quả liên quan.
- Không tạo nhiều tầng agent theo mặc định.

Giới hạn khởi đầu: tối đa hai worker cùng chạy, chưa tính trưởng nhóm. Worker không tự tạo thêm worker.

Chỉ chạy song song khi task độc lập. Nếu cùng sửa code, phải có workspace/worktree tách biệt và quy tắc tích hợp; nếu chưa bảo đảm được thì chạy tuần tự.

Các giới hạn quan trọng phải được thực thi bằng cấu hình/runner khi có thể, không chỉ dựa vào prompt.

## 7. Chất lượng, bảo mật và human approval

Cơ chế điều phối phải áp dụng được vào các bước Kidea hiện có như phân tích, đặc tả, thiết kế, lập trình, kiểm thử và kiểm tra UI; không chỉ coding.

Giữ nguyên checkpoint con người duyệt. Agent không tự đổi nghiệp vụ, làm yếu test, mở rộng quyền, thực hiện thay đổi nguy hiểm hoặc vượt qua bước phê duyệt.

Task rủi ro cao cần review độc lập. Task nhẹ có kiểm chứng tự động đủ mạnh không bắt buộc thêm một lượt review bằng model đắt.

Không coi lời báo “đã xong”, sự đồng ý giữa các model hoặc việc test hiện có chạy qua là bằng chứng duy nhất rằng yêu cầu đã được đáp ứng.

Áp dụng quyền tối thiểu; không tự bỏ sandbox, không cấp production credential cho worker. Không tự commit, push, merge hoặc deploy ngoài chính sách đã được tôi phê duyệt.

## 8. Theo dõi hiệu quả và triển khai tăng dần

Ghi nhận khi có dữ liệu:
- Loại task, model thực tế và mức suy luận.
- Kết quả nghiệm thu, số vòng sửa và số lần chuyển model.
- Thời gian, token hoặc usage quan sát được.

Phân biệt token với hạn mức subscription và chi phí tiền. Không tự suy ra tỷ lệ tiêu hao hoặc bịa số liệu khi công cụ không cung cấp.

Sau khoảng 20–30 task thực tế, đề xuất điều chỉnh chính sách phân việc. Ưu tiên tỷ lệ hoàn thành đúng và tổng nguồn lực cho một task được nghiệm thu.

MVP của cơ chế này cần nhỏ và dễ kiểm chứng: một trưởng nhóm, số worker giới hạn, định tuyến rõ, có lưu trạng thái, bằng chứng và điều kiện dừng. Không dựng framework phức tạp trước khi kiểm chứng luồng cơ bản.

## 9. Đầu ra tôi cần

Hãy:
1. Hợp nhất yêu cầu vào các tài liệu nguồn sự thật phù hợp của Kidea, tránh lặp nội dung.
2. Phân loại phần cần cho MVP và phần để Future.
3. Vẽ Mermaid thể hiện giao việc → thực thi → kiểm chứng → sửa/nâng cấp → nghiệm thu hoặc dừng.
4. Đề xuất tiêu chí nghiệm thu và test case cho chính cơ chế điều phối, gồm cả model không khả dụng, sai chế độ đăng nhập, hết hạn mức, worker lỗi và vượt giới hạn sửa.
5. Phân biệt rõ: yêu cầu đã chốt, thiết kế đề xuất và khả năng công cụ còn phải xác minh.

Viết theo dạng đặc tả có thể tiếp tục triển khai, cô đọng, không biến thành biên bản hội thoại. Nếu có xung đột với quyết định trước, chỉ rõ để tôi duyệt thay vì tự thay thế.
