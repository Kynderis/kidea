# R08 — project Google Cloud được Human cung cấp

2026-09-17. Human cung cấp project `kidea-508908`, nói tài khoản đã đăng nhập gcloud và có300USD credit; cho phép tự tạo VM theo nhu cầu kiểm Kidea, test rồi tắt/xóa khi hết cần. Quyền này thay lựa chọn trước đó “chỉ Docker local vì chưa có server”. Không xin lại quyền cloud cho từng lệnh thông thường trong phạm vi đó. Không coi300USD là lệnh tiêu hết, ngân sách vô hạn hoặc quyền sửa/xóa tài nguyên không thuộc lab.

## Kiểm thực tại lượt này

- gcloud578.0.0 có tài khoản active; project ACTIVE, billingEnabled=true, Compute Engine API enabled.
- testIamPermissions trả đủ16quyền được hỏi: create/delete/start/stop/get instance, metadata, create/delete disk/firewall, create network, subnet use/externalIP, zone operation get, IAP tunnel và enable service. Đây là bằng chứng IAM, chưa bảo đảm tạo VM vượt mọi org policy/capacity/quota.
- List instance trả rỗng. us-central1 UP, CPU quota32/usage0,instance quota8/usage0. IAP API chưa thấy trong danh sách enabled được lọc; chưa bật dịch vụ hoặc tạo tài nguyên trong lượt kiểm.
- [Kết quả chỉ đọc](../tests/evidence/r08/gcp-access-r1/read-only.json). Không ghi token, email đăng nhập hoặc billing-account ID vào repo.
- Credit300USD và ngày hết hạn là thông tin Human cung cấp, chưa xác minh số dư thực. Billing enabled không chứng minh credit còn đủ. Nếu là Free Trial chuẩn, Google mô tả300USD/90ngày; phải dùng thời hạn thực của tài khoản, không suy từ ngày kiểm.

## Cách áp dụng cho Kidea

Backend build/test local tiếp tục khi phù hợp. Cloud dùng cho phần cần máy đích/host độc lập: workload VM và observer/backup tách khỏi máy Mac, có thể tách VM/zone theo ca lỗi. Linux cloud không thay bằng chứng Mac Apple Silicon. R08-TIDY-01 sau đó đã được Human duyệt riêng và [B1 đã PASS](../tests/evidence/r08/product-build-execution-r1.md); ngoại lệ đã dùng xong, cloud grant không mở lượt build khác bằng ngoại lệ đó.

Chọn CPU VM nhỏ, không GPU/commitment/dịch vụ đắt nếu không cần; cố định region/image/workload/duration và ước tính gồm CPU/RAM/disk/IP/egress trước provisioning. Mục tiêu kiểm soát nội bộ đợt đầu≤10USD, chỉ chọn cấu hình/thời gian có dự toán nằm trong đó; đây chưa là cloud budget đã cấu hình hoặc hard cap hóa đơn. Khi có nguy cơ vượt, dừng/mở lại phạm vi với Human. Không lấy300USD làm lý do chạy test vô hạn.

Trước tạo có manifest/script và cách thu hồi cụ thể; đặt nhãn/name sở hữu lab, thời hạn chạy phía cloud, giữ bằng chứng ra ngoài tài nguyên sắp xóa. Sau kiểm, xóa VM và disk/IP/snapshot/firewall lab không còn cần; đọc lại để xác nhận. Không chỉ stop rồi báo chi phí đã bằng0; không xóa tài nguyên cũ khác. Job/teardown cần được thiết kế không phụ thuộc việc phiên AI còn sống. Chưa tạo VM vì lượt này xác minh quyền và chuyển căn cứ môi trường; chưa có workload cloud được đóng gói để chạy.

## Nguồn về billing đã đối chiếu

- [Free Trial FAQs](https://cloud.google.com/signup-faqs): credit chuẩn300USD có hạn90ngày.
- [Compute pricing](https://cloud.google.com/products/compute/pricing): CPU/RAM tính theo sử dụng, disk/network là khoản riêng.
- [Stop instance](https://docs.cloud.google.com/compute/docs/reference/rest/v1/instances/stop): disk/staticIP vẫn có thể bị tính phí sau stop.
- [Budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets): alerts-only budget không tự chặn chi tiêu; không đồng nhất cảnh báo với hard cap.
