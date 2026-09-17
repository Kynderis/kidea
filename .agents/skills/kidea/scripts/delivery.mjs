// Records supplied evidence only. No process, network, build or deploy executor.
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {parseTree} from 'jsonc-parser';
import {inspectResumeContext} from './resume.mjs';
import {byteIntegrity,recordBytes} from './bootstrap-plan.mjs';
import {validate,validPath} from './schema.mjs';
import {hasLocalAssumptions} from './runtime.mjs';
import {prepareInternalDeliveryRecord,executeInternalWrite} from './write-internal.mjs';
const fail=code=>{throw Object.assign(new Error(code),{code});};
const text=x=>typeof x==='string'&&x.trim().length>0;
const closed=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).every(k=>keys.includes(k));
const ref=path=>({path,anchor:null});
const json=b=>{const t=new TextDecoder('utf-8',{fatal:true}).decode(b),errors=[],tree=parseTree(t,errors,{disallowComments:true,allowTrailingComma:false});if(!tree||errors.length)fail('DELIVERY_JSON_INVALID');const walk=n=>{if(n.type==='object'&&new Set(n.children.map(p=>p.children[0].value)).size!==n.children.length)fail('DELIVERY_JSON_INVALID');for(const c of n.children??[])walk(c);};walk(tree);return JSON.parse(t);};
const rewrite=(b,r)=>Buffer.from(b.toString('utf8').replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_m,a,z)=>a+JSON.stringify(r,null,2)+z));

