# R08 r1 — hướng dẫn và kiểm local

2026-09-17. **IMPLEMENTED / LOCAL_CHECKS_PASS; chờ Human nhận kết quả r1. R08 IN_PROGRESS.** Human duyệt D1–D3 bằng “ok làm đi” trên `8f04649c3ab1860def732311e480334e08f59843` (master, Kynderis/kidea, checkout sạch trước sửa). Đây là base approval, không phải commit chứa phần mới. Hash đầu vào mới tại [core.json](implementation-r1/core.json), [checks.json](implementation-r1/checks.json) và [receipt](implementation-r1/receipt.json).

## Đầu ra và review

Đã thêm [delivery.md](../../../.agents/skills/kidea/references/delivery.md), route từ SKILL và coding-testing; giữ schema/runtime/action/writer nguyên. Bao gồm plan/quyền, vòng code và G2 toàn dự án, môi trường sớm, artifact/revision, DEV/PROD, preflight/attempt/readback/restore, SEO/observer/cleanup/incident. Không áp công nghệ pilot lên mọi project.

[Oracle](../../r08/oracle.md) lưu trước hướng dẫn và kết quả; [receipt thứ tự/hash](implementation-r1/oracle-freeze.json). [14 tình huống review](../../r08/scenario-review.md) có input/trigger/quyết định/allowed/blocked/evidence/gate và reviewer. 14/14 phù hợp oracle qua tự review Codex; nhãn REVIEW_SCOPED, không là phép đo hành vi agent độc lập hoặc deploy PASS. Checker chỉ kiểm cấu trúc/liên kết/hash, không dùng keyword để chứng minh ngữ nghĩa.

## Kiểm thực trên nguồn cuối

- Core **283/283 PASS, 0 fail/skip**, Node24.19.0, 108.53giây,1/2lượt đầy đủ đã dùng. [Raw stdout](implementation-r1/core-raw/stdout.txt), [stderr](implementation-r1/core-raw/stderr.txt), [summary](implementation-r1/core-raw/summary.json); đầu vào core và guidance/checker không đổi. Schema/Ref/VersionRef/review dùng các kiểm có sẵn, không thêm assertion trùng.
- Checker r1 PASS: local link không thiếu; oracle nguyên hash; đủ C01–C14. 59 file runtime/test đối chiếu baseline R07 khớp; không cần chạy lại R06/R07 hoặc phiên AI lịch sử. Đây là đối chiếu hồi quy nguồn, không lượt runtime R06/R07 mới.
- 2.245 file bằng chứng R05 và 4.088 payload R07 khớp;21docs live pilot khớp, pilot vẫn không `.kidea`, không ghi vào pilot. Evidence R06 không sửa; Git diff chỉ có nguồn r1/docs mới.
- Validator skill Python **FAIL do thiếu PyYAML**: [log nguyên](implementation-r1/skill-validator.stderr.txt). Không cài thêm. Ruby standard YAML kiểm frontmatter name/description/giới hạn/placeholder **PASS có giới hạn**, [kết quả](implementation-r1/skill-fallback.json); kiểm routing tách riêng. Không gọi Python validator PASS.

Môi trường macOS14.7/23H124 Intel x86_64,uid501; Node≥24 qua runtime sẵn có, không đổi Node22 mặc định. Root repo local `/Users/kendrick/Desktop/kidea`,349GiB trống tại kiểm đầu. Không Docker/download/install/cloud/deploy/AI trial mới. Raw output và bản core working copy dưới256MiB, số byte trong receipt; mọi công cụ dưới30phút. Giữ log FAIL/PASS, không sửa kỳ vọng hoặc bỏ ca. Apple Silicon NOT_RUN.

## Trạng thái và bước tiếp

T01/T02 đã có hướng dẫn và review r1, chờ Human nhận kết quả. T03–T06 có phần hướng dẫn nhưng **lab thật bắt buộc chưa chạy**, chưa DONE. [R2 draft](../../../proposals/r08-lab-r2-draft.md) truy nguồn R05 thật và liệt kê command/fault/readback cần có; chưa EXECUTION_READY vì chưa inventory Docker, chưa bộ script/manifest/quota cuối. Ngoại lệ R05-TIDY-01 hết hiệu lực, không tự áp lại. Cần giao lát cắt chuẩn bị R2 rồi mới trình gói chạy đã cố định. R09-T14 vẫn NOT_RUN bắt buộc; R08 chưa nghiệm thu, không phải toàn Kidea hoàn tất.
