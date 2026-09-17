// Read-only verification of historical evidence, live pilot and B1 artifacts.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {hash,verify} from './product-build-r1/verify.mjs';
import {inventory} from './delivery-inputs-r1.mjs';
const repo=path.resolve(import.meta.dirname,'../..');process.chdir(repo);
const read=p=>JSON.parse(fs.readFileSync(p));
function check(root,files){for(const [p,sha] of Object.entries(files))assert.equal(hash(path.join(root,p)),sha,p);return Object.keys(files).length;}
const r05=check(repo,read('tests/evidence/r05/web-scope-r1/historical-hashes.json'));
const r07=check('tests/evidence/r07/implementation-r1',read('tests/evidence/r07/implementation-r1/receipt.json').payload);
const pilotRoot=path.resolve(repo,'../kidea-workshop-pilot');
const pilot=check(pilotRoot,Object.fromEntries(Object.entries(read('tests/evidence/r05/web-scope-r1/manifest.json').files).map(([p,v])=>[p,v.after])));
assert.equal(fs.existsSync(path.join(pilotRoot,'.kidea')),false);
const inputs=read('tests/r08/product-build-r1/inputs.json');verify('.test-output/r08-product-inputs-r1/source',inputs.files);
const artifact=read('tests/evidence/r08/delivery-inputs-r1.json');
for(const k of ['backend','caddy'])assert.equal(hash(artifact[k].path),artifact[k].sha256);
assert.deepEqual(inventory(artifact.web.root+'/build'),artifact.web.build);
assert.deepEqual(inventory(artifact.web.root+'/node_modules'),artifact.web.dependencies);
assert.equal(hash(artifact.web.root+'/package.json'),artifact.web.package);
assert.equal(hash(artifact.web.root+'/package-lock.json'),artifact.web.lock);
const ids=execFileSync('docker',['ps','-aq','--filter','name=kidea-r08-'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const containers=ids.length?JSON.parse(execFileSync('docker',['inspect',...ids],{encoding:'utf8',maxBuffer:32*1024**2})):[];
for(const c of containers)assert.equal(c.State.Running,false,c.Name);
console.log(JSON.stringify({at:new Date().toISOString(),pass:true,head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),historicalR05:r05,historicalR07:r07,pilot,sourceFiles:Object.keys(inputs.files).length,webBuild:Object.keys(artifact.web.build).length,webDependencies:Object.keys(artifact.web.dependencies).length,backend:artifact.backend.sha256,caddy:artifact.caddy.sha256,containers:containers.map(c=>({name:c.Name,state:c.State.Status,exit:c.State.ExitCode})),scope:'preservation and local resource readback; not cloud or product acceptance'},null,2));
