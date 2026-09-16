import fs from 'node:fs';
import https from 'node:https';
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
const ca=fs.readFileSync('/fixtures/root.crt');
const {sessions}=JSON.parse(fs.readFileSync('/secrets/sessions.json'));
const [a,b,viewer,expired]=sessions;
const origin='https://localhost:8443';
const cookie=s=>'__Host-kidea_session='+s.token;
function request(url='/api/health',options={}){
 return new Promise((resolve,reject)=>{
  const req=https.request({hostname:'caddy',port:8443,servername:options.servername||'localhost',ca:options.noCA?undefined:ca,path:url,method:options.method||'GET',headers:{host:'localhost:8443',...(options.headers||{})}},res=>{
   const chunks=[];res.on('data',d=>chunks.push(d));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks).toString()}));
  });
  req.setTimeout(5000,()=>req.destroy(new Error('timeout')));req.on('error',reject);
  if(options.chunked&&options.body){req.write(options.body.slice(0,100));req.end(options.body.slice(100));}else req.end(options.body);
 });
}
const auth=s=>({cookie:cookie(s)});
function socketHandshake(s,extra={}) {
 return new Promise((resolve,reject)=>{
  const req=https.request({hostname:'caddy',port:8443,servername:'localhost',ca,path:'/api/ws',headers:{host:'localhost:8443',connection:'Upgrade',upgrade:'websocket','sec-websocket-version':'13','sec-websocket-key':randomBytes(16).toString('base64'),origin,cookie:cookie(s),'sec-websocket-protocol':'kidea.v1, kidea.csrf.'+s.csrf,...extra}});
  req.setTimeout(5000,()=>req.destroy(new Error('websocket timeout')));req.on('error',reject);
  req.on('response',res=>{res.resume();resolve({status:res.statusCode})});
  req.on('upgrade',(res,socket,head)=>resolve({status:res.statusCode,socket,head}));req.end();
 });
}
const mutate=(s=a,extra={})=>({method:'POST',headers:{...auth(s),origin,'x-csrf-token':s.csrf,'content-type':'application/json',...(extra.headers||{})},body:extra.body||JSON.stringify({id:randomUUID(),value:'Valid text',version:'1'})});
let passed=0;
async function check(name,fn){await fn();passed++;console.log(name+' PASS');}
await check('trusted TLS and ready backend',async()=>assert.equal((await request()).status,200));
await check('missing CA rejected',async()=>{await assert.rejects(request('/api/health',{noCA:true}),/certificate|issuer|self.signed/i);});
await check('wrong hostname rejected',async()=>{await assert.rejects(request('/api/health',{servername:'wrong.test'}),/certificate|hostname|alert|TLS|SSL/i);});
for(const name of ['Forwarded','X-Forwarded-Host','X-Forwarded-Proto','X-Forwarded-For'])await check('reject forged '+name,async()=>assert.equal((await request('/api/health',{headers:{[name]:'forged'}})).status,400));
await check('unauthenticated denied',async()=>assert.equal((await request('/api/session')).status,401));
await check('expired denied',async()=>assert.equal((await request('/api/session',{headers:auth(expired)})).status,401));
await check('actor determined by session',async()=>{const r=await request('/api/session',{headers:{...auth(a),'X-Actor':'B','X-Role':'admin'}});assert.equal(r.status,200);assert.ok(JSON.parse(r.body).actor===a.actor);});
await check('viewer cannot mutate',async()=>assert.equal((await request('/api/write',mutate(viewer,{headers:{'X-Role':'admin'}}))).status,403));
const counts=async()=>{const r=await request('/api/counts',{headers:auth(a)});assert.equal(r.status,200);return JSON.parse(r.body);};
const before=await counts();
for(const [name,changes]of [['missing origin',{origin:''}],['null origin',{origin:'null'}],['foreign origin',{origin:'https://attacker.test'}],['missing token',{'x-csrf-token':''}],['wrong token',{'x-csrf-token':'wrong'}],['other session token',{'x-csrf-token':b.csrf}]])await check(name+' mutation denied',async()=>assert.equal((await request('/api/write',mutate(a,{headers:changes}))).status,403));
await check('query token denied',async()=>assert.equal((await request('/api/write?token=not-a-secret',mutate())).status,403));
await check('denials preserve all four tables',async()=>assert.deepEqual(await counts(),before));
await check('valid write commits all four tables',async()=>{assert.equal((await request('/api/write',mutate())).status,200);const after=await counts();for(const k of ['domain','result','audit','outbox'])assert.equal(after[k],before[k]+1);});
await check('session cookie scope',async()=>{const r=await request('/api/refresh',mutate());assert.equal(r.status,200);const c=r.headers['set-cookie']?.[0]||'';for(const v of ['Path=/','Secure','HttpOnly','SameSite=Strict'])assert.ok(c.includes(v));assert.ok(!/domain=/i.test(c));});
for(const bytes of [131071,131072,131073])for(const chunked of [false,true])await check(`body ${bytes} ${chunked?'chunked':'length'}`,async()=>{const o=mutate(a,{body:'x'.repeat(bytes)});o.chunked=chunked;if(!chunked)o.headers['content-length']=bytes;const r=await request('/api/echo',o);assert.equal(r.status,bytes>131072?413:200);if(bytes<=131072)assert.equal(JSON.parse(r.body).bytes,bytes);});
await check('parallel SSR isolation',async()=>{const rs=await Promise.all(Array.from({length:8},(_,i)=>request('/secure',{headers:auth(i%2?b:a)})));for(let i=0;i<rs.length;i++){const own=i%2?b:a,other=i%2?a:b;assert.equal(rs[i].status,200);assert.ok(rs[i].body.includes('private-'+own.actor));assert.ok(!rs[i].body.includes('private-'+other.actor));assert.equal(rs[i].headers['cache-control'],'no-store');}});
await check('public HTML contains no private sentinel',async()=>{const r=await request('/');assert.equal(r.status,200);assert.ok(!r.body.includes('private-A')&&!r.body.includes('private-B'));assert.ok(r.headers['x-robots-tag']?.includes('noindex'));});
for(const [name,headers]of [['alien origin',{origin:'https://attacker.test'}],['missing session',{cookie:''}],['wrong proof',{'sec-websocket-protocol':'kidea.v1, kidea.csrf.wrong'}]])await check('socket denies '+name,async()=>{const r=await socketHandshake(a,headers);r.socket?.destroy();assert.equal(r.status,403);});
await check('socket authorization and revoke before next event',async()=>{
 const r=await socketHandshake(b);assert.equal(r.status,101);
 let buffer=r.head||Buffer.alloc(0),revoked=false,leaked=false,sawPrivate=false;
 let closed;const closeFrame=new Promise(resolve=>{closed=resolve});
 const parse=()=>{while(buffer.length>=2){let n=buffer[1]&127,offset=2;if(n===126){if(buffer.length<4)return;n=buffer.readUInt16BE(2);offset=4;}if(n===127)throw Error('oversize websocket frame');if(buffer.length<offset+n)return;const opcode=buffer[0]&15;const body=buffer.subarray(offset,offset+n);buffer=buffer.subarray(offset+n);if(opcode===1){sawPrivate=true;if(revoked)leaked=true;assert.ok(body.toString().includes('private-'+b.actor));}if(opcode===8)closed();}};
 r.socket.on('data',data=>{buffer=Buffer.concat([buffer,data]);parse()});parse();
 try {
  for(let i=0;i<30&&!sawPrivate;i++)await new Promise(resolve=>setTimeout(resolve,50));
  assert.ok(sawPrivate,'authorized socket received no private event');
  const logout=await request('/api/logout',mutate(b));assert.equal(logout.status,200);revoked=true;
  const c=logout.headers['set-cookie']?.[0]||'';for(const v of ['Path=/','Secure','HttpOnly','SameSite=Strict','Max-Age=0'])assert.ok(c.includes(v));
  let timer;try{await Promise.race([closeFrame,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('revoked socket not closed')),3000)})]);}finally{clearTimeout(timer)}
  assert.ok(!leaked,'revoked socket emitted a private event');assert.equal((await request('/api/session',{headers:auth(b)})).status,401);
 } finally {r.socket.destroy()}
});
console.log(JSON.stringify({passed,failed:0,scope:'Node HTTPS subset; no browser or complete matrix claim'}));
