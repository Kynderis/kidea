// Final tests of the immutable B1 artifacts, without another application build.
import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
const cmake=fs.readFileSync('/src/CMakeLists.txt','utf8');const cases=cmake.match(/foreach\(case ([^)]+)\)/)[1].trim().split(/\s+/);assert.equal(cases.length,12);
for(const preset of ['dev','asan-ubsan','tsan','release'])for(const name of cases){
 const output=execFileSync('/build/'+preset+'/domain_tests',[name],{encoding:'utf8',timeout:20000,env:{...process.env,ASAN_OPTIONS:'detect_leaks=1:halt_on_error=1:detect_stack_use_after_return=1',UBSAN_OPTIONS:'halt_on_error=1:print_stacktrace=1',TSAN_OPTIONS:'halt_on_error=1'}});
 console.log(preset+' '+name+' PASS '+output.trim());
}
for(const group of ['unit','server']){const files=fs.readdirSync('/work/tests/'+group).filter(n=>n.endsWith('.test.mjs')).sort().map(n=>'/work/tests/'+group+'/'+n);assert.ok(files.length);process.stdout.write(execFileSync(process.execPath,['--test',...files],{cwd:'/work',encoding:'utf8',timeout:60000}));}
console.log('FINAL_PREBUILT_PASS: four presets and complete Web unit/server test files');
