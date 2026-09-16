# R05 — Mẫu Web chạy thật trên Mac Intel

Ngày 2026-09-16. Human “Ok làm đi” sau ced8b31 cho hiện thực/chạy mẫu Web theo gói đã chuẩn bị; Docker vẫn hoãn. [Biên nhận phạm vi](web-execution-r1/approval.json). **Hoàn thành lát cắt mẫu, không nghiệm thu toàn R05 hoặc toàn sản phẩm.**

## Kết quả nguồn cuối

Mẫu CREATE-only tại `/Users/kendrick/Desktop/kidea-workshop-pilot/samples/r05/web`, dùng Node24.19.0/npm12.0.2 đang có, macOS14.7 x64. npm ci với ignore-scripts cài187package phù hợp host từ lock237entry (bao gồm optional cho các nền tảng khác); lock không đổi, root package/lock Kidea không đổi. Không cài công cụ hệ thống hoặc thay PATH lâu dài.

| Kiểm | Kết quả thực |
|---|---|
| SvelteKit sync → svelte-check strict | PASS,0error/0warning ở lượt cuối |
| ESLint | PASS,0warning, không hạ rule |
| Unit | **14/14 PASS**,0skip/cancel/todo |
| Production adapter-node build | PASS trên Mac Intel |
| Chromium SSR/browser | **11/11 PASS**,0skip/flaky/retry |
| S06 thứ tự ngược trên process server mới | **1/1 PASS bổ sung**, không thay suite11ca |
| Mẫu cố ý sai | **8/8 bị phát hiện**; các lượt này exit1 đúng dự kiến, không gộp thành app PASS |
| Dependency thực | npm ls --all exit0, cookie0.7.2 override được dùng |

[Chuỗi cuối](web-execution-r1/final-pipeline-2.json), [browser report](web-execution-r1/final-browser-results.json), [manifest SHA/môi trường/từng lượt](web-execution-r1/manifest.json), [tám mutation](web-execution-r1/mutations-A02dW6/summary.json). Mỗi lượt có stdout/stderr/exit, hash nguồn trước–sau; nguồn cuối20file giống nhau trong toàn chuỗi cuối. Giữ log từng FAIL/PASS, không chỉ snapshot xanh.

Bản chụp nguồn: [README](web-execution-r1/sample/README.md), [package](web-execution-r1/sample/package.json), [lock](web-execution-r1/sample/package-lock.json), [model](web-execution-r1/sample/src/lib/model.ts), [unit](web-execution-r1/sample/tests/unit/model.test.mjs), [cookie](web-execution-r1/sample/tests/unit/cookie.test.mjs), [browser](web-execution-r1/sample/tests/browser/sample.spec.ts). Snapshot là evidence, không nguồn thứ hai để chỉnh song song. Khi clone không có sibling/caches; chỉ khôi phục theo manifest vào đích CREATE-only trong quyền hiện hành, rồi cài đúng lock nếu được phép.

## Chín vector và phạm vi đã kiểm

| Vector | Đã chạy | Giới hạn |
|---|---|---|
| S01 phản hồi cũ sau logout | Unit actor/generation/epoch; browser chuyển actor rồi thả callback | Phiên/actor giả; không kiểm xác thực C++ |
| S02 version lớn | Unit có hai version liên tiếp vượt2^53, chuỗi giữ nguyên | Không chứng nhận wire serialization backend |
| S03 scope workshop | Unit giữ W1/W2 độc lập | Không dữ liệu thật |
| S04 public/private | Unit và SSR/browser độc lập version, public không chứa private | Fake actor query, không auth production |
| S05 cancellation/rebook | Unit và UI giữ whole history mới khi snapshot cũ tới | Snapshot tổng hợp |
| S06 SSR isolation | Barrier hai thứ tự, no-store, HTML không lẫn sentinel; một lượt reverse trên process mới; HTML khi tắt JS | Server local, không proxy/cache/CDN thật |
| S07 admin UNKNOWN | Unit và browser reload chỉ ghi một POST rồi GET, chỉ FINAL khi đối chiếu giả kết thúc | Fake transport ghi call log, không mạng mutation/transaction thật |
| S08 render literal | SSR escape, DOM/hydration không tạo img/handler | Không thay validator dữ liệu backend |
| S09 lifecycle | Unit unmount, browser model và Svelte component onDestroy thật; callback vẫn tới bị từ chối | Không thay native Android/iOS lifecycle |

