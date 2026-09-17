# R09-T02 build r3 — sửa từ chối JSON comment

**APPROVED và đã thực thi — FAIL clang-tidy main sau CTest46/46 PASS.** Human “duyệt nhé” cho gói tại88b5157. [Kết quả r3](../tests/evidence/r09/t02-build-r3.md); quyền một lượt đã dùng. [R4 chờ duyệt](R09_T02_BUILD_R4_REVIEW.md). Nội dung dưới giữ nguyên gói đã trình. [R2](../tests/evidence/r09/t02-build-r2.md) compile dev qua, CTest45/46PASS, một FAIL tại comment JSON. R2 đã dừng; không retry, không dùng tiếp grant một lượt.

## Thay đổi cụ thể

Thêm kiểm slash ngoài chuỗi trước JsonCpp để từ chối comment; nhận diện escape trong chuỗi, không sửa nội dung chuỗi hoặc strip comment. Giữ UTF-8/body cap/parser flags/duplicate-key và mọi oracle cũ. Thêm10ca comment (đầu/cuối/member/value/array/nested/escape),7ca chuỗi hợp lệ (URL/comment-like/escape/Unicode),2ca HTTP400. [Diff](../tests/evidence/r09/t02-build-r3/source-fix.patch). Không đổi dependency/toolchain/runner/cấu hình cảnh báo hoặc nghiệp vụ.

Pilot `/Users/kendrick/Desktop/kidea-workshop-pilot`, source `47643937c065f0af566bcc92bd249823f63e49aa`, HEAD `de55437af642377d4de9bb917e1717656287cae1`, local master sạch, không remote. [Manifest r3](../tests/evidence/r09/t02-build-r3/build-manifest.json) SHA256 `895f70fb1f166651bd6393cf1d1fd4dad422b0074a14720a23047e310ad4cae9`;51file source/824vendor. [Kiểm tĩnh](../tests/evidence/r09/t02-build-r3/static-review.json) qua. Bản sửa chưa compile/runtime; kết quả45PASS thuộc r2, không chuyển thành PASS r3.

```sh
node scripts/t02/run.mjs docs/t02/build-manifest.json --approved-manifest-sha256 895f70fb1f166651bd6393cf1d1fd4dad422b0074a14720a23047e310ad4cae9
```

Chạy từ root pilot bằng Node24 có sẵn. Image Linux amd64 không đổi: `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`.

## Quyền đề nghị

Một lượt mới≤2giờ,4container tuần tự dev/ASan+UBSan/TSan/release, mỗi container≤30phút,2CPU/4GiB/256PID. Đĩa mới≤8GiB, data/log≤2GiB, host free≥100GiB. R1+r2 giữ480808KiB (~469.54MiB) output cũ, không trừ/xóa chúng; tổng output ba lượt tối đa8GiB+480808KiB. Không tự reset grant r2; đây là đề nghị lượt mới. Networknone/0download/0hostport; source/vendorRO/rootFSRO/capdrop/user1000; giữ same runner monitor2s (không hard disk quota), CREATE-only output.

Chạy đầy đủ formatter18, CMake/build, CTest46 (bao gồm assertions mới), collector/JUnit, dev clang-tidy, HTTP, rồi các preset còn lại trên nguồn r3. FAIL dừng và giữ bằng chứng; không skip/đổi expected hoặc đổi source rồi chạy lại bằng grant này. Chỉ stop/rm exact IDs/labels của lượt, giữ DBfake/log/source/cache. Không cài host/pull/build image/cloud/Web/PROD/native/AI trial. PASS chỉ backend component, không tự nghiệm thu T02/R09/R10/137nghĩa vụ.

**Đề nghị duyệt một lượt build r3.** Cần quyền vì [gói r2 đã duyệt](R09_T02_BUILD_R2_REVIEW.md) quy định “Một lượt mới tối đa2giờ” và “FAIL dừng và giữ log, không tự đổi nguồn rồi chạy lại bằng grant này.” Không xin lại B/C hoặc nghiệp vụ.
