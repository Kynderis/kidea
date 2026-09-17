# R09-T02 — đề xuất xử lý gate SQLite–TSan EX-T02-WAL-01 r1

**PROPOSED — chờ quyết định Human; chưa áp dụng, chưa mở build.** Yêu cầu “làm đi” mở chuẩn bị phương án sau diagnostic r2, không tự cấp ngoại lệ. [Bằng chứng r2](../tests/evidence/r09/t02-sqlite-diagnostic-r2.md), [đối chiếu sáu report r5 và hai report r2](../tests/evidence/r09/t02-tsan-policy-r1/review.json). Mục tiêu là tiếp tục kiểm đầy đủ mà vẫn trình bày trung thực giới hạn của TSan với SQLite WAL.

## Quyết định đề xuất

Cho phép **một ngoại lệ có điều kiện, chỉ cho đợt kiểm T02 kế tiếp**: hai cặp truy cập header SQLite đã review có thể được ghi `KNOWN_WAL_REPORT_REVIEW_REQUIRED`, tách khỏi lỗi mới. Không gọi TSan sạch, không đổi raw CTest FAIL thành PASS. Kết luận cao nhất là `PASS_WITH_APPROVED_LIMITATION` sau khi mọi điều kiện dưới đây được chứng minh và đầu ra được review; chưa nghiệm thu T02/R09.

Đây là thay đổi tiêu chí chấp nhận warning bên thứ ba, có rủi ro bỏ sót một lỗi thật biểu hiện cùng chữ ký. Nó không phải bằng chứng rằng mọi data race đều vô hại. TSan chỉ phản ánh các truy cập/lịch chạy quan sát được và có thể gộp báo cáo; giữ instrumentation không bảo đảm phát hiện mọi race. Nếu Human không chấp nhận giới hạn này thì giữ T02 bị chặn, cần hướng compiler/dependency hoặc sửa thuật toán được review riêng; không có cơ sở hứa một chỉnh sửa nhỏ sẽ làm TSan sạch.

## Căn cứ và phạm vi chính xác

