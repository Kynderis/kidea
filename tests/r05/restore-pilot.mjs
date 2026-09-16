// Explicit CREATE-only restoration from approved immutable evidence; no historical runner.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {repo,pilot,evidence,baseline,digest} from './support.mjs';
assert.deepEqual(process.argv.slice(2),['--create']);
assert.notEqual(process.getuid?.(),0);
assert.equal(fs.realpathSync(path.dirname(pilot)),path.dirname(pilot));
assert.ok(!fs.existsSync(pilot),'Existing pilot must be inspected, never overwritten');
const files=baseline();
fs.mkdirSync(pilot); // Deliberately not recursive: EEXIST stops concurrent creation.
for(const [file,bytes] of Object.entries(files)){
  fs.mkdirSync(path.dirname(path.join(pilot,file)),{recursive:true});
  fs.writeFileSync(path.join(pilot,file),bytes,{flag:'wx'});
  assert.equal(digest(fs.readFileSync(path.join(pilot,file))),digest(bytes));
}
const result={at:new Date().toISOString(),approval:'Human: Tôi duyệt nhé, after answer cfffe0c; R05 D1-D6/P1-P4 and Mac continuation',repo,pilot,
  action:'CREATE_ONLY_FROM_APPROVED_R04_PLUS_LP01',files:Object.fromEntries(Object.entries(files).map(([f,b])=>[f,{bytes:b.length,sha256:digest(b)}])),gitRepositoryCreated:false};
fs.writeFileSync(path.join(evidence,'restoration.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({pilot,restored:Object.keys(files).length,allHashesMatch:true}));
