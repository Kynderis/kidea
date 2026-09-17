# Kế hoạch triển khai pilot theo lát cắt — R09/C

**PREPARED_FOR_REVIEW, chưa mở code/build/deploy.** Quyền hiện tại và provenance tại [handoff](kidea-handoff.md). Đây là kế hoạch đầu ra/kiểm chứng, không sổ trạng thái thứ hai; `.kidea/work.md` giữ cây việc duy nhất.137case nguồn vẫn NOT_RUN, số nhóm không là số biến thể PASS.

## Thứ tự và ranh giới

| Lát | Đầu ra dự kiến | Case/gate và phần còn dở |
|---|---|---|
| T02 backend nền | Source mới tách domain/auth/repository/API; SQLite transaction/result/outbox/audit; seed giả và hook chỉ lab; APIcontract/testvectors | P01–P08,R01–R08,I01–I10,C01–C05,D01–D09;TC01–06,08,09,18; kiểm mọi biến thể/thứ tự, chưa Web/admin hoàn chỉnh |
| T03 Web đầu tiên | W0intro,W1list,W2detail,W3myregistrations; SSR/private/no-store, requestidentity/UNKNOWN/mergegeneration | TC03,06,07,09,19,20;UX/SEO HTML JSoff/keyboard/360–1280/200%; chưa admin/ops đầy đủ |
| T04 thêm Feature giữa MVP | Impact max2ACTIVE đã duyệt; quay bước1/chungcây, disposition từng việc cũ, không mất phần dở | Thứ tự duplicate/max2/full, atomic2yêu cầu ởworkshopkhác, retry/hủy/dữliệu>2; consumer khôngdiff phảiđánhgiá; G2toànbản cuối |
| T05 hoàn thiện MVP | W4admin,W5ops; intentK3/dirtyfieldK4; outbox/socket/heartbeat/observer/backup wiring | E01–E10,AD-T01–15,OP-T01–15,AR-T01–22,QT01–16/TC01–20 đúngmôi trường; không dùng vài ca unit thay tíchhợp |
| T08 release lab | Bundlebackend/Web/config/schema/scripts; mỗiattempt riêng, readbackthực, compatibility/rollback/restore táchbiệt | TC10–16; AI DEV, Human chạy scriptvaiPROD lab; readiness/SEO và G2; chưa quyền chạy hiện tại |
| T09 thay đổi sau release | Cho hủyPAUSED đúngpolicyD; cập nhậtnghiệpvụ→UI/admintext→test→configconsumer | Impact bảnchạy khácbảnlàmviệc; no-diffconsumer; giữ lịch sử/UNKNOWN/gate, khôngdeploylén |
| T10 hotfix | Baseline releasepinned, táihiện vượtchỗ, hai patch/bảnkết hợp; không mang Featurechưa chọn | RoundBUGFIX riêng, MVPdở giữreturnpoint; mọi candidateG2/approval/release/readback |
| T11–T13 xuyên suốt | Reject/gópý/saiowner/bảncũ/thiếuquyền; ngắtwriter/ngoạitác; Git/handoff đầyđủ | Publichelperonly; UNKNOWNchặn; quyền mới khi phục hồi; không đóngvaiHumanthật hoặc thêm AItrial |
| T14 tổng hợp | Review toànnguồn,G2,giới hạn,nghiệmthuR09 | Viewpilotđanghoãn chưaPASS; xửlýgatephạmvi vớiHuman trướckhép; R10 riêng |

## Gói T02 cần materialize trước xin chạy

