# R03 — gói còn lại để làm liền mạch

Ngày 2026-09-15. `R03-COMPLETE-BATCH-r1`: **IN_REVIEW**, chưa được cấp quyền thực hiện phần mới. Mục đích: gom toàn bộ lựa chọn nghiệp vụ còn nhận diện được, quyền soạn/tích hợp và kiểm chứng để Human quyết một lần; không chia lượt theo số lượng câu hỏi.

Cập nhật ngày 2026-09-15: Human **“Duyệt toàn bộ gói R03”** xác nhận toàn B1–B8, C1–C3, D và E của bản trình tại `a52808792a8905601ec1baa32506db52a52d86cb` (gói được soạn tại `c4092c8663375050199b868f72191ec7abbe57f0`). Quyền thực hiện đã APPROVED; câu chữ đề xuất phía dưới giữ lịch sử. Approval này không duyệt trước đầu ra cuối E5, không mở R04. Preimage được giữ trước sửa tại evidence completion-r1.

## A. Giữ nguyên phần đã duyệt

- [Phương pháp Feature/cụm](r03-feature-method-r1.md), [mẫu rule/flow/AC/test](r03-business-template-r1.md), [ba nhóm trách nhiệm và cụm đầu](r03-pilot-boundary-review-r1.md).
- [Ba rule D1–D3](r03-registration-decisions-r1.md) đã được Human “duyệt tất cả”: gửi lại cùng yêu cầu không tác dụng phụ lần hai; thứ tự lỗi; các thao tác tranh chấp có thứ tự kết quả hợp lệ.
- Bốn nhóm MVP, web/native, chỉ đăng ký/hủy khi OPEN, một ACTIVE/người/workshop, không vượt chỗ, không admin hủy hộ, không thanh toán/email/SMS/push/waitlist. Hai ACTIVE toàn hệ thống và hủy khi PAUSED chưa thuộc MVP.
- Hai phiên đọc đầu đã hết quota; [kết quả](../tests/evidence/r03/document-trial-r1.md) không phải kiểm chứng toàn nghiệp vụ.

## B. Toàn bộ quyết định nghiệp vụ bổ sung đề nghị

Các hàng B1–B8 là đề xuất mới, chưa được chốt. Có thể duyệt cả bảng hoặc sửa theo mã. Các chi tiết dưới mỗi hàng thuộc cùng gói, không tự thêm quyết định sau khi Human duyệt.

