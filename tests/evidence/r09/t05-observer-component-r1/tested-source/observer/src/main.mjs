import fs from 'node:fs';
import { Runtime } from './runtime.mjs';
import { createServer,cookieVerifier } from './server.mjs';
import { startCollector } from './http.mjs';
// Private operator-provided profile. This command never opens a product test window or changes admission.
const [file]=process.argv.slice(2);
if (!file || Number(process.versions.node.split('.')[0]) < 24 || process.getuid?.()===0) throw new Error('OBSERVER_ENVIRONMENT');
const config=JSON.parse(fs.readFileSync(file,'utf8'));
const readPrivate = p => {
  const st=fs.lstatSync(p);
  if (!st.isFile() || st.isSymbolicLink() || (st.mode&0o077)!==0
    || (typeof process.getuid==='function' && st.uid!==process.getuid())) throw new Error('PRIVATE_CONFIG');
  return fs.readFileSync(p);
};
const ca=fs.readFileSync(config.caFile);
const runtime=new Runtime(config.model,config.stateDirectory);
const sessions=()=>JSON.parse(readPrivate(config.sessionsFile).toString('utf8'));
const server=createServer(runtime,{key:readPrivate(config.keyFile),cert:fs.readFileSync(config.certFile)},cookieVerifier(sessions));
let stopCollector,deadline,closing=false;
async function close(){if(closing)return;closing=true;clearTimeout(deadline);if(stopCollector)await stopCollector();
 server.closeAllConnections();await new Promise(resolve=>server.close(resolve));runtime.close();}
process.on('SIGTERM',()=>{close().catch(()=>{process.exitCode=1;});});
process.on('SIGINT',()=>{close().catch(()=>{process.exitCode=1;});});
if(!Number.isSafeInteger(config.port)||config.port<1024||config.port>65535||!['127.0.0.1','0.0.0.0'].includes(config.bind))throw new Error('LISTENER_CONFIG');
server.listen(config.port,config.bind,()=>{
 if(config.model.run.confirmed && Date.now()>=config.model.run.startMs && Date.now()<config.model.run.endMs){
  const targets=Object.fromEntries(Object.entries(config.targets).map(([name,t])=>[name,{...t,ca,
   headers:JSON.parse(readPrivate(t.headersFile).toString('utf8'))}]));
  stopCollector=startCollector(runtime,targets);
 }
 // Bounded component lifetime, including an unconfirmed/expired profile; no unowned background run.
 const remaining=Math.min(4*3600000,Math.max(1,config.model.run.endMs-Date.now()));
 deadline=setTimeout(()=>{close().catch(()=>{process.exitCode=1;});},remaining);
});
