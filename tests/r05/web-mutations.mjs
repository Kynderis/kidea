// Fault injection of the synthetic sample only. Original source restored in finally.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo=process.cwd(),root=path.resolve('../kidea-workshop-pilot/samples/r05/web');
const ev=fs.mkdtempSync(path.join(repo,'tests/evidence/r05/web-execution-r1/mutations-'));
const sha=s=>createHash('sha256').update(s).digest('hex');
function run(label,args,expected,env={}){
 const r=spawnSync(process.execPath,['tests/r05/web-run.mjs',label,process.execPath,...args],{cwd:repo,env:{...process.env,...env},encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024});
 assert.ifError(r.error);
 const first=JSON.parse(r.stdout.split('\n')[0]);
 const result=JSON.parse(fs.readFileSync(path.join(first.out,'summary.json')));
 assert.equal(result.inputsUnchanged,true);assert.equal(result.timedOut,false);assert.equal(result.code,expected);
 return {path:path.relative(repo,first.out),code:result.code,stdout:fs.readFileSync(path.join(first.out,'stdout.txt'),'utf8')};
}
const results=[];
const source=fs.readFileSync(path.join(root,'src/lib/model.ts'),'utf8');
const mutations=[
 ['context',/  if \(!this.mounted[^\n]+/, '  // context guard intentionally removed','S01'],
 ['precision',/BigInt\(s.version\) <= BigInt\(previous.version\)/,'Number(s.version) <= Number(previous.version)','S02'],
 ['scope',/JSON.stringify\(\[s.workshop, s.audience\]\)/,"'global'",'S03'],
 ['history',/  if \(previous &&[^\n]+/, '  // version check intentionally removed','S05'],
 ['admin',/this.sent \? 'GET' : 'POST'/,"'POST'",'S07'],
 ['unmount',/unmount\(\) \{ this.mounted = false; this.context.generation\+\+; \}/,'unmount() {}','S09']
];
for(const [name,pattern,replacement,expectedCase] of mutations){
 assert.match(source,pattern);const mutated=source.replace(pattern,replacement);
 const file=path.join(root,'.cache','mutations',name+'.ts');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,mutated);
 fs.writeFileSync(path.join(ev,name+'.ts'),mutated);
 const r=run('negative-'+name,['--test','tests/unit/model.test.mjs'],1,{SAMPLE_MODEL:file});
 assert.match(r.stdout,new RegExp('[✖].*'+expectedCase));assert.match(r.stdout,/fail [1-9]/);
 results.push({name,sourceHash:sha(source),mutatedHash:sha(mutated),detected:true,evidence:r.path});
}
for(const name of ['ssr-global','raw-html']){
 const rel=name==='ssr-global'?'src/routes/ssr/+page.server.ts':'src/routes/+page.svelte';
 const f=path.join(root,rel),original=fs.readFileSync(f,'utf8');
 let mutated;
 if(name==='ssr-global'){
  assert.ok(original.includes(' const privateValue ='));
  mutated='let sharedPrivate = "";\n'+original.replace(' const privateValue = `PRIVATE_${actor}_ONLY`;',' sharedPrivate = `PRIVATE_${actor}_ONLY`;').replace(' if (barrier) await hold(barrier);',' if (barrier) await hold(barrier);\n const privateValue = sharedPrivate;');
 }else{assert.ok(original.includes('{hostile}</p>'));mutated=original.replace('{hostile}</p>','{@html hostile}</p>');}
 fs.writeFileSync(path.join(ev,name+'.txt'),mutated);
 try{
  fs.writeFileSync(f,mutated);
  const build=run('negative-'+name+'-build',['node_modules/vite/bin/vite.js','build'],0);
  const r=run('negative-'+name+'-browser',['node_modules/playwright/cli.js','test','--project=chromium','--workers=1','--retries=0','--forbid-only'],1);
  assert.match(r.stdout,/[1-9] failed/);
  const json=JSON.parse(fs.readFileSync(path.join(root,'test-results/results.json')));
  fs.writeFileSync(path.join(ev,name+'-results.json'),JSON.stringify(json,null,2)+'\n');
  const expectedCase=name==='ssr-global'?'S06':'S08';
  const flatten=s=>[...(s.specs??[]),...(s.suites??[]).flatMap(flatten)];
  assert.ok(json.suites.flatMap(flatten).some(s=>s.title.includes(expectedCase)&&s.tests.some(t=>t.results.some(r=>r.status==='failed'))));
  results.push({name,sourceHash:sha(original),mutatedHash:sha(mutated),detected:true,build:build.path,evidence:r.path});
 }finally{fs.writeFileSync(f,original);}
}
fs.writeFileSync(path.join(ev,'summary.json'),JSON.stringify({results,modelUnchanged:source===fs.readFileSync(path.join(root,'src/lib/model.ts'),'utf8'),scope:'Eight intentional faulty sample variants must fail; not eight additional app passes'},null,2)+'\n');
console.log(JSON.stringify({evidence:ev,detected:results.length,total:8}));
