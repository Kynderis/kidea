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

// Checks section-addressable reverse references, not the meaning of table labels.
// Navigation/index links and relation sections are not business consumers.
export function sharedDependencies(documents){
  const sections=new Map(),resolve=(file,url)=>{const [rel,id]=url.split('#');return {file:rel?path.posix.normalize(path.posix.join(path.posix.dirname(file),rel)):file,id};};
  for(const [file,body] of Object.entries(documents)){
    const marks=[...body.matchAll(/<a id="([^"]+)"><\/a>/g)];
    for(let i=0;i<marks.length;i++)sections.set(file+'#'+marks[i][1],body.slice(marks[i].index+marks[i][0].length,marks[i+1]?.index??body.length));
  }
  const edges=[];
  for(const [from,body] of sections){
    const [file,id]=from.split('#');if(id==='relations'||!file.startsWith('business/')||file.endsWith('/INDEX.md'))continue;
    for(const m of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
      if(/^[A-Za-z]+:/.test(m[1]))continue;const target=resolve(file,m[1]);
      if(!target.file.startsWith('business/shared/')||!target.id||target.id==='relations')continue;
      edges.push({from,to:target.file+'#'+target.id});
    }
  }
  return [...new Map(edges.map(e=>[e.from+'->'+e.to,e])).values()];
}
export function missingSharedBacklinks(documents){
  const resolve=(file,url)=>{const [rel,id]=url.split('#');return (rel?path.posix.normalize(path.posix.join(path.posix.dirname(file),rel)):file)+'#'+id;};
  return sharedDependencies(documents).filter(({from,to})=>{
    const file=to.split('#')[0],back=documents[file]?.split('<a id="relations"></a>')[1]??'';
    return !back.split('\n').filter(l=>l.startsWith('|')).some(row=>{
      const cells=row.split('|');
      const addresses=s=>[...s.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map(m=>resolve(file,m[1]));
      return addresses(cells[1]??'').includes(to)&&addresses(cells.slice(2).join('|')).includes(from);
    });
  });
}
