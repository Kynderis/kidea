# R05 — Dependency và lệnh kiểm Web r1

Ngày 2026-09-16. Đã thực hiện phần chuẩn bị Human giao sau cfa0c4e. Docker vẫn hoãn. **Chỉ resolve metadata/lock và audit, không cài node_modules, không tải browser, không build hoặc chạy app/server.** Hai lock dưới đây là artifact thử lựa chọn, không lockfile sản phẩm đã nghiệm thu. [Mẫu chín vector](r05-web-samples-r1.md).

## Manifest cụ thể

Giữ sáu package nền: Kit2.70.3, Svelte5.57.0, TS6.0.3, Vite8.2.2, plugin-svelte7.3.0, adapter-node5.5.7. Thêm công cụ kiểm có version chính xác từ registry: svelte-check4.7.6, ESLint10.10.0, @eslint/js10.0.1, eslint-plugin-svelte3.23.0, typescript-eslint8.70.0, @playwright/test1.63.0, @types/node22.20.3. Types Node22 chỉ phục vụ bề mặt API mẫu tương thích22; không dùng để khai báo Kidea hỗ trợ22 hoặc chứng nhận API riêng24. Dùng node:test sẵn có cho unit, không thêm Vitest.

[Metadata trực tiếp](../tests/evidence/r05/web-dependencies-r1/direct-metadata.json) ghi peer/engines/license/integrity. Các công cụ mới được chọn tương thích peer ranges của sáu phiên bản nền; việc có version mới nhất chỉ giúp tìm ứng viên, không tự là lý do chứng nhận sử dụng.

[Baseline package](../tests/evidence/r05/web-dependencies-r1/baseline-package.json) và [baseline lock](../tests/evidence/r05/web-dependencies-r1/baseline-package-lock.json) resolve237package, mọi entry có integrity và URL registry.npmjs.org. Kiểm engines trên metadata không có entry từ chối Node24.19.0 đang có. Resolver dùng Node24.19/npm12.0.2 của máy, không giả là npm11.19 của baseline sản phẩm. Lượt build sau phải ghi npm thực và xác minh npm ci không đổi lock.

Chạy `npm install --package-lock-only --ignore-scripts --audit=false --fund=false` trong `.test-output/r05/web-dependencies-r1` với registry và cache chỉ định. Đây chỉ tạo lock từ metadata, không cài dependency; không sửa package/lock ở root Kidea. Raw stdout/stderr được giữ. Lần resolve đầu shell không lưu riêng exit npm; tính hợp lệ lock và các kiểm tiếp theo được ghi riêng, không bịa exit code của lần đó.

## Cảnh báo được giữ và ứng viên sửa

[Audit baseline](../tests/evidence/r05/web-dependencies-r1/audit.stdout.json) exit1: ba mục low là cookie và hai package bị ảnh hưởng theo chuỗi Kit/adapter; không phải ba lỗ hổng độc lập. Không high/critical theo dữ liệu audit tại lượt đọc; không phải audit bảo mật toàn source.

