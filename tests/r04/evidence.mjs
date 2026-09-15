import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {checkDocuments,readDocuments} from '../r03/link-check.mjs';

export const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export const pilot=path.resolve(repo,'../kidea-workshop-pilot');
export const baselineFiles=['features.md','business/INDEX.md','business/tests.md',
  'business/shared/registration.md','business/shared/workshop.md','business/shared/availability.md',
  'business/features/view.md','business/features/register-cancel.md','business/features/admin.md','business/features/updates.md'];
const evidenceRoot=path.join(repo,'tests/evidence/r04/design-r1');
export const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
export function inventory(root){
  if(fs.realpathSync(root).toLowerCase()!==path.resolve(root).toLowerCase())throw Error('Unexpected real root');
  const files={};
  function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name),s=fs.lstatSync(p);
    if(s.isSymbolicLink())throw Error('Linked path: '+p);
    if(s.isDirectory())walk(p);
    else if(s.isFile()){const b=fs.readFileSync(p);files[path.relative(root,p).replaceAll('\\','/')]={bytes:b.length,sha256:digest(b),base64:b.toString('base64')};}
    else throw Error('Unexpected entry: '+p);
  }}walk(root);return files;
}
function snapshot(stage){
  if(!['quality-pre','quality-post'].includes(stage))throw Error('Unsupported stage');
  const files=inventory(pilot),expected=baselineFiles.map(f=>'docs/'+f);
  if(stage==='quality-post')expected.push('docs/design/quality.md');
  if(JSON.stringify(Object.keys(files).sort())!==JSON.stringify(expected.sort()))throw Error('Unexpected pilot inventory');
  fs.mkdirSync(evidenceRoot,{recursive:true});
  const output={stage,observedAt:new Date().toISOString(),pilot,files};
  if(stage==='quality-post'){
    const before=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'quality-pre.json'),'utf8'));
    output.changes=Object.entries(files).filter(([f,v])=>before.files[f]?.sha256!==v.sha256).map(([f,v])=>({file:f,before:before.files[f]?.sha256??null,after:v.sha256}));
  }
  fs.writeFileSync(path.join(evidenceRoot,stage+'.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({stage,files:Object.keys(files).length,changes:output.changes}));
}
function check(){
  fs.mkdirSync(evidenceRoot,{recursive:true});
  const runs=['tests/r04/design-docs.test.mjs','tests/r03/link-check.test.mjs'].map(file=>{
    const r=spawnSync(process.execPath,['--test',file],{cwd:repo,encoding:'utf8'});
    return {file,sha256:digest(fs.readFileSync(path.join(repo,file))),exitCode:r.status,error:r.error?.message??null,stdout:r.stdout,stderr:r.stderr};
  });
  const result={observedAt:new Date().toISOString(),node:process.version,nodeSha256:digest(fs.readFileSync(process.execPath)),runs,
    links:checkDocuments(readDocuments(path.join(pilot,'docs'))),pilot:inventory(pilot)};
  fs.writeFileSync(path.join(evidenceRoot,'quality-check.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({runs:runs.map(({file,exitCode})=>({file,exitCode})),links:result.links}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  if(process.argv[2]==='quality-check')check();
  else if(process.argv[2]==='quality-export'){
    const pre=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'quality-pre.json'),'utf8'));
    const post=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'quality-post.json'),'utf8'));
    const content=Buffer.from(post.files['docs/design/quality.md'].base64,'base64');
    if(digest(content)!==digest(fs.readFileSync(path.join(pilot,'docs/design/quality.md'))))throw Error('Pilot changed');
    fs.writeFileSync(path.join(evidenceRoot,'quality-r1.md'),content,{flag:'wx'});
    const changes=post.changes.map(({file,before,after})=>{
      const old=pre.files[file]?Buffer.from(pre.files[file].base64,'base64').toString('utf8'):'';
      const now=Buffer.from(post.files[file].base64,'base64').toString('utf8');
      const normalizedOld=old.replaceAll('\r\n','\n').trimEnd(),normalizedNow=now.replaceAll('\r\n','\n').trimEnd();
      if(before&&!normalizedNow.startsWith(normalizedOld+'\n\n'))throw Error('Non-append source edit');
      return {file,before,after,kind:before?'appended-references-and-possible-line-endings':'new-document',addedText:normalizedNow.slice(normalizedOld.length)};
    });
    fs.writeFileSync(path.join(evidenceRoot,'quality-diff.json'),JSON.stringify(changes,null,2)+'\n',{flag:'wx'});
    console.log('Exported exact quality bytes and append-only source diff');
  }else snapshot(process.argv[2]);
}
