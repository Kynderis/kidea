// Execution requires current scoped authority and this exact immutable manifest.
// Full R09 authority covers bounded retries; this is never a static check.
import {spawn,spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,existsSync,createWriteStream,statfsSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {userInfo} from 'node:os';
import {verify,root,hash} from './preflight.mjs';
const [manifestPath,flag,approvedHash]=process.argv.slice(2);
if(flag!=='--approved-manifest-sha256'||userInfo().uid===0)throw Error('EXPLICIT_APPROVAL_AND_ORDINARY_USER_REQUIRED');
const checked=verify(manifestPath),m=checked.manifest;if(approvedHash!==checked.manifestHash)throw Error('APPROVAL_MANIFEST_MISMATCH');
const runId='t02-'+randomUUID(),base=path.resolve(root,'../kidea-t02-build-lab'),output=path.join(base,runId);
if(m.outputParent!==base||existsSync(output))throw Error('OUTPUT_SCOPE');
const docker=(args)=>{const r=spawnSync('docker',args,{encoding:'utf8',timeout:60000,maxBuffer:4*1024*1024});if(r.status!==0)throw Error('DOCKER_READBACK_FAILED '+args[0]);return r.stdout;};
const context=JSON.parse(docker(['context','inspect']))[0];const endpoint=process.env.DOCKER_HOST??context.Endpoints?.docker?.Host;if(!endpoint?.startsWith('unix://'))throw Error('LOCAL_DOCKER_REQUIRED');
const info=JSON.parse(docker(['image','inspect',m.image]))[0];if(info.Id!==m.image||info.Os!=='linux'||info.Architecture!=='amd64')throw Error('IMAGE_CHANGED');
const fs=statfsSync(root);if(Number(fs.bavail)*Number(fs.bsize)<107374182400)throw Error('DISK_RESERVE');
mkdirSync(output,{recursive:true});writeFileSync(path.join(output,'manifest.json'),readFileSync(manifestPath));
const started=Date.now(),results=[];
function size(p){if(!existsSync(p))return 0;const r=spawnSync('/usr/bin/du',['-sk',p],{encoding:'utf8',timeout:10000});if(r.status!==0)throw Error('DISK_READBACK');return Number(r.stdout.split(/\s+/)[0])*1024;}
for(const preset of ['dev','asan-ubsan','tsan','release']){
 if(Date.now()-started>=m.limits.totalSeconds*1000)throw Error('TOTAL_DEADLINE');verify(manifestPath);
 const dir=path.join(output,preset),build=path.join(dir,'build'),out=path.join(dir,'out');mkdirSync(build,{recursive:true});mkdirSync(out);const name=runId+'-'+preset;
 const args=['create','--name',name,'--label','kidea.t02.run='+runId,'--label','kidea.t02.manifest='+approvedHash,'--env','KIDEA_T02_IMAGE='+m.image,'--network','none','--read-only','--user','1000:1000','--cpus','2','--memory','4g','--memory-swap','4g','--pids-limit','256','--cap-drop','ALL','--security-opt','no-new-privileges','--tmpfs','/tmp:rw,nosuid,size=268435456','--mount',`type=bind,src=${root},dst=/src,readonly`,'--mount',`type=bind,src=${checked.vendor},dst=/vendor,readonly`,'--mount',`type=bind,src=${build},dst=/build`,'--mount',`type=bind,src=${out},dst=/out`,m.image,'sh',m.revision==='r09-t05-events-build-r1'?'/src/scripts/t05/build.sh':'/src/scripts/t02/build.sh',preset];
 let id,reason=null,code=null;
 try{
  id=docker(args).trim();if(!/^[0-9a-f]{64}$/.test(id))throw Error('CONTAINER_ID');writeFileSync(path.join(dir,'container-id.txt'),id);
  const child=spawn('docker',['start','--attach',id],{stdio:['ignore','pipe','pipe']});const stdout=createWriteStream(path.join(dir,'stdout.txt')),stderr=createWriteStream(path.join(dir,'stderr.txt'));child.stdout.pipe(stdout);child.stderr.pipe(stderr);const at=Date.now();let stopping=false;
  const monitor=setInterval(()=>{try{const stats=statfsSync(root);if(Date.now()-at>m.limits.containerSeconds*1000||Date.now()-started>m.limits.totalSeconds*1000)reason='DEADLINE';else if(size(output)>m.limits.diskBytes||['dev','asan-ubsan','tsan','release'].reduce((n,p)=>n+size(path.join(output,p,'out')),0)>m.limits.dataBytes||Number(stats.bavail)*Number(stats.bsize)<107374182400)reason='DISK_LIMIT';if(reason&&!stopping){stopping=true;docker(['stop','--time','30',id]);}}catch(e){reason=e.message;if(!stopping){stopping=true;try{docker(['stop','--time','30',id]);}catch{child.kill('SIGTERM');}}}},2000);
  code=await new Promise(resolve=>{child.on('error',()=>resolve(-1));child.on('close',resolve);});clearInterval(monitor);await Promise.all([new Promise(r=>stdout.end(r)),new Promise(r=>stderr.end(r))]);
  const state=JSON.parse(docker(['inspect',id]))[0];writeFileSync(path.join(dir,'container-state.json'),JSON.stringify({Id:state.Id,State:state.State,Image:state.Image,labels:state.Config.Labels},null,2));
  if(state.State.Running||state.State.ExitCode!==0||code!==0||reason)throw Error(reason??'BUILD_OR_TEST_FAILED');
 }catch(e){reason=e.message;}
 finally{
  if(id){const state=JSON.parse(docker(['inspect',id]))[0];if(state.Config.Labels['kidea.t02.run']!==runId)throw Error('CLEANUP_IDENTITY');if(state.State.Running)docker(['stop','--time','30',id]);docker(['rm',id]);}
  results.push({preset,code,reason});writeFileSync(path.join(output,'results.json'),JSON.stringify({runId,manifestHash:approvedHash,results,state:reason?'FAIL':'IN_PROGRESS'},null,2));
 }
 if(reason){process.exitCode=1;break;}
}
verify(manifestPath);writeFileSync(path.join(output,'results.json'),JSON.stringify({runId,manifestHash:approvedHash,results,state:results.length===4&&results.every(r=>r.code===0&&!r.reason)?'EVIDENCE_READY_WITH_TSAN_LIMITATION_REVIEW_REQUIRED':'FAIL',notProductAcceptance:true},null,2));console.log(output);
