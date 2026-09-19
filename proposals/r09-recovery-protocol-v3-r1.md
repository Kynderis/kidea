# R09 — compact recovery protocol v3 r1

**HUMAN ĐÃ DUYỆT — TRIỂN KHAI VÀ RETRY PILOT ĐÃ HOÀN TẤT.** Human xác nhận “Duyệt recovery protocol v3 r1”. Runtime/helper và test đã triển khai ở commit Kidea `0b7fa924`; [kết quả](../tests/evidence/r09/recovery-protocol-v3-r1/summary.json) PASS 14/14 recovery tập trung, 293/293 core và 9/9 suite R09 trên nguồn cuối. Lượt core đầu giữ 2 FAIL hồi quy rồi sửa đúng hợp đồng; lượt R09 đầu giữ 2 FAIL do thiếu env R06 và lượt cuối đủ env PASS. Đúng một retry Pilot tạo r13 DRAFT, public READ hợp lệ, SAVE continuation thành công và SUBMIT đưa r13 sang IN_REVIEW; metadata Pilot commit local `78dbcf5`, không remote. Không tăng giới hạn byte, không tự APPROVE hoặc COMPLETE.

## Phần cần duyệt nhanh

1. Thêm protocol nội bộ v3 **chỉ cho review write mới**. Với nguồn chỉ đọc, prepared request lưu `SHA256` + `byteLength`; Git input lưu `location` + integrity. Target trước/sau vẫn giữ nguyên byte đầy đủ để có thể hoàn tất chính xác khi ngắt.
2. Writer và recovery reader đọc lại byte thật từ file hiện hành hoặc đúng Git object, kiểm hash/độ dài rồi mới dựng graph. Mất nguồn, đổi byte, thiếu Git object, đổi checkout, target OTHER/UNKNOWN hoặc graph sai đều chặn như cũ.
3. Giữ đọc/phục hồi protocol v2 để mọi checkpoint lịch sử còn dùng được. Giữ trần envelope **128 MiB** và từng source/copy/checkpoint **64 MiB**; không tăng cap, bỏ nguồn, rút lịch sử hay giảm kiểm quyền/hash.
4. Sau khi candidate qua kiểm, áp vào Kidea, retry đúng một lượt tạo review r13 trên Pilot sạch. Chỉ tiếp tục SUBMIT/SAVE khi public READ hợp lệ; không tự APPROVE, COMPLETE hoặc nghiệm thu T05/R09.

Không xóa/dọn 1,7 GiB checkpoint lịch sử trong gói này. Không Docker, cloud, download, cài công cụ, deploy hoặc đổi cấu hình máy. Android/iOS vẫn Future; Windows và Apple Silicon chưa được chứng minh bởi lượt Mac Intel.

## Vì sao không tăng cap lần nữa

Prepared request thành công gần nhất đã là **124.338.855 byte**, sát trần 128 MiB. Nó nhúng 418 live input (19.176.720 byte decoded) và 1.649 Git input (70.099.860 byte decoded), gồm nhiều Git object lịch sử lặp lại. Revision 13 thêm lịch sử review và bị từ chối trước khi tạo pending guard.

Cùng JSON, nếu chỉ thay thân `expectedBase64` của input/Git input bằng integrity, kích thước ước tính còn **5.518.159 byte**, giảm 95,56%; target trước/sau vẫn còn nguyên byte. [Số đo](../tests/evidence/r09/recovery-protocol-v3-proposal-r1/diagnostic.json).

## Phạm vi code và kiểm bắt buộc

Phạm vi dự kiến:

- `.agents/skills/kidea/scripts/write-internal.mjs`: tạo/thi hành review request v3; các writer khác tiếp tục v2;
- `.agents/skills/kidea/scripts/recovery.mjs`: đọc v2 và v3 fail closed;
- `tests/r09/recovery-size-migration.test.mjs` cùng test review/recovery liên quan;
- contract recovery và bằng chứng R09 tương ứng.

Candidate phải chứng minh:

- review lớn tạo v3 dưới 128 MiB, không pending khi preflight fail;
- source drift, Git object/checkout sai, integrity/length sai, target OTHER và runtime/tool migration không đúng đều bị chặn;
- v2 pending cũ vẫn đọc/phục hồi đúng;
- target riêng trên 64 MiB và envelope thật trên 128 MiB vẫn bị từ chối trước guard;
- core 293/293 và các suite R09 liên quan qua đầy đủ, không skip/cancel/todo; mọi FAIL được giữ và sửa nguyên nhân, không đổi kỳ vọng để lấy PASS.

## Quyền và giới hạn

Quyền trọn R09 cho phép tiếp tục công việc Pilot, nhưng lần trước Human duyệt riêng việc đổi trần 64→128 MiB. Gói này đổi định dạng request phục hồi và đường đọc lịch sử, nên cần một xác nhận cụ thể trước khi sửa helper đang dùng. Approval cho gói này chỉ cho phép implement/test/commit/push phạm vi trên và retry r13 một lần khi preflight xác nhận Pilot sạch; không phải approval nội dung r13 hoặc nghiệm thu sản phẩm.

Độ khó cao vì chạm đường phục hồi và tương thích ngược. Đề xuất **GPT-5.6 Sol + High**.
