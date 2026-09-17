import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {classify,requireObservations,parseObservations,completeReports} from './tsan-policy.mjs';
const expected=JSON.parse(readFileSync(new URL('../../tests/t02/tsan/expected.json',import.meta.url)));
export function judgeCase(record,oracle,context){
  if(record.error)throw Error('PROCESS_ERROR');
  requireObservations(parseObservations(record.stdout),oracle);
  if(/ThreadSanitizer|Sanitizer:/.test(record.stdout))throw Error('MISROUTED_REPORT');
  const result=classify({...record,context});if(result.state==='BLOCKED')throw Error('SANITIZER_'+result.reason);return result;
}
export function checkJUnit(xml,results,ctestExit){
  const blocks=[...xml.matchAll(/<testcase\b([^>]*)>([\s\S]*?)<\/testcase>/g)];
  if(blocks.length!==expected.cases.length || (xml.match(/<testcase\b/g)??[]).length!==blocks.length || /<(?:error|skipped)\b/.test(xml))throw Error('JUNIT_CLOSURE');
  const names=[];
  for(const [,attrs,body]of blocks){
    const id=attrs.match(/\bname="([A-Z0-9]+)"/)?.[1],status=attrs.match(/\bstatus="([a-z]+)"/)?.[1];
    if(!expected.cases.includes(id)||names.includes(id))throw Error('JUNIT_ID');names.push(id);
    const failed=results[id]?.code===66;
    if(!results[id] || status!==(failed?'fail':'run') || (body.match(/<failure\b/g)??[]).length!==(failed?1:0))throw Error('JUNIT_STATUS');
  }
  const failures=Object.values(results).filter(r=>r.code===66).length;
  if(ctestExit!==(failures?8:0))throw Error('CTEST_EXIT');
  const header=xml.match(/<testsuite\b([^>]*)>/)?.[1]??'';
  for(const [key,value]of Object.entries({tests:46,failures,disabled:0,skipped:0}))if(header.match(new RegExp('\\b'+key+'="(\\d+)"'))?.[1]!==String(value))throw Error('JUNIT_TOTAL');
}
export function judgeHTTP(report,server,init,context){
  requireObservations(report.entries,expected.http);
  if(init.code!==0||init.signal||init.timedOut||init.error||init.stderr.trim()||/Sanitizer/.test(init.stdout))throw Error('HTTP_INITIALIZE');
  if(report.serverExit!==server.code||server.error||/Sanitizer/.test(server.stdout))throw Error('HTTP_SERVER');
  const result=classify({...server,context});if(result.state==='BLOCKED')throw Error('HTTP_SANITIZER_'+result.reason);return result;
}
export function judgeControls(control,clean,wal,context){
  if(control.error||control.code!==66||control.signal||control.timedOut||!/CONTROL_BODY_COMPLETED value=\d+\n$/.test(control.stdout)||!control.stderr.includes('deliberatelyRacy')||!/ThreadSanitizer: reported \d+ warnings\n$/.test(control.stderr)||classify({...control,context}).state!=='BLOCKED')throw Error('DETECTOR_CONTROL');
  const reports=completeReports(control.stderr);
  for(const report of reports){
    if(!report.includes("Location is global '(anonymous namespace)::deliberatelyRacy'") || (report.match(/^    #0 operator\(\) \/src\/tests\/t02\/sqlite-diagnostic\.cpp:68 /gm)??[]).length!==2)throw Error('CONTROL_STACK');
  }
  for(const sample of [clean,wal])if(sample.error||!sample.stdout.includes('DIAGNOSTIC_INVARIANTS_OK count=100 quick_check=ok\n'))throw Error('CONTROL_ORACLE');
  if(classify({...clean,context}).state!=='CLEAN'||classify({...wal,context}).state!=='KNOWN_WAL_REPORT_REVIEW_REQUIRED')throw Error('CONTROL_BASELINE');
  if(classify({...wal,stderr:wal.stderr+control.stderr,context}).state!=='BLOCKED')throw Error('MIXED_CONTROL');
  return {state:'CONTROLS_VERIFIED',mixedUnknownBlocked:true};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [stage,dir]=process.argv.slice(2);if(!['cases','http','controls'].includes(stage)||dir!=='/out/tsan')throw Error('GATE_SCOPE');
 const read=p=>readFileSync(path.join(dir,p),'utf8'),json=p=>JSON.parse(read(p));const context=json('context.json');
 const capture=folder=>({...json(folder+'/process.json'),stdout:read(folder+'/stdout.txt'),stderr:read(folder+'/stderr.txt')});
 let result;
 try{
  if(stage==='cases'){
   if(JSON.stringify(readdirSync(path.join(dir,'raw-cases')).sort())!==JSON.stringify([...expected.cases].sort()))throw Error('CAPTURE_CLOSURE');
   const results={};for(const id of expected.cases){const record=capture('raw-cases/'+id);results[id]={...judgeCase(record,expected.observations.filter(x=>x.caseId===id),context),code:record.code};}
   checkJUnit(read('ctest.xml'),results,Number(read('ctest.exit.txt')));
   result={state:Object.values(results).some(r=>r.code===66)?'KNOWN_WAL_REPORT_REVIEW_REQUIRED':'CLEAN',results,assertionCount:expected.observations.length,rawCTestPreserved:true};
  }else if(stage==='http'){
   const record=json('http/assertions.json');const server={...json('http/server.process.json'),stdout:read('http/server.stdout.txt'),stderr:read('http/server.stderr.txt')};const init={...json('http/initialize.process.json'),stdout:read('http/initialize.stdout.txt'),stderr:read('http/initialize.stderr.txt')};
   result=judgeHTTP(record,server,init,context);
   if(Number(read('http.exit.txt'))!==(server.code===66?1:0))throw Error('HTTP_HARNESS_EXIT');
  }else result=judgeControls(capture('controls/detector-control'),capture('controls/wal-serial'),capture('controls/wal-parallel'),context);
 }catch(error){result={state:'BLOCKED',reason:error.message};process.exitCode=1;}
 writeFileSync(path.join(dir,stage+'-classification.json'),JSON.stringify(result,null,2),{flag:'wx'});console.log(JSON.stringify(result));
}
