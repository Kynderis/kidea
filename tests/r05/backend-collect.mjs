import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import net from 'node:net';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..');
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const evidence=path.join(root,'tests/evidence/r05/backend-execution-r1');
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const source={};const receipts={};
function copyTree(from,to,records,prefix=''){
 fs.mkdirSync(to,{recursive:true});
 for(const entry of fs.readdirSync(from,{withFileTypes:true})){
  if(entry.isSymbolicLink())throw Error('Unexpected symlink in snapshot');
  if(['node_modules','.cache','.npm-cache','.svelte-kit','build','test-results','.secrets'].includes(entry.name))continue;
  const name=prefix+entry.name;
  if(entry.isDirectory()){copyTree(path.join(from,entry.name),path.join(to,entry.name),records,name+'/');continue;}
  const data=fs.readFileSync(path.join(from,entry.name));
  const compressed=data.length>512*1024;const output=entry.name+(compressed?'.gz':'');
  fs.writeFileSync(path.join(to,output),compressed?zlib.gzipSync(data):data);
  records[name]={bytes:data.length,sha256:sha(data),stored:name+(compressed?'.gz':''),gzip:compressed};
 }
}
const sources=path.join(evidence,'sample');fs.mkdirSync(sources,{recursive:true});
for(const entry of fs.readdirSync(sample,{withFileTypes:true})){
 if(['downloads','receipts','vendor'].includes(entry.name))continue;
 if(entry.isDirectory())copyTree(path.join(sample,entry.name),path.join(sources,entry.name),source,entry.name+'/');
 else{const data=fs.readFileSync(path.join(sample,entry.name));fs.writeFileSync(path.join(sources,entry.name),data);source[entry.name]={bytes:data.length,sha256:sha(data),stored:entry.name};}
}
for(const name of ['src/parser.h','src/blocks.c','src/cmark.h']){
 const data=fs.readFileSync(path.join(sample,'vendor/cmark',name));const dest=path.join(sources,'vendor-patches/cmark',name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);source['vendor/cmark/'+name]={bytes:data.length,sha256:sha(data),stored:'vendor-patches/cmark/'+name};
}
copyTree(path.join(sample,'receipts'),path.join(evidence,'receipts'),receipts);
const stages=fs.readdirSync(evidence,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(evidence,e.name,'result.json'))).map(e=>({directory:e.name,...JSON.parse(fs.readFileSync(path.join(evidence,e.name,'result.json')))})).sort((a,b)=>a.at.localeCompare(b.at));
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const run=args=>{const r=spawnSync(docker,args,{encoding:'utf8'});return {args,code:r.status,stdout:r.stdout,stderr:r.stderr};};
const portClosed=await new Promise(resolve=>{const socket=net.connect({host:'127.0.0.1',port:8443});socket.setTimeout(1000);socket.on('connect',()=>{socket.destroy();resolve(false);});socket.on('error',()=>resolve(true));socket.on('timeout',()=>{socket.destroy();resolve(false);});});
const originalWeb=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/web-execution-r2/manifest.json')));
for(const [file,expected]of Object.entries(originalWeb.sampleSource))if(sha(fs.readFileSync(path.resolve(sample,'../web',file)))!==expected)throw Error('Original Web changed');
const pilot=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/profile-r1/manifest.json')));
for(const [file,item]of Object.entries(pilot.snapshots))if(sha(fs.readFileSync(path.resolve(sample,'../../..',file)))!==item.sha256)throw Error('Pilot document changed');
const result={at:new Date().toISOString(),status:'BLOCKED_DEPENDENCY_REVIEW',approval:'E2-BW-r1 approved after 74a2772',source,receipts,stages,cpp:{preset:'dev',tests:8,passed:8,failed:0,skipped:0,junit:'cpp-dev-results.xml',qualification:'Initial unit slice only; sanitizer/mutation/full matrix NOT_RUN'},blocker:{component:'Caddy pinned image',observedGo:'1.26.3',issue:'GO-2026-6090 / CVE-2026-56862',reason:'Planned TLS server traverses affected crypto/tls; fixed in Go1.26.6; image uses1.26.3. Do not open HTTPS until reviewed replacement.'},notRun:['asan-ubsan','tsan','release','clang-tidy','mutation tests','Web Docker regression','Caddy HTTPS/CSRF/browser/socket integration'],originalWebFilesUnchanged:Object.keys(originalWeb.sampleSource).length,pilotDocsUnchanged:Object.keys(pilot.snapshots).length,port8443Closed:portClosed,docker:[run(['ps','--filter','label=kidea.run=E2-BW-r1','--format','{{.Names}} {{.Status}}']),run(['inspect','buildx_buildkit_kidea-r05-e2-r10','--format','{{.State.Status}} CPU={{.HostConfig.CpuQuota}}/{{.HostConfig.CpuPeriod}} Memory={{.HostConfig.Memory}}']),run(['system','df','--format','{{.Type}} {{.Size}}'])]};
if(!portClosed)throw Error('Unexpected listener at 8443');
fs.writeFileSync(path.join(evidence,'manifest.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({sources:Object.keys(source).length,receipts:Object.keys(receipts).length,stages:stages.length,portClosed,pilotDocs:result.pilotDocsUnchanged,originalWeb:result.originalWebFilesUnchanged}));
