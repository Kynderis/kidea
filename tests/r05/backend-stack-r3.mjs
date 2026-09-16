import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const sample=path.resolve(import.meta.dirname,'../../../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const run=args=>{const r=spawnSync(docker,args,{encoding:'utf8',timeout:60000});if(r.status!==0)throw Error(r.stderr||r.error||'docker failed');console.log(JSON.stringify({args,output:r.stdout.trim()}));return r.stdout.trim();};
const action=process.argv[2];
const names=['kidea-r05-e2-r3-caddy','kidea-r05-e2-r3-web','kidea-r05-e2-r3-backend'];
if(action==='stop'){for(const name of names)run(['stop','--time','35',name]);process.exit(0);}
if(action!=='start')throw Error('start or stop required');
const runtime=path.join(sample,'runtime-r3');
fs.mkdirSync(path.join(runtime,'secrets'),{recursive:true,mode:0o700});
fs.mkdirSync(path.join(runtime,'public'),{recursive:true});
const sessions=['A','B','viewer','expired'].map((actor,i)=>({actor,token:crypto.randomBytes(24).toString('hex'),csrf:crypto.randomBytes(24).toString('hex'),role:i<2?'admin':'viewer',ttl:i===3?-1:7200}));
fs.writeFileSync(path.join(runtime,'secrets/sessions.json'),JSON.stringify({sessions}),{flag:'wx',mode:0o600});
// Docker Desktop bind mounts map host ownership to the container user; verify on start.
run(['cp','kidea-r05-e2-r3-config2:/data/caddy/pki/authorities/local/root.crt',path.join(runtime,'public/root.crt')]);
run(['network','create','--internal','--label','kidea.run=E2-BW-r3','kidea-r05-e2-r3-net']);
const common=['run','-d','--label','kidea.run=E2-BW-r3','--cpus','0.5','--memory','1g','--memory-swap','1g','--pids-limit','128','--read-only','--tmpfs','/tmp:rw,nosuid,size=64m','--cap-drop','ALL','--security-opt','no-new-privileges','--network','kidea-r05-e2-r3-net'];
run([...common,'--name',names[2],'--network-alias','backend','--mount','type=volume,src=kidea-r05-e2-r1-build,dst=/build,readonly','--mount','type=volume,src=kidea-r05-e2-r3-db,dst=/data','--mount',`type=bind,src=${runtime}/secrets,dst=/secrets,readonly`,'kidea-r05-e2:toolchain','/build/dev/backend']);
run([...common,'--name',names[1],'--network-alias','web','--mount','type=volume,src=kidea-r05-e2-r3-web,dst=/work,readonly','-e','KIDEA_INTEGRATION=1','-e','HOST=0.0.0.0','-e','PORT=4173','-e','ORIGIN=https://localhost:8443','-e','BODY_SIZE_LIMIT=131072','-e','SHUTDOWN_TIMEOUT=30','kidea-r05-e2:toolchain','node','build/index.js']);
run([...common,'--name',names[0],'--network-alias','caddy','-p','127.0.0.1:8443:8443','--mount','type=volume,src=kidea-r05-e2-r2-go,dst=/work,readonly','--mount','type=volume,src=kidea-r05-e2-r3-ca,dst=/data','--mount',`type=bind,src=${sample}/Caddyfile,dst=/config/Caddyfile,readonly`,'-e','XDG_DATA_HOME=/data','-e','XDG_CONFIG_HOME=/tmp/config','kidea-r05-e2:toolchain','/work/caddy','run','--config','/config/Caddyfile','--adapter','caddyfile']);
