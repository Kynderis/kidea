// Preserve fixture Git bytes as inert evidence, not embedded repositories.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {byteIntegrity} from '../../.agents/skills/kidea/scripts/bootstrap-plan.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),root=path.join(repo,'tests/evidence/r06/implementation-r1');
const original=JSON.parse(fs.readFileSync(path.join(root,'summary.json'))),moves=[];
function visit(dir) {
  for(const e of fs.readdirSync(dir,{withFileTypes:true})) {
    if(!e.isDirectory())continue;
    const full=path.join(dir,e.name);
    if(e.name==='.git') {
      const next=path.join(dir,'git-metadata.snapshot');assert.equal(fs.existsSync(next),false);
      fs.renameSync(full,next);moves.push({from:path.relative(root,full),to:path.relative(root,next)});
    }else visit(full);
  }
}
assert.equal(fs.existsSync(path.join(root,'packaging.json')),false);visit(root);
for(const [p,integrity]of Object.entries(original.files)) {
  const move=moves.find(m=>p.startsWith(m.from+path.sep));const current=move?move.to+p.slice(move.from.length):p;
  assert.deepEqual(byteIntegrity(fs.readFileSync(path.join(root,current))),integrity,p);
}
fs.writeFileSync(path.join(root,'packaging.json'),JSON.stringify({at:new Date().toISOString(),moves,verifiedFiles:Object.keys(original.files).length,bytesUnchanged:true,reason:'Inert archived Git metadata; original summary paths translate through moves. Not an active repository or submodule.',script:byteIntegrity(fs.readFileSync(fileURLToPath(import.meta.url)))},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({moves,bytesUnchanged:true}));