| Mã | Đề xuất | Ví dụ / điều cần chấp nhận |
|---|---|---|
| B1 — ai thấy gì | DRAFT chỉ admin thấy. OPEN/PAUSED vẫn công khai; PAUSED có nhãn tạm dừng và không nhận đăng ký/hủy mới. Danh sách đăng ký cá nhân chỉ chính người đó xem; không làm trang admin xem danh tính người tham gia ở MVP. | Workshop tạm dừng không biến mất; người dùng còn thấy đăng ký của mình nhưng chưa được hủy. |
| B2 — dữ liệu workshop | Tiêu đề 1–120 ký tự, mô tả 1–5000 ký tự văn bản thuần sau bỏ khoảng trắng đầu/cuối; sức chứa số nguyên 1–1000 và không dưới số ACTIVE. Có thời điểm bắt đầu/kết thúc kèm múi giờ; kết thúc phải sau bắt đầu. Không tự đóng theo đồng hồ. | Workshop 10 chỗ có 9 ACTIVE: giảm xuống 8 bị từ chối. Mốc 1000 là giới hạn sản phẩm pilot đề nghị, không chứng nhận chịu tải 1000 người. |
| B3 — đổi trạng thái và nội dung | Chỉ DRAFT→OPEN→PAUSED→OPEN; không quay về DRAFT, không xóa. Admin sửa tiêu đề/mô tả/lịch/sức chứa ở cả ba trạng thái, trong giới hạn B2. Đặt lại đúng trạng thái/nội dung hiện có là không thay đổi, không phát thay đổi giả. | Bấm “mở” hai lần không tạo hai lần xuất bản. Sửa lịch được phép kể cả đã có đăng ký; không hứa gửi thông báo riêng. |
| B4 — vòng đời đăng ký | Mỗi lần đăng ký thành công có ID riêng, chuyển ACTIVE→CANCELLED. Đăng ký lại sau hủy tạo ID mới. Hủy dùng ID chính xác; hủy ID cũ không đụng ID mới. Giữ lịch sử trong vòng đời dữ liệu lab, không tự dọn. | Hủy A, đăng ký lại B; nút hủy cũ của A không được hủy B. Yêu cầu mới vẫn theo thứ tự kiểm OPEN đã duyệt. |
| B5 — nguồn cập nhật | Bên xử lý thay đổi có thẩm quyền chịu trách nhiệm giữ cả kết quả và thông tin thay đổi để phục hồi; không báo thành công cuối nếu còn chưa xác định được việc lưu kết quả/nghĩa vụ cập nhật. Bên hiển thị nhận trạng thái có phiên bản tăng theo workshop, bỏ bản cũ/lặp và đối chiếu với nguồn có thẩm quyền sau gián đoạn. | Đã thấy bản 12 rồi nhận bản 11 thì không lùi số chỗ. Không chọn broker/database hoặc cam kết mạng chỉ gửi đúng một lần. |
| B6 — khi cập nhật chậm/mất kết nối | Giữ số chỗ quan sát gần nhất kèm thời điểm; khi biết mất kết nối hoặc đang đối chiếu thì ghi “chưa cập nhật”, không giả bằng 0. Backend luôn quyết định nhận chỗ. Nếu kết quả thao tác chưa biết, tra lại cùng mã, không báo thất bại cuối hoặc tự tạo mã mới. | Màn hình còn một chỗ nhưng lúc bấm đã đầy: báo hết chỗ. Không hứa số chỗ trên màn hình luôn mới tức thì. |
| B7 — sự kiện và riêng tư | Thay đổi thực về đăng ký, sức chứa, trạng thái hoặc nội dung công khai phải cập nhật bên hiển thị. Bản công khai chỉ có thông tin workshop/số chỗ/phiên bản, không chứa danh tính đăng ký hoặc mã yêu cầu cá nhân. Kết quả thao tác và lịch sử cá nhân kiểm quyền riêng. Monitoring chỉ admin, hiển thị tình trạng chờ/lỗi/độ trễ/lần thành công gần nhất; không có nút replay/xóa dữ liệu ở MVP. | Cập nhật số chỗ cho mọi người không làm lộ ai vừa đăng ký. Event lỗi được giữ để đối chiếu, không xóa cho sạch dashboard. |
| B8 — danh sách và phạm vi bổ sung | Danh sách công khai gồm OPEN/PAUSED, sắp thời điểm bắt đầu tăng dần, cùng thời điểm dùng ID ổn định. “Đăng ký của tôi” cho xem ACTIVE và lịch sử CANCELLED, phân biệt rõ. Không bổ sung A/B cho pilot này. | Không chỉ ẩn bản hủy rồi làm người dùng hiểu nhầm chưa từng đăng ký. Lịch ở quá khứ vẫn không tự đóng/xóa vì chưa có rule tự động theo thời gian. |

### Chi tiết để không giấu điểm cần quyết

