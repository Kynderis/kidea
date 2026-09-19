// Synthetic private fixtures only; never edit the active pilot checkpoint.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fresh,put,record,ref,assumptions} from './support.mjs';
import {prepareReview} from '../../.agents/skills/kidea/scripts/approve.mjs';
import {executeInternalWrite,MAX_PREPARED_REQUEST_BYTES,MAX_RECOVERY_FILE_BYTES} from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import {readRecovery,completeRecovery} from '../../.agents/skills/kidea/scripts/recovery.mjs';
import {hashBytes} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
import {resolveGitExecutable} from '../../.agents/skills/kidea/scripts/git-versions.mjs';

mkdirSync('.test-output/r09',{recursive:true});
const base=mkdtempSync(path.resolve('.test-output/r09/review-v3-'));
function git(root,args){const r=spawnSync(resolveGitExecutable(root),args,{cwd:root,encoding:'utf8',env:{...process.env,GIT_AUTHOR_NAME:'Kidea Fixture',GIT_AUTHOR_EMAIL:'fixture@example.invalid',GIT_COMMITTER_NAME:'Kidea Fixture',GIT_COMMITTER_EMAIL:'fixture@example.invalid',GIT_AUTHOR_DATE:'2026-01-01T00:00:00Z',GIT_COMMITTER_DATE:'2026-01-01T00:00:00Z'}});assert.equal(r.status,0,r.stderr);return r.stdout.trim();}
function commit(root){git(root,['init','-q']);git(root,['add','.']);git(root,['commit','-qm','fixture']);}
function request(root,sources=['docs/plan.md']){
 if(typeof sources==='string')sources=[sources];
 const id='review-v3',reviewPath=`.kidea/reviews/${id}.md`,ownerIds=[record(root).currentItemId];
 return {operation:'CREATE',id,revision:1,expectedDigest:null,ownerIds,package:{subjectRefs:sources.map(ref),inputRefs:sources.map(ref),purpose:'CONTENT',waiverReason:null},permission:{root,reviewPath,ownerIds,allowReviewMetadata:true,allowLinkOwners:true,allowCreateEvidence:true,allowReadLocalGit:true,createDirectories:['.kidea/reviews','.kidea/reviews/evidence'],assumptions,statement:'Synthetic exact review protocol v3 fixture only.'}};
}
async function pending(testFault='BEFORE_FIRST_WRITE'){const root=await fresh(base);commit(root);const plan=prepareReview(root,request(root)),result=await executeInternalWrite(plan.prepared,{testFault});assert.equal(result.state,'PENDING');return {root,plan,request:JSON.parse(plan.prepared.line)};}
const permission=root=>({root,readProject:true,allowReadLocalGit:true});

test('large Git-backed review uses compact protocol3 and completes without raising caps',async()=>{
 const root=await fresh(base),size=25*1024*1024,sources=['docs/large-a.bin','docs/large-b.bin'];
 put(root,sources[0],Buffer.alloc(size,97));put(root,sources[1],Buffer.alloc(size,98));commit(root);
 const plan=prepareReview(root,request(root,sources)),q=JSON.parse(plan.prepared.line);
 assert.equal(q.protocolVersion,3);assert.equal(q.review.inputEncoding,'INTEGRITY');assert.ok(Buffer.byteLength(plan.prepared.line)<MAX_PREPARED_REQUEST_BYTES);
 assert.ok(q.inputs.length);assert.ok(q.gitInputs.length);assert.ok(q.inputs.every(i=>i.integrity&&!Object.hasOwn(i,'expectedBase64')));assert.ok(q.gitInputs.every(i=>i.integrity&&!Object.hasOwn(i,'expectedBase64')));
 assert.ok(q.gitInputs.filter(i=>i.integrity.byteLength===size).length>=2);assert.ok(q.inputs.every(i=>i.integrity.byteLength<=MAX_RECOVERY_FILE_BYTES));
 assert.ok(q.targets.every(t=>Object.hasOwn(t,'beforeBase64')&&typeof t.plannedBase64==='string'));
 const result=await executeInternalWrite(plan.prepared);assert.equal(result.state,'COMPLETED_BYTES');assert.ok(existsSync(path.join(root,'.kidea/reviews/review-v3.md')));assert.equal(existsSync(path.join(root,'.kidea/checkpoints/pending/active.json')),false);
});

