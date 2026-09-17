# R08 R2-A — thực thi lab release local

2026-09-17. **PASS_SCOPED — 15/15 vector lab đạt; R08 vẫn IN_PROGRESS, chưa nghiệm thu phase.** Human “Duyệt nhé” trên gói tại `d2457997d1e8fb81d420af619c172b7afd5f587d`; [approval/environment](lab-r2-execution-r1/start.json). Manifest được duyệt `243a7024769d4cc5daef78f7b0996f53690b680a72af7d0b36105d7eb9558d6d`, nguồn không đổi. Một lượt duy nhất `1789630005643-59093`, runner exit0,27.624giây; [summary thật](lab-r2-execution-r1/raw/summary.json), [receipt kiểm sau chạy](lab-r2-execution-r1/receipt.json).

## Kết quả quan sát

| Nhóm | Bằng chứng thực |
|---|---|
| Baseline/reuse | HTTP backend/Web đúng target/config/artifact; đổi Web A→B giữ backend digest; cùng display version nhưng Web digest khác |
| Target/grant/revision/ID/overlap/source | Guard từ chối trước deploy; sau từng yêu cầu âm đọc actual backend state không đổi. Copy đổi migration bị kiểm package hash chặn. Đây là guard phía controller, không là phép đo IAM của PROD |
| Partial/retry | Web process được inject exit17, backend còn trả dữ liệu; client Web exit23/UNKNOWN, không tổng hợp thành VERIFIED. Attempt retry có ID mới và readback đạt; giữ attempt lỗi |
| Mất receipt | HTTP backend commit transaction rồi đóng socket; client exit23. Readback thấy version hợp đồng2, dữ liệu migrated/role reader và đúng1migration; quyết định DO_NOT_REPLAY, không gửi lại migration |
| Rollback/restore | Chạy lại Web A vẫn thấy contract2 và HTTP503; rollback app không được coi restore. Restore snapshot logic trả contract1, dữ liệu original, role admin, migration ledger trống; admin/Web readback đạt |
| Observer | Heartbeat tiến triển khi không có request client; pause container thật làm dữ liệu stale, không nhận healthy; unpause để tiếp tục. Không thử mất host hoặc observer độc lập |
| LAB PROD | Cùng script triển khai, config/data tách khỏi LAB DEV; target/config/artifact và HTTP đúng. Không PROD thật |

15record tại `raw/case-*.json`; raw `command-*.json` giữ stdout/stderr/status/time, gồm các lỗi được inject. Không bỏ ca, hạ kỳ vọng hoặc chạy lại để che lỗi. Node24.19.0/Linux x64 được ghi bởi process thật; macOS14.7 Intel điều khiển. SQLite ExperimentalWarning và lỗi transport đúng ca âm giữ trong raw; không gọi zero-warning.

## Tài nguyên, source và teardown

[Inspect cuối](lab-r2-execution-r1/containers-final.json) xác nhận cả6container đã dừng, không paused, cùng image được duyệt, readonly/network none/0port,1CPU/512MiB cả memory+swap và user1000:1000. Thời gian StartedAt→FinishedAt không chồng nhau. Đây là xác minh cấu hình cưỡng chế, không đo peak RSS bằng sampling.109container lịch sử giữ nguyên ID/name/state, không đụng volume cũ. Không tải/cài/build image/cloud/AI trial hoặc ghi pilot. Không phải dùng entry recovery sau crash; đường finally stop/unpause đã chạy thật, recovery riêng chỉ đã kiểm local ở preparation.

Hash nguồn repo và snapshot đều khớp manifest; không sửa runtime/helper/schema Kidea. Output working134.869byte, evidence thu tại thời điểm receipt166.386byte, nhỏ hơn quota; log Docker giới hạn2MiB/container, root readonly/tmpfs16MiB và mọi container dừng. Không có host port. Sàn đĩa100GiB được guard kiểm trước lệnh, toàn lượt dưới15phút. Lock được giải phóng, container/data/log giữ để audit; không prune hoặc reset ngân sách. Một lượt đã dùng hết quyền execution của manifest này.

[Kiểm preparation trên đúng hash](lab-r2-preparation/round-2/verification.json) đã có8/8unit và core283/283PASS. Lượt này chỉ chạy lab được duyệt, không chạy lại core khi source không đổi. Tài liệu trạng thái được cập nhật sau kết quả; không gán PASS preparation thành một lượt test mới.

## Nghĩa vụ còn trước khép R08

| Phần | Trạng thái sau R2-A |
|---|---|
| T01/T02 hướng dẫn kế hoạch/code/G2 | Đã triển khai và review r1; Human nhận kết quả còn riêng |
| T03 build/profile/môi trường sản phẩm | Chưa có lượt R08 xác minh bộ build/deploy theo profile backend/Web sản phẩm; fixture Node không thay C++/Web R05 |
| T04/T05 release/attempt/readback/restore | Có vector lab thật hữu hạn; restore là snapshot logic fixture, contract marker không phải ALTER TABLE, role giả không chứng nhận RBAC sản phẩm |
| T06 vận hành độc lập/khép | Heartbeat cùng Docker host không chứng minh job/alert khi mất laptop/host; cần đúng host/quyền và evidence, không cloud tự cấp |
| Nghiệm thu R08/R09 | Chưa khép R08; không tự chuyển nghĩa vụ sang R09. R09-T14 view pilot thật còn NOT_RUN |

Bước tiếp: đối chiếu hồ sơ R05 với phần T03–T06 còn thiếu để chuẩn bị gói kiểm profile sản phẩm và phương án host/observer cụ thể. Không tự áp lại R05-TIDY-01, không chạy build/cloud hoặc native ngoài quyền. Apple Silicon NOT_RUN; Android/iOS Future chưa roadmap.
