// Real Windows processes, synthetic projects only. Keep failed fixtures/logs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,mkdirSync,readFileSync,writeFileSync,existsSync,readdirSync,openSync,closeSync,renameSync,unlinkSync,linkSync,symlinkSync,chmodSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { buildBase,dataAt,envelope,paths } from '../fixtures/r02-t04/catalog.mjs';
import { prepareInternalWrite,executeInternalWrite,verifyInternalProof } from '../../.agents/skills/kidea/scripts/write-internal.mjs';
import { readStatus } from '../../.agents/skills/kidea/scripts/status.mjs';
import { validate } from '../../.agents/skills/kidea/scripts/schema.mjs';

const repo=fileURLToPath(new URL('../../',import.meta.url));
const powershell='C:/Users/vuhoa/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const powershellSha256='362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139';
const sha=b=>createHash('sha256').update(b).digest('hex');
assert.equal(process.platform,'win32');assert.equal(process.version,'v24.21.0');
assert.equal(sha(readFileSync(powershell)),powershellSha256);
const output=path.join(repo,'.test-output','r02-t06');mkdirSync(output,{recursive:true});
const runRoot=mkdtempSync(path.join(output,'native-write-'));
const sourcePaths=['.agents/skills/kidea/scripts/native-write.cs','.agents/skills/kidea/scripts/native-write.ps1','.agents/skills/kidea/scripts/write-internal.mjs','.agents/skills/kidea/scripts/status.mjs','.agents/skills/kidea/scripts/schema.mjs','.agents/skills/kidea/scripts/pending-writes.mjs','.agents/skills/kidea/scripts/recorded-completion.mjs','tests/r02-t06/native-write.test.mjs','tests/fixtures/r02-t04/catalog.mjs'];
const hashes=()=>Object.fromEntries(sourcePaths.map(p=>[p,sha(readFileSync(path.join(repo,p)))]));
const before=hashes();
writeFileSync(path.join(runRoot,'environment.json'),JSON.stringify({at:new Date().toISOString(),node:process.version,nodePath:process.execPath,powershell,powershellSha256,sources:before,scope:'Synthetic native writer tests; not Human approval or complete Kidea acceptance'},null,2));
console.log(`Native writer evidence: ${runRoot}`);
let runNumber=0;
function fixture(label,makeTargets) {
  const {world,refs}=buildBase();
  const root=mkdtempSync(path.join(runRoot,label+'-'));
  for(const [p,text] of Object.entries(world.files)){const dest=path.join(root,p);mkdirSync(path.dirname(dest),{recursive:true});writeFileSync(dest,text,{flag:'wx'});}
  const context={projectId:'synthetic-r02-t04',ownerId:'W-002',tool:dataAt(world,paths.checkpoint).tool,permissionRefs:[refs.policy],inputRefs:[refs.subject]};
  const targets=makeTargets?.(world)??[{path:'docs/notes.md',action:'UPDATE',plannedBytes:Buffer.from('NATIVE SYNTHETIC AFTER\n')},{path:'docs/new.md',action:'CREATE',plannedBytes:Buffer.from('NATIVE SYNTHETIC NEW\n')}];
  const authorization={root,metadataRoot:'.kidea/checkpoints',targets:targets.map(({path,action})=>({path,action})),allowRestoreUpdate:true,allowRetireOwnPending:true,assumptions:{localNtfs:true,noActiveSync:true,noConcurrentNamespaceChanges:true}};
  const args={root,authorization,context,targets};
  return {root,world,refs,args,prepare:()=>prepareInternalWrite(args)};
}
const bytes=(f,p)=>readFileSync(path.join(f.root,p));
const pending=f=>readdirSync(path.join(f.root,'.kidea/checkpoints/pending'));
const parseCheckpoint=file=>JSON.parse(readFileSync(file,'utf8').match(/<!-- kidea:data:start -->\r?\n```json\r?\n([\s\S]*?)\r?\n```\r?\n<!-- kidea:data:end -->/)[1]);
async function run(f,prepared=f.prepare(),options={}) {
  const id=String(++runNumber).padStart(3,'0');
  writeFileSync(path.join(runRoot,`${id}-request.json`),prepared.line,{flag:'wx'});
  const result=await executeInternalWrite(prepared,{powershell,powershellSha256,...options});
  writeFileSync(path.join(runRoot,`${id}-result.json`),JSON.stringify(result,null,2),{flag:'wx'});
  return result;
}
const noBusinessEffect=f=>{assert.equal(bytes(f,'docs/notes.md').toString(),f.world.files['docs/notes.md']);assert.equal(existsSync(path.join(f.root,'docs/new.md')),false);};

