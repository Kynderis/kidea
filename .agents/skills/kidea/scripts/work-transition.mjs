// Public resume operations, metadata only. Semantic assertions and Human
// identity remain the trusted caller's responsibility, never text authority.
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {inspectResumeContext} from './resume.mjs';
import {byteIntegrity} from './bootstrap-plan.mjs';
import {validate} from './schema.mjs';
import {snapshotAnchorCount} from './status.mjs';
import {hasLocalAssumptions} from './runtime.mjs';
import {isRecordedComplete} from './recorded-completion.mjs';
import {prepareInternalWorkTransition,executeInternalWrite} from './write-internal.mjs';

const fail=code=>{throw Object.assign(new Error(code),{code});};
const text=v=>typeof v==='string'&&v.trim().length>0;
const closed=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>keys.includes(k));
const ref=path=>({path,anchor:null});
const ops=['DECOMPOSE','SELECT','START','COMPLETE','RESOLVE_BLOCKERS'];
const rewrite=(b,r)=>Buffer.from(new TextDecoder('utf-8',{fatal:true}).decode(b).replace(/(<!-- kidea:data:start -->\r?\n```json\r?\n)[\s\S]*?(\r?\n```\r?\n<!-- kidea:data:end -->)/,(_m,a,z)=>a+JSON.stringify(r,null,2)+z));

