import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {createHash,randomUUID} from 'node:crypto';
const runId=process.env.KIDEA_MUTATION_RUN||'final';
assert.ok(/^[a-z-]+$/.test(runId));
const root='/work/mutants-r4-'+runId,out='/out/mutations-'+runId;
fs.mkdirSync(root,{recursive:true});fs.mkdirSync(out,{recursive:true});
const hash=s=>createHash('sha256').update(s).digest('hex');
const results=[];
const specs=[
 {name:'dangling-capture',preset:'asan-ubsan',file:'tests.cpp',before:'delayed = [value]',after:'delayed = [&value]',test:'lifetime',oracle:/AddressSanitizer: stack-use-after-scope/},
 {name:'early-ack',preset:'dev',file:'domain.cpp',before:'exec("COMMIT");',after:'return "SUCCESS"; // injected ACK before COMMIT',test:'acknowledged_durable',oracle:/acknowledged write was not durable/},
 {name:'queue-race',preset:'tsan',file:'worker.hpp',before:'    std::lock_guard guard(mutex_);',after:'    // injected missing submit lock',test:'queue_concurrency',oracle:/ThreadSanitizer: data race/},
 {name:'lost-reference-hook',preset:'dev',file:'domain.cpp',before:'if (cmark_parser_has_reference_definition(parser.get()))',after:'if (false)',test:'grammar',oracle:/markup vector: \[x\]:/},
 {name:'missing-origin',preset:'dev',file:'server.cpp',before:'req->getHeader("origin") == origin &&',after:'true &&',server:true},
 {name:'missing-token',preset:'dev',file:'server.cpp',before:'equal_secret(req->getHeader("x-csrf-token"), s.csrf) &&',after:'(static_cast<void>(s), true) &&',server:true}
];
function run(command,args,cwd,env={}){
 const r=spawnSync(command,args,{cwd,env:{...process.env,...env},encoding:'utf8',timeout:180000,maxBuffer:8*1024*1024});
 if(r.error||r.status!==0)throw Error('Compilation failed: '+(r.error||r.stderr));return r;
}
function compile(file,dir,preset){
 const entry=JSON.parse(fs.readFileSync(`/build/${preset}/compile_commands.json`)).find(e=>e.file===`/src/cpp/${file}`);
 const args=entry.command.split(' '),command=args.shift();
 const object=path.join(dir,file+'.o');
 args[args.indexOf('-o')+1]=object;
 for(let i=0;i<args.length;i++)if(args[i]===`/src/cpp/${file}`)args[i]=path.join(dir,file);
 run(command,args,entry.directory);return object;
}
const {sessions:[a]}=JSON.parse(fs.readFileSync('/secrets/sessions.json'));
function request(method,url,headers={},body){return new Promise((resolve,reject)=>{
 const r=http.request({host:'127.0.0.1',port:8080,path:url,method,headers:{host:'localhost:8443',cookie:'__Host-kidea_session='+a.token,...headers}},s=>{let text='';s.on('data',d=>text+=d);s.on('end',()=>resolve({status:s.statusCode,text}));});
 r.on('error',reject);r.setTimeout(3000,()=>r.destroy(Error('timeout')));r.end(body);
});}
async function serverOracle(binary,mutant){
 const child=spawn(binary,[],{stdio:['ignore','pipe','pipe']});let logs='';child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
 try {
  let ready=false;for(let i=0;i<100;i++){try{if((await request('GET','/api/health')).status===200){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,50));}
  assert.ok(ready,'server startup failed');
  const before=JSON.parse((await request('GET','/api/counts')).text);
  const headers={'content-type':'application/json',origin:'https://localhost:8443','x-csrf-token':a.csrf};
  if(mutant==='missing-origin')delete headers.origin;else delete headers['x-csrf-token'];
  const r=await request('POST','/api/write',headers,JSON.stringify({id:randomUUID(),value:'mutation control',version:'1'}));
  const after=JSON.parse((await request('GET','/api/counts')).text);
  return {status:r.status,unchanged:JSON.stringify(before)===JSON.stringify(after),countsDelta:Object.fromEntries(Object.keys(before).map(k=>[k,after[k]-before[k]]))};
 } finally {
  const exit=new Promise(resolve=>child.once('exit',resolve));child.kill('SIGTERM');
  const timer=setTimeout(()=>child.kill('SIGKILL'),35000);await exit;clearTimeout(timer);
  if(logs.includes(a.token)||logs.includes(a.csrf))throw Error('Credential in backend output');
 }
}
for(const spec of specs){
 const dir=path.join(root,spec.name);fs.mkdirSync(dir,{recursive:false});
 for(const f of fs.readdirSync('/src/cpp'))fs.copyFileSync('/src/cpp/'+f,path.join(dir,f));
 const file=path.join(dir,spec.file),before=fs.readFileSync(file,'utf8');
 assert.ok(before.includes(spec.before),'mutation target absent');
 const after=before.replace(spec.before,spec.after);fs.writeFileSync(file,after);
 const p='/build/'+spec.preset;
 const flags=['-g',...(spec.preset==='asan-ubsan'?['-fsanitize=address,undefined']:spec.preset==='tsan'?['-fsanitize=thread']:[])];
 const libs=[p+'/libsqlite_amalgamation.a',p+'/vendor/cmark/src/libcmark.a','-ljsoncpp','-lpthread','-ldl'];
 const binary=path.join(dir,'mutant');
 if(spec.server){
  const obj=compile('server.cpp',dir,spec.preset);
  run('g++-13',[...flags,obj,p+'/libdomain.a',p+'/vendor/drogon/libdrogon.a',...libs,p+'/vendor/drogon/trantor/libtrantor.a','-lssl','-lcrypto','-luuid','-lz','-o',binary],dir);
  const baseline=await serverOracle('/build/dev/backend',spec.name);
  assert.equal(baseline.status,403);assert.equal(baseline.unchanged,true);
  const result=await serverOracle(binary,spec.name);
  // The unchanged original oracle (403 + no state change) must reject this bad variant.
  assert.equal(result.status,200);assert.equal(result.unchanged,false);
  for(const delta of Object.values(result.countsDelta))assert.equal(delta,1);
  results.push({name:spec.name,detected:true,baseline,mutant:result,before:hash(before),after:hash(after)});
 }else{
  const objs=[compile('tests.cpp',dir,spec.preset),compile('domain.cpp',dir,spec.preset),p+'/CMakeFiles/domain.dir/cpp/input.cpp.o'];
  run('g++-13',[...flags,...objs,...libs,'-o',binary],dir);
  const r=spawnSync(binary,[spec.test],{encoding:'utf8',timeout:20000,env:{...process.env,ASAN_OPTIONS:'detect_leaks=1:halt_on_error=1:detect_stack_use_after_return=1',UBSAN_OPTIONS:'halt_on_error=1',TSAN_OPTIONS:'halt_on_error=1'},maxBuffer:8*1024*1024});
  fs.writeFileSync(path.join(out,spec.name+'.stdout.log'),r.stdout||'');fs.writeFileSync(path.join(out,spec.name+'.stderr.log'),r.stderr||'');
  assert.ok(r.status!==0&&!r.error&&spec.oracle.test((r.stdout||'')+(r.stderr||'')),spec.name+' did not fail the intended oracle');
  results.push({name:spec.name,detected:true,exit:r.status,signal:r.signal,before:hash(before),after:hash(after),oracle:String(spec.oracle)});
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');
 console.log(spec.name+' DETECTED');
}
console.log(JSON.stringify({detected:results.length,required:6,originalSourceReadOnly:true}));
