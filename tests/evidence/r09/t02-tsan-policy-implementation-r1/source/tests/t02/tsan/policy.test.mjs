import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classify,policy,requireObservations,parseObservations} from '../../../scripts/t02/tsan-policy.mjs';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');const wal=read('wal.txt'),control=read('control.txt');let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
const run=(stderr=wal,extra={})=>classify({stderr,code:66,context:policy,...extra});
test('both actual r2 header reports require review',()=>assert.equal(run().state,'KNOWN_WAL_REPORT_REVIEW_REQUIRED'));
test('clean exit',()=>assert.equal(run('',{code:0}).state,'CLEAN'));
for(const [name,text,extra] of [
 ['real application-like race control',control,{}],['mixed known and unknown',wal+control,{}],['r5 halt-on-first log not complete',read('r5.txt'),{}],
 ['changed source line',wal.replace('68469','68470'),{}],['one missing stack',wal.replace('walIndexTryHdr','other'),{}],['wrong access',wal.replace('Previous read','Previous write'),{}],['wrong size',wal.replace('Write of size 8','Write of size 4'),{}],
 ['wrong address',wal.replace(/Previous read of size 8 at 0x[0-9a-f]+/,'Previous read of size 8 at 0x1234'),{}],['wrong shm offset',wal.replace('-shm+0x30','-shm+0x40'),{}],['project access with SQLite caller',wal.replace('#0 memcpy','#0 appRace'),{}],
 ['truncated',wal.slice(0,-100),{}],['missing trailer',wal.replace(/ThreadSanitizer: reported.*\n/,''),{}],['wrong count',wal.replace('reported 2','reported 1'),{}],['extra fatal',wal+'FATAL: ThreadSanitizer: broken\n',{}],
 ['warning on successful exit',wal,{code:0}],['timeout',wal,{timedOut:true}],['signal',wal,{signal:'SIGKILL'}],['oom',wal,{oom:true}],['unexpected code',wal,{code:1}],['missing log',undefined,{stderr:undefined}],['exit66 without log','',{}],
 ['source identity',wal,{context:{...policy,sqliteSha256:'changed'}}],['image identity',wal,{context:{...policy,image:'changed'}}],['compiler identity',wal,{context:{...policy,compiler:'changed'}}],['flag identity',wal,{context:{...policy,flags:'halt_on_error=1'}}],['inventory identity',wal,{context:{...policy,packageInventorySha256:'changed'}}],['no context',wal,{context:null}]
])test(name,()=>assert.equal(run(text,extra).state,'BLOCKED'));
const expected=JSON.parse(read('expected.json'));
test('796 raw oracle observations',()=>requireObservations(expected.observations,expected.observations));
for(const [name,actual] of [['missing assertion',expected.observations.slice(1)],['extra assertion',[...expected.observations,expected.observations[0]]],['wrong variant',expected.observations.map((x,i)=>i?x:{...x,variant:'different'})],['failure',expected.observations.map((x,i)=>i?x:{...x,status:'FAIL'})]])test(name,()=>assert.throws(()=>requireObservations(actual,expected.observations)));
test('missing case',()=>assert.throws(()=>requireObservations(expected.observations.filter(x=>x.caseId!=='C01'),expected.observations)));
test('missing HTTP',()=>assert.throws(()=>requireObservations(expected.http.slice(1),expected.http)));
test('18 HTTP baseline',()=>requireObservations(expected.http,expected.http));
test('invalid stdout',()=>assert.throws(()=>parseObservations('not JSON')));
test('real ASan oracle labels match despite generated IDs and race winner',()=>requireObservations(JSON.parse(read('asan-observations.json')),expected.observations));
test('invalid dynamic suffix blocked',()=>assert.throws(()=>requireObservations(expected.observations.map(x=>x.caseId==='I09'&&x.variant.startsWith('initial-same-intent-')?{...x,variant:'initial-same-intent-not-json'}:x),expected.observations)));
test('missing final race invariant blocked',()=>assert.throws(()=>requireObservations(expected.observations.filter(x=>x.variant!=='barrier-last-seat-race'),expected.observations)));
test('failure in dynamic variant blocked',()=>assert.throws(()=>requireObservations(expected.observations.map(x=>x.caseId==='I09'&&x.variant.startsWith('initial-same-intent-')?{...x,status:'FAIL'}:x),expected.observations)));
console.log(JSON.stringify({state:'OFFLINE_TESTS_PASS' ,count,runtimeContainers:0}));
