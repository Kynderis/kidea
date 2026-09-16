import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const modules=JSON.parse('['+fs.readFileSync('/work/modules.json','utf8').trim().replace(/}\s*\n{/g,'},{')+']');
const records=[];
for(const m of modules){
 if(!m.Dir)continue;
 const notices=[];
 for(const name of fs.readdirSync(m.Dir).filter(n=>/^(LICENSE|COPYING|NOTICE|COPYRIGHT)/i.test(n))){
  const file=path.join(m.Dir,name);if(!fs.statSync(file).isFile())continue;
  const data=fs.readFileSync(file);notices.push({name,sha256:crypto.createHash('sha256').update(data).digest('hex'),text:data.toString('utf8')});
 }
 records.push({module:m.Path,version:m.Version,notices});
}
fs.writeFileSync('/out/licenses.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify({modules:records.length,missingRootNotice:records.filter(r=>!r.notices.length).map(r=>r.module)}));
