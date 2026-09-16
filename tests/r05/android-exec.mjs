import fs from 'node:fs';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {acquireBudget} from './backend-budget-r4.mjs';
const root=path.resolve(import.meta.dirname,'../..');
const evidence=path.join(root,'tests/evidence/r05/android-execution-r1');
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
fs.mkdirSync(evidence,{recursive:true});
const stat=()=>{const s=fs.statfsSync(root);return s.bavail*s.bsize;};
const startFile=path.join(evidence,'start.json');
if(!fs.existsSync(startFile)){
 if(process.getuid()===0)throw Error('Host root prohibited');
 fs.writeFileSync(startFile,JSON.stringify({at:new Date().toISOString(),head:spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim(),initialGit:spawnSync('git',['status','--short'],{encoding:'utf8'}).stdout,freeBytes:stat(),host:{platform:process.platform,arch:process.arch,uid:process.getuid(),node:process.version},approval:'Human: tôi duyệt, after A1 package at ca5a96f; SDK terms and 4GiB download/15GiB additional disk/35GiB cumulative/2CPU4GiB/3h approved'},null,2)+'\n',{flag:'wx'});
}
const start=JSON.parse(fs.readFileSync(startFile));
const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/backend-execution-r1/start.json'))).freeBytes;
function limits(){const free=stat();if(free<100*1024**3||start.freeBytes-free>15*1024**3||baseline-free>35*1024**3)throw Error('Disk quota');if(Date.now()-Date.parse(start.at)>10800_000)throw Error('A1 deadline');}
const [stage,seconds,...args]=process.argv.slice(2);
if(!/^[-a-z0-9]+$/.test(stage)||!Number.isFinite(Number(seconds)))throw Error('stage seconds docker-args required');
limits();const dir=fs.mkdtempSync(path.join(evidence,stage+'-'));
const stdout=fs.openSync(path.join(dir,'stdout.log'),'wx'),stderr=fs.openSync(path.join(dir,'stderr.log'),'wx');
const at=Date.now();let reservation;
try{reservation=acquireBudget(args);if(reservation.receipt)fs.writeFileSync(path.join(dir,'budget.json'),JSON.stringify(reservation.receipt,null,2)+'\n');}
catch(error){fs.writeSync(stderr,String(error));fs.closeSync(stdout);fs.closeSync(stderr);fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify({stage,args,at:new Date(at).toISOString(),launched:false,code:1,error:String(error)},null,2)+'\n');console.error(String(error));process.exit(1);}
const child=spawn(docker,args,{stdio:['ignore',stdout,stderr],detached:true});let stopped=false,stopReason=null;
function stop(reason){if(stopped)return;stopped=true;stopReason=reason;
 const targets=reservation.receipt?.planned.map(x=>x.name)||[];
 if(targets.length)spawnSync(docker,['stop','--timeout','5',...targets],{timeout:15000,stdio:'ignore'});
 try{process.kill(-child.pid,'SIGTERM');}catch{}
}
const timer=setTimeout(()=>stop('Stage deadline'),Math.min(Number(seconds)*1000,10800_000-(Date.now()-Date.parse(start.at))));
const monitor=setInterval(()=>{try{limits();}catch(error){stop(String(error));}},3000);
child.on('error',error=>{fs.writeSync(stderr,String(error));stop(String(error));});
child.on('close',(code,signal)=>{clearTimeout(timer);clearInterval(monitor);reservation.release();fs.closeSync(stdout);fs.closeSync(stderr);
 const result={stage,args,at:new Date(at).toISOString(),durationMs:Date.now()-at,code,signal,stopped,stopReason,freeBytes:stat()};fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({dir,...result}));process.exitCode=code===0&&!stopped?0:1;
});
