# T04 — giới hạn hai đăng ký ACTIVE

Nghiệp vụ đã được Human duyệt trong Kidea `proposals/r09-next-decisions-r1.md`, mục D; áp dụng sau lát backend/Web T03, khi MVP còn dở. Quyền thực thi trọn R09 và gói R09-REPLAN-LEGACY-r1 đã được duyệt. Tài liệu này xác định thay đổi hiện hành; các hồ sơ R03–R05 giữ nguyên byte làm baseline đã nghiệm thu, không bị viết lại lịch sử.

## scope

Mỗi actor có tối đa hai đăng ký ACTIVE trên toàn bộ workshop. CANCELLED không chiếm hạn mức. Với dữ liệu kế thừa đã có hơn hai ACTIVE, giữ mọi hàng và lịch sử, chặn đăng ký mới đến khi số ACTIVE xuống dưới hai; không tự hủy hay xóa. Không đổi quyền, epoch, CSRF, idempotency, giới hạn chỗ hoặc authority C++/SQLite. Android/iOS vẫn Future. PAUSED vẫn từ chối cả đăng ký và hủy ở baseline này; quyền hủy khi PAUSED chỉ thay ở T09 sau release.

## order

Cùng transaction: xác thực/quyền/đối tượng và đọc kết quả của cùng ý định trước; với ý định mới, PAUSED trả PAUSED. Với OPEN, nếu actor đã ACTIVE tại workshop đó thì ALREADY_REGISTERED. Nếu chưa, đếm toàn bộ ACTIVE của actor; từ hai trở lên trả LIMIT_REACHED/REJECTED, trước FULL. Còn hạn mức nhưng hết chỗ trả FULL. Chỉ khi cả hai đủ mới tạo đăng ký và outbox/version. Mã từ chối LIMIT_REACHED là kết quả lịch sử bất biến theo cùng namespace actor/requestId, không là lỗi transport.

Hủy vẫn chỉ đúng registrationId chính chủ. ACTIVE→CANCELLED giải phóng hạn mức; hủy lại không giải phóng thêm hoặc tạo event. Hủy không sửa kết quả LIMIT_REACHED đã ghi; retry mã cũ vẫn bị từ chối, mã mới có thể thành công khi đủ điều kiện. Hai ghi đồng thời ở hai workshop phải tuần tự hóa trên cùng DB; không kiểm quota ngoài transaction hoặc dựa vào client cache.

## consumers

- Backend Store::registration quyết định; schema một ACTIVE/actor/workshop giữ nguyên. Query count có thể dùng index partial `one_active(actor,workshop) WHERE state=ACTIVE` đã có để lọc theo prefix actor; kiểm query plan trên SQLite đúng bản trước khi kết luận. Không thêm constraint làm dữ liệu kế thừa không hợp lệ.
- OpenAPI thêm mã LIMIT_REACHED; Web decoder nhận đúng REJECTED cho REGISTER, không nhận mã này cho CANCEL. UI giải thích kết quả tại thời điểm xử lý; không tự đếm quota hoặc chặn authority dựa vào history cache.
- Idempotency/history/cancel giữ nghĩa cũ, nhưng phải kiểm kết quả từ chối cũ sau cancel và dữ liệu >2. Version/outbox chỉ đổi khi domain thật đổi; quota rejection không là public update.
- Admin không được dùng quota cá nhân thay kiểm capacity/state. Public remaining tiếp tục là capacity trừ ACTIVE tại workshop; không phải hạn mức riêng của actor.
- SSR/private quyền, epoch/generation, outbox/event/freshness, backup/restore, latency và compatibility phải được xem xét dù không có diff. Các phần chưa triển khai ở T05 vẫn chưa hoàn tất.

## verification

Thêm test zero/one/two/>two ACTIVE; CANCELLED không đếm; duplicate trước quota; quota trước FULL; PAUSED trước quota; retry mã cũ sau hủy; mã mới sau hủy; hai đăng ký khác workshop từ một ACTIVE chỉ một thành công; cancel/register theo cả hai thứ tự; không xóa hàng cũ hoặc thêm outbox khi từ chối. Giữ 46 case/796 assertion gốc, thêm assertion riêng. Chạy đầy đủ preset/HTTP/Web trên nguồn cuối với EXr2 giữ nguyên. Mutation/schedule kiểm phải phân biệt bỏ quota, đếm CANCELLED, sai thứ tự, retry tính lại hoặc count ngoài transaction; không coi lời gọi hàm là coverage.

## completion

Impact chỉ đóng khi mọi consumer có kết luận có bằng chứng, review output đúng bản và public CLOSE thành công. Việc viết tài liệu/graph không chứng minh code đã chạy. G2 toàn ứng dụng vẫn là gate cuối; giới hạn của TSan, maps và môi trường được giữ rõ. Không có quyền deploy hoặc nghiệm thu R09 từ tài liệu này.

## map-evidence

Đồ thị T04 có10nghĩa vụ tương ứng10bước và14quan hệ có lý do/nguồn. Đây là phân tích ảnh hưởng của thay đổi quota, không thay ba bản đồ hoặc tạo cây tiến độ thứ hai: public impact plan giữ tiến độ có thẩm quyền. Các receipt Web/Clang ở Kidea `tests/evidence/r09/pilot-maps-r2/` vẫn INCOMPLETE đối với dispatch/package/event chưa giải hết. Quan hệ quota được kiểm trực tiếp qua Store::handle→BEGIN IMMEDIATE→registration→remember/changed và Web decodeReply→Registration; không suy graph rỗng từ cảnh báo adapter. Event publisher/admin UI/ops chưa có vẫn là nghĩa vụ T05, không bị xóa vì không có diff T04.
