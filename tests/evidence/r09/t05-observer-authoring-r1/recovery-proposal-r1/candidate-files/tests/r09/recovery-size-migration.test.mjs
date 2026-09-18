// Synthetic private fixtures only; never edit the active pilot checkpoint.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fresh,put,ref,readRequest,assumptions,record} from './support.mjs';
import {readResume,prepareContinuation} from '../../.agents/skills/kidea/scripts/resume.mjs';
import {executeInternalWrite,prepareInternalWrite,MAX_PREPARED_REQUEST_BYTES} from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import {readRecovery,completeRecovery} from '../../.agents/skills/kidea/scripts/recovery.mjs';
import {initToolIdentity} from '../../.agents/skills/kidea/scripts/init.mjs';
import {byteIntegrity,hashBytes,recordBytes} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
mkdirSync('.test-output/r09',{recursive:true});const base=mkdtempSync(path.resolve('.test-output/r09/size-migration-'));
function save(root,requiredFiles=[ref('docs/plan.md')]){const q={...readRequest(root),requiredFiles},r=readResume(root,q);return {...q,operation:'SAVE',expectedBasis:r.basis,permission:{...q.permission,allowSaveContinuation:true,assumptions,statement:'Synthetic private fixture note only.'},checkpoint:{itemId:r.context.currentItem.id,completed:'Fixture milestone.',remaining:'No product acceptance.',nextAction:'Continue fixture.',sourceRefs:requiredFiles}};}
const permission=root=>({root,readProject:true,allowReadLocalGit:false});
async function oldToolPending(){
 const root=await fresh(base),prepared=prepareContinuation(root,save(root));await executeInternalWrite(prepared.prepared,{testFault:'BEFORE_FIRST_WRITE'});
 const markerPath=path.join(root,'.kidea/checkpoints/pending/active.json'),marker=JSON.parse(readFileSync(markerPath)),prefix=path.join(root,'.kidea/checkpoints/operations',marker.operationId),request=JSON.parse(readFileSync(path.join(prefix,'prepared-request.json'))),changed=[];
 for(const c of request.context.tool.components)if(['recovery.mjs','write-internal.mjs'].includes(c.name)){const actual=c.integrity;c.integrity=byteIntegrity(Buffer.from('Synthetic prior tool '+c.name));changed.push({name:c.name,from:c.integrity,to:actual});}
 // This reconstructs an old-tool synthetic fixture, not a real interrupted write.
 for(const name of ['prepared.md','checkpoint.md']){const old=JSON.parse(readFileSync(path.join(prefix,name),'utf8').match(/```json\n([\s\S]*?)\n```/)[1]);old.tool=request.context.tool;writeFileSync(path.join(prefix,name),recordBytes(old));}
 const bytes=Buffer.from(JSON.stringify(request));writeFileSync(path.join(prefix,'prepared-request.json'),bytes);marker.planDigest=hashBytes(bytes);writeFileSync(markerPath,JSON.stringify(marker)+'\n');
 return {root,prefix,marker,migration:{operationId:marker.operationId,planDigest:marker.planDigest,components:changed,statement:'Synthetic exact scoped tool migration; no production permission.'}};
}
function grant(root,p){const r=readRecovery(root,{operation:'READ_RECOVERY',permission:p});return {operation:'RECOVER',choice:'COMPLETE_PLANNED',expectedBasis:r.basis,expectedProjectId:r.projectId,expectedOwnerId:r.ownerId,expectedGit:r.checkout,permission:{...p,allowCompletePlanned:true,allowReplaceInterruptedGuard:false,ownerId:r.ownerId,targets:r.targets.map(({path,action})=>({path,action})),assumptions,statement:'Explicit synthetic permission for this exact fixture metadata and migration.'}};}
test('serialized envelope over128MiB is rejected before guard and leaves work unchanged',async()=>{
 const root=await fresh(base);put(root,'docs/large.md',Buffer.alloc(52*1024*1024,97));const before=readFileSync(path.join(root,'.kidea/work.md')),q=save(root,[ref('docs/large.md')]);
 assert.throws(()=>prepareContinuation(root,q),{code:'RECOVERY_REQUEST_TOO_LARGE'});assert.ok(readFileSync(path.join(root,'.kidea/work.md')).equals(before));assert.equal(existsSync(path.join(root,'.kidea/checkpoints/pending/active.json')),false);assert.equal(MAX_PREPARED_REQUEST_BYTES,128*1024*1024);
});
test('changed tool remains blocked without migration, and exact scoped migration can complete only metadata',async()=>{
 const f=await oldToolPending();assert.throws(()=>readRecovery(f.root,{operation:'READ_RECOVERY',permission:permission(f.root)}),{code:'RECOVERY_TOOL_CHANGED'});
 const p={...permission(f.root),toolMigration:f.migration},before=readFileSync(path.join(f.prefix,'prepared-request.json')),q=grant(f.root,p);
 assert.throws(()=>completeRecovery(f.root,{...q,permission:{...q.permission,allowCompletePlanned:false}}),{code:'RECOVERY_NEW_PERMISSION_REQUIRED'});
 assert.equal(completeRecovery(f.root,q).state,'RECOVERY_COMPLETED');assert.ok(readFileSync(path.join(f.prefix,'prepared-request.json')).equals(before));assert.equal(existsSync(path.join(f.root,'.kidea/checkpoints/pending/active.json')),false);
 const journals=readdirSync(f.prefix).filter(n=>/^recovery-.*\.json$/.test(n)&&!n.endsWith('-verified.json')&&n!=='recovery-guard.json');assert.equal(journals.length,1);assert.deepEqual(JSON.parse(readFileSync(path.join(f.prefix,journals[0]))).request.permission.toolMigration,f.migration);
});
test('wrong operation, digest, missing/additional pair, blank statement and wrong new integrity cannot migrate',async()=>{
 const f=await oldToolPending();const changes=[m=>m.operationId='foreign',m=>m.planDigest='0'.repeat(64),m=>m.components.pop(),m=>m.components.push(m.components[0]),m=>m.statement='',m=>m.components[0].to.value='0'.repeat(64)];
 for(const edit of changes){const m=structuredClone(f.migration);edit(m);assert.throws(()=>readRecovery(f.root,{operation:'READ_RECOVERY',permission:{...permission(f.root),toolMigration:m}}),{code:'RECOVERY_MIGRATION_PERMISSION'});}assert.ok(existsSync(path.join(f.root,'.kidea/checkpoints/pending/active.json')));
});
test('migration does not waive stale basis, OTHER bytes, source drift or runtime changes',async()=>{
 for(const scenario of ['basis','other','source','runtime']){
  const f=await oldToolPending(),p={...permission(f.root),toolMigration:f.migration},q=grant(f.root,p);
  if(scenario==='basis'){q.expectedBasis='stale';assert.throws(()=>completeRecovery(f.root,q),{code:'RECOVERY_BASIS_CHANGED'});}
  if(scenario==='other'){put(f.root,'.kidea/work.md','foreign data');assert.throws(()=>readRecovery(f.root,{operation:'READ_RECOVERY',permission:p}),{code:'RECOVERY_OTHER_BYTES'});}
  if(scenario==='source'){put(f.root,'docs/plan.md','source drift');assert.throws(()=>readRecovery(f.root,{operation:'READ_RECOVERY',permission:p}),{code:'RECOVERY_SOURCE_CHANGED'});}
  if(scenario==='runtime'){
   const m=JSON.parse(readFileSync(path.join(f.prefix,'prepared-request.json'))),node=m.context.tool.components.find(c=>c.name.startsWith('node-'));assert.ok(node);const actual=node.integrity;node.integrity=byteIntegrity(Buffer.from('Synthetic different Node binary'));
   for(const name of ['prepared.md','checkpoint.md']){const c=JSON.parse(readFileSync(path.join(f.prefix,name),'utf8').match(/```json\n([\s\S]*?)\n```/)[1]);c.tool=m.context.tool;writeFileSync(path.join(f.prefix,name),recordBytes(c));}
   const bytes=Buffer.from(JSON.stringify(m));writeFileSync(path.join(f.prefix,'prepared-request.json'),bytes);f.marker.planDigest=hashBytes(bytes);writeFileSync(path.join(f.root,'.kidea/checkpoints/pending/active.json'),JSON.stringify(f.marker)+'\n');
   p.toolMigration.planDigest=f.marker.planDigest;p.toolMigration.components.push({name:node.name,from:node.integrity,to:actual});p.toolMigration.components.sort((a,b)=>m.context.tool.components.findIndex(c=>c.name===a.name)-m.context.tool.components.findIndex(c=>c.name===b.name));
   assert.throws(()=>readRecovery(f.root,{operation:'READ_RECOVERY',permission:p}),{code:'RECOVERY_MIGRATION_PERMISSION'});
  }
  assert.ok(existsSync(path.join(f.root,'.kidea/checkpoints/pending/active.json')));
 }
});

test('individual planned file over64MiB is rejected before guard despite envelope below128MiB',async()=>{
 const root=await fresh(base),work=record(root),before=readFileSync(path.join(root,'docs/plan.md'));put(root,'evidence/authority.md',before);const version={source:ref('docs/plan.md'),location:{kind:'SNAPSHOT',ref:ref('evidence/authority.md')},integrity:byteIntegrity(before)};
 assert.throws(()=>prepareInternalWrite({root,authorization:{root,metadataRoot:'.kidea/checkpoints',targets:[{path:'docs/plan.md',action:'UPDATE'}],allowRestoreUpdate:false,allowRetireOwnPending:true,allowReadLocalGit:false,assumptions},context:{projectId:work.projectId,ownerId:work.currentItemId,tool:initToolIdentity(),permissionRefs:[version],inputRefs:[version]},targets:[{path:'docs/plan.md',action:'UPDATE',plannedBytes:Buffer.alloc(65*1024*1024,97)}]}),{code:'RECOVERY_FILE_TOO_LARGE'});
 assert.ok(readFileSync(path.join(root,'docs/plan.md')).equals(before));assert.equal(existsSync(path.join(root,'.kidea/checkpoints/pending/active.json')),false);
});
