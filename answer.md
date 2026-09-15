Đã hoàn tất D1 và push lên `master`.

| Bộ dữ liệu | Trung vị | Lớn nhất |
|---|---:|---:|
| 100 task · 1,88 MiB | 1,57 giây | 1,59 giây |
| 1.000 task · 14,54 MiB | 9,61 giây | 9,74 giây |

**22/22 mẫu đúng output**, không timeout hoặc nguồn đổi; hồi quy **243/243 đạt**. [Báo cáo đầy đủ](D:/Code/kynderis/kidea/tests/evidence/r02-t10-probe.md).

**Khuyến nghị:** tối ưu `status` trước khi chốt ngưỡng — khoảng 9,6 giây cho bộ vừa còn chậm. Chưa sửa runtime, chạy thêm lượt đo hoặc nâng ngân sách nháp 2/5 giây.

Chưa chạy AI trial, sandbox hay thay đổi ACL.
