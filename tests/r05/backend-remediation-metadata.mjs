import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const dir=path.join(root,'tests/evidence/r05/backend-execution-r1');
const response=await fetch('https://go.dev/dl/?mode=json&include=all',{signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error('Go metadata '+response.status);
const releases=await response.json();
const release=releases.find(x=>x.version==='go1.26.7');
if(!release)throw Error('Pinned patch candidate not present');
const artifact=release.files.find(x=>x.os==='linux'&&x.arch==='amd64'&&x.kind==='archive');
const records={at:new Date().toISOString(),status:'CANDIDATE_METADATA_ONLY_NOT_INSTALLED',go:{...artifact,url:'https://go.dev/dl/'+artifact.filename},modules:[]};
for(const [name,version] of [['golang.org/x/net','v0.56.0'],['golang.org/x/text','v0.39.0'],['golang.org/x/crypto','v0.56.0'],['google.golang.org/grpc','v1.83.2'],['github.com/google/cel-go','v0.30.0'],['github.com/go-chi/chi/v5','v5.3.0'],['github.com/klauspost/compress','v1.18.7'],['go.opentelemetry.io/otel','v1.44.0']]){
 const url='https://proxy.golang.org/'+name+'/@v/'+version+'.mod';
 const r=await fetch(url,{signal:AbortSignal.timeout(20000)});
 const body=await r.text();
 records.modules.push({name,version,url,status:r.status,goDirective:body.match(/^go (.+)$/m)?.[1],toolchain:body.match(/^toolchain (.+)$/m)?.[1],note:'Metadata only. Whole graph/go.sum and build compatibility not yet resolved.'});
}
fs.writeFileSync(path.join(dir,'remediation-metadata.json'),JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify(records,null,2));
