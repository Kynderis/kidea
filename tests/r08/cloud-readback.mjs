// Runs inside the already-deployed backend container; read-only HTTPS smoke.
import https from 'node:https';import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const ca=fs.readFileSync('/payload/config/root.crt');
for(const path of ['/','/api/health']){
 const result=await new Promise((resolve,reject)=>{
  const req=https.get({host:'caddy',port:8443,servername:'localhost',ca,path,headers:{host:'localhost:8443'}},res=>{const chunks=[];res.on('data',d=>chunks.push(d));res.on('end',()=>resolve({status:res.statusCode,body:Buffer.concat(chunks),headers:res.headers}));});
  const timer=setTimeout(()=>req.destroy(Error('TOTAL_TIMEOUT')),5000);req.on('close',()=>clearTimeout(timer));req.on('error',reject);
 });
 assert.equal(result.status,200,path);assert.match(result.headers['x-robots-tag'],/noindex/);
 if(path==='/')assert.match(result.body.toString(),/<html/i);
 console.log(JSON.stringify({path,status:result.status,noindex:result.headers['x-robots-tag'],bytes:result.body.length,sha256:createHash('sha256').update(result.body).digest('hex')}));
}