test('UPDATE + CREATE: immutable snapshots, schema checkpoint, complete byte proof; no task approval',async()=>{
  const f=fixture('success'),prepared=f.prepare();
  const result=await run(f,prepared);assert.equal(result.state,'COMPLETED_BYTES',JSON.stringify(result));
  for(const t of f.args.targets)assert.deepEqual(bytes(f,t.path),t.plannedBytes);
  assert.deepEqual(pending(f),[]);assert.equal(readStatus(f.root).readState,'OK');
  const dir=path.join(f.root,'.kidea/checkpoints/operations',prepared.operationId);
  const c=parseCheckpoint(path.join(dir,'checkpoint.md'));
  assert.equal(sha(readFileSync(path.join(dir,'request.json'))),prepared.planDigest);
  assert.equal(validate(c,'checkpoint',()=>{}),true);assert.ok(c.observations.some(o=>o.phase==='VERIFY'));
  assert.equal(readFileSync(path.join(dir,'before-0.bin'),'utf8'),f.world.files['docs/notes.md']);
  assert.equal(readFileSync(path.join(dir,'planned-0.bin'),'utf8'),f.args.targets[0].plannedBytes.toString());
  assert.equal(readFileSync(path.join(dir,'planned-1.bin'),'utf8'),f.args.targets[1].plannedBytes.toString());
  assert.ok(existsSync(path.join(dir,'prepared.md')));assert.ok(readdirSync(path.join(dir,'observations')).length>0);
  assert.equal(readStatus(f.root).data.items.find(i=>i.id==='W-002').executionStatus,'IN_PROGRESS');
  assert.equal(bytes(f,paths.work).toString(),f.world.files[paths.work]);
});

test('UPDATE work that is also graph input binds planned bytes under one handle',async()=>{
  const f=fixture('input-target',world=>{const w=dataAt(world,paths.work);w.nextAction='SYNTHETIC next action changed, not executed';return[{path:paths.work,action:'UPDATE',plannedBytes:Buffer.from(envelope(w))}];});
  const prepared=f.prepare(),request=JSON.parse(prepared.line);
  assert.equal(request.inputs.filter(i=>i.path===paths.work).length,1);
  const result=await run(f,prepared);assert.equal(result.state,'COMPLETED_BYTES',JSON.stringify(result));
  assert.deepEqual(bytes(f,paths.work),f.args.targets[0].plannedBytes);assert.equal(readStatus(f.root).readState,'OK');
});

test('native reacquire rejects graph source changed after Node validation',async()=>{
  const f=fixture('source-changed'),prepared=f.prepare();writeFileSync(path.join(f.root,'docs/features.md'),'SYNTHETIC concurrent user edit\n');
  const result=await run(f,prepared);assert.equal(result.state,'REJECTED',JSON.stringify(result));noBusinessEffect(f);
  assert.equal(bytes(f,'docs/features.md').toString(),'SYNTHETIC concurrent user edit\n');
});

test('native reacquire never overwrites UPDATE changed after preflight',async()=>{
  const f=fixture('target-changed'),prepared=f.prepare();writeFileSync(path.join(f.root,'docs/notes.md'),'SYNTHETIC external target bytes\n');
  const result=await run(f,prepared);assert.equal(result.state,'REJECTED',JSON.stringify(result));
  assert.equal(bytes(f,'docs/notes.md').toString(),'SYNTHETIC external target bytes\n');assert.equal(existsSync(path.join(f.root,'docs/new.md')),false);
});

