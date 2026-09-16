// Capture immutable before/after evidence for the approved LP-01 document-only amendment.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {checkDocuments, readDocuments} from '../r03/link-check.mjs';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const pilot=path.resolve(repo,'../kidea-workshop-pilot');
const evidence=path.join(repo,'tests/evidence/local-portability');
const targets=['docs/design/architecture.md','docs/design/operations.md','docs/design/quality.md'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const capture=b=>({bytes:b.length,sha256:hash(b),base64:b.toString('base64')});
const sourcePaths=['tests/evidence/r04/design-r1/architecture-post.json','tests/evidence/r04/design-r1/correction-proposal-final.json'];
const sources=Object.fromEntries(sourcePaths.map(rel=>{const b=fs.readFileSync(path.join(repo,rel));return [rel,{sha256:hash(b),data:JSON.parse(b.toString('utf8'))}];}));
const post=sources[sourcePaths[0]].data,correction=sources[sourcePaths[1]].data;
const baseline=Object.fromEntries(Object.entries(post.files).map(([rel,file])=>{
  const target=correction.targets[rel];
  if(target)assert.equal(target.beforeSha256,file.sha256,rel);
  const selected=target??file;
  assert.equal(hash(Buffer.from(selected.base64,'base64')),selected.sha256,rel);
  return [rel,selected];
}));
const actualNames=Object.keys(readDocuments(path.join(pilot,'docs'))).map(n=>'docs/'+n).sort();
assert.deepEqual(actualNames,Object.keys(baseline).sort());
function writeNew(name,value){fs.mkdirSync(evidence,{recursive:true});fs.writeFileSync(path.join(evidence,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});}
const phase=process.argv[2],revision=process.argv[3]??'r1',outputLabel=process.argv[4]??null;
assert.ok(['r1','r2'].includes(revision),'Use an explicit supported evidence revision: r1 or r2');
assert.ok(outputLabel===null||(outputLabel==='final'&&phase==='verify'&&revision==='r2'),'Only verify r2 accepts the final output label');
const suffix=revision==='r1'?'':'-'+revision;
const amendmentName='pilot-amendment'+suffix+'.json',verificationName='pilot-verification'+(outputLabel?'-'+outputLabel:suffix)+'.json';
if(phase==='pre'){
  assert.equal(revision,'r1','Later revisions retain the original preimage; do not overwrite or recapture it');
  const files=Object.fromEntries(Object.keys(baseline).sort().map(rel=>{
    const current=fs.readFileSync(path.join(pilot,rel));assert.equal(hash(current),baseline[rel].sha256,rel+' differs from accepted R04 baseline');return [rel,capture(current)];
  }));
  const value={kind:'LP-01_PILOT_PRE',observedAt:new Date().toISOString(),pilot,approval:'Human approved local-only portable Kidea and Docker-local/cloud direction after answer f8b47b9; implement carefully and completely.',targets,sources:Object.fromEntries(Object.entries(sources).map(([p,v])=>[p,v.sha256])),files};
  writeNew('pilot-amendment-pre.json',value);console.log(JSON.stringify({phase,files:actualNames.length,targets,sha256:hash(fs.readFileSync(path.join(evidence,'pilot-amendment-pre.json')))}));
}else if(phase==='post'){
  const beforeBytes=fs.readFileSync(path.join(evidence,'pilot-amendment-pre.json')),pre=JSON.parse(beforeBytes.toString('utf8'));
  const files={},allAfterHashes={};
  for(const rel of Object.keys(baseline).sort()){
    const before=Buffer.from(pre.files[rel].base64,'base64'),after=fs.readFileSync(path.join(pilot,rel));
    assert.equal(hash(before),pre.files[rel].sha256,rel);assert.equal(hash(before),baseline[rel].sha256,rel);
    allAfterHashes[rel]=hash(after);
    if(!targets.includes(rel)){assert.deepEqual(after,before,rel+' outside amendment changed');continue;}
    const oldText=before.toString('utf8').replaceAll('\r\n','\n'),newText=after.toString('utf8').replaceAll('\r\n','\n');
    const exactPrefix=after.subarray(0,before.length).equals(before);
    assert.ok(newText.startsWith(oldText),rel+' approved logical prefix changed');
    const appended=newText.slice(oldText.length);assert.match(appended,/^\n<a id="local-portability"><\/a>\n/);
    files[rel]={before:capture(before),after:capture(after),preservation:exactPrefix?'EXACT_BYTE_PREFIX':'LOGICAL_PREFIX_CRLF_TO_LF_ONLY',append:capture(Buffer.from(appended,'utf8'))};
  }
  const linkcheck=checkDocuments(readDocuments(path.join(pilot,'docs')));assert.deepEqual(linkcheck.errors,[]);
  const value={kind:'LP-01_PILOT_AMENDMENT',observedAt:new Date().toISOString(),approval:pre.approval,scope:'Append environment amendment only; no business/threshold/app/config changes; no runtime tests or installs.',preEvidence:{path:'tests/evidence/local-portability/pilot-amendment-pre.json',sha256:hash(beforeBytes)},sources:pre.sources,targets,files,allAfterHashes,linkcheck,runtime:{macIntel:'NOT_RUN',macAppleSilicon:'NOT_RUN',dockerBuild:'NOT_RUN',cloudPerformance:'NOT_RUN',productCases:'NOT_RUN'}};
  writeNew(amendmentName,{...value,revision});console.log(JSON.stringify({phase,revision,files:targets.length,preservation:Object.fromEntries(Object.entries(files).map(([p,v])=>[p,v.preservation])),allAfterHashes,linkcheck,sha256:hash(fs.readFileSync(path.join(evidence,amendmentName)))}));
}else if(phase==='verify'){
  const inputs=['tests/local-portability/pilot-amendment.mjs','tests/r04/design-docs.test.mjs','tests/r04/evidence.mjs','tests/r03/link-check.mjs','tests/r03/link-check.test.mjs','tests/evidence/local-portability/'+amendmentName,...sourcePaths];
  const before=Object.fromEntries(inputs.map(rel=>[rel,hash(fs.readFileSync(path.join(repo,rel)))]));
  const pilotBefore=Object.fromEntries(actualNames.map(rel=>[rel,hash(fs.readFileSync(path.join(pilot,rel)))]));
  const runs={},r03Name=outputLabel==='final'?'r03':'legacyR03';
  for(const [name,file] of [['r04','tests/r04/design-docs.test.mjs'],[r03Name,'tests/r03/link-check.test.mjs']]){
    const args=['--test',file],result=spawnSync(process.execPath,args,{cwd:repo,timeout:120000,maxBuffer:4*1024*1024});
    runs[name]={command:[process.execPath,...args],status:result.status,signal:result.signal,error:result.error?.message??null,stdout:capture(result.stdout??Buffer.alloc(0)),stderr:capture(result.stderr??Buffer.alloc(0))};
  }
  const linkcheck=checkDocuments(readDocuments(path.join(pilot,'docs')));
  for(const rel of inputs)assert.equal(hash(fs.readFileSync(path.join(repo,rel))),before[rel],rel+' changed during verification');
  for(const rel of actualNames)assert.equal(hash(fs.readFileSync(path.join(pilot,rel))),pilotBefore[rel],rel+' changed during verification');
  const interpretation=outputLabel==='final'
    ?'Active R03 tests now resolve the sibling pilot relative to the test module, replacing the Windows-only D: path. Its obsolete total-count assertion is replaced by the exact 10 non-design business filenames, with missing/extra/same-count-replacement negative tests; R04 separately still checks all exact 15 files, baseline bytes and approved amendment bytes. This corrects test ownership and portability, not product requirements or runtime behavior. Historical R03 15 !== 10 failures remain immutable in prior evidence. These passes prove document checks only; Mac/Docker/cloud/product runtime NOT_RUN.'
    :'R04 tests and links verify document preservation only. Legacy R03 inventory expects 10 documents while accepted design inventory contains 15; raw failure retained, not waived or rewritten. Mac/Docker/cloud/product runtime NOT_RUN.';
  const historicalVerification=outputLabel==='final'?Object.fromEntries(['pilot-verification.json','pilot-verification-r2.json'].map(file=>['tests/evidence/local-portability/'+file,hash(fs.readFileSync(path.join(evidence,file)))])):undefined;
  const value={kind:'LP-01_PILOT_VERIFICATION',observedAt:new Date().toISOString(),runtime:{node:process.version,platform:process.platform,arch:process.arch,execPath:process.execPath},inputs:before,pilotInputs:pilotBefore,runs,linkcheck,historicalVerification,interpretation};
  writeNew(verificationName,{...value,revision});
  console.log(JSON.stringify({phase,revision,outputLabel,r04:runs.r04.status,[r03Name]:runs[r03Name].status,linkcheck,sha256:hash(fs.readFileSync(path.join(evidence,verificationName)))}));
  assert.equal(runs.r04.status,0);if(outputLabel==='final')assert.equal(runs.r03.status,0);assert.deepEqual(linkcheck.errors,[]);
}else throw Error('Use pre, post or verify; existing evidence is never overwritten');
