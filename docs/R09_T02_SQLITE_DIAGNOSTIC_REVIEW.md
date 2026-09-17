# R09-T02 — chẩn đoán SQLite WAL/TSan r1

**PROPOSED — chưa duyệt/chưa chạy.** [R5](../tests/evidence/r09/t02-build-r5.md): dev và ASan/UBSan đều46/46CTest+18/18HTTP PASS; TSan40/46,6FAIL ở cùng WAL header. [Nguồn SQLite nguyên hash](../tests/evidence/r09/t02-build-r5/sqlite-wal-source-excerpt.txt) ghi possible false-positive với double-read/barrier, nhưng đây mới là giả thuyết; không miễn trừ, tắt sanitizer hoặc coi r5 PASS.

## Phép kiểm đề nghị

Một chương trình nhỏ chỉ liên kết SQLite đang ghim, dùng cùng GCC13 và `-fsanitize=thread`, không backend/Drogon. Bốn mode chạy đúng một lần:

| Mode | Mục đích, kết quả cần quan sát |
|---|---|
| detector-control | Race C++ cố ý, độc lập SQLite; phải lưu cảnh báo TSan để xác nhận detector hoạt động. Không phát hiện hoặc timeout là inconclusive, không phải PASS. |
| wal-parallel | Hai connection/hai thread cùng thực hiện50transaction increment/thread với WAL; xem cùng stack WAL có tái hiện khi không có mã backend. |
| delete-parallel | Cùng chương trình/hai thread nhưng rollback journal để đối chiếu; chỉ diagnostic, tuyệt đối không đổi chế độ WAL của ứng dụng. |
| wal-serial | Cùng WAL/hai connection nhưng gọi tuần tự để đối chiếu; không thay các ca race thật. |

Các mode SQLite phải kiểm journal thực, tổng100 và quick_check khi chạy hết. Mọi exit/stdout/stderr/DB đều giữ. TSan halt_on_error=1/exit66, không suppression/annotation/waiver, không sửa vendor, không retry. Thu đủ4observation kể cả control cố ý FAIL; không gọi exit0 của wrapper là component PASS. Nếu không tái hiện, báo INCONCLUSIVE; tái hiện giống WAL cũng chưa tự cho phép bỏ cảnh báo. Compile lỗi hoặc vượt quota thì dừng. Kết quả dùng để đề xuất cách xử lý có căn cứ, chưa mở full build mới.

## Nguồn/lệnh và quyền hữu hạn

Pilot source `01d8d7ffd317b43e3c3650568595163078428f10`, HEAD `14cb14eca312f41072324c9d6a9a173a2b31cfe4`, master local/không remote. [Manifest](../tests/evidence/r09/t02-sqlite-diagnostic-r1/manifest.json) SHA256 `85316832b9d96ca68f9d235bf21e61e087aea39ee1524c86546af658adc9c918`,54sourcefile và lock824vendor. Chỉ thêm3file probe/runner, sửa2điểm bàn giao; backend/test hiện hữu/vendor/runner build không đổi. Bản sao [probe](../tests/evidence/r09/t02-sqlite-diagnostic-r1/source/tests/t02/sqlite-diagnostic.cpp), [script container](../tests/evidence/r09/t02-sqlite-diagnostic-r1/source/scripts/t02/sqlite-diagnostic.sh), [runner](../tests/evidence/r09/t02-sqlite-diagnostic-r1/source/scripts/t02/sqlite-diagnostic.mjs). [Kiểm tĩnh](../tests/evidence/r09/t02-sqlite-diagnostic-r1/static-review.json) qua, chưa compile/chạy.

Từ root `/Users/kendrick/Desktop/kidea-workshop-pilot`, Node24 sẵn có:

```sh
node scripts/t02/sqlite-diagnostic.mjs /Users/kendrick/Desktop/kidea/tests/evidence/r09/t02-sqlite-diagnostic-r1/manifest.json --approved-manifest-sha256 85316832b9d96ca68f9d235bf21e61e087aea39ee1524c86546af658adc9c918
```

Image Linux amd64 có sẵn `sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92`. **Một container/một lượt≤15phút,2CPU/4GiB/256PID; đĩa mới≤1GiB, data/log≤128MiB; host free≥100GiB; mỗi mode≤90s+5s kill grace.** R1–r5 giữ3350952KiB (~3.20GiB) output cũ, tổng với diagnostic≤1GiB+3350952KiB.0download/network/hostport, rootFS/source/vendorRO, user1000/capdrop/no-new-privileges, monitor2s không hard disk quota. Output CREATE-only `kidea-t02-build-lab/t02-sqlite-diagnostic-<UUID>/`.

Cleanup chỉ exact IDs/labels, giữ log/DB/source/cache. Không cài/chỉnh macOS, đổi compiler/dependency, cloud/Web/PROD/native/AItrial/R10. Không chạy lại r5 hoặc coi diagnostic thay TSan46/full acceptance.

**Đề nghị duyệt gói chẩn đoán15phút này.** Cần quyền vì [r5](R09_T02_BUILD_R5_REVIEW.md) đã dùng hết quyền một lượt và yêu cầu dừng khi FAIL; diagnostic có source/lệnh/manifest mới. Không xin miễn trừ kiểm an toàn.
