# Bàn giao Kidea sang phiên Codex trên Mac

**Điểm tiếp tục hiện hành: R06 DONE theo [nghiệm thu Human](R06_ACCEPTANCE.md); [R07 DONE theo nghiệm thu Human](R07_ACCEPTANCE.md); lượt kiểm view trên pilot thật chuyển sang gate bắt buộc R09-T14, vẫn NOT_RUN. Bước tiếp: chuẩn bị gói R08. Không tự init pilot hoặc chạy thêm vòng kiểm: đã dùng hai vòng phát triển và một vòng tích hợp cuối theo D5. [Chỉ Chrome](R07_CHROME_SCOPE.md), Safari ngoài phạm vi.** [Kết quả r1](../tests/evidence/r06/implementation-r1.md) được chấp nhận tại `4b365d4`. D1–D7/local đã duyệt; đã triển khai/kiểm core283/283,19nhóm R06+5nhóm lỗi âm và2phiên×4biến thể D7. Không xin lại nội dung hoặc quota D7: cả2phiên đã dùng, không tự chạy thêm. Clang/header macOS/parser có sẵn,0download, không Docker hoặc sửa live pilot. Mã nguồn/bằng chứng được commit cùng báo cáo; giữ FAIL và giới hạn Mac Intel. R07 đã nghiệm thu đúng phạm vi; chưa duyệt triển khai R08/R09. R05 DONE backend/Web; Android/iOS Future, Apple Silicon NOT_RUN; giữ cache/volume.

**Khôi phục hiện hành:**21file trong `tests/evidence/r05/web-scope-r1/after/`, đối chiếu [manifest](../tests/evidence/r05/web-scope-r1/manifest.json). Hàm `restoreCreateOnly(target)` ở `tests/r05/web-scope.mjs` chỉ tạo đích chưa tồn tại, kiểm hash trước/sau; không ghi đè sibling đang có. `before/` khớp chuỗi r1→SDK37 lịch sử. Sample code/build/cache là gói riêng, không tự có từ21docs. Các đoạn bàn giao native và chuỗi restore cũ bên dưới chỉ là lịch sử.

