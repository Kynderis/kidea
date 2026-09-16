import fs from 'node:fs';
import https from 'node:https';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const dir=fs.mkdtempSync('/tmp/kidea-tls-');
const openssl=(...args)=>execFileSync('openssl',args,{cwd:dir,stdio:['ignore','pipe','pipe']});
fs.writeFileSync(dir+'/index','');fs.writeFileSync(dir+'/serial','01\n');fs.mkdirSync(dir+'/newcerts');
fs.writeFileSync(dir+'/ca.cnf',`[ca]\ndefault_ca=lab\n[lab]\ndatabase=${dir}/index\nserial=${dir}/serial\nnew_certs_dir=${dir}/newcerts\ncertificate=${dir}/ca.crt\nprivate_key=${dir}/ca.key\ndefault_md=sha256\npolicy=policy\n[policy]\ncommonName=supplied\n[leaf]\nbasicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\nsubjectAltName=DNS:localhost\n`);
openssl('req','-x509','-newkey','rsa:2048','-nodes','-keyout','ca.key','-out','ca.crt','-days','2','-subj','/CN=Kidea isolated expiry test CA','-addext','basicConstraints=critical,CA:TRUE');
openssl('req','-new','-newkey','rsa:2048','-nodes','-keyout','leaf.key','-out','leaf.csr','-subj','/CN=localhost');
openssl('ca','-batch','-config','ca.cnf','-extensions','leaf','-in','leaf.csr','-out','expired.crt','-startdate','20000101000000Z','-enddate','20000102000000Z');
// Same key, CSR, issuer and SAN: validity interval is the only changed property.
openssl('x509','-req','-in','leaf.csr','-CA','ca.crt','-CAkey','ca.key','-set_serial','2','-out','valid.crt','-days','1','-extfile','ca.cnf','-extensions','leaf');
async function attempt(cert){
 let reached=0;
 const server=https.createServer({key:fs.readFileSync(dir+'/leaf.key'),cert:fs.readFileSync(dir+'/'+cert)},(req,res)=>{++reached;res.end('ok');});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try {
  let code;
  await new Promise(resolve=>{const req=https.get({hostname:'127.0.0.1',servername:'localhost',port:server.address().port,ca:fs.readFileSync(dir+'/ca.crt')},res=>{res.resume();res.on('end',()=>{code=res.statusCode;resolve();});});req.on('error',e=>{code=e.code;resolve();});});
  return {code,reached};
 } finally {await new Promise(r=>server.close(r));}
}
assert.deepEqual(await attempt('valid.crt'),{code:200,reached:1});
assert.deepEqual(await attempt('expired.crt'),{code:'CERT_HAS_EXPIRED',reached:0});
console.log(JSON.stringify({validControl:'PASS',expiredLeafRejectedBeforeHttp:'PASS',trust:'per-request isolated CA; no host changes'}));
