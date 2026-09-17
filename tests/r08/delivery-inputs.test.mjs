import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {inventory} from './delivery-inputs-r1.mjs';
test('artifact inventory records bytes and executable mode; internal links only',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'r08-artifact-'));
 try {
  fs.writeFileSync(path.join(root,'entry'),'original',{mode:0o755});
  fs.symlinkSync('entry',path.join(root,'command'));
  const first=inventory(root);assert.equal(first.entry.executable,true);assert.equal(first.command.link,'entry');
  fs.writeFileSync(path.join(root,'entry'),'changed');assert.notEqual(inventory(root).entry.sha256,first.entry.sha256);
  fs.symlinkSync(os.tmpdir(),path.join(root,'outside'));assert.throws(()=>inventory(root),/escapes root/);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
