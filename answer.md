**Đã ghi nhận ba nhóm và cụm đăng ký/hủy được duyệt.** Tôi đề xuất bạn chốt tiếp ba cách xử lý:

1. **Mạng lỗi, gửi lại: không làm lần hai.** Cùng mã yêu cầu thì trả kết quả cũ; chưa biết kết quả thì báo đang xử lý/chưa xác định. Cùng mã nhưng đổi nội dung thì từ chối. Muốn thao tác mới phải dùng mã mới. Cần giữ lịch sử yêu cầu; kết quả cũ không đồng nghĩa trạng thái hiện tại còn như cũ.

2. **Báo lỗi theo thứ tự nhất quán:** quyền → workshop đang mở hay không → trạng thái đăng ký → còn chỗ hay không. Ví dụ vừa tạm dừng vừa hết chỗ thì báo **tạm dừng**. Không đủ quyền thì không tiết lộ chi tiết workshop. Hủy lại bản đã hủy không giải phóng thêm chỗ hoặc hủy nhầm đăng ký mới.

3. **Đăng ký và giảm sức chứa cùng lúc: thao tác được chấp nhận trước làm căn cứ cho thao tác sau.** Ví dụ đang có 9/10 người: nếu nhận người thứ 10 trước thì không cho giảm xuống 9; nếu giảm xuống 9 trước thì từ chối người đăng ký mới. Không ưu tiên mặc định admin và không hứa ai bấm trước thắng.

Tôi khuyến nghị cả ba. **Bạn có thể nói “Duyệt cả ba” hoặc sửa từng mục.** [Bản chi tiết đã push](D:/Code/kynderis/kidea/proposals/r03-registration-decisions-r1.md). Chưa áp dụng các quy tắc này hoặc chạy thêm AI.
