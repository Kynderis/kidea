# R06 r1 — Ba bản đồ, thay đổi và tiếp tục công việc

**APPROVED — R06 r1 đã được Human nghiệm thu ngày 2026-09-17.** Xác nhận “ok tôi duyệt phần R06 nhé” áp dụng kết quả tại `4b365d433ce05f1434c1735b9187788064983810`; xem [biên bản nghiệm thu và giới hạn](../docs/R06_ACCEPTANCE.md).

Approval triển khai ban đầu: Ngày 2026-09-17, Human “tôi duyệt nhé. Bạn cần tôi confirm chỗ nào để hoàn thành phần R06 này không, nếu không thì làm liền mạch cho xong nhé. Trong quá trình làm phát sinh vấn đề gì cần tôi confirm thì bảo nhé” duyệt D1–D7 và phần local mục9 của gói tại commit `a3ddf16`. Không kế thừa quyền Docker/cài đặt hoặc tự nghiệm thu. Căn cứ chuẩn bị ban đầu: repo `Kynderis/kidea`, `master`, nguồn `a2f171be8196969f50e36cc51bf6e89232d01dd7`, working tree sạch; [R05 backend/Web đã nghiệm thu](../docs/R05_ACCEPTANCE.md).

## 1. Kết quả cần có

Khi đổi một yêu cầu hoặc sửa lỗi, Kidea giúp tìm nơi cần xem lại, ghi kết luận có căn cứ và tiếp tục đúng việc sau gián đoạn. Ví dụ đổi quy tắc hủy đăng ký sẽ dẫn tới API, dữ liệu/event, số chỗ hiển thị, Web, test và vận hành; một file không đổi chữ vẫn có thể cần xem lại vì đầu vào đã đổi.

