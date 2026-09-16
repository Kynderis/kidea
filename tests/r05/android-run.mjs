import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..');
const sample=path.resolve(root,'../kidea-workshop-pilot/samples/r05/android-r1');
const [stage,seconds,network,...command]=process.argv.slice(2);
if(!['bridge','none'].includes(network))throw Error('Network');
const args=['tests/r05/android-exec.mjs',stage,seconds,'run','--name','kidea-r05-a1-'+stage,'--label','kidea.run=A1-ANDROID-r1','--cpus','2','--memory','4g','--memory-swap','4g','--pids-limit','256','--read-only','--cap-drop','ALL','--security-opt','no-new-privileges','--network',network,'--tmpfs','/tmp:rw,nosuid,size=256m,uid=1000,gid=1000','--env','JAVA_HOME=/work/tools/jdk-17','--env','GRADLE_USER_HOME=/work/gradle-home','--env','ANDROID_HOME=/work/android-sdk','--env','HOME=/work/home','--mount','type=volume,src=kidea-r05-a1-work,dst=/work','--mount',`type=bind,src=${sample},dst=/src,readonly`,'--mount',`type=bind,src=${root}/tests/evidence/r05/native-plan-r1,dst=/plan,readonly`,'--mount',`type=bind,src=${root}/tests/evidence/r05/android-execution-r1,dst=/out`,'sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92',...command];
args.splice(args.indexOf('--mount'),0,'--env','JAVA_TOOL_OPTIONS=-Duser.home=/work/home','--env','ANDROID_USER_HOME=/work/home/.android');
process.exitCode=spawnSync(process.execPath,args,{stdio:'inherit'}).status??1;
