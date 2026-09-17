# R09 B/C — review kỹ thuật sau triển khai

Ngày 2026-09-17. Theo Human “Ok làm đi” sau kết quả tại `60d0a33`: review đầu ra B/C và chuẩn bị T02. **Human đã nghiệm thu B/C đúng phạm vi** qua “Tôi duyệt” cho gói gộp tại `cdd6ee5`. R09 và ứng dụng chưa nghiệm thu. Không có thay đổi runtime trong lượt review này.

## Bằng chứng được đối chiếu lại

[Receipt đọc lại](../tests/evidence/r09/bc-review-r1/verification.json): 168 file nguồn hiện hành khớp manifest cuối, 18 stdout/stderr của 9 bộ khớp SHA256; kết quả trước/sau giữ nguyên và cả9 exit0. Core293, B1/B2/B3/interop17, R06 19+5, R07 19, R08local14 là **kết quả lượt trước đã xác minh lại**, không giả là test mới.

Pilot vẫn ở commit `8ce0af4b3262fe3b2bd14a1b4b653a46e95b059b`, Git local sạch/không remote. 23 tài liệu và7.906 entry samples đối chiếu lại nguyên nội dung/mode/link; không sửa pilot trong lượt này. Public init/SAVE của lượt C giữ W-001 WAITING và137sourceID NOT_RUN; không nhập samplePASS vào sản phẩm.

## Đối chiếu hợp đồng và giới hạn

| Phần | Kết luận review |
|---|---|
| B1 | Hợp đồng và kiểm disposition/PRESERVE–REASSESS–RETIRE, consumer không diff, giữ10STEP, việc dở/return point và round phù hợp gói B. Kiểm cả public hoàn tất10bước để quay lại; không tự chuyển Git hoặc hoàn tất MVP. |
| B2 | Kiểm release revision/approval/source pin và từng attempt/observation, sai identity/artifact/config/script/schema bị chặn; UNKNOWN/FAILED giữ lịch sử. Đọc lại nhánh runtime cho Git-pinned evidence; chỉ ghi readback caller cung cấp, không chứng minh service đang sống. |
| B3 | Exact original planned bytes, grant mới, nguồn/Git/tool/basis/target và projected graph được đối chiếu; marker chỉ được retire sau readback. Test gồm ngắt giữa recovery và đổi quyền/checkout. Chỉ COMPLETE_PLANNED; pending legacy thiếu request/OTHER/UNKNOWN vẫn chặn, không tùy ý rollback/replay. |
| C | Link-only amendment, provenance và local bootstrap đúng gói. Manifest ứng dụng là checklist NOT_READY; đây là chuẩn bị pilot, chưa đạt build-readiness hoặc R09-T02. |

Hai FAIL interop thật đã có test tái hiện và được sửa trước nguồn cuối: blocker MVP tạm dừng không phải blocker impact hiện tại; release/plan schema2 ghim Git phải dùng đúng bytes lịch sử. Các FAIL fixture/harness và stdout raw được giữ, không sửa log thành PASS. Đây là review hợp đồng/bằng chứng và các nhánh liên quan, không là kiểm bảo mật toàn diện, thử AI mới hoặc chứng nhận đa host.

## Điểm cần xử lý trước T02

Gói C chưa cấp code/build/deploy; vì nguồn workshop mới chưa tồn tại, không thể điền source hash và command build thật một cách trung thực. [Đề xuất T02 authoring](../proposals/r09-t02-authoring-r1.md) giải quyết thứ tự này: một quyền hữu hạn để viết source/test/harness và kiểm tĩnh, sau đó AI chuẩn bị gói build reviewable. Không xin một manifest placeholder hoặc dùng lại waiver/deadline R08.

Read-only Docker image inspect xác nhận image ứng viên `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`, linux/amd64,1.784.463.073bytes còn local. Lệnh đầu dùng đường `/usr/local/bin/docker` không tồn tại; dò PATH cho thấy `/Users/kendrick/.docker/bin/docker` và đọc metadata thành công. Không container được chạy, không download; metadata tồn tại không là kiểm dependency/advisory cho ứng dụng mới.

D/E giữ nguyên thời điểm đã duyệt. R09 mở, R10 chưa mở; view pilot/Windows/Silicon/native hoãn không thành PASS. T02 chưa DONE, chưa có test ứng dụng mới được chạy.
