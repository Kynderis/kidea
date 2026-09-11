# Kidea — Tiêu chí chất lượng và bằng chứng nghiệm thu

Căn cứ `P01-T05-QUALITY-r2` ngày 2026-09-07: **CHỈ MỘT PHẦN ĐÃ DUYỆT — CHƯA ĐO/CHẠY**. Ngày 2026-09-08 chỉ đồng bộ điều hướng sang vòng R2, không đổi các giá trị đề xuất. Không còn một gate chờ duyệt cả file: [R01-T08/T09](KIDEA_ROADMAP.md#r01) chia theo nhóm nhỏ. [Roadmap](KIDEA_ROADMAP.md#work-state) giữ tiến trình; tài liệu này không thay thiết kế hoặc test pilot. Các số 2/5/3/10 giây, 11 mẫu, 3 lần AI và giới hạn cycle bên dưới chưa có hiệu lực trước đúng approval.

<a id="control-acceptance-approved"></a>

### Phần đã duyệt — điều phối, quyền và lưu/tiếp tục

Theo [R01-T08-S01](KIDEA_ROADMAP.md#r01-t08-s01-result), phạm vi KA-01–03 và KA-05–13 cùng biến thể tài liệu/comment tự nhận approval đã được duyệt; KA-04 đầu–cuối không được coi đạt từ nhóm này. Mỗi biến thể bắt buộc phải đúng cả phản hồi, hồ sơ và hành động: không vượt gate/quyền, mất nội dung đã lưu hợp lệ, replay nguy hiểm hoặc báo DONE/PASS sai. Có lỗi thì chặn nghiệm thu nhóm, sửa/kiểm tra lại và giữ bằng chứng lỗi. Thiếu dữ liệu/công cụ phải báo đúng, dừng phần phụ thuộc, không tự PASS/N/A.

Thử cả quyền đủ thì tiếp tục và quyền thiếu thì dừng. Mô hình lỗi ghi gồm lỗi quyền, ngắt tiến trình và sửa ngoài luồng; không nhận chống hỏng ổ đĩa/mất điện vật lý. Approval này chưa chốt fixture/schema, số lần chạy, ngưỡng hoặc toàn bộ KQ-01–03 cho các nhóm case khác; các phương pháp đo còn đề xuất bên dưới vẫn phải qua gate tương ứng. Chưa thực thi case.

<a id="change-acceptance-approved"></a>

### Phần đã duyệt — nghiệp vụ, bản đồ và thay đổi

Theo [R01-T08-S02](KIDEA_ROADMAP.md#r01-t08-s02-result), phạm vi KA-14–22 và chuẩn đối chiếu hữu hạn đã được duyệt: chuẩn bị mẫu có tập ảnh hưởng/kết quả mong đợi được review trước, đối chiếu độc lập với kết quả Kidea. Không bỏ sót đích bắt buộc, kết luận đúng bản/có căn cứ, không đóng khi còn việc hoặc thiếu thông tin. Thử cả đích có ảnh hưởng và đích được chứng minh không cần sửa; quan hệ hợp lệ tìm thêm được phép, không ép mọi nơi thành cần sửa. Link/graph hợp lệ không chứng minh đúng nghĩa.

Đây là căn cứ hiệu lực của KQ-04 trong phạm vi nhóm này. Đạt mẫu hữu hạn không chứng minh tìm hết dependency của mọi project; pilot vẫn phải kiểm chứng thật. Chưa duyệt fixture/adapter/thuật toán, số lần chạy, giới hạn cycle/KQ-09 hoặc toàn QUALITY; chưa chạy case.

<a id="delivery-acceptance-approved"></a>

### Phần đã duyệt — chất lượng, hiển thị và phát hành

Theo [kết quả T08](KIDEA_ROADMAP.md#r01-t08-result), phạm vi KA-23–30 và KA-04 đầu–cuối cùng chuẩn bằng chứng/mô phỏng đã được duyệt. Chỉ nhận đạt khi đúng bản/môi trường và đủ kiểm tra bắt buộc; fail/skip/chưa chạy hoặc deploy thành công một phần không thành toàn bộ đạt. Mô phỏng chỉ chứng minh phần mô phỏng, không thay lab/restore/thiết bị thật bắt buộc. HTML là bản chụp đúng nguồn/thời điểm, không là xác nhận sức khỏe hiện tại. Thiếu bằng chứng báo thiếu; N/A cần Human duyệt đúng lý do/phạm vi, không bỏ năng lực bản đầu.

Các nguyên tắc tương ứng của KQ-05/06 có hiệu lực trong nhóm này; không coi T08 là đã duyệt tất cả chi tiết KQ-01–10, fixture, trình duyệt, schema, quyền chạy hoặc số lần/ngưỡng. T08 đã khép phạm vi ba nhóm, chưa thực thi case; bằng chứng/cách đo còn chốt tại T09 và task sở hữu.

## 1. Quy tắc kết luận

- Đề xuất nghiệm thu: tất cả biến thể bắt buộc trong phạm vi đã duyệt phải đạt trên bản được nghiệm thu; không dùng điểm trung bình để bù lỗi. N/A chỉ được loại khỏi mẫu số khi Human duyệt đúng phạm vi và lý do; thiếu môi trường/skip/chưa chạy không tự thành N/A.
- Bất kỳ lần quan sát nào có mất dữ liệu, ghi ngoài quyền, vượt gate, replay nguy hiểm hoặc báo đạt sai đều chặn nghiệm thu. Sửa nguyên nhân, rà ảnh hưởng và chạy lại nhóm liên quan; giữ bằng chứng lỗi cũ, không chọn lần chạy đẹp nhất.
- “Không lỗi trong bộ thử” không có nghĩa bảo đảm không lỗi trong mọi tình huống. Chỉ công bố đúng mô hình lỗi, dữ liệu và môi trường đã kiểm chứng. Phạm vi ngoài bộ thử phải nêu giới hạn.
- Các gói R01-T08/T09 chỉ chốt đúng phạm vi case/cách đo được trình, không duyệt ngầm toàn bộ bảng. Fixture thực thi, schema, runtime và cơ chế ghi/khôi phục được thiết kế ở phase sở hữu; không cài/chạy skill hoặc tạo pilot tại đây.

Các quy tắc tái dùng bằng chứng/chạy lại nhóm liên quan tại đây không thay [lượt kiểm tra cuối toàn dự án sau mỗi Feature theo G2](KIDEA_DESIGN.md#feature-final-check); khi đầu vào chi phối kết quả đổi, chạy lại toàn bộ lượt đó. Câu đối chiếu này không duyệt các ngưỡng hoặc phương pháp nghiệm thu còn đề xuất bên dưới.

Trong các tiêu chí dưới đây, **hồ sơ đầu vào** gồm cả trạng thái/review ở `.kidea` và tài liệu sản phẩm ở `docs/` hoặc nguồn project xác định, cùng source/test/config có liên quan. Nội dung sản phẩm, mapping và bằng chứng không được sao chép vào .kidea để tạo một nguồn thứ hai. Approval đối chiếu đúng bản nội dung được duyệt: tài liệu sản phẩm ở ngoài .kidea, còn kế hoạch/hồ sơ điều phối ở nguồn .kidea tương ứng; record review chỉ tham chiếu, không sao chép.

<a id="quality-safety"></a>

## 2. Tiêu chí chức năng và an toàn

| ID | Điều kiện đạt đề xuất | Cách đối chiếu và case nguồn |
|---|---|---|
| KQ-01 — Trạng thái/gate/quyền | 0 trạng thái hoặc quyết định sai so với kết quả mong đợi của từng biến thể; 0 tác dụng phụ ngoài quyền. Duyệt một gói không duyệt cả phase; thiếu căn cứ phải dừng đúng phần phụ thuộc | KA-01–09, KA-27–30: bảng kết quả mong đợi được review trước chạy; so câu trả lời, hồ sơ và hành động công cụ thực tế. Đúng cả báo cáo lẫn file, không chỉ nhãn trong UI |
| KQ-02 — An toàn ghi | 0 mất nội dung đã lưu hợp lệ trước thao tác; 0 thay đổi file ngoài danh sách được phép. Sau lỗi, hoặc bản cũ nguyên vẹn, hoặc trạng thái dở được nhận diện và khôi phục được, không giả thành công | KA-02/03/10/13/26/29: so nội dung/hash trước/sau; thử lỗi quyền ghi, ngắt tiến trình trước ghi/giữa chuỗi cập nhật/sau ghi trước xác nhận và nguồn bị sửa ngoài luồng. Phải có bản/căn cứ phục hồi phần bị tác động; không yêu cầu mọi file cập nhật nguyên tử cùng lúc |
| KQ-03 — Resume | Khôi phục đúng mục tiêu, task, gate, phiên bản có hiệu lực, blocker và chuỗi điểm quay lại; giữ đủ task DONE/bằng chứng. Không cần người thử kể lại thông tin đã có trong file; thông tin thực sự thiếu phải hỏi rõ | KA-11–13: so sáu nhóm dữ kiện trên với baseline; thử mới phiên, chuyển máy qua Git được phép, thiếu file/conflict/sai repo/thiếu profile và tác dụng phụ đã/chưa xảy ra. Máy mới phải có đủ công cụ/bản nguồn, không coi thiếu đầu vào là lỗi tự phục hồi của Kidea |
| KQ-04 — Impact và mapping | Với fixture hữu hạn có tập ảnh hưởng chuẩn: không bỏ sót đích bắt buộc, không đóng đích sai phiên bản; mọi kết luận có lý do. Tìm rộng hơn được phép nhưng phải phân loại, không tuyên bố tất cả đều cần sửa | KA-14–22: bộ chuẩn có caller/dependency, event/shared data/config, no-diff, vòng lặp và đầu vào đổi. Đường dẫn đúng nhưng sai nghĩa hoặc thiếu assertion phải được phát hiện/đưa review, không PASS máy móc. Pilot thật cần review ngữ nghĩa, không tuyên bố có bộ chuẩn vét cạn mọi dependency |
| KQ-05 — Bằng chứng và phạm vi | 0 PASS/DONE dựa trên fail/skip/chưa chạy/mock không phù hợp/sai phiên bản. Mỗi yêu cầu bắt buộc truy được tới kiểm tra và kết quả đúng bản; còn thiếu thì ghi thiếu và chặn phần nghiệm thu liên quan | KA-23/24/27–30: kiểm tra hai chiều yêu cầu–test–assertion–kết quả, tách lỗi Kidea và lỗi pilot. Không dùng build thay deploy, simulator thay máy thật bắt buộc hoặc HTML đúng thay chứng cứ index/ranking |
| KQ-06 — View | Tất cả task/gate/blocker hiển thị khớp nguồn; đủ task DONE và nhãn chưa phân rã; snapshot có thời điểm/bản nguồn. 0 thực thi nội dung độc hại, 0 ghi hồ sơ nguồn hoặc upload ngoài quyền | KA-25/26: so danh sách/trạng thái với nguồn, mở offline và snapshot cũ; thử bàn phím, màn hẹp/rộng, tên dài. Mọi chức năng xem bắt buộc dùng được trên ma trận trình duyệt R07 đã duyệt; không lấy ảnh chụp đẹp thay kiểm tra thao tác |

KQ-02 giới hạn mô hình lỗi bản đầu: lỗi ghi được tiêm vào fixture, dừng tiến trình và thay đổi file ngoài luồng. Không nhận đã chứng minh chống hỏng ổ đĩa/mất điện vật lý chỉ từ các thử này; chính sách backup/khôi phục và giới hạn hệ thống file phải được nêu ở R02/R10. Không được dùng giới hạn đó để bỏ thử an toàn ghi đã liệt kê.

<a id="quality-performance"></a>

## 3. Hồ sơ đại diện và tốc độ công cụ

<a id="benchmark-policy-approved"></a>

### Chính sách đo và chốt ngưỡng — đã duyệt

Theo [T09-S02](KIDEA_ROADMAP.md#r01-t09-s02-result), đo đọc/status sớm ở R02 và sinh view ở R07 khi lát cắt chạy được; dùng số đo, nhu cầu và giới hạn máy để trình Human duyệt ngưỡng trước nghiệm thu phần đó. Không tự lấy số nháp làm chuẩn hoặc nới chuẩn vì chạy chậm; sau chốt phải sửa/đo lại hoặc trình thay đổi có căn cứ trước kết luận.

Dùng hồ sơ nhỏ, lớn hơn và pilot thật khi có; nội dung/quan hệ có ý nghĩa, không nhồi file rỗng. Chốt bản mẫu, máy/môi trường, đầu vào/cách đo trước chạy; giữ cả chậm/lỗi, không chọn lần đẹp. Thời gian helper gồm đọc/ghi/xử lý cần thiết; chờ AI/Human/mạng hoặc build sản phẩm ghi riêng. Kích thước mẫu, số lần và ngưỡng cụ thể vẫn chưa được duyệt; chưa đo benchmark.

Các con số sau là **ngân sách đề xuất để Human duyệt**, không phải kết quả đo hoặc chuẩn ngành. Chọn hai mức đủ phân biệt hồ sơ nhỏ với hồ sơ lớn hơn mà vẫn phục vụ một người; chưa cam kết project quy mô bất kỳ.

| Bộ dữ liệu | Nội dung fixture hợp lệ tối thiểu |
|---|---|
| QF-S — nhỏ | 30 file Markdown, tổng 1 MiB UTF-8, 100 task, 300 quan hệ đặc tả/mapping, 10 bước lớn |
| QF-M — vừa | 300 file Markdown, tổng 10 MiB UTF-8, 1.000 task, 3.000 quan hệ đặc tả/mapping, 10 bước lớn |

Mỗi bộ có cả `.kidea` và tài liệu sản phẩm bên ngoài, link hai chiều xuyên thư mục, trạng thái hỗn hợp, task DONE, blocker, gate, điểm quay lại hai cấp, tiếng Việt và tên dài 200 ký tự. Số file/dung lượng là tổng hồ sơ đầu vào của hai vùng, không chỉ .kidea đã thu nhỏ; không tính source, thư viện, log lớn hay đầu ra sinh. Phần văn bản để đạt dung lượng phải là nội dung hợp lệ. R02/R07 tạo manifest và hash fixture, ghi số thực và phân bố giữa hai vùng; không chỉ tạo file rỗng hoặc lặp nhãn để có đủ số lượng. Pilot thật là bộ thứ ba để kiểm tra tính thực dụng, không bị ép vừa đúng số lượng trên.

| KQ-07 — thao tác công cụ local | QF-S: tối đa mỗi lần | QF-M: tối đa mỗi lần |
|---|---|---|
| Đọc/kiểm tra cấu trúc hồ sơ và tạo dữ liệu status | 2 giây | 5 giây |
| Sinh HTML tiến độ, gồm đọc/kiểm tra đầu vào và ghi xong output | 3 giây | 10 giây |

- Đo trên host Windows được hỗ trợ trong [ma trận nền tảng vòng trước](KIDEA_DESIGN.md#platform-matrix), SSD local, không thư mục đồng bộ/mạng. Ghi CPU, RAM, OS, runtime, ổ lưu trữ và điều kiện máy thực; không đổi máy giữa loạt để chọn kết quả tốt. Đó là máy tham chiếu được ghi nhận, không suy ra mọi máy Windows đều đạt.
- Mỗi thao tác/bộ dữ liệu: 1 lần đầu không cache ứng dụng có sẵn và 10 lần tiếp theo, mỗi lần tiến trình mới. Đo wall-clock từ khởi động công cụ tới kết thúc, gồm startup/I/O; không ép xóa cache OS. Lưu cả 11 số đo, báo lần đầu, trung vị và lớn nhất; tất cả 11 lần phải trong ngưỡng và đầu ra đúng. Không dùng nhãn p95 với mẫu nhỏ này.
- Nếu có nhiễu hệ thống xác định được, lưu lý do và cả loạt cũ, chạy lại nguyên loạt; không xóa riêng lần chậm. Không đạt thì sửa/đo lại hoặc trình Human đổi ngân sách trước khi kết luận, không tự nâng ngưỡng theo kết quả.
- Phép đo không gồm AI/network, chờ Human, Git, compile/test sản phẩm hoặc trích xuất toàn source bằng adapter. Các tác vụ đó có bằng chứng thời gian và điều kiện riêng tại phase sở hữu, không gán vào ngân sách đọc hồ sơ.
- Phần đọc/đối chiếu tài liệu ngoài .kidea mà status/view cần để xác minh link/phiên bản phải nằm trong thời gian đo; không loại phần đó ra để đạt ngưỡng. Ghi đúng danh sách đầu vào thực sự đọc, không nhận đã kiểm tra đầy đủ sản phẩm từ một phép đọc trạng thái.

<a id="quality-ai-impact"></a>

## 4. Phiên AI và vòng ảnh hưởng

**KQ-08 — hành vi phiên mới:** mỗi biến thể cần điều phối AI trong KA-01–24 và KA-27–30 chạy ít nhất một lần ở phiên mới với đầu vào đã cố định; một luồng có thể bao phủ nhiều case nếu từng kết quả truy được. Các biến thể về reject/approval/quyền/resume/bằng chứng nguy hiểm (KA-05–08, KA-11–13, KA-24) phải đạt trong 3 lần độc lập, không mang hội thoại hoặc lời sửa sai từ lần trước sang. Ghi model/cấu hình và bản skill thực; đây không phải xác suất tin cậy thống kê.

Phiên thử được phép đọc hướng dẫn và file cần thiết, Human trả lời các câu hỏi thuộc gate như sử dụng thật. Không được tác giả sửa hộ trạng thái để case đạt. Thử lại sau lỗi cần bản sửa, impact và hồi quy, không chỉ đổi prompt để lấy kết quả đẹp. Helper đúng không thay bằng chứng hành vi AI; phiên AI đúng không thay test helper.

**KQ-09 — không lặp vô hạn:** fixture KA-21 gồm A → B → C → A, thêm D dùng đầu ra A; nguồn B đổi một lần trong lượt để buộc xét lại. Phải xử lý đủ ảnh hưởng và xét lại kết luận sai phiên bản. Dừng thử và ghi FAIL nếu lặp 3 lượt đánh giá liên tiếp mà không thêm căn cứ, thay kết luận, xử lý mục chờ hoặc phát hiện blocker; với fixture này giới hạn 20 lượt đánh giá node. Giới hạn này chỉ là bộ canh thử cho fixture 4 node, không giới hạn graph sản phẩm thật. Đạt giới hạn không được tự đóng impact; giữ checkpoint rồi chẩn đoán.

Đối với thời gian AI: lưu thời gian toàn lượt và phần chờ được nhận diện; chưa đặt SLA số giây vì phụ thuộc dịch vụ/model/mạng. Yêu cầu đạt là tiếp tục đúng, không lặp vô ích, có checkpoint khi gián đoạn; ngân sách công cụ xác định ở KQ-07 vẫn bắt buộc. Không dùng việc tách thời gian AI để bỏ đo chi phí thực tế của luồng.

<a id="quality-evidence"></a>

## 5. Bằng chứng tối thiểu và kết luận cuối

<a id="evidence-validity-approved"></a>

### Hồ sơ và hiệu lực bằng chứng — đã duyệt

Theo [R01-T09-S01](KIDEA_ROADMAP.md#r01-t09-s01-result), mỗi lần kiểm tra phải ghi đủ bài/biến thể, expected, bản Kidea/tài liệu/code/test/config/môi trường và đầu vào liên quan; quyền/cách chạy/thời điểm; kết quả thật, lỗi/skip/thiếu điều kiện, link bằng chứng và giới hạn. Giữ căn cứ trước/sau khi liên quan, không chỉ PASS hoặc chép secret/toàn tài liệu.

Chỉ tái dùng kết quả khi chứng minh đầu vào chi phối vẫn phù hợp; ghi báo cáo đơn thuần không tự làm kết quả mất hiệu lực. Cùng commit chưa đủ nếu artifact/config/môi trường đổi. Giữ G2: mỗi Feature có lượt cuối riêng, đầu vào lượt đó đổi phải chạy lại toàn lượt. Không dùng nhãn “output” để miễn kiểm tra thay đổi code/test. Schema/fingerprint, công cụ và số lần/ngưỡng chưa được duyệt theo gói này.

**KQ-10 — các nhóm thông tin mỗi lần chạy đã duyệt theo phạm vi trên:** ID case/biến thể và tiêu chí KQ; baseline/expected result; bản Kidea, source/hồ sơ/config/profile; môi trường/model nếu có; quyền đã cấp; quy trình/lệnh thực và thời điểm; kết quả thực tế; nội dung trước/sau hoặc diff/hash khi liên quan; đường dẫn log/kết quả; kết luận và giới hạn. Hash chỉ chứng minh đồng nhất nội dung, không chứng minh ngữ nghĩa đúng. Không lưu secret/hội thoại nhạy cảm vào repo public.

| Lớp kiểm tra | Bằng chứng không thể thiếu |
|---|---|
| Helper/cấu trúc/ghi/view | Test tự động khi khả thi, assertion kết quả và bất biến; lỗi ghi có trạng thái trước/sau. UI cần thêm kiểm tra trình duyệt thật theo R07 |
| Điều phối và review ngữ nghĩa | Phiên AI mới, đầu vào/hành động/kết quả liên quan và bảng đối chiếu expected–actual; chỉ lấy kết luận tự chấm của chính phiên chạy là chưa đủ, phải có lượt review tách biệt đọc bằng chứng |
| Pilot và môi trường | Luồng đầu-cuối thật; checkpoint giữa MVP; đổi sau release và bugfix riêng; bản deploy/config thực, smoke/ops/restore. Giữ đúng ma trận thiết bị/mô phỏng đã duyệt |
| Nghiệm thu phát hành | Bản ứng viên cố định, mọi case bắt buộc có kết quả còn hiệu lực; helper suite chạy lại trên bản cuối, nhóm AI trọng yếu chạy đủ 3 lần trên bản cuối. Bằng chứng tích hợp trước đó chỉ dùng nếu review impact xác nhận đúng bản/nội dung còn hiệu lực; phần bị ảnh hưởng phải chạy lại |

Mỗi tiêu chí bắt buộc KQ-01–KQ-10 và biến thể áp dụng phải đạt; không có lỗi chưa xử lý làm sai đầu ra bắt buộc. Báo cáo liệt kê tổng số biến thể, đạt/fail/chưa chạy/skip/N/A riêng, không gộp chúng. Review độc lập ở R10 vẫn theo roadmap; tài liệu này không tự cấp quyền tạo agent hoặc project thử mới.

## 6. Điểm nối triển khai và gate

- R01-T08/T09: rà từng nhóm case, chuẩn đúng/an toàn, tập đầu vào evidence và chính sách chọn ngưỡng/số lần. Đã duyệt [hồ sơ và hiệu lực theo đầu vào thực](#evidence-validity-approved); chưa chọn fingerprint, hợp đồng cụ thể còn phải được duyệt ở R02-T04.
- R02: hợp đồng/lõi/fixture, thử phiên mới và đo đọc/status sớm; R03–R06: nghiệp vụ/rule/maps/change; R07: view và phép đo. Ngưỡng nghiệm thu liên quan chỉ được áp dụng sau gói được duyệt, không tự đổi các số để khớp lần đo.
- R08: vòng code/evidence/release/quyền; R09: pilot thật và từng đường lỗi; R10: ma trận cuối, hồi quy và Human nghiệm thu. Thiếu công cụ/thiết bị không thành PASS.
- R01-T10 tổng hợp khi các gói căn cứ đã được duyệt. Mọi thay đổi ngưỡng/số lần/phạm vi lỗi sau approval phải review lại tiêu chí và case/task bị ảnh hưởng trước sử dụng. Chính sách đo trước/chốt ngưỡng trước nghiệm thu đã duyệt tại [T09-S02](#benchmark-policy-approved); các con số nháp không tự có hiệu lực.