test('CREATE existing after preflight is never converted to UPDATE',async()=>{
  const f=fixture('create-race'),prepared=f.prepare();writeFileSync(path.join(f.root,'docs/new.md'),'SYNTHETIC other creator\n',{flag:'wx'});
  const result=await run(f,prepared);assert.notEqual(result.state,'COMPLETED_BYTES',JSON.stringify(result));
  assert.equal(bytes(f,'docs/new.md').toString(),'SYNTHETIC other creator\n');
});

test('pre-existing editor handle blocks writer; no business mutation',async()=>{
  const f=fixture('editor'),prepared=f.prepare(),fd=openSync(path.join(f.root,'docs/notes.md'),'r+');
  try{const result=await run(f,prepared);assert.equal(result.state,'REJECTED',JSON.stringify(result));}finally{closeSync(fd);}
  noBusinessEffect(f);
});

test('Windows read-only target rejects the requested write access without overriding protection',async()=>{
  const f=fixture('read-only-target'),prepared=f.prepare();
  chmodSync(path.join(f.root,'docs/notes.md'),0o444);
  const result=await run(f,prepared);
  assert.equal(result.state,'REJECTED',JSON.stringify(result));noBusinessEffect(f);
  assert.equal(result.events.some(e=>e.event==='BYTES_VERIFIED'),false);
});

test('held lease allows input readers but denies target readers and all conflicting mutations',async()=>{
  const f=fixture('locks');let inspected=false;
  const result=await run(f,undefined,{testBarrier:'PENDING_CREATED',onBarrier:()=>{
    for(const p of ['docs/features.md','docs/notes.md']) {
      const target=path.join(f.root,p);
      if(p==='docs/features.md')assert.equal(readFileSync(target,'utf8'),f.world.files[p]);else assert.throws(()=>readFileSync(target));
      assert.throws(()=>writeFileSync(target,'SYNTHETIC intrusion'));
      assert.throws(()=>unlinkSync(target));assert.throws(()=>renameSync(target,target+'.moved'));
    }
    assert.throws(()=>renameSync(path.join(f.root,'docs'),path.join(f.root,'docs-renamed')));
    assert.notEqual(readStatus(f.root).readState,'OK');inspected=true;
  }});
  assert.equal(inspected,true);assert.equal(result.state,'COMPLETED_BYTES',JSON.stringify(result));
});

test('second writer cannot acquire project lock even for a disjoint target',async()=>{
  const f=fixture('two-writers'),first=f.prepare();
  const secondArgs={...f.args,targets:[{path:'docs/another.md',action:'CREATE',plannedBytes:Buffer.from('SYNTHETIC SECOND\n')}]};
  secondArgs.authorization={...f.args.authorization,targets:[{path:'docs/another.md',action:'CREATE'}]};
  const second=prepareInternalWrite(secondArgs);let contender;
  const owner=await run(f,first,{testBarrier:'LOCKS_ACQUIRED',onBarrier:async()=>{contender=await run(f,second);}});
  assert.equal(contender.state,'REJECTED',JSON.stringify(contender));assert.equal(owner.state,'COMPLETED_BYTES',JSON.stringify(owner));
  assert.equal(existsSync(path.join(f.root,'docs/another.md')),false);
});

for(const point of ['PREPARED','AFTER_PARTIAL_WRITE','AFTER_CREATE','AFTER_VERIFY'])test(`real process kill at ${point} leaves discoverable pending, no replay`,async()=>{
  const f=fixture('kill-'+point),prepared=f.prepare();
  const result=await run(f,prepared,{testBarrier:point,onBarrier:(_e,control)=>{control.kill();return false;}});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.ok(pending(f).length>0);
  const beforeRead=Object.fromEntries(f.args.targets.map(t=>[t.path,existsSync(path.join(f.root,t.path))?sha(bytes(f,t.path)):null]));
  const status=readStatus(f.root);assert.equal(status.readState,'INCOMPLETE');assert.equal(status.data,null);assert.ok(status.diagnostics.some(d=>d.code==='WRITE_PENDING'));
  assert.throws(()=>f.prepare(),e=>e.code==='GRAPH_NOT_VALID');
  const afterRead=Object.fromEntries(f.args.targets.map(t=>[t.path,existsSync(path.join(f.root,t.path))?sha(bytes(f,t.path)):null]));
  assert.deepEqual(afterRead,beforeRead);assert.equal(bytes(f,paths.work).toString(),f.world.files[paths.work]);
  if(point==='PREPARED')noBusinessEffect(f);
  if(point==='AFTER_CREATE')assert.equal(existsSync(path.join(f.root,'docs/new.md')),true);
});

