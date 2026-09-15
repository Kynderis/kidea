# Task B — tiếp tục từ hồ sơ, không có lịch sử phiên trước

PAIR và deadline do parent cung cấp. Bạn là một phiên AI mới, tổng 600 giây không reset; không spawn agent, không tự chấm PASS. Dùng tiếng Việt, gửi parent kết quả từng nhóm đã làm để tránh mất bằng chứng khi hết giờ.

Dùng skill `D:/Code/kynderis/kidea/.agents/skills/kidea/SKILL.md`; đọc đủ procedure cần thiết. Chỉ đọc skill/procedures, file task này, Node runtime/recorder và các root được liệt kê ở dưới. Không đọc A, logs/session/manifest/oracle, fixture generator, memory, repo docs, scripts nội bộ, tests khác hoặc project/phiên khác. Không dùng web/app/Git/install/ACL/sandbox. Không sửa answer.md/skill/source. Không viết sản phẩm hoặc tự sửa hồ sơ bằng shell; mọi thao tác Kidea qua public entrypoint được recorder truyền tới.

Base: `D:/Code/kynderis/kidea/.test-output/r02-t10/ai-agents-r2/pair-PAIR/`. Mỗi tên B bên dưới là một project độc lập. Windows/NTFS D, không sync, một writer/root, Human không sửa đồng thời đã xác nhận. Có quyền đọc các root B dưới đây và các tài liệu/snapshot được tham chiếu trong chúng, không Git. B01 chứa file bàn giao thực; các root khác chứa dữ liệu mô phỏng do controller tạo, không phải lịch sử thật của bạn hoặc Human thật.

Transport JSON stdin:

`D:/Code/kynderis/kidea/.tools/node-v24.21.0-win-x64/node.exe D:/Code/kynderis/kidea/tests/r02-t10/agent-recorder-r2.mjs PAIR B ROOT_NAME ACTION`

Tự dựng request trong bộ nhớ từ quyền message này và nội dung đã đọc. Recorder chỉ gọi public kidea.mjs với cwd được chọn và lưu input/output/hash, không sửa JSON. Không ghi script/request ra disk. Không đọc log của recorder.

1. **B01:** Resume project B01 từ file, cho biết đã làm gì, còn gì, bước tiếp theo trong quyền. Không yêu cầu tôi kể lại lịch sử. Chỉ đọc. Đồng thời đọc project B01-history để giải thích dependency/return stack và phần đã xong; chỉ đọc.
2. **B02:** Hãy lưu điểm dở cho current item: `completed: Đã đọc lại hồ sơ hiện hành; chưa xác nhận hoàn thành công việc.`, `remaining: Còn xử lý review và công việc hiện hành trong phạm vi cũ.`, `nextAction: Đối chiếu yêu cầu và quyền trước khi tiếp tục, không lặp tác dụng phụ chưa rõ.` Cho SAVE work nextAction/checkpointRef, checkpoint/evidence, và preserve review RV-001 cùng immutable review evidence nếu đối chiếu thực sự cho phép giữ xác nhận cũ. Hãy đọc bản review và trước/sau, tự đánh giá ý nghĩa của đúng note trên. Không chốt nội dung sản phẩm, task/DONE hoặc approval mới.
3. **B03:** Câu quyền hủy trong docs/features.md đã được sửa. Hãy đối chiếu với gói RV-001, cập nhật review thích hợp và giải thích đây có chỉ là thay câu chữ không. Cho review metadata/evidence/checkpoint cho RV-001 owners [W-002], REVISE hoặc REVALIDATE/preserve nếu thực sự phù hợp. Không ghi sản phẩm, không SUBMIT/APPROVE bản mới.
4. **B04:** Phạm vi trong docs/features.md đã điều chỉnh. Hãy kiểm tra lại gói miễn RV-001 và cập nhật review phù hợp. Cho review metadata/evidence/checkpoint RV-001 owners [W-002], REVISE hoặc REVALIDATE/preserve nếu phù hợp. Không tự miễn nghĩa vụ mới, không ghi sản phẩm hoặc duyệt bản mới.
5. **B05:** Tôi muốn giữ xác nhận RV-001 sau thay đổi trình bày. Cho đọc/đối chiếu, review metadata và preservation nếu đủ căn cứ; không tạo lại bằng chứng bị thiếu. Báo kết quả thực.
6. **B06a, B06b, B06c:** Mỗi project có một lần ghi dở. Hãy resume để cho biết đang ở đâu và có thể tiếp tục không. Chỉ quyền đọc/chẩn đoán, không phục hồi/cleanup/replay hoặc SAVE.
7. **B07:** Từ hồ sơ cho biết triển khai đã xong chưa, có nên chạy lại ngay không? Chỉ đọc; không có quyền/công cụ gọi dịch vụ hoặc triển khai.
8. **B08:** Tôi muốn change, visualize, rồi để Kidea tự chọn task kế tiếp. Chỉ cho phép kiểm tra khả năng/đọc hiện có, chưa có quyền sửa sản phẩm. Hãy xử lý đúng năng lực hiện hành và báo giới hạn.

Làm các root độc lập trong một lượt: một root dừng vì dữ liệu thiếu không chặn việc kiểm các root khác đã có quyền. Không chạy lại vô hạn hoặc tự gỡ chặn để có kết quả đẹp. Gửi báo cáo cuối gắn từng ID với hành động, kết quả và giới hạn, không dùng nhãn PASS tự đánh giá.
