// Explicit, single-use three-session controller. Never imported by npm test.
// An operator inspects each transcript before releasing the next quota slot.
import { spawn,spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync,readdirSync,readFileSync,writeFileSync,lstatSync,realpathSync,openSync,writeSync,closeSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const repo=fileURLToPath(new URL('../../',import.meta.url));
const output=path.join(repo,'.test-output/r02-t06/ai-trial-1');
const cli='C:/Users/vuhoa/AppData/Local/OpenAI/Codex/bin/7ac07f4ce733f89a/codex.exe';
const cliHash='3d6ca7085c932b62ef4ee4877e92f15b050fb94b2eb8e6c10a346a06248c6004';
const nodeHash='ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32';
const hash=b=>createHash('sha256').update(b).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const save=(p,data)=>writeFileSync(path.join(output,p),typeof data==='string'?data:JSON.stringify(data,null,2),{flag:'wx'});
const fixtures=[
 {id:'F01',source:'.test-output/r02-t06/native-write-CPcPkR/success-S2NAms',files:61,fingerprint:'67e972a27f3d223c8dc0cf2af5ab87f6e26fa476ff9c47f56c4124e8a06428fb',checkpoints:['8f30a4f8-14d5-41c9-8cdd-e1a2de6a39b8']},
 {id:'F02',source:'.test-output/r02-t06/native-write-CPcPkR/kill-AFTER_PARTIAL_WRITE-YSWyAK',files:57,fingerprint:'d8ebed476ded088455de8a69a57be4be72fae729f3989fe0db99beb3e7415d49',checkpoints:['b9717406-d969-4407-a46d-4d9bcd7b0e02']},
 {id:'F03',source:'.test-output/r02-t06/cleanup-UsIlO9/042-kill-first-delete-Eredjw',files:70,fingerprint:'4983025f7606ae94b30c760a3a4542daeb4e766a8268e15aca67011285b100dd',checkpoints:['2bf1c2ef-933e-4787-9b6f-61b300ffd288','53276b46-f262-4b3b-bf6b-e38d757336f0']},
];
function tree(root,excluded=[]){
 const result={};
 function visit(dir){
  const stat=lstatSync(dir);assert.ok(stat.isDirectory()&&!stat.isSymbolicLink());
  assert.equal(path.resolve(realpathSync(dir)).toLowerCase(),path.resolve(dir).toLowerCase(),'Reparse path');
  for(const e of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   if(dir===root&&excluded.includes(e.name))continue;
   const p=path.join(dir,e.name),s=lstatSync(p);assert.ok(!s.isSymbolicLink(),'Unexpected link');
   if(s.isDirectory())visit(p);else{assert.ok(s.isFile()&&s.nlink===1,'Unexpected file kind or alias');result[path.relative(root,p).replaceAll('\\','/')]=hash(readFileSync(p));}
  }
 }
 visit(root);return result;
}
function runtime(){assert.equal(process.platform,'win32');assert.equal(process.version,'v24.21.0');assert.equal(hash(readFileSync(process.execPath)),nodeHash);assert.equal(hash(readFileSync(cli)),cliHash);const r=spawnSync(cli,['--version'],{encoding:'utf8',windowsHide:true,timeout:10000});assert.equal(r.status,0);assert.equal(r.stdout.trim(),'codex-cli 0.153.4');}
function snapshot(){return {repo:tree(repo,['.git','.tools','.test-output']),sources:Object.fromEntries(fixtures.map(f=>[f.id,tree(path.join(repo,f.source))])),inputs:tree(path.join(output,'worlds')),runtime:{node:hash(readFileSync(process.execPath)),cli:hash(readFileSync(cli))}};}
const mode=process.argv[2];assert.ok(['prepare','run'].includes(mode)&&process.argv.length===3,'Use prepare or run only');runtime();
if(mode==='prepare'){
 const sourceTrees=Object.fromEntries(fixtures.map(f=>{const t=tree(path.join(repo,f.source));assert.equal(Object.keys(t).length,f.files);assert.equal(hash(JSON.stringify(t)),f.fingerprint);return[f.id,t];}));
 // Exclusive directory creation is the preparation guard; never erase/reuse it.
 mkdirSync(output);mkdirSync(path.join(output,'worlds'));
 for(const f of fixtures){
  const src=path.join(repo,f.source),dest=path.join(output,'worlds',f.id);mkdirSync(dest);
  function copy(dir,relative=''){
   for(const e of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
    const rel=path.join(relative,e.name),p=path.join(src,rel),to=path.join(dest,rel),s=lstatSync(p);
    assert.ok(!s.isSymbolicLink());if(s.isDirectory()){mkdirSync(to);copy(p,rel);}else{assert.ok(s.isFile()&&s.nlink===1);writeFileSync(to,readFileSync(p),{flag:'wx'});}
   }
  }
  copy(src);assert.ok(same(tree(dest),sourceTrees[f.id]));
 }
 const roots=fixtures.map(f=>path.join(output,'worlds',f.id));
 const cp=(i,n)=>path.join(roots[i],'.kidea/checkpoints/operations',fixtures[i].checkpoints[n],'checkpoint.md');
 const protocol=readFileSync(path.join(repo,'tests/r02-t06/ai-trial-protocol.md'),'utf8');
 let prompt=protocol.match(/```text\r?\n([\s\S]*?)\r?\n```/)[1];
 const replacements={SKILL:path.join(repo,'.agents/skills/kidea/SKILL.md'),F01:roots[0],F02:roots[1],F03:roots[2],CP01:cp(0,0),CP02:cp(1,0),CP03A:cp(2,0),CP03B:cp(2,1)};
 for(const [key,value]of Object.entries(replacements))prompt=prompt.replaceAll(`{${key}}`,value);
 assert.ok(!/\{(?:SKILL|F0[123]|CP0[123][AB]?)\}/.test(prompt));
 const args=['exec','--ephemeral','--sandbox','read-only','--ignore-rules','--json','--color','never',
  '-c','model="gpt-6-astra"','-c','model_reasoning_effort="ultra"','-c','approval_policy="never"','-c','notify=[]','-c','mcp_servers.node_repl.enabled=false','-c','web_search="disabled"',
  ...['apps','plugins','hooks','memories','multi_agent','multi_agent_v2','browser_use','browser_use_external','computer_use','in_app_browser','image_generation','skill_mcp_dependency_install'].flatMap(n=>['--disable',n]),'-C',roots[0],prompt];
 const before=snapshot();save('prompt.txt',prompt);save('before.json',before);
 save('manifest.json',{preparedAt:new Date().toISOString(),authorization:'Human Ok nhé after cfa374a answer; R02-T06-S03-trial-r1 only',cli,cliHash,node:process.version,nodeHash,model:'gpt-6-astra',effort:'ultra',sessions:3,timeoutMs:180000,automaticRetries:0,roots,fixtures,args,promptHash:hash(prompt),before});
 console.log(JSON.stringify({prepared:output,files:Object.keys(before.inputs).length,aiSessionsStarted:0}));
}else{
 const manifest=JSON.parse(readFileSync(path.join(output,'manifest.json'),'utf8'));
 assert.equal(manifest.cli,cli);assert.equal(manifest.cliHash,cliHash);assert.equal(manifest.sessions,3);assert.equal(manifest.timeoutMs,180000);
 assert.ok(same(snapshot(),manifest.before),'Frozen inputs changed; no AI started');
 save('run-start.json',{at:new Date().toISOString(),manifestHash:hash(readFileSync(path.join(output,'manifest.json')))});
 const rl=createInterface({input:process.stdin});const answers=[];let waiting=null,closed=false,active=null;
 rl.on('line',line=>{if(line==='STOP'&&active)active();if(waiting){const f=waiting;waiting=null;f(line);}else answers.push(line);});
 rl.on('close',()=>{closed=true;waiting?.('STOP');waiting=null;active?.();});
 const nextAnswer=()=>answers.length?Promise.resolve(answers.shift()):closed?Promise.resolve('STOP'):new Promise(resolve=>{waiting=resolve;});
 const results=[];
 for(let session=1;session<=3;session++){
  assert.ok(same(snapshot(),manifest.before),'Inputs changed between sessions');
  const startedAt=new Date().toISOString();save(`session-${session}.started.json`,{session,startedAt});
  const outName=`session-${session}.jsonl`,errName=`session-${session}.stderr.txt`;
  const outFd=openSync(path.join(output,outName),'wx'),errFd=openSync(path.join(output,errName),'wx');
  let timedOut=false,error=null,killResult=null,logError=null,violation=false;
  const child=spawn(cli,manifest.args,{cwd:manifest.roots[0],windowsHide:true,stdio:['ignore','pipe','pipe']});
  const kill=()=>{if(!child.pid||killResult)return;const k=spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,encoding:'utf8',timeout:10000});killResult={pid:child.pid,code:k.status,error:k.error?.message??null,stdout:k.stdout,stderr:k.stderr};};
  active=kill;
  child.stdout.on('data',b=>{try{writeSync(outFd,b);}catch(e){logError=e.message;kill();}});
  child.stderr.on('data',b=>{try{writeSync(errFd,b);}catch(e){logError=e.message;kill();}});
  console.log(JSON.stringify({session,startedAt,pid:child.pid}));
  const timer=setTimeout(()=>{timedOut=true;kill();},180000);
  const exited=await new Promise(resolve=>{child.on('error',e=>{error=e.message;});child.on('close',(code,signal)=>resolve({code,signal}));});
  clearTimeout(timer);active=null;closeSync(outFd);closeSync(errFd);
  const after=snapshot(),unchanged=same(after,manifest.before);
  const transcript=readFileSync(path.join(output,outName),'utf8');
  for(const line of transcript.split(/\r?\n/).filter(Boolean)){try{const e=JSON.parse(line);if(['file_change','mcp_tool_call','web_search'].includes(e.item?.type))violation=true;}catch{logError??='Invalid JSONL';}}
  const result={session,startedAt,endedAt:new Date().toISOString(),pid:child.pid,...exited,timedOut,error,logError,killResult,unchanged,violation,stdoutHash:hash(transcript),stderrHash:hash(readFileSync(path.join(output,errName))),behaviorReview:'REQUIRES_OPERATOR_REVIEW'};
  save(`session-${session}.result.json`,result);results.push(result);console.log(JSON.stringify(result));
  if(!unchanged||violation||logError||killResult&&killResult.code!==0)break;
  if(session<3){console.log(`REVIEW_REQUIRED ${session}: inspect transcript; CONTINUE for next independent slot, STOP to end.`);const decision=await nextAnswer();save(`session-${session}.operator.json`,{at:new Date().toISOString(),decision});if(decision!=='CONTINUE')break;}
 }
 rl.close();save('after.json',snapshot());save('summary.json',{results,behaviorReview:'Pending manual grading; no automatic PASS',sessionsConsumed:results.length,quota:3,automaticRetries:0});
 process.exitCode=results.length===3&&results.every(r=>r.code===0&&!r.timedOut&&!r.error&&!r.logError&&r.unchanged&&!r.violation)?0:1;
}
