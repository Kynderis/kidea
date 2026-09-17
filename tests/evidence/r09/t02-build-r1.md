# R09-T02 build r1 — FAIL compile, đã giữ bằng chứng

Human “Tôi duyệt” cho gói tại `b1d27b5e1bb50f40cbb16b229e82de605791ce93`. Đã thực thi đúng manifest `6d9c125316ad6d2c88ceba54cae8a93e6b29d7c6d6c49918ebb15ee12eb506f9`, nguồn `db7b7efe9b48d265ca7b09ac9334779db2446f1e`, pilot HEAD301d349 sạch/không remote. Node24.19.0 sẵn có, Mac Intel, Docker Linux amd64; host free343GiB trước chạy.

- Formatter18 và CMake configure exit0, sau đó compile dev FAIL. [Log compiler đầy đủ](t02-build-r1/run/dev/out/dev/build.stdout.txt): alias toàn cục `using workshop::Json` xung đột namespace `Json` của JsonCpp gây loạt lỗi dây chuyền; thêm `-Werror=range-loop-construct` tại vòng lặp chuỗi. Không gọi số lỗi dây chuyền là các lỗi nghiệp vụ độc lập.
- [Kết quả runner](t02-build-r1/run/results.json): FAIL, chỉ1container dev đã chạy. CTest46, HTTP, clang-tidy, ASan/UBSan, TSan, release chưa chạy. Không ứng dụng/source ID nào được đánh PASS.
- [Trạng thái container](t02-build-r1/run/dev/container-state.json): start15:50:48.646Z, end15:51:22.534Z ngày2026-09-17 (~33.9giây), exit1, không OOM. [Receipt](t02-build-r1/receipt.json): tất cả51sourcehash giữ nguyên tới sau lượt; đã rm đúng container, readback label rỗng; output23040KiB=22.5MiB giữ nguyên.
- Output gốc `/Users/kendrick/Desktop/kidea-t02-build-lab/t02-bdb393f4-887d-43f7-8bc4-27ab79998f73/`; bản sao log/tool inventory/configure/manifest/receipt trong [thư mục bằng chứng](t02-build-r1/). Không xóa FAIL, không chạy lại hoặc bỏ gate. Không download/cài macOS/cloud/hostport.

Sau FAIL, dùng quyền authoring hiện hành sửa test (alias JsonValue và const reference), không đổi oracle/flags/ca. Source762fb48, manifest r2 đã kiểm tĩnh 51/824, [diff và đề nghị lượt r2](../../../docs/R09_T02_BUILD_R2_REVIEW.md). Chưa biên dịch bản sửa. Public SAVE CONTINUATION_SAVED, giữ W-001/gates, không tự DONE. Pilot local HEADc431bbd, không remote/push. R09 IN_PROGRESS, T02 chưa nghiệm thu, R10 chưa mở.
