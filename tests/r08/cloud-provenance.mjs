// Read-only provenance of the privately stored cloud payload. No secret values.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {hash} from './product-build-r1/verify.mjs';import {inventory} from './delivery-inputs-r1.mjs';
const repo=path.resolve(import.meta.dirname,'../..');process.chdir(repo);
const read=p=>JSON.parse(fs.readFileSync(p));const base='.test-output/r08-cloud-r1',p=base+'/payload';
const a=read('tests/evidence/r08/delivery-inputs-r1.json'),m=read('tests/r08/cloud-r1/manifest.json');
for(const [name,expected] of Object.entries(m.bundles))assert.equal(hash(base+'/'+name),expected,name);
assert.equal(hash(p+'/backend'),a.backend.sha256);assert.equal(hash(p+'/caddy'),a.caddy.sha256);
assert.equal(hash(p+'/Caddyfile'),hash('.test-output/r08-product-inputs-r1/source/Caddyfile'));
assert.equal(hash(p+'/database'),hash('.test-output/r08-b2-c631566a19/tools/database'));
assert.deepEqual(inventory(p+'/web/build'),a.web.build);assert.deepEqual(inventory(p+'/web/node_modules'),a.web.dependencies);
assert.equal(hash(p+'/web/package.json'),a.web.package);assert.equal(hash(p+'/web/package-lock.json'),a.web.lock);
for(const name of ['observer.mjs','backup-server.mjs'])assert.equal(hash(p+'/'+name),m.files[name]);
const identity=read('tests/evidence/r08/b2-execution-r1/cloud-image-identity.json');assert.equal(fs.readFileSync(p+'/image-id','utf8').trim(),identity.classicDockerConfigID);
console.log(JSON.stringify({at:new Date().toISOString(),pass:true,bundles:m.bundles,backend:hash(p+'/backend'),caddy:hash(p+'/caddy'),databaseHelper:hash(p+'/database'),webBuildFiles:Object.keys(a.web.build).length,webDependencyEntries:Object.keys(a.web.dependencies).length,package:a.web.package,lock:a.web.lock,observer:m.files['observer.mjs'],backupServer:m.files['backup-server.mjs'],image:identity.classicDockerConfigID,scope:'payload bytes match B1/B2 and frozen cloud scripts; private CA/session/SSH material not emitted'},null,2));
