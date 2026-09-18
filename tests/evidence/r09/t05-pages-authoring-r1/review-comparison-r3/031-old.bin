# Workshop — theo dõi vận hành, bản OP-r1

**Amendment Web r2, 2026-09-17 — theo quyết định Human:** client hiện hành chỉ Web; app Android/iOS là Future chưa roadmap/thời hạn. Giữ nghiệp vụ, ngưỡng backend/Web, 137 source ID và 20 nhóm TC; A/I/N1/N2 chỉ là biến thể Future, không PASS/N/A mới. Hồ sơ r1 và kết quả lab cũ giữ đúng nguồn; amendment không là nghiệm thu ứng dụng hoặc R05. Nguồn quyết định và snapshot/hash trước–sau: repo Kynderis/kidea, `KIDEA_DESIGN.md#client-web-scope-approved`, `tests/evidence/r05/web-scope-r1/manifest.json`.

Đề xuất đầu ra **bước 5, chờ Human duyệt**, không phải hệ thống giám sát đang chạy. Đầu vào: Q1–Q6 đã duyệt sau `a24681b`, UX1–UX6 đã duyệt bằng “Duyệt trải nghiệm và SEO R04” sau `6790a9e143c1338fa9a6a47e30aab69e9662f074`. [Báo cáo/approval](https://github.com/Kynderis/kidea/blob/77f5caf404f06315b12bfd8027adc9bb1cbba036/tests/evidence/r04/design-r1.md) là nơi truy trạng thái; snapshot cũ giữ nguyên lịch sử. Chưa cài phần mềm, mở job, chọn nhà cung cấp hoặc dùng phiên AI kiểm độc lập.

<a id="choices"></a>
## Gói cần chốt chung O1–O6

| ID | Đề xuất | Lợi ích / giới hạn |
|---|---|---|
| O1 | Một màn hình vận hành dành admin: dữ liệu cập nhật, tồn đọng/lỗi, sức khỏe đường quan sát và khả năng phục hồi | Không dựng mỗi chỉ số một dashboard; không mở danh tính người tham gia |
| O2 | Thu thập tín hiệu xử lý mỗi 2 giây; quá 5 giây không có quan sát hợp lệ thì báo “Không rõ”; pending già >5 giây cảnh báo, ≥30 giây báo nghiêm trọng | Ngưỡng lab có thể kiểm, không thay mục tiêu cập nhật Q3; một event cũ cũng bị phát hiện, không chỉ đếm hàng đợi |
| O3 | Cần đường cảnh báo dự phòng của lab độc lập với dashboard chính và phiên AI; báo bằng chữ trên màn hình người trực | Nếu dashboard/backend hỏng vẫn có nơi báo. Chưa chọn công cụ/nền chạy; thiếu tài nguyên độc lập thì chưa nhận vận hành đạt |
| O4 | Đề xuất Human là người phụ trách trong **phiên thử đã xác nhận**, không trực 24/7; lỗi nghiêm trọng thì dừng bài thử và đánh giá trước khi tiếp tục | Đây là vai trò cần duyệt, không tự giao việc nền hoặc gọi bạn ngoài phiên; mỗi phiên vẫn xác nhận người trực/máy/kênh |
| O5 | Gom lỗi theo loại và thành phần: báo khi phát sinh/tăng mức/khôi phục; nhắc lỗi nghiêm trọng còn tồn tại mỗi 5 phút | Tránh báo mỗi 2 giây. Chưa rõ dữ liệu không được ghi “đã khôi phục” |
| O6 | Màn vận hành chỉ xem/làm mới; không có replay, xóa event, restart hoặc restore. Cảnh báo chứa thông tin tối thiểu, không payload/secret | Giữ nguyên nghiệp vụ và quyền; báo lỗi không là lệnh sửa hay quyền phá hủy |

Các ngưỡng này là **đề xuất thiết kế**, chưa đo được trên sản phẩm. Mục tiêu hiệu năng/phục hồi đã duyệt vẫn ở [chất lượng](quality.md#decisions); không dùng ngưỡng cảnh báo nới điều kiện test. “Dừng bài thử” là dừng workload theo quyền phiên thử, không tự dừng tiến trình, đổi state workshop hoặc xóa dữ liệu.

<a id="signals"></a>
## O-SIGNALS — Tín hiệu có nghĩa và nơi lấy

Nguồn nghiệp vụ: [V-MONITOR](../business/shared/availability.md#monitor), [V-PUBLISH](../business/shared/availability.md#publish), [V-RECONCILE](../business/shared/availability.md#reconcile), [luồng cập nhật](../business/features/updates.md#flow), [W-ACCESS](../business/shared/workshop.md#access). Mục tiêu: [QF](quality.md#freshness), [QR](quality.md#response), [QD](quality.md#recovery), [QB](quality.md#resources), [QS](quality.md#privacy). Bố cục từ [W5 và U-ERROR](experience.md#error).

| ID | Ý nghĩa / đơn vị / nguồn quan sát | Nhịp/cửa sổ và quy tắc dữ liệu thiếu | Mục đích / hành động |
|---|---|---|---|
| M1 pending và oldest-pending | Số nghĩa vụ cập nhật còn chưa hoàn tất; tuổi nghĩa vụ cũ nhất tính từ lúc lưu chắc; đo ở bên giữ nghĩa vụ, không suy từ số trên UI | Mẫu mỗi 2s. Pending=0 chỉ khi đọc hợp lệ; tuổi là N/A khi xác nhận rỗng, không 0 giây giả. Thiếu mẫu >5s là UNKNOWN | Tuổi >5s cảnh báo, ≥30s nghiêm trọng; kiểm đường xử lý, không replay nghiệp vụ |
| M2 lỗi xử lý / đối chiếu | Số bản ghi lỗi chưa giải quyết và mã lỗi đã làm sạch; không phải số lượt retry hoặc số log trong cửa sổ | Mỗi 2s; lỗi còn mở giữ hiển thị dù không có log mới; dữ liệu mất không xóa số lỗi cũ | Có lỗi mở >0 cảnh báo; cùng version khác nội dung/không bảo toàn invariant là nghiêm trọng ngay |
| M3 độ trễ cập nhật | Từ kết quả lưu chắc đến observer xác nhận snapshot bao phủ; ms; tách pipeline/client nếu đo đủ | Mỗi 2s công bố phân bố trong cửa sổ trượt 60s, số mẫu và số chưa bao phủ; không event mới thì N/A, không khẳng định p95=0 | p95 >2s hoặc bất kỳ thay đổi chưa bao phủ >5s: cảnh báo. Bài nghiệm thu vẫn tính đủ mẫu theo QF, không lấy 60s thay cả run |
| M4 last-processing-success | Thời điểm xử lý một cập nhật thực thành công gần nhất và version tương ứng | Mỗi 2s; chưa từng có: “Chưa có”; không có thay đổi mới không tự thành lỗi | Dùng cùng M1/M2, không dùng thời gian thành công cuối làm heartbeat |
| M5 last-observation và tính hợp lệ | Lần nhận mẫu mới hợp lệ từ từng nguồn, tuổi mẫu, lỗi schema/quyền/timeout và phạm vi quan sát | Mỗi 2s; >5s không có mẫu hợp lệ là UNKNOWN. HTTP thành công nhưng mẫu cũ/hỏng không làm mới tuổi | Phát hiện collector hỏng hoặc mất quyền; không tô xanh dựa trên M1/M2 cũ |
| M6 sức khỏe đường đọc / dashboard | Đọc tối thiểu qua đường ứng dụng và kiểm dashboard phản hồi có nội dung/trạng thái hợp lệ; kiểm từ đường dự phòng | Thử mỗi 5s, timeout 2s; ghi từng đích, cả lỗi kết nối và phản hồi sai | Hai probe lỗi liên tiếp báo nghiêm trọng; không suy probe đọc PASS nghĩa là ghi/phục hồi đều đạt |
| M7 tốc độ và lỗi kỹ thuật | Request count, read/write riêng, p95/timeout/error/missed-offer của bài WQ; server và client đo tách | Cửa sổ 60s, báo số mẫu; chưa có tải N/A. Từ chối nghiệp vụ đúng expected không là lỗi kỹ thuật | >1% lỗi kỹ thuật hoặc p95 đọc >1s/ghi >2s: cảnh báo; lỗi quyền/invariant nghiêm trọng bất kể tỷ lệ |
| M8 dung lượng | Byte dữ liệu/log/backup thực đo trên các đích thuộc pilot, dung lượng trống từng đích; không chỉ đo một thư mục rồi quên backup | Mỗi 30s, >60s thiếu mẫu là UNKNOWN; tổng chưa đủ đích thì không kết luận dưới ngân sách | ≥80% của 2 GiB: cảnh báo; ≥2 GiB hoặc không đủ headroom đã chốt: nghiêm trọng/dừng bài thử; không tự dọn dữ liệu |
| M9 backup và recovery point | Mốc dữ liệu mà bản sao độc lập gần nhất thật sự bao phủ, tuổi mốc, nơi giữ đã nhận diện; lần kiểm restore riêng | Mỗi 30s, >60s thiếu mẫu là UNKNOWN. Job exit 0 không thay xác minh bản sao/mốc; chưa có backup ghi chưa có | Tuổi >10 phút cảnh báo sớm; >15 phút hoặc không có bản hợp lệ: nghiêm trọng, chưa đáp ứng QD |

M3/M7 là cảnh báo hỗ trợ trong lab, không kết luận thống kê mạnh từ vài mẫu; luôn hiển thị n. Định nghĩa nguồn tính thời gian phải dùng cùng cơ sở đồng hồ hoặc sai số được đo, không lấy timestamp mù từ hai máy để báo đạt. Version/chu kỳ quan sát dùng phát hiện mẫu lặp cũ; không lẫn với identity nghiệp vụ hoặc lựa chọn giao thức ở bước 7.

Các phát hiện sai dữ liệu phải đối chiếu [R-INV](../business/shared/registration.md#invariant); chỉ số chỗ hiển thị lệch không tự chứng minh authority vượt chỗ. Nguồn quan sát không đủ thì ghi nghi vấn/chưa xác nhận, không tự sửa dữ liệu hoặc biến cảnh báo thành kết quả nghiệp vụ mới.

Chỉ số CPU/RAM/IO/network ghi kèm lúc thử để chẩn đoán như QB; chưa có thiết bị không tự đặt ngưỡng phần trăm CPU. Headroom tối thiểu cho đĩa/RAM, kích thước log và định nghĩa probe chi tiết phải hoàn thiện theo cấu hình ở kiến trúc/R05 trước thực thi, không được để “UNKNOWN” rồi vẫn chạy nhận đạt. Khi triển khai phải kiểm đường ghi và invariants bằng ca tích hợp được cấp, không tự thêm một mutation giám sát nền vào sản phẩm.

<a id="display"></a>
## O-DISPLAY — Một màn hình, không xanh giả

Nguồn: [V-STALE](../business/shared/availability.md#stale), [V-MONITOR](../business/shared/availability.md#monitor), [UX màn hình](experience.md#screens), [QF](quality.md#freshness). Chỉ admin xem; public Web không nhận payload vận hành; native Future giữ cùng ranh giới riêng tư.

```text
VẬN HÀNH LAB — phạm vi và thời điểm quan sát
Kết luận: Có lỗi / Không rõ / Có cảnh báo / Bình thường trong phạm vi đã đo
Nguồn nào thiếu? ...       Mẫu gần nhất: ...       [Làm mới dữ liệu]
Pending: ...  Cũ nhất: ... Lỗi còn mở: ...         Độ trễ: ... (n=...)
Xử lý thành công cuối: ... Thu thập thành công cuối: ...
Probe ứng dụng: ...       Probe dashboard: ...    Kênh dự phòng: ...
Dữ liệu + log + backup: ... / 2 GiB                Recovery point: ...
Lỗi mở: mã / thành phần / thời điểm / cần làm gì / đã thấy hay chưa
```

- Có lỗi nghiêm trọng đã biết thì vẫn hiện lỗi đó dù nguồn khác UNKNOWN; ghi thêm nguồn mất. Không gộp UNKNOWN thành khỏe hoặc làm mất lỗi đang mở. Nếu không có lỗi nghiêm trọng nhưng có nguồn bắt buộc mất thì kết luận “Không rõ”; còn cảnh báo đã biết vẫn hiển thị.
- Mẫu phải có nguồn/thời điểm/độ mới. Lỗi fetch/401/schema/counter reset không tự đổi pending/error thành 0. N/A chỉ khi đúng điều kiện (ví dụ không có event để tính latency), không dùng thay dữ liệu thiếu.
- Khi không có active run, hiển thị “Ngoài phiên thử — không có cam kết giám sát”, không số uptime 100%. “Bình thường trong phạm vi đã đo” không là toàn sản phẩm/backup/thiết bị đã qua nghiệm thu.
- Kết quả ghi thành công và độ trễ view là hai dòng nghĩa khác nhau; không bảo người dùng đăng ký lại để chữa event chậm. Làm mới chỉ đọc, không mutation/replay.
- Lịch sử cảnh báo có thể xem sau khi nguồn trở lại, nhưng phải phân biệt giá trị lúc lỗi với giá trị quan sát hiện tại. Giao diện không xóa lỗi nguồn hoặc giữ màu xanh do thiếu log mới.

<a id="alerts"></a>
## O-ALERT — Kênh, độ trễ và chống báo dồn

Nguồn: [QF/QT06](quality.md#freshness), [QB phiên thử](quality.md#resources), [UX lỗi quan sát](experience.md#error), [V-MONITOR](../business/shared/availability.md#monitor). O3 là yêu cầu có đường quan sát dự phòng trong lab, **không thêm email/SMS/push/thông báo OS hoặc dịch vụ ngoài app**. Kiến trúc mới chọn cách cung cấp kênh đó; không mặc định cần thêm service/broker hoặc thuê máy.

Kênh chính là W5 `/operations`. Kênh dự phòng phải đưa thông báo chữ tới màn hình người trực mà không cần dashboard chính hoặc phiên AI còn hoạt động; thiếu đường này thì bài lỗi dashboard không thể PASS. Không dùng tin nhắn Codex, automation của cuộc trò chuyện hoặc lời hứa AI “đang theo dõi” làm cảnh báo vận hành. Có thể dùng tài nguyên sẵn có, nhưng phải được kiểm quyền/cô lập ở R09.

Đường phát hiện/kênh dự phòng phải sống ngoài thành phần và miền lỗi đang thử: đóng phiên AI, hỏng dashboard, hỏng tiến trình/host backend đều được thử riêng. Nếu chính máy hiển thị/người trực mất kết nối, không nhận đảm bảo giao cảnh báo; trước chạy xác nhận màn hình nhận được probe. Không hứa phát hiện mọi tổ hợp máy/kênh cùng hỏng. Kênh dự phòng phải có tín hiệu còn sống quan sát được; người trực không thấy nó cập nhật thì coi giám sát chưa sẵn sàng, dừng bài thử thay vì tin dashboard.

Đề xuất ngân sách thời gian trên lab E1:

| Nhóm | Đến khi phát hiện | Đến khi thông báo chữ hiển thị cho người trực |
|---|---|---|
| M1–M5/M7 | Sau mẫu hợp lệ tiếp theo; nguồn mỗi 2s, stale theo >5s | ≤5s sau phát hiện; với ngưỡng thời gian M1/M5, tối đa 8s từ lúc vượt ngưỡng trong điều kiện E1 |
| M6 hai probe lỗi liên tiếp | Tối đa 12s từ lỗi bắt đầu bền vững (chu kỳ 5s, timeout 2s) | ≤5s sau xác nhận lỗi, tối đa 17s từ lỗi bền vững |
| M8/M9 | Mẫu mỗi 30s; mất quan sát theo >60s | ≤5s sau phát hiện; từ vượt ngưỡng số đo tới thông báo ≤35s |

Các thời gian cảnh báo không đổi yêu cầu client đánh dấu stale trong QF hoặc thời gian phục hồi QD. Phải đo **đã hiển thị ở đầu nhận**, không chỉ log “đã gửi”. Mất kênh nhận là lỗi vận hành, không được ghi alert delivered. Không có đảm bảo phản hồi của Human trong số giây này; đây là thời gian hệ thống hiển thị, thời gian con người xử lý đo riêng.

Gom theo loại lỗi + thành phần + phạm vi lab, không theo payload/requestID. Báo khi mới phát sinh, tăng mức và khi khôi phục có bằng chứng; lỗi nghiêm trọng chưa khép nhắc mỗi 5 phút, lỗi cảnh báo giữ danh sách không nhắc dồn. Nhiều event cùng lỗi có số lượng tăng trên cùng mục; lỗi thuộc thành phần khác vẫn có mục riêng. Tăng mức/lỗi mới không bị chìm trong thời gian chờ nhắc.

Chỉ thông báo khôi phục sau ba quan sát hợp lệ liên tiếp dưới ngưỡng (M1–M7 theo nhịp nguồn tương ứng); M8 dưới 80% và đủ headroom, M9 recovery point ≤10 phút/đã xác minh hợp lệ sau hai mẫu 30s. Lỗi M2 hoặc invariant phải có kết quả đối chiếu giải quyết, không tự khép chỉ vì hết log. Thiếu mẫu hoặc restart collector không tính là mẫu khỏe. Lưu first-seen/last-seen/mức/count/last-notified/recovered-at và lần restart để không biến mất lỗi khi bộ giám sát restart; cách lưu thuộc kiến trúc.

<a id="response"></a>
## O-RESPONSE — Người xử lý và giới hạn hành động

Nguồn: [QD](quality.md#recovery), [QB](quality.md#resources), [quyền](../business/shared/workshop.md#access), [retry](../business/shared/registration.md#retry), [vòng đời workshop](../business/shared/workshop.md#state). O4 đề xuất **Human chủ pilot phụ trách phiên thử**, có thể chỉ định người khác trước phiên; không coi hiện tại đã có người trực hoặc mở cửa sổ chạy.

Trước một phiên thử phải ghi người trực đã nhận, thời điểm bắt đầu/kết thúc, target/artifact/config, máy nhận/kênh, quyền dừng workload và quy trình ứng phó. Không nhận có người chỉ vì app đang mở. Hết phiên hoặc người trực rời đi: dừng bài thử theo quyền, lưu trạng thái quan sát, không duy trì thử lỗi không người giám sát. Không phát sinh trực đêm/24×7.

| Loại sự cố | Hành động của người trực / AI trong đúng quyền | Điều kiện tiếp tục |
|---|---|---|
| Pending/lag cao nhưng authority đúng | Kiểm nguồn/timing và backlog, dừng tăng tải nếu nghiêm trọng; không phát lại đăng ký | Backlog đối chiếu đúng, client cập nhật theo QF; nguyên nhân/giới hạn được ghi |
| Mất quan sát/dashboard/đường nhận | Dừng bài thử, dùng kênh dự phòng và chẩn đoán read-only | Khôi phục đường quan sát/giao cảnh báo thực; test mất kênh phải được kiểm lại |
| Sai quyền/invariant/cùng-version khác dữ liệu | Dừng bài thử, giữ evidence đã làm sạch, không sửa dữ liệu tự động | Điều tra/fix theo quyền và kiểm đúng case; không dùng tỷ lệ lỗi ≤1% cho qua |
| Crash/storage/backup không đủ | Dừng bài thử, giữ dữ liệu còn có, phân biệt crash với mất ổ và recovery point | Restore/restart chỉ theo quyền thực thi riêng; đối chiếu dữ liệu/quyền/ý định cũ trước mở lại |
| Ngân sách/headroom không đủ | Dừng bài thử, báo dung lượng thực và đích; không xóa lịch sử/log cần chứng minh | Có quyết định tài nguyên hoặc dọn đúng allowlist được duyệt riêng |

Không có nút acknowledge/mute/replay/delete/restart/restore mới trong W5 ở gói này. “Đã thấy cảnh báo” có thể ghi trong biên bản phiên thử, không đồng nghĩa lỗi đã khỏi hoặc đã cấp quyền sửa. Nếu về sau cần điều khiển mới phải quay nghiệp vụ/quyền và Human gate, không thêm bằng một nút kỹ thuật. AI không tự quyết khôi phục hoặc thay cấu hình để làm dashboard xanh.

<a id="privacy"></a>
## O-PRIVACY — Dữ liệu và lưu giữ

Nguồn: [W-ACCESS](../business/shared/workshop.md#access), [V-PUBLISH](../business/shared/availability.md#publish), [QS](quality.md#privacy), [QB](quality.md#resources), [SEO lab](experience.md#seo). Dashboard/kênh dự phòng kiểm quyền admin cho người xem, quyền đọc tối thiểu cho collector; role do client gửi không đủ. Credential/service identity thực tế chốt ở kiến trúc, chưa tạo tài khoản.

Chỉ xuất mã lỗi được chuẩn hóa, thành phần, thời điểm, count/age/version/định danh run được phép. Không payload đăng ký, danh tính người tham gia, requestID riêng, token hoặc stack trace chứa secret. Không suy admin có quyền xem danh sách người tham gia. Chi tiết nhạy cảm nếu cần điều tra nằm ở nguồn được phép với kiểm quyền, không chép vào màn hình/báo cáo công khai. Khi mất quyền, xóa khỏi view/cache riêng và không giữ trong back stack cho actor khác.

Đề xuất giữ cảnh báo/tóm tắt quan sát theo vòng đời lab trong ngân sách Q5; không tạo TTL xóa tự động. Dữ liệu raw chẩn đoán chọn có mục đích và đo kích thước trước bài; dự kiến vượt ngân sách thì chặn chạy/xin quyết định, không giấu mất bằng chứng. Không giảm retention lịch sử nghiệp vụ/kết quả retry để nhường chỗ log. Backup giữ đúng yêu cầu QD; monitoring không tự giữ bản sao chứa toàn dữ liệu sản phẩm ở thêm một nơi.

SEO: index/ranking/AI citation và Event markup đã được xác nhận không áp dụng theo phạm vi UX5/D3; không dựng probe gọi search engine hoặc gửi sitemap. Giữ kiểm kỹ thuật HTML/private/noindex ở ca UX/SEO tương ứng, không dùng 0 lượt crawl như dấu hiệu khỏe. Mục đích lab không là quyền public/thu thập dữ liệu thật.

<a id="cases"></a>
## OP-T — Đặc tả kiểm, chưa thực thi trên ứng dụng

| Case | Seed/kích thích | Expected / nghĩa vụ |
|---|---|---|
| OP-T01 | Pending=0 từ mẫu hợp lệ, sau đó không có mẫu | Ban đầu tuổi pending N/A; >5s UNKNOWN và giữ giá trị cuối, không 0 giả; [O-SIGNALS](#signals), [O-DISPLAY](#display) |
| OP-T02 | Một nghĩa vụ tồn tại tới 5s/5s+ε/30s, không phát thêm event | 5s chưa vượt ngưỡng cảnh báo, >5s cảnh báo, ≥30s nghiêm trọng; không phụ thuộc count tăng; [O-SIGNALS](#signals) |
| OP-T03 | Không có event mới, collector vẫn trả mẫu tươi | Last-processing-success cũ không gây báo chết; độ trễ N/A, heartbeat tươi; [O-SIGNALS](#signals) |
| OP-T04 | Collector trả HTTP thành công nhưng sample cũ/sai schema/mất quyền | Không refresh last-observation; UNKNOWN và cảnh báo đúng ngân sách; [O-SIGNALS](#signals), [O-ALERT](#alerts) |
| OP-T05 | Cùng version khác nội dung/invariant sai | Nghiêm trọng, giữ lỗi mở và dừng bài thử; không repair/replay; [O-RESPONSE](#response), [V-RECONCILE](../business/shared/availability.md#reconcile) |
| OP-T06 | Đóng phiên AI; lần lượt ngắt dashboard, backend tiến trình, backend host | Đường dự phòng còn quan sát và hiển thị cảnh báo theo ngân sách M6; không dùng log gửi thay đầu nhận; [O-ALERT](#alerts) |
| OP-T07 | Ngắt kênh nhận/dừng observer/thiết bị người trực | Không ghi delivered/healthy; mất tín hiệu sống khiến phiên chưa sẵn sàng, dừng; không hứa phát hiện mọi lỗi đồng thời; [O-ALERT](#alerts) |
| OP-T08 | Lặp một lỗi 100 lần, tăng mức, thêm lỗi thành phần khác, chờ 5 phút | Gom đúng mục/count, lỗi mới/tăng mức báo ngay theo ngân sách, nhắc nghiêm trọng 5 phút không spam mỗi mẫu; [O-ALERT](#alerts) |
| OP-T09 | Lỗi → một mẫu tốt → mất mẫu; rồi đủ mẫu tốt; restart collector | Không khôi phục giả; đủ điều kiện mới báo recovered, giữ lỗi qua restart; [O-ALERT](#alerts) |
| OP-T10 | Dữ liệu 80%/2GiB và backup mốc 10/15 phút rồi vượt, thiếu đích | Ngưỡng và UNKNOWN đúng M8/M9, dừng khi vượt/thiếu readiness; không xóa dữ liệu; [O-SIGNALS](#signals) |
| OP-T11 | Khách/người tham gia/admin × W5/kênh dự phòng; log chứa token/requestID giả | Chỉ quyền phù hợp xem, trường nhạy cảm không rò public/dashboard; [O-PRIVACY](#privacy) |
| OP-T12 | Client vẫn chưa nhận event, authority đã chắc; latency mẫu ít/lỗi/thiếu | Không đảo kết quả đăng ký, không bỏ mẫu thiếu hoặc tô p95=0; [O-SIGNALS](#signals), [QF](quality.md#freshness) |
| OP-T13 | Hết phiên/người trực rời, chưa có target/kênh đã xác nhận | Không nhận đang trực/24×7 hoặc tự chạy; [O-RESPONSE](#response) |
| OP-T14 | Tìm replay/delete/restart/restore/ack/mute hoặc thử làm mới | Không có điều khiển mới; làm mới chỉ đọc, người trực ghi đã thấy không khép lỗi; [O-RESPONSE](#response) |
| OP-T15 | Bản backup có job success nhưng chưa biết recovery point; restore drill chưa chạy | Không báo backup/restore đạt chỉ từ exit 0; [O-SIGNALS](#signals), [QD](quality.md#recovery) |

Mỗi case phải được cụ thể hóa dữ liệu/thiết bị/quyền tại R05/R09; ngắt chỉ trên môi trường/fixture được duyệt, không ngắt máy hiện tại. Bằng chứng cần timestamp nguồn/phát hiện/đầu nhận, config threshold, kết quả/dữ liệu sau và giới hạn. Case chỉ có mock không thay bằng chứng giám sát/khôi phục thật.

O1–O6 duyệt thiết kế bước 5, không chứng minh đã có collector/cảnh báo hoặc cấp quyền cài/chạy. Công nghệ/giao thức/lưu dữ liệu ở bước 7; profile/case kỹ thuật ở R05; máy/permission và diễn tập ở R09. Sau gate này mới hoàn thiện admin bước 6; phiên AI độc lập R04 vẫn chưa dùng.

<a id="design-relations"></a>
### Nơi dùng trong thiết kế quản trị

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [privacy](#privacy) | [Quản trị · audit](../design/admin.md#audit) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [response](#response) | [Quản trị · integration](../design/admin.md#integration) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế kiến trúc

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [signals](#signals) | [Kiến trúc · recovery](../design/architecture.md#recovery), [Kiến trúc · operations](../design/architecture.md#operations) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [display](#display) | [Kiến trúc · operations](../design/architecture.md#operations) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [alerts](#alerts) | [Kiến trúc · operations](../design/architecture.md#operations) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [response](#response) | [Kiến trúc · operations](../design/architecture.md#operations) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [privacy](#privacy) | [Kiến trúc · operations](../design/architecture.md#operations) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [cases](#cases) | [Kiến trúc · cases](../design/architecture.md#cases) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |

### Nơi dùng bổ sung trong kiến trúc AR-r2 (đề xuất C5)

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [response](#response) | [Kiến trúc · delivery](../design/architecture.md#delivery) | Truy hợp đồng trực tiếp và ca sửa review; không đổi nguồn |
| [signals](#signals) | [Kiến trúc · delivery](../design/architecture.md#delivery), [Kiến trúc · admission](../design/architecture.md#admission) | Truy readiness và giữ đúng nghĩa M2 lỗi còn mở/M7 mẫu WQ khi quá tải; không thêm chỉ số |

<a id="local-portability"></a>
## LP-01 — Bố trí Docker local và kiểm cloud ngày 2026-09-16

Căn cứ [phương án đã được Human duyệt sau answer f8b47b9](https://github.com/Kynderis/kidea/blob/master/KIDEA_DESIGN.md#docker-local-cloud), [gói LP-01](https://github.com/Kynderis/kidea/blob/master/proposals/local-portability-r1.md). Nội dung R04 phía trên giữ nguyên từ bản đã nghiệm thu; phụ lục chỉ thay bố trí host/build, không đổi O1–O6, M1–M9, OP-T01–15 hoặc ngưỡng/người trực/quyền.

Backend dùng Docker local Linux/Ubuntu userspace để kiểm chức năng, không bắt một Ubuntu host/VM riêng. Local dùng kiến trúc native `amd64` trên Intel hoặc `arm64` trên Apple Silicon khi dependency hỗ trợ; manifest ghi host/container/image/config/toolchain và tài nguyên thực. Container exit/restart thành công không tự là health/write-ready hoặc kết quả nghiệp vụ thành công. SQLite ở volume bền vững; đổi/dừng container không cho xóa DB/WAL/log/backup, volume không là backup.

Giữ đóng admission và drain tối đa **30 giây**, stop/grace không cắt sớm hợp đồng đã chốt; phần chưa xác nhận vẫn UNKNOWN. Observer chạy trước và dừng cuối cửa sổ đã có người trực, không do phiên AI giữ sống. Kênh dự phòng và backup vẫn độc lập miền lỗi backend/laptop đang thử: container khác cùng laptop không đáp ứng bài backend-host hỏng. Thiếu bố trí/backup verified/kênh nhận thì chưa sẵn sàng chạy bài tương ứng, không tự thuê thêm máy hoặc giảm nghĩa vụ.

Test nặng/WQ/performance chuyển sang cloud khi Human cung cấp máy và quyền SSH/Docker, workload, chi phí/thời hạn/giới hạn và điều kiện dừng. Ghi đúng lần chạy/image/kiến trúc/máy đo; mất kết nối phải đọc lại trước retry, không replay mù hoặc bỏ mẫu lỗi M7. Kiểm local thường ngày không chứng nhận WQ/E1 hay cảnh báo/restore độc lập. Chưa cài/chạy Docker/cloud/collector, chưa có benchmark; mọi ca runtime còn **NOT_RUN**, không phát sinh trực nền hoặc dịch vụ mới từ phụ lục này.
