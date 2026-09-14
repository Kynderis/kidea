// Deterministic synthetic fixtures, not AI trials or live operation retries.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,readdirSync,existsSync,unlinkSync,symlinkSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {buildBase,dataAt,edit,envelope,paths,ref,snapshot} from '../fixtures/r02-t04/catalog.mjs';
import {readResume,resume,prepareContinuation} from '../../.agents/skills/kidea/scripts/resume.mjs';
import {diagnosePending} from '../../.agents/skills/kidea/scripts/diagnose-pending.mjs';
import {prepareInternalWrite,executeInternalWrite} from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import {readStatus} from '../../.agents/skills/kidea/scripts/status.mjs';
import {hashBytes,byteIntegrity} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
import {prepareInit} from '../../.agents/skills/kidea/scripts/init.mjs';
import {approve} from '../../.agents/skills/kidea/scripts/approve.mjs';

const repo=fileURLToPath(new URL('../../',import.meta.url)),output=path.join(repo,'.test-output/r02-t09');mkdirSync(output,{recursive:true});
const runRoot=mkdtempSync(path.join(output,'resume-'));console.log('Resume fixtures retained: '+runRoot);
const assumptions={localNtfs:true,noActiveSync:true,singleKideaRun:true};
const bytes=(f,p)=>readFileSync(path.join(f.root,p));
const record=(f,p=paths.work)=>JSON.parse(bytes(f,p).toString().match(/```json\r?\n([\s\S]*?)\r?\n```/)[1]);
const put=(f,p,b)=>{mkdirSync(path.dirname(path.join(f.root,p)),{recursive:true});writeFileSync(path.join(f.root,p),b);};
const fingerprint=f=>Object.fromEntries(readdirSync(f.root,{recursive:true,withFileTypes:true}).filter(e=>e.isFile()).map(e=>{const p=path.join(e.parentPath,e.name);return [path.relative(f.root,p),hashBytes(readFileSync(p))];}));
function fixture(transform=()=>{}) {
  const {world,refs}=buildBase();transform(world,refs);
  const f={root:mkdtempSync(path.join(runRoot,'case-')),world,refs};
  for(const [p,b]of Object.entries(world.files))put(f,p,b);
  return f;
}
const request=f=>({operation:'READ',permission:{root:f.root,readProject:true,allowReadLocalGit:false},requiredFiles:[]});
function saveRequest(f) {
  const q=request(f),r=readResume(f.root,q);
  return {...q,operation:'SAVE',expectedBasis:r.basis,permission:{...q.permission,allowSaveContinuation:true,statement:'Synthetic grant: continuation note, checkpoint and source snapshots only; no product/state transition.',assumptions},checkpoint:{itemId:r.context.currentItem.id,completed:'Backend change is on disk; not declaring DONE.',remaining:'UI work and review remain.',nextAction:'Inspect UI requirements without repeating the backend operation.',sourceRefs:[ref('docs/features.md','scope'),ref('docs/plan.md','scope')]}};
}
const reject=(f,fn,code)=>{const before=fingerprint(f);assert.throws(fn,e=>e.code===code,code);assert.deepEqual(fingerprint(f),before);};

