# R05 — Phương pháp rule/test, bản r1

Ngày 2026-09-16. **APPROVED — nội dung R5-1–R5-4 tại a39f79f đã được Human duyệt** bằng câu “Duyệt nội dung R05 r1, tiếp tục chuẩn bị gói môi trường/build.” Quyền soạn/kiểm D1–D6/P1–P4 đã được duyệt sau answer cfffe0c. Không tích hợp skill/runtime trong lượt này. [Gói quyền và đích](r05-profile-test-r1.md), [bản đọc kết quả](../tests/evidence/r05/profile-r1.md).

## Hợp đồng dùng lại cho project

Một profile là bộ rule có revision, scope, nguồn, lý do, ví dụ đúng/sai và phép kiểm. Project giữ bộ hiệu lực trong tài liệu sản phẩm ngoài `.kidea`; Kidea tham chiếu, không có kho cấu hình thực thi thứ hai. Không dùng chữ “best practice” thay một assertion có thể bác bỏ. Quy ước project được đọc trước; xung đột phải được giải quyết theo yêu cầu/ngưỡng/gate đã duyệt, không tự bỏ rule bắt buộc.

Mỗi rule có ID ổn định theo họ COMMON/CPP/WEB/AND/IOS. Sửa nghĩa tăng revision, giữ bản cũ trong Git/evidence; danh sách rule hiệu lực nhận diện bằng revision và SHA của nội dung. Kết quả kiểm gắn nguồn, profile, config, dependency/lock, toolchain, target, command, dataset và artifact; một mục đổi thì xét lại bằng chứng liên quan. Không hứa giữ hiệu lực chỉ vì cùng tên version/commit.

Ngoại lệ là bản đề xuất gồm rule/revision, phạm vi, lý do, rủi ro, kiểm thay thế, người duyệt, thời hạn/điều kiện hết hiệu lực và ảnh hưởng; chưa duyệt thì rule vẫn hiệu lực. Không miễn authority/quyền/invariant/approval, không thay FAIL/NOT_RUN thành PASS. Đề nghị đổi những điều này phải quay đúng nguồn thiết kế, không thông qua profile.

## Đầu ra hữu hạn của pilot

Sáu file trong sibling `kidea-workshop-pilot/docs/engineering/`: `rules.md`, `cpp.md`, `web.md`, `android.md`, `ios.md`, `tests.md`. Chúng là bản đề xuất chính để review; snapshot dưới evidence chỉ là bản chụp gắn SHA để đọc/chuyển máy, không nguồn song song để chỉnh. Trước khi soạn, đã khôi phục đúng 15 file R04+LP-01 từ các snapshot được dẫn trong bàn giao. Chỉ hai file cũ được nối thêm backlink; nguồn gốc giữ nguyên byte.

Rule chung quản lý hiệu lực và bằng chứng; bốn profile cụ thể hóa đúng/sai cho ngôn ngữ/nền tảng; test specs nối case R03/R04 đến setup, thao tác, oracle, nơi chạy và evidence. Đúng/sai trong bảng là ví dụ để review tĩnh, không code đã compile. Mỗi nhóm phải có mẫu thuận và mẫu vi phạm có thể bị phát hiện khi được phép build.

## Kiểm và gate

Điều chỉnh phạm vi lab được Human giao ngày2026-09-17: [ma trận native mô phỏng r1](r05-simulator-lab-r1.md) là căn cứ R05-T04/T05-S03. Mẫu thực thi và mutant vẫn bắt buộc, Emulator/Simulator được dùng cho ca nó đo được; không lấy thiếu điện thoại làm blocker chung. Nghĩa vụ thực thi ứng dụng đầy đủ trong pilot vẫn giữ, không coi8nhóm mẫu là137ca ứng dụng hoặc chứng nhận phần cứng. Phiên bản công cụ/OS tối thiểu thuộc cấu hình project, không là yêu cầu chung Kidea áp lên mọi sản phẩm.

- Lượt này: kiểm exact inventory/preservation, link/anchor, đủ trường rule/spec, coverage từ case nguồn và các fixture âm thiếu/thừa/đổi nghĩa/đổi hash/giả PASS. Tự rà nội dung theo nguồn R03/R04; không mở AI độc lập.
- Nội dung r1 đã APPROVED; T01-S04/T02–T06-S02 DONE đúng phạm vi duyệt nội dung. Chưa tạo lệnh/config ứng dụng; các command trong hồ sơ là đề xuất cần hiện thực bằng script project sau quyền build.
- Mẫu build đúng–sai trên Ubuntu Docker, web, Android, iOS vẫn thuộc R05-T02–T05-S03. Thiếu công cụ/máy thì BLOCKED_ENV_PENDING, không dời hết sang R09 để khép R05.
- R09 thực thi hành vi và đo lab theo Q; R08 quản lý thực thi/release; R10 nghiệm thu đúng ma trận. Không lấy kiểm hồ sơ hoặc Mac Intel core PASS thay các gate đó.

## Quyết định nội dung đã duyệt

| Mã | Bản cụ thể cần duyệt | Giới hạn |
|---|---|---|
| R5-1 | Hợp đồng revision/ngoại lệ/bằng chứng và 4 profile r1 | Không đổi nghiệp vụ R03/R04 hoặc tích hợp skill trước gate |
| R5-2 | Grammar văn bản thuần đề xuất tại CPP-06 và các vector đối chứng | Là chi tiết kỹ thuật cần duyệt; nếu thay miền hợp lệ thì quay W-DATA, không âm thầm áp |
| R5-3 | Test specs nối toàn bộ case nguồn, thứ tự/lỗi/tải/release và sample đúng–sai | Tất cả ca ứng dụng/build còn NOT_RUN |
| R5-4 | Các tổ hợp phiên bản ứng viên và các khoảng trống môi trường được ghi trong evidence | Không duyệt cài/nâng macOS, toolchain, cloud hoặc chi phí qua việc duyệt nội dung |

Gói môi trường chưa đủ exact artifact/download/cache/quyền/thiết bị để xin phép cài. Bản kết quả nêu dữ kiện đã biết và lựa chọn cần hoàn thiện; không cấp quyền từ một con số dung lượng ước lượng.

[Gói môi trường/build r1](r05-environment-build-r1.md) mới chỉ PROPOSED; duyệt nội dung không cấp quyền cài/build. Approval gắn snapshot r1 tại a39f79f, không sửa lại bằng chứng lịch sử hoặc byte pilot để đổi nhãn cũ.
