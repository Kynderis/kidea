Đã chuẩn bị [phương án xử lý SQLite–TSan](docs/R09_T02_TSAN_GATE_PROPOSAL.md).

Đề xuất một ngoại lệ hẹp: giữ TSan và mọi log lỗi, nhưng cho phép review riêng **đúng hai cặp truy cập header SQLite đã tái hiện**. Vẫn chạy đủ test; cảnh báo khác, thiếu kết quả hoặc sai dữ liệu đều chặn. Kết quả có ngoại lệ sẽ ghi rõ giới hạn, không gọi TSan sạch và không đổi sáu FAIL cũ thành PASS.

Bạn duyệt **EX-T02-WAL-01 r1**, gồm ngoại lệ có điều kiện và quyền triển khai/kiểm bộ phân loại báo cáo nhé? Sau đó tôi sẽ chuẩn bị manifest build trên nguồn hoàn chỉnh. Chưa chạy thêm container hoặc sửa backend.

Cần bạn quyết định vì đây là thay đổi tiêu chí chấp nhận warning, có rủi ro còn lại; quy trình ngoại lệ đã chốt tại docs/engineering/rules.md#exceptions trong pilot yêu cầu duyệt trước khi áp dụng. R09 vẫn chưa hoàn tất.
