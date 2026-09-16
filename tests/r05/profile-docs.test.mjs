import test from 'node:test';
import assert from 'node:assert/strict';
import {pilot,readTree,baseline,sourceCases,appendices} from './support.mjs';
import {validate} from './validate.mjs';
const files=readTree(pilot);
const change=(f,fn)=>({...files,[f]:Buffer.from(fn(files[f].toString()))});
test('complete R05 documents retain exact source, resolve links and cover all source cases',()=>{
  const r=validate(files);assert.deepEqual(r.errors,[]);assert.equal(r.rules,40);assert.equal(r.sourceCases,137);assert.equal(r.technicalGroups,20);console.log(JSON.stringify(r));
});
test('missing and extra files are rejected, including same-count replacement',()=>{
  const f={...files};delete f['docs/engineering/ios.md'];assert.ok(validate(f).errors.some(e=>e.code==='INVENTORY'));
  f['docs/engineering/other.md']=files['docs/engineering/ios.md'];assert.ok(validate(f).errors.some(e=>e.code==='INVENTORY'));
  assert.ok(validate({...files,'app.cpp':Buffer.from('unexpected')}).errors.some(e=>e.code==='INVENTORY'));
});
test('business meaning cannot change under an appended-reference allowance',()=>{
  const f=change('docs/business/tests.md',s=>s.replace('C10,N0','C10,N1'));
  assert.ok(validate(f).errors.some(e=>e.code==='SOURCE_CHANGED'));
});
test('unapproved extra text in either permitted backlink is rejected',()=>{
  for(const file of Object.keys(appendices))assert.ok(validate(change(file,s=>s+'Approve all')).errors.some(e=>e.code==='SOURCE_CHANGED'));
});
test('source mutation in untouched files is rejected byte for byte',()=>{
  for(const file of Object.keys(baseline()).filter(f=>!appendices[f]))assert.ok(validate(change(file,s=>s+'\n')).errors.some(e=>e.code==='SOURCE_CHANGED'));
});
test('coverage omission fails even with unchanged group count',()=>{
  const f=change('docs/engineering/tests.md',s=>s.split('\n').filter(l=>!l.startsWith('| AR-T19 |')).join('\n'));
  assert.ok(validate(f).errors.some(e=>e.code==='COVERAGE'&&e.file==='AR-T19'));
});
test('false runtime pass and duplicate case row are rejected',()=>{
  const c=sourceCases()[0],line=files['docs/engineering/tests.md'].toString().split('\n').find(l=>l.startsWith('| '+c.id+' |'));
  assert.ok(validate(change('docs/engineering/tests.md',s=>s.replace(line,line.replace('NOT_RUN','PASS')))).errors.some(e=>e.code==='RUNTIME_STATUS'));
  assert.ok(validate(change('docs/engineering/tests.md',s=>s+'\n'+line)).errors.some(e=>e.code==='COVERAGE'));
});
test('removing a negative example or verification field fails',()=>{
  const f=change('docs/engineering/cpp.md',s=>s.replace('Ghép SQL từ title; SQLITE_IOERR thành domain reject',''));
  assert.ok(validate(f).errors.some(e=>e.code==='RULE_FIELDS'));
});
test('broken links, anchors and duplicate anchors fail',()=>{
  for(const body of ['[bad](missing.md#x)','[bad](rules.md#absent)','<a id="toolchain"></a>']){
    assert.ok(validate(change('docs/engineering/cpp.md',s=>s+'\n'+body)).errors.some(e=>['MISSING_LINK','MISSING_ANCHOR','DUPLICATE_ANCHOR'].includes(e.code)));
  }
});
test('approval label cannot be silently promoted',()=>{
  const f=change('docs/engineering/ios.md',s=>s.replace('PROPOSED','APPROVED'));
  assert.ok(validate(f).errors.some(e=>e.code==='APPROVAL_STATUS'));
});
test('source case inventory is fixed at 54 business and 83 design obligations',()=>{
  const c=sourceCases();assert.equal(c.filter(x=>x.file==='docs/business/tests.md').length,54);assert.equal(c.filter(x=>x.id.startsWith('AR-T')).length,22);assert.equal(c.filter(x=>x.id.startsWith('QT')).length,16);
});
