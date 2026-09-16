import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkDocuments,readDocuments,missingSharedBacklinks} from './link-check.mjs';
const pilotDocs=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../kidea-workshop-pilot/docs');
const businessFiles=['features.md','business/INDEX.md','business/tests.md',
  'business/shared/registration.md','business/shared/workshop.md','business/shared/availability.md',
  'business/features/view.md','business/features/register-cancel.md','business/features/admin.md','business/features/updates.md'].sort();
function assertBusinessInventory(docs){
  // R03 owns the exact business set; R04 independently checks the exact five design files and full inventory.
  assert.deepEqual(Object.keys(docs).filter(file=>!file.startsWith('design/')).sort(),businessFiles);
}
test('cross-file exact anchors, self links and external provenance',()=>{
  assert.deepEqual(checkDocuments({'a.md':'<a id="a"></a> [b](sub/b.md#b) [self](#a) [source](https://example.org)', 'sub/b.md':'<a id="b"></a> [back](../a.md#a)'}),{links:3,errors:[]});
});
test('missing destination file is caught',()=>assert.equal(checkDocuments({'a.md':'[b](b.md#b)'}).errors[0].kind,'MISSING_FILE'));
test('existing file with wrong section is caught',()=>assert.equal(checkDocuments({'a.md':'[b](b.md#wrong)','b.md':'<a id="right"></a>'}).errors[0].kind,'MISSING_ANCHOR'));
test('ambiguous duplicate anchors are caught',()=>assert.equal(checkDocuments({'a.md':'<a id="x"></a><a id="x"></a>'}).errors[0].kind,'DUPLICATE_ANCHOR'));
test('real pilot retains the exact ten R03 business documents and all links resolve',()=>{
  const docs=readDocuments(pilotDocs);assertBusinessInventory(docs);assert.deepEqual(checkDocuments(docs).errors,[]);
});
test('R03 inventory rejects missing or extra non-design files, including same-count replacement',()=>{
  const baseline=Object.fromEntries(businessFiles.map(file=>[file,'']));
  assert.doesNotThrow(()=>assertBusinessInventory({...baseline,'design/quality.md':''}));
  const missing={...baseline};delete missing['business/features/view.md'];
  assert.throws(()=>assertBusinessInventory(missing),assert.AssertionError);
  assert.throws(()=>assertBusinessInventory({...baseline,'business/unapproved.md':''}),assert.AssertionError);
  assert.throws(()=>assertBusinessInventory({...missing,'business/unapproved.md':''}),assert.AssertionError);
});
test('valid forward link can still have a missing reverse reference',()=>{
  const docs={'business/features/a.md':'<a id="flow"></a>[rule](../shared/r.md#rule)','business/shared/r.md':'<a id="rule"></a>Rule<a id="relations"></a>No consumers yet'};
  assert.deepEqual(checkDocuments(docs).errors,[]);
  assert.deepEqual(missingSharedBacklinks(docs),[{from:'business/features/a.md#flow',to:'business/shared/r.md#rule'}]);
  docs['business/shared/r.md']+='\n| [rule](#rule) | [consumer](../features/a.md#flow) | purpose |';assert.deepEqual(missingSharedBacklinks(docs),[]);
});
test('reverse link under the wrong rule does not satisfy the dependency',()=>{
  const docs={'business/features/a.md':'<a id="flow"></a>[rule](../shared/r.md#rule)','business/shared/r.md':'<a id="rule"></a><a id="other"></a><a id="relations"></a>\n| [other](#other) | [consumer](../features/a.md#flow) | purpose |'};
  assert.equal(missingSharedBacklinks(docs).length,1);
});
test('real shared sources link back to every direct consuming section',()=>assert.deepEqual(missingSharedBacklinks(readDocuments(pilotDocs)),[]));
