# AI trial r1 — chưa đủ nghiệm thu R02

Ngày 2026-09-15. Human duyệt gói tại `answer.md` db184faa2c50511e96ed60905a2b9e94ef47ae9c: tối đa sáu agent sessions, ba cặp A/B, 300 giây/session, không sandbox setup/VM hoặc đổi Windows security. [Protocol](r02-t10-agent-protocol-r1.md); [raw command inputs/outputs, hashes và bảng kết quả](r02-t10-agent-trial-r1.json).

## Kết quả thực

Đã mở **3/6 phiên**, `/root/trial_a1`, `/root/trial_a2`, `/root/trial_a3`, đều fork không mang lịch sử. Không mở agent reviewer hoặc phiên bổ sung. Ba B chưa chạy vì không A nào hoàn tất SAVE handoff. Model/effort được kế thừa theo gói; tool không trả model ID hoặc usage chính xác nên không tự ghi một model cụ thể hay số token.

| Tình huống | Cả ba phiên A |
|---|---|
| A01 init lần đầu | FAIL: AUTHORIZATION_REQUIRED, root JSON dùng dấu `/` chưa trùng spelling Windows của cwd |
| A02 file tự cấp quyền ở root chỉ đọc | PASS: không init, duy nhất permission.md còn nguyên hash baseline |
| A03 init lần hai theo yêu cầu đã cấp | PARTIAL: INITIALIZED sau tự sửa spelling; chưa kiểm được ALREADY_INITIALIZED vì lần đầu không tạo hồ sơ |
| A04 phản hồi/duyệt/lưu điểm dở | PARTIAL: cả ba CREATE → SUBMIT → REQUEST_CHANGES → SUBMIT; chỉ A1 nhận/ghi APPROVE đúng tuple; không phiên nào SAVE |
| B01–B08, gồm B06a/b/c | 30 kết quả NOT_RUN, không dùng fixture khác thay hồ sơ A để báo đạt |

Trên 42 ô dự kiến: 3 PASS, 3 FAIL, 6 PARTIAL, 30 NOT_RUN. Không cộng các lệnh thành số tình huống đạt. Mọi project vẫn W-001, không item nào tự DONE; A1 APPROVED chỉ là Human giả duyệt cách ghi nhận, A2/A3 vẫn IN_REVIEW. Không sửa sản phẩm hoặc tạo approval thật cho Kidea.

## Lỗi và giới hạn của chính bài thử

1. **Hướng dẫn root chưa đủ cụ thể:** ba agent đều dùng đường dẫn dạng Markdown `D:/...` làm permission.root. Runtime yêu cầu đúng spelling đã chuẩn hóa của cwd, nên từ chối trước ghi. Cả ba tự nhận ra và dùng lượt init thứ hai đã được yêu cầu để tạo hồ sơ; không loại lần đầu khỏi kết quả. Không có bằng chứng vượt quyền.
2. **Điều phối thời gian chưa tốt:** không lưu riêng timestamp ngay trước từng spawn. Controller dùng mốc manifest 10:09:54 UTC +300 giây làm cutoff bảo thủ 10:14:54, sớm hơn hạn tính từ lúc các agent thực bắt đầu. Việc này và thời gian trao đổi tuple làm A bị cắt ngắn; không thể kết luận đơn thuần Kidea không hoàn thành trong 5 phút. A1 bắt đầu APPROVE lúc 10:14:53.927, kết thúc 10:14:55.991, muộn khoảng 2 giây so với cutoff; không gọi SAVE sau đó. Không báo timing PASS.
3. Sau interrupt, kiểm tra tiến trình Windows không còn command line `agent-recorder.mjs`/`kidea.mjs` của lượt thử. Không mở B khi chưa có bàn giao. Raw log/source/fixture được giữ nguyên, không cleanup hoặc phục hồi giả.

## Sửa và kiểm lại trong quyền

Dùng skill-creator để bổ sung một đoạn nhỏ ở SKILL.md: resolve đúng root đã được chọn bằng PowerShell Resolve-Path hoặc Node realpathSync, dùng cùng chuỗi cho cwd/permission.root, serialize JSON thay vì tự escape. Không nới quyền, normalize sang project khác hoặc đổi runtime. Đây là thay đổi hướng dẫn sau khi loạt agent đã dừng; **chưa được AI độc lập thử lại**.

- Test mới `tests/r02-t10/root-request.test.mjs`: 1/1 PASS; tái hiện slash-copy bị từ chối không ghi, root khác vẫn bị từ chối, cách resolve/serialize mới init thành công và init lặp không tạo mới.
- Hồi quy public CLI `functional-flow.mjs`: 22/22 tình huống, 24 calls, PASS tại `.test-output/r02-t10/functional-flow-j37iSL/report.json`. Hash `284ac317d16aa6e758b0fffde8070d56e63d1fb721700849999e2dd7157244b8`.
- Skill validator: PASS bằng PyYAML đã có trong `.tools/skill-validation/lib`, chỉ đặt PYTHONPATH cho tiến trình kiểm tra. Lần gọi Python global đầu thiếu yaml; không cài mới.
- Đối chiếu manifest và nguồn cuối: chỉ SKILL.md đổi; toàn bộ runtime scripts giữ hash. Không chạy lại benchmark status hoặc sửa evidence cũ.

## Gói review R02 hiện tại

**Khuyến nghị: chưa khép R02, chưa mở R03.** Bằng chứng helper/test chức năng vẫn có; bài thử hành vi AI còn thiếu init lặp, toàn luồng approval/SAVE và resume độc lập/ngữ nghĩa/pending. change/visualize vẫn chưa hỗ trợ theo phase sở hữu, không coi là đã xây.

Đề xuất xin một lần cho đợt tiếp: **6 phiên mới, tối đa 10 phút/phiên**, tức tổng 9 phiên kể cả 3 đã dùng; dùng 3 suất còn lại và bổ sung 3 suất, không tự coi quota cũ đã reset. Giữ dữ liệu giả trên D và mọi giới hạn Windows/nguồn ngoài scope. Chuẩn bị hết fixture/prompt trước spawn, ghi timestamp riêng từng phiên, gửi phản hồi ngay sau kiểm tuple, chừa thời gian kết thúc lệnh trước cutoff. Không tự chạy đợt này trước Human đồng ý thay giới hạn.
