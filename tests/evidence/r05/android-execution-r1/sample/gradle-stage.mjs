import fs from 'node:fs';
import {spawn} from 'node:child_process';
const mode=process.argv[2];
fs.mkdirSync('/work/home',{recursive:true});
fs.cpSync('/src/project','/work/android-sample',{recursive:true}); // owned sample only; retain generated lock/verification files
let proxy;
if(mode==='resolve'){
 proxy=spawn(process.execPath,['/src/maven-proxy.mjs'],{stdio:['ignore','pipe','inherit']});
 await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('Proxy startup timeout')),10000);proxy.stdout.on('data',d=>{process.stdout.write(d);if(String(d).includes('MAVEN_PROXY_READY')){clearTimeout(t);resolve();}});proxy.on('exit',code=>{clearTimeout(t);reject(Error('Proxy exited '+code));});});
}
const tasks=mode==='resolve'?['--write-locks','--write-verification-metadata','sha256','resolveLab']:['--offline',...process.argv.slice(3)];
const child=spawn('/work/tools/gradle-9.4.1/bin/gradle',['--no-daemon','--no-configuration-cache','--max-workers=2','--console=plain',...tasks],{cwd:'/work/android-sample',stdio:'inherit'});
const code=await new Promise(resolve=>child.on('close',resolve));
if(proxy){proxy.kill('SIGTERM');await new Promise(resolve=>proxy.on('close',resolve));}
process.exitCode=code??1;
