import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
export const repo=fileURLToPath(new URL('../../',import.meta.url));
export const pilot=path.resolve(repo,'../kidea-workshop-pilot');
export const digest=b=>createHash('sha256').update(b).digest('hex');
export const evidence=path.join(repo,'tests/evidence/r05/profile-r1');
export function baseline(){
  const post=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/architecture-post.json')));
  const correction=JSON.parse(fs.readFileSync(path.join(repo,'tests/evidence/r04/design-r1/correction-proposal-final.json')));
  const raw=fs.readFileSync(path.join(repo,'tests/evidence/local-portability/pilot-amendment-r2.json'));
  assert.equal(digest(raw),'042a91e6838e8c007303ee30919c04ca0c9513ebc45ca10a10bb26261d906b17');
  const amendment=JSON.parse(raw);
  for(const [file,sha] of Object.entries(amendment.sources))assert.equal(digest(fs.readFileSync(path.join(repo,file))),sha);
  const files={};
  for(const [file,original] of Object.entries(post.files)){
    assert.ok(file.startsWith('docs/')&&!file.split('/').includes('..'));
    const entry=amendment.files[file]?.after??correction.targets[file]??original;
    const bytes=Buffer.from(entry.base64,'base64');
    assert.equal(digest(bytes),amendment.allAfterHashes[file],file);
    files[file]=bytes;
  }
  assert.equal(Object.keys(files).length,15);return files;
}
export function readTree(root){
  const files={};
  function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,e.name);assert.ok(!e.isSymbolicLink(),full);
    if(e.isDirectory())walk(full);else files[path.relative(root,full).split(path.sep).join('/')]=fs.readFileSync(full);
  }}walk(root);return files;
}
export function sourceCases(){
  const files=baseline(),cases=[];
  const businessGroups={P:'TC-01',R:'TC-02',I:'TC-03',C:'TC-02',D:'TC-06',E:'TC-07',T:'TC-16'};
  const mappings={
    QT:[13,3,2,13,7,14,12,12,9,9,6,14,19,19,19,19],
    'UX-T':[19,19,3,3,19,19,7,9,6,19,19,19,19,12,5],
    'OP-T':[14,14,14,14,14,14,14,14,14,14,9,14,14,14,11],
    'AD-T':[6,5,1,2,2,5,5,5,9,4,4,9,5,19,12],
    'AR-T':[6,2,2,4,5,5,5,4,7,13,9,19,11,12,14,14,13,15,3,7,10,8]
  };
  for(const file of ['docs/business/tests.md','docs/design/experience.md','docs/design/operations.md','docs/design/admin.md','docs/design/architecture.md']){
    let anchor='';
    for(const line of files[file].toString().split(/\r?\n/)){
      const a=/<a id="([^"]+)"/.exec(line);if(a)anchor=a[1];
      const m=/^\| ((?:[PRICDET]|UX-T|OP-T|AD-T|AR-T)\d{2}) \|/.exec(line);if(!m)continue;
      const id=m[1],prefix=id.replace(/\d+$/,''),n=Number(id.slice(-2));
      const group=businessGroups[prefix]??'TC-'+String(mappings[prefix][n-1]).padStart(2,'0');
      cases.push({id,file,anchor,group,sourceRow:line});
    }
  }
  for(let i=1;i<=16;i++)cases.push({id:'QT'+String(i).padStart(2,'0'),file:'docs/design/quality.md',
    anchor:i<=3?'response':i<=6?'freshness':i<=8?'recovery':i<=11?'privacy':i===12?'resources':'client-seo',group:'TC-'+String(mappings.QT[i-1]).padStart(2,'0')});
  assert.equal(cases.length,137);assert.equal(new Set(cases.map(c=>c.id)).size,137);return cases;
}
export const appendices={
  'docs/design/architecture.md':'\n\n<a id="r05-engineering"></a>\n## R05 — Quy tắc và cách kiểm, bản đề xuất\n\n[Quy tắc chung và bốn profile](../engineering/rules.md#contract) · [Đặc tả kiểm kỹ thuật](../engineering/tests.md#protocol). Phần R05 đang chờ duyệt nội dung; nguồn kiến trúc phía trên giữ nguyên byte, không là build hoặc kết quả runtime.\n',
  'docs/business/tests.md':'\n\n<a id="r05-engineering"></a>\n## R05 — Nơi cụ thể hóa kiểm kỹ thuật\n\n[Đặc tả kỹ thuật và đối chiếu từng case](../engineering/tests.md#coverage). Giữ toàn bộ input/expected/biến thể nguồn phía trên; R05 chỉ thêm cách kiểm và bằng chứng, mọi ca ứng dụng vẫn NOT_RUN.\n'
};