- B2: độ dài tính theo Unicode code point, không theo byte; xuống dòng được chấp nhận trong mô tả, tiêu đề một dòng. Không HTML/Markdown do người dùng nhập. ID workshop/đăng ký/yêu cầu là mã đục do hệ thống/caller tạo theo hợp đồng, không suy quyền từ ID. Giới hạn kỹ thuật độ dài payload/encoding sẽ chốt ở kiến trúc, không được âm thầm mở rộng quyền hoặc làm đổi quy tắc nghiệp vụ đã duyệt.
- B3: việc sửa lịch sau khi có đăng ký là lựa chọn có tác động người dùng, được đưa vào gói này, không coi là chi tiết kỹ thuật. Pilot chưa có email/push nên người dùng chỉ thấy lịch mới khi xem/cập nhật trang. Nếu không đồng ý cho sửa lịch, Human sửa riêng B3 trước khi soạn.
- B5: thông tin phục hồi phải đủ để tái lập cập nhật, nhưng không bắt cấu trúc outbox hoặc thuật toán cụ thể. Phiên bản bao trùm trạng thái công khai nhất quán; cùng phiên bản nhưng khác nội dung là lỗi cần đối chiếu, không chọn tùy tiện. Một snapshot mới đủ bao phủ trạng thái có thể thay nhiều bản cũ; chưa đủ thì đọc nguồn để khôi phục. Không replay nghiệp vụ đăng ký chỉ vì chưa thấy event.
- B6: chưa đặt ngưỡng SLO số giây ở R03. R03 chốt ý nghĩa và cách biểu thị dữ liệu chưa xác nhận; ngưỡng đo theo môi trường/tải thuộc R04/R09. Không dùng việc chưa có ngưỡng để tuyên bố độ trễ đạt. Không thiết kế giao diện/wireframe ở gói này.
- Các rule này áp dụng thống nhất ở web/native; kỹ thuật SSR, realtime, đóng gói mobile và triển khai vẫn ở phase sở hữu. Không rút native thành ví dụ trên web.

## C. Quyền đề nghị cho toàn lượt thực hiện R03 này

### C1 — soạn tài liệu sản phẩm

Cho tạo/sửa Markdown dưới đúng `D:\Code\kynderis\kidea-workshop-pilot\docs`:

- Giữ/cập nhật `features.md`, `business/INDEX.md`.
- Tạo ba tài liệu chung `business/shared/registration.md`, `workshop.md`, `availability.md`.
- Tạo bốn tài liệu Feature `business/features/view.md`, `register-cancel.md`, `admin.md`, `updates.md`.
- Tạo `business/tests.md` cho business test/coverage.

Tổng dự kiến 10 file kể cả hai file đã có; phần chung đi trước riêng phụ thuộc, làm đăng ký/hủy đầu tiên rồi hoàn tất các phần còn lại của MVP. Không tạo file chỉ để lấp cây rỗng. Rule có một nguồn, caller/AC/test dẫn link đúng mục. Giữ preimage tại vùng evidence Kidea trước sửa, kiểm links/hash sau ghi; không xóa lịch sử hoặc file ngoài phạm vi. Nếu có writer khác hoặc root/link/nguồn bất ngờ thì dừng đối chiếu. Không `.kidea`/Git/code tại pilot ở gói này.

### C2 — tích hợp và kiểm tra Kidea

Cho cập nhật hướng dẫn nghiệp vụ trong `.agents/skills/kidea/SKILL.md` và reference mới dưới `references/`, cùng tests/evidence trong repo Kidea theo phương pháp được duyệt. Đọc skill-creator và các procedure liên quan trước sửa. Giữ public CLI/schema/runtime hiện tại; không thêm action, executor sửa sản phẩm hoặc chuyển task bằng shell/internal writer. Chỉ tích hợp năng lực hướng dẫn/đọc/review đã có căn cứ.

Soạn tài liệu pilot vẫn bằng quyền trực tiếp C1, không nhận public helper đã làm việc này. Khoảng trống action sửa sản phẩm/chuyển task phải được nêu ở review R03 và task sở hữu, không giấu dưới tên “tích hợp”. Nếu muốn hiện thực runtime mới thì là thay đổi phạm vi thật, cần trình riêng với ảnh hưởng/kiểm chứng; không tự mở để hoàn thành gói.

