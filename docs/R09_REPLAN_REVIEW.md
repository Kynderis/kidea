# Gói ghi nhận cây việc R09 — một quyết định

**APPROVED:** `R09-REPLAN-LEGACY-r1`, revision1, purposeCONTENT, ownersW-001…W-010. File trình Human: `/Users/kendrick/Desktop/kidea-workshop-pilot/.kidea/reviews/R09-REPLAN-LEGACY-r1.md`. SHA256 toàn file đã trình trước phê duyệt: `8dce62dcf6f9b37d9e7246937eca54f7bc5ef88304606089e4fe7ee5df14c37c`.

Đề nghị chấp nhận việc ghi nhận kế hoạch và provenance qua helper công khai:

- Giữ10bước gốc, phân thành17việc cụ thể trên cùng cây; không nhập DONE, không xóa lịch sử.
- Ghi nhận21hồ sơ kế thừa R03–R05: đã đối chiếu, nguyên byte với nguồn C đã nghiệm thu `8ce0af4`. Không xin quyết định lại nghiệp vụ cũ.
- Cho ghi tiến độ của lát backend/Web bằng bằng chứng thực, giữ phần admin/sự kiện/vận hành/G2/release chưa hoàn tất và mọi gate nghiệm thu sau đó. Không phải nghiệm thu toàn ứng dụng hoặc R09.

Đề xuất cụ thể: `pilot/docs/workflow/r09-replan-r1.json`; tiêu chí: `pilot/docs/workflow/r09-checkpoint-r1.md`; provenance/hash21file: `pilot/docs/workflow/legacy-provenance-r1.json`. [Kiểm cấu trúc và refs](../tests/evidence/r09/work-replan-r1/static-check.json). Human: “Tôi phê duyệt nhé” sau khi trình đúng phiên bản/digest. Public APPROVE đã ghi APPROVED và REPLAN_WORK đã xác minh WORK_RECORDED; giữ nguyên10step, thêm17leaf TODO, không nhậpDONE. Tiến độ sau đó được ghi từng bước bằng public transitions và bằng chứng thực.

Bằng chứng thực hiện tại: [backend r10](../tests/evidence/r09/t02-build-r10.md),33unit/18SSR–Chrome và [15tình huống HTTPS với backend thật](../tests/evidence/r09/t03-integration-r3/run/browser/result.json). Raw FAIL ở r7/r9 và integration r1 được giữ; không mở thêm ngoại lệ TSan. Đây là căn cứ tiến độ trung gian, không thay gate G2/cuối.

Vì sao cần đúng xác nhận này: public work-cycle yêu cầu một reviewAPPROVED bind exact proposal trước REPLAN_WORK. Skill approve yêu cầu Human xác nhận đúng file/digest đã trình; quyền thực thi trọn R09 không tự là confirmation của review mới. Không đổi/gỡ kiểm này hoặc ghi tay metadata để chạy tiếp. Đây không phải yêu cầu duyệt lại từng build, Docker hoặc nghiệp vụ đã chốt.

Bằng chứng mới: [ghi approval](../tests/evidence/r09/work-replan-r1/approve-result.json), [áp dụng cây việc](../tests/evidence/r09/work-replan-r1/replan-result.json). Không còn chờ xác nhận gói này. Gate kết quả sản phẩm/cuối vẫn giữ nguyên.
