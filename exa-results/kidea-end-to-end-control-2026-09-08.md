# Kidea — Kiến trúc quản lý xuyên suốt, phát hành đa thành phần và thử nghiệm tính năng

Ngày đối chiếu: 2026-09-08. **Tư vấn/đề xuất chưa duyệt, không cấp quyền triển khai hoặc thay phạm vi bản đầu.**

## 1. Kết luận và điều chỉnh tư vấn trước

Nên thiết kế ngay năng lực quản lý toàn chuỗi cho hệ thống lớn: ý tưởng, đặc tả, triển khai, kiểm chứng, bản phát hành, rollout, bật tính năng, thử nghiệm, quan sát vận hành và xử lý sự cố. Không nên coi vài nút deploy của pilot là kiến trúc dài hạn.

Khuyến nghị: **Kidea là lớp điều phối quy trình, quyết định và truy xuất; nền tảng phát hành/vận hành là khối thực thi có quyền riêng và chạy bền vững; giao diện thống nhất kết nối các nguồn đó.** Tách trách nhiệm không tách công việc ra khỏi quản lý. Không tự viết CI, bộ điều khiển Kubernetes, hệ thống feature flag và thống kê A/B bên trong một skill.

Giữ một việc triển khai tại một thời điểm. Rollout hoặc experiment đã được phép có thể chạy ở nền trong thời gian dài mà không buộc phiên AI luôn mở; hệ thống theo dõi phải hoạt động độc lập. Khi có thay đổi phụ thuộc hoặc sự cố cần xử lý, Kidea nhận diện xung đột và ưu tiên đúng phạm vi, không mở nhiều luồng code song song.

Nghiên cứu bằng Exa: **60 kết quả qua 3 hướng, 43 URL tìm kiếm khác nhau sau bỏ trùng URL**. 15 kết quả trong đó là lượt truy vấn lặp để lấy đủ URL; không phải 60 nguồn độc lập. Một số URL là alias của cùng tài liệu và được xem là cùng căn cứ khi tổng hợp. Chỉ tài liệu chính thức/nguồn nguyên gốc được dùng; không xếp hạng theo số nguồn lặp hoặc bài quảng cáo.

