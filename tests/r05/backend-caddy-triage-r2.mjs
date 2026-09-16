import fs from 'node:fs';
import path from 'node:path';
const dir=path.resolve(import.meta.dirname,'../evidence/r05/backend-execution-r2');
const imports=new Set(fs.readFileSync(path.join(dir,'imports.txt'),'utf8').trim().split('\n'));
const records=[];
for(const file of fs.readdirSync(dir).filter(f=>/^osv-(GO-|GHSA-)/.test(f))){
 const v=JSON.parse(fs.readFileSync(path.join(dir,file)));
 const matched=[];
 for(const a of v.affected||[]){
  const paths=a.ecosystem_specific?.imports?.map(i=>i.path).filter(Boolean);
  for(const i of imports)if(paths?paths.includes(i):(i===a.package.name||i.startsWith(a.package.name+'/')))matched.push(i);
 }
 records.push({id:v.id,summary:v.summary,matchedImports:[...new Set(matched)],decision:matched.length?'REVIEW_REQUIRED':'AFFECTED_PACKAGE_NOT_IMPORTED_IN_CADDY_COMMAND'});
}
fs.writeFileSync(path.join(dir,'triage.json'),JSON.stringify({at:new Date().toISOString(),method:'go list -deps ./cmd/caddy, excluding test-only imports. Package absence is not a general vulnerability-free claim.',records,mainModule:{version:'2.11.4',restriction:'Existing forward_auth advisory remains; forbid forward_auth and check adapted config before HTTPS.'}},null,2)+'\n');
if(records.some(r=>r.matchedImports.length))throw Error('Affected imports require review');
console.log(JSON.stringify({records:records.length,affectedImports:0}));
