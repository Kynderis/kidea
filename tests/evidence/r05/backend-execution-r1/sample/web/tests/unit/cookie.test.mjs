import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const kitRequire=createRequire(require.resolve('@sveltejs/kit/package.json'));
const cookie=kitRequire('cookie');
test('cookie override serializes and parses valid session',()=>{const header=cookie.serialize('lab_actor','U',{path:'/',domain:'example.test',httpOnly:true,secure:true,sameSite:'strict'});assert.match(header,/HttpOnly/);assert.match(header,/Secure/);assert.match(header,/SameSite=Strict/);assert.match(header,/Domain=example.test/);assert.equal(cookie.parse(header).lab_actor,'U');});
test('cookie rejects adversarial name/path/domain',()=>{for(const name of ['bad;name','x=y'])assert.throws(()=>cookie.serialize(name,'U'));assert.throws(()=>cookie.serialize('lab_actor','U',{path:'/; Secure'}));assert.throws(()=>cookie.serialize('lab_actor','U',{domain:'example.test; Secure'}));});
test('cookie expiration and actor replacement',()=>{const a=cookie.serialize('lab_actor','U',{path:'/'});const b=cookie.serialize('lab_actor','V',{path:'/'});assert.equal(cookie.parse(a).lab_actor,'U');assert.equal(cookie.parse(b).lab_actor,'V');assert.match(cookie.serialize('lab_actor','',{path:'/',maxAge:0}),/Max-Age=0/);});
