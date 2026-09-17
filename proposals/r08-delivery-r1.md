# R08 r1 — hướng dẫn kế hoạch, code, release và vận hành

Ngày2026-09-17. **IN_REVIEW — chờ duyệt D1–D3 cho lát cắt r1; chưa duyệt toàn bộ thực thi R08.** Human “ok” giao chuẩn bị gói sau [nghiệm thu R07](../docs/R07_ACCEPTANCE.md). Căn cứ: `Kynderis/kidea`, `master`, `62889648ac7a3a2bd979a12bbb539f769763e729`, checkout sạch trước chuẩn bị.

Nguồn quyết định: [R08](../KIDEA_ROADMAP.md#r08), [G2](../KIDEA_DESIGN.md#feature-final-check), [version](../KIDEA_DESIGN.md#product-version), [G6](../KIDEA_DESIGN.md#release-records), [KA-23/27/28](../KIDEA_ACCEPTANCE.md), [hướng dẫn bước8](../.agents/skills/kidea/references/coding-testing.md). Những nguyên tắc này đã được duyệt; r1 không xin duyệt lại hoặc thay quyền DEV/PROD.

## 1. Kết quả cần đạt và hai lát cắt

Kidea cần hướng dẫn được đường đi từ kế hoạch đã chọn tới thay đổi có bằng chứng, bản phát hành xác định và kết quả vận hành được đọc lại. Ví dụ Web đổi nhưng backend giữ nguyên: plan chỉ rõ phần cần làm, gate cuối vẫn kiểm toàn dự án theo G2; release trỏ đúng hai artifact; mỗi lần triển khai có ID/revision/target và quan sát riêng. Backend chưa xác nhận không được biến thành toàn release thành công.

**R1 — chuẩn hóa hướng dẫn và kiểm hồ sơ:** viết hướng dẫn bước9–10, mẫu thông tin cần có và ma trận tình huống; nối vào skill; rà bằng chứng/nguồn R05–R07 hiện có và chạy kiểm local hữu hạn theo D3. Không gọi việc này là deploy hoặc restore thật.

**R2 — gói lab thực thi, chuẩn bị sau khi đầu vào r1 đủ:** xác định đúng nguồn/profile/image/artifact/config/script chính-phụ, target, cách inject lỗi, bằng chứng đọc lại, tài nguyên và quyền trước trình chạy. KA-28 yêu cầu gửi lệnh–đọc lại–lỗi–phục hồi trên lab thật; giữ R08-T03–T06 mở phần này. Không tự đẩy toàn bộ kiểm bắt buộc của R08 sang R09 hoặc dùng mô phỏng file để nhận lab PASS. R09 vẫn kiểm trên sản phẩm pilot thật và giữ gate view R09-T14 đã nhận từ R07.

## 2. Ba mục cần duyệt cho r1

| Quyết định | Phạm vi đề nghị |
|---|---|
| D1 — đầu ra | Thêm `.agents/skills/kidea/references/delivery.md` cho bước9–10, nối từ SKILL.md/coding-testing.md; đồng bộ DESIGN khi cần làm rõ cách áp dụng quyết định có sẵn. Mẫu/checklist phục vụ từng project, không dựng framework deploy hoặc ép công nghệ/quy ước của pilot lên mọi ứng dụng |
| D2 — kiểm có giới hạn | Lập oracle trước soạn kết quả; review các tình huống C01–C14 ở mục5, gắn từng quyết định với nguồn và quyền. Dùng schema2/Ref/VersionRef hiện có để kiểm cấu trúc khi cần; không đổi schema, thêm action hoặc mở writer/executor sản phẩm. Kiểm hồ sơ không chứng nhận hành vi AI mới hoặc deployment thật |
| D3 — quyền và ngân sách r1 | Sửa tài liệu/skill và harness kiểm local của Kidea; đọc nguồn/bằng chứng hiện có, dùng bản sao hữu hạn khi cần, không sửa live pilot. Node≥24 đã có;0tải/cài mới,0Docker/cloud/deploy,0AI trial mới. Tối đa256MiB output thêm,30phút mỗi lượt công cụ,2lượt kiểm đầy đủ của r1 trên nguồn cuối; giữ mọi FAIL/PASS. Core và kiểm r1; R06/R07 chỉ đối chiếu nguồn/bằng chứng nếu runtime không đổi. Nếu phát hiện cần đổi runtime hoặc vượt phạm vi/quota, giữ phát hiện và trình gói điều chỉnh cụ thể |

Approval r1 không là approval tạo kế hoạch nghiệp vụ pilot, code ứng dụng, tạo tag, chạy script release hoặc bắt đầu R2. Commit/push hồ sơ Kidea tiếp tục theo quyền repo hiện hành.

## 3. Nội dung hướng dẫn phải có

**Kế hoạch:** từ phạm vi/AC đã duyệt tách phase/task/subtask; mỗi việc có dependency, input/output, ca kiểm, gate và điều kiện dừng. Bao phủ backend/Web/admin/ops/SEO theo project; phần chưa phân rã không là0việc còn lại. Kế hoạch và quyền bắt đầu code là hai căn cứ riêng. Khi cần chuyển metadata, chỉ dùng capability được hỗ trợ và đúng quyền; không gọi writer nội bộ hoặc ghi hộ trạng thái để giả helper đã làm.

**Code và kiểm:** đọc task/rule/nguồn hiện hành, hiện thực lát cắt, kiểm tập trung/ảnh hưởng, cập nhật mapping/evidence, review đúng bản. Giữ task fail/skip/chưa đủ ở trạng thái chưa hoàn tất. Sau mỗi Feature hoàn chỉnh chạy toàn dự án kể cả phần không đổi; sửa hoặc đổi đầu vào thì chạy lại toàn lượt cuối theo G2. Build/release/bản kết hợp có gate riêng; master/WIP không tự thành bản phát hành. Đổi scope/bugfix/incident dùng change và nguồn hiện hành, không tạo tracker phụ.

**Môi trường và build:** chuẩn bị sớm bộ lệnh dùng lại với nguồn/toolchain/config/target cố định. Backend Docker local; performance/cloud chỉ khi có host/quyền. Web browser/viewport do project xác định, không lấy Chrome-only của UI Kidea thay ma trận ứng dụng. Hướng dẫn phải phân biệt tác vụ helper metadata với công cụ sản phẩm do agent/Human chạy trong quyền riêng; không tự quảng bá helper là executor.

**Release:** version sản phẩm/thành phần/nhận diện build và revision hồ sơ khác nhau; giữ artifact không đổi, không build lại chỉ vì version chung tăng. Cố định toàn bộ source/artifact/config/schema/script chính-phụ/migration và approval trước thực thi; đổi đầu vào mở revision/review/kiểm mới. Một điểm vào triển khai gọi script phụ theo loại thành phần, cùng logic DEV/PROD và config/quyền tách biệt; không `latest`, pull/rebuild tại PROD hoặc dời tag đã phát hành.

**Thực thi và phục hồi:** AI DEV trong quyền đã cấp; Human chọn đúng tổ hợp/target và trực tiếp chạy bộ script PROD đã xác minh. Preflight hiện cũ→mới, bảo đảm không chồng lượt, quyền/target/artifact/config/schema/readiness/khôi phục rõ. Retry có ID mới và đúng revision, giữ lần lỗi/chưa xác nhận. Sau mất kết nối phải đối chiếu trạng thái thực trước lặp; không replay migration hoặc mặc định rollback app khôi phục database.

**Đọc lại và vận hành:** bằng chứng artifact/config/schema/service và luồng chính tại target, từng thành phần và thời điểm quan sát; receipt/exit0 không thay xác nhận đang chạy. Restore cần kiểm dữ liệu/admin/quyền; backup cùng host không chứng minh mất host. Job/cảnh báo cần sống độc lập phiên AI/laptop thuộc hệ thống thực thi phù hợp; thiếu host/observer độc lập phải ghi thiếu, không giả bằng process cùng máy. SEO/index/readiness và N/A đúng Human gate. Dọn API/schema/flag/nhánh chỉ sau điều kiện giữ nguồn/khôi phục và quyền tương ứng.

## 4. Phân rã và gate

S01: chốt đầu vào/phương pháp; S02: viết/tích hợp; S03: kiểm và trình đúng giới hạn. Một lát cắt hiện hành, không mở sáu việc thực thi đồng thời.

| Task | R1 được đề nghị | Phần còn trước khép task/phase |
|---|---|---|
| R08-T01 | S01/S02 phương pháp phân rã, S03 review tình huống kế hoạch | Human nhận kết quả; không tự duyệt plan pilot |
| R08-T02 | S01/S02 vòng code/G2/evidence, S03 review tình huống đổi nguồn | Human nhận phương pháp; không nhận code/test ứng dụng đã chạy |
| R08-T03 | S01/S02 hướng dẫn build/môi trường và danh sách đầu vào R2 | Lệnh/profile/nguồn thực và kiểm bắt buộc trong gói R2 được duyệt |
| R08-T04 | S01/S02 release/khôi phục, đối chiếu schema2 và tình huống r1 | Diễn tập release/lỗi/phục hồi trên lab thật theo R2 |
| R08-T05 | S01/S02 nhận diện lần thực thi/đọc lại/unknown | Bằng chứng đọc lại trên target lab của R2; pilot riêng ở R09 |
| R08-T06 | S01 tổ chức ma trận, S02 kiểm hồ sơ r1 | Kết quả r1+lab R2 đủ, hồi quy cần thiết và Human nghiệm thu R08 |

Hiện chỉ đã chuẩn bị gói để review; chưa soạn/tích hợp delivery.md hoặc chạy kiểm R08. Không đánh dấu DONE chỉ vì có bảng này.

## 5. Ma trận r1 và oracle

| ID | Tình huống / kết luận cần đối chiếu |
|---|---|
| C01 | Plan đã duyệt nhưng thiếu quyền code: giữ gate, không thực thi |
| C02 | Task chưa phân rã/thiếu output hoặc kiểm: không suy hoàn tất |
| C03 | Test task đạt, phần không diff chịu ảnh hưởng: giữ toàn lượt G2 |
| C04 | Sửa nguồn/config sau lượt cuối hoặc kết hợp nhánh: PASS cũ không chứng nhận bản mới |
| C05 | Web mới/backend cũ và hai build cùng version hiển thị: nhận diện đúng từng artifact |
| C06 | Đổi script phụ/migration/config sau review: không dùng approval bản cũ |
| C07 | Quyền DEV, target PROD hoặc target mơ hồ: không gửi lệnh; Human chạy PROD đúng gói |
| C08 | Một thành phần đạt, một thành phần lỗi/unknown: không tổng hợp thành release đạt |
| C09 | Retry trỏ nhầm revision hoặc trùng ID: giữ lần trước, sửa căn cứ trước thao tác |
| C10 | Mất kết nối sau gửi lệnh: đối chiếu thực tế, không replay mù |
| C11 | Rollback app nhưng schema/data không tương thích: không tự nhận phục hồi; restore cần gate riêng |
| C12 | Mất observer, dữ liệu cũ, backup cùng host: ghi chưa biết/giới hạn, không nhận live health hoặc độc lập |
| C13 | SEO thiếu bằng chứng/N/A chưa duyệt; secret giả trong log: giữ gate và kiểm quyền chia sẻ |
| C14 | Incident/bugfix giữa Feature, cleanup khi còn nghĩa vụ giữ bản: quay đúng change/plan, không mất tiến độ hoặc phục hồi |

Mỗi case ghi input, trigger, quyết định, hành động được phép/bị chặn, bằng chứng cần có, gate chưa chứng minh và reviewer. Oracle độc lập với cách diễn đạt của hướng dẫn; không lấy test tìm từ khóa làm chứng minh đúng ngữ nghĩa. Tận dụng bộ schema/version/review cũ cho kiểm cơ học, không nhân bản assertion vô ích. R1 kiểm tài liệu/tình huống; C07–C12 còn được diễn tập thực trong R2, không đổi nhãn để coi đã đạt lab.

## 6. Điều kiện trình R2 và bằng chứng

R2 phải có danh sách nguồn/phiên bản/artifact cụ thể, lệnh chính-phụ và tính chất tác dụng phụ, image/digest và footprint, cấu hình lab cách ly DEV/PROD giả, quy trình lỗi–đọc lại–phục hồi, trần CPU/RAM/đĩa/tải/thời gian, cổng/process/volume và cách dừng/giữ evidence. Ưu tiên nguồn/công cụ đã có, kiểm điều kiện trước tái dùng. Ngoại lệ R05-TIDY-01 đã hết hiệu lực khi R05 khép: không áp lại vào build mới hoặc mặc định sample cũ vẫn được phép chạy. Thiếu công cụ/quyền thì gom thành một đề nghị tối thiểu, không xin secret qua chat.

Bằng chứng r1 dự kiến tại `tests/evidence/r08/`: base commit và hash nguồn cuối, phạm vi review, ma trận/nhận xét, checker/core logs đầy đủ và source-freeze, giới hạn NOT_RUN. Không chạy lại AI/benchmark lịch sử hoặc ghi đè Windows/R05–R07. Sau r1 chỉ trình kết quả r1 và gói R2 đủ cụ thể; **R08 chưa khép trước lab bắt buộc và Human nghiệm thu**. R09-T14 vẫn giữ lượt kiểm view pilot thật đã chuyển từ R07.
