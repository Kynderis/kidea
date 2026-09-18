# T03 Web — đang triển khai

Quyền thực thi trọn R09 được Human duyệt 2026-09-18. Source Web mới, chưa là sample R05 hoặc ứng dụng hoàn tất. Bộ package/lock kế thừa nguyên byte từ sample R05 đã kiểm để tái sử dụng cache offline; tên package lịch sử không là tên sản phẩm. Không thay sample.

Lát đầu: boundary decode/schema; merge actor/epoch/workshop/version; intent persist-before-send/GET-only reconcile; intro/list/detail SSR; tiếp đến private/session/auth wiring và browser thực. Backend vẫn quyết định nghiệp vụ. T02 đang chạy nguồn bất biến riêng, không sửa nguồn đó song song.

Unit state25 PASS chỉ là thành phần; public SSR/Chrome12 PASS, check/lint/build PASS; integration backend/private chưa đủ. Final R09 gate còn nguyên. Không nới UNKNOWN hoặc dùng role client làm quyền.
