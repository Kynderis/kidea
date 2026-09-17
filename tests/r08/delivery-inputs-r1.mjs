// Preparation only: record actual successful B1 artifacts. No Docker/cloud mutation.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {hash,verify} from './product-build-r1/verify.mjs';

export function inventory(root) {
 const files={};
 function walk(relative='') {
  for(const entry of fs.readdirSync(path.join(root,relative),{withFileTypes:true})) {
   const name=path.posix.join(relative,entry.name),p=path.join(root,name);
   const st=fs.lstatSync(p);
   if(st.isSymbolicLink()) {
    const target=fs.readlinkSync(p),resolved=fs.realpathSync(p);
    assert.ok(!path.isAbsolute(target)&&resolved.startsWith(fs.realpathSync(root)+path.sep),'Artifact link escapes root');
    files[name]={link:target};
   } else if(st.isDirectory())walk(name);
   else {assert.ok(st.isFile(),'Nonregular artifact');files[name]={bytes:st.size,sha256:hash(p),executable:!!(st.mode&0o111)};}
  }
 }
 walk();return Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)));
}

export function prepare(repo) {
 const plan=path.join(repo,'tests/r08/product-build-r1');
 const manifest=JSON.parse(fs.readFileSync(path.join(plan,'manifest.json')));
 verify(plan,manifest.scripts,{packageManifest:true});
 const inputs=JSON.parse(fs.readFileSync(path.join(plan,'inputs.json')));
 verify(path.join(repo,'.test-output/r08-product-inputs-r1/source'),inputs.files);
 const build=path.join(repo,'.test-output/r08-product-build-r1');
 const summary=JSON.parse(fs.readFileSync(path.join(build,'summary.json')));
 assert.equal(summary.pass,true,'B1 must PASS before artifact selection');
 assert.equal(summary.stopped,true);
 assert.equal(summary.manifest,hash(path.join(plan,'manifest.json')));
 assert.deepEqual(summary.names,['cpp','web','browser'].map(s=>'kidea-r08-product-build-r1-'+s));
 const caddy=path.join(repo,'.test-output/r08-delivery-inputs-r1/caddy');
 assert.equal(hash(caddy),'07f440f3a7421623b3340aaf8e212b8c326579b7fc203b037e538fa3d99c7b1e');
 const backend=path.join(build,'build/release/backend');
 const checksums=fs.readFileSync(path.join(build,'logs/cpp-artifacts.sha256'),'utf8');
 assert.ok(checksums.split('\n').includes(hash(backend)+'  /build/release/backend'));
 const result={status:'PREPARED_INPUTS_ONLY',at:new Date().toISOString(),
  scope:'B2 artifact identity; no deploy, operations, cloud or acceptance claim',
  b1Manifest:summary.manifest,b1Summary:hash(path.join(build,'summary.json')),
  sourceInputs:hash(path.join(plan,'inputs.json')),toolchain:manifest.toolchain,browser:manifest.browser,
  backend:{path:backend,bytes:fs.statSync(backend).size,sha256:hash(backend)},
  web:{root:path.join(build,'work'),build:inventory(path.join(build,'work/build')),
   dependencies:inventory(path.join(build,'work/node_modules')),
   package:hash(path.join(build,'work/package.json')),lock:hash(path.join(build,'work/package-lock.json'))},
  caddy:{path:caddy,bytes:fs.statSync(caddy).size,sha256:hash(caddy),
   provenance:'tests/evidence/r05/backend-execution-r4/caddy-final.sha256'},
  remaining:['pin main/child/config and target','HTTPS/browser/drain integration','SQLite backup/restore and actual readback','independent jobs/observer/host exercise','final G2 and Human acceptance']};
 const output=path.join(repo,'tests/evidence/r08/delivery-inputs-r1.json');
 fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 return output;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(prepare(path.resolve(import.meta.dirname,'../..')));