test('failed UPDATE restores only its own before bytes while continuous lease is held',async()=>{
  const f=fixture('restore');
  const result=await run(f,undefined,{testFault:'AFTER_PARTIAL_WRITE'});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.equal(bytes(f,'docs/notes.md').toString(),f.world.files['docs/notes.md']);
  assert.equal(existsSync(path.join(f.root,'docs/new.md')),false);assert.ok(pending(f).length>0);
  const c=parseCheckpoint(path.join(f.root,'.kidea/checkpoints/operations',result.operationId,'checkpoint.md'));
  assert.ok(c.observations.some(o=>o.phase==='RESTORE'&&o.results.some(r=>r.path==='docs/notes.md'&&r.match==='BEFORE')));
});

test('restore disabled by trusted authorization retains partial UPDATE without overwrite',async()=>{
  const f=fixture('no-restore');f.args.authorization.allowRestoreUpdate=false;
  const result=await run(f,undefined,{testFault:'AFTER_PARTIAL_WRITE'});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.notEqual(bytes(f,'docs/notes.md').toString(),f.world.files['docs/notes.md']);assert.ok(pending(f).length>0);
});

test('failed second UPDATE restores only itself; earlier graph-input UPDATE stays planned',async()=>{
  const f=fixture('restore-second',world=>{const w=dataAt(world,paths.work);w.nextAction='SYNTHETIC first completed update';return[
    {path:paths.work,action:'UPDATE',plannedBytes:Buffer.from(envelope(w))},
    {path:'docs/notes.md',action:'UPDATE',plannedBytes:Buffer.from('SYNTHETIC second planned update\n')},
  ];});
  const result=await run(f,undefined,{testFault:'AFTER_PARTIAL_WRITE_SECOND'});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.deepEqual(bytes(f,paths.work),f.args.targets[0].plannedBytes);
  assert.equal(bytes(f,'docs/notes.md').toString(),f.world.files['docs/notes.md']);assert.ok(pending(f).length>0);
});

test('restore failure retains partial bytes and pending, never reports recovery',async()=>{
  const f=fixture('restore-fails');const result=await run(f,undefined,{testFault:'RESTORE_FAILURE'});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.ok(pending(f).length>0);assert.notEqual(bytes(f,'docs/notes.md').toString(),f.world.files['docs/notes.md']);
});

test('latched safety loss forbids restore even when other protected bytes still match',async()=>{
  const f=fixture('sticky-loss');const result=await run(f,undefined,{testFault:'SAFETY_LOSS_AFTER_PARTIAL_WRITE'});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.ok(pending(f).length>0);
  assert.equal(result.events.at(-1).safetyLost,true);assert.notEqual(bytes(f,'docs/notes.md').toString(),f.world.files['docs/notes.md']);
});

test('observed new hardlink during a partial write stops without restore; outside r2 safety guarantee',async()=>{
  const f=fixture('detected-link');let linked=false;
  const result=await run(f,undefined,{testFault:'AFTER_PARTIAL_WRITE',testBarrier:'AFTER_PARTIAL_WRITE',onBarrier:()=>{
    linkSync(path.join(f.root,'docs/notes.md'),path.join(f.root,'docs/alias.md'));linked=true;
  }});
  assert.equal(linked,true);assert.equal(result.state,'PENDING',JSON.stringify(result));assert.equal(result.events.at(-1).safetyLost,true);
  assert.notEqual(bytes(f,'docs/notes.md').toString(),f.world.files['docs/notes.md']);assert.deepEqual(bytes(f,'docs/alias.md'),bytes(f,'docs/notes.md'));
  assert.ok(pending(f).length>0);assert.equal(existsSync(path.join(f.root,'docs/new.md')),false);
});

