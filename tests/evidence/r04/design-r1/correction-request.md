# R04 — Gói sửa C1–C5 sau kiểm độc lập

Cập nhật: Human **“Duyệt gói sửa R04”** sau `bcd9877a7f4dc5de75b45861512bc8abd33d5a45` đã chấp nhận C1–C5. Đã áp đúng byte bảy đích, [preimage](correction-apply-pre.json), [readback](correction-apply-post.json). Các nhãn IN_REVIEW/chưa áp dụng bên dưới và trong snapshot giữ nguyên bản từng trình; không là trạng thái hiện hành. Kết quả kiểm sau áp dụng được giữ tại [báo cáo](../design-r1.md); gate nghiệm thu cuối R04 vẫn riêng.

**IN_REVIEW, chưa áp dụng.** K1–K7/AR-r1 được Human duyệt sau `6abd985`; review sau đó phát hiện F01–F05. Không đổi lựa chọn công nghệ hoặc nghiệp vụ R03. [Bản kiến trúc đề xuất đầy đủ](architecture-r2-proposed.md), [byte/đích chính xác](correction-proposal-final.json), [review cuối](review-closure.md).

| Mục | Cần chốt | Ví dụ / tác động |
|---|---|---|
| C1 | Mã đăng ký phân biệt theo người dùng; namespace admin giữ K3 riêng | U và V cùng dùng mã X không làm V bị từ chối nhầm; V vẫn không đọc được kết quả U. Sửa sai khác kiến trúc với R-RETRY, không đổi R03 |
| C2 | Lịch sử cá nhân hợp nhất theo người/epoch/workshop/audience/version | Đã nhận “đã hủy”, phản hồi GET cũ “còn đăng ký” tới muộn không được ghi đè; đổi thế hệ dữ liệu bỏ response cũ |
| C3 | Chốt thứ tự khởi động/dừng, kiểm sẵn sàng trước mở ghi và chờ hoàn tất tối đa 30 giây khi dừng | Mở đường đọc trước, đủ backup/quan sát và phiên được phép mới mở ghi; phần chưa rõ sau dừng vẫn chưa xác nhận, không báo thất bại giả |
| C4 | Giới hạn tốc độ/yêu cầu/kết nối/hàng đợi cho lab; quá tải là lỗi kỹ thuật, không kết quả nghiệp vụ cuối | Không để một client gửi vô hạn; không tự retry admin. Lỗi trong bài đo vẫn tính, không biến một lần giới hạn tốc độ thành incident M2 vô hạn |
| C5 | Bổ sung link/backlink và bốn nhóm ca AR-T19–T22 | Khi sửa retry/quyền/monitoring, tìm được cả nơi lưu dữ liệu, API và socket cần rà |

C4 cụ thể để không giấu con số: HTTP đang xử lý tối đa 128; hàng ghi 64; tổng 100 request/giây, burst 200; mỗi actor hoặc địa chỉ khách 20/giây, burst 40. Socket tổng 128, mỗi actor 8 hoặc địa chỉ khách 16; hàng gửi mỗi socket tối đa 8 thông điệp và 1 MiB; frame client tối đa 8 KiB, 5/giây burst 10. Giới hạn HTTP body 128 KiB giữ AR-r1. Đây là profile thiết kế lab, chưa benchmark; R05 xác nhận cấu hình/giá trị và R09 đo WQ, đổi có gate chứ không tự tăng để đạt test. IP không cấp quyền; không thêm service hoặc dashboard.

Reviewer cùng một phiên đã kiểm bản đầu, bản sửa và điều chỉnh cuối: **F01–F05 và V1–V8 PASS trên bản đề xuất cuối**, không còn finding mở trên bản đó. Giữ FAIL/PARTIAL các bản cũ. 22 nhóm runtime của kiến trúc vẫn NOT_RUN. [Kiểm bản đề xuất](correction-proposal-check.json): 826 link hợp lệ, không thiếu backlink đã khai báo; ngoài kiến trúc chỉ append reference.

## Phạm vi áp dụng nếu Human duyệt

Áp đúng byte đề xuất cho `docs/design/architecture.md`; thêm reference trong `docs/design/admin.md`, `docs/design/operations.md`, `docs/design/quality.md`, `docs/business/shared/registration.md`, `docs/business/shared/workshop.md`, `docs/business/shared/availability.md` tại pilot. Bảy đích có before SHA và proposed byte trong manifest. Không sửa nội dung đã duyệt ở sáu nguồn backlink, không sửa file pilot khác, không cài/code/deploy hoặc thêm AI.

Trước áp dụng đối chiếu toàn pilot với baseline trong `integration-FCCoGx.json`; có thay đổi ngoài lượt thì dừng đối chiếu, không overwrite. Giữ snapshot/diff/readback và cập nhật kiểm bảo toàn theo revision đã duyệt, không hạ assertion cho một bản chưa được duyệt. Chạy kiểm cần thiết trong quyền, so bản thực với chính byte reviewer đã kiểm. Nếu giống hệt thì dùng lại review đúng byte, không xin một phiên mới chỉ vì chuyển file; khác nghĩa phải đánh giá/gate lại, không tự kéo dài quota.

Chốt đề nghị: **“Duyệt gói sửa R04”**. Đây là duyệt bản sửa C1–C5 để áp dụng và kiểm lại, không nghiệm thu trước thao tác chưa chạy hoặc khép toàn R04. Sau áp dụng/kiểm, trình kết quả cuối để Human khép R04; chưa mở R05 trong lượt này.
