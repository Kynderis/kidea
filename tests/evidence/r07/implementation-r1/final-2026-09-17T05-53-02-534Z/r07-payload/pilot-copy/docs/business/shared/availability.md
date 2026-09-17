# C-VIEW — Công bố và đối chiếu trạng thái hiển thị

Nguồn B5–B7; phía ghi có thẩm quyền và phía hiển thị là trách nhiệm, chưa là hai service hay lựa chọn broker.

<a id="publish"></a>
## V-PUBLISH — Nghĩa vụ bên thay đổi

Căn cứ [B5/B7](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị), [chi tiết phục hồi](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#chi-tiết-để-không-giấu-điểm-cần-quyết).

Thay đổi thực đăng ký, C, trạng thái hoặc nội dung công khai phải giữ kết quả và đủ thông tin thay đổi để tái lập cập nhật sau gián đoạn. Chưa xác định việc lưu kết quả/nghĩa vụ cập nhật thì không báo thành công cuối. Đã lưu chắc kết quả nhưng hiển thị trễ không biến đăng ký thành thất bại. Không đổi/từ chối/retry đọc kết quả cũ không tạo thay đổi nghiệp vụ giả.

Bản trạng thái nhất quán theo workshop có version tăng cùng thay đổi, thông tin workshop, C/N/chỗ còn=C−N và thời điểm quan sát. Đây là dữ liệu dẫn xuất từ thẩm quyền [R-INV](registration.md#invariant), không nguồn nhận chỗ. Bản công khai không chứa danh tính đăng ký, registration riêng hoặc requestID. DRAFT chỉ được phân phối trong phạm vi admin theo [W-ACCESS](workshop.md#access); “thay đổi cần cập nhật” không là quyền công khai DRAFT. Kết quả/lịch sử cá nhân đi đường kiểm quyền riêng. Không cam kết mạng giao đúng một lần, không chọn outbox/database.

<a id="reconcile"></a>
## V-RECONCILE — Tiếp nhận version

Căn cứ [B5 và chi tiết cùng version khác nội dung](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#chi-tiết-để-không-giấu-điểm-cần-quyết).

| Đầu vào so với bản đã thấy | Quyết định và trạng thái sau |
|---|---|
| Version mới, trạng thái đủ nhất quán | Áp dụng bản mới, không ghép C mới với N cũ |
| Cùng version, cùng nội dung | Bỏ lặp, không đếm lại |
| Version cũ | Bỏ, không lùi trạng thái |
| Cùng version, khác nội dung | Lỗi cần đối chiếu thẩm quyền; không chọn tùy tiện, đánh dấu chưa xác nhận |
| Thiếu bản/gián đoạn, có snapshot mới bao phủ đầy đủ | Dùng snapshot đó để phục hồi; không bắt phát lại mọi bản cũ |
| Thiếu dữ liệu đủ bao phủ | Đọc nguồn có thẩm quyền, giữ trạng thái chưa cập nhật trong lúc đối chiếu |

Giữ event lỗi để đối chiếu. Không replay đăng ký/hủy vì chưa thấy cập nhật, không tự xóa dữ liệu lỗi. Chưa có SLO số giây; phải đo/chốt theo môi trường/tải ở thiết kế kỹ thuật và nghiệm thu.

<a id="stale"></a>
## V-STALE — Người xem thấy gì

Căn cứ [B6](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị).

Giữ số chỗ quan sát gần nhất và thời điểm; khi biết mất kết nối/đang đối chiếu ghi “chưa cập nhật”, không giả số chỗ bằng 0. Chưa từng có bản quan sát thì không bịa số hoặc thời điểm. Khi hồi phục dùng [V-RECONCILE](#reconcile). Số chỗ hiển thị dù mới không là đảm bảo nhận chỗ; backend quyết theo [R-NEW](registration.md#new). Kết quả yêu cầu chưa biết giữ cùng mã theo [R-RETRY](registration.md#retry).

<a id="monitor"></a>
## V-MONITOR — Giám sát hữu hạn

Căn cứ [B7](D:/Code/kynderis/kidea/proposals/r03-completion-batch-r1.md#b-toàn-bộ-quyết-định-nghiệp-vụ-bổ-sung-đề-nghị).

Chỉ admin xem tình trạng chờ/lỗi/độ trễ/lần xử lý thành công gần nhất. Không có nút replay/xóa ở MVP. Mất quan sát không biến thành không lỗi hoặc độ trễ bằng 0. Chưa chốt ngưỡng số giây/cảnh báo ở R03; không tuyên bố vận hành đạt từ dữ liệu giả.

<a id="relations"></a>
## Nơi dùng và ảnh hưởng

Bảng liệt kê từng mục nguồn và caller trực tiếp đến đúng section; không gộp hai rule rồi ngầm coi chúng có cùng người dùng. Link điều hướng trong INDEX và link quay về bảng quan hệ không phải dependency nghiệp vụ.

| Mục nguồn | Caller trực tiếp / kiểm chứng | Mục đích |
|---|---|---|
| [V-PUBLISH](#publish) | [features/admin · flow](../features/admin.md#flow), [features/admin · ac](../features/admin.md#ac), [features/register-cancel · flow](../features/register-cancel.md#flow), [features/register-cancel · ac](../features/register-cancel.md#ac), [features/updates · flow](../features/updates.md#flow), [features/updates · ac](../features/updates.md#ac), [shared/registration · new](registration.md#new), [shared/workshop · state](workshop.md#state), [shared/workshop · edit](workshop.md#edit), [tests · coverage](../tests.md#coverage), [tests · retry](../tests.md#retry), [tests · data](../tests.md#data), [tests · events](../tests.md#events) | Giữ kết quả/nghĩa vụ phục hồi và đúng audience trước thành công cuối. |
| [V-RECONCILE](#reconcile) | [features/updates · flow](../features/updates.md#flow), [features/updates · ac](../features/updates.md#ac), [features/view · flow](../features/view.md#flow), [features/view · ac](../features/view.md#ac), [shared/availability · stale](#stale), [tests · events](../tests.md#events) | So version, phát hiện mâu thuẫn và khôi phục trạng thái nhất quán. |
| [V-STALE](#stale) | [features/register-cancel · flow](../features/register-cancel.md#flow), [features/updates · flow](../features/updates.md#flow), [features/updates · ac](../features/updates.md#ac), [features/view · flow](../features/view.md#flow), [features/view · ac](../features/view.md#ac), [tests · events](../tests.md#events) | Biểu thị quan sát cũ/chưa biết, không dùng cache nhận chỗ. |
| [V-MONITOR](#monitor) | [features/updates · flow](../features/updates.md#flow), [features/updates · ac](../features/updates.md#ac), [tests · events](../tests.md#events) | Giới hạn giám sát và ý nghĩa dữ liệu quan sát được. |

Khi nguồn đổi, đọc các caller này cùng flow/AC/test; tìm thêm ID/link trong toàn hồ sơ để phát hiện quan hệ chưa khai báo. Từ caller bị đổi nghĩa, lan tiếp đến nơi phụ thuộc và ghi lý do với phần không bị ảnh hưởng. Bảng giúp tra cứu, không thay việc đọc hợp đồng hoặc cấp quyền sửa ngoài phạm vi.

### Nơi dùng trong thiết kế chất lượng

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [publish](#publish) | [Chất lượng · freshness](../../design/quality.md#freshness), [Chất lượng · recovery](../../design/quality.md#recovery), [Chất lượng · privacy](../../design/quality.md#privacy) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |
| [reconcile](#reconcile) | [Chất lượng · freshness](../../design/quality.md#freshness) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |
| [stale](#stale) | [Chất lượng · freshness](../../design/quality.md#freshness), [Chất lượng · client-seo](../../design/quality.md#client-seo) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |
| [monitor](#monitor) | [Chất lượng · freshness](../../design/quality.md#freshness) | Truy ảnh hưởng sang yêu cầu/case chất lượng; không thay rule nguồn. |

### Nơi dùng trong thiết kế trải nghiệm

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [stale](#stale) | [Trải nghiệm · error](../../design/experience.md#error) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
| [reconcile](#reconcile) | [Trải nghiệm · error](../../design/experience.md#error) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |
| [publish](#publish) | [Trải nghiệm · error](../../design/experience.md#error) | Truy ảnh hưởng sang UX/SEO; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế vận hành

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [monitor](#monitor) | [Vận hành · signals](../../design/operations.md#signals), [Vận hành · display](../../design/operations.md#display), [Vận hành · alerts](../../design/operations.md#alerts) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |
| [publish](#publish) | [Vận hành · signals](../../design/operations.md#signals), [Vận hành · privacy](../../design/operations.md#privacy) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |
| [reconcile](#reconcile) | [Vận hành · signals](../../design/operations.md#signals), [Vận hành · cases](../../design/operations.md#cases) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |
| [stale](#stale) | [Vận hành · display](../../design/operations.md#display) | Truy ảnh hưởng sang thiết kế vận hành; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế quản trị

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [publish](#publish) | [Quản trị · commands](../../design/admin.md#commands), [Quản trị · errors](../../design/admin.md#errors), [Quản trị · audit](../../design/admin.md#audit), [Quản trị · integration](../../design/admin.md#integration) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |
| [reconcile](#reconcile) | [Quản trị · integration](../../design/admin.md#integration) | Truy ảnh hưởng sang thiết kế quản trị; không thay hợp đồng nguồn. |

### Nơi dùng trong thiết kế kiến trúc

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [publish](#publish) | [Kiến trúc · storage](../../design/architecture.md#storage) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [reconcile](#reconcile) | [Kiến trúc · updates](../../design/architecture.md#updates) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |
| [stale](#stale) | [Kiến trúc · updates](../../design/architecture.md#updates) | Truy căn cứ thiết kế AR-r1; không thay nguồn đã duyệt |

### Nơi dùng bổ sung trong kiến trúc AR-r2 (đề xuất C5)

| Mục nguồn | Nơi dùng | Mục đích |
|---|---|---|
| [publish](#publish) | [Kiến trúc · updates](../../design/architecture.md#updates) | Truy hợp đồng trực tiếp và ca sửa review; không đổi nguồn |
| [reconcile](#reconcile) | [Kiến trúc · cases](../../design/architecture.md#cases) | Truy hợp đồng trực tiếp và ca sửa review; không đổi nguồn |