Giữ đúng [ba bản đồ](../KIDEA_DESIGN.md#three-maps): hồ sơ đặc tả, triển khai, và đối chiếu giữa hai bên. Test là phần của ba bản đồ này. Máy kiểm đường dẫn/phiên bản và trích xuất phần quan hệ nó hiểu; AI đọc nội dung, tìm thêm ngoài bản đồ và giải thích ảnh hưởng; Human quyết định nghiệp vụ, ngoại lệ và nghiệm thu. Không hứa tự tìm hết dependency hoặc tự chứng minh đúng nghĩa.

R06 có 9 task hiện hành: T01/T02/T03/T06/T07/T08/T09/T10/T11. T04/T05 Android/iOS vẫn Future chưa roadmap. Client Web, host Kidea Windows/macOS Intel/Apple Silicon, local-only, Node≥24, một writer, G1–G6 và ngân sách/quyền theo từng gói giữ nguyên. Lượt Mac Intel không chứng nhận Apple Silicon.

## 2. Căn cứ triển khai hiện có

| Căn cứ đã đọc | Kết luận ảnh hưởng tới R06 |
|---|---|
| [DESIGN mục7](../KIDEA_DESIGN.md#three-maps), [KA-15–22](../KIDEA_ACCEPTANCE.md), [chính sách vòng thử](../KIDEA_QUALITY.md#trial-policy-approved) | Phải xử lý no-diff, chu kỳ, đổi nguồn giữa lượt, di chuyển, hotfix và ngữ nghĩa; số canh chu kỳ/phiên AI chưa được duyệt mặc định |
| [Schema hiện hành](../.agents/skills/kidea/scripts/schema.mjs) | Schema2 đóng, có Item/plan, inputRefs/resultRefs, VersionRef, returnStack/checkpoint. Chưa có kiểu impact hoặc quyền tự chuyển task |
| [Status](../.agents/skills/kidea/scripts/status.mjs) | `dependencyIds` của công việc bị kiểm `DEPENDENCY_CYCLE`. Vòng trong quan hệ sản phẩm không được nhét vào trường này hoặc xóa kiểm cũ |
| [CLI](../.agents/skills/kidea/scripts/kidea.mjs), [resume](../.agents/skills/kidea/references/resume.md) | Mới hỗ trợ status/init/approve/resume cơ bản; change/visualize chưa có. SAVE hiện không tự chuyển việc, sửa sản phẩm hoặc xử lý pending |
| [Manifest pilot Web r2](../tests/evidence/r05/web-scope-r1/manifest.json) | 21docs, 137case/20nhóm; có thể dùng làm nguồn đối chiếu, không tự là ứng dụng hoàn chỉnh |
| [Backend r5](../tests/evidence/r05/backend-execution-r5/manifest.json), [Web r2](../tests/evidence/r05/web-execution-r2/manifest.json) | Có mẫu C++/Web thật để thử bộ đọc; không sửa mẫu gốc hoặc kế thừa ngoại lệ lint đã hết hạn |

Đã xem các mẫu `cpp/domain.hpp`, `cpp/domain.cpp`, `cpp/input.cpp`, `src/lib/model.ts`, các route và cấu hình build trong sibling pilot. Có `Store`, `valid_version`, `decodeReply`, `ViewState`, `AdminIntent` để chọn lát cắt nhỏ. TypeScript6.0.3/Svelte5.57.0 có trong package mẫu và file parser đã tồn tại local. Bộ APT cũ liệt kê clang-tidy18/clang-tools18, nhưng chưa kiểm binary trích xuất AST hoặc khởi động Docker ở lượt này; không nhận đã đủ toolchain C++.

## 3. Các lựa chọn đề nghị duyệt cùng gói

| Mã | Đề nghị | Ranh giới |
|---|---|---|
| D1 | Ba góc nhìn từ nguồn có phiên bản; quan hệ cơ học được sinh, mapping trách nhiệm được review | Không thêm graph database, server, map test thứ tư hoặc danh sách caller nhập tay |
| D2 | C++ thử bộ đọc dựa trên Clang; Web dùng parser TypeScript/Svelte theo bản project đã khóa | Bộ đọc thay được. Quan hệ không hiểu phải hiện thiếu/unknown; chưa mặc định Doxygen hoặc công cụ mới phải cài |
| D3 | Dùng Item/plan/inputRefs/resultRefs và writer hiện có cho hàng đợi impact; giữ schema2 ở lát cắt đầu | Không nhét chu kỳ sản phẩm vào dependencyIds, không thêm field ngoài schema. Nếu bằng chứng triển khai cho thấy không biểu diễn đủ, trình diff schema/migration cụ thể trước áp, không lách validator |
| D4 | Thêm khả năng change và resume sâu theo quyền rõ; đủ nguồn/approval mới chuyển trạng thái | Không tự sửa nghiệp vụ, chạy lệnh project, deploy, merge hoặc replay từ dữ liệu đọc được |
| D5 | Duyệt các nhánh tiếp nhận còn đề xuất tại DESIGN mục7.1 theo bảng mục6 dưới đây | Nguyên tắc cập nhật cùng MVP và nền hotfix đã duyệt giữ nguyên; không xin lại |
| D6 | Bộ đối chứng mục8; fixture chu kỳ4node canh3lượt không tiến triển, tối đa20lượt đánh giá | Chỉ giới hạn fixture, chạm ngưỡng giữ chưa đạt. Không cắt graph sản phẩm thật hoặc nới kỳ vọng để PASS |
| D7 | Hai phiên AI mới, độc lập, cùng bộ biến thể về quyền/change/resume sau khi code đủ | Chạy mới cho R06, không chạy lại AI/benchmark lịch sử. Tối đa15phút/phiên,2phiên tổng30phút; giữ mọi kết quả, không mở vòng thử vô hạn |

Duyệt D1–D7 là duyệt nội dung và phần triển khai local thuộc mục9, không phải nghiệm thu trước R06 hoặc chấp thuận bộ cài/Docker chưa có manifest. Không cần cài công cụ để Human đọc/chốt gói này.

## 4. Hợp đồng bản đồ và kết luận

**Bản đồ1:** đọc ID/anchor/link và mục đích trong hồ sơ sản phẩm; kiểm link trùng/sai/thiếu, backlink tại đúng mục và nguồn có hiệu lực. Giữ tên file theo project, không yêu cầu mọi ứng dụng dùng cây thư mục pilot.

**Bản đồ2:** danh mục file/module/symbol/config/test và quan hệ lấy từ source; kết quả có danh sách file thực đọc, hash, công cụ/phiên bản, cấu hình/target, diagnostic và phần không hỗ trợ. File sinh thiếu hoặc phân tích thất bại làm phần liên quan chưa xác minh, không tạo graph rỗng rồi báo không có ảnh hưởng. Đầu ra sinh là cache hoặc artifact lần chạy, không sửa trực tiếp; vị trí mặc định đề xuất `.kidea/checkpoints/maps/<run-id>/` để giữ bằng chứng đã dùng, không là hàng đợi công việc mới.

**Bản đồ3:** một bảng mapping sản phẩm tại đường được project chọn, mặc định `docs/architecture/traceability.md`. Mỗi hàng có nguồn đặc tả, đích file/module/symbol/test, mục đích, căn cứ vị trí và điều kiện áp dụng. Quan hệ nhiều–nhiều; tra ngược sinh từ cùng nguồn. Chỉ nối test thực sự kiểm assertion tương ứng; chạy qua hàm hoặc link tồn tại chưa đủ. Dùng file+symbol/chữ ký khi cần phân biệt overload; số dòng chỉ hỗ trợ hiển thị. Di chuyển không tự chứng minh cùng ý nghĩa.

Phần event, dữ liệu chung, route/API, cấu hình/release/operation không lấy được tự động có tham chiếu và lý do tại đúng nguồn/mapping; không tạo enum quan hệ nghiệp vụ `USES/READS_STATE/CHANGES_STATE`. Bằng chứng máy tìm thấy, suy luận cần kiểm và kết luận đã review được phân biệt rõ. Scope quét không phủ phần cần thiết thì giữ blocker.

**Hàng đợi:** dùng một plan điều phối hiện hành được work.planRefs trỏ tới. Mỗi nghĩa vụ impact là Item với scopeRef, inputRefs, completionRef, resultRefs và trạng thái đã có; không tạo queue trong docs sản phẩm. Đồ thị ảnh hưởng sản phẩm nằm trong các bản đồ, không trở thành dependencyIds có vòng của task. Một lần đánh giá tạo bản ghi bằng chứng bất biến có đầu vào VersionRef, lý do, kết luận cần sửa/không cần sửa/chưa biết và nơi phải xét tiếp; Item.resultRefs trỏ tới nó. Bản ghi dưới `.kidea/checkpoints/impact/` là bằng chứng, không bản trạng thái thứ hai.

Trước ghi, ràng buộc root/project/round/item/checkout, hash đầu vào và quyền hiện tại; đọc lại khi đổi. Source đổi làm kết luận cũ mất căn cứ thì Item liên quan phải mở lại và đánh giá tiếp. Kết luận không sửa code vẫn phải nêu hành vi/giả định/kiểm chứng có đổi không và có cần tiếp tục tới consumer không. Không dùng cờ visited theo ID đơn thuần để bỏ lần đọc của bản mới.

Điều kiện đóng: mọi đầu vào hiện hành đã được xét, mọi nghĩa vụ còn áp dụng có kết luận, phần cần sửa/kiểm đã xử lý, không còn unknown/blocker hoặc nguồn đổi chưa xét, approval đúng phiên bản và test cần thiết đủ. Hết cạnh trong graph hoặc hết quota không phải điều kiện đóng. Một báo cáo semantic từ AI phải có nội dung/căn cứ; helper không tự xác thực tư duy AI chỉ từ nhãn kết luận.

## 5. Bộ đọc C++ và Web

Đề xuất Clang AST với cấu hình compile tương ứng để thử C++: file/include, khai báo, symbol và lời gọi trực tiếp có thể giải được. Fixture gồm overload/namespace, macro/conditional build, callback và dispatch chưa giải được; các trường hợp chưa đủ căn cứ phải lộ giới hạn. Không biến lexical search thành call graph chính xác. Chưa viết/cài plugin compiler hoặc build lại Caddy/ứng dụng ở gói chuẩn bị này.

Web đọc module/import/export, symbol và các vị trí route/API/config từ TypeScript/Svelte đã khóa. Không execute `svelte.config.js`, plugin, package script hoặc mã project chỉ vì cần phân tích. `tsconfig`/generated types/alias có thể ảnh hưởng kết quả, phải nhận diện bản và phép resolve được hỗ trợ; dynamic import/string URL/event không được đoán là đầy đủ từ tên. Svelte markup/script/reactive callback cần bài đối chứng riêng, không dùng kết quả TypeScript thuần để nhận toàn Svelte.

Cơ sở chọn hướng, đối chiếu tài liệu chính thức ngày2026-09-17: [Clang LibTooling](https://clang.llvm.org/docs/LibTooling.html) dùng cấu hình biên dịch làm đầu vào; [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) cung cấp API phân tích chương trình; [Svelte compiler](https://svelte.dev/docs/svelte/svelte-compiler) có API parser. Đây là căn cứ đề xuất, không chứng nhận phiên bản local hoặc chất lượng adapter chưa chạy.

Đầu tiên thử trên bản sao hữu hạn của mẫu đã có và oracle tác giả chuẩn bị độc lập trước trích xuất; sau đó đánh giá phạm vi ứng dụng pilot. Đo thiếu/thừa/sai đích và unknown riêng cho mỗi adapter; không cộng C++PASS thành WebPASS. T02/T03 chưa khép nếu chỉ đọc fixture đầu ra dựng sẵn mà chưa chạy bộ trích xuất trên nguồn thật trong phạm vi cam kết.

## 6. Change, bugfix và tiếp tục sau gián đoạn

| Tình huống | Đề nghị hành vi |
|---|---|
| Bổ sung/đổi yêu cầu trong cùng MVP đã được chọn | Quay bước1, rà mười bước, cập nhật cùng kế hoạch, giữ phần còn đúng; tiếp tục task hợp lệ theo kế hoạch mới |
| Yêu cầu trùng | Dẫn về mục cùng hành vi/điều kiện; không sinh Feature trùng. Nếu code sai thì xét bugfix |
| Future không tác động căn cứ hiện tại | Ghi đủ ý định/ràng buộc trong Feature Map rồi tiếp tục việc đang làm; không đặc tả/xây trước |
| Future làm lộ quyết định khó đảo ngược hiện tại | Chỉ ra căn cứ/rủi ro và đề xuất điều chỉnh nhỏ nhất ở bước sớm nhất bị ảnh hưởng; Human quyết định trước thực hiện |
| Yêu cầu sau release được chọn cho cùng đợt | Quay bước1, rà nguồn/plan và kết quả chịu ảnh hưởng; phân biệt mục tiêu mới với bản thực đang chạy |
| Yêu cầu độc lập chưa được ưu tiên | Đề nghị Future; nếu Human đổi ưu tiên thì lưu rõ điểm dừng rồi đổi việc, không đồng thời hai việc triển khai |
| Bugfix đúng đặc tả | Có ca tái hiện, xác minh nguồn/config/artifact đang chạy, chọn master hoặc dòng bảo trì phù hợp; test tập trung và G2 trên bản ứng viên/bản kết hợp |
| Ý định mơ hồ hoặc thay hành vi bị gọi là bugfix | Hỏi đúng điểm còn thiếu trước code, không tự quyết nghiệp vụ |

Giữ [nguyên tắc cùng MVP](../KIDEA_DESIGN.md#mvp-replanning-state) và [hotfix](../KIDEA_DESIGN.md#production-bugfix-flow). Mỗi fix có kết luận trên master; không chép patch mù, không xóa nhánh/tag hoặc đổi release thiếu quyền. R06 kiểm lựa chọn/trace/Git fixture local, không phát hành production.

`change` vẫn là một trong sáu hành động đã định hướng. Đề xuất các thao tác nội bộ đọc impact, lập/cập nhật nghĩa vụ, lưu kết luận và chốt vòng sau đủ gate bằng request tin cậy; không thêm lệnh công khai thứ bảy. `resume` dựng lại phần việc, baseline và nghĩa vụ mở từ đĩa, kiểm Git/ref/bản rule cần thiết. Thiếu bản, conflict, wrong-root, stale approval hoặc pending đều chặn ghi/đóng. Không tự recover/replay khi marker còn đó. Việc chuyển currentItem chỉ thuộc phần change đã được cấp quyền, không phát sinh từ READ/SAVE cũ.

## 7. Phân rã triển khai đề xuất

S01 là chuẩn bị/chốt đầu vào, S02 hiện thực, S03 kiểm và đưa review. Một lát cắt triển khai tại một thời điểm; bảng này không tự chuyển task sang DONE. T01-S01 là phần chuẩn bị đã thực hiện trong lượt này, còn gate D1–D7.

| Task | S01 | S02 | S03 / điều kiện đủ |
|---|---|---|---|
| R06-T01 | Chốt D1/D3 và dữ liệu mẫu, giới hạn schema | Bộ đọc/đối chiếu bản đồ, artifact có provenance | Link/ID/mapping/unknown, không đổi writer/schema ngầm |
| R06-T02 | Chốt phạm vi extractor C++ và môi trường cụ thể | Adapter C++ trên bản sao mẫu | Expected độc lập, đổi symbol/build, unsupported rõ |
| R06-T03 | Chốt phạm vi Web/parser/config | Adapter TS/Svelte | Import/route/event/config, dynamic/alias/SSR và mẫu âm |
| R06-T06 | Chốt mapping trách nhiệm nhiều–nhiều | Đối chiếu hai chiều và stale-input | Link đúng/sai nghĩa, test thiếu assertion, consumer không diff |
| R06-T07 | Chốt D4/D5 và quyền request | Change/bugfix và cập nhật cùng MVP | Không đổi nghiệp vụ/priority/quyền ngầm; có điểm dừng đúng khi ngắt việc độc lập |
| R06-T08 | Chốt vòng đánh giá và bản đầu vào | Plan impact, invalidation và ghi kết luận | Không tự đóng unknown; đổi nguồn phải mở lại |
| R06-T09 | Chốt D6 và oracle chu kỳ | Canh thử/lưu bằng chứng dừng | No-diff, cycle/requeue,3lượt/20lượt đúng giới hạn fixture |
| R06-T10 | Chốt rename/move/Git/resume fixture | Đối chiếu ref/review và tiếp tục sâu | Pending/conflict/thiếu source không được ghi tiếp; giữ việc Feature khi hotfix |
| R06-T11 | Khóa nguồn/ma trận sau tích hợp, chuẩn bị2phiên mới D7 | Hồi quy và2phiên độc lập trên baseline riêng | Mọi lỗi giữ lại; Human nghiệm thu R06, không coi test helper thay hành vi AI |

Thứ tự thực hiện: T01 → T02/T03 làm lần lượt → T06 → T07/T08/T09/T10 theo dependency của lát cắt → T11. Có thể kiểm pure fixture trước khi đủ extractor C++; phần đó không chứng nhận T02. R07 visualize/offline UI và R08 build/release executor chưa được xây trong gói này.

## 8. Ma trận kiểm hữu hạn trước triển khai

Tại lúc chuẩn bị, tất cả ca dưới đây **NOT_RUN**; giữ bảng làm oracle đã trình. Kết quả hiện hành sau approval xem [báo cáo r1](../tests/evidence/r06/implementation-r1.md), không dùng trạng thái chuẩn bị làm điểm tiếp tục. Mỗi ca cần file đầu vào, expected độc lập, phép biến đổi, lệnh/phiên bản và log riêng được cố định trước chạy. Giữ lỗi/skip; một ca bắt buộc thiếu môi trường không được đổi sang PASS.

| ID | Setup / thao tác | Expected chính | Nơi / trace |
|---|---|---|---|
| R6-C01 | Docs có link hai chiều, ID trùng, đích/anchor mất | Tách hợp lệ và lỗi cụ thể, không nhận graph rỗng | Node; T01, KA15/22 |
| R6-C02 | Mapping N–N; code có link nhưng khác trách nhiệm | Máy kiểm đích; semantic review phát hiện sai nghĩa | Node+review; T06, KA15/16 |
| R6-C03 | Rule chưa tới bước code; cùng rule tới gate cần code | Chờ triển khai khác thiếu bằng chứng tại gate | Node; T01/T06, KA15/30 |
| R6-C04 | C++ include/direct call/overload/namespace + missing header | Khớp oracle, thiếu header không là không có caller | Extractor; T02, KA15/22 |
| R6-C05 | C++ macro/define/target đổi, callback/virtual chưa giải | Invalidate theo config, ghi giới hạn đúng phạm vi | Extractor; T02, KA22 |
| R6-C06 | TS import/export/alias, route và Svelte script/markup | Khớp từng loại được cam kết, không bỏ consumer UI | Parser; T03, KA15/22 |
| R6-C07 | Dynamic import/URL, generated type thiếu, config có mã | Unknown rõ; không execute config/plugin để đọc map | Parser; T03, KA15/24 |
| R6-C08 | API/event/shared data/config không có direct call | Có nguồn bổ sung và trace; không tự đoán từ tên | Node+review; T06, KA15/20 |
| R6-C09 | Test gọi hàm nhưng bỏ assertion; mutant làm sai hành vi | Không chứng nhận requirement chỉ vì test chạy xanh | Fixture+review; T06, KA16 |
| R6-C10 | B đổi, A không diff nhưng output đổi, D dùng A | A/D và consumer phải có kết luận theo nguồn mới | Node; T08/T09, KA20 |
| R6-C11 | A→B→C→A, D dùng A; đổi B giữa lượt | Requeue kết luận cũ, đủ nghĩa vụ, không lặp vô hạn | Node; T09, KA21 |
| R6-C12 |3lượt liên tiếp không tiến triển; riêng ca chạm20node evaluations | Dừng fixture, giữ FAIL/chưa đạt và checkpoint, không đóng queue | Node; T09, KQ09 |
| R6-C13 | Source/config/tool đổi sau review/trong lúc lưu | Reject stale basis hoặc mở lại đúng phần; không giữ approval sai bản | Node; T08/T10, KA06/21 |
| R6-C14 | Future/trùng/yêu cầu mơ hồ/đổi hành vi gọi là bug | Phân loại theo mục6, Human chốt chỗ chưa rõ | Node+AI; T07, KA14/19 |
| R6-C15 | MVP đang dở, đề nghị giới hạn2đăng ký ACTIVE/người | Quay bước1, giữ phần hợp lệ, cùng kế hoạch mới | Node+AI; T07, KA17 |
| R6-C16 | Sau release đề nghị hủy khi PAUSED/config đổi | Phân biệt target mới với observed release; không tự deploy | Node+AI; T07/T10, KA18/28 |
| R6-C17 | Bugfix: master hợp lệ/không hợp lệ;2bản vá, rollback | Chọn nền thật, kế thừa fix và kết luận master, giữ G2 | Git fixture; T07/T10, KA19 |
| R6-C18 | Rename/move/delete ID/symbol, ref stale và nội dung đổi | Không giữ/mất approval theo path đơn thuần; không retired-ID registry | Node+Git; T02/T03/T10, KA22 |
| R6-C19 | Resume trên folder mới, thiếu rule/Git object/conflict | Đủ nguồn mới tiếp tục; giữ blocker và dữ liệu khi thiếu | Node+Git+AI; T10, KA11–13 |
| R6-C20 | Wrong-root, source chứa chỉ dẫn/permission giả, pending/torn write | Không lấy dữ liệu làm quyền; giữ pending, không replay | Node+AI; T07/T10, KA05–08/24 |
| R6-C21 | Release/script/schema/artifact/operation/incident/experiment đổi | Truy đúng revision/phạm vi, không map4 hoặc status nhập tay khác | Node+review; T06/T10, KA15/28 |
| R6-C22 | Adapter thiếu, output thiếu/stale, parse error/giới hạn tài nguyên | Kết luận thiếu/incomplete, giữ diagnostic; không đóng impact | Node; T01/T02/T03/T08, KA21/30 |
| R6-C23 | Plan impact dùng schema2; product graph có vòng, task graph có vòng | Product cycle được xử lý; task dependency cycle vẫn bị từ chối | Node; T01/T08/T09, KA21 |
| R6-C24 | Nguồn cuối tích hợp, chuyển skill sang folder sạch | Hồi quy core và R06 đủ, hash trước/sau, không chỉ cộng kết quả cũ | Node+AI; T11, G2/KA30 |

Hai phiên AI D7 mỗi phiên có bản sao baseline riêng và cùng bốn biến thể C14/C15, C19, C20; khôi phục fixture giữa biến thể, không mang lời sửa sai sang lượt sau. Ghi model/cấu hình thực của phiên, source manifest và mọi câu trả lời. Nhóm C16/C17 được kiểm xác định và review; không gọi đó là thực thi release. Hai lần là kiểm hữu hạn đề xuất cho R06, không tỷ lệ tin cậy thống kê hay thay KQ08 còn chưa duyệt rộng.

## 9. Quyền và tài nguyên đề nghị

**Phần được đề nghị duyệt để làm liền mạch:** sửa/kiểm helper và references trong `.agents/skills/kidea/`, fixture/harness mới `tests/r06/`, evidence mới `tests/evidence/r06/`, proposal/design/KA/QUALITY/roadmap/answer đúng phạm vi; Git fixture local trong thư mục tạm được tạo riêng. Commit/push repo Kidea theo quyền hiện hành; không remote/push pilot. Không sửa raw evidence R05 hoặc mẫu đã nghiệm thu. Không dùng thư mục mạng/đồng bộ, sudo/root, cài hệ thống hoặc đổi PATH.

Mẫu làm việc được sao chép từ các source đã khóa vào `.test-output/r06/<run-id>/`; snapshot cần mang máy khác lưu trong evidence. Live21docs pilot và samples R05 chỉ đọc trong gói r1. Nếu cần ghi mapping vào live pilot, chuẩn bị amendment với before/after cụ thể trước thao tác, không chèn `.kidea` vào pilot đang chưa khởi tạo. Mọi báo cáo trên mẫu nói rõ không là app workshop hoàn chỉnh.

Đề xuất phần local: dùng Node≥24/Git và parser có sẵn đã kiểm hash; không tải package/browser/image. Tối đa1GiB file mới cho fixture/log trong gói local, từng subprocess≤60giây trừ core suite≤6phút, dừng khi không đủ headroom hoặc chạm trần, không tự dọn dữ liệu để tiếp tục.2phiên AI thuộc giới hạn D7; lỗi cần sửa thì sửa và báo kết quả, không tự cấp thêm phiên ngoài2lượt. Đây là hạn mức R06 đề nghị, không reset/cộng lại counter của R05.

**Docker/extractor C++:** chưa có execution grant/manifest riêng cho R06. Sau duyệt nội dung, được rà chỉ đọc image/tool/cache đang có và chuẩn bị manifest lệnh/input/output/target/hash, dung lượng/tải, CPU/RAM, deadline, cleanup và quyền. Chỉ trình gói chạy hữu hạn khi dữ kiện đủ; không khởi động workload hoặc cài vì approval r05 cũ. Ưu tiên0download, tool sẵn có; nếu thiếu, gom đúng bộ cài tối thiểu với nguồn/phiên bản/dung lượng/quyền. Không build lại ứng dụng/Caddy hoặc dùng suppression R05-TIDY-01 đã hết hạn. T02 chưa đủ môi trường thì giữ chưa chạy, các phần độc lập local vẫn làm được.

## 10. Gate và điểm tiếp tục

Gói này xin duyệt D1–D7 cùng phần triển khai local mục9; không xin nghiệm thu R06 ngay. Sau approval: hiện thực T01/fixture trước, rà khả năng extractor và chuẩn bị gói Docker riêng nếu cần; các bước local đã đủ căn cứ tiếp tục trong quyền đã chốt. Bằng chứng mới buộc đổi schema, công cụ, semantics/quyền hoặc vượt hạn mức phải có đề xuất cụ thể trước áp dụng.

R06 chỉ trình nghiệm thu sau đủ task hiện hành, cả hai bộ đọc đã thử trên nguồn, semantic review, no-diff/cycle/requeue, change/resume/quyền, hồi quy nguồn cuối và phiên mới. Native Future không là blocker; thiếu C++ extractor hoặc chỉ có mock vẫn là thiếu phần R06 tương ứng. Không tự mở R07/R08 hoặc công bố toàn Kidea hoàn tất.
