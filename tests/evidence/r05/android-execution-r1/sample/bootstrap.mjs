import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const manifest=JSON.parse(fs.readFileSync('/plan/manifest.json'));
const counterFile='/work/download-ledger.json';
const ledger=fs.existsSync(counterFile)?JSON.parse(fs.readFileSync(counterFile)):{chargedBytes:0,receipts:[]};
const save=()=>{fs.writeFileSync(counterFile,JSON.stringify(ledger,null,2)+'\n');fs.writeFileSync('/out/download-ledger.json',JSON.stringify(ledger,null,2)+'\n');};
const hash=(file,algorithm='sha256')=>crypto.createHash(algorithm).update(fs.readFileSync(file)).digest('hex');
const run=(exe,args,cwd)=>{const r=spawnSync(exe,args,{cwd,encoding:'utf8',maxBuffer:16*1024**2});if(r.status!==0)throw Error(`${exe} ${args.join(' ')}: ${r.stderr}`);return r.stdout+r.stderr;};
const allowed=new Set(['github.com','release-assets.githubusercontent.com','objects.githubusercontent.com','services.gradle.org','downloads.gradle.org','dl.google.com']);
const safeEntries=text=>{for(const e of text.trim().split('\n'))if(e.startsWith('/')||e.includes('\\')||e.split('/').includes('..')||/^[A-Za-z]:/.test(e))throw Error('Unsafe archive entry');};
fs.mkdirSync('/work/downloads',{recursive:true});fs.mkdirSync('/work/tools',{recursive:true});fs.mkdirSync('/work/android-sdk',{recursive:true});
const files=[];
for(let i=0;i<manifest.artifacts.length;i++){
 const a=manifest.artifacts[i],file=`/work/downloads/artifact-${i}`;files.push(file);
 if(!fs.existsSync(file)){
  if(ledger.chargedBytes+a.bytes>4*1024**3)throw Error('Download ceiling');
  ledger.chargedBytes+=a.bytes;const receipt={name:a.name,reservedBytes:a.bytes,actualBytes:0,redirects:[],status:'STARTED'};ledger.receipts.push(receipt);save();
  let url=a.url,r;
  for(let hop=0;hop<10;hop++){
   const u=new URL(url);if(u.protocol!=='https:'||!allowed.has(u.hostname))throw Error('Unapproved artifact origin');
   receipt.redirects.push(u.origin+u.pathname);
   r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(180000)});
   if(r.status>=300&&r.status<400){url=new URL(r.headers.get('location'),url).href;await r.body?.cancel();continue;}break;
  }
  if(!r.ok)throw Error('Download HTTP '+r.status);
  const fd=fs.openSync(file+'.part','wx');
  try{for await(const chunk of r.body){receipt.actualBytes+=chunk.length;if(receipt.actualBytes>a.bytes)throw Error('Artifact larger than approved');fs.writeSync(fd,chunk);}}finally{fs.closeSync(fd);save();}
  if(receipt.actualBytes!==a.bytes)throw Error('Artifact truncated');
  fs.renameSync(file+'.part',file);receipt.status='DOWNLOADED';save();
 }
 if(fs.statSync(file).size!==a.bytes)throw Error('Wrong artifact size');
 const algorithm=a.publisherChecksum?.algorithm||'sha256',expected=a.publisherChecksum?.value||a.sha256;
 if(hash(file,algorithm)!==expected)throw Error('Artifact checksum mismatch: '+a.name);
 console.log(JSON.stringify({name:a.name,bytes:a.bytes,sha256:hash(file),publisherChecksumVerified:algorithm}));
}
const jdk='/work/tools/jdk-17';
if(!fs.existsSync(jdk)){
 safeEntries(run('tar',['-tzf',files[0]]));fs.mkdirSync(jdk);run('tar',['-xzf',files[0],'--strip-components=1','-C',jdk]);
}
console.log(run(jdk+'/bin/java',['-version']));
for(let i=1;i<4;i++){
 const dest=i===1?'/work/tools/gradle-9.4.1':i===2?'/work/android-sdk/platforms/android-36.1':'/work/android-sdk/build-tools/36.0.0';
 if(fs.existsSync(dest))continue;
 safeEntries(run(jdk+'/bin/jar',['tf',files[i]]));
 const temp='/work/unpack-'+i;fs.mkdirSync(temp);run(jdk+'/bin/jar',['xf',files[i]],temp);
 const entries=fs.readdirSync(temp).filter(n=>n!=='META-INF');if(entries.length!==1)throw Error('Unexpected archive layout: '+entries);
 fs.mkdirSync(path.dirname(dest),{recursive:true});fs.renameSync(path.join(temp,entries[0]),dest);
 if(i===1)fs.chmodSync(dest+'/bin/gradle',0o755);
 if(i===3)for(const name of ['aapt','aapt2','aidl','apksigner','d8','dexdump','zipalign'])if(fs.existsSync(dest+'/'+name))fs.chmodSync(dest+'/'+name,0o755);
}
process.env.JAVA_HOME=jdk;process.env.GRADLE_USER_HOME='/work/gradle-home';
// Manual archive installation needs the publisher's local package metadata.
for(const [dir,name] of [['platforms/android-36.1','platform'],['build-tools/36.0.0','build-tools']]){
 const dest='/work/android-sdk/'+dir+'/package.xml';
 if(!fs.existsSync(dest))fs.copyFileSync('/src/sdk-metadata/'+name+'-package.xml',dest,fs.constants.COPYFILE_EXCL);
}
console.log(run('/work/tools/gradle-9.4.1/bin/gradle',['--version']));
fs.writeFileSync('/out/toolchain.json',JSON.stringify({image:manifest.imageId,jdk:run(jdk+'/bin/java',['-version']),gradle:run('/work/tools/gradle-9.4.1/bin/gradle',['--version']),artifacts:manifest.artifacts.map((a,i)=>({name:a.name,sha256:hash(files[i]),bytes:fs.statSync(files[i]).size})),sdkLicense:'Human approved A1 including Google SDK terms after ca5a96f; no blanket sdkmanager license command'},null,2)+'\n');
save();
