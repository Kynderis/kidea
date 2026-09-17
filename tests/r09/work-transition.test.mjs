import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,writeFileSync,readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {initialize} from '../../.agents/skills/kidea/scripts/init.mjs';
import {resume,readResume} from '../../.agents/skills/kidea/scripts/resume.mjs';
import {prepareWorkTransition} from '../../.agents/skills/kidea/scripts/work-transition.mjs';
import {approve} from '../../.agents/skills/kidea/scripts/approve.mjs';
import {hashBytes} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
import {readStatus} from '../../.agents/skills/kidea/scripts/status.mjs';
import {isRecordedComplete} from '../../.agents/skills/kidea/scripts/recorded-completion.mjs';
import {executeInternalWrite} from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import {readChange,change} from '../../.agents/skills/kidea/scripts/change.mjs';

const repo=path.resolve(import.meta.dirname,'../..'),base=path.join(repo,'.test-output/r09');mkdirSync(base,{recursive:true});
const run=mkdtempSync(path.join(base,'work-'));console.log('Work transition evidence: '+run);
const assumptions={localFilesystem:true,noActiveSync:true,singleKideaRun:true},ref=path=>({path,anchor:null});
const parse=(root,p='.kidea/work.md')=>JSON.parse(readFileSync(path.join(root,p),'utf8').match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
function put(root,p,s){mkdirSync(path.dirname(path.join(root,p)),{recursive:true});writeFileSync(path.join(root,p),s);}
function fingerprint(root){return Object.fromEntries(readdirSync(root,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>{const p=path.join(e.parentPath,e.name);return [path.relative(root,p),hashBytes(readFileSync(p))];}));}
async function fixture(){
 const root=mkdtempSync(path.join(run,'case-'));
 const r=await initialize(root,{projectName:'Synthetic D1',humanRequest:'Synthetic workflow fixture, not pilot approval.',featureSource:{mode:'NEW',path:'docs/features.md',anchor:null},profiles:[],permission:{root,metadataRoot:'.kidea/checkpoints',targets:[{path:'.kidea/INDEX.md',action:'CREATE'},{path:'.kidea/work.md',action:'CREATE'},{path:'docs/features.md',action:'CREATE'}],createDirectories:['docs'],allowRestoreUpdate:false,allowRetireOwnPending:true,bootstrap:true,assumptions,statement:'Synthetic init grant'}});
 assert.equal(r.state,'INITIALIZED');put(root,'docs/plan.md','Synthetic plan: two outputs; second depends on first.\n');put(root,'docs/results.md','Synthetic verified output, not real application.\n');return root;
}
const requiredFiles=[ref('docs/plan.md'),ref('docs/results.md')];
const readReq=root=>({operation:'READ',permission:{root,readProject:true,allowReadLocalGit:false},requiredFiles});
function req(root,operation,extra={}){
 const read=readResume(root,readReq(root));assert.ok(read.context,JSON.stringify(read));
 return {operation,permission:{...readReq(root).permission,allowWorkTransition:true,ownerId:read.context.currentItem.id,statement:'Synthetic grant for this exact metadata transition, no execution.',assumptions},expectedBasis:read.basis,expectedProjectId:read.context.projectId,expectedOwnerId:read.context.currentItem.id,expectedGit:read.context.checkout,requiredFiles,transition:{reason:'Synthetic conditions assessed against real fixture sources.',nextAction:'Continue only authorized work.',conditionsMet:true,evidenceRefs:[ref('docs/plan.md')],...extra}};
}
async function perform(root,operation,extra={}){const r=await resume(root,req(root,operation,extra));assert.equal(r.state,'WORK_RECORDED',JSON.stringify(r));assert.equal(readStatus(root).readState,'OK',JSON.stringify(readStatus(root)));return r;}
const definition={scopeRef:ref('docs/plan.md'),inputRefs:[ref('docs/plan.md')],completionRef:ref('docs/plan.md')};
function children(root){const w=parse(root);return ['A','B'].map((id,i)=>({id,roundId:w.currentRoundId,name:'Synthetic '+id,kind:'TASK',parentId:w.currentItemId,shape:'LEAF',decomposition:null,...definition,dependencyIds:i?['A']:[],gateIds:[],resultRefs:[],executionStatus:'TODO'}));}
async function decompose(root){await perform(root,'DECOMPOSE',{definition,children:children(root)});}
async function review(root,id='D1-plan',owners=['W-001'],sources=[ref('docs/plan.md'),ref('docs/results.md')],stop='APPROVE'){
 for(const operation of ['CREATE','SUBMIT','APPROVE']){
  const p=`.kidea/reviews/${id}.md`,existing=existsSync(path.join(root,p)),r=existing?parse(root,p):null;
  const q={operation,id,revision:r?.revision??1,expectedDigest:existing?hashBytes(readFileSync(path.join(root,p))):null,ownerIds:owners,permission:{root,reviewPath:p,ownerIds:owners,allowReviewMetadata:true,allowLinkOwners:true,allowCreateEvidence:true,allowReadLocalGit:false,createDirectories:['.kidea/reviews','.kidea/reviews/evidence'].filter(p=>!existsSync(path.join(root,p))),assumptions,statement:'Synthetic scoped approval, not Human pilot approval.'}};
  q.package=operation==='CREATE'?{subjectRefs:sources,inputRefs:sources,purpose:'CONTENT',waiverReason:null}:{conditionsMet:true,statement:'Synthetic exact fixture package reviewed.'};
  if(operation==='APPROVE')q.human={intent:'APPROVE',statement:'Synthetic explicit fixture approval.',id,revision:q.revision,expectedDigest:q.expectedDigest,ownerIds:owners};
  assert.equal((await approve(root,q)).state,'REVIEW_RECORDED');if(operation===stop)break;
 }
}
async function ready(){const root=await fixture();await decompose(root);await review(root);await perform(root,'RESOLVE_BLOCKERS',{blockers:parse(root).blockers.filter(b=>b.itemId==='W-001')});return root;}
function rejected(root,q,code){const before=fingerprint(root);assert.throws(()=>prepareWorkTransition(root,q),e=>e.code===code,code);assert.deepEqual(fingerprint(root),before);}

test('public init to decomposition, explicit approval, two tasks and next step, retaining preimage',async()=>{
 const root=await ready();await perform(root,'SELECT',{nextItemId:'A'});await perform(root,'START');
 const before=readFileSync(path.join(root,'.kidea/work.md'));
 await perform(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]});
 const checkpoint=parse(root,parse(root).checkpointRef.path);assert.deepEqual(readFileSync(path.join(root,checkpoint.targets[0].before.version.location.ref.path)),before);
 assert.equal(isRecordedComplete('W-001',parse(root).items,new Set(['D1-plan'])),false);
 await perform(root,'SELECT',{nextItemId:'B'});await perform(root,'START');await perform(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]});
 assert.equal(isRecordedComplete('W-001',parse(root).items,new Set(['D1-plan'])),true);
 await perform(root,'SELECT',{nextItemId:'W-002'});assert.equal(parse(root).currentItemId,'W-002');assert.equal(readResume(root,readReq(root)).state,'WAITING');
 assert.equal(parse(root).items.find(i=>i.id==='W-002').decomposition,'UNEXPANDED');
});
test('missing, unapproved and unrelated gate cannot resolve blocker or enter tasks',async()=>{
 const root=await fixture();await decompose(root);
 rejected(root,req(root,'SELECT',{nextItemId:'A'}),'WORK_GATE_REQUIRED');
 await review(root,'draft',['W-001'],[ref('docs/plan.md')],'SUBMIT');rejected(root,req(root,'RESOLVE_BLOCKERS',{blockers:[parse(root).blockers[0]]}),'WORK_GATE_NOT_APPROVED');
 const other=await fixture();await decompose(other);await review(other,'wrong-subject',['W-001'],[ref('docs/results.md')]);rejected(other,req(other,'RESOLVE_BLOCKERS',{blockers:[parse(other).blockers[0]]}),'WORK_REVIEW_COVERAGE_REQUIRED');
 const wrong=await fixture();await decompose(wrong);await review(wrong,'wrong-owner',['W-002']);rejected(wrong,req(wrong,'SELECT',{nextItemId:'A'}),'WORK_GATE_REQUIRED');
});
test('unmet dependency, incomplete current item, no START and no result cannot become DONE',async()=>{
 const root=await ready();rejected(root,req(root,'SELECT',{nextItemId:'B'}),'WORK_DEPENDENCY_INCOMPLETE');await perform(root,'SELECT',{nextItemId:'A'});
 rejected(root,req(root,'SELECT',{nextItemId:'W-002'}),'WORK_CURRENT_INCOMPLETE');rejected(root,req(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]}),'WORK_NOT_STARTED');await perform(root,'START');rejected(root,req(root,'COMPLETE'),'WORK_REFERENCES_REQUIRED');
});
test('stale source/basis, wrong project, owner, root and permission preserve bytes',async()=>{
 const root=await ready();let q=req(root,'SELECT',{nextItemId:'A'});
 for(const [edit,code]of [[x=>x.expectedBasis='stale','WORK_BASIS_CHANGED'],[x=>x.expectedProjectId='wrong','PROJECT_ID_DIFFERS'],[x=>{x.expectedOwnerId='W-002';x.permission.ownerId='W-002';},'WORK_OWNER_CHANGED'],[x=>x.permission.root=path.dirname(root),'READ_PERMISSION_REQUIRED'],[x=>x.permission.allowWorkTransition=false,'WORK_PERMISSION_REQUIRED'],[x=>x.transition.conditionsMet=false,'WORK_ASSESSMENT_REQUIRED']]){const copy=structuredClone(q);edit(copy);rejected(root,copy,code);}
 put(root,'docs/plan.md','Changed semantic source.');rejected(root,q,'WORK_CONTEXT_BLOCKED');
});
test('decomposition cannot replace existing work, add DONE or pre-approved children, cycle or missing anchor',async()=>{
 const root=await fixture(),cs=children(root);
 for(const edit of [x=>x[0].executionStatus='DONE',x=>x[0].gateIds=['fake'],x=>x[0].id='W-001']){const next=structuredClone(cs);edit(next);rejected(root,req(root,'DECOMPOSE',{definition,children:next}),'WORK_CHILD_INVALID');}
 const q=req(root,'DECOMPOSE',{definition,children:cs});q.transition.evidenceRefs=[{path:'docs/plan.md',anchor:'missing'}];rejected(root,q,'WORK_REFERENCE_NOT_BOUND');
 const cyclic=structuredClone(cs);cyclic[0].dependencyIds=['B'];rejected(root,req(root,'DECOMPOSE',{definition,children:cyclic}),'GRAPH_NOT_VALID');
 await decompose(root);rejected(root,req(root,'DECOMPOSE',{definition,children:cs}),'WORK_ALREADY_PLANNED');
});
test('pending write and source race block transitions and retain actual pending state',async()=>{
 const root=await ready(),q=req(root,'SELECT',{nextItemId:'A'}),plan=prepareWorkTransition(root,q);
 const r=await executeInternalWrite(plan.prepared,{testBarrier:'BEFORE_FIRST_WRITE',onBarrier:()=>put(root,'docs/results.md','Changed during write')});assert.equal(r.state,'PENDING');assert.equal(readResume(root,readReq(root)).state,'RECONCILIATION_REQUIRED');rejected(root,q,'WORK_CONTEXT_BLOCKED');
});
test('public CLI dispatches transition and rejects extra operation fields',async()=>{
 const root=await ready(),q=req(root,'SELECT',{nextItemId:'A'});
 const r=spawnSync(process.execPath,[path.join(repo,'.agents/skills/kidea/scripts/kidea.mjs'),'resume'],{cwd:root,input:JSON.stringify(q),encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).state,'WORK_RECORDED');
 rejected(root,req(root,'START',{nextItemId:'W-002'}),'WORK_OPERATION_SCOPE');
});
test('final STEP cannot finish on a planning-only approval',async()=>{
 const root=await fixture();await decompose(root);await review(root,'planning-only',['W-001'],[ref('docs/plan.md')]);await perform(root,'RESOLVE_BLOCKERS',{blockers:[parse(root).blockers[0]]});
 await perform(root,'SELECT',{nextItemId:'A'});await perform(root,'START');await perform(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]});await perform(root,'SELECT',{nextItemId:'B'});await perform(root,'START');
 rejected(root,req(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]}),'WORK_FINAL_OUTPUT_REVIEW_REQUIRED');
 await review(root,'final-output',['W-001']);await perform(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]});
});
test('select does not erase blockers, and resolution cannot remove future blockers',async()=>{
 const root=await fixture();await decompose(root);await review(root);
 rejected(root,req(root,'SELECT',{nextItemId:'A'}),'WORK_BLOCKED');rejected(root,req(root,'RESOLVE_BLOCKERS',{blockers:[parse(root).blockers[1]]}),'WORK_BLOCKER_SCOPE');
});
test('active impact blocks generic task changes; original unfinished work survives CLOSE',async()=>{
 const root=await ready();await perform(root,'SELECT',{nextItemId:'A'});await perform(root,'START');
 const graph={format:'kidea-impact-graph-r1',nodes:[{id:'N',name:'Synthetic impact',...definition}],seeds:['N'],edges:[],diagnostics:[]};
 const base=()=>({operation:'READ',permission:{root,readProject:true,allowReadLocalGit:false,allowImpactWrite:true,roundId:'ROUND-001',ownerId:parse(root).currentItemId,statement:'Synthetic impact metadata authority.',assumptions},requiredFiles});
 async function mutate(operation,extra={}){const q={...base(),...extra},r=readChange(root,q);const response=await change(root,{...q,operation,expectedBasis:r.basis,expectedProjectId:r.context.projectId,expectedRoundId:'ROUND-001',expectedOwnerId:r.context.currentItem.id,expectedGit:null});assert.equal(response.state,'IMPACT_RECORDED',JSON.stringify(response));}
 await mutate('OPEN',{graph});rejected(root,req(root,'SELECT',{nextItemId:'B'}),'WORK_IMPACT_ACTIVE');
 let r=readChange(root,base());await mutate('ASSESS',{assessment:{nodeId:'N',inputBasis:r.inputBasis,verdict:'NO_CHANGE',reason:'Synthetic reviewed consumer.',behavior:'Original unfinished A retained.',assumptions:'Fixture only.',verification:'Explicit source review.',evidenceRefs:[ref('docs/plan.md')],downstream:[],resolved:true}});
 r=readChange(root,base());const owner=r.obligations[0].itemId;const item=readStatus(root).data.items.find(i=>i.id===owner);await review(root,'impact',[owner],[...new Map([item.scopeRef,item.completionRef,...item.inputRefs,...item.resultRefs].map(r=>[JSON.stringify(r),r])).values()]);
 // Remaining independent step blockers survive CLOSE; they do not prevent
 // closing this impact on A. Global/return-owner blockers still do.
 const before=parse(root);assert.equal(before.items.find(i=>i.id==='A').executionStatus,'IN_PROGRESS');
 assert.equal(before.returnStack[0].itemId,'A');
 const workBytes=readFileSync(path.join(root,'.kidea/work.md'));
 for(const itemId of [null,'A','W-001']) {
  // Isolated negative fixture setup only, never a public recovery operation.
  const changed=structuredClone(before);changed.blockers.push({itemId,reason:'Synthetic relevant blocker',needed:'Resolve evidence'});
  put(root,'.kidea/work.md',workBytes.toString().replace(/(```json\n)[\s\S]*?(\n```)/,(_m,a,b)=>a+JSON.stringify(changed,null,2)+b));
  await assert.rejects(()=>mutate('CLOSE',{closure:{conditionsMet:true,semanticStatement:'Fixture',evidenceRefs:[ref('docs/plan.md')]}}),{code:'IMPACT_NOT_RESOLVED'});
  put(root,'.kidea/work.md',workBytes);
 }
 await mutate('CLOSE',{closure:{conditionsMet:true,semanticStatement:'Synthetic impact closed without completing A or future steps.',evidenceRefs:[ref('docs/plan.md')]}});
 assert.equal(parse(root).currentItemId,'A');assert.equal(parse(root).items.find(i=>i.id==='A').executionStatus,'IN_PROGRESS');assert.deepEqual(parse(root).blockers,before.blockers);
 await perform(root,'COMPLETE',{resultRefs:[ref('docs/results.md')]});
});
