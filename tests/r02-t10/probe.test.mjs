import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {workloads,buildFixture,assertStatus,hash} from './fixtures.mjs';
import {timedProcess,summarize,mayContinue,runRoot,assertBaselineFixture} from './probe.mjs';
import {inspectBoundGraph} from '../../.agents/skills/kidea/scripts/status.mjs';

for(const w of workloads)test(w.id+' has the approved load, semantic cases and complete read coverage',()=>{
  const f=buildFixture(w),seen=new Set();
  class TracedMap extends Map {get(p){seen.add(p);return super.get(p);}}
  const g=inspectBoundGraph(process.cwd(),new TracedMap(f.files));assertStatus(g.status,f.expected);
  assert.deepEqual([...seen].sort(),[...f.files.keys()].sort());assert.equal(g.gitReadCount,0);
  assert.equal(f.stats.tasks,w.tasks);assert.equal(f.stats.steps,10);assert.ok(f.stats.bytes>=w.minBytes);assert.ok(f.stats.markdown>=w.minMarkdown);
  assert.equal(f.stats.relations,w.tasks===100?390:3570);assert.equal(f.stats.done,w.tasks===100?30:330);
  assert.equal(g.status.data.returnStack.length,2);assert.equal(g.status.data.blockers.length,1);assert.equal(g.status.data.currentItemId,'T-0002');
  assert.equal(new Set(g.status.data.reviews.map(r=>r.recordedStatus)).size,3);assert.equal(g.status.data.items.filter(i=>i.name.length===200).length,w.tasks);
  for(const p of [...f.files.keys()].filter(p=>p.startsWith('docs/yeu-cau/'))){const s=f.files.get(p).toString();assert.equal([...s.matchAll(/^## /gm)].length,90);assert.match(s,/Không tách một yêu cầu/);assert.match(s,/VND/);}
});
test('fixture bytes and expected data are deterministic, with no unapproved size selection',()=>{
  const a=buildFixture(workloads[0]),b=buildFixture(workloads[0]);assert.deepEqual(a.expected,b.expected);
  assert.deepEqual([...a.files].map(([p,v])=>[p,hash(v)]),[...b.files].map(([p,v])=>[p,hash(v)]));
  assert.throws(()=>buildFixture({...workloads[0],tasks:1}),/Unapproved workload/);
});
test('coverage includes terminal docs and rejects missing product or stale reviewed bytes',()=>{
  const f=buildFixture(workloads[0]);f.files.delete('docs/yeu-cau/san-0030.md');
  assert.notEqual(inspectBoundGraph(process.cwd(),f.files).status.readState,'OK');
  const b=buildFixture(workloads[0]);b.files.set('docs/yeu-cau/san-0002.md',Buffer.from('Changed permission, no anchors'));
  assert.ok(inspectBoundGraph(process.cwd(),b.files).status.diagnostics.some(d=>d.code==='CURRENT_SOURCE_DIFFERS'));
});
test('output validation cannot accept missing progress, a changed gate, extra data or wrong task',()=>{
  const f=buildFixture(workloads[0]),good={...structuredClone(f.expected),observedAt:'2026-09-15T00:00:00.000Z'};assertStatus(good,f.expected);
  for(const mutate of [x=>x.data.items.pop(),x=>x.data.reviews[0].recordedStatus='DRAFT',x=>x.data.currentItemId='T-0001',x=>x.unexpected=true]){const bad=structuredClone(good);mutate(bad);assert.throws(()=>assertStatus(bad,f.expected),/STATUS_OUTPUT_DIFFERS/);}
});
test('summaries retain timeouts/errors and do not call an incomplete set eleven successes',()=>{
  const rows=Array.from({length:11},(_,i)=>({elapsedMs:i+1,success:i<9,timedOut:i===9}));
  assert.deepEqual(summarize(rows),{requested:11,attempted:11,successful:9,timeouts:1,errors:1,notRun:0,firstMs:1,medianSuccessfulMs:5,maxSuccessfulMs:9});
  assert.equal(summarize(rows.slice(0,3)).notRun,8);assert.equal(summarize([]).medianSuccessfulMs,null);
});
test('watchdog waits for this child to close and rejects unconfirmed stop or changed inputs',async()=>{
  const r=await timedProcess(process.execPath,['-e','setTimeout(()=>{},5000)'],process.cwd(),{timeoutMs:80});
  assert.equal(r.timedOut,true);assert.equal(r.confirmedStopped,true);assert.ok(r.elapsedMs>=80);
  assert.equal(mayContinue(r,true,true,false),true);assert.equal(mayContinue({...r,confirmedStopped:false},true,true,false),false);
  assert.equal(mayContinue(r,false,true,false),false);assert.equal(mayContinue(r,true,false,false),false);
});
test('failed process and output overflow cannot release the next measured slot',async()=>{
  const failed=await timedProcess(process.execPath,['-e','process.exit(3)'],process.cwd());assert.equal(failed.code,3);assert.equal(mayContinue(failed,true,true,false),false);
  const overflow=await timedProcess(process.execPath,['-e',"console.log('x'.repeat(4096))"],process.cwd(),{maxBytes:64});
  assert.equal(overflow.overflow,true);assert.equal(mayContinue(overflow,true,true,true),false);
});
test('unknown controller action cannot initialize or reset the run directory',()=>{
  const existed=existsSync(runRoot),r=spawnSync(process.execPath,['tests/r02-t10/probe.mjs','reset'],{cwd:process.cwd(),encoding:'utf8',windowsHide:true});
  assert.equal(r.status,1);assert.match(r.stderr,/no retry\/reset\/recovery/);assert.equal(existsSync(runRoot),existed);
});

test('D4 baseline guard checks exact fixture bytes, stats and expected output',()=>{
  const built=buildFixture(workloads[0]);
  const baseline={stats:structuredClone(built.stats),inventory:{files:Object.fromEntries([...built.files].map(([p,b])=>[p,{sha256:hash(b),bytes:b.length}]))},expectedHash:hash(JSON.stringify(built.expected,null,2)+'\n')};
  assertBaselineFixture(built,baseline);assert.throws(()=>assertBaselineFixture(built,undefined),/Missing D2 workload/);
  for(const mutate of [b=>b.stats.tasks++,b=>delete b.inventory.files['docs/yeu-cau/san-0001.md'],b=>b.inventory.files['docs/yeu-cau/san-0001.md'].sha256='0'.repeat(64),b=>b.expectedHash='0'.repeat(64)]){
    const bad=structuredClone(baseline);mutate(bad);assert.throws(()=>assertBaselineFixture(built,bad));
  }
});
test('D4 controller is fixed to a new root, never any retained run root',()=>{
  assert.match(runRoot,/[\\/]probe-r3$/);assert.doesNotMatch(runRoot,/[\\/](probe-r1|probe-r2|profile-r1)$/);
});
