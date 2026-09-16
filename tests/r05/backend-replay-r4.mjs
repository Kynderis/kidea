// Replay a recorded local Docker check into a new r4 stage/container.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const [receipt,stage,name]=process.argv.slice(2);
if(!/^[-a-z0-9]+$/.test(stage)||!/^kidea-r05-e2-r4-[-a-z0-9]+$/.test(name))throw Error('Invalid replay identifiers');
const recorded=JSON.parse(fs.readFileSync(receipt));
if(recorded.executable!=='/Applications/Docker.app/Contents/Resources/bin/docker'||recorded.args[0]!=='run')throw Error('Expected Docker run receipt');
const args=[...recorded.args];
const i=args.indexOf('--name');if(i<0)throw Error('Named container required');args[i+1]=name;
const label=args.indexOf('--label');if(label<0)throw Error('Owned label required');args[label+1]='kidea.run=E2-BW-r4';
const result=spawnSync(process.execPath,['tests/r05/backend-exec.mjs',stage,'600','docker',...args],{stdio:'inherit',env:{...process.env,KIDEA_E2_RUN:'backend-execution-r4'}});
process.exitCode=result.status??1;
