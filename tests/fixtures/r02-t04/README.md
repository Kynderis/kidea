# R02-T04 — Mẫu hồ sơ số 2 và tình huống ghi/triển khai

Nguồn: [hợp đồng S07](../../../KIDEA_DESIGN.md#schema-v2-contract), theo bản trình [7fd8d05](https://github.com/Kynderis/kidea/blob/7fd8d059db6b9085f13ec4ed6427126b57317880/KIDEA_DESIGN.md#schema-v2-proposal) được Human “Tôi duyệt” sau answer cùng bản. Bộ này không sửa hoặc nâng nhãn các mẫu T02/T03.

## Dữ liệu có thật trong mẫu, không có thao tác sản phẩm thật

[catalog.mjs](catalog.mjs) tạo 48 đường dẫn/nội dung file ảo trong bộ nhớ: sáu hồ sơ hiện hành INDEX/work/review/checkpoint/release/operation, bản byte lịch sử, các căn cứ và payload giả. File `.bin` chỉ là chuỗi văn bản giả, không phải chương trình. S07 thêm biến thể có plan riêng, bao phủ loại record thứ bảy. Không sinh cây project trên đĩa, không có Git repo mô phỏng trên đĩa hoặc pilot mới.

`buildBase()` trả baseline và tham chiếu; `buildCases()` trả 51 biến thể có `id`, `ka`, `expected`, `reason`, `world`. Mỗi world chứa `files`, `syntheticGit`, `extraRefs`, `event`. Đây là lớp chứa dữ liệu test, không phải schema sản phẩm hoặc một nguồn trạng thái mới. Các Ref bên trong Markdown được tính từ root ảo này; đường dẫn ảo không phải chỉ thị để mở/ghi file trên máy.

| Nhóm | ID | Nội dung |
|---|---|---|
| Baseline | B01 | Review đang chờ, checkpoint mới chuẩn bị, web được quan sát/backend chưa rõ; không sẵn sàng toàn bộ |
| Bản nguồn | V01–V08 | Đổi nghĩa/format, snapshot thiếu/sai mã, path ngoài root, config đổi, đổi giữa lượt đọc |
| Review | A01–A09 | Xác nhận giả, thiếu xác nhận, N/A có/thiếu lý do, history và nguồn hiện hành, enum/đầu vào thiếu |
| Ghi/khôi phục/dọn | C01–C16 | Trước/sau/mixed/ngoài luồng; CREATE khác file rỗng; Git đúng/sai/dynamic ref; giữ/dọn/lỗi dọn và mất căn cứ |
| Release/operation | R01–R08 | Gói cùng tên khác byte, partial, retry ID, quan sát cùng lần, sai target/trùng ID/vòng, revision mới chuẩn bị dở |
| Cấu trúc | S01–S09 | Trộn version, trường lạ/thiếu, khóa/mốc trùng, external chưa hỗ trợ, chuyển/trùng Item ở plan, Time sai |

Các nhãn expected là kết luận cần đạt khi hiện thực kiểm tra/hành vi tương ứng; **chưa được Kidea chạy hoặc chấm**. Một biến thể có thể vi phạm nhiều điều kiện; reason nêu lỗi chính, không yêu cầu validator chỉ báo một lỗi. Dữ liệu tự nhận “Human”, “SUCCEEDED”, quyền hoặc cleanup đều giả, không phải xác nhận thật trong hội thoại này.

## Lệnh kiểm tra chỉ đọc

```text
./.tools/node-v24.21.0-win-x64/node.exe tests/fixtures/r02-t04/check-catalog.mjs
```

[check-catalog.mjs](check-catalog.mjs) kiểm tra baseline envelope/Ref/byte snapshot, ID biến thể, tính dựng được và một số quan hệ của recipe, giữ hash/tập file catalog trên đĩa trước/sau. Không là parser chuẩn: nó dùng regex/JSON.parse trên baseline đã biết, không dùng kết quả đó để nhận đã bắt khóa trùng hoặc mọi cú pháp Markdown/JSON.

Git C08/C09 là bảng byte giả trong bộ nhớ, không gọi Git; external S06 là URN giả không được truy cập. `delete` trong recipe chỉ bỏ mục trong object `world.files`, không xóa file trên đĩa. Cleanup C11 giả cả việc/gate/kiểm tra đã đủ và để nhóm cha chưa xong; chỉ một bản tạm bị bỏ khỏi world, lịch sử review giữ nguyên. C12 cố ý mâu thuẫn để không chấp nhận receipt khi ghi còn dở.

Nguồn/script/README là fixture dùng lại, không scratch cần dọn. T05/T06/T08/T09 còn kiểm chứng parser, filesystem/Git thực, lỗi ghi, Human/AI và quyền; không tính 51 biến thể thành 51 test runtime hoặc KA/KQ PASS. [Bằng chứng](../../evidence/r02-t04.md).
