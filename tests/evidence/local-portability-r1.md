# LP-01 — Kết quả chuyển Kidea sang hợp đồng thư mục local

Ngày kiểm: 2026-09-16. Phạm vi: [gói local-portability đã duyệt](../../proposals/local-portability-r1.md), không phải nghiệm thu toàn bộ R05 hoặc ứng dụng pilot.

## Kết luận và bản nguồn được kiểm

Hai lượt hồi quy cuối cùng đều **283/283 PASS**, không fail, skip, cancelled hoặc todo, trên **Windows x64**, lần lượt dùng **Node.js 24.21.0** và **24.19.0**. Đây là cùng **283 ca**, chạy trên hai runtime thực; không phải 566 ca khác nhau và không chứng nhận Mac đã chạy.

[Biên nhận thu thập cuối](local-portability/collection-final.json) kiểm:

- Hai lượt dùng cùng tập **36 file nguồn/test/dependency metadata** với cùng SHA-256.
- Mỗi lượt có `inputsUnchanged: true`; bản `before.json`, `summary.before` và `summary.after` khớp nhau.
- Hash toàn bộ 36 file khớp nguồn hiện hành tại thời điểm thu thập; không lấy kết quả từ bản trung gian thay bản cuối.
- Raw stdout/stderr khớp hash ghi trong summary; bản lưu trong repo khớp từng byte với đầu ra gốc.

| Runtime thực | Kết quả cuối | Nguồn/bằng chứng |
|---|---|---|
| Node 24.21.0, Windows x64 | 283 PASS; 0 fail/skip | [summary](local-portability/node24.21-final/summary.json), [stdout](local-portability/node24.21-final/stdout.txt), [stderr](local-portability/node24.21-final/stderr.txt), [before](local-portability/node24.21-final/before.json) |
| Node 24.19.0, Windows x64 | 283 PASS; 0 fail/skip | [summary](local-portability/node24.19-final/summary.json), [stdout](local-portability/node24.19-final/stdout.txt), [stderr](local-portability/node24.19-final/stderr.txt), [before](local-portability/node24.19-final/before.json) |

Host được ghi nhận là `win32/x64`, OS release `10.0.26200`; Git thực là `2.50.1.windows.1`. Summary giữ đường executable và hash binary của Node/Git để tra cứu, không biến chúng thành điều kiện phải dùng đúng binary này. Thời lượng test không phải phép đo hiệu năng sản phẩm; hai lượt chạy có khoảng thời gian chồng nhau.

## Những gì đã được kiểm

Giữ nguyên public actions `status`, `init`, `approve`, `resume` và schema 2; không thêm `change`, `visualize` hoặc tự động thực thi sản phẩm.

- Bỏ khóa Windows/NTFS và đúng Node 24.21.0; hợp đồng runtime là Node ≥24. Node/OS/CPU thực vẫn được ghi trong bằng chứng. Khuyến nghị dùng LTS còn được bảo trì, không cam kết mọi major tương lai đã được kiểm.
- Grant mới dùng `localFilesystem: true`, `noActiveSync: true`, `singleKideaRun: true`. Grant cũ `localNtfs` chỉ tương thích trên Windows; không vượt qua trường mới bị từ chối rõ ràng.
- Git được tìm từ cấu hình host tuyệt đối hoặc PATH phù hợp, không từ executable do project đặt vào để che tên công cụ. Khi Git là tùy chọn, helper có thể dùng snapshot đã cho phép; tham chiếu GIT đang có mà không đọc được vẫn chặn xác minh, không âm thầm thay nguồn hoặc chạy shell.
- Cùng test kiểm Unicode, tên hoa/thường, alias, đường dẫn thoát root, hard link, liên kết thư mục, nguồn thay đổi giữa lượt, ghi dở, readback, quyền ghi và approval gắn đúng nội dung. Không bỏ các ca an toàn để làm test xanh.
- Kiểm CREATE sử dụng đúng spelling Unicode của thư mục thực; từ chối các parent mới có tên trùng theo hoa/thường hoặc Unicode trước khi tạo cây.
- Fixture Git cô lập cấu hình toàn cục/hệ thống, hooks và signing; dữ liệu CRLF chỉ được chuẩn hóa trong ca test chủ động yêu cầu. Kidea không được tự sửa bytes của hồ sơ thật.

[Kiểm môi trường](local-portability/environment-check.json) còn giữ kết quả **Node 22.18.0 thực**: public CLI trả exit 2, `UNSUPPORTED_RUNTIME`, stdout rỗng như mong đợi. Validator cấu trúc skill PASS. Validator này không thay kiểm hành vi hoặc xác nhận máy Mac.

## Pilot và tính toàn vẹn hồ sơ

