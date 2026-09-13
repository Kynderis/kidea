// Synthetic schema-2 worlds. No project files, commands, Git operations or deployments are executed.
import { createHash } from 'node:crypto';

export const sourceCommit = '7fd8d059db6b9085f13ec4ed6427126b57317880';
export const digest = text => ({ method: 'SHA256', value: createHash('sha256').update(text, 'utf8').digest('hex'), byteLength: Buffer.byteLength(text, 'utf8') });
export const ref = (path, anchor = null) => ({ path, anchor });
export const time = '2026-09-13T01:00:00.000Z';
export const envelope = data => `# DỮ LIỆU GIẢ — không phải xác nhận hoặc kết quả chạy thật\n\n<!-- kidea:data:start -->\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n<!-- kidea:data:end -->\n`;
export function dataAt(world, path) {
  const body = world.files[path];
  if (typeof body !== 'string') throw new Error(`Missing fixture file: ${path}`);
  const match = body.match(/<!-- kidea:data:start -->\n```json\n([\s\S]*?)\n```\n<!-- kidea:data:end -->/);
  if (!match) throw new Error(`Missing fixture envelope: ${path}`);
  return JSON.parse(match[1]);
}
export function edit(world, path, fn) { const value = dataAt(world, path); fn(value); world.files[path] = envelope(value); }
const header = kind => ({ schemaVersion: 2, projectId: 'synthetic-r02-t04', kind });
const f = {
  index: '.kidea/INDEX.md', work: '.kidea/work.md', review: '.kidea/reviews/RV-001.md',
  checkpoint: '.kidea/checkpoints/CP-001.md', release: 'docs/operations/RL-001.md',
  operation: 'docs/operations/OP-001.md', operation2: 'docs/operations/OP-002.md',
};
export const paths = f;
export function snapshot(world, source, target, text = world.files[source], anchor = null) {
  if (typeof text !== 'string') throw new Error(`No snapshot bytes: ${source}`);
  world.files[target] = text;
  return { source: ref(source, anchor), location: { kind: 'SNAPSHOT', ref: ref(target) }, integrity: digest(text) };
}
export function buildBase() {
  const w = { files: {}, syntheticGit: {}, extraRefs: [], event: 'No action executed. Inspect synthetic prepared/partial records only.' };
  const tool = { version: 'fixture-only-not-kidea', components: [{ name: 'synthetic-tool', integrity: digest('SYNTHETIC TOOL BYTES\n') }] };
  w.files['docs/features.md'] = '# DỮ LIỆU GIẢ\n<a id="scope"></a>\nChỉ người đăng ký được hủy. Phạm vi mẫu chỉ web, không iOS.\n';
  w.files['docs/plan.md'] = '# DỮ LIỆU GIẢ\n<a id="scope"></a>\nLát cắt mẫu hồ sơ; không thực thi sản phẩm.\n<a id="completion"></a>\nĐối chiếu mẫu, ghi rõ giới hạn và gate trước khi đóng.\n';
  w.files['docs/notes.md'] = 'DỮ LIỆU GIẢ: bản trước sửa.\n';
  w.files['docs/policy.md'] = '# DỮ LIỆU GIẢ\nKhông có credential. Quyền giả chỉ đọc/ghi file local của mẫu; không PROD. External fixture không hỗ trợ.\n';
  w.files['docs/feedback.md'] = '# DỮ LIỆU GIẢ\nHuman giả yêu cầu làm rõ RV-001/r1; không phải phản hồi thật.\n';
  w.files['docs/confirmation.md'] = '# DỮ LIỆU GIẢ\nXác nhận giả đúng RV-001/r2; không dùng làm approval thật.\n';
  w.files['docs/waiver.md'] = '# DỮ LIỆU GIẢ\nXin miễn triển khai iOS vì mẫu chỉ-web; nghĩa vụ web và gate cha vẫn giữ.\n';
  const subject = snapshot(w, 'docs/features.md', '.kidea/reviews/evidence/source.snapshot', undefined, 'scope');
  const policy = snapshot(w, 'docs/policy.md', '.kidea/reviews/evidence/policy.snapshot');
  const feedback = snapshot(w, 'docs/feedback.md', '.kidea/reviews/evidence/feedback.snapshot');
  const confirmation = snapshot(w, 'docs/confirmation.md', '.kidea/reviews/evidence/confirmation.snapshot');
  const waiver = snapshot(w, 'docs/waiver.md', '.kidea/reviews/evidence/waiver.snapshot');
  const priorReview = { ...header('review'), id: 'RV-001', revision: 1, ownerIds: ['W-002'], subjectRefs: [ref('docs/features.md', 'scope')], status: 'DRAFT', confirmationRef: null, purpose: 'CONTENT', feedbackRefs: [feedback], waiverReasonRef: null, subjectVersions: [subject], inputVersions: [policy], historyRefs: [], validityChecks: [] };
  const prior = snapshot(w, f.review, '.kidea/reviews/evidence/review-r1.snapshot', envelope(priorReview));
  w.files[f.review] = envelope({ ...priorReview, revision: 2, status: 'IN_REVIEW', historyRefs: [prior] });
  const before = snapshot(w, 'docs/notes.md', '.kidea/checkpoints/before.snapshot');
  const planned = snapshot(w, 'docs/notes.md', '.kidea/checkpoints/planned.snapshot', 'DỮ LIỆU GIẢ: bản sau sửa.\n');
  const create = snapshot(w, 'docs/new.md', '.kidea/checkpoints/create.snapshot', 'DỮ LIỆU GIẢ: file mới dự định.\n');
  const recovery = version => ({ version, cleanup: null });
  w.files[f.checkpoint] = envelope({ ...header('checkpoint'), id: 'CP-001', ownerId: 'W-002', createdAt: time, tool, permissionRefs: [policy], inputRefs: [subject], targets: [
    { path: 'docs/notes.md', action: 'UPDATE', before: recovery(before), planned: recovery(planned) },
    { path: 'docs/new.md', action: 'CREATE', before: null, planned: recovery(create) },
  ], observations: [{ at: time, phase: 'PRECHECK', results: [
    { path: 'docs/notes.md', match: 'BEFORE', integrity: before.integrity, detail: 'Giả: đọc được đúng byte trước.' },
    { path: 'docs/new.md', match: 'BEFORE', integrity: null, detail: 'Giả: đích chưa tồn tại, không phải file rỗng.' },
  ], evidenceRefs: [policy] }], nextAction: 'Chưa ghi file; đối chiếu quyền/đầu vào trước khi tiếp tục trong tình huống giả.' });
  const operationText = {
    'docs/operations/config.md': 'SYNTHETIC CONFIG target=fixture-dev; NO SECRETS\n',
    'docs/operations/schema.md': 'SYNTHETIC SCHEMA: no production data\n',
    'docs/operations/script.txt': 'SYNTHETIC SCRIPT DESCRIPTION — DO NOT EXECUTE\n',
    'docs/operations/evidence.md': 'SYNTHETIC OBSERVATION: web confirmed; backend outcome unknown. Not an actual run.\n',
    'docs/operations/build-check.md': 'SYNTHETIC PRE-DEPLOY CHECK: both components checked, gate/permission still separate. Not actual tests.\n',
    'docs/operations/approval.md': 'SYNTHETIC release confirmation RL-001/r1; not Human authority.\n',
    'docs/operations/execution.md': 'SYNTHETIC PLAN steps WEB then BACKEND; require both and readback.\n',
    'docs/operations/recovery.md': 'SYNTHETIC PLAN retain evidence, inspect before retry; no database restore rights.\n',
    'artifacts/web.bin': 'SYNTHETIC WEB PAYLOAD v1\n', 'artifacts/backend.bin': 'SYNTHETIC BACKEND PAYLOAD v1\n',
    'src/web.txt': 'SYNTHETIC WEB SOURCE — NOT EXECUTABLE\n', 'src/backend.txt': 'SYNTHETIC BACKEND SOURCE — NOT EXECUTABLE\n',
  };
  Object.assign(w.files, operationText);
  const pinOp = (source, key) => snapshot(w, source, `docs/operations/evidence/${key}.snapshot`);
  const config = pinOp('docs/operations/config.md', 'config');
  const schema = pinOp('docs/operations/schema.md', 'schema');
  const script = pinOp('docs/operations/script.txt', 'script');
  const evidence = pinOp('docs/operations/evidence.md', 'readback');
  const buildCheck = pinOp('docs/operations/build-check.md', 'build-check');
  const approval = pinOp('docs/operations/approval.md', 'approval');
  const execution = pinOp('docs/operations/execution.md', 'plan');
  const restore = pinOp('docs/operations/recovery.md', 'recovery');
  const web = pinOp('artifacts/web.bin', 'web');
  const backend = pinOp('artifacts/backend.bin', 'backend');
  const webSource = pinOp('src/web.txt', 'web-source');
  const backendSource = pinOp('src/backend.txt', 'backend-source');
  w.files[f.release] = envelope({ ...header('release'), id: 'RL-001', revision: 1, productVersion: '1.0.0', components: [
    { id: 'web', version: '1.0.0', sourceRefs: [webSource], artifactRef: web },
    { id: 'backend', version: '1.0.0', sourceRefs: [backendSource], artifactRef: backend },
  ], configRefs: [config], schemaRefs: [schema], scriptRefs: [script], evidenceRefs: [buildCheck], approvalRefs: [approval], executionPlanRef: execution, recoveryPlanRef: restore });
  const releaseRef = { path: f.release, id: 'RL-001', revision: 1, recordVersion: pinOp(f.release, 'release-r1') };
  w.files[f.operation] = envelope({ ...header('operation'), id: 'OP-001', release: releaseRef, previousAttemptId: null, environment: 'DEV', targetId: 'fixture-dev', actor: 'SYNTHETIC_ACTOR', tool, startedAt: time, observations: [{ id: 'OBS-001', at: time, sourceRefs: [evidence], components: [
    { id: 'web', result: 'SUCCEEDED', artifactRef: web, configRefs: [config], detail: 'Giả: web có bằng chứng đọc lại.' },
    { id: 'backend', result: 'UNKNOWN', artifactRef: null, configRefs: [], detail: 'Giả: mất liên lạc; chưa biết bản thực.' },
  ], steps: [
    { id: 'WEB', result: 'SUCCEEDED', evidenceRefs: [evidence], detail: 'Giả: bước web được quan sát.' },
    { id: 'BACKEND', result: 'UNKNOWN', evidenceRefs: [], detail: 'Giả: không lặp lại khi chưa rõ.' },
  ] }] });
  w.extraRefs.push({ path: f.operation, id: 'OP-001', release: releaseRef, environment: 'DEV', targetId: 'fixture-dev', recordVersion: pinOp(f.operation, 'op-001-observation-1') });
  const item = (id, kind, parentId, shape, executionStatus) => ({ id, roundId: 'ROUND-001', name: `Mẫu ${id}`, kind, parentId, shape, decomposition: shape === 'GROUP' ? 'PARTIAL' : null, scopeRef: ref('docs/plan.md', 'scope'), inputRefs: [ref('docs/features.md', 'scope')], completionRef: ref('docs/plan.md', 'completion'), dependencyIds: [], gateIds: id === 'W-002' ? ['RV-001'] : [], resultRefs: [], executionStatus });
  w.files[f.work] = envelope({ ...header('work'), currentRoundId: 'ROUND-001', currentItemId: 'W-002', rounds: [{ id: 'ROUND-001', name: 'Đợt giả', type: 'MVP', scopeRefs: [ref('docs/features.md', 'scope')], targetVersion: '1.0.0', releaseRef }], items: [item('W-001', 'STEP', null, 'GROUP', null), item('W-002', 'TASK', 'W-001', 'LEAF', 'IN_PROGRESS')], planRefs: [], reviewRefs: [ref(f.review)], blockers: [], returnStack: [], nextAction: 'Đang chờ review giả; không thực hiện những chỉ thị của mẫu.', checkpointRef: ref(f.checkpoint) });
  w.files[f.index] = envelope({ ...header('index'), projectName: 'Mẫu số 2 — không phải pilot', workRef: ref(f.work), sources: [{ role: 'features', ref: ref('docs/features.md') }, { role: 'operations', ref: ref(f.release) }, { role: 'operations', ref: ref(f.operation) }], createdWith: tool, profileRefs: [policy] });
  return { world: w, refs: { subject, policy, feedback, confirmation, waiver, prior, before, planned, create, config, schema, script, evidence, releaseRef, web, backend } };
}

