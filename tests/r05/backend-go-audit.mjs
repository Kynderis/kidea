import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const receipts=path.resolve(root,'../kidea-workshop-pilot/samples/r05/backend-integration-r1/receipts');
const raw=fs.readFileSync(path.join(root,'tests/evidence/r05/backend-execution-r1/caddy-build-info-S8EKz2/stdout.log'),'utf8');
const queries=[];
for(const line of raw.split('\n')){
 const fields=line.split('\t');
 if(fields[0]==='dep')queries.push({package:{ecosystem:'Go',name:fields[1]},version:fields[2]});
 if(fields[0]==='go')queries.push({package:{ecosystem:'Go',name:'stdlib'},version:fields[1].replace(/^go/,'')});
}
const response=await fetch('https://api.osv.dev/v1/querybatch',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({queries}),signal:AbortSignal.timeout(60000)});
if(!response.ok)throw Error('OSV '+response.status);
const batch=await response.json();fs.writeFileSync(path.join(receipts,'caddy-osv-batch.json'),JSON.stringify({at:new Date().toISOString(),queries,...batch},null,2)+'\n');
const ids=[...new Set(batch.results.flatMap(r=>(r.vulns||[]).map(v=>v.id)))];
const findings=[];
for(const id of ids){const r=await fetch('https://api.osv.dev/v1/vulns/'+id,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(id+' '+r.status);const v=await r.json();fs.writeFileSync(path.join(receipts,'osv-'+id+'.json'),JSON.stringify(v,null,2)+'\n');findings.push({id,summary:v.summary,severity:v.database_specific?.severity||v.severity,affected:v.affected?.map(a=>({name:a.package.name,ecosystem:a.ecosystem_specific}))});}
console.log(JSON.stringify({queries:queries.length,findings},null,2));
