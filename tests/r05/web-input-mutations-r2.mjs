import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const file=path.resolve('../kidea-workshop-pilot/samples/r05/web/src/lib/model.ts');
const original=fs.readFileSync(file,'utf8');
const ev=fs.mkdtempSync('tests/evidence/r05/web-execution-r2/input-mutations-');
const sha=s=>createHash('sha256').update(s).digest('hex');
const cases=[
 {name:'uint64-overflow',from:' && BigInt(v) <= MAX_VERSION',to:'',failure:'version is canonical unsigned64 decimal'},
 {name:'reply-correlation',from:"v.actor!==context.actor || v.epoch!==context.epoch || v.generation!==context.generation || v.intentId!==intentId || ",to:'',failure:'malformed,unknown,transport-like or mismatched reply stays UNKNOWN'}
];
const results=[];
try{
 for(const c of cases){
  assert.ok(original.includes(c.from));const mutated=original.replace(c.from,c.to);
  fs.writeFileSync(file,mutated);fs.writeFileSync(path.join(ev,c.name+'.ts'),mutated);
  const run=spawnSync(process.execPath,['tests/r05/web-run-r2.mjs','negative-'+c.name,process.execPath,'--test','tests/unit/*.test.mjs'],{encoding:'utf8',timeout:60000,maxBuffer:8*1024*1024});
  assert.ifError(run.error);const result=JSON.parse(run.stdout.split('\n')[0]);const raw=fs.readFileSync(path.join(result.out,'stdout.txt'),'utf8');
  assert.equal(result.code,1);assert.equal(result.timedOut,false);assert.equal(result.inputsUnchanged,true);assert.match(raw,new RegExp('✖ '+c.failure));
  results.push({name:c.name,hash:sha(mutated),evidence:result.out,detected:true});
 }
}finally{fs.writeFileSync(file,original);}
fs.writeFileSync(path.join(ev,'summary.json'),JSON.stringify({originalHash:sha(original),restoredHash:sha(fs.readFileSync(file)),results},null,2)+'\n');
console.log(JSON.stringify({evidence:ev,detected:results.length}));