test('interrupted protocol3 review is read and completed from exact retained targets',async()=>{
 const f=await pending(),marker=JSON.parse(readFileSync(path.join(f.root,'.kidea/checkpoints/pending/active.json')));assert.equal(marker.protocolVersion,3);
 const ready=readRecovery(f.root,{operation:'READ_RECOVERY',permission:permission(f.root)});assert.equal(ready.state,'RECOVERY_READY');assert.ok(ready.targets.every(t=>t.match==='BEFORE'));
 const result=completeRecovery(f.root,{operation:'RECOVER',choice:'COMPLETE_PLANNED',expectedBasis:ready.basis,expectedProjectId:ready.projectId,expectedOwnerId:ready.ownerId,expectedGit:ready.checkout,permission:{...permission(f.root),allowCompletePlanned:true,allowReplaceInterruptedGuard:false,ownerId:ready.ownerId,targets:ready.targets.map(({path,action})=>({path,action})),assumptions,statement:'Explicit synthetic completion of exact v3 metadata targets.'}});
 assert.equal(result.state,'RECOVERY_COMPLETED');assert.ok(existsSync(path.join(f.root,'.kidea/reviews/review-v3.md')));assert.equal(existsSync(path.join(f.root,'.kidea/checkpoints/pending/active.json')),false);
});

test('protocol3 recovery accepts an UPDATE input target already at planned bytes',async()=>{
 const f=await pending('AFTER_VERIFY'),ready=readRecovery(f.root,{operation:'READ_RECOVERY',permission:permission(f.root)});
 assert.equal(ready.state,'RECOVERY_READY');assert.ok(ready.targets.every(t=>t.match==='PLANNED'));
 const result=completeRecovery(f.root,{operation:'RECOVER',choice:'COMPLETE_PLANNED',expectedBasis:ready.basis,expectedProjectId:ready.projectId,expectedOwnerId:ready.ownerId,expectedGit:ready.checkout,permission:{...permission(f.root),allowCompletePlanned:true,allowReplaceInterruptedGuard:false,ownerId:ready.ownerId,targets:ready.targets.map(({path,action})=>({path,action})),assumptions,statement:'Explicit synthetic completion of already-planned v3 review targets.'}});
 assert.equal(result.state,'RECOVERY_COMPLETED');assert.equal(existsSync(path.join(f.root,'.kidea/checkpoints/pending/active.json')),false);
});

test('protocol3 recovery rejects live source drift and OTHER target bytes',async()=>{
 const source=await pending();put(source.root,'docs/plan.md','changed source\n');assert.throws(()=>readRecovery(source.root,{operation:'READ_RECOVERY',permission:permission(source.root)}),{code:'RECOVERY_SOURCE_CHANGED'});
 const target=await pending(),reviewTarget=target.request.targets.find(t=>t.path==='.kidea/reviews/review-v3.md');assert.ok(reviewTarget);put(target.root,reviewTarget.path,'foreign target\n');assert.throws(()=>readRecovery(target.root,{operation:'READ_RECOVERY',permission:permission(target.root)}),{code:'RECOVERY_OTHER_BYTES'});
});

test('protocol3 recovery rejects tampered integrity and missing Git object',async()=>{
 for(const mode of ['integrity','git']){
  const f=await pending(),prefix=path.join(f.root,'.kidea/checkpoints/operations',f.request.operationId),requestPath=path.join(prefix,'prepared-request.json'),markerPath=path.join(f.root,'.kidea/checkpoints/pending/active.json'),q=JSON.parse(readFileSync(requestPath)),marker=JSON.parse(readFileSync(markerPath));
  if(mode==='integrity')q.inputs[0].integrity.value='0'.repeat(64);else q.gitInputs[0].location.commit='0'.repeat(40);
  const bytes=Buffer.from(JSON.stringify(q));writeFileSync(requestPath,bytes);marker.planDigest=hashBytes(bytes);writeFileSync(markerPath,JSON.stringify(marker)+'\n');
  assert.throws(()=>readRecovery(f.root,{operation:'READ_RECOVERY',permission:permission(f.root)}),{code:mode==='integrity'?'RECOVERY_SOURCE_CHANGED':'RECOVERY_GIT_CHANGED'});
 }
});
