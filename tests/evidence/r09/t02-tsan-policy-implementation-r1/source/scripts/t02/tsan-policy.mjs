// EX-T02-WAL-01 r1. Classification is separate from the immutable raw failure.
import {readFileSync} from 'node:fs';
export const policy = JSON.parse(readFileSync(new URL('../../tests/t02/tsan/policy.json',import.meta.url)));
const blocked = reason => ({state:'BLOCKED',reason});
export function completeReports(stderr){
  if(typeof stderr!=='string')throw Error('REPORT_MISSING');
  const pattern=/^==================\n(WARNING: ThreadSanitizer: data race \(pid=\d+\)\n[\s\S]*?\nSUMMARY: ThreadSanitizer: data race [^\n]+\n)==================\n/gm;
  const blocks=[...stderr.matchAll(pattern)];
  if(!blocks.length || stderr.replace(pattern,'')!==`ThreadSanitizer: reported ${blocks.length} warnings\n`)throw Error('INCOMPLETE_REPORT');
  for(const [,b] of blocks)if((b.match(/WARNING:/g)??[]).length!==1 || (b.match(/SUMMARY:/g)??[]).length!==1 || /FATAL:|ERROR:|DEADLYSIGNAL/.test(b))throw Error('EXTRA_DIAGNOSTIC');
  return blocks.map(x=>x[1]);
}
export function classify({stderr,code,signal=null,timedOut=false,oom=false,context}) {
  if (!context || Object.keys(policy).some(k=>context[k]!==policy[k])) return blocked('IDENTITY');
  if (signal || timedOut || oom || typeof stderr!=='string' || ![0,66].includes(code)) return blocked('PROCESS_OR_LOG');
  if (!stderr.trim()) return code===0?{state:'CLEAN',reports:0}:blocked('EXIT_WITHOUT_REPORT');
  if(code!==66)return blocked('REPORT_OR_EXIT');
  let reports;try{reports=completeReports(stderr);}catch{return blocked('INCOMPLETE_OR_EXTRA_LOG');}
  const pairs=[];
  for (const b of reports) {
    if((b.match(/WARNING:/g)??[]).length!==1 || (b.match(/SUMMARY:/g)??[]).length!==1 || /FATAL:|ERROR:|DEADLYSIGNAL/.test(b))return blocked('EXTRA_DIAGNOSTIC');
    // Only the two observed 8-byte memcpy accesses at the beginning of a WAL header.
    const accesses=[...b.matchAll(/^  (Write|Previous read) of size 8 at (0x[0-9a-f]+) by thread T\d+ \(mutexes: write M\d+\):\n((?:    #[^\n]+\n)+)/gm)];
    if (accesses.length!==2 || accesses[0][1]!=='Write' || accesses[1][1]!=='Previous read' || accesses[0][2]!==accesses[1][2]) return blocked('ACCESS_PAIR');
    const frame=(stack,fn)=> {
      const lines=stack.trim().split('\n').map(x=>x.trim());
      if (!/^#0 memcpy .*sanitizer_common_interceptors_memintrinsics\.inc:115 /.test(lines[0]) || !/^#1 memcpy .*sanitizer_common_interceptors_memintrinsics\.inc:107 /.test(lines[1])) return null;
      return lines[2]?.match(new RegExp('^#2 '+fn+' /vendor/sqlite/sqlite3\\.c:(\\d+) '))?.[1];
    };
    const pair=frame(accesses[0][3],'walIndexWriteHdr')+':'+frame(accesses[1][3],'walIndexTryHdr');
    const offset=pair==='68469:70135'?'30':pair==='68471:70133'?'0':null;
    if (offset===null || !new RegExp("^  Location is global '<null>' at 0x0+ \\([^\\n()]+-shm\\+0x"+offset+"\\)$",'m').test(b)) return blocked('HEADER_LOCATION');
    if ((b.match(/^  (?:Previous )?(?:Read|Write|read|write|Atomic|atomic)[^\n]* of size /gm)??[]).length!==2) return blocked('EXTRA_ACCESS');
    if (!/^SUMMARY: ThreadSanitizer: data race .*sanitizer_common_interceptors_memintrinsics\.inc:115 in memcpy$/m.test(b)) return blocked('SUMMARY');
    pairs.push(pair);
  }
  return {state:'KNOWN_WAL_REPORT_REVIEW_REQUIRED',reports:reports.length,pairs,exception:policy.id};
}
// These three assertion names append the observed response as diagnostic payload.
// The original C++ assertion still decides PASS/FAIL, and all final race/retry
// assertions remain mandatory. Only the payload is excluded from label identity.
function variantKey(row){
  const prefixes=row.caseId==='I09'?['initial-same-intent-']:/^C0[1-5]$/.test(row.caseId)?['race-initial-U-','race-initial-V-']:[];
  const prefix=prefixes.find(p=>row.variant?.startsWith(p));
  if(!prefix)return row.variant;
  const payload=JSON.parse(row.variant.slice(prefix.length));
  if(!payload||Array.isArray(payload)||!['FINAL','UNKNOWN'].includes(payload.state))throw Error('INVALID_DIAGNOSTIC_PAYLOAD');
  return prefix+'<observed-response>';
}
const canonical=rows=>rows.map(r=>JSON.stringify([r.caseId,variantKey(r),r.status])).sort();
export function requireObservations(actual,expected) {
  if (!Array.isArray(actual)||!Array.isArray(expected)||!expected.length||actual.some(r=>r.status!=='PASS')||JSON.stringify(canonical(actual))!==JSON.stringify(canonical(expected))) throw Error('ASSERTION_CLOSURE');
}
export function parseObservations(stdout) {
  if (typeof stdout!=='string') throw Error('STDOUT_MISSING');
  return stdout.split('\n').filter(x=>x.trim()).map(x=>JSON.parse(x));
}
