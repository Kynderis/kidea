# Kidea — Danh mục kịch bản nghiệm thu

Gói `P01-T04-ACCEPTANCE-r1`, ngày 2026-09-07. Đây là **đặc tả kịch bản, chưa thực thi**; không phải báo cáo PASS. Trạng thái xây dựng duy nhất nằm ở [roadmap](KIDEA_ROADMAP.md#p01-t04-result). Bộ này được tổng hợp vào gate cuối P01; ngưỡng chất lượng và mức bằng chứng tối thiểu còn chốt ở P01-T05 [H].

## 1. Mục đích và cách sử dụng

Tiêu chí đạt, hồ sơ đo đại diện và mức bằng chứng được đề xuất tại [KIDEA_QUALITY.md](KIDEA_QUALITY.md), gói P01-T05 đang chờ Human duyệt. Không dùng đề xuất này như ngưỡng đã có hiệu lực trước approval.

Kiểm tra Kidea có điều phối, lưu trạng thái, truy ảnh hưởng và báo kết quả đúng trong phạm vi [thiết kế](KIDEA_DESIGN.md#first-release-scope). Không thay test nghiệp vụ hoặc kỹ thuật của [pilot](KIDEA_DESIGN.md#pilot-scope).

Ví dụ: test pilot kiểm tra hai người tranh một chỗ chỉ một người được nhận; test Kidea kiểm tra yêu cầu ấy có đặc tả, test có assertion đúng, bằng chứng đúng phiên bản và task không DONE khi test thất bại. Ứng dụng chạy đúng không tự chứng minh Kidea làm đúng.

- Mỗi dòng là một họ kịch bản có ID ổn định, không phải một lần chạy. Các biến thể phân cách bằng dấu chấm phẩy phải chạy riêng, không chọn một biến thể đại diện rồi nhận cả dòng đạt. Khi hiện thực, đặt ID con như `KA-05-a`, giữ liên kết về dòng gốc.
- Cột cuối chỉ nơi hiện thực/kiểm chứng dự kiến, không mở task hoặc cấp quyền chạy. Helper được test ngay khi xây; hành vi điều phối phải thử bằng Kidea trong phiên AI mới ở P11, không thay bằng tác giả sửa tay fixture cho đúng. P12-T05 tổng hợp và chạy hồi quy trên bản phát hành ứng viên.
- Dùng bản sao hồ sơ, source và dữ liệu giả trong môi trường được phép. Mỗi lần chạy khôi phục baseline riêng; không thử lỗi trên project đang dùng hoặc production. Git/cài đặt/deploy vẫn cần quyền đúng phạm vi.
- Trước chạy, cố định bản Kidea, hồ sơ/source, cấu hình, phiên bản môi trường, quyền được cấp và biến thể. Lưu trạng thái trước/sau, hành động thực tế, kết quả quan sát, file/bằng chứng liên quan và giới hạn. Quy trình/lệnh cụ thể được bổ sung tại phase sở hữu khi đã có schema/runtime, không bịa lệnh ở P01.
- Kết luận từng lần chạy phải phân biệt đạt, thất bại, chưa chạy, thiếu điều kiện, skip hoặc N/A được Human duyệt. Đây là ý nghĩa báo cáo, chưa chọn enum/schema lưu trữ thay P02. Bằng chứng cũ không được tự chuyển sang bản mới.
- Bộ case hiện tại diễn giải yêu cầu đã có, không chốt thêm ngân sách hiệu năng, kiến trúc hoặc mức bao phủ mới. Thiếu tiêu chí đo thì chờ P01-T05 hoặc gate sản phẩm tương ứng, không tự tuyên bố đạt.

## 2. Điều phối, approval và quyền

Nguồn: [sáu hành động](KIDEA_DESIGN.md#commands), [quy trình](KIDEA_DESIGN.md#workflow), [state/gate](KIDEA_DESIGN.md#state-approval).

| ID / tình huống | Trạng thái đầu và kích thích | Kết quả Kidea phải thể hiện, có thể quan sát | Nơi kiểm chứng |
|---|---|---|---|
| KA-01 — Init mới | Root thử chưa có hồ sơ; Human đưa ý tưởng và cho init | Tạo hồ sơ khởi đầu tối thiểu; tách ý tưởng Human/gợi ý AI và MVP/Future/Idea; chưa code hoặc tạo cả cây rỗng; hỏi điểm mở ảnh hưởng phạm vi trước gate | P03, P11-T01 |
| KA-02 — Project đã có | a: đã có hồ sơ hợp lệ, gọi init lần nữa; b: chỉ có source/quy ước cũ, chưa có hồ sơ | a: không ghi đè, hướng về resume; b: bắt đầu bước 1, dùng source làm context, không coi code là đặc tả đã duyệt hoặc bỏ gate; bảo toàn file/quy ước sẵn có | P03-T04, P04-T02, P11-T06 |
| KA-03 — Status và lệnh sai | Hồ sơ đang làm dở; gọi status; gọi hành động/args không hợp lệ | Status báo đúng task/gate/blocker/việc kế tiếp, không sửa source/hồ sơ. Args sai được giải thích, không chuyển sang một hành động ghi khác | P03-T05/T08, P12-T02 |
| KA-04 — Đường đúng đầu-cuối | Pilot bắt đầu từ ý tưởng, đủ quyền theo từng bước; Human duyệt các gói hợp lệ | Đi đủ mười bước, sáu hành động có nơi thực hiện; một task hiện hành; gate bước con và cuối phase riêng; không code trước plan; triển khai phải có kiểm chứng thật | P11-T01–T03, P12-T05 |
| KA-05 — Reject hoặc chưa duyệt | Gói đang review; a: Human từ chối; b: góp ý/cho phân tích tiếp; c: chưa phản hồi | Không ghi APPROVED hoặc làm phần phụ thuộc. Lưu phần cần sửa/chờ, sau sửa trình đúng gói mới; không coi im lặng hay góp ý là approval | P03-T07/T08, P11-T06 |
| KA-06 — Duyệt đúng phạm vi | Có hai gói và gate bước con; a: duyệt đúng ID; b: ID sai/không rõ; c: gói còn thiếu điều kiện | a: chỉ gói được duyệt đổi trạng thái, không kéo theo cả bước/phase; b/c: nêu lỗi/điều còn thiếu, không tự chọn hoặc vượt gate | P03-T07/T08, P11-T06 |
| KA-07 — Approval cũ | Đầu ra đã duyệt; a: đổi rule/đầu vào làm sai căn cứ; b: chỉ sửa lỗi chính tả không đổi nghĩa | a: mở lại nội dung và phần phụ thuộc cần kiểm tra, không dùng approval/test cũ để vượt gate; b: ghi căn cứ không đổi ngữ nghĩa, không ép duyệt lại toàn bộ project | P02, P08-T05, P11-T06 |
| KA-08 — Quyền riêng và N/A | Đã duyệt thiết kế/release nhưng chưa cho Git/deploy/dữ liệu thật; một kiểm tra thiếu môi trường | Không thực hiện thao tác ngoài quyền; nêu đúng quyền/điều kiện thiếu. Không tự gắn N/A để bỏ kiểm tra; N/A phải có lý do và Human xác nhận, không xóa năng lực bản đầu | P03-T08, P10-T06, P11-T06 |

## 3. Hồ sơ, an toàn ghi và resume

Nguồn: [hồ sơ](KIDEA_DESIGN.md#files-view), [resume](KIDEA_DESIGN.md#resume), [coding rules](KIDEA_DESIGN.md#code-rules).

| ID / tình huống | Trạng thái đầu và kích thích | Kết quả Kidea phải thể hiện, có thể quan sát | Nơi kiểm chứng |
|---|---|---|---|
| KA-09 — Dữ liệu sai | Từng fixture: thiếu file bắt buộc; trùng ID; link đứt; trạng thái trái nhau; nhiều task hiện hành; schema không hỗ trợ | Chỉ rõ vị trí và loại thiếu/sai; không tự coi DONE hoặc init đè. Dừng phần phụ thuộc, giữ nguồn để đối chiếu; thiếu mapping không thành không ảnh hưởng | P02/P03, P07, P11-T06 |
| KA-10 — Ghi lỗi/gián đoạn | Trên bản sao, gây lỗi quyền ghi; ngắt giữa cập nhật nhiều file; nguồn đổi sau khi đọc | Không báo cập nhật thành công khi chưa đủ; không mất nội dung không thuộc quyền ghi. Phát hiện trạng thái dở/mâu thuẫn, có đường khôi phục theo hợp đồng P02 trước tiếp tục; không áp kết quả đọc cũ lên nguồn mới âm thầm | P02-T04, P03, P12-T03 |
| KA-11 — Resume phiên mới | Ngắt khi xử lý dependency hai cấp, có task DONE và task đang dở; mở phiên AI mới chỉ có file cần thiết | Đọc đúng nguồn, khôi phục việc hiện hành và thứ tự điểm quay lại; giữ task DONE/bằng chứng, không dựa hội thoại cũ hoặc làm lại toàn bộ | P03-T06, P08-T06, P11-T06 |
| KA-12 — Resume qua Git | Human cho phép chuyển source/hồ sơ bằng Git và chuẩn bị máy đích; a: đủ file đúng bản; b: thiếu file chưa push; c: conflict; d: sai repo/branch; e: thiếu profile/công cụ đúng bản | a: tiếp tục đúng việc sau đối chiếu; b–e: nêu cụ thể thiếu/lệch, chưa tiếp tục phần phụ thuộc. Không tự pull/đổi branch/giải conflict hoặc giả phục hồi file chưa chuyển; checkpoint local vẫn dùng được trước commit | P08-T06, P11-T06, P12-T03 |
| KA-13 — Tác dụng phụ chưa rõ | Checkpoint ghi định thao tác nhưng chưa xác nhận kết quả; thử cả trường hợp thực tế đã xảy ra và chưa xảy ra | Đọc bằng chứng/thực tế trước quyết định; không replay mù hoặc tự nhận đã xong. Nếu không xác định được thì giữ chưa xác nhận và xin hướng xử lý đúng quyền | P03-T06, P10-T06, P11-T06 |

## 4. Nghiệp vụ, bản đồ và thay đổi

Nguồn: [nghiệp vụ](KIDEA_DESIGN.md#business-method), [ba bản đồ](KIDEA_DESIGN.md#three-maps), [change](KIDEA_DESIGN.md#change), [test](KIDEA_DESIGN.md#testing).

| ID / tình huống | Trạng thái đầu và kích thích | Kết quả Kidea phải thể hiện, có thể quan sát | Nơi kiểm chứng |
|---|---|---|---|
| KA-14 — Shared và điểm mở | Hai Feature dùng chung rule/state; đưa thêm điểm mơ hồ về biên/thứ tự lỗi; có Future/Idea | Làm rõ phần chung/quyền sở hữu trước phần riêng, lưu điểm quay lại; không tự quyết nghĩa lỗi hoặc đặc tả hết Future. AC/test có trạng thái đầu/input/kết quả/invariant theo flow nguồn và lý do chọn biên/nhánh | P04-T05/T06, P11-T01/T02 |
| KA-15 — Ba bản đồ hai chiều | Có mẫu đặc tả, module và test; truy từ rule đến code/test rồi ngược lại; mẫu chứa API/event/shared data/config | Truy đúng trách nhiệm và quan hệ ngoài call graph; mỗi quan hệ có một nguồn hiệu lực, view dẫn xuất có phiên bản/phạm vi; không sinh map test thứ tư hoặc nhập lại mọi lời gọi tay | P07, P11-T02 |
| KA-16 — Map thiếu/cũ/sai nghĩa | Từng fixture: thiếu adapter; graph rỗng; snapshot cũ; đường dẫn tồn tại nhưng sai trách nhiệm; test gọi code không có assertion yêu cầu | Nêu unknown/stale hoặc đưa về review ngữ nghĩa; tìm bổ sung source/hồ sơ, không gọi link hợp lệ/coverage là tuân thủ. Không sửa rule để hợp thức hóa code/test sai | P07-T04–T07, P11-T07 |
| KA-17 — Feature giữa MVP | Khôi phục checkpoint MVP pilot đang dở; yêu cầu thêm giới hạn 2 đăng ký ACTIVE/người | Lưu việc cũ, quay bước 1 chốt Feature; từng bước sau có sửa hoặc lý do không sửa; giữ Human gate, cập nhật test/map/plan và quay lại đúng checkpoint | P08, P11-T04 |
| KA-18 — Đổi sau release | Có release thử được xác nhận; yêu cầu cho hủy khi PAUSED | Tách target mới với bản đang chạy; đi vòng change và rà các bước liên quan. Không nói release cũ đã có rule mới; chỉ ghi bản chạy mới sau quyền deploy và kiểm chứng | P08-T07, P11-T05 |
| KA-19 — Bugfix hay đổi yêu cầu | a: fixture vượt sức chứa trái đặc tả; b: yêu cầu đổi hành vi được gọi là “sửa bug”; c: ý định chưa rõ | a: bắt đầu ở bước sớm nhất bị ảnh hưởng, giữ rule đã duyệt và chạy hồi quy; b: xử lý change, không lách gate; c: hỏi làm rõ trước code, không tự đẩy thành Idea | P08-T01, P11-T05 |
| KA-20 — Lan truyền không có diff | Đổi rule B → A vẫn gọi B nhưng đầu ra khác → D dùng A; thêm chuỗi đăng ký → event → số chỗ → client/monitoring | Impact có A và D cùng consumer event dù code trung gian không đổi; mỗi nơi có kết luận, căn cứ và phiên bản. Không dừng chỉ vì hết file có diff hoặc graph hiện có | P08-T03/T04, P11-T05 |
| KA-21 — Chu kỳ và requeue | Dependency A–B–C có vòng; đổi nguồn đã được kết luận khi còn đang xử lý | Không chạy vô hạn; kết luận phụ thuộc bản cũ phải kiểm tra lại. Chưa đóng impact khi còn điểm chưa xử lý/thiếu căn cứ; giới hạn thao tác/thời gian cụ thể chốt ở P01-T05 | P08-T02/T04/T07 |
| KA-22 — Di chuyển/xóa/đổi tên | Di chuyển symbol hoặc mục đặc tả, đổi ID và cấu hình build có người dùng/test liên quan | Cập nhật đủ tham chiếu hiện hành trước bỏ nội dung cũ; tìm ngược để bắt link sót; không giữ hai rule có hiệu lực hoặc thêm kho retired-ID. Giữ gói release/backup cần phục hồi theo chính sách riêng | P07-T04, P08-T05 |

## 5. Chất lượng, hiển thị và phát hành

Nguồn: [test](KIDEA_DESIGN.md#testing), [view](KIDEA_DESIGN.md#files-view), [ops](KIDEA_DESIGN.md#operations), [SEO](KIDEA_DESIGN.md#seo-proposal), [ma trận](KIDEA_DESIGN.md#platform-matrix).

| ID / tình huống | Trạng thái đầu và kích thích | Kết quả Kidea phải thể hiện, có thể quan sát | Nơi kiểm chứng |
|---|---|---|---|
| KA-23 — Chất lượng/rule hiệu lực | Có quy ước project; rule nền xung đột; một rule bắt buộc bị vi phạm; đề nghị nâng profile hoặc miễn kiểm tra | Nêu xung đột và trình bộ rule/ngoại lệ trước áp dụng; không đè quy ước. Vi phạm chưa xử lý không DONE; profile cố định và truy được trên máy mới. Yêu cầu tải/bộ nhớ/khôi phục phải có workload, cách đo và gate, không tự cam kết “tối ưu” | P05/P06, P10-T02, P12-T03 |
| KA-24 — Bằng chứng không đạt | Từng fixture: test fail; skip; chưa chạy; chỉ mock; thiếu assertion; kết quả khác source/config/môi trường | Báo đúng giới hạn từng loại, không PASS/DONE theo bằng chứng đó. Không xóa test lỗi/hạ tiêu chí để xanh; sau sửa có kiểm tra lại đúng phạm vi task/phase/release | P06/P07, P10-T02, P11-T06/T07 |
| KA-25 — View đúng và cũ | Hồ sơ có task DONE, blocker, bước chưa phân rã và target khác release; sinh HTML rồi đổi nguồn và mở HTML cũ | View mới khớp nguồn, task DONE vẫn hiện; không hiểu 0 task là hoàn tất. View cũ có thời điểm/phiên bản snapshot, không giả biết thay đổi mới hoặc sức khỏe live; sinh lại mới cập nhật | P09-T02/T04/T06 |
| KA-26 — View lỗi/an toàn/offline | Mất mạng; chỉ mang HTML sang máy khác; dữ liệu chứa HTML/script/URL nguy hiểm; nguồn sai/đổi giữa đọc; lỗi ghi đầu ra | Không cần server/CDN để xem dữ liệu nhúng, nêu giới hạn link nguồn; nội dung không thực thi script; lỗi không phá nguồn hoặc giả view mới. Không có thao tác approve/edit/Git/deploy/upload. Kiểm tra bàn phím, màn hẹp/rộng, tên dài/nhiều task theo ma trận P09 | P09-T02–T06 |
| KA-27 — SEO xuyên quy trình | Pilot có trang prerender/SSR và trang riêng; môi trường kín, chưa có dữ liệu index | Yêu cầu/AC/map/test và hai gate SEO có trong kế hoạch; không mở index lab để lấy điểm đạt. Tách kiểm tra kỹ thuật với bằng chứng index/ranking; N/A pilot phải Human duyệt, không bỏ năng lực hướng dẫn | P05–P07, P10, P11-T01–T03/T07 |
| KA-28 — Release/ops/restore | Build thành công nhưng chưa deploy; deploy lỗi; smoke lỗi; mất tín hiệu monitoring; restore chưa xác nhận | Không gọi build là bản đang chạy hoặc release thành công; ghi version/config thực khi xác nhận. Thiếu tín hiệu là chưa biết/lỗi, không khỏe giả. Có kiểm tra admin/quyền và dữ liệu sau restore; retry/rollback đúng quyền, giữ bản cũ khi target chưa triển khai | P10-T04–T06, P11-T03 |
| KA-29 — Cài/nâng cấp/gỡ | Môi trường sạch được phép; bản skill khác đang có; schema mới hơn; nâng cấp thất bại; gỡ skill | Không đè bản khác âm thầm; từ chối không tương thích rõ ràng; khôi phục theo hợp đồng đã duyệt và bảo toàn hồ sơ/source. Xác minh sáu hành động trên host thật, không tự nhận cú pháp chưa hỗ trợ | P12-T01–T03 |
| KA-30 — Nghiệm thu đúng giới hạn | Có kết quả từ helper, phiên AI, pilot và ma trận môi trường nhưng còn một hạng mục bắt buộc chưa chứng minh | Tách lỗi Kidea/lỗi pilot, gắn kết quả với bản ứng viên và chỉ rõ khoảng trống; không cộng PASS rời thành đủ nghiệm thu, không dùng simulator thay máy thật bắt buộc. Sửa Kidea có impact/hồi quy; Human quyết định cuối, không tự công bố/cài/publish | P11-T07, P12-T05/T06 |

## 6. Đối chiếu và bước hoàn thiện tiếp

| Phạm vi phải có | Case |
|---|---|
| init / status / approve / resume / change / visualize | KA-01–03 / KA-03 / KA-05–08 / KA-11–13 / KA-17–22 / KA-25–26 |
| Mười bước, gate, shared/AC/test, chất lượng, UI, ops/admin, kiến trúc, kế hoạch/code/deploy | KA-04, KA-14–15, KA-23–24, KA-27–28 |
| Đường đúng và reject/approval cũ/dữ liệu sai | KA-04–09 |
| Gián đoạn, Git/đổi máy, project cũ | KA-02, KA-10–13 |
| Ba bản đồ, no-diff, chu kỳ, requeue, đổi/xóa | KA-15–16, KA-20–22 |
| Thêm giữa MVP, đổi sau release, bugfix | KA-17–19 |
| Một nguồn trạng thái, bằng chứng trung thực, offline, phạm vi hỗ trợ | KA-09, KA-24–30 |

P01-T05 chốt cách đo và mức bằng chứng tối thiểu cho các nhóm này, gồm hồ sơ đại diện, giới hạn thời gian/độ lớn, an toàn ghi và resume; không lấy 30 họ case làm tỷ lệ hoàn thành hoặc cam kết vét cạn. P01-T06 rà bao phủ/gói review cuối phase. P02–P12 bổ sung fixture, ID con và quy trình chạy vào bộ kiểm thử phù hợp, giữ truy xuất về đây; không duy trì một bảng trạng thái task thứ hai trong tài liệu này.
