# Kidea — Lõi quy trình, thực thi từ local và nhánh bảo trì

Ngày: 2026-09-11.

**Trạng thái:** nghiên cứu/tư vấn và đầu vào gói R01-T06-S01-r3, chưa duyệt hai điểm còn mở. Human nói “Các điểm khác tôi thấy ok rồi, chỉ có 2 điểm này tôi phân vân” đối với [bản tư vấn trước](https://github.com/Kynderis/kidea/blob/87b3ba70eb6083a780a411537fbce5446ae6a777/answer.md). Ghi nhận phần đồng ý đó; không yêu cầu duyệt lại. Hai điểm mới cần làm rõ là cách thực thi local/DEV/PROD và vòng đời nhánh bảo trì. Chưa cấp quyền runtime/pilot/production.

## 1. Nội dung tư vấn

**Tôi khuyên chọn hướng bạn vừa nêu: Kidea giữ quy trình và điều kiện chất lượng bắt buộc; cách dùng Git, chạy kiểm tra và deploy được chọn cho từng project. Bản đầu có thể dùng script điều khiển từ local, chưa cần dịch vụ CI.**

Bạn đang đưa cuộc trao đổi trở lại đúng mục tiêu, không phải nghĩ quá. Điểm cần điều chỉnh trong tư vấn trước của tôi là **không đặt CI hay một nền tảng deploy thành mặc định bắt buộc** trước khi project cần nó.

Tôi đã đối chiếu 35 kết quả qua ba hướng nghiên cứu bằng skill Search/Exa. Dưới đây là phương án tôi thấy phù hợp nhất với Kidea hiện tại.

### 1. Kidea chuẩn hóa điều phải đạt, không ép một bộ công cụ

Tách hai phần như sau:

| Kidea bắt buộc giữ | Project được lựa chọn |
|---|---|
| Yêu cầu rõ; các điểm Human quyết định; xử lý đầy đủ ảnh hưởng | Công nghệ, bố cục hợp lý, công cụ hỗ trợ |
| Review/test đúng phạm vi; lượt cuối toàn dự án sau mỗi Feature; không bỏ kiểm tra bắt buộc | Lệnh kiểm tra, công cụ và máy phù hợp để chạy |
| Biết đúng bản nguồn, gói build, cấu hình và bằng chứng | Cách tổ chức branch/tag và lưu gói build |
| Đủ điều kiện trước deploy, đúng quyền, xác nhận sau deploy và cách xử lý lỗi | Script local, nền tảng triển khai hoặc CI/CD khi cần |
| Giữ thông tin thống nhất, tiếp tục được công việc, quản lý thay đổi sau release | Cách thực thi cụ thể trong phạm vi đã chọn và kiểm chứng |

**Template là điểm bắt đầu, không phải một quy trình khác được phép bỏ điều kiện.** Project có thể thay công cụ, không được âm thầm biến “test bắt buộc chưa chạy” thành “không cần test”.

Cũng không cần xây thêm một “hệ thống profile” phức tạp. Trước mắt, đây chỉ là **bộ quy ước thực thi của project**: dùng Git thế nào, chạy lệnh nào, ở đâu, ai được deploy và bằng chứng nằm đâu. Lưu ở hồ sơ hiện có; script/config nằm trong source, không tạo thêm nguồn sự thật song song.

Hướng này khớp [mục tiêu và ranh giới Kidea đã có](https://github.com/Kynderis/kidea/blob/87b3ba70eb6083a780a411537fbce5446ae6a777/KIDEA_DESIGN.md#scope), không phải đổi Kidea thành sản phẩm mới.

### 2. Có thể không dùng CI — nhưng không bỏ việc kiểm tra tự động

**Tôi đồng ý chưa cần một dịch vụ CI riêng ở bản đầu.** Tuy nhiên, không nên kết luận CI chỉ chạy lại những test thừa: nó còn giúp tự chạy nhất quán trên các lần thay đổi, công khai kết quả và giảm phụ thuộc vào môi trường một máy. Đó là các lợi ích cần cân nhắc khi nhu cầu tăng. [DORA về CI](https://dora.dev/capabilities/continuous-integration/).

Với một Human + Kidea và một công việc hiện hành, ta có thể bắt đầu bằng:

- Một bộ lệnh kiểm tra/build chuẩn, chạy từ local.
- Bản nguồn cuối được cố định; build sạch, phiên bản công cụ và thư viện rõ.
- Lưu kết quả thật, gồm cả fail/skip và phần thiếu.
- Chỉ đưa bản đạt điều kiện tương ứng lên dev hoặc trình Human.

**“Local điều khiển toàn bộ” không có nghĩa “mọi kiểm tra chỉ chạy trên Windows”.** Với phạm vi chúng ta đã chọn:

- Backend C++ phải có bằng chứng build/chạy đúng trên Ubuntu đích.
- iOS vẫn cần Mac và kiểm chứng thiết bị phù hợp.
- Kiểm tra tích hợp có thể gọi hệ thống dev; kiểm tra sau deploy phải đối chiếu bản thực chạy trên server.

Không có CI không miễn những yêu cầu này. Một laptop chạy unit test đạt chưa chứng minh toàn bộ hệ thống production đạt.

Tôi cũng không khuyên chỉ dựa vào trí nhớ AI để gõ từng lệnh. **Các phần tự động hóa được nên nằm trong bộ lệnh dùng lại; review ngữ nghĩa và Human gate vẫn được thực hiện riêng.** Sau này cần CI, chuyển chính bộ lệnh đó sang runner, không đổi ý nghĩa của PASS hay viết lại quy trình.

### 3. Một script chính gọi script phụ là phương án tốt

Tôi đề xuất **một điểm vào deploy cho project**, gọi các bước hoặc script phụ khi cần. DEV/PROD dùng chung cách triển khai đối với cùng loại thành phần; khác target, cấu hình và quyền.

Không tạo hàng loạt script gần giống nhau chỉ vì đổi địa chỉ server. Chỉ tách cách triển khai khi bản chất khác, chẳng hạn backend dạng service khác với phát hành ứng dụng mobile.

DORA cũng khuyến nghị dùng chung quy trình triển khai giữa các môi trường, tách cấu hình và giữ việc tự động hóa đơn giản. Đây là căn cứ cho cách tổ chức script, không phải yêu cầu phải dùng một dịch vụ CI. [Deployment automation](https://dora.dev/capabilities/deployment-automation/).

**Đầu vào deploy không nên chỉ có file config.** Nó cần xác định được:

1. **Gói nào được triển khai:** phiên bản và dấu nhận diện nội dung của từng thành phần.
2. **Triển khai đến đâu:** config đích, môi trường và các giá trị cần dùng.
3. **Dùng cách triển khai nào:** đúng bản script chính, script phụ và migration đã được review/kiểm tra.

Ví dụ về ý nghĩa: “Đưa gói release R12 lên các server trong config PROD này, bằng bộ script S7.” Không phải “lấy master mới nhất rồi tự build và triển khai”.

File config được tùy chỉnh, nhưng **phải kiểm tra hợp lệ và đúng phạm vi**. Không có target rõ thì dừng; tên file `dev` không đủ nếu bên trong lại trỏ tới database production.

Quy trình bên trong script chỉ cần những phần thực sự cần thiết:

| Thời điểm | Việc cần làm |
|---|---|
| Trước thay đổi | Xác minh máy/môi trường/quyền, bản đang chạy, gói/config, điều kiện dữ liệu và phục hồi; hiển thị bản cũ → bản mới cùng các thay đổi quan trọng |
| Khi triển khai | Thực hiện đúng thứ tự, tránh hai lần chạy chồng, ghi bước đã làm/chưa xác nhận; dừng đúng khi lỗi |
| Sau triển khai | Đọc lại phiên bản/config thực tế, kiểm tra service và các luồng chính, ghi kết quả để Kidea đối chiếu |

**Copy file xong hoặc script trả mã thành công chưa đủ để xác nhận release thành công.** Mất kết nối sau migration phải kiểm tra thực tế trước khi chạy lại; rollback ứng dụng không được giấu thao tác khôi phục database có thể làm mất dữ liệu.

Đây là độ chặt cần có ngay cả với script nhỏ, không đòi phải xây một nền tảng triển khai.

### 4. AI chạy DEV, Human chạy PROD: tôi ủng hộ cách này

Luồng đề xuất:

1. Human giao Feature trong phạm vi và quyền project đã chốt.
2. Kidea cập nhật đủ tài liệu, code, test và các phần ảnh hưởng; kiểm tra trong lúc làm, commit/push theo quy ước.
3. Đạt điều kiện trước deploy dev thì AI tự triển khai dev; sau đó chạy các kiểm tra cần hệ thống đang hoạt động.
4. Feature hoàn chỉnh thì chạy **toàn bộ lượt kiểm chứng cuối đã thống nhất**, gồm review và phần không sửa. Có lỗi/skip/thiếu bằng chứng bắt buộc thì chưa trình là bản đạt.
5. Kidea báo Human đúng bản đề nghị phát hành, kết quả, thay đổi, giới hạn và phương án xử lý sự cố.
6. Human chọn bản và config production, trực tiếp chạy bộ script đã xác minh.
7. Script kiểm tra sau deploy và ghi kết quả; Kidea đọc/đối chiếu bằng chứng được phép để cập nhật trạng thái thực tế.

**Quyết định phát hành và tự tay chạy script có thể nằm trong cùng một lần thao tác của Human**, không cần bắt bạn xác nhận nhiều lần cho các bước máy móc. Nhưng việc đó vẫn phải gắn đúng bản, target và phạm vi đã chọn.

Có ba ranh giới quan trọng:

**Gói build được giữ nguyên, cấu hình DEV/PROD không nhất thiết giống nhau.** Phải kiểm tra khác biệt cấu hình đích; không mang secret production vào dev. Nếu thay version hoặc cấu hình build khiến binary thay đổi, cần kiểm chứng gói mới. Tách build–release–run giúp tránh nhầm “cùng commit” với “cùng bản đang chạy”. [Twelve-Factor](https://12factor.net/build-release-run).

**Human chạy PROD chưa tự tạo ra một hàng rào kỹ thuật.** Nếu AI cùng tài khoản máy vẫn đọc được SSH key/token hoặc sửa bộ script sau khi Human kiểm tra, quyền production chưa thực sự được cách ly. Cần bảo vệ credential và chạy đúng bộ script đã chốt; mức cách ly cụ thể chọn theo project. Không nên gọi file `human-only` là đã bảo vệ được quyền. [OWASP về quản lý secret](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

**Production phải tiếp tục vận hành khi Kidea hoặc laptop tắt.** Service, cảnh báo và tác vụ vận hành cần thiết phải sống ở môi trường phù hợp. Local là nơi khởi chạy/điều khiển, không trở thành điều kiện để sản phẩm duy trì hoạt động.

Như vậy, ta giảm hạ tầng điều phối, **không cắt phần vận hành đã thống nhất**.

### 5. Cách hotfix bạn nêu hợp lý; chỉ cần chỉnh ba chi tiết

**Hai trường hợp chính giữ đúng như bạn đề xuất:**

- Master đúng nền production cần sửa: sửa trực tiếp trên master, đủ review/test rồi Human phát hành bản mới.
- Master có thay đổi chưa muốn đưa cùng bản vá: tạo nhánh từ đúng bản production và sửa riêng.

Bản vá và bản kết hợp trên master phải được kiểm chứng theo quy tắc đã chốt; không dùng PASS của nhánh này thay bằng chứng cho nhánh kia.

“Đúng nền production” phải đối chiếu cả thành phần bị lỗi, gói đang chạy, config/schema liên quan; không chỉ nhìn tên tag. Nếu master chỉ đi trước vài thay đổi tài liệu được phép đi cùng, không nhất thiết phải tạo nhánh.

**Chi tiết thứ nhất: giữ nhánh theo dòng bảo trì, không theo một version bất biến.**

Ví dụ:

- Tag `v1.0.1`: giữ nguyên bản đã phát hành.
- Nhánh bảo trì dòng `1.0.x`: tiếp tục nhận bản vá.
- Vá lỗi A → phát hành `v1.0.2`.
- Vá lỗi B → phát hành `v1.0.3`, kế thừa bản vá A.

Không sửa nội dung dưới tag `v1.0.1`, và không cứ rẽ lại từ `v1.0.1` để rồi mất các bản vá trước. Nếu dùng SemVer, sửa lỗi tương thích ngược tăng phần PATCH; thay đổi phá tương thích không mặc nhiên được gọi là patch. [SemVer](https://semver.org/spec/v2.0.0.html).

Nếu bản mới bị thu hồi hoặc hệ thống đang rollback, chọn nền theo tình trạng thực tế, không máy móc lấy số version lớn nhất.

**Chi tiết thứ hai: “đẩy fix sang master nếu cần” phải có kết luận bắt buộc.**

Mỗi bản vá phải được đối chiếu với master và ghi một trong hai kết quả:

- Đã đưa bản sửa hoặc giải pháp tương đương vào master, có kiểm chứng.
- Không còn áp dụng hoặc đã được sửa tương đương, có lý do và bằng chứng.

Không bắt chép nguyên patch nếu master đã đổi kiến trúc. Nhưng không được để “nếu cần” trở thành “quên kiểm tra”, khiến bản phát hành sau tái xuất hiện lỗi cũ. Việc tạo nhánh khi cần vá bản cũ và kiểm soát đường đưa fix giữa các dòng được đề cập trong [Trunk-Based Development](https://trunkbaseddevelopment.com/branch-for-release/).

**Chi tiết thứ ba: xóa nhánh khi hết hỗ trợ dòng đó, không xóa lịch sử phát hành cần giữ.**

Trước khi xóa, xác nhận không còn việc vá/cam kết hỗ trợ cần nhánh, các fix đã có kết luận trên master, và vẫn giữ được tag, source, gói build, bằng chứng cùng dữ liệu cần phục hồi.

Xóa nhánh không đồng nghĩa xóa tag, release, server hoặc database. Cũng không làm các app cũ trên máy người dùng biến mất. Chính sách hỗ trợ và khả năng tương thích vẫn cần được xử lý riêng.

### 6. Cách giữ Kidea không bị lan man

Tôi đề xuất giới hạn công việc tiếp theo ở **một phương án thực thi đầu tiên**:

> Một master phát triển chính; nhánh bảo trì chỉ tạo khi cần. Kiểm tra/build được điều khiển từ local bằng bộ lệnh chuẩn. AI deploy DEV trong phạm vi; Human chạy PROD. Tất cả vẫn đi qua các điều kiện và bằng chứng chung của Kidea.

Chưa cần thiết kế cả thư viện template cho mọi kiểu Git, mọi cloud hoặc mọi công cụ deploy. Làm mẫu đầu đủ dùng, chạy thử cả đường thành công và đường lỗi; chỉ tách phần dùng chung khi đã thấy nhu cầu thực tế.

Sau này bổ sung CI, công cụ quản lý cấu hình hay nền tảng triển khai khi xuất hiện lý do cụ thể: phụ thuộc máy cá nhân gây gián đoạn, thời gian kiểm tra quá dài, cần nhiều nền build, cần kiểm soát quyền độc lập hoặc quy mô vận hành vượt khả năng script hiện tại. Không nâng cấp chỉ vì tên công cụ nghe “chuyên nghiệp hơn”.

**Tôi ghi nhận các điểm khác bạn đã đồng ý, không yêu cầu duyệt lại.** Phần cần chốt tiếp chỉ còn cách thực thi local/DEV/PROD và vòng đời nhánh bảo trì. Tôi đã cập nhật gói đang review theo hai điểm này; không mở thêm một dự án xây CI/CD, không giảm chuẩn kiểm chứng và chưa cấp quyền chạy pilot/production.


## 2. Căn cứ bổ sung và giới hạn của khuyến nghị

### Local-only là lựa chọn triển khai có đánh đổi

DORA mô tả CI đầy đủ gồm build/test tự động sau mỗi lần thay đổi và quy trình giữ nhánh chung khỏe. Khuyến nghị chưa dùng dịch vụ CI của báo cáo này là lựa chọn phạm vi cho một Human + Kidea, không phải DORA nói CI không có ích hoặc local đã tương đương mọi đặc tính của CI được bảo vệ.

- Build sạch, khóa công cụ/thư viện và giữ đúng artifact giúp giảm nhầm lẫn; chưa được gọi là bit-reproducible nếu chưa so sánh chứng minh. [Reproducible Builds definition](https://reproducible-builds.org/docs/definition/).
- [CMake Presets](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html) có thể chia sẻ cấu hình configure/build/test; [toolchain](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html) mô tả nền/biên dịch đích. Đây là khả năng công cụ, không phải quyết định thêm công cụ hoặc coi cross-compile thay mọi test trên Ubuntu.
- [SLSA Build Track](https://slsa.dev/spec/v1.2/build-track-basics) phân biệt provenance có thể bị giả với nền build hosted/cô lập mạnh hơn ở mức cao. Log/hash do cùng môi trường local tạo ra không mặc nhiên là bằng chứng độc lập chống can thiệp. Không yêu cầu Kidea đạt một cấp SLSA ở lượt này.
- Điều khiển deploy từ local không tự đáp ứng yêu cầu job dài/cảnh báo còn chạy khi đóng phiên AI. Script phải có cách nhận diện thao tác, dừng an toàn hoặc tiếp tục/tra kết quả ở môi trường thích hợp; mất kết nối không được replay mù. Không cần tự xây scheduler hoặc server Kidea để giữ nghĩa vụ này.

### Một bộ deploy chung không có nghĩa mọi nền chỉ khác địa chỉ

Giữ chung logic đối với cùng cơ chế triển khai; cấu hình chứa khác biệt môi trường. Khi service, database hoặc nền phân phối khác, script phụ/cách thực thi có thể khác, nhưng cùng chịu điều kiện đầu vào, quyền, kết quả và lỗi của project.

- Release là build kết hợp cấu hình đích; việc dùng cùng artifact giữa DEV/PROD không có nghĩa cấu hình phải giống hoặc cấu hình PROD đã được kiểm tra đầy đủ chỉ vì DEV đạt. [Build/release/run](https://12factor.net/build-release-run), [Config](https://12factor.net/config).
- Nếu adapter/framework nhúng môi trường vào build hoặc platform/signing khác, đó là artifact khác và cần bằng chứng tương ứng. Không hứa một binary dùng cho mọi OS hoặc nhúng config rồi thay file runtime là đủ.
- Toàn bộ script phụ/migration và dependency chi phối deploy phải có phiên bản rõ trong gói được kiểm chứng; PROD không lấy script từ master đang đổi hoặc tải lệnh latest không khóa.
- Config được custom phải có ràng buộc hợp lệ và đúng phạm vi; là dữ liệu được kiểm tra, không phải đường để tùy ý chạy lệnh hoặc mở quyền. Secret lấy từ cơ chế được phép, không nằm trong Git/log hoặc tham số bị lộ; cấu hình có thể giữ tham chiếu secret, không lộ giá trị.
- Xem trước kế hoạch không chứng minh deploy sẽ thành công. Ngay [Ansible check mode](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html) cũng phụ thuộc hỗ trợ của module và có ngoại lệ thực thi; tài liệu này chỉ minh họa giới hạn dry-run, không đề xuất bắt buộc Ansible.
- [Ansible error handling](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_error_handling.html) cho thấy có tình huống cấu hình đã đổi nhưng restart chưa chạy do bước khác lỗi. Kidea phải nhận diện triển khai dở thực tế, không suy tất cả thành công hoặc tất cả rollback chỉ từ một exit code.

### Nhánh bảo trì và ý nghĩa của việc xóa

Tag giữ phiên bản phát hành; branch là con trỏ tiến theo công việc. Xem [Git branch model](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell), [Git branch deletion](https://git-scm.com/docs/git-branch), [tag và force](https://git-scm.com/docs/git-tag).

Không tạo nhánh cho mọi release. Tạo khi thật sự cần duy trì dòng cũ tách khỏi master. Có thể dọn tên nhánh khi hết hỗ trợ nếu tag/source/artifact/receipt và khả năng điều tra/phục hồi cần thiết vẫn được giữ; nhánh không bắt buộc phải tồn tại chỉ để rollback một artifact đã lưu. Phải kiểm tra automation liên quan việc xóa ref trước thao tác. Đây là chính sách đang tư vấn, không là quyền xóa nhánh ngay.

Tác giả [Branch for release](https://trunkbaseddevelopment.com/branch-for-release/) ưu tiên sửa/test trên trunk rồi mang patch đến release branch khi áp dụng được. Cách user muốn chọn nền production trước vẫn khả thi; Kidea phải đối chiếu ý nghĩa bản sửa trên từng dòng còn được hỗ trợ, không buộc chép nguyên patch và không để quên fix trong release sau.

### Mức kiểm chứng trước khi công bố template dùng được

Không coi báo cáo này là đã xây/test script. Khi triển khai mẫu đầu, phải thử trên lab được phép tối thiểu các lớp tình huống: đường thành công; kiểm tra bắt buộc fail/skip; sai artifact/config/target/quyền; lỗi giữa các bước; mất kết nối sau tác dụng phụ; đọc lại kết quả; phục hồi theo đúng quyền và tương thích; đưa hotfix về master; giữ tag/artifact khi dọn nhánh. Case cụ thể/ngưỡng vẫn do task sở hữu và Human gate chốt, không thêm tiêu chuẩn đo số lượng tại đây.

## 3. Phạm vi đồng bộ và quyết định

### Phần đã đồng ý và phần còn mở

- Human đồng ý các điểm khác trong bản tư vấn 87b3ba7, gồm hướng một master phát triển chính, quyền thường lệ được chốt cho project, giữ đủ kiểm chứng/Human gate và nhận diện đúng bản phát hành. Không trình lại chúng như lựa chọn chưa được phản hồi.
- Hai điểm đang được tư vấn lại: không dùng dịch vụ CI ở phương án đầu, máy local điều khiển kiểm chứng/deploy với AI DEV và Human PROD; giữ nhánh bảo trì khi cần, kết luận đưa fix về master và dọn sau hết hỗ trợ.
- R3 thay gói r2 branch/merge đang xin duyệt. S01 vẫn IN_PROGRESS/IN_REVIEW; chưa khép toàn G3/G4/G5/G6 hoặc cấp quyền cho project cụ thể. G1/G2 về tổ chức tích hợp sẽ được đồng bộ nhất quán khi chốt phần thay thế; nghĩa vụ chất lượng G2 giữ nguyên.
- Giữ sáu năng lực phát hành/vận hành đã duyệt ngày 2026-09-10, đủ mười bước, ba bản đồ đặc tả/triển khai/đối chiếu hai chiều, ma trận backend/web/native, một việc hiện hành, lab kín/ngân sách 0 đồng và QUALITY chưa duyệt.

### Chủ sở hữu nếu chốt phương án

| Nơi | Phần cần đồng bộ |
|---|---|
| DESIGN 2.4/11; R04-T05; R05-T01; R08-T03 | Phân biệt điều kiện chung và cách thực thi từng project; không thêm kho profile/nguồn dữ liệu thứ hai hoặc viết trước mọi adapter |
| DESIGN G1/G2/G3; R01-T05/T06; KA-08/12/24 | Một master mặc định, quyền theo phạm vi, vị trí kiểm chứng đầy đủ không còn phụ thuộc bắt buộc vào merge branch Feature |
| R02-T03/T04/T09; R08-T02–T06; R09-T08/T11/T12; KA-08/13/24/28 | Nhận diện đầu vào/approval/operation, local kiểm chứng, Human chạy PROD, bằng chứng thật, lỗi dở và phục hồi |
| DESIGN G4/G6 và 7.1/7.3; R01-T07; R06-T07/T10; R09-T10/T13; KA-19/22/28 | Bản production, nhánh bảo trì, version bất biến, fix trên master, giữ tiến độ và điều kiện dọn đúng phạm vi |
| R10-T04–T07; KA-30 | Hướng dẫn, giới hạn thực thi đã chứng minh; template có đủ nội dung chưa đồng nghĩa một luồng đã chạy thật |

Lượt này chỉ cập nhật gói đang review trong DESIGN/ROADMAP và ghi báo cáo/answer.md. Không sửa các quy tắc G1/G2 đã duyệt hoặc bộ ACCEPTANCE/QUALITY; không tạo script/template thực thi, sửa CI/ruleset/credential, xóa branch, triển khai ứng dụng hoặc tác động repo pilot/Thuận Thiên. Tên task Build/CI được giữ làm căn cứ chưa áp dụng; khi chốt sẽ diễn đạt trung lập Build/kiểm chứng.

## 4. Phương pháp nghiên cứu

Dùng skill Search/Exa: 7 truy vấn ở ba hướng, tổng `numResults = 35`; không retry tìm kiếm. Có 35 URL kết quả khác nhau theo so sánh chuỗi, nhưng gồm biến thể/phiên bản của cùng tài liệu. Số này không có nghĩa 35 tài liệu độc lập đều được đọc toàn văn hoặc đều được dùng làm căn cứ. Fetch xác minh không cộng vào số tìm kiếm. Chỉ dựa vào tài liệu chính thức và tác giả phương pháp cho các kết luận kỹ thuật; bỏ nguồn tổng hợp/bán dịch vụ khỏi bằng chứng quyết định. Không dựa vào SLSA RC hay SemVer 1.0 cho kết luận hiện hành.

Các khuyến nghị local-only, giới hạn template và ranh giới quyền là suy luận cho Kidea từ các yêu cầu đã chốt và nguồn dưới đây; không phải cam kết giải pháp đã chạy hoặc an toàn tuyệt đối.

### Vai trò CI, deploy script và tách build/release/config — 10 kết quả

- [dora.dev/capabilities/continuous-integration/](https://dora.dev/capabilities/continuous-integration/)
- [dora.dev/capabilities/deployment-automation/](https://dora.dev/capabilities/deployment-automation/)
- [dora.dev/capabilities/continuous-delivery/](https://dora.dev/capabilities/continuous-delivery/)
- [docs.cloud.google.com/architecture/devops](https://docs.cloud.google.com/architecture/devops)
- [dora.dev/capabilities/trunk-based-development/](https://dora.dev/capabilities/trunk-based-development/)
- [12factor.net/build-release-run](https://12factor.net/build-release-run)
- [12factor.net/](https://12factor.net/)
- [github.com/twelve-factor/twelve-factor](https://github.com/twelve-factor/twelve-factor)
- [12factor.net/config](https://12factor.net/config)
- [12factor.net/dependencies](https://12factor.net/dependencies)

### Build local, lỗi triển khai và độ tin cậy bằng chứng — 15 kết quả

- [cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html)
- [cmake.org/cmake/help/latest/variable/CMAKE_CROSSCOMPILING_EMULATOR.html](https://cmake.org/cmake/help/latest/variable/CMAKE_CROSSCOMPILING_EMULATOR.html)
- [cmake.org/cmake/help/latest/manual/cmake-presets.7.html?highlight=presets](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html?highlight=presets)
- [cmake.org/cmake/help/latest/variable/CMAKE_CROSSCOMPILING.html](https://cmake.org/cmake/help/latest/variable/CMAKE_CROSSCOMPILING.html)
- [cmake.org/cmake/help/latest/prop_tgt/CROSSCOMPILING_EMULATOR.html](https://cmake.org/cmake/help/latest/prop_tgt/CROSSCOMPILING_EMULATOR.html)
- [docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_error_handling.html](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_error_handling.html)
- [docs.ansible.com/projects/ansible/12/playbook_guide/playbooks_checkmode.html](https://docs.ansible.com/projects/ansible/12/playbook_guide/playbooks_checkmode.html)
- [docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_execution.html](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_execution.html)
- [docs.ansible.com/projects/ansible/13/reference%5Fappendices/playbooks%5Fkeywords.html](https://docs.ansible.com/projects/ansible/13/reference%5Fappendices/playbooks%5Fkeywords.html)
- [docs.ansible.com/projects/ansible/13/playbook%5Fguide/playbooks%5Ferror%5Fhandling.html](https://docs.ansible.com/projects/ansible/13/playbook%5Fguide/playbooks%5Ferror%5Fhandling.html)
- [slsa.dev/spec/v1.2/build-requirements](https://slsa.dev/spec/v1.2/build-requirements)
- [slsa.dev/spec/v1.2-rc2/build-track-basics](https://slsa.dev/spec/v1.2-rc2/build-track-basics)
- [slsa.dev/spec/v1.2/verifying-artifacts](https://slsa.dev/spec/v1.2/verifying-artifacts)
- [slsa.dev/spec/v1.2/](https://slsa.dev/spec/v1.2/)
- [slsa.dev/spec/v1.2/build-provenance](https://slsa.dev/spec/v1.2/build-provenance)

### Nhánh bảo trì, hotfix và version — 10 kết quả

- [trunkbaseddevelopment.com/](https://trunkbaseddevelopment.com/)
- [martinfowler.com/articles/branching-patterns.html](https://martinfowler.com/articles/branching-patterns.html)
- [letsbuildsolutions.com/blog/devops/trunk-based-development-vs-gitflow-choosing-a-branching-strategy-that-ships/](https://letsbuildsolutions.com/blog/devops/trunk-based-development-vs-gitflow-choosing-a-branching-strategy-that-ships/)
- [www.travis-ci.com/blog/explaining-trunk-based-development/](https://www.travis-ci.com/blog/explaining-trunk-based-development/)
- [trunkbaseddevelopment.com/branch-for-release/](https://trunkbaseddevelopment.com/branch-for-release/)
- [semver.org/spec/v2.0.0.html](https://semver.org/spec/v2.0.0.html)
- [semver.org/](https://semver.org/)
- [github.com/semver/semver/blob/v2.0.0/semver.md](https://github.com/semver/semver/blob/v2.0.0/semver.md)
- [github.com/mojombo/semver/blob/eb9aac5/semver.md](https://github.com/mojombo/semver/blob/eb9aac5/semver.md)
- [semver.org/spec/v1.0.0.html](https://semver.org/spec/v1.0.0.html)

### Trang đọc bổ sung ngoài kết quả tìm kiếm

- [CMake Presets](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html).
- [Ansible check mode hiện hành](https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html).
- [SLSA Build Track v1.2](https://slsa.dev/spec/v1.2/build-track-basics).
- [Định nghĩa reproducible build](https://reproducible-builds.org/docs/definition/).
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).
- [Git branch](https://git-scm.com/docs/git-branch).
- [Git branch model](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell).
- [Git tag](https://git-scm.com/docs/git-tag).

URL `https://slsa.dev/spec/v1.2/levels` không fetch được, không dùng làm bằng chứng; đã thay bằng trang stable Build Track ở trên. Twelve-Factor là nguồn lâu đời dùng cho nguyên tắc build/config/release, không dùng để khẳng định phiên bản công cụ hôm nay.