export function prepareWorkTransition(root,request) {
  if(!closed(request,['operation','permission','expectedBasis','expectedProjectId','expectedGit','expectedOwnerId','requiredFiles','transition'])||!ops.includes(request.operation))fail('WORK_INPUT_INVALID');
  const grant=request.permission;
  if(!closed(grant,['root','readProject','allowReadLocalGit','allowWorkTransition','ownerId','statement','assumptions'])||grant.allowWorkTransition!==true||grant.ownerId!==request.expectedOwnerId||!text(grant.statement)||!hasLocalAssumptions(grant.assumptions))fail('WORK_PERMISSION_REQUIRED');
  const read={operation:'READ',permission:{root:grant.root,readProject:grant.readProject,allowReadLocalGit:grant.allowReadLocalGit},expectedProjectId:request.expectedProjectId,expectedGit:request.expectedGit,requiredFiles:request.requiredFiles};
  const inspected=inspectResumeContext(root,read),{result,graph,reads,workPath,work,checkout}=inspected;
  if(!['CONTEXT_READY','WAITING'].includes(result.state)||!work?.currentItemId)fail('WORK_CONTEXT_BLOCKED');
  if(request.expectedProjectId!==graph.status.projectId||!same(request.expectedGit,checkout)||request.expectedBasis!==result.basis)fail('WORK_BASIS_CHANGED');
  if(request.expectedOwnerId!==work.currentItemId)fail('WORK_OWNER_CHANGED');
  // Impact owns its return stack. Generic transitions cannot skip, clear or
  // finish it; CLOSE must first restore the original continuation point.
  if(work.returnStack.some(r=>!r.reason.startsWith('ROUND_RETURN:')&&!r.reason.startsWith('WORK_RETURN:'))||result.context.impact.some(i=>!i.current||i.verdict==='UNKNOWN'||i.recordedStatus!=='DONE'))fail('WORK_IMPACT_ACTIVE');
  const current=work.items.find(i=>i.id===work.currentItemId);
  if(!current)fail('WORK_OWNER_OUTSIDE_WORK');
  const t=request.transition;
  if(!closed(t,['reason','nextAction','conditionsMet','evidenceRefs','definition','children','nextItemId','resultRefs','blockers'])||!text(t.reason)||!text(t.nextAction)||t.conditionsMet!==true)fail('WORK_ASSESSMENT_REQUIRED');
  const boundRefs=refs=>{
    if(!Array.isArray(refs)||!refs.length||new Set(refs.map(r=>JSON.stringify(r))).size!==refs.length)fail('WORK_REFERENCES_REQUIRED');
    for(const r of refs)if(!validate(r,'Ref',()=>{})||!reads.has(r.path)||r.anchor!==null&&snapshotAnchorCount(reads.get(r.path),r.anchor)!==1)fail('WORK_REFERENCE_NOT_BOUND');
  };
  boundRefs(t.evidenceRefs);
  const next=structuredClone(work),item=next.items.find(i=>i.id===current.id);
  const items=graph.status.data.items,approved=new Set(result.context.reviews.filter(r=>r.recordedStatus==='APPROVED').map(r=>r.id));
  const chain=i=>{const a=[i];while(a.at(-1).parentId)a.push(items.find(x=>x.id===a.at(-1).parentId));return a;};
  const dependencies=i=>{for(const owner of chain(i))for(const id of owner.dependencyIds)if(!isRecordedComplete(id,items,approved))fail('WORK_DEPENDENCY_INCOMPLETE');};
  const gates=i=>{
    if(i.kind==='STEP'&&!i.gateIds.length)fail('WORK_GATE_REQUIRED');
    if(i.gateIds.some(id=>!approved.has(id)))fail('WORK_GATE_NOT_APPROVED');
    if(i.gateIds.length){
      const covered=[...graph.records.values()].filter(r=>r.kind==='review'&&i.gateIds.includes(r.id)).flatMap(r=>[...r.subjectVersions,...r.inputVersions]).map(v=>v.source);
      if(![i.scopeRef,i.completionRef,...i.inputRefs].every(r=>covered.some(v=>v?.path===r.path&&(v.anchor===null||v.anchor===r.anchor))))fail('WORK_REVIEW_COVERAGE_REQUIRED');
    }
  };
  const coveredBy=(owners,refs)=>{
    const ids=new Set(owners.flatMap(i=>i.gateIds));
    const sources=[...graph.records.values()].filter(r=>r.kind==='review'&&ids.has(r.id)&&approved.has(r.id)).flatMap(r=>[...r.subjectVersions,...r.inputVersions]).map(v=>v.source);
    return refs.every(r=>sources.some(v=>v?.path===r.path&&(v.anchor===null||v.anchor===r.anchor)));
  };
  const blockers=i=>{const ids=new Set(chain(i).map(x=>x.id));if(work.blockers.some(b=>b.itemId===null||ids.has(b.itemId)))fail('WORK_BLOCKED');};
  const noExtras=keys=>{for(const key of ['definition','children','nextItemId','resultRefs','blockers'])if(t[key]!==undefined&&!keys.includes(key))fail('WORK_OPERATION_SCOPE');};
  if(request.operation==='DECOMPOSE') {
    noExtras(['definition','children']);dependencies(current);
    if(current.shape!=='GROUP'||current.decomposition!=='UNEXPANDED'||current.gateIds.length||items.some(i=>i.parentId===current.id))fail('WORK_ALREADY_PLANNED');
    if(!closed(t.definition,['scopeRef','inputRefs','completionRef']))fail('WORK_DEFINITION_REQUIRED');
    boundRefs([t.definition.scopeRef,t.definition.completionRef].filter((r,i,a)=>a.findIndex(x=>same(x,r))===i));boundRefs(t.definition.inputRefs);
    if(!Array.isArray(t.children)||!t.children.length)fail('WORK_CHILDREN_REQUIRED');
    const ids=new Set(items.map(i=>i.id));
    for(const child of t.children) {
      if(!validate(child,'Item',()=>{})||ids.has(child.id)||child.roundId!==current.roundId||child.parentId!==current.id||!['TASK','SUBTASK','PHASE'].includes(child.kind)||child.gateIds.length||child.resultRefs.length||!(child.shape==='LEAF'?child.executionStatus==='TODO'&&child.decomposition===null:child.executionStatus===null&&child.decomposition==='UNEXPANDED'))fail('WORK_CHILD_INVALID');
      ids.add(child.id);boundRefs([child.scopeRef,child.completionRef].filter((r,i,a)=>a.findIndex(x=>same(x,r))===i));boundRefs(child.inputRefs);
    }
    // Initial inline placeholder references are replaced by actual product
    // documents. The original definition remains in the checkpoint preimage.
    Object.assign(item,structuredClone(t.definition),{decomposition:'COMPLETE'});
    next.items.push(...structuredClone(t.children));
  } else if(request.operation==='RESOLVE_BLOCKERS') {
    noExtras(['blockers']);dependencies(current);gates(current);
    if(!Array.isArray(t.blockers)||!t.blockers.length||new Set(t.blockers.map(b=>JSON.stringify(b))).size!==t.blockers.length||t.blockers.some(b=>b.itemId!==current.id||!work.blockers.some(old=>same(old,b))))fail('WORK_BLOCKER_SCOPE');
    next.blockers=next.blockers.filter(b=>!t.blockers.some(old=>same(old,b)));
  } else if(request.operation==='SELECT') {
    noExtras(['nextItemId']);
    const target=items.find(i=>i.id===t.nextItemId);
    if(!target||!next.items.some(i=>i.id===target.id)||target.roundId!==work.currentRoundId||target.id===current.id)fail('WORK_TARGET_INVALID');
    const descendants=chain(target).some(i=>i.id===current.id);
    if(!isRecordedComplete(current.id,items,approved)&&!(current.shape==='GROUP'&&current.decomposition==='COMPLETE'&&descendants))fail('WORK_CURRENT_INCOMPLETE');
    dependencies(target);
    // A new STEP can be selected to prepare its documents; its own gate and
    // initial blocker still prevent entering implementation children.
    for(const parent of chain(target).slice(1)){gates(parent);blockers(parent);}
    if(target.shape==='LEAF'){gates(target);blockers(target);}
    if(isRecordedComplete(target.id,items,approved))fail('WORK_TARGET_ALREADY_COMPLETE');
    next.currentItemId=target.id;
    if(next.returnStack.at(-1)?.itemId===target.id&&next.returnStack.at(-1)?.reason===`WORK_RETURN:${work.currentRoundId}`)next.returnStack.pop();
  } else {
    noExtras(request.operation==='COMPLETE'?['resultRefs']:[]);
    if(item.shape!=='LEAF')fail('WORK_LEAF_REQUIRED');
    dependencies(current);blockers(current);for(const ancestor of chain(current))gates(ancestor);
    if(!coveredBy(chain(current),[current.scopeRef,current.completionRef,...current.inputRefs]))fail('WORK_REVIEW_COVERAGE_REQUIRED');
    if(request.operation==='START') {
      if(item.executionStatus!=='TODO')fail('WORK_NOT_TODO');item.executionStatus='IN_PROGRESS';
    } else {
      if(item.executionStatus!=='IN_PROGRESS')fail('WORK_NOT_STARTED');
      boundRefs(t.resultRefs);item.resultRefs=structuredClone(t.resultRefs);item.executionStatus='DONE';
      // Final completion of a STEP requires its Human gate to bind actual
      // outputs, not merely the earlier plan. Ordinary intermediate tasks do
      // not acquire an extra Human gate just because they were decomposed.
      const projectedItems=items.map(i=>next.items.find(n=>n.id===i.id)??i);
      for(const ancestor of chain(current).filter(i=>i.kind==='STEP'))if(isRecordedComplete(ancestor.id,projectedItems,approved)) {
        const outputs=projectedItems.filter(i=>chain(i).some(p=>p.id===ancestor.id)).flatMap(i=>i.resultRefs);
        if(!coveredBy([ancestor],outputs))fail('WORK_FINAL_OUTPUT_REVIEW_REQUIRED');
      }
    }
  }
  const operationId=randomUUID(),prefix=`.kidea/checkpoints/operations/${operationId}/`,evidence=[];
  const capture=(bytes,source=null)=>{const p=prefix+`context-${evidence.length}.bin`;evidence.push({path:p,bytes});return {source:source??ref(p),location:{kind:'SNAPSHOT',ref:ref(p)},integrity:byteIntegrity(bytes)};};
  const permission=capture(Buffer.from(grant.statement)),inputs=[capture(Buffer.from(JSON.stringify(request)))];
  for(const [p,b]of reads)if(!p.startsWith('.kidea/'))inputs.push(capture(b,ref(p)));
  const tool=structuredClone(inspected.tool);tool.version='kidea-schema2-work-r1';
  next.nextAction=t.nextAction;next.checkpointRef=ref(prefix+'checkpoint.md');
  const targets=[{path:workPath,action:'UPDATE',plannedBytes:rewrite(reads.get(workPath),next)}];
  const authorization={root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),allowRestoreUpdate:false,allowRetireOwnPending:true,allowReadLocalGit:grant.allowReadLocalGit,assumptions:grant.assumptions};
  const prepared=prepareInternalWorkTransition({root,authorization,context:{projectId:graph.status.projectId,ownerId:current.id,tool,permissionRefs:[permission],inputRefs:inputs},targets,operationId},{evidence,checkout,inputs:reads,workPath,mode:same(next.returnStack,work.returnStack)?'WORK':'CYCLE'});
  return {prepared,itemId:current.id,nextItemId:next.currentItemId};
}

export async function transitionWork(root,request) {
  const plan=prepareWorkTransition(root,request),writer=await executeInternalWrite(plan.prepared);
  return {state:writer.state==='COMPLETED_BYTES'?'WORK_RECORDED':'WORK_NOT_COMPLETE',operation:request.operation,itemId:plan.itemId,nextItemId:plan.nextItemId,writer,verification:'BOUND_METADATA_NOT_PRODUCT_EXECUTION_OR_HUMAN_AUTHENTICATION'};
}
