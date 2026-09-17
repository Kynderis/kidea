// Explicit, reviewed changes to the one work tree. Never product execution.
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {parseTree} from 'jsonc-parser';
import {inspectResumeContext} from './resume.mjs';
import {byteIntegrity} from './bootstrap-plan.mjs';
import {validate} from './schema.mjs';
import {hasLocalAssumptions} from './runtime.mjs';
import {isRecordedComplete} from './recorded-completion.mjs';
import {prepareInternalWorkTransition,executeInternalWrite} from './write-internal.mjs';
const fail=code=>{throw Object.assign(new Error(code),{code});};
const text=x=>typeof x==='string'&&x.trim().length>0;
const closed=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>keys.includes(k));
const ref=path=>({path,anchor:null});
const structural=i=>{const n=structuredClone(i);for(const k of ['gateIds','resultRefs','executionStatus','source'])delete n[k];return n;};
const rewrite=(b,r)=>Buffer.from(b.toString('utf8').replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_m,a,z)=>a+JSON.stringify(r,null,2)+z));

export function prepareWorkCycle(root,q) {
 if(!closed(q,['operation','permission','expectedBasis','expectedProjectId','expectedOwnerId','expectedGit','requiredFiles','proposalRef','reviewId','conditionsMet','statement'])||!['REPLAN_WORK','CREATE_ROUND','SWITCH_ROUND','RETURN_ROUND'].includes(q.operation))fail('CYCLE_INPUT_INVALID');
 const p=q.permission;
 if(!closed(p,['root','readProject','allowReadLocalGit','allowWorkCycle','ownerId','statement','assumptions'])||p.allowWorkCycle!==true||p.ownerId!==q.expectedOwnerId||!text(p.statement)||!hasLocalAssumptions(p.assumptions)||q.conditionsMet!==true||!text(q.statement))fail('CYCLE_PERMISSION_REQUIRED');
 const s=inspectResumeContext(root,{operation:'READ',permission:{root:p.root,readProject:p.readProject,allowReadLocalGit:p.allowReadLocalGit},expectedProjectId:q.expectedProjectId,expectedGit:q.expectedGit,requiredFiles:q.requiredFiles});
 const {result,work,workPath,reads,graph,checkout}=s;
 if(!['CONTEXT_READY','WAITING'].includes(result.state)||!work?.currentItemId)fail('CYCLE_CONTEXT_BLOCKED');
 if(q.expectedBasis!==result.basis||q.expectedProjectId!==work.projectId||q.expectedOwnerId!==work.currentItemId||!same(q.expectedGit,checkout))fail('CYCLE_BASIS_CHANGED');
 if(work.returnStack.some(r=>!r.reason.startsWith('ROUND_RETURN:')&&!r.reason.startsWith('WORK_RETURN:'))||result.context.impact.some(i=>!i.current||i.verdict==='UNKNOWN'||i.recordedStatus!=='DONE'))fail('CYCLE_IMPACT_ACTIVE');
 if(!validate(q.proposalRef,'Ref',()=>{})||q.proposalRef.anchor!==null||!reads.has(q.proposalRef.path)||q.proposalRef.path.startsWith('.kidea/'))fail('CYCLE_PROPOSAL_REQUIRED');
 let plan;try{const t=new TextDecoder('utf-8',{fatal:true}).decode(reads.get(q.proposalRef.path)),errors=[],tree=parseTree(t,errors,{disallowComments:true,allowTrailingComma:false});if(!tree||errors.length)fail('CYCLE_PROPOSAL_INVALID');const walk=n=>{if(n.type==='object'&&new Set(n.children.map(p=>p.children[0].value)).size!==n.children.length)fail('CYCLE_PROPOSAL_INVALID');for(const c of n.children??[])walk(c);};walk(tree);plan=JSON.parse(t);}catch{fail('CYCLE_PROPOSAL_INVALID');}
 if(!closed(plan,['operation','reason','nextAction','items','dispositions','nextItemId','round','baselineRef','targetRoundId'])||plan.operation!==q.operation||!text(plan.reason)||!text(plan.nextAction))fail('CYCLE_PROPOSAL_INVALID');
 const review=[...graph.records.values()].find(r=>r.kind==='review'&&r.id===q.reviewId);
 if(!review||review.status!=='APPROVED'||!review.ownerIds.includes(work.currentItemId))fail('CYCLE_APPROVAL_REQUIRED');
 const covered=refs=>refs.every(r=>validate(r,'Ref',()=>{})&&reads.has(r.path)&&[...review.subjectVersions,...review.inputVersions].some(v=>v.source?.path===r.path&&(v.source.anchor===null||v.source.anchor===r.anchor)));
 if(!covered([q.proposalRef]))fail('CYCLE_REVIEW_COVERAGE');
 const next=structuredClone(work),items=graph.status.data.items,approved=new Set(result.context.reviews.filter(r=>r.recordedStatus==='APPROVED').map(r=>r.id));
 const complete=id=>isRecordedComplete(id,items,approved);
 const extras=allowed=>{for(const key of ['items','dispositions','nextItemId','round','baselineRef','targetRoundId'])if(plan[key]!==undefined&&!allowed.includes(key))fail('CYCLE_OPERATION_SCOPE');};
 const mkItem=(definition,old,disposition)=>{
  if(!closed(definition,['id','roundId','name','kind','parentId','shape','decomposition','scopeRef','inputRefs','completionRef','dependencyIds']))fail('CYCLE_ITEM_INVALID');
  const item={...structuredClone(definition),gateIds:old?.gateIds??[],resultRefs:old?.resultRefs??[],executionStatus:definition.shape==='GROUP'?null:disposition==='PRESERVE'?old?.executionStatus:'TODO'};
  if(!validate(item,'Item',()=>{})||!covered([item.scopeRef,item.completionRef,...item.inputRefs]))fail('CYCLE_ITEM_OR_COVERAGE_INVALID');return item;
 };
 if(q.operation==='REPLAN_WORK') {
  extras(['items','dispositions','nextItemId']);
  if(!Array.isArray(plan.items)||!plan.items.length||!Array.isArray(plan.dispositions))fail('CYCLE_DISPOSITION_REQUIRED');
  const old=work.items.filter(i=>i.roundId===work.currentRoundId),oldIds=new Set(old.map(i=>i.id)),known=new Set(items.map(i=>i.id));
  if(plan.dispositions.length!==old.length||new Set(plan.dispositions.map(d=>d.id)).size!==old.length||plan.dispositions.some(d=>!closed(d,['id','decision','reason'])||!oldIds.has(d.id)||!['PRESERVE','REASSESS','RETIRE'].includes(d.decision)||!text(d.reason)))fail('CYCLE_DISPOSITION_REQUIRED');
  const decisions=new Map(plan.dispositions.map(d=>[d.id,d.decision])),retired=new Set(old.filter(i=>decisions.get(i.id)==='RETIRE').map(i=>i.id));
  if(retired.has(work.currentItemId)||work.returnStack.some(r=>retired.has(r.itemId))||old.some(i=>i.kind==='STEP'&&retired.has(i.id)))fail('CYCLE_RETIRE_SCOPE');
  const seen=new Set(),changed=new Set();
  const proposed=plan.items.map(d=>{
   if(seen.has(d.id)||d.roundId!==work.currentRoundId||retired.has(d.id)||known.has(d.id)&&!oldIds.has(d.id))fail('CYCLE_ITEM_ID');seen.add(d.id);
   const prior=old.find(i=>i.id===d.id),decision=prior?decisions.get(d.id):'REASSESS';
   if(prior&&decision==='PRESERVE'&&!same(structural(prior),d))fail('CYCLE_PRESERVE_CHANGED');
   if(prior?.kind==='STEP'&&(d.kind!=='STEP'||d.parentId!==null))fail('CYCLE_STEP_REQUIRED');
   if(decision!=='PRESERVE')changed.add(d.id);
   return decision==='PRESERVE'?structuredClone(prior):mkItem(d,prior,decision);
  });
  if(old.some(i=>!retired.has(i.id)&&!seen.has(i.id)))fail('CYCLE_DISPOSITION_REQUIRED');
  const steps=proposed.filter(i=>i.kind==='STEP'),oldSteps=old.filter(i=>i.kind==='STEP');
  if(steps.length!==10||!same(steps.map(i=>i.id),oldSteps.map(i=>i.id))||steps.some((i,n)=>!same(i.dependencyIds,n?[steps[n-1].id]:[])))fail('CYCLE_STEP_DEPENDENCIES');
  // A changed producer cannot silently preserve a DONE consumer or ancestor.
  const affected=new Set([...changed,...retired]);let again=true;
  while(again){again=false;for(const i of [...old,...proposed])if(!affected.has(i.id)&&(i.dependencyIds.some(id=>affected.has(id))||[...old,...proposed].some(c=>c.parentId===i.id&&affected.has(c.id)))){affected.add(i.id);again=true;}}
  if(old.some(i=>decisions.get(i.id)==='PRESERVE'&&affected.has(i.id)))fail('CYCLE_CONSUMER_REASSESS_REQUIRED');
  const discardReviews=new Set([...graph.records.values()].filter(r=>r.kind==='review'&&r.id!==q.reviewId&&r.ownerIds.some(id=>affected.has(id))).map(r=>r.id));
  if(review.ownerIds.some(id=>retired.has(id)))fail('CYCLE_REVIEW_OWNER_RETIRED');
  next.reviewRefs=next.reviewRefs.filter(r=>!discardReviews.has(graph.records.get(r.path)?.id));
  next.items=[...next.items.filter(i=>i.roundId!==work.currentRoundId),...proposed];
  for(const i of next.items)i.gateIds=i.gateIds.filter(id=>!discardReviews.has(id));
  next.blockers=next.blockers.filter(b=>!retired.has(b.itemId));
  if(!seen.has(plan.nextItemId))fail('CYCLE_TARGET_REQUIRED');
  // Replanning can return to step1 without losing an in-progress leaf.
  for(const i of next.items)if(i.executionStatus==='IN_PROGRESS'&&i.id!==plan.nextItemId&&!next.returnStack.some(r=>r.itemId===i.id))next.returnStack.push({itemId:i.id,reason:`WORK_RETURN:${i.roundId}`,nextAction:work.nextAction});
  next.currentItemId=plan.nextItemId;
 } else if(q.operation==='CREATE_ROUND') {
  extras(['round','items','baselineRef']);
  if(!validate(plan.round,'Round',()=>{})||!['CHANGE','BUGFIX'].includes(plan.round.type)||work.rounds.some(r=>r.id===plan.round.id)||!covered([plan.baselineRef,...plan.round.scopeRefs]))fail('CYCLE_BASELINE_REQUIRED');
  if(plan.round.type==='BUGFIX'&&plan.round.releaseRef===null)fail('CYCLE_BUGFIX_RELEASE_REQUIRED');
  if(!Array.isArray(plan.items)||plan.items.length!==10)fail('CYCLE_TEN_STEPS_REQUIRED');
  const added=plan.items.map(d=>mkItem(d,null,'REASSESS'));
  if(new Set(added.map(i=>i.id)).size!==10||added.some(i=>items.some(old=>old.id===i.id)||i.roundId!==plan.round.id||i.kind!=='STEP'||i.parentId!==null||i.shape!=='GROUP'||i.decomposition!=='UNEXPANDED'))fail('CYCLE_TEN_STEPS_REQUIRED');
  for(const [index,i]of added.entries())if(!same(i.dependencyIds,index?[added[index-1].id]:[]))fail('CYCLE_STEP_DEPENDENCIES');
  next.rounds.push(structuredClone(plan.round));next.items.push(...added);
  for(const i of added)next.blockers.push({itemId:i.id,reason:'New round step has no reviewed output yet.',needed:'Prepare the step, materialize the applicable Human gate and verify its outputs.'});
 } else if(q.operation==='SWITCH_ROUND') {
  extras(['targetRoundId','nextItemId']);
  const target=next.items.find(i=>i.id===plan.nextItemId);
  if(!target||target.roundId!==plan.targetRoundId||target.roundId===work.currentRoundId||target.kind!=='STEP'||target.parentId!==null||target.dependencyIds.length||complete(target.id)||work.returnStack.some(r=>items.find(i=>i.id===r.itemId)?.roundId===target.roundId))fail('CYCLE_TARGET_REQUIRED');
  next.returnStack.push({itemId:work.currentItemId,reason:`ROUND_RETURN:${target.roundId}`,nextAction:work.nextAction});next.currentRoundId=target.roundId;next.currentItemId=target.id;
 } else {
  extras([]);const back=next.returnStack.at(-1),target=items.find(i=>i.id===back?.itemId);
  if(!back||back.reason!==`ROUND_RETURN:${work.currentRoundId}`||!target)fail('CYCLE_RETURN_REQUIRED');
  const current=items.filter(i=>i.roundId===work.currentRoundId);
  if(!current.some(i=>i.kind==='STEP')||current.filter(i=>i.kind==='STEP').some(i=>!complete(i.id))||work.blockers.some(b=>b.itemId===null||current.some(i=>i.id===b.itemId)))fail('CYCLE_ROUND_INCOMPLETE');
  next.returnStack.pop();next.currentRoundId=target.roundId;next.currentItemId=target.id;
 }
 const operationId=randomUUID(),prefix=`.kidea/checkpoints/operations/${operationId}/`,evidence=[];
 const capture=(bytes,source=null)=>{const p=prefix+`context-${evidence.length}.bin`;evidence.push({path:p,bytes});return {source:source??ref(p),location:{kind:'SNAPSHOT',ref:ref(p)},integrity:byteIntegrity(bytes)};};
 const permission=capture(Buffer.from(p.statement)),inputs=[capture(Buffer.from(JSON.stringify(q)))];
 // Retained review bytes prove retired/superseded owners without keeping them
 // as live approvals. Original files and the whole work preimage are retained.
 for(const [p,b]of reads)if(!p.startsWith('.kidea/')||graph.records.get(p)?.kind==='review')inputs.push(capture(b,ref(p)));
 next.nextAction=plan.nextAction;next.checkpointRef=ref(prefix+'checkpoint.md');
 const targets=[{path:workPath,action:'UPDATE',plannedBytes:rewrite(reads.get(workPath),next)}],authorization={root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),allowRestoreUpdate:false,allowRetireOwnPending:true,allowReadLocalGit:p.allowReadLocalGit,assumptions:p.assumptions};
 return {prepared:prepareInternalWorkTransition({root,authorization,context:{projectId:work.projectId,ownerId:work.currentItemId,tool:s.tool,permissionRefs:[permission],inputRefs:inputs},targets,operationId},{evidence,checkout,inputs:reads,workPath,mode:'CYCLE'}),operation:q.operation};
}
export async function cycleWork(root,q){const p=prepareWorkCycle(root,q),writer=await executeInternalWrite(p.prepared);return {state:writer.state==='COMPLETED_BYTES'?'WORK_RECORDED':'WORK_NOT_COMPLETE',operation:p.operation,writer,verification:'BOUND_METADATA_NOT_PRODUCT_EXECUTION_OR_HUMAN_AUTHENTICATION'};}
