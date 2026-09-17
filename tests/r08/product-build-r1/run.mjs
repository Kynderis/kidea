import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {hash,verify,authorize} from './verify.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(dir,'../../..');
const manifestPath=path.join(dir,'manifest.json'),manifest=JSON.parse(fs.readFileSync(manifestPath)),mh=hash(manifestPath);
authorize(process.argv.slice(2),mh);
verify(dir,manifest.scripts,{packageManifest:true});
const inputs=JSON.parse(fs.readFileSync(path.join(dir,'inputs.json'))),base=path.join(repo,'.test-output/r08-product-inputs-r1'),source=path.join(base,'source');
assert.notEqual(process.getuid?.(),0);assert.equal(fs.realpathSync(base),base);assert.equal(fs.realpathSync(source),source);verify(source,inputs.files);assert.equal(hash(path.join(base,'npm-cache.tar')),inputs.npmCache.sha256);
// The export is pinned; only ordinary files/directories rooted under .npm-cache were accepted during preparation.
const lock=path.join(repo,'.test-output/r08-product-build-r1.lock');fs.writeFileSync(lock,mh,{flag:'wx'});
const output=path.join(repo,'.test-output/r08-product-build-r1');fs.mkdirSync(output); // one CREATE-only attempt
for(const name of ['build','work','logs']){fs.mkdirSync(path.join(output,name));fs.chmodSync(path.join(output,name),0o777);}
const names=[],start=Date.now();let seq=0,active=null,pass=false;
const disk=()=>{const st=fs.statfsSync(output);return st.bavail*st.bsize;};const freeStart=disk();
async function command(args,cleanup=false){
 if(!cleanup){if(Date.now()-start>3600000)throw Error('DEADLINE');const free=disk();if(free<100*1024**3||freeStart-free>8*1024**3)throw Error('DISK_LIMIT');verify(dir,manifest.scripts,{packageManifest:true});verify(source,inputs.files);}
 const p=await new Promise(resolve=>{const child=spawn('docker',args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='',error=null;const kill=reason=>{error=reason;child.kill('SIGKILL');};
 child.stdout.on('data',b=>{stdout+=b.toString();if(Buffer.byteLength(stdout)+Buffer.byteLength(stderr)>16*1024**2)kill('LOG_LIMIT');});child.stderr.on('data',b=>{stderr+=b.toString();if(Buffer.byteLength(stdout)+Buffer.byteLength(stderr)>16*1024**2)kill('LOG_LIMIT');});
 const timer=setTimeout(()=>kill('COMMAND_TIMEOUT'),cleanup?60000:1800000);
 const monitor=cleanup?null:setInterval(()=>{try{const free=disk();if(free<100*1024**3||freeStart-free>8*1024**3)kill('DISK_LIMIT');if(Date.now()-start>3600000)kill('RUN_DEADLINE');}catch(e){kill(e.message);}},2000);
 child.on('error',e=>{error=e.message;});child.on('close',code=>{clearTimeout(timer);if(monitor)clearInterval(monitor);resolve({code,error,stdout,stderr});});});
 fs.writeFileSync(path.join(output,'logs',`${++seq}.json`),JSON.stringify({args,...p},null,2)+'\n',{flag:'wx'});if(p.code!==0||p.error)throw Error('DOCKER_COMMAND_FAILED');return p.stdout;
}
async function owned(name){const labels=JSON.parse(await command(['inspect',name,'--format','{{json .Config.Labels}}'],true));assert.equal(labels['kidea.r08.product'],mh);}
try {
 assert.equal((await command(['ps','-q'])).trim(),'','Other running workloads block this run');
 for(const image of [manifest.toolchain,manifest.browser])assert.equal(JSON.parse(await command(['image','inspect',image,'--format','{{json .Id}}'])),image);
 for(const stage of ['cpp','web','browser']){
  const name=`kidea-r08-product-build-r1-${stage}`;names.push(name);active=name;
  const args=['run','--name',name,'--pull=never','--label',`kidea.r08.product=${mh}`,'--platform=linux/amd64','--network=none','--cpus=2','--memory=4g','--memory-swap=4g','--pids-limit=512','--read-only','--cap-drop=ALL','--security-opt=no-new-privileges','--user=1000:1000','--tmpfs=/tmp:rw,nosuid,size=256m','--shm-size=256m','--log-opt=max-size=8m','--log-opt=max-file=2'];
  for(const [host,target,readonly] of [[source,'/src',true],[dir,'/plan',true],[base,'/inputs',true],[path.join(output,'build'),'/build',false],[path.join(output,'work'),'/work',false],[path.join(output,'logs'),'/out',false]])args.push('--mount',`type=bind,src=${host},dst=${target}${readonly?',readonly':''}`);
  args.push('--entrypoint=/usr/bin/timeout',stage==='browser'?manifest.browser:manifest.toolchain,'--signal=TERM','--kill-after=10','1700','sh','/plan/build.sh',stage);
  await command(args);active=null;
 }
 verify(source,inputs.files);verify(dir,manifest.scripts,{packageManifest:true});pass=true;
} catch(e){fs.writeFileSync(path.join(output,'failure.json'),JSON.stringify({error:e.stack}));process.exitCode=1;}
finally {let stopped=true;if(active)try{await owned(active);await command(['stop','--time=10',active],true);}catch(e){stopped=false;fs.writeFileSync(path.join(output,'stop-failure.json'),JSON.stringify({error:e.stack}));process.exitCode=1;}
 fs.writeFileSync(path.join(output,'summary.json'),JSON.stringify({pass:pass&&stopped,manifest:mh,exception:'R08-TIDY-01',names,stopped,durationMs:Date.now()-start,scope:'build checks only; not complete G2, deploy, HTTPS integration, mutation, operations or product acceptance'},null,2)+'\n');if(stopped)fs.unlinkSync(lock);console.log(output);}
