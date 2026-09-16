import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const sample=path.resolve(import.meta.dirname,'../../../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const closure=JSON.parse(fs.readFileSync(path.join(sample,'receipts/apt-closure.json')));
const manifest=JSON.parse(fs.readFileSync(path.join(sample,'manifest.json')));
const dir=path.join(sample,'downloads/debs');fs.mkdirSync(dir,{recursive:true});
const results=[];
const items=closure.packages.map(p=>({name:p.Package,url:p.url,sha256:p.SHA256,cap:Number(p.Size),file:path.join(dir,p.Package+'.deb')}));
items.push({name:'node',url:manifest.node.url,sha256:manifest.node.sha256,cap:manifest.node.downloadCapBytes,file:path.join(sample,'downloads/node.tar.xz')});
if(items.reduce((s,p)=>s+p.cap,0)+manifest.images.reduce((s,p)=>s+p.compressedBytes,0)>3*1024**3)throw Error('Reserved download cap exceeded');
let next=0;
async function worker(){while(next<items.length){const item=items[next++];
 try{
  if(fs.existsSync(item.file)){const b=fs.readFileSync(item.file);if(crypto.createHash('sha256').update(b).digest('hex')!==item.sha256)throw Error('Existing artifact mismatch');results.push({name:item.name,bytes:b.length,reused:true});continue;}
  const response=await fetch(item.url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error('HTTP '+response.status);
  let bytes=0;const chunks=[];
  for await(const chunk of response.body){bytes+=chunk.length;if(bytes>item.cap)throw Error('Artifact cap exceeded');chunks.push(chunk);}
  const data=Buffer.concat(chunks);
  if(crypto.createHash('sha256').update(data).digest('hex')!==item.sha256)throw Error('SHA256 mismatch');
  fs.writeFileSync(item.file,data,{flag:'wx'});results.push({name:item.name,url:item.url,bytes,sha256:item.sha256});
 }catch(error){results.push({name:item.name,error:String(error)});}
 fs.writeFileSync(path.join(sample,'receipts/downloads.json'),JSON.stringify(results,null,2)+'\n');
}}
await Promise.all([worker(),worker(),worker(),worker()]);
fs.writeFileSync(path.join(sample,'receipts/downloads.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({count:results.length,bytes:results.reduce((s,p)=>s+(p.bytes||0),0),errors:results.filter(p=>p.error)},null,2));
if(results.some(p=>p.error))process.exitCode=1;
