// Executed ONLY by the approved container build package, never by static-check.
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const [binary,out]=process.argv.slice(2);if(!binary||!out)throw Error('binary and CREATE-only output required');mkdirSync(out);
const root='/src',db=path.join(out,'http.sqlite');
async function processRun(args){const p=spawn(binary,args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';p.stdout.on('data',b=>stdout+=b);p.stderr.on('data',b=>stderr+=b);let timedOut=false,error=null;p.on('error',e=>error=e.message);const timer=setTimeout(()=>{timedOut=true;p.kill('SIGKILL');},30000);const result=await new Promise(resolve=>p.on('close',(code,signal)=>resolve({code,signal})));const exit=result.code;writeFileSync(path.join(out,'initialize.process.json'),JSON.stringify({...result,timedOut,error}));clearTimeout(timer);writeFileSync(path.join(out,'initialize.stdout.txt'),stdout);writeFileSync(path.join(out,'initialize.stderr.txt'),stderr);assert.equal(exit,0);assert.equal(timedOut,false);assert.equal(error,null);}
const seed=JSON.parse(readFileSync(root+'/tests/t02/seed.json'));for(const session of seed.sessions)session.expires=Math.floor(Date.now()/1000)+300;const seedPath=path.join(out,'fake-seed.json');writeFileSync(seedPath,JSON.stringify(seed));
await processRun(['--initialize',db,root+'/backend/schema/001.sql',seedPath]);
const server=spawn(binary,['--serve-component-fixture',db],{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';server.stdout.on('data',b=>stdout+=b);server.stderr.on('data',b=>stderr+=b);let serverError=null;server.on('error',e=>serverError=e.message);const closed=new Promise(resolve=>server.on('close',(code,signal)=>resolve({code,signal})));const entries=[];
async function request(method,route,body,who='U',extra={}){const headers={cookie:'workshop_session=FAKE-LAB-'+who,'x-csrf-token':'FAKE-CSRF-'+who,origin:'https://workshop.test','content-type':'application/json',...extra};const r=await fetch('http://127.0.0.1:8080/api/v1'+route,{method,headers,body:method==='POST'?(typeof body==='string'?body:JSON.stringify(body)):undefined,signal:AbortSignal.timeout(5000)});const text=await r.text();let data;try{data=JSON.parse(text);}catch{data=null;}return {status:r.status,data,cache:r.headers.get('cache-control')};}
function check(id,value){entries.push({caseId:'HTTP',variant:id,status:value?'PASS':'FAIL'});if(!value)throw Error(id);}
try{
 let ready=false;for(let i=0;i<100;++i){try{ready=(await request('GET','/workshops')).status===200;}catch{}if(ready)break;await new Promise(r=>setTimeout(r,50));}check('startup',ready);
 const fields={title:'Workshop',description:'Plain text',capacity:1,schedule:{start:'2026-10-01T09:00:00+07:00',end:'2026-10-01T10:00:00+07:00'}};
 const admin=(intentId,action,other)=>request('POST','/admin/intents',{epoch:'epoch-t02-fixture',intentId,action,...other},'A');
 const made=await admin('create','CREATE',{fields});check('create',made.data?.code==='CREATED');const wid=made.data.workshopId;
 check('draft-hidden',(await request('GET','/workshops/'+wid)).status===404);
 check('open',(await admin('open','STATE',{workshopId:wid,targetState:'OPEN'})).data?.code==='UPDATED');
 const body={epoch:'epoch-t02-fixture',requestId:'X',workshopId:wid};const a=await request('POST','/registrations',body);check('register',a.data?.code==='REGISTERED');check('no-store',a.cache==='no-store');
 const again=await request('POST','/registrations',body);check('retry',JSON.stringify(again.data)===JSON.stringify(a.data));
 check('cross-actor',(await request('GET','/requests/X',null,'V')).data?.state==='UNKNOWN');
 check('full',(await request('POST','/registrations',body,'V')).data?.code==='FULL');
 check('csrf',(await request('POST','/registrations',body,'U',{'x-csrf-token':'wrong'})).status===401);
 check('origin',(await request('POST','/registrations',body,'U',{origin:'https://evil.test'})).status===401);
 check('duplicate-json',(await request('POST','/registrations','{"epoch":"x","epoch":"y"}')).status===400);
 check('comment-json',(await request('POST','/registrations','{/*comment*/'+JSON.stringify(body).slice(1))).status===400);
 check('trailing-comment-json',(await request('POST','/registrations',JSON.stringify(body)+'/*comment*/')).status===400);
 check('unknown-field',(await request('POST','/registrations',{...body,actor:'V'})).status===400);
 check('cancel',(await request('POST','/registrations/'+a.data.registrationId+'/cancel',{...body,requestId:'cancel'})).data?.code==='CANCELLED');
 const history=await request('GET','/me/registrations');check('private-history',history.data?.[0]?.registrations?.[0]?.state==='CANCELLED');
 const publicRead=await request('GET','/workshops/'+wid);check('public-redaction',!JSON.stringify(publicRead.data).includes('registrationId')&&!JSON.stringify(publicRead.data).includes('FAKE-'));
}catch(error){entries.push({caseId:'HTTP',variant:'harness',status:'FAIL',detail:error.message});process.exitCode=1;}
finally{server.kill('SIGTERM');let timedOut=false;const timer=setTimeout(()=>{timedOut=true;server.kill('SIGKILL');},30000);const result=await closed;const code=result.code;writeFileSync(path.join(out,'server.process.json'),JSON.stringify({...result,timedOut,error:serverError}));clearTimeout(timer);writeFileSync(path.join(out,'server.stdout.txt'),stdout);writeFileSync(path.join(out,'server.stderr.txt'),stderr);writeFileSync(path.join(out,'assertions.json'),JSON.stringify({entries,serverExit:code},null,2));if(code!==0||result.signal||timedOut||serverError)process.exitCode=1;}
