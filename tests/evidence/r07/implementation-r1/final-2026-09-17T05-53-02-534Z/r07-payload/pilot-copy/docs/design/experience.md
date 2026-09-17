# Workshop — trải nghiệm và SEO, bản UX-r1

**Amendment Web r2, 2026-09-17 — theo quyết định Human:** client hiện hành chỉ Web; app Android/iOS là Future chưa roadmap/thời hạn. Giữ nghiệp vụ, ngưỡng backend/Web, 137 source ID và 20 nhóm TC; A/I/N1/N2 chỉ là biến thể Future, không PASS/N/A mới. Hồ sơ r1 và kết quả lab cũ giữ đúng nguồn; amendment không là nghiệm thu ứng dụng hoặc R05. Nguồn quyết định và snapshot/hash trước–sau: repo Kynderis/kidea, `KIDEA_DESIGN.md#client-web-scope-approved`, `tests/evidence/r05/web-scope-r1/manifest.json`.

Đề xuất đầu ra **bước 4 và gate thiết kế SEO**, chưa được Human duyệt. [Q-r1](quality.md#decisions) đã được Human “Duyệt chất lượng R04” sau answer `a24681b9db77e0f8618094e805500d6e6f37b174`; đó là mục tiêu, không bằng chứng chạy. Nội dung dưới đây không tạo code, API hoặc quyền vận hành. Nguồn approval/tiến độ ở [báo cáo R04](D:/Code/kynderis/kidea/tests/evidence/r04/design-r1.md); không lấy nhãn trong hồ sơ thay record đúng bản.

<a id="choices"></a>
## Chốt cùng một gói UX1–UX6

| ID | Đề xuất | Ví dụ / đánh đổi |
|---|---|---|
| UX1 | Web giữ sáu nhóm trang, mobile hai màn hình; cùng dữ liệu/nghiệp vụ, bố cục gọn một cột khi hẹp | Mobile chuyển bộ lọc Tất cả/Của tôi ngay trong danh sách, không thêm màn hình admin |
| UX2 | Hiển thị riêng kết quả thao tác và trạng thái hiện tại; chưa xác nhận thì giữ ý định cũ | Mất mạng sau bấm đăng ký không hiện “Thất bại, đăng ký lại”; kiểm kết quả cũ trước |
| UX3 | Hủy chỗ có xác nhận rõ workshop; đăng ký không thêm hộp xác nhận; không giả cập nhật thành công trước server | Giảm bấm nhầm hủy, đổi lại thêm một lần bấm khi hủy |
| UX4 | URL chi tiết dùng ID ổn định, không đổi theo tên; trang công khai có nội dung đọc trước JavaScript | Đổi tên workshop không tạo URL mới; URL kém đẹp hơn slug nhưng đơn giản và ổn định |
| UX5 | SEO lab giữ noindex/phân quyền, metadata/canonical và liên kết; không Event rich-result markup cho bài mẫu hiện tại | Chưa có nguồn địa điểm/loại sự kiện đủ căn cứ; không bịa trường hoặc mở indexing để thử |
| UX6 | Tiếng Việt, thời gian hiển thị theo múi giờ workshop có nhãn; bàn phím/focus/nhãn lỗi và trạng thái bằng chữ | Không đổi giờ âm thầm theo máy; không tuyên bố chứng nhận accessibility hoặc thêm đa ngôn ngữ |

Giữ nguyên nguồn: [phạm vi nền tảng](../features.md#boundaries), [quyền](../business/shared/workshop.md#access), [vòng đời](../business/shared/workshop.md#state). Không thêm thanh toán/waitlist/email/push, tìm kiếm hoặc phân trang mới. Các bố cục admin/ops chỉ xác định trải nghiệm ở bước 4; quyền/audit/monitoring chi tiết phải qua bước 5–6.

<a id="screens"></a>
## U-SCREENS — Màn hình, nội dung và điều hướng

Nguồn: [AC xem](../business/features/view.md#ac), [W-LISTS](../business/shared/workshop.md#lists), [W-DATA](../business/shared/workshop.md#data), [đăng ký](../business/features/register-cancel.md#flow), [admin](../business/features/admin.md#flow), [cập nhật](../business/features/updates.md#flow).

| Màn hình / route web đề xuất | Ai dùng, dữ liệu và thao tác | Empty/loading/error/đi tiếp |
|---|---|---|
| W0 `/` Giới thiệu | Khách trong lab và tài khoản hợp lệ; mục đích thử, không dịch vụ thật, link Xem workshop | Nội dung tĩnh; link tới W1; không yêu cầu đăng nhập chỉ để đọc nội dung công khai trong lab |
| W1 `/workshops` | OPEN/PAUSED; tên, lịch có timezone, nhãn mở/tạm dừng, chỗ đã quan sát và thời điểm; thứ tự đúng W-LISTS | Chưa có workshop công khai: “Chưa có workshop”; tải lỗi khác empty; thẻ tới W2 |
| W2 `/workshops/{id}` | Tiêu đề, mô tả plain text, start/end/timezone, C/số chỗ quan sát; trạng thái cá nhân chỉ sau kiểm quyền; đăng ký/hủy theo U-ACTION | Không thể truy cập dùng U-ERROR; trở về W1 hoặc W3; metadata/HTML public không trộn dữ liệu cá nhân |
| W3 `/my-registrations` | Chỉ chính chủ, ACTIVE và CANCELLED phân biệt từng registration ID; tên/lịch và link W2 | Chưa đăng ký: link W1; chưa tải/không quyền không được báo “không có”; không lọc mất lịch sử hủy |
| W4 `/admin/workshops` và `/admin/workshops/{id}` | Chỉ admin; danh sách gồm DRAFT, tạo/sửa và các lệnh hợp lệ; form trong cùng nhóm trang | Empty cho phép tạo; lỗi field giữ phần nhập chưa gửi; lỗi quyền không để lại thông tin nhạy cảm; chi tiết tại bước admin |
| W5 `/operations` | Chỉ admin; pending/error/lag/last-success và thời điểm quan sát, chữ mất dữ liệu khi không biết | Không dùng empty/0 thay lỗi thu thập; không nút replay/xóa; thiết kế tín hiệu/cảnh báo tại bước monitoring |
| N1 danh sách Android/iOS — Future chưa roadmap | Tất cả/Của tôi; Tất cả cùng W1, Của tôi cùng W3 sau kiểm quyền | Bộ lọc trên cùng màn hình; trở về từ N2 giữ bộ lọc/vị trí khi dữ liệu còn hợp lệ |
| N2 chi tiết Android/iOS — Future chưa roadmap | Cùng nội dung/nghĩa với W2, vùng lịch sử của tôi khi hợp lệ; thao tác cùng U-ACTION | Không thêm admin/ops native; back tới N1, không tự gửi lại thao tác do điều hướng |

Mã ID route là định danh đục, không suy quyền hoặc nội dung từ nó. Encoding/validation cụ thể là hợp đồng bước 7. Không dùng tên/slug như nguồn identity thứ hai. URL lọc/điều hướng không chứa actorID, token, requestID hoặc kết quả riêng.

### Phác thảo bố cục chung (không phải giao diện đã xây)

```text
W1                                   W2
Workshop thử nghiệm                  < Danh sách
[Tất cả] [Của tôi*]                   Lớp học thủ công
Trạng thái kết nối                   01/10 09:00–10:00 (UTC+07:00)
--------------------------------     Mô tả đầy đủ, văn bản thuần
Tên / lịch / Mở hoặc Tạm dừng         Còn 1 / 10 · quan sát 09:12:03
Còn x · quan sát lúc t                [Chưa cập nhật] khi cần
[Xem chi tiết]                       Trạng thái của tôi: ...*
--------------------------------     [Đăng ký / Hủy / Kiểm tra kết quả]*
* yêu cầu phiên đúng quyền           Kết quả thao tác: ... (vùng riêng)
```

```text
W3 / bộ lọc Của tôi        W4 admin                    W5 vận hành
Tên/lịch · ACTIVE         Danh sách + [Tạo]           Tình trạng dữ liệu
ID đăng ký · [Chi tiết]    Form: tên/mô tả/lịch/C      Pending | Error | Lag
Tên/lịch · CANCELLED      State + lệnh phù hợp        Thành công gần nhất
ID khác · [Chi tiết]      Lỗi tại field / [Lưu]       Thu thập gần nhất
Không nút xóa lịch sử     Không xóa/hủy hộ            Không replay/xóa
```

Đây là bố cục và thông tin, không chốt framework/component hoặc dựng dashboard. Web rộng dùng vùng điều hướng và cột nội dung; Web hẹp một cột (native Future giữ ý tưởng lịch sử), nội dung dài xuống dòng, không cắt mất timezone/trạng thái hoặc nút chính. Không thêm ảnh/logo/asset lớn khi bài mẫu không có nguồn ảnh.

<a id="action"></a>
## U-ACTION — Đăng ký, hủy và kết quả chưa biết

Nguồn quyết định: [R-RETRY](../business/shared/registration.md#retry), [R-NEW](../business/shared/registration.md#new), [R-INV](../business/shared/registration.md#invariant), [R-SERIAL](../business/shared/registration.md#serial), [W-STATE](../business/shared/workshop.md#state), [W-ACCESS](../business/shared/workshop.md#access). UI không là authority. Ngưỡng phản hồi từ [QR](quality.md#response), phản hồi cục bộ từ [QC](quality.md#client-seo).

| Trạng thái biết được / kích thích | UI và hành động đề xuất | Không được suy diễn |
|---|---|---|
| Khách muốn đăng ký/hủy hoặc xem Của tôi | Hiện “Cần phiên tài khoản thử hợp lệ” và điểm vào xác thực lab; giữ đích trở về không có dữ liệu riêng | Không tin actor/role do client tự chọn. Cách cấp phiên/tài khoản được chốt ở kiến trúc; không thêm đăng ký tài khoản/quên mật khẩu/OAuth trong UX |
| OPEN, chưa ACTIVE, không có ý định chưa rõ | [Đăng ký] tạo một ý định; khóa bấm lặp cho chính ý định, hiện “Đang gửi” | Số chỗ cache không bảo đảm nhận; server có thể trả FULL/PAUSED/quyền lỗi |
| Cache báo hết chỗ hoặc đã cũ nhưng chưa ACTIVE | Hiện số quan sát + nhãn; cho [Kiểm tra và đăng ký] là hành động chủ động mới khi người dùng chọn, server xét hiện tại | Không tự gửi đăng ký khi refresh hoặc khi mạng nối lại |
| ACTIVE chính chủ, OPEN | [Hủy đăng ký] mở xác nhận tên/lịch và “Hủy chỗ này?”; [Giữ chỗ] đóng không gửi, [Xác nhận hủy] gửi đúng registration ID | Không hủy một ACTIVE khác nếu ID cũ không còn ACTIVE |
| PAUSED đã quan sát | Nhãn tạm dừng, không cho tạo đăng ký/hủy mới từ UI; cho làm mới và xem lịch sử/kết quả cũ | Không áp điều kiện OPEN vào việc kiểm kết quả lịch sử; backend vẫn kiểm trạng thái hiện tại khi có request |
| Đang gửi rồi mất phản hồi/timeout | “Chưa xác nhận kết quả” + [Kiểm tra kết quả]; giữ cùng requestID/actor/content; không tạo mã mới | Không thông báo thất bại cuối, không hiện đã có chỗ khi chưa biết |
| Kết quả cuối thành công | Hiển thị kết quả thao tác rõ, đọc/đối chiếu trạng thái hiện tại; view chỗ chậm có nhãn riêng | “Lần đó đăng ký thành công” không tự là ACTIVE hiện tại sau hủy/rebook |
| Kết quả cuối FULL/đã đăng ký/đã hủy/PAUSED | Hiện nghĩa đúng nguồn, cập nhật quan sát; nếu người dùng chủ động tạo ý định mới thì dùng mã mới | Không tự retry mã mới trong nền hoặc biến từ chối thành lỗi kỹ thuật |
| Cùng mã khác nội dung | Báo không thể dùng mã này cho nội dung khác; bảo toàn ý định cũ để kiểm, không chạy nội dung mới | Không âm thầm đổi mã để né xung đột |
| Quyền bị thu hồi / đổi actor | Ẩn/xóa khỏi view dữ liệu riêng của phiên cũ, yêu cầu xác thực; không đọc kết quả riêng bằng mã đã biết | Không dùng dữ liệu cũ cấp quyền hoặc tự gửi dưới actor mới |

Cho điều hướng khỏi màn hình khi đang chờ; khi quay lại phục hồi trạng thái chưa xác nhận, không phát lại mutation chỉ vì render/back. Yêu cầu lưu dấu ý định an toàn theo actor qua reload/app restart, không đặt requestID vào URL hoặc log công khai. Nếu không thể phục hồi danh tính ý định, phải đối chiếu qua phiên hợp lệ và báo giới hạn, không tự tạo ý định thay thế. Cơ chế lưu/query và bảo vệ dấu ý định thuộc bước 7, không được bỏ nghĩa retry R03.

Kết quả hủy rồi đăng ký lại hiển thị hai registration ID khác nhau trong lịch sử. Không có nút xóa lịch sử. Không khóa vĩnh viễn mọi thao tác trên workshop chỉ vì đang có ý định chưa rõ: khóa nút phát trùng cùng ý định; hành động khác cần tách rõ tác động/ID và vẫn do server quyết định theo nguồn.

<a id="error"></a>
## U-ERROR — Trạng thái chung, quyền và dữ liệu cũ

Nguồn: [V-STALE](../business/shared/availability.md#stale), [V-RECONCILE](../business/shared/availability.md#reconcile), [V-PUBLISH](../business/shared/availability.md#publish), [W-ACCESS](../business/shared/workshop.md#access); thời gian theo [QF](quality.md#freshness), giới hạn sau mất ổ theo [QD](quality.md#recovery).

| Trạng thái | Biểu hiện / cách tiếp tục |
|---|---|
| Loading lần đầu | Placeholder/nhãn đang tải, chưa có số chỗ thì không hiện 0. Không chặn đọc nội dung SSR đã có |
| Empty sau response hợp lệ | Thông điệp đúng W1/W3; không dùng empty khi request lỗi hoặc hết quyền |
| Lỗi đọc tạm thời | “Chưa tải được” + [Thử tải lại]; chỉ tải dữ liệu, không gửi lại mutation |
| Mất kết nối đã biết / reconciliation | Giữ số và timestamp đã quan sát, nhãn chưa cập nhật theo QF; không ghép C/N từ hai version |
| Mất kết nối âm thầm | Quá ngưỡng xác nhận độ mới QF thì nhãn cũ; không coi thời gian event cuối là heartbeat |
| ID không tồn tại hoặc không thuộc phạm vi | Cùng thông điệp “Không thể truy cập workshop này”; không lộ DRAFT, chủ sở hữu, C/N hay kết quả cũ |
| Mất quyền ở màn hình riêng | Dừng render dữ liệu riêng, không giữ trên back stack cho actor mới; chuyển điểm vào phiên hợp lệ/đọc công khai; trạng thái server là căn cứ |
| Version cũ/lặp/mâu thuẫn | Theo V-RECONCILE; không lùi số chỗ hoặc chọn tùy tiện; mâu thuẫn hiện chưa xác nhận và đối chiếu |
| Sau restore mất ổ | Thông báo dữ liệu phục hồi tới mốc được xác nhận; kết quả sau mốc không tự coi còn hiệu lực. Chặn gửi lại ý định cũ chưa đối chiếu; chỉ mở ghi khi cơ chế phục hồi được xác nhận |

Form admin lỗi giữ phần nhập trong đúng phiên có quyền, gắn nhãn field và bản server đang biết; không tự ghi đè thay đổi mới. Chi tiết xung đột/admin audit thuộc bước 6. Ops thiếu telemetry không hiện xanh; tín hiệu/người nhận/cảnh báo thuộc bước 5. Không tạo nút điều khiển vận hành ngoài nghiệp vụ đã duyệt.

<a id="usability"></a>
## U-USABILITY — Nội dung và cách dùng

Nguồn: [W-DATA](../business/shared/workshop.md#data), [QC](quality.md#client-seo), [W-LISTS](../business/shared/workshop.md#lists). Tiếng Việt cho bài mẫu; tên/mô tả giữ plain text theo rule, lịch hiển thị ngày/tháng/năm, giờ bắt đầu/kết thúc và timezone workshop. Nếu hai mốc khác ngày/offset thì ghi đủ từng mốc, không bỏ ngày hoặc tự chuẩn hóa sai thời điểm. Không thêm trường timezone mới vào nghiệp vụ.

- Bàn phím: mọi liên kết/nút/form đi tới và kích hoạt được; focus nhìn thấy, không mắc kẹt. Dialog hủy có tên, focus vào nội dung/điều khiển an toàn, Escape/đóng trả về nút mở, không gửi hủy.
- Loading/kết quả/lỗi có nhãn chữ được công nghệ hỗ trợ đọc thông báo phù hợp; không giành focus mỗi khi số chỗ đổi. Lỗi field gắn field, thông báo tổng dẫn tới lỗi đầu để sửa; không giả thứ tự lỗi admin thành rule mới.
- Bố cục kiểm ở bề rộng 360 và 1280 CSS px, thêm phóng chữ 200% trên web; không mất nội dung/nút chính hoặc buộc cuộn ngang toàn trang. Biến thể cỡ chữ hệ thống native giữ lịch sử Future, không thuộc gate R05 hiện hành. Đây là phạm vi kiểm đề xuất của UX6, không chứng nhận chuẩn pháp lý/accessibility toàn diện.
- Nhãn Mở/Tạm dừng/Đã đăng ký/Đã hủy/Chưa cập nhật không chỉ phân biệt màu. Hiển thị Unicode dài/emoji/description 5000 code point đúng nguồn; ngày quá khứ không tự biến OPEN thành đóng.
- Không thêm analytics/cookie marketing hoặc thông báo ngoài app vào lab. Cơ chế phiên an toàn không được biến thành màn hình quản lý người dùng mới ngoài phạm vi.

<a id="seo"></a>
## S-DESIGN — Nội dung, URL, metadata và ranh giới

Nguồn sản phẩm: [phạm vi công khai](../features.md#boundaries), [W-ACCESS](../business/shared/workshop.md#access), [AC-V3](../business/features/view.md#ac), [QC](quality.md#client-seo). Public ở đây nghĩa là audience nghiệp vụ trong **lab kín**, không phải đã xuất bản ra Internet.

| Trang | Nội dung/title/description và liên kết | Canonical/index và kết quả đích |
|---|---|---|
| `/` | H1 “Workshop thử nghiệm”; title cùng nghĩa, description giải thích bài lab; link tới danh sách | Canonical tự trỏ URL sạch trên origin lab được cấu hình; noindex; nội dung prerender |
| `/workshops` | H1/title “Danh sách workshop”; description về danh sách thử; link HTML tới từng chi tiết và trang giới thiệu | Canonical tự trỏ, không tạo URL khác theo phiên người dùng; noindex; SSR đúng quyền |
| `/workshops/{id}` cho OPEN/PAUSED | H1 tên; title “{Tên} – Workshop thử nghiệm”; description rút gọn từ mô tả plain text, không bịa; link về danh sách | Canonical tự trỏ ID ổn định; đổi tên không đổi URL; noindex; SSR chỉ dữ liệu công khai |
| Của tôi/admin/ops | Title chung, nội dung chỉ qua quyền; không tên người/requestID trong metadata/URL chia sẻ | Không đưa vào sitemap/public links; noindex, không cache chia sẻ dữ liệu riêng; canonical nếu có chỉ URL chính của cùng tài nguyên riêng, không trỏ sang public |
| ID không tồn tại hoặc không được truy cập | Cùng thông báo không truy cập; không nhúng nội dung đối tượng trong HTML/title | Yêu cầu phản hồi không-found thống nhất cho chi tiết ẩn/không có; không trang lỗi giả thành nội dung hợp lệ để index; status kỹ thuật cụ thể hóa ở kiến trúc |

Origin/canonical lấy cấu hình môi trường được xác nhận, không đoán hostname request hoặc domain production chưa có. Không canonical về trang chủ để che lỗi. URL chứa token/actor hoặc tham số riêng không trở thành URL canonical, nội dung private không được xuất sang canonical public. Chưa có slug cũ hoặc alias nên không dựng migration redirect giả; nếu sau này đổi URL thật cần quyết định redirect và kiểm link tương ứng.

Lab giữ lớp giới hạn truy cập độc lập với metadata. `noindex` không thay bảo vệ dữ liệu; Google phải đọc được chỉ thị mới xử lý, nên không khẳng định robots.txt chặn crawl cộng noindex tự bảo đảm gỡ URL đã lộ. Không mở truy cập crawler của lab để chứng minh SEO. [Nguồn Google về noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Canonical là tín hiệu URL ưu tiên, không bảo đảm máy tìm kiếm sẽ chọn hoặc index. Các URL nội bộ dùng nhất quán; cấu hình cụ thể và các biến thể HTTP được kiểm ở bước 7–8. [Nguồn Google về canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Đề xuất **không phát Event rich-result structured data** cho pilot hiện tại: nguồn nghiệp vụ không có địa điểm/loại sự kiện đủ căn cứ, không thêm trường giả chỉ để qua validator. Vẫn có HTML/metadata hợp lệ và test không rò thông tin; đây không bỏ khả năng hướng dẫn structured data của Kidea cho project phù hợp. Google có các điều kiện dữ liệu cụ thể cho trải nghiệm Event. [Nguồn Google Event](https://developers.google.com/search/docs/appearance/structured-data/event).

Lab không gửi sitemap/IndexNow/Search Console, không hứa index/ranking/AI citation. Danh sách URL công khai được kiểm từ link HTML; yêu cầu sitemap khi xuất bản thật phải qua gate phát hành, không dùng UX5 cấp quyền publish. Policy search bot và training bot là hai quyết định riêng: lab không mở cho cả hai, không suy chấp nhận search là chấp nhận training. Người biên tập nội dung workshop là vai admin đã có, không tự giao Human lịch viết bài marketing. Nội dung giới thiệu ghi rõ bài thử, không thêm cam kết dịch vụ/thanh toán.

<a id="cases"></a>
## UX-T — Ca kiểm dự kiến, tất cả NOT_RUN trên ứng dụng

| Case | Đầu vào / kích thích | Expected / nguồn |
|---|---|---|
| UX-T01 | Tắt JS, mở `/`, danh sách và OPEN/PAUSED detail | Đọc được nội dung/public links, đúng metadata; [S-DESIGN](#seo), không thao tác cá nhân giả hoạt động khi thiếu runtime |
| UX-T02 | Từng W1/W3 (N1 Future): loading → empty hợp lệ, rồi lỗi mạng/quyền | Phân biệt bốn trạng thái; [U-SCREENS](#screens), [U-ERROR](#error) |
| UX-T03 | Đăng ký X, mất phản hồi, back/reload/app restart, quay lại | Giữ ý định/kiểm X sau đúng quyền, không X→Y tự động; [U-ACTION](#action) |
| UX-T04 | X thành công, hủy A rồi rebook B, đọc lại X | Kết quả lịch sử không hồi sinh A, lịch sử phân biệt A/B; [U-ACTION](#action) |
| UX-T05 | OPEN/PAUSED × chưa ACTIVE/ACTIVE/CANCELLED; thêm cache đầy/cũ | Nút/nhãn đúng bảng action; state đổi giữa nhìn/bấm vẫn theo server, không thay rule; [U-ACTION](#action) |
| UX-T06 | Hủy: đóng dialog, Escape, xác nhận; double-click | Hai nhánh đầu không mutation, xác nhận đúng ID/ý định, không hủy hai lần; [U-ACTION](#action), [U-USABILITY](#usability) |
| UX-T07 | Mất tín hiệu rõ/âm thầm, chưa từng có snapshot, version xung đột | Nhãn/thời gian theo [QF](quality.md#freshness), không giả 0/xanh/lùi state; [U-ERROR](#error) |
| UX-T08 | Đổi actor/mất quyền, ID người khác/DRAFT/không có | Không leak metadata/HTML/cache/history/back stack; [U-ERROR](#error), [S-DESIGN](#seo) |
| UX-T09 | Tiêu đề/description biên, emoji, lịch khác ngày/timezone, ngày quá khứ | Đúng miền và nghĩa, không cắt mất thông tin hoặc auto-close; [U-USABILITY](#usability) |
| UX-T10 | Bàn phím, focus dialog/field, 360/1280 px, chữ 200%, chữ native lớn Future | Hoàn thành luồng chính không mắc kẹt/mất nút/nhãn; [U-USABILITY](#usability) |
| UX-T11 | Đổi tên workshop, URL tham số/ID sai và config origin sai | URL identity không đổi; URL lỗi không biến thành trang hợp lệ/canonical giả; [S-DESIGN](#seo) |
| UX-T12 | HTML lab/public/private, tìm Event JSON-LD và sitemap submission | Noindex đúng thiết kế, không private/markup giả, không submit mạng; [S-DESIGN](#seo) |
| UX-T13 | Hành trình Web W1/W3 → W2 → back; biến thể Android/iOS N1 Tất cả/Của tôi → N2 → back Future | Cùng rule/identity, giữ navigation không mutation; không admin native; [U-SCREENS](#screens) |
| UX-T14 | Phục hồi mất ổ với recovery point trước kết quả client đã nhớ | Cảnh báo/đối chiếu/chặn replay không căn cứ theo [QD](quality.md#recovery), [U-ERROR](#error); cơ chế kỹ thuật còn gate kiến trúc |
| UX-T15 | Admin thao tác sai field, ops mất collector; phiên không admin | UI thể hiện lỗi/giới hạn, không cấp quyền qua nút; [U-SCREENS](#screens), không giả đã hoàn thành bước 5–6 |

Các ca là đặc tả UX/SEO, không browser/device test đã chạy. Tốc độ dùng Q-r1, không thay bằng kiểm hình đẹp. Sau Human duyệt UX1–UX6 mới mở thiết kế monitoring; admin chi tiết và kiến trúc giữ gate riêng. Không thêm chức năng runtime trong lượt này.

<a id="design-relations"></a>
### Nơi dùng trong thiết kế vận hành

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [error](#error) | [Vận hành · signals](../design/operations.md#signals), [Vận hành · alerts](../design/operations.md#alerts) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |
| [screens](#screens) | [Vận hành · display](../design/operations.md#display) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |
| [seo](#seo) | [Vận hành · privacy](../design/operations.md#privacy) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế quản trị

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [screens](#screens) | [Quản trị · scope](../design/admin.md#scope) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [usability](#usability) | [Quản trị · scope](../design/admin.md#scope), [Quản trị · confirm](../design/admin.md#confirm) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [error](#error) | [Quản trị · errors](../design/admin.md#errors) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [seo](#seo) | [Quản trị · integration](../design/admin.md#integration) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế kiến trúc

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [screens](#screens) | [Kiến trúc · components](../design/architecture.md#components) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [error](#error) | [Kiến trúc · api](../design/architecture.md#api) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [seo](#seo) | [Kiến trúc · updates](../design/architecture.md#updates) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [action](#action) | [Kiến trúc · updates](../design/architecture.md#updates) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [cases](#cases) | [Kiến trúc · delivery](../design/architecture.md#delivery) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
