# R03 — mẫu nghiệp vụ, luồng và test

Ngày 2026-09-15. `R03-T03/T04-S02-r1`: **IN_REVIEW**. Chỉ là phương pháp và ví dụ trong repo Kidea; chưa là đặc tả pilot được duyệt, skill đã tích hợp hoặc test đã chạy.

Cập nhật: **D1 APPROVED** ngày 2026-09-15. Human “Duyệt cách viết và kiểm nghiệp vụ này” sau bản giải thích tại answer `c91fba7` xác nhận mẫu và cách chọn/ghi test; không duyệt chi tiết nghiệp vụ, coverage pilot hoặc quyền chạy. Nhãn IN_REVIEW phía trên là lịch sử bản trình.

Căn cứ: [phạm vi phương pháp](r03-feature-method-r1.md), [thiết kế và nguyên tắc nghiệp vụ](../KIDEA_DESIGN.md), [kế hoạch R03](r03-method-entry-r1.md). Human “ok làm đi” sau answer `dc2d196f10c61966fde606921c802ced0573597a` duyệt D1 phương pháp T02 và cho soạn mẫu tiếp theo. Không suy ra quyền ghi pilot hoặc mở AI mới.

## 1. Mẫu nhỏ, thêm nội dung khi có nhu cầu

Một tài liệu có thể chứa nhiều mục cùng trách nhiệm; không tạo file cho mỗi rule/test. Dùng nguồn project đang có, không bắt đổi sang một cây thư mục cố định. Review và tiến độ ở `.kidea`; tài liệu sản phẩm chỉ giữ nội dung và liên kết tới căn cứ.

| Phần | Nội dung cần đủ | Khi không áp dụng |
|---|---|---|
| Mục đích/phạm vi | Actor, trigger, kết quả, ngoài phạm vi, nguồn yêu cầu | Luôn cần |
| Dữ liệu đầu vào/đầu ra | Ý nghĩa, miền hợp lệ, đơn vị, giá trị thiếu/null, độ chính xác/làm tròn nếu có | Ghi không có dữ liệu bổ sung, không tạo trường giả |
| Quy tắc | Điều kiện → kết quả, thay đổi/giữ nguyên dữ liệu, lỗi, biên; ID/link nguồn | Luôn cần cho hành vi được đặc tả |
| Trạng thái | Trạng thái trước, sự kiện, điều kiện, kết quả/trạng thái sau; ai chịu trách nhiệm dữ liệu | Nghiệp vụ không lưu trạng thái: nêu rõ và bỏ bảng chuyển trạng thái |
| Luồng | Bước/nhánh, điều kiện, kết quả, bước tiếp hoặc kết thúc, link rule | Không lặp toàn bộ rule trong bảng |
| Điều luôn đúng | Invariant: điều kiện phải giữ qua thành công/từ chối/lặp/đồng thời | Chỉ nêu điều có căn cứ, không thêm khẩu hiệu |
| AC và test | Kết quả quan sát được cần chấp nhận; các ví dụ test có căn cứ | Không biến danh sách test thành bằng chứng đã thực thi |
| Điểm mở và quan hệ | OPEN ảnh hưởng gì; link đi/đến đúng mục cùng mục đích | Không dựng approval hoặc expected còn thiếu |

Phân tích phần cần viết mới đến khi input/state cụ thể xác định được kết quả và dữ liệu thay đổi/giữ nguyên. Với phần dùng lại, đọc đầy đủ nguồn và hợp đồng, dẫn link đúng mục. Dependency còn mở chặn phần phụ thuộc, không chặn các phần độc lập. Không chọn database, lock hoặc thuật toán xử lý event ở mẫu nghiệp vụ.

## 2. Ví dụ hữu hạn: chỗ cuối của workshop

