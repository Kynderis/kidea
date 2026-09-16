# R05 — Bản vá tương thích Caddy/CEL r1

Ngày 2026-09-16. **APPROVED và đã áp dụng** qua Human “ok làm đi” sau `308c0e8`. [Thực thi r3](../tests/evidence/r05/backend-execution-r3.md): build Caddy PASS, 54 leaf matcher tests PASS và 33 ca Node HTTPS PASS. Còn FAIL riêng tại biên header; E2 chưa hoàn tất. Nội dung đề xuất gốc dưới đây được giữ để đối chiếu.

Gói thay dependency đã được Human duyệt và thực hiện trên nguồn `57319d7`. Go 1.26.7 chạy trong Docker; dependency resolve/checksum PASS. Build Caddy 2.11.4 với cel-go 0.30.0 FAIL tại hai lời gọi `interpreter.NewCall` trong `modules/caddyhttp/celmatcher.go`, dòng 506 và 529 của archive đã khóa. API mới nhận `[]interpreter.InterpretableV2`, source cũ truyền `[]interpreter.Interpretable`.

Đề nghị áp một bản vá source vendor gồm đúng hai thay đổi kiểu slice:

```diff
- []interpreter.Interpretable{reqAttr},
+ []interpreter.InterpretableV2{reqAttr},
```

`reqAttr` là `InterpretableAttribute`; source cel-go 0.30.0 xác nhận interface này đã nhúng `InterpretableV2`. Không cần ép kiểu bỏ kiểm hoặc đổi logic matcher. Đây là đề xuất từ đọc source và lỗi compiler, chưa chứng minh build/runtime PASS.

Sau khi áp: giữ patch/hash riêng, build lại trong Docker network none; chạy test matcher upstream, bổ sung regression cho hai nhánh matcher factory, adapt/validate Caddyfile và kiểm từ chối proxy header giả trước full HTTPS/integration. Giữ Go 1.26.7 và dependency lock mới, cùng ngân sách E2 tính lũy kế. Không cài host và không thay assertion để lấy PASS.

Không chọn hạ CEL để né lỗi: hai nguồn advisory đã lưu không đồng nhất (GHSA ghi sửa từ 0.29.0, Go database ghi 0.30.0). Bản 0.30.0 đã được duyệt loại bỏ nghi vấn này ở mức phiên bản; cần sửa tương thích source.

Lý do trình lại là [gói được duyệt](r05-caddy-remediation-r1.md) quy định dừng nếu graph không tương thích. Thay đổi lần này chạm source Caddy, ngoài việc đổi dependency đã mô tả. Chỉ cần duyệt bản vá hai vị trí và tiếp tục kiểm trong hạn mức hiện có; không xin lại quyền Docker.
