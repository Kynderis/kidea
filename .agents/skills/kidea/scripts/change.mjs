// Trusted metadata orchestration, not a product executor. Semantic assertions
// remain reviewable evidence; neither project text nor a status label is a grant.
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {readResume} from './resume.mjs';
import {inspectStatusGraph} from './status.mjs';
import {localEntry,byteIntegrity,recordBytes} from './bootstrap-plan.mjs';
import {hasLocalAssumptions} from './runtime.mjs';
import {mapDigest} from './maps.mjs';
import {affectedNodes,impactReferences,impactPlan,impactItemId,assessmentCurrent,validateAssessment,intakeDecision} from './impact.mjs';
import {prepareInternalImpactWrite,executeInternalWrite} from './write-internal.mjs';

const fail=code=>{throw Object.assign(new Error(code),{code});};
const ref=path=>({path,anchor:null});
const text=v=>typeof v==='string'&&v.trim().length>0;
const closed=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
const planPath='.kidea/plans/impact.md';
const json=b=>JSON.parse(b.toString('utf8'));
function identity() {
  return {version:'kidea-change-r1',components:['change.mjs','impact.mjs','maps.mjs','maps-cpp.mjs','maps-web.mjs','resume.mjs','write-internal.mjs','schema.mjs','status.mjs'].map(name=>({name,integrity:byteIntegrity(readFileSync(new URL(name,import.meta.url)))}))};
}
function inspect(root,request) {
  if(!closed(request,['operation','permission','expectedProjectId','expectedRoundId','expectedOwnerId','expectedGit','expectedBasis','graph','replacement','assessment','closure','requiredFiles','intake'])||!['READ','OPEN','REPLAN','REFRESH','ASSESS','CLOSE'].includes(request.operation))fail('CHANGE_INPUT_INVALID');
  const grant=request.permission;
  if(!closed(grant,['root','readProject','allowReadLocalGit','allowImpactWrite','allowImpactReplan','roundId','ownerId','assumptions','statement']))fail('CHANGE_PERMISSION_INVALID');
  const resumeRequest={operation:'READ',permission:{root:grant.root,readProject:grant.readProject,allowReadLocalGit:grant.allowReadLocalGit},expectedProjectId:request.expectedProjectId,expectedGit:request.expectedGit};
  const initial=readResume(root,resumeRequest);
  if(!initial.context)return {result:{...initial,executionAuthorized:false}};
  const graphState=inspectStatusGraph(root,new Map(),[],{allowGit:grant.allowReadLocalGit});
  const [workPath,work]=[...graphState.records].find(([,r])=>r.kind==='work');
  if(request.expectedRoundId!==undefined&&request.expectedRoundId!==work.currentRoundId)fail('ROUND_DIFFERS');
  if(request.expectedOwnerId!==undefined&&request.expectedOwnerId!==work.currentItemId)fail('OWNER_DIFFERS');
  const oldPlan=graphState.records.get(planPath);
  let graph=request.graph,mapRef=null;
  if(oldPlan) {
    const refs=new Map(oldPlan.items.flatMap(i=>i.inputRefs).filter(r=>/^\.kidea\/checkpoints\/maps\/[a-f0-9-]+\.json$/.test(r.path)).map(r=>[r.path,r]));
    if(refs.size!==1)fail('IMPACT_MAP_AMBIGUOUS');
    mapRef=[...refs.values()][0];const saved=json(graphState.reads.get(mapRef.path));
    if(saved.format!=='kidea-impact-map-artifact-r1')fail('IMPACT_MAP_INVALID');
    if(graph&&!same(graph,saved.graph)&&!request.replacement)fail('IMPACT_GRAPH_REPLACEMENT_REQUIRES_REVIEW');graph=graph??saved.graph;
  }
  const required=[...(request.requiredFiles??[]),...(graph?impactReferences(graph):[]),...(request.assessment?.evidenceRefs??[]),...(request.closure?.evidenceRefs??[]),...(request.replacement?.evidenceRefs??[])];
  const context=readResume(root,{...resumeRequest,requiredFiles:required});
  if(!context.context)return {result:context};
  const reads=new Map(graphState.reads);
  for(const r of required)reads.set(r.path,readFileSync(localEntry(root,r.path).full));
  for(const source of context.context.sources)if(!reads.has(source.path)||!same(byteIntegrity(reads.get(source.path)),source.integrity))fail('SOURCE_CHANGED');
  const tool=identity();
  const sources=graph?[...new Set(impactReferences(graph).map(r=>r.path))].sort().map(p=>({path:p,integrity:byteIntegrity(reads.get(p))})):[];
  const graphDigest=graph?mapDigest(graph):null,inputBasis=mapDigest({graphDigest,sources,tool});
  const states=oldPlan?oldPlan.items.map(item=>{
    const refs=item.resultRefs.filter(r=>r.path.startsWith('.kidea/checkpoints/impact/'));
    const assessment=refs.length?json(reads.get(refs.at(-1).path)):null;
    const current=assessmentCurrent(assessment,inputBasis,graphDigest);
    return {itemId:item.id,recordedStatus:item.executionStatus,current,assessment,status:current&&assessment.verdict!=='UNKNOWN'&&assessment.resolved===true?item.executionStatus:'TODO'};
  }):[];
  const basis=mapDigest({resume:context.basis,tool,inputBasis});
  return {root,request,grant,reads,graphState,workPath,work,oldPlan,mapRef,graph,graphDigest,inputBasis,tool,context,states,
    result:{state:oldPlan?'IMPACT_CONTEXT':graph?'IMPACT_PREPARED':'NO_IMPACT_PLAN',basis,inputBasis,graphDigest,context:context.context,obligations:states,
      diagnostics:graph?.diagnostics??[],intake:request.intake?intakeDecision(request.intake):null,executionAuthorized:false,verification:'BOUND_METADATA_NOT_SEMANTIC_APPROVAL'}};
}
export function readChange(root,request) {return inspect(root,request).result;}
function replaceRecord(bytes,record) {
  return Buffer.from(bytes.toString('utf8').replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_m,a,b)=>a+JSON.stringify(record,null,2)+b));
}
export function prepareChange(root,request) {
  const state=inspect(root,request),{grant,work,oldPlan,graph,reads,tool}=state;
  if(!work||request.operation==='READ')fail('CHANGE_NOT_WRITABLE');
  if(grant.allowImpactWrite!==true||grant.roundId!==work.currentRoundId||grant.ownerId!==work.currentItemId||!text(grant.statement)||!hasLocalAssumptions(grant.assumptions))fail('IMPACT_WRITE_PERMISSION_REQUIRED');
  if(request.expectedProjectId!==work.projectId||request.expectedRoundId!==work.currentRoundId||request.expectedOwnerId!==work.currentItemId||request.expectedBasis!==state.result.basis||!Object.hasOwn(request,'expectedGit')||!same(request.expectedGit,state.context.context.checkout))fail('CHANGE_BASIS_DIFFERS');
  if(!graph)fail('IMPACT_GRAPH_REQUIRED');
  if(request.replacement&&request.operation!=='REPLAN')fail('REPLAN_OPERATION_REQUIRED');
  if(request.operation==='OPEN'?!!oldPlan:!oldPlan)fail('IMPACT_PLAN_PRECONDITION');
  const operationId=randomUUID(),prefix=`.kidea/checkpoints/operations/${operationId}/`,evidence=[];
  function capture(bytes) {
    const p=prefix+`context-${evidence.length}.bin`;evidence.push({path:p,bytes});
    return {source:ref(p),location:{kind:'SNAPSHOT',ref:ref(p)},integrity:byteIntegrity(bytes)};
  }
  const permissionRefs=[capture(Buffer.from(JSON.stringify(grant)))];
  const inputRefs=[capture(Buffer.from(JSON.stringify(request)))];
  const versionByPath=new Map();
  // The writer already binds the whole status graph. Snapshot actual product
  // inputs here, not recursively every historical recovery copy on every save.
  const evidenceSources=new Set([...impactReferences(graph),...(request.requiredFiles??[]),...(request.assessment?.evidenceRefs??[]),...(request.closure?.evidenceRefs??[]),...(request.replacement?.evidenceRefs??[])].map(r=>r.path));
  for(const p of evidenceSources){const v=capture(reads.get(p));v.source=ref(p);inputRefs.push(v);versionByPath.set(p,v);}
  const mapRef=request.operation==='REPLAN'?ref(`.kidea/checkpoints/maps/${operationId}.json`):state.mapRef??ref(`.kidea/checkpoints/maps/${operationId}.json`);
  const parentId=state.context.context.currentItem.shape==='GROUP'?work.currentItemId:state.context.context.parents[0]?.id;
  let plan=oldPlan?structuredClone(oldPlan):impactPlan(graph,{projectId:work.projectId,roundId:work.currentRoundId,mapRef,parentId});
  const next=structuredClone(work),extraTargets=[];
  if(request.operation==='REPLAN') {
    const r=request.replacement;
    if(grant.allowImpactReplan!==true||!r||!text(r.reason)||!Array.isArray(r.evidenceRefs)||!r.evidenceRefs.length||!Array.isArray(r.dispositions))fail('REPLAN_REVIEW_REQUIRED');
    if(oldPlan.items.some(i=>!r.dispositions.some(d=>d.itemId===i.id&&text(d.reason)&&['REASSESS','RETIRED_FROM_SCOPE'].includes(d.verdict))))fail('REPLAN_DISPOSITION_REQUIRED');
    plan=impactPlan(graph,{projectId:work.projectId,roundId:work.currentRoundId,mapRef,parentId});
    for(const item of plan.items){const old=oldPlan.items.find(i=>i.id===item.id);if(old){item.resultRefs=old.resultRefs;item.gateIds=old.gateIds;}}
    // Every replacement is re-evaluated; stable IDs alone cannot preserve meaning.
    extraTargets.push({path:mapRef.path,action:'CREATE',plannedBytes:Buffer.from(JSON.stringify({format:'kidea-impact-map-artifact-r1',graph,replacement:r,inputVersions:inputRefs,tool},null,2)+'\n')});
  }
  for(const s of state.states)if(!s.current&&plan.items.some(i=>i.id===s.itemId))plan.items.find(i=>i.id===s.itemId).executionStatus='TODO';
  if(!oldPlan) {
    extraTargets.push({path:mapRef.path,action:'CREATE',plannedBytes:Buffer.from(JSON.stringify({format:'kidea-impact-map-artifact-r1',graph,inputVersions:inputRefs,tool},null,2)+'\n')});
    next.planRefs.push(ref(planPath));
    next.returnStack.push({itemId:work.currentItemId,reason:'Impact review; retain the original work.',nextAction:work.nextAction});
  }
  if(request.operation==='ASSESS') {
    const node=affectedNodes(graph).find(n=>n.id===request.assessment?.nodeId);if(!node)fail('IMPACT_NODE_NOT_ACTIVE');
    const value=validateAssessment(request.assessment,node,graph,state.inputBasis),item=plan.items.find(i=>i.id===impactItemId(node.id));
    if(item.id!==work.currentItemId)fail('ASSESS_CURRENT_OBLIGATION_ONLY');
    const assessment={...value,format:'kidea-impact-assessment-r1',graphDigest:state.graphDigest,inputVersionRefs:impactReferences(graph).map(r=>versionByPath.get(r.path)),tool};
    const evidenceRef=ref(`.kidea/checkpoints/impact/${operationId}.json`);
    extraTargets.push({path:evidenceRef.path,action:'CREATE',plannedBytes:Buffer.from(JSON.stringify(assessment,null,2)+'\n')});
    item.resultRefs.push(evidenceRef);item.executionStatus=value.verdict==='UNKNOWN'?'IN_PROGRESS':'DONE';
  }
  if(request.operation==='CLOSE') {
    if(!plan.items.some(i=>i.id===work.currentItemId))fail('IMPACT_NOT_ACTIVE');
    const closure=request.closure;
    // Future, independent STEP blockers must not prevent returning to an
    // unfinished MVP. Preserve them; inspect all impact/return ancestors and
    // dependencies, plus global blockers, before closing this scoped plan.
    // A paused work/round frame is not the return owner of this impact.
    // Its blockers remain intact and still block that original work later.
    const impactReturns=next.returnStack.filter(r=>!r.reason.startsWith('ROUND_RETURN:')&&!r.reason.startsWith('WORK_RETURN:'));
    const allItems=state.graphState.status.data.items,related=new Set(),queue=[...plan.items.map(i=>i.id),...impactReturns.map(r=>r.itemId)];
    while(queue.length){const id=queue.pop();if(related.has(id))continue;related.add(id);const i=allItems.find(i=>i.id===id);if(i)queue.push(...i.dependencyIds,...(i.parentId?[i.parentId]:[]));}
    const blocking=next.blockers.some(b=>b.itemId===null||related.has(b.itemId));
    if(graph.diagnostics.length||plan.items.some(i=>i.executionStatus!=='DONE')||state.states.some(s=>!s.current||s.assessment?.verdict==='UNKNOWN')||blocking)fail('IMPACT_NOT_RESOLVED');
    if(!closure||closure.conditionsMet!==true||!text(closure.semanticStatement)||!Array.isArray(closure.evidenceRefs)||!closure.evidenceRefs.length)fail('CLOSURE_EVIDENCE_REQUIRED');
    for(const r of closure.evidenceRefs)if(!reads.has(r.path))fail('CLOSURE_EVIDENCE_NOT_BOUND');
    const approved=new Set(state.context.context.reviews.filter(r=>r.recordedStatus==='APPROVED').map(r=>r.id));
    if(plan.items.some(i=>!i.gateIds.length||i.gateIds.some(id=>!approved.has(id))))fail('IMPACT_APPROVAL_REQUIRED');
    const reviewRecords=[...state.graphState.records.values()].filter(r=>r.kind==='review'&&approved.has(r.id));
    for(const item of plan.items) {
      const covered=new Set(reviewRecords.filter(r=>item.gateIds.includes(r.id)).flatMap(r=>[...r.subjectVersions,...r.inputVersions]).map(v=>v.source?.path));
      const latest=item.resultRefs.filter(r=>r.path.startsWith('.kidea/checkpoints/impact/')).at(-1);
      if(!latest||![item.scopeRef,item.completionRef,...item.inputRefs,latest].every(r=>covered.has(r.path)))fail('IMPACT_REVIEW_COVERAGE_REQUIRED');
    }
    const prior=next.returnStack.pop();if(!prior)fail('RETURN_POINT_REQUIRED');
    next.currentItemId=prior.itemId;next.nextAction=prior.nextAction;
  } else {
    const pending=plan.items.find(i=>i.executionStatus!=='DONE');
    if(oldPlan&&pending&&!oldPlan.items.some(i=>i.id===work.currentItemId))next.returnStack.push({itemId:work.currentItemId,reason:'Impact reopened from changed inputs; retain original work.',nextAction:work.nextAction});
    next.currentItemId=pending?.id??work.currentItemId;
    next.nextAction=pending?'Review current impact inputs and evidence; do not execute project commands.':'Impact conclusions recorded; checks and scoped Human review are required before CLOSE.';
  }
  next.checkpointRef=ref(prefix+'checkpoint.md');
  const targets=[{path:state.workPath,action:'UPDATE',plannedBytes:replaceRecord(reads.get(state.workPath),next)},
    {path:planPath,action:oldPlan?'UPDATE':'CREATE',plannedBytes:oldPlan?replaceRecord(reads.get(planPath),plan):recordBytes(plan)},...extraTargets];
  const directories=['.kidea/plans','.kidea/checkpoints/maps','.kidea/checkpoints/impact'].filter(p=>!localEntry(root,p));
  const authorization={root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),createDirectories:directories,allowRestoreUpdate:false,allowRetireOwnPending:true,allowReadLocalGit:grant.allowReadLocalGit,assumptions:grant.assumptions};
  const prepared=prepareInternalImpactWrite({root,authorization,context:{projectId:work.projectId,ownerId:parentId,tool,permissionRefs,inputRefs},targets,operationId},
    {evidence,checkout:state.context.context.checkout,inputs:reads,workPath:state.workPath,planPath,directories});
  return {prepared};
}
export async function change(root,request) {
  if(request.operation==='READ')return readChange(root,request);
  const {prepared}=prepareChange(root,request),writer=await executeInternalWrite(prepared);
  return {state:writer.state==='COMPLETED_BYTES'?'IMPACT_RECORDED':'NOT_COMPLETE',writer,verification:'METADATA_BYTES_NOT_PRODUCT_COMPLETION'};
}
