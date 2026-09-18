import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync}from 'node:child_process';
export function certificate(){
 const d=fs.mkdtempSync(path.join(os.tmpdir(),'workshop-observer-tls-'));
 const tool=process.env.WORKSHOP_TEST_OPENSSL;if(!tool||!path.isAbsolute(tool))throw Error('TRUSTED_OPENSSL_REQUIRED');
 execFileSync(tool,['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=localhost',
 '-addext','subjectAltName=DNS:localhost,IP:127.0.0.1','-keyout',d+'/key.pem','-out',d+'/cert.pem'],{stdio:'ignore',timeout:10000});
 return{key:fs.readFileSync(d+'/key.pem'),cert:fs.readFileSync(d+'/cert.pem'),directory:d};
}