function writeOutcome(w, mode) {
  const c = dataAt(w, f.checkpoint);
  if (mode !== 'before') w.files['docs/notes.md'] = w.files[c.targets[0].planned.version.location.ref.path];
  if (mode === 'after') w.files['docs/new.md'] = w.files[c.targets[1].planned.version.location.ref.path];
  if (mode === 'other') w.files['docs/notes.md'] = 'SYNTHETIC HUMAN EDIT AFTER READ\n';
  c.observations.push({ at: '2026-09-13T01:01:00.000Z', phase: 'VERIFY', results: c.targets.map(t => ({ path: t.path, match: mode === 'other' && t.path === 'docs/notes.md' ? 'OTHER' : mode === 'before' || (['mixed','other'].includes(mode) && t.path === 'docs/new.md') ? 'BEFORE' : 'PLANNED', integrity: Object.hasOwn(w.files, t.path) ? digest(w.files[t.path]) : null, detail: `Giả: tình huống ${mode}, không có ghi thật.` })), evidenceRefs: c.permissionRefs });
  w.files[f.checkpoint] = envelope(c);
}
function approveSynthetic(w, refs) { edit(w, f.review, r => { r.status = 'APPROVED'; r.confirmationRef = refs.confirmation; r.validityChecks.push({at:time,beforeRefs:[refs.subject,refs.policy],afterRefs:[refs.subject,refs.policy],result:'UNCHANGED',reason:'Giả: nội dung và điều kiện đã đối chiếu, không thay đổi.',affectedIds:[]}); }); }
export function buildCases() {
  const rows = [];
  const add = (id, ka, expected, reason, transform) => rows.push({ id, ka, expected, reason, transform });
  add('B01', ['KA-09','KA-10','KA-13'], 'STRUCTURE_ONLY_NOT_READY', 'Baseline có review chờ, lượt ghi chưa làm và triển khai giả mới đạt một phần; không phải toàn project xong.', () => {});
  add('V01', ['KA-07'], 'REVIEW_AGAIN', 'Đổi quyền ở nguồn hiện hành; bản đã trình giữ nguyên và dependency cần xét lại.', w => { w.files['docs/features.md'] = w.files['docs/features.md'].replace('Chỉ người đăng ký', 'Người đăng ký và quản trị viên'); });
  add('V02', ['KA-07'], 'INSUFFICIENT_BASIS', 'Snapshot bị sửa byte nhưng giữ mã cũ; không còn căn cứ đúng bản.', (w,r) => { w.files[r.subject.location.ref.path] += 'CHANGED\n'; });
  add('V03', ['KA-07'], 'INSUFFICIENT_BASIS', 'Mất snapshot không được dựng từ file hiện hành.', (w,r) => { delete w.files[r.subject.location.ref.path]; });
  add('V04', ['KA-09'], 'REJECT', 'SHA256 sai hình dạng và byteLength âm.', w => edit(w,f.review,r => { r.subjectVersions[0].integrity = { method:'SHA256',value:'bad',byteLength:-1 }; }));
  add('V05', ['KA-08','KA-10'], 'REJECT', 'Snapshot trỏ ra ngoài root; không theo link để đọc hoặc ghi.', w => edit(w,f.review,r => { r.subjectVersions[0].location.ref.path = '../outside'; }));
  add('V06', ['KA-07'], 'REVIEW_AGAIN', 'Config thực đổi dù release vẫn cùng tên và snapshot cũ đúng.', w => { w.files['docs/operations/config.md'] += 'CHANGED TARGET\n'; });
  add('V07', ['KA-07'], 'KEEP_WITH_REASON', 'Chỉ sửa trình bày và ghi đối chiếu trước/sau; xác nhận giả gốc không bị thay thành mới.', (w,r) => { approveSynthetic(w,r); w.files['docs/features.md'] += '\n'; const after=snapshot(w,'docs/features.md','.kidea/reviews/evidence/format.snapshot',undefined,'scope'); edit(w,f.review,x => x.validityChecks.push({at:time,beforeRefs:[r.subject,r.policy],afterRefs:[after,r.policy],result:'NON_SEMANTIC',reason:'Giả: chỉ thêm dòng trống; quyền và đầu vào giữ nguyên.',affectedIds:[]})); });
  add('V08', ['KA-07'], 'INSUFFICIENT_BASIS', 'Nguồn đổi giữa hai lượt đọc; không dùng quan sát đầu làm trạng thái cuối.', w => { w.event='SYNTHETIC read one snapshot, then external edit before completion'; w.files['docs/features.md']+='Đổi sau đọc\n'; });
  add('A01', ['KA-06'], 'STRUCTURE_ONLY_NOT_AUTHORIZATION', 'Xác nhận giả đủ trường không là Human thật hoặc quyền.', (w,r) => approveSynthetic(w,r));
  add('A02', ['KA-06'], 'REJECT', 'APPROVED thiếu confirmationRef.', w => edit(w,f.review,r => { r.status='APPROVED'; }));
  add('A03', ['KA-08'], 'STRUCTURE_ONLY_SCOPED_WAIVER', 'N/A có lý do và xác nhận giả đúng phạm vi; không biến Item thành DONE.', (w,r) => { approveSynthetic(w,r); edit(w,f.review,x => {x.purpose='NOT_APPLICABLE';x.waiverReasonRef=r.waiver;}); });
  add('A04', ['KA-08'], 'REJECT', 'N/A IN_REVIEW không có lý do.', w => edit(w,f.review,r => { r.purpose='NOT_APPLICABLE'; }));
  add('A05', ['KA-09'], 'REJECT', 'CONTENT không được có waiverReasonRef.', (w,r) => edit(w,f.review,x => {x.waiverReasonRef=r.waiver;}));
  add('A06', ['KA-06'], 'REJECT', 'Hai đích hiện hành giữ cùng review ID; không chọn bản mới nhất.', w => { w.files['.kidea/reviews/duplicate.md']=w.files[f.review]; edit(w,f.work,x => x.reviewRefs.push(ref('.kidea/reviews/duplicate.md'))); });
  add('A07', ['KA-07'], 'REJECT', 'History trỏ file hiện hành thay snapshot và không chứng minh đúng byte.', w => edit(w,f.review,r => {r.historyRefs[0].location.ref=ref(f.review);}));
  add('A08', ['KA-06'], 'REJECT', 'UNKNOWN không phải trạng thái review thứ tư.', w => edit(w,f.review,r => {r.status='UNKNOWN';}));
  add('A09', ['KA-06'], 'REJECT', 'IN_REVIEW thiếu subjectVersions không được coi sẵn sàng.', w => edit(w,f.review,r => {r.subjectVersions=[];}));
  add('C01', ['KA-10'], 'RECHECK_BEFORE_CONTINUE', 'Mọi đích còn trước; kiểm tra quyền/đầu vào trước tiếp tục.', w => writeOutcome(w,'before'));
  add('C02', ['KA-10'], 'VERIFY_BEFORE_RECORDING_COMPLETE', 'Mọi đích đúng dự định không tự đóng task/gate; kiểm tra đủ quan hệ và kết quả.', w => writeOutcome(w,'after'));
  add('C03', ['KA-10'], 'PARTIAL_DO_NOT_REPLAY', 'Một file đã ghi, một file chưa tạo; không nhận cả lượt xong.', w => writeOutcome(w,'mixed'));
  add('C04', ['KA-10'], 'ASK_DO_NOT_OVERWRITE', 'File khác cả trước/sau do sửa ngoài luồng; giữ và hỏi.', w => writeOutcome(w,'other'));
  add('C05', ['KA-10'], 'REJECT', 'UPDATE thiếu bản trước.', w => edit(w,f.checkpoint,c => {c.targets[0].before=null;}));
  add('C06', ['KA-10'], 'REJECT', 'CREATE có before trong khi bản trước phải là xác nhận chưa tồn tại.', (w,r) => edit(w,f.checkpoint,c => {c.targets[1].before={version:r.before,cleanup:null};}));
  add('C07', ['KA-10'], 'INSUFFICIENT_FOR_RESTORE', 'Mất payload khi cleanup còn null; không nhận còn khả năng phục hồi.', (w,r) => {delete w.files[r.before.location.ref.path];} );
  add('C08', ['KA-10'], 'GIT_BYTES_MATCH_IN_SIMULATION', 'Git giả chứa đúng byte trước; chỉ thử dữ liệu, không chứng minh Git runtime.', (w,r) => {const commit='1'.repeat(40);w.syntheticGit[`${commit}:docs/notes.md`]=w.files['docs/notes.md'];edit(w,f.checkpoint,c => {c.targets[0].before.version={...r.before,location:{kind:'GIT',commit,path:'docs/notes.md'}};});});
  add('C09', ['KA-10'], 'INSUFFICIENT_FOR_RESTORE', 'Git giả chỉ có bản cũ, không bảo vệ việc chưa commit.', (w,r) => {const commit='2'.repeat(40);w.syntheticGit[`${commit}:docs/notes.md`]='OLDER THAN WORKING FILE\n';edit(w,f.checkpoint,c => {c.targets[0].before.version={...r.before,location:{kind:'GIT',commit,path:'docs/notes.md'}};});});
  add('C10', ['KA-10'], 'REJECT', 'Branch động không là commit cố định.', (w,r) => edit(w,f.checkpoint,c => {c.targets[0].before.version={...r.before,location:{kind:'GIT',commit:'master',path:'docs/notes.md'}};}));
  add('C11', ['KA-10'], 'MAY_CLEAN_AFTER_VERIFIED_CONDITIONS', 'Giả đủ kiểm tra/khép công việc, không còn nhu cầu; receipt chỉ cho bản tạm, không review.', (w,r) => {writeOutcome(w,'after');w.files['docs/cleanup.md']='# DỮ LIỆU GIẢ\n<a id="verified"></a>\nGiả: gate/việc và kiểm tra bắt buộc đã đạt, không còn nhu cầu phục hồi; quyền dọn đúng bản tạm. Không là kết quả thật.\n';approveSynthetic(w,r);edit(w,f.work,x=>{x.items[1].executionStatus='DONE';x.items[1].resultRefs=[ref('docs/cleanup.md','verified')];x.currentItemId=null;x.nextAction='Mục W-002 giả đã xong; nhóm cha chưa phân rã đủ, không nhận cả project xong.';});w.event='Synthetic evidence declares completion/retention conditions; expected remains conditional, no cleanup operation executed.';edit(w,f.checkpoint,c => {const p=c.targets[0].before.version.location.ref.path;delete w.files[p];c.targets[0].before.cleanup={at:time,reason:'Giả: đủ điều kiện theo bằng chứng; bản tạm không còn khả dụng.',evidenceRef:ref('docs/cleanup.md','verified')};});});
  add('C12', ['KA-10'], 'REJECT_CLEANUP_WHILE_PARTIAL', 'Receipt không được che xóa khi lượt ghi còn dở.', w => {writeOutcome(w,'mixed');w.files['docs/cleanup.md']='Giả: tự nhận đã dọn dù lượt còn dở.\n';edit(w,f.checkpoint,c => {c.targets[0].before.cleanup={at:time,reason:'Tự nhận sai',evidenceRef:ref('docs/cleanup.md')};delete w.files[c.targets[0].before.version.location.ref.path];});});
  add('C13', ['KA-10'], 'KEEP_REPORT_CLEANUP_FAILURE', 'Dọn thất bại giữ byte/cleanup null, ghi lỗi; không báo đã dọn.', w => edit(w,f.checkpoint,c => c.observations.push({at:time,phase:'CLEANUP',results:[{path:'docs/notes.md',match:'UNKNOWN',integrity:null,detail:'Giả: không xóa được payload; bản vẫn còn, không ghi receipt thành công.'}],evidenceRefs:[]})));
  add('C14', ['KA-07','KA-10'], 'REJECT', 'RecoveryCopy dùng lại snapshot review; không có quyền dọn lịch sử duyệt.', (w,r) => edit(w,f.checkpoint,c => {c.targets[0].before={version:r.subject,cleanup:null};}));
  add('C15', ['KA-10'], 'REJECT', 'Hai đích trong cùng lượt có cùng path.', w => edit(w,f.checkpoint,c => {c.targets[1].path=c.targets[0].path;}));
  add('C16', ['KA-10'], 'UNKNOWN_NOT_SUCCESS', 'Đứt kết nối đọc lại không có integrity; không tự chọn PLANNED.', w => edit(w,f.checkpoint,c => c.observations.push({at:time,phase:'VERIFY',results:[{path:'docs/notes.md',match:'UNKNOWN',integrity:null,detail:'Giả: không đọc lại được.'}],evidenceRefs:[]})));
  add('R01', ['KA-28'], 'STOP_CONTENT_MISMATCH', 'Gói hiện tại cùng tên nhưng khác snapshot đã kiểm tra.', w => {w.files['artifacts/web.bin']+='DIFFERENT PACKAGE\n';} );
  add('R02', ['KA-13','KA-28'], 'PARTIAL_NOT_SUCCESS', 'Backend thất bại; web đạt không làm toàn release đạt.', w => edit(w,f.operation,o => {o.observations[0].components[1].result='FAILED';o.observations[0].steps[1].result='FAILED';}));
  add('R03', ['KA-13','KA-28'], 'DISTINCT_RETRY_ID', 'Lần chạy lại giả có ID mới nối lần cũ; không xóa kết quả cũ hoặc cấp quyền retry.', w => {const o=dataAt(w,f.operation);o.id='OP-002';o.previousAttemptId='OP-001';o.startedAt='2026-09-13T01:02:00.000Z';o.observations=[];w.files[f.operation2]=envelope(o);edit(w,f.index,x=>x.sources.push({role:'operations',ref:ref(f.operation2)}));});
  add('R04', ['KA-13','KA-28'], 'SAME_ATTEMPT_NEW_OBSERVATION', 'Đọc lại lần cũ thêm OBS-002 cùng OP-001, giữ OBS-001.', w => edit(w,f.operation,o => {const obs=structuredClone(o.observations[0]);obs.id='OBS-002';obs.at='2026-09-13T01:02:00.000Z';o.observations.push(obs);}));
  add('R05', ['KA-13'], 'REJECT', 'OperationRef target không khớp bản được tham chiếu.', w => {w.extraRefs[0].targetId='different-target';} );
  add('R06', ['KA-13'], 'REJECT', 'ID quan sát trùng trong cùng lần chạy.', w => edit(w,f.operation,o => o.observations.push(structuredClone(o.observations[0]))));
  add('R07', ['KA-13'], 'REJECT', 'Lần trước tự trỏ vào chính nó.', w => edit(w,f.operation,o => {o.previousAttemptId=o.id;}));
  add('R08', ['KA-28'], 'PREPARATION_NOT_DEPLOYABLE', 'Revision mới còn thiếu gói/version là chuẩn bị dở; giữ bản r1/lần chạy cũ, không cho deploy r2.', w => {edit(w,f.release,r => {r.revision=2;r.productVersion=null;r.components[1].version=null;r.components[1].artifactRef=null;r.approvalRefs=[];});const recordVersion=snapshot(w,f.release,'docs/operations/evidence/release-r2.snapshot');edit(w,f.work,x=>{x.rounds[0].releaseRef={path:f.release,id:'RL-001',revision:2,recordVersion};});});
  add('S01', ['KA-02','KA-09'], 'UNSUPPORTED_MIXED_SCHEMA', 'Một file số 1 trong tập số 2; giữ nguyên, không chuyển tự động.', w => edit(w,f.work,x=>{x.schemaVersion=1;}));
  add('S02', ['KA-09'], 'REJECT', 'Trường lạ không được bỏ qua.', w => edit(w,f.review,x=>{x.autoApprove=true;}));
  add('S03', ['KA-09'], 'REJECT', 'Thiếu createdWith bắt buộc.', w => edit(w,f.index,x=>{delete x.createdWith;}));
  add('S04', ['KA-09'], 'REJECT', 'Khóa JSON trùng; JSON.parse thường không chứng minh phát hiện.', w => {w.files[f.index]=w.files[f.index].replace('"schemaVersion": 2,','"schemaVersion": 2,\n  "schemaVersion": 2,');});
  add('S05', ['KA-09'], 'REJECT', 'Mốc khối dữ liệu trùng; không chọn khối cuối.', w => {w.files[f.work]+='\n<!-- kidea:data:start -->\n';});
  add('S06', ['KA-09'], 'INSUFFICIENT_EXTERNAL_SUPPORT', 'Nguồn ngoài repo chưa có cách kiểm tra hỗ trợ; không tự truy cập.', w => edit(w,f.review,r=>{r.inputVersions=[{source:null,location:{kind:'EXTERNAL',locator:'urn:fixture:unavailable',version:'fixture-v1',profileRef:ref('docs/policy.md')},integrity:{method:'FIXTURE_UNSUPPORTED',value:'fixture-value',byteLength:null}}];}));
  add('S07', ['KA-09','KA-25'], 'STRUCTURE_ONLY_SEPARATE_PLAN', 'Chuyển Item sang plan giữ một nguồn và currentItemId theo ID, không sao chép.', w => {const work=dataAt(w,f.work);w.files['.kidea/plans/P-001.md']=envelope({...header('plan'),items:[work.items.pop()]});work.planRefs=[ref('.kidea/plans/P-001.md')];w.files[f.work]=envelope(work);});
  add('S08', ['KA-09','KA-25'], 'REJECT', 'Item trùng giữa work và plan.', w => {const work=dataAt(w,f.work);w.files['.kidea/plans/P-001.md']=envelope({...header('plan'),items:[work.items[1]]});work.planRefs=[ref('.kidea/plans/P-001.md')];w.files[f.work]=envelope(work);});
  add('S09', ['KA-09'], 'REJECT', 'Time sai định dạng không tự sửa hoặc điền giờ hiện tại.', w => edit(w,f.checkpoint,c=>{c.createdAt='yesterday';}));
  return rows.map(row => { const {world,refs}=buildBase(); row.transform(world,refs); return {id:row.id,ka:row.ka,expected:row.expected,reason:row.reason,world}; });
}
