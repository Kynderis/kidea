# R03 completion-r1 — semantic review working record

Ngày 2026-09-15. Gói thực hiện được Human “Duyệt toàn bộ gói R03” tại baseline a528087; kết quả chưa được Human duyệt. Hồ sơ thật ở D:/Code/kynderis/kidea-workshop-pilot/docs. Bản snapshot evidence sau cùng chỉ để kiểm lại, không nguồn sản phẩm thứ hai.

## Root review: nghĩa vụ → vị trí → kết luận

| Nguồn đã duyệt | Vị trí hồ sơ | Đối chiếu |
|---|---|---|
| B1/B8 | workshop W-ACCESS/W-LISTS; view flow/AC; P01–P06/P08 | Tách public/private/admin, PAUSED công khai, DRAFT admin; lịch sử chính chủ, thứ tự stable; không auto-close/A/B |
| B2 | workshop W-DATA, registration R-INV; D01–D06 | Bắt buộc/non-null, code point/trim, một dòng/plain text, C integer1–1000 và ≥N, thời điểm có timezone/end>start; không cam kết tải |
| B3 | W-STATE/W-EDIT; admin flow/AC; P07/D07/D08 | Toàn9 ôstate, sửa cả3state, sửa lịch có ACTIVE, không đổi không event; không delete/backDRAFT/email |
| B4 | R-INV/R-NEW; R04–R06 | ID mới sau hủy; không hồi sinhID cũ, cancelA không đụngB; lịch sử lab không auto-clean |
| D1 | R-RETRY; I01–I10 | Phân loại mã mới/cũ/mismatch/pending/unknown; quyền hiện tại; lịch sử khác currentstate; FULL cũ không biến thành nhận khi có chỗ; thêm same-ID concurrent và CANCEL unknown sau phát hiện B |
| D2 | R-NEW; R03/R07/R08/P04 | Cú pháp→quyền→OPEN→registration→C; PAUSED+ACTIVE/full và không quyền+PAUSED; retry lịch sử không là thao tác mới |
| D3 | R-SERIAL; C01–C05 | 5 cặp ×2 thứ tự hợp lệ, gồm hai người chỗ cuối, giảmC, đăng ký/hủy vsPAUSE, cùngngười2mã; không priorityadmin/cacheauthority |
| B5 | V-PUBLISH/V-RECONCILE; E01–E08 | Lưu outcome+nghĩavụphụchồi trước finalsuccess; bản nhấtquán/version, old/dup/conflict, fullsnapshot và đọc authority; không replaybooking |
| B6 | V-STALE; I04/E06/E07 | Giữ lastseen/time; chưa có dữ liệu không bịa0; unknown giữmã, khôngfinalfailure; khôngngưỡnggiâyR03 |
| B7 | V-PUBLISH/V-MONITOR; E08–E10/P02 | Mọi changekind; DRAFT khôngpublic; khôngPII/requestID; monitoringadmin, giữlỗi, khôngreplay/deletecontrols |
| C1/D trace | 10 docs, các relations, T01–T04 | 4 flow/AC, test→rules, nguồnngược/caller/impact; Future giữngoàiMVP và nativegiữnguyên |

Đây là rà soát ngữ nghĩa bởi phiên soạn, không independent whole-pilot acceptance. Các case trong tests.md là specification; chưa chạy sản phẩm. Phân hoạch và loại tổ hợp có lý do ở coverage; không dùng số hàng để nhận vét cạn toàn không gian input. Không có OPEN nghiệp vụ mới được tự phê duyệt. Encoding/payload, cách xác định markup qua giao thức, ngưỡng latency, database/broker/atomicity implementation và thiết bị giữ ở phase kỹ thuật như nguồn cho phép.

## Self-review corrections / failures retained

