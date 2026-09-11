Đã chốt nhóm **điều phối/quyền/lưu–resume** và đồng bộ tài liệu đúng phạm vi; chưa chạy kiểm thử hoặc duyệt toàn bộ QUALITY.

Tiếp theo là **R01-T08-S02 — nghiệp vụ, bản đồ và phân tích ảnh hưởng**. Mình đề xuất:

**1. Phạm vi bài thử**

Kiểm tra rule dùng chung, điểm mơ hồ, AC/test; truy từ đặc tả sang code/test và ngược lại; map thiếu/cũ hoặc link đúng nhưng sai nghĩa. Bao gồm thêm Feature giữa MVP, đổi sau release, hotfix, ảnh hưởng qua phần không có diff, vòng phụ thuộc và di chuyển/xóa nội dung.

Thử cả nơi **cần sửa** và nơi có căn cứ **không cần sửa**; không hỏi lại các nguyên tắc MVP/hotfix đã chốt.

**2. Cách xác nhận đạt**

Chuẩn bị mẫu có tập ảnh hưởng và kết quả mong đợi được review trước, rồi đối chiếu độc lập với kết quả Kidea:

- Không bỏ sót phần bắt buộc.
- Kết luận có căn cứ, đúng phiên bản.
- Không đóng việc khi còn phần chưa xử lý hoặc chưa đủ thông tin.
- Tìm thêm quan hệ hợp lệ được phép; link/graph hợp lệ không tự chứng minh đúng nghĩa.

Ví dụ: **B đổi cách làm tròn → A dùng B nhưng không sửa code → D dùng kết quả A**. Kidea vẫn phải xét ảnh hưởng đến D, không dừng vì A “không có diff”.

Đạt trên mẫu hữu hạn không chứng minh tìm hết mọi dependency của mọi project; pilot vẫn cần kiểm chứng thật. Chưa chốt công cụ, thuật toán, số lần chạy hoặc giới hạn vòng lặp.

Bạn duyệt hai điểm này nhé? [Gói review trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current).

<oai-mem-citation>
<citation_entries>
MEMORY.md:52-52|note=[scoped answer publication reverified]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
