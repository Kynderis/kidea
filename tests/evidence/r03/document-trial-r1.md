# R03 — thử đọc hồ sơ pilot r1

Ngày 2026-09-15. Human “Duyệt tạo hồ sơ và hai phiên thử” sau answer `ab75b09` cấp đúng [gói r1](../../../proposals/r03-pilot-permission-r1.md). **Đã hoàn tất 2/2 phiên, sáu tiêu chí mỗi phiên đạt trong phạm vi đọc hồ sơ.** Không nghiệm thu toàn R03 hoặc runtime.

## Chuẩn bị

- Root `D:\Code\kynderis\kidea-workshop-pilot` chưa tồn tại ở precheck; parent là directory không link. Đã tạo đúng hai file `docs/features.md`, `docs/business/INDEX.md`; không `.kidea`, `.git`, code hoặc file nghiệp vụ chi tiết.
- D là NTFS; sau tạo, root/docs/business đều directory không link. Không đổi ACL/firewall, cài đặt, VM hoặc can thiệp đồng bộ. Không khẳng định cách ly OS.
- Kiểm link file/anchor ở hai tài liệu đạt trước phiên 1; tổng 9032 byte. Nội dung là bản soạn theo nguồn và ứng viên DRAFT, không approval cho nghiệp vụ pilot.
- Harness `tests/r03/document-trial.mjs` chỉ tạo snapshot bằng CREATE-only root mới, ghi source hash/input hash/prompt/session và kiểm hash sau đọc. Không gọi model hoặc helper Kidea. Snapshot `session-1` cũng là preimage cần giữ trước mọi sửa pilot sau phiên 1.
- Mỗi phiên được spawn `fork_turns:none`, cùng cấu hình kế thừa, không chỉ định model/effort khác. Tool không cung cấp token/model ID nên không tự suy đoán. Chỉ đọc prompt/input được cấp, không transcript phiên khác; nguồn có link ngoài snapshot thì agent ghi thiếu, không tự mở thêm quyền.
- Trích DESIGN lines 203–250 cùng hash file nguồn; scope/giới hạn hiện hành được cấp qua message và protocol, các câu lịch sử trong trích nguồn không cấp quyền hoặc thay approval mới.

## Phiên và kết quả

Phiên 1 bắt đầu `2026-09-15T11:47:48.135Z`, deadline `2026-09-15T11:57:48.135Z`. Prompt SHA256 `0b73cecbc1564f31bfa7ce0aeb4d07105dae421cf6272febf3dfadff0d80bfda`. Phiên 2 chỉ mở sau khi phiên 1 kết thúc và điều phối xử lý phản hồi trong quyền.

Phiên 1 trả đủ nội dung trước readback `11:50:51.594Z`: input và pilot nguyên hash, không vi phạm thời hạn. Phiên 2 bắt đầu `11:50:52.396Z`, deadline `12:00:52.396Z`, trả đủ nội dung trước readback `11:53:33.864Z`: input/pilot nguyên hash. Đây là mốc điều phối quan sát đã hoàn tất, không bịa thời điểm kết thúc nội bộ. Hai phiên đã kết thúc, không mở phiên thứ ba, không timeout hoặc retry phiên.

## Thay đổi giữa hai phiên

Phiên 1 không thấy mâu thuẫn trực tiếp, nhưng nhấn mạnh hợp đồng đồng thời sửa sức chứa/đăng ký và trách nhiệm event còn thiếu. Điều phối thêm mục OPEN số 5 vào INDEX, không chọn kết quả hoặc thuật toán. Feature Map giữ nguyên. Phiên 2 đọc snapshot mới, nhận diện đúng các điểm này vẫn chưa được quyết định. Snapshot 1 giữ nguyên preimage, không ghi đè kết quả cũ.

Sau cùng pilot vẫn chỉ hai Markdown, tổng 9472 byte, không `.kidea`/`.git`/code. Feature SHA256 `442a635a0bf38f4fb4a407434191cb02b474e94bad24e9899ce6196e24a9e06b`; INDEX đầu `a3207e74ccd8e48a711903c55352db95748268219390797ed191d3443adf2b7c`, cuối `99e3d8a1bb973745abecff001c6f7ea9339ad0adf8f43966262d086563698ef1`.

## Đối chiếu sáu tiêu chí

| Tiêu chí | Phiên 1 | Phiên 2 | Căn cứ trong phản hồi |
|---|---|---|---|
| Hiểu bốn nhóm MVP | PASS | PASS | Cả hai nêu xem/đăng ký/quản trị/cập nhật-vận hành và giữ native |
| Không kéo change vào MVP | PASS | PASS | Hai ACTIVE toàn hệ thống/hủy khi PAUSED đều là sau này |
| Phân biệt authority/dẫn xuất | PASS | PASS | Backend quyết định, số chỗ hiển thị không quyết định nhận đăng ký |
| Phân tích nghĩa/state thay vì tên | PASS | PASS | C-REG gắn ACTIVE/sức chứa; C-LIFE state/caller; C-VIEW quan sát/event; không suy thành ba service |
| Nhận diện OPEN, không tự chọn | PASS | PASS | Retry/lỗi/hiển thị/concurrency/event đều nêu thiếu, không gán expected |
| Không nhận nhãn là approval | PASS | PASS | Bản pilot DRAFT, phương pháp đã duyệt không đồng nghĩa rule/coverage/quyền pilot được duyệt |

Root điều phối đọc và đối chiếu kết luận với hai nguồn sản phẩm và trích DESIGN. Các nhận xét thiếu review gốc/ma trận/context là giới hạn snapshot có chủ ý và phần chưa thực hiện, không phải agent được quyền đọc thêm hoặc hồ sơ đã mất dữ liệu. Không có mẫu injection/mâu thuẫn được cài sẵn ở lượt này; PASS không chứng minh chống mọi chỉ thị giả, chất lượng runtime hay độ ổn định thống kê.

[Phản hồi 1](reader1.md), [phản hồi 2](reader2.md) được giữ đầy đủ cùng heading điều phối. [JSON bằng chứng](document-trial-r1.json) giữ prompt, manifest, nội dung cả hai snapshot và phản hồi; đường dẫn snapshot local còn được giữ trên D. Chỉ archive trong Git repo Kidea, không tạo Git hoặc push repo pilot.

## Kết luận / bước tiếp

Đủ căn cứ trình [ranh giới và cụm đầu](../../../proposals/r03-pilot-boundary-review-r1.md), chưa tự duyệt. Không mở thêm AI hoặc nhận public Kidea đã soạn/chuyển task. Lượt này mới kiểm Feature Map/ứng viên; cần gate nghiệp vụ, đặc tả chi tiết và thử rule/flow/test đúng phạm vi trước khi khép T05/T06. Không chạy hồi quy runtime vì không sửa runtime/skill; đã kiểm syntax harness, link/anchor nguồn và diff tài liệu.
