# R05 — Gói kiểm Android Emulator, r1

Ngày 2026-09-17. **PREPARED_SPEC / EXECUTION_DRAFT**. Human giao “ok làm những cái này đi” vào đề nghị chuẩn bị gói kiểm Android và hoàn thiện thông tin iOS. Lượt này được soạn/kiểm nhẹ; chưa mở ngân sách build/runtime mới. Không kế thừa deadline bootstrap đã kết thúc. [Ma trận đã chốt](r05-simulator-lab-r1.md), [bootstrap PASS](../tests/evidence/r05/android-sim-bootstrap-r1.md), [receipt chuẩn bị](../tests/evidence/r05/native-runtime-plan-r1/receipt.json).

## Phạm vi và nguồn

Kiểm phương pháp/rule Kidea qua mẫu nhỏ trên AOSP API36 x86_64; không xây ứng dụng pilot đầy đủ. Giữ compile SDK37.0/target37, min26 của mẫu. Đây là lựa chọn project mẫu, không là sàn Kidea áp đặt cho project khác. Không nhận đã kiểm API26/37, ARM hoặc điện thoại thật.

Nguồn xuất phát là [snapshot cuối A1](../tests/evidence/r05/android-execution-r1/sample/README.md); 23 file khớp sibling trong receipt mới. Phải dùng `final-artifacts/source-verification.json` và manifest A1 cuối, không dùng `final-source-before.json` là mốc trung gian. Tạo mẫu mới CREATE-only dưới `tests/r05/fixtures/android-runtime-r1/`, rồi materialize vào `/Users/kendrick/Desktop/kidea-native-lab/android-runtime-r1/` khi chạy. Giữ A1 và 21 hồ sơ pilot nguyên byte. Không chạy lại script bootstrap/collector lịch sử vào đích cũ.

Mẫu A1 thực có `LabController`, `MainActivity`, 11 unit test, identity actor/epoch/workshop và cache key có cấu trúc. Chưa có audience trong identity, persistence qua process, transport thật, permission INTERNET, test APK hay release signing. `serial` intent hiện trong RAM nên không thể dùng làm ID bền qua relaunch. `switchActor` hiện hủy loadJob; gói mới phải kiểm cả submit/lookup đang chờ, không suy bỏ response đồng nghĩa đã hủy job. Những phần này là công việc source cần bổ sung, không ghi PASS từ A1.

## Tám nhóm kiểm và lỗi mẫu phải bắt

| Nhóm | Chuỗi kiểm cụ thể và assertion | Mutant/oracle | Bằng chứng |
|---|---|---|---|
| N01 | Chạy lint debug/release, unit hai variant, build hai APK trên SDK37; warningsAsErrors giữ nguyên. Ghi hash source/config/lock/toolchain. | SDK/config sai bị từ chối đúng lỗi cấu hình; không dùng lỗi thiếu dependency làm PASS mutant. | XML lint/JUnit, stdout/stderr, task inventory, APK metadata. |
| N02 | Giữ await bằng barrier; logout/đổi actor/đóng owner rồi trả callback cũ; title/cache không nhận dữ liệu cũ. Rotate 10 lần, background/foreground và Back; sau settle observer/job về baseline. StrictMode phát hiện I/O main. | Bỏ generation guard; bỏ cancel owner; bỏ hủy actor-job. Mỗi biến thể phải fail assertion được chỉ tên trước. | Bộ đếm theo owner/actor, lifecycle log, trạng thái trước/sau và ảnh. |
| N03 | Đọc/recompose/rotate/Back không POST; bấm đăng ký gửi đúng một intent; drop response giữ UNKNOWN; đối chiếu GET dùng lại ID. | Auto-submit khi compose; sinh ID mới khi reconcile. | Số POST/GET và intent ID từ backend + UI UNKNOWN/SUCCESS. |
| N04 | Cache tách actor/epoch/workshop/audience; uint64: 9007199254740993 và 18446744073709551615 giữ chính xác, 18446744073709551616 bị từ chối. Recreate rồi force-stop/relaunch từ host giữ UNKNOWN/ID và không POST mới. | Bỏ audience; cache key ghép chuỗi va chạm; reset ID hoặc replay POST khi restore. | Unit + file state kiểm có kiểm soát + backend ledger sau relaunch. Không gọi force-stop là mọi dạng OS kill. |
| N05 | HTTPS trusted cert thành công; cert sai CA và sai hostname bị từ chối trước body. Backend commit rồi đóng response; client reconcile cùng ID. Revoke actor trả 401/403 không lộ payload. Token sentinel chỉ ở Authorization, không URL/log/plain preferences. | Trust-all/hostname bypass; token trong URL/plain preferences; retry POST với ID mới. | TLS failure nguyên nhân, ledger, log scan, kiểm ciphertext + Android Keystore API. Không chứng nhận StrongBox/backup phần cứng. |
| N06 | Giữ N1/N2; xác nhận label/role/state và focus qua accessibility tree, font scale2.0 không che nút; Back/relaunch đúng nghĩa; snapshot app-switcher không lộ sentinel. | Xóa nhãn/trạng thái; làm nút không focus; bỏ bảo vệ màn nhạy cảm. | Accessibility node/assertion, ảnh trước/sau, review ảnh thật. TalkBack giữ NOT_RUN cho tới phép kiểm tương đương được review rõ. |
| N07 | Release R8/shrink ký khóa lab riêng, verify certificate và metadata rồi cài/chạy chính APK đó. Debug/release có hash riêng; version/build/SDK lấy từ APK và thiết bị. | Tráo APK debug/release hoặc version/config không khớp. | apksigner/aapt2 và installed package metadata; runtime positive riêng release. |
| N08 | Mọi kết quả gắn source/config/dependency/artifact/runtime/ABI/variant/toolchain; case inventory đầy đủ, raw log có hash. Mutant fail đúng assertion, không compile failure. Sau sửa chạy full positive cuối. | Cùng chữ PASS nhưng sai source/API/ABI/artifact; thiếu case, skip/tool, log bị thay, oracle không khớp. | Gate host đã có kiểm riêng trong lượt chuẩn bị; collector/device wiring và full final vẫn NOT_RUN. |