function preservingNote() {
  const f=fixture((w,refs)=>{const v=snapshot(w,paths.work,'.kidea/reviews/evidence/work.snapshot');edit(w,paths.review,r=>{r.subjectRefs=[ref(paths.work)];r.subjectVersions=[v];r.status='APPROVED';r.confirmationRef=refs.confirmation;});});
  const q=saveRequest(f),r=record(f,paths.review),beforeRefs=[...r.subjectVersions,...r.inputVersions];
  q.permission.preserveReviewIds=[r.id];
  q.reviewComparisons=[{id:r.id,revision:r.revision,expectedDigest:hashBytes(bytes(f,paths.review)),checkpoint:structuredClone(q.checkpoint),comparison:{result:'NON_SEMANTIC',reason:'Synthetic context note only; no scope or gate transition.',affectedIds:r.ownerIds,beforeRefs,currentSources:beforeRefs.map(v=>({ref:v.source,integrity:byteIntegrity(bytes(f,v.source.path))})),assessment:Object.fromEntries(['scope','permissions','prerequisites','checks','dependencies'].map(k=>[k,{unchanged:true,reason:`Synthetic exact-note ${k} assessment.`}]))}}];
  return {f,q};
}
test('SAVE can preserve assessed work review in the same checkpoint without changing its original approval',async()=>{
  const {f,q}=preservingNote(),before=record(f,paths.review),old=bytes(f,paths.review);
  const result=await resume(f.root,q);assert.equal(result.state,'CONTINUATION_SAVED',JSON.stringify(result));
  const after=record(f,paths.review);assert.equal(after.revision,before.revision);assert.deepEqual(after.confirmationRef,before.confirmationRef);assert.equal(after.status,'APPROVED');
  assert.deepEqual(bytes(f,after.historyRefs[0].location.ref.path),old);assert.equal(after.validityChecks.at(-1).result,'NON_SEMANTIC');assert.equal(readStatus(f.root).readState,'OK');
  assert.equal(record(f).currentItemId,'W-002');assert.ok(record(f,record(f).checkpointRef.path).targets.some(t=>t.path===paths.review));
});
test('SAVE preservation binds exact note, grant, old review and semantic assessment',()=>{
  const {f,q}=preservingNote();
  for(const [mutate,code]of [
    [r=>r.permission.preserveReviewIds=[],'PRESERVATION_SCOPE_REQUIRED'],
    [r=>r.checkpoint.nextAction='Different requested action','CONTINUATION_COMPARISON_REQUIRED'],
    [r=>r.reviewComparisons[0].expectedDigest='0'.repeat(64),'REVIEW_VERSION_OR_SCOPE_DIFFERS'],
    [r=>r.reviewComparisons[0].comparison.assessment.checks.unchanged=false,'SEMANTIC_ASSESSMENT_REQUIRED'],
  ]){const copy=structuredClone(q);mutate(copy);reject(f,()=>prepareContinuation(f.root,copy),code);}
  const r=record(f,paths.review);r.inputVersions[0].source=null;put(f,paths.review,envelope(r));
  assert.equal(readResume(f.root,request(f)).state,'READ_BLOCKED');
  reject(f,()=>prepareContinuation(f.root,q),'CONTINUATION_NOT_AVAILABLE');
});
test('interrupted preservation keeps all targets pending and never treats PLANNED as completion',async()=>{
  const {f,q}=preservingNote(),plan=prepareContinuation(f.root,q);
  assert.equal((await executeInternalWrite(plan.prepared,{testFault:'AFTER_VERIFY'})).state,'PENDING');
  const r=readResume(f.root,request(f));assert.equal(r.state,'RECONCILIATION_REQUIRED');
  assert.equal(readStatus(f.root).data,null);assert.ok(existsSync(path.join(f.root,'.kidea/checkpoints/pending/active.json')));
  reject(f,()=>prepareContinuation(f.root,q),'CONTINUATION_NOT_AVAILABLE');
});

