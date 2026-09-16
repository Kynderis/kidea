# LP-01 — Kiểm lõi trên Mac Intel ngày 2026-09-16

**283/283 PASS trên máy Mac Intel thật**, không fail/skip/cancelled/todo. Một lượt đầy đủ duy nhất, `exitCode: 0`, `inputsUnchanged: true`. Không phát hiện lỗi portability trong lượt này; không sửa helper, test hoặc expectation. Đây là kết quả bộ lõi LP-01, không phải nghiệm thu toàn Kidea/R05, Apple Silicon hoặc ứng dụng pilot. [Roadmap](../../KIDEA_ROADMAP.md#review-current) giữ trạng thái và điểm tiếp tục.

## Checkout và môi trường thực

- Repo `git@github.com:Kynderis/kidea.git`, nhánh `master`, HEAD bắt đầu và khi chạy test: `b1f8890c53832ec7d20dbe3b9c66248c962d78f9`; remote `master` khớp. Có chứa mốc triển khai `1e5b09f6c506076fdddcb914563bbce139c0dc6f`; ba commit sau đó chỉ sửa bàn giao/answer. Working tree sạch lúc bắt đầu. Không tìm thấy AGENTS.md áp dụng; không tạo file này.
- Root và realpath đều `/Users/kendrick/Desktop/kidea`, volume APFS nội bộ trên SSD PCI-Express, không read-only; còn khoảng **383 GiB** lúc preflight. Root không là symlink. Cài đặt iCloud Desktop/Documents đều `0`; không thấy các tiến trình sync phổ biến trong phép kiểm. Đây không phải khả năng phát hiện mọi phần mềm sync tùy ý; giữ điều kiện vận hành một writer local, không sync.
- MacBookPro16,1 (MacBook Pro 2019), Intel Core i7-9750H, RAM 16 GiB; macOS **14.7 (23H124)**, Darwin **23.6.0**, tiến trình **darwin/x64**.
- Tài khoản `kendrick`, UID **501**, không sudo/root. Phép thử tạo file/thư mục/hard link/symlink thư mục đều đạt.
- Node mặc định trên PATH: **22.22.2**, không đủ minimum Kidea. Đã dùng **Node 24.19.0 LTS Krypton x64 có sẵn** trong runtime Codex qua đường tuyệt đối. npm **12.0.2** có sẵn, chạy CLI của npm bằng chính Node 24 đó. Git **2.54.0**, hỗ trợ `--no-optional-locks --no-lazy-fetch`, executable ngoài project. Không cài công cụ hệ thống hoặc đổi PATH/cấu hình máy.

[Environment raw](local-portability/mac-intel-2026-09-16/environment.json) giữ command/args/exit/stdout/stderr, runtime/binary hashes, quyền và 36 hash nguồn trước khi chuẩn bị dependency. [Preflight source](local-portability/mac-intel-2026-09-16/preflight.mjs) là bản ghi thủ tục của lượt này, không là installer hoặc collector dùng chung.

## Lệnh và kết quả

Chạy từ `/Users/kendrick/Desktop/kidea` bằng runtime đã xác minh:

```sh
KIDEA_NODE='/Users/kendrick/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
"$KIDEA_NODE" /usr/local/lib/node_modules/npm/bin/npm-cli.js ci
"$KIDEA_NODE" tests/r02-t07/run-tests.mjs
```

Đây là `npm ci` và bộ lệnh kiểm chuẩn với Node 24 đã có, không sửa hợp đồng để khóa vào đường dẫn này. Phiên sau phải kiểm lại executable/version; lệnh `node` mặc định trên máy chưa được đổi sang Node 24.

| Lượt | Kết quả thực | Bằng chứng giữ nguyên byte |
|---|---|---|
| Dependency theo lockfile | Exit 0; 1 package được cài; lockfile SHA trước/sau bằng nhau; stderr rỗng | [Summary](local-portability/mac-intel-2026-09-16/npm-ci-summary.json), [stdout](local-portability/mac-intel-2026-09-16/npm-ci-stdout.txt), [stderr](local-portability/mac-intel-2026-09-16/npm-ci-stderr.txt) |
| Hồi quy đầy đủ lúc 08:31:28 +07 | 283 PASS; 0 fail/cancelled/skipped/todo; khoảng 118 giây | [Summary](local-portability/mac-intel-2026-09-16/run-1-final/summary.json), [stdout](local-portability/mac-intel-2026-09-16/run-1-final/stdout.txt), [stderr](local-portability/mac-intel-2026-09-16/run-1-final/stderr.txt), [before](local-portability/mac-intel-2026-09-16/run-1-final/before.json) |

Không có lượt hồi quy Mac FAIL hoặc chạy lại trong phiên này; không tạo log FAIL giả. Node 22 được phát hiện bằng kiểm version trước khi cài dependency/chạy suite, không phải một lượt test thất bại. Toàn bộ log của lượt đã chạy được giữ, kể cả stderr rỗng. Những FAIL Windows cũ vẫn ở [báo cáo Windows](local-portability-r1.md), không ghi đè hoặc đổi diễn giải.

[Biên nhận thu thập](local-portability/mac-intel-2026-09-16/collection.json) xác nhận hash của từng bản sao raw, manifest trước/sau khớp và **36/36 file nguồn/test/dependency metadata giống hệt lượt Windows Node 24.19.0**. Lượt Windows 24.21.0 cũng dùng cùng manifest theo biên nhận Windows hiện hữu. Không chỉ suy từ cùng commit. Các file trong manifest vẫn khớp nguồn khi thu thập; phần cập nhật sau test chỉ là tài liệu trạng thái/answer và evidence mới, không đổi đầu vào suite. Không có thay đổi runtime cần hồi quy Windows mới trong phiên này.

Kiểm hậu kỳ riêng xác nhận **267 file evidence lịch sử không đổi**, hash raw/nguồn và liên kết tài liệu đạt. [Lượt hậu kỳ đầu bị lỗi](local-portability/mac-intel-2026-09-16/verification-initial-failure.json) vì buffer mặc định của script kiểm tạm không chứa được một blob Git lịch sử 3,3 MB; đã tăng buffer lên 16 MiB, giữ mọi file/assertion và [kiểm lại đạt](local-portability/mac-intel-2026-09-16/verification.json). Đây không phải lỗi hoặc lượt chạy lại bộ lõi. Lỗi đầu chỉ có bản ghi từ output công cụ, không có stdout/stderr riêng; không dựng lại raw. Bổ sung chú giải này được kiểm tài liệu lần cuối trước commit.

## Giới hạn và điểm tiếp tục

- **Mac Intel:** bộ lõi đạt trên đúng OS/Node/Git/filesystem và nguồn nêu trên; không ngoại suy mọi bản runtime hoặc cấu hình filesystem khác.
- **Apple Silicon:** NOT_RUN, cần máy/quyền và cùng bộ kiểm đầy đủ trước công bố đạt. LP-01 vẫn IN_PROGRESS.
- **R05:** T01-S02 vẫn IN_REVIEW; D1–D6/P1–P4 chưa được duyệt toàn bộ. Bước phát triển kế tiếp theo [gói R05](../../proposals/r05-profile-test-r1.md) chỉ bắt đầu sau đúng gate.
- Không chạy Docker, Xcode/SDK/VM, build/deploy, cloud, tải/performance, AI/benchmark lịch sử hoặc kiểm hồ sơ pilot. Không cần khôi phục sibling pilot để chạy suite này. Kết quả tài liệu R03/R04/826 link của Windows vẫn là lịch sử, không phải lượt kiểm Mac mới.
- Evidence mới chỉ nằm ở `tests/evidence/local-portability/mac-intel-2026-09-16/`; fixture và đầu ra gốc vẫn dưới `.test-output`, không commit toàn thư mục đó. Không hỗ trợ mạng/iCloud/OneDrive/multi-writer và không chuyển chúng thành backlog.
