// Executed inside the isolated target; makes only a fixed localhost request.
import fs from 'node:fs';
const [port,path,method='GET']=process.argv.slice(2);
if(!['8011','8012'].includes(port)||!['/','/state','/admin','/backup','/migrate-drop','/restore'].includes(path)||!['GET','POST'].includes(method))throw Error('INVALID_REQUEST');
const config=JSON.parse(fs.readFileSync(`/src/${process.env.LAB_TARGET}.json`));
try {const r=await fetch(`http://127.0.0.1:${port}${path}`,{method,headers:method==='POST'?{'x-lab-token':config.syntheticToken}:{},signal:AbortSignal.timeout(3000)});console.log(JSON.stringify({status:r.status,artifact:r.headers.get('x-artifact'),body:await r.text()}));}catch(e){console.error(JSON.stringify({status:'UNKNOWN',error:e.cause?.code??e.name}));process.exitCode=23;}
