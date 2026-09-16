import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const target=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1');
if(fs.existsSync(target))throw Error('CREATE-only target already exists');
fs.mkdirSync(target);
for(const d of ['scripts','receipts','vendor','downloads','cpp','tests','web'])fs.mkdirSync(path.join(target,d));
const fixture=path.join(root,'tests/r05/fixtures/backend-build-r1');
for(const f of fs.readdirSync(fixture))fs.copyFileSync(path.join(fixture,f),path.join(target,f));
const manifest=JSON.parse(fs.readFileSync(path.join(target,'manifest.json')));
for(const source of manifest.sourceArchives){
 const name=source.name==='sqlite'?'sqlite-bounded.zip':source.name+'.tar.gz';
 const original=path.join(root,'.test-output/r05/backend-plan-r1',name);
 const data=fs.readFileSync(original);
 if(crypto.createHash('sha256').update(data).digest('hex')!==source.sha256)throw Error('Source changed: '+name);
 fs.copyFileSync(original,path.join(target,'downloads',name));
}
const web=JSON.parse(fs.readFileSync(path.join(root,'tests/evidence/r05/web-execution-r2/manifest.json')));
for(const [name,hash] of Object.entries(web.sampleSource)){
 const original=path.resolve(root,'../kidea-workshop-pilot/samples/r05/web',name);
 if(crypto.createHash('sha256').update(fs.readFileSync(original)).digest('hex')!==hash)throw Error('Web R2 changed: '+name);
 fs.mkdirSync(path.dirname(path.join(target,'web',name)),{recursive:true});
 fs.copyFileSync(original,path.join(target,'web',name));
}
const args=JSON.parse(fs.readFileSync(path.join(target,'apt-install-args.json')));
fs.writeFileSync(path.join(target,'apt-packages.txt'),args.filter(x=>x.includes('=')).join('\n')+'\n');
fs.writeFileSync(path.join(target,'receipts','owner.json'),JSON.stringify({approval:'E2-BW-r1 after 74a2772',created:new Date().toISOString(),root:target},null,2)+'\n');
console.log(target);
