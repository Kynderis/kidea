import {requireObservations} from './tsan-policy.mjs';
// Container-only report collection after CTest. No case filtering or retries.
import {readFileSync,writeFileSync} from 'node:fs';
const [preset]=process.argv.slice(2);if(!['dev','asan-ubsan','tsan','release'].includes(preset))throw Error('PRESET');
const expected=readFileSync('/src/backend/tests/cases.cmake','utf8').match(/foreach\(case ([^)]+)\)/)[1].trim().split(/\s+/);
const xml=readFileSync(`/out/${preset}/ctest.xml`,'utf8'),log=readFileSync(`/build/${preset}/Testing/Temporary/LastTest.log`,'utf8');
const observations=[];for(const line of log.split('\n')){const v=line.trim();if(v.startsWith('{')){const row=JSON.parse(v);if(row.caseId)observations.push(row);}}
const missing=expected.filter(id=>!observations.some(o=>o.caseId===id&&o.status==='PASS'));
const failed=observations.filter(o=>o.status!=='PASS');const invalidJUnit=(xml.match(/<testcase\b/g)??[]).length!==expected.length||/<(?:failure|error|skipped)\b|status="notrun"/.test(xml);
writeFileSync(`/out/${preset}/assertions.json`,JSON.stringify({preset,expected,observations,missing,failed,invalidJUnit,scope:'authored T02 cases only; inherited 137 source obligations are not all complete'},null,2));if(missing.length||failed.length||invalidJUnit)process.exitCode=1;

const baseline=JSON.parse(readFileSync('/src/tests/t02/tsan/expected.json'));
requireObservations(observations,baseline.observations);
