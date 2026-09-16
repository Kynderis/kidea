# Review nội dung do tác giả thực hiện — r1

Ngày 2026-09-16; không là review AI độc lập hoặc Human approval. Đọc cùng snapshot 21 file và manifest sau cùng; kiểm cấu trúc bằng máy không thay các nhận định ngữ nghĩa này.

| Điểm review | Căn cứ và kết quả |
|---|---|
| Authority và C1 | COMMON-01/CPP-02, TC-02/03/04 giữ C++ authority, transaction và khóa đăng ký actor+epoch+namespace; không dùng admin intent làm retry chung |
| C2/lifecycle client | COMMON-05, WEB-06, AND-01/03, IOS-02/03 và TC-07/20 giữ group/audience/generation; HTTP cũ không hồi sinh ACTIVE |
| C3/lifecycle server | CPP-07/TC-10 giữ drain30s và readiness/observer; có RAM chưa commit không được ACK, hủy task không rollback server |
| C4 và metric | CPP-08/TC-08 dùng nguồn admission làm oracle, TC-13 giữ mọi offer/error; không nới limit hoặc loại429/503 |
| C5 và coverage | Mỗi 137 ca R03/R04 có một hàng điều hướng source anchor → TC; nội dung nguồn được giữ nguyên. Đây là coverage khai báo, chưa chứng minh toàn bộ biến thể được implement |
| Q/restore/ops | TC-11–14 giữ independent host, recovery point/epoch, RPO15/RTO60, crash0ACK/5phút; không lấy Docker volume làm backup hoặc observer cùng laptop thay mất host |
| Rule/test/source và G2 | COMMON-02/03/06/08 và TC-15–17 giữ đúng bản, fail/skip/unknown và lượt cuối toàn dự án; chưa có công cụ thì NOT_RUN |
| HTML/Markdown | CPP-06 đưa grammar+vector cụ thể để Human review, không chỉ chặn dấu câu hoặc nhận literal markup; parser chưa chọn/cài. Đây là chi tiết cần duyệt, không claim đã đóng mọi ambiguous input |
| Toolchain/security | Metadata sáu npm package có raw; Apple/AGP và release/advisory tra nguồn chính thức. Chưa có lock transitives/image digest/compiler mẫu, không ghi INSTALL_READY hoặc security-clean |
| Giới hạn kiểm | R05 doc suite11/11; test R03 có8/9 với inventory không biết engineering; giữ full20case và FAIL. Không sửa test cũ, không dùng chúng để chứng nhận app |

Không thấy thay đổi nghiệp vụ/ngưỡng trong sáu hồ sơ mới ngoài các chi tiết kỹ thuật được gắn nhãn đề xuất. Nội dung R5-1–R5-4 cần Human review; build/sample đúng–sai vẫn bắt buộc trong R05, không chuyển chúng hết sang R09.
