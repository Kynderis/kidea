// CTest launcher: preserve the real program exit and separate raw streams.
import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const [binary,id]=process.argv.slice(2);
if(!binary?.startsWith('/build/tsan/')||!/^[A-Z0-9]+$/.test(id)||!process.env.WORKSHOP_CAPTURE_ROOT)throw Error('CAPTURE_SCOPE');
const dir=path.join(process.env.WORKSHOP_CAPTURE_ROOT,id);mkdirSync(dir);
const p=spawn(binary,[id],{stdio:['ignore','pipe','pipe']});let stdout='',stderr='',error=null,timedOut=false;
p.on('error',e=>error=e.message);p.stdout.on('data',b=>{stdout+=b;process.stdout.write(b);});p.stderr.on('data',b=>{stderr+=b;process.stderr.write(b);});
const timer=setTimeout(()=>{timedOut=true;p.kill('SIGKILL');},55000);
const result=await new Promise(resolve=>p.on('close',(code,signal)=>resolve({code,signal})));clearTimeout(timer);
writeFileSync(path.join(dir,'stdout.txt'),stdout,{flag:'wx'});writeFileSync(path.join(dir,'stderr.txt'),stderr,{flag:'wx'});
writeFileSync(path.join(dir,'process.json'),JSON.stringify({...result,timedOut,error},null,2),{flag:'wx'});
process.exitCode=result.signal||timedOut||error?1:result.code;
