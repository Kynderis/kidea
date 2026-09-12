Đã ghi nhận duyệt cách lưu dữ liệu và phân chia hồ sơ.

Gói tiếp theo giải quyết việc **không nhầm bản đang xây với bản người dùng đã được ghi nhận sử dụng**:

1. **Giữ riêng hai thông tin.** Ví dụ đang làm bản **1.2**, nhưng lần kiểm tra gần nhất thấy production chạy **1.1**. Kidea phải thể hiện cả hai. Mỗi lần triển khai dẫn tới đúng hồ sơ/bản được chọn và môi trường, không chỉ ghi một số version chung. Khi mới có ý tưởng, chưa cần đặt version hoặc tạo hồ sơ phát hành.
2. **Không biết thì báo chưa biết.** Thiếu hồ sơ không có nghĩa “chưa từng triển khai”. Nếu web đã lên 1.2 nhưng backend lỗi, phải báo từng phần, không ghi toàn bộ sản phẩm đã lên 1.2. Kết quả có thời điểm kiểm tra; ghi nhận hôm qua không chứng minh hệ thống đang khỏe hôm nay.

Cách này cần lưu tham chiếu và bằng chứng rõ hơn, nhưng tránh báo sai bản hoặc báo thành công quá sớm.

Bạn duyệt hai nguyên tắc này nhé? [Gói R02-T02-S05-r1](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current) chỉ chốt cách ghi nhận; chưa cấp quyền triển khai. Sau đó sẽ chốt các trường dữ liệu cụ thể trước khi tạo mẫu.
