import {realpathSync,writeFileSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=realpathSync('/Users/kendrick/Desktop/kidea-workshop-pilot');
const request={permission:{root,readProject:true,allowReadLocalGit:true,allowViewWrite:true,allowExportMetadata:true,assumptions:{localFilesystem:true,noActiveSync:true,singleKideaRun:true}}};
const out=import.meta.dirname;
writeFileSync(out+'/request.json',JSON.stringify(request,null,2));
const hash=b=>createHash('sha256').update(b).digest('hex');
const work=readFileSync(root+'/.kidea/work.md');
const times=[];
for(let i=0;i<6;i++){
 const start=performance.now();const r=spawnSync(process.execPath,['/Users/kendrick/Desktop/kidea/.agents/skills/kidea/scripts/kidea.mjs','visualize'],{cwd:root,input:JSON.stringify(request),encoding:'utf8'});
 times.push({iteration:i,cold:i===0,milliseconds:performance.now()-start,exit:r.status});writeFileSync(out+`/generate-${i}.json`,r.stdout||r.stderr);if(r.status!==0)throw Error(r.stderr||r.stdout);
}
const html=readFileSync(root+'/.kidea/views/progress.html');
const summary={times,workHashBefore:hash(work),workHashAfter:hash(readFileSync(root+'/.kidea/work.md')),htmlBytes:html.length,htmlSha256:hash(html),scope:'Actual current pilot; no map receipts exist. Not final R09 acceptance.'};
writeFileSync(out+'/generation.json',JSON.stringify(summary,null,2));writeFileSync(out+'/progress.html',html);console.log(JSON.stringify(summary));