- SQLite 3.53.4, SHA256 `b1dd5d74ec7f29055a6684fa06fb3c2f6821c87dd38f9a458dfd2e8a1db28189`, GCC13 và image `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92` hiện có.
- Sáu report r5: write `walIndexWriteHdr:68469` ↔ read `walIndexTryHdr:70135` (aHdr[1]). R2 thêm write `68471` ↔ read `70133` (aHdr[0]). Phải đối chiếu hai access stack, loại truy cập và vị trí shared-memory header; không chỉ tìm tên SQLite ở bất kỳ chỗ nào trong stack.
- Vendor tag-20200519-1 mô tả đọc hai bản sao, memory barrier, so sánh/checksum để từ chối snapshot không nhất quán và khả năng TSan báo dương tính giả. [Tài liệu WAL](https://sqlite.org/walformat.html) mô tả cấu trúc shared-memory WAL index; tự nó không chứng minh từng cảnh báo vô hại.
- R2 đạt count100/quick_check trong một mẫu đồng thời; control cố ý vẫn bị bắt. Đây là bằng chứng hỗ trợ, không bao phủ mọi lịch thực thi hoặc lỗi cross-process/crash.
- [TSan flags](https://github.com/google/sanitizers/wiki/ThreadSanitizerFlags) cho phép chạy tiếp sau report và giữ exit66. Giữ `-fsanitize=thread`, `report_bugs=1`, không suppress, không annotation loại instrumentation, không đổi WAL, không thêm mutex để tuần tự hóa workload.

## Cách kiểm bắt buộc trước khi dùng ngoại lệ

1. Viết bộ phân loại báo cáo độc lập, mặc định UNKNOWN/BLOCKED. Chỉ nhận hai chữ ký đã review với source/toolchain đúng; cần đủ cả hai access stack và report hoàn chỉnh. Raw stderr/exit/CTest/JUnit không sửa; report phân loại là file riêng. Không biến exit66 thành exit0 của chương trình gốc.
2. Kiểm offline bộ phân loại bằng log thật và ca nghịch: race của ứng dụng, known+unknown cùng log, đổi line/hash/image, read/write khác, thiếu một stack, truncate report, fatal/timeout/signal/OOM, thiếu case/assertion và thiếu log. Tất cả trường hợp không khớp phải chặn. Kiểm này chỉ xác nhận bộ phân loại, không chứng nhận code không có race.
3. Chạy đầy đủ 46 nhóm CTest, collector và 18 HTTP trên nguồn cuối; không bỏ sáu ca cũ. Thu riêng functional oracle, trạng thái process và TSan. Mọi ca phải hoàn thành đúng assertion hiện hành, gồm kiểm concurrency/idempotency/crash; không lấy một dòng PASS hoặc count của probe thay oracle ứng dụng. Rà closure assertion theo bản dev đạt để bắt thiếu quan sát, giữ ID/variant và không hạ expected.
4. TSan chạy tới cuối với `halt_on_error=0:exitcode=66:report_bugs=1`. Harness thu kết quả nonzero rồi kiểm rõ nguyên nhân; không `|| true` để coi thành công. HTTP phải kiểm cả server exit và stderr sau shutdown; exit66 chỉ được ghi loại hạn chế khi toàn bộ functional assertion đạt và từng report được đối chiếu. Report mới vẫn chặn dù các ca chức năng đạt.
5. Control cố ý có race và mẫu không race phải kiểm trong chính môi trường TSan của lượt mới; detector không bắt hoặc log không đầy đủ → INCONCLUSIVE. Bổ sung control race ứng dụng trộn với report WAL để chứng minh bộ phân loại không nuốt cảnh báo ngoài phạm vi. Không đưa control lỗi vào backend phát hành.
6. Dev/ASan+UBSan/release vẫn phải đạt các gate hiện hành trên cùng nguồn cuối. Giữ mọi lần FAIL. Kết quả mới phải trình cả raw TSan FAIL/exit66 và phạm vi ngoại lệ; không quảng bá toàn bộ sanitizer PASS. Không mở T03 bằng kết quả diagnostic hoặc approval đề xuất này.

## Phạm vi triển khai nếu duyệt

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, Git local, không remote/push. Chỉ sửa harness dưới `scripts/t02/`, thêm test control/classifier dưới `tests/t02/`, wiring test tối thiểu khi cần, tài liệu T02/ngoại lệ/handoff; snapshot/evidence và roadmap trong Kidea. Không sửa logic backend, schema/API, vendor, nguyên tắc nghiệp vụ, assertion/expected để nhận kết quả yếu hơn. Public checkpoint theo giao diện Kidea khi cần, không ghi tay `.kidea`.

Duyệt gói này cho phép triển khai và kiểm offline bằng Node24/công cụ đã có, tạo source diff và manifest build cụ thể để review. **Chưa chạy Docker/full build hoặc tải/cài gì trong quyền này.** Trước thực thi phải trình nguồn/harness đã hoàn chỉnh, lệnh và manifest mới; không tái dùng grant r5/r2. Trần dự kiến giữ mức build r5 (4 container tuần tự, tổng ≤2 giờ, 2 CPU/4 GiB mỗi container, đĩa mới ≤8 GiB, data/log ≤2 GiB, network/download/hostport 0); số này chưa là quyền thực thi và phải đối chiếu dung lượng thực trước gói chạy.

## Hạn dùng và điểm Human quyết định

Owner review: Human. Ngoại lệ chỉ có hiệu lực nếu Human duyệt EX-T02-WAL-01 r1, implementation kiểm đạt và manifest nguồn được duyệt; chỉ một đợt T02 đã định danh. Đổi SQLite/compiler/image, instrumentation, logic truy cập DB/concurrency, chữ ký report hoặc nguồn ngoài manifest làm hết hiệu lực. Không kế thừa sang T03, release khác, R10 hoặc ứng dụng khác; nếu tiếp tục cần review lại tác động, không tự gia hạn.

Đề nghị duyệt **ngoại lệ hẹp có điều kiện và quyền viết/kiểm offline harness** như trên. Chưa xin nghiệm thu hay tuyên bố false-positive chắc chắn. Quy trình ngoại lệ hiện hành nằm ở `docs/engineering/rules.md#exceptions` trong pilot: “Chưa duyệt thì không được áp.” Đây là quyết định thay tiêu chí chấp nhận, không phải xin lại lệnh kỹ thuật thông thường.
