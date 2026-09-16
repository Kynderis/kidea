// The Windows slash-copy failure also exercises the cross-platform exact-root grant.
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,readdirSync,realpathSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {prepareInit,initialize} from '../../.agents/skills/kidea/scripts/init.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url));
const out=path.join(repo,'.test-output/r02-t10');mkdirSync(out,{recursive:true});
test('realpath-selected root builds accepted JSON; noncanonical and different root grants reject without writes',async()=>{
  const root=mkdtempSync(path.join(out,'root-request-'));
  const selectedLink=process.platform==='win32'?root.replaceAll('\\','/'):root+path.sep+'.';
  const q={projectName:'Synthetic normalization',humanRequest:'Synthetic note app; no approval.',featureSource:{mode:'NEW',path:'docs/features.md',anchor:null},profiles:[],permission:{root:selectedLink,metadataRoot:'.kidea/checkpoints',targets:[{path:'.kidea/INDEX.md',action:'CREATE'},{path:'.kidea/work.md',action:'CREATE'},{path:'docs/features.md',action:'CREATE'}],createDirectories:['docs'],bootstrap:true,allowRestoreUpdate:false,allowRetireOwnPending:true,assumptions:{localFilesystem:true,noActiveSync:true,singleKideaRun:true},statement:'Synthetic CREATE grant for this exact fixture only.'}};
  assert.notEqual(selectedLink,realpathSync(root),'fixture must use a genuinely noncanonical spelling');
  assert.throws(()=>prepareInit(root,q),{code:'AUTHORIZATION_REQUIRED'});assert.deepEqual(readdirSync(root),[]);
  q.permission.root=path.dirname(root);assert.throws(()=>prepareInit(root,q),{code:'AUTHORIZATION_REQUIRED'});assert.deepEqual(readdirSync(root),[]);
  const resolved=realpathSync(selectedLink);q.permission.root=resolved;
  const serialized=JSON.parse(JSON.stringify(q));assert.equal(serialized.permission.root,resolved);
  assert.equal((await initialize(resolved,serialized)).state,'INITIALIZED');
  const again=prepareInit(resolved,serialized);assert.equal(again.state,'ALREADY_INITIALIZED');
  console.log('Synthetic root retained: '+root);
});
