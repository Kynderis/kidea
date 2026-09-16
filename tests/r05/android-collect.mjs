import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..'),evidence=path.join(root,'tests/evidence/r05/android-execution-r1');
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/android-r1');
const docker='/Applications/Docker.app/Contents/Resources/bin/docker';
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(path.join(evidence,file)));
function command(args){const r=spawnSync(docker,args,{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);return r.stdout;}
const names=command(['ps','-a','--filter','label=kidea.run=A1-ANDROID-r1','--format','{{.Names}}']).trim().split('\n').filter(Boolean);
const containers=names.map(name=>{const c=JSON.parse(command(['inspect',name]))[0];return {name,state:c.State,image:c.Image,cpu:c.HostConfig.NanoCpus/1e9,memory:c.HostConfig.Memory,ports:c.HostConfig.PortBindings,network:c.HostConfig.NetworkMode,user:c.Config.User,readOnly:c.HostConfig.ReadonlyRootfs,capDrop:c.HostConfig.CapDrop,securityOpt:c.HostConfig.SecurityOpt};});
if(containers.some(c=>c.state.Running||c.cpu>2||c.memory>4*1024**3||Object.keys(c.ports??{}).length||!/^1000(?::1000)?$/.test(c.user)||!c.readOnly||!c.capDrop?.includes('ALL')||!c.securityOpt?.includes('no-new-privileges')))throw Error('Container stop/quota/ports');
for(const label of ['E2-BW-r1','E2-BW-r2','E2-BW-r3','E2-BW-r4','E2-BW-r5'])if(command(['ps','--filter','label=kidea.run='+label,'--format','{{.Names}}']).trim())throw Error('Backend workload active');
const stages=fs.readdirSync(evidence,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(evidence,e.name,'result.json'))).map(e=>({directory:e.name,...read(e.name+'/result.json')})).sort((a,b)=>a.at.localeCompare(b.at));
for(const stage of ['positive-sdk37','identity-collision-green','ui-unit','mutations-complete','collect-fixed'])if(!stages.some(s=>s.stage===stage&&s.code===0&&!s.stopped))throw Error('Missing final stage '+stage);
const denied=stages.find(s=>s.stage==='guard-reject-e2-client');
if(!denied||denied.launched!==false||denied.code!==1||!denied.error?.includes('exceed'))throw Error('Missing aggregate guard rejection');
if(command(['ps','-a','--filter','name=kidea-r05-e2-r5-a1-must-not-exist','--format','{{.Names}}']).trim())throw Error('Rejected container exists');
const final=stages.find(s=>s.stage==='positive-final-complete');
if(!final||final.code!==0||final.stopped)throw Error('Full final run did not pass');
for(const variant of ['Debug','Release']){
 const lower=variant.toLowerCase();
 const xml=fs.readFileSync(path.join(evidence,'final-artifacts/app/build/test-results/test'+variant+'UnitTest/TEST-org.kidea.lab.LabControllerTest.xml'),'utf8');
 const suite=/<testsuite\b([^>]*)>/.exec(xml)?.[1]??'';
 if(!suite.includes('tests="11"')||!suite.includes('failures="0"')||!suite.includes('errors="0"')||!suite.includes('skipped="0"'))throw Error('Unit results '+variant);
 const lint=fs.readFileSync(path.join(evidence,'final-artifacts/app/build/reports/lint-results-'+lower+'.xml'),'utf8');
 const ids=[...lint.matchAll(/<issue\s+id="([^"]+)"/g)].map(m=>m[1]);
 if(ids.length!==0)throw Error('Unexpected lint issues '+ids);
}
const before=read('complete-source-before.json'),after=read('final-artifacts/source-verification.json').hashes;
if(JSON.stringify(Object.entries(before).sort())!==JSON.stringify(Object.entries(after).sort()))throw Error('Final source drift');
const artifacts=read('final-artifacts/files.json');if(Object.keys(artifacts).filter(f=>f.endsWith('.apk')).length!==2)throw Error('Both APKs required');
const mutants=read('mutations-complete/results.json');if(mutants.length!==6||!mutants.every(m=>m.detected))throw Error('Mutants');
const sources={};function copy(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())copy(f);else{const rel=path.relative(sample,f),data=fs.readFileSync(f);sources[rel]={bytes:data.length,sha256:hash(data)};const dest=path.join(evidence,'sample',rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,data);}}}copy(sample);
const budgets=stages.filter(s=>fs.existsSync(path.join(evidence,s.directory,'budget.json'))).map(s=>read(s.directory+'/budget.json'));if(budgets.some(b=>b.cpu>2||b.memory>4*1024**3))throw Error('Aggregate quota');
const stats=fs.statfsSync(root),freeBytes=stats.bavail*stats.bsize,start=read('start.json'),e2=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/backend-execution-r1/start.json')));
if(freeBytes<100*1024**3||start.freeBytes-freeBytes>15*1024**3||e2.freeBytes-freeBytes>35*1024**3||Date.now()-Date.parse(start.at)>10800_000)throw Error('Run/disk quota');
const network=read('network-count.json');
// Add advisory response metadata fetched read-only by host audit. Protocol headroom remains conservative.
let auditBytes=0;for(const f of fs.readdirSync(evidence).filter(f=>f.startsWith('sdk-review-')&&f.endsWith('.xml')))auditBytes+=fs.statSync(path.join(evidence,f)).size;for(const f of fs.readdirSync(evidence).filter(f=>f.startsWith('osv-')&&f.endsWith('.json')))auditBytes+=fs.statSync(path.join(evidence,f)).size;
for(const f of fs.readdirSync(path.join(evidence,'advisories')))auditBytes+=fs.statSync(path.join(evidence,'advisories',f)).size;
if(network.payloadBytes+auditBytes+network.protocolHeadroomBytes>4*1024**3)throw Error('Download quota');
const manifest={at:new Date().toISOString(),sourceHead:spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).stdout.trim(),sources,stages,containers,mutants,freeBytes,additionalDiskBytes:start.freeBytes-freeBytes,cumulativeDiskBytes:e2.freeBytes-freeBytes,elapsedSeconds:(Date.now()-Date.parse(start.at))/1000,network:{...network,hostAdvisoryMetadataBytes:auditBytes,accountedWithHeadroomBytes:network.payloadBytes+auditBytes+network.protocolHeadroomBytes},diskNote:'Whole-filesystem delta includes unrelated activity and allocation overhead; not exact attribution',maxReservedCpu:Math.max(...budgets.map(b=>b.cpu)),maxReservedMemory:Math.max(...budgets.map(b=>b.memory)),status:'SCOPED_ANDROID_A1_PASS_REVIEW_PENDING',unitTests:{debug:11,release:11,failed:0,skipped:0},lint:{debug:'PASS',release:'PASS'},artifacts};
fs.writeFileSync(path.join(evidence,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({sources:Object.keys(sources).length,stages:stages.length,containers:containers.length,elapsedSeconds:manifest.elapsedSeconds,additionalGiB:manifest.additionalDiskBytes/1024**3,cumulativeGiB:manifest.cumulativeDiskBytes/1024**3}));
