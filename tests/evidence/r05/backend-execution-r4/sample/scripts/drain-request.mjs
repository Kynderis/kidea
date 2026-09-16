import fs from 'node:fs';
import https from 'node:https';
const stuck=process.env.KIDEA_STUCK==='1';
const started=Date.now();
await new Promise((resolve,reject)=>{
 const req=https.get({hostname:'caddy',port:8443,servername:'localhost',ca:fs.readFileSync('/fixtures/root.crt'),path:'/drain'+(stuck?'?stuck=1':''),headers:{host:'localhost:8443'}},res=>{
  let text='';let ready=false;
  res.on('data',data=>{text+=data;if(!ready&&text.includes('START')){ready=true;console.log('ACCEPTED');}});
  res.on('end',()=>{if(!ready||(!stuck&&!text.includes('DONE')))reject(Error('accepted work lost'));else{console.log(JSON.stringify({stuck,completed:text.includes('DONE'),elapsedMs:Date.now()-started}));resolve();}});
  res.on('error',error=>{if(stuck&&ready){console.log(JSON.stringify({stuck,completed:false,outcome:'UNKNOWN',elapsedMs:Date.now()-started,code:error.code}));resolve();}else reject(error);});
 });
 req.setTimeout(40000,()=>req.destroy(Error('drain client timeout')));req.on('error',reject);
});