Cho chạy syntax/skill validator, kiểm link/backlink/coverage và hồi quy deterministic của lõi bằng runtime/dependency đã có trên D. Không tải/cài thêm hoặc đổi global config; giữ log của mọi lần fail/skip. Nếu chỉ sửa hướng dẫn thì không tự sửa runtime để làm test đạt. Thêm test kiểm tài liệu/hướng dẫn khi cần, không dùng test cơ học thay nghiệm thu ngữ nghĩa.

### C3 — hai phiên AI mới để thử phương pháp chi tiết

**Hai phiên mới, tối đa 15 phút/phiên, tuần tự; không phiên thứ ba hoặc gia hạn tự động.** Không dùng lại quota hai phiên đọc trước. Cùng cấu hình kế thừa, không tự chọn model khác. Thời gian tính riêng ngay trước spawn; follow-up không reset; sắp hết giờ không mở thao tác mới có thể vượt hạn. Timeout/thiếu phần nào giữ PARTIAL/NOT_RUN, không tự chạy bù.

- **A — soạn một lát cắt:** fresh context chỉ được đọc snapshot của nguồn/rule đã duyệt và skill/reference thử đã khóa; viết trong một root thử riêng dưới `.test-output/r03/`, không viết pilot thật. Đầu ra: một rule/flow đăng ký-hủy và business tests có link; thử giữ nguyên hai bài change ngoài MVP, xử lý retry và một lịch thao tác đồng thời. Nếu thiếu dữ kiện thì báo OPEN, không tự Human approval.
- **B — đọc/kiểm đầu ra A:** fresh context, chỉ đọc nguyên byte đầu ra A và nguồn được cấp, không transcript/nhận xét A hoặc oracle. Tái dựng kết quả và chỉ ra sai/thiếu trong rule/flow/AC/test/link; không tự sửa/duyệt. Nếu A không tạo được handoff hợp lệ thì B không chạy, quota không tự chuyển sang bài khác.

Root điều phối chỉ chạy cùng lúc các tác vụ không ghi vào snapshot/root đang do agent sử dụng. Không subagent con. Scope theo chỉ dẫn, không OS sandbox. Không CLI launcher setup, VM, network service, dịch vụ tính phí riêng, credential hoặc Git pilot. Quota hai phiên là giới hạn dùng AI của lượt này, không phải hai người dùng cùng ghi pilot.

Trước chạy: viết prompt cố định từ rubric dưới, tạo nguồn/handoff/manifest, khóa hash, ghi session/deadline và source grant cụ thể; không mở model trước khi mọi prerequisite có. Được chuẩn bị các artifact này sau approval C3 mà không xin lại từng đường dẫn/hash. Nếu phải thay rubric/ngân sách/capability mới thì hỏi, không tự điều chỉnh cho đạt.

## D. Bộ kiểm chứng phải làm, không lấy số test thay bao phủ

Đặc tả/tests cho toàn bốn Feature MVP trong giới hạn B1–B8; mỗi nghĩa vụ có source ID, case/nhánh liên quan và kết quả. Các mô hình hữu hạn sau là phạm vi tối thiểu, chưa là cam kết performance:

