// CREATE-only init. The caller supplies a current, explicit Human grant; no
// project file is read as permission and this API cannot authenticate a chat.
import { readFileSync,realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { localEntry,byteIntegrity,recordBytes,hashBytes } from './bootstrap-plan.mjs';
import { prepareInternalBootstrap,executeInternalWrite } from './write-internal.mjs';
import { readStatus } from './status.mjs';
import { validPath } from './schema.mjs';
import { findGitVersion } from './git-versions.mjs';
import { assertRuntime,assertLocalRoot,hasLocalAssumptions } from './runtime.mjs';

const fail=code=>{throw Object.assign(new Error(code),{code});};
const text=v=>typeof v==='string'&&v.trim().length>0;
const closed=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
const ref=(p,a=null)=>({path:p,anchor:a});
const steps=[
  ['Ý tưởng và phạm vi','Chốt mục tiêu, người dùng, phạm vi và Feature Map; phân biệt MVP, Future và Idea.'],
  ['Nghiệp vụ','Đối chiếu luồng nghiệp vụ, điều kiện chấp nhận và business test.'],
  ['Yêu cầu chất lượng','Xác định yêu cầu phi chức năng, ngưỡng đo và cách kiểm chứng phù hợp.'],
  ['Trải nghiệm','Xác định trải nghiệm, luồng sử dụng và tiêu chí kiểm tra; xét SEO khi áp dụng.'],
  ['Monitoring và vận hành','Xác định tín hiệu theo dõi, cảnh báo và quy trình vận hành.'],
  ['Quản trị','Xác định nhu cầu admin và quyền quản trị; đối chiếu trường hợp không áp dụng.'],
  ['Kiến trúc','Chốt kiến trúc, hợp đồng giữa thành phần và quy tắc triển khai code.'],
  ['Test kỹ thuật','Xác định và kiểm chứng kế hoạch test kỹ thuật theo nguồn đã duyệt.'],
  ['Lộ trình và triển khai','Lập lộ trình, được Human duyệt rồi mới triển khai theo phạm vi/quyền được cấp.'],
  ['Triển khai và xác nhận vận hành','Chỉ triển khai khi có quyền; giữ bằng chứng kết quả và xác nhận vận hành, không suy thành công từ dự kiến.']
];

export function initToolIdentity() {
  assertRuntime();
  const components=['kidea.mjs','init.mjs','bootstrap-plan.mjs','write-internal.mjs','git-versions.mjs','runtime.mjs','status.mjs','schema.mjs','pending-writes.mjs','recorded-completion.mjs'].map(name=>({name,integrity:byteIntegrity(readFileSync(fileURLToPath(new URL(name,import.meta.url))))}));
  components.push({name:`node-${process.versions.node}-${process.platform}-${process.arch}`,integrity:byteIntegrity(readFileSync(process.execPath))});
  return {version:'kidea-schema2-init-local-r2',components};
}

// Read-only preparation. Profile/source bytes are captured in the operation's
// metadata or exact local Git versions and checked again before creation.
export function prepareInit(root,request) {
  assertLocalRoot(root);
  if(typeof root!=='string'||!path.isAbsolute(root)||path.resolve(realpathSync(root))!==path.resolve(root))fail('ROOT_NOT_EXPLICIT');
  root=realpathSync(root);
  if(!closed(request,['projectName','humanRequest','featureSource','profiles','permission'])||!text(request.projectName)||!text(request.humanRequest))fail('INIT_INPUT_REQUIRED');
  const grant=request.permission;
  if(!closed(grant,['root','metadataRoot','targets','createDirectories','allowRestoreUpdate','allowRetireOwnPending','allowReadLocalGit','assumptions','bootstrap','statement'])||!text(grant.statement))fail('AUTHORIZATION_REQUIRED');
  const {statement,...authorization}=grant;
  if(authorization.root!==root||authorization.metadataRoot!=='.kidea/checkpoints'||authorization.bootstrap!==true||authorization.allowRestoreUpdate!==false||authorization.allowRetireOwnPending!==true)fail('AUTHORIZATION_REQUIRED');
  if(authorization.allowReadLocalGit!==undefined&&typeof authorization.allowReadLocalGit!=='boolean')fail('AUTHORIZATION_REQUIRED');
  if(!hasLocalAssumptions(authorization.assumptions))fail('ENVIRONMENT_NOT_CONFIRMED');
  const existing=localEntry(root,'.kidea');
  if(existing) {
    const status=readStatus(root,{allowGit:authorization.allowReadLocalGit===true});
    return {state:status.readState==='OK'?'ALREADY_INITIALIZED':'EXISTING_STATE_REQUIRES_RECONCILIATION',status};
  }
  const source=request.featureSource;
  if(!closed(source,['mode','path','anchor','confirmed'])||!['NEW','EXISTING'].includes(source.mode)||!validPath(source.path)||source.path.toLowerCase()==='.kidea'||source.path.toLowerCase().startsWith('.kidea/')||!(source.anchor===null||text(source.anchor)))fail('FEATURE_SOURCE_REQUIRED');
  if(source.mode==='EXISTING'&&source.confirmed!==true)fail('FEATURE_SOURCE_NOT_CONFIRMED');
  if(source.mode==='NEW'&&source.anchor!==null)fail('NEW_FEATURE_ANCHOR_UNSUPPORTED');
  if(!Array.isArray(request.profiles))fail('PROFILE_SELECTION_REQUIRED');
  const operationId=randomUUID(),projectId=randomUUID(),prefix=`.kidea/checkpoints/operations/${operationId}/`;
  const inputs=[],evidence=[],gitInputs=[];
  const capture=(bytes,sourceRef=null,name=`input-${evidence.filter(e=>e.path!==prefix+'permission.md').length}.md`)=>{
    const p=prefix+name;evidence.push({path:p,bytes});
    return {source:sourceRef??ref(p),location:{kind:'SNAPSHOT',ref:ref(p)},integrity:byteIntegrity(bytes)};
  };
  const permissionVersion=capture(Buffer.from(statement),null,'permission.md');
  const humanVersion=capture(Buffer.from(request.humanRequest));
  const readSelected=r=>{
    if(!closed(r,['path','anchor'])||!validPath(r.path)||!(r.anchor===null||text(r.anchor)))fail('INVALID_SELECTED_REFERENCE');
    const entry=localEntry(root,r.path);if(!entry?.stat.isFile())fail('SELECTED_SOURCE_MISSING');
    const bytes=readFileSync(entry.full);
    const previous=inputs.find(i=>i.path===r.path);
    if(previous&&!previous.expectedBytes.equals(bytes))fail('SOURCE_CHANGED');
    if(!previous)inputs.push({path:r.path,expectedBytes:bytes});
    const gitVersion=authorization.allowReadLocalGit===true?findGitVersion(root,r.path,bytes,r.anchor):null;
    if(gitVersion) {
      if(!gitInputs.some(i=>isDeepStrictEqual(i.location,gitVersion.location)))gitInputs.push({location:gitVersion.location,expectedBytes:bytes});
      return gitVersion;
    }
    return capture(bytes,r);
  };
  const featureRef=ref(source.path,source.anchor),inputVersions=[humanVersion];
  if(source.mode==='EXISTING')inputVersions.push(readSelected(featureRef));
  else if(localEntry(root,source.path))fail('FEATURE_TARGET_EXISTS_NEEDS_SELECTION');
  const profileRefs=request.profiles.map(readSelected);inputVersions.push(...profileRefs);
  const tool=initToolIdentity();
  const index={schemaVersion:2,projectId,kind:'index',projectName:request.projectName,workRef:ref('.kidea/work.md'),sources:[{role:'features',ref:featureRef}],createdWith:tool,profileRefs};
  const work={schemaVersion:2,projectId,kind:'work',currentRoundId:'ROUND-001',currentItemId:'W-001',rounds:[{id:'ROUND-001',name:'MVP — bắt đầu làm rõ, chưa duyệt phạm vi',type:'MVP',scopeRefs:[featureRef,humanVersion.location.ref],targetVersion:null,releaseRef:null}],items:steps.map(([name],i)=>({id:`W-${String(i+1).padStart(3,'0')}`,roundId:'ROUND-001',name,kind:'STEP',parentId:null,shape:'GROUP',decomposition:'UNEXPANDED',scopeRef:ref('.kidea/work.md',`step-${i+1}-scope`),inputRefs:[featureRef,humanVersion.location.ref],completionRef:ref('.kidea/work.md',`step-${i+1}-completion`),dependencyIds:i?[`W-${String(i).padStart(3,'0')}`]:[],gateIds:[],resultRefs:[],executionStatus:null})),planRefs:[],reviewRefs:[],blockers:steps.map((_,i)=>({itemId:`W-${String(i+1).padStart(3,'0')}`,reason:'Chưa lập gói duyệt bước này.',needed:'Có đầu ra thực, lập gói đúng chủ thể/phạm vi/bản và được Human duyệt còn hiệu lực; N/A cũng cần xác nhận riêng.'})),returnStack:[],nextAction:'Làm rõ ý tưởng, người dùng, mục tiêu, phạm vi và điều chưa biết ở W-001; phân rã công việc rồi lập gói duyệt. Chưa qua gate bước 1.',checkpointRef:ref(prefix+'checkpoint.md')};
  const sections=steps.map(([name,scope],i)=>`<a id="step-${i+1}-scope"></a>\n## ${i+1}. ${name}\n\n${scope}\n\n<a id="step-${i+1}-completion"></a>\n### Điều kiện hoàn tất\n\nCó đầu ra thực theo phạm vi bước; kiểm tra áp dụng có bằng chứng, đồng bộ tài liệu và xử lý cleanup đúng điều kiện giữ bằng chứng. Bắt buộc có gói Human review đúng chủ thể/phạm vi/bản và approval còn hiệu lực; trường hợp N/A cần gói/xác nhận riêng. Không được suy hoàn tất từ việc đã phân rã hoặc thứ tự bước.\n`).join('\n');
  const targets=[{path:'.kidea/INDEX.md',action:'CREATE',plannedBytes:Buffer.concat([Buffer.from('# Hồ sơ Kidea\n\nNguồn điều phối: [cây công việc](work.md). Nguồn sản phẩm nằm tại sources trong bản ghi, không sao chép trạng thái ở đây.\n\n'),recordBytes(index)])},{path:'.kidea/work.md',action:'CREATE',plannedBytes:Buffer.concat([Buffer.from('# Công việc\n\nKhung quy trình; không khẳng định đầu ra sản phẩm đã tồn tại.\n\n'),recordBytes(work),Buffer.from('\n'+sections)])}];
  if(source.mode==='NEW')targets.push({path:source.path,action:'CREATE',plannedBytes:Buffer.from('# Feature Map — bản nháp chưa duyệt\n\n## Ý tưởng Human (nguyên văn dạng JSON string)\n\n'+JSON.stringify(request.humanRequest)+'\n\n## Mục tiêu, người dùng, phạm vi và ràng buộc\n\nChưa chốt; cần làm rõ ở bước 1. Lời yêu cầu trên không tự là approval phạm vi.\n\n## Phân loại\n\n- MVP: chưa có feature được duyệt vào nhóm này.\n- Future: chưa phân loại.\n- Idea: giữ ý tưởng gốc phía trên để đối chiếu, chưa phân loại feature.\n\nKhông có gợi ý AI được thêm trong lượt init này.\n')});
  if(!isDeepStrictEqual(authorization.targets,targets.map(({path,action})=>({path,action}))))fail('TARGET_NOT_AUTHORIZED');
  const prepared=prepareInternalBootstrap({root,authorization,context:{projectId,ownerId:'W-001',tool,permissionRefs:[permissionVersion],inputRefs:inputVersions},targets,inputs,gitInputs,operationId,bootstrap:{directories:authorization.createDirectories,evidence}});
  return {state:'PREPARED_READ_ONLY',projectId,prepared};
}

export async function initialize(root,request) {
  const plan=prepareInit(root,request);if(plan.state!=='PREPARED_READ_ONLY')return plan;
  const result=await executeInternalWrite(plan.prepared);
  return {state:result.state==='COMPLETED_BYTES'?'INITIALIZED':'INIT_NOT_COMPLETE',projectId:plan.projectId,operationId:result.operationId,verification:result.verification,writer:result};
}
