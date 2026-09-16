import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import net from 'node:net';
const root=path.resolve(import.meta.dirname,'../..');
const dir=path.join(root,'tests/evidence/r05/backend-execution-r2');
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const files=['CMakeLists.txt','CMakePresets.json','cpp/tests.cpp','cpp/worker.hpp','caddy-r2/resolve.sh','caddy-r2/licenses.mjs'];
const sources={};
for(const file of files){const data=fs.readFileSync(path.join(sample,file));const out=path.join(dir,'sample',file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,data);sources[file]={sha256:sha(data),bytes:data.length};}
const original=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/backend-execution-r1/manifest.json')));
const preserved=[];
for(const [file,item]of Object.entries(original.source)){if(files.includes(file))continue;if(sha(fs.readFileSync(path.join(sample,file)))!==item.sha256)throw Error('Unexpected sample change '+file);preserved.push(file);}
const web=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/web-execution-r2/manifest.json')));
for(const [f,h]of Object.entries(web.sampleSource))if(sha(fs.readFileSync(path.resolve(sample,'../web',f)))!==h)throw Error('Web r2 changed');
const pilot=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/profile-r1/manifest.json')));
for(const [f,item]of Object.entries(pilot.snapshots))if(sha(fs.readFileSync(path.resolve(sample,'../../..',f)))!==item.sha256)throw Error('Pilot changed');
const stages=fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(dir,e.name,'result.json'))).map(e=>({directory:e.name,...JSON.parse(fs.readFileSync(path.join(dir,e.name,'result.json')))})).sort((a,b)=>a.at.localeCompare(b.at));
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const run=args=>{const r=spawnSync(docker,args,{encoding:'utf8'});return {args,code:r.status,stdout:r.stdout,stderr:r.stderr};};
const portClosed=await new Promise(resolve=>{const s=net.connect({host:'127.0.0.1',port:8443});s.setTimeout(1000);s.on('connect',()=>{s.destroy();resolve(false)});s.on('error',()=>resolve(true));s.on('timeout',()=>{s.destroy();resolve(false)});});
const state={at:new Date().toISOString(),approval:'Human approved Caddy dependency replacement r1 after 57319d7; see approval.md',status:'CADDY_BUILD_FAILED_COMPATIBILITY',sources,preservedSampleFiles:preserved,originalWebUnchanged:Object.keys(web.sampleSource).length,pilotUnchanged:Object.keys(pilot.snapshots).length,stages,port8443Closed:portClosed,freeBytes:fs.statfsSync(root).bavail*fs.statfsSync(root).bsize,docker:[run(['ps','--filter','label=kidea.run=E2-BW-r2','--format','{{.Names}} {{.Status}}']),run(['system','df'])]};
if(!portClosed)throw Error('8443 unexpectedly open');
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(state,null,2)+'\n');
console.log(JSON.stringify({stages:stages.length,sourceFiles:files.length,preserved:preserved.length,portClosed}));
