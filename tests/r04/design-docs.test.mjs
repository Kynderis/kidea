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

test('approved R04 bytes remain exact prefix of LP-01 amendments; all other pilot files remain exact',()=>{
  const post=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/architecture-post.json'),'utf8'));
  const correction=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/correction-proposal-final.json'),'utf8'));
  const amendmentBytes=fs.readFileSync(path.join(repo,'tests/evidence/local-portability/pilot-amendment-r2.json'));
  // Pin this accepted-direction amendment artifact, not whichever manifest happens to exist.
  assert.equal(digest(amendmentBytes),'042a91e6838e8c007303ee30919c04ca0c9513ebc45ca10a10bb26261d906b17');
  const amendment=JSON.parse(amendmentBytes.toString('utf8'));
  assert.deepEqual(Object.keys(amendment.files).sort(),['docs/design/architecture.md','docs/design/operations.md','docs/design/quality.md']);
  const preBytes=fs.readFileSync(path.join(repo,amendment.preEvidence.path));
  assert.equal(digest(preBytes),amendment.preEvidence.sha256);
  const pre=JSON.parse(preBytes.toString('utf8'));
  for(const [rel,sha256] of Object.entries(amendment.sources))assert.equal(digest(fs.readFileSync(path.join(repo,rel))),sha256,rel+' historical evidence changed');
  assert.equal(Object.keys(correction.targets).length,7);
  for(const [rel,file] of Object.entries(post.files)){
    const target=correction.targets[rel];
    if(target){assert.equal(target.beforeSha256,file.sha256);assert.equal(digest(Buffer.from(target.base64,'base64')),target.sha256);}
    const baseline=target??file,before=Buffer.from(pre.files[rel].base64,'base64');
    assert.equal(digest(before),baseline.sha256,rel+' preimage no longer matches R04');
    assert.equal(pre.files[rel].base64,baseline.base64,rel+' raw R04 bytes changed');
    const edit=amendment.files[rel],current=fs.readFileSync(path.join(pilot,rel));
    if(edit){
      assert.equal(edit.preservation,'EXACT_BYTE_PREFIX');
      assert.equal(edit.before.base64,baseline.base64);
      assert.equal(edit.before.sha256,baseline.sha256);
      const append=Buffer.from(edit.append.base64,'base64'),after=Buffer.from(edit.after.base64,'base64');
      assert.equal(digest(append),edit.append.sha256);
      assert.equal(digest(after),edit.after.sha256);
      assert.deepEqual(after,Buffer.concat([before,append]),rel+' amendment changed original bytes');
      assert.deepEqual(current,after,rel+' current bytes differ from exact LP-01 amendment');
    }else assert.deepEqual(current,before,rel+' outside amendment changed');
    assert.equal(digest(current),amendment.allAfterHashes[rel],rel);
  }
});

test('skill routes to an existing local product-design reference',()=>{
  const root=path.join(repo,'.agents/skills/kidea'),body=fs.readFileSync(path.join(root,'SKILL.md'),'utf8');
  const refs=[...body.matchAll(/\[[^\]]+\]\((references\/[^)]+)\)/g)].map(m=>m[1]);
  assert.ok(refs.includes('references/product-design.md'));
  for(const ref of refs)assert.ok(fs.statSync(path.join(root,ref)).isFile(),ref);
});
