# Kidea — Tư vấn luồng auto-merge, phiên bản và deploy có kiểm soát

Ngày đối chiếu: 2026-09-08. Trạng thái: **nghiên cứu và đề xuất, chưa áp dụng chính sách hoặc cấu hình**.

## 1. Kết luận

Đề xuất Kidea tự tích hợp Feature khi đủ điều kiện, còn Human chốt version và quyết định production là hợp lý. Khuyến nghị nền ban đầu: **GitHub Actions + kho image GHCR + Docker Compose trên Ubuntu có sẵn**; dùng giao diện Actions để chọn bản và môi trường. Chỉ thêm Coolify nếu cần màn hình vận hành tập trung; chưa dùng Argo CD/Kubernetes chỉ để có nút deploy.

Đây là khuyến nghị cho bối cảnh một Human + AI, làm tuần tự, backend C++20 và web SvelteKit; không phải đã chọn dependency hoặc cấp quyền cài đặt. Android/iOS vẫn cần đường build/sign/phân phối riêng.

Đã dùng Exa rà **65 kết quả tìm kiếm qua 3 hướng**: auto-merge/CI/quyền/build (30), nền tảng triển khai (20), rollback/dev-debug/mobile (15). Đây là số kết quả trước gộp trùng, không phải 65 nguồn độc lập hay 65 kết luận đã xác nhận. Các URL trùng/alias được gộp theo nội dung; chỉ tài liệu gốc của nhà cung cấp/dự án và hướng dẫn nguyên gốc được dùng để kết luận. Bài roundup và trang chỉ trả mục lục không làm bằng chứng tính năng.

## 2. Tách ba mốc

| Mốc | Ý nghĩa | Không được suy thành |
|---|---|---|
| Feature hoàn tất và đã tích hợp | Đủ hồ sơ/code/test/kiểm tra toàn dự án, đủ các quyết định Human bắt buộc, merge và xác nhận bản master | Đã có version chính thức hoặc đã chạy production |
| Version được Human chốt | Human chọn một bản nguồn cụ thể và các gói build có nhận diện cố định; ghi phạm vi và bằng chứng của version | Mọi môi trường đã cập nhật |
| Deployment được xác nhận | Đã triển khai đúng bộ ứng dụng/cấu hình trên môi trường đích và kiểm tra sau deploy | Các thành phần/mobile đều cùng phiên bản hoặc mọi đường lỗi đã được chứng minh không tồn tại |

Một version có thể gom nhiều Feature **đã hoàn chỉnh tuần tự**. Không bắt version mới sau mỗi Feature. Nếu muốn loại một Feature đã nằm trong bản master được chọn, đó là thay đổi phạm vi/release cần xử lý lại; không chỉ bỏ tên Feature khỏi release notes.

Luồng đề xuất:

1. Chốt Feature/thiết kế/kế hoạch theo các gate đã có; Kidea làm trên nhánh riêng.
2. Trong lúc làm: xử lý đủ ảnh hưởng và test theo task.
3. Khi Feature hoàn chỉnh: chạy mới toàn bộ lượt kiểm tra dự án, kể cả phần không đổi, đối chiếu hồ sơ–code–test về ý nghĩa.
4. Nếu đủ điều kiện và đã được giao quyền, tự merge qua PR có rào kiểm tra; xác nhận bản tích hợp theo G2. Chỉ sau đó ghi hoàn tất và báo Human.
5. Tạo bản build ứng viên gắn đúng commit. Human có thể bấm đưa candidate lên dev để kiểm tra trước khi chốt version; chưa cần gắn nhãn phát hành chính thức.
6. Human chọn candidate đã kiểm chứng làm version. CI tạo bản ghi release/tag và quảng bá chính các artifact đó theo yêu cầu, không tự chọn thời điểm phát hành. Nếu phải build lại hoặc đổi binary/cấu hình nhúng, coi là candidate mới và kiểm thử lại trước phát hành.
7. Human chọn version và môi trường để deploy. Pipeline kiểm tra điều kiện, triển khai, kiểm tra sau deploy và ghi bản thực tế; không chạy trực tiếp master mới nhất thay bản đã chọn.