test('resume reads current item, parents, reviews, source paths and unknown operations without writes',()=>{
  const f=fixture(),before=fingerprint(f),r=readResume(f.root,request(f));
  assert.equal(r.state,'CONTEXT_READY');assert.equal(r.context.currentItem.id,'W-002');assert.equal(r.context.parents[0].id,'W-001');
  assert.equal(r.context.operationalObservations[0].observations[0].components[1].result,'UNKNOWN');
  assert.equal(r.executionAuthorized,false);assert.ok(r.context.sources.some(s=>s.path==='docs/features.md'));assert.deepEqual(fingerprint(f),before);
});
test('SAVE retains task/gates/return stack, links actual checkpoint and preserves all product bytes',async()=>{
  const f=fixture(),before=record(f),source=bytes(f,'docs/features.md'),q=saveRequest(f);
  const result=await resume(f.root,q);assert.equal(result.state,'CONTINUATION_SAVED',JSON.stringify(result));
  const after=record(f);for(const k of Object.keys(before).filter(k=>!['nextAction','checkpointRef'].includes(k)))assert.deepEqual(after[k],before[k]);
  assert.equal(after.checkpointRef.path,result.writer.checkpointRef.path);assert.equal(record(f,after.checkpointRef.path).observations[0].phase,'VERIFY');
  assert.deepEqual(bytes(f,'docs/features.md'),source);assert.ok(after.nextAction.includes(q.checkpoint.remaining));
  assert.equal(readStatus(f.root).readState,'OK');
  const fresh=spawnSync(process.execPath,[path.join(repo,'.agents/skills/kidea/scripts/kidea.mjs'),'resume'],{cwd:f.root,input:JSON.stringify(request(f)),encoding:'utf8',windowsHide:true,timeout:30000});
  assert.equal(fresh.status,0,fresh.stderr);assert.equal(JSON.parse(fresh.stdout).context.currentItem.id,'W-002');
  assert.ok(JSON.parse(fresh.stdout).context.nextAction.includes(q.checkpoint.remaining));
});
test('two-level dependencies and return stack survive resume/save; DONE is preserved not rerun',async()=>{
  const f=fixture(w=>edit(w,paths.work,r=>{
    const original=r.items[1];original.executionStatus='TODO';original.dependencyIds=['DEP-1'];
    r.items.push({...structuredClone(original),id:'DEP-1',name:'Dependency 1',executionStatus:'TODO',gateIds:[],dependencyIds:['DEP-2']},
      {...structuredClone(original),id:'DEP-2',name:'Dependency 2',executionStatus:'DONE',gateIds:[],dependencyIds:[],resultRefs:[ref('docs/notes.md')]});
    r.returnStack=[{itemId:'W-001',reason:'Parent held',nextAction:'Return after child'},{itemId:'DEP-1',reason:'Dependency held',nextAction:'Finish remaining dependency'}];
  }));
  const r=readResume(f.root,request(f));assert.equal(r.state,'WAITING');assert.deepEqual(r.context.dependencies,[{id:'DEP-1',recordedComplete:false},{id:'DEP-2',recordedComplete:true}]);
  const stack=r.context.returnStack;assert.equal((await resume(f.root,saveRequest(f))).state,'CONTINUATION_SAVED');assert.deepEqual(record(f).returnStack,stack);assert.equal(record(f).items.at(-1).executionStatus,'DONE');
});
test('no current item does not auto-pick a task',()=>{
  const f=fixture(w=>edit(w,paths.work,r=>{r.currentItemId=null;r.items[1].executionStatus='TODO';}));
  const before=fingerprint(f),r=readResume(f.root,request(f));assert.equal(r.state,'NO_CURRENT_ITEM');assert.equal(r.context.currentItem,null);assert.deepEqual(fingerprint(f),before);
});
test('relevant blockers yield WAITING without hiding context',()=>{
  const f=fixture(w=>edit(w,paths.work,r=>r.blockers.push({itemId:'W-002',reason:'Missing Human decision',needed:'Clarify scope'})));
  const r=readResume(f.root,request(f));assert.equal(r.state,'WAITING');assert.equal(r.context.blockers.length,1);
});
test('current item already recorded DONE waits rather than rerunning or selecting another item',()=>{
  const f=fixture(w=>edit(w,paths.work,r=>{r.items[1].executionStatus='DONE';r.items[1].resultRefs=[ref('docs/notes.md')];}));
  const before=fingerprint(f),r=readResume(f.root,request(f));assert.equal(r.state,'WAITING');assert.equal(r.attention[0],'CURRENT_ITEM_RECORDED_DONE_DO_NOT_RERUN');assert.equal(r.context.currentItem.id,'W-002');assert.deepEqual(fingerprint(f),before);
});
test('saving a note cannot silently stale or rewrite a review of the work record',()=>{
  const f=fixture(w=>{const v=snapshot(w,paths.work,'.kidea/reviews/evidence/work.snapshot');edit(w,paths.review,r=>{r.subjectRefs=[ref(paths.work)];r.subjectVersions=[v];});});
  const q=saveRequest(f);reject(f,()=>prepareContinuation(f.root,q),'GRAPH_NOT_VALID');
});
for(const [name,change,code]of [
  ['missing read permission',q=>q.permission.readProject=false,'READ_PERMISSION_REQUIRED'],
  ['different project',q=>q.expectedProjectId='wrong-project','PROJECT_ID_DIFFERS'],
  ['missing required execution file',q=>q.requiredFiles=[ref('scripts/not-here.mjs')],'REQUIRED_FILE_MISSING'],
  ['missing required anchor',q=>q.requiredFiles=[ref('docs/plan.md','absent')],'REQUIRED_ANCHOR_MISSING'],
  ['path escape',q=>q.requiredFiles=[ref('../outside')],'REQUIRED_FILES_INVALID'],
])test(name+' blocks without writes',()=>{const f=fixture(),q=request(f);change(q);reject(f,()=>readResume(f.root,q),code);});
for(const [name,change,code]of [
  ['no save permission',q=>q.permission.allowSaveContinuation=false,'SAVE_PERMISSION_REQUIRED'],
  ['wrong basis',q=>q.expectedBasis='0'.repeat(64),'RESUME_BASIS_CHANGED'],
  ['wrong current item',q=>q.checkpoint.itemId='W-001','CONTINUATION_NOTE_REQUIRED'],
  ['unread note source',q=>q.checkpoint.sourceRefs=[ref('docs/not-read.md')],'NOTE_SOURCE_NOT_IN_BASIS'],
])test(name+' rejects save read-only',()=>{const f=fixture(),q=saveRequest(f);change(q);reject(f,()=>prepareContinuation(f.root,q),code);});
test('stale review and missing product files never become ready context',()=>{
  const f=fixture();put(f,'docs/features.md','Changed semantics');const before=fingerprint(f);
  assert.equal(readResume(f.root,request(f)).state,'READ_BLOCKED');assert.deepEqual(fingerprint(f),before);
  unlinkSync(path.join(f.root,'docs/features.md'));assert.equal(readResume(f.root,request(f)).context,null);
});
test('source conflict markers stop; they are not silently repaired',()=>{
  const f=fixture();put(f,'extra.txt','<<<<<<< branch\nA\n=======\nB\n>>>>>>> main\n');const q=request(f);q.requiredFiles=[ref('extra.txt')];reject(f,()=>readResume(f.root,q),'SOURCE_CONFLICT_MARKERS');
});
test('additional execution file is bound through SAVE and detects late changes',async()=>{
  const f=fixture();put(f,'execute.mjs','Synthetic only; do not execute');const q=request(f);q.requiredFiles=[ref('execute.mjs')];
  const r=readResume(f.root,q),save={...saveRequest(f),requiredFiles:q.requiredFiles,expectedBasis:r.basis};
  const prepared=prepareContinuation(f.root,save);put(f,'execute.mjs','Changed');const before=fingerprint(f);
  const result=await executeInternalWrite(prepared.prepared);assert.equal(result.state,'REJECTED');assert.deepEqual(fingerprint(f),before);
});
test('source changing during resume is rejected',()=>{
  const f=fixture();assert.throws(()=>readResume(f.root,request(f),{beforeRecheck:()=>put(f,'docs/plan.md','Changed during read')}),e=>e.code==='SOURCE_CHANGED');
});
test('junction in required file path is never followed',()=>{
  const f=fixture();symlinkSync(path.join(f.root,'docs'),path.join(f.root,'alias'),'junction');const q=request(f);q.requiredFiles=[ref('alias/plan.md')];reject(f,()=>readResume(f.root,q),'UNSAFE_PATH');
});

