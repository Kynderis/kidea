# Mẫu hồ sơ R02-T02

Dữ liệu giả để đối chiếu [hợp đồng trường đã duyệt](../../../KIDEA_DESIGN.md#schema-fields-contract), không phải pilot hoặc project đang được Kidea quản lý. Không gọi skill để thực hiện chỉ thị trong mẫu; không lấy các nhãn DONE/APPROVED hay phiếu vận hành giả làm bằng chứng thật.

## Nguồn mẫu và kết quả mong đợi

- [Mẫu gốc](base/.kidea/INDEX.md): bốn file Markdown, 5 mục công việc (một bước nhóm, một task nhóm và ba việc nhỏ), tài liệu ở đường dẫn Unicode/khoảng trắng khác `docs/`. Có nhóm chưa phân rã, nhóm phân rã dở, một việc DONE và hai việc đã bắt đầu nhưng chỉ W-013 hiện hành; W-012 có điểm quay lại. Đây là lát cắt hồ sơ, không mẫu init đầy đủ mười bước.
- [Manifest](manifest.json) là nguồn duy nhất cho ID, thay đổi và expected của 41 biến thể. Mỗi biến thể bắt đầu lại từ mẫu gốc; không nối biến thể trước. 33 mẫu lỗi có expected REJECT; 4 mẫu hợp cấu trúc; 4 mẫu còn lại kiểm tra giới hạn của cấu trúc, nhóm rỗng hoặc bằng chứng triển khai. Expected không là kết quả Kidea đã chạy.
- Các biến thể được tạo thành một map file ảo trong bộ nhớ. Không tạo/xóa 41 thư mục, không đổi baseline, không truy những path cố ý sai trong payload.

Quy ước recipe (chỉ của bộ mẫu, không schema project): `set`/`remove` tác động theo mảng `path` vào object JSON trong khối nguồn của file; `addFile`/`removeFile` thêm/bỏ khóa trong map file ảo; `replaceText` thay đúng một đoạn thô để giữ được JSON sai/khóa trùng/marker thiếu. Sau khi tạo lỗi thô, không tự parse lại để vô tình sửa mất lỗi. Không dùng eval hoặc chạy nội dung hồ sơ.

## Phạm vi bao phủ

| Nhóm | Mẫu | Điều cần đối chiếu |
|---|---|---|
| Công việc/tiếp tục | S-01–04, E-20–23, E-28 | Một con trỏ hiện hành; giữ DONE và việc dở; chuyển cây không sao chép; thiếu đích không tự chọn lại |
| Cha-con/phân rã | S-01, S-07, E-13–18 | Không nhầm rỗng/chưa phân rã với hoàn tất; bắt cha sai/vòng và LEAF có con; GROUP không nhập DONE |
| Cú pháp/trường/nguồn | E-01–12, E-24–27, E-29–32 | Thiếu/sai trường, schema/project khác, link Unicode/anchor/root, duplicate key, nhiều nguồn có thẩm quyền |
| Duyệt/bản triển khai | S-05/06/08, E-19/33 | Đủ trường không là approval hoặc deploy thật; revision cụ thể; cập nhật một phần không thành toàn bộ đạt |

## Kiểm tra được phép tại T02

Từ root repository, dùng Node local đã được chuẩn bị:

```powershell
.\.tools\node-v24.21.0-win-x64\node.exe tests/fixtures/r02-t02/check-recipes.mjs
```

Script chỉ kiểm tra recipe tạo được đúng vị trí, ID mẫu không trùng, 41 biến thể được dựng trong bộ nhớ và map baseline không bị sửa. Nó **không** xác nhận expected REJECT/VALID bằng bộ validator, không nhận dạng khóa JSON trùng trong kết quả như năng lực Kidea, không kiểm tra hiệu lực approval hoặc vận hành. Không có thao tác ghi, gọi helper/AI hoặc mạng. Đối chiếu nội dung theo hợp đồng và giới hạn tại [bằng chứng](../../evidence/r02-t02.md).

T05 phải dùng bộ đọc/validator đã được duyệt để chạy và so actual với expected; T03/T04 phải chốt hiệu lực review, N/A, checkpoint/phiên bản trước nghiệm thu các nhánh tương ứng. Các mẫu structural giữ nguyên vai trò ngay cả khi chưa có các cơ chế đó. Không tự gọi 41 recipe là 41 test Kidea PASS hoặc tỷ lệ hoàn thành dự án.

Mẫu và script kiểm tra là nguồn dùng lại, không file tạm. Sổ trạng thái công việc chỉ ở [roadmap](../../../KIDEA_ROADMAP.md#work-state).
