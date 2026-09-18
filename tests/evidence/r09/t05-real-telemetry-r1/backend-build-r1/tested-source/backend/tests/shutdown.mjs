// Real signals against the built server, all presets; no warning exemptions.
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const [binary,out]=process.argv.slice(2);mkdirSync(out);
const seed=JSON.parse(readFileSync('/src/tests/t02/seed.json'));for(const s of seed.sessions)s.expires=Math.floor(Date.now()/1000)+300;writeFileSync(out+'/seed.json',JSON.stringify(seed));
function start(args,label){const p=spawn(binary,args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='',error=null;p.stdout.on('data',b=>stdout+=b);p.stderr.on('data',b=>stderr+=b);p.on('error',e=>error=e.message);const done=new Promise(resolve=>p.on('close',(code,signal)=>{const r={code,signal,error};writeFileSync(out+'/'+label+'.stdout.txt',stdout);writeFileSync(out+'/'+label+'.stderr.txt',stderr);writeFileSync(out+'/'+label+'.json',JSON.stringify(r));resolve({...r,stderr});}));return {p,done};}
const results=[];
for(const signal of ['SIGTERM','SIGINT']){
 const db=out+'/'+signal+'.sqlite';const init=start(['--initialize',db,'/src/backend/schema/001.sql',out+'/seed.json'],signal+'-init');let timeout=setTimeout(()=>init.p.kill('SIGKILL'),10000);const initialized=await init.done;clearTimeout(timeout);assert.equal(initialized.code,0);assert.equal(initialized.stderr,'');
 const server=start(['--serve-component-fixture',db],signal);timeout=setTimeout(()=>server.p.kill('SIGKILL'),15000);
 try{let ready=false;for(let i=0;i<100;i++){try{ready=(await fetch('http://127.0.0.1:8080/api/v1/workshops',{signal:AbortSignal.timeout(1000)})).status===200;}catch{/* Startup not yet ready; bounded retries below. */}if(ready)break;await new Promise(r=>setTimeout(r,50));}assert.ok(ready);assert.ok(server.p.kill(signal));const r=await server.done;assert.equal(r.code,0);assert.equal(r.signal,null);assert.equal(r.error,null);assert.equal(r.stderr,'');results.push({signal,status:'PASS',exit:r.code});}
 finally{if(server.p.exitCode===null&&server.p.signalCode===null)server.p.kill('SIGKILL');await server.done;clearTimeout(timeout);writeFileSync(out+'/results.json',JSON.stringify(results,null,2));}
}
