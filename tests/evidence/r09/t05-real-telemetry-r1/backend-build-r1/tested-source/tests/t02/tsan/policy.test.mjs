import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {classify,policy,requireObservations,parseObservations,completeReports} from '../../../scripts/t02/tsan-policy.mjs';
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
test('full current oracle observations',()=>requireObservations(expected.observations,expected.observations));
for(const [name,actual] of [['missing assertion',expected.observations.slice(1)],['extra assertion',[...expected.observations,expected.observations[0]]],['wrong variant',expected.observations.map((x,i)=>i?x:{...x,variant:'different'})],['failure',expected.observations.map((x,i)=>i?x:{...x,status:'FAIL'})]])test(name,()=>assert.throws(()=>requireObservations(actual,expected.observations)));
test('missing case',()=>assert.throws(()=>requireObservations(expected.observations.filter(x=>x.caseId!=='C01'),expected.observations)));
test('missing HTTP',()=>assert.throws(()=>requireObservations(expected.http.slice(1),expected.http)));
test('18 HTTP baseline',()=>requireObservations(expected.http,expected.http));
test('invalid stdout',()=>assert.throws(()=>parseObservations('not JSON')));
test('historical ASan fixture matches its original 46 cases only',()=>requireObservations(JSON.parse(read('asan-observations.json')),expected.observations.filter(x=>!/^Q0[1-4]$/.test(x.caseId))));
test('historical 796 assertions cannot satisfy new 856 assertion closure',()=>{assert.equal(expected.observations.length,856);assert.throws(()=>requireObservations(JSON.parse(read('asan-observations.json')),expected.observations));});
test('invalid dynamic suffix blocked',()=>assert.throws(()=>requireObservations(expected.observations.map(x=>x.caseId==='I09'&&x.variant.startsWith('initial-same-intent-')?{...x,variant:'initial-same-intent-not-json'}:x),expected.observations)));
test('missing final race invariant blocked',()=>assert.throws(()=>requireObservations(expected.observations.filter(x=>x.variant!=='barrier-last-seat-race'),expected.observations)));
test('failure in dynamic variant blocked',()=>assert.throws(()=>requireObservations(expected.observations.map(x=>x.caseId==='I09'&&x.variant.startsWith('initial-same-intent-')?{...x,status:'FAIL'}:x),expected.observations)));
const firstR6='==================\n'+completeReports(read('r6-I09.txt'))[0]+'==================\nThreadSanitizer: reported 1 warnings\n';
test('same approved pair with Linux deleted suffix',()=>assert.equal(run(firstR6).state,'KNOWN_WAL_REPORT_REVIEW_REQUIRED'));
test('deleted suffix wrong header offset remains blocked',()=>assert.equal(run(firstR6.replace('(deleted)+0x30','(deleted)+0x40')).state,'BLOCKED'));
test('unknown mapping decoration remains blocked',()=>assert.equal(run(firstR6.replace('(deleted)','(other)')).state,'BLOCKED'));
for(const id of ['I09','C01','C02','C03','C04','C05'])test('r6 approved r2 memcmp report requires review '+id,()=>assert.equal(run(read('r6-'+id+'.txt')).state,'KNOWN_WAL_REPORT_REVIEW_REQUIRED'));
const r6=read('r6-I09.txt');
for(const [name,text,extra]of [
 ['new reader function',r6.replace('#2 walTryBeginRead','#2 otherReader'),{}],
 ['new reader line',r6.replace('70780','70781'),{}],
 ['new reader interceptor0',r6.replace('#0 memcmp','#0 memcpy'),{}],
 ['new reader interceptor1',r6.replace('#1 memcmp','#1 memcpy'),{}],
 ['new reader interceptor line',r6.replace('interceptors.inc:844','interceptors.inc:845'),{}],
 ['new reader offset',r6.replace('(deleted)+0x0','(deleted)+0x8'),{}],
 ['new reader size',r6.replace(/Previous read of size 8/g,'Previous read of size 4'),{}],
 ['new reader hash',r6,{context:{...policy,sqliteSha256:'changed'}}],
 ['old exception identity',r6,{context:{...policy,id:'EX-T02-WAL-01-r1'}}],
 ['new reader mixed app race',r6+control,{}],
 ['new reader missing report tail',r6.slice(0,-100),{}],
 ['new reader wrong writer',r6.replace('68471','68469'),{}],
 ['new reader missing stack',r6.replace('#2 walTryBeginRead','#3 walTryBeginRead'),{}]
])test(name,()=>assert.equal(run(text,extra).state,'BLOCKED'));
test('new reader still requires full data oracle',()=>assert.throws(()=>requireObservations(expected.observations.filter(x=>x.caseId!=='I09'),expected.observations)));
test('r7 signal-unsafe allocation remains outside WAL exception',()=>assert.equal(run(read('signal-r7.txt')).state,'BLOCKED'));
const readFirst=read('r9-read-first.txt');
test('r9 same approved pairs in opposite display order',()=>{const result=run(readFirst);assert.equal(result.state,'KNOWN_WAL_REPORT_REVIEW_REQUIRED');assert.deepEqual(result.pairs,['68469:70135','68471:70133']);assert.equal(result.reports,2);});
for(const [name,text]of [
 ['two reads',readFirst.replace('Previous write of size 8','Previous read of size 8')],
 ['two writes',readFirst.replace('  Read of size 8','  Write of size 8')],
 ['missing previous marker',readFirst.replace('Previous write of size 8','Write of size 8')],
 ['role mismatches stack',readFirst.replace('  Read of size 8','  Write of size 8').replace('Previous write of size 8','Previous read of size 8')],
 ['wrong reader',readFirst.replace('sqlite3.c:70133','sqlite3.c:70134')],
 ['wrong writer',readFirst.replace('sqlite3.c:68471','sqlite3.c:68472')],
 ['wrong size',readFirst.replace('  Read of size 8','  Read of size 4')],
 ['wrong address',readFirst.replace(/Previous write of size 8 at 0x[0-9a-f]+/,'Previous write of size 8 at 0x1234')],
 ['wrong offset',readFirst.replace('-shm+0x0','-shm+0x8')],
 ['mixed application report',readFirst+control],
 ['truncated',readFirst.slice(0,-100)]
])test('read-first '+name+' stays blocked',()=>assert.equal(run(text).state,'BLOCKED'));
console.log(JSON.stringify({state:'OFFLINE_TESTS_PASS' ,count,runtimeContainers:0}));
