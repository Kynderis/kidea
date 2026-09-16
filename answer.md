Hiểu ý bạn: **chuyển sang làm trực tiếp trên Mac bằng một phiên Codex mới**, không điều khiển Mac từ Windows.

Tôi đã lưu và đẩy [hướng dẫn bàn giao](https://github.com/Kynderis/kidea/blob/master/docs/MAC_HANDOFF.md) lên repo.

Bạn làm như sau:

1. Clone hoặc mở [repo Kidea](https://github.com/Kynderis/kidea) trên Mac, trong thư mục local không đồng bộ, chẳng hạn `~/Code/kidea`.
2. Bắt đầu phiên Codex tại đúng thư mục đó.
3. Dán nguyên prompt dưới đây:

```text
Tôi tiếp tục phát triển Kidea từ Windows sang MacBook Pro 2019 Intel này. Đây là phiên làm việc tiếp nối, không thiết kế lại từ đầu.

Hãy đọc AGENTS.md áp dụng và docs/MAC_HANDOFF.md, sau đó đọc các nguồn được dẫn trong đó, đặc biệt trạng thái hiện hành của KIDEA_ROADMAP.md. Không suy quyết định từ lịch sử chat mà bạn không có.

Nhiệm vụ trước mắt:
- Xác minh repo/nhánh/thay đổi đang có, macOS/CPU, Node ≥24, Git và thư mục local.
- Chuẩn bị dependency project theo lockfile bằng npm ci khi đủ điều kiện; chạy bộ kiểm lõi trên Mac thật.
- Nếu có lỗi portability, sửa trong phạm vi LP-01, bổ sung test và kiểm lại đầy đủ; giữ log cả lỗi lẫn thành công.
- Cập nhật bằng chứng, trạng thái và điểm tiếp tục; commit/push theo quyền repo đã có. Không nhận kết quả Mac Intel thay Apple Silicon.

Giữ cách làm đơn giản: cùng một Kidea trên Windows/Mac; không hỗ trợ ổ mạng/iCloud/OneDrive. Không tự cài Docker, Xcode, SDK, VM hoặc thuê cloud. Nếu thiếu công cụ hệ thống, gom một đề xuất cài tối thiểu để tôi chốt.

Làm liền mạch trong phạm vi trên, không hỏi lại từng lệnh hoặc quyết định đã duyệt. Chỉ hỏi khi phát sinh thông tin/quyền thực sự cần tôi. Sau kiểm Mac, nêu rõ bước tiếp theo theo roadmap; không tự coi gói R05 chưa duyệt là đã được duyệt.

Bắt đầu kiểm tra môi trường và đọc hồ sơ ngay.
```

**Lưu ý Mac Intel:** trang desktop hiện giới thiệu bản tải macOS Apple Silicon. Nếu app không chạy trên máy bạn, dùng Codex CLI tương thích; mở Terminal tại repo rồi chạy `codex` khi đã cài. [Desktop chính thức](https://learn.chatgpt.com/docs/app), [hướng dẫn CLI](https://learn.chatgpt.com/docs/codex/cli).
<oai-mem-citation>
<citation_entries>
MEMORY.md:482-482|note=[Use current repository sources for Kidea handoff]
</citation_entries>
<rollout_ids>
</rollout_ids>
</oai-mem-citation>
