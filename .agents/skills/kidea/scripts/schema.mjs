// Closed schema descriptors: no coercion, defaults, or unknown fields.
export const schemas = {};
const s = schemas;
s.Ref = { path:'Path', anchor:'Text?' };
s.Integrity = { method:'Text', value:'Text', byteLength:'UInt?' };
s.SNAPSHOT = {kind:'=SNAPSHOT',ref:'Ref'};
s.GIT = {kind:'=GIT',commit:'Text',path:'Path'};
s.EXTERNAL = {kind:'=EXTERNAL',locator:'Text',version:'Text',profileRef:'Ref'};
s.VersionRef = {source:'Ref?',location:'Location',integrity:'Integrity'};
s.ToolComponent = {name:'Text',integrity:'Integrity'};
s.ToolIdentity = {version:'Text',components:'ToolComponent[]'};
s.Source = {role:'Text',ref:'Ref'};
s.ReleaseRef = {path:'Path',id:'Text',revision:'Positive',recordVersion:'VersionRef'};
s.OperationRef = {path:'Path',id:'Text',release:'ReleaseRef',environment:'Text',targetId:'Text',recordVersion:'VersionRef'};
s.Round = {id:'Text',name:'Text',type:'=MVP|CHANGE|BUGFIX',scopeRefs:'Ref[]',targetVersion:'Text?',releaseRef:'ReleaseRef?'};
s.Item = {id:'Text',roundId:'Text',name:'Text',kind:'=STEP|PHASE|TASK|SUBTASK',parentId:'Text?',shape:'=GROUP|LEAF',decomposition:'=UNEXPANDED|PARTIAL|COMPLETE?',scopeRef:'Ref',inputRefs:'Ref[]',completionRef:'Ref',dependencyIds:'Text[]',gateIds:'Text[]',resultRefs:'Ref[]',executionStatus:'=TODO|IN_PROGRESS|DONE?'};
s.Blocker = {itemId:'Text?',reason:'Text',needed:'Text'};
s.ReturnPoint = {itemId:'Text',reason:'Text',nextAction:'Text'};
s.ValidityCheck = {at:'Time',beforeRefs:'VersionRef[]',afterRefs:'VersionRef[]',result:'=UNCHANGED|NON_SEMANTIC|REOPEN|UNKNOWN',reason:'Text',affectedIds:'Text[]'};
s.CleanupReceipt = {at:'Time',reason:'Text',evidenceRef:'Ref'};
s.RecoveryCopy = {version:'VersionRef',cleanup:'CleanupReceipt?'};
s.WriteTarget = {path:'Path',action:'=CREATE|UPDATE',before:'RecoveryCopy?',planned:'RecoveryCopy'};
s.WriteResult = {path:'Path',match:'=BEFORE|PLANNED|OTHER|UNKNOWN',integrity:'Integrity?',detail:'Text'};
s.WriteObservation = {at:'Time',phase:'=PRECHECK|WRITE|VERIFY|RESTORE|CLEANUP',results:'WriteResult[]',evidenceRefs:'VersionRef[]'};
s.ReleaseComponent = {id:'Text',version:'Text?',sourceRefs:'VersionRef[]',artifactRef:'VersionRef?'};
s.ComponentResult = {id:'Text',result:'=NOT_STARTED|UNKNOWN|FAILED|SUCCEEDED',artifactRef:'VersionRef?',configRefs:'VersionRef[]',detail:'Text'};
s.StepResult = {id:'Text',result:'=NOT_STARTED|UNKNOWN|FAILED|SUCCEEDED',evidenceRefs:'VersionRef[]',detail:'Text'};
s.OperationObservation = {id:'Text',at:'Time',sourceRefs:'VersionRef[]',components:'ComponentResult[]',steps:'StepResult[]'};
const header = kind => ({schemaVersion:'=2',projectId:'Text',kind:`=${kind}`});
s.index = {...header('index'),projectName:'Text',workRef:'Ref',sources:'Source[]',createdWith:'ToolIdentity',profileRefs:'VersionRef[]'};
s.work = {...header('work'),currentRoundId:'Text',currentItemId:'Text?',rounds:'Round[]',items:'Item[]',planRefs:'Ref[]',reviewRefs:'Ref[]',blockers:'Blocker[]',returnStack:'ReturnPoint[]',nextAction:'Text',checkpointRef:'Ref?'};
s.plan = {...header('plan'),items:'Item[]'};
s.review = {...header('review'),id:'Text',revision:'Positive',ownerIds:'Text[]',subjectRefs:'Ref[]',status:'=DRAFT|IN_REVIEW|APPROVED',confirmationRef:'VersionRef?',purpose:'=CONTENT|NOT_APPLICABLE',feedbackRefs:'VersionRef[]',waiverReasonRef:'VersionRef?',subjectVersions:'VersionRef[]',inputVersions:'VersionRef[]',historyRefs:'VersionRef[]',validityChecks:'ValidityCheck[]'};
s.checkpoint = {...header('checkpoint'),id:'Text',ownerId:'Text',createdAt:'Time',tool:'ToolIdentity',permissionRefs:'VersionRef[]',inputRefs:'VersionRef[]',targets:'WriteTarget[]',observations:'WriteObservation[]',nextAction:'Text'};
s.release = {...header('release'),id:'Text',revision:'Positive',productVersion:'Text?',components:'ReleaseComponent[]',configRefs:'VersionRef[]',schemaRefs:'VersionRef[]',scriptRefs:'VersionRef[]',evidenceRefs:'VersionRef[]',approvalRefs:'VersionRef[]',executionPlanRef:'VersionRef',recoveryPlanRef:'VersionRef'};
s.operation = {...header('operation'),id:'Text',release:'ReleaseRef',previousAttemptId:'Text?',environment:'Text',targetId:'Text',actor:'Text',tool:'ToolIdentity?',startedAt:'Time?',observations:'OperationObservation[]'};

export function validPath(value) {
  return typeof value === 'string' && value.trim().length > 0 && !/[\\:\x00-\x1f]/.test(value) &&
    !value.startsWith('/') && value.split('/').every(p => p && p !== '.' && p !== '..' && !/[. ]$/.test(p) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p));
}
export function validate(value, type, report, field = '') {
  if (type.endsWith('?')) return value === null || validate(value,type.slice(0,-1),report,field);
  const fail = () => { report('SCHEMA',field); return false; };
  if (type.endsWith('[]')) {
    if (!Array.isArray(value)) return fail();
    return value.map((v,i)=>validate(v,type.slice(0,-2),report,`${field}[${i}]`)).every(Boolean);
  }
  if (type[0] === '=') return (type === '=2' ? value === 2 : type.slice(1).split('|').includes(value)) || fail();
  if (type === 'Text') return (typeof value === 'string' && value.trim().length > 0) || fail();
  if (type === 'Path') return validPath(value) || fail();
  if (type === 'UInt' || type === 'Positive') return (Number.isSafeInteger(value) && value >= (type === 'UInt' ? 0 : 1)) || fail();
  if (type === 'Time') return (typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value) || fail();
  if (type === 'Location') {
    if (!['SNAPSHOT','GIT','EXTERNAL'].includes(value?.kind)) return fail();
    return validate(value,value.kind,report,field);
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail();
  const descriptor = s[type];
  let ok = true;
  for (const key of Object.keys(value)) if (!Object.hasOwn(descriptor,key)) {report('UNKNOWN_FIELD',`${field}.${key}`);ok=false;}
  for (const [key,child] of Object.entries(descriptor)) if (!validate(value[key],child,report,`${field}.${key}`)) ok=false;
  return ok;
}
