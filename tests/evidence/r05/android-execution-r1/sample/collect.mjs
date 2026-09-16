import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
const root='/work/android-sample';const dest='/out/final-artifacts';fs.mkdirSync(dest,{recursive:true});const files={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else if(/\.(apk|xml|txt|json)$/.test(f)){const rel=path.relative(root,f);if(!rel.startsWith('app/build/outputs/')&&!rel.startsWith('app/build/reports/')&&!rel.startsWith('app/build/test-results/'))continue;const data=fs.readFileSync(f);files[rel]={bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')};if(!f.endsWith('.apk')){const out=path.join(dest,rel+(data.length>=2*1024**2?'.gz':''));fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,data.length>=2*1024**2?gzipSync(data):data);}}}}
walk(root+'/app/build');
for(const rel of ['gradle/verification-metadata.xml','gradle.lockfile','buildscript-gradle.lockfile','app/gradle.lockfile']){const f=path.join(root,rel);if(fs.existsSync(f)){const out=path.join(dest,rel);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(f,out);}}
fs.writeFileSync(dest+'/files.json',JSON.stringify(files,null,2)+'\n');console.log(JSON.stringify(files));

const signing={};
for(const variant of ['debug','release']){
 const apk=root+'/app/build/outputs/apk/'+variant+'/app-'+variant+(variant==='release'?'-unsigned':'')+'.apk';
 const r=spawnSync('/work/tools/jdk-17/bin/java',['-jar','/work/android-sdk/build-tools/36.0.0/lib/apksigner.jar','verify','--verbose','--print-certs',apk],{encoding:'utf8'});
 fs.writeFileSync(dest+'/signing-'+variant+'.stdout.log',r.stdout??'');fs.writeFileSync(dest+'/signing-'+variant+'.stderr.log',r.stderr??'');
 signing[variant]={code:r.status,sha256:crypto.createHash('sha256').update(fs.readFileSync(apk)).digest('hex')};
 if(variant==='debug'&&r.status!==0)throw Error('Debug signature invalid');
 if(variant==='release'&&(r.status!==1||!(r.stderr??'').includes('DOES NOT VERIFY')))throw Error('Expected unsigned release');
 const badging=spawnSync('/work/android-sdk/build-tools/36.0.0/aapt2',['dump','badging',apk],{encoding:'utf8'});fs.writeFileSync(dest+'/badging-'+variant+'.log',(badging.stdout??'')+(badging.stderr??''));if(badging.status!==0)throw Error('APK badging');
}
fs.writeFileSync(dest+'/signing.json',JSON.stringify(signing,null,2)+'\n');

const sourceHashes={};
function compareSources(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,entry.name);if(entry.isDirectory())compareSources(f);else{const rel=path.relative('/src/project',f),before=crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),after=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,rel))).digest('hex');if(before!==after)throw Error('Build modified source '+rel);sourceHashes[rel]=before;}}}
compareSources('/src/project');fs.writeFileSync(dest+'/source-verification.json',JSON.stringify({status:'SOURCE_COPY_MATCHES_READ_ONLY_CANONICAL',hashes:sourceHashes},null,2)+'\n');

const runtime={platform:process.platform,arch:process.arch,node:process.version,uid:process.getuid(),osRelease:fs.readFileSync('/etc/os-release','utf8')};
for(const name of ['cpu.max','memory.max','pids.max']){const f='/sys/fs/cgroup/'+name;if(fs.existsSync(f))runtime[name]=fs.readFileSync(f,'utf8').trim();}
fs.writeFileSync(dest+'/container-runtime.json',JSON.stringify(runtime,null,2)+'\n');