[Advisory GHSA-pxg6-pf52-xh8x](https://github.com/advisories/GHSA-pxg6-pf52-xh8x) nêu cookie<0.7.0 kiểm name/path/domain chưa đủ. Kit baseline yêu cầu ^0.6.0. Không chạy npm audit fix; gợi ý hạ major tự động trong output không được áp.

[Candidate package](../tests/evidence/r05/web-dependencies-r1/candidate-package.json) và [candidate lock](../tests/evidence/r05/web-dependencies-r1/candidate-package-lock.json) chỉ thêm override scoped `@sveltejs/kit → cookie0.7.2`; không đổi sáu version nền. Override vượt range Kit khai báo, vì vậy **chỉ là ứng viên**, chưa được áp vào pilot. [Audit candidate](../tests/evidence/r05/web-dependencies-r1/candidate-audit.json) ghi kết quả riêng; sạch audit không chứng minh tương thích runtime.

Trước nhận candidate: kiểm create/read/delete cookie phiên; HttpOnly/Secure/SameSite và path/domain hợp lệ; name/path/domain đối kháng phải bị từ chối; cookie cũ không bị đọc sang actor mới. Dùng giả lập ở unit rồi kiểm header HTTP thực trong SSR/HTTPS integration. Nếu không đạt thì quay chọn tổ hợp được upstream hỗ trợ, không nới assertion hoặc chấp nhận baseline có cảnh báo chỉ để build.

Lock có install script ở fsevents2.3.3 (optional/macOS). Mẫu chạy one-shot không cần file watcher; cài sau này giữ `--ignore-scripts`, không mở toàn bộ lifecycle scripts. Nếu tool thực sự cần script/native binding thì đọc script đúng bản và báo phạm vi trước, không tự npm rebuild. Không bỏ tất cả optional dependencies: Vite/Rolldown có thể cần binary đúng darwin-x64.

License metadata gồm MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, BlueOak-1.0.0, MPL-2.0; cần giữ notice/license tương ứng khi có artifact phân phối. Chưa tuyên bố rà đầy đủ nội dung license từng tarball. [Kiểm lock](../tests/evidence/r05/web-dependencies-r1/lock-review.json).

## Bộ lệnh đã xác định, chưa thực thi

[Command manifest](../tests/r05/fixtures/web-command-plan-r1.json) ghi argv, thứ tự, input còn thiếu, timeout và kết quả phải đạt. Đây là kế hoạch gọi executable trong dependency đã cài đúng lock; không dùng npx để tự tải latest. Chưa có app/config/test implementation nên không coi manifest là script chạy được ngay.

| Thứ tự | Lệnh trong thư mục mẫu sau khi được phép | Điều kiện đạt |
|---|---|---|
| 1 | npm ci --ignore-scripts --audit=false --fund=false | Đúng candidate được chọn, lock trước/sau không đổi; không script ngoài scope |
| 2 | svelte-kit sync; svelte-check --tsconfig ./tsconfig.json --fail-on-warnings | TypeScript strict, không bỏ kiểm a11y/JS/CSS để đạt |
| 3 | eslint . --max-warnings 0 | Flat config JS/TS/Svelte, bỏ generated/cache rõ ràng; không bỏ source/test mẫu |
| 4 | node --test tests/unit/*.test.mjs | Test chọn đủ vector tương ứng; thuận đạt, mutation âm bị bắt; không skip/todo |
| 5 | vite build | Build adapter-node production; artifact/source/config/hash được lưu |
| 6 | playwright test --project=chromium --workers=1 --retries=0 --forbid-only | Khởi động bundle production trên loopback, kiểm SSR/browser; không reuse server lạ hoặc retry che lỗi |

Các entry sync/check là hai tiến trình nối tiếp, không chạy bước sau khi bước trước lỗi. Wrapper tương lai phải truyền executable tuyệt đối và môi trường rõ ràng; timeout ngắt cả cây process do lượt chạy tạo, lưu stderr/exit và không làm mất log lỗi. Không thêm chuẩn PASS bằng “exit0” khi thiếu test hoặc chưa kiểm mutation âm.

## Browser và giới hạn máy

[Playwright1.63 browser manifest](../tests/evidence/r05/web-dependencies-r1/browsers.json) chọn Chromium/headless-shell revision1243, browser153.0.8010.12. [Nguồn tag cố định](https://raw.githubusercontent.com/microsoft/playwright/v1.63.0/packages/playwright-core/browsers.json). [Yêu cầu Playwright](https://playwright.dev/docs/intro#system-requirements) có macOS14 trở lên; chưa thử binary x64 thực. Chỉ Chromium cho lát cắt đầu, không chứng nhận Safari/Firefox/native iOS. Browser archive/checksum/size tải thực chưa được xác minh; không gọi INSTALL_READY.

Kế hoạch dùng `PLAYWRIGHT_BROWSERS_PATH` trong thư mục mẫu, cài Chromium headless-shell theo pinned Playwright bằng `install chromium --only-shell` khi có quyền; không --with-deps, không sửa công cụ hệ thống. Nếu cần ffmpeg đi kèm phải ghi đúng revision/download trong manifest cài, không coi browser.json là danh sách archive đã tải.

Nguồn lệnh: [Svelte check](https://svelte.dev/docs/cli/sv-check), [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files), [Playwright CLI](https://playwright.dev/docs/test-cli), [adapter-node](https://svelte.dev/docs/kit/adapter-node). Mẫu fake transport dùng loopback HTTP chỉ kiểm state/render; cookie Secure/CSRF/proxy vẫn cần lượt HTTPS/backend và không được nhận đạt bằng mock.

## Điểm tiếp tục

Đã hoàn thành lựa chọn dependency, hai lock có thể review, audit và thiết kế lệnh. Chưa tạo/chạy ứng dụng. Việc kế tiếp là hiện thực source/config/test mẫu theo chín vector và chứng minh tương thích override, trong gói tải/chạy được duyệt; hoàn thiện metadata browser trước xin tải. Không yêu cầu Human cài Docker cho việc đó, không cài Node mới để chuẩn bị. R05 chưa hoàn tất; chín ca ứng dụng vẫn NOT_RUN.
