# R09 — gói khép checkpoint observer r1

**ĐÃ HUMAN DUYỆT VÀ THỰC THI — 2026-09-19.** Human “tôi duyệt, làm tiếp đi” đã duyệt đúng gói giới hạn/migration/completion trình trước đó. Đã áp đúng patch, bản Kidea đang dùng qua 293 core + 9 recovery PASS; public RECOVER hoàn tất đúng operation/bytes và giữ dữ liệu còn lại. Pilot local checkpoint `aba73cf246f2ccfd8a30d0322048dc0a5934bebb`. [Bằng chứng thực thi](../tests/evidence/r09/t05-observer-recovery-r1/preservation.json), [điểm tiếp tục](../docs/R09_T05_PROGRESS.md). Không là nghiệm thu R09; các trần và phần loại trừ trong gói giữ nguyên.

## Bản đề xuất trước duyệt — giữ nguyên để đối chiếu phạm vi

**ĐỀ XUẤT — CHỜ HUMAN DUYỆT.** Bản vá đã chuẩn bị và kiểm trong worktree riêng; chưa áp dụng vào Kidea đang dùng, chưa phục hồi hoặc gỡ khóa pilot. Không là nghiệm thu R09.

## Phần cần duyệt nhanh

1. Đồng bộ giới hạn **tệp yêu cầu phục hồi nội bộ lên 128 MiB** ở cả bên ghi và đọc. Mỗi tệp nguồn/bản sao/checkpoint vẫn ≤ 64 MiB. Từ chối gói/tệp vượt giới hạn trước tạo khóa chờ; không bỏ nguồn, rút lịch sử hoặc giảm kiểm hash/quyền.
2. Cho phép chuyển đúng hai thành phần `recovery.mjs` và `write-internal.mjs` từ hash cũ sang hash bản vá đã đóng băng, chỉ để hoàn tất **checkpoint observer đang ngắt**. Node/runtime và mọi thành phần khác giữ nguyên; journal giữ nguyên request/bytes/tool identity gốc cùng quyết định chuyển phiên bản. Không là quyền chuyển công cụ tùy ý.
3. Hoàn tất đúng bytes đã chuẩn bị của **`.kidea/work.md`**, chỉ thay `nextAction` và `checkpointRef`; giữ mọi owner/status/gate/blocker/return stack/history. Kiểm lại trên nguồn thực cuối, phục hồi qua public `resume`, commit pilot local và commit/push Kidea. T05/R09 vẫn IN_PROGRESS/DRAFT.

Không có thay đổi nghiệp vụ, công cụ hệ thống, cấu hình máy, cloud/deploy hoặc lệnh ứng dụng trong gói. Giữ trần 4 giờ mỗi lượt/20 GiB cộng dồn/free 100 GiB và giới hạn container cũ. Các lần gọi metadata sau dùng thời hạn điều phối đủ trong trần 4 giờ, tránh ngắt cưỡng bức sau 20 phút như lượt lỗi này.

## Căn cứ và phạm vi chính xác

Bộ điều phối authoring đặt timeout 1200 s làm public SAVE bị ngắt. Sau đó phát hiện lỗi Kidea: writer tạo `prepared-request.json` **83.111.093byte (79,26MiB)**, trong khi reader phục hồi chỉ nhận 64 MiB. Reader bản đang dùng trả `RECOVERY_FILE_UNSUPPORTED`. Đây là lỗi khớp giới hạn của Kidea, tách khỏi 29/29 kiểm observer và 15/15 nhóm Chrome/TLS đã PASS.

