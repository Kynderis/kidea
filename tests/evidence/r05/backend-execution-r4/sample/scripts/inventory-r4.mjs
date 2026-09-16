import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const skip=new Set(['node_modules','.npm-cache','.cache','.svelte-kit','build','test-results','playwright-report']);
function files(dir,prefix=''){
 const result=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(skip.has(e.name))continue;const rel=prefix+e.name;
  if(e.isDirectory())result.push(...files(path.join(dir,e.name),rel+'/'));else if(e.isFile())result.push(rel);
 }return result.sort();
}
const web={};
for(const f of files('/src/web')){assert.equal(sha('/src/web/'+f),sha('/work/'+f),'Web volume source differs: '+f);web[f]=sha('/work/'+f);}
function bytes(dir){let n=0;for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())n+=bytes(f);else if(e.isFile())n+=fs.statSync(f).size;}return n;}
const binaries={};for(const preset of ['dev','asan-ubsan','tsan','release'])binaries[preset]={backend:sha('/build/'+preset+'/backend'),tests:sha('/build/'+preset+'/domain_tests')};
binaries.caddy=sha('/go/caddy');
const receipt={at:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,webVolumeMatchesHostSource:web,binaries,logicalCacheBytes:{goModuleDownloads:bytes('/go/modcache/cache/download'),npm:bytes('/work/.npm-cache'),pinnedDownloads:bytes('/src/downloads')},note:'Cache sizes are logical artifact footprints, not exact wire-byte measurements; browser image pull receipts and previous source/image receipts remain authoritative.'};
fs.writeFileSync('/out/runtime-inventory.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({webFiles:Object.keys(web).length,binaries:Object.keys(binaries),logicalCacheBytes:receipt.logicalCacheBytes}));
