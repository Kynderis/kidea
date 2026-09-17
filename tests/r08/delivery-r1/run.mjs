import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';import {randomBytes} from 'node:crypto';
import {deployment,compatible} from './child.mjs';
import {hash,verify} from '../product-build-r1/verify.mjs';import {inventory} from '../delivery-inputs-r1.mjs';
const repo=path.resolve(import.meta.dirname,'../../..'),plan=import.meta.dirname;
const manifest=JSON.parse(fs.readFileSync(path.join(plan,'manifest.json'))),mh=hash(path.join(plan,'manifest.json'));
assert.equal(process.argv[2],mh,'FROZEN_MANIFEST_REQUIRED');assert.notEqual(process.getuid(),0);
const inputPath=path.join(repo,'tests/evidence/r08/delivery-inputs-r1.json');assert.equal(hash(inputPath),manifest.inputs);
const input=JSON.parse(fs.readFileSync(inputPath)),src=path.join(repo,'.test-output/r08-product-inputs-r1/source');
const browserTools=path.join(repo,'.test-output/r08-delivery-inputs-r1');
function sources(){verify(plan,manifest.files,{packageManifest:true});for(const [name,sha] of Object.entries(manifest.browserTools))assert.equal(hash(path.join(browserTools,name)),sha);verify(src,JSON.parse(fs.readFileSync(path.join(repo,'tests/r08/product-build-r1/inputs.json'))).files);assert.equal(hash(input.backend.path),input.backend.sha256);assert.equal(hash(input.caddy.path),input.caddy.sha256);assert.deepEqual(inventory(path.join(input.web.root,'build')),input.web.build);assert.deepEqual(inventory(path.join(input.web.root,'node_modules')),input.web.dependencies);}
sources();
const out=path.join(repo,'.test-output/r08-b2-'+mh.slice(0,10));fs.mkdirSync(out);
for(const p of ['logs','tools']){fs.mkdirSync(path.join(out,p));fs.chmodSync(path.join(out,p),0o777);}
const started=manifest.budgetStartedAt,free=()=>{const s=fs.statfsSync(out);return s.bavail*s.bsize;},initialFree=manifest.diskBaselineBytes;
let seq=0,index=0;const owned=[],networks=[],checks=[];let pass=false,activeTarget='lab-dev',context;
function save(kind,data){fs.writeFileSync(path.join(out,'logs',String(++seq).padStart(3,'0')+'-'+kind+'.json'),JSON.stringify(data,null,2)+'\n',{flag:'wx'});}
async function docker(args,cleanup=false){
 if(!cleanup){verify(plan,manifest.files,{packageManifest:true});assert.ok(Date.now()-started<3600000,'DEADLINE');assert.ok(free()>100*1024**3&&initialFree-free()<8*1024**3,'DISK_LIMIT');}
 const result=await new Promise(resolve=>{const p=spawn('docker',args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='',error=null;const kill=e=>{error=e;p.kill('SIGKILL');};
 p.stdout.on('data',d=>{stdout+=d;if(stdout.length+stderr.length>16*1024**2)kill('LOG_LIMIT');});p.stderr.on('data',d=>{stderr+=d;if(stdout.length+stderr.length>16*1024**2)kill('LOG_LIMIT');});
 const timer=setTimeout(()=>kill('COMMAND_TIMEOUT'),cleanup?60000:200000);const monitor=setInterval(()=>{if(!cleanup&&(Date.now()-started>3600000||free()<100*1024**3||initialFree-free()>8*1024**3))kill('BUDGET');},2000);
 p.on('error',e=>{error=e.message;});p.on('close',code=>{clearTimeout(timer);clearInterval(monitor);resolve({code,error,stdout,stderr});});});
 save('docker',{args,...result});if(result.code!==0||result.error)throw Error('DOCKER_FAILED: '+args[0]+' '+result.stderr.slice(-2000));return result.stdout.trim();
}
async function stop(name){const info=JSON.parse(await docker(['inspect',name],true))[0];assert.equal(info.Config.Labels['kidea.r08.owner'],'b2-r1');await docker(['stop','--time=35',name],true);}
const mounts=component=>[[plan,'/plan'],[src,'/src'],[path.join(repo,'.test-output/r08-product-build-r1/build'),'/build'],[input.web.root,'/work'],[input.backend.path,'/backend'],[input.caddy.path,'/caddy'],[src+'/scripts/browser-https.mjs','/check.mjs'],[context.secrets,'/secrets'],[context.public,'/fixtures'],[component==='caddy'?context.ca:context.data,'/data',false],[out+'/tools','/tools',false],[out+'/logs','/out',false]];
async function start(component,command,extra=[],image=input.toolchain,network=context.network){
 const name='kidea-r08-b2-'+mh.slice(0,6)+'-'+(++index)+'-'+component;owned.push(name);
 const m=mounts(component);if(image===input.browser){m.push([browserTools+'/certutil','/usr/local/bin/certutil'],[browserTools+'/node','/opt/kidea-node/bin/node']);extra=[...extra,'PATH=/opt/kidea-node/bin:/usr/local/bin:/usr/bin:/bin'];}
 const args=deployment({target:activeTarget,component,name,network,image,mounts:m,command,env:extra});const ti=args.indexOf('--kill-after=10')+1;const ttl=Math.min(Number(args[ti]),Math.floor((started+3600000-Date.now())/1000)-10);assert.ok(ttl>0,'DEADLINE');args[ti]=String(ttl);
 await docker(args);return name;
}
async function check(command,{image=input.toolchain,network=context.network,env=[],exit=0}={}){
 const name=await start('check',command,env,image,network);const status=Number(await docker(['wait',name]));const log=await docker(['logs',name]);assert.equal(status,exit,'CHECK_EXIT '+command.join(' '));return log;
}
async function probe(action,...args){return check(['node','/plan/probe.mjs',action,...args]);}
async function db(action,p,...args){return JSON.parse(await check(['/tools/database',action,p,...args]));}
function counts(db){return Object.fromEntries(['domain','result','audit','outbox'].map(k=>[k,db[k]]));}
async function launch(component){
 if(component==='backend')return start(component,['/backend'],[],input.toolchain);
 if(component==='web')return start(component,['node','/work/build/index.js'],['KIDEA_INTEGRATION=1','HOST=0.0.0.0','PORT=4173','ORIGIN=https://localhost:8443','BODY_SIZE_LIMIT=131072','SHUTDOWN_TIMEOUT=30']);
 return start(component,['/caddy','run','--config','/src/Caddyfile','--adapter','caddyfile'],['XDG_DATA_HOME=/data','XDG_CONFIG_HOME=/tmp/config']);
}
async function identity(component,name){return JSON.parse(await docker(['exec',name,'node','/plan/identity.mjs',component,component==='backend'?input.backend.sha256:component==='caddy'?input.caddy.sha256:'node-image-pinned']));}
try {
 assert.equal(await docker(['ps','-q']),'','OTHER_WORKLOAD');
 for(const image of [input.toolchain,input.browser])assert.equal(JSON.parse(await docker(['image','inspect',image,'--format','{{json .Id}}'])),image);
 // Verify mutation guards before the first deployment.
 for(const target of ['production','unknown'])assert.throws(()=>deployment({target}));checks.push('target-guard');
 for(const target of ['lab-dev','lab-prod']){
  activeTarget=target;const config=JSON.parse(fs.readFileSync(path.join(plan,target+'.json')));assert.equal(config.realProduction,false);assert.equal(config.revision,manifest.revision);assert.equal(config.target,target);
  const root=path.join(out,target);fs.mkdirSync(root);for(const p of ['secrets','public','data','ca']){fs.mkdirSync(path.join(root,p));fs.chmodSync(path.join(root,p),0o777);}
  context={network:'kidea-r08-b2-'+mh.slice(0,6)+'-'+target,data:root+'/data',ca:root+'/ca',secrets:root+'/secrets',public:root+'/public'};
  const sessions=['A','B','viewer','expired'].map((actor,i)=>({actor,token:randomBytes(24).toString('hex'),csrf:randomBytes(24).toString('hex'),role:i<2?'admin':'viewer',ttl:i===3?-1:3300}));fs.writeFileSync(context.secrets+'/sessions.json',JSON.stringify({sessions}),{mode:0o644,flag:'wx'});
  await docker(['network','create','--internal','--label','kidea.r08.owner=b2-r1',context.network]);networks.push(context.network);
  if(target==='lab-dev')await check(['sh','-c','gcc-13 -std=c17 -Wall -Wextra -Werror -I/src/vendor/sqlite /plan/database.c /build/release/libsqlite_amalgamation.a -lpthread -ldl -lm -o /tools/database']);
  let backend=await launch('backend'),web=await launch('web'),caddy=await launch('caddy');
  // Caddy creates its isolated CA locally. Copy only the public certificate.
  await new Promise(r=>setTimeout(r,1500));await docker(['cp',caddy+':/data/caddy/pki/authorities/local/root.crt',context.public+'/root.crt']);await probe('ready');
  for(const [component,name] of [['backend',backend],['web',web],['caddy',caddy]])save('identity',{target,component,...await identity(component,name)});
  await check(['node','/src/scripts/layers-r4.mjs']);await check(['node','/src/scripts/header-boundary.mjs']);
  await check(['node','/src/scripts/https-check.mjs']);checks.push(target+'-https38-layers15-headers3');
  // Restart backend session state before browser: HTTPS deliberately revoked B.
  await stop(backend);backend=await launch('backend');await probe('ready');
  await check(['sh','/src/scripts/browser-bootstrap-r4.sh'],{image:input.browser,network:'container:'+caddy});checks.push(target+'-browser8');
  // A single component failure must remain PARTIAL, followed by explicit readback.
  await stop(web);await probe('partial');save('attempt',{target,state:'PARTIAL',reason:'web stopped',verified:false});web=await launch('web');await probe('ready');
  // Lost controller reply after a real committed POST: reconcile without replay.
  const before=JSON.parse(await probe('counts'));
  await check(['node','/plan/probe.mjs','lost-reply','b2-lost-intent'],{exit:23});save('attempt',{target,state:'UNKNOWN',intent:'b2-lost-intent'});
  const after=JSON.parse(await probe('counts'));for(const k of Object.keys(before))assert.equal(after[k],before[k]+1);await probe('result','b2-lost-intent');save('attempt',{target,state:'RECONCILED',replay:false});checks.push(target+'-partial-unknown-readback');
  const original=await db('inspect','/data/sample.db');assert.equal(original.sqlite,'3.53.4');assert.equal(original.integrity,'ok');
  await check(['/tools/database','backup','/data/sample.db','/data/backup.db']);const backup=await db('inspect','/data/backup.db');assert.deepEqual(backup,original);
  await check(['/tools/database','backup','/data/backup.db','/data/bad.db']);await check(['/tools/database','incompatible','/data/bad.db']);const bad=await db('inspect','/data/bad.db');assert.throws(()=>compatible(bad,original));save('schema-rejected',{target,expected:original,actual:bad,deployed:false});
  await probe('write','after-backup');await stop(backend);
  const originalData=context.data;context.data=root+'/restored';fs.mkdirSync(context.data);fs.chmodSync(context.data,0o777);
  // The destination is CREATE-only; SQLite backup API consumes the closed backup.
  fs.copyFileSync(originalData+'/backup.db',context.data+'/input.db',fs.constants.COPYFILE_EXCL);
  await check(['/tools/database','backup','/data/input.db','/data/sample.db']);const restored=await db('inspect','/data/sample.db');compatible(restored,original);assert.deepEqual(counts(restored),counts(original));
  backend=await launch('backend');await probe('ready');assert.deepEqual(JSON.parse(await probe('counts')),counts(original));await probe('post-restore');await probe('write','restored-admin-write');checks.push(target+'-sqlite-backup-restore-auth');save('restore',{target,backupSHA256:hash(originalData+'/backup.db'),before:original,restored});
  // Real Caddy drain, both completed work and forced deadline, new process each time.
  for(const stuck of [false,true]){
   const runningCaddy=await identity('caddy',caddy);
   const client=await start('check',['node','/src/scripts/drain-request.mjs'],['KIDEA_STUCK='+(stuck?'1':'0')]);
   let accepted=false;for(let i=0;i<30;i++){if((await docker(['logs',client])).includes('ACCEPTED')){accepted=true;break;}await new Promise(r=>setTimeout(r,100));}assert.ok(accepted);
   const began=Date.now();await docker(['exec','--detach',caddy,'sh','-c','sleep 0.05; kill -TERM "$1"','sh',String(runningCaddy.pid)]);assert.equal(Number(await docker(['wait',caddy])),0);const elapsed=Date.now()-began;
   assert.equal(Number(await docker(['wait',client])),0);save('drain',{target,stuck,elapsed,client:await docker(['logs',client])});assert.ok(stuck?elapsed>=29000&&elapsed<=35000:elapsed<5000);
   if(!stuck){caddy=await launch('caddy');await probe('ready');}
  }
  checks.push(target+'-drain-normal-stuck');await stop(backend);await stop(web);
 }
 sources();pass=true;
}catch(e){save('FAIL',{error:e.stack});process.exitCode=1;}
finally{
 let clean=true;for(const name of owned){try{await stop(name);const state=JSON.parse(await docker(['inspect',name],true))[0].State;save('final-state',{name,state});assert.equal(state.Running,false);}catch(e){clean=false;save('cleanup-fail',{name,error:String(e)});}}
 // Containers remain stopped for evidence; their internal networks are retained with them.
 fs.writeFileSync(out+'/summary.json',JSON.stringify({pass:pass&&clean,manifest:mh,checks,owned,networks,durationMs:Date.now()-started,clean,scope:'B2 local actual artifacts; no independent-host claim'},null,2)+'\n');if(!clean)process.exitCode=1;console.log(out);
}
