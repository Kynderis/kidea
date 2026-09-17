import https from 'node:https';import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash,timingSafeEqual} from 'node:crypto';
const token=fs.readFileSync('/config/backup-token','utf8').trim();let sequence=0,busy=false;
https.createServer({key:fs.readFileSync('/config/backup.key'),cert:fs.readFileSync('/config/backup.crt')},(req,res)=>{
 const header=req.headers.authorization||'',provided=Buffer.from(header.replace(/^Bearer /,'')),expected=Buffer.from(token);
 if(req.url!=='/backup'||!header.startsWith('Bearer ')||provided.length!==expected.length||!timingSafeEqual(provided,expected)){res.writeHead(403);res.end();return;}
 if(busy){res.writeHead(503);res.end();return;}busy=true;const p='/backup/snapshot-'+(++sequence)+'.db';
 try{execFileSync('/payload/database',['backup','/data/sample.db',p],{timeout:15000});const info=JSON.parse(execFileSync('/payload/database',['inspect',p],{encoding:'utf8',timeout:15000}));if(info.integrity!=='ok')throw Error('INTEGRITY');const data=fs.readFileSync(p);res.writeHead(200,{'content-type':'application/octet-stream','content-length':data.length,'x-backup-sha256':createHash('sha256').update(data).digest('hex'),'x-backup-info':JSON.stringify(info)});res.end(data);}
 catch{res.writeHead(503);res.end('BACKUP_FAILED');}
 finally{if(fs.existsSync(p))fs.unlinkSync(p);busy=false;}
}).listen(9444,'0.0.0.0',()=>console.log('BACKUP_READY'));
