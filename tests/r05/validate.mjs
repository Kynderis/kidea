import path from 'node:path';
import {baseline,sourceCases,appendices} from './support.mjs';
export const newFiles=['rules','cpp','web','android','ios','tests'].map(n=>'docs/engineering/'+n+'.md');
export function validate(files){
  const errors=[],old=baseline(),expected=[...Object.keys(old),...newFiles].sort();
  const add=(code,file)=>errors.push({code,file});
  if(JSON.stringify(Object.keys(files).sort())!==JSON.stringify(expected))add('INVENTORY','pilot');
  for(const [f,b] of Object.entries(old)){
    const wanted=Buffer.concat([b,Buffer.from(appendices[f]??'')]);
    if(!files[f]?.equals(wanted))add('SOURCE_CHANGED',f);
  }
  const bodies=Object.fromEntries(Object.entries(files).map(([f,b])=>[f,b.toString()]));
  const anchors=new Map();let links=0;
  for(const [f,b] of Object.entries(bodies)){
    const ids=[...b.matchAll(/<a id="([^"]+)"/g)].map(m=>m[1]);
    if(ids.length!==new Set(ids).size)add('DUPLICATE_ANCHOR',f);
    anchors.set(f,new Set(ids));
  }
  for(const [f,raw] of Object.entries(bodies)){
    const b=raw.replace(/```[\s\S]*?```/g,'').replace(/`[^`\n]+`/g,'');
    for(const m of b.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
      if(/^[A-Za-z][A-Za-z0-9+.-]*:/.test(m[1]))continue;
      const [rel,id]=m[1].split('#');const to=rel?path.posix.normalize(path.posix.join(path.posix.dirname(f),rel)):f;links++;
      if(!bodies[to])add('MISSING_LINK',f+':'+m[1]);else if(id&&!anchors.get(to).has(id))add('MISSING_ANCHOR',f+':'+m[1]);
    }
  }
  let rules=0;
  for(const f of newFiles){
    const b=bodies[f]??'';
    if(!b.includes('PROPOSED')||!b.includes('chờ duyệt nội dung'))add('APPROVAL_STATUS',f);
    if(f.endsWith('/tests.md'))continue;
    const rows=b.split('\n').filter(l=>/^\| (COMMON|CPP|WEB|AND|IOS)-\d{2} \|/.test(l));
    const ids=rows.map(l=>l.split('|')[1].trim());rules+=rows.length;
    if(rows.length!==8||new Set(ids).size!==8)add('RULE_INVENTORY',f);
    for(const row of rows){const cells=row.split('|').slice(1,-1).map(c=>c.trim());
      if(cells.length!==5||cells.some(c=>c.length===0)||!cells[4].match(/TC-\d{2}/))add('RULE_FIELDS',f);
    }
    if(!b.includes('ngoại lệ')&&!b.includes('Ngoại lệ'))add('EXCEPTION_POLICY',f);
  }
  const specs=bodies['docs/engineering/tests.md']??'';
  const groups=specs.split('\n').filter(l=>/^\| TC-\d{2} \|/.test(l));
  if(groups.length!==20||new Set(groups.map(r=>r.split('|')[1])).size!==20)add('SPEC_INVENTORY','tests');
  for(const row of groups){const cells=row.split('|').slice(1,-1).map(s=>s.trim());
    if(cells.length!==6||cells.some(c=>c.length===0))add('SPEC_FIELDS','tests');
  }
  for(const c of sourceCases()){
    const rows=specs.split('\n').filter(l=>l.startsWith('| '+c.id+' |'));
    if(rows.length!==1||!rows[0].includes(c.group)||!rows[0].includes(c.file.replace('docs/','')+'#'+c.anchor))add('COVERAGE',c.id);
    if(rows.length&&rows[0].split('|').at(-2).trim()!=='NOT_RUN')add('RUNTIME_STATUS',c.id);
  }
  for(const [label,pattern] of Object.entries({actorNamespace:/namespace/,generation:/generation/,unknown:/UNKNOWN/,restore:/restore/,release:/revision/,fullGate:/G2/,deadline:/deadline10s/,cold:/process-cold/})){
    if(!pattern.test(specs))add('REQUIRED_CONTRACT',label);
  }
  return {errors,files:Object.keys(files).length,rules,technicalGroups:groups.length,sourceCases:sourceCases().length,localLinks:links};
}
