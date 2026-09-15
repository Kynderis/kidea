## Kết quả review B: COMPLETE

Đã đọc bốn file handoff, bốn proposal và skill/business reference đóng băng trong phạm vi được cấp. Không phát hiện mâu thuẫn nghiệp vụ trực tiếp trong các nhánh đã đặc tả. Handoff tái dựng được độc lập; **traceability và coverage vẫn còn thiếu**, chưa đủ để tuyên bố bao phủ hoàn chỉnh lát cắt hoặc toàn MVP.

Đây là review đặc tả, không phải approval hoặc kết quả test sản phẩm.

## Những điểm cần xử lý

### B-01 — Liên kết nguồn chưa chính xác đến mục được dùng

**Loại: thiếu traceability; không phải sai expected nghiệp vụ.**

Tại [rules.md](/D:/Code/kynderis/kidea/.test-output/r03/completion-r1/handoff/rules.md:69):

- R-MUTATE chỉ ghi chữ “registration D2; completion B4”, không liên kết đến mục nguồn.
- DATA, INV và R-UPDATE cũng viện dẫn nguồn bằng tên/mã thuần văn bản; R-UPDATE dòng 109 không có link tới B5–B7 hoặc phần chi tiết phục hồi.
- INDEX có các liên kết đến cả file proposal dù nhãn nói “mục 2–3 và 5” hoặc “mục 1 và 3–4”.

Người đọc vẫn tìm được căn cứ bằng tìm kiếm, nhưng chưa đáp ứng yêu cầu dẫn đúng mục của `business.md`, phần **Coverage and change impact**, và template mục 1/4.

Kiểm tra tĩnh **99 liên kết Markdown hiện hữu** không thấy file hoặc anchor thiếu. Kết quả đó chỉ xác nhận đích của link đã viết; không phát hiện những link cần có nhưng chưa được viết.

### B-02 — Bảng quan hệ ngược bỏ sót caller thực tế

**Loại: thiếu traceability/đánh giá ảnh hưởng.**

Bảng [rules.md — IMPACT](/D:/Code/kynderis/kidea/.test-output/r03/completion-r1/handoff/rules.md:139) có các thiếu sót cụ thể:

| Rule | Caller đã dùng nhưng thiếu trong hàng backlink |
|---|---|
| INV | `flow-ac.md#ac3` trực tiếp dẫn INV |
| R-MUTATE | `flow-ac.md#ac1` và `tests.md#concurrent` trực tiếp dẫn R-MUTATE |
| R-SERIAL | `tests.md#state`, trong đó S10–S12 dùng hợp đồng admin/thời gian |
| R-UPDATE | `rules.md#mutate` và `tests.md#retry` trực tiếp dẫn R-UPDATE |

Hậu quả: nếu dùng bảng IMPACT làm danh sách caller cần review, có thể bỏ sót expected hoặc AC bị ảnh hưởng. Hướng dẫn tìm toàn bộ ID/link ở dòng 146 giúp giảm nguy cơ, nhưng không làm bảng backlink hiện tại trở thành đầy đủ.

### B-03 — Chưa có ca đồng thời cho hai bản gửi cùng requestId

**Loại: khoảng trống coverage; rule đã đúng.**

[T-RETRY và T-CONCURRENT](/D:/Code/kynderis/kidea/.test-output/r03/completion-r1/handoff/tests.md:69) hiện có:

- R01: gửi lại khi đã có final.
- R04/R05: gửi lại khi hệ thống đã nhận biết đang xử lý/chưa xác định.
- C05: hai **mã khác nhau** của cùng người.

Chưa có ca cụ thể cho hai bản cùng mã/cùng nội dung đến đồng thời khi chưa có kết quả được ghi nhận.

Ví dụ còn thiếu: OPEN, C=2, N=0; U gửi hai bản REGISTER mã x đồng thời. Expected theo D1: chỉ một đăng ký và một tác dụng nghiệp vụ; có thể trả chưa-final trong lúc xử lý, nhưng khi đọc được final thì cùng kết quả/ID lịch sử, không biến bản thứ hai thành ý định mới “đã đăng ký”.

Đây là rủi ro phối hợp retry với concurrency nằm trong lát cắt. Nó không đòi chọn lock/database hoặc cam kết thời hạn. Không kết luận implementation có lỗi vì chưa có implementation được kiểm.

### B-04 — Ca gián đoạn sau CANCEL chưa được đặc tả riêng

**Loại: khoảng trống coverage; không phải thiếu cơ chế kỹ thuật bắt buộc ở R03.**

R05 và U07 mô tả authority đã **tạo A bằng REGISTER** nhưng chưa xác định lưu outcome/nghĩa vụ. R03 kiểm CANCEL khi **đã có final**. Chưa có chuỗi cụ thể cho CANCEL đã đổi state nhưng outcome/nghĩa vụ còn chưa xác định.

