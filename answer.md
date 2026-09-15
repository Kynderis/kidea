Đã hoàn tất 22 lượt đo và push kết quả lên `master`. **Chưa thấy cải thiện tốc độ.**

| Bộ dữ liệu | Trung vị trước | Sau tối ưu |
|---|---:|---:|
| 100 task | 1,57 giây | 1,57 giây |
| 1.000 task | 9,61 giây | 9,76 giây |

22/22 mẫu đúng output, không timeout; **252/252 kiểm thử đạt**, bằng chứng cũ nguyên vẹn. [Báo cáo đầy đủ](D:/Code/kynderis/kidea/tests/evidence/r02-t10-probe-r2.md).

Khuyến nghị tiếp theo: **profiling — đo thời gian từng phần để tìm chỗ chậm** trước khi tối ưu tiếp. Chưa chạy thêm hoặc thay ngưỡng nghiệm thu.
