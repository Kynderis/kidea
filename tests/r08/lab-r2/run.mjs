import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {digest,verifyPackage,preflight,classify,retryDecision,freshHeartbeat} from './guard.mjs';
import {containerArgs} from './deploy.mjs';
const source=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(source,'../../..');
const manifestBytes=fs.readFileSync(path.join(source,'manifest.json'));
const manifest={...JSON.parse(manifestBytes),digest:digest(manifestBytes)};
if(process.argv.length!==4||process.argv[2]!=='--approved-manifest'||process.argv[3]!==manifest.digest)throw Error('EXPLICIT_MATCHING_EXECUTION_APPROVAL_REQUIRED');
verifyPackage(source,manifest);
if(process.getuid?.()===0)throw Error('ROOT_NOT_ALLOWED');
if(fs.realpathSync(repo)!==repo)throw Error('REPO_SYMLINK');
const parent=path.join(repo,'.test-output');
fs.mkdirSync(parent,{recursive:true});if(fs.lstatSync(parent).isSymbolicLink())throw Error('OUTPUT_SYMLINK');
for(const name of fs.readdirSync(parent)){if(!/^r08-lab-r2-\d{13}-\d+$/.test(name))continue;const receipt=path.join(parent,name,'approval-basis.json');if(fs.existsSync(receipt)&&JSON.parse(fs.readFileSync(receipt)).grant.manifestSHA256===manifest.digest)throw Error('ONE_APPROVED_RUN_ALREADY_USED');}
const lock=path.join(parent,'r08-lab-r2.lock');const lockfd=fs.openSync(lock,'wx');fs.writeFileSync(lockfd,JSON.stringify({pid:process.pid,manifest:manifest.digest}));fs.closeSync(lockfd);
const run=`${Date.now()}-${process.pid}`;const out=path.join(parent,`r08-lab-r2-${run}`);fs.mkdirSync(out);
const snapshot=path.join(out,'source');fs.mkdirSync(snapshot);for(const name of [...Object.keys(manifest.files),'manifest.json'])fs.copyFileSync(path.join(source,name),path.join(snapshot,name),fs.constants.COPYFILE_EXCL);
const start=Date.now();let index=0;const managed=[];const attempts=[];const cases=[];let active=null;let paused=null;let complete=false;
const write=(name,value)=>fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
function bytes(dir){return fs.readdirSync(dir,{withFileTypes:true}).reduce((n,e)=>n+(e.isDirectory()?bytes(path.join(dir,e.name)):fs.statSync(path.join(dir,e.name)).size),0);}
function docker(args,{allowFailure=false,cleanup=false}={}) {
  if(!cleanup){if(Date.now()-start>900000)throw Error('TIME_LIMIT');const st=fs.statfsSync(out);if(st.bavail*st.bsize<100*1024**3||bytes(out)>128*1024**2)throw Error('DISK_LIMIT');verifyPackage(snapshot,manifest);}
  const r=spawnSync('docker',args,{encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
  write(`command-${String(++index).padStart(3,'0')}.json`,{at:new Date().toISOString(),args,status:r.status,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message});
  if(r.status!==0&&!allowFailure)throw Error(`DOCKER_FAILED:${args[0]}`);return r;
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function record(id,observed){cases.push({id,observed,at:new Date().toISOString()});write(`case-${id}.json`,cases.at(-1));}
function request(name,port,route,method='GET',allowFailure=false) {const r=docker(['exec',name,'node','/src/client.mjs',String(port),route,method],{allowFailure});return {code:r.status,response:r.status===0?JSON.parse(r.stdout):null};}
function state(name){const r=request(name,8011,'/state');assert.equal(r.response.status,200);return JSON.parse(r.response.body);}
function expected(target,web){return {target,backend:manifest.files['backend.mjs'],web:manifest.files[`${web}.html`],config:manifest.files[`${target}.json`]};}
function inspectOwn(name){const r=docker(['inspect',name,'--format','{{json .Config.Labels}}'],{cleanup:true});assert.equal(JSON.parse(r.stdout)['kidea.r08.run'],run);}
function stopActive(){if(active){inspectOwn(active);docker(['stop','--time=5',active],{cleanup:true});active=null;}}
async function deploy(target,web,attempt,fault='none') {
  preflight({target,grant,revision:manifest.revision,manifest,attempt,attempts});verifyPackage(snapshot,manifest);
  const external=docker(['ps','--format','{{.Names}}']).stdout.trim().split('\n').filter(Boolean).filter(n=>!managed.includes(n));if(external.length)throw Error('OTHER_WORKLOAD_RUNNING');
  const previous=active?state(active):null;
  write(`attempt-${attempt}.json`,{attempt,revision:manifest.revision,manifest:manifest.digest,target,web,fault,previous,at:new Date().toISOString()});attempts.push(attempt);
  stopActive();const data=path.join(out,target);if(!fs.existsSync(data)){fs.mkdirSync(data);fs.chmodSync(data,0o777);}
  const name=`kidea-r08-${run}-${attempt}`;managed.push(name);active=name;
  docker(containerArgs({name,run,target,web,fault,image:manifest.image,source:snapshot,data}));
  let s;for(let i=0;i<12;i++){const r=request(name,8011,'/state','GET',true);if(r.response?.status===200){s=JSON.parse(r.response.body);break;}await sleep(250);}assert.ok(s,'backend readiness');
  if(fault==='none') { let reachable=false;for(let i=0;i<12;i++){if(request(name,8012,'/','GET',true).response){reachable=true;break;}await sleep(250);}assert.ok(reachable,'Web readiness response'); }
  return name;
}
const grant={targets:['lab-dev','lab-prod'],realProduction:false,manifestSHA256:manifest.digest};
write('approval-basis.json',{grant,sourceBase:manifest.sourceBase,run,limits:manifest.limits,meaning:'CLI digest requires explicit Human execution approval; lab-prod is synthetic only'});
try {
  assert.equal(docker(['ps','-q']).stdout.trim(),'','Existing workload blocks lab');
  const image=JSON.parse(docker(['image','inspect',manifest.image,'--format','{"id":{{json .Id}},"arch":{{json .Architecture}},"os":{{json .Os}}}']).stdout);
  assert.equal(image.id,manifest.image);assert.equal(image.arch,'amd64');assert.equal(image.os,'linux');
  let name=await deploy('lab-dev','web-a','baseline');
  let before=state(name);let web=request(name,8012,'/').response;assert.equal(classify(before,web,expected('lab-dev','web-a')),'VERIFIED');record('baseline',{before,web});
  // Reject before invoking deploy; compare actual running state after all negative requests.
  for(const [id,changes] of Object.entries({wrongTarget:{target:'production'},wrongGrant:{grant:{...grant,targets:['lab-prod']}},wrongRevision:{revision:'r0'},reusedID:{attempt:'baseline'},overlap:{busy:true},changedSource:{sourceValid:false}})) {
    assert.throws(()=>preflight({target:'lab-dev',grant,revision:manifest.revision,manifest,attempt:'candidate',attempts,...changes}));
    const after=state(name);assert.deepEqual({...after,at:null},{...before,at:null});record(id,{rejectedBeforeSend:true,stateUnchanged:true});
  }
  // Real edited child copy fails digest validation before deployment.
  const altered=path.join(out,'altered');fs.cpSync(snapshot,altered,{recursive:true});fs.appendFileSync(path.join(altered,'migration.mjs'),'\n// changed\n');assert.throws(()=>verifyPackage(altered,manifest));record('changedChild',{rejected:true});
  name=await deploy('lab-dev','web-b','web-update');before=state(name);web=request(name,8012,'/').response;assert.equal(classify(before,web,expected('lab-dev','web-b')),'VERIFIED');record('reuse',{backendUnchanged:before.artifact===manifest.files['backend.mjs'],web});
  name=await deploy('lab-dev','web-b','partial','web-fail');before=state(name);const missing=request(name,8012,'/','GET',true);assert.notEqual(classify(before,missing.response,expected('lab-dev','web-b')),'VERIFIED');record('partial',{before,web:missing});
  name=await deploy('lab-dev','web-b','retry-new-id');assert.equal(classify(state(name),request(name,8012,'/').response,expected('lab-dev','web-b')),'VERIFIED');
  assert.equal(request(name,8011,'/backup','POST').response.status,200);
  const lost=request(name,8011,'/migrate-drop','POST',true);assert.notEqual(lost.code,0);const migrated=state(name);assert.equal(migrated.schema,2);assert.equal(migrated.migrations.length,1);assert.equal(retryDecision(migrated),'DO_NOT_REPLAY');record('lostReceipt',{lost,migrated,decision:retryDecision(migrated)});
  name=await deploy('lab-dev','web-a','app-rollback');assert.equal(request(name,8012,'/').response.status,503);assert.equal(state(name).schema,2);record('rollbackNotRestore',{schema:2,webStatus:503});
  assert.equal(request(name,8011,'/restore','POST').response.status,200);const restored=state(name);assert.equal(restored.schema,1);assert.equal(restored.rows[0].value,'fixture-original');assert.equal(restored.rows[0].role,'admin');assert.equal(restored.migrations.length,0);assert.equal(JSON.parse(request(name,8011,'/admin').response.body).allowed,true);assert.equal(classify(restored,request(name,8012,'/').response,expected('lab-dev','web-a')),'VERIFIED');record('restore',{restored});
  const heartbeat=()=>JSON.parse(fs.readFileSync(path.join(out,'lab-dev','heartbeat.json')));
  const h1=heartbeat();await sleep(1200);const h2=heartbeat();assert.ok(h2.at>h1.at);docker(['pause',name]);paused=name;await sleep(2300);const stale=heartbeat();assert.equal(freshHeartbeat(stale,Date.now()),false);docker(['unpause',name]);paused=null;record('observer',{heartbeatAdvancedWithoutClient:h2.at>h1.at,staleRejected:true,independentHost:'NOT_PROVEN'});
  stopActive();name=await deploy('lab-prod','web-a','lab-prod-baseline');assert.equal(classify(state(name),request(name,8012,'/').response,expected('lab-prod','web-a')),'VERIFIED');record('labProd',{sameDeployLogic:true,realProduction:false});
  complete=true;
} catch(e) {write('failure.json',{error:e.stack});process.exitCode=1;}
finally {
  let teardown=true;
  try{if(paused){inspectOwn(paused);docker(['unpause',paused],{cleanup:true});paused=null;}stopActive();}catch(e){teardown=false;write('teardown-failure.json',{error:e.stack});process.exitCode=1;}
  write('summary.json',{pass:complete&&teardown,cases:cases.map(c=>c.id),durationMs:Date.now()-start,teardown,managed,outputBytes:bytes(out),manifest:manifest.digest,limits:manifest.limits,notProven:['real product profile','browser rendering','independent host/observer','production','Apple Silicon']});
  if(teardown)fs.unlinkSync(lock);
  console.log(out);
}
