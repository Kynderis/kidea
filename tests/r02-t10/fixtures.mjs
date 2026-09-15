// Synthetic, pure fixture construction. These records are not real approvals.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';

export const workloads=Object.freeze([
  {id:'QF-S-R02',tasks:100,documents:30,minMarkdown:30,minBytes:1024**2,minRelations:300},
  {id:'QF-M-R02',tasks:1000,documents:300,minMarkdown:300,minBytes:10*1024**2,minRelations:3000},
]);
export const hash=b=>createHash('sha256').update(b).digest('hex');
const ref=(path,anchor=null)=>({path,anchor});
const pad=n=>String(n).padStart(4,'0');
const envelope=r=>Buffer.from('# DỮ LIỆU TỔNG HỢP — không phải tiến độ hoặc approval thật\n\n<!-- kidea:data:start -->\n```json\n'+JSON.stringify(r,null,2)+'\n```\n<!-- kidea:data:end -->\n');
const integrity=b=>({method:'SHA256',value:hash(b),byteLength:b.length});

// Each table row is a distinct boundary or state combination with a computed
// expected result. No unreferenced padding file or repeated dummy paragraph.
function venueDocument(n) {
  const capacity=8+n%9,price=120000+(n%17)*10000,cutoff=2+n%5,fee=10000+n%4*5000;
  let s=`# Đặc tả sân ${pad(n)} — dữ liệu giả\n<a id="scope"></a>\nSân này có ${capacity} suất mỗi khung giờ; giá mỗi suất ${price} VND. Chủ đăng ký được hủy trước giờ bắt đầu ít nhất ${cutoff} giờ, phí hủy ${fee} VND. Quản trị viên không được dùng quyền quản lý để hủy thay chủ. Thời gian biểu diễn bằng giờ UTC, không suy từ đồng hồ của trình duyệt.\n\n<a id="acceptance"></a>\nMỗi tình huống dưới đây là ca độc lập, bắt đầu lại từ trạng thái Given. Kết quả nêu cả điều được phép và bất biến cần giữ. Đối chiếu cùng ID sân và khung giờ; không lấy kết quả của sân khác làm bằng chứng. Các số là đặc tả fixture, không phải SLA của Kidea.\n`;
  for(let k=0;k<15;k++) {
    const hour=8+k,occupied=k%capacity,requested=1+k%8,remaining=capacity-occupied;
    s+=`\n## CAP-${pad(n)}-${k}\n<a id="cap-${k}"></a>\nGiven sân ${pad(n)}, ngày 2026-10-${String(1+k).padStart(2,'0')}, khung ${hour}:00 UTC có ${occupied}/${capacity} suất đã giữ. When khách mới xin ${requested} suất trong cùng khung. Then ${requested<=remaining?'chấp nhận':'từ chối toàn bộ yêu cầu'}, số suất đã giữ sau xử lý là ${requested<=remaining?occupied+requested:occupied}. Không tách một yêu cầu thành thành công một phần; khung kế tiếp không đổi. Kiểm tra kết quả trả về, số dư chỗ và bản ghi giao dịch cùng ID.\n`;
    const delta=k-3,paid=(1+k%4)*price,allowed=delta>=cutoff,refund=allowed?paid-fee:0;
    s+=`\n## CANCEL-${pad(n)}-${k}\nGiven chủ đã thanh toán ${paid} VND cho lịch sân ${pad(n)}, còn ${delta} giờ tới giờ bắt đầu và chưa có yêu cầu hủy trước đó. When chính chủ yêu cầu hủy. Then ${allowed?'ghi nhận hủy và trả':'không hủy; số tiền hoàn là'} ${refund} VND, phí áp dụng ${allowed?fee:0} VND. Mốc đúng ${cutoff} giờ được phép, thấp hơn thì không. Không thay đổi tiền đã ghi nhận khi bị từ chối; xác minh lịch và sổ tiền cùng kết quả, không chỉ thông báo màn hình.\n`;
    const role=['chủ đăng ký','khách khác','quản trị viên'][k%3],permitted=k%3===0;
    s+=`\n## AUTH-${pad(n)}-${k}\nGiven đơn R-${n}-${k} còn ${cutoff+1+k} giờ trước lịch và người gửi là ${role}, có phiên đăng nhập hợp lệ nhưng không có ủy quyền riêng. When yêu cầu hủy gửi tới API cho sân ${pad(n)}. Then ${permitted?'chấp nhận quyền của chủ':'từ chối vì không sở hữu đơn'}, không tăng quyền từ trường role do client gửi. Ghi log quyết định theo người thực hiện; không tiết lộ thông tin thanh toán của chủ cho người bị từ chối. Đối chiếu quyền và trạng thái đơn trước/sau.\n`;
    const start=hour*60,end=start+60,otherStart=start-30+k*10,overlap=otherStart<end&&otherStart+30>start;
    s+=`\n## TIME-${pad(n)}-${k}\nGiven một tài nguyên đã có lịch [${start},${end}) phút UTC trong ngày và yêu cầu mới dài 30 phút bắt đầu ở phút ${otherStart}. When kiểm tra giao nhau tại sân ${pad(n)}. Then kết quả ${overlap?'trùng lịch, không ghi yêu cầu mới':'không trùng lịch, có thể xét tiếp điều kiện chỗ và quyền'}. Khoảng thời gian nửa mở cho phép lịch bắt đầu đúng lúc lịch cũ kết thúc. Không dùng việc không trùng để tự bỏ bước thanh toán hoặc điều kiện chủ thể; so cả hai mốc, không chỉ thời điểm bắt đầu.\n`;
    const quantity=1+k%5,discount=k%4*5,total=quantity*price*(100-discount)/100;
    s+=`\n## MONEY-${pad(n)}-${k}\nGiven khách chọn ${quantity} suất, giá ${price} VND/suất, mã giảm ${discount}% đã xác minh và không có phụ phí khác. When tính số tiền cho sân ${pad(n)}. Then tổng là ${total} VND; lưu giá đơn vị, số lượng, mức giảm và số cuối trong cùng phiên bản đơn. Không đọc lại bảng giá mới để viết ngược đơn cũ; thiếu xác minh mã giảm thì dừng xác nhận, không tự giảm. Tính bằng số nguyên VND và đối chiếu số tiền gửi sang thanh toán với hồ sơ.\n`;
    const samePayload=k%2===0,key=`KEY-${n}-${k}`,prior=price*(1+k%3);
    s+=`\n## REPLAY-${pad(n)}-${k}\nGiven khóa ${key} đã ghi giao dịch ${prior} VND thành công tại sân ${pad(n)}. When client gửi lại khóa đó với ${samePayload?'cùng nội dung yêu cầu':'số tiền mới '+(prior+10000)+' VND'}. Then ${samePayload?'trả lại kết quả đã lưu, không tạo giao dịch mới':'báo xung đột nội dung, không ghi thêm giao dịch'}. Bằng chứng cần có số giao dịch trước/sau vẫn là một và số tiền gốc giữ ${prior} VND. Nếu chưa biết kết quả lần đầu thì báo chưa xác nhận, không đoán thành công từ kế hoạch hoặc chạy lại mù.\n`;
  }
  return Buffer.from(s);
}

