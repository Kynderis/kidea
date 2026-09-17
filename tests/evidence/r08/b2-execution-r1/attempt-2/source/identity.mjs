import fs from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const [component,expected,action='inspect']=process.argv.slice(2);
const executable=component==='web'?'/usr/local/bin/node':'/'+component;
let found;
for(const name of fs.readdirSync('/proc').filter(n=>/^\d+$/.test(n))){try{const cmd=fs.readFileSync('/proc/'+name+'/cmdline','utf8').split('\0');if(component==='web'?(cmd[0]==='node'||cmd[0].endsWith('/node'))&&cmd.includes('/work/build/index.js'):cmd[0]===executable){found={pid:Number(name),sha256:createHash('sha256').update(fs.readFileSync('/proc/'+name+'/exe')).digest('hex'),cmd};break;}}catch{}}
assert.ok(found,'PROCESS_NOT_FOUND');if(component!=='web')assert.equal(found.sha256,expected,'RUNNING_BINARY_MISMATCH');
console.log(JSON.stringify(found));if(action==='term')process.kill(found.pid,'SIGTERM');
