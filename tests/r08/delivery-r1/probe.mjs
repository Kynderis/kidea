import fs from 'node:fs';
import https from 'node:https';
import assert from 'node:assert/strict';
const [action,...args]=process.argv.slice(2);
const {sessions:[admin,,viewer]}=JSON.parse(fs.readFileSync('/secrets/sessions.json'));
const ca=fs.readFileSync('/fixtures/root.crt');
function request(url,actor=admin,body){return new Promise((resolve,reject)=>{
 const req=https.request({host:'caddy',port:8443,servername:'localhost',ca,path:url,method:body?'POST':'GET',headers:{host:'localhost:8443',cookie:'__Host-kidea_session='+actor.token,origin:'https://localhost:8443','x-csrf-token':actor.csrf,'content-type':'application/json'}},res=>{let text='';res.on('data',b=>text+=b);res.on('end',()=>resolve({status:res.statusCode,text}));});req.setTimeout(5000,()=>req.destroy(Error('TIMEOUT')));req.on('error',reject);req.end(body&&JSON.stringify(body));
});}
if(action==='ready'){for(let i=0;i<50;i++){try{const r=await request('/api/health');assert.equal(r.status,200);console.log('READY');process.exit(0);}catch{await new Promise(r=>setTimeout(r,100));}}throw Error('NOT_READY');}
if(action==='counts'){const r=await request('/api/counts');assert.equal(r.status,200);console.log(r.text);}
if(['write','denied','lost-reply'].includes(action)){const r=await request('/api/write',action==='denied'?viewer:admin,{id:args[0],value:'R08 durable intent',version:'1'});assert.equal(r.status,action==='denied'?403:200);if(action==='lost-reply')process.exit(23);console.log(r.text);}
if(action==='result'){const r=await request('/api/result?id='+encodeURIComponent(args[0]));assert.equal(r.status,200);assert.equal(JSON.parse(r.text).status,'SUCCESS');console.log('COMMITTED_DO_NOT_REPLAY');}
if(action==='partial'){assert.equal((await request('/api/health')).status,200);assert.equal((await request('/')).status,502);console.log('PARTIAL_NOT_VERIFIED');}
if(action==='post-restore'){const a=await request('/api/session');assert.equal(a.status,200);assert.equal(JSON.parse(a.text).actor,admin.actor);const r=await request('/api/write',viewer,{id:'restore-role-denial',value:'denied',version:'1'});assert.equal(r.status,403);console.log('RESTORE_AUTH_PASS');}