Ví dụ còn thiếu: A ACTIVE, N=2; CANCEL mã y đã làm A CANCELLED, N=1 nhưng mất khả năng xác nhận final; gửi lại y. Expected theo D1/B4/B5: không giảm N thêm, không báo thất bại cuối do mất phản hồi, đối chiếu cùng y và giữ nghĩa vụ cập nhật. Nếu đã có lần đăng ký mới B, phục hồi y không được hủy B.

R04 chung về pending không đủ biểu diễn riêng nguy cơ giảm chỗ lần hai hoặc đụng ID mới của CANCEL. Căn cứ: [tests.md — R03–R05](/D:/Code/kynderis/kidea/.test-output/r03/completion-r1/handoff/tests.md:71), U07 dòng 109; registration D1 và completion B4–B6.

## Các kết quả tái dựng được từ file

| Tình huống | Kết quả quan sát và state cuối |
|---|---|
| OPEN, C=1, N=0; U đăng ký mới | Tạo A ACTIVE, N=1; chỉ trả thành công cuối khi đã xác định giữ outcome/nghĩa vụ cập nhật. |
| PAUSED và đầy; yêu cầu mới đủ quyền | Trả hiện không nhận thao tác; không trả hết chỗ; state nguyên. Không đủ quyền thì dừng trước nhánh PAUSED. |
| U đã ACTIVE và workshop đầy | REGISTER mã mới trả đã đăng ký, không trả hết chỗ; không tạo thêm bản. |
| REGISTER A → CANCEL A → REGISTER B → CANCEL A mã mới, vẫn OPEN | A CANCELLED; B ACTIVE; lần cuối trả đã hủy; N=1. |
| Retry mã REGISTER đã thành công sau khi A bị hủy và W PAUSED | Trả thành công lịch sử của A; A vẫn CANCELLED, N không tăng; không khẳng định A hiện ACTIVE. |
| C=10, N=9; REGISTER tranh chấp với giảm C→9 | REGISTER trước: C=10,N=10, giảm bị từ chối. Giảm trước: C=9,N=9, REGISTER hết chỗ. |
| CANCEL A tranh chấp với PAUSE | CANCEL trước: A CANCELLED rồi PAUSED. PAUSE trước: CANCEL bị từ chối, A vẫn ACTIVE. |
| UI còn 1 nhưng authority đã đầy | REGISTER bị từ chối hết chỗ. Nếu mất kết nối, giữ quan sát cũ và thời điểm kèm “chưa cập nhật”, không giả số 0. |

Năm cặp C01–C05 đều ghi cả hai thứ tự và giữ N≤C, một ACTIVE/người/workshop. Không thấy việc áp đặt người thắng hoặc dùng cache làm authority.

## Phần được hoãn đúng phạm vi

Không coi những nội dung sau là lỗi của phiên A:

- Toàn flow admin/view/monitoring, validation tiêu đề/mô tả/lịch, sort danh sách: đã công khai ngoài lát cắt; vẫn còn nghĩa vụ của toàn MVP.
- Giới hạn hai ACTIVE toàn hệ thống và hủy mới khi PAUSED: được giữ ngoài MVP; S09 và S08 kiểm ranh giới này.
- Grammar ID, normalization payload, HTTP/UI wording, permission mapping, cơ chế đồng bộ và SLO: được ghi OPEN hoặc hoãn kỹ thuật; không có expected giả.
- Không có test executable, UI web/native, crash injection, performance hoặc triển khai. Thiếu các bằng chứng này không chứng minh rule sai.

## Đối chiếu rubric

| Tiêu chí | Kết quả review tài liệu |
|---|---|
| Đúng phạm vi/MVP | PASS |
| Không tự chốt OPEN hoặc approval | PASS |
| Input/state → output/state của nhánh đã chọn | PASS, trong giới hạn OPEN đã ghi |
| Retry không lặp tác dụng | PASS về rule; coverage còn B-03/B-04 |
| Các lịch đồng thời giữ invariant | PASS đối với C01–C05 |
| Không dùng cache quyết định | PASS |
| Link/AC/test có căn cứ và coverage rõ | PARTIAL: B-01–B-04 |
| B tái dựng độc lập từ file | PASS |

**Review đã hoàn tất trong hạn; thực thi sản phẩm: NOT_RUN.** Không sửa file, gọi Kidea runtime, truy cập Git/`.kidea`, mạng hoặc tạo agent con. Phạm vi được giữ bằng chỉ dẫn, không phải bằng chứng sandbox hệ điều hành.

Bản handoff đã review có SHA-256:

```text
INDEX.md   A9EC0510D77AA2A0B436986348BC478D14DEC047B3936DA488FB9F27F6E4AD7C
rules.md   4B04EEDE5C3584B27A6F2035C437E382510608EE6041BCF0BB656FC99CD2F843
flow-ac.md C351D551B4C430D8C0DAD767F3651B10587ED171D35969D4C5EB55A1FDE605D8
tests.md   84C120A2C73FF3705ED11C94A3C7D420070F02DB894FBACA4CAF4849FB3C8013
```
