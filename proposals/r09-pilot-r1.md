# R09 r1 — Gói chuẩn bị pilot backend/Web

Ngày 2026-09-17. **D1 và đầu ra S02 đã APPROVED qua mục A của gói A–E tại77f5caf. C mở chuẩn bị/public init pilot local; chưa mở code/build/deploy workshop.** [Kết quả](../tests/evidence/r09/d1-r1.md). Human: “Duyệt D1. Sau đó xem còn cần tôi confirm gì để hoàn thành R09 hoặc phần nào còn tồn đọng trước đây thì nêu ra nhé”, cho gói tại `cd05598`. [Các quyết định còn lại](../docs/R09_DECISIONS.md); không xin lại D1.

Human đã nghiệm thu R08 và yêu cầu “Ok làm đi” đối với bước chuẩn bị R09. Gói này không thay gate sản phẩm, không duyệt trước cả ứng dụng. Nguồn chuẩn: [roadmap R09](../KIDEA_ROADMAP.md#r09), [thiết kế](../KIDEA_DESIGN.md), [R05 đã nghiệm thu](../docs/R05_ACCEPTANCE.md), [R08 đã nghiệm thu](../docs/R08_ACCEPTANCE.md).

## 1. Đầu vào thực và việc cần xử lý trước

[Inventory chỉ đọc](../tests/evidence/r09/preparation-r1/inventory.json) tại Kidea `39bcaef423a8f2077a71d8bacd6fd54467795e75`, master, remote `Kynderis/kidea`: sibling `/Users/kendrick/Desktop/kidea-workshop-pilot` có `docs/` và `samples/`, không có `.git` hoặc `.kidea`. Toàn bộ 21 tài liệu khớp manifest Web r2 đã nghiệm thu. Có 8 tài liệu chứa đường dẫn Windows `D:/`; cần đối chiếu rồi sửa đường dẫn trong gói pilot được phép, không sửa snapshot lịch sử. Các nhãn PROPOSED/IN_REVIEW cũ phải đọc cùng biên bản nghiệm thu; không yêu cầu duyệt lại nguyên kiến trúc đã chốt.

137 source ID/20 nhóm TC là nghĩa vụ ứng dụng, vẫn NOT_RUN. Mẫu R05 và delivery R08 chứng minh từng phạm vi kỹ thuật, không phải ứng dụng workshop hoàn chỉnh. Không nhập kết quả mẫu thành tiến độ pilot.

**GAP-01 — chuyển tiến độ chưa được triển khai qua giao diện công khai.** `init.mjs` tạo 10 STEP/GROUP UNEXPANDED, không plan/review; `resume` READ/SAVE chỉ lưu ngữ cảnh; `approve` ghi review nhưng không đánh dấu DONE hoặc chuyển currentItem. `change` điều phối impact, không thay cây công việc gốc. [Hướng dẫn resume](../.agents/skills/kidea/references/resume.md) yêu cầu không giả lập thao tác thiếu bằng internal writer hoặc shell sửa metadata. Vì vậy chưa được init rồi viết tay `.kidea` để diễn pilot thành công. Đây là kết luận đọc nguồn, chưa phải lỗi tái hiện bằng một lượt pilot.

## 2. Quyết định đã duyệt — D1

**Đề nghị mở gói R09-T01/GAP-01 trong Kidea, quay về phạm vi runtime R02 có liên quan R06:** thiết kế và triển khai thao tác công khai tối thiểu để phân rã kế hoạch ban đầu, gắn gate và chuyển tiến độ theo đầu ra/approval còn hiệu lực. Giữ sáu hành động đã chốt; chốt vị trí thao tác và schema sau kiểm tác động, không thêm executor build/deploy hoặc tự động duyệt. Không refactor toàn runtime.

Phạm vi file dự kiến: helper/validator liên quan dưới `.agents/skills/kidea/scripts/`, hướng dẫn tương ứng, test hồi quy, tài liệu thiết kế/schema bị tác động và bằng chứng mới. Giữ tương thích dữ liệu đã có; không migrate pilot hoặc dữ liệu người dùng ngầm. D1 cho phép làm liên tục thiết kế chi tiết và triển khai trong ranh giới này; thay đổi ngữ nghĩa gate, schema không tương thích hoặc quyền ngoài ranh giới phải trình phần thay đổi trước.

Kiểm bắt buộc: từ init thật trong thư mục test mới đến phân rã, review và chuyển bước; từ chối thiếu gate, approval cũ/sai owner, dependency chưa xong, input thay đổi, sai quyền/root, pending write; giữ preimage/checkpoint; không suy DONE từ metadata hợp lệ. Kiểm chuyển tác vụ với impact/return point và giữ Feature dở. Chạy core đầy đủ, các bộ R06/R07 bị ảnh hưởng và ca mới trên nguồn cuối; giữ cả FAIL/PASS, không tự dùng hết quota AI trial lịch sử rồi mở thêm.

Chỉ dùng Node ≥24 và công cụ local có sẵn, dữ liệu giả/temp riêng; không tải/cài công cụ, không Docker/cloud workload, không sửa sibling pilot, không init Git/`.kidea` ở pilot trong D1. Quyền commit/push Kidea hiện hành giữ nguyên. Nếu công cụ thực sự thiếu, gom đề xuất tối thiểu trước cài.

## 3. Phân rã R09-T01 và các mốc kiểm

Trạng thái chỉ ghi trong [sổ công việc](../KIDEA_ROADMAP.md#work-state); mục chưa mở mặc định TODO.

| Subtask | Đầu ra | Phụ thuộc và điều kiện đóng |
|---|---|---|
| S01 — Chuẩn bị | Inventory, khoảng thiếu, gói r1 và điểm tiếp tục | Đối chiếu 21 hash, đọc API hiện hành, kiểm link/diff; không runtime PASS |
| S02 — Khép GAP-01 | Hợp đồng thao tác, mã, hướng dẫn và hồi quy hữu hạn | D1; đủ kiểm mục 2, Human review kết quả và mọi thay đổi lớn phát sinh |
| S03 — Đầu vào pilot khả thi | Review đầy đủ 21 tài liệu/137 case; bảng kế thừa approval, sửa link/hồ sơ hiện hành có preimage; kế hoạch bước 9 theo lát cắt | S02; lập danh sách ghi chính xác trước sửa sibling; không coi hash là review ngữ nghĩa |
| S04 — Gói thực thi đầu tiên | Root/repo pilot, Git local/remote, public init, input/gate/plan, lệnh/build/tests, môi trường/target, trần tải/đĩa/thời gian và cleanup có căn cứ | S03; gom một approval cho quyền còn thiếu và đầu vào thay đổi; không xin lại nghiệp vụ đã duyệt |
| S05 — Bắt đầu phiên pilot mới | Phiên dùng skill công khai từ đúng nguồn; checkpoint xác minh được | S04 được duyệt, dùng thao tác đã triển khai; không nhập trạng thái giả hoặc cho một agent biết sẵn đáp án bài thử |

S03/S04 chưa thể được coi là gói chạy đã đủ: thiếu đường chuyển kế hoạch công khai và chưa có manifest workload pilot. Không đặt trần chi phí/CPU/thời gian giả, không dùng lại manifest hoặc deadline R08. Quyền GCP đã có vẫn giữ; trước workload mới cần gói cụ thể trong giới hạn còn hiệu lực. Không cần Human cấp secret.

## 4. Chuỗi thực thi sau bootstrap

Đây là phân bổ đầu ra/phụ thuộc cho các task đã có, không approval toàn cụm. Chi tiết subtask của mỗi lát code được chốt từ kế hoạch pilot trước mở, với test và gate riêng.

| Task | Lát cắt/đầu ra kế tiếp | Bằng chứng/gate |
|---|---|---|
| T02 sau T01 | Backend đăng ký, quyền, transaction, idempotency, tranh chỗ cuối | Ubuntu build, test oracle dữ liệu/race; không nhận toàn MVP xong |
| T03 sau T02 | Web intro/list/detail/register, SSR/prerender và trạng thái UI | Browser/SSR/test/map/assertion, checkpoint còn thiếu admin/event |
| T04 sau T03 | Thêm giới hạn 2 ACTIVE khi MVP còn dở | Quay bước 1, cùng kế hoạch, giữ tiến độ hợp lệ; G2 toàn dự án hiện hành |
| T05 sau T04 | Admin/event/monitor còn lại | Duplicate/late/out-of-order/disconnect/readback/mất tín hiệu; không chỉ đồ thị gọi hàm |
| T08 sau phạm vi phát hành đủ gate | Release lab/restore, tổ hợp cũ–mới | Từng attempt/source/artifact/config/schema/script; AI DEV, Human trực tiếp chạy script vai PROD trên lab; N/A index cần đúng xác nhận |
| T09 sau T08 | Cho hủy khi PAUSED, config/incident consumer không diff | Target khác bản đang chạy; impact và G2 trước deploy đúng quyền |
| T10 khi có baseline release và Feature dở | Bugfix giữ đặc tả, master hoặc nhánh bảo trì đúng bản; hai patch, thu hồi/hết hỗ trợ | Tái hiện vượt sức chứa; mỗi candidate/bản kết hợp chạy đủ gate, không mang Feature chưa chọn vào release |
| T11 xuyên các gate | Reject/góp ý/im lặng/sai hoặc cũ approval, thiếu quyền; DEV trỏ PROD/script đổi/injection | Từng vector có oracle và kết quả, không coi skip là PASS |
| T12 tại checkpoint/side effect thật | Ngắt phiên, thiếu tool, mất phản hồi sau gửi; job/cảnh báo độc lập | Reconcile trước tiếp tục; không tự replay/migration hoặc sửa marker |
| T13 sau có checkpoint/release phù hợp | Git/handoff đủ metadata/docs/code/config, nhánh đúng; thiếu/conflict/WIP | Phiên nhận đối chiếu thực; không giả dữ liệu đã chuyển, không đè Feature |
| T14 sau các nghĩa vụ trên | Tổng hợp, sửa lỗi hữu hạn, G2 bản cuối, view pilot thật | Human chọn phase cần sửa; nghiệm thu R09 riêng; R10 chưa mở |

T06/T07 Android/iOS FUTURE_UNSCHEDULED, không gate và không DONE. Backend C++ Ubuntu/Docker, client Web; responsive theo pilot. Apple Silicon vẫn NOT_RUN. Không suy Chrome của view Kidea thành thay đổi ma trận browser sản phẩm.

## 5. Gate view T14 bắt buộc

Kế thừa [R07 r1](r07-offline-view-r1.md) và [nghiệm thu R07](../docs/R07_ACCEPTANCE.md): dựng, đối chiếu nội dung và đo Chrome trên hồ sơ pilot **thật, hợp lệ**; hiện NOT_RUN. Báo số task/edge/byte thật, hash nguồn trước–sau, host/CPU/Node/Chrome/viewport/tải máy và phương pháp đo. Một cold + 5 lượt sau, lưu mọi số đo/median/max. S=100 task/300 edge: generate/open→interactive ≤2s; M=1000/3000: ≤5s; search/filter/detail ≤200ms, HTML ≤10MiB. Pilot trong M áp ngưỡng M; vượt M dừng báo trước đo, không tăng giới hạn. Không thêm metadata giả để lấp gate hoặc coi benchmark fixture cũ thay pilot.

## 6. Điểm dừng và tiếp tục

Chuẩn bị r1 không chạy test ứng dụng, AI trial, Docker/cloud hay init pilot. Bằng chứng R08 được giữ nguyên, waiver tidy và manifest đã tiêu thụ không tái dùng. D1 đã duyệt: làm liền mạch S02 trong ranh giới; chỉ dừng ở thay đổi quan trọng thực sự hoặc gói chạy pilot S04 cần quyền/đầu vào cụ thể. R09 chưa hoàn tất; R10 vẫn sau R09.
