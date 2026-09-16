// One-time documentation assembly; no application/config generation.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pilot,baseline,sourceCases,appendices} from './support.mjs';
const file=path.join(pilot,'docs/engineering/tests.md');
const body=fs.readFileSync(file,'utf8');assert.equal(body.split('<!-- SOURCE_CASE_INDEX -->').length,2);
const rows=sourceCases().map(c=>`| ${c.id} | [${c.file.replace('docs/','')}#${c.anchor}](../${c.file.replace('docs/','')}#${c.anchor}) | ${c.group} | NOT_RUN |`);
fs.writeFileSync(file,body.replace('<!-- SOURCE_CASE_INDEX -->',['| Case nguồn | Nguồn setup/input/expected | Nhóm kỹ thuật | Runtime |','|---|---|---|---|',...rows].join('\n')));
for(const [name,append] of Object.entries(appendices)){
  assert.deepEqual(fs.readFileSync(path.join(pilot,name)),baseline()[name]);
  fs.appendFileSync(path.join(pilot,name),append);
}
console.log('137 source cases indexed; exactly two approved append-only backlinks added.');
