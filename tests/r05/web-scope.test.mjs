import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {root,evidence,readDocs,validateScope,restoreCreateOnly,sha} from './web-scope.mjs';
import {validate as historicalValidate} from './validate.mjs';
import {buildBase} from '../fixtures/r02-t04/catalog.mjs';
const files=readDocs(path.join(evidence,'after'));
const manifest=JSON.parse(fs.readFileSync(path.join(evidence,'manifest.json')));
const clone=()=>structuredClone(manifest);
const change=(f,fn)=>({...files,[f]:Buffer.from(fn(files[f].toString()))});
const detects=(f,code,m=manifest)=>assert.ok(validateScope(f,m).errors.some(e=>e.code===code),code);
test('Web amendment keeps 21 documents, 40 rules, 137 cases, 20 groups and valid links',()=>{
  const r=validateScope(files);assert.deepEqual(r.errors,[]);assert.equal(r.activeRules,24);assert.equal(r.futureRules,16);console.log(JSON.stringify(r));
  assert.equal(Object.values(manifest.files).filter(f=>f.changed).length,13);
  assert.equal(Object.values(manifest.groups).filter(g=>g.deferredVariants.length).length,14);
});
test('before snapshot matches all 21 SDK37 handoff hashes',()=>{
  const old=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/android-execution-r1/pilot-amendment-sdk37.json'))).allAfterHashes;
  for(const [f,b]of Object.entries(readDocs(path.join(evidence,'before'))))assert.equal(sha(b),old[f],f);
});
test('original r1 validator still validates its original snapshot',()=>{
  const r=historicalValidate(readDocs(path.join(root,'tests/evidence/r05/profile-r1/pilot')));assert.deepEqual(r.errors,[]);
});
test('missing Future file or same-count substitution cannot erase history',()=>{
  const f={...files};delete f['docs/engineering/ios.md'];f['docs/engineering/other.md']=Buffer.from('Future');detects(f,'INVENTORY');
});
test('business mutation is rejected even when scope and counts are unchanged',()=>detects(change('docs/business/tests.md',s=>s.replace('C10,N0','C10,N1')),'SOURCE_HASH'));
test('missing source case and false application PASS are rejected',()=>{
  detects(change('docs/engineering/tests.md',s=>s.split('\n').filter(l=>!l.startsWith('| AR-T19 |')).join('\n')),'CASE_INVENTORY');
  detects(change('docs/engineering/tests.md',s=>s.replace(/(\| P01 \|[^\n]*)NOT_RUN/,'$1PASS')),'CASE_TRACE_OR_STATUS_CHANGED');
  const m=clone();m.sourceCases[0].applicationStatus='PASS';detects(files,'FALSE_PASS',m);
});
test('wrong native/active rule classification and false gate closure are rejected',()=>{
  const m=clone();m.rules['IOS-01']='ACTIVE';detects(files,'RULE_SCOPE',m);
  m.r05='DONE';detects(files,'GATE_STATUS',m);
});
test('dropping backend/Web variant while retaining TC count is rejected',()=>{
  const f=change('docs/engineering/tests.md',s=>s.replace('| B+W | Permission matrix','| D | Permission matrix'));detects(f,'VARIANT_SCOPE');
  const m=clone();m.groups['TC-01'].deferredVariants=[];detects(files,'DEFERRED_VARIANTS',m);
});
test('relaxing active oracle or rule negative example is rejected independently of snapshot hash',()=>{
  detects(change('docs/engineering/tests.md',s=>s.replace('không X→Y tự động','có thể X→Y tự động')),'ACTIVE_ORACLE_CHANGED');
  detects(change('docs/engineering/web.md',s=>s.replace(/^\| WEB-01 \|.*$/m,'| WEB-01 | scope | good | allowed | TC-01 |')),'RULE_ORACLE_CHANGED');
});
test('broken links and duplicate anchors are rejected',()=>{
  detects(change('docs/engineering/rules.md',s=>s+'\n[missing](missing.md#x)\n'),'MISSING_LINK');
  detects(change('docs/engineering/rules.md',s=>s+'\n<a id="contract"></a>\n'),'DUPLICATE_ANCHOR');
});
test('fresh local restore is exact and cannot overwrite existing folder or symlink',()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'kidea-web-scope-'));
  try{const target=path.join(temp,'project');restoreCreateOnly(target);assert.deepEqual(validateScope(readDocs(target)).errors,[]);
    assert.throws(()=>restoreCreateOnly(target),/EEXIST/);const link=path.join(temp,'linked');fs.symlinkSync(target,link);assert.throws(()=>restoreCreateOnly(link),/EEXIST/);
    assert.deepEqual(readDocs(target),files);
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('all 11 original historical tests run unchanged in a clean isolated checkout layout',()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'kidea-r05-history-')),repo=path.join(temp,'repo');
  try{
    const names=['tests/r05/profile-docs.test.mjs','tests/r05/support.mjs','tests/r05/validate.mjs','tests/evidence/r04/design-r1/architecture-post.json','tests/evidence/r04/design-r1/correction-proposal-final.json','tests/evidence/local-portability/pilot-amendment-r2.json'];
    const amendment=JSON.parse(fs.readFileSync(path.join(root,names.at(-1))));names.push(...Object.keys(amendment.sources));
    for(const f of new Set(names)){const target=path.join(repo,f);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,f),target);}
    fs.cpSync(path.join(root,'tests/evidence/r05/profile-r1/pilot'),path.join(temp,'kidea-workshop-pilot'),{recursive:true,errorOnExist:true,force:false});
    // Node's parent test context suppresses nested-run reporting; create a real independent runner.
    const env={...process.env};delete env.NODE_TEST_CONTEXT;
    const r=spawnSync(process.execPath,['--test','--test-reporter=tap','tests/r05/profile-docs.test.mjs'],{cwd:repo,env,encoding:'utf8',timeout:30000});
    assert.equal(r.status,0,r.stdout+'\n'+r.stderr);assert.match(r.stdout,/# pass 11/);assert.match(r.stdout,/# skipped 0/);console.log('Historical clean-folder suite: 11 PASS, 0 skipped');
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('step 8 reference ships with skill and has no local installation or pilot path dependency',()=>{
  const skill=fs.readFileSync(path.join(root,'.agents/skills/kidea/SKILL.md'),'utf8');assert.match(skill,/references\/coding-testing.md/);
  const method=fs.readFileSync(path.join(root,'.agents/skills/kidea/references/coding-testing.md'),'utf8');
  assert.doesNotMatch(method,/\/Users\/|D:\\|kidea-workshop-pilot/);for(const term of ['Future','Human','G2','PASS'])assert.ok(method.includes(term),term);
});
test('complete skill copied to a fresh folder reads a valid fixture without modifying it',()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'kidea-web-method-'));
  try{
    const skill=path.join(temp,'skill'),project=path.join(temp,'project');
    fs.cpSync(path.join(root,'.agents/skills/kidea'),skill,{recursive:true,errorOnExist:true,force:false});
    // Use the already locked dependency, never a global install or hidden sibling module.
    fs.cpSync(path.join(root,'node_modules/jsonc-parser'),path.join(temp,'node_modules/jsonc-parser'),{recursive:true,errorOnExist:true,force:false});
    const {world}=buildBase();for(const [f,b]of Object.entries(world.files)){const dest=path.join(project,f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b,{flag:'wx'});}
    const r=spawnSync(process.execPath,[path.join(skill,'scripts/kidea.mjs'),'status'],{cwd:project,encoding:'utf8',timeout:15000});
    assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(r.stdout).readState,'OK');
    assert.equal(JSON.parse(r.stdout).data.reviews[0].verification.authority,'NOT_VERIFIED');
    for(const [f,b]of Object.entries(world.files))assert.equal(sha(fs.readFileSync(path.join(project,f))),sha(b),f);
    assert.equal(sha(fs.readFileSync(path.join(skill,'references/coding-testing.md'))),sha(fs.readFileSync(path.join(root,'.agents/skills/kidea/references/coding-testing.md'))));
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