## Thiết kế source và harness cần hoàn thiện

- `LabController`: thêm audience, group job theo actor, persistent intent ID ngẫu nhiên và store trước gửi; restart chỉ restore/lookup, không replay mutation. Giữ public nghiệp vụ và expected gốc.
- `LabStore`: Android Keystore AES/GCM; lưu ciphertext/IV trong vùng private, không token plaintext; logout xóa state nhạy cảm, hủy owner cũ. Barrier test và fault injection chỉ có trong lab, không endpoint điều khiển public.
- `HttpsRepository`: API chuẩn `HttpsURLConnection` và trust store lab scoped cho client, không sửa trust store macOS/Android toàn máy; hostname verification bật. Mẫu release cũng chỉ là lab, CA lab không được mang sang production.
- `LabInstrumentation`/UI driver: dùng platform Instrumentation/UiAutomation để chạy assertion/đọc accessibility nodes, kết hợp test logic có sẵn. Dự kiến không thêm thư viện; không gọi UTP/Gradle managed device hoặc `connectedAndroidTest`. [Google hỗ trợ chạy test APK trực tiếp qua ADB](https://developer.android.com/studio/test/command-line). Tính tương thích runner/build chưa được chứng minh; nếu cần dependency mới phải cố định manifest và review trước tải.
- Release được kiểm qua driver APK riêng dùng UiAutomation + backend ledger để không phải bật debuggable cho release. Assertions của driver phải đọc node/backend thực, không chỉ tin màn hình tự báo PASS. Private storage release không đọc bằng `run-as`; receipt phải phân biệt kiểm debug và kiểm release, không ghi đã dump storage release.
- Fixture backend nhỏ trong Docker: `POST /intents`, `GET /intents/{id}`, `GET /workshop`; điều khiển barrier/revoke/drop-response qua file control chỉ host sở hữu. Ledger lưu ID/counter/actor giả; không log Authorization. Bind Docker host chỉ `127.0.0.1:8443`; ADB reverse nối cổng guest8443 tới loopback host8443; app dùng hostname/IP khớp SAN cert. Sai-CA/sai-SAN dùng cert fixture riêng, không tắt xác minh.
- Node/Python collector: kiểm đúng serial/AVD, deadline/quota, chụp source trước/sau, parse từng assertion, thu ảnh và backend ledger, bảo toàn mọi FAIL. Tạm dừng emulator khi build mutant; giữ state qua relaunch đúng ca. Không prune cache/volume hoặc xóa log cũ.

Đây là danh sách triển khai hữu hạn, chưa là source/harness build được. Gate tiếp theo là hoàn thiện những file này, lệnh kiểm và manifest cuối rồi mới trình quyền execution. Không xin duyệt một gói runtime còn thiếu nguồn.

## Dependency và đường chạy

Tái dùng JDK17/Gradle9.4.1/AGP9.2.1/KGP2.3.10/build-tools36.0.0 và platform37.0 của A1, image Docker theo digest trong manifest cũ; kiểm thực lại trước chạy. Android host ADB37.0.1/Emulator37.1.11/API36rev2 từ bootstrap. Không thêm Android Studio, JDK host, SDK hoặc system image.

48 advisory/19 tọa độ trong gate A1 là kết quả lịch sử scoped offline; không mang disposition cũ sang network/signing. Đường dự kiến dùng `am instrument` trực tiếp giảm nhu cầu chạy UTP, nhưng không đủ để gọi graph an toàn. Phải xuất task/config graph và graph đóng gói APK, đối chiếu SHA256 với lock/verification, review từng finding theo route mới. Build network=none; Maven missing/graph drift là blocker, không tự resolve online. Metadata advisory chính thức/OSV có thể refresh riêng với giới hạn nhỏ, không tải binary.

TalkBack không có trong AOSP image hiện tại. Không tự tải APK từ mirror hoặc gọi node tree là TalkBack PASS. Hướng đề xuất cho lát cắt phương pháp R05: platform accessibility events/nodes + focus traversal + ảnh/font2.0, chỉ rõ thiếu spoken feedback/gesture TalkBack và trình review tính tương đương N06. Nếu không đủ oracle, N06 giữ INCOMPLETE và soạn gói TalkBack nguồn chính thức riêng; không chặn viết/chạy các ca độc lập hoặc nhận cả Android PASS.

## Lệnh/pha dự kiến sau nguồn hoàn chỉnh và approval execution

| Pha | Lệnh chính/điều kiện | Dừng khi |
|---|---|---|
| Preflight | kiểm source/lock/image digest, free-space, shared lock, đúng AVD và cổng5037/5554/5555/8443 trống | nguồn drift, tool thiếu, tiến trình/cổng không thuộc lượt |
| Build Docker offline | `lintDebug lintRelease testDebugUnitTest testReleaseUnitTest assembleDebug assembleRelease` với `--offline --rerun-tasks --continue`; build driver/test APK bằng task được xác minh trong manifest cuối | task required thiếu/skipped/fail hoặc cần tải dependency |
| Sign | `apksigner sign` khóa mới chỉ lab; `apksigner verify --verbose --print-certs`, `aapt2 dump badging` | signature/package/SDK/version khác manifest; không in private key/password |
| Host emulator | cùng AVD/`-gpu host -memory 2048 -cores 2 -lowram -no-snapshot`; ADB foreground chỉ loopback, serial `emulator-5554` | RSS/guestRAM/CPU/pressure vượt trần, API/ABI sai |
| Install/run | `adb -s emulator-5554 install -t <APK xác minh>`; `shell am instrument -w <driver>/<runner>`; `reverse tcp:8443 tcp:8443` cho N05 | package khác allowlist, missing assertion, không có backend evidence |
| Mutants/final | mỗi mutant bản riêng + oracle cụ thể; full positive cả hai variant trên source cuối sau sửa | compile failure giả làm mutant detected, full positive chưa đủ |
| Cleanup | gỡ reverse của lượt, stop đúng app/AVD/ADB/container; verify port/PID; giữ APK/cache/log/key trong lab ngoài Git | cleanup chưa xác nhận thì báo INCOMPLETE, không che |

Package dự kiến `org.kidea.lab.runtime` và `org.kidea.lab.runtime.test`; driver có thể cần package riêng được cố định trước execution. Chỉ clear/uninstall dữ liệu các package lab thuộc lượt, không wipe AVD hoặc đụng app Human. Tham số APK/runner còn phải gắn tên/hash thực sau build; bảng không là lệnh để chạy ngay.

## Tài nguyên dự kiến — chưa cấp ngân sách

Một lượt tối đa3giờ tính từ preflight execution, retry không reset. Không tải binary mới; metadata tối đa64MiB. Đĩa thêm tối đa6GiB, vẫn giữ trần tích lũy47GiB từ baseline E2 và sàn100GiB trống; không cộng thêm47GiB. Kiểm base/counter thực trước khởi chạy, lấy điều kiện chặt hơn.

Pha build: Docker tổng2CPU/4GiB, emulator tắt. Pha UI: emulator2vCPU/2048MiB guest, host lab RSS≤4GiB như bootstrap. Riêng N05 cần đồng thời backend Docker đề xuất0.5CPU/512MiB và emulator; trần theo dõi tổng RSS lab + memory container4.5GiB. Đây là thay đổi so với bootstrap không đồng thời Docker, phải có trong approval execution cuối. Watchdog là ngưỡng đo/dừng, không hard cap toàn host; dừng khi pressure nghiêm trọng. Không đổi tài nguyên Docker Desktop.

## Điều kiện trình chạy và kết thúc

Trước xin chạy: source/driver/backend/runner đã soạn; manifest source/config/command đủ; offline graph/task plan và advisory review đủ; N06 có quyết định tương đương rõ hoặc báo phần còn chặn. Đóng băng case IDs/oracle và các giả định trước lượt runtime. Các thay đổi source thông thường được sửa/kiểm trong lượt; đổi baseline/dependency/quota/oracle thì dừng phần ảnh hưởng.

Hoàn tất gói execution chỉ khi mọi case bắt buộc có evidence đúng nguồn, mutant bắt đúng lỗi, full positive cuối đạt và cleanup xác nhận. Nếu N06 hoặc nhóm khác còn NOT_RUN thì chỉ báo partial. Human review kết quả Android riêng; không tự đóng R05/T07-S02.
