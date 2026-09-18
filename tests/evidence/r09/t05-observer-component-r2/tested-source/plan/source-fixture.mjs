// Synthetic OP inputs only. This is not backend telemetry, backup verification or a product controller.
import fs from 'node:fs';import https from 'node:https';import {randomUUID}from 'node:crypto';
import{sample,config as modelConfig}from '/observer/tests/fixtures.mjs';
const tls={key:fs.readFileSync('/config/key.pem'),cert:fs.readFileSync('/config/cert.pem')};
const boot=randomUUID();let fast=0,slow=0;
const server=https.createServer(tls,(req,res)=>{
 const mode=JSON.parse(fs.readFileSync('/control/mode.json','utf8'));
 res.setHeader('content-type','application/json');
 if(req.method!=='GET'||req.headers.authorization!=='Bearer FakeCollectorToken'){res.statusCode=403;res.end('{}');return;}
 if(req.url==='/probe/application'||req.url==='/probe/dashboard'){
  const component=req.url.split('/').at(-1);res.end(JSON.stringify({schema:1,component,status:'READ_READY'}));return;
 }
 const group=req.url==='/sample/fast'?'fast':req.url==='/sample/slow'?'slow':null;
 if(!group){res.statusCode=404;res.end('{}');return;}
 const seq=group==='fast'?++fast:++slow;
 const s=sample(group,seq);s.boot=boot;s.sampledAtMs=Date.now();s.nonce=req.headers['x-observer-nonce'];
 if(group==='fast'){
  s.signals.M1=mode.pendingCritical?{pending:1,oldestAgeMs:30000}:{pending:0,oldestAgeMs:null};
  if(mode.invalidFast)s.signals.M2.open=[{code:'FakeSecretMustNotEscape',count:1}];
 }else{s.signals.M9.recoveryPointMs=Date.now();s.signals.M8.targets=modelConfig().storageTargets.map(name=>({name,bytes:0,freeBytes:10000000,headroomBytes:1000000}));}
 fs.appendFileSync('/out/source-events.jsonl',JSON.stringify({atMs:Date.now(),source:group,boot,sequence:seq,schema:s.schema,nonce:s.nonce,
 pending:s.signals.M1??null,invalidFast:mode.invalidFast})+'\n');res.end(JSON.stringify(s));
});
server.listen(8444,'0.0.0.0',()=>{fs.writeFileSync('/out/source-ready.json',JSON.stringify({pid:process.pid,boot,atMs:Date.now()}));});
process.on('SIGTERM',()=>{server.closeAllConnections();server.close(()=>{});});
