# R05 — Đề xuất tăng riêng trần đĩa Docker

Ngày 2026-09-16. **APPROVED — người dùng trả lời “duyệt nhé” cho đề xuất này; thực thi tiếp trong lượt r4.**

[Lượt r3](../tests/evidence/r05/backend-execution-r3.md) đã sửa và build Caddy, kiểm matcher và 33 ca HTTPS. Còn FAIL tại biên header 16 KiB, cùng các phần TSan đầy đủ, release, mutation, browser và full matrix chưa xong.

Đề nghị nâng **trần dung lượng tăng thêm từ 16 GiB lên 24 GiB**, tính lũy kế từ lúc bắt đầu E2 r1, để tiếp tục sửa và kiểm các phần này trong Docker. Đây là thêm tối đa 8 GiB hạn mức, không phải tải 24 GiB hoặc đặt trước dung lượng. Các hạn mức khác giữ nguyên: tải tối đa 4 GiB, 2 CPU/4 GiB RAM, tối đa 3 giờ/lượt, ít nhất 100 GiB trống, chỉ loopback 8443. Không cài công cụ hoặc CA lên macOS; không thuê cloud.

Căn cứ: quan sát bảo thủ mức giảm dung lượng trống toàn filesystem khoảng 15,53 GiB; máy còn hơn 363 GiB. Mức này gồm cả hoạt động host khác và phân bổ Docker, nên không mô tả là số đo chính xác riêng workload. Docker có khoảng 2,213 GB images, 850 MB container và 6,073 GB volumes đã hoàn chỉnh; lớp tải browser dở và phân bổ đĩa không được phản ánh đầy đủ trong tổng này. Build TSan đã dừng trước trần; giữ nguyên cache/log để không phải tải lại hoặc mất bằng chứng.

Sau duyệt: cập nhật trần theo dõi, tiếp tục từ cache hiện có; sửa nguyên nhân FAIL header và kiểm lại, hoàn tất các preset/mutation/Web/browser rồi chạy full positive trên nguồn cuối. Không bỏ ca hoặc đổi kỳ vọng để xanh. Nếu phát sinh quyền hệ thống, cloud hoặc thay phạm vi sản phẩm thì vẫn dừng đúng ranh giới đó.

Bạn chỉ cần duyệt việc nâng trần đĩa lên 24 GiB và tiếp tục E2; các sửa lỗi và lượt kiểm trong phạm vi E2 đã được giao không cần duyệt lại từng lệnh.
