# Rà soát phạm vi Kidea: Web trước, native để tương lai

Ngày 2026-09-17. Đọc repo `Kynderis/kidea`, `master`, nguồn đầu lượt `4ded6e9fb1765d0f943be7c1ee421561cd659a59`, working tree sạch. Đã rà thiết kế/roadmap/KA/KQ, skill/helper/test và21hồ sơ pilot local. Không build/test ứng dụng, cài công cụ hoặc mở workload. Quyết định phạm vi có hiệu lực tại [DESIGN](../KIDEA_DESIGN.md#client-web-scope-approved); tài liệu này là **báo cáo ảnh hưởng**, không là roadmap native mới.

## Kết luận và ranh giới

Human đã quyết định: client hiện hành chỉ Web; hỗ trợ phát triển app Android/iOS là **Future, chưa roadmap/thời hạn**. Đây là thay đổi scope cấp Kidea, không phải thiếu máy nên bỏ test. Không cần duyệt lại quyết định đó. R05 không còn bị chặn bởi Xcode, Apple login, điện thoại, emulator hoặc test native; R05 vẫn cần khép đầy đủ phạm vi backend/Web và Human nghiệm thu.

Giữ backend C++20/Ubuntu qua Docker local, Web SvelteKit/TypeScript và SEO/SSR/realtime. Giữ sáu hành động, mười bước sản phẩm, ba bản đồ, nghiệp vụ, an toàn, G1–G6, toàn-project verification, release/restore/ops và quyền hiện hành. Không suy Web-only thành chỉ trang tĩnh, bỏ backend, bỏ admin/monitoring hoặc giảm độ tin cậy.

Host Windows/macOS Intel/Apple Silicon là máy chạy **Kidea**, độc lập nền tảng ứng dụng được tạo. LP-01 giữ nguyên; Apple Silicon chưa kiểm vẫn NOT_RUN. Chỉ thư mục local, Node≥24, một writer và cloud theo quyền giữ nguyên. Từ “native” trong Win32 writer lịch sử, `realpathSync.native`, CPU native amd64 hoặc Web chạy trực tiếp host không có nghĩa app Android/iOS; không sửa bằng tìm-thay hàng loạt.

## Responsive: Kidea cần can thiệp đến mức nào

Web có thể phục vụ điện thoại qua trình duyệt. Từng project chọn màn hình/hành trình cần hỗ trợ, nội dung ưu tiên, cách bố trí, breakpoint/viewport, trình duyệt, cảm ứng/bàn phím, accessibility và tiêu chí nghiệm thu. Kidea chỉ nhắc khi thiếu quyết định có ảnh hưởng, nối yêu cầu → thiết kế → test và kiểm đủ bằng chứng; không áp số breakpoint, minOS, bộ màn hình native, gesture hoặc một layout dùng chung.

Quyết định này không xóa các yêu cầu responsive đã duyệt của pilot. Pilot hiện có360/1280CSSpx và chữ200% tại `docs/design/experience.md`; [Web r2](../tests/evidence/r05/web-execution-r2.md) đã kiểm mẫu màn hẹp/rộng/font lớn. Giữ evidence đúng nguồn/phạm vi; không gọi đó là đạt mọi browser, thiết bị hoặc accessibility. Safari trên iPhone/Chrome trên Android vẫn có thể thuộc ma trận **Web của project**, không đồng nghĩa cần phát triển hai app native hoặc cài Xcode. Ma trận cụ thể không bị Kidea áp mặc định cho mọi ứng dụng.

Giao diện HTML tiến độ offline của chính Kidea ở R07 vẫn cần màn hẹp/rộng, bàn phím và dữ liệu đúng; đây là sản phẩm khác với UI của pilot, không tự bỏ kiểm R07.

## 1. Thiết kế, tiêu chí và hướng dẫn chuẩn

| Nơi ảnh hưởng | Điều chỉnh cần làm chi tiết |
|---|---|
| [KIDEA_DESIGN](../KIDEA_DESIGN.md#first-release-scope), mục1.1/1.1a | Client hiện hành Web; native Future. Release vẫn đa thành phần backend/Web/schema/config, cũ–mới và lỗi một phần. Phân biệt Human đổi scope Kidea với N/A một project; không dùng câu “không bỏ năng lực bản đầu” để chống quyết định mới. |
| [Ma trận nền tảng](../KIDEA_DESIGN.md#platform-matrix) | Đưa hàng Android/iOS/toolchain/thiết bị/signing/store ra phần lịch sử/Future, giữ host Kidea và hàng Web/backend. Không tiếp tục yêu cầu Apple login/cài Xcode. Khi mở lại mới rà baseline/toolchain/quyền theo thời điểm đó. |
| [Pilot và kiến trúc](../KIDEA_DESIGN.md#pilot-scope), mục Git/build, cây project | Bỏ native khỏi mặc định MVP/cây thư mục `android/ios`/đường triển khai hiện hành; dependency tới SSR/realtime/Web/monitoring vẫn đủ. Không đổi ownership dữ liệu backend hoặc rule chung. |
| [Coding rules](../KIDEA_DESIGN.md#code-rules), version/build | Profile hiện hành C++/Web, rule chung giữ; quy tắc build-number riêng native thành Future. Giữ source/artifact/config/version identity chung. |
| [KIDEA_ACCEPTANCE](../KIDEA_ACCEPTANCE.md) | Giữ30họ KA. KA-23 bỏ yêu cầu iOS khỏi expected hiện hành; KA-28 hoãn riêng biến thể native build number. KA-04/29/30 kết luận theo ma trận mới; không bỏ gate bằng chứng/tích hợp/restore/host. |
| [KIDEA_QUALITY](../KIDEA_QUALITY.md) | Giữ10KQ/ngưỡng và nguyên tắc. Mẫu số “ca bắt buộc” theo scope mới; Future không là PASS, không biến FAIL/NOT_RUN cũ thành N/A hoặc xóa chúng. |
| [SKILL](../.agents/skills/kidea/SKILL.md), [product-design](../.agents/skills/kidea/references/product-design.md) | Nêu giới hạn client Web; thay mặc định web/native, consumer native và required native tests bằng nền tảng/browser thuộc scope project. Hướng dẫn responsive theo project; không sinh/thúc profile native. Giữ lifecycle/state/network/reflow của Web và phân biệt host CPU. |

Các phần chuẩn đã có amendment phạm vi để quyết định mới áp dụng ngay; việc chỉnh từng đoạn/cây/ví dụ và skill là công việc đồng bộ còn lại, chưa được báo hoàn tất trong lượt rà soát này.

## 2. Roadmap và các gate

| Phase | Ảnh hưởng |
|---|---|
| R01–R04 | Giữ kết quả/approval lịch sử đúng nguồn. Thêm amendment cho phạm vi và hồ sơ pilot bị ảnh hưởng, không mở lại toàn bộ nghiệp vụ hoặc nhận approval cũ tự áp cho mọi bản mới. |
| R05 | T04 Android/T05 iOS ra khỏi hiện hành. Còn T01 hợp đồng chung, T02 C++, T03 Web, T06 test specification, T07 tích hợp/khép rule. Native build, UI, TalkBack, iOS installation và N01…N08 native không là gate hiện tại. |
| R06 | T04 mapping Android/T05 mapping iOS ra khỏi hiện hành. Giữ mapping docs/code/test, C++/Web, no-diff/event/shared-data/config/change/resume; không xóa bài toán consumer ảnh hưởng chỉ vì bỏ native. |
| R07 | Không thu hẹp chức năng view/ma trận/thao tác/màn hẹp-rộng. |
| R08 | Plan/build/release/ops hiện hành dùng backend/Web. Giữ đa thành phần/version/rollback khác restore/cũ–mới/Human PROD, không cần app store/native signing. |
| R09 | T06 Android pilot/T07 iOS pilot ra khỏi hiện hành. Giữ các lát cắt backend/Web, event/admin, Feature giữa MVP/sau release, hotfix, ngắt phiên, Git, release lab/restore. |
| R10 | Ma trận nghiệm thu/công bố scope hiện hành là backend/Web trên host đã chứng minh. Native không là mục bắt buộc thiếu môi trường; host Apple Silicon vẫn xét riêng. Không tự DONE hoặc mở quyền publish. |

Roadmap giữ83ID để truy lịch sử;77task còn trong phạm vi hiện hành,6ID native ghi **Future — chưa roadmap**. Không đổi số ID, không đánh dấu DONE, không chuyển sang R11 hay một mốc thời gian giả định. Chữ Future trong tài liệu này là phân loại phạm vi, không thêm enum trạng thái vào schema helper.

## 3. Pilot21file và test source

Pilot là sibling local `/Users/kendrick/Desktop/kidea-workshop-pilot/`, không tự có khi clone repo. **Lượt này chưa sửa live pilot**. Các file sau cần amendment mới, snapshot before/after và nguồn quyết định; bản lưu R03/R04/R05 cũ không bị ghi đè.

| File dưới `docs/` pilot | Ảnh hưởng thực |
|---|---|
| `features.md` | Native đang thuộc MVP và có câu “Không thay native bằng web”; chuyển hai client native Future, giữ bốn feature nghiệp vụ. |
| `business/features/view.md`, `register-cancel.md` | Phạm vi Web/native và dependency phía client; giữ hợp đồng dữ liệu/quyền/đăng ký/hủy. |
| `business/tests.md` | T04 có Web và native; hoãn riêng biến thể Android/iOS, giữ Web/assertion. |
| `design/quality.md` | Thu hẹp platform/workload/gate native; giữ ngưỡng Web/backend, hiệu năng/cloud còn chưa chạy vẫn chưa chạy. |
| `design/experience.md` | N1/N2/wireframe/navigation native Future; giữ W1–W6, hành trình chung, responsive360/1280/chữ200% của pilot. |
| `design/architecture.md` | Sơ đồ client, native auth/secure-storage, API consumer, build/release; giữ cookie/CSRF/TLS/SSR/realtime Web và authority C++. |
| `engineering/rules.md` | Hai profile áp dụng hiện hành, hai Future; rule/gate có revision/scope mới. |
| `engineering/android.md`, `ios.md` | Giữ nội dung để truy lịch sử, đánh dấu Future; không tiếp tục minSDK/toolchain/device runtime hoặc Apple installer. |
| `engineering/tests.md` | B/W/L/D còn hiệu lực theo case; biến thể A/I hoãn; TC-17 build current2profile, TC-18 giữ sanitizer C++, TC-19/20 giữ Web UI/lifecycle/a11y. |
| `design/admin.md`, `operations.md` | Sửa diễn đạt nhắc native, không đổi nghĩa vụ quản trị/vận hành. |

Tổng11file ảnh hưởng trực tiếp và2file cần chỉnh diễn đạt. Tám file còn lại không cần đổi nghĩa: `business/INDEX.md`, ba `business/shared/{workshop,registration,availability}.md`, hai `business/features/{admin,updates}.md`, `engineering/{cpp,web}.md`. Vẫn phải đối chiếu toàn bộ link/trace khi tạo amendment; “không đổi nghĩa” không miễn kiểm liên kết.

**Không trừ cơ học inventory:**

- 40 rule lịch sử gồm 24 COMMON/CPP/WEB và 16 AND/IOS. Phân loại 24 hiện hành/16 Future; không gọi 16 rule đã PASS hoặc xóa catalog.
- 137 source IDs gồm 54 nghiệp vụ + 83 thiết kế (QT16/UX15/OP15/AD15/AR22). Đây không phải 137 lần test độc lập theo platform. Chưa thấy source case nào đủ căn cứ xóa toàn bộ chỉ vì hoãn native; phải giữ nghĩa vụ chung/Web và tách variant.
- 20 nhóm TC giữ nghĩa và ID. 14 nhóm có A/I: TC-01/02/03/06/07/08/09/12/13/15/17/18/19/20; các phần B/W/L/D trong cùng nhóm vẫn cần kiểm. Không đổi 20 thành 6.
- Các hàng mixed dễ sót: T04, UX-T02/03/10/13, AR-T01/11 và QT13/14/workload theo platform. Lifecycle Web, logout/phiên, stale response, UNKNOWN, cache, uint64, HTTPS, revoke, token privacy, release và provenance đều vẫn có nghĩa; không loại cùng nhãn native.

## 4. Mã, test và bằng chứng

Helper/schema hiện không có enum Android/iOS hoặc hard dependency SDK/Xcode. [package.json](../package.json) chỉ dùng Node≥24/jsonc-parser và core suite; chưa cần migration schema, đổi CLI, dependency hoặc hai bộ Kidea. Các fixture giả iOS trong R02 kiểm hiệu lực approval/N/A là kiểm ngữ nghĩa chung; giữ nguyên. Shared budget guard có label Android và test tương ứng là bảo vệ tài nguyên/tương thích lịch sử; không bỏ guard.

[validate.mjs](../tests/r05/validate.mjs), [profile-docs.test.mjs](../tests/r05/profile-docs.test.mjs), [support.mjs](../tests/r05/support.mjs) gắn r1 bốn profile/40rule/137case/20nhóm và source byte-exact. Không sửa expected để bản mới “xanh”. Khi amendment pilot: giữ validator r1 trên snapshot r1 có thể tái dựng, tách validation scope mới chứng minh quyết định có thẩm quyền, đúng variant và bảo toàn mọi assertion còn áp dụng. `restore-pilot`, `collect`, `prepare-review` cũ không được rerun vào evidence lịch sử để tạo kết quả mới.

Giữ [backend r5](../tests/evidence/r05/backend-execution-r5.md), [Web r2](../tests/evidence/r05/web-execution-r2.md), A1, simulator bootstrap và12test evidence gate native đúng nguồn cũ. Phần gate N08 kiểm source/config/ABI/skip/oracle có thể dùng lại nguyên tắc chung cho backend/Web sau review;12syntheticPASS không thay integration hoặc tự khép R05.

Không cần chạy lại build/benchmark/AI/native chỉ để chứng minh một quyết định scope. Khi sửa source/harness hoặc đầu vào chi phối kết quả, chạy đúng regression; trước khép Feature/phase vẫn giữ G2 và Human gate. Việc sửa tài liệu không biến kết quả cũ thành kết quả trên commit mới.

## 5. Proposal, resume và tài nguyên trên máy

Các proposal native `r05-native-build/device`, `r05-android-sdk37`, `r05-simulator-lab`, `r05-android-runtime`, `r05-ios-lab-install` cần banner Future/stop rõ; giữ nội dung approval cũ là lịch sử, không còn giao thực thi. Proposal mixed `r05-profile-test/method`, `r05-environment-build` cần scope override, rồi sửa kế hoạch hợp đồng/test hiện hành theo amendment. R03/R04 proposal pilot giữ provenance, thêm link thay phạm vi khi amendment để không phục hồi nhầm native vào MVP.

[MAC_HANDOFF](MAC_HANDOFF.md), roadmap current và answer phải dừng hướng dẫn Android harness/Apple login. Khôi phục pilot sau này cần chuỗi baseline21file → amendmentWeb mới, không chỉ restore bản cũ rồi coi đó là scope hiện hành. Chưa tạo amendmentWeb thì báo rõ điểm đó.

SDK/AVD/cache, Docker volume A1, khóa lab và raw log ngoài Git hiện giữ nguyên. User hoãn phát triển không là lệnh xóa/uninstall/prune; không gỡ Docker hay đổi cấu hình máy. Không dùng quota/deadline cũ mở lượt mới. Có thể dọn khi Human yêu cầu riêng và đã liệt kê đích/dung lượng/cách khôi phục; không coi cleanup là điều kiện khép scope.

## 6. Việc đã làm và bước tiếp theo

**Đã làm trong lượt rà soát:** ghi quyết định có hiệu lực tại DESIGN/KA/KQ; chuyển6task native khỏi kế hoạch hiện hành và sửa điểm tiếp tục; đánh dấu proposal native/mixed ngừng áp phần native; cập nhật bàn giao/answer; lập báo cáo này. Không sửa raw evidence, helper/schema, skill workflow hoặc live pilot; chưa tuyên bố migration toàn bộ hồ sơ hoàn tất.

**Gói đồng bộ tiếp theo có thể làm theo quyết định đã chốt, không cần hỏi lại scope:**

1. Sửa các đoạn thiết kế/skill/ví dụ hiện hành và profile-method để backend/Web nhất quán; giữ đoạn lịch sử có nhãn rõ.
2. Tạo amendment21hồ sơ pilot với bảng source-ID/variant hiện hành/Future, snapshot/hash trước–sau và chuỗi phục hồi mới. Không thay nghiệp vụ/ngưỡng Web/backend không bị ảnh hưởng.
3. Bổ sung validation cho scope mới, kiểm link/anchor/trace/source preservation; giữ test/evidence lịch sử nguyên vẹn.
4. Review lại coverage backend/Web lab đã có so với R05 thu hẹp, liệt kê khoảng trống thật; tích hợp phương pháp, kiểm mang sang môi trường sạch và hồi quy đúng đầu vào. Trình Human nghiệm thu R05 khi đủ bằng chứng.

Không có câu hỏi bắt buộc hoặc cài đặt mới để hoàn tất assessment này. Chỉ trình Human nếu trong lúc đồng bộ phát hiện thay đổi nghiệp vụ/ngưỡng/thiết kế project ngoài quyết định đã có, hoặc khi đến gate nghiệm thu kết quả. Chưa ước lượng thời gian đóng R05 và chưa tự mở R06.

Kiểm lượt rà soát: `git diff --check` đạt; 630 liên kết/anchor nội bộ trong các hồ sơ thay đổi và báo cáo này hợp lệ tại lần kiểm trước khi ghi answer; roadmap đủ83ID với6Future;21hash pilot khớp amendmentSDK37 cũ. Helper/schema/skill/test và raw evidence không đổi. Có một lượt review chỉ đọc riêng đối chiếu amendment với báo cáo, không phát hiện mâu thuẫn scope mới. Đây là kiểm tài liệu/phạm vi, không là test ứng dụng hoặc nghiệm thu R05.
