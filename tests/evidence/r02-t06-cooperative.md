# R02-T06-S04 — writer hợp tác và Git-first

Ngày: 2026-09-14. Phạm vi được Human duyệt tại [sổ công việc](../../KIDEA_ROADMAP.md#lean-core-review), hợp đồng tại [DESIGN](../../KIDEA_DESIGN.md#lean-operation-approved). Đây là kiểm chứng xác định trên dữ liệu tổng hợp, không phải nghiệm thu AI, toàn KA-10 hoặc toàn lõi.

## Kết quả trên bản cuối

**174/174 PASS; 0 FAIL, 0 skip, 0 cancelled.** Bắt đầu `2026-09-14T09:14:18.822Z`, thời gian test khoảng 95 giây. Runner xác nhận toàn bộ source/test/dependency/skill được theo dõi không đổi trước–sau (`inputsUnchanged: true`), exit 0.

| Bộ kiểm tra hiện hành | Kết quả |
|---|---|
| Public helper/đối số | 15/15 |
| Status, schema, gate, version và Git review evidence | 78/78 |
| Writer hợp tác, Git và cleanup | 61/61 |
| Init/caller, Git source và ngắt tiến trình | 20/20 |

Lệnh tái lập trên host đã được thiết lập: `.tools/node-v24.21.0-win-x64/node.exe tests/r02-t07/run-tests.mjs`. `npm test` cũng trỏ cùng runner nhưng vẫn cần chạy bằng đúng Node đã duyệt. Các suite Win32/native/proof cũ không thuộc lượt này; không cộng kết quả cũ vào 174 ca.

Môi trường đã đọc lại: Windows, ổ D là NTFS/Fixed; Node `v24.21.0`, SHA-256 `ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32`. Git local `2.50.1.windows.1` tại `C:/Program Files/Git/cmd/git.exe`, SHA-256 `c954fcc8e65a38450895ca65d308ecaee63f044d16494b5385faa5e036a3facb`.

Raw output và manifest source trước–sau giữ local tại `.test-output/r02-t07/regression-os1wQJ/`; fixture/request/result của từng suite cũng được giữ tại các đường runner in trong stdout. Không đưa dữ liệu tổng hợp lặp lại vào Git.

- `summary.json`: SHA-256 `e1a95add0abcf9370c011d131d6fd4a276a1f9f3b8ca90b6d4f68d0b68325097`.
- `stdout.txt`: SHA-256 `a9d9dc64de84d08355d948fb6a43f166be78fdaee1a49f3bed9019dd3660c789`.
- `stderr.txt`: rỗng; SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## Đã thay và đã kiểm tra

- Bỏ runtime PowerShell/C# và giao thức proof/FINALIZE hai tiến trình. Node ghi trực tiếp; một `active.json` tạo độc quyền trong vùng pending chặn helper hợp tác chạy chồng. Chốt hiện bao trọn một lần helper/init, chưa tự bao mọi lệnh shell/formatter/Git của AI; caller tương lai phải điều phối chúng tuần tự.
- UPDATE giữ đúng bản ngay trước, ghi `r+` vào file hiện hữu để không thay file identity/thuộc tính bằng file tạm khác. CREATE dùng `wx`, không nhận file đã có thành UPDATE. Test quyền, root, alias/link, nguồn/đích đổi, readonly, trạng thái bận và gọi lại cùng operation không ghi lại hoặc che lỗi.
- Git-first chỉ khi có quyền đọc lịch sử local: bản HEAD cố định, đang gắn với branch và truy được qua ref hiện có, đúng raw byte. Dirty/untracked/non-Git/detached/khác newline dùng snapshot. Không tạo commit/ref, stash, chạy filter/hook, fetch hoặc đổi index/config. Không dò repo cha hoặc chọn executable trong project; test xác nhận không spawn Git khi chưa có quyền hoặc root không có `.git`.
- Init giữ đúng source/profile đã chọn; Git version hoặc snapshot gắn đủ byte/anchor và được đọc lại. Schema hồ sơ vẫn là 2; request writer nội bộ chuyển protocol 2, thêm xác nhận `singleKideaRun` và quyền đọc Git tùy chọn. Request cũ không tự được nhận là quyền hợp tác mới. Lệnh công khai vẫn chỉ init CREATE và status đọc; không có approve/resume/change/visualize thực thi.
- Checkpoint nhỏ giữ bản trước/dự định và kết quả kiểm tra; pending còn sau lỗi/tiến trình thoát. Bản prepared bất biến còn dùng đối chiếu nếu checkpoint cuối bị ngắt. Không tự replay, restore hay xóa CREATE dở. Đã ngắt thật tiến trình Node ở các điểm trước/sau ghi; status/init không tự báo đã xong hoặc tự chữa.
- Cleanup chỉ cho bản tạm thuộc operation, đúng grant/retention/hash. Test chặn khi owner còn IN_PROGRESS, gate chưa APPROVED, bản còn live Ref, grant thiếu hoặc bytes đổi; gián đoạn dọn giữ pending/bằng chứng. Không xóa Git object/ref hoặc snapshot review.
- Status nhận review evidence Git cố định và kiểm hash/anchor; thiếu Git hoặc byte không khớp thì dừng. Bound graph bắt buộc nhận đủ Git bytes, không tự đọc fallback; nguồn tự ghi APPROVED vẫn không là Human approval.

## Lượt phát triển và giới hạn

Lượt init `.test-output/r02-t07/init-JCI90V` có 20 ca hành vi đạt nhưng kiểm tra hash cuối thất bại vì writer còn được chỉnh trong lúc chạy; **không tính là lượt PASS hợp lệ**. Lượt cố định `.test-output/r02-t07/regression-Qciszg` đạt 170/170 trên bản trước khi bổ sung bốn ca cuối và chặn Git discovery repo cha; giữ làm lịch sử, không thay lượt 174/174 ở trên. Các lượt phát triển/targeted của writer cũng giữ fixture, không cộng dồn thành số ca duy nhất.

`node --check` đạt cho mọi runtime module hiện hành; `skill-creator/quick_validate.py` đạt với PyYAML 6.0.3 đã có trong `.tools/skill-validation/lib`, không cài mới. Rà độc lập phát hiện Git có thể dò repo cha trước khi đối chiếu root; đã sửa và thêm ca chứng minh không spawn/không đổi metadata repo cha. Các điều kiện cleanup quan trọng từ suite cũ đã được kiểm lại trong suite mới.

Kiểm tra tài liệu cuối: 405 liên kết local/anchor trong bốn tài liệu chính, skill/procedure, báo cáo này và answer không lỗi; không có anchor trùng. `git diff --check` đạt. Hash các đầu vào test cuối vẫn khớp sau khi ghi báo cáo/lộ trình.

Giữ nguyên protocol/evidence T06 và T07 cũ, cùng manifest AI fixture SHA-256 `4105197f29250cfbf6ecbe6ec74f1052403e6c212ffd96bdb7a73344bc0f15de`. Mã native đã bỏ khỏi runtime hiện hành, còn truy lại được tại [bản trước tinh gọn](https://github.com/Kynderis/kidea/tree/c613cb7d7cb695af54b556fff431cfeaba9d1440). Không chạy lại các suite native với writer mới để chấm lại lịch sử.

Không thử hay bảo đảm chống writer/editor/sync ngoài mô hình, mất điện/hỏng ổ, nhiều file đổi nguyên khối hoặc khóa qua máy. Git/snapshot phải còn được giữ trong thời gian cần đối chiếu; không là backup ngoài ổ đĩa. Chưa tự khôi phục sau gián đoạn, chưa dùng project thật/pilot/production. T07 AI vẫn 0/3 và protocol cũ tạm dừng; không đổi ACL, chạy sandbox/VM hoặc dùng quota trong lượt này. Sự cố launcher/ACL còn riêng, không được coi là đã sửa bởi thay writer.
