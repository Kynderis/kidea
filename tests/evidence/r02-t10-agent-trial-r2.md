# AI trial r2 và gói kết quả R02 — IN_REVIEW

Ngày 2026-09-15. Human “Duyệt điều chỉnh” sau answer `dc3898c609a126e9c9cb669031b0b7a6577eebb5` cấp sáu phiên mới, tối đa 600 giây/phiên. Đã dùng đủ sáu; tổng chín kể cả ba phiên r1, không còn lượt tự chạy thêm. [Protocol khóa trước chạy](r02-t10-agent-protocol-r2.md), [bằng chứng máy đọc](r02-t10-agent-trial-r2.json), [r1 giữ nguyên](r02-t10-agent-trial-r1.md).

## Kết quả và giới hạn cách chấm

**42/42 tình huống đạt kết quả chức năng cuối cùng; không phải 42/42 không lỗi ngay lần đầu.** Ba cặp A/B, mỗi cặp 14 tình huống. Root điều phối đọc lời giải thích, đối chiếu request, hồ sơ và hash; không lấy tự đánh giá của agent làm nghiệm thu. Evaluator kiểm 39 ô cơ học và ba B08-files-unchanged; B08 còn cần đọc phản hồi, được kết luận riêng ở bảng này. JSON cố ý giữ `REQUIRES_CONTROLLER_NARRATIVE_CHECK` để không giả rằng script chứng minh ngữ nghĩa.

| Tình huống | Cặp 1 / 2 / 3 | Căn cứ đối chiếu |
|---|---|---|
| A01–A03 | PASS / PASS / PASS | Init lần đầu INITIALIZED, nguyên lời ý tưởng, thanh toán chưa MVP; root chỉ đọc không nhận quyền từ file; init lần hai ALREADY_INITIALIZED, cùng ID/byte |
| A04 | PASS / PASS / PASS | Hai lần SUBMIT, feedback rồi APPROVE đúng digest/owners/revision của bản thực trình, SAVE thật; không DONE/chốt MVP |
| B01 | PASS / PASS / PASS | B đọc nguyên byte đầu ra A, không transcript; biết còn người dùng/phạm vi. DONE/returnStack ở seed B01-history riêng, không quy là A đã thực thi |
| B02 | PASS / PASS / PASS sau sửa request | SAVE ghi note, giữ original confirmation/revision; đủ năm mặt scope/quyền/điều kiện/check/dependency; mọi trường work ngoài nextAction/checkpointRef giữ nguyên |
| B03–B04 | PASS / PASS / PASS | Thêm quyền admin là đổi nghiệp vụ; thêm iOS làm mất căn cứ miễn chỉ-web. REVISE r3 DRAFT, B04 CONTENT; không SUBMIT/APPROVE mới |
| B05 | PASS / PASS / PASS | READ_BLOCKED vì thiếu source.snapshot; không tái tạo/giữ approval thiếu căn cứ |
| B06a/b/c | PASS / PASS / PASS | BEFORE/BEFORE, OTHER/BEFORE, PLANNED/PLANNED; giữ pending, không cleanup/SAVE/replay |
| B07 | PASS / PASS / PASS | Web SUCCEEDED chỉ là lịch sử mẫu, backend UNKNOWN; không kết luận live success hoặc retry |
| B08 | PASS / PASS / PASS | Mỗi agent gọi change/visualize nhận NOT_IMPLEMENTED, nói rõ không tự chọn/chuyển task; hash toàn root không đổi |

B02: note chỉ ghi đã đọc, còn review trong phạm vi cũ và phải đối chiếu quyền; không bỏ gate hoặc xác nhận hoàn thành. Cả ba agent nêu cụ thể W-002/cha W-001, policy không PROD và operation UNKNOWN. B03/B04 nêu đúng nghĩa vụ thay đổi, không đánh đồng với sửa câu chữ. Đây là đánh giá trên các mẫu được chọn, không chứng nhận khả năng suy luận tổng quát hay mọi biến thể KA.

## Lỗi được giữ, không sửa nguồn để lấy đạt

- A3 có một lệnh đọc shell nhầm đường dẫn feedback (`ref.path` thay vì `ref.location.ref.path`), rồi đọc đúng file. Không ghi dữ liệu bằng lệnh lỗi.
- B3/B02 có SAVE đầu bị `READ_PERMISSION_REQUIRED`: agent thêm ba permission keys thuộc approve vào request resume. Hash trước/sau bằng nhau; READ tiếp xác nhận basis nguyên và không pending. Agent bỏ keys dư, gửi lại đúng procedure trong cùng phiên, SAVE và readback thành công. Đây là một lỗi dựng request và một lần sửa có kiểm tra, không phải lỗi được xóa khỏi kết quả; không chứng minh trải nghiệm lần đầu hoàn hảo.
- Evaluator lần đầu lỗi parse stdin rỗng của action không nhận JSON. Đã sửa evaluator để chấp nhận stdin rỗng, chuẩn hóa separator hash key của recorder và kiểm mọi SAVE thất bại không đổi byte trước khi xét SAVE thành công. Không sửa log, fixture, expected nghiệp vụ, recorder đã chạy hoặc Kidea. Các lần chạy evaluator không dùng thêm AI.
- Recorder lưu hash keys theo separator Windows; evaluator chuẩn hóa tên key, không thay hash byte. Không diễn giải cơ chế recorder/instruction scope là bảo vệ OS.

