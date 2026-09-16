import fs from 'node:fs';
import path from 'node:path';
const dir=path.resolve(import.meta.dirname,'../evidence/r05/backend-execution-r2');
const raw=fs.readFileSync(path.join(dir,'modules.json'),'utf8');
const modules=JSON.parse('['+raw.trim().replace(/}\s*\n{/g,'},{')+']');
const queries=modules.filter(m=>m.Version).map(m=>({package:{ecosystem:'Go',name:m.Path},version:m.Version}));
queries.push({package:{ecosystem:'Go',name:'stdlib'},version:'1.26.7'});
const r=await fetch('https://api.osv.dev/v1/querybatch',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({queries}),signal:AbortSignal.timeout(60000)});
if(!r.ok)throw Error('OSV '+r.status);
const batch=await r.json();
fs.writeFileSync(path.join(dir,'osv-batch.json'),JSON.stringify({at:new Date().toISOString(),queries,...batch},null,2)+'\n');
const ids=[...new Set(batch.results.flatMap(r=>(r.vulns||[]).map(v=>v.id)))];
const findings=[];
for(const id of ids){const res=await fetch('https://api.osv.dev/v1/vulns/'+id,{signal:AbortSignal.timeout(30000)});if(!res.ok)throw Error(id+' '+res.status);const data=await res.json();fs.writeFileSync(path.join(dir,'osv-'+id+'.json'),JSON.stringify(data,null,2)+'\n');findings.push({id,summary:data.summary,affected:data.affected});}
console.log(JSON.stringify({modules:queries.length,findings},null,2));
