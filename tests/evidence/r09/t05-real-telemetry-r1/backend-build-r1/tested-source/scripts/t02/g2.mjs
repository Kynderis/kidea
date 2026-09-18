// A slice run is not whole-project product certification. All inherited duties
// must have actual evidence before this final gate can report success.
import {readFileSync} from 'node:fs';
const [coveragePath,reportPath]=process.argv.slice(2);if(!coveragePath||!reportPath)throw Error('coverage and exact report required');
const coverage=JSON.parse(readFileSync(coveragePath)),report=JSON.parse(readFileSync(reportPath));
const missing=coverage.filter(c=>!report.cases?.some(r=>r.id===c.id&&r.status==='PASS'&&r.sourceSHA256===c.source.sha256&&r.variantCompletenessReviewed===true&&r.evidence?.length));
console.log(JSON.stringify({state:missing.length?'INCOMPLETE':'EVIDENCE_READY_FOR_REVIEW',missing:missing.map(c=>c.id),scope:'report consistency only, Human gate still required'},null,2));if(missing.length)process.exitCode=1;
