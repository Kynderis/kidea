// Resume prepares context and saves an explicitly scoped continuation note.
// It does not execute product commands, choose a new task or authenticate gates.
import {readFileSync,realpathSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {localEntry,byteIntegrity,hashBytes} from './bootstrap-plan.mjs';
import {inspectStatusGraph,snapshotAnchorCount} from './status.mjs';
import {diagnosePending} from './diagnose-pending.mjs';
import {initToolIdentity} from './init.mjs';
import {readGitContext,readGitVersion,findGitVersion} from './git-versions.mjs';
import {isRecordedComplete} from './recorded-completion.mjs';
import {prepareInternalContinuationWrite,executeInternalWrite} from './write-internal.mjs';
import {validate} from './schema.mjs';
import {preserveReview} from './review-validity.mjs';

const fail=(code,diagnostics=[])=>{throw Object.assign(new Error(code),{code,diagnostics});};
const closed=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
const text=v=>typeof v==='string'&&v.trim().length>0;
const ref=p=>({path:p,anchor:null});
const allowed=['operation','permission','expectedProjectId','expectedGit','requiredFiles','expectedBasis','checkpoint','reviewComparisons'];
function input(root,request) {
  if(typeof root!=='string'||!path.isAbsolute(root)||path.resolve(realpathSync(root))!==path.resolve(root))fail('ROOT_NOT_EXPLICIT');
  root=realpathSync(root);
  if(!closed(request,allowed)||!['READ','SAVE'].includes(request.operation))fail('RESUME_INPUT_INVALID');
  const p=request.permission;
  if(!closed(p,['root','readProject','allowReadLocalGit','allowSaveContinuation','preserveReviewIds','assumptions','statement'])||p.root!==root||p.readProject!==true||typeof p.allowReadLocalGit!=='boolean')fail('READ_PERMISSION_REQUIRED');
  return root;
}
function identity() {
  const tool=initToolIdentity();tool.version='kidea-schema2-resume-cooperative-r1';
  for(const name of ['resume.mjs','diagnose-pending.mjs','review-validity.mjs'])tool.components.push({name,integrity:byteIntegrity(readFileSync(new URL(name,import.meta.url)))});
  return tool;
}
function inspect(root,request,{beforeRecheck}={}) {
  root=input(root,request);
  const tool=identity(),allowGit=request.permission.allowReadLocalGit;
  const graph=inspectStatusGraph(root,new Map(),[],{allowGit});
  if(graph.status.readState!=='OK') {
    const pending=graph.status.diagnostics.some(d=>d.code==='WRITE_PENDING');
    return {result:{state:pending?'RECONCILIATION_REQUIRED':'READ_BLOCKED',diagnostics:graph.status.diagnostics,context:null,
      ...(pending?{pending:diagnosePending(root,{allowGit})}:{})}};
  }
  if(request.expectedProjectId!==undefined&&request.expectedProjectId!==graph.status.projectId)fail('PROJECT_ID_DIFFERS');
  const hasGit=localEntry(root,'.git')!==null;
  if(hasGit&&!allowGit)fail('GIT_CONTEXT_READ_REQUIRED');
  const checkout=hasGit?readGitContext(root):null;
  if(request.expectedGit!==undefined&&!same(request.expectedGit,checkout))fail('CHECKOUT_DIFFERS');
  if(checkout?.unmerged)fail('GIT_CONFLICT',checkout.conflictPaths.map(file=>({code:'GIT_CONFLICT',file})));
  const reads=new Map(graph.reads);
  if(!Array.isArray(request.requiredFiles??[]))fail('REQUIRED_FILES_INVALID');
  for(const r of request.requiredFiles??[]) {
    if(!validate(r,'Ref',()=>{}))fail('REQUIRED_FILES_INVALID');
    const entry=localEntry(root,r.path);if(!entry?.stat.isFile())fail('REQUIRED_FILE_MISSING',[{code:'REQUIRED_FILE_MISSING',file:r.path}]);
    const bytes=readFileSync(entry.full);
    if(r.anchor!==null&&snapshotAnchorCount(bytes,r.anchor)!==1)fail('REQUIRED_ANCHOR_MISSING',[{code:'REQUIRED_ANCHOR_MISSING',file:r.path,anchor:r.anchor}]);
    if(reads.has(r.path)&&!reads.get(r.path).equals(bytes))fail('SOURCE_CHANGED');
    reads.set(r.path,bytes);
  }
  const workEntry=[...graph.records].find(([,r])=>r.kind==='work'),[workPath,work]=workEntry;
  const {items,reviews}=graph.status.data,current=items.find(i=>i.id===work.currentItemId)??null;
  const approved=new Set(reviews.filter(r=>r.recordedStatus==='APPROVED').map(r=>r.id));
  const parents=[];let parent=current?.parentId;
  while(parent){const item=items.find(i=>i.id===parent);parents.push(item);parent=item.parentId;}
  const related=new Set(),queue=current?[current,...parents].flatMap(i=>i.dependencyIds):[];
  while(queue.length){const id=queue.shift();if(related.has(id))continue;related.add(id);queue.push(...items.find(i=>i.id===id).dependencyIds);}
  const dependencies=[...related].map(id=>({id,recordedComplete:isRecordedComplete(id,items,approved)}));
  const blockers=work.blockers.filter(b=>b.itemId===null||[current?.id,...parents.map(i=>i.id),...related].includes(b.itemId));
  // Conflict markers are a reason to inspect, not permission to rewrite text.
  for(const [p,b]of reads)if(!p.startsWith('.kidea/checkpoints/')&&!p.startsWith('.kidea/reviews/evidence/')&&/^(?:<<<<<<< |=======$|>>>>>>> )/m.test(b.toString('utf8')))fail('SOURCE_CONFLICT_MARKERS',[{code:'SOURCE_CONFLICT_MARKERS',file:p}]);
  beforeRecheck?.();
  for(const [p,b]of reads){const entry=localEntry(root,p);if(!entry?.stat.isFile()||!readFileSync(entry.full).equals(b))fail('SOURCE_CHANGED');}
  for(const {location,bytes}of graph.gitReads.values())if(!readGitVersion(root,location).equals(bytes))fail('SOURCE_CHANGED');
  if(hasGit?!same(readGitContext(root),checkout):localEntry(root,'.git')!==null)fail('CHECKOUT_CHANGED');
  // Re-read the graph's pending namespace after the extra required-file reads.
  const finalGraph=inspectStatusGraph(root,new Map(),[],{allowGit});
  if(finalGraph.status.readState!=='OK')fail('RESUME_STATE_CHANGED');
  for(const [p,b]of graph.reads)if(!finalGraph.reads.get(p)?.equals(b))fail('SOURCE_CHANGED');
  const sources=[...reads].sort(([a],[b])=>a.localeCompare(b)).map(([p,b])=>({path:p,integrity:byteIntegrity(b)}));
  const gitSources=[...graph.gitReads.values()].map(({location,bytes})=>({location,integrity:byteIntegrity(bytes)}));
  const basis=hashBytes(Buffer.from(JSON.stringify({root,projectId:graph.status.projectId,checkout,tool,sources,gitSources})));
  const currentRecordedComplete=current?isRecordedComplete(current.id,items,approved):false;
  const attention=current?.executionStatus==='DONE'||currentRecordedComplete?['CURRENT_ITEM_RECORDED_DONE_DO_NOT_RERUN']:[];
  const state=!current?'NO_CURRENT_ITEM':blockers.length||dependencies.some(d=>!d.recordedComplete)||attention.length?'WAITING':'CONTEXT_READY';
  return {root,graph,reads,workPath,work,checkout,tool,result:{state,basis,context:{projectId:graph.status.projectId,currentItem:current,parents,dependencies,returnStack:work.returnStack,blockers,reviews,nextAction:work.nextAction,checkpointRef:work.checkpointRef,sources,checkout,operationalObservations:graph.status.data.deploymentObservations},
    attention,verification:'BOUND_CONTEXT_NOT_EXECUTION_AUTHORITY',executionAuthorized:false}};
}
export function readResume(root,request,hooks={}) {return inspect(root,request,hooks).result;}

export function prepareContinuation(root,request) {
  root=input(root,request);if(request.operation!=='SAVE')fail('SAVE_REQUEST_REQUIRED');
  const grant=request.permission;
  if(grant.allowSaveContinuation!==true||!text(grant.statement)||!grant.assumptions||!['localNtfs','noActiveSync','singleKideaRun'].every(k=>grant.assumptions[k]===true))fail('SAVE_PERMISSION_REQUIRED');
  const inspected=inspect(root,request),{result,graph,reads,workPath,work,checkout,tool}=inspected;
  if(!['CONTEXT_READY','WAITING'].includes(result.state)||!work?.currentItemId)fail('CONTINUATION_NOT_AVAILABLE');
  if(request.expectedBasis!==result.basis)fail('RESUME_BASIS_CHANGED');
  const note=request.checkpoint;
  if(!closed(note,['itemId','completed','remaining','nextAction','sourceRefs'])||note.itemId!==work.currentItemId||![note.completed,note.remaining,note.nextAction].every(text)||!Array.isArray(note.sourceRefs)||!note.sourceRefs.length)fail('CONTINUATION_NOTE_REQUIRED');
  const operationId=randomUUID(),prefix=`.kidea/checkpoints/operations/${operationId}/`,evidence=[];
  const capture=(bytes,source=null)=>{
    if(source&&grant.allowReadLocalGit){const git=findGitVersion(root,source.path,bytes,source.anchor);if(git)return git;}
    const p=prefix+`context-${evidence.length}.bin`;evidence.push({path:p,bytes});return {source:source??ref(p),location:{kind:'SNAPSHOT',ref:ref(p)},integrity:byteIntegrity(bytes)};
  };
  const permission=capture(Buffer.from(grant.statement));
  const inputs=[capture(Buffer.from(JSON.stringify({basis:result.basis,checkout,note,reviewComparisons:request.reviewComparisons},null,2)))];
  for(const r of note.sourceRefs){if(!validate(r,'Ref',()=>{})||!reads.has(r.path))fail('NOTE_SOURCE_NOT_IN_BASIS');inputs.push(capture(reads.get(r.path),r));}
  const next=structuredClone(work);
  next.nextAction=`Đã làm (ghi nhận, không tự xác nhận DONE): ${note.completed}\nCòn dở: ${note.remaining}\nTiếp theo: ${note.nextAction}`;
  next.checkpointRef=ref(prefix+'checkpoint.md');
  const old=graph.reads.get(workPath),planned=Buffer.from(new TextDecoder('utf-8',{fatal:true}).decode(old).replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_m,a,b)=>a+JSON.stringify(next,null,2)+b));
  const targets=[{path:workPath,action:'UPDATE',plannedBytes:planned}],comparisons=request.reviewComparisons??[],reviewPaths=[];
  if(!Array.isArray(comparisons)||!same(grant.preserveReviewIds??[],comparisons.map(c=>c.id))||new Set(comparisons.map(c=>c.id)).size!==comparisons.length)fail('PRESERVATION_SCOPE_REQUIRED');
  for(const c of comparisons) {
    if(!closed(c,['id','revision','expectedDigest','checkpoint','comparison'])||!same(c.checkpoint,note))fail('CONTINUATION_COMPARISON_REQUIRED');
    const reviewPath=`.kidea/reviews/${c.id}.md`,current=graph.records.get(reviewPath),oldBytes=reads.get(reviewPath);
    if(!current||current.kind!=='review'||c.revision!==current.revision||c.expectedDigest!==hashBytes(oldBytes))fail('REVIEW_VERSION_OR_SCOPE_DIFFERS');
    const versions=[...current.subjectVersions,...current.inputVersions];
    if(!versions.some(v=>v.source?.path===workPath))fail('REVIEW_NOT_AFFECTED');
    if(versions.some(v=>!v.source||!reads.has(v.source.path)))fail('COMPARISON_SOURCE_DIFFERS');
    const currentSources=versions.map(v=>({ref:v.source,integrity:byteIntegrity(reads.get(v.source.path))}));
    if(!same(c.comparison?.currentSources,currentSources))fail('COMPARISON_SOURCE_DIFFERS');
    const cmp=structuredClone(c.comparison);
    // The caller assesses the exact note against the READ basis. Only its two
    // derived work fields (including the generated checkpoint ID) are rebased.
    cmp.currentSources=versions.map(v=>({ref:v.source,integrity:byteIntegrity(v.source.path===workPath?planned:reads.get(v.source.path))}));
    const captureReview=(bytes,source)=>{
      if(grant.allowReadLocalGit){const git=findGitVersion(root,source.path,bytes,source.anchor);if(git)return git;}
      if(!localEntry(root,'.kidea/reviews/evidence')?.stat.isDirectory())fail('REVIEW_EVIDENCE_DIRECTORY_REQUIRED');
      const p=`.kidea/reviews/evidence/${c.id}-${operationId}-${targets.length}.md`;
      targets.push({path:p,action:'CREATE',plannedBytes:bytes});
      return {source,location:{kind:'SNAPSHOT',ref:ref(p)},integrity:byteIntegrity(bytes)};
    };
    const updated=preserveReview(current,cmp,{read:r=>r.path===workPath?planned:reads.get(r.path),capture:captureReview,oldBytes,reviewPath,knownIds:graph.status.data.items.map(i=>i.id)});
    const bytes=Buffer.from(new TextDecoder('utf-8',{fatal:true}).decode(oldBytes).replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_m,a,b)=>a+JSON.stringify(updated,null,2)+b));
    targets.push({path:reviewPath,action:'UPDATE',plannedBytes:bytes});reviewPaths.push(reviewPath);
  }
  const authorization={root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),allowRestoreUpdate:false,allowRetireOwnPending:true,allowReadLocalGit:grant.allowReadLocalGit,assumptions:grant.assumptions};
  const prepared=prepareInternalContinuationWrite({root,authorization,context:{projectId:graph.status.projectId,ownerId:work.currentItemId,tool,permissionRefs:[permission],inputRefs:inputs},targets,operationId},{evidence,checkout,inputs:reads,reviewPaths});
  const bound=new Map(JSON.parse(prepared.line).inputs.map(i=>[i.path,i.expectedBase64]));
  for(const [p,b]of reads)if(bound.get(p)!==b.toString('base64'))fail('SOURCE_CHANGED');
  return {prepared,itemId:work.currentItemId};
}
export async function resume(root,request) {
  if(request?.operation!=='SAVE')return readResume(root,request);
  const plan=prepareContinuation(root,request),writer=await executeInternalWrite(plan.prepared);
  return {state:writer.state==='COMPLETED_BYTES'?'CONTINUATION_SAVED':'CONTINUATION_NOT_COMPLETE',itemId:plan.itemId,writer,verification:'SAVED_NOTE_NOT_TASK_COMPLETION'};
}