Ngày 2026-09-17. Đây là hướng dẫn tiếp tục, không là nguồn trạng thái mới hoặc approval bổ sung cho R05. Đọc trạng thái hiện hành trong [roadmap](../KIDEA_ROADMAP.md#review-current).

**Mới nhất: [Android simulator bootstrap](../tests/evidence/r05/android-sim-bootstrap-r1.md) đã PASS đúng phạm vi**, sau Human duyệt gói qua annotation và tiếp tục trong lượt. Lab ở `/Users/kendrick/Desktop/kidea-native-lab/android-sim-r1`; API36x86_64,2CPU,guest2048MiB với cờlowram, GLES host; ảnh launcher cuối được xem, mọi process/port lab đã dừng. Giữ FAIL và cache theo receipt. Hạn mức2GiB tải/12GiB đĩa thêm/47GiB tích lũy/90phút vẫn gắn start/deadline cũ, không tự restart/reset. Script thu collection CREATE-only, không chạy lại vào đích có receipt cuối. Chưa cài APK hoặc kiểm N01…N08. Chuẩn bị gói runtime riêng trước chạy. iOS16.2 đã chọn hướng; chưa tải/cài Apple, không xin lại hướng hoặc tự nâng OS. Các đoạn sau là lịch sử.

**Điểm tiếp tục sau chỉ đạo dùng mô phỏng:** [ma trận R05 và gói môi trường](../proposals/r05-simulator-lab-r1.md) thay điều kiện điện thoại thật của gói trước cho các ca lab mô phỏng được. Đã chuẩn bị4archive Android Intel (~1.38GiB); chưa tải binary/cài/boot. A-SIM-BOOT chờ duyệt2GiB tải/12GiB đĩa thêm/90phút, emulator chạy host, không nested Docker. iOS đề xuất lab Xcode16.2 trên Sonoma, chưa đổi baseline hoặc có quyền cài; archive Apple chặn đăng nhập, runtime universal chưa đủ manifest. Không tiếp tục mặc định theo kế hoạch nâng macOS trước đó. Nguồn/metadata tại `tests/evidence/r05/simulator-plan-r1/`; script thu metadata CREATE-only, không chạy lại vào cùng đích. R05 còn mở; Apple Silicon NOT_RUN. Các đoạn dưới giữ lịch sử, bằng chứng A1/pilot không đổi.

Điểm tiếp tục hiện hành: [review A1 và gói thiết bị/iOS](../proposals/r05-native-device-r1.md) đã được chuẩn bị. Human không có Android; giữ kiểm thiết bị chưa chạy. Đã chọn tiếp tục iOS trên Mac Intel hiện tại, Apple Silicon để sau. Tiếp theo chuẩn bị gói OS/Xcode/backup/quyền/ngân sách; chưa cài ADB hoặc chạy thiết bị. Review không thay nghiệm thu Human.

Kết quả A1:  [Android A1](../tests/evidence/r05/android-execution-r1.md) đã PASS đúng phạm vi lab Docker, sau Human duyệt riêng SDK37.0/target37. Lint/unit11+11/debug/release/shrinking và sáu mutant đạt trên nguồn hoàn chỉnh; giữ FAIL trước đó, release unsigned, chưa chạy thiết bị. Không cần duyệt lại A1/SDK37; R05 vẫn IN_PROGRESS. Tiếp theo review kết quả, gói thiết bị Android được chọn và môi trường iOS. iOS chưa có Xcode/OS phù hợp; không tự nâng/cài. Source/code/sample và bằng chứng hiện hành trong repo là căn cứ, không suy runtime device từ build PASS.

A1 giữ công cụ/cache/APK/debug key trong volume `kidea-r05-a1-work`; source ở sibling ngoài repo, snapshot trong evidence. Mọi container đã dừng, không host port;2CPU/4GiB,4GiB tải/15GiB đĩa thêm/35GiB tích lũy là trần đã duyệt, không reset counter/deadline cho lượt mới. Gói SDK37 cho phép một lượt tiếp tục90phút sau deadline khi thực sự cần cùng phạm vi/counter, nhưng lượt A1 này hoàn tất trong deadline3giờ gốc và chưa dùng quyền đó. Không prune hoặc restart container lịch sử tùy ý.

Docker đã được Human cài và E2 được duyệt ở các lượt sau. [R5](../tests/evidence/r05/backend-execution-r5.md) đã hoàn tất kiểm lab backend/Web: ngoại lệ một macro được duyệt/áp, clang-tidy và các ca cuối PASS; guard quota và NSS mới đã kiểm Docker thực. Không restart browser r4 với bootstrap cũ. Trần đĩa trong lượt R5 là24 GiB (A1 sau đó đã duyệt35 GiB tích lũy), CPU/RAM 2 CPU/4 GiB; container đã dừng/8443 đóng. [Sự cố r4](../tests/evidence/r05/backend-execution-r4/resource-incident.md) giữ nguyên. Tiếp tục review kết quả backend/Web rồi môi trường/mẫu Android/iOS theo roadmap; không tự đóng R05, cài SDK hoặc nâng OS. Nguồn Windows/pilot lịch sử bên dưới giữ nguyên.

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

Hồ sơ pilot hiện có21file. Khi cần phục hồi R05 vào đích mới được phép: dùng `tests/evidence/r05/profile-r1/pilot/`, sau đó thay duy nhất `docs/engineering/android.md` bằng [snapshot Android r2](../tests/evidence/r05/android-execution-r1/pilot-android-after.txt). Đối chiếu21hash với [amendment SDK37](../tests/evidence/r05/android-execution-r1/pilot-amendment-sdk37.json). Không ghi đè sibling đang có hoặc chạy lại collector lịch sử. Android r1/36.1 là snapshot cũ, không còn baseline hiện hành.

## Quyết định giữ nguyên

Chỉ thư mục local; mạng/iCloud/OneDrive/multi-writer ngoài phạm vi, không phải backlog. Backend dùng Docker local; cloud qua SSH/Docker khi Human cấp máy/quyền để đo nặng. Docker do Human cài; gói backend/Web và Android A1 đã có quyền thực thi riêng. Không tự cài thêm công cụ host/Xcode/VM, nâng OS, thuê cloud, build/deploy ngoài gói hoặc mua phần mềm chỉ để kiểm Kidea. R03/R04 đã duyệt đúng phạm vi; gói D1–D6/P1–P4 của R05 chưa được duyệt toàn bộ. Đọc roadmap hiện hành trước bước tiếp theo, không suy các approval lab thành quyền triển khai toàn R05 hoặc nghiệm thu sản phẩm.

Human muốn giải thích ngắn, dễ hiểu, có ví dụ khi cần; gom mọi xác nhận đã biết thành một gói rồi làm liền mạch. Không hỏi lại quyết định đã chốt; chỉ dừng khi thiếu thông tin/quyền có ảnh hưởng thực sự.
