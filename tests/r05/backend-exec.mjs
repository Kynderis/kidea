import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn, spawnSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'../..');
const runId=process.env.KIDEA_E2_RUN || 'backend-execution-r1';
if(!/^backend-execution-r[12]$/.test(runId))throw Error('Unknown evidence run');
const evidence=path.join(root,'tests/evidence/r05',runId);
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.mkdirSync(evidence,{recursive:true});
const startFile=path.join(evidence,'start.json');
if(!fs.existsSync(startFile)){
  if(process.getuid()===0)throw Error('Host must be nonroot');
  const git=spawnSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'});
  const stat=fs.statfsSync(root);
  if(stat.bavail*stat.bsize<100*1024**3)throw Error('Insufficient free disk');
  fs.writeFileSync(startFile,JSON.stringify({at:new Date().toISOString(),sourceHead:spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).stdout.trim(),approval:'Human: ok làm đi, after explanation and E2-BW-r1 at 74a2772. Docker-only execution authorized.',host:{platform:process.platform,arch:process.arch,uid:process.getuid(),node:process.version},freeBytes:stat.bavail*stat.bsize,initialGitStatus:git.stdout,sample,manifestSha256:sha(path.join(root,'tests/r05/fixtures/backend-build-r1/manifest.json')),maxSessionSeconds:10800},null,2)+'\n',{flag:'wx'});
}
const start=JSON.parse(fs.readFileSync(startFile));
const remaining=10800_000-(Date.now()-Date.parse(start.at));
if(remaining<=0)throw Error('Approved session deadline reached');
const [stage,seconds,command,...args]=process.argv.slice(2);
if(!stage||!command||!/^[-a-z0-9]+$/.test(stage))throw Error('stage seconds executable argv required');
const dir=fs.mkdtempSync(path.join(evidence,stage+'-'));
const out=fs.openSync(path.join(dir,'stdout.log'),'wx');
const err=fs.openSync(path.join(dir,'stderr.log'),'wx');
const began=Date.now();
const executable=command==='docker'?docker:command;
const child=spawn(executable,args,{cwd:root,stdio:['ignore',out,err],detached:true,env:{...process.env,PATH:path.dirname(docker)+path.delimiter+process.env.PATH,DOCKER_CONTEXT:'desktop-linux'}});
let timedOut=false;
const timeout=setTimeout(()=>{timedOut=true;try{process.kill(-child.pid,'SIGTERM');}catch{}},Math.min(Number(seconds)*1000,remaining));
child.on('error',error=>fs.writeSync(err,String(error)));
child.on('close',(code,signal)=>{
  clearTimeout(timeout);fs.closeSync(out);fs.closeSync(err);
  const result={stage,executable,args,at:new Date(began).toISOString(),durationMs:Date.now()-began,code,signal,timedOut};
  fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({directory:dir,...result}));
  process.exitCode=code===0&&!timedOut?0:1;
});
