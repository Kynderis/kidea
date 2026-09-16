import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..');
const dir=path.join(root,'tests/evidence/r05/backend-execution-r3');
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const command=args=>{const r=spawnSync(docker,args,{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);return args[0]==='logs'?r.stdout+r.stderr:r.stdout;};
const files=['Caddyfile','cpp/server.cpp','cpp/tsan_probe.cpp','scripts/https-check.mjs','scripts/header-boundary.mjs','web/src/routes/secure/+page.server.ts','caddy-r2/source/modules/caddyhttp/celmatcher.go','caddy-r2/source/modules/caddyhttp/kidea_cel_compat_test.go'];
const sources={};
for(const f of files){const data=fs.readFileSync(path.join(sample,f));const dest=path.join(dir,'sample',f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);sources[f]={bytes:data.length,sha256:hash(data)};}
const archive=path.join(root,'.test-output/r05/backend-plan-r1/caddy-source.tar.gz');
const before=spawnSync('/usr/bin/tar',['-xOzf',archive,'caddy-e2eee6a7fce366321294c9c2a79f3146891dcbdf/modules/caddyhttp/celmatcher.go']);
if(before.status!==0)throw Error(before.stderr.toString());
const beforeFile=path.join(dir,'celmatcher-before.go');fs.writeFileSync(beforeFile,before.stdout);
const afterFile=path.join(dir,'sample/caddy-r2/source/modules/caddyhttp/celmatcher.go');
const diff=spawnSync('/usr/bin/diff',['-u','-L','a/modules/caddyhttp/celmatcher.go','-L','b/modules/caddyhttp/celmatcher.go',beforeFile,afterFile],{encoding:'utf8'});
if(diff.status!==1)throw Error('Expected source patch');fs.writeFileSync(path.join(dir,'caddy-cel.patch'),diff.stdout);
const previous=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/backend-execution-r1/manifest.json')));
const r2=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/backend-execution-r2/manifest.json')));
const preserved=[];
for(const [f,item]of Object.entries(previous.source)){if(files.includes(f))continue;const expected=r2.sources[f]?.sha256||item.sha256;if(hash(fs.readFileSync(path.join(sample,f)))!==expected)throw Error('Unexpected sample edit '+f);preserved.push(f);}
const web=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/web-execution-r2/manifest.json')));
for(const [f,h]of Object.entries(web.sampleSource))if(hash(fs.readFileSync(path.resolve(sample,'../web',f)))!==h)throw Error('Original Web changed');
const pilot=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/profile-r1/manifest.json')));
for(const [f,item]of Object.entries(pilot.snapshots))if(hash(fs.readFileSync(path.resolve(sample,'../../..',f)))!==item.sha256)throw Error('Pilot changed');
const portClosed=await new Promise(resolve=>{const s=net.connect({host:'127.0.0.1',port:8443});s.setTimeout(1000);s.on('connect',()=>{s.destroy();resolve(false)});s.on('error',()=>resolve(true));s.on('timeout',()=>{s.destroy();resolve(false)});});
if(!portClosed)throw Error('8443 remains open');
const active=command(['ps','--filter','label=kidea.run=E2-BW-r3','--format','{{.Names}}']);if(active.trim())throw Error('Owned containers still active');
const containers=[];
for(const name of ['kidea-r05-e2-r3-caddy','kidea-r05-e2-r3-web','kidea-r05-e2-r3-backend','kidea-r05-e2-r3-tsan']){
 const item=JSON.parse(command(['inspect',name]))[0];
 containers.push({name,state:item.State,resources:{nanoCpus:item.HostConfig.NanoCpus,memory:item.HostConfig.Memory,memorySwap:item.HostConfig.MemorySwap},ports:item.HostConfig.PortBindings,user:item.Config.User,readOnly:item.HostConfig.ReadonlyRootfs,securityOpt:item.HostConfig.SecurityOpt});
 if(!name.endsWith('tsan'))fs.writeFileSync(path.join(dir,name+'-final.log'),command(['logs','--since',item.State.StartedAt,name]));
}
const stages=fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(dir,e.name,'result.json'))).map(e=>({directory:e.name,...JSON.parse(fs.readFileSync(path.join(dir,e.name,'result.json')))})).sort((a,b)=>a.at.localeCompare(b.at));
const stat=fs.statfsSync(root),freeBytes=stat.bavail*stat.bsize;
const baseline=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/backend-execution-r1/start.json')));
const events=fs.readFileSync(path.join(dir,'caddy-tests.jsonl'),'utf8').trim().split('\n').map(JSON.parse);
const passNames=events.filter(e=>e.Action==='pass'&&e.Test).map(e=>e.Test);
const state={at:new Date().toISOString(),status:'PARTIAL_HEADER_BOUNDARY_FAIL_BUDGET_HOLD',approval:'Human approved Caddy/CEL two-position patch after 308c0e8',sources,preservedSampleFiles:preserved,pilotUnchanged:Object.keys(pilot.snapshots).length,webR2Unchanged:Object.keys(web.sampleSource).length,caddyPatch:{beforeSha256:hash(before.stdout),afterSha256:hash(fs.readFileSync(afterFile))},tests:{caddyPassedEvents:passNames.length,caddyPassedLeaves:passNames.filter(n=>!passNames.some(other=>other.startsWith(n+'/'))).length,caddyFailedEvents:events.filter(e=>e.Action==='fail').length,httpsSubset:33,headerBoundary:{passed:2,failed:1},cppDev:9,webUnit:32,tsan:'capability probe PASS; full build deliberately interrupted before resource ceiling, no full preset PASS'},stages,containers,port8443Closed:portClosed,activeOwnedContainers:active.trim(),freeBytes,freeSpaceDeltaSinceE2Start:baseline.freeBytes-freeBytes,diskMeasurementNote:'Conservative whole-filesystem free-space delta includes unrelated host activity and Docker allocation overhead; not exact workload attribution.',dockerDisk:command(['system','df'])};
// Ensure synthetic fixture credentials never enter the evidence tree.
const credentials=JSON.parse(fs.readFileSync(path.join(sample,'runtime-r3/secrets/sessions.json'))).sessions.flatMap(s=>[s.token,s.csrf]);
function inspect(where){for(const e of fs.readdirSync(where,{withFileTypes:true})){const f=path.join(where,e.name);if(e.isDirectory())inspect(f);else{const data=fs.readFileSync(f,'utf8');if(credentials.some(value=>data.includes(value)))throw Error('Fixture credential in evidence: '+f);}}}
inspect(dir);
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(state,null,2)+'\n');
console.log(JSON.stringify({stages:stages.length,sourceFiles:files.length,preserved:preserved.length,portClosed,tests:state.tests,deltaGiB:state.freeSpaceDeltaSinceE2Start/1024**3}));
