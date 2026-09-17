# R09 — quyết định đã có và các điểm Human còn tham gia

**Hiện hành — SQLite diagnostic đã duyệt và hoàn tất:** [Kết quả](../tests/evidence/r09/t02-sqlite-diagnostic-r1.md): race cố ý được TSan bắt; WAL song song tái hiện đúng cảnh báo SQLite không cần backend; DELETE song song/WAL tuần tự đạt100 cập nhật/quick_checkok. Chưa kết luận miễn trừ hoặc full PASS. Container thu hồi,54sourcehash nguyên sau run, log giữ. R5 vẫn TSan6FAIL/releaseNOT_RUN; tiếp theo review phương án tương thích SQLite–TSan trước gói build mới, không sửa backend/vendor hoặc giảm test. Pilot HEADc578edc sạch/không remote, public SAVE giữ W-001/gates. R09 còn mở/T02 chưa nghiệm thu/R10 chưa mở. Các đoạn cũ là lịch sử.

**Hiện hành — T02 r5 dev/ASan+UBSan PASS, TSan FAIL:** [Bằng chứng](../tests/evidence/r09/t02-build-r5.md). Dev/ASan mỗi46CTest+18HTTP, dev toàn bộ tidy qua; TSan40/46,6FAIL cùng SQLite WAL header, release/TSanHTTP chưa chạy. Giữ FAIL/3container thu hồi. Chưa kết luận false-positive hoặc miễn trừ; [diagnostic15phút](R09_T02_SQLITE_DIAGNOSTIC_REVIEW.md) đã chuẩn bị chờ duyệt, source01d8d7f/HEAD14cb14e,54source/824vendor kiểm tĩnh qua. Không sửa backend/vendor hoặc giảm test. R09 còn mở/T02 chưa nghiệm thu/R10 chưa mở. Các đoạn cũ giữ lịch sử.

**Hiện hành — T02 r4 đã duyệt/chạy,46/46 CTest và backend tidy PASS; tổng lượt FAIL tests tidy:** [Bằng chứng](../tests/evidence/r09/t02-build-r4.md).12warning test đã sửa không đổi oracle/log/flags, [r5](R09_T02_BUILD_R5_REVIEW.md) chờ duyệt; source539e2b3/HEAD4d30799,51source/824vendor kiểm tĩnh qua. Bản sửa chưa compile/runtime; HTTP/sanitizer/release chưa chạy. R09 vẫn mở, chưa nghiệm thu T02/137nghĩa vụ, R10 chưa mở. Các đoạn cũ giữ lịch sử.

**Hiện hành — T02 r3 đã duyệt/chạy,46/46 CTest PASS; tổng lượt FAIL tidy:** [Bằng chứng](../tests/evidence/r09/t02-build-r3.md). Collector/model-store-executor tidy qua; main lỗi copy Response không cần thiết, lượt dừng/thu hồi container. Đã sửa const reference, [r4](R09_T02_BUILD_R4_REVIEW.md) chờ duyệt; source1be7797/HEAD506b426,51source/824vendor kiểm tĩnh qua. Bản sửa chưa compile/runtime; tidy tests/HTTP/sanitizer/release chưa chạy. R09 còn mở, không tự nghiệm thu T02/137nghĩa vụ, R10 chưa mở. Các đoạn cũ bên dưới giữ lịch sử.

**Hiện hành — T02 r2 đã duyệt/chạy,45/46 nhóm dev PASS:** [Bằng chứng](../tests/evidence/r09/t02-build-r2.md), compile qua; JSON comment FAIL nên lượt dừng/thu hồi container, giữ log. Đã sửa và thêm regression, [r3](R09_T02_BUILD_R3_REVIEW.md) chờ duyệt lượt mới. Source4764393/HEADde55437,51source/824vendor kiểm tĩnh qua, bản sửa chưa compile/runtime; tidy/HTTP/sanitizer/release chưa chạy. Không tự ghi137nghĩa vụ PASS hoặc nghiệm thu T02/R09; R10 chưa mở. Các mục r1/r2 trước đây bên dưới giữ lịch sử.

