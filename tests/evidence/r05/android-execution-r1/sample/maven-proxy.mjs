// Loopback repository bridge inside the container. Upstream TLS remains verified.
import fs from 'node:fs';
import http from 'node:http';
import crypto from 'node:crypto';
const cache='/work/maven-cache';fs.mkdirSync(cache,{recursive:true});
const countFile='/work/network-counter';
let bytes=fs.existsSync(countFile)?Number(fs.readFileSync(countFile,'utf8')):JSON.parse(fs.readFileSync('/work/download-ledger.json')).chargedBytes;
const cap=4*1024**3-64*1024**2; // reserve headroom for protocol overhead
fs.writeFileSync(countFile,String(bytes));
const origins={google:'https://dl.google.com/dl/android/maven2/',central:'https://repo.maven.apache.org/maven2/'};
const inflight=new Map();
async function get(url){
 const key=crypto.createHash('sha256').update(url).digest('hex'),file=cache+'/'+key;
 if(fs.existsSync(file+'.json'))return {file,...JSON.parse(fs.readFileSync(file+'.json'))};
 if(inflight.has(key))return inflight.get(key);
 const work=(async()=>{
  const r=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(90000)});
  const fd=fs.openSync(file+'.part','wx');let size=0;const hash=crypto.createHash('sha256');
  try{for await(const chunk of r.body){if(bytes+chunk.length>cap)throw Error('A1 download ceiling');bytes+=chunk.length;fs.writeFileSync(countFile,String(bytes));size+=chunk.length;hash.update(chunk);fs.writeSync(fd,chunk);}}finally{fs.closeSync(fd);}
  const receipt={url,status:r.status,bytes:size,sha256:hash.digest('hex'),at:new Date().toISOString()};
  fs.renameSync(file+'.part',file);fs.writeFileSync(file+'.json',JSON.stringify(receipt));fs.appendFileSync('/out/maven-requests.jsonl',JSON.stringify(receipt)+'\n');fs.writeFileSync('/out/network-count.json',JSON.stringify({payloadBytes:bytes,capBytes:cap,protocolHeadroomBytes:64*1024**2})+'\n');
  return {file,...receipt};
 })();inflight.set(key,work);try{return await work;}finally{inflight.delete(key);}
}
const server=http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method))throw Error('Method denied');
  const match=/^\/(google|central)\/([A-Za-z0-9_./+%\-]+)$/.exec(req.url);if(!match||decodeURIComponent(match[2]).split('/').includes('..'))throw Error('Repository/path denied');
  const r=await get(origins[match[1]]+match[2]);res.writeHead(r.status,{'Content-Length':r.bytes});if(req.method==='HEAD')res.end();else fs.createReadStream(r.file).pipe(res);
 }catch(error){console.error(String(error));res.writeHead(502);res.end('Repository fetch failed');}
});
server.listen(18765,'127.0.0.1',()=>console.log('MAVEN_PROXY_READY'));
process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
