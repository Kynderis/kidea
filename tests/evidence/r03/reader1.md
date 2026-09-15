# Phản hồi phiên 1 — nội dung trả về, không là Human approval

Đã đọc đầy đủ `prompt.txt`, hai tài liệu phương pháp, `input/source.md` và cả hai hồ sơ trong `input/docs`. Không mở liên kết ngoài snapshot, không ghi file hoặc thực thi sản phẩm. Không còn file được cấp nào chưa đọc.

## 1. Sản phẩm và đợt hiện tại

Pilot là ứng dụng đăng ký workshop trong lab: khách xem workshop; người tham gia đăng ký/hủy và xem đăng ký của mình; admin quản lý nội dung, sức chứa và trạng thái. MVP gồm cả cập nhật bất đồng bộ, monitoring và phục hồi, không chỉ đăng ký đúng. Backend C++/Ubuntu giữ rule và dữ liệu có thẩm quyền; web, Android và iOS dùng cùng backend. Nguồn: `source.md:10–24`; `docs/features.md:8–35`.

Hồ sơ hiện tại mới là **bản phạm vi và ứng viên nghiệp vụ để review**, chưa phải đặc tả nghiệp vụ được Human duyệt, chưa có code/test chạy hoặc quyền triển khai (`docs/features.md:3`; `docs/business/INDEX.md:3,21`). Approval hai phương pháp chỉ duyệt cách làm, không duyệt ranh giới/rule/coverage pilot (`methods/r03-feature-method-r1.md:5`; `methods/r03-business-template-r1.md:5,120`).

Ngoài MVP ban đầu: giới hạn hai ACTIVE toàn hệ thống và hủy khi PAUSED là các change về sau; chưa có A/B được chốt. Không thanh toán, người dùng thật, email/SMS, danh sách chờ, push notification hay public release; ngân sách phát sinh 0 đồng. Không xóa workshop hoặc tự chuyển trạng thái theo thời gian (`source.md:18,31–32,42–46`; `docs/features.md:23,35,40–42`).

## 2. Ứng viên dùng chung và trách nhiệm/state

| Ứng viên | Đánh giá và điểm chưa đủ |
|---|---|
| **C-REG — đăng ký/sức chứa có thẩm quyền** | Hợp lý vì đăng ký/hủy và sửa sức chứa cùng phải giữ số ACTIVE không vượt sức chứa. ACTIVE thuộc nghiệp vụ đăng ký; admin sửa sức chứa phải tuân cùng invariant. Chưa rõ hợp đồng thay đổi sức chứa với đăng ký đồng thời, retry và lỗi kết hợp. Không được suy thành transaction hoặc bảng dữ liệu đã chọn. |
| **C-LIFE — vòng đời workshop** | Hợp lý vì xem, đăng ký/hủy và quản trị cùng phụ thuộc DRAFT/OPEN/PAUSED. Backend phải có nghĩa nhất quán, nhưng mỗi actor/caller có thể quan sát khác nhau. Còn thiếu kết quả chuyển trạng thái và chính sách hiển thị cụ thể. |
| **C-VIEW — số chỗ hiển thị/cập nhật** | Hợp lý vì F01 và F04 cùng dùng dữ liệu dẫn xuất và thời điểm cập nhật. Không sở hữu quyền nhận đăng ký; cần rõ hợp đồng event, xử lý lặp/trễ/đảo thứ tự, phục hồi và đối chiếu. |

Căn cứ trực tiếp: `docs/business/INDEX.md:10–14`; đối chiếu `source.md:17–24` và `methods/r03-business-template-r1.md:34–48`.

**Chưa thấy mâu thuẫn trực tiếp giữa hồ sơ và nguồn được cấp.** Các ranh giới vẫn là đề xuất, chưa phải ba module/service/database đã chốt. Cụm đăng ký/hủy + phần cần dùng của C-REG/C-LIFE có lý do phụ thuộc rõ; việc yêu cầu đầu ra sang C-VIEW giúp giữ nghĩa vụ event trong cụm, nhưng trách nhiệm/hợp đồng cụ thể vẫn chưa được đặc tả (`docs/business/INDEX.md:14,19–21`).