**Hiện hành — T02 build r1 đã duyệt/chạy, FAIL compile:** [Bằng chứng](../tests/evidence/r09/t02-build-r1.md), formatter18/configure qua; compile test lỗi alias Json/range-loop, lượt dừng và container đã thu hồi. Đã sửa nguồn test, không đổi oracle; [build r2 cụ thể](R09_T02_BUILD_R2_REVIEW.md) chờ duyệt lượt mới. Pilot source762fb48/HEADc431bbd,51source/824vendor kiểm tĩnh qua; bản sửa chưa compile, CTest/HTTP/sanitizer/release NOT_RUN. R09 vẫn mở, không hỏi lại B/C/nghiệp vụ, không mở R10. Các đoạn trước r1 bên dưới giữ lịch sử.

**Quyết định mới nhất:** Human “Tôi duyệt” gói tại cdd6ee5: B/C đã nghiệm thu, T02 authoring có quyền và đã có [đầu ra kiểm tĩnh](../tests/evidence/r09/t02-authoring-r1.md). Còn [build r1](R09_T02_BUILD_REVIEW.md) cụ thể cần quyền chạy, không hỏi lại B/C hoặc quyền viết nguồn. Các hàng/mốc trước bên dưới là lịch sử.

Ngày 2026-09-17. Nguồn trạng thái: [roadmap](../KIDEA_ROADMAP.md#review-current). Tài liệu này là danh sách quyết định, không thay sổ tiến độ hoặc cấp quyền từ văn bản.

**Cập nhật theo Human:** “Tôi duyệt tất cả mục trên nhé” duyệt [A–E tại77f5caf](../proposals/r09-next-decisions-r1.md). A nghiệm thu D1; B mở ba helper hữu hạn; C mở chuẩn bị/Git local/public init; D chốt max2ACTIVE tạiT04 và hủy PAUSED tạiT09; E chốt lab giả/AI DEV/Human chạy script vai PROD và N/A index công khai. Không xin lại các quyết định này. Đầu ra B/C, code/build/deploy và nghiệm thu R09 vẫn có gate riêng. Tồn đọng cũ (view pilot R07, Windows/Apple Silicon, native) để sau, chưa PASS hoặc bỏ gate.

## Đã duyệt, không hỏi lại

- Human: **“Duyệt D1. Sau đó xem còn cần tôi confirm gì để hoàn thành R09 hoặc phần nào còn tồn đọng trước đây thì nêu ra nhé”**. D1 của [R09 r1 tại cd05598](../proposals/r09-pilot-r1.md): sửa hữu hạn đường phân rã/chuyển công việc công khai, giữ schema/sáu hành động/quyền/gate. Được triển khai và kiểm local có sẵn, commit/push Kidea; không sửa/init sibling hoặc chạy workload trong D1.
- R05, R06, R07, R08 đã nghiệm thu đúng phạm vi; các nhãn IN_REVIEW trong raw evidence cũ không phải yêu cầu duyệt lại.
- Client Web; Android/iOS Future chưa lịch. Docker do Human đã cài; GCP `kidea-508908` đã được cấp quyền lab tạo/test/thu hồi. Không xin lại từng lệnh trong gói hợp lệ. Giữ kiến trúc và nghiệp vụ pilot đã chốt, không thiết kế lại từ đầu.

[Gói cụ thể hiện tại](../proposals/r09-t02-authoring-r1.md): gộp chấp nhận đầu ra B/C và quyền viết source/test/harness T02, kiểm tĩnh/Git local. [Review kỹ thuật](R09_BC_TECHNICAL_REVIEW.md) hoàn tất; không hỏi placeholder build.

## Còn cần quyết định ở đúng thời điểm

| Điểm | Human cần làm gì | AI phải chuẩn bị trước |
|---|---|---|
| Mở code/build pilot sau C | D1 đã nghiệm thu; chỉ duyệt quyền thực thi mới theo gói cụ thể khi sẵn | Nguồn/test cuối; exact root, danh sách ghi, Git local/remote, init `.kidea`, kế hoạch lát cắt, lệnh/target/quota/cleanup; đối chiếu approval kế thừa |
| Gate sản phẩm | Duyệt đầu ra mới hoặc phần thực sự thay đổi; không duyệt lại nguyên hồ sơ đã chốt | Gói đúng phiên bản/owner/input/đầu ra; giữ mười bước, gộp quyết định có căn cứ, không lấy D1 làm approval nghiệp vụ |
| Feature T04/T09 | Ý nghĩa đã duyệt ở D; review đầu ra/impact thực tại thời điểm thử, không hỏi lại rule | Impact, điều kiện chấp nhận, test và thay đổi kế hoạch; đây là kịch bản đã chọn để thử, chưa là nghiệp vụ MVP ban đầu |
| Phát hành lab T08 | Human trực tiếp chạy bộ script vai PROD đã xác minh trên lab; N/A index đã duyệt ở E, exact release readiness vẫn review khi có nguồn | Exact script/artifact/config/revision, dry-run/checks, hướng dẫn ngắn và readback; không xin production thật hoặc secret trong chat |
| Thử reject/approval/ngắt phiên | Phản hồi gate và quyết định quyền theo kịch bản hữu hạn khi cần người thật | Kịch bản, tiêu chí, cách giữ bằng chứng; không tự đóng vai Human thật hoặc chạy thêm quota AI lịch sử |
| Khép R09 | Nghiệm thu kết quả/giới hạn tích hợp cuối | Toàn bộ nghĩa vụ backend/Web, release/restore, lỗi/change/handoff, G2 nguồn cuối và view T14 thật; không lấy test thành phần thay nghiệm thu |

Không yêu cầu Human trả lời bảng này trước khi các gói cụ thể tồn tại. AI tự làm các bước kỹ thuật thường lệ đã có quyền. Nếu thêm chi phí, đổi hành vi/kiến trúc quan trọng hoặc vượt giới hạn, chỉ trình phần thay đổi; không mặc định mở lại cả phase. Quyền cloud còn hiệu lực nhưng manifest/deadline R08 và ngoại lệ tidy đã tiêu thụ không tái sử dụng.

## Tồn đọng từ trước

- **Ba helper phục vụ pilot:** B1 sửa kế hoạch/round, B2 release/operation và B3 phục hồi metadata đã được mở bởi A–E và đã kiểm nguồn cuối PASS cả9bộ; [kết quả/giới hạn B/C](R09_AE_REVIEW.md). D1 riêng không có chúng; không dùng shell/internal writer để diễn pilot. Kết quả cần review, không tự suy nghiệm thu từ grant triển khai.

- **R07 → R09-T14:** render/đối chiếu/đo Chrome trên hồ sơ pilot thật vẫn bắt buộc; AI thực hiện khi hồ sơ hợp lệ, không cần duyệt lại nghĩa vụ đã chuyển.
- **Windows/Apple Silicon:** chưa có hồi quy mới cho các sửa sau bằng chứng Windows cũ; Mac Intel không chứng nhận Silicon. Phải có bằng chứng tương ứng hoặc chốt mức hỗ trợ đã chứng minh tại R10. Chưa cần mua/cấp máy trong D1.
- **Android/iOS:** Future, chưa lịch; không tồn tại yêu cầu cài Xcode/SDK hay nghiệm thu native để đóng R09 backend/Web.
- **Chi phí cloud thực:** credit300USD là thông tin Human cung cấp, chưa xác minh số dư/hạn/hóa đơn; không coi là ngân sách vô hạn. Gói workload mới cần dự toán và giới hạn hữu hạn trước chạy.
- **R10:** vẫn là phase riêng về đóng gói/tương thích/nghiệm thu/bàn giao sau R09, chưa được D1 mở thực thi. Không coi R09 xong là toàn Kidea xong.
