Observer và màn dự phòng trong pilot đã qua **29 kiểm thành phần + 15 nhóm Chrome/TLS PASS**. Số đo đang giả lập; T05/R09 vẫn mở.

Bước lưu checkpoint bị ngắt bởi giới hạn 20 phút tôi đặt. Phát hiện Kidea tạo tệp phục hồi 79,3 MiB nhưng chỉ đọc tối đa 64 MiB. Công việc cũ còn nguyên, checkpoint đang chờ.

Cần duyệt **[gói recovery r1](proposals/r09-observer-checkpoint-recovery-r1.md)**: đồng bộ trần tệp nội bộ 128 MiB, chuyển đúng hai module theo hash và hoàn tất đúng ghi chú đã chuẩn bị. Bản vá riêng đã qua 293 core + 9 recovery; chưa áp vào bản đang dùng/chưa phục hồi. Source/copy vẫn giới hạn 64 MiB; trần máy/đĩa cũ giữ nguyên.

Cần xác nhận vì [quyền R09](docs/R09_EXECUTION_AUTHORITY.md) không cho tự nới giới hạn an toàn. [kidea/SKILL.md](.agents/skills/kidea/SKILL.md) quy định “Only the explicitly granted `READ_RECOVERY`/`RECOVER` procedure”; [recovery contract](.agents/skills/kidea/references/recovery.md) yêu cầu “new explicit grant” cho đúng checkpoint. Task khép phục hồi khó: **GPT-5.6 Sol + High**; [OpenAI Docs](https://developers.openai.com/api/docs/models/gpt-5.6-sol).
