# Bàn giao Kidea sang phiên Codex trên Mac

Ngày 2026-09-16. Đây là hướng dẫn tiếp tục, không là nguồn trạng thái mới hoặc approval bổ sung cho R05. Đọc trạng thái hiện hành trong [roadmap](../KIDEA_ROADMAP.md#review-current).

Điểm tiếp tục mới: [gói Android A1/iOS](../proposals/r05-native-build-r1.md) đã chuẩn bị sau review r5, **chưa duyệt thực thi**. A1 đề nghị công cụ Android trong Docker volume, không cài host; trần mới chỉ là đề xuất. iOS còn thiếu môi trường Xcode phù hợp. Chưa tải binary native hoặc chạy container trong lượt chuẩn bị này; không tự thực thi từ các lệnh dự kiến trong proposal.

Docker đã được Human cài và E2 được duyệt ở các lượt sau. [R5](../tests/evidence/r05/backend-execution-r5.md) đã hoàn tất kiểm lab backend/Web: ngoại lệ một macro được duyệt/áp, clang-tidy và các ca cuối PASS; guard quota và NSS mới đã kiểm Docker thực. Không restart browser r4 với bootstrap cũ. Trần đĩa 24 GiB, CPU/RAM 2 CPU/4 GiB; container đã dừng/8443 đóng. [Sự cố r4](../tests/evidence/r05/backend-execution-r4/resource-incident.md) giữ nguyên. Tiếp tục review kết quả backend/Web rồi môi trường/mẫu Android/iOS theo roadmap; không tự đóng R05, cài SDK hoặc nâng OS. Nguồn Windows/pilot lịch sử bên dưới giữ nguyên.

Phiên Mac Intel ngày 2026-09-16 đã có [bằng chứng môi trường, lệnh thực và kết quả](../tests/evidence/local-portability-mac-intel-2026-09-16.md). Đọc cùng roadmap trước khi tiếp tục, không coi bàn giao Windows bên dưới là tình trạng mới nhất. Trên máy này `node` mặc định vẫn là 22.22.2; lượt kiểm dùng đường tuyệt đối tới Node 24.19.0 đã có trong runtime Codex. Kiểm lại runtime khả dụng ở phiên sau; đường đó là thông tin máy đã kiểm, không là đường bắt buộc của Kidea.

## Bắt đầu

- Dùng một checkout local độc lập của `https://github.com/Kynderis/kidea.git`, nhánh `master`; ví dụ thư mục `~/Code/kidea` nếu đã xác nhận không đồng bộ. Không đặt trong iCloud/OneDrive hoặc chạy writer Windows và Mac cùng lúc.
- Mở đúng thư mục đó trong phiên Codex chạy local. Không cần chuyển toàn bộ lịch sử chat; repo và hướng dẫn này là điểm bàn giao. Không giả định cài đặt, skill global, PATH hoặc quyền của Windows đã có trên Mac.
- MacBook của Human là Pro 2019 Intel; xác minh máy thực, macOS và kiến trúc tiến trình trước khi chạy. Không coi kiểm Intel là kiểm Apple Silicon.
- Trang desktop chính thức hiện cung cấp bản tải macOS Apple Silicon; chưa suy ra bản đó chạy được trên Intel. Nếu app không phù hợp, dùng Codex CLI tương thích máy/macOS, mở trong thư mục repo rồi chạy `codex`. Kiểm yêu cầu bản công cụ trước cài, không dùng VM để giải bài toán này. Nguồn: [desktop](https://learn.chatgpt.com/docs/app), [CLI](https://learn.chatgpt.com/docs/codex/cli), đối chiếu ngày 2026-09-16.

## Đọc trước khi làm

1. AGENTS.md áp dụng tại máy đích, nếu có.
2. [Roadmap — trạng thái hiện tại](../KIDEA_ROADMAP.md#review-current).
3. [Thiết kế](../KIDEA_DESIGN.md#local-portability-approved) và [phương án Docker](../KIDEA_DESIGN.md#docker-local-cloud).
4. [Phạm vi LP-01](../proposals/local-portability-r1.md).
5. [Kết quả Windows và giới hạn](../tests/evidence/local-portability-r1.md).
6. [Điều kiện/lệnh kiểm](../tests/local-portability/README.md).

Mốc mã triển khai trước bàn giao: `1e5b09f6c506076fdddcb914563bbce139c0dc6f`. Dùng master hiện hành có chứa mốc này; không reset checkout về mốc hoặc ghi đè thay đổi có sẵn. Xác minh remote, nhánh, HEAD và trạng thái Git; nếu nguồn mới hơn thì đọc phần thay đổi liên quan. Mốc Windows: cùng 283 ca PASS trên Node 24.19.0 và 24.21.0; kiểm tài liệu R03/R04 24/24. Đây là kết quả của bản đó, không chứng minh máy mới.

## Công việc phiên Mac

1. Kiểm chỉ đọc macOS/CPU, Node, npm, Git, root local/no-sync, dung lượng và quyền tài khoản thường. Kidea cần Node ≥24; không khóa patch/hash. Git phải hỗ trợ `--no-optional-locks --no-lazy-fetch`, không tìm executable trong project. Không chạy test bằng sudo/root.
2. Nếu đủ điều kiện, chuẩn bị dependency project từ lockfile bằng `npm ci` trong phạm vi phiên mới được giao. Không chép `node_modules`, binary Windows hoặc `.tools` từ máy cũ. Nếu thiếu công cụ hệ thống, trình một gói cài tối thiểu, nguồn/phiên bản/dung lượng/quyền trước khi cài; không tự đổi hệ thống.
3. Từ root repo chạy `node tests/r02-t07/run-tests.mjs`. Đây là bộ kiểm lõi không cần pilot, Docker, Xcode hoặc kết nối cloud. Ghi đúng runtime/OS/CPU và giữ log của cả FAIL lẫn PASS.
4. Nếu gặp lỗi portability trong phạm vi LP-01, sửa nguyên nhân với cùng helper, bổ sung test và chạy lại đầy đủ trên nguồn cuối; không bỏ ca hoặc giảm kiểm quyền/approval/pending để lấy PASS. Không chia bản Kidea theo CPU. Thay đổi có ảnh hưởng Windows phải nêu cần hồi quy Windows nếu phiên Mac không kiểm được.
5. Lưu evidence Mac mới dưới `tests/evidence/local-portability/` với tên riêng; không ghi đè Windows hoặc dùng collector hard-code Windows để thu kết quả Mac. Giữ summary/stdout/stderr, hash nguồn trước–sau và dữ liệu nhận diện môi trường; không commit toàn `.test-output`.
6. Cập nhật trạng thái theo bằng chứng: chỉ Mac Intel thực được PASS nếu đã chạy đạt, Apple Silicon còn NOT_RUN. Giữ phạm vi các gate; không tự đóng toàn bộ LP-01/R05 hoặc chứng nhận iOS/Docker.
7. Sau kiểm phù hợp, lưu điểm tiếp tục, phản chiếu trả lời cuối vào `answer.md`, commit/push master theo quyền repo hiện hành; bảo toàn thay đổi ngoài phạm vi. Nếu thiếu quyền remote/auth thì báo rõ, không đưa secret vào chat hoặc repo.

## Những thứ không tự có trong checkout mới

- Pilot `kidea-workshop-pilot` là thư mục sibling ngoài repo, chưa là repo Git riêng và không tự xuất hiện khi clone Kidea. Bộ lõi không cần nó; thiếu pilot không phải lỗi runtime Mac.
- Nếu tới kiểm hồ sơ pilot, cần bản đúng 15 file. Nguồn khôi phục nằm trong repo: baseline `tests/evidence/r04/design-r1/architecture-post.json`, bản sửa `correction-proposal-final.json`, rồi thay đúng ba file theo `tests/evidence/local-portability/pilot-amendment-r2.json`. Đối chiếu SHA từng file với `allAfterHashes` của amendment. Không tự chạy lại script ghi evidence lịch sử; không ghi đè sibling đang có. Chỉ dựng thư mục sibling sau khi xác định đúng quyền/đích của phiên mới.
- `.test-output`, công cụ trong `.tools`, cache và cấu hình tài khoản Windows không chuyển qua Git. Không cần mang tất cả sang Mac để chạy lõi. Những bài AI/benchmark lịch sử không thuộc lệnh kiểm Mac, không chạy lại chúng.

## Quyết định giữ nguyên

Chỉ thư mục local; mạng/iCloud/OneDrive/multi-writer ngoài phạm vi, không phải backlog. Backend dùng Docker local; cloud qua SSH/Docker khi Human cấp máy/quyền để đo nặng. Chưa cài Docker/Xcode/SDK/VM, thuê cloud, build/deploy ứng dụng hoặc mua phần mềm chỉ để kiểm Kidea. R03/R04 đã duyệt đúng phạm vi; gói D1–D6/P1–P4 của R05 chưa được duyệt toàn bộ. Sau kiểm Mac, đọc roadmap và gom đề xuất bước tiếp theo, không tự mở rộng sang triển khai R05.

Human muốn giải thích ngắn, dễ hiểu, có ví dụ khi cần; gom mọi xác nhận đã biết thành một gói rồi làm liền mạch. Không hỏi lại quyết định đã chốt; chỉ dừng khi thiếu thông tin/quyền có ảnh hưởng thực sự.
