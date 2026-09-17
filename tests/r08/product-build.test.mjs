import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {authorize,verify,hash} from './product-build-r1/verify.mjs';
test('execution needs matching package and fresh exception, not expired R05 grant',()=>{assert.doesNotThrow(()=>authorize(['--approved-manifest','fixed','--approved-exception','R08-TIDY-01'],'fixed'));for(const a of [[],['--approved-manifest','wrong','--approved-exception','R08-TIDY-01'],['--approved-manifest','fixed','--approved-exception','R05-TIDY-01']])assert.throws(()=>authorize(a,'fixed'));});
test('source closure rejects modified or additional files and symlink directory',()=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'r08-product-'));try{fs.writeFileSync(path.join(root,'a'),'original');const files={a:hash(path.join(root,'a'))};verify(root,files);fs.writeFileSync(path.join(root,'a'),'changed');assert.throws(()=>verify(root,files));fs.writeFileSync(path.join(root,'a'),'original');fs.writeFileSync(path.join(root,'b'),'extra');assert.throws(()=>verify(root,files));fs.unlinkSync(path.join(root,'b'));fs.symlinkSync(os.tmpdir(),path.join(root,'elsewhere'));assert.throws(()=>verify(root,files));}finally{fs.rmSync(root,{recursive:true,force:true});}});
