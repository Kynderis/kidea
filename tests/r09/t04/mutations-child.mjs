import fs from 'node:fs';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
const rows=[];
function run(name,args,env=process.env){const r=spawnSync(args[0],args.slice(1),{encoding:'utf8',env,timeout:45000,maxBuffer:4*1024**2});fs.writeFileSync('/out/'+name+'.stdout.txt',r.stdout??'');fs.writeFileSync('/out/'+name+'.stderr.txt',r.stderr??'');fs.writeFileSync('/out/'+name+'.process.json',JSON.stringify({args,code:r.status,signal:r.signal,error:r.error?.message??null}));assert.ok(!r.error&&!r.signal);return r;}
const compile=['/usr/bin/g++-13','-DCMARK_STATIC_DEFINE','-DWORKSHOP_TESTING','-I/src/backend/include','-isystem','/vendor/cmark/src','-isystem','/build/dev/vendor/cmark/src','-isystem','/vendor/sqlite','-isystem','/usr/include/jsoncpp','-g','-std=c++20','-fPIC','-Wall','-Wextra','-Wpedantic','-Wconversion','-Wsign-conversion','-Werror'];
for(const name of ['baseline','no-quota','counts-cancelled','recount-retry','wrong-duplicate']){
 assert.equal(run(name+'-compile',[...compile,'-o','/out/'+name+'.o','-c','/mutants/'+name+'.cpp']).status,0);
 assert.equal(run(name+'-link',['/usr/bin/g++-13','-g','/out/'+name+'.o','/build/dev/CMakeFiles/workshop_tests.dir/tests/tests.cpp.o','-o','/out/'+name,'/build/dev/libworkshop_test_core.a','/build/dev/libworkshop_sqlite.a','-ldl','/build/dev/vendor/cmark/src/libcmark.a','/usr/lib/x86_64-linux-gnu/libjsoncpp.so']).status,0);
 fs.mkdirSync('/out/'+name+'-cases');const r=run(name+'-case',['/out/'+name,'Q01'],{...process.env,WORKSHOP_CASE_ROOT:'/out/'+name+'-cases'});const assertions=r.stdout.trim().split('\n').map(x=>JSON.parse(x));
 if(name==='baseline'){assert.equal(r.status,0);assert.equal(assertions.length,14);assert.ok(assertions.every(x=>x.status==='PASS'));}
 else {assert.equal(r.status,1);assert.ok(assertions.some(x=>x.status==='FAIL'));}
 rows.push({name,exit:r.status,firstFailure:assertions.find(x=>x.status==='FAIL')??null});
}
fs.writeFileSync('/out/result.json',JSON.stringify({state:'BASELINE_PASS_FOUR_MUTANTS_REJECTED',rows,scope:'Targeted diagnostic; not a substitute for full four-preset regression.'},null,2));
