import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {SnapshotStore}from '../src/store.mjs';import{Runtime}from '../src/runtime.mjs';import{Observer}from '../src/model.mjs';import{config,time,ingest}from './fixtures.mjs';
const directory=()=>fs.mkdtempSync(path.join(os.tmpdir(),'workshop-observer-test-'));
test('OP-T09:atomic durable checkpoint restart keeps incidents and notifications; fresh observation required',()=>{
 const d=directory();let at=time(0);const r=new Runtime(config(),d,()=>at);
 r.update(o=>ingest(o,'fast',1,0,{M1:{pending:1,oldestAgeMs:30000}}));const before=r.view();r.close();at=time(2000);
 const restored=new Runtime(config(),d,()=>at);const after=restored.view();assert.equal(after.restartCount,1);
 assert.equal(after.incidents['M1:pending'].firstSeenMs,before.incidents['M1:pending'].firstSeenMs);
 assert.equal(after.sources.fast.current,false);assert.equal(after.conclusion,'CRITICAL');restored.close();
});
test('Storage corruption/config drift never resets data to healthy; bytes retained',()=>{
 const d=directory(),s=new SnapshotStore(d);s.save(new Observer(config(),null,time(0)).exportState());s.close();
 const file=path.join(d,'observer.json');fs.writeFileSync(file,'BROKEN');const before=fs.readFileSync(file);
 assert.throws(()=>new Runtime(config(),d,()=>time(0)),/OBSERVER_START/);assert.deepEqual(fs.readFileSync(file),before);
});
test('Durability error never publishes uncommitted data or readiness',()=>{
 const d=directory(),r=new Runtime(config(),d,()=>time(0)),before=r.view();r.store.save=()=>{throw Error('secret-path');};
 assert.equal(r.update(o=>ingest(o,'fast',1,0)),false);const view=r.view();assert.equal(view.conclusion,'UNKNOWN');
 assert.equal(view.eligibility.writeReady,false);assert.deepEqual(view.persistedLast,before);assert.ok(!JSON.stringify(view).includes('secret-path'));r.close();
});
test('Single local writer: active lock rejected, no data overwrite',()=>{
 const d=directory(),s=new SnapshotStore(d);assert.throws(()=>new SnapshotStore(d),/STATE_LOCK/);s.close();
});
test('Symlink/public state directory and oversized snapshot rejected without deleting evidence',()=>{
 const d=directory(),s=new SnapshotStore(d,{limitBytes:100});assert.throws(()=>s.save({secret:'x'.repeat(1000)}),/STATE_LIMIT/);s.close();
 const other=directory();fs.symlinkSync(other,path.join(d,'link'));assert.throws(()=>new SnapshotStore(path.join(d,'link')),/STATE_PERMISSION/);
 const pub=directory();fs.chmodSync(pub,0o755);assert.throws(()=>new SnapshotStore(pub),/STATE_PERMISSION/);
});
test('Storage failure preserves visible known critical instead of replacing it with UNKNOWN',()=>{
 const d=directory(),r=new Runtime(config(),d,()=>time(0));r.update(o=>ingest(o,'fast',1,0,{M1:{pending:1,oldestAgeMs:30000}}));
 r.store.save=()=>{throw Error('FAIL');};const s=r.view();assert.equal(s.conclusion,'CRITICAL');
 assert.ok(s.unknown.includes('OBSERVER_STORAGE'));assert.equal(s.incidents['M1:pending'].level,'CRITICAL');r.close();
});
