import test from 'node:test';import assert from 'node:assert/strict';import https from 'node:https';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {Runtime}from '../src/runtime.mjs';import {requestJSON}from '../src/http.mjs';import{createServer,cookieVerifier}from '../src/server.mjs';
import{certificate}from './tls-fixture.mjs';import{config,time,ingest}from './fixtures.mjs';
const tls=certificate(),token='A'.repeat(48),participant='P'.repeat(48);
const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve('https://127.0.0.1:'+server.address().port)));
const close=server=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve);});
function request(url,options={}){return new Promise((resolve,reject)=>{
 const req=https.request(url,{ca:tls.cert,...options},res=>{const chunks=[];res.on('data',d=>chunks.push(d));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks).toString()}));});
 req.on('error',reject);req.end();
});}
test('OP-T11/14:actual TLS SSR/API/fallback forbid guest/participant/forged/expired/revoked and any mutation',async()=>{
 const sessions=[{token,role:'admin',expiresAtMs:Date.now()+60000},{token:participant,role:'participant',expiresAtMs:Date.now()+60000}];
 const d=fs.mkdtempSync(path.join(os.tmpdir(),'observer-http-')),runtime=new Runtime(config(),d,()=>time(0));
 runtime.update(o=>ingest(o,'fast',1,0,{M2:{open:[{code:'INVARIANT',count:1}],resolved:[]}}));
 const server=createServer(runtime,tls,cookieVerifier(()=>sessions)),base=await listen(server);
 try{
  for(const route of ['/operations','/api/observation','/health/observer']){
   for(const headers of [{},{cookie:'__Host-workshop_observer='+participant}, {cookie:'__Host-workshop_observer='+'F'.repeat(48),'x-role':'admin'},
    {cookie:'__Host-workshop_observer='+token+'; __Host-workshop_observer='+token}]){
     const r=await request(base+route,{headers});assert.equal(r.status,403);assert.ok(!r.body.includes('INVARIANT'));
   }
  }
  const headers={cookie:'__Host-workshop_observer='+token};const html=await request(base+'/operations',{headers});
  assert.equal(html.status,200);assert.match(html.body,/INVARIANT/);assert.match(html.headers['cache-control'],/no-store/);
  assert.match(html.headers['x-robots-tag'],/noindex/);assert.ok(!html.body.includes(token));
  assert.equal((await request(base+'/api/observation',{headers})).status,200);
  assert.equal((await request(base+'/api/observation',{headers,method:'POST'})).status,405);
  assert.equal((await request(base+'/replay',{headers})).status,404);
  const cookieBefore=JSON.stringify(sessions);await request(base+'/api/observation',{headers});assert.equal(JSON.stringify(sessions),cookieBefore);
  sessions[0].expiresAtMs=0;assert.equal((await request(base+'/operations',{headers})).status,403);
  sessions.length=0;assert.equal((await request(base+'/api/observation',{headers})).status,403);
 }finally{await close(server);runtime.close();}
});
test('TLS verifier refuses missing CA and wrong target, never disables verification',async()=>{
 const server=https.createServer(tls,(_req,res)=>{res.setHeader('content-type','application/json');res.end('{}');});const base=await listen(server);
 try{await assert.rejects(requestJSON({url:base}));await assert.rejects(requestJSON({url:'http://127.0.0.1',ca:tls.cert}),/TARGET/);
 await assert.rejects(requestJSON({url:'https://user:secret@127.0.0.1',ca:tls.cert}),/TARGET/);
 assert.deepEqual(await requestJSON({url:base,ca:tls.cert}),{});}finally{await close(server);}
});
test('Collector HTTP200 is not fresh proof: invalid JSON/schema/content/status/redirect/oversize/timeout reject',async()=>{
 let mode='ok';const seen=[];const server=https.createServer(tls,(req,res)=>{
  seen.push({method:req.method,nonce:req.headers['x-observer-nonce']});res.setHeader('content-type',mode==='content'?'text/html':'application/json');
  if(mode==='timeout')return;if(mode==='status')res.statusCode=403;if(mode==='redirect'){res.statusCode=302;res.setHeader('location','https://secret.example');}
  res.end(mode==='oversize'?'x'.repeat(65537):mode==='json'?'BROKEN':'{}');
 });const base=await listen(server);
 try{for(const m of ['json','content','status','redirect','oversize','timeout']){mode=m;
  await assert.rejects(requestJSON({url:base,ca:tls.cert},{nonce:'nonce1',timeoutMs:100}));}
  mode='ok';assert.deepEqual(await requestJSON({url:base,ca:tls.cert},{nonce:'nonce2'}),{});
  assert.ok(seen.every(r=>r.method==='GET'));assert.equal(seen.at(-1).nonce,'nonce2');
 }finally{await close(server);}
});
test('State write failure returns503 and preserves known critical; bad session store returns403 without data',async()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),'observer-http-fail-')),runtime=new Runtime(config(),d,()=>time(0));
 runtime.update(o=>ingest(o,'fast',1,0,{M2:{open:[{code:'INVARIANT',count:1}],resolved:[]}}));let broken=false;
 const server=createServer(runtime,tls,cookieVerifier(()=>{if(broken)throw Error('secret-file');return[{token,role:'admin',expiresAtMs:Date.now()+60000}];}));const base=await listen(server),headers={cookie:'__Host-workshop_observer='+token};
 try{runtime.store.save=()=>{throw Error('NO_SPACE');};const r=await request(base+'/api/observation',{headers});
 assert.equal(r.status,503);const v=JSON.parse(r.body);assert.equal(v.conclusion,'CRITICAL');assert.equal(v.eligibility.writeReady,false);
 broken=true;const denied=await request(base+'/operations',{headers});assert.equal(denied.status,403);assert.equal(denied.body,'');
 }finally{await close(server);runtime.close();}
});
