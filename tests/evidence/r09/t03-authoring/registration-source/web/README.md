# T03 Web — đang triển khai

Quyền thực thi trọn R09 được Human duyệt 2026-09-18. Source Web mới, chưa là sample R05 hoặc ứng dụng hoàn tất. Bộ package/lock kế thừa nguyên byte từ sample R05 đã kiểm để tái sử dụng cache offline; tên package lịch sử không là tên sản phẩm. Không thay sample.

Lát đầu: boundary decode/schema; merge actor/epoch/workshop/version; intent persist-before-send/GET-only reconcile; intro/list/detail SSR; tiếp đến private/session/auth wiring và browser thực. Backend vẫn quyết định nghiệp vụ. T02 đang chạy nguồn bất biến riêng, không sửa nguồn đó song song.

Unit state25 PASS chỉ là thành phần; public SSR/Chrome12 PASS, check/lint/build PASS; integration backend/private chưa đủ. Final R09 gate còn nguyên. Không nới UNKNOWN hoặc dùng role client làm quyền.

Tiếp tục: component đăng ký/hủy đã viết và kiểm bằng API giả:33unit/13SSR–Chrome, mất response→reload→GET cùng ID; Escape không POST; hủy đúng ID; đổi workshop/epoch remount và chặn cache cũ. Backend thật còn thiếu GET `/api/v1/session` (actor/epoch/csrf/participant do server xác thực), cổng HTTPS và route private. Không dùng test giả để nhận tích hợp đã xong. Giữ FAIL route reuse trước bản sửa keyed component. R8 backend đang chạy độc lập, chưa sửa source closure của nó.