- Pilot: `/Users/kendrick/Desktop/kidea-workshop-pilot`, local, HEAD/source observer `87794537998da2b1603088216c7d3344e9925b1e`, không remote; giữ nguyên HEAD khi pending.
- Operation: `bef9054c-51f3-4f07-a54b-0892fc95247d`.
- Plan/request SHA256: `c176db9833e9359afde230eb0e620e40a4264896690a562c73260ac1e075589d`.
- Target duy nhất: UPDATE `.kidea/work.md`, hiện **BEFORE**, SHA256 `1262463d42e25812ee4704d490252754fc5f49a538593d7f636ef8204cf40be8`.
- [Kiểm kê bytes/diff trường](../tests/evidence/r09/t05-observer-authoring-r1/recovery-proposal-r1/exact-scope.json) xác nhận chỉ hai trường đã nêu thay; mọi dữ liệu work khác giữ nguyên.
- [Patch đóng băng](../tests/evidence/r09/t05-observer-authoring-r1/recovery-proposal-r1/candidate.patch), SHA256 `41347c4152def2f194e5a1e26b22f8cd924bfe4bf51f446826d26b30beb8a11c`. [Manifest](../tests/evidence/r09/t05-observer-authoring-r1/recovery-proposal-r1/manifest.json) ghi hash cũ/mới của từng file. Không tự chấp nhận patch khác sau duyệt; nếu đổi thì phải đánh giá lại phạm vi.

## Kiểm đã làm, chưa làm

Trên Mac Intel/Node 24 có sẵn, **candidate** qua đầy đủ 293/293 core và 9/9 kiểm recovery/cap/migration,0 skip/cancel/todo. 13 kiểm cycle/delivery/interop cũ đều PASS trong mixed-r4; mixed-r4 toàn bộ 21 PASS/1 FAIL do fixture mới thiếu context refs, raw FAIL/source giữ nguyên; đã thêm snapshot/ref thật của fixture và kiểm cuối recovery 9/9 PASS. Các lỗi wrapper/sourceRefs ban đầu cũng giữ trong [diagnostics](../tests/evidence/r09/t05-observer-authoring-r1/recovery-proposal-r1/diagnostics.json). Không sửa kỳ vọng hoặc bỏ ca để lấy PASS.

[Public reader candidate chỉ đọc](../tests/evidence/r09/t05-observer-authoring-r1/finalization-r2/candidate-recovery-r1/candidate-read-result.json) trả RECOVERY_READY với đúng owner/target BEFORE sau kiểm source/Git/tool/hash/projected graph; work và marker không đổi. Đây là kết quả của candidate, **không phải phục hồi thành công hoặc VERIFIED progress của bản đang dùng**. Sau duyệt phải áp đúng patch, chạy kiểm phù hợp trên nguồn thực cuối, tạo grant từ quyết định Human thật, READ_RECOVERY mới rồi RECOVER với basis mới; không dùng statement/basis inspection làm approval.

Không rewrite/delete marker, request, snapshot hoặc tool identity gốc. Không replay external effects. Node và mọi module ngoài hai tên cho phép vẫn bị chặn khi đổi. Windows và Apple Silicon chưa kiểm bản vá; không lấy Mac PASS làm bằng chứng các máy đó. Android/iOS Future chưa roadmap, R10 chưa mở.

## Vì sao cần xác nhận này

[Quyền trọn R09](../docs/R09_EXECUTION_AUTHORITY.md) yêu cầu dừng khi “nới tiêu chí an toàn”;128MiB là thay đổi giới hạn decoder thật. [Recovery contract hiện hành](../.agents/skills/kidea/references/recovery.md) yêu cầu “Obtain a **new explicit grant** for completing those exact metadata targets” và coi đổi tool/runtime là quyết định migration riêng. Gói này gom cả giới hạn, đúng hash code chuyển phiên bản và đúng target để Human duyệt một lần.

Sau khép checkpoint, task kế tiếp là nguồn số đo/lỗi thật C++ và màn vận hành chính W5; chưa có backup/readiness/WQ/E1/Human oncall đầy đủ. Phần áp dụng/khép recovery có độ khó cao; đề xuất **GPT-5.6 Sol + High** theo đánh giá phạm vi, [OpenAI Docs](https://developers.openai.com/api/docs/models/gpt-5.6-sol).
