import test from 'node:test';
import assert from 'node:assert/strict';
import {checkDocuments,readDocuments,missingSharedBacklinks} from './link-check.mjs';
test('cross-file exact anchors, self links and external provenance',()=>{
  assert.deepEqual(checkDocuments({'a.md':'<a id="a"></a> [b](sub/b.md#b) [self](#a) [source](https://example.org)', 'sub/b.md':'<a id="b"></a> [back](../a.md#a)'}),{links:3,errors:[]});
});
test('missing destination file is caught',()=>assert.equal(checkDocuments({'a.md':'[b](b.md#b)'}).errors[0].kind,'MISSING_FILE'));
test('existing file with wrong section is caught',()=>assert.equal(checkDocuments({'a.md':'[b](b.md#wrong)','b.md':'<a id="right"></a>'}).errors[0].kind,'MISSING_ANCHOR'));
test('ambiguous duplicate anchors are caught',()=>assert.equal(checkDocuments({'a.md':'<a id="x"></a><a id="x"></a>'}).errors[0].kind,'DUPLICATE_ANCHOR'));
test('real pilot has ten linked documents',()=>{
  const docs=readDocuments('D:/Code/kynderis/kidea-workshop-pilot/docs');assert.equal(Object.keys(docs).length,10);assert.deepEqual(checkDocuments(docs).errors,[]);
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
test('real shared sources link back to every direct consuming section',()=>assert.deepEqual(missingSharedBacklinks(readDocuments('D:/Code/kynderis/kidea-workshop-pilot/docs')),[]));
