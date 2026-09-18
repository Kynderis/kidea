// Owned test process manager; control is private filesystem input, absent from the observer HTTP product.
import fs from 'node:fs';import {spawn}from 'node:child_process';
const role=process.argv[2];const command=role==='source'?['/plan/source-fixture.mjs']:['/observer/src/main.mjs','/config/observer.json'];
let child=null,generation=0,busy=false,closing=false;
const log=v=>fs.appendFileSync('/out/manager.jsonl',JSON.stringify({atMs:Date.now(),role,...v})+'\n');
async function stop(signal='SIGTERM'){
 if(!child)return;const c=child;if(c.exitCode===null&&c.signalCode===null){c.kill(signal);await new Promise(resolve=>c.once('exit',resolve));}
 child=null;
}
function start(){child=spawn(process.execPath,command,{stdio:['ignore','inherit','inherit']});log({event:'START',pid:child.pid});
 const c=child;c.on('exit',(code,signal)=>log({event:'EXIT',pid:c.pid,code,signal}));}
if(role==='observer')fs.mkdirSync('/state/private',{mode:0o700});
start();const timer=setInterval(()=>{
 if(busy||closing)return;const file='/control/'+role+'.json';if(!fs.existsSync(file))return;
 const q=JSON.parse(fs.readFileSync(file,'utf8'));if(q.generation<=generation)return;
 busy=true;void(async()=>{
  if(!['STOP','RESTART','CRASH_RESTART'].includes(q.action))throw Error('FIXTURE_CONTROL');
  await stop(q.action==='CRASH_RESTART'?'SIGKILL':'SIGTERM');if(q.action!=='STOP')start();
  generation=q.generation;fs.writeFileSync('/out/control-'+generation+'.json',JSON.stringify({generation,action:q.action,role,atMs:Date.now(),pid:child?.pid??null}));
 })().catch(error=>{log({event:'ERROR',code:error.message});process.exitCode=1;}).finally(()=>{busy=false;});
},100);
process.on('SIGTERM',()=>{closing=true;clearInterval(timer);void stop().then(()=>process.exit());});
