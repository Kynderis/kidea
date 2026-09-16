# R05 — Gói quy tắc viết code và cách kiểm thử

Ngày 2026-09-16. **D1–D6/P1–P4 APPROVED cho lượt soạn và kiểm hồ sơ.** Human “Tôi duyệt nhé” sau [answer cfffe0c](https://github.com/Kynderis/kidea/blob/cfffe0c/answer.md) duyệt bước tiếp tục trên Mac: chuyển đích sang checkout local hiện hành, khôi phục đúng pilot nếu thiếu, soạn/kiểm trọn gói dưới đây. Approval này không duyệt trước nội dung chưa soạn, cài/build/code/deploy hoặc phiên AI mới. R04 đã được nghiệm thu tại `a72e3a10775a9ca5b47bc5f1a6d2ccdc975d36ee`.

**Điều chỉnh nền đã được duyệt riêng sau answer f8b47b9:** [LP-01](local-portability-r1.md) cho sửa Kidea chạy local cùng workflow trên Windows/macOS Intel/Apple Silicon, Node ≥24 không khóa binary, Git theo host; backend Docker local, test nặng/performance trên cloud chỉ khi Human cấp máy/quyền. Thư mục mạng/iCloud/OneDrive/nhiều máy cùng ghi ngoài phạm vi, không làm sau. Đây là gói sửa nền hiện hành, **không phải approval toàn D1–D6/P1–P4 hoặc quyền soạn sáu hồ sơ pilot dưới đây**. Các giới hạn runtime/skill của P3 chỉ áp dụng gói R05 này, không phủ định quyền sửa đã cấp ở LP-01.

## Mục đích

Kidea cần hướng dẫn người viết code tuân thủ thiết kế và biết kiểm đúng/sai. “Profile” ở đây chỉ là bộ quy tắc cho một nền tảng, không phải tài khoản hay một phần mềm phải cài. Workshop vẫn là bài mẫu để thử Kidea, không phải dự án kinh doanh mới.

Căn cứ: [R05](../KIDEA_ROADMAP.md#r05), [thiết kế đã duyệt](../KIDEA_DESIGN.md), [KA-23/24/28/30](../KIDEA_ACCEPTANCE.md), [kết quả R04 và giới hạn](../tests/evidence/r04/design-r1.md), [hợp đồng local](../KIDEA_DESIGN.md#local-portability-approved) và [Docker local/cloud](../KIDEA_DESIGN.md#docker-local-cloud). Giữ nghiệp vụ/ngưỡng/an toàn R03–R04; chỉ phương án host/build được điều chỉnh ở LP-01, không mở lại nền tảng native hoặc rule nghiệp vụ.

## Chốt một lần cho lượt soạn và kiểm hồ sơ

| Mã | Đề xuất cụ thể | Ví dụ / hệ quả |
|---|---|---|
| D1 | Một hợp đồng chung và bốn bộ rule riêng cho C++20/Ubuntu, SvelteKit/TypeScript, Kotlin/Compose, Swift/SwiftUI. Mỗi rule có mã, lý do, phạm vi, ví dụ đúng/sai, cách kiểm và ngoại lệ cần duyệt. | Không biến “code sạch” thành lời khuyên chung chung; mỗi lỗi phải biết kiểm bằng gì. Không đổi nền tảng đã chốt. |
| D2 | Bộ nền cố định theo revision; project giữ bộ rule hiệu lực trong tài liệu của chính nó, ưu tiên quy ước sẵn có nhưng phải trình xung đột với tiêu chí bắt buộc. Lệnh/config chỉ tham chiếu nguồn thực thi, không chép thành kho thứ hai trong `.kidea`. | Project đã có lệnh test thì dùng lại, không tạo thêm một lệnh khác chỉ cho Kidea. Đổi phiên bản phải rà lại kết quả liên quan. |
| D3 | C++ kiểm tài nguyên/đồng thời/transaction và lỗi; web kiểm kiểu dữ liệu, HTML/SEO công khai, state và quyền riêng tư; native kiểm vòng đời, hủy tác vụ, trạng thái mạng, version/build number. | Đăng xuất phải bỏ phản hồi cũ đang bay về; không để lịch sử người trước hiện ở tài khoản mới. C++ không mặc định tối ưu riêng CPU máy build. |
| D4 | Mỗi ca test ghi nguồn yêu cầu, setup, dữ liệu vào, thao tác, kết quả cần kiểm, môi trường và nơi giữ bằng chứng. Tách kiểm tài liệu, mẫu nhỏ và ứng dụng thật. | Hai người tranh ghế cuối: chỉ một người thành công, số chỗ không âm. Mất phản hồi: hiện “chưa rõ”, không tự tạo đăng ký mới. Chưa có app thì ca này là NOT_RUN. |
| D5 | Tra tài liệu chính thức để đề xuất tổ hợp phiên bản và lệnh kiểm; ghi nguồn/ngày/giới hạn tương thích, giấy phép và cảnh báo bảo mật liên quan. Backend dùng Docker local Ubuntu userspace; cloud chỉ sau cấp host/quyền. Node sản phẩm độc lập với minimum Node ≥24 của Kidea. | Windows/Mac có Node không chứng minh Docker backend hoặc Xcode đã build được. Local ưu tiên amd64/arm64 theo máy, release/performance đúng kiến trúc đích; chưa biết máy thì chờ xác minh. |
| D6 | Sau khi soạn, kiểm cả bốn bộ rule và test specs trong một lượt, trình chung kết quả cùng gói môi trường/build nếu đã đủ dữ kiện. Không bỏ iOS hoặc hạ tiêu chí vì thiếu máy. | Hoàn tất hồ sơ không đồng nghĩa hoàn tất R05: mẫu build bắt buộc vẫn chờ môi trường/quyền; không đưa mọi phần thiếu sang R09 để đóng phase. |

## Quyền đề nghị cho gói này

- **P1 — Ghi hồ sơ:** chỉ các file repo/pilot liệt kê dưới đây; đọc nguồn thiết kế và tài liệu chính thức qua mạng. Không sửa nghiệp vụ, kiến trúc hoặc ngưỡng đã chốt. Nếu phát hiện mâu thuẫn, gom phần cần đổi trình Human.
- **P2 — Kiểm nhẹ:** dùng Node/Python đã có để kiểm cấu trúc, link, truy nguồn, ví dụ đúng/sai và hồi quy liên quan; fixture/bằng chứng mới chỉ trong vùng R05 dưới đây. Không chạy lệnh từ tài liệu bên ngoài, không tải dependency, không build hoặc chạy app. Giữ raw lỗi, không sửa test cũ để che lỗi inventory R03.
- **P3 — Chưa tích hợp skill:** soạn bản đề xuất trong repo trước; chỉ tích hợp hướng dẫn vào skill sau duyệt đúng nội dung. Không đổi helper/schema/public actions, không khởi tạo `.kidea` cho repo này. Không mở agent mới.
- **P4 — Không đụng môi trường:** không VM/WSL/SDK/cài đặt, đổi PATH/firewall/ACL, chạy nền, dữ liệu thật, tài khoản/secret, dịch vụ trả phí hoặc deploy. Chưa cần Human chuẩn bị máy. Khi đến build, phải có gói riêng chỉ rõ máy, quyền, dung lượng/đích local thực trên host, download/cache, lệnh, thời hạn và cách dừng; không tự dọn ổ hoặc cache. C/D trong bản Windows là vị trí lịch sử, không áp cho Mac.

P4 theo phương án hiện hành: chỉ đề nghị Docker Desktop/cấu hình tài nguyên nếu máy chưa có và khi đến lượt build; Docker vẫn dùng lớp Linux/RAM/đĩa, không thêm Ubuntu VM tự quản lý. Cloud gộp host/SSH/Docker, image/kiến trúc, quyền/dữ liệu/giới hạn tải/chi phí/thời hạn và điều kiện dừng trong một lần chốt, không hỏi từng lệnh trong gói. Volume dữ liệu SQLite, backup/restore và observer độc lập phải được kiểm đúng nghĩa; container khác trên cùng laptop không thay nơi độc lập để chứng minh mất host. Chưa soạn/chạy Dockerfile, build hoặc SSH từ việc duyệt LP-01.

### Danh sách đích hữu hạn

Trong checkout Mac `/Users/kendrick/Desktop/kidea/`: `proposals/r05-profile-test-r1.md`, `proposals/r05-profile-method-r1.md`, `KIDEA_ROADMAP.md`, `KIDEA_DESIGN.md` (chỉ trạng thái/link), `answer.md`; test mới dưới `tests/r05/`, evidence mới dưới `tests/evidence/r05/`, fixture tạm dưới `.test-output/r05/`. Không sửa evidence lịch sử hoặc runtime. Commit/push repo theo quyền hiện hành, không commit/push pilot. Đường Windows cũ chỉ là vị trí lịch sử, không điều kiện của profile.

Trong sibling local `/Users/kendrick/Desktop/kidea-workshop-pilot/`: khôi phục CREATE-only đúng 15 file từ chuỗi bằng chứng được dẫn trong bàn giao, đối chiếu toàn bộ `allAfterHashes`; không ghi đè cây có sẵn. Sau đó tạo đúng sáu file `docs/engineering/rules.md`, `docs/engineering/cpp.md`, `docs/engineering/web.md`, `docs/engineering/android.md`, `docs/engineering/ios.md`, `docs/engineering/tests.md`. Chỉ thêm backlink từ `docs/design/architecture.md` và `docs/business/tests.md`, giữ nguyên byte nội dung đã duyệt và snapshot trước/sau. Sáu file đều là hồ sơ đề xuất, không source/config/script ứng dụng. Quyền này thuộc approval R05 mới, không suy từ quyền R04; không tạo Git repo tại pilot.

## Phân rã và điều kiện đi tiếp

| Subtask | Đầu ra / kiểm | Trạng thái |
|---|---|---|
| R05-T01-S01 | Khép R04 đúng commit; rà căn cứ, gom lựa chọn/quyền và kế hoạch tại đây | DONE [A], chỉ chuẩn bị |
| R05-T01-S02 | Human duyệt D1–D6/P1–P4 cùng danh sách đích Mac | DONE [H], sau cfffe0c |
| R05-T01-S03 | Hợp đồng chung và phương pháp đề xuất; kiểm rule revision, xung đột, thiếu nguồn, ngoại lệ hạ gate | DONE [A], bản r1 chờ duyệt nội dung |
| R05-T02-S01 / T03-S01 / T04-S01 / T05-S01 | Soạn từng profile và ví dụ, giữ task riêng; xác định toolchain/cách kiểm/môi trường còn thiếu | DONE [A] từng bản r1, chưa build |
| R05-T06-S01 | Test specs truy từ R03/R04, gồm C1–C5, tải/lỗi/bảo mật/restore và release cũ–mới/thành công một phần | DONE [A], 20 nhóm nối 137 ca nguồn, runtime NOT_RUN |
| R05-T07-S01 | Kiểm hồ sơ/link/bảo toàn; báo riêng lỗi cũ, ca chưa chạy; trình chung nội dung và nhu cầu môi trường đã rõ | DONE [A] phạm vi báo cáo: R05 11/11; R03 cũ 8/9 do inventory engineering; không nhận mọi suite xanh |
| R05-T01-S04; T02–T06-S02 | Human duyệt nội dung đúng bản; gói môi trường/build phải đủ dữ kiện và được duyệt riêng | DONE [H] nội dung tại a39f79f; gói môi trường/build mới chưa được duyệt |
| R05-T02–T05-S03 | Build/mẫu đúng–sai trên nền tảng đích trong quyền được cấp; ghi thiếu máy/quyền là blocker của phần tương ứng | BLOCKED_ENV_PENDING, chưa có quyền chạy |
| R05-T07-S02 | Tích hợp phương pháp đã duyệt, kiểm mang sang môi trường sạch và hồi quy; Human nghiệm thu R05 đúng bằng chứng | TODO, không dùng docs-only thay build |

Một subtask triển khai hiện hành; các ID rút gọn T02–T06 là các subtask riêng thuộc từng task R05 tương ứng, không gom mất quyền nghiệm thu. Không xin thêm lượt để chỉ “chuẩn bị đề xuất”.

## Kiểm chứng dự kiến trong P2

Kiểm tập file đúng allowlist; byte cũ chỉ đổi backlink được phép; tất cả link/anchor; rule có nguồn/revision/đúng–sai/cách kiểm; case có assertion và môi trường; tham chiếu một nguồn lệnh/config; thiếu môi trường không PASS; tùy chỉnh không miễn gate; câu chữ không nhận test hồ sơ là runtime. Giữ các ca quyền/epoch/version, transaction/result/audit/outbox, lifecycle và admission từ R04. Cố định input hash, lưu stdout/stderr/kết quả từng lần, không ghi đè lỗi.

Đã thực hiện lượt soạn/kiểm theo approval sau cfffe0c. [Kết quả và snapshot đúng bản](../tests/evidence/r05/profile-r1.md), [phương pháp đề xuất](r05-profile-method-r1.md). Chỉ hồ sơ và kiểm nhẹ; chưa tích hợp skill, tạo app/config, build hoặc cài công cụ. T07-S01 DONE là đã hoàn tất lượt kiểm và báo đúng cả FAIL/NOT_RUN, không là nghiệm thu phase hoặc mọi test đều PASS.

Human đã duyệt nội dung R05 r1 sau a39f79f và giao chuẩn bị [gói môi trường/build](r05-environment-build-r1.md). Sự kiện mới này không đổi kết quả test r1, không cấp quyền E1/E2 hoặc tích hợp skill.

R05-T03-S03 hiện IN_PROGRESS: [mẫu Web Mac Intel đã chạy](../tests/evidence/r05/web-execution-r1.md) theo approval sau ced8b31; không suy quyền Web thành cài Docker/SDK hoặc nghiệm thu toàn bốn profile. T02/T04/T05-S03 vẫn chờ môi trường/quyền tương ứng.

Tiếp nối sau5611c77: [Web r2](../tests/evidence/r05/web-execution-r2.md) đã hoàn tất ba phần độc lập Docker do Human giao;32unit/18browser/4serverPASS. T03-S03 vẫn IN_PROGRESS đúng giới hạn, chưa kiểm HTTPS/CSRF/backend.
