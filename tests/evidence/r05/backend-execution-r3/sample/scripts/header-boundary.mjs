import tls from 'node:tls';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const ca=fs.readFileSync('/fixtures/root.crt');
const requestLine='GET /api/health HTTP/1.1\r\n';
const before='Host: localhost:8443\r\nX-Padding: ';
const after='\r\nConnection: close\r\n\r\n';
let failed=0;
for(const [bytes,expected] of [[16383,200],[16385,431],[22000,431]]){
 const raw=requestLine+before+'x'.repeat(bytes-Buffer.byteLength(before+after))+after;
 try{
  const status=await new Promise((resolve,reject)=>{
   const socket=tls.connect({host:'caddy',port:8443,servername:'localhost',ca},()=>socket.write(raw));
   let response='';socket.setTimeout(5000,()=>socket.destroy(Error('header test timeout')));
   socket.on('data',chunk=>{response+=chunk.toString();const line=response.split('\r\n')[0];if(line.match(/^HTTP\/1\.[01] \d{3}/)){resolve(Number(line.split(' ')[1]));socket.destroy()}});
   socket.on('error',reject);socket.on('end',()=>reject(Error('no HTTP status')));
  });
  console.log(JSON.stringify({headerBytes:bytes,requestLineBytes:Buffer.byteLength(requestLine),expected,actual:status}));assert.equal(status,expected);
 }catch(error){failed++;console.error(`header ${bytes} FAIL: ${error.message}`)}
}
if(failed)process.exitCode=1;
