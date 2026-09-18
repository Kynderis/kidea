import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const root='/out/tsan/controls';mkdirSync(root);
for(const mode of ['detector-control','wal-serial','wal-parallel']){
 const dir=root+'/'+mode;mkdirSync(dir);
 const r=spawnSync('/build/tsan/workshop_tsan_control',[mode,dir+'/db.sqlite'],{encoding:'utf8',timeout:90000,killSignal:'SIGKILL',maxBuffer:8*1024*1024});
 writeFileSync(dir+'/stdout.txt',r.stdout??'',{flag:'wx'});writeFileSync(dir+'/stderr.txt',r.stderr??'',{flag:'wx'});
 writeFileSync(dir+'/process.json',JSON.stringify({code:r.status,signal:r.signal,timedOut:r.error?.code==='ETIMEDOUT',error:r.error?.message??null},null,2),{flag:'wx'});
}
