# R08-B1 — gói build sạch backend/Web và ngoại lệ hẹp

**Cập nhật môi trường:** Human đã cung cấp Google Cloud project `kidea-508908` và quyền tự tạo/thu hồi VM phục vụ kiểm Kidea theo [ghi nhận quyền](../docs/R08_GCP_AUTHORITY.md). Các đoạn chưa có server/chỉ local dưới đây giữ bối cảnh lúc soạn; gói build local hiện có không tự biến thành gói chạy cloud hoặc bỏ ngoại lệ đang chờ duyệt.
2026-09-17. **PREPARED — chờ duyệt một lượt build và R08-TIDY-01.** Human “Làm đi” sau `14597c9` giao chuẩn bị phần còn thiếu; sau đó chọn dùng Docker trên Mac, chưa có server riêng. Không yêu cầu host/cloud lúc này. Chuẩn bị chỉ đọc nguồn/pilot/cache; chưa chạy build mới.

## Đầu vào đã xác định

[inputs.json](../tests/r08/product-build-r1/inputs.json) khóa1051file/18.288.846byte của mẫu backend/Web và vendor.78file backend khớp manifest R05 r5; snapshot riêng tại `.test-output/r08-product-inputs-r1/source`, không mount live pilot vào build. Source base repo `14597c92cafe60ab8d1dd0023f335d095764d29f`; hash từng file mới là căn cứ sample ngoài repo.

Cache npm được export bằng `docker cp` từ container đã dừng `kidea-r05-e2-r4-web-final`, không start hoặc sửa volume. Archive31.351.296byte, SHA256 `0237e2308bff38b105593b0a44c065f813a19bd0ca366d798bf2624afb439f7e`; đã kiểm thành viên tar an toàn và hash nội dung cache. `npm ci --offline` quyết định cache có đủ trên Linux không; thiếu thì FAIL/dừng, không tải bù tự động.

Image toolchain: `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`. Browser: `sha256:bc6ab0d6d44ff4826e4cb8c1e6d801e185bfc42bb0753f8e2a30efc70db054c7`. Cả hai linux/amd64 đã có, không pull/build image. Không cài gì lên macOS.

## R08-TIDY-01 — quyết định mới cho đúng một lần build

R05-TIDY-01 đã hết hiệu lực; không kế thừa nó. Đề nghị **R08-TIDY-01** chỉ cho lượt build này, profile hiện hành `workshop-rules-web-r2` trên bản sample đã khóa; kết thúc khi lượt dừng/thành công, không mở hiệu lực production hoặc lượt khác.

Vị trí duy nhất: `cpp/domain.cpp`, invocation `SQLITE_TRANSIENT` trong `Statement::bind`, đúng comment `NOLINTNEXTLINE(performance-no-int-to-ptr)` đã có. SQLite3.53.4 và clang-tidy18.1.3, cùng image toolchain đã khóa. File SHA256 `357ef7ea56f75d6b3183b87457520881dc51249c30cc8a0f04ccd175820c8773`. Đây là sentinel chuẩn của SQLite để **sao chép dữ liệu trước khi bind trả về**. Giữ nguyên lifetime/copy semantics; không đổi sang SQLITE_STATIC, không tự thêm allocator, không sửa code/pilot.

Giữ `WarningsAsErrors: '*'`, toàn bộ checker khác, formatter, warnings compiler,4preset dev/ASan+UBSan/TSan/release và mọi test đã chọn. Không miễn rule dữ liệu, race hoặc sanitizer. [Căn cứ cũ và giới hạn đã hết hiệu lực](r05-sqlite-transient-tidy-r1.md) chỉ giải thích nguyên nhân, không cấp quyền mới. Đổi checker/dependency/hash/vị trí thì gói này không áp dụng. Nguồn quy định ngoại lệ nằm ở `docs/engineering/rules.md#exceptions` của pilot: chưa duyệt thì không được áp. Việc build đọc profile đã nghiệm thu, không sửa nhãn lịch sử trong tài liệu pilot.

## Công việc và điều kiện kết quả