[Pilot amendment r2](local-portability/pilot-amendment-r2.json) là bản cuối cho điều chỉnh local/Docker/cloud; [kiểm tài liệu cuối](local-portability/pilot-verification-final.json) ràng buộc đúng source/test và pilot hiện hành. Các bản trước vẫn được giữ như lịch sử, không ghi đè.

- Bộ kiểm hồ sơ R04: **15/15 PASS**, không skip; kiểm giữ đúng phần nguồn đã duyệt trước các phần bổ sung LP-01.
- **826 liên kết nội bộ hợp lệ**, không lỗi; đây là kiểm tài liệu, không phải kiểm ứng dụng/backend đang chạy.
- Bộ kiểm R03 hiện hành **9/9 PASS**. Đã bỏ đường `D:/` cố định và sửa assertion hết hiệu lực từ sau R04: kiểm chính xác 10 file nghiệp vụ, thay vì buộc toàn pilot chỉ có 10 file. Thêm ca âm thiếu/thừa/thay tên dù cùng số lượng; R04 vẫn kiểm chính xác toàn bộ 15 file và byte nguồn, không giảm mức kiểm.
- Raw **7/8** trước sửa (`15 !== 10`) giữ nguyên trong [verification r2](local-portability/pilot-verification-r2.json); đó là kết quả lịch sử của test cũ, không đổi thành PASS. Kết quả 9/9 mới có hash/test/log riêng; không tuyên bố mọi test lịch sử trong repo đều đã chạy hoặc xanh.

## Các lần lỗi và sửa trước bản cuối

| Lượt | Kết quả giữ nguyên | Diễn giải |
|---|---|---|
| [Targeted ban đầu](local-portability/targeted-initial/summary.json), [raw](local-portability/targeted-initial/stdout.txt) | 90/95 PASS, 5 FAIL | Helper tạo Git fixture dùng spelling null-device của Node (`\\.\nul`), Git Windows không nhận. Đây là lỗi test helper. |
| [Sửa Git helper](local-portability/git-helper-correction/summary.json), [raw](local-portability/git-helper-correction/stdout.txt) | 5/5 PASS | Chạy lại đúng 5 ca lỗi; helper dùng `NUL` trên Windows, `/dev/null` trên POSIX. Không gọi đây là một lượt đầy đủ 95/95. |
| Runtime unit test trước khi sửa | 13/14, chỉ hiển thị console | Expectation dùng `undefined` nhưng hàm mặc định lấy LTS của runtime hiện tại; sửa input thành `null` để kiểm trường hợp không có LTS. Không lưu được raw stdout riêng của lượt này; không dựng lại raw từ trí nhớ. Các ca tương ứng đã chạy lại trong full regression. |
| [Hồi quy trung gian](local-portability/interim-281/summary.json), [raw](local-portability/interim-281/stdout.txt) | 281/281 PASS, nguồn không đổi trong lượt | Có trước hai ca parent Unicode/alias bổ sung và metadata Git của runner. So với bản cuối chỉ khác `runtime.test.mjs` và `run-tests.mjs`; không dùng làm bằng chứng 283 ca cuối. |

Hai targeted runs không có manifest SHA toàn bộ source; biên nhận ghi `NOT_CAPTURED_IN_THIS_RUN`, không bổ sung giả một binding hồi tố. [Biên nhận đầu](local-portability/collection-initial.json) và biên nhận cuối giữ nguồn, count và SHA của từng artifact. Script [thu thập evidence](../local-portability/collect-evidence.mjs) chỉ chép exact bytes, từ chối ghi đè nội dung khác; không chạy lại test hoặc chỉnh core.

## Phạm vi chưa được chứng minh

| Phạm vi | Trạng thái |
|---|---|
| Windows x64, Node 24.19.0 và 24.21.0 | PASS hai full regression nêu trên |
| Mac Intel, filesystem và toolchain thực | **NOT_RUN** |
| Mac Apple Silicon, filesystem và toolchain thực | **NOT_RUN** |
| Node ≥24 khác hai patch đã chạy | Chỉ có kiểm logic version-policy; chưa có full regression thực |
| Backend Docker local, cloud, tải/performance/restore, Android/iOS | **NOT_RUN** trong gói này |

Không hỗ trợ thư mục mạng/iCloud/OneDrive hoặc nhiều máy cùng ghi; không thiết kế một lớp đồng bộ để giải quyết các trường hợp đó. Grant môi trường phải được xác nhận thực tế: tên đường dẫn không tự chứng minh một volume là local hoặc không có sync.

Khi có Mac, dùng đúng [hướng dẫn một lệnh kiểm](../local-portability/README.md), cùng source và bộ test, trong checkout local với tài khoản thường. Chưa có kết quả đó thì không nâng trạng thái Mac thành PASS. Việc chưa chạy Mac không được dùng làm lý do khóa lại Node theo một binary hoặc tách Kidea thành phiên bản Intel/Apple Silicon riêng.
