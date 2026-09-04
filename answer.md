# Rà soát lại quy tắc ID và các loại dependency

## 1. Khi bản chất nghiệp vụ thay đổi thì xử lý ID thế nào?

Đúng, cách bạn nhắc lại chính là cách tài liệu hiện tại đang hướng tới.

Quy trình phải là:

1. AI so sánh nghiệp vụ trước và sau thay đổi.
2. Nếu vẫn cùng mục đích và trách nhiệm, giữ ID hiện tại; chỉ cập nhật rule, input/output, state và các phần liên quan.
3. Nếu bản chất hoặc trách nhiệm đã đổi thành một nghiệp vụ khác, AI đề xuất ID mới phù hợp hơn.
4. Human xác nhận việc đổi bản chất và ID.
5. AI tìm toàn bộ Feature, shared business, test, forward link, backlink và `INDEX.md` đang liên quan đến ID cũ.
6. Với từng nơi, quyết định chuyển sang ID mới, dùng nghiệp vụ khác hoặc xóa dependency.
7. Chỉ xóa nghiệp vụ và ID cũ sau khi không còn tham chiếu hiện hành nào.

Ví dụ vẫn giữ ID:

```text
BAL-RESERVE trước đây:
- amount phải lớn hơn 0
- trừ available và cộng reserved

BAL-RESERVE sau thay đổi:
- vẫn reserve balance
- bổ sung min amount và quy tắc rounding
```

Bản chất vẫn là reserve balance, nên giữ `BAL-RESERVE`.

Ví dụ nên cân nhắc ID mới:

```text
BAL-RESERVE:
- chuyển amount từ available sang reserved ngay lập tức

Nghiệp vụ mới:
- tạo hold có thời hạn
- cho phép gia hạn, capture một phần và tự hết hạn
- sở hữu vòng đời/state riêng
```

Đây không còn chỉ là sửa rule; nó trở thành một contract và vòng đời nghiệp vụ khác. AI có thể đề xuất `BAL-HOLD`, rồi phân tích toàn bộ nơi đang dùng `BAL-RESERVE`.

Điểm quan trọng nhất: **đổi ID không bao giờ thay thế impact analysis**. Đổi hay giữ ID thì tất cả nơi liên quan vẫn phải được xem xét và cập nhật trọn vẹn.

Quy tắc này đã có trong mục 2.3 và 7.3. Chưa cần sửa thêm nội dung ở điểm này.

## 2. Rà soát các quan hệ dependency hiện tại

Danh sách hiện tại gồm tám tên theo bốn cặp:

```text
CONTAINS / PART_OF
USES / USED_BY
READS_STATE / STATE_READ_BY
CHANGES_STATE / STATE_CHANGED_BY
```

Sau khi xem lại theo mục tiêu clean, clear và không lặp dữ liệu, mình kết luận: **không nên giữ nguyên cả tám tên**.

### `CONTAINS / PART_OF`: nên bỏ

Quan hệ này nói tài liệu hoặc đơn vị A chứa phần B.

Ví dụ:

```text
BALANCE CONTAINS BAL-RESERVE
BAL-RESERVE PART_OF BALANCE
```

Nhưng thông tin đó đã thể hiện sẵn bằng:

- `BAL-RESERVE` là heading nằm trong file `BALANCE.md`;
- `INDEX.md` đã liệt kê các chức năng chính của `BALANCE`;
- đường dẫn `BALANCE.md#bal-reserve` đã cho biết rõ mục nằm ở đâu.

Ghi thêm `CONTAINS` và `PART_OF` không giúp impact analysis đáng kể, nhưng tạo hai dòng quan hệ phải duy trì. Đây là dữ liệu trùng lặp có thể suy ra trực tiếp từ cấu trúc Markdown.

**Kết luận:** bỏ `CONTAINS / PART_OF`.

### Các tên quan hệ ngược: nên bỏ

`USED_BY`, `STATE_READ_BY` và `STATE_CHANGED_BY` không phải quan hệ mới. Chúng chỉ là cùng một dependency được nhìn từ phía ngược lại.

Ví dụ quan hệ thực tế là:

```text
F-PLACE-ORDER#ORD-RESERVE
    CHANGES_STATE
BALANCE#BAL-RESERVE
```

Trong file Feature, nó xuất hiện ở bảng `File này sử dụng`.

Trong `BALANCE.md`, nó xuất hiện ở bảng `Được sử dụng bởi`.

Hai bảng đã cho biết ta đang nhìn từ phía nào, nên không cần đổi tên relation thành `STATE_CHANGED_BY`. Việc duy trì hai tên cho một cạnh graph làm tăng số thuật ngữ và dễ gây sai.

Thực tế ví dụ hiện tại trong tài liệu đã bộc lộ vấn đề này: backlink của `BAL-RESERVE` đang ghi `USED_BY`, dù hành vi reserve thực chất là yêu cầu thay đổi state. Điều đó cho thấy hệ tên xuôi/ngược vừa khó nhớ vừa dễ bị dùng không nhất quán.

**Kết luận:** chỉ giữ tên quan hệ từ phía nơi gọi; backlink dùng lại cùng tên đó.

## 3. Ba quan hệ thực sự có giá trị

