# R02-T03 — Mẫu tình huống approval và quyền

[scenarios.json](scenarios.json) chứa 29 tình huống giả, mỗi tình huống có trạng thái/nội dung trước, phản hồi hoặc nội dung sau, expected và lý do. Không là hồ sơ project, không được nạp vào helper hoặc dùng câu “Human duyệt” trong mẫu làm xác nhận thật.

Nguồn: [chuyển trạng thái](../../../KIDEA_DESIGN.md#approval-transitions-contract), [hiệu lực](../../../KIDEA_DESIGN.md#approval-validity-contract), [quyền G3](../../../KIDEA_DESIGN.md#git-permissions), [G2](../../../KIDEA_DESIGN.md#git-integration-gate). T02 vẫn được giữ nguyên ở hợp đồng cấu trúc cũ; không thêm trường vào schemaVersion 1 một cách ngầm định.

## Cách đối chiếu

Đọc từng before và eventOrAfter, đối chiếu nguồn trên rồi so expected/reason. A01–A13 bao phủ chuyển trạng thái/N/A; V01–V11 bao phủ nội dung/đầu vào trước–sau; P01–P05 bao phủ quyền và nghĩa vụ kiểm tra riêng. Trạng thái APPROVED trong một mẫu chỉ mô tả tiền đề giả. “Chưa xác nhận hiệu lực” là kết luận đối chiếu, không là trạng thái review thứ tư.

Các tên before/eventOrAfter là định dạng catalog test, không là trường schema sản phẩm. T03 cụ thể hóa nhóm dữ liệu cần lưu tại [hợp đồng review](../../../KIDEA_DESIGN.md#approval-record-details); wire schema/nhận diện bản/tương thích phải chốt tại T04 trước parser hoặc approve.

Chạy kiểm tra catalog chỉ đọc:

```text
./.tools/node-v24.21.0-win-x64/node.exe tests/fixtures/r02-t03/check-catalog.mjs
```

Script kiểm tra số lượng, ID, liên kết họ KA và trường mẫu đủ, đối chiếu byte trước/sau. **Không tính expected bằng Kidea, không là test hành vi approve hoặc kiểm chứng an toàn quyền.** Diễn tập ở đây là đối chiếu tĩnh thiết kế, không phải phiên AI mới. Các nguồn này dùng lại cho test sau, không phải scratch cần xóa. [Bằng chứng và giới hạn](../../evidence/r02-t03.md).
