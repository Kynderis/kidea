import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import zlib from 'node:zlib';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..');
const dir=path.join(root,'tests/evidence/r05/backend-execution-r4');
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const command=args=>{const r=spawnSync(docker,args,{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);return args[0]==='logs'?r.stdout+r.stderr:r.stdout;};
const read=rel=>JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05',rel)));
const r1=read('backend-execution-r1/manifest.json'),r2=read('backend-execution-r2/manifest.json'),r3=read('backend-execution-r3/manifest.json');
const baseline={...r1.source,...r2.sources,...r3.sources};
const extra=['scripts/browser-https.mjs','scripts/browser-bootstrap-r4.sh','scripts/layers-r4.mjs','scripts/expired-tls.mjs','scripts/mutations-r4.mjs','scripts/drain-request.mjs','scripts/writer-drain-r4.mjs','scripts/inventory-r4.mjs','caddy-r2/source/modules/caddyhttp/server.go','caddy-r2/source/modules/caddyhttp/kidea_header_budget.go','caddy-r2/source/modules/caddyhttp/kidea_header_budget_test.go','caddy-r2/source/go.mod','caddy-r2/source/go.sum'];
const sources={},changed=[];
for(const f of new Set([...Object.keys(baseline),...extra])){
 const data=fs.readFileSync(path.join(sample,f)),sha256=hash(data);
 sources[f]={bytes:data.length,sha256,previousSha256:baseline[f]?.sha256??null};
 if(!baseline[f]||sha256!==baseline[f].sha256){
  const dest=path.join(dir,'sample',f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);changed.push(f);
 }
}
const web=read('web-execution-r2/manifest.json');
for(const [f,h]of Object.entries(web.sampleSource))if(hash(fs.readFileSync(path.resolve(sample,'../web',f)))!==h)throw Error('Original Web changed: '+f);
const pilot=read('profile-r1/manifest.json');
for(const [f,item]of Object.entries(pilot.snapshots))if(hash(fs.readFileSync(path.resolve(sample,'../../..',f)))!==item.sha256)throw Error('Pilot changed: '+f);
const portClosed=await new Promise(resolve=>{const s=net.connect({host:'127.0.0.1',port:8443});s.setTimeout(1000);s.on('connect',()=>{s.destroy();resolve(false)});s.on('error',()=>resolve(true));s.on('timeout',()=>{s.destroy();resolve(false)});});
if(!portClosed)throw Error('8443 remains open');
for(const run of ['r3','r4'])if(command(['ps','--filter','label=kidea.run=E2-BW-'+run,'--format','{{.Names}}']).trim())throw Error('Owned containers active');
const names=command(['ps','-a','--filter','label=kidea.run=E2-BW-r4','--format','{{.Names}}']).trim().split('\n');
names.push('kidea-r05-e2-r3-caddy','kidea-r05-e2-r3-web','kidea-r05-e2-r3-backend');
const containers=names.map(name=>{const c=JSON.parse(command(['inspect',name]))[0];return {name,state:c.State,image:c.Image,resources:{nanoCpus:c.HostConfig.NanoCpus,memory:c.HostConfig.Memory,memorySwap:c.HostConfig.MemorySwap},ports:c.HostConfig.PortBindings,user:c.Config.User,network:c.HostConfig.NetworkMode,readOnly:c.HostConfig.ReadonlyRootfs,securityOpt:c.HostConfig.SecurityOpt};});
for(const name of names.filter(n=>n.startsWith('kidea-r05-e2-r3-'))){const c=containers.find(c=>c.name===name);fs.writeFileSync(path.join(dir,name+'-final.log'),command(['logs','--since',c.state.StartedAt,name]));}
const stages=fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(dir,e.name,'result.json'))).map(e=>({directory:e.name,...JSON.parse(fs.readFileSync(path.join(dir,e.name,'result.json')))})).sort((a,b)=>a.at.localeCompare(b.at));
const stat=fs.statfsSync(root),freeBytes=stat.bavail*stat.bsize;
const baselineFree=read('backend-execution-r1/start.json').freeBytes;
if(freeBytes<100*1024**3||baselineFree-freeBytes>24*1024**3)throw Error('Disk bound exceeded');
const credentials=JSON.parse(fs.readFileSync(path.join(sample,'runtime-r3/secrets/sessions.json'))).sessions.flatMap(s=>[s.token,s.csrf]);
function inspect(where){for(const e of fs.readdirSync(where,{withFileTypes:true})){const f=path.join(where,e.name);if(e.isDirectory())inspect(f);else{const raw=fs.readFileSync(f),data=f.endsWith('.gz')?zlib.gunzipSync(raw):raw;if(credentials.some(value=>data.includes(value)))throw Error('Fixture credential in evidence: '+f);if(data.includes('-----BEGIN PRIVATE KEY-----'))throw Error('Private key in evidence: '+f);}}}
inspect(dir);
const state={at:new Date().toISOString(),status:'HALTED_RESOURCE_BREACH_STATIC_EXCEPTION_PENDING',authority:'approval.md',sourceHead:spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim(),sources,changed,pilotUnchanged:Object.keys(pilot.snapshots).length,webR2Unchanged:Object.keys(web.sampleSource).length,vendorSqliteSha256:hash(fs.readFileSync(path.join(sample,'vendor/sqlite/sqlite3.c'))),stages,containers,port8443Closed:portClosed,credentialScan:'PASS including decompressed logs for all current synthetic tokens/CSRF and PEM private-key marker',freeBytes,freeSpaceDeltaSinceE2Start:baselineFree-freeBytes,diskMeasurementNote:'Whole-filesystem free-space delta is conservative and includes unrelated host activity and Docker allocation overhead; not exact workload attribution.',dockerDisk:command(['system','df'])};
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(state,null,2)+'\n');
console.log(JSON.stringify({stages:stages.length,changed:changed.length,pilot:state.pilotUnchanged,web:state.webR2Unchanged,portClosed,deltaGiB:state.freeSpaceDeltaSinceE2Start/1024**3}));
