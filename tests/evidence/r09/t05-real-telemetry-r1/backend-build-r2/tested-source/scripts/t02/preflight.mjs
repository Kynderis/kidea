import {readFileSync,readdirSync,lstatSync,realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
export const root=realpathSync(path.resolve(import.meta.dirname,'../..'));
export const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
export function inventory(base,roots){const result={};function walk(rel){const p=path.join(base,rel),st=lstatSync(p);if(st.isSymbolicLink())throw Error('SYMLINK '+rel);if(st.isDirectory())for(const name of readdirSync(p).sort())walk(path.posix.join(rel,name));else if(st.isFile())result[rel]=hash(p);else throw Error('UNSUPPORTED '+rel);}for(const r of roots)walk(r);return result;}
export function verify(manifestPath){
 const absolute=realpathSync(manifestPath),m=JSON.parse(readFileSync(absolute));
 if(!['r09-t04-build-r1','r09-t05-events-build-r1'].includes(m.revision)||m.exception?.id!=='EX-T02-WAL-01-r2'||m.exception?.policySha256!==hash(path.join(root,'tests/t02/tsan/policy.json')))throw Error('EXCEPTION_BINDING');
 if(m.root!==root||m.status!=='PROPOSED_BUILD_NOT_RUN'||m.network!=='none'||m.image!=='sha256:6fba0f63f498882a30a8dce7a1d7b6fa051d44b113f3188c38977f7a20e65a92')throw Error('MANIFEST_SCOPE');
 if(JSON.stringify(m.sourceRoots)!==JSON.stringify(m.revision==='r09-t05-events-build-r1'?['backend','contracts','tests/t02','scripts/t02','scripts/t05','containers/t02','docs']:['backend','contracts','tests/t02','scripts/t02','containers/t02','docs']))throw Error('SOURCE_ROOTS');
 const actual=inventory(root,m.sourceRoots);delete actual['docs/t02/build-manifest.json'];
 if(JSON.stringify(actual)!==JSON.stringify(m.sourceHashes))throw Error('SOURCE_CLOSURE_CHANGED');
 const git=spawnSync('git',['cat-file','-t',m.sourceCommit],{cwd:root,encoding:'utf8'});if(git.status!==0||git.stdout.trim()!=='commit')throw Error('SOURCE_COMMIT_UNAVAILABLE');
 for(const [p,h]of Object.entries(m.sourceHashes)){const r=spawnSync('git',['show',m.sourceCommit+':'+p],{cwd:root,maxBuffer:8*1024*1024});if(r.status!==0||createHash('sha256').update(r.stdout).digest('hex')!==h)throw Error('SOURCE_COMMIT_MISMATCH '+p);}
 const lock=JSON.parse(readFileSync(path.join(root,'containers/t02/vendor-lock.json'))),vendor=realpathSync(path.join(root,lock.root));
 const files=inventory(vendor,['drogon','cmark','sqlite']);if(Object.keys(files).length!==Object.keys(lock.files).length)throw Error('VENDOR_INVENTORY');for(const [p,h]of Object.entries(files))if(lock.files[p]?.sha256!==h)throw Error('VENDOR_CHANGED '+p);
 if(m.limits.downloads!==0||m.limits.cpu!==2||m.limits.memoryBytes!==4294967296||m.limits.diskBytes!==8589934592||m.limits.dataBytes!==2147483648||m.limits.totalSeconds!==7200||m.limits.containerSeconds!==1800||m.limits.containers!==4||m.limits.hostPorts!==0)throw Error('LIMITS_CHANGED');
 return {manifest:m,manifestHash:hash(absolute),vendor,sourceFiles:Object.keys(actual).length,vendorFiles:Object.keys(files).length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const r=verify(process.argv[2]);console.log(JSON.stringify({state:'STATIC_PREFLIGHT_ONLY',manifestHash:r.manifestHash,sourceFiles:r.sourceFiles,vendorFiles:r.vendorFiles,buildRun:false},null,2));}