CNCF mô tả platform là tập hợp năng lực được trình bày nhất quán, không yêu cầu đội làm platform tự triển khai mọi năng lực bên dưới. Đây là căn cứ cho ranh giới đề xuất, không phải lời khuyên phải dựng một nền tảng lớn ngay lập tức. [CNCF Platforms White Paper](https://github.com/cncf/tag-app-delivery/blob/main/platforms-whitepaper/latest/index.md).

## 2. “Tự merge” chỉ là giao thao tác; quy trình kiểm chứng không đổi

Ở đây không bắt Human chọn hoặc hiểu tính năng GitHub Auto-merge. Có thể Kidea ra lệnh merge sau khi kiểm tra, hoặc dịch vụ tích hợp thực hiện khi đủ điều kiện; điều đó là chi tiết triển khai.

Hợp đồng cần giữ:

1. Đúng Feature, phạm vi, đầu ra và các Human gate đã chốt; không AI duyệt thay quyết định của Human.
2. Trong từng task vẫn xử lý trọn vẹn ảnh hưởng, kể cả consumer không có diff, rồi chạy kiểm tra cục bộ/tích hợp liên quan.
3. Sau mỗi Feature hoàn chỉnh, chạy lại lượt kiểm tra toàn dự án như G2 đã duyệt: hồ sơ, code, map, test, config, build và toàn bộ kiểm tra bắt buộc kể cả phần không đổi.
4. Review có ý nghĩa, không chỉ link/ID hợp lệ. Còn lỗi bắt buộc, thiếu môi trường/bằng chứng, kiểm tra bị bỏ qua hoặc approval cũ thì chưa đủ.
5. Tích hợp đúng bản đã xác minh, giữ quyền/phạm vi được giao. Bản tích hợp đổi đầu vào thì chạy lại toàn lượt; chỉ tái dùng lượt của chính Feature khi chứng minh đầu vào giữ nguyên.
6. Tách “Feature hoàn chỉnh/đủ điều kiện tích hợp”, “đã tích hợp được xác nhận” và “đã phát hành”. G2 hiện cho ghi Feature DONE trước merge khi đủ điều kiện; sau merge vẫn phải xác nhận kết quả tích hợp riêng. Báo Human sau thao tác phải nêu đủ hai kết quả, không dùng một nhãn DONE để suy rằng đã merge/phát hành hoặc mọi người đã được dùng tính năng. Nếu muốn đổi nghĩa DONE thành hoàn tất cả tích hợp, cần chốt riêng hợp đồng trạng thái, chưa sửa ngầm ở đây.

Không thêm một lần Human bấm merge chỉ để lặp lại các xác nhận đã đủ. Ngược lại, không bỏ một bước kiểm tra nào chỉ vì công cụ hỗ trợ merge tự động.

Cần kiểm thử bản thân hàng rào: job bị skip, kết quả giả/cũ, thiếu suite, thay config giảm kiểm tra, sai branch/source, thiếu kiểm tra thủ công, hoặc đường bấm khác bỏ qua gate. GitHub cho phép skipped/neutral trong status checks; Argo CD không chạy hook khi selective sync; Argo Rollouts có dry-run metrics và Flagger có skipAnalysis. Chọn công cụ không tự làm chính sách “không bỏ bước” thành đúng. [GitHub checks](https://docs.github.com/en/pull-requests/reference/status-checks), [Argo CD sync waves](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/), [Argo analysis](https://argo-rollouts.readthedocs.io/en/stable/features/analysis/), [Flagger](https://docs.flagger.app/usage/deployment-strategies.md).

Khi dự án lớn, có thể chia suite thành nhiều job và chạy kiểm tra song song, dùng cache compiler/dependency hợp lệ; không được lấy kết quả Feature trước thay lượt chạy cuối của Feature này. Cam kết là thực hiện đủ mô hình/tiêu chí được định nghĩa và báo khoảng trống trung thực, không chứng minh tuyệt đối không tồn tại bug.

## 3. Candidate nghĩa là gì?

Trong luồng đang bàn, **candidate là bản ứng viên phát hành**: một bộ gói ứng dụng cụ thể được đem kiểm tra trước khi Human chốt thành bản chính thức. Ví dụ v1.3.0-rc.1, trong đó rc viết tắt của release candidate.

Tên nhãn không phải trạng thái chất lượng. Candidate có thể đang kiểm tra, bị từ chối hoặc đủ căn cứ chờ Human. Hồ sơ ứng viên khóa bộ đầu vào đã kiểm chứng: code/gói build, cấu hình theo môi trường, schema/migration và phiên bản kế hoạch/luật flag liên quan; secret chỉ giữ tham chiếu an toàn, không ghi giá trị. Thay đầu vào chi phối thì tạo định danh/revision ứng viên tương ứng và đánh giá/kiểm chứng lại; không thay nội dung dưới nhãn cũ hoặc mang nguyên chứng nhận cũ sang.

Tiến triển rollout/flag trong kế hoạch đã duyệt được ghi bằng operation/revision có nguồn và kết quả, không cần tạo một release code mới ở mỗi nấc. Tuy nhiên không được sửa âm thầm hồ sơ release cũ; thay kế hoạch hay tổ hợp hành vi ngoài phạm vi đã kiểm chứng phải quay lại đúng gate. Môi trường khác cần đối chiếu cấu hình và kiểm chứng đúng tổ hợp thực tế, không suy test dev đã chứng minh mọi cấu hình production.

Các tên “build thử”, “release candidate” có thể được định nghĩa chi tiết hơn ở gói version; không cần Human nhớ thuật ngữ để sử dụng Kidea. Giao diện nên viết “Bản ứng viên — đang kiểm tra/chờ chốt”.

## 4. Ranh giới kiến trúc được đề xuất

| Khối | Phải sở hữu | Không nên sở hữu |
|---|---|---|
| Kidea | Yêu cầu, nguồn đặc tả, kế hoạch, approval, nghĩa vụ kiểm tra, phân tích ảnh hưởng, quan hệ Feature–release–rollout–experiment–incident; điều phối lệnh theo quyền, đối chiếu và hiển thị bằng chứng | Runtime CI/CD/cluster, kho secret production, cơ chế duy trì traffic hoặc thống kê A/B tự viết |
| Nền tảng phát hành/vận hành | Chạy job bền vững, build/artifact, rollout đa bước/đa thành phần, cấu hình môi trường, quyền/audit, trạng thái thực tế, pause/abort/recovery được phép | Tự sửa nghiệp vụ hoặc tự nhận một Feature đã đạt yêu cầu chỉ vì deploy thành công |
| Hệ feature flag/experiment | Quy tắc đối tượng/biến thể, đánh giá flag, phân nhóm, exposure/outcome, phân tích experiment | Quyết định nghiệp vụ thay Human; dùng flag client thay cơ chế phân quyền |
| Observability | Thu log/metrics/traces, phát hiện điều kiện vận hành và gửi cảnh báo; chạy khi Kidea/AI đóng | Giả trạng thái khỏe khi thiếu tín hiệu hoặc tự nhận kết quả triển khai chỉ từ lệnh đã gửi |
| Giao diện tổng hợp | Một điểm vào xem toàn chuỗi, bản mong muốn/bản thực tế, quyền và điểm chờ; thao tác chuyển qua luồng được kiểm soát | Một tracker thứ hai cho người sửa trạng thái tùy ý; một nút duy nhất là đường cứu production |

Các khối là ranh giới trách nhiệm/quyền, không bắt buộc mỗi khối một microservice hoặc repo mới. Có thể dùng sản phẩm có sẵn và một lớp tích hợp mỏng; không làm dashboard riêng trước khi chứng minh đường dữ liệu và quyền.

Kidea hiện được thiết kế là skill theo phiên, với HTML offline chỉ đọc và chưa có server Kidea. Giao diện điều khiển online, dữ liệu live và nền tảng vận hành là mở rộng kiến trúc cần Human chốt; không âm thầm biến HTML offline thành nơi có token deploy. Giao diện online có thể là portal riêng trong hệ sinh thái; người dùng vẫn thấy một điểm vào xuyên suốt.

## 5. Tách triển khai, mở tính năng và A/B testing

| Khái niệm | Câu hỏi giải quyết | Ví dụ |
|---|---|---|
| Deploy | Thành phần nào đang chạy gói code nào? | Backend build B120 đã lên production |
| Progressive rollout | Đưa bản mới ra phạm vi nào, theo những chặng nào, dừng khi nào? | 5% traffic thử rồi mở rộng khi đủ tín hiệu |
| Feature exposure | Người/tài khoản/thiết bị nào thực sự được dùng hành vi mới? | Code đã có nhưng chỉ mở cho nhóm thử đủ phiên bản |
| A/B experiment | Phương án nào có tác động tốt hơn theo phép đo đã chốt? | Hai luồng đăng ký được phân cho nhóm ổn định để đo hiệu quả |

Các tỷ lệ chỉ là ví dụ, không là ngưỡng đã duyệt. Canary và A/B cùng có thể chia nhóm, nhưng mục đích thường khác: canary chủ yếu đánh giá độ an toàn của rollout; A/B sản phẩm đánh giá tác động lên kết quả nghiệp vụ. Chạy 50% traffic vào code mới chưa tự tạo kết luận kinh doanh đáng tin. [Google SRE Canarying](https://sre.google/workbook/canarying-releases/), [Unleash A/B](https://docs.getunleash.io/guides/a-b-testing), [GrowthBook experiments](https://docs.growthbook.io/using/experimenting).

Một bản triển khai xong chưa chắc tính năng đã mở. Experiment đã kết luận chưa chắc việc phân phối biến thể đã dừng. Kidea phải theo dõi riêng các sự thật này, tránh một nhãn DONE che mất phần chưa hoàn tất.

## 6. Cùng một release cho web/app/backend nhưng không ép cập nhật tức thời đồng loạt

Một release sản phẩm có một mã chung và liệt kê đúng bộ phiên bản/build tương thích: web, backend, Android, iOS, schema, config và phiên bản quy tắc mở tính năng. Không cần mọi thành phần có cùng số version; thành phần không đổi vẫn ghi đúng artifact được giữ lại.

Phát hành phối hợp cần biết:

- Quan hệ phụ thuộc và các tổ hợp old/new được hỗ trợ.
- Thứ tự triển khai/migration và điều kiện trước mỗi bước.
- Tỷ lệ/cohort/region/môi trường mục tiêu, cửa sổ quan sát và điều kiện mở rộng.
- Nếu một thành phần thất bại, những phần đã lên sẽ giữ nguyên, dừng mở tính năng, rollback hay sửa tiếp theo kế hoạch nào.
- Các quyền, bằng chứng và thời hạn hỗ trợ client/schema cũ.

Ví dụ một tính năng đăng ký mới:
1. Backend/schema được chuẩn bị tương thích client cũ; tính năng mới mặc định chưa mở.
2. Web và native được phân phối theo kế hoạch.
3. Xác minh các điều kiện hỗ trợ, chỉ mở cho nhóm người dùng có client phù hợp; client cũ vẫn dùng luồng cũ.
4. Nếu chỉ số an toàn đạt, mở rộng; nếu có lỗi thì dừng hoặc tắt tính năng theo chính sách.
5. Chỉ dọn code/API/flag cũ khi hết nghĩa vụ hỗ trợ và đủ bằng chứng.

Cách này phối hợp “ra mắt cùng một tính năng” mà không cần hứa mọi thiết bị cập nhật cùng một giây. App Store/Google Play không cung cấp phép cập nhật/rollback nguyên tử tất cả thiết bị. Apple phased release vẫn cho phép người dùng tự tải bản mới; Google halt không hạ bản đã cài. [Apple phased release](https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/), [Google Play](https://support.google.com/googleplay/android-developer/answer/6346149).

Đồng bộ ra mắt được định nghĩa theo người dùng/phiên bản đủ điều kiện, không phải “100% mọi thiết bị đã lên”. Kill switch cũng không được hứa tác dụng tức thì trên mobile đang offline; hành vi nhạy cảm cần backend cưỡng chế đúng quyền.

Argo Rollouts chỉ quản lý từng application/deployment, không tự hiểu dependency để rollback frontend khi backend hỏng. Nếu chọn nó, nền tảng vẫn cần thực thi kế hoạch phối hợp bên trên, không để AI giữ một chuỗi thao tác trong trí nhớ. [Argo Rollouts FAQ](https://argoproj.github.io/argo-rollouts/FAQ/).

## 7. A/B cần được thiết kế từ nghiệp vụ, không gắn thêm sau khi code xong

Trước mở experiment, phải chốt giả thuyết, hành vi A/B hợp lệ, tiêu chí đủ điều kiện, đơn vị chia nhóm (user/account/tenant), chỉ số chính, chỉ số an toàn, thời gian/cỡ dữ liệu tối thiểu và quy tắc kết luận.

- Web/app/backend dùng cùng danh tính chuẩn và quy tắc phân nhóm; không tự random lại mỗi request. Backend xác thực danh tính, không tin nhãn variant client gửi như quyền.
- Tách assignment (được phân nhóm), exposure (thực sự tiếp xúc) và outcome (kết quả). Có mã experiment/variant và bản rule/code/môi trường để truy lại.
- Thiếu event, lệch nhóm (SRM), đổi định danh hoặc dữ liệu không đủ thì báo chưa đủ căn cứ; không tự chọn bên thắng.
- Không thay chỉ số mục tiêu sau khi xem dữ liệu chỉ để tìm kết quả đẹp. Dừng vì vượt ngưỡng an toàn khác với kết luận một phương án thắng.
- Kết thúc thử nghiệm: Human quyết định áp dụng/từ chối/thử tiếp, xác nhận trạng thái phân phối thực tế, cập nhật đặc tả–code–test–flag và kế hoạch dọn nhánh cũ.

Nguồn: [GrowthBook methodology/operation](https://docs.growthbook.io/using/experimenting), [sticky bucketing](https://docs.growthbook.io/app/sticky-bucketing), [LaunchDarkly exposure/event](https://launchdarkly.com/docs/home/experimentation/events), [sample-ratio mismatch](https://launchdarkly.com/docs/guides/statistical-methodology/sample-ratios).

Mọi nhánh A/B được đưa ra người dùng đều phải là hành vi đã được duyệt và kiểm thử đầy đủ theo phạm vi; experiment không phải giấy phép thử code chưa hoàn thiện trên production. Nhiều flags/experiments tương tác phải có mô hình tổ hợp hợp lệ, nhóm loại trừ hoặc thứ tự phụ thuộc và bộ kiểm tra đã chốt. Không mặc định test mỗi flag riêng là đủ; cũng không hứa vét cạn mọi tổ hợp vô hạn.

Flag có owner, mục đích, default/fallback, ngày rà lại, nguồn code/test và điều kiện xóa. Xóa/đổi flag có thể làm mobile cũ trả fallback, nên phải phân tích ảnh hưởng như một thay đổi sản phẩm, không chỉ dọn dashboard. [LaunchDarkly cleanup](https://launchdarkly.com/docs/home/flags/archive).

## 8. Chuỗi truy xuất để không rơi rớt thông tin

Chuỗi cần đọc được hai chiều:

**Ý tưởng/yêu cầu → rule/AC → thiết kế → code/test → kết quả kiểm tra → gói build → release → deployment → nhóm đang dùng tính năng → tín hiệu vận hành/experiment → incident/change.**

Không thêm “bản đồ thứ tư”. Mở phạm vi ba bản đồ hiện có để bao gồm pipeline, cấu hình, rollout, flags, metrics và các quan hệ cần kiểm chứng. Hồ sơ thực thi và quan sát là bằng chứng có nguồn, không một bản đặc tả song song.

| Thông tin | Nguồn chính đề xuất |
|---|---|
| Ý định, nghiệp vụ, luật rollout/experiment đã duyệt | Tài liệu/config nguồn của project; hồ sơ review chỉ tham chiếu đúng phiên bản |
| Tiến độ và điểm chờ Human | Hồ sơ điều phối Kidea |
| Gói build và định danh nội dung | Kho artifact/registry với chỉ mục trong hồ sơ sản phẩm |
| Lệnh triển khai, kết quả từng bước, trạng thái thực tế | Hệ thống phát hành/vận hành; Kidea đọc kết quả có nhận diện nguồn/thời điểm |
| Luật flag có hiệu lực và exposure/experiment | Một nguồn điều khiển được chọn; không sửa cả file và dashboard như hai nguồn ngang quyền |
| Log/metrics/traces | Nền tảng observability; Kidea tham chiếu/đọc phần được phép, không chép mọi log vào Markdown |

Mỗi hành động ngoài Kidea cần đủ: mã liên kết công việc/release, đích và đầu vào cụ thể, căn cứ quyền, điều kiện thực thi, định danh operation, kết quả/thời điểm và khả năng đọc lại. Gửi lệnh thành công khác thao tác đã hoàn tất. Retry phải đối chiếu operation/thực tế trước, không làm lặp migration hoặc rollout.

Mất kết nối/sai nguồn/cũ dữ liệu thì báo unknown/stale/blocked ở phần phụ thuộc; không giữ màu xanh cũ. Thay đổi thủ công ngoài luồng phải để lại audit và được phát hiện/đối chiếu. Không coi “chỉ cho phép sửa qua UI của Kidea” là cách duy nhất duy trì nhất quán: vẫn cần đường vận hành khẩn cấp được kiểm soát và nhập lại bằng chứng sau.

Đề xuất gắn release/component/version/environment vào tín hiệu vận hành, tham chiếu experiment/variant khi liên quan. OpenTelemetry có semantic conventions cho service.version và deployment.environment.name; triển khai chi tiết vẫn phải xét chi phí/cardinality và riêng tư, không đưa user ID thành nhãn metric vô hạn. [OpenTelemetry service](https://opentelemetry.io/docs/specs/semconv/registry/attributes/service/), [environment](https://opentelemetry.io/docs/specs/semconv/resource/deployment-environment/).

Thay config, migration, flag hoặc đối tượng rollout dù không đổi code vẫn là change có ảnh hưởng; phải được ghi và kiểm tra. Incident quay lại đúng yêu cầu/code/release và bổ sung test nếu phù hợp. Không chép lại toàn bộ đặc tả mỗi lần release, giữ liên kết tới nguồn đúng bản và artifact cần phục hồi.

## 9. Điều khiển nhất quán nhưng không để Kidea thành điểm lỗi duy nhất

Human có thể chốt một kế hoạch rollout đầy đủ: các chặng, ngưỡng, quyền mở rộng và điều kiện tự dừng. Sau đó nền tảng tự thực thi trong phạm vi đó; không nhất thiết Human bấm từng nấc. Ra ngoài kế hoạch hoặc cần thay quyết định thì dừng hỏi. Đây là phương án quyền cần chốt, chưa áp dụng.

Nếu Kidea/AI đóng, pipeline/rollout/monitoring/alert vẫn phải tiếp tục đúng chính sách. Phần phục vụ không phụ thuộc nguồn điều khiển bị mất vẫn hoạt động; từng luồng có cache/fallback, giới hạn độ cũ và cách phục hồi được thiết kế/kiểm thử. Khi không đủ căn cứ an toàn, luồng nhạy cảm phải được tạm dừng hoặc từ chối theo chính sách, không buộc tiếp tục hành vi với dữ liệu/flag cũ. Human còn đường xử lý khẩn cấp có audit, không cần mở phiên AI để rollback.

Hệ thống không thể bảo đảm “ngon lành” bằng một dấu xanh cuối cùng. Phải có tiêu chí vận hành cụ thể: độ trễ/tỷ lệ lỗi/tính đúng dữ liệu, ngân sách lỗi, thời gian và mức mất dữ liệu chấp nhận khi phục hồi; ai nhận cảnh báo và làm gì. Canary thêm dữ liệu từ production để giảm rủi ro còn sót, không thay test trước deploy. [Google SRE release engineering](https://sre.google/sre-book/release-engineering/), [canarying](https://sre.google/workbook/canarying-releases/).

Rollback ứng dụng, tắt flag và restore database là các hành động khác nhau. Tắt flag không hoàn tác dữ liệu đã ghi; rollout đa thành phần thất bại có thể để hệ thống ở tổ hợp phiên bản hỗn hợp hợp lệ hoặc cần xử lý. Giao diện phải thể hiện trạng thái từng phần và quá trình khôi phục, không một nút “undo cả hệ thống”.

## 10. Nên làm gì ngay và chưa nên làm gì?

### Nên chốt ngay trong kiến trúc

- Ranh giới Kidea/nền tảng/giao diện; nguồn dữ liệu và quyền, hoạt động khi mất kết nối.
- Hợp đồng Feature hoàn tất, release ứng viên/chính thức, trạng thái mong muốn/thực tế, deployment/rollout/exposure/experiment.
- Release đa thành phần, compatibility, schema/data và phục hồi.
- Luật review/test bắt buộc, chính sách rollout/flags/experiment và bằng chứng hai chiều.
- Một bài kiểm chứng nhỏ nhưng xuyên suốt toàn chuỗi, có lỗi giữa chừng, tín hiệu mất, rollout dừng và tiếp tục đúng.

### Cần làm trước khi sản phẩm sử dụng năng lực tương ứng

- Kiểm chứng adapter/tool thực sự cho C++/web/Android/iOS, nhận diện phiên bản và quyền.
- Thử đường production-like trong lab, upgrade/coexistence/rollback và mở/tắt flag; kiểm tra version mobile không được hỗ trợ.
- Kiểm chứng event/assignment/analysis A/B bằng dữ liệu thử; kết quả pilot ít dữ liệu chỉ chứng minh cơ chế, không chứng minh hiệu quả kinh doanh.
- Thử giới hạn tải, sẵn sàng, backup/restore và chi phí theo workload dự kiến của sản phẩm thật. Pilot nhỏ không chứng nhận năng lực ở quy mô lớn.
- Chốt cấu hình platform, plan, hạ tầng và người vận hành; tự host cũng có chi phí vận hành.

### Chưa nên làm

- Tự viết toàn bộ CI/CD, rollout engine, feature flag server hoặc thống kê A/B.
- Đưa mọi quyền production vào AI hoặc để AI sửa chính sách kiểm tra rồi tự vượt gate.
- Buộc microservice/Kubernetes/multi-region chỉ vì nói “sau này lớn”, khi chưa xác định workload, yêu cầu sẵn sàng, ngân sách và người vận hành.
- Chấp nhận vài dashboard rời chỉ có link, không quan hệ đầu vào–operation–kết quả và không phát hiện lệch.
- Dựng một portal lớn trước khi hợp đồng tích hợp và một luồng thật được chứng minh.
- Cam kết “một version, cập nhật/rollback nguyên tử toàn bộ mobile/web/backend” hoặc “đạt test nghĩa là không còn lỗi”.

## 11. Hướng chọn công cụ có điều kiện

Nếu hạ tầng đích chọn Kubernetes, **Argo CD + Argo Rollouts** là ứng viên cụ thể cho desired/live state và progressive workload rollout; vẫn cần điều phối release đa thành phần, native/store adapters và lớp flags/experiments. Flagger là lựa chọn thay thế cho bộ điều khiển rollout, không cài cả hai để tranh sở hữu cùng workload. Nếu hạ tầng không dùng Kubernetes, giữ cùng hợp đồng nhưng chọn bộ thực thi phù hợp; không cần đổi nghĩa trạng thái Kidea. [Argo FAQ](https://argoproj.github.io/argo-rollouts/FAQ/), [Flagger](https://docs.flagger.app/usage/deployment-strategies.md).

OpenFeature là API/abstraction nối tới provider, không tự là hệ quản lý flags/experiment. Catalog SDK không đồng nghĩa hỗ trợ ngang nhau: C++ SDK hiện đánh dấu Providers đang làm, Tracking/Events/Hooks chưa implemented. Vì backend C++ là phạm vi đã chọn, phải kiểm chứng tích hợp, không tuyên bố cả stack có một SDK thống nhất sẵn. [OpenFeature provider](https://openfeature.dev/docs/reference/concepts/provider), [C++ SDK](https://github.com/open-feature/cpp-sdk).

GrowthBook là ứng viên cần xem nếu ưu tiên quản lý dữ liệu phân tích và khả năng tự vận hành, nhưng catalog chưa liệt kê C++; có thể phát sinh adapter/evaluation service. LaunchDarkly có C++ server SDK, Android/iOS/web/Node, nên là ứng viên managed cần đánh giá khi ngân sách cho phép. Chưa xác nhận plan, pricing hoặc mọi năng lực của hai bên phù hợp; không cài hay mua trong lượt tư vấn này. [GrowthBook catalog](https://docs.growthbook.io/lib), [LaunchDarkly C++](https://docs.launchdarkly.com/sdk/server-side/c-c--).

## 12. Ảnh hưởng tới kế hoạch Kidea hiện tại

Tư vấn GitHub Actions/Compose trước đó chỉ là một cách thực thi ban đầu, không đủ để đại diện toàn kiến trúc kiểm soát hệ thống lớn. Đề xuất mới bổ sung khối phát hành/vận hành/experiment có quan hệ rõ với Kidea; không mở nhiều project triển khai song song.

Nên làm tiếp theo thứ tự:
1. Trình gói nhỏ chốt ranh giới Kidea với nền tảng, và đích giao diện thống nhất.
2. Chốt hợp đồng release/rollout/exposure/experiment và chuỗi bằng chứng; giữ các nguyên tắc G2/MVP/hotfix đã duyệt, không duyệt lại chúng vô ích.
3. Chọn một profile công cụ/môi trường cụ thể, lập bài kiểm chứng xuyên suốt rồi phân rã thực hiện đúng gate/quyền.

Các nơi phải được rà khi phương án được duyệt: DESIGN phạm vi/HTML offline/quyền/ba bản đồ/testing/operations; R01-T06/T07, hợp đồng R02, UX/ops/architecture R04/R05, change/maps R06, UI R07, release R08, pilot R09; KA-08/15–19/24–28/30 và QUALITY. Đây là danh mục ảnh hưởng cần làm, không tự ghi đã đồng bộ hay đã nghiệm thu.

Ngoài bản tư vấn và answer.md, DESIGN chỉ sửa một con trỏ trạng thái cũ ở mục testing: G2-r3 thực tế đã được duyệt tại R01-T05, không còn “đang chờ chốt”. ROADMAP thêm con trỏ từ gói G3 đang trao đổi tới đề xuất này, nói rõ r1 chưa được duyệt và D2 cần cập nhật sau khi chốt. Không thay chính sách G2, không đánh dấu G3 hoặc kiến trúc mới APPROVED; không thay quyền, cài platform, chạy pilot hay thao tác Thuận Thiên.
