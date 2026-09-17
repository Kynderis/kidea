# Nghiệm thu R07 — giao diện offline Chrome

Ngày2026-09-17. **APPROVED / R07 DONE trong phạm vi đã kiểm, chuyển riêng lượt kiểm pilot sang R09-T14.**

Human xác nhận nguyên văn: “duyệt nhé”, sau đề nghị nghiệm thu phần R07 đã kiểm và chuyển lượt kiểm pilot sang R09. Quyết định áp dụng [gói chốt](../proposals/r07-pilot-gate-r1.md) và [báo cáo kết quả](../tests/evidence/r07/implementation-r1.md) tại commit `94dc339e330ca2342be167032060f2a8ac24f01b` của `Kynderis/kidea`, nhánh `master`.

## Nguồn và phạm vi được chấp nhận

- Báo cáo SHA256: `e56eeedfa9bd6d58746c66b4122521ba496de0c34823803e170628d3403fc833`.
- [Manifest nguồn cuối](../tests/evidence/r07/implementation-r1/final-2026-09-17T05-53-02-534Z/summary.json) SHA256: `fbeda431f7e83404714d71b81d5fd3dbd20d547a09d6e3281216d4ad79f92a21`.
- [Receipt payload](../tests/evidence/r07/implementation-r1/receipt.json) SHA256: `9c2e9f4436b8ebdf6c574705924ca03ede7c253b739a98a43467eb2dff3894f2`.
- Helper/skill `visualize`, HTML offline chỉ đọc, tiến độ/gate/review/release và ba góc nhìn bản đồ trên Chrome; giữ schema2 và giới hạn adapter/ngữ nghĩa/quyền đã trình.
- Core283/283 PASS; hồi quy R06 gồm19nhóm+source-freeze và5nhóm lỗi âm PASS;19nhóm R07 PASS;8tổ hợp Chrome và kiểm standalone/escaping/offline PASS. Review ảnh dùng cả ảnh viewport Chrome bổ sung, không dùng ảnh trắng lỗi clipping làm bằng chứng đạt.
- Lượt ghi nhận này đối chiếu lại68file nguồn và4.088payload trong receipt: toàn bộ khớp. Không chạy lại test/build/AI hoặc thay raw FAIL/PASS.

Khép R07-T01–T05 và các gate r1 trong phạm vi được nghiệm thu. Các nhãn chờ nghiệm thu trong báo cáo/snapshot cũ giữ nguyên nghĩa lịch sử; biên bản này và roadmap là trạng thái hiện hành.

## Nghĩa vụ pilot còn bắt buộc

Riêng lượt dựng/đo view trên hồ sơ pilot thật chuyển từ R07-T04/V12 sang **R09-T14**. Hiện vẫn NOT_RUN vì pilot chưa có `.kidea`; kiểm từ chối khi thiếu hồ sơ không thay lượt render/đo thật. Khi luồng pilot được duyệt tạo đủ hồ sơ hợp lệ, phải đối chiếu view với nguồn, kiểm Chrome/thao tác và đo theo ngưỡng/phạm vi đã chốt; nếu vượt cỡ M phải trình phạm vi trước chạy. **Không khép R09 khi thiếu lượt này.** Không tự khởi tạo metadata pilot hoặc sửa trạng thái để vượt gate.

Chrome-only chỉ áp dụng giao diện offline Kidea; không thu hẹp ma trận Web của ứng dụng. Safari ngoài phạm vi theo quyết định riêng. Android/iOS Future chưa roadmap; Windows/Apple Silicon chưa được chứng nhận R07 từ kết quả Intel. Đây không là nghiệm thu toàn Kidea hoặc ứng dụng pilot.

Bước tiếp theo: chuẩn bị gói R08 về kế hoạch, code, phát hành và vận hành theo roadmap. Nghiệm thu này không tự duyệt triển khai R08/R09, cài công cụ, workload mới hoặc ngân sách. Giữ quota đã dùng, nguồn pilot và mọi bằng chứng/cache hiện có.
