Tôi đã rà toàn bộ. Thay đổi này ảnh hưởng cả thiết kế, tiêu chí nghiệm thu và roadmap sau R05, không chỉ dừng cài Android/iOS.

Quyết định mới đã được ghi nhận: **client hiện hành chỉ Web; Android/iOS là Future, chưa có roadmap hoặc thời hạn.** Không cần bạn duyệt lại quyết định này hoặc đăng nhập Apple.

| Nhóm | Cần điều chỉnh ở đâu và như thế nào |
|---|---|
| Phạm vi thiết kế | `KIDEA_DESIGN.md`: sửa ma trận hỗ trợ, profile, cây project mẫu, kiến trúc và phát hành mặc định thành backend + Web. Native giữ ở phần Future/lịch sử. |
| Roadmap | Hoãn sáu task: Android/iOS của **R05**, mapping Android/iOS của **R06**, pilot Android/iOS của **R09**. R08/R10 kiểm theo phạm vi Web mới. Không chuyển chúng sang một phase hay ngày hẹn khác. |
| Nghiệm thu | `KIDEA_ACCEPTANCE.md`, `KIDEA_QUALITY.md`: native không còn chặn phạm vi hiện tại. Giữ các gate nghiệp vụ, an toàn, bằng chứng, build/release/restore; hoãn native không có nghĩa đã PASS. |
| Hồ sơ pilot | Có **11 file ảnh hưởng trực tiếp và 2 file cần chỉnh diễn đạt**: MVP, UI, kiến trúc, chất lượng, profile và ma trận test. Cần bản amendment có truy nguồn; giữ nguyên nghiệp vụ backend/Web. |
| Skill | Cập nhật `SKILL.md` và `references/product-design.md` để không tiếp tục hướng dẫn tạo app/profile native; responsive do project quyết định. Helper/schema/CLI hiện không cần đổi. |
| Test và bằng chứng | Giữ nguyên kết quả cũ. Tách biến thể native khỏi ca chung; không xóa cả nhóm test hay sửa kỳ vọng để xanh. Nhiều ca vẫn kiểm Web/backend. |
| Môi trường và bàn giao | Dừng Android runtime, Xcode/Simulator/signing và việc lấy bộ cài Apple. Giữ SDK/AVD/cache/log đã có; chưa cần gỡ hoặc dọn máy. |

**Về responsive:** Kidea nên giúp project xác định màn hình/hành trình cần hỗ trợ và tiêu chí kiểm, không áp breakpoint hoặc bố cục chung. Các yêu cầu màn hẹp, font lớn, cảm ứng/accessibility đã chốt cho từng ứng dụng vẫn cần kiểm. Web trên điện thoại vẫn là Web.

**Không đổi:** backend C++/Docker, Web SvelteKit/TypeScript, SEO/SSR/realtime và việc chạy Kidea trên Windows/Mac Intel/Apple Silicon. Apple Silicon chưa kiểm vẫn là việc riêng của LP-01.

Tôi đã cập nhật quyết định, sáu task roadmap, tiêu chí áp dụng, bàn giao và trạng thái các gói native. **Chưa sửa chi tiết skill hoặc hồ sơ pilot**; bảng đầy đủ nằm trong [báo cáo ảnh hưởng](docs/WEB_CLIENT_SCOPE_REVIEW.md). Đã kiểm liên kết, tính nhất quán và bảo toàn 21 file pilot.

**Bước tiếp:** đồng bộ chi tiết thiết kế/skill/pilot và ma trận test theo phạm vi mới, rồi review bằng chứng backend/Web để tiến tới khép R05. R05 vẫn cần tích hợp, kiểm môi trường sạch/hồi quy và bạn nghiệm thu kết quả.
