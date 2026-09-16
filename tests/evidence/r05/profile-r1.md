# R05 — Kết quả soạn quy tắc và đặc tả test r1

Ngày 2026-09-16. **Đã soạn/kiểm hồ sơ, chưa nghiệm thu R05.** Human “Tôi duyệt nhé” sau [answer cfffe0c](https://github.com/Kynderis/kidea/blob/cfffe0c/answer.md) duyệt D1–D6/P1–P4 và tiếp tục trên Mac. Approval đó cho làm hồ sơ, không tự duyệt nội dung mới hoặc cài/build ứng dụng. [Trạng thái hiện hành](../../../KIDEA_ROADMAP.md#review-current).

## Đầu ra để review

Đã khôi phục CREATE-only đúng 15 file pilot từ R04 + amendment LP-01 vào `/Users/kendrick/Desktop/kidea-workshop-pilot`; đối chiếu toàn bộ SHA trước soạn. Không có cây cũ để ghi đè, không tạo Git repo/push pilot. [Biên nhận khôi phục](profile-r1/restoration.json).

Tạo đúng **sáu hồ sơ**, gồm **40 rule** và **20 nhóm kiểm kỹ thuật nối 137 ca nguồn** (54 nghiệp vụ, 83 thiết kế). Chỉ nối backlink vào architecture và business/tests; 13 file cũ còn lại nguyên byte, phần gốc của hai file có backlink cũng nguyên byte. [Phương pháp dùng lại](../../../proposals/r05-profile-method-r1.md), [review tác giả](profile-r1/review.md).

| Hồ sơ | Bản chụp để đọc trên GitHub |
|---|---|
| Quy tắc chung/revision/ngoại lệ | [rules.md](profile-r1/pilot/docs/engineering/rules.md) |
| C++20/Ubuntu và transaction/grammar | [cpp.md](profile-r1/pilot/docs/engineering/cpp.md) |
| Web/SSR/TypeScript | [web.md](profile-r1/pilot/docs/engineering/web.md) |
| Android/Kotlin/Compose | [android.md](profile-r1/pilot/docs/engineering/android.md) |
| iOS/Swift/SwiftUI | [ios.md](profile-r1/pilot/docs/engineering/ios.md) |
| Test specs/coverage/oracle/evidence | [tests.md](profile-r1/pilot/docs/engineering/tests.md) |

Các bản chụp là evidence cố định của hồ sơ trong sibling, không một bộ nguồn để chỉnh song song. Manifest giữ SHA và nội dung toàn 21 file cho chuyển máy; thay snapshot chỉ bằng một lượt evidence mới sau khi đối chiếu nguồn, không ghi đè lịch sử.

## Kết quả thực và lỗi được giữ

- **R05: 11/11 kiểm hồ sơ PASS**, gồm ca âm thiếu/thừa/thay tên file, sửa byte nguồn, bỏ coverage, mất ví dụ sai, giả PASS/approval và link/anchor hỏng. **998 liên kết nội bộ pilot hợp lệ**; không phải kiểm availability của mọi URL ngoài repo.
- Chạy cùng bộ R03 hiện hữu: **8/9 PASS**, một FAIL vì test inventory chỉ loại `design/`, chưa nhận sáu file `engineering/` được R05 cho phép. **Tổng lượt gộp 19/20, không skip/cancelled/todo. Không tuyên bố toàn bộ suite PASS.** R05 kiểm chính xác 21 file và byte nguồn, không chỉ bỏ qua thư mục mới; test/evidence R03 cũ không bị sửa để xanh.
- Giữ raw từng lượt trong các thư mục `run-*` cạnh snapshot, summary có source/pilot SHA trước–sau và hash stdout/stderr. [Lượt đầu](profile-r1/run-1/summary.json), [lượt cuối](profile-r1/run-2/summary.json) và [manifest SHA](profile-r1/manifest.json) đều được lưu, không chỉ chọn lượt đẹp. Lệnh: Node24 đã xác minh chạy `tests/r05/run-tests.mjs` từ root repo; dữ liệu tạm chỉ dưới `.test-output/r05`.
- Core LP-01 **283/283 là lượt Mac trước**, không phải số test chạy mới ở R05. Kiểm hash 36 file core không đổi để giữ đúng giới hạn bằng chứng. Không chạy lại AI/benchmark hoặc sửa runtime/skill/schema/dependency Kidea.
- Mọi build/sample/app/performance/restore/device test đều **NOT_RUN**. R04 suite cố định inventory15 không được gọi lại trên cây21; kết quả R04 lịch sử giữ đúng snapshot15, còn bảo toàn nguồn mới do phép so exact byte R05 kiểm. Review tác giả không thay review độc lập hoặc Human gate.

## Môi trường và phần chưa đủ để cài/build

[Nguồn/phiên bản/giấy phép/cảnh báo đã tra](profile-r1/sources.md), [metadata npm nguyên kết quả đọc](profile-r1/npm-metadata.json). Chỉ đọc mạng; không tải dependency sản phẩm hoặc chạy code bên ngoài.

Mac Intel/macOS14.7/16GiB, khoảng383GiB trống theo lượt đọc; Node24.19 có sẵn dùng cho kiểm hồ sơ. Không thấy `docker` trên PATH hoặc Docker/Xcode/Android Studio ở các vị trí `/Applications` thông thường đã kiểm; đây không là tìm kiếm toàn máy. Chưa chạy các công cụ đó, đổi PATH, nâng OS hoặc cài SDK.

| Phần | Kế hoạch ứng viên / blocker thực | Cần có trước xin quyền thực thi |
|---|---|---|
| Backend | Ubuntu24.04 Docker/amd64, GCC13.3/CMake3.28.3, Drogon1.9.13/SQLite3.53.3/Caddy2.11.4 | Docker Desktop bản Intel còn hỗ trợ OS thực, artifact/checksum/license, image digest và package/transitive revisions; nơi volume/cache, giới hạn RAM/CPU và lệnh mẫu hữu hạn |
| Web | Sáu package baseline đã đối chiếu metadata; Node sản phẩm24.20/npm11.19 là ứng viên | Lockfile/transitives, phiên bản lint/typecheck/browser test, artifact Node và phạm vi cài dependency; không dùng npm ci Kidea làm bằng chứng web |
| Android | AGP9.2.1/Gradle9.4.1/JDK17; Kotlin/BOM baseline chưa resolved | Exact SDK/JDK/build-tools, wrapper checksum, thiết bị/OS, dung lượng download/unpack/cache, license và quyền build mẫu |
| iOS | Xcode26.6 cần Tahoe26.2–26.x theo Apple; máy hiện Sonoma14.7 | Human chọn chuẩn bị OS/host đáp ứng baseline hoặc review riêng tổ hợp khác. Chưa tự đề nghị hạ Xcode để PASS; cần exact download/dung lượng/SDK/device/signing và phương án khôi phục trước xin cài |
| Tải/restore/observer | Local Docker không thay host độc lập; cloud chưa được cấp | Host/SSH/quyền/dữ liệu giả, chi phí/thời hạn/workload/điều kiện dừng, backup miền lỗi độc lập. Chưa cần cấp cloud cho lượt hồ sơ |

Chưa có kích thước download/cache và exact installer cho mọi thành phần, nên **chưa có gói cài đặt đủ điều kiện để bạn duyệt**; không bịa số dung lượng hoặc xin quyền mở rộng chung chung. Có thể review nội dung hồ sơ ngay trên máy Intel; việc build sẽ được trình thành gói cụ thể sau khi chốt hướng môi trường, giữ các nghĩa vụ R05.

## Điểm cần duyệt và tiếp tục

Đề nghị review chung **R5-1–R5-4** tại [phương pháp r1](../../../proposals/r05-profile-method-r1.md): hợp đồng/bốn profile; grammar và vector; test specs; ứng viên toolchain cùng giới hạn. Đây là gate nội dung T01-S04/T02–T06-S02, khác quyền soạn đã cấp. Chưa tích hợp skill hoặc mở build. Test inventory R03 còn bất tương thích với R05 được giữ minh bạch, không nghiệm thu toàn bộ mọi bộ kiểm.

Sau duyệt nội dung mới chuẩn bị gói môi trường/build hữu hạn; mẫu đúng–sai bốn nền tảng vẫn thuộc R05. LP-01 còn Apple Silicon NOT_RUN, không chặn review tài liệu R05 và không bị tự đóng. Không coi bản hồ sơ này là toàn Kidea hoàn tất.