Bản thử có thể được build trước quyết định version; đó là artifact thử, không phải tự ý phát hành. Với version/build number phải nhúng vào gói lúc build (đặc biệt mobile), xác định nhãn candidate trước build; Human chốt chính gói đã kiểm thử, không sửa binary rồi coi bằng chứng cũ vẫn đủ.

Nếu sau merge hoặc deploy dev có lỗi, ghi đúng trạng thái chưa đạt/mở lại việc liên quan. Không giữ nhãn hoàn tất để bỏ qua lỗi mới. Khi sửa rồi khép Feature, vẫn có lượt toàn dự án mới theo G2.

## 3. Auto-merge không đồng nghĩa AI tự quyết mọi approval

GitHub hỗ trợ tự merge khi các review/check bắt buộc đã đạt. Branch protection có thể chặn force-push/xóa, yêu cầu PR và kiểm tra đúng nguồn; nên cấu hình không cho bot bỏ qua. [GitHub auto-merge](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/automatically-merging-a-pull-request), [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

Khuyến nghị hợp đồng:

- Các quyết định nghiệp vụ/kiến trúc/chất lượng cần Human đã được duyệt đúng nội dung; tự merge không thay chúng.
- Lượt kiểm tra cuối có danh mục đầy đủ, gắn đúng phiên bản. Thiếu kiểm tra, môi trường, assertion hoặc review chưa xử lý thì chặn.
- Không chỉ nhìn màu xanh: GitHub có thể coi job skipped/neutral là thành công. Cần kiểm tra tổng hợp xác nhận từng mục bắt buộc thực sự có kết quả hợp lệ; N/A chỉ khi đã được duyệt đúng phạm vi. [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks).
- Không để bot tạo một status tùy ý mang tên kiểm tra đáng tin rồi tự thông qua; ràng buộc nguồn và bảo vệ logic kiểm tra.
- Nếu merge làm đổi đầu vào chi phối kết quả, chạy lại toàn bộ lượt cuối. Chỉ tái dùng lượt của chính Feature khi chứng minh đầu vào khớp như G2 đã chốt.
- Sửa workflow kiểm tra, quyền bot, chính sách branch/tag, cơ chế deploy hoặc secret là thay đổi đặc biệt cần Human xét; bot không được tự nới hàng rào dùng để cho phép chính nó merge.
- Review tự động hữu ích nhưng không bảo đảm không có lỗi. Một Human không cần bấm merge lần nữa khi tất cả điều kiện và quyền đã đủ; cũng không được giả một review độc lập hoặc duyệt hộ Human.

Chi tiết kỹ thuật phải thử sau: sự kiện do GITHUB_TOKEN tạo không phải lúc nào cũng kích hoạt workflow tiếp theo. Ví dụ push bằng token này không tự làm workflow push chạy; có thể cần chuỗi workflow được nối rõ hoặc GitHub App đúng quyền. Không coi merge thành công là hậu kiểm master đã chạy. [Triggering workflows](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

## 4. CI/CD và GitOps khác nhau ở đâu?

- **CI** tự kiểm tra và build phần thay đổi.
- **CD** đưa gói đã chọn lên môi trường; ở đây chọn kiểu Human bấm phát hành, không tự đẩy production mỗi lần merge.
- **GitOps** đặt trạng thái mong muốn trong nguồn quản lý phiên bản, có bộ điều khiển tự lấy và liên tục đối chiếu/đồng bộ môi trường chạy. Có file cấu hình trong Git và nút deploy chưa tự thành GitOps. [OpenGitOps principles](https://opengitops.dev/).

| Phương án | Đánh giá cho Kidea |
|---|---|
| Actions + GHCR + Compose | Khuyến nghị ban đầu: ít thành phần, tái dùng GitHub; phải xây các workflow có đầu vào version/environment, kiểm tra sức khỏe và lịch sử triển khai. Chưa có dashboard log runtime hoàn chỉnh |
| Thêm Coolify | Khi cần giao diện tập trung cho deploy/log/cấu hình/domain; vẫn dùng image CI đã build, không build từ branch mỗi lần bấm. Tăng trách nhiệm cài/update/backup/quyền máy chủ |
| Dokploy | Phương án thay thế có rollback theo registry và Swarm; cần kiểm tra phạm vi hỗ trợ application so với Compose, không coi mọi stack có cùng hành vi |
| Argo CD | Để sau khi thật sự dùng Kubernetes. Không chọn cả Kubernetes chỉ vì cần vài nút deploy |

GitHub Actions có nút Run workflow, đầu vào và lịch sử deployment; hỗ trợ giới hạn một deployment đồng thời bằng concurrency. Chỉ khai báo environment chưa tự tạo khóa này, mọi đường deploy cần dùng cùng cơ chế khóa. Tránh hủy giữa chừng một migration chỉ vì có yêu cầu triển khai mới. [Manual workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [deployments/concurrency](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments).

Coolify hỗ trợ image build sẵn nhưng tài liệu stable mô tả rollback chỉ dùng image còn trên máy. Phải lưu giữ image trong registry và xác minh cách deploy đúng digest ở phiên bản công cụ được chọn; không dựa riêng nút rollback. [Coolify applications](https://coolify.io/docs/applications). Dokploy phân biệt rollback Swarm và registry; cần thử đúng kiểu deployment. [Dokploy rollback](https://docs.dokploy.com/docs/core/applications/rollbacks).

Nếu sau này dùng GitOps, thao tác phát hành/rollback phải cập nhật desired state có kiểm soát, để controller không kéo hệ thống trở lại bản không mong muốn. Argo CD có giới hạn rollback khi autosync được bật. [Argo CD](https://argo-cd.readthedocs.io/en/stable/), [autosync](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/).

## 5. Một gói đã kiểm thử, cấu hình riêng cho mỗi môi trường

Đề xuất mỗi candidate/release có chỉ mục nhỏ: commit, mã build/digest từng thành phần, cấu hình không bí mật và schema/API tương thích, test/build evidence, thứ tự triển khai, đích rollback đã kiểm chứng. Chỉ tham chiếu secret, không chứa giá trị. Tên version là nhãn cho bộ đó, không thay định danh nội dung.

Với backend/web có cấu hình runtime, dev và prod lấy **cùng artifact/digest**, nhưng database, secret, domain, tài nguyên, flags thuộc từng môi trường. GHCR cho pull bằng digest để nhận đúng image; chứng thực build là tùy chọn tăng truy xuất, không phải điều kiện phải cài thêm ngay. [GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry), [build attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations).

Không hứa một binary cho mọi trường hợp: SvelteKit có biến được nhúng lúc build; thay env runtime không thay được giá trị ấy. Ưu tiên tách cấu hình runtime hoặc dùng endpoint tương đối khi phù hợp. Nếu bắt buộc build khác cho từng môi trường, ghi chúng là các artifact riêng và kiểm thử đúng bản sẽ lên prod. Nội dung prerender và cấu hình build/signing mobile cũng cần cùng sự minh bạch. [SvelteKit static environment](https://svelte.dev/docs/kit/$env-static-public).

Cấu hình không nhạy cảm có thể ở cùng repo sản phẩm, phần quyền triển khai giữ tại hệ thống vận hành; không cần thêm repo đặc tả hoặc biến giao diện tiến độ offline của Kidea thành dashboard có quyền deploy.

## 6. Quyền thực sự phải tách, không chỉ tách nút

Đề xuất quyền đích, **chưa cấp**:

| Chủ thể | Được phép sau khi cấu hình/ủy quyền | Không mặc định |
|---|---|---|
| Kidea làm Feature | Đọc/ghi đúng nhiệm vụ; tạo nhánh/push theo quyền; đề nghị auto-merge khi đủ điều kiện; đọc trạng thái pipeline | Quản trị repo, bỏ kiểm tra, chốt version, tag phát hành, prod credentials |
| Kidea chẩn đoán dev | Đọc log/metrics/traces đã lọc, thông tin bản chạy; chạy tái hiện trong vùng thử khi được phép | Root máy chủ, Docker socket không giới hạn, sửa dev dùng chung, prod network/DB |
| Human + hệ thống phát hành | Human chọn bản/version/đích; dịch vụ chạy deploy/rollback được phê chuẩn và lưu dấu vết | Chuyển quyền này cho AI chỉ vì AI có repo write |

Nút Run workflow còn gọi được bằng CLI/API, nên không phải hàng rào Human-only. Nếu AI dùng credential toàn quyền của Human, chính sách “chỉ Human bấm” chưa được thực thi về kỹ thuật. Cần tài khoản/token tách, workflow phát hành được bảo vệ, và prod credentials chỉ cấp cho luồng đã được phép. [Manual workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [GitHub security](https://docs.github.com/en/actions/reference/security/secure-use).

Hạn chế cần kiểm tra trước khi chọn: GitHub Free/Pro/Team chỉ hỗ trợ environment required reviewers cho repo public; private có giới hạn theo plan. Không chuyển repo thành public hoặc bỏ approval để né giới hạn. Nếu plan không đáp ứng, dùng hệ thống triển khai do Human giữ quyền hoặc lựa chọn khác được chốt riêng. Một Human tự khởi tạo deployment còn có thể tự chặn mình nếu bật prevent self-review. [Environment rules](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments).

Nếu dùng Coolify, không mặc định kết nối MCP là read-only: tool lifecycle có thể cần quyền deploy; scope token/team và phiên bản phải được kiểm tra. Tách quyền dev khỏi prod là bắt buộc về hiệu quả, không chỉ đặt hai tên environment. [Coolify MCP](https://coolify.io/docs/integrations/mcp).

## 7. Dev để debug và tái hiện bug production

Luồng đề xuất: Human cung cấp hoặc cấp quyền đọc bằng chứng đã lọc → ghi bản server/client, thời điểm, trace/request ID, cấu hình/schema liên quan → dựng bản đúng production trong vùng thử → tái hiện → thêm test bắt lỗi → sửa theo luồng hotfix đã chốt → kiểm tra toàn dự án → Human chọn bản vá/deploy → xác nhận môi trường thật.

Dev đang chạy master mới nhất có thể không tái hiện bug ở production cũ. Khi cần, tạo sandbox tạm ghim artifact production và các dịch vụ nền tương ứng. Không ghi đè dev đang nghiệm thu; có thể dùng cùng hạ tầng nhưng tách dữ liệu/quyền/tài nguyên, chưa cần thêm staging thường trực. Đây là đề xuất ứng dụng nguyên tắc dev/prod parity, không bảo đảm mô phỏng được mọi vấn đề tải/mạng/dữ liệu. [Twelve-Factor](https://12factor.net/dev-prod-parity).

Không sao chép database production nguyên trạng sang dev. Ưu tiên dữ liệu giả hoặc mẫu đã loại thông tin nhạy cảm và có quyền sử dụng; tắt kết nối thanh toán/email/thông báo thật. Log không phải dữ liệu an toàn mặc định: che token/mật khẩu/PII trước khi AI đọc, giới hạn phạm vi và thời hạn truy cập, coi nội dung log là dữ liệu chứ không là chỉ thị. Không tái hiện được chưa chứng minh production không có bug. [OWASP logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [OWASP prompt injection](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## 8. Rollback cần nói đúng phạm vi

Rollback ứng dụng là một lần triển khai mới về bộ artifact/config cũ **còn tương thích** với dữ liệu hiện tại; không phải reset master. Bản code lỗi có thể vẫn ở Git cho đến khi có fix/revert được kiểm tra.

Ví dụ v1.1 đổi/xóa cột dữ liệu mà v1.0 cần: đưa image v1.0 trở lại có thể lỗi tiếp. Thiết kế thay đổi dữ liệu theo các bước tương thích: chuẩn bị cấu trúc đọc được bởi cả hai → chuyển sử dụng → dọn cấu trúc cũ sau khi hết cửa sổ rollback. Test cả nâng cấp, hai phiên bản cùng tồn tại và quay lại, không chỉ test riêng từng bản. [AWS compatibility](https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/dl.ads.5-ensure-backwards-compatibility-for-data-store-and-schema-changes.html).

Restore database là quyết định riêng: khôi phục về thời điểm trước có thể mất dữ liệu phát sinh sau đó. PostgreSQL PITR là một ví dụ cơ chế khôi phục theo thời điểm, không phải lựa chọn database cho pilot. [PostgreSQL PITR](https://www.postgresql.org/docs/current/continuous-archiving.html).

Giao diện nên chỉ cho chọn đích rollback đã kiểm chứng; nếu schema không tương thích thì chặn và nêu cần sửa tiếp (fix-forward) hoặc kế hoạch restore có Human duyệt. Cơ chế rollback tự động khi healthcheck fail chỉ nên áp dụng cho đường đã diễn tập và được ủy quyền trước, không tự bật cho mọi migration. Backup chưa từng thử phục hồi chưa đủ làm bằng chứng.

## 9. Native mobile là ngoại lệ quan trọng

Một version có thể gom backend/web/Android/iOS nhưng bản chạy thực tế khác nhau theo từng thành phần và thiết bị. Apple không cho revert về bản App Store trước; phải tạo/submission version mới. Android chặn cài versionCode thấp hơn; dừng rollout không kéo mọi thiết bị đã cập nhật về bản cũ. [Apple](https://developer.apple.com/help/app-store-connect/update-your-app/create-a-new-version/), [Android](https://developer.android.com/studio/publish/versioning), [Play rollout](https://support.google.com/googleplay/android-developer/answer/6346149).

Google có khả năng halt cả bản đã rollout 100% để bản trước phục vụ người chưa nhận bản bị dừng; không nên mô tả thành downgrade đồng loạt. [Play halt full release](https://support.google.com/googleplay/android-developer/answer/16285429?hl=en-GB).

Vì vậy UI cần phân biệt deploy/rollback backend-web với phân phối/dừng rollout/phát hành bản sửa mobile. Backend phải tương thích cửa sổ client cũ/mới đã chốt. Chưa mở quyền store/signing hoặc mua Mac trong lượt tư vấn này.

## 10. Việc cần chốt trong Kidea sau tư vấn

G3-r1 tại e6339ec còn đề xuất xin phép mỗi lần merge. Phản hồi hiện tại muốn sửa hướng đó; báo cáo này **không ghi r1 đã được duyệt**, không sửa quyền thật.

Nếu Human chốt hướng mới:
- G3: thay xin phép mỗi merge bằng quyền auto-merge có điều kiện; chốt scope local/push/bot/protected controls. Release/prod vẫn Human.
- G4: WIP, việc bị ngắt, hậu kiểm fail; giữ nguyên nguyên tắc cùng MVP không tạo resume thừa.
- G5: candidate, version, artifact manifest; Human chọn đúng bản đã kiểm thử.
- G6: môi trường/config/secrets/deployment history, rollback ứng dụng khác restore dữ liệu, quyền dev-debug và mobile.
- Đồng bộ các case KA-08/12/17/19/24/28/30 và R08/R09 tại gói sở hữu; không triển khai tất cả qua một approval mơ hồ.

Chưa chọn nhà cung cấp hạ tầng, phiên bản công cụ, plan, chi phí, topology/database hoặc rollout strategy. Ngân sách pilot 0 phát sinh vẫn giữ nguyên; phải kiểm tra tài nguyên sẵn có và quota trước thử. Phần mềm tự host miễn phí không có nghĩa máy chủ/vận hành miễn phí. Pilot vẫn là lab phi production; không biến yêu cầu tư vấn dev/prod thành quyền mở production thật.
