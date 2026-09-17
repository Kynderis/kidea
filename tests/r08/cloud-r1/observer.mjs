import fs from 'node:fs';import https from 'node:https';import {createHash} from 'node:crypto';
const config=JSON.parse(fs.readFileSync('/config/observer.json'));const ca=fs.readFileSync('/config/root.crt');const {sessions:[admin]}=JSON.parse(fs.readFileSync('/config/sessions.json'));const token=fs.readFileSync('/config/backup-token','utf8').trim();
let stopping=false,sequence=fs.existsSync('/state/latest.json')?JSON.parse(fs.readFileSync('/state/latest.json')).sequence:0;process.on('SIGTERM',()=>{stopping=true;});
function persist(p,data){const fd=fs.openSync(p+'.tmp','w',0o600);fs.writeFileSync(fd,data);fs.fsyncSync(fd);fs.closeSync(fd);fs.renameSync(p+'.tmp',p);const d=fs.openSync('/state','r');fs.fsyncSync(d);fs.closeSync(d);}
function log(record){const fd=fs.openSync('/state/events.jsonl','a',0o600);fs.writeSync(fd,JSON.stringify({at:new Date().toISOString(),sequence,...record})+'\n');fs.fsyncSync(fd);fs.closeSync(fd);}
function request(backup=false,body){return new Promise((resolve,reject)=>{
 const options=backup?{host:config.workload,port:9444,servername:'localhost',ca,path:'/backup',headers:{authorization:'Bearer '+token}}:{host:config.workload,port:8443,servername:'localhost',ca,path:body?'/api/write':'/api/counts',method:body?'POST':'GET',headers:{host:'localhost:8443',cookie:'__Host-kidea_session='+admin.token,origin:'https://localhost:8443','x-csrf-token':admin.csrf,'content-type':'application/json'}};
 const req=https.request(options,res=>{const chunks=[];let size=0;res.on('data',d=>{size+=d.length;if(size>8*1024**2)req.destroy(Error('SIZE_LIMIT'));else chunks.push(d);});res.on('end',()=>resolve({status:res.statusCode,data:Buffer.concat(chunks),headers:res.headers}));});req.setTimeout(3000,()=>req.destroy(Error('TIMEOUT')));req.on('error',reject);req.end(body&&JSON.stringify(body));
});}
while(!stopping&&sequence<1800){sequence++;
 try {
  const before=await request();if(before.status!==200)throw Error('HEALTH_HTTP');
  const write=await request(false,{id:'cloud-job-'+sequence,value:'Independent scheduled job',version:'1'});if(write.status!==200)throw Error('JOB_WRITE');
  const after=await request();if(after.status!==200)throw Error('READBACK');const counts=JSON.parse(after.data);
  const backup=await request(true);if(backup.status!==200)throw Error('BACKUP_HTTP');const digest=createHash('sha256').update(backup.data).digest('hex');if(digest!==backup.headers['x-backup-sha256'])throw Error('BACKUP_HASH');
  const info=JSON.parse(backup.headers['x-backup-info']);for(const k of ['domain','result','audit','outbox'])if(info[k]!==counts[k])throw Error('BACKUP_COUNTS');
  persist('/state/latest.db',backup.data);persist('/state/latest.json',JSON.stringify({at:new Date().toISOString(),sequence,sha256:digest,info})+'\n');
  log({state:'HEALTHY',jobCommitted:true,backupSHA256:digest,counts});
 }catch(error){log({state:'ALERT',jobCommitted:'UNKNOWN',reason:error.code||error.message});}
 if(!stopping)await new Promise(r=>setTimeout(r,2000));
}
log({state:'STOPPED'});