async function pending(f,fault) {
  const targets=[{path:'docs/notes.md',action:'UPDATE',plannedBytes:Buffer.from('Synthetic planned notes')},{path:'docs/new.md',action:'CREATE',plannedBytes:Buffer.from('Synthetic new file')}];
  const prepared=prepareInternalWrite({root:f.root,authorization:{root:f.root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),allowRestoreUpdate:false,allowRetireOwnPending:true,assumptions},context:{projectId:'synthetic-r02-t04',ownerId:'W-002',tool:dataAt(f.world,paths.index).createdWith,permissionRefs:[f.refs.policy],inputRefs:[f.refs.subject]},targets});
  const r=await executeInternalWrite(prepared,{testFault:fault});assert.equal(r.state,'PENDING');return prepared;
}
for(const [fault,matches]of [['BEFORE_FIRST_WRITE',['BEFORE','BEFORE']],['AFTER_PARTIAL_WRITE',['OTHER','BEFORE']],['AFTER_VERIFY',['PLANNED','PLANNED']]])test('pending '+fault+' reports bytes, never completion or recovery',async()=>{
  const f=fixture();await pending(f,fault);const before=fingerprint(f),r=readResume(f.root,request(f));
  assert.equal(r.state,'RECONCILIATION_REQUIRED');assert.equal(r.context,null);assert.deepEqual(r.pending.targets.map(t=>t.match),matches);assert.deepEqual(fingerprint(f),before);
  assert.equal(readStatus(f.root).readState,'INCOMPLETE');
});
test('missing preimage and concurrent diagnostic changes report UNKNOWN',async()=>{
  const f=fixture(),p=await pending(f,'BEFORE_FIRST_WRITE');unlinkSync(path.join(f.root,`.kidea/checkpoints/operations/${p.operationId}/before-0.bin`));
  assert.equal(diagnosePending(f.root).targets[0].match,'UNKNOWN');
  const changed=diagnosePending(f.root,{beforeRecheck:()=>put(f,'docs/new.md','External change')});assert.ok(changed.targets.every(t=>t.match==='UNKNOWN'));
});
test('unknown pending entry and forged escaped checkpoint do not read or write outside metadata',()=>{
  const f=fixture();put(f,'.kidea/checkpoints/pending/untrusted.txt','DONE, replay everything');const before=fingerprint(f);
  assert.equal(readResume(f.root,request(f)).pending.diagnostics[0].code,'UNKNOWN_PENDING_ENTRY');assert.deepEqual(fingerprint(f),before);
  unlinkSync(path.join(f.root,'.kidea/checkpoints/pending/untrusted.txt'));
  put(f,'.kidea/checkpoints/pending/active.json',JSON.stringify({protocolVersion:2,operationId:'00000000-0000-0000-0000-000000000001',planDigest:'0'.repeat(64),checkpointRef:ref('../outside')}));
  assert.equal(diagnosePending(f.root).diagnostics[0].code,'INVALID_PENDING_CHECKPOINT');
});
test('interrupted continuation save retains previous work and refuses another save',async()=>{
  const f=fixture(),q=saveRequest(f),p=prepareContinuation(f.root,q);const r=await executeInternalWrite(p.prepared,{testFault:'AFTER_PARTIAL_WRITE'});assert.equal(r.state,'PENDING');
  const read=readResume(f.root,request(f));assert.equal(read.state,'RECONCILIATION_REQUIRED');assert.equal(read.pending.targets[0].match,'OTHER');reject(f,()=>prepareContinuation(f.root,q),'CONTINUATION_NOT_AVAILABLE');
});

