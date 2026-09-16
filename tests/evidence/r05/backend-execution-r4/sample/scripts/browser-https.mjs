import fs from 'node:fs';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('/work/package.json');
const {chromium}=require('playwright');
const {sessions:[a,b,viewer]}=JSON.parse(fs.readFileSync('/secrets/sessions.json'));
const base='https://localhost:8443';
const browser=await chromium.launch({headless:true});
let passed=0;
const check=async(name,fn)=>{await fn();++passed;console.log(name+' PASS');};
async function context(s){
 const c=await browser.newContext();
 await c.addCookies([{name:'__Host-kidea_session',value:s.token,url:base+'/',httpOnly:true,secure:true,sameSite:'Strict'}]);
 return c;
}
const ca=await context(a),cb=await context(b),cv=await context(viewer);
const pa=await ca.newPage(),pb=await cb.newPage(),pv=await cv.newPage();
const post=(page,path,csrf,body={})=>page.evaluate(async({path,csrf,body})=>{const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json','x-csrf-token':csrf},body:JSON.stringify(body)});return {status:r.status,text:await r.text()};},{path,csrf,body});
const counts=()=>pa.evaluate(async()=>{const r=await fetch('/api/counts');if(r.status!==200)throw Error('counts denied');return r.json();});
const attacker=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>isolated attacker</title><iframe name="sink"></iframe>');});
try {
 await check('trusted Chromium HTTPS and isolated SSR actors',async()=>{
  const [ra,rb]=await Promise.all([pa.goto(base+'/secure'),pb.goto(base+'/secure')]);
  assert.equal(ra.status(),200);assert.equal(rb.status(),200);
  const [ha,hb]=await Promise.all([pa.content(),pb.content()]);
  assert.ok(ha.includes('private-'+a.actor)&&!ha.includes('private-'+b.actor));
  assert.ok(hb.includes('private-'+b.actor)&&!hb.includes('private-'+a.actor));
  assert.equal(ra.headers()['cache-control'],'no-store');
 });
 await check('real server cookie refresh remains HttpOnly Secure Strict host-only',async()=>{
  assert.equal((await post(pa,'/api/refresh',a.csrf)).status,200);
  const cookies=await ca.cookies(base);const c=cookies.find(c=>c.name==='__Host-kidea_session');
  assert.ok(c&&c.httpOnly&&c.secure&&c.sameSite==='Strict'&&c.domain==='localhost'&&c.path==='/');
  assert.equal(await pa.evaluate(()=>document.cookie.includes('__Host-kidea_session')),false);
  assert.equal(await pa.evaluate(async()=>{const r=await fetch('/api/session');return (await r.json()).actor;}),a.actor);
 });
 await check('browser role cookie and localStorage cannot grant authority',async()=>{
  await pv.goto(base+'/secure');
  await pv.evaluate(()=>{localStorage.setItem('role','admin');document.cookie='role=admin; Path=/; Secure';});
  assert.equal((await post(pv,'/api/write',viewer.csrf,{id:'browser-forged-role',value:'safe',version:'1'})).status,403);
 });
 await check('cookie override real HTTPS create read replace delete',async()=>{
  for(const actor of ['U','V']){
   assert.equal((await post(pa,'/cookie',a.csrf,{actor})).status,200);
   const c=(await ca.cookies(base)).find(c=>c.name==='lab_actor');
   assert.ok(c&&c.httpOnly&&c.secure&&c.sameSite==='Strict'&&c.path==='/'&&c.domain==='localhost');
   assert.equal(await pa.evaluate(()=>document.cookie.includes('lab_actor')),false);
   assert.equal(await pa.evaluate(async()=> (await (await fetch('/cookie')).json()).actor),actor);
  }
  assert.equal(await pa.evaluate(async()=> (await fetch('/cookie',{method:'DELETE'})).status),200);
  assert.ok(!(await ca.cookies(base)).some(c=>c.name==='lab_actor'));
  assert.equal(await pa.evaluate(async()=> (await (await fetch('/cookie')).json()).actor),null);
 });
 const before=await counts();
 await new Promise(resolve=>attacker.listen(8787,'127.0.0.1',resolve));
 const attack=await ca.newPage();
 await attack.goto('http://127.0.0.1:8787');
 await check('cross-origin form reaches denial without side effects',async()=>{
  const response=attack.waitForResponse(r=>r.url()===base+'/api/write');
  await attack.evaluate(base=>{const f=document.createElement('form');f.action=base+'/api/write';f.method='POST';f.target='sink';const i=document.createElement('input');i.name='value';i.value='attacker';f.append(i);document.body.append(f);f.submit();},base);
  assert.ok([401,403].includes((await response).status()));
  assert.deepEqual(await counts(),before);
 });
 await check('cross-origin credentialed fetch has no permissive CORS',async()=>{
  const result=await attack.evaluate(async base=>{try {await fetch(base+'/api/write',{method:'POST',credentials:'include',headers:{'content-type':'application/json'},body:JSON.stringify({id:'attacker-fetch',value:'text',version:'1'})});return 'readable';}catch{return 'blocked';}},base);
  assert.equal(result,'blocked');assert.deepEqual(await counts(),before);
 });
 await check('query proof cannot authorize a browser mutation',async()=>{
  assert.equal((await post(pa,'/api/write?token=not-a-secret',a.csrf,{id:'query-proof',value:'safe',version:'1'})).status,403);
  assert.deepEqual(await counts(),before);
 });
 await check('cookie deletion uses matching scope and revoked session denied',async()=>{
  assert.equal((await post(pb,'/api/logout',b.csrf)).status,200);
  assert.ok(!(await cb.cookies(base)).some(c=>c.name==='__Host-kidea_session'));
  assert.equal(await pb.evaluate(async()=> (await fetch('/api/session')).status),401);
 });
 console.log(JSON.stringify({passed,failed:0,scope:'Real Chromium HTTPS with isolated NSS trust; no TLS bypass'}));
} finally {await browser.close();attacker.close();}
