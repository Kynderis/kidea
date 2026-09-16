import fs from 'node:fs';
import http from 'node:http';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
const {sessions:[a]}=JSON.parse(fs.readFileSync('/secrets/sessions.json'));
const binary=process.env.KIDEA_BACKEND_BIN||'/build/dev/backend';
assert.ok(['/build/dev/backend','/build/asan-ubsan/backend','/build/tsan/backend'].includes(binary));
function request(method,path,body){return new Promise((resolve,reject)=>{
 const req=http.request({hostname:'127.0.0.1',port:8080,path,method,headers:{host:'localhost:8443',cookie:'__Host-kidea_session='+a.token,origin:'https://localhost:8443','x-csrf-token':a.csrf,'content-type':'application/json'}},res=>{let text='';res.on('data',d=>text+=d);res.on('end',()=>resolve({status:res.statusCode,text}));});
 req.on('error',reject);req.setTimeout(45000,()=>req.destroy(Error('request timeout')));req.end(body&&JSON.stringify(body));
});}
async function start(delay){
 const child=spawn(binary,[],{env:{...process.env,KIDEA_LAB_WRITE_DELAY_MS:String(delay)},stdio:['ignore','pipe','pipe']});
 let entered=false,logs='';child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>{logs+=d;entered=logs.includes('LAB_WRITE_ENTERED');});
 const exited=new Promise(resolve=>child.once('close',(code,signal)=>{
  assert.ok(!logs.includes(a.token)&&!logs.includes(a.csrf),'credential in backend output');
  process.stderr.write(logs);resolve({code,signal});
 }));
 for(let i=0;i<100;i++){try{if((await request('GET','/api/health')).status===200)return {child,exited,entered:()=>entered};}catch{}await new Promise(r=>setTimeout(r,25));}
 child.kill('SIGKILL');await exited;throw Error('startup failed');
}
const results=[];
const idle=await start(0);const idleStart=Date.now();idle.child.kill('SIGTERM');
assert.equal((await idle.exited).code,0);assert.ok(Date.now()-idleStart<5000);
console.log('empty queue shutdown PASS');
for(const delay of [800,40000]){
 const running=await start(delay);const id=randomUUID();
 const before=JSON.parse((await request('GET','/api/counts')).text);
 let response;
 const pending=request('POST','/api/write',{id,value:'durable drain',version:'1'}).then(r=>{response=r;},()=>{response={status:null,text:'UNKNOWN'};});
 for(let i=0;i<100&&!running.entered();i++)await new Promise(r=>setTimeout(r,10));
 assert.ok(running.entered(),'write never entered queue worker');
 const healthStart=Date.now();assert.equal((await request('GET','/api/health')).status,200);
 const healthMs=Date.now()-healthStart;assert.ok(healthMs<700,'DB worker blocked the HTTP event loop');
 const began=Date.now();running.child.kill('SIGTERM');
 let closed=false;for(let i=0;i<30;i++){if((await request('GET','/api/health')).status===503){closed=true;break;}await new Promise(r=>setTimeout(r,10));}
 assert.ok(closed,'admission did not close on SIGTERM');
 assert.equal((await request('POST','/api/write',{id:randomUUID(),value:'must not enter',version:'1'})).status,503);
 let forced=false;const timeout=setTimeout(()=>{forced=true;running.child.kill('SIGKILL');},35000);
 const exit=await running.exited;clearTimeout(timeout);const elapsed=Date.now()-began;await pending;
 const restarted=await start(0);
 const result=JSON.parse((await request('GET','/api/result?id='+id)).text).status;
 const after=JSON.parse((await request('GET','/api/counts')).text);
 restarted.child.kill('SIGTERM');await restarted.exited;
 const record={delayMs:delay,elapsedMs:elapsed,healthMs,forced,...exit,responseStatus:response.status,persistedResult:result,countsDelta:Object.fromEntries(Object.keys(before).map(k=>[k,after[k]-before[k]]))};
 results.push(record);console.log(JSON.stringify(record));
 assert.equal(forced,false,'worker join exceeded 30-second shutdown deadline');
 assert.equal(exit.code,0);
 if(delay===800){assert.equal(response.status,200);assert.equal(result,'SUCCESS');for(const n of Object.values(record.countsDelta))assert.equal(n,1);assert.ok(elapsed<5000);}
 else {assert.equal(response.status,null);assert.equal(result,'UNKNOWN');for(const n of Object.values(record.countsDelta))assert.equal(n,0);assert.ok(elapsed>=29000&&elapsed<=35000);}
}
console.log(JSON.stringify({passed:results.length,scope:'Actual queued writes, SIGTERM, bounded deadline and durable restart readback'}));