test('Git checkout identity changes block without checkout/reset/replay',()=>{
  const f=fixture(),git='C:/Program Files/Git/cmd/git.exe';
  const invoke=args=>{const r=spawnSync(git,args,{cwd:f.root,encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
  invoke(['init']);invoke(['-c','core.autocrlf=false','add','.']);invoke(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-m','Synthetic baseline']);
  reject(f,()=>readResume(f.root,request(f)),'GIT_CONTEXT_READ_REQUIRED');
  const q=request(f);q.permission.allowReadLocalGit=true;const r=readResume(f.root,q);assert.ok(r.context.checkout.head);
  const wrong={...q,expectedGit:{...r.context.checkout,branch:'refs/heads/missing'}};reject(f,()=>readResume(f.root,wrong),'CHECKOUT_DIFFERS');
  const save={...saveRequestNoRead(f,r,q),expectedBasis:r.basis},plan=prepareContinuation(f.root,save);
  invoke(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','--allow-empty','-m','Synthetic changed HEAD']);
  return executeInternalWrite(plan.prepared).then(result=>assert.equal(result.state,'REJECTED'));
});
test('unmerged Git index names the conflicting path and stays unchanged',()=>{
  const f=fixture(),git='C:/Program Files/Git/cmd/git.exe';
  const invoke=(args,input)=>{const r=spawnSync(git,args,{cwd:f.root,input,encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
  invoke(['init']);invoke(['-c','core.autocrlf=false','add','.']);invoke(['-c','user.name=Synthetic','-c','user.email=synthetic@example.invalid','commit','-m','Synthetic conflict baseline']);
  const blob=invoke(['rev-parse','HEAD:docs/notes.md']);
  invoke(['update-index','--index-info'],`0 ${'0'.repeat(40)}\tdocs/notes.md\n100644 ${blob} 1\tdocs/notes.md\n100644 ${blob} 2\tdocs/notes.md\n`);
  const q=request(f);q.permission.allowReadLocalGit=true;const before=fingerprint(f);
  assert.throws(()=>readResume(f.root,q),e=>e.code==='GIT_CONFLICT'&&e.diagnostics.some(d=>d.file==='docs/notes.md'));assert.deepEqual(fingerprint(f),before);
});
function saveRequestNoRead(f,r,q){return {...q,operation:'SAVE',permission:{...q.permission,allowSaveContinuation:true,statement:'Synthetic scoped save only',assumptions},checkpoint:{itemId:r.context.currentItem.id,completed:'Partial',remaining:'Still pending',nextAction:'Inspect only',sourceRefs:[ref('docs/features.md','scope')]}};}

test('public resume validates input and positional args without writes',()=>{
  const f=fixture(),before=fingerprint(f);
  for(const [args,code]of [[['resume'],'RESUME_INPUT_INVALID'],[['resume','unexpected'],'INVALID_ARGUMENTS']]){
    const r=spawnSync(process.execPath,[path.join(repo,'.agents/skills/kidea/scripts/kidea.mjs'),...args],{cwd:f.root,input:'',encoding:'utf8',windowsHide:true});assert.equal(JSON.parse(r.stderr).code,code);
  }assert.deepEqual(fingerprint(f),before);
});

test('integrated init -> review -> feedback -> approve -> interrupted save -> resume diagnostic',async()=>{
  const f={root:mkdtempSync(path.join(runRoot,'integration-'))};
  const init=prepareInit(f.root,{projectName:'Synthetic',humanRequest:'Synthetic app',featureSource:{mode:'NEW',path:'docs/features.md',anchor:null},profiles:[],permission:{root:f.root,metadataRoot:'.kidea/checkpoints',targets:[{path:'.kidea/INDEX.md',action:'CREATE'},{path:paths.work,action:'CREATE'},{path:'docs/features.md',action:'CREATE'}],createDirectories:['docs'],allowRestoreUpdate:false,allowRetireOwnPending:true,bootstrap:true,assumptions,statement:'Synthetic create grant'}});
  assert.equal((await executeInternalWrite(init.prepared)).state,'COMPLETED_BYTES');
  const reviewPath='.kidea/reviews/R-1.md';
  for(const op of ['CREATE','SUBMIT','FEEDBACK','SUBMIT','APPROVE']){
    const old=existsSync(path.join(f.root,reviewPath))?record(f,reviewPath):null;
    const q={operation:op,id:'R-1',revision:old?.revision??1,expectedDigest:old?hashBytes(bytes(f,reviewPath)):null,ownerIds:['W-001'],permission:{root:f.root,reviewPath,ownerIds:['W-001'],allowReviewMetadata:true,allowLinkOwners:true,allowCreateEvidence:true,createDirectories:['.kidea/reviews','.kidea/reviews/evidence'].filter(p=>!existsSync(path.join(f.root,p))),assumptions,statement:'Synthetic review grant'}};
    q.package=op==='CREATE'?{subjectRefs:[ref('docs/features.md')],inputRefs:[ref('docs/features.md')],purpose:'CONTENT',waiverReason:null}:{conditionsMet:true,statement:'Synthetic assessed readiness'};
    if(['FEEDBACK','APPROVE'].includes(op))q.human={intent:op==='APPROVE'?'APPROVE':'REQUEST_CHANGES',statement:'Synthetic Human response',id:q.id,revision:q.revision,expectedDigest:q.expectedDigest,ownerIds:q.ownerIds};
    assert.equal((await approve(f.root,q)).state,'REVIEW_RECORDED');
  }
  const q=request(f),r=readResume(f.root,q),save=saveRequestNoRead(f,r,q);save.expectedBasis=r.basis;save.checkpoint.sourceRefs=[ref('docs/features.md')];
  const plan=prepareContinuation(f.root,save);assert.equal((await executeInternalWrite(plan.prepared,{testFault:'AFTER_VERIFY'})).state,'PENDING');
  const resumed=readResume(f.root,q);assert.equal(resumed.context,null);assert.equal(resumed.pending.targets[0].match,'PLANNED');assert.equal(record(f).currentItemId,'W-001');assert.equal(record(f,reviewPath).status,'APPROVED');
});
