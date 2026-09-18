# R09 T03 — phần Web công khai và state client

Quyền trọn R09 đã duyệt, [hồ sơ](../../../docs/R09_EXECUTION_AUTHORITY.md). Đây là phần authoring độc lập trong `pilot/web`, không sửa nguồn75file đang được build r7. Chưa khép T03 hoặc nhận toàn ứng dụng đạt.

Đã viết decoder public snapshot/private history, uint64 version, guard actor/epoch/generation, hợp nhất theo workshop và giữ UNKNOWN khi cùng version khác nội dung; intent persist-before-send và đọc kết quả bằng GET sau reload. Intro prerender, list/detail SSR, no-store/noindex/canonical lab cố định, escape/plain text, lịch tiếng Việt/offset và thời điểm quan sát. Chưa nối đăng ký/hủy/session hoặc sự kiện thật.

Nguồn cuối: **25 unit PASS, 12 kiểm SSR/Chrome PASS**, typecheck không warning, lint và build PASS. [Receipt/source hashes](t03-authoring/receipt.json), [unit](t03-authoring/unit-final.log), [Chrome/SSR](t03-authoring/chrome-source-final.log). Dùng adapter-node production bundle và API giả local để kiểm contract; không gọi đó là tích hợp backend. Chrome thật với JavaScript bật/tắt,360/1280CSSpx,zoom100/200%,keyboard và HTML private sentinel. Đã xem ảnh hẹp200%, giữ các ảnh trước/sau.

`npm ci --offline --ignore-scripts` dùng cache R05 có sẵn, package/lock nguyên byte,0download. Không thay sample, không cài công cụ hệ thống hoặc publish. Node24.19.0 trên Mac Intel. Package name còn tên sample do giữ lock ban đầu; đó không là nguồn ứng dụng hoặc khẳng định kế thừa PASS của R05.

Giữ lỗi lint link cần resolve(), lỗi lint catch rỗng và FAIL test kiểm href tuyệt đối. Svelte xuất href tương đối đúng; test sau sửa đối chiếu URL đích đã resolve, không hạ điều kiện navigation. HTML lang en kế thừa mẫu đã sửa thành vi. Favicon404 được ghi trong log; không có page script error trong các ca đã kiểm.

Còn lại: auth/bootstrap theo quyền server, private history/đăng ký/hủy/reconcile thực, TLS/cổng và freshness/events, bản đồ quan hệ và toàn gate T03/G2. T04 chưa áp max2ACTIVE; cần giữ MVP dở để thử impact đúng kế hoạch.

## Tiếp tục component đăng ký

[Receipt mới](t03-authoring/registration-receipt.json), pilot0d50d3c:33unit/13SSR–Chrome/check/lint/build PASS. Component giữ intent trước POST; reload chỉ GET; kết quả lịch sử không thay history; Escape không hủy; hủy đúng ID; actor/epoch generation và abort xử lý response cũ. Đã tái hiện lỗi route reuse: đi W→W2 còn intentW; key theo workshop/epoch sửa đúng nguyên nhân, [FAIL trước](t03-authoring/chrome-route-regression.log), [PASS cuối](t03-authoring/chrome-registration-final.log). Giữ lỗi đặt biến state đụng rune $state trước đổi thành clientState.

Đường này hiện kiểm bằng API giả browser, chưa backend thật. Cần bổ sung endpoint session được backend xác thực, cổng HTTPS, private SSR/history và kiểm tích hợp trên artifact cuối. Không nhận T03 DONE.