| Nhóm | Ca bắt buộc |
|---|---|
| Quyền/hiển thị | Khách/người tham gia/admin; của mình/của người khác/ID không truy cập được; DRAFT/OPEN/PAUSED; dữ liệu cá nhân không lọt đầu ra công khai |
| Đăng ký/hủy | Chưa đăng ký/ACTIVE/CANCELLED; còn chỗ/đầy; hủy rồi đăng ký lại; hủy ID cũ; hủy lặp; PAUSED với ACTIVE/đầy; actor không đủ quyền |
| Retry | Mới/cùng mã cùng nội dung/cùng mã khác nội dung/đang xử lý/chưa xác định; kết quả cũ sau hủy hoặc PAUSED; quyền hiện tại không còn; gửi lại không phát tác dụng phụ lần hai |
| Đồng thời | Hai người tranh chỗ cuối; đăng ký với giảm sức chứa; đăng ký/hủy với PAUSE; xét cả hai thứ tự cho từng cặp; một người gửi hai yêu cầu đăng ký mới |
| Dữ liệu/admin | Biên sức chứa 0/1/1000/1001, dưới/bằng/trên ACTIVE; tiêu đề và mô tả ở dưới/tại/trên giới hạn; lịch bằng/đảo/đúng; chuyển trạng thái hợp lệ/không hợp lệ/không đổi; không tự đóng theo giờ |
| Event/hiển thị | Bản mới/lặp/cũ/cùng version khác nội dung; mất cập nhật/phục hồi/đối chiếu; không replay đăng ký; sửa nội dung/sức chứa/state cập nhật đúng; mất kết nối không giả số chỗ 0 |
| Flow/traceability | Bốn Feature có flow và AC; test truy đúng rule; forward/backlink đủ mục đích; nguồn đổi làm rõ impact; không biến ba test mẫu C=1 thành toàn coverage |

Vét cạn các nhánh hữu hạn của rule/bảng chuyển trạng thái đã chọn; không cần nhân mọi field với mọi field. Tổ hợp bị loại phải có lý do, rủi ro đồng thời/retry không được loại chỉ vì số lượng lớn. Mọi expected phải suy được từ nguồn đã duyệt; điểm chưa có căn cứ giữ OPEN và chặn kết luận tương ứng.

Rubric AI A/B: (1) đúng phạm vi/MVP; (2) không tự chốt OPEN/approval; (3) input/state→output/state rõ; (4) retry không lặp tác dụng; (5) lịch đồng thời không phá invariant; (6) không dùng cache quyết định; (7) link/AC/test có căn cứ và nêu coverage thiếu; (8) B dựng lại từ file không đòi transcript. Ghi PASS/FAIL/PARTIAL/NOT_RUN, giữ nguyên output từng phiên. Test file và review AI là hai lớp khác nhau; không chứng minh sản phẩm đã chạy.

## E. Trình tự làm sau duyệt và điểm dừng cuối

1. Lưu approval đúng B1–B8/C1–C3/D, kiểm root/nguồn/quyền, giữ preimage.
2. Soạn toàn bộ hồ sơ trong C1; tự đối chiếu rule, flow, AC/test, links/coverage. Sửa lỗi soạn thường lệ trong cùng lượt, không hỏi từng field đã có căn cứ.
3. Tích hợp hướng dẫn trong C2, kiểm deterministic; khóa bản dùng AI.
4. Chạy A rồi B trong C3; giữ output/snapshot và chấm D. Sửa lỗi có căn cứ trong quyền, giữ kết quả AI đúng bản đã chạy; nếu sửa nguồn sau thử thì không gán kết quả cũ cho bản mới. Không tự mở AI lần ba để chứng nhận lại.
5. Trình **một gói kết quả cuối**: tài liệu và coverage, số test/AI thực đạt/chưa đạt, giới hạn runtime, các OPEN hoặc thay đổi cần quyết. Human duyệt đầu ra cụ thể và quyết định có khép R03/mở R04 hay chưa. Không cần approval riêng cho mỗi file nếu cùng gói đủ căn cứ; chưa có kết quả thì chưa thể duyệt trước gate này.

Chỉ hỏi giữa chừng nếu phát hiện quyết định thật chưa nằm trong gói (mâu thuẫn nguồn, ảnh hưởng nghiệp vụ mới, quyền/công cụ thiếu, vượt giới hạn hoặc không thể kiểm đúng tiêu chí). Nếu chưa có phát sinh, thực hiện liền mạch đến gói kết quả. Không mua/cài/chạy pilot thật, không khẳng định triển khai hoặc toàn bộ Kidea hoàn chỉnh.
