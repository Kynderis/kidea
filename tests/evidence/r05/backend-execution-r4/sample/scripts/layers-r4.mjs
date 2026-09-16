import http from 'node:http';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {sessions:[a]}=JSON.parse(fs.readFileSync('/secrets/sessions.json'));
function request(host,port,path,headers,body,chunked=false){return new Promise((resolve,reject)=>{
 const req=http.request({host,port,path,method:body===undefined?'GET':'POST',headers},res=>{let text='';res.on('data',d=>text+=d);res.on('end',()=>resolve({status:res.statusCode,text}));});
 req.on('error',reject);req.setTimeout(5000,()=>req.destroy(Error('timeout')));
 if(chunked){req.write(body.slice(0,100));req.end(body.slice(100));}else req.end(body);
});}
const auth={host:'localhost:8443',cookie:'__Host-kidea_session='+a.token,origin:'https://localhost:8443','x-csrf-token':a.csrf};
const before=JSON.parse((await request('backend',8080,'/api/counts',auth)).text);
let passed=0;
for(const [host,port,extra] of [['backend',8080,{}],['web',4173,{'x-forwarded-host':'localhost:8443','x-forwarded-proto':'https'}]]){
 for(const bytes of [131071,131072,131073])for(const chunked of [false,true]){
  const headers={...auth,...extra,'content-type':'application/octet-stream'};if(!chunked)headers['content-length']=bytes;
  const r=await request(host,port,'/api/echo',headers,'x'.repeat(bytes),chunked);
  assert.equal(r.status,bytes>131072?413:200,host+' body boundary');
  if(bytes<=131072)assert.equal(JSON.parse(r.text).bytes,bytes);
  console.log(`${host} ${bytes} ${chunked?'chunked':'length'} PASS`);++passed;
 }
}
assert.deepEqual(JSON.parse((await request('backend',8080,'/api/counts',auth)).text),before);
for(const headers of [{host:'localhost:8443'},{...auth,origin:''},{...auth,'x-csrf-token':''}]){
 const r=await request('backend',8080,'/api/write',headers,JSON.stringify({id:'direct-forgery',value:'safe',version:'1'}));
 assert.ok([401,403].includes(r.status));++passed;
}
assert.deepEqual(JSON.parse((await request('backend',8080,'/api/counts',auth)).text),before);
console.log(JSON.stringify({passed,failed:0,scope:'Independent upstream body boundaries and direct authorization; all four table counts unchanged'}));
