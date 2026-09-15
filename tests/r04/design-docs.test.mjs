import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {checkDocuments,readDocuments,missingSharedBacklinks} from '../r03/link-check.mjs';
import {repo,pilot,baselineFiles,digest} from './evidence.mjs';

const docs=readDocuments(path.join(pilot,'docs'));
function address(file,link){const [rel,id]=link.split('#');return (rel?path.posix.normalize(path.posix.join(path.posix.dirname(file),rel)):file)+'#'+id;}
function missingDesignBacklinks(all){
  const missing=[];
  for(const [file,body] of Object.entries(all).filter(([f])=>f.startsWith('design/'))){
    for(const section of body.matchAll(/<a id="([^"]+)"><\/a>([\s\S]*?)(?=<a id="|$)/g)){
      const from=file+'#'+section[1];
      for(const link of section[2].matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
        if(/^[A-Za-z]+:/.test(link[1])||!link[1].includes('#'))continue;
        const target=address(file,link[1]),[targetFile]=target.split('#');
        if(targetFile.startsWith('design/'))continue;
        const rows=(all[targetFile]??'').split('\n').filter(l=>l.startsWith('|'));
        const ok=rows.some(row=>{const cells=row.split('|');const refs=s=>[...s.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(m=>address(targetFile,m[1]));return refs(cells[1]??'').includes(target)&&refs(cells[2]??'').includes(from);});
        if(!ok)missing.push({from,target});
      }
    }
  }return missing;
}
test('quality stage retains all ten R03 sources and adds only quality',()=>{
  assert.deepEqual(Object.keys(docs).sort(),[...baselineFiles,'design/quality.md'].sort());
});
test('all live pilot links resolve to unique exact anchors',()=>assert.deepEqual(checkDocuments(docs).errors,[]));
test('R03 source text is unchanged except line endings and appended references',()=>{
  const before=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/quality-pre.json'),'utf8'));
  for(const file of baselineFiles){const b=Buffer.from(before.files['docs/'+file].base64,'base64');assert.equal(digest(b),before.files['docs/'+file].sha256);
    const current=fs.readFileSync(path.join(pilot,'docs',file));
    // apply_patch may normalize line endings: verify unchanged logical source, not byte identity of edited files.
    const oldText=b.toString('utf8').replaceAll('\r\n','\n').trimEnd(),now=current.toString('utf8').replaceAll('\r\n','\n').trimEnd();
    assert.ok(now===oldText||now.startsWith(oldText+'\n\n'),file+' source changed');
    if(now!==oldText){const extra=now.slice(oldText.length);assert.ok(extra.includes('Nơi dùng trong thiết kế chất lượng'));assert.ok(!extra.includes('## R-'));}
  }
});
test('existing R03 shared reverse references remain valid',()=>assert.deepEqual(missingSharedBacklinks(docs),[]));
test('design callers have reverse references under the exact source row',()=>assert.deepEqual(missingDesignBacklinks(docs),[]));
test('valid links alone cannot hide an absent design backlink',()=>{
  const fixture={'design/q.md':'<a id="q"></a>[source](../source.md#r)','source.md':'<a id="r"></a>'};
  assert.deepEqual(checkDocuments(fixture).errors,[]);assert.equal(missingDesignBacklinks(fixture).length,1);
});
test('wrong source row is rejected even when backlink exists',()=>{
  const fixture={'design/q.md':'<a id="q"></a>[source](../source.md#r)','source.md':'<a id="r"></a><a id="wrong"></a>\n| [wrong](#wrong) | [q](design/q.md#q) |'};
  assert.equal(missingDesignBacklinks(fixture).length,1);
  fixture['source.md']=fixture['source.md'].replace('[wrong](#wrong)','[r](#r)');assert.deepEqual(missingDesignBacklinks(fixture),[]);
});
test('broken links and duplicate anchors still fail',()=>{
  assert.equal(checkDocuments({'a.md':'[x](absent.md#x)'}).errors[0].kind,'MISSING_FILE');
  assert.equal(checkDocuments({'a.md':'<a id="x"></a><a id="x"></a>'}).errors[0].kind,'DUPLICATE_ANCHOR');
});
