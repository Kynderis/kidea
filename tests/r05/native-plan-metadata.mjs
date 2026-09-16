// Read-only preparation: metadata/HEAD requests, no binaries, installs or builds.
import fs from 'node:fs';
import crypto from 'node:crypto';
const out='tests/evidence/r05/native-plan-r1';
fs.mkdirSync(out,{recursive:true});
const requests=[
 ['jdk','https://api.github.com/repos/adoptium/temurin17-binaries/releases/tags/jdk-17.0.20.1%2B1'],
 ['gradle-sha','https://services.gradle.org/distributions/gradle-9.4.1-bin.zip.sha256'],
 ['gradle-size','https://services.gradle.org/distributions/gradle-9.4.1-bin.zip','HEAD'],
 ['sdk','https://dl.google.com/android/repository/repository2-3.xml'],
 ['agp','https://dl.google.com/dl/android/maven2/com/android/tools/build/gradle/9.2.1/gradle-9.2.1.pom'],
 ['compose-bom','https://dl.google.com/dl/android/maven2/androidx/compose/compose-bom/2026.06.01/compose-bom-2026.06.01.pom'],
 ['compose-plugin','https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/compose-compiler-gradle-plugin/2.3.10/compose-compiler-gradle-plugin-2.3.10.pom'],
 ['coroutines','https://repo.maven.apache.org/maven2/org/jetbrains/kotlinx/kotlinx-coroutines-test/1.10.2/kotlinx-coroutines-test-1.10.2.pom'],
 ['activity','https://dl.google.com/dl/android/maven2/androidx/activity/activity-compose/1.13.0/activity-compose-1.13.0.pom'],
 ['lifecycle','https://dl.google.com/dl/android/maven2/androidx/lifecycle/lifecycle-viewmodel-compose/2.10.0/lifecycle-viewmodel-compose-2.10.0.pom'],
 ['junit','https://repo.maven.apache.org/maven2/junit/junit/4.13.2/junit-4.13.2.pom']
];
const results=await Promise.all(requests.map(async([id,url,method='GET'])=>{
 try{
  const r=await fetch(url,{method,signal:AbortSignal.timeout(30000),headers:{'User-Agent':'Kidea-metadata-review'}});
  let data=Buffer.alloc(0);
  if(method==='GET')for await(const chunk of r.body){data=Buffer.concat([data,chunk]);if(data.length>4*1024**2)throw Error('Metadata exceeds 4 MiB');}
  fs.writeFileSync(`${out}/${id}.metadata`,data,{flag:'wx'});
  return {id,url,method,status:r.status,finalUrl:r.url,contentLength:r.headers.get('content-length'),bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')};
 }catch(error){return {id,url,method,error:String(error)};}
}));
fs.writeFileSync(`${out}/requests.json`,JSON.stringify({at:new Date().toISOString(),status:'METADATA_ONLY_NOT_INSTALLED',results},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(results.map(({id,status,bytes,error,contentLength})=>({id,status,bytes,error,contentLength})),null,2));
