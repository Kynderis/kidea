import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const cases=[
 ['generation','ticket.generation != generation || ','','staleGenerationCannotReplaceNewerData'],
 ['owner-cancel','        owner.cancel()','        // mutant: owner left active','closingOwnerCancelsSuspendedWork'],
 ['render-command','fun snapshot(): UiState = mutable.value','fun snapshot(): UiState { submit(); return mutable.value }','readingStateNeverSubmitsAndIntentIsSingle'],
 ['actor-cache','private fun key(identity: Identity): Identity = identity','private fun key(identity: Identity): Identity = identity.copy(actor = "shared")','cacheSeparatesActorEpochAndWorkshop'],
 ['intent-identity','val sameIntent = intent','val sameIntent = intent.copy(id = "replacement-" + intent.id)','unknownReconciliationKeepsIntentAndDoesNotResubmit'],
 ['swallowed-cancellation','throw cancelled','mutable.value = mutable.value.copy(title = "cancelled fallback")','cancellationDoesNotPublishFallbackState'],
];
const revision=process.argv[2]??'';if(!['','sdk37','final','complete'].includes(revision))throw Error('Mutation revision');
const suffix=revision?'-'+revision:'';
const out='/out/mutations'+suffix;fs.mkdirSync(out,{recursive:true});const results=[];
for(const [name,from,to,oracle] of cases){
 const dir='/work/mutants'+suffix+'/'+name; if(fs.existsSync(dir))throw Error('CREATE-only mutant '+name);
 fs.cpSync('/work/android-sample',dir,{recursive:true,filter:p=>!['build','.gradle'].includes(path.basename(p))});
 const source=dir+'/app/src/main/java/org/kidea/lab/LabController.kt';let text=fs.readFileSync(source,'utf8');if(text.split(from).length!==2)throw Error('Mutation anchor '+name);fs.writeFileSync(source,text.replace(from,to));
 const stdout=fs.openSync(out+'/'+name+'.stdout.log','wx'),stderr=fs.openSync(out+'/'+name+'.stderr.log','wx');
 const r=spawnSync('/work/tools/gradle-9.4.1/bin/gradle',['--offline','--no-daemon','--no-configuration-cache','--max-workers=2','--console=plain','testDebugUnitTest'],{cwd:dir,stdio:['ignore',stdout,stderr],timeout:240000});fs.closeSync(stdout);fs.closeSync(stderr);
 const xmlFile=dir+'/app/build/test-results/testDebugUnitTest/TEST-org.kidea.lab.LabControllerTest.xml';let xml=fs.existsSync(xmlFile)?fs.readFileSync(xmlFile,'utf8'):'';if(xml)fs.writeFileSync(out+'/'+name+'.xml',xml);
 const testcases=[...xml.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)];
 const caught=testcases.some(m=>/\bname="([^"]+)"/.exec(m[1])?.[1]===oracle&&(m[2]??'').includes('<failure'));
 const suite=/<testsuite\b([^>]*)>/.exec(xml)?.[1]??'';
 const attribute=name=>Number(new RegExp('\\b'+name+'="([0-9]+)"').exec(suite)?.[1]??NaN);
 const result={name,oracle,code:r.status,signal:r.signal,error:r.error?.message,tests:attribute('tests'),failures:attribute('failures'),errors:attribute('errors'),skipped:attribute('skipped'),detected:r.status!==0&&caught&&attribute('tests')===11&&attribute('errors')===0&&attribute('skipped')===0};results.push(result);console.log(JSON.stringify(result));fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2)+'\n');if(!result.detected)process.exit(1);
}