Ví dụ lấy ràng buộc đã có ở [pilot-scope](../KIDEA_DESIGN.md#pilot-scope), chỉ chứng minh cách viết mẫu. Đây không phải toàn flow đăng ký/hủy hoặc chốt thứ tự lỗi. C giả định bằng 1 để minh họa, không thay seed pilot.

<a id="ex-data"></a>

### EX-DATA — dữ liệu và tiền đề

`C` là sức chứa, đơn vị chỗ; `N` là số đăng ký ACTIVE có thẩm quyền của workshop. Trong ví dụ C=1 và N∈{0,1}. Actor là người tham gia đủ quyền, workshop OPEN, chưa có ACTIVE, yêu cầu hợp lệ và mới; mọi điều kiện ngoài sức chứa đã thỏa. Chưa mô tả retry, lỗi kết hợp hoặc dữ liệu đầu vào sai.

Nơi quyết định nhận đăng ký dùng dữ liệu có thẩm quyền, không dùng số chỗ hiển thị có thể trễ. State đăng ký thay đổi thuộc nghiệp vụ đăng ký; phần hiển thị chỉ nhận dữ liệu dẫn xuất, không sở hữu quy tắc nhận chỗ thứ hai.

<a id="ex-rule"></a>

### EX-RULE — nhận hoặc từ chối vì sức chứa

Với [tiền đề](#ex-data), nếu N<C thì nhận một đăng ký ACTIVE và N sau=N trước+1. Nếu N=C thì không nhận thêm ACTIVE, N giữ nguyên. Ví dụ chỉ gọi kết quả là nhận/hết chỗ; không chọn mã lỗi HTTP, thông báo UI hoặc thuật toán đồng bộ.

<a id="ex-invariant"></a>

### EX-INV — không vượt sức chứa

Trong trạng thái hợp lệ, 0≤N≤C; mỗi người tối đa một ACTIVE trên cùng workshop. Từ chối vì hết chỗ không tạo ACTIVE. Với hai người khác nhau cùng tranh một chỗ còn lại, không được nhận cả hai; chưa quy định ai thắng. Chưa chứng minh liveness hoặc thời hạn trả kết quả bằng invariant này.

<a id="ex-flow"></a>

### EX-FLOW — bảng luồng của ví dụ

| Bước | Điều kiện/hành động | Kết quả và tiếp theo |
|---|---|---|
| F1 | Xác định ví dụ thỏa [EX-DATA](#ex-data) | Không thỏa: ra ngoài phạm vi mẫu, không suy kết quả. Thỏa: F2 |
| F2 | Quyết định theo [EX-RULE](#ex-rule) trên dữ liệu có thẩm quyền | N<C: F3; N=C: F4 |
| F3 | Nhận một ACTIVE | N tăng một, kiểm [EX-INV](#ex-invariant), kết thúc nhận |
| F4 | Không nhận ACTIVE | N giữ nguyên, kiểm [EX-INV](#ex-invariant), kết thúc hết chỗ |

Đây là thứ tự logic nghiệp vụ, không phải pseudocode cho phép đọc N rồi ghi không đồng bộ. Bảng không đặt thứ tự kiểm quyền/trạng thái/duplicate. Nếu một rule có nhiều lỗi đồng thời, phải hỏi kết quả quan sát được cần ưu tiên trước khi hoàn tất flow tương ứng. Flow ngắn này không cần thêm Mermaid; flow phức tạp dùng hình dẫn xuất từ bảng, không để rule chỉ tồn tại trong hình.

<a id="ex-ac"></a>

### EX-AC — điều kiện chấp nhận

Khi mọi [tiền đề](#ex-data) thỏa, người tham gia được nhận nếu còn chỗ và không được nhận thêm khi đã đầy; số ACTIVE tuân thủ [EX-RULE](#ex-rule) và [EX-INV](#ex-invariant). AC không chọn công nghệ hoặc thay nghĩa vụ event/cập nhật hiển thị của Feature đầy đủ.

<a id="ex-tests"></a>

### EX-TEST — ví dụ kiểm tra nghiệp vụ, chưa chạy

| ID | Căn cứ | Trạng thái đầu/input | Kết quả mong đợi/trạng thái cuối |
|---|---|---|---|
| BT-01 | [EX-RULE](#ex-rule), [EX-AC](#ex-ac) | C=1,N=0; một yêu cầu mới, tiền đề thỏa | Nhận một ACTIVE, N=1; [EX-INV](#ex-invariant) giữ |
| BT-02 | [EX-RULE](#ex-rule), [EX-AC](#ex-ac) | C=1,N=1; một yêu cầu mới, tiền đề thỏa | Không thêm ACTIVE, N=1; [EX-INV](#ex-invariant) giữ |
| BT-03 | [EX-INV](#ex-invariant) | C=1,N=0; hai người khác nhau, hai yêu cầu mới cùng tranh chỗ; các điều kiện khác thỏa | Không nhận cả hai; N≤1, không gán trước người thắng. Phần thứ tự/kết quả từng yêu cầu cần đặc tả và kiểm bổ sung |

BT-03 chỉ là kiểm invariant, chưa phải test đầy đủ flow đồng thời. Lỗi kỹ thuật, timeout và thời hạn phản hồi không có expected hoàn chỉnh ở mẫu này. Không được tính ba dòng là bao phủ toàn Feature đăng ký.

<a id="ex-relations"></a>

### EX-RELATIONS — quan hệ hai chiều của mẫu

Các link trong nội dung là chiều sử dụng. Bảng dưới là chiều ngược, mỗi dòng ghi đúng mục được dùng và caller; không dùng ALL/NEXT. Khi tách file, chuyển link thành `file.md#anchor`, giữ mục đích và kiểm lại cả hai chiều.

| Mục được dùng | Được dùng bởi | Mục đích |
|---|---|---|
| [EX-DATA](#ex-data) | [EX-RULE](#ex-rule), [EX-FLOW](#ex-flow), [EX-AC](#ex-ac) | Giới hạn tiền đề áp dụng |
| [EX-RULE](#ex-rule) | [EX-FLOW](#ex-flow), [EX-AC](#ex-ac), [EX-TEST](#ex-tests) | Quyết định nhận/hết chỗ và expected |
| [EX-INV](#ex-invariant) | [EX-FLOW](#ex-flow), [EX-AC](#ex-ac), [EX-TEST](#ex-tests) | Giới hạn dữ liệu qua các nhánh và tranh chỗ |
| [EX-AC](#ex-ac) | [EX-TEST](#ex-tests) | Truy test về kết quả cần chấp nhận |

Mẫu chỉ dùng ID cấp mục; ID BT là nhãn hàng test trong mục EX-TEST, không giả chúng đã có anchor riêng. Cần tham chiếu riêng từng test thì thêm anchor ổn định tại lúc cần.

## 3. Chọn test theo nghĩa vụ, không theo số lượng

1. Liệt kê rule/nhánh kết quả, nhóm giá trị và biên, state/transition, invariant và contract tại các điểm dùng chung thực sự có trong phạm vi.
2. Chọn test bắt buộc cho từng nghĩa vụ; loại tổ hợp bất khả thi chỉ khi có căn cứ. Với tập hữu hạn nhỏ có thể liệt kê hết; không nhân mọi input/state thành tổ hợp khổng lồ.
3. Bổ sung chuỗi, retry, đồng thời và gián đoạn khi chúng đổi kết quả. Kiểm cả không phát sinh thay đổi ngoài dự kiến, không chỉ output thành công.
4. Với phần lớn còn lại, trình mức kết hợp và lý do rủi ro; không mặc định pairwise đủ. Chưa chốt mức bao phủ cụ thể cho pilot bằng gói mẫu này.
5. Mỗi test có ID, link căn cứ, trạng thái đầu, input/sự kiện, expected output/state, invariant liên quan. Thiếu expected do OPEN thì ghi chưa đủ căn cứ, không điền giả và không tính đạt.

| Nghĩa vụ trong mẫu | Test/giới hạn |
|---|---|
| Nhận khi N<C với tiền đề thỏa | BT-01; chỉ C=1,N=0 |
| Không nhận khi N=C | BT-02; chỉ C=1,N=1 |
| Không vượt chỗ khi tranh chấp | BT-03; chỉ invariant, chưa phủ toàn bộ interleaving hoặc liveness |
| Duplicate/retry/quyền/PAUSED/hủy/event trễ hoặc lặp | Ngoài phạm vi mẫu, vẫn là nghĩa vụ cần đặc tả/test của Feature đầy đủ, không được miễn |
| Sức chứa khác 1, dữ liệu không hợp lệ, biên miền C | Chưa chọn/đặc tả ở mẫu; không suy ba test đại diện toàn miền |

## 4. Sửa nguồn và gate

Khi rule đổi, tìm ID/link trên toàn bộ nguồn liên quan để bắt cả backlink thiếu; đọc caller/contract trước khi kết luận ảnh hưởng. Ghi cần sửa hoặc không cần sửa kèm lý do; chỉ lan tiếp từ nơi có thay đổi nghĩa có thể quan sát. Dùng danh sách đã xét để không lặp vô hạn. Cập nhật rule, flow, hình nếu có, AC/test, link và mục lục cùng thay đổi; giữ lịch sử/căn cứ review theo R02.

Phần nghiệp vụ chỉ được trình duyệt khi không còn OPEN làm đổi hành vi trong phạm vi gói, dependency bắt buộc đủ căn cứ và coverage được mô tả trung thực. Có thể review rule và test specification cùng gói. Human duyệt nội dung không chứng minh code/test đã chạy. Một gói con được duyệt không tự khép bước 2.

## 5. Review phương pháp D1

Đề nghị duyệt **mẫu tối thiểu và cách chọn/ghi test tại mục 1, 3–4**, dùng mục 2 để kiểm cách diễn đạt. Không duyệt rule chi tiết, ranh giới module, seed hoặc coverage pilot bằng ví dụ này.

Lợi ích: nhìn mỗi hành vi thấy rõ điều kiện, kết quả và cách kiểm; tránh viết nhiều test nhưng bỏ nghĩa vụ quan trọng. Đánh đổi: cần ghi rõ phần chưa bao phủ và giải quyết OPEN, nên không thể hứa “mọi trường hợp đều được test” chỉ từ số lượng test.

Rà bàn giấy: các nhánh nhận/từ chối có state cuối; invariant đồng thời không bị diễn giải thành thuật toán hay người thắng; lỗi kết hợp/retry còn thiếu được ghi rõ; links có đích; không thêm review/progress nhập tay ở tài liệu sản phẩm. Chưa chạy AI/test sản phẩm hoặc sửa skill. Sau approval phương pháp, chuẩn bị riêng gói quyền hồ sơ pilot và loạt kiểm chứng hữu hạn trước thực thi.
