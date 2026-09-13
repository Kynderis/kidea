import { readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { parseTree, getNodeValue, findNodeAtLocation } from 'jsonc-parser';
import { validate, validPath, schemas } from './schema.mjs';

const start = '<!-- kidea:data:start -->', end = '<!-- kidea:data:end -->';
const utf8 = bytes => new TextDecoder('utf-8',{fatal:true}).decode(bytes);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const keyOf = r => JSON.stringify([r.path,r.anchor]);
const inside = (root,p) => { const rel=path.relative(root,p); return rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel); };
class Stop extends Error {}

// The optional hook is test-only dependency injection, not a CLI capability.
export function readStatus(cwd, { beforeRecheck } = {}) {
  const out={outputVersion:1,action:'status',observedAt:new Date().toISOString(),readState:'OK',projectId:null,data:null,diagnostics:[]};
  const records=new Map(), reads=new Map(), absent=new Set(), gitReads=new Map();
  let root;
  function issue(code,file=null,field=null,state='INVALID',record=null) {
    const priority={OK:0,UNSUPPORTED:1,INCOMPLETE:2,INVALID:3};
    if(priority[state]>priority[out.readState]) out.readState=state;
    let offset=record?.offset ?? 0;
    if(record?.tree && field) {
      const parts=field.replace(/^\./,'').replace(/\[(\d+)\]/g,'.$1').split('.').filter(Boolean).map(p=>/^\d+$/.test(p)?Number(p):p);
      offset+=findNodeAtLocation(record.tree,parts)?.offset ?? 0;
    }
    const pre=record?.text?.slice(0,offset);
    out.diagnostics.push({code,file,line:pre===undefined?null:pre.split('\n').length,column:pre===undefined?null:offset-pre.lastIndexOf('\n'),fieldOrId:field,message:messages[code]??'Hồ sơ không đáp ứng hợp đồng đã duyệt.',needed:'Đối chiếu nguồn và xử lý đúng phạm vi; lệnh status không tự sửa hoặc cấp quyền.'});
  }
  function absolute(p) {
    if(!validPath(p)) {issue('UNSAFE_PATH',p);throw new Stop();}
    const target=path.resolve(root,...p.split('/'));
    // Validate every existing component before opening the final file, including junctions.
    let part=root;
    for(const segment of p.split('/')) {
      part=path.join(part,segment);
      try {if(!inside(root,realpathSync(part))) {issue('UNSAFE_PATH',p);throw new Stop();}}
      catch(e) {if(e instanceof Stop) throw e;if(e.code==='ENOENT') break;issue('READ_FAILED',p,null,'INCOMPLETE');throw new Stop();}
    }
    return target;
  }
  function bytes(p,allowMissing=false) {
    const target=absolute(p);
    try {
      const resolved=realpathSync(target);
      if(!inside(root,resolved)) {issue('UNSAFE_PATH',p);throw new Stop();}
      if(!statSync(resolved).isFile()) {issue('NOT_FILE',p);throw new Stop();}
      const data=readFileSync(resolved);
      const previous=reads.get(p);
      if(previous && (!previous.data.equals(data)||previous.resolved!==resolved)) issue('SOURCE_CHANGED',p,null,'INCOMPLETE');
      if(!previous) reads.set(p,{data,resolved});
      return data;
    } catch(e) {
      if(e instanceof Stop) throw e;
      if(e.code==='ENOENT') {absent.add(p);if(allowMissing)return null;issue('MISSING_FILE',p,null,'INCOMPLETE');}
      else issue('READ_FAILED',p,null,'INCOMPLETE');
      throw new Stop();
    }
  }
  function parse(p,data) {
    let text;
    try{text=utf8(data);}catch{issue('INVALID_UTF8',p);throw new Stop();}
    const record={file:p,text,offset:0,tree:null,data:null};
    if(text.split(start).length!==2 || text.split(end).length!==2) {issue('ENVELOPE',p,null,'INVALID',record);throw new Stop();}
    const match=/(?:^|\n)<!-- kidea:data:start -->\r?\n```json\r?\n([\s\S]*?)\r?\n```\r?\n<!-- kidea:data:end -->(?=\r?\n|$)/.exec(text);
    if(!match) {issue('ENVELOPE',p,null,'INVALID',record);throw new Stop();}
    record.offset=match.index+match[0].indexOf(match[1]);
    const errors=[];
    record.tree=parseTree(match[1],errors,{disallowComments:true,allowTrailingComma:false,allowEmptyContent:false});
    if(errors.length) {record.offset+=errors[0].offset;issue('JSON_SYNTAX',p,null,'INVALID',record);throw new Stop();}
    function duplicates(node) {
      if(node.type==='object') {
        const seen=new Set();
        for(const prop of node.children??[]) {
          const k=prop.children[0].value;
          if(seen.has(k)) {issue('DUPLICATE_KEY',p,null,'INVALID',{...record,offset:record.offset+prop.offset});throw new Stop();}
          seen.add(k);
        }
      }
      for(const child of node.children??[]) duplicates(child);
    }
    if(!record.tree){issue('JSON_SYNTAX',p);throw new Stop();}
    duplicates(record.tree);
    record.data=getNodeValue(record.tree);
    const d=record.data;
    if(d?.schemaVersion!==2 || !['index','work','plan','review','checkpoint','release','operation'].includes(d?.kind)) {issue('UNSUPPORTED_SCHEMA',p,null,'UNSUPPORTED',record);throw new Stop();}
    if(!validate(d,d.kind,(code,field)=>issue(code,p,field,'INVALID',record))) throw new Stop();
    if(out.projectId!==null && d.projectId!==out.projectId){issue('PROJECT_MISMATCH',p,'.projectId','INVALID',record);throw new Stop();}
    return record;
  }
  function load(p,kind) {
    const record=records.get(p)??parse(p,bytes(p));
    if(kind && record.data.kind!==kind){issue('KIND_MISMATCH',p,'.kind','INVALID',record);throw new Stop();}
    records.set(p,record);return record;
  }
  function anchor(data,ref,file,field) {
    if(ref.anchor===null)return;
    let text;try{text=utf8(data);}catch{issue('INVALID_UTF8',file,field);return;}
    // Explicit Markdown HTML anchors are unambiguous. Generated heading slugs are not guessed.
    const anchors=[...text.matchAll(/<(?:a|[a-z][a-z0-9]*)\b[^>]*\bid=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
    if(anchors.filter(a=>a===ref.anchor).length!==1)issue('ANCHOR_MISSING_OR_AMBIGUOUS',file,field,'INCOMPLETE');
  }
  function checkRef(ref,record,field) {anchor(bytes(ref.path),ref,record.file,field);}
  function integrity(bytesValue,i,record,field) {
    if(i.method!=='SHA256'){issue('UNSUPPORTED_INTEGRITY',record.file,field,'UNSUPPORTED',record);return;}
    if(!/^[a-f0-9]{64}$/.test(i.value)||i.byteLength===null){issue('INTEGRITY_FORMAT',record.file,field,'INVALID',record);return;}
    if(bytesValue && (bytesValue.length!==i.byteLength||sha(bytesValue)!==i.value))issue('CONTENT_MISMATCH',record.file,field,'INCOMPLETE',record);
  }
  function gitBytes(location,record,field) {
    if(!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(location.commit)){issue('GIT_COMMIT',record.file,field,'INVALID',record);throw new Stop();}
    absolute(location.path);
    // No shell, filters, hooks, fetch or revision expressions from the record.
    const gitEnv=Object.fromEntries(Object.entries(process.env).filter(([k])=>!k.toUpperCase().startsWith('GIT_')));
    const run=args=>spawnSync('git',['--no-optional-locks','--no-lazy-fetch',...args],{cwd:root,encoding:null,timeout:10000,maxBuffer:32*1024*1024,windowsHide:true,env:{...gitEnv,GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:process.platform==='win32'?'NUL':'/dev/null',GIT_NO_REPLACE_OBJECTS:'1',GIT_NO_LAZY_FETCH:'1',GIT_TERMINAL_PROMPT:'0'}});
    const top=run(['rev-parse','--show-toplevel']);
    if(top.status!==0||path.resolve(top.stdout.toString().trim())!==root){issue('GIT_UNAVAILABLE',record.file,field,'INCOMPLETE',record);throw new Stop();}
    const type=run(['cat-file','-t',location.commit]);
    if(type.status!==0||type.stdout.toString().trim()!=='commit'){issue('GIT_UNAVAILABLE',record.file,field,'INCOMPLETE',record);throw new Stop();}
    const result=run(['cat-file','blob',`${location.commit}:${location.path}`]);
    if(result.status!==0){issue('GIT_UNAVAILABLE',record.file,field,'INCOMPLETE',record);throw new Stop();}
    gitReads.set(JSON.stringify(location),{location,record,field,bytes:result.stdout});return result.stdout;
  }
  function version(v,record,field,{missing=false,current=false,reviewSnapshot=false}={}) {
    const l=v.location;
    if(reviewSnapshot && l.kind!=='EXTERNAL' && (l.kind!=='SNAPSHOT'||!l.ref.path.startsWith('.kidea/reviews/evidence/'))) {
      issue('REVIEW_SNAPSHOT_LOCATION',record.file,field,'INVALID',record);return null;
    }
    if(v.source===null && l.kind!=='EXTERNAL'){issue('VERSION_SOURCE',record.file,field,'INVALID',record);return null;}
    if(l.kind==='EXTERNAL'){checkRef(l.profileRef,record,field);issue('EXTERNAL_UNSUPPORTED',record.file,field,'UNSUPPORTED',record);return null;}
    let data;
    if(l.kind==='SNAPSHOT') {
      if(l.ref.anchor!==null){issue('SNAPSHOT_ANCHOR',record.file,field,'INVALID',record);return null;}
      data=bytes(l.ref.path,missing);
    }else data=gitBytes(l,record,field);
    integrity(data,v.integrity,record,field);
    if(data && v.source)anchor(data,v.source,record.file,field);
    if(current && v.source) {
      const actual=bytes(v.source.path,true);
      if(!actual || !data || !actual.equals(data))issue('CURRENT_SOURCE_DIFFERS',record.file,field,'INCOMPLETE',record);
    }
    return data;
  }
  function walk(v,type,record,field='',context={}) {
    if(v===null)return;
    if(type.endsWith('?'))return walk(v,type.slice(0,-1),record,field,context);
    if(type.endsWith('[]')){v.forEach((x,i)=>walk(x,type.slice(0,-2),record,`${field}[${i}]`,context));return;}
    if(type==='Ref'){checkRef(v,record,field);return;}
    if(type==='VersionRef'){version(v,record,field,context);return;}
    if(type==='Integrity'){integrity(null,v,record,field);return;}
    if(type==='RecoveryCopy') {
      const loc=v.version.location;
      if(loc.kind==='SNAPSHOT' && !loc.ref.path.startsWith('.kidea/checkpoints/')) issue('RECOVERY_LOCATION',record.file,field,'INVALID',record);
      if(v.cleanup) {
        if(loc.kind!=='SNAPSHOT'||!loc.ref.path.startsWith('.kidea/checkpoints/'))issue('CLEANUP_LOCATION',record.file,field,'INVALID',record);
        checkRef(v.cleanup.evidenceRef,record,field);
      }
      version(v.version,record,field,{missing:v.cleanup!==null});return;
    }
    if(type==='ReleaseRef'||type==='OperationRef') {
      if(v.recordVersion.source?.path!==v.path) issue('PIN_SOURCE',record.file,field,'INVALID',record);
      const data=version(v.recordVersion,record,field);
      if(data){const pinned=parse(v.path,data);const d=pinned.data;
        if(d.kind!==(type==='ReleaseRef'?'release':'operation') || d.id!==v.id || (type==='ReleaseRef'&&d.revision!==v.revision)) issue('PIN_IDENTITY',record.file,field,'INVALID',record);
        recordConstraints(pinned);
        walk(d,d.kind,pinned,'',{historical:true});
      }return;
    }
    if(!schemas[type])return;
    for(const [key,child] of Object.entries(schemas[type])) {
      // Records are loaded from authoritative indexes, not traversed as anonymous references.
      if(['workRef','planRefs','reviewRefs','checkpointRef'].includes(key))continue;
      if(type==='review'&&key==='historyRefs')continue;
      if(context.historical && type==='review' && key==='subjectRefs')continue;
      let current=context.current??false;
      if(!context.historical && ((type==='index'&&key==='profileRefs')||(type==='review'&&['subjectVersions','inputVersions'].includes(key)) || (type==='release'&&['components','configRefs','schemaRefs','scriptRefs'].includes(key))))current=true;
      walk(v[key],child,record,`${field}.${key}`,{...context,current,reviewSnapshot:context.reviewSnapshot||type==='review'});
    }
  }
  const unique=(list,by,record,field)=>{const keys=list.map(by);if(new Set(keys).size!==keys.length)issue('DUPLICATE_ID',record.file,field,'INVALID',record);};
  const requireValue=(ok,record,field,code='CONSTRAINT')=>{if(!ok)issue(code,record.file,field,'INVALID',record);};
  function recordConstraints(r) {
    const d=r.data;
    if(d.kind==='release') {
      requireValue(!r.file.startsWith('.kidea/')&&d.components.length>0,r,'.components');
      unique(d.components,c=>c.id,r,'.components');
    }
    if(d.kind==='operation') {
      requireValue(!r.file.startsWith('.kidea/'),r,null);
      unique(d.observations,o=>o.id,r,'.observations');
    }
  }
  function reviewHistory(record,seen=new Set()) {
    const r=record.data;
    requireValue(r.ownerIds.length && r.subjectRefs.length,record,'.ownerIds');
    requireValue(r.status!=='APPROVED'||r.confirmationRef!==null,record,'.confirmationRef');
    requireValue(r.purpose==='CONTENT'?r.waiverReasonRef===null:r.status==='DRAFT'||r.waiverReasonRef!==null,record,'.waiverReasonRef');
    if(r.status!=='DRAFT')requireValue(r.subjectRefs.every(ref=>r.subjectVersions.some(v=>v.source&&keyOf(v.source)===keyOf(ref))) && r.inputVersions.length>0,record,'.subjectVersions');
    for(const [i,v] of r.validityChecks.entries())if(['UNCHANGED','NON_SEMANTIC'].includes(v.result))requireValue(v.beforeRefs.length>0&&v.afterRefs.length>0,record,`.validityChecks[${i}]`);
    for(const [i,v] of r.historyRefs.entries()) {
      const loc=v.location;
      requireValue(loc.kind==='SNAPSHOT'&&loc.ref.path.startsWith('.kidea/reviews/evidence/'),record,`.historyRefs[${i}]`);
      const key=JSON.stringify(loc);
      if(seen.has(key)){issue('HISTORY_CYCLE',record.file,`.historyRefs[${i}]`);continue;}
      const data=version(v,record,`.historyRefs[${i}]`,{reviewSnapshot:true});
      if(data){const old=parse(loc.ref.path,data);requireValue(old.data.kind==='review'&&old.data.id===r.id&&old.data.revision<=r.revision,record,`.historyRefs[${i}]`);if(old.data.kind==='review'){walk(old.data,'review',old,'',{historical:true});reviewHistory(old,new Set([...seen,key]));}}
    }
  }
  try {
    root=realpathSync(cwd);
    const index=load('.kidea/INDEX.md','index');out.projectId=index.data.projectId;
    const idx=index.data;
    const work=load(idx.workRef.path,'work'), w=work.data;
    requireValue(work.file.startsWith('.kidea/')&&!work.file.startsWith('.kidea/reviews/')&&!work.file.startsWith('.kidea/checkpoints/'),work,null);
    const plans=w.planRefs.map(r=>load(r.path,'plan'));
    for(const p of plans)requireValue(p.file.startsWith('.kidea/plans/'),p,null);
    const reviews=w.reviewRefs.map(r=>load(r.path,'review'));
    const checkpoint=w.checkpointRef?load(w.checkpointRef.path,'checkpoint'):null;
    checkRef(idx.workRef,index,'.workRef');
    for(const r of [...w.planRefs,...w.reviewRefs,...(w.checkpointRef?[w.checkpointRef]:[])])checkRef(r,work,null);
    for(const p of plans)requireValue(p.data.items.length>0,p,'.items');
    const itemRows=[work,...plans].flatMap(r=>r.data.items.map(item=>({item,record:r})));
    const items=new Map(itemRows.map(r=>[r.item.id,r]));
    unique(itemRows,r=>r.item.id,work,'.items');unique(w.rounds,r=>r.id,work,'.rounds');unique(reviews,r=>r.data.id,work,'.reviewRefs');
    unique(w.planRefs,keyOf,work,'.planRefs');unique(w.reviewRefs,keyOf,work,'.reviewRefs');unique(idx.sources,s=>`${s.role}:${keyOf(s.ref)}`,index,'.sources');
    requireValue(idx.sources.filter(s=>s.role==='features').length===1,index,'.sources');
    requireValue(w.rounds.some(r=>r.id===w.currentRoundId),work,'.currentRoundId');
    requireValue(w.currentItemId===null||items.get(w.currentItemId)?.item.roundId===w.currentRoundId,work,'.currentItemId');
    const reviewIds=new Map(reviews.map(r=>[r.data.id,r.data]));
    for(const {item:i,record:r} of itemRows) {
      const field=`items:${i.id}`;
      requireValue(w.rounds.some(x=>x.id===i.roundId),r,field);
      requireValue(i.parentId===null?i.kind==='STEP':items.has(i.parentId)&&items.get(i.parentId).item.roundId===i.roundId,r,field);
      const children=itemRows.filter(x=>x.item.parentId===i.id);
      requireValue(i.shape==='GROUP'?i.executionStatus===null&&i.decomposition!==null:i.decomposition===null&&i.executionStatus!==null&&!children.length,r,field);
      requireValue(!['STEP','PHASE'].includes(i.kind)||i.shape==='GROUP',r,field);
      requireValue(i.executionStatus!=='DONE'||i.resultRefs.length>0,r,field);
      for(const id of i.dependencyIds)requireValue(items.has(id)&&id!==i.id,r,field);
      for(const id of i.gateIds)requireValue(reviewIds.get(id)?.ownerIds.includes(i.id),r,field);
      if(i.executionStatus==='IN_PROGRESS'&&i.id!==w.currentItemId)requireValue(w.returnStack.some(x=>x.itemId===i.id)||w.blockers.some(x=>x.itemId===i.id),r,field);
      const seen=new Set([i.id]);let parent=i.parentId;
      while(parent&&items.has(parent)){if(seen.has(parent)){issue('PARENT_CYCLE',r.file,field);break;}seen.add(parent);parent=items.get(parent).item.parentId;}
    }
    const visiting=new Set(),visited=new Set();
    function dependencyCycle(id) {
      if(visiting.has(id)){issue('DEPENDENCY_CYCLE',items.get(id).record.file,id);return;}
      if(visited.has(id)||!items.has(id))return;
      visiting.add(id);for(const child of items.get(id).item.dependencyIds)dependencyCycle(child);visiting.delete(id);visited.add(id);
    }
    for(const id of items.keys())dependencyCycle(id);
    for(const b of [...w.blockers,...w.returnStack])requireValue(b.itemId===null||items.has(b.itemId),work,'.blockers');
    for(const r of w.rounds)requireValue(r.scopeRefs.length>0,work,'.rounds');
    for(const r of reviews) {
      requireValue(r.file.startsWith('.kidea/reviews/')&&!r.file.startsWith('.kidea/reviews/evidence/'),r,null);
      for(const owner of r.data.ownerIds)requireValue(items.has(owner),r,'.ownerIds');
      reviewHistory(r);
    }
    if(checkpoint) {
      const c=checkpoint.data;
      requireValue(checkpoint.file.startsWith('.kidea/checkpoints/')&&items.has(c.ownerId)&&c.targets.length>0,checkpoint,'.ownerId');
      unique(c.targets,t=>t.path,checkpoint,'.targets');
      for(const [i,t] of c.targets.entries()) {
        requireValue((t.action==='CREATE')===(t.before===null),checkpoint,`.targets[${i}].before`);
        for(const copy of [t.before,t.planned].filter(Boolean))requireValue(copy.version.source?.path===t.path,checkpoint,`.targets[${i}]`);
        if(t.before?.cleanup||t.planned.cleanup) {
          requireValue(items.get(c.ownerId)?.item.executionStatus==='DONE',checkpoint,`.targets[${i}]`);
          const latest=[...c.observations].reverse().find(o=>o.phase==='VERIFY');
          requireValue(c.targets.every(target=>latest?.results.some(x=>x.path===target.path&&x.match==='PLANNED')),checkpoint,'.observations');
        }
      }
      for(const o of c.observations){unique(o.results,x=>x.path,checkpoint,'.observations');for(const result of o.results)requireValue(c.targets.some(t=>t.path===result.path),checkpoint,'.observations');}
    }
    // Operation sources may be prose, but unsupported operational formats cannot be asserted as verified.
    for(const source of idx.sources.filter(s=>s.role==='operations')) {
      const record=load(source.ref.path);
      if(!['release','operation'].includes(record.data.kind)){issue('OPERATION_FORMAT_UNSUPPORTED',record.file,null,'UNSUPPORTED',record);throw new Stop();}
    }
    for(const round of w.rounds)if(round.releaseRef){const release=load(round.releaseRef.path,'release');requireValue(release.data.id===round.releaseRef.id&&release.data.revision===round.releaseRef.revision,work,'.rounds');}
    const operations=[...records.values()].filter(r=>r.data.kind==='operation');
    const releases=[...records.values()].filter(r=>r.data.kind==='release');
    unique(operations,r=>r.data.id,index,'.sources');unique(releases,r=>r.data.id,index,'.sources');
    for(const r of releases) {requireValue(r.data.components.length>0,r,'.components');unique(r.data.components,c=>c.id,r,'.components');}
    for(const r of operations) {
      const o=r.data;
      requireValue(o.previousAttemptId===null||operations.some(x=>x.data.id===o.previousAttemptId&&x!==r),r,'.previousAttemptId');
      const seen=new Set([o.id]);let prev=o.previousAttemptId;
      while(prev){if(seen.has(prev)){issue('OPERATION_CYCLE',r.file,'.previousAttemptId');break;}seen.add(prev);prev=operations.find(x=>x.data.id===prev)?.data.previousAttemptId;}
      unique(o.observations,x=>x.id,r,'.observations');
      const pinned=version(o.release.recordVersion,r,'.release');
      if(pinned){const release=parse(o.release.path,pinned).data;
        if(release.kind==='release')for(const obs of o.observations){unique(obs.components,x=>x.id,r,'.observations');unique(obs.steps,x=>x.id,r,'.observations');for(const c of obs.components)requireValue(release.components.some(x=>x.id===c.id),r,'.observations');}
      }
    }
    for(const r of records.values()){recordConstraints(r);walk(r.data,r.data.kind,r);}
    // Tool component names must be unique wherever a ToolIdentity occurs.
    function tools(value,r){if(!value||typeof value!=='object')return;if(typeof value.version==='string'&&Array.isArray(value.components)&&value.components.every(c=>'name'in c)){requireValue(value.components.length>0,r,'tool.components');unique(value.components,c=>c.name,r,'tool.components');}for(const v of Object.values(value))tools(v,r);}
    for(const r of records.values())tools(r.data,r);
    beforeRecheck?.();
    for(const [p,read] of reads) {const latest=bytes(p);if(!latest.equals(read.data))issue('SOURCE_CHANGED',p,null,'INCOMPLETE');}
    for(const p of absent)if(bytes(p,true)!==null)issue('SOURCE_CHANGED',p,null,'INCOMPLETE');
    for(const entry of [...gitReads.values()])if(!gitBytes(entry.location,entry.record,entry.field).equals(entry.bytes))issue('SOURCE_CHANGED',entry.record.file,entry.field,'INCOMPLETE');
    if(out.readState==='OK')out.data={currentRoundId:w.currentRoundId,currentItemId:w.currentItemId,
      items:itemRows.map(({item,record})=>({...item,source:{file:record.file,id:item.id}})),
      reviews:reviews.map(r=>({id:r.data.id,revision:r.data.revision,recordedStatus:r.data.status,source:{file:r.file,id:r.data.id},subjectVersions:r.data.subjectVersions,inputVersions:r.data.inputVersions,confirmationRef:r.data.confirmationRef,verification:{structure:'CHECKED',snapshotBytes:'CHECKED',authority:'NOT_VERIFIED',semantics:'REQUIRES_AI_REVIEW'}})),
      blockers:w.blockers.map(b=>({...b,source:{file:work.file}})),returnStack:w.returnStack.map(b=>({...b,source:{file:work.file}})),
      nextAction:{text:w.nextAction,source:{file:work.file}},deploymentObservations:operations.map(r=>({id:r.data.id,file:r.file,environment:r.data.environment,targetId:r.data.targetId,startedAt:r.data.startedAt,observations:r.data.observations,verification:'RECORDED_OBSERVATIONS_NOT_LIVE_HEALTH'}))};
  } catch(e) {if(!(e instanceof Stop))issue('READ_FAILED',null,null,'INCOMPLETE');}
  out.observedAt=new Date().toISOString();
  return out;
}
const messages={
  MISSING_FILE:'Thiếu file được tham chiếu.',READ_FAILED:'Chưa đọc/kiểm tra được nguồn; không xác nhận tiến độ.',UNSAFE_PATH:'Đường dẫn không thuộc phạm vi project hợp lệ.',
  JSON_SYNTAX:'Cú pháp JSON không hợp lệ.',DUPLICATE_KEY:'Khóa JSON bị lặp, kể cả dạng escape.',ENVELOPE:'Thiếu, trùng hoặc sai mốc khối dữ liệu.',
  UNSUPPORTED_SCHEMA:'Phiên bản hoặc loại hồ sơ chưa được hỗ trợ.',CONTENT_MISMATCH:'Byte bản lưu không khớp mã nội dung.',
  CURRENT_SOURCE_DIFFERS:'Nguồn hiện hành khác hoặc thiếu so với căn cứ; cần đối chiếu lại ý nghĩa/hiệu lực.',SOURCE_CHANGED:'Nguồn thay đổi trong lượt đọc; chưa xác nhận ảnh chụp nhất quán.',
  EXTERNAL_UNSUPPORTED:'Nguồn bên ngoài chưa có phương thức đối chiếu được hỗ trợ; không truy cập mạng.',
};