## 3. Cần Human quyết trước đặc tả phụ thuộc

- **Duyệt ranh giới trách nhiệm và cụm đầu**, gồm quan hệ sửa sức chứa của admin với C-REG. Đây là gate rõ ràng; cụm hiện chưa được duyệt (`docs/business/INDEX.md:21,26`; `methods/r03-feature-method-r1.md:48`).
- **Kết quả khi nhiều điều kiện cùng sai**; cách nhận diện retry, kết quả yêu cầu lặp và sau gián đoạn. Thiếu các lựa chọn này thì chưa xác định được output/state cuối để hoàn tất flow/test (`docs/features.md:18,47`; `docs/business/INDEX.md:27`).
- **DRAFT/PAUSED hiển thị thế nào theo actor**, và kết quả chi tiết của chuyển trạng thái. Không thể suy khả năng xem từ tên trạng thái (`docs/features.md:13`; `docs/business/INDEX.md:28`).
- **Người dùng thấy gì khi số chỗ trễ/mất cập nhật**, cùng yêu cầu đối chiếu và độ tươi cần chấp nhận. Chưa được tự chọn ngưỡng thời gian hay thuật toán (`docs/business/INDEX.md:29`; `source.md:24`).

Không cần hỏi lại việc chỉ đăng ký/hủy khi OPEN hoặc giữ native trong MVP (`docs/business/INDEX.md:31`). Không cần chốt tất cả rule chi tiết để duyệt phạm vi; OPEN chỉ chặn phần phụ thuộc, phần độc lập vẫn có thể tiến hành theo quyền tương ứng (`methods/r03-feature-method-r1.md:38`; `methods/r03-business-template-r1.md:24,116`).

## 4. Ba dấu hiệu cần kiểm tra

- **Lấy đề xuất thành approval:** không thấy. Hồ sơ ghi DRAFT, nêu cụm chưa duyệt và tách approval phương pháp khỏi pilot. Tuy nhiên bằng chứng review gốc ở các link ngoài snapshot chưa được kiểm tra độc lập.
- **Đặc tả sâu Future:** không thấy. Hai change chỉ được ghi nhận và loại khỏi MVP hiện tại; chưa có rule/test triển khai chúng (`docs/features.md:40–42`).
- **Dùng số chỗ hiển thị để nhận đăng ký:** không thấy; hồ sơ cấm rõ tại `docs/features.md:28` và `docs/business/INDEX.md:12`, phù hợp `source.md:24`.

Đây là nhận xét về nội dung tài liệu, không chứng minh runtime tuân thủ.

## 5. Thiếu gì để phiên mới tiếp tục

1. **Bằng chứng review hiện hành** cho bản Feature Map, ranh giới và cụm; quyết định Human cho những mục còn mở. Nguồn phạm vi đã có xác nhận, nhưng không được suy approval của bản hồ sơ mới từ đó.
2. **Nguồn rule/state/contract chi tiết**: snapshot chỉ có Feature Map và INDEX; chưa có đặc tả nghiệp vụ chung, flow, AC, test pilot. Ba test ví dụ C=1 của phương pháp không thay coverage pilot (`methods/r03-business-template-r1.md:71–79,98–110`).
3. **Thông tin điều phối để resume**: current item, điểm quay lại, phạm vi quyền và review còn hiệu lực. INDEX cố ý không chứa tracker; snapshot cho biết chưa tạo `.kidea` (`docs/business/INDEX.md:3`; `methods/r03-feature-method-r1.md:68–70`).
4. Nếu bước tiếp theo cần kiểm quyền ghi/build/chạy: **gói quyền hồ sơ và bằng chứng approval gốc, ma trận nền tảng đầy đủ, điều kiện tài nguyên lab**. Những tài liệu này chỉ được dẫn link, không nằm trong input; chưa thể xác minh. Nguồn nhấn mạnh quyền hồ sơ không đồng nghĩa quyền chạy ứng dụng (`source.md:40–46`).

Phiên mới có thể tiếp tục review trên snapshot này; chưa đủ căn cứ hoàn tất đặc tả phụ thuộc hoặc tuyên bố kiểm thử/triển khai đạt.
