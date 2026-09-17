import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawn} from 'node:child_process';
import {hash,verify} from '../product-build-r1/verify.mjs';
const repo=path.resolve(import.meta.dirname,'../../..'),plan=import.meta.dirname,base=path.join(repo,'.test-output/r08-cloud-r1');
const m=JSON.parse(fs.readFileSync(plan+'/manifest.json'));assert.equal(process.argv[2],hash(plan+'/manifest.json'));verify(plan,m.files,{packageManifest:true});
for(const [name,sha] of Object.entries(m.bundles))assert.equal(hash(base+'/'+name),sha);
const evidenceRoot=path.join(repo,'tests/evidence/r08/cloud-execution-r1');fs.mkdirSync(evidenceRoot,{recursive:true});const evidence=path.join(evidenceRoot,hash(plan+'/manifest.json').slice(0,10));fs.mkdirSync(evidence);fs.mkdirSync(evidence+'/logs');fs.cpSync(plan,evidence+'/source',{recursive:true,errorOnExist:true,force:false});
const gc='/usr/local/bin/gcloud',project='kidea-508908',prefix='kidea-r08-c1',network=prefix+'-net',subnet=prefix+'-subnet';
const zoneW='us-central1-a',zoneO='us-central1-f',workload=prefix+'-workload',observer=prefix+'-observer',recovery=prefix+'-recovery';
const key=base+'/ssh-key',known=base+'/known-hosts';const deadline=Date.parse(m.deadline),termination=m.deadline;let sequence=0,pass=false,networkCreated=false,subnetCreated=false;const firewalls=[];
function save(kind,data){fs.writeFileSync(evidence+'/logs/'+String(++sequence).padStart(3,'0')+'-'+kind+'.json',JSON.stringify(data,null,2)+'\n',{flag:'wx'});}
async function run(command,args,{timeout=600000,allowFailure=false,cleanup=false}={}){
 if(!cleanup){assert.ok(Date.now()<deadline-60000,'CLOUD_DEADLINE');verify(plan,m.files,{packageManifest:true});}
 const result=await new Promise(resolve=>{const child=spawn(command,args,{stdio:['ignore','pipe','pipe']});let stdout='',stderr='',error=null;const timer=setTimeout(()=>{error='TIMEOUT';child.kill('SIGKILL');},timeout);child.stdout.on('data',d=>{stdout+=d;if(stdout.length+stderr.length>8*1024**2){error='OUTPUT_LIMIT';child.kill('SIGKILL');}});child.stderr.on('data',d=>{stderr+=d;if(stdout.length+stderr.length>8*1024**2){error='OUTPUT_LIMIT';child.kill('SIGKILL');}});child.on('error',e=>{error=e.message;});child.on('close',code=>{clearTimeout(timer);resolve({code,error,stdout,stderr});});});
 save('command',{command,args,...result});if(!allowFailure&&(result.code!==0||result.error))throw Error(command+' failed: '+result.stderr.slice(-2500));return result;
}
const g=(args,options)=>run(gc,[...args,'--project='+project,'--quiet'],options);
function sshArgs(name,zone){return ['-i',key,'-o','IdentitiesOnly=yes','-o','BatchMode=yes','-o','ConnectTimeout=20','-o','StrictHostKeyChecking=accept-new','-o','UserKnownHostsFile='+known,'-o','HostKeyAlias='+name,'-o',`ProxyCommand=${gc} compute start-iap-tunnel ${name} 22 --listen-on-stdin --project=${project} --zone=${zone} --verbosity=warning`];}
const ssh=(name,zone,command,options)=>run('ssh',[...sshArgs(name,zone),'kidealab@'+name,command],options);
const upload=(name,zone,file,dest=path.basename(file))=>run('scp',[...sshArgs(name,zone),file,'kidealab@'+name+':/home/kidealab/'+dest]);
const download=(name,zone,file,dest)=>run('scp',[...sshArgs(name,zone),'kidealab@'+name+':/home/kidealab/'+file,dest]);
async function create(name,zone,type,ip,role){
 const r=await g(['compute','instances','create',name,'--zone='+zone,'--machine-type='+type,'--image='+m.osImage,'--image-project=cos-cloud','--boot-disk-size=20GB','--boot-disk-type=pd-standard','--boot-disk-auto-delete','--subnet='+subnet,'--private-network-ip='+ip,'--no-address','--no-service-account','--no-scopes','--tags='+prefix+'-'+role,'--labels=kidea-run=r08-c1','--metadata=enable-oslogin=FALSE,block-project-ssh-keys=TRUE','--metadata-from-file=ssh-keys='+base+'/ssh-metadata','--termination-time='+termination,'--instance-termination-action=DELETE','--format=json']);
 const vm=JSON.parse(r.stdout)[0];assert.equal(vm.scheduling.instanceTerminationAction,'DELETE');assert.ok(!vm.networkInterfaces[0].accessConfigs?.length);assert.ok(vm.disks.every(d=>d.autoDelete));save('vm-created',{name,id:vm.id,zone:vm.zone,termination:vm.scheduling.terminationTime||vm.scheduling.terminationTimestamp,scheduling:vm.scheduling,disks:vm.disks.map(d=>({source:d.source,autoDelete:d.autoDelete}))});
 for(let i=0;i<20;i++){const r=await ssh(name,zone,'true',{timeout:30000,allowFailure:true});if(r.code===0)return;await new Promise(r=>setTimeout(r,3000));}throw Error('SSH_NOT_READY');
}
async function install(name,zone,restore=false){console.log('Installing frozen artifacts on '+name);await upload(name,zone,base+'/image.tar.gz');await upload(name,zone,base+'/payload.tar.gz');await upload(name,zone,plan+'/remote.sh');if(restore)await upload(name,zone,base+'/state-before/latest.db','restore.db');const expected=m.bundles;for(const file of ['image.tar.gz','payload.tar.gz']){const r=await ssh(name,zone,'sha256sum /home/kidealab/'+file);assert.equal(r.stdout.trim().split(/\s+/)[0],expected[file]);}await ssh(name,zone,'sh /home/kidealab/remote.sh load');}
async function events(){const r=await ssh(observer,zoneO,'sudo cat /var/lib/kidea-r08/state/events.jsonl');return r.stdout.trim().split('\n').filter(Boolean).map(s=>JSON.parse(s));}
const healthy=e=>e.filter(r=>r.state==='HEALTHY');
async function waitHealthy(count){for(let i=0;i<20;i++){await new Promise(r=>setTimeout(r,3000));const r=await events();if(healthy(r).length>=count)return r;}throw Error('NO_HEALTHY_JOB_BACKUP');}
async function identity(name){for(const [component,expected] of [['backend',m.backend],['caddy',m.caddy]]){const r=await ssh(name,zoneW,'sudo docker exec kidea-r08-'+component+' sha256sum /proc/1/exe');assert.equal(r.stdout.trim().split(/\s+/)[0],expected);}const r=await ssh(name,zoneW,'sudo docker exec kidea-r08-backend /payload/database inspect /data/sample.db');return JSON.parse(r.stdout);}
try{
 assert.deepEqual(JSON.parse((await g(['compute','instances','list','--filter=labels.kidea-run=r08-c1','--format=json'])).stdout),[],'EXISTING_LAB');
 if(!fs.existsSync(key)){await run('ssh-keygen',['-q','-t','ed25519','-N','','-C','kidea-r08-lab','-f',key]);fs.writeFileSync(base+'/ssh-metadata','kidealab:'+fs.readFileSync(key+'.pub','utf8'),{mode:0o600,flag:'wx'});}
 await g(['services','enable','iap.googleapis.com']);
 await g(['compute','networks','create',network,'--subnet-mode=custom','--description=Owned ephemeral Kidea R08 C1 lab']);networkCreated=true;
 await g(['compute','networks','subnets','create',subnet,'--network='+network,'--region=us-central1','--range=10.88.0.0/24']);subnetCreated=true;
 for(const [name,args] of [[prefix+'-iap',['--source-ranges=35.235.240.0/20','--target-tags='+prefix+'-workload,'+prefix+'-observer','--allow=tcp:22']],[prefix+'-observe',['--source-tags='+prefix+'-observer','--target-tags='+prefix+'-workload','--allow=tcp:8443,tcp:9444']]]){await g(['compute','firewall-rules','create',name,'--network='+network,...args]);firewalls.push(name);}
 console.log('Creating two private VMs in separate zones; deletion deadline '+termination);
 await create(workload,zoneW,'e2-standard-2','10.88.0.2','workload');await create(observer,zoneO,'e2-small','10.88.0.3','observer');
 await install(workload,zoneW);await ssh(workload,zoneW,'sh /home/kidealab/remote.sh workload');await identity(workload);
 await install(observer,zoneO);await ssh(observer,zoneO,'sh /home/kidealab/remote.sh observer');
 const first=await waitHealthy(3);save('before-disconnect',first);
 console.log('Launcher SSH exited; observing independent progression');await new Promise(r=>setTimeout(r,20000));const independent=await events();assert.ok(healthy(independent).length>healthy(first).length);assert.ok(healthy(independent).at(-1).counts.domain>healthy(first).at(-1).counts.domain);save('independent-progress',independent);
 console.log('Deleting original workload VM and its disk');await g(['compute','instances','delete',workload,'--zone='+zoneW]);assert.deepEqual(JSON.parse((await g(['compute','disks','list','--filter=name='+workload,'--format=json'])).stdout),[]);
 await new Promise(r=>setTimeout(r,15000));const alarm=await events();assert.ok(alarm.slice(independent.length).some(r=>r.state==='ALERT'));save('host-loss-alert',alarm);
 await ssh(observer,zoneO,'sh /home/kidealab/remote.sh snapshot');await download(observer,zoneO,'state.tar.gz',base+'/state-before.tar.gz');fs.mkdirSync(base+'/state-before');await run('tar',['-xzf',base+'/state-before.tar.gz','-C',base+'/state-before']);const backup=JSON.parse(fs.readFileSync(base+'/state-before/latest.json'));assert.equal(hash(base+'/state-before/latest.db'),backup.sha256);save('off-host-backup',backup);
 console.log('Restoring a new workload VM from observer backup');await create(recovery,zoneW,'e2-standard-2','10.88.0.2','workload');await install(recovery,zoneW,true);await ssh(recovery,zoneW,'sh /home/kidealab/remote.sh workload');const restored=await identity(recovery);assert.deepEqual(restored,backup.info);save('restored-database',restored);
 await ssh(observer,zoneO,'sh /home/kidealab/remote.sh resume');await new Promise(r=>setTimeout(r,15000));const recovered=await events();assert.equal(recovered.at(-1).state,'HEALTHY');assert.ok(recovered.at(-1).counts.domain>backup.info.domain);save('recovery',recovered);
 await ssh(observer,zoneO,'sh /home/kidealab/remote.sh snapshot');await download(observer,zoneO,'state.tar.gz',evidence+'/state-final.tar.gz');
 pass=true;
}catch(error){save('FAIL',{error:error.stack});process.exitCode=1;
 try{const list=JSON.parse((await g(['compute','instances','list','--filter=labels.kidea-run=r08-c1','--format=json'],{cleanup:true})).stdout);for(const vm of list){await ssh(vm.name,vm.zone.split('/').at(-1),'sudo docker ps -a; sudo docker logs --tail 30 kidea-r08-backend; sudo docker logs --tail 30 kidea-r08-caddy; sudo docker logs --tail 30 kidea-r08-backup; sudo docker logs --tail 30 kidea-r08-observer',{allowFailure:true,timeout:45000,cleanup:true});}}catch(e){save('diagnostic-error',{error:String(e)});}
}
finally{
 console.log('Cleaning owned cloud resources');let clean=true;
 try{const list=JSON.parse((await g(['compute','instances','list','--filter=labels.kidea-run=r08-c1','--format=json'],{cleanup:true})).stdout);for(const vm of list){assert.ok([workload,observer,recovery].includes(vm.name));await g(['compute','instances','delete',vm.name,'--zone='+vm.zone.split('/').at(-1)],{cleanup:true});}}catch(e){clean=false;save('cleanup-error',{error:String(e)});}
 for(const name of firewalls)try{await g(['compute','firewall-rules','delete',name],{cleanup:true});}catch(e){clean=false;save('cleanup-error',{error:String(e)});}
 if(subnetCreated)try{await g(['compute','networks','subnets','delete',subnet,'--region=us-central1'],{cleanup:true});}catch(e){clean=false;save('cleanup-error',{error:String(e)});}
 if(networkCreated)try{await g(['compute','networks','delete',network],{cleanup:true});}catch(e){clean=false;save('cleanup-error',{error:String(e)});}
 try{for(const resource of ['instances','disks','addresses','firewall-rules','networks']){const r=JSON.parse((await g(['compute',resource,'list','--filter=name~^'+prefix,'--format=json'],{cleanup:true})).stdout);assert.deepEqual(r,[]);save('cleanup-readback',{resource,remaining:r});}}catch(e){clean=false;save('cleanup-error',{error:String(e)});}
 fs.writeFileSync(evidence+'/summary.json',JSON.stringify({pass:pass&&clean,clean,manifest:hash(plan+'/manifest.json'),termination,durationMs:Date.now()-(deadline-7200000),scope:'finite actual-artifact independent-host job/backup/alert/restore lab; not production or performance certification'},null,2)+'\n');if(!clean)process.exitCode=1;
}
