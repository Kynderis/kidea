import test from 'node:test';
import assert from 'node:assert/strict';
import {Observer,POLICY,p95} from '../src/model.mjs';
import {originMs,time,config,sample,ingest,ready} from './fixtures.mjs';
const create=(c=config())=>new Observer(c,null,time(0));
const incident=(o,key,t=0)=>o.snapshot(time(t)).incidents[key];
const open=(o,key,t=0)=>incident(o,key,t)?.recoveredAtMs===null;

test('OP-T01: confirmed empty pending is N/A; missing sample >5s keeps last value and UNKNOWN',()=>{
 const o=create();ready(o);assert.equal(o.snapshot(time(5000)).sources.fast.current,true);
 const s=o.snapshot(time(5001));assert.equal(s.sources.fast.current,false);assert.equal(s.sources.fast.last.M1.oldestAgeMs,null);
 assert.equal(s.conclusion,'UNKNOWN');assert.equal(s.sources.fast.last.M1.pending,0);
});
test('OP-T02: one obligation at5s,5s+epsilon,30s; grows without new events',()=>{
 const o=create();ingest(o,'fast',1,0,{M1:{pending:1,oldestAgeMs:5000}});assert.equal(open(o,'M1:pending'),false);
 o.snapshot(time(1));assert.equal(incident(o,'M1:pending',1).level,'WARNING');
 ingest(o,'fast',2,2000,{M1:{pending:1,oldestAgeMs:30000}});assert.equal(incident(o,'M1:pending',2000).level,'CRITICAL');
});
test('OP-T03: old last processing success is not a heartbeat; no latency sample is N/A',()=>{
 const o=create();ready(o);ingest(o,'fast',2,2000,{M4:{lastSuccess:{atMs:originMs-10000000,version:'9007199254740993'}}});
 const s=o.snapshot(time(2000));assert.equal(open(o,'M3:lag',2000),false);assert.equal(p95(s.sources.fast.last.M3.samplesMs),null);
 assert.equal(s.sources.fast.current,true);
});
test('OP-T04: old/schema/nonce/authority-shaped samples never refresh freshness or accept secret fields',()=>{
 const variants=[s=>{s.sequence=1;},s=>{s.nonce='wrong';},s=>{s.schema=2;},s=>{s.signals.M1.pending=-1;},
 s=>{s.signals.M2.open=[{code:'secret-token',count:1}];},s=>{s.signals.M1.token='secret-token';},
 s=>{s.source='forged';},s=>{s.sampledAtMs=originMs+90000;},s=>{s.sampledAtMs=originMs-90000;}];
 for(const change of variants){const o=create();ready(o);const s=sample('fast',2,2000);change(s);
  assert.equal(o.ingest('fast',s,'nonce2',time(2000)),false);const view=o.snapshot(time(5001));
  assert.equal(view.sources.fast.current,false);assert.ok(!JSON.stringify(view).includes('secret-token'));}
});
test('OP-T05: invariant and version/permission conflict critical even if other sources UNKNOWN',()=>{
 for(const code of ['INVARIANT','VERSION_CONFLICT','PERMISSION']){const o=create();ingest(o,'fast',1,0,{M2:{open:[{code,count:1}],resolved:[]}});
 assert.equal(o.snapshot(time(10000)).conclusion,'CRITICAL');assert.equal(open(o,'M2:'+code,10000),true);}
});
test('OP-T06 component: two probe failures, target-specific, then three distinct5s successes',()=>{
 const o=create();o.probe('application',false,time(0));assert.equal(open(o,'M6:application'),false);
 o.probe('application',false,time(5000));assert.equal(incident(o,'M6:application',5000).level,'CRITICAL');
 for(const t of [10000,15000]){o.probe('application',true,time(t));assert.equal(open(o,'M6:application',t),true);}
 o.probe('application',true,time(20000));assert.equal(open(o,'M6:application',20000),false);
});
test('OP-T07: stopped probe/observer unknown; no server-side delivered claim and no write-ready',()=>{
 const o=create();ready(o);const s=o.snapshot(time(7001));assert.ok(s.unknown.includes('M6:application'));
 assert.equal(s.eligibility.writeReady,false);assert.equal(s.deliveryClaim,'NOT_MEASURED_AT_RECEIVER');
});
test('OP-T08:100 repeats coalesce; escalation, distinct component and exactly5minute reminder',()=>{
 const o=create();for(let n=1;n<=100;n++)ingest(o,'fast',n,0,{M2:{open:[{code:'PROCESSING',count:n}],resolved:[]}});
 assert.equal(o.state.notifications.filter(n=>n.key==='M2:PROCESSING').length,1);
 assert.equal(incident(o,'M2:PROCESSING').count,100);
 ingest(o,'fast',101,0,{M1:{pending:1,oldestAgeMs:30000},M2:{open:[{code:'PROCESSING',count:100}],resolved:[]}});
 o.snapshot(time(299999));assert.equal(o.state.notifications.filter(n=>n.key==='M1:pending').length,1);
 o.snapshot(time(300000));assert.equal(o.state.notifications.filter(n=>n.key==='M1:pending').length,2);
 o.snapshot(time(300001));assert.equal(o.state.notifications.filter(n=>n.key==='M1:pending').length,2);
});
test('OP-T09: good/missing/good is not recovery; ticks and same-time samples never add healthy observations',()=>{
 const o=create();ingest(o,'fast',1,0,{M1:{pending:1,oldestAgeMs:30000}});ingest(o,'fast',2,2000);
 for(let n=3;n<10;n++)ingest(o,'fast',n,2000);
 assert.equal(incident(o,'M1:pending',2000).healthy,1);o.snapshot(time(7001));
 for(const [n,t]of [[10,8000],[11,10000]]){ingest(o,'fast',n,t);assert.equal(open(o,'M1:pending',t),true);}
 ingest(o,'fast',12,12000);assert.equal(open(o,'M1:pending',12000),false);
});
test('OP-T09: M2/invariant cannot close from zero logs without explicit reconciliation resolution',()=>{
 const o=create();ingest(o,'fast',1,0,{M2:{open:[{code:'INVARIANT',count:1}],resolved:[]}});
 for(const [n,t]of [[2,2000],[3,4000],[4,6000]])ingest(o,'fast',n,t);
 assert.equal(open(o,'M2:INVARIANT',6000),true);
 for(const [n,t]of [[5,8000],[6,10000],[7,12000]])ingest(o,'fast',n,t,{M2:{open:[],resolved:['INVARIANT']}});
 assert.equal(open(o,'M2:INVARIANT',12000),false);
});
test('OP-T09: restart preserves first/count/severity/notified; resets freshness and recovery streak',()=>{
 const o=create();ingest(o,'fast',1,0,{M1:{pending:1,oldestAgeMs:30000}});ingest(o,'fast',2,2000);
 const saved=o.exportState();const restored=new Observer(config(),saved,time(2000));
 assert.equal(restored.snapshot(time(2000)).sources.fast.current,false);assert.equal(restored.state.restartCount,1);
 assert.equal(incident(restored,'M1:pending',2000).firstSeenMs,originMs);assert.equal(incident(restored,'M1:pending',2000).healthy,0);
 assert.equal(restored.state.notifications.filter(n=>n.key==='M1:pending').length,1);
 assert.equal(ingest(restored,'fast',2,2000),false);
});
test('OP-T10:80%/2GiB and incomplete destinations; known critical survives missing data',()=>{
 const o=create();const storage=sample('slow',1).signals.M8;storage.targets[0].bytes=Math.ceil(POLICY.dataLimitBytes*0.8);
 ingest(o,'slow',1,0,{M8:storage});assert.equal(incident(o,'M8:storage').level,'WARNING');
 storage.targets[0].bytes=POLICY.dataLimitBytes;ingest(o,'slow',2,30000,{M8:storage});assert.equal(incident(o,'M8:storage',30000).level,'CRITICAL');
 storage.complete=false;storage.targets=[];ingest(o,'slow',3,60000,{M8:storage});const s=o.snapshot(time(60000));
 assert.ok(s.unknown.includes('M8:incomplete'));assert.equal(s.conclusion,'CRITICAL');
});
test('OP-T10/15:10/15minute boundaries, no verified backup critical, recovery only two30s samples',()=>{
 for(const [age,expected]of [[600000,null],[600001,'WARNING'],[900000,'WARNING'],[900001,'CRITICAL']]){
 const o=create(),b=sample('slow',1).signals.M9;b.recoveryPointMs=originMs-age;ingest(o,'slow',1,0,{M9:b});
 assert.equal(incident(o,'M9:backup')?.level??null,expected);}
 const o=create(),b=sample('slow',1).signals.M9;b.verified=false;b.recoveryPointMs=null;b.sha256=null;
 ingest(o,'slow',1,0,{M9:b});ingest(o,'slow',2,30000);ingest(o,'slow',3,30000);assert.equal(open(o,'M9:backup',30000),true);
 ingest(o,'slow',4,60000);assert.equal(open(o,'M9:backup',60000),false);
});
test('OP-T12:M3/M7 no event=N/A; uncovered changes/error/missed offers/latency retain denominator',()=>{
 const o=create();const s=sample('fast',1);s.signals.M3.samplesMs=[10,3000];s.signals.M3.uncoveredAgeMs=[5001];
 s.signals.M7.read={scheduled:100,samplesMs:Array(99).fill(10).concat(10000),technicalErrors:2,missedOffers:1};
 assert.equal(o.ingest('fast',s,s.nonce,time(0)),true);assert.equal(open(o,'M3:lag'),true);assert.equal(open(o,'M7:read'),true);
 s.sequence=2;s.nonce='nonce2';s.signals.M7.read.samplesMs.pop();assert.equal(o.ingest('fast',s,s.nonce,time(2000)),false);
});
test('OP-T13: unconfirmed/expired run outside monitoring; same-host fixture never admission-ready',()=>{
 const c=config();c.run.confirmed=false;const o=create(c);ready(o);assert.equal(o.snapshot(time(0)).conclusion,'OUTSIDE_RUN');
 const normal=create();ready(normal);const s=normal.snapshot(time(0));assert.equal(s.eligibility.observationReady,false);
 assert.ok(s.eligibility.reasons.includes('INDEPENDENT_HOST_NOT_VERIFIED'));assert.equal(s.eligibility.writeReady,false);
 assert.equal(normal.snapshot(time(3600000)).conclusion,'OUTSIDE_RUN');
});
test('Clock/source identity: conservative skew, expired clock calibration, new boot retires previous boot',()=>{
 const c=config();c.sources.fast.clock.uncertaintyMs=100;const o=create(c);const s=sample('fast',1);s.sampledAtMs+=101;
 assert.equal(o.ingest('fast',s,s.nonce,time(0)),false);s.sampledAtMs-=1;assert.equal(o.ingest('fast',s,s.nonce,time(0)),true);
 const n=sample('fast',1,2000);n.boot='boot2';assert.equal(o.ingest('fast',n,n.nonce,time(2000)),true);
 const old=sample('fast',20,4000);assert.equal(o.ingest('fast',old,old.nonce,time(4000)),false);
 const expired=config();expired.sources.fast.clock.validForMs=1000;const e=create(expired);assert.equal(ingest(e,'fast',1,1001),false);
});
test('Wall jump/config/state corruption cannot create green or leak arbitrary saved fields',()=>{
 const o=create();ready(o);assert.equal(o.snapshot({wallMs:originMs+10000,monoMs:1000}).sources.fast.current,false);
 const saved=o.exportState();saved.incidents['token-secret']={};assert.throws(()=>new Observer(config(),saved,time(0)),/SCHEMA/);
 const changed=config();changed.run.id='other';assert.throws(()=>new Observer(changed,o.exportState(),time(0)),/STATE_CONFIG/);
});
test('A first failed probe is UNKNOWN, never a normal observation',()=>{
 const o=create();ready(o);o.probe('application',false,time(2000));const s=o.snapshot(time(2000));
 assert.ok(s.unknown.includes('M6:application'));assert.equal(s.conclusion,'UNKNOWN');
});
test('Unmeasured latency/load resets recovery; missing headroom is critical, missing fields schema invalid',()=>{
 const o=create();const lag=sample('fast',1).signals.M3;lag.samplesMs=[3000];ingest(o,'fast',1,0,{M3:lag});
 ingest(o,'fast',2,2000);const absent=sample('fast',3).signals.M3;absent.measured=false;ingest(o,'fast',3,4000,{M3:absent});
 for(const [n,t]of[[4,6000],[5,8000]]){ingest(o,'fast',n,t);assert.equal(open(o,'M3:lag',t),true);}
 ingest(o,'fast',6,10000);assert.equal(open(o,'M3:lag',10000),false);
 const b=sample('slow',1,10000);b.signals.M8.targets[0].freeBytes=0;
 assert.equal(o.ingest('slow',b,b.nonce,time(10000)),true);assert.equal(incident(o,'M8:storage',10000).level,'CRITICAL');
 b.sequence=2;b.nonce='nonce2';delete b.signals.M8.targets[0].headroomBytes;
 assert.equal(o.ingest('slow',b,b.nonce,time(12000)),false);
});