Mutation: bỏ guard context, ép version qua Number, dùng một scope global, bỏ kiểm version lịch sử, POST lại admin, bỏ unmount guard, shared mutable SSR, raw HTML. Unit mutation dùng bản sao riêng `.cache/mutations`; SSR/HTML thay tạm đúng file mẫu do lượt này tạo, `finally` khôi phục nguyên byte; final build/test chạy trên nguồn đúng. Kết quả âm là assertion failures, không nhận lỗi import/tool startup làm bằng chứng phát hiện bug.

## Những lỗi đã gặp và cách sửa

Giữ nguyên các log: biến `state` gây xung đột rune `$state` → đổi tên biến; ESLint chưa khai báo browser global sessionStorage → khai báo đúng scope Svelte; type SSR sinh cũ khi thêm trường → chạy lại sync; each block thiếu key → thêm audience key. Không tắt warning, hạ strictness, skip test hoặc đổi expected để đạt. [Chuỗi cuối trước khi sửa key](web-execution-r1/final-pipeline.json) vẫn giữ exit1, chuỗi mới có tên riêng.

Build còn cảnh báo empty env chunk; Playwright có cảnh báo NO_COLOR/FORCE_COLOR. Chúng không bị xóa khỏi raw log, không là lỗi assertion/type/lint. Lượt đầu9browserca và các lượt mutation không thay bộ cuối11ca.

## Cookie và browser

Cookie0.7.2 qua unit serialize/parse/expiration/validation name/path/domain, và endpoint SvelteKit HTTP create/read/actor replacement/delete; headers HttpOnly/Secure/SameSite/path được đối chiếu. **Đây là bằng chứng tương thích của mẫu**, chưa là xác minh bảo mật toàn ứng dụng hoặc nghiệm thu cookie/session qua HTTPS/backend. Override vẫn cần đối chiếu các đường production khi triển khai; không đưa thành chuẩn chung từ một mẫu.

Browser: Chromium headless-shell153.0.8010.12/revision1243 Intel, ffmpeg1011 đi kèm, chỉ trong `.cache/browsers` của mẫu. HEAD nguồn chính thức: archive104,060,463byte và1,353,430byte; [metadata](web-execution-r1/browser-download-metadata.json), raw installer giữ URL/version. Hash binary trong manifest được đo sau tải, **không phải checksum SHA256 do vendor công bố**. Không tải Chromium bản người dùng hoặc thay browser cá nhân. Không sudo, --with-deps hoặc bỏ kiểm chứng TLS. Cây mẫu/caches/build khoảng365MiB tại kiểm cuối, dưới ngân sách8GiB.

Server chỉ bind127.0.0.1:4173, reuseExistingServer=false, process do lượt chạy sở hữu đã dừng; kiểm cổng đóng. Không deploy/publish, Docker, cloud, SDK, Xcode, tài khoản hoặc dữ liệu thật.

## Bảo toàn và điểm tiếp tục

354file evidence lịch sử và36file core khớp HEAD/nguồn core đã kiểm;21file hồ sơ pilot nguyên byte. Không rerun core vì runtime Kidea không đổi. Sibling giờ có thêm samples được phép; các checker lịch sử giả định toàn cây chỉ21file không được gọi để nhận toàn bộ suite xanh, không sửa test inventory cũ để che thay đổi. Lượt này tự đối chiếu hash chính xác21hồ sơ và allowlist20file nguồn mẫu. Lỗi R03 19/20 lịch sử không bị xóa.

R05-T03-S03 có bằng chứng cho lát cắt Web này, vẫn **IN_PROGRESS** trước khi đủ phạm vi profile và review. WEB-04/08 HTTPS/CSRF/proxy/body limit/server drain và integration C++ chưa được chứng minh; performance, restore, Android/iOS, Safari/Firefox và Apple Silicon chưa chạy. Nội dung profile r1 đã duyệt vẫn giữ nguyên; không tích hợp skill hoặc khép R05 từ kết quả này. Docker tiếp tục chờ Human báo khi ngồi máy.
