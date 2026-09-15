# R04 — Kế hoạch mở phần thiết kế sản phẩm

Ngày 2026-09-15. Kế hoạch đã soạn; chưa phải phương pháp hoặc thiết kế sản phẩm được duyệt.

Cập nhật: K1–K7/AR-r1 đã được Human duyệt sau `6abd985`. Tích hợp và hồi quy đã chạy; review độc lập phát hiện F01–F05, bản sửa AR-r2/C1–C5 đã được kiểm nhưng CHƯA áp dụng/duyệt. Quay gate kiến trúc T05-S02 cho đúng phần sửa; T06-S01 chờ áp dụng sau gate, không khép R04. [Gói sửa](../tests/evidence/r04/design-r1/correction-request.md), [bằng chứng](../tests/evidence/r04/design-r1.md).

## Căn cứ và kết quả mở phase

Human “Duyệt kết quả R03, mở R04” sau answer tại `0dd5a25c9aab9dfb05fe503520ea5e6b183d5807` chấp nhận [kết quả cuối R03](../tests/evidence/r03/recheck-r1.md) cùng giới hạn: review hồ sơ, không phải ứng dụng đã chạy. R03-T05-S02 và T06-S02 DONE. Lịch sử FAIL/PARTIAL giữ nguyên cho các bản trước.

