import fs from 'node:fs';
import path from 'node:path';
export function checkDocuments(documents){
  const errors=[],anchors=new Map();let links=0;
  for(const [file,body] of Object.entries(documents)){
    const ids=[...body.matchAll(/<a id="([^"]+)"><\/a>/g)].map(m=>m[1]);
    if(ids.length!==new Set(ids).size)errors.push({kind:'DUPLICATE_ANCHOR',file});
    anchors.set(file,new Set(ids));
  }
  for(const [file,body] of Object.entries(documents))for(const m of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
    if(/^(?:https?:|D:)/.test(m[1]))continue;
    const [rel,id]=m[1].split('#');const target=rel?path.posix.normalize(path.posix.join(path.posix.dirname(file),rel)):file;links++;
    if(!(target in documents))errors.push({kind:'MISSING_FILE',file,target});
    else if(id&&!anchors.get(target).has(id))errors.push({kind:'MISSING_ANCHOR',file,target,id});
  }
  return {links,errors};
}
export function readDocuments(root){
  const result={};
  function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(e.name.endsWith('.md'))result[path.relative(root,f).replaceAll('\\','/')]=fs.readFileSync(f,'utf8');
  }}walk(root);return result;
}
