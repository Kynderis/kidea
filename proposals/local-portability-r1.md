# LP-01 — Kidea local, đa nền tảng và backend Docker

Ngày 2026-09-16. **Hướng và quyền triển khai đã được Human duyệt; kết quả chưa nghiệm thu.** Căn cứ: Human đồng ý đề xuất sau [answer f8b47b9](https://github.com/Kynderis/kidea/blob/f8b47b9/answer.md), xác định chỉ cần thư mục local, không có nhu cầu mạng/iCloud/OneDrive/nhiều máy cùng ghi, và yêu cầu rà kỹ/làm trọn vẹn. [Roadmap](../KIDEA_ROADMAP.md#review-current) là nguồn trạng thái duy nhất; tài liệu này ghi phạm vi và cách kiểm, không là phase sản phẩm hoặc tracker mới.

## Kết quả phải đạt

Kidea dùng cùng source, lệnh và hồ sơ trên Windows, macOS Intel và Apple Silicon; không bắt người dùng dùng đúng một binary Node hoặc một đường Git Windows. Giữ mô hình một writer local, quyền ghi đúng đích, bản trước/đọc lại, CREATE-no-overwrite, pending, approval đúng byte và các gate đã duyệt. Không xây sync, khóa phân tán, framework remote hoặc tách ba bản Kidea.

Nguồn yêu cầu có hiệu lực: [hợp đồng local/Node/Git](../KIDEA_DESIGN.md#local-portability-approved), [writer hợp tác](../KIDEA_DESIGN.md#lean-operation-approved), [Docker local/cloud](../KIDEA_DESIGN.md#docker-local-cloud), [KA-10/12/23/29/30](../KIDEA_ACCEPTANCE.md). Các kết quả R02 Windows và R03/R04 vẫn đúng bản/phạm vi lịch sử; không biến chúng thành PASS cho helper mới hoặc Mac.

| Lát cắt | Thay đổi hữu hạn | Bằng chứng cần có |
|---|---|---|
| Runtime và công cụ | Node ≥24, khuyến nghị LTS được bảo trì; bỏ exact patch/binary hash khi chạy. Git theo host, không shell-built command hoặc đường Windows bắt buộc. | Runtime thấp/sai/thiếu điều kiện bị báo rõ; patch/CPU khác không bị khóa vô cớ. Ghi Node/OS/CPU/Git thực; thiếu Git không gây ghi dở hoặc success giả. Không hứa mọi Node tương lai đã được kiểm. |
| Root và file local | Bỏ khóa Windows/NTFS theo nhãn, giữ kiểm root/đích, tên nhập nhằng, links/hard links, quyền và một lượt hợp tác. Mạng/đồng bộ ngoài phạm vi. | Unicode/khoảng trắng/hoa–thường/CRLF-LF; liên kết/thoát root; CREATE trùng; lỗi I/O/pending/bản trước. Chặn root không đủ căn cứ; nhận diện path không là phát hiện mọi sync/mount tùy ý. |
| Caller và bằng chứng | Init/status/approve/resume cùng hợp đồng; đổi test/runner đang cố định Node/Git/Windows để dùng runtime hiện hành. | Hồi quy công khai, lỗi/gián đoạn/snapshot/Git; raw fail và giới hạn giữ lại. Change/visualize vẫn chưa hỗ trợ, không thêm public action/schema. |
| Phương án backend | Docker local Ubuntu userspace, SQLite volume; cloud SSH/Docker khi Human cấp máy/gói quyền. | Hồ sơ không còn yêu cầu Ubuntu VM riêng; không lấy container cùng laptop thay backup/observer độc lập, không lấy emulation/local thay benchmark máy đích. Lượt này chỉ rà/sửa hồ sơ môi trường, chưa chạy app. |
| Hồ sơ/hướng dẫn | Đồng bộ DESIGN/ACCEPTANCE/ROADMAP/R05 và hướng dẫn sử dụng helper, amendment pilot đúng phần môi trường khi cần. | Truy được approval sau f8b47b9; giữ nghiệp vụ/ngưỡng R03–R04, link hợp lệ, bản trước/sau và kết quả theo đúng nguồn. |

## Quyền và giới hạn lượt triển khai

Được sửa mã helper Kidea, tests/runner liên quan, package metadata, hướng dẫn và tài liệu hiện hành trong repo này; dùng công cụ đã có kiểm trên fixture tổng hợp local và lưu evidence mới. Không sửa evidence lịch sử để biến FAIL thành PASS. Pilot chỉ điều chỉnh hồ sơ phương án host/build bị ảnh hưởng, bảo toàn nghiệp vụ/ngưỡng và bản trước/sau; không tạo source/config ứng dụng hoặc tự thực hiện gói profile R05 chưa duyệt.

Không cài Node/Git/Docker/SDK/Xcode, không đổi PATH/ACL/firewall hoặc dựng VM. Không chạy Docker/build ứng dụng/benchmark/SSH/cloud, không mua/thuê hoặc dùng dữ liệu thật. Không di chuyển project sang Mac hoặc thư mục khác; không dọn ổ C, cache, backup hoặc fixture cũ. Không tự cấp quyền remote bằng việc ghi Docker/cloud vào thiết kế. Commit/push repo theo quyền hiện hành, không publish/cài skill máy khác hoặc push pilot.

## Phân biệt hoàn tất mã và kiểm trên máy thật

- Chạy hồi quy phù hợp trên Windows hiện có, lưu runtime/source/đầu vào và kết quả; ca mô phỏng nhánh OS chỉ chứng minh logic nhánh đó.
- Mac Intel và Apple Silicon chưa kết nối/chạy thì ghi **NOT_RUN**. Cần cùng suite trên filesystem/máy thật trước công bố đã xác nhận runtime Mac; lỗi thực phải sửa/kiểm lại, không chỉ bỏ guard Windows để gọi là hỗ trợ hoàn chỉnh.
- Docker local, mẫu build R05, cloud tải/hiệu năng, iOS và restore/observer thực chưa chạy trong gói này. Không chốt R05 hoặc thay nghĩa vụ R08/R09/R10 bằng hồ sơ/fixture.
- Nếu phát hiện yêu cầu ngoài phạm vi hoặc phải cài/đụng máy/chi phí mới, gom đúng phần cần Human chốt. Việc sửa/kiểm thường lệ trong gói này tiếp tục liền mạch, không xin lại từng file/lệnh.

## Việc tiếp theo sau gói này

Đã có [bộ lệnh kiểm chung](../tests/local-portability/README.md) và [kết quả Windows/tài liệu](../tests/evidence/local-portability-r1.md). Mã/tài liệu đã triển khai; phần còn lại là chạy cùng bộ trên Mac Intel/Apple Silicon thật khi có máy/kết nối, không phải xin duyệt lại cách triển khai. Chưa nhận NOT_RUN thành PASS hoặc tự hoàn tất LP-01. R05 tiếp tục từ [gói profile/test](r05-profile-test-r1.md), không cần chọn lại Docker local hay giải bài toán đồng bộ. Khi cần build/đo nặng mới trình một gói môi trường hữu hạn; không xây hạ tầng chưa có nhu cầu.