Nguồn áp dụng: [R04 và sáu task](../KIDEA_ROADMAP.md#r04), [cách duyệt gói](../KIDEA_ROADMAP.md#risk-first-review-approved), [thiết kế Kidea](../KIDEA_DESIGN.md), [tiêu chí nghiệm thu](../KIDEA_ACCEPTANCE.md). Các ngưỡng chất lượng chưa duyệt không trở thành cam kết khi mở phase.

## Kidea sẽ học làm gì?

R03 hướng dẫn viết rõ sản phẩm phải làm gì. R04 hướng dẫn biến nghiệp vụ đó thành thiết kế đủ rõ để bước sau xây và kiểm tra. Workshop là bài mẫu xuyên suốt để thử hướng dẫn Kidea, không phải đổi mục tiêu sang kinh doanh workshop.

| Phần | Ví dụ đầu ra cần rõ | Rủi ro cần tránh |
|---|---|---|
| Chất lượng | Với tải nào, người dùng chờ tối đa bao lâu; mất dữ liệu bao nhiêu là chấp nhận được | Tự đặt con số rồi báo đã đạt khi chưa đo |
| Trải nghiệm và SEO | Bấm đăng ký gặp mất mạng thì hiện gì; trang công khai hiển thị nội dung thế nào | Cho bấm lại thành đăng ký mới; lấy thiết kế SEO làm quyền mở indexing lab |
| Theo dõi vận hành | Dữ liệu cập nhật chậm hoặc mất tín hiệu phải hiện cảnh báo và ai xử lý | Không nhận được dữ liệu nhưng vẫn báo hệ thống tốt |
| Quản trị | Ai được sửa sức chứa, lỗi hiển thị thế nào, lưu dấu thao tác gì | Màn hình admin tự thêm nghiệp vụ ngoài R03 |
| Kiến trúc | Thành phần nào giữ dữ liệu đúng, web/mobile gọi chung backend thế nào | Thêm service/công cụ không cần thiết hoặc hiểu tài liệu là đã triển khai |

## Phân rã hữu hạn và gate

| Subtask | Đầu ra / kiểm tra | Trạng thái và điều kiện |
|---|---|---|
| R04-T01-S01 | Đối chiếu phạm vi phase, ghi kế hoạch/quyền/gate tại đây; kiểm khép R03 đúng bản | DONE [A], chỉ kế hoạch mở phase |
| R04-T01-S02 | Soạn một gói phương pháp cho toàn bước 3–7: mẫu tối thiểu, cách hỏi, ví dụ, tiêu chí review; phân loại đã chốt/mới/chưa đủ căn cứ | DONE [A], M0–M5/D1–D6/P1–P3/V1–V8 tại gói r1; chưa tích hợp |
| R04-T01-S03 | Trình chung lựa chọn phương pháp, ngưỡng đề xuất nếu đủ căn cứ, danh sách quyền và protocol kiểm chứng hữu hạn | DONE [H], D1–D6 APPROVED sau 7ef7f1b; không duyệt trước ngưỡng/kiến trúc chưa có |
| R04-T01-S04 | Soạn hồ sơ quality Q-r1 theo M1, snapshot trước/sau và kiểm nguồn/link | DONE [A], một file mới và backlink; không đổi nghiệp vụ R03 |
| R04-T01-S05 | Duyệt Q1–Q6 của quality Q-r1, gate bước 3 | DONE [H], Human “Duyệt chất lượng R04” sau a24681b; không phải số đo thực tế |
| R04-T02-S01 | Soạn/diễn tập UX và SEO theo phương pháp được duyệt; rà loading/rỗng/lỗi/quyền và nguồn nghiệp vụ | DONE [A], experience UX-r1, 15 nhóm ca NOT_RUN và kiểm tài liệu; chưa browser/device test |
| R04-T02-S02 | Review đầu ra bước 4 và SEO đúng bản; bước 3 đã khép ở T01-S05 | DONE [H], UX1–UX6 APPROVED sau 6790a9e; không phải giao diện đã chạy |
| R04-T03-S01 | Soạn/diễn tập tín hiệu, độ tươi, ngưỡng, người nhận và đường cảnh báo độc lập phiên AI; rà mất telemetry | DONE [A], operations OP-r1; 15 nhóm ca NOT_RUN và kiểm tài liệu, chưa hệ thống giám sát |
| R04-T03-S02 | Duyệt đầu ra bước 5: O1–O6, đúng OP-r1 | DONE [H], Human “Duyệt thiết kế vận hành R04” sau 86c051c; không cấp cài/chạy |
| R04-T04-S01 | Soạn/diễn tập admin truy nguồn rule/quyền, xác nhận/audit/lỗi; rà không thêm rule | DONE [A], admin AD-r1, 15 nhóm ca NOT_RUN và kiểm tài liệu; không ứng dụng đã chạy |
| R04-T04-S02 | Review đầu ra bước 6; bước 5 có gate riêng T03-S02 | DONE [H], Human “Duyệt thiết kế quản trị R04” sau ccaeb1d, A1–A6/AD-r1; không tự duyệt hợp đồng kiến trúc |
| R04-T05-S01 | Soạn/diễn tập kiến trúc và hợp đồng: owner/API/event/cache/lỗi/deploy/recovery/tương thích/quyền; đối chiếu thiết kế đã duyệt | DONE [A], AR-r1, 18 nhóm runtime NOT_RUN; kiểm nguồn và backlink, không cài/chạy |
| R04-T05-S02 | Review đầu ra bước 7 đúng bản, nêu phần cần đo sau | IN_REVIEW [H], approval K1–K7/AR-r1 giữ lịch sử; quay gate cho C1–C5/AR-r2 sau findings, không reset Q/UX/OP/AD |
| R04-T06-S01 | Tích hợp hướng dẫn đã duyệt; kiểm tra tài liệu và hồi quy liên quan; thử độc lập chỉ theo protocol được cấp | BLOCKED [A] chỉ ở áp dụng bản sửa chờ gate; đã tích hợp, core 265/265, R04 15/15, validator PASS, dùng đúng 1 reviewer và recheck cùng cửa sổ; chưa nhận bản sửa đã vào pilot |
| R04-T06-S02 | Báo cáo bằng chứng/giới hạn và chấp nhận kết quả R04 | TODO [H], sau kiểm chứng; không gọi thiết kế monitoring là hệ thống đang hoạt động |

S02 chuẩn bị cả phase để không xin lắt nhắt từng file. Trình trước các lựa chọn và quyền đã nhận diện được; những đầu ra phụ thuộc chưa tồn tại chỉ được duyệt khi có bản cụ thể, không gộp mất năm gate sản phẩm hoặc SEO. Chỉ một subtask triển khai hiện hành.

## Gói kế tiếp phải chứa đủ gì?

- Phương pháp: mỗi quyết định có lý do, lựa chọn khuyến nghị, ví dụ và hệ quả; mỗi yêu cầu chất lượng có workload, đơn vị, cách đo và trạng thái đề xuất/đã duyệt/chưa đo. Phân biệt chất lượng sản phẩm với chất lượng Kidea.
- Phạm vi tài liệu: danh sách chính xác file mới/sửa ở repo và pilot, nguồn/anchor, bảo toàn hồ sơ R03; không xin quyền ghi không giới hạn. Chưa chọn tên file pilot hoặc tạo chúng trong lượt mở phase này.
- Kiểm chứng: rubric theo năm nhóm trên, kiểm link hai chiều và tình huống lỗi; nêu rõ những gì kiểm bằng hồ sơ và những gì phải chạy trên môi trường đích ở phase sau.
- Nếu cần AI độc lập: trình số phiên, thời gian, đầu vào, quyền chỉ đọc/ghi, cách giữ kết quả lỗi và điểm dừng trước khi chạy. Không dùng lại ngân sách R03.
- Những gì chưa đủ căn cứ: con số hiệu năng/phục hồi, phương án lưu trữ/triển khai cụ thể và kết quả thử chưa có phải được ghi là chờ quyết định hoặc chờ đo, không tự điền như sự thật.

## Giới hạn giữ nguyên

Không thay nghiệp vụ R03 hoặc nền tảng đã chọn; không bỏ web/native khỏi phạm vi. Chưa có quyền thêm AI, cài toolchain/VM, tạo code, deploy, đổi bảo mật Windows, dùng dữ liệu thật hoặc phát sinh chi phí. Không khởi tạo `.kidea` cho chính repo này. Chỉ soạn kế hoạch trong repo Kidea và đồng bộ answer/Git theo quyền hiện hành.

Human chưa cần thao tác môi trường hoặc xác nhận thêm để soạn gói S02. Lần trình tiếp phải đưa gói cụ thể để chốt, không chỉ xin phép chuẩn bị một gói khác.
