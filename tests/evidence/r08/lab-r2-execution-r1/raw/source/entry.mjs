import {spawn} from 'node:child_process';
import fs from 'node:fs';
if(Number(process.versions.node.split('.')[0])<24)throw Error('NODE_24_REQUIRED');
console.log(JSON.stringify({node:process.version,platform:process.platform,arch:process.arch,target:process.env.LAB_TARGET}));
const children=['backend.mjs','web.mjs'].map(file=>spawn(process.execPath,[`/src/${file}`],{stdio:'inherit',env:process.env}));
const timer=setInterval(()=>{fs.writeFileSync('/data/heartbeat.tmp',JSON.stringify({at:Date.now(),pid:process.pid,target:process.env.LAB_TARGET}));fs.renameSync('/data/heartbeat.tmp','/data/heartbeat.json');},500);
function stop(){clearInterval(timer);for(const child of children)child.kill('SIGTERM');setTimeout(()=>process.exit(0),1000).unref();}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
setTimeout(stop,600000).unref();
