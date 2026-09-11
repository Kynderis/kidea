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

[Bản tư vấn, nguồn và phạm vi đồng bộ tài liệu](https://github.com/Kynderis/kidea/blob/master/exa-results/kidea-local-delivery-profiles-2026-09-11.md).

<oai-mem-citation>
<citation_entries>
MEMORY.md:52-52|note=[repository scoped answer publication reverified]
MEMORY.md:62-63|note=[previous release advice and evidence boundaries checked against current sources]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
