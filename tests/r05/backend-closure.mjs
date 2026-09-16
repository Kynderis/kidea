import fs from 'node:fs';
import path from 'node:path';
const sample=path.resolve(import.meta.dirname,'../../../kidea-workshop-pilot/samples/r05/backend-integration-r1');
const receipts=path.join(sample,'receipts');
const records=fs.readFileSync(path.join(receipts,'apt-resolved-records.txt'),'utf8').trim().split(/\n\n+/).map(p=>Object.fromEntries(p.split('\n').filter(l=>/^\S[^:]*: /.test(l)).map(l=>{const i=l.indexOf(': ');return [l.slice(0,i),l.slice(i+2)];})));
const packages=[];
for(const line of fs.readFileSync(path.join(receipts,'apt-simulation.txt'),'utf8').split('\n')){
 const m=line.match(/^Inst (\S+)(?: \[[^\]]+\])? \((\S+) /);if(!m)continue;
 const pkg=records.find(p=>p.Package===m[1]&&p.Version===m[2]);if(!pkg)throw Error('Missing exact package record '+line);
 if(!/^[a-f0-9]{64}$/.test(pkg.SHA256))throw Error('Missing SHA256');
 packages.push({...pkg,url:'https://snapshot.ubuntu.com/ubuntu/20260916T000000Z/'+pkg.Filename});
}
const bytes=packages.reduce((n,p)=>n+Number(p.Size),0);
if(bytes>1024**3)throw Error('APT package download budget exceeded');
fs.writeFileSync(path.join(receipts,'apt-closure.json'),JSON.stringify({at:new Date().toISOString(),packages,compressedBytes:bytes,signatureVerifiedByApt:true},null,2)+'\n');
const sources=[...new Set(packages.map(p=>(p.Source||p.Package).split(' ')[0]))];
const results=[];
for(const source of sources){
 const url=new URL('https://ubuntu.com/security/cves.json');
 url.searchParams.set('package',source);url.searchParams.set('version','noble');url.searchParams.set('limit','20');
 url.searchParams.append('priority','high');url.searchParams.append('priority','critical');
 for(const s of ['needed','deferred','pending'])url.searchParams.append('status',s);
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  const body=await response.text();
  fs.writeFileSync(path.join(receipts,'ubuntu-cves-'+source+'.json'),body);
  const data=JSON.parse(body);
  results.push({source,url:String(url),status:response.status,total:data.total_results??data.total??null,dataKeys:Object.keys(data),cves:(data.cves||[]).map(x=>({id:x.id,priority:x.priority,description:x.description,packages:x.packages}))});
 }catch(error){results.push({source,url:String(url),error:String(error)});}
 fs.writeFileSync(path.join(receipts,'ubuntu-advisory-review-input.json'),JSON.stringify(results,null,2)+'\n');
}
console.log(JSON.stringify({packageCount:packages.length,compressedBytes:bytes,sourceCount:sources.length,results:results.map(({source,status,total,error,cves})=>({source,status,total,error,ids:cves?.map(x=>x.id)}))},null,2));
