# Kiểm Kidea trên thư mục local

Windows, Mac Intel và Mac Apple Silicon dùng cùng source và lệnh kiểm. Không cần VM, Docker, Xcode hoặc ứng dụng pilot cho bộ kiểm lõi này.

## Điều kiện

- Bản checkout Kidea trong thư mục local độc lập; không nằm trong iCloud, OneDrive, ổ mạng hoặc cây đang được công cụ khác đồng bộ/sửa.
- Node.js ≥24 đã cài; nên dùng LTS còn được bảo trì. Không bắt buộc đúng patch hoặc binary đã dùng ở Windows. Kiểm `node --version` trước khi chạy.
- Git tin cậy đã có trên PATH, hỗ trợ `--no-optional-locks --no-lazy-fetch`. Có thể chỉ định đường tuyệt đối qua `KIDEA_GIT_EXECUTABLE`; không chọn executable nằm trong project. Bộ test cần Git dù helper init không đọc Git vẫn có thể dùng snapshot.
- Dependency trong lockfile đã được cài. Nếu đây là checkout mới, chạy `npm ci` một lần sau khi chấp nhận tải dependency vào project; không sao chép `node_modules` giữa các hệ điều hành.
- Chạy bằng tài khoản thường, không `sudo`/root; có quyền tạo file, thư mục, hard link và liên kết thư mục ở checkout. Cần đủ dung lượng cho fixture và log; bộ kiểm không tự dọn dữ liệu.

## Một lệnh kiểm

Từ thư mục gốc Kidea:

```sh
node tests/r02-t07/run-tests.mjs
```

Lệnh này chạy hồi quy helper/status/writer/init/approve/resume, kiểm logic các controller lịch sử và ca local/Unicode/Git/runtime mới. Không mở AI, chạy benchmark lịch sử, cloud, build ứng dụng, thay cấu hình Git toàn cục hoặc thao tác project thật. Chỉ tạo dữ liệu giả dưới `.test-output`; các Git commit của test thuộc repo giả ở đó.

Đầu ra in đường dẫn `.test-output/r02-t07/regression-…`. `summary.json` ghi Node/OS/CPU, hash nguồn trước–sau, exit code và hash log; `stdout.txt`/`stderr.txt` giữ chi tiết. Kết quả đạt phải có `exitCode: 0`, `inputsUnchanged: true`, không fail/skip trong tổng kết test. Gửi ba file đó để đối chiếu; không cần gửi toàn fixture hoặc thông tin SSH.

Nếu thiếu công cụ/quyền hoặc có FAIL, giữ nguyên log; không đổi expectation, bỏ ca, tự chạy bằng quyền cao hoặc nhận kết quả máy khác thay thế. Khi sửa lỗi phải chạy lại trọn bộ trên bản cuối. Các phép giả lập chuỗi version hoặc tên OS không chứng minh runtime/máy đó đã chạy.

## Giới hạn

Đây là kiểm lõi Kidea, không nghiệm thu iOS, backend Docker, hiệu năng hoặc phục hồi sản phẩm. Kết quả Windows không thay Mac Intel; Mac Intel không thay Apple Silicon. Chỉ nhận host thực nào đã chạy đủ bộ với đầu vào không đổi. Filesystem phân biệt hoa–thường hay dạng Unicode khác phải giữ đúng bytes nguồn; Kidea từ chối tên nhập nhằng thay vì đoán/sửa tên.

[Phạm vi đã duyệt](../../proposals/local-portability-r1.md) · [Hợp đồng hiện hành](../../KIDEA_DESIGN.md#local-portability-approved).
