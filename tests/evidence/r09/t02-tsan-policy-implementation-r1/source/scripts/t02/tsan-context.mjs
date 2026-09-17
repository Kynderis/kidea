import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {policy} from './tsan-policy.mjs';
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const actual={id:policy.id,sqliteSha256:sha('/vendor/sqlite/sqlite3.c'),image:process.env.KIDEA_T02_IMAGE,compiler:execFileSync('g++-13',['-dumpfullversion'],{encoding:'utf8'}).trim(),flags:process.env.TSAN_OPTIONS,packageInventorySha256:sha('/opt/package-inventory.tsv')};
if(Object.keys(policy).some(k=>actual[k]!==policy[k]))throw Error('TSAN_CONTEXT_CHANGED');
writeFileSync('/out/tsan/context.json',JSON.stringify(actual,null,2),{flag:'wx'});