Mình đề xuất chỉ giữ:

| Quan hệ | Dùng khi nào? | Ví dụ |
|---|---|---|
| `USES` | Dùng rule, phép tính, validation hoặc kết quả nghiệp vụ nhưng không trực tiếp đọc/thay đổi state do bên kia sở hữu | Feature đặt lệnh dùng `FEE-CALCULATE` để tính phí |
| `READS_STATE` | Đọc state do nghiệp vụ khác sở hữu và không yêu cầu thay đổi nó | View Balance đọc `BAL-AVAILABLE` |
| `CHANGES_STATE` | Yêu cầu nghiệp vụ khác thay đổi state mà nó sở hữu | Place Order gọi `BAL-RESERVE` để thay đổi available/reserved balance |

Ba loại này tạo thông tin có ích cho impact analysis:

- sửa công thức hoặc rule: xem các caller `USES`;
- sửa ý nghĩa hoặc cách cung cấp state: xem các caller `READS_STATE`;
- sửa invariant hoặc quy tắc thay đổi state: xem các caller `CHANGES_STATE`.

Nếu chỉ giữ một quan hệ chung như `USES`, tài liệu sẽ đơn giản hơn một chút nhưng khi impact analysis, AI lại phải đọc nội dung từng link để biết nơi nào chỉ đọc và nơi nào làm thay đổi state. Với mục tiêu xác định state ownership và ảnh hưởng thay đổi, giữ ba loại trên là hợp lý.

## 4. Làm sao tránh `USES` trùng với hai loại còn lại?

Phải đặt quy tắc các loại này **loại trừ nhau trên cùng một hành động**:

1. Nếu hành động yêu cầu thay đổi state của dependency: ghi `CHANGES_STATE`.
2. Nếu hành động chỉ đọc state: ghi `READS_STATE`.
3. Nếu không đọc hoặc thay đổi state mà chỉ dùng rule, calculation, validation hoặc contract khác: ghi `USES`.
4. Không ghi thêm `USES` bên cạnh `READS_STATE` hoặc `CHANGES_STATE` cho cùng một hành động.

Ví dụ:

| Từ mục | Quan hệ | Đến mục | Mục đích |
|---|---|---|---|
| `ORD-CALCULATE-FEE` | `USES` | `FEE-CALCULATE` | Tính phí dự kiến |
| `ORD-CHECK-BALANCE` | `READS_STATE` | `BAL-AVAILABLE` | Kiểm tra available balance |
| `ORD-RESERVE-BALANCE` | `CHANGES_STATE` | `BAL-RESERVE` | Giữ tiền cho lệnh |

Không ghi thêm:

```text
ORD-RESERVE-BALANCE USES BAL-RESERVE
```

vì `CHANGES_STATE` đã mô tả dependency đó chính xác hơn.

Nếu trong một Feature có hai bước riêng biệt, một bước đọc và một bước thay đổi cùng một state, có thể có hai relation vì đó là hai hành động khác nhau:

```text
ORD-CHECK-BALANCE READS_STATE BAL-AVAILABLE
ORD-RESERVE-BALANCE CHANGES_STATE BAL-RESERVE
```

## 5. Backlink sẽ ghi thế nào khi bỏ các tên quan hệ ngược?

### Trong Feature — `File này sử dụng`

```markdown
| Từ mục | Quan hệ | Đến mục | Mục đích |
|---|---|---|---|
| `ORD-RESERVE-BALANCE` | `CHANGES_STATE` | `BALANCE#BAL-RESERVE` | Giữ số dư cho lệnh |
```

### Trong `BALANCE.md` — `Được sử dụng bởi`

```markdown
| Nơi gọi | Quan hệ của nơi gọi | Phạm vi trong file này | Mục đích |
|---|---|---|---|
| `F-PLACE-ORDER#ORD-RESERVE-BALANCE` | `CHANGES_STATE` | `BAL-RESERVE` | Giữ số dư cho lệnh |
```

Cả hai nơi đều dùng `CHANGES_STATE`. Tên bảng và tên cột đã làm rõ chiều nhìn, không cần phát minh thêm `STATE_CHANGED_BY`.

## 6. Mô hình rút gọn được khuyến nghị

```text
Bỏ:
- CONTAINS
- PART_OF
- USED_BY
- STATE_READ_BY
- STATE_CHANGED_BY
- NEXT
- PREVIOUS

Giữ:
- USES
- READS_STATE
- CHANGES_STATE

Flow:
- thể hiện bằng bảng flow
- Mermaid là góc nhìn trực quan khi cần
```

Kết quả là từ mười tên relation ban đầu, ta chỉ còn ba loại dependency có ý nghĩa thực tế. Cấu trúc file thể hiện quan hệ chứa; bảng flow thể hiện thứ tự; tên bảng forward/backlink thể hiện chiều quan hệ.

Đây là phương án mình khuyến nghị vì ít thuật ngữ hơn, không mất thông tin quan trọng và vẫn đủ cho impact analysis.

Lượt này mình chưa sửa phần quan hệ trong tài liệu để bạn xem và xác nhận mô hình rút gọn này trước. `answer.md` đã được cập nhật, commit và push lên `origin/master`.
