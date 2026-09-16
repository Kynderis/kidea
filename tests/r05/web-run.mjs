// Bounded execution/evidence wrapper for the authorized R05 sample only.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo=process.cwd(),root=path.resolve(repo,'../kidea-workshop-pilot/samples/r05/web');
const [label,...args]=process.argv.slice(2);
if(!/^[a-z0-9-]+$/.test(label??'')||!args.length||process.getuid?.()===0)throw Error('Invalid stage or root');
const evidence=path.join(repo,'tests/evidence/r05/web-execution-r1');
fs.mkdirSync(evidence,{recursive:true});
const out=fs.mkdtempSync(path.join(evidence,label+'-'));
const skip=new Set(['node_modules','.cache','.svelte-kit','build','test-results','playwright-report']);
function hashes(dir=root,prefix=''){
 const values={};for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(skip.has(e.name))continue;const f=path.join(dir,e.name),rel=prefix+e.name;
  if(e.isSymbolicLink())throw Error('Unexpected source symlink '+f);
  if(e.isDirectory())Object.assign(values,hashes(f,rel+'/'));else values[rel]=createHash('sha256').update(fs.readFileSync(f)).digest('hex');
 }return values;
}
const before=hashes(),env={...process.env,PATH:path.dirname(process.execPath)+':'+process.env.PATH,PLAYWRIGHT_BROWSERS_PATH:path.join(root,'.cache/browsers'),npm_config_cache:path.join(root,'.cache/npm'),HOST:'127.0.0.1',PORT:'4173',ORIGIN:'http://127.0.0.1:4173',CI:'1',NODE_OPTIONS:'--max-old-space-size=2048'};
const started=new Date().toISOString();
const child=spawn(args[0],args.slice(1),{cwd:root,env,detached:true,stdio:['ignore','pipe','pipe']});
const stdout=fs.createWriteStream(path.join(out,'stdout.txt'),{flags:'wx'}),stderr=fs.createWriteStream(path.join(out,'stderr.txt'),{flags:'wx'});
child.stdout.pipe(stdout);child.stderr.pipe(stderr);
let timedOut=false,launchError=null;
const timer=setTimeout(()=>{timedOut=true;try{process.kill(-child.pid,'SIGTERM');}catch{}setTimeout(()=>{try{process.kill(-child.pid,'SIGKILL');}catch{}},5000).unref();},1800000);
child.on('error',e=>{launchError=e.message;});
const result=await new Promise(resolve=>child.on('close',(code,signal)=>resolve({code,signal})));
clearTimeout(timer);try{process.kill(-child.pid,'SIGTERM');}catch{}
await Promise.all([new Promise(r=>stdout.closed?r():stdout.on('close',r)),new Promise(r=>stderr.closed?r():stderr.on('close',r))]);
const after=hashes();
const summary={started,ended:new Date().toISOString(),command:args,cwd:root,node:process.version,arch:process.arch,...result,timedOut,launchError,inputsUnchanged:JSON.stringify(before)===JSON.stringify(after),before,after};
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,...result,timedOut,inputsUnchanged:summary.inputsUnchanged}));
console.log(fs.readFileSync(path.join(out,'stdout.txt'),'utf8').slice(-3500));console.error(fs.readFileSync(path.join(out,'stderr.txt'),'utf8').slice(-3500));
process.exitCode=result.code===0&&!timedOut&&summary.inputsUnchanged?0:1;