export function prepareDelivery(root,q) {
 if(!closed(q,['operation','permission','expectedBasis','expectedProjectId','expectedOwnerId','expectedGit','requiredFiles','proposalRef','reviewId','conditionsMet','statement'])||!['RECORD_RELEASE','START_OPERATION','OBSERVE_OPERATION'].includes(q.operation))fail('DELIVERY_INPUT_INVALID');
 const p=q.permission;
 if(!closed(p,['root','readProject','allowReadLocalGit','allowDeliveryRecord','recordPath','ownerId','statement','assumptions'])||p.allowDeliveryRecord!==true||p.ownerId!==q.expectedOwnerId||!text(p.statement)||!hasLocalAssumptions(p.assumptions)||q.conditionsMet!==true||!text(q.statement)||!validPath(p.recordPath)||p.recordPath.startsWith('.kidea/')||!p.recordPath.endsWith('.md'))fail('DELIVERY_PERMISSION_REQUIRED');
 const s=inspectResumeContext(root,{operation:'READ',permission:{root:p.root,readProject:p.readProject,allowReadLocalGit:p.allowReadLocalGit},expectedProjectId:q.expectedProjectId,expectedGit:q.expectedGit,requiredFiles:q.requiredFiles});
 const {result,work,workPath,reads,graph,checkout}=s;
 if(!['CONTEXT_READY','WAITING'].includes(result.state)||!work?.currentItemId)fail('DELIVERY_CONTEXT_BLOCKED');
 if(q.expectedBasis!==result.basis||q.expectedProjectId!==work.projectId||q.expectedOwnerId!==work.currentItemId||!same(q.expectedGit,checkout))fail('DELIVERY_BASIS_CHANGED');
 if(result.context.impact.some(i=>!i.current||i.verdict==='UNKNOWN'||i.recordedStatus!=='DONE'))fail('DELIVERY_IMPACT_ACTIVE');
 if(!validate(q.proposalRef,'Ref',()=>{})||q.proposalRef.anchor!==null||!reads.has(q.proposalRef.path)||q.proposalRef.path.startsWith('.kidea/')||q.proposalRef.path===p.recordPath)fail('DELIVERY_PROPOSAL_REQUIRED');
 let plan;try{plan=json(reads.get(q.proposalRef.path));}catch{fail('DELIVERY_PROPOSAL_INVALID');}
 if(plan?.operation!==q.operation||plan.recordPath!==p.recordPath||!text(plan.nextAction))fail('DELIVERY_PROPOSAL_INVALID');
 const old=graph.records.get(p.recordPath),operationId=randomUUID(),prefix=`.kidea/checkpoints/operations/${operationId}/`,evidence=[];
 const capture=(bytes,source=null)=>{const path=prefix+`context-${evidence.length}.bin`;evidence.push({path,bytes});return {source:source??ref(path),location:{kind:'SNAPSHOT',ref:ref(path)},integrity:byteIntegrity(bytes)};};
 const sourceRefs=[];
 const pin=r=>{if(!validate(r,'Ref',()=>{})||r.anchor!==null||!reads.has(r.path)||r.path===p.recordPath)fail('DELIVERY_SOURCE_REQUIRED');sourceRefs.push(r);return capture(reads.get(r.path),r);};
 const pins=rs=>{if(!Array.isArray(rs))fail('DELIVERY_SOURCE_REQUIRED');return rs.map(pin);};
 const permission=capture(Buffer.from(p.statement)),inputs=[capture(Buffer.from(JSON.stringify(q))),pin(q.proposalRef)];
 const header=kind=>({schemaVersion:2,projectId:work.projectId,kind});
 let next;
 if(q.operation==='RECORD_RELEASE') {
  if(!closed(plan,['operation','recordPath','nextAction','id','revision','productVersion','components','configRefs','schemaRefs','scriptRefs','evidenceRefs','executionPlanRef','recoveryPlanRef'])||old&&(old.kind!=='release'||old.id!==plan.id||plan.revision!==old.revision+1)||!old&&plan.revision!==1||!Array.isArray(plan.components)||!plan.components.length)fail('DELIVERY_RELEASE_REVISION');
  next={...header('release'),id:plan.id,revision:plan.revision,productVersion:plan.productVersion,components:plan.components.map(c=>{
   if(!closed(c,['id','version','sourceRefs','artifactRef'])||!Array.isArray(c.sourceRefs)||!c.sourceRefs.length||!c.artifactRef)fail('DELIVERY_COMPONENT_REQUIRED');
   return {id:c.id,version:c.version,sourceRefs:pins(c.sourceRefs),artifactRef:pin(c.artifactRef)};
  }),configRefs:pins(plan.configRefs),schemaRefs:pins(plan.schemaRefs),scriptRefs:pins(plan.scriptRefs),evidenceRefs:pins(plan.evidenceRefs),approvalRefs:[],executionPlanRef:pin(plan.executionPlanRef),recoveryPlanRef:pin(plan.recoveryPlanRef)};
  if(!next.scriptRefs.length||!next.evidenceRefs.length)fail('DELIVERY_EXECUTION_EVIDENCE_REQUIRED');
  let execution;try{execution=json(reads.get(plan.executionPlanRef.path));}catch{fail('DELIVERY_EXECUTION_PLAN_REQUIRED');}
  if(!closed(execution,['stepIds'])||!Array.isArray(execution.stepIds)||!execution.stepIds.length||execution.stepIds.some(x=>!text(x))||new Set(execution.stepIds).size!==execution.stepIds.length)fail('DELIVERY_EXECUTION_PLAN_REQUIRED');
  const entry=[...graph.records].find(([,r])=>r.kind==='review'&&r.id===q.reviewId),review=entry?.[1];
  if(!review||review.status!=='APPROVED'||!review.ownerIds.includes(work.currentItemId)||!sourceRefs.every(r=>[...review.subjectVersions,...review.inputVersions].some(v=>v.source?.path===r.path&&v.source.anchor===null)))fail('DELIVERY_RELEASE_APPROVAL_REQUIRED');
  next.approvalRefs=[pin(ref(entry[0]))];
 } else if(q.operation==='START_OPERATION') {
  if(!closed(plan,['operation','recordPath','nextAction','id','releasePath','releaseId','releaseRevision','releaseIntegrity','previousAttemptId','environment','targetId','actor','startedAt'])||old)fail('DELIVERY_ATTEMPT_CREATE_ONLY');
  const release=graph.records.get(plan.releasePath);
  if(release?.kind!=='release'||release.id!==plan.releaseId||release.revision!==plan.releaseRevision||!same(byteIntegrity(reads.get(plan.releasePath)),plan.releaseIntegrity))fail('DELIVERY_RELEASE_IDENTITY');
  if(plan.previousAttemptId!==null){const prior=[...graph.records.values()].find(r=>r.kind==='operation'&&r.id===plan.previousAttemptId);if(!prior||prior.targetId!==plan.targetId||prior.environment!==plan.environment)fail('DELIVERY_PREVIOUS_ATTEMPT');}
  next={...header('operation'),id:plan.id,release:{path:plan.releasePath,id:release.id,revision:release.revision,recordVersion:pin(ref(plan.releasePath))},previousAttemptId:plan.previousAttemptId,environment:plan.environment,targetId:plan.targetId,actor:plan.actor,tool:s.tool,startedAt:plan.startedAt,observations:[]};
 } else {
  if(!closed(plan,['operation','recordPath','nextAction','observationId','receiptRef'])||old?.kind!=='operation')fail('DELIVERY_ATTEMPT_REQUIRED');
  const receiptVersion=pin(plan.receiptRef);let receipt;
  try{receipt=json(reads.get(plan.receiptRef.path));}catch{fail('DELIVERY_READBACK_INVALID');}
  const versionBytes=v=>v.location.kind==='SNAPSHOT'?reads.get(v.location.ref.path):v.location.kind==='GIT'?graph.gitReads.get(JSON.stringify(v.location))?.bytes:null;
  const releaseBytes=versionBytes(old.release.recordVersion);
  if(!releaseBytes||!same(byteIntegrity(releaseBytes),old.release.recordVersion.integrity))fail('DELIVERY_PIN_UNAVAILABLE');
  const release=JSON.parse(releaseBytes.toString('utf8').match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
  if(!closed(receipt,['operationId','releaseId','releaseRevision','releaseIntegrity','environment','targetId','at','scriptIntegrities','schemaIntegrities','components','steps'])||receipt.operationId!==old.id||receipt.releaseId!==release.id||receipt.releaseRevision!==release.revision||!same(receipt.releaseIntegrity,old.release.recordVersion.integrity)||receipt.environment!==old.environment||receipt.targetId!==old.targetId||!Array.isArray(receipt.scriptIntegrities)||!Array.isArray(receipt.schemaIntegrities)||[...receipt.scriptIntegrities,...receipt.schemaIntegrities].some(v=>!validate(v,'Integrity',()=>{}))||!Array.isArray(receipt.components)||!Array.isArray(receipt.steps)||!receipt.components.length&&!receipt.steps.length)fail('DELIVERY_READBACK_IDENTITY');
  if([...receipt.components,...receipt.steps].some(x=>x.result==='SUCCEEDED')&&(!same(receipt.scriptIntegrities,release.scriptRefs.map(v=>v.integrity))||!same(receipt.schemaIntegrities,release.schemaRefs.map(v=>v.integrity))))fail('DELIVERY_READBACK_EXECUTION');
  const executionBytes=versionBytes(release.executionPlanRef);
  if(!executionBytes||!same(byteIntegrity(executionBytes),release.executionPlanRef.integrity))fail('DELIVERY_PIN_UNAVAILABLE');
  const execution=json(executionBytes);
  const components=receipt.components.map(c=>{
   const expected=release.components.find(x=>x.id===c.id);
   if(!closed(c,['id','result','artifactRef','configRefs','detail'])||!expected)fail('DELIVERY_READBACK_COMPONENT');
   const artifactRef=c.artifactRef===null?null:pin(c.artifactRef),configRefs=pins(c.configRefs);
   if(c.result==='SUCCEEDED'&&(!artifactRef||!same(artifactRef.integrity,expected.artifactRef?.integrity)||!same(configRefs.map(v=>v.integrity),release.configRefs.map(v=>v.integrity))))fail('DELIVERY_READBACK_ARTIFACT');
   return {id:c.id,result:c.result,artifactRef,configRefs,detail:c.detail};
  });
  const steps=receipt.steps.map(t=>{
   if(!closed(t,['id','result','evidenceRefs','detail'])||!execution.stepIds.includes(t.id)||t.result==='SUCCEEDED'&&!t.evidenceRefs?.length)fail('DELIVERY_READBACK_STEP');
   return {id:t.id,result:t.result,evidenceRefs:pins(t.evidenceRefs),detail:t.detail};
  });
  next=structuredClone(old);next.observations.push({id:plan.observationId,at:receipt.at,sourceRefs:[receiptVersion],components,steps});
 }
 if(!validate(next,next.kind,()=>{}))fail('DELIVERY_RECORD_INVALID');
 const indexEntry=[...graph.records].find(([,r])=>r.kind==='index'),[indexPath,index]=indexEntry,updatedIndex=structuredClone(index),updatedWork=structuredClone(work);
 if(!updatedIndex.sources.some(s=>s.role==='operations'&&s.ref.path===p.recordPath))updatedIndex.sources.push({role:'operations',ref:ref(p.recordPath)});
 updatedWork.checkpointRef=ref(prefix+'checkpoint.md');updatedWork.nextAction=plan.nextAction;
 const targets=[{path:workPath,action:'UPDATE',plannedBytes:rewrite(reads.get(workPath),updatedWork)},{path:indexPath,action:'UPDATE',plannedBytes:rewrite(reads.get(indexPath),updatedIndex)},{path:p.recordPath,action:old?'UPDATE':'CREATE',plannedBytes:old?rewrite(reads.get(p.recordPath),next):recordBytes(next)}];
 const authorization={root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),allowRestoreUpdate:false,allowRetireOwnPending:true,allowReadLocalGit:p.allowReadLocalGit,assumptions:p.assumptions};
 return {prepared:prepareInternalDeliveryRecord({root,authorization,context:{projectId:work.projectId,ownerId:work.currentItemId,tool:s.tool,permissionRefs:[permission],inputRefs:inputs},targets,operationId},{evidence,checkout,inputs:reads,workPath,indexPath,recordPath:p.recordPath}),operation:q.operation};
}
export async function recordDelivery(root,q){const p=prepareDelivery(root,q),writer=await executeInternalWrite(p.prepared);return {state:writer.state==='COMPLETED_BYTES'?'DELIVERY_RECORDED':'DELIVERY_NOT_COMPLETE',operation:p.operation,writer,verification:'RECORDED_CALLER_READBACK_NOT_LIVE_HEALTH_OR_DEPLOYMENT'};}
