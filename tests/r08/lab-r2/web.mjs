import http from 'node:http';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
if(process.env.LAB_FAULT==='web-fail') process.exit(17);
const artifact=fs.readFileSync(`/src/${process.env.LAB_WEB}.html`);
const digest=createHash('sha256').update(artifact).digest('hex');
http.createServer(async(req,res)=>{
  try {
    const state=await (await fetch('http://127.0.0.1:8011/state')).json();
    if(state.schema!==1){res.writeHead(503);return res.end('SCHEMA_INCOMPATIBLE');}
    res.writeHead(200,{'content-type':'text/html','x-artifact':digest});res.end(artifact);
  }catch{res.writeHead(503);res.end('BACKEND_UNCONFIRMED');}
}).listen(8012,'127.0.0.1');