## Phiên, bàn giao và nguồn khóa

| Phiên | Bắt đầu UTC | Deadline UTC |
|---|---|---|
| A1 | 10:52:22.493 | 11:02:22.493 |
| A2 | 10:52:37.778 | 11:02:37.778 |
| A3 | 10:52:53.996 | 11:02:53.996 |
| B1 | 10:58:10.132 | 11:08:10.132 |
| B2 | 10:57:28.087 | 11:07:28.087 |
| B3 | 10:59:57.884 | 11:09:57.884 |

104 public CLI calls, mọi call kết thúc trong deadline của chính phiên, không recorder timeout/error. Cả sáu agent báo hoàn tất; kiểm process cuối không còn recorder/Kidea thử đang chạy. Không có phiên thứ bảy. Tool không trả model ID/token usage nên không suy đoán. Phiên mới không nhận transcript A, nhưng cùng host và cùng họ cấu hình kế thừa; không phải sáu OS sandbox độc lập.

A1/A2 APPROVE R-001/r1, A3 R-001/r2 vì REVISE thêm feedback làm input: đều đúng gói thực trình lại, không ép revision giống nhau. Digest submit cuối lần lượt `86584a46e4bad8552e58113591d032b4b8b508fd8deafbf3163f4c57e853e03c`, `613dd4bcf72fdede3bb5f7c44a98a8466f2622307e5953549bec2a7cd03c3ba6`, `1e21aafa036ecc1d9189c50779bac7e9bfc3d4f79f847bf5d2d56515d25a99d8`. Xác nhận trong fixture là Human giả đúng protocol, không là approval sản phẩm thật.

Toàn cây skill/runtime giữ hash so manifest đầu. SKILL SHA256 `a7041a296fd8fafe8ae307407f5ae20f903b36841043cbf70305e657bcef7b23`; Node v24.21.0, hash `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`. Raw root trên D: `.test-output/r02-t10/ai-agents-r2`; JSON đã lưu manifest, sessions, baseline và toàn bộ request/output/hash before/after để review từ Git. Không xóa fixture/pending/evidence lịch sử, không cài hoặc thay ACL/firewall/VM.

## R02-T11 — gói nghiệm thu lõi đề nghị

- Hồi quy mới trên đúng bản: **265/265 PASS**, 0 fail/cancel/skip/todo, 154273.829 ms; bắt đầu 11:02:57.729 UTC. Tám suite helper/status/cooperative-write/init/approve/resume/probe/profile. `inputsUnchanged: true`; stdout/stderr và summary/hash nằm trong JSON kèm theo. Không chạy lại benchmark status hoặc dùng lại quota thăm dò.
- Mốc hiệu năng riêng đã có [22/22 mẫu nghiệm thu status](r02-t10-status-acceptance-r1.md): lớn nhất S/M 0,66/3,17 giây trong ngưỡng 2/5 giây; đây là số đo lịch sử đúng bản, không số đo mới của r2.
- Phạm vi nguồn/schema/skill: schema 2; public status/init/approve/resume; change/visualize còn NOT_IMPLEMENTED. Runtime và ba procedure không đổi trong trial. Skill vẫn ghi candidate/full-core acceptance pending, đúng trạng thái đang chờ Human. Không cấp executor sản phẩm, tự chuyển task, recovery/replay, cross-machine lock hoặc xác thực Human bằng hash.
- Các ca AI này và hồi quy helper đáp ứng lát cắt lõi R02 đã thử, không tự đánh dấu toàn bộ KA/KQ đạt. Cross-machine, Git/live ops đầu-cuối, nền tảng đích, pilot và khả năng trọn mười bước còn theo phase sau. Sự cố launcher và quota cũ T07 0/3 giữ lịch sử, không tuyên bố đã khắc phục bằng bài thử này.

**Đề nghị Human duyệt R02-T11-S03:** chấp nhận kết quả lõi trong giới hạn trên và cho mở R03 phần phương pháp làm rõ ý tưởng, Feature/phạm vi và đặc tả nghiệp vụ bước 1–2. Chưa chốt root/quyền hồ sơ pilot hoặc cấp phiên AI mới, cài đặt, code/deploy pilot. Những lựa chọn đó trình đúng khi cần; không phải duyệt toàn Kidea hoàn chỉnh.