Phạm vi code đề xuất: `backend/CMakeLists.txt`, `backend/CMakePresets.json`, `backend/src/`, `backend/tests/`, `contracts/`, `tests/`, `scripts/`, `containers/`, release/test manifests. Không sao chép nguyên sample thành ứng dụng đã xong. Chọn từ đầu rule/invariant/expected trong [business/tests](business/tests.md#coverage) và [engineering/tests](engineering/tests.md#protocol), giữ mối liên hệ tới137ID; ghi từng variant vào report, không gộp hàng tham số hóa thành một PASS.

T02 có thể bắt đầu code domain/transaction và testfixture sau gói code được duyệt, nhưng build Ubuntu cần manifest source/toolchain/image đầy đủ trước chạy. Tái dùng cache bất biến chỉ sau kiểmhash/source/license/profile; waiverR05/R08 đã hết, không sao chép exception cũ. Không tải dependency ngầm. Chuẩn bị rule/lint/sanitizer policy và toàn bộ commandG2 trước nhận từng lát đủgate.

| Mục manifest | Giá trị/điều kiện hiện có | Trạng thái hiện tại |
|---|---|---|
| root/Git | Siblinglocal,master; khôngremote; docs23file+.gitignore, sauđópublicmetadata | Được C cho phép; commit thực ghi trong evidenceKidea |
| source | Newbackend/Web chưa tồn tại; sourcehash/commit chỉ ghi sau authoring | NOT_READY; không đặt hash mẫu thay |
| target | Chức năngUbuntuDockerlocal nativeamd64 trên MacIntel; khôngportpublic/trustinstall | Phương án được duyệt; image/config/command cụ thể chưa chạy |
| toolchain | Dẫn R05/R08 artifactmanifest bất biến, kiểm lại phù hợp source mới | Chưa chọn lại image/digest/library graph cho workshop |
| dữ liệu | Giả U/V/A/G,3workshopC10; C1 cho race; khôngPII/secretthật | Seed cần triển khai/test, không dùng DBsample làm tiến độ |
| lệnh backend dự kiến | `cmake --preset dev`, `cmake --build --preset dev`, `ctest --preset dev --output-on-failure`; riêngasan-ubsan,tsan,release | Preset chưa tồn tại; đây là hợp đồng lệnh cần tạo, không command đã chạy |
| lệnh Web dự kiến | `npm ci`, `npm run check`, `npm run lint`, `npm run test:unit`, `npm run test:browser`, `npm run build` | Chưa package/lock/script mới; không chạy trong C |
| toàn dự án | Một entrypointG2 chạy tất cả nghĩa vụ hiện hành trên cùngsource/config/toolchain, giữFAIL/skip/missing | Cần triển khai khi có code; không lấy coreKidea thay |
| tài nguyên/quota | Dữliệu/log/backup2GiB,báo80%; toolchain/artifact tách; workload/deadline/tảithêm hữu hạn | Chưa workload/buildmanifest thì không ước lượng giả hoặc resetquotaR08 |
| môi trường WQ/E1 | Backend/load/observer/backup đúng miền lỗi,RTT≤50ms/bandwidth≥10Mbit/s,clock đo thực;3lượt | NOT_READY; GCPgrant có sẵn nhưng cầnmanifest mới, chưaVM/workload |
| cleanup | Chỉ dừng/xóa đúng runtimefixture/máy mới do manifestchọn; giữsource/evidence/lịch sử/samples/cache | Danh sách cụ thể theo runID; khôngprune hoặc dọn sample |

Trước xin chạy, AI phải cung cấp exact sourcecommit/hash,command có thật,image/config/target,CPU/RAM/đĩa/tải/thời hạn và readback/điều kiện dừng. Không yêu cầu Human duyệt các placeholder này. Khi source/package cụ thể đã chuẩn bị, gộp quyền còn thiếu vào một gói review.

## Hợp đồng kiểm và bằng chứng

Đọc đủ cả21docs và137case trước cụ thể hóa; runreport giữcaseID/variant/platform/runID,sourceanchor/hash,profile,seed,input/thứtự,oracle,command,target/artifact/config,stdout/stderr,dữliệutrước/sau và giới hạn. P/R/I/C/D/E/T/QT/UX/OP/AD/AR giữ sourceexpected. TC là cách kiểm, không thay oracle.

Backend xác nhận từ DB/result/outbox trong quyền read-only của fixture; client kiểmrender riêng. Kiểm cả trước/saucommit và trước/sauresponse, hồi sinhACTIVE, actor/epoch khác, sameversionkháccontent, consumerkhôngdiff,giới hạnbody/queue,tokenleak/privateSSR. Sanitizer không thay semanticrace; exit0 không thay runningartifact/config/schema/target. Tất cả failure/timeout/missed-offer giữ trong denominator theo Q, khôngnớitimeout/ngưỡng.

Các bước mới chỉ DONE khi có đủ đầu ra và approval hiện hành đúngowner/version/conditions. NhữngapprovalR03–R05 có thể được kế thừa bằng đối chiếu nguồn/gói cụ thể; publicinit khôngtựimport. Build/lab samplecũ không làm137case ứng dụng PASS. Không mở native/Safari/viewpilotđãhoãn bằng kế hoạch này; ma trậnbrowser ứng dụng phảichốt theo nguồnproject khi chuẩn bị chạyWeb.
