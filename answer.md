Đã chốt phương án và đồng bộ thiết kế, lộ trình cùng các ca nghiệm thu: **một master chính, kiểm chứng điều khiển từ local, AI chạy DEV, Human chạy PROD; nhánh bảo trì khi cần.** Giữ nguyên toàn bộ nghĩa vụ review/test sau mỗi Feature.

**Tiếp theo: chốt cách lưu và phục hồi việc dang dở** — gói `R01-T06-S02-r1`. Mình đề xuất hai điểm:

1. **Lưu theo mốc công việc.** Cập nhật điểm tiếp tục sau mỗi task, trước đổi việc/đổi bản nguồn và trước chủ động kết thúc phiên. Giữ cả nội dung chưa commit, bản nền, việc đã/chưa làm, kết quả kiểm tra và bước tiếp theo. Không ép tạo nhánh/file riêng hoặc commit mỗi lần sửa; phần chưa đạt vẫn giữ local, không tự đẩy lên master hay deploy.

2. **Chỉ tự phục hồi lỗi ghi local trong giới hạn rõ.** AI có thể hoàn tác bước ghi lỗi của chính mình khi có bản trước đã xác minh, đúng file thuộc nhiệm vụ/quyền project và chưa bị bạn hoặc thao tác khác sửa thêm; sau đó kiểm tra lại. Nếu thiếu căn cứ, có xung đột hoặc không tách được phần thay đổi thì giữ nguyên và hỏi. Quyền này **không** cho tự reset lịch sử Git, hoàn tác commit đã chia sẻ, chạy lại migration hoặc khôi phục database/môi trường.

Bạn đồng ý hai điểm này chứ? Sau đó mình sẽ khép phần lưu/khôi phục và chuyển sang quy tắc version cùng hồ sơ bản phát hành.

[Gói cần duyệt trên GitHub](https://github.com/Kynderis/kidea/blob/master/KIDEA_ROADMAP.md#review-current). Đã kiểm tra liên kết, trạng thái và giữ đủ 30 họ kịch bản; hiện chỉ cập nhật tài liệu, chưa xây skill hoặc chạy pilot.

<oai-mem-citation>
<citation_entries>
MEMORY.md:52-52|note=[repository scoped answer publication reverified]
</citation_entries>
<rollout_ids>
01a064b8-dde1-7882-acc1-7d02d6f568c8
</rollout_ids>
</oai-mem-citation>