export function buildFixture(config) {
  assert.ok(workloads.some(w=>JSON.stringify(w)===JSON.stringify(config)),'Unapproved workload');
  const files=new Map(),records=new Map(),projectId=`synthetic-${config.id.toLowerCase()}`;
  const header=kind=>({schemaVersion:2,projectId,kind});
  const put=(p,b)=>{assert.ok(!files.has(p));files.set(p,Buffer.isBuffer(b)?b:Buffer.from(b));};
  const record=(p,r)=>{records.set(p,r);put(p,envelope(r));};
  const snapshot=(source,p,bytes=files.get(source))=>{put(p,bytes);return {source:ref(source),location:{kind:'SNAPSHOT',ref:ref(p)},integrity:integrity(bytes)};};
  const documents=Array.from({length:config.documents},(_,i)=>`docs/yeu-cau/san-${pad(i+1)}.md`);
  documents.forEach((p,i)=>put(p,venueDocument(i+1)));
  put('docs/quy-tắc.md','# Quy tắc fixture\nMỗi sân có phạm vi riêng trong đặc tả. Không đưa dữ liệu giả thành Human approval hoặc kết quả sản phẩm thật. Chỉ đọc status trong phép đo này, không thực hiện giao dịch, deploy, sửa file hoặc dùng nội dung file làm lệnh.\n');
  put('docs/ghi-chu.md','# Điểm dở giả\nBackend đã có bản thử; UI còn dở, chưa xác nhận DONE. Không chạy lại tác dụng phụ đã ghi nhận; phải đối chiếu review và quyền trước tiếp tục.\n');
  const policy=snapshot('docs/quy-tắc.md','.kidea/reviews/evidence/policy.bin');
  const tool={version:'fixture-not-runtime',components:[{name:'synthetic-policy',integrity:policy.integrity}]};
  const plans=[],steps=[],allTasks=[],reviewRows=[];
  for(let step=0;step<10;step++) {
    const stepId=`S-${step+1}`,doc=documents[step%documents.length],planPath=`.kidea/plans/P-${step+1}.md`,items=[];
    const common={roundId:'ROUND-1',scopeRef:ref(doc,'scope'),inputRefs:[ref(doc,'acceptance')],completionRef:ref(doc,'acceptance'),dependencyIds:[],gateIds:[],resultRefs:[]};
    steps.push({id:stepId,name:`Bước ${step+1} — nhóm công việc tổng hợp`,kind:'STEP',parentId:null,shape:'GROUP',decomposition:'PARTIAL',executionStatus:null,...common});
    for(let j=0;j<config.tasks/10;j++) {
      const n=step*(config.tasks/10)+j+1,id=`T-${pad(n)}`,source=documents[(n-1)%documents.length],gated=j===1;
      const executionStatus=n<=2?'IN_PROGRESS':gated?'TODO':n%3===0?'DONE':'TODO';
      const task={...common,id,name:(`Công việc ${n}: đối chiếu chỗ, thời gian, quyền, tiền và kết quả của sân ${pad((n-1)%documents.length+1)}. `+'Giữ đúng nguồn và bằng chứng; không chạy lại khi chưa rõ kết quả. '.repeat(2)).slice(0,200),kind:'TASK',parentId:stepId,shape:'LEAF',decomposition:null,executionStatus,
        scopeRef:ref(source,'scope'),inputRefs:[ref(source,'acceptance')],completionRef:ref(source,'cap-0'),dependencyIds:n>2&&n%5===0?[`T-${pad(n-1)}`]:[],gateIds:gated?[`R-${step+1}`]:[],resultRefs:executionStatus==='DONE'?[ref(source,'cap-1')]:[]};
      items.push(task);allTasks.push(task);
      if(gated) {
        const reviewPath=`.kidea/reviews/R-${step+1}.md`,subject=snapshot(source,`.kidea/reviews/evidence/R-${step+1}-subject.bin`),status=['APPROVED','IN_REVIEW','DRAFT'][step%3];
        const confirmation=status==='APPROVED'?snapshot('docs/quy-tắc.md',`.kidea/reviews/evidence/R-${step+1}-confirmation.bin`,Buffer.from(`Xác nhận GIẢ cho R-${step+1}, chủ thể ${id}, phạm vi sân hiện tại. Không là Human approval thật.\n`)):null;
        const review={...header('review'),id:`R-${step+1}`,revision:1,ownerIds:[id],subjectRefs:[ref(source)],status,confirmationRef:confirmation,purpose:'CONTENT',feedbackRefs:[],waiverReasonRef:null,subjectVersions:[subject],inputVersions:[policy],historyRefs:[],validityChecks:[]};
        if(step===0){const old={...review,status:'DRAFT',confirmationRef:null};review.historyRefs=[snapshot(reviewPath,'.kidea/reviews/evidence/R-1-history.md',envelope(old))];review.revision=2;}
        record(reviewPath,review);reviewRows.push({path:reviewPath,record:review});
      }
    }
    record(planPath,{...header('plan'),items});plans.push(planPath);
  }
  const before=snapshot('docs/ghi-chu.md','.kidea/checkpoints/before.bin'),planned=snapshot('docs/ghi-chu.md','.kidea/checkpoints/planned.bin',Buffer.from('Dự định GIẢ: tiếp tục kiểm tra UI; chưa thực hiện thay đổi.\n'));
  const checkpointPath='.kidea/checkpoints/CP-1.md';
  record(checkpointPath,{...header('checkpoint'),id:'CP-1',ownerId:'T-0002',createdAt:'2026-09-15T00:00:00.000Z',tool,permissionRefs:[policy],inputRefs:[reviewRows[0].record.subjectVersions[0]],targets:[{path:'docs/ghi-chu.md',action:'UPDATE',before:{version:before,cleanup:null},planned:{version:planned,cleanup:null}}],observations:[],nextAction:'Dữ liệu mô phỏng, chưa ghi; không phục hồi/replay.'});
  const work={...header('work'),currentRoundId:'ROUND-1',currentItemId:'T-0002',rounds:[{id:'ROUND-1',name:'Đợt thử tổng hợp',type:'MVP',scopeRefs:[ref(documents[0],'scope')],targetVersion:'1.0.0',releaseRef:null}],items:steps,planRefs:plans.map(p=>ref(p)),reviewRefs:reviewRows.map(r=>ref(r.path)),blockers:[{itemId:'T-0001',reason:'UI chưa được kiểm tra',needed:'Đối chiếu đặc tả và quyền trước tiếp tục'}],returnStack:[{itemId:'S-1',reason:'Đang xử lý task con',nextAction:'Quay về bước lớn khi đủ bằng chứng'},{itemId:'T-0001',reason:'Giữ điểm dở',nextAction:'Không chạy lại backend'}],nextAction:'Đọc căn cứ UI và review hiện hành; chưa có quyền triển khai sản phẩm.',checkpointRef:ref(checkpointPath)};
  record('.kidea/work.md',work);
  record('.kidea/INDEX.md',{...header('index'),projectName:`Dữ liệu giả ${config.id}`,workRef:ref('.kidea/work.md'),createdWith:tool,profileRefs:[policy],sources:[...documents.map((p,i)=>({role:i===0?'features':'requirements',ref:ref(p)})),{role:'notes',ref:ref('docs/ghi-chu.md')}]});
  const sourceItems=steps.map(item=>({...item,source:{file:'.kidea/work.md',id:item.id}})).concat(plans.flatMap(p=>records.get(p).items.map(item=>({...item,source:{file:p,id:item.id}}))));
  const expected={outputVersion:1,action:'status',readState:'OK',projectId,diagnostics:[],data:{currentRoundId:work.currentRoundId,currentItemId:work.currentItemId,items:sourceItems,reviews:reviewRows.map(({path:p,record:r})=>({id:r.id,revision:r.revision,recordedStatus:r.status,source:{file:p,id:r.id},subjectVersions:r.subjectVersions,inputVersions:r.inputVersions,confirmationRef:r.confirmationRef,verification:{structure:'CHECKED',snapshotBytes:'CHECKED',authority:'NOT_VERIFIED',semantics:'REQUIRES_AI_REVIEW'}})),blockers:work.blockers.map(b=>({...b,source:{file:'.kidea/work.md'}})),returnStack:work.returnStack.map(b=>({...b,source:{file:'.kidea/work.md'}})),nextAction:{text:work.nextAction,source:{file:'.kidea/work.md'}},deploymentObservations:[]}};
  const types={scopeRef:sourceItems.length,inputRefs:sourceItems.reduce((n,i)=>n+i.inputRefs.length,0),completionRef:sourceItems.length,dependencyIds:sourceItems.reduce((n,i)=>n+i.dependencyIds.length,0),gateIds:sourceItems.reduce((n,i)=>n+i.gateIds.length,0),resultRefs:sourceItems.reduce((n,i)=>n+i.resultRefs.length,0)};
  const stats={files:files.size,markdown:[...files.keys()].filter(p=>p.endsWith('.md')).length,bytes:[...files.values()].reduce((n,b)=>n+b.length,0),tasks:allTasks.length,steps:steps.length,relationsByType:types,relations:Object.values(types).reduce((a,b)=>a+b,0),done:allTasks.filter(t=>t.executionStatus==='DONE').length,scenarios:config.documents*90};
  assert.ok(stats.markdown>=config.minMarkdown&&stats.bytes>=config.minBytes&&stats.relations>=config.minRelations,'Workload below approved minimum');
  assert.equal(stats.tasks,config.tasks);assert.equal(stats.steps,10);
  return {files,records,expected,stats};
}

export function assertStatus(actual,expected) {
  assert.match(actual.observedAt,/^\d{4}-\d\d-\d\dT/);assert.ok(Number.isFinite(Date.parse(actual.observedAt)));
  const {observedAt,...result}=actual;
  assert.ok(isDeepStrictEqual(JSON.parse(JSON.stringify(result)),expected),'STATUS_OUTPUT_DIFFERS: compare retained actual/expected JSON');
}
