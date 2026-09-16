// Archive exact local test outputs. Does not run tests, rewrite retained evidence,
// change sources, or make results from one host certify a different host.
import assert from 'node:assert/strict';
import { copyFileSync, constants, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../../',import.meta.url));
const destination=path.join(root,'tests/evidence/local-portability');
const mode=process.argv[2];
assert.ok(['initial','final'].includes(mode)&&process.argv.length===3,'Choose initial or final; no arbitrary source/target paths');
const rows=[
  {name:'targeted-initial',source:'.test-output/local-portability/targeted-069pUn',tests:95,pass:90,fail:5,exitCode:1},
  {name:'git-helper-correction',source:'.test-output/local-portability/git-correction-fQMO0n',tests:5,pass:5,fail:0,exitCode:0},
  {name:'interim-281',source:'.test-output/r02-t07/regression-Urx0pn',tests:281,pass:281,fail:0,exitCode:0,bound:true},
  ...mode==='final'?[
    {name:'node24.21-final',source:'.test-output/r02-t07/regression-yJn4gv',tests:283,pass:283,fail:0,exitCode:0,bound:true,final:true,node:'v24.21.0'},
    {name:'node24.19-final',source:'.test-output/r02-t07/regression-ojbyTl',tests:283,pass:283,fail:0,exitCode:0,bound:true,final:true,node:'v24.19.0'},
  ]:[],
];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const counts=raw=>Object.fromEntries(raw.toString('utf8').split(/\r?\n/).flatMap(line=>{
  const match=/^[ℹ#] (tests|pass|fail|cancelled|skipped|todo) (\d+)$/.exec(line.trim());
  return match?[[match[1],Number(match[2])]]:[];
}));
mkdirSync(destination,{recursive:true});
const report={collectedAt:new Date().toISOString(),mode,collectorHash:hash(readFileSync(fileURLToPath(import.meta.url))),runs:[]};
const finalSummaries=[];
for(const row of rows) {
  const source=path.join(root,row.source),summary=JSON.parse(readFileSync(path.join(source,'summary.json'),'utf8'));
  const stdout=readFileSync(path.join(source,'stdout.txt')),stderr=readFileSync(path.join(source,'stderr.txt'));
  const actualCounts=counts(stdout);
  assert.deepEqual(actualCounts,{tests:row.tests,pass:row.pass,fail:row.fail,cancelled:0,skipped:0,todo:0},row.name+' counts');
  assert.equal(summary.exitCode,row.exitCode,row.name+' exitCode');assert.equal(summary.error,null);
  const item={name:row.name,originalDirectory:row.source,node:summary.node,counts:actualCounts,exitCode:summary.exitCode,files:{},sourceBinding:row.bound?'BEFORE_AFTER_CAPTURED':'NOT_CAPTURED_IN_THIS_RUN'};
  if(row.bound) {
    assert.equal(summary.inputsUnchanged,true,row.name+' source stability');
    assert.deepEqual(summary.before,summary.after,row.name+' before/after');
    assert.deepEqual(JSON.parse(readFileSync(path.join(source,'before.json'),'utf8')),summary.before);
    assert.equal(hash(stdout),summary.stdoutHash);assert.equal(hash(stderr),summary.stderrHash);
    item.differencesFromCurrentSource=Object.entries(summary.after).flatMap(([relative,expected])=>{
      assert.ok(!path.isAbsolute(relative)&&!relative.split(/[\\/]/).includes('..'),'Source inventory must remain repository-relative');
      const current=hash(readFileSync(path.join(root,relative)));
      return current===expected?[]:[{path:relative,captured:expected,current}];
    });
    if(row.final) {
      assert.deepEqual(item.differencesFromCurrentSource,[],row.name+' must match current source');
      assert.equal(summary.node,row.node);assert.equal(summary.host.platform,'win32');assert.equal(summary.host.arch,'x64');
      assert.equal(summary.git.exitCode,0);assert.equal(summary.git.error,null);
      finalSummaries.push(summary);
    }
  }
  const target=path.join(destination,row.name);mkdirSync(target,{recursive:true});
  for(const name of ['summary.json','stdout.txt','stderr.txt',...row.bound?['before.json']:[]]) {
    const sourceFile=path.join(source,name),targetFile=path.join(target,name),bytes=readFileSync(sourceFile);
    if(existsSync(targetFile))assert.deepEqual(readFileSync(targetFile),bytes,'Never overwrite different retained evidence');
    else copyFileSync(sourceFile,targetFile,constants.COPYFILE_EXCL);
    assert.deepEqual(readFileSync(targetFile),bytes);item.files[name]={sha256:hash(bytes),bytes:bytes.length};
  }
  report.runs.push(item);
}
if(mode==='final') {
  assert.equal(finalSummaries.length,2);assert.deepEqual(finalSummaries[0].before,finalSummaries[1].before);
  report.finalSourceSetIdentical=true;
  report.finalSourceFileCount=Object.keys(finalSummaries[0].before).length;
}
const receipt=path.join(destination,`collection-${mode}.json`);
writeFileSync(receipt,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt,runs:report.runs.map(r=>({name:r.name,counts:r.counts,currentDifferences:r.differencesFromCurrentSource?.map(x=>x.path)??null})),finalSourceSetIdentical:report.finalSourceSetIdentical??null},null,2));
