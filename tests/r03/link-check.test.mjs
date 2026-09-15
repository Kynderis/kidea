import test from 'node:test';
import assert from 'node:assert/strict';
import {checkDocuments,readDocuments} from './link-check.mjs';
test('cross-file exact anchors, self links and external provenance',()=>{
  assert.deepEqual(checkDocuments({'a.md':'<a id="a"></a> [b](sub/b.md#b) [self](#a) [source](https://example.org)', 'sub/b.md':'<a id="b"></a> [back](../a.md#a)'}),{links:3,errors:[]});
});
test('missing destination file is caught',()=>assert.equal(checkDocuments({'a.md':'[b](b.md#b)'}).errors[0].kind,'MISSING_FILE'));
test('existing file with wrong section is caught',()=>assert.equal(checkDocuments({'a.md':'[b](b.md#wrong)','b.md':'<a id="right"></a>'}).errors[0].kind,'MISSING_ANCHOR'));
test('ambiguous duplicate anchors are caught',()=>assert.equal(checkDocuments({'a.md':'<a id="x"></a><a id="x"></a>'}).errors[0].kind,'DUPLICATE_ANCHOR'));
test('real pilot has ten linked documents',()=>{
  const docs=readDocuments('D:/Code/kynderis/kidea-workshop-pilot/docs');assert.equal(Object.keys(docs).length,10);assert.deepEqual(checkDocuments(docs).errors,[]);
});
