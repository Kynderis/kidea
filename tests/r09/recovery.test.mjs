import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fresh,put,ref,record,readRequest,assumptions} from './support.mjs';
import {prepareContinuation,readResume,resume} from '../../.agents/skills/kidea/scripts/resume.mjs';
import {executeInternalWrite} from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import {readRecovery,completeRecovery} from '../../.agents/skills/kidea/scripts/recovery.mjs';
import {readStatus} from '../../.agents/skills/kidea/scripts/status.mjs';
import {prepareInit} from '../../.agents/skills/kidea/scripts/init.mjs';
mkdirSync('.test-output/r09',{recursive:true});const base=mkdtempSync(path.resolve('.test-output/r09/recovery-'));console.log('Recovery evidence: '+base);
function save(root){const base=readRequest(root),r=readResume(root,base);return {...base,operation:'SAVE',expectedBasis:r.basis,expectedProjectId:r.context.projectId,expectedGit:r.context.checkout,permission:{...base.permission,allowSaveContinuation:true,preserveReviewIds:[],assumptions,statement:'Synthetic note permission.'},checkpoint:{itemId:r.context.currentItem.id,completed:'Synthetic context read.',remaining:'Product remains unexecuted.',nextAction:'Continue after recovery fixture.',sourceRefs:[ref('docs/plan.md')]}};}
async function pending(fault='BEFORE_FIRST_WRITE'){const root=await fresh(base),q=save(root),p=prepareContinuation(root,q);const result=await executeInternalWrite(p.prepared,{testFault:fault});assert.notEqual(result.state,'COMPLETED_BYTES');return root;}
const read=root=>readRecovery(root,{operation:'READ_RECOVERY',permission:{root,readProject:true,allowReadLocalGit:false}});
function grant(root,replace=false){const r=read(root);return {operation:'RECOVER',choice:'COMPLETE_PLANNED',expectedBasis:r.basis,expectedProjectId:r.projectId,expectedOwnerId:r.ownerId,expectedGit:r.checkout,permission:{root,readProject:true,allowReadLocalGit:false,allowCompletePlanned:true,allowReplaceInterruptedGuard:replace,ownerId:r.ownerId,targets:r.targets.map(({path,action})=>({path,action})),statement:'Explicit synthetic permission to complete these metadata bytes only.',assumptions}};}
test('before, partial and planned recover in a fresh process; original evidence survives',async()=>{
 for(const fault of ['BEFORE_FIRST_WRITE','AFTER_PARTIAL_WRITE','AFTER_VERIFY']){const root=await pending(fault),r=read(root),prefix=`.kidea/checkpoints/operations/${r.operationId}/`,before=readFileSync(path.join(root,prefix+'prepared.md'));assert.equal(readStatus(root).readState,'INCOMPLETE');const q=grant(root);const code=`import {resume} from ${JSON.stringify(new URL('../../.agents/skills/kidea/scripts/resume.mjs',import.meta.url).href)};console.log(JSON.stringify(await resume(${JSON.stringify(root)},${JSON.stringify(q)})));`;const child=spawnSync(process.execPath,['--input-type=module','-e',code],{encoding:'utf8',timeout:60000});assert.equal(child.status,0,child.stderr);assert.equal(JSON.parse(child.stdout).state,'RECOVERY_COMPLETED',child.stdout);assert.equal(readStatus(root).readState,'OK');assert.ok(readFileSync(path.join(root,prefix+'prepared.md')).equals(before));await assert.rejects(resume(root,q));}
});
test('source drift, stale/new authority, foreign bytes and unknown pending entries remain blocked',async()=>{
 const root=await pending(),q=grant(root);await assert.rejects(resume(root,{...q,permission:{...q.permission,allowCompletePlanned:false}}),{code:'RECOVERY_NEW_PERMISSION_REQUIRED'});await assert.rejects(resume(root,{...q,expectedBasis:'stale'}),{code:'RECOVERY_BASIS_CHANGED'});put(root,'docs/plan.md','changed');assert.throws(()=>read(root),{code:'RECOVERY_SOURCE_CHANGED'});assert.ok(existsSync(path.join(root,'.kidea/checkpoints/pending/active.json')));
 const other=await pending();put(other,'.kidea/work.md','unrecognized bytes');assert.throws(()=>read(other),{code:'RECOVERY_OTHER_BYTES'});
 const unknown=await pending();put(unknown,'.kidea/checkpoints/pending/foreign','unknown');assert.throws(()=>read(unknown),{code:'RECOVERY_UNKNOWN'});
});
test('interruption during recovery retains guard and requires fresh explicit replacement grant',async()=>{
 const root=await pending('AFTER_PARTIAL_WRITE'),q=grant(root),first=completeRecovery(root,q,{testFault:'AFTER_PARTIAL_WRITE'});assert.equal(first.state,'RECOVERY_NOT_COMPLETE');assert.equal(readStatus(root).readState,'INCOMPLETE');const fresh=grant(root);assert.throws(()=>completeRecovery(root,fresh),{code:'RECOVERY_GUARD_PERMISSION_REQUIRED'});const result=await resume(root,grant(root,true));assert.equal(result.state,'RECOVERY_COMPLETED');assert.match(record(root).nextAction,/Tiếp theo: Continue after recovery fixture\.$/);
});
test('interrupted CREATE-only bootstrap completes exact files; changed checkout and request bytes block',async()=>{
 const root=mkdtempSync(path.join(base,'bootstrap-'));
 const p=prepareInit(root,{projectName:'Recovery bootstrap fixture',humanRequest:'Synthetic fixture only.',featureSource:{mode:'NEW',path:'docs/features.md',anchor:null},profiles:[],permission:{root,metadataRoot:'.kidea/checkpoints',targets:[{path:'.kidea/INDEX.md',action:'CREATE'},{path:'.kidea/work.md',action:'CREATE'},{path:'docs/features.md',action:'CREATE'}],createDirectories:['docs'],allowRestoreUpdate:false,allowRetireOwnPending:true,bootstrap:true,assumptions,statement:'Synthetic bootstrap.'}});
 await executeInternalWrite(p.prepared,{testFault:'AFTER_CREATE'});assert.equal((await resume(root,grant(root))).state,'RECOVERY_COMPLETED');assert.equal(readStatus(root).readState,'OK');
 const modified=await pending(),r=read(modified);put(modified,`.kidea/checkpoints/operations/${r.operationId}/prepared-request.json`,'{}');assert.throws(()=>read(modified),{code:'RECOVERY_REQUEST_CHANGED'});
 const checkout=await pending(),oldGrant=grant(checkout);assert.equal(spawnSync('git',['init','--initial-branch=master',checkout],{encoding:'utf8'}).status,0);assert.throws(()=>completeRecovery(checkout,oldGrant),{code:'GIT_READ_NOT_AUTHORIZED'});assert.throws(()=>readRecovery(checkout,{operation:'READ_RECOVERY',permission:{root:checkout,readProject:true,allowReadLocalGit:true}}),e=>['RECOVERY_CHECKOUT_CHANGED','GIT_UNBORN_HEAD','GIT_COMMAND_FAILED','GIT_READ_FAILED'].includes(e.code));
});
