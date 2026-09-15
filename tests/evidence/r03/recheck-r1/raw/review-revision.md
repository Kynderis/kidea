Revision kiểm lại: **F2/F3 đã xử lý; F1 mới xử lý một phần.** Chưa thể kết luận traceability đầy đủ.

Đã đối chiếu đủ 10 file với `revision.json`: **10/10 SHA-256 khớp**; 5 file giữ nguyên, 5 file thay đổi đã đọc và đối chiếu với bản đầu. Nguồn quyết định giữ nguyên. Review FAIL/PARTIAL bản đầu vẫn là lịch sử của đúng bản đầu.

| Finding | Kết quả revision | Đánh giá |
|---|---|---|
| F1 — dependency ngược | **PARTIAL** | Ba cạnh đã báo đều được bổ sung. Tuy nhiên bảng mới làm mất một dependency nghiệp vụ thực bên dưới |
| F2 — tạo workshop | **Đã xử lý** | W-STATE, AC-A5 và D09 xác định input, ID mới, DRAFT,N=0,C=10, nội dung/lịch, quyền đọc và điều kiện thành công cuối |
| F3 — HTML/Markdown | **Đã xử lý** | W-DATA/D05 quy định từ chối markup cụ thể; tạo không sinh dữ liệu, sửa giữ nguyên và không phát thay đổi |

### F1 còn lại: mất quan hệ W-STATE → R-SERIAL

`revision/docs/business/shared/workshop.md#relations` đã bỏ cạnh **W-STATE → registration.md#serial** vốn có ở bản đầu.

Nhưng `registration.md#serial` vẫn trực tiếp xác định:

- PAUSE trước thì chặn thao tác mới.
- Đăng ký/hủy trước PAUSE được nhận khi đủ điều kiện.

Những kết quả này phụ thuộc chính sách OPEN/PAUSED của W-STATE. Ví dụ change đã dự kiến “cho hủy khi PAUSED” sẽ làm đổi phần giải thích hủy/PAUSE trong R-SERIAL. Đây là dependency có ảnh hưởng quan sát được, dù thân R-SERIAL chưa có liên kết W-STATE.

Cần bổ sung **link xuôi R-SERIAL → W-STATE và backlink W-STATE → R-SERIAL**. Thống kê đầy đủ các liên kết hiện có chưa đủ phát hiện hợp đồng còn thiếu liên kết. Không yêu cầu revision thứ hai ngoài quota.

### Đánh giá độc lập F3

B2 đã ghi rõ “Không HTML/Markdown do người dùng nhập”. Với hai đầu vào định dạng rõ ràng `<b>abc</b>` và `**abc**`, expected từ chối phù hợp nguồn này; tôi không thấy cần một quyết định Human mới cho cách sửa đã giới hạn như vậy. Revision cũng không tự cấm mọi dấu câu hoặc chốt grammar kỹ thuật.

### Rubric revision

| Dimension | Kết quả |
|---|---|
| Scope | PASS |
| Không tự quyết định/approval | PASS |
| Input/state → output/state quyết định được | PASS |
| Retry semantics | PASS |
| Concurrency | PASS |
| Authority vs cache | PASS |
| Traceability/coverage | **FAIL — F1 còn lại** |
| Reconstruction không transcript | PASS |

Các kết quả đăng ký/retry/concurrency/version đã tái dựng ở review đầu không bị thay đổi. D09 nay tái dựng được đầy đủ kết quả tạo; D05 không còn hai expected cạnh tranh.

Đây là kiểm nội dung và correction regression trong cùng phiên, trước deadline; không phải test sản phẩm, nghiệm thu Human hoặc chứng nhận mọi chi tiết kỹ thuật.
