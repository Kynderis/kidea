import fs from 'node:fs';import https from 'node:https';import assert from 'node:assert/strict';import {spawn,execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const child=spawn(process.execPath,['/payload/backup-server.mjs'],{stdio:['ignore','pipe','inherit']});const exit=new Promise(r=>child.on('close',r));
const token=fs.readFileSync('/config/backup-token','utf8').trim(),ca=fs.readFileSync('/config/root.crt');
function request(auth,trust=true){return new Promise((resolve,reject)=>{const req=https.get({host:'127.0.0.1',port:9444,servername:'localhost',ca:trust?ca:undefined,path:'/backup',headers:{authorization:auth}},res=>{const chunks=[];res.on('data',b=>chunks.push(b));res.on('end',()=>resolve({status:res.statusCode,data:Buffer.concat(chunks),headers:res.headers}));});req.setTimeout(3000,()=>req.destroy(Error('TIMEOUT')));req.on('error',reject);});}
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('SERVER_START')),5000);child.stdout.on('data',d=>{if(d.toString().includes('BACKUP_READY')){clearTimeout(timer);resolve();}});});
 for(const auth of ['','Bearer bad',token,'Bearer '+'é'.repeat(64)])assert.equal((await request(auth)).status,403);
 await assert.rejects(request('Bearer '+token,false),/certificate|issuer|self.signed/i);
 const response=await request('Bearer '+token);assert.equal(response.status,200);assert.equal(createHash('sha256').update(response.data).digest('hex'),response.headers['x-backup-sha256']);
 const before=JSON.parse(execFileSync('/payload/database',['inspect','/data/sample.db'],{encoding:'utf8'}));assert.deepEqual(JSON.parse(response.headers['x-backup-info']),before);
 console.log('PASS: four authorization denials, TLS trust rejection, authenticated SQLite backup/hash/schema/counts');
}finally{child.kill('SIGTERM');await exit;}
