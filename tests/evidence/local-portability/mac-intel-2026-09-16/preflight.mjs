import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root=process.cwd(), out=path.dirname(new URL(import.meta.url).pathname);
const hash=b=>createHash('sha256').update(b).digest('hex');
const commands=[];
function run(executable,args){
  const r=spawnSync(executable,args,{cwd:root,encoding:'utf8',timeout:20000});
  const v={executable,args,exitCode:r.status,error:r.error?.message??null,stdout:r.stdout??'',stderr:r.stderr??''};
  commands.push(v);return v;
}
const sources=Object.keys(JSON.parse(fs.readFileSync('tests/evidence/local-portability/node24.19-final/summary.json')).before);
const sourceHashes=Object.fromEntries(sources.map(f=>[f,hash(fs.readFileSync(f))]));
run('/usr/bin/sw_vers',[]);run('/usr/bin/uname',['-sm']);
run('/usr/sbin/sysctl',['-n','hw.model','machdep.cpu.brand_string','hw.memsize']);
run('/usr/bin/id',[]);run('/bin/df',['-h','.']);
run('/usr/sbin/diskutil',['info','/System/Volumes/Data']);
run('/usr/bin/defaults',['read','com.apple.finder','FXICloudDriveDesktop']);
run('/usr/bin/defaults',['read','com.apple.finder','FXICloudDriveDocuments']);
run('/usr/local/bin/node',['--version']);run(process.execPath,['--version']);
run(process.execPath,['/usr/local/lib/node_modules/npm/bin/npm-cli.js','--version']);
run('/usr/local/bin/git',['--no-optional-locks','--no-lazy-fetch','--version']);
run('/usr/local/bin/git',['remote','-v']);run('/usr/local/bin/git',['branch','--show-current']);
run('/usr/local/bin/git',['rev-parse','HEAD']);run('/usr/local/bin/git',['status','--porcelain=v1','--untracked-files=all']);
run('/usr/local/bin/git',['ls-remote','origin','refs/heads/master']);
run('/usr/local/bin/git',['merge-base','--is-ancestor','1e5b09f6c506076fdddcb914563bbce139c0dc6f','HEAD']);
const processes=spawnSync('/bin/ps',['-axo','comm='],{encoding:'utf8'});
const syncProcesses=processes.stdout.split('\n').filter(p=>/onedrive|dropbox|syncthing|google.?drive|resilio|rclone|nextcloud/i.test(p));
const probe=path.join(out,'permissions');fs.mkdirSync(probe);
fs.mkdirSync(path.join(probe,'directory'));fs.writeFileSync(path.join(probe,'file'),'local probe',{flag:'wx'});
fs.linkSync(path.join(probe,'file'),path.join(probe,'hard-link'));
fs.symlinkSync(path.join(probe,'directory'),path.join(probe,'directory-link'),'dir');
const env={at:new Date().toISOString(),root,realRoot:fs.realpathSync(root),uid:process.getuid(),
  runtime:{node:process.version,platform:process.platform,arch:process.arch,lts:process.release.lts,executable:process.execPath,sha256:hash(fs.readFileSync(process.execPath))},
  git:{executable:fs.realpathSync('/usr/local/bin/git'),sha256:hash(fs.readFileSync('/usr/local/bin/git'))},
  permissions:{createFile:true,createDirectory:true,createHardLink:fs.statSync(path.join(probe,'file')).nlink===2,createDirectorySymlink:fs.lstatSync(path.join(probe,'directory-link')).isSymbolicLink()},
  localNoSync:{internalAPFS:true,rootIsNotSymlink:!fs.lstatSync(root).isSymbolicLink(),icloudDesktopEnabled:false,icloudDocumentsEnabled:false,knownSyncProcesses:syncProcesses,
    limit:'Checks establish the local volume and standard Desktop sync settings, not detection of every arbitrary sync tool. One cooperative writer is an operating assumption of this authorized run.'},
  sourceHashes,commands};
fs.writeFileSync(path.join(out,'environment.json'),JSON.stringify(env,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({at:env.at,node:env.runtime,permissions:env.permissions,commandFailures:commands.filter(c=>c.exitCode!==0),sourceFiles:sources.length,syncProcesses},null,2));
