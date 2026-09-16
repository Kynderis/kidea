import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {acquireBudget} from './backend-budget-r4.mjs';
const root=path.resolve(import.meta.dirname,'../..'),sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const out=path.join(root,'tests/evidence/r05/backend-execution-r4');
const call=args=>{const reservation=acquireBudget(args);try{const r=spawnSync(docker,args,{encoding:'utf8',timeout:45000});if(r.status!==0)throw Error(r.stderr);return r.stdout;}finally{reservation.release();}};
const results=[];
const suffix=process.env.KIDEA_DRAIN_SUFFIX||'';
assert.ok(/^[a-z-]*$/.test(suffix));
for(const stuck of [false,true]){
 call(['start','kidea-r05-e2-r3-backend','kidea-r05-e2-r3-web','kidea-r05-e2-r3-caddy']);
 const name='kidea-r05-e2-r4-drain-'+(stuck?'stuck':'normal')+suffix;
 const args=['run','--name',name,'--label','kidea.run=E2-BW-r4','--cpus','0.5','--memory','1g','--memory-swap','1g','--network','kidea-r05-e2-r3-net','--read-only','--cap-drop','ALL','--security-opt','no-new-privileges','--env','KIDEA_STUCK='+(stuck?'1':'0'),'--mount',`type=bind,src=${sample}/scripts/drain-request.mjs,dst=/check.mjs,readonly`,'--mount',`type=bind,src=${sample}/runtime-r3/public,dst=/fixtures,readonly`,'kidea-r05-e2:toolchain','node','/check.mjs'];
 const reservation=acquireBudget(args);
 const client=spawn(docker,args,{stdio:['ignore','pipe','pipe']});let text='',err='';
 const done=new Promise(resolve=>client.on('close',code=>{reservation.release();resolve(code);}));
 try {
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('client not accepted')),10000);client.stdout.on('data',d=>{text+=d;if(text.includes('ACCEPTED')){clearTimeout(timer);resolve();}});client.stderr.on('data',d=>err+=d);client.on('close',()=>{clearTimeout(timer);if(!text.includes('ACCEPTED'))reject(Error('client exited before accepted'));});});
  const start=Date.now();call(['kill','--signal','TERM','kidea-r05-e2-r3-caddy']);
  const wait=call(['wait','kidea-r05-e2-r3-caddy']);const elapsed=Date.now()-start;
  const code=await done;
  fs.writeFileSync(path.join(out,name+'.log'),text+err);
  assert.equal(code,0);assert.equal(wait.trim(),'0');
  assert.ok(stuck?elapsed>=29000&&elapsed<=35000:elapsed<=5000,'edge drain time outside bound');
  results.push({stuck,elapsedMs:elapsed,exit:Number(wait.trim()),clientExit:code,args});
 }finally{call(['stop','--timeout','35','kidea-r05-e2-r3-caddy','kidea-r05-e2-r3-web','kidea-r05-e2-r3-backend']);}
}
fs.writeFileSync(path.join(out,'edge-drain'+suffix+'.json'),JSON.stringify(results,null,2)+'\n');
console.log('normal and stuck edge drain PASS');