- Lệnh đọc AGENTS.md ở root báo không có file; dùng chỉ dẫn AGENTS do Human cung cấp. Không tạo file để thay chỉ dẫn.
- Một apply_patch tích hợp SKILL thất bại vì context chỉ trích một phần dòng dài. SKILL chưa đổi từ lần thất bại; áp dụng lại bằng context đúng, không thay runtime. Đây là lỗi thao tác soạn, không lỗi test sản phẩm.
- Rà backlink ban đầu thấy bảng nhóm chưa có đủ caller/AC trực tiếp. Bổ sung exact anchors và mục đích vào 3 shared docs trước lần kiểm tài liệu cuối; không sửa frozen skill/input AI.
- Link check đầu: 10 files/202 links/0 lỗi; sau bổ sung: 10 files/238 links/0 lỗi. Các bản ghi lần chạy giữ trong raw evidence, không bỏ lần trước.
- Skill validator ban đầu: “Skill is valid!”. Link checker có 4 ca kiểm tra hành vi (gồm missing file/missing anchor/duplicate anchor) và 1 ca real-pilot, 5/5 PASS; lần cuối được capture riêng.

## Giới hạn tích hợp

Chỉ SKILL.md và references/business.md thay đổi hướng dẫn. CLI, schema và scripts runtime giữ nguyên. Public helper chưa có product-authoring executor hoặc task-transition/decomposition executor; đây là nghĩa vụ còn lại của tích hợp workflow ở R06/R08/R09/R10, không nhận C1 là helper đã thực hiện. R03 hướng dẫn đọc/clarify/review và thử authoring theo quyền trực tiếp; không mở runtime mới hoặc R04.

## Independent trials

Đúng hai phiên mới A→B, tối đa900giây/phiên, fresh context/no children, kế thừa model/effort. Prompts trong tests/r03/prompt-A.md và prompt-B.md; inputmanifest/hash và deadline trước spawn trong raw evidence. Controller envelope chỉ yêu cầu thực hiện prompt đó và deadline, không truyền oracle. B chỉ nhận exact A handoff và cùng approved sources; kết quả được chấm sau khi đọc file thực. Kết quả cuối/rubric và timing được bổ sung trong báo cáo tổng hợp, không tự điền PASS ở bản này.

## Đối chiếu phát hiện B và sửa trong quyền

- B-01 hợp lệ: bản A có các chỗ chỉ nêu mã nguồn, thiếu link đến mục. Hồ sơ chính cũng được rà và bổ sung nguồn quyết định theo section cụ thể cho từng shared rule; không thay proposal/input đóng băng. Các hàng B1–B8 chung một mục nguồn, nhãn liên kết nói rõ mã dùng, không giả tồn tại anchor riêng từng hàng.
- B-02 hợp lệ: bảng backlink A bỏ sót caller cụ thể. Hồ sơ chính đã được root bổ sung các caller/AC trực tiếp trước B; đối chiếu lại cả bốn loại thiếu B nêu với relations của ba shared docs. Bản A/handoff giữ nguyên, không đổi kết quả thử thành PASS sau khi root sửa tài liệu khác.
- B-03/B-04 hợp lệ: generic pending/unknown hoặc same-person hai mã không thay hai ca tương tác này. Thêm I09 (same-ID đồng thời) và I10 (CANCEL đã đổi state nhưng chưa-final, kể cả rebookB) vào hồ sơ chính. Expected suy từ D1/B4/B5, không thêm lock, timeout hoặc chính sách mới.
- Sau sửa: 53 nhóm case specification; 10 docs; 257 liên kết (kể cả provenance tới nguồn Kidea) không thiếu đích/anchor; 5/5 test kiểm tài liệu PASS, hashes trước/sau không đổi. Giữ lần final-verification đầu và lần r2 sau bổ sung. Cả hai không là test ứng dụng hoặc AI kiểm bản pilot cuối.
- Không sửa skill sau khi khóa AI: lỗi cho thấy agent chưa tuân đủ hướng dẫn traceability/coverage sẵn có, chưa có căn cứ thêm luật phổ quát hoặc đổi runtime. Tồn tại hạn chế hành vi cần theo dõi ở kiểm workflow sau; không tự tuyên bố phương pháp đã được AI chứng nhận đầy đủ.
