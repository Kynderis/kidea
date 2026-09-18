# Chrome trên snapshot pilot thật hiện tại — chưa khép T14

Dùng public visualize6lượt trên pilot thật, không sửa work/status. [Generation](pilot-view-current/generation.json):22.931byte,10nhóm UNEXPANDED,0map receipt; thời gian3.021–3.979ms (tức khoảng3,0–4,0giây), dưới ngưỡng5giây áp dụng pilot trong M. Hash work trước/sau bằng nhau. Missing maps giữUNKNOWN, không fake tiến độ.

[Chrome lần đầu](pilot-view-current/browser.json) **FAIL ngưỡng tương tác200ms**, có mẫu search550,5ms khi Docker đang build. Giữ log và nguồn script; không lọc mẫu hoặc nới ngưỡng. Chưa có đủ24mẫu do dừng cấu hình khi assertionfail.0networkrequest/0pageerror. Cần kiểm lại khi ghi rõ trạng thái tải máy, đồng thời phân biệt kết quả snapshot hiện tại với lượt cuối toàn pilot. Chưa nhận T14PASS.

Kiểm lại khi không có Docker build: [24 mẫu/bốn cấu hình PASS](pilot-view-quiet-final/browser.json), mở tối đa324.64ms, tương tác tối đa34.00ms. Cùng hashHTML;0network/0pageerror. Giữ [lần lỗi harness nhãn](pilot-view-quiet/browser.json): đã kiểm nhầm UNEXPANDED/UNKNOWN thay nhãn tiếng Việt và kiểm sau filterDONE. Bản sửa kiểm 'Chưa phân rã' và đủ3thông báo thiếu bản đồ trước filter, không đổi ngưỡng. Đây là snapshot khung hiện tại, không toàn pilot/G2 cuối.
