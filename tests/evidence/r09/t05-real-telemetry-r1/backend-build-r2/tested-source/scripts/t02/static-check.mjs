// Read-only source review. Does not execute C++, CMake, Docker or build scripts.
import {readFileSync,readdirSync,lstatSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const json=p=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const manifest=json('tests/t02/coverage.json');
if(manifest.length!==137||new Set(manifest.map(c=>c.id)).size!==137)throw Error('SOURCE_CASE_COVERAGE');
for(const row of manifest){
 if(row.runtime!=='NOT_RUN'||!row.source.path||!row.source.anchor||!row.expected)throw Error('SOURCE_CASE_INVALID '+row.id);
 const bytes=readFileSync(path.join(root,row.source.path));
 if(createHash('sha256').update(bytes).digest('hex')!==row.source.sha256)throw Error('SOURCE_CHANGED '+row.id);
 for(const file of row.testFiles)if(!lstatSync(path.join(root,file)).isFile())throw Error('TEST_MISSING '+file);
}
const counts={};for(const c of manifest)counts[c.stage]=(counts[c.stage]??0)+1;
const files=[];function walk(rel){for(const d of readdirSync(path.join(root,rel),{withFileTypes:true})){const p=path.posix.join(rel,d.name);if(d.isSymbolicLink())throw Error('SOURCE_LINK '+p);if(d.isDirectory())walk(p);else if(d.isFile())files.push(p);}}
for(const p of ['backend','contracts','tests/t02','scripts/t02','containers/t02'])walk(p);
for(const p of files)if(p.endsWith('.json'))json(p);
const cmake=readFileSync(path.join(root,'backend/tests/cases.cmake'),'utf8');
for(const c of manifest.filter(c=>c.stage==='T02'))if(!cmake.includes(c.id+' ')&&!cmake.includes(c.id+')'))throw Error('CTEST_CASE_MISSING '+c.id);
console.log(JSON.stringify({state:'STATIC_ONLY',sourceCases:manifest.length,counts,files:files.length,runtimeTestsRun:0,missing:[],note:'Path/schema/source consistency only; does not prove compilation, behavior or complete variant coverage.'},null,2));