for(const fault of ['CREATE_POSTOPEN_FAILURE','PENDING_POSTOPEN_FAILURE'])test(`${fault} records creation immediately, even when post-open validation fails`,async()=>{
  const f=fixture(fault);const result=await run(f,undefined,{testFault:fault});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.ok(pending(f).length>0);
  if(fault==='CREATE_POSTOPEN_FAILURE') {
    assert.equal(result.events.at(-1).effects,true);assert.equal(existsSync(path.join(f.root,'docs/new.md')),true);assert.deepEqual(bytes(f,'docs/notes.md'),f.args.targets[0].plannedBytes);
  } else noBusinessEffect(f);
});

test('fault after CREATE never deletes created file or rolls back earlier successful UPDATE',async()=>{
  const f=fixture('create-fault');const result=await run(f,undefined,{testFault:'AFTER_CREATE'});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.equal(existsSync(path.join(f.root,'docs/new.md')),true);
  assert.deepEqual(bytes(f,'docs/notes.md'),f.args.targets[0].plannedBytes);assert.ok(pending(f).length>0);
});

for(const fault of ['JOURNAL_FAILURE','AFTER_VERIFY','RETIRE_FAILURE'])test(`${fault} cannot claim completion or erase pending`,async()=>{
  const f=fixture(fault);const result=await run(f,undefined,{testFault:fault});
  assert.equal(result.state,'PENDING',JSON.stringify(result));assert.ok(pending(f).length>0);assert.equal(readStatus(f.root).readState,'INCOMPLETE');
});

test('hardlink introduced after preflight but before native acquisition is rejected',async()=>{
  const f=fixture('hardlink'),prepared=f.prepare();const alias=path.join(f.root,'docs/alias.md');linkSync(path.join(f.root,'docs/notes.md'),alias);
  const result=await run(f,prepared);assert.equal(result.state,'REJECTED',JSON.stringify(result));noBusinessEffect(f);assert.equal(readFileSync(alias,'utf8'),f.world.files['docs/notes.md']);
});

test('reparse directory introduced before native acquisition is not followed',async()=>{
  const f=fixture('junction'),prepared=f.prepare();const docs=path.join(f.root,'docs'),moved=path.join(f.root,'original-docs');renameSync(docs,moved);symlinkSync(moved,docs,'junction');
  const result=await run(f,prepared);assert.equal(result.state,'REJECTED',JSON.stringify(result));assert.equal(readFileSync(path.join(moved,'notes.md'),'utf8'),f.world.files['docs/notes.md']);
});

test('proof mismatch is rejected without accepting native completion',async()=>{
  const f=fixture('proof'),prepared=f.prepare(),result=await run(f,prepared);assert.equal(result.state,'COMPLETED_BYTES',JSON.stringify(result));
  const proof=result.events.find(e=>e.event==='BYTES_VERIFIED');
  assert.equal(verifyInternalProof(prepared,proof),true);
  for(const change of [p=>{p.planDigest='0'.repeat(64);},p=>{p.inputs.pop();},p=>{p.targets[0].integrity.value='0'.repeat(64);},p=>{p.checkpoint.targets[0].before.cleanup={at:new Date().toISOString(),reason:'synthetic false cleanup',evidenceRef:{path:'docs/policy.md',anchor:null}};}]) {
    const altered=structuredClone(proof);change(altered);assert.throws(()=>verifyInternalProof(prepared,altered));
  }
});

test.after(()=>{
  const after=hashes();const summary={at:new Date().toISOString(),inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),before,after,runRoot,runs:runNumber};
  writeFileSync(path.join(runRoot,'summary.json'),JSON.stringify(summary,null,2));assert.equal(summary.inputsUnchanged,true,'do not edit source while this suite runs');
});