Một entry [run.mjs](../tests/r08/product-build-r1/run.mjs) gọi [build.sh](../tests/r08/product-build-r1/build.sh), cùng [manifest](../tests/r08/product-build-r1/manifest.json) cố định. Entry đòi cả digest đúng và `--approved-exception R08-TIDY-01`; không nhận lệnh/source/image tùy ý.

| Stage tuần tự | Lệnh/đầu ra cần đạt |
|---|---|
| C++ sạch | Source readonly, `/build` mới; formatter;4preset CMake+build+ctest,12case/preset theo CMake hiện hành; clang-tidy4translation unit; SHA256 backend/domain_tests release |
| Web sạch | Copy source sang work mới; cache đã khóa; npm ci offline/ignore-scripts; Svelte sync/check; lint;32unit; build adapter-node;4server test |
| Browser | Cùng output Web Linux vừa build, image có Chromium;18case trong project chromium, workers1/retries0/forbid-only, không host port |

Bất kỳ lỗi/thiếu case hoặc nguồn đổi: chưa PASS cho gói. Không bỏ test, sửa expected hoặc dùng artifact cũ lấp kết quả. Đây là kiểm build và các ca local liệt kê; **chưa phải toàn lượt G2 của dự án**, chưa HTTPS/backend-Web tích hợp, mutation, deploy/ops hoặc137ca ứng dụng. Các phần đó được nối tiếp sau khi artifact có hash; không nhận0việc còn lại.

## Lệnh chạy và ngân sách đề nghị

Manifest SHA256 `adb913ee7257a5bba9f41662eb5559164641105eadfa64b754d479392388d2d0`. Lệnh sau chỉ chạy sau khi Human duyệt cả gói và ngoại lệ:

```text
node tests/r08/product-build-r1/run.mjs --approved-manifest adb913ee7257a5bba9f41662eb5559164641105eadfa64b754d479392388d2d0 --approved-exception R08-TIDY-01
```
 Một lượt CREATE-only tại `.test-output/r08-product-build-r1`,3container chạy tuần tự, tên cố định `kidea-r08-product-build-r1-{cpp,web,browser}`. Không đụng container/cache/volume lịch sử.

- 0tải/cài,0host port,network none;image cố định với pull=never. Source/plan/input mount readonly; chỉ build/work/log mới được ghi. User1000:1000,readonly root,cap-drop ALL,no-new-privileges.
- Tổng tối đa60phút,30phút/lệnh,container timeout1700giây +10giây kill; tối đa2CPU/4GiB RAM+swap và512PID cho một container; tmpfs/shm256MiB.
- Đĩa thêm≤8GiB theo chênh lệch free disk từ đầu lượt, bảo thủ gồm hoạt động khác; giữ≥100GiB trống. Theo dõi2giây/lần; nếu chạm ngưỡng thì dừng CLI và stop đúng container, giữ evidence; không reset counter/đổi quota. Log Docker≤16MiB/container, output lệnh≤16MiB.
- Nếu controller bị mất: container có timeout; chỉ đối chiếu rồi stop đúng tên/label `kidea.r08.product=<manifest hash>`. Không prune/xóa dữ liệu. Lock giữ khi stop chưa xác nhận; không tự mở lượt thứ hai hoặc chạy lại manifest R2-A.

Input snapshot/cache chỉ ở local workspace, không commit31MiB cache. Nếu mất hoặc khác hash, dừng và phục hồi CREATE-only từ nguồn đã xác minh, không download thay thế. Mac Intel PASS không chứng minh Apple Silicon.

## Sau build

Thu hash/artifact và build/config/source readback để cố định gói **R08-B2 deploy/tích hợp/ops local**. B2 có ma trận tại [kế hoạch còn lại](r08-local-delivery-ops-r1.md), chưa có quyền chạy. Không thể chốt artifact B2 trước build thực; tuyệt đối không `latest` hoặc rebuild khi deploy. Caddy artifact hiện có chỉ được chọn sau đối chiếu nguồn/digest/compatibility, không build lại dependency tùy ý.

Human đã chọn Docker local, chưa có server: phép kiểm job/alert sẽ trong giới hạn cùng Mac; giữ NOT_PROVEN cho mất cả host/backup độc lập. Không tự thuê máy hoặc chuyển toàn nghĩa vụ sang R09. R08 còn Human nghiệm thu.
