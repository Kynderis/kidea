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
      if(section[1]==='design-relations')continue;
      const from=file+'#'+section[1];
      for(const link of section[2].matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
        if(/^[A-Za-z]+:/.test(link[1])||!link[1].includes('#'))continue;
        const target=address(file,link[1]),[targetFile]=target.split('#');
        if(targetFile===file)continue;
        const rows=(all[targetFile]??'').split('\n').filter(l=>l.startsWith('|'));
        const ok=rows.some(row=>{const cells=row.split('|');const refs=s=>[...s.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(m=>address(targetFile,m[1]));return refs(cells[1]??'').includes(target)&&refs(cells[2]??'').includes(from);});
        if(!ok)missing.push({from,target});
      }
    }
  }return missing;
}
test('architecture stage retains ten R03 sources and exactly five permitted designs',()=>{
  assert.deepEqual(Object.keys(docs).sort(),[...baselineFiles,'design/quality.md','design/experience.md','design/operations.md','design/admin.md','design/architecture.md'].sort());
});
test('all live pilot links resolve to unique exact anchors',()=>assert.deepEqual(checkDocuments(docs).errors,[]));
test('R03 source text is unchanged except line endings and appended references',()=>{
  const before=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/quality-pre.json'),'utf8'));
  for(const file of baselineFiles){const b=Buffer.from(before.files['docs/'+file].base64,'base64');assert.equal(digest(b),before.files['docs/'+file].sha256);
    const current=fs.readFileSync(path.join(pilot,'docs',file));
    // apply_patch may normalize line endings: verify unchanged logical source, not byte identity of edited files.
    const oldText=b.toString('utf8').replaceAll('\r\n','\n').trimEnd(),now=current.toString('utf8').replaceAll('\r\n','\n').trimEnd();
    assert.ok(now===oldText||now.startsWith(oldText+'\n\n'),file+' source changed');
    if(now!==oldText){const extra=now.slice(oldText.length);assert.match(extra,/Nơi dùng trong thiết kế (chất lượng|trải nghiệm|vận hành|quản trị|kiến trúc)/);assert.ok(!extra.includes('## R-'));}
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
test('accepted quality content remains unchanged before appended UX references',()=>{
  const pre=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/experience-pre.json'),'utf8'));
  const old=Buffer.from(pre.files['docs/design/quality.md'].base64,'base64').toString('utf8').replaceAll('\r\n','\n').trimEnd();
  assert.equal(pre.files['docs/design/quality.md'].sha256,'55733ba73437e3c26f14009efd1f4f06f9c4100a0559ed7be8c8640b5883996b');
  const current=docs['design/quality.md'].replaceAll('\r\n','\n').trimEnd();assert.ok(current.startsWith(old+'\n\n<a id="design-relations"></a>'));
});
test('cross-design dependency needs reverse reference and ignores navigation relations',()=>{
  const f={'design/u.md':'<a id="u"></a>[q](q.md#q)','design/q.md':'<a id="q"></a>Rule<a id="design-relations"></a>\n| [q](#q) | [u](u.md#u) |'};
  assert.deepEqual(missingDesignBacklinks(f),[]);f['design/q.md']=f['design/q.md'].split('<a id="design-relations">')[0];assert.equal(missingDesignBacklinks(f).length,1);
});
test('accepted experience is unchanged before appended operations references',()=>{
  const pre=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/operations-pre.json'),'utf8'));
  const file=pre.files['docs/design/experience.md'];assert.equal(file.sha256,'62f24ffdd808c5e1a3f12f71fc790084d0a0b303870949307cef0f8337a8c9de');
  const old=Buffer.from(file.base64,'base64').toString('utf8').replaceAll('\r\n','\n').trimEnd();
  assert.ok(docs['design/experience.md'].replaceAll('\r\n','\n').startsWith(old+'\n\n<a id="design-relations"></a>'));
});
test('accepted operations is unchanged before appended admin references',()=>{
  const pre=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/admin-pre.json'),'utf8'));
  const file=pre.files['docs/design/operations.md'];assert.equal(file.sha256,'6414b6ad4680f362ef65c223d7f8a51ffa7883346bb77e2e3a3ad187cdc47b2e');
  const old=Buffer.from(file.base64,'base64').toString('utf8').replaceAll('\r\n','\n').trimEnd();
  assert.ok(docs['design/operations.md'].replaceAll('\r\n','\n').startsWith(old+'\n\n<a id="design-relations"></a>'));
});

test('accepted admin is unchanged before appended architecture references',()=>{
  const pre=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/architecture-pre.json'),'utf8'));
  const file=pre.files['docs/design/admin.md'];assert.equal(file.sha256,'0547ea80c04f4c961b18212281b722643301c8c0332832db80de181ca2692775');
  const old=Buffer.from(file.base64,'base64').toString('utf8').replaceAll('\r\n','\n').trimEnd();
  assert.ok(docs['design/admin.md'].replaceAll('\r\n','\n').startsWith(old+'\n\n<a id="design-relations"></a>'));
});
