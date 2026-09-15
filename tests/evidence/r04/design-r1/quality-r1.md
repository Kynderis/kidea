# Workshop — mục tiêu chất lượng lab, bản Q-r1

Đây là **đề xuất đầu ra bước 3, chờ Human duyệt**, không phải số đo hoặc chứng nhận ứng dụng. Quyền soạn từ [R04-DESIGN-BATCH-r1](D:/Code/kynderis/kidea/proposals/r04-design-batch-r1.md); phạm vi sản phẩm từ [Feature Map](../features.md#boundaries). Mọi ca dưới đây **NOT_RUN trên sản phẩm**. Việc review/tạo file không làm test ứng dụng đạt.

<a id="decisions"></a>
## Các lựa chọn mới cần chốt chung

| ID | Mục tiêu đề xuất | Lý do / điều phải chấp nhận |
|---|---|---|
| Q1 | Bài tải nhỏ: 10 người giả, 5 yêu cầu/giây trong 15 phút; thêm bài tranh chỗ riêng | Phù hợp mục đích lab kiểm phương pháp, không là cam kết sản phẩm lớn hoặc suy từ C=1000 |
| Q2 | 95% lượt xem nhận đủ phản hồi trong 1 giây; ghi trong 2 giây; lỗi kỹ thuật không quá 1% từng nhóm | Ngân sách trải nghiệm thử nghiệm do tác giả đề xuất, không tiêu chuẩn ngành hoặc benchmark đã đạt |
| Q3 | 95% cập nhật nhìn thấy trong 2 giây, mọi cập nhật bình thường trong 5 giây; khi không xác nhận được độ mới quá 5 giây phải hiện chưa cập nhật | Tách ghi thành công khỏi view trễ; không bảo đảm mạng bên ngoài luôn tốt |
| Q4 | Crash tiến trình: không mất kết quả đã xác nhận; phục hồi trong 5 phút. Mất ổ dữ liệu: mục tiêu bản sao độc lập cách tối đa 15 phút, phục hồi trong 60 phút | **Riêng mất ổ có thể mất tối đa 15 phút dữ liệu lab đã ghi sau mốc sao lưu**. Đây là ngoại lệ thảm họa mới cần Human chấp nhận, không được áp cho crash thường |
| Q5 | Lab chỉ hoạt động trong phiên thử có người phụ trách; không cam kết 24/7. Tổng dữ liệu vận hành và bản sao pilot tối đa 2 GiB trên D | Giới hạn dữ liệu, không phải tổng dung lượng toolchain; quá giới hạn phải dừng bài thử/xin điều chỉnh, không xóa lịch sử |
| Q6 | Web/native phản hồi thao tác cục bộ trong 0,1 giây ở 95% mẫu; khởi động lạnh và hiện nội dung đầu trong 3 giây ở 95% mẫu | Phải đo riêng Android/iOS/web; không lấy Windows hoặc trình giả lập thay bằng chứng thiết bị bắt buộc |

Các Q là mục tiêu thử được đề xuất để có điểm đạt/rớt, chưa chứng minh phần cứng đáp ứng. Không tự hạ ngưỡng nếu test fail. Nếu Q4 không được chấp nhận thì giữ câu hỏi mức mất dữ liệu khi hỏng ổ; kiến trúc phục hồi phụ thuộc chưa được chốt. Các bảo đảm nghiệp vụ của R03 không đổi trong vận hành bình thường.

<a id="workload"></a>
## WQ — Điều kiện bài đo chung

- Dataset WQ1: ba workshop OPEN,C10; 10 người tham gia và một admin giả đã chọn. Mỗi người tối đa một ACTIVE/workshop theo nguồn, nội dung dùng độ dài biên hợp lệ ở [W-DATA](../business/shared/workshop.md#data). Bài tải bắt đầu không ACTIVE; không lẫn dữ liệu từ lần trước.
- Đề xuất tải ổn định: tổng 5 request/s theo lịch mở, không chờ phản hồi xong mới phát lượt sau; 80% đọc (danh sách, chi tiết, lịch sử chính chủ chia đều theo vòng), 20% ghi đăng ký/hủy luân phiên actor/workshop với mã ý định đúng. Lưu từng lịch phát, actor, action, kết quả kỳ vọng; kết quả FULL/đã đăng ký/tạm dừng đúng nguồn là từ chối nghiệp vụ, không lỗi kỹ thuật. Không xóa chúng khỏi mẫu độ trễ. Ghi từng nhóm thao tác riêng; không lấy đọc nhanh bù ghi chậm.
- Warm-up 2 phút, sau đó cửa sổ đo 15 phút: 4.500 request dự kiến, 3.600 đọc/900 ghi; warm-up báo riêng. Mỗi request có deadline kỹ thuật 10 giây, không đạt deadline tính lỗi; lịch phát bị trễ/không phát được tính missed-offer và không được nhận bài đo đạt. Cuối cửa sổ đợi tối đa deadline để thu kết quả, không bỏ đuôi còn chờ.
- Lỗi kỹ thuật = timeout, lỗi server/transport, kết quả không thể giải nghĩa hoặc lệch kỳ vọng; lỗi nghiệp vụ đúng nguồn đếm riêng. Mẫu thiếu phản hồi gán thời gian deadline cho thống kê và vẫn tính lỗi. Mọi lỗi sai quyền/invariant/dữ liệu là FAIL bất kể tỷ lệ ≤1%. Với lỗi thường, trần 1% tính riêng đọc và ghi trên số đã lên lịch, không làm tròn tăng số lỗi cho phép.
- WQ2 điểm nóng: C1,N0, hai người khác nhau tranh cùng workshop; 100 vòng fixture cô lập, mỗi vòng đối chiếu nguồn có thẩm quyền; không đặt quota 100 lần chạy AI. Đây là đặc tả test tương lai, không quyền tạo/reset dữ liệu hiện tại. Bao gồm lịch admin giảm C/PAUSE và retry từ [ca R03](../business/tests.md#concurrency), không viết lại expected.
- Môi trường E1 để so các mục tiêu thời gian: backend Ubuntu riêng biệt với máy tạo tải; web và từng Android/iOS đo riêng, cùng bản nguồn/config; đường client–backend đo RTT ≤50 ms và thông lượng khả dụng ≥10 Mbit/s, không tiêm mất gói trong bài bình thường. Đây là điều kiện bài thử, không hứa thiết bị/mạng hiện tại có sẵn. Ghi thời gian đơn điệu tại điểm đo; phép đo khác máy phải đối chiếu lệch đồng hồ hoặc dùng một observer thống nhất.
- Trước chạy ở R09: manifest cố định CPU/RAM/ổ, OS/toolchain, thiết bị/model, browser/app version, màn hình, mạng đo thực, artifact/config, dung lượng trống và nguồn dataset. Chưa có manifest thì NOT_RUN/BLOCKED, không PASS trên máy tùy chọn. Máy Mac/Ubuntu/thiết bị và quyền sử dụng vẫn cần preflight; không dựng VM trong lượt này.
- Cùng E1 chạy ba lượt độc lập mỗi nền tảng bắt buộc; tất cả phải qua, giữ cả fail. Báo từng lượt và từng nhóm, không chỉ gộp số đẹp. Số lượt này là đề xuất test sản phẩm tương lai theo Q1/Q2/Q6, chưa quyền chạy/cài. Ngoài E1 chỉ báo số quan sát, không dùng thay kết quả chuẩn.

<a id="response"></a>
## QR — Thời gian phản hồi và tải (Q1/Q2)

Nguồn: [AC xem](../business/features/view.md#ac), [AC đăng ký](../business/features/register-cancel.md#ac), [retry](../business/shared/registration.md#retry). Theo WQ/E1; chỉ số tại client từ gửi request đến nhận hết phản hồi có thể phân loại. Backend còn ghi thời gian xử lý riêng để chẩn đoán, không lấy nó thay thời gian người dùng chờ.

Mục tiêu p95 đọc ≤1.000 ms, p95 ghi ≤2.000 ms, lỗi kỹ thuật ≤1% mỗi nhóm; tính p95 bằng nearest-rank: phần tử thứ ceil(0,95×n) của mẫu tăng dần. Không request treo quá deadline 10 giây. Đây không tự cấp rule retry mới: mất phản hồi vẫn giữ cùng mã và trạng thái chưa xác nhận. Thông lượng thực, p50/p95/max và số lỗi phải được báo cùng nhau; missed-offer >0 khiến lượt không hợp lệ, không tự giảm 5 req/s.

Case QT01: thực hiện WQ1, đối chiếu cả kỳ vọng nghiệp vụ lẫn QR; QT02: trì hoãn phản hồi tới sau deadline để kiểm không báo thành công/thất bại cuối giả; QT03: WQ2 và các lịch concurrency R03, mọi vòng giữ invariant, không dùng tỷ lệ lỗi để bỏ qua vượt chỗ. Các case kỹ thuật phải được cụ thể hóa ở R05 trước thực thi R09.

<a id="freshness"></a>
## QF — Độ mới hiển thị và nhận biết mất quan sát (Q3)

Nguồn: [V-PUBLISH](../business/shared/availability.md#publish), [V-RECONCILE](../business/shared/availability.md#reconcile), [V-STALE](../business/shared/availability.md#stale), [V-MONITOR](../business/shared/availability.md#monitor). Không thay source authority bằng cache.

Với WQ1/E1, đo từ commit thay đổi đã chắc đến observer trên từng web/native đang kết nối nhận và render bản bao phủ thay đổi đó: p95 ≤2 giây, max ≤5 giây. Snapshot mới bao phủ nhiều thay đổi vẫn hợp lệ; không bắt client render mọi version trung gian. Mọi thay đổi thực trong cửa sổ đều phải được observer bao phủ; chưa bao phủ sau 5 giây là FAIL, không bỏ khỏi mẫu. Ghi riêng độ trễ pipeline và render khi chẩn đoán.

Biết mất kết nối/đang reconciliation thì đánh dấu chưa cập nhật ở lần render kế tiếp trong ≤1 giây. Nếu mất kết nối âm thầm: quá 5 giây kể từ lần xác nhận liên lạc/độ mới thành công gần nhất phải đánh dấu chưa cập nhật; không dùng thời gian business event cuối để kết luận mạng mất khi không có sự kiện mới. Chưa từng quan sát không bịa timestamp/số 0. Giữ số cũ đúng nguồn; quá chậm không đảo kết quả đăng ký.

QT04: ghi thành công, chặn đường cập nhật 30 giây; backend vẫn đúng, client báo cũ, sau nối lại bắt kịp trong 10 giây với backlog của WQ1. QT05: duplicate/cũ/gap/cùng version khác nội dung theo E01–E06 của R03, không đếm đôi/lùi hoặc ghép trạng thái. QT06: mất telemetry không báo pending/error/lag bằng 0; mất cả dashboard phải được phát hiện qua đường không phụ thuộc chính nó ở thiết kế monitoring. Ngưỡng backlog/cảnh báo và người nhận cụ thể còn thuộc bước 5, không giả đã có dịch vụ.

<a id="recovery"></a>
## QD — Độ bền và phục hồi (Q4)

Nguồn: [R-INV](../business/shared/registration.md#invariant), [R-RETRY](../business/shared/registration.md#retry), [V-PUBLISH](../business/shared/availability.md#publish). Giữ kết quả lịch sử/nghĩa vụ cập nhật; chưa biết lưu thì không thành công cuối.

| Sự cố / bài thử | Mất dữ liệu cho phép | Mục tiêu thời gian và cách xác nhận |
|---|---|---|
| QT07 crash tiến trình, storage còn nguyên; tiêm trước lưu, sau lưu trước phản hồi và lúc view chưa cập nhật | 0 kết quả đã xác nhận; trạng thái chưa xác nhận phải đối chiếu, không chạy ý định lần hai | ≤5 phút từ thời điểm tiêm crash đến khi đăng ký/đọc/monitor và đối chiếu backlog hoạt động đúng; kiểm trực tiếp authority, retry và view |
| QT08 mất ổ chứa dữ liệu trong lab giả | **Đề xuất tối đa 15 phút thay đổi sau mốc backup; cần Human duyệt ngoại lệ này** | ≤60 phút từ lúc tuyên bố mất storage đến restore trên vùng thay thế được cấp quyền, kiểm quyền/invariant, lịch sử tại recovery point và tái lập view |

QT08 chỉ được chạy trên bản sao/fixture cô lập và theo quyền phá hủy riêng ở R09, không phá ổ máy thật. Backup phải độc lập miền lỗi của ổ nguồn, nhất quán cả dữ liệu/kết quả retry/nghĩa vụ cập nhật, truy được recovery point. Cùng ổ D hoặc cùng ổ vật lý khác partition không chứng minh độc lập. Chưa có đích backup/phần cứng/quyền thì BLOCKED, không ghi sẵn sàng; không thuê dịch vụ trong gói này.

Phải kiểm tuổi recovery point ≤15 phút tại thời điểm sự cố, không chỉ lịch chạy backup. Backup fail/stale chặn nhận điều kiện QD; không giả bản sao luôn thành công. Giữ tập thao tác sau recovery point trong log bài thử để đo mất thực; không lén phát lại chúng nhằm che mất dữ liệu. Sau restore phải cô lập client/bản dữ liệu cũ, thông báo recovery point và các kết quả không còn xác nhận, đối chiếu trước mở ghi; thiết kế kiến trúc chốt epoch/cache/retry reconciliation. Không trả dữ liệu cũ như kết quả hiện tại, không nhận restore là rollback app an toàn.

Ngoại lệ mất ổ chỉ dành lab, không thay yêu cầu crash thường và không được đem thành bảo đảm production. Nếu Human muốn mất ổ cũng không mất bất kỳ kết quả nào đã xác nhận, cần đổi Q4 và đánh giá thêm tài nguyên/chi phí trước kiến trúc. Không chọn công nghệ backup ở đây.

<a id="privacy"></a>
## QS — Quyền, bảo mật và lưu giữ (giữ nguồn, không miễn theo tỷ lệ)

Nguồn: [W-ACCESS](../business/shared/workshop.md#access), [W-DATA](../business/shared/workshop.md#data), [W-LISTS](../business/shared/workshop.md#lists), [R-RETRY](../business/shared/registration.md#retry), [V-PUBLISH](../business/shared/availability.md#publish). Dữ liệu/actor giả, không PII/secret thật; kết quả/lịch sử lab không TTL/xóa tự động.

QT09: toàn ma trận quyền P01–P08; role giả, ID người khác, quyền bị thu hồi với request cũ. Kết quả mong đợi theo nguồn; **0 tiết lộ sai quyền hoặc mutation trái phép**. QT10: HTML SSR, cache chia sẻ, event, lỗi và log public không chứa DRAFT/danh tính/requestID riêng; private response chỉ chính chủ theo nguồn. QT11: đầu vào markup/biên theo D01–D09, dữ liệu không được thực thi như nội dung chủ động. Không nhận pass các ca này là đã kiểm hết mọi lỗ hổng.

Trong thiết kế bước 5–7 phải quyết định cơ chế xác thực, secret/config, bảo vệ đường truyền, chống lạm dụng và audit với test tương ứng; không coi “lab” là miễn kiểm quyền server. Audit/telemetry chỉ giữ trường tối thiểu cần chẩn đoán, không payload riêng; thời hạn/lưu trữ audit còn phải trình khi thiết kế admin, không tự dọn lịch sử để đáp ứng dung lượng. Bản backup/evidence cũng giữ ranh giới đọc tương ứng, không đẩy lên nguồn public dữ liệu không được phép.

<a id="resources"></a>
## QB — Khả dụng, chi phí và dung lượng (Q5)

Nguồn: [giới hạn lab](../features.md#boundaries). 0 đồng phát sinh giữ nguyên. Đề xuất lab chỉ hoạt động trong cửa sổ thử đã xác nhận có người phụ trách; ngoài cửa sổ ghi offline theo kế hoạch, không cam kết tháng/24×7. Trong WQ1 không tiêm lỗi, lỗi kỹ thuật phải qua QR; trong diễn tập lỗi áp QF/QD, báo downtime riêng, không loại khỏi báo cáo chung để tô đẹp.

Ngân sách đề xuất **2 GiB tổng dữ liệu pilot đang dùng + log + backup**, bố trí trên D hoặc đích sẵn có được phép; không bao gồm toolchain/SDK/artifact cài đặt, chúng phải được kiểm dung lượng và duyệt ở phase sau. Không phát sinh cài đặt lên C trong R04. Đạt 80% ngân sách phải báo, dự kiến vượt hoặc không đủ dung lượng an toàn trên đích thì dừng bài thử/xin quyết định, không tự xóa lịch sử/backup hay ép dữ liệu vào C.

QT12: đo dung lượng trước/sau mỗi lượt WQ và diễn tập, tính cả backup/log; thử giả lập gần giới hạn trên fixture để chắc báo/dừng, không fill ổ thật. Ghi CPU/RAM/IO/network cùng độ trễ để biết bottleneck; chưa đặt trần CPU/RAM/pin tùy tiện khi chưa chọn thiết bị. Đủ RAM/ổ và ngưỡng cảnh báo tài nguyên là đầu vào kiến trúc/ops phải chốt trước chạy, không phải miễn kiểm. Nhu cầu toolchain có thể lớn hơn nhiều ngân sách dữ liệu này; chưa có quyền cài.

<a id="client-seo"></a>
## QC — Trải nghiệm web/native và SEO (Q6 và phần đã duyệt)

Nguồn: [AC-V3](../business/features/view.md#ac), [nền tảng](../features.md#boundaries), [V-STALE](../business/shared/availability.md#stale). D3 gói R04 đã xác nhận N/A cho index/ranking/trích dẫn thật trong lab; không N/A nội dung/HTML/riêng tư.

QT13: mỗi nền tảng E1, 100 lần thao tác cục bộ không phụ thuộc mạng (chọn lọc, chạm nút) → phản hồi loading/disabled/focus p95 ≤100 ms; không nhận loading là đã đăng ký thành công. QT14: 30 lần khởi động lạnh mỗi nền tảng, mỗi lần reset trạng thái tiến trình theo protocol được phép, không xóa nghiệp vụ; p95 ≤3 giây từ mở app/điều hướng trang tới nội dung công khai đầu tiên có ích. Ghi riêng cold/warm cache, định nghĩa cold cụ thể theo browser/OS ở R05; không dùng warm thay cold. Đồng thời giữ QR cho response và không bỏ mẫu lỗi.

QT15: tắt JS, trang giới thiệu/danh sách/chi tiết công khai vẫn có nội dung đúng audience, title/description và đường liên kết hợp lệ; không DRAFT/private lọt HTML dùng chung. QT16: bàn phím/nhãn lỗi/focus, màn hẹp và trạng thái không chỉ dùng màu được đặc tả ở bước UX rồi kiểm; không tuyên bố chứng nhận chuẩn accessibility chưa được chọn. Khả năng phản hồi khi mất mạng theo QF/QS; không đặt giờ pin/khung hình như đã đo. Các ngân sách riêng có thể bổ sung với căn cứ thiết bị ở bước kỹ thuật nhưng không thay các mục tiêu đã duyệt âm thầm.

<a id="coverage"></a>
## Truy xuất, giới hạn và điểm dừng

| Nhóm yêu cầu | Ca cần thực thi | Nơi thiết kế tiếp / gate |
|---|---|---|
| QR, WQ, đúng nghiệp vụ khi tải | QT01–QT03 | Kiến trúc và đặc tả test; không đổi các ca nguồn [R03](../business/tests.md#coverage) |
| QF và mất tín hiệu | QT04–QT06 | UX/monitoring/kiến trúc |
| QD crash/mất ổ | QT07–QT08 | Kiến trúc, đích backup/quyền diễn tập và gate vận hành |
| QS quyền/dữ liệu | QT09–QT11 | UX/admin/kiến trúc và test bảo mật |
| QB tài nguyên/giới hạn lab | QT12 | Ops/kiến trúc, preflight môi trường |
| QC web/native/SEO | QT13–QT16 | UX/SEO, test từng nền tảng |

Human chốt Q1–Q6 để kết thúc bước 3; không chọn framework/DB/API hoặc duyệt bước 4–7 qua file này. Thiết bị/môi trường thật, backup đích độc lập, người vận hành/kênh cảnh báo, audit/retention kỹ thuật và cơ chế giao thức chưa được chọn; chúng chặn thiết kế/thực thi tương ứng, không giả đã sẵn sàng. Mọi kết quả sản phẩm hiện NOT_RUN, chưa dùng quota AI độc lập R04.
