import {validate} from './schema.mjs';
import {mapDigest} from './maps.mjs';
import {hashBytes as mapDigestBytes} from './bootstrap-plan.mjs';

const fail=code=>{throw Object.assign(new Error(code),{code});};
const text=v=>typeof v==='string'&&v.trim().length>0;
export const impactItemId=id=>'impact-'+mapDigest(id).slice(0,24);
export function validateImpactGraph(graph) {
  if(!graph||graph.format!=='kidea-impact-graph-r1'||!Array.isArray(graph.nodes)||!graph.nodes.length||!Array.isArray(graph.edges)||!Array.isArray(graph.seeds)||!graph.seeds.length||!Array.isArray(graph.diagnostics))fail('IMPACT_GRAPH_INVALID');
  const nodes=new Map();
  const ref=r=>validate(r,'Ref',()=>{});
  for(const node of graph.nodes) {
    if(!text(node.id)||nodes.has(node.id)||!text(node.name)||!ref(node.scopeRef)||!ref(node.completionRef)||!Array.isArray(node.inputRefs)||!node.inputRefs.length||!node.inputRefs.every(ref))fail('IMPACT_NODE_INVALID');nodes.set(node.id,node);
  }
  for(const edge of graph.edges)if(!nodes.has(edge.from)||!nodes.has(edge.to)||!text(edge.reason)||!Array.isArray(edge.evidenceRefs)||!edge.evidenceRefs.length||!edge.evidenceRefs.every(ref))fail('IMPACT_EDGE_INVALID');
  if(graph.seeds.some(id=>!nodes.has(id))||new Set(graph.seeds).size!==graph.seeds.length)fail('IMPACT_SEED_INVALID');
  return nodes;
}
export function affectedNodes(graph) {
  validateImpactGraph(graph);
  const found=new Set(),queue=[...graph.seeds];
  while(queue.length){const id=queue.shift();if(found.has(id))continue;found.add(id);queue.push(...graph.edges.filter(e=>e.from===id).map(e=>e.to));}
  return graph.nodes.filter(n=>found.has(n.id));
}
export function impactReferences(graph) {
  validateImpactGraph(graph);
  const refs=[...graph.nodes.flatMap(n=>[n.scopeRef,n.completionRef,...n.inputRefs]),...graph.edges.flatMap(e=>e.evidenceRefs)];
  return [...new Map(refs.map(r=>[JSON.stringify(r),r])).values()];
}
export function impactPlan(graph,{projectId,roundId,mapRef,parentId}) {
  if(!text(parentId))fail('IMPACT_PARENT_REQUIRED');
  return {schemaVersion:2,projectId,kind:'plan',items:affectedNodes(graph).map(node=>({id:impactItemId(node.id),roundId,name:node.name,kind:'TASK',parentId,shape:'LEAF',decomposition:null,
    scopeRef:node.scopeRef,inputRefs:[...node.inputRefs,mapRef],completionRef:node.completionRef,dependencyIds:[],gateIds:[],resultRefs:[],executionStatus:'TODO'}))};
}
export function assessmentCurrent(assessment,inputBasis,graphDigest) {
  return assessment?.format==='kidea-impact-assessment-r1'&&assessment.inputBasis===inputBasis&&assessment.graphDigest===graphDigest;
}
export function resumeImpactContext(items,reads) {
  return items.filter(i=>i.id.startsWith('impact-')).map(item=>{
    const latest=item.resultRefs.filter(r=>r.path.startsWith('.kidea/checkpoints/impact/')).at(-1);
    let assessment=null;
    try {if(latest)assessment=JSON.parse(reads.get(latest.path).toString('utf8'));}catch{}
    const versions=assessment?.inputVersionRefs;
    const current=assessment?.format==='kidea-impact-assessment-r1'&&Array.isArray(versions)&&versions.length>0&&versions.every(v=>
      validate(v,'VersionRef',()=>{})&&v.source&&reads.has(v.source.path)&&v.integrity.method==='SHA256'&&v.integrity.value===mapDigestBytes(reads.get(v.source.path)));
    return {itemId:item.id,recordedStatus:item.executionStatus,evidenceRef:latest??null,current:!!current,verdict:assessment?.verdict??'UNKNOWN',
      nextAction:!current?'Read change context and refresh stale obligations before evaluating.':assessment?.verdict==='UNKNOWN'?'Resolve the recorded unknown; no closure.':'Review current evidence and gates; do not infer execution authority.'};
  });
}
export function validateAssessment(value,node,graph,inputBasis) {
  const downstream=graph.edges.filter(e=>e.from===node.id).map(e=>e.to);
  if(!value||value.nodeId!==node.id||value.inputBasis!==inputBasis||!['NEEDS_CHANGE','NO_CHANGE','UNKNOWN'].includes(value.verdict)||!text(value.reason)||!text(value.behavior)||!text(value.assumptions)||!text(value.verification)||!Array.isArray(value.evidenceRefs)||!value.evidenceRefs.length||!value.evidenceRefs.every(r=>validate(r,'Ref',()=>{})))fail('ASSESSMENT_BASIS_REQUIRED');
  if(!Array.isArray(value.downstream)||!downstream.every(id=>value.downstream.includes(id))||value.downstream.some(id=>!downstream.includes(id)))fail('DOWNSTREAM_NOT_CONSIDERED');
  if(value.verdict!=='UNKNOWN'&&value.resolved!==true)fail('ASSESSMENT_NOT_RESOLVED');
  return value;
}
// A canary used only by finite fixtures/callers with explicit bounds. This is
// not a graph truncation policy or permission to close incomplete work.
export function progressCanary(history,{stagnantLimit,evaluationLimit}) {
  if(!Number.isSafeInteger(stagnantLimit)||stagnantLimit<1||!Number.isSafeInteger(evaluationLimit)||evaluationLimit<1)fail('CANARY_LIMITS_REQUIRED');
  const last=history.at(-1);let stagnant=0;
  for(let i=history.length-1;i>0&&mapDigest(history[i])===mapDigest(history[i-1]);i--)stagnant++;
  return {stop:history.length>=evaluationLimit||stagnant>=stagnantLimit,reason:history.length>=evaluationLimit?'EVALUATION_LIMIT':stagnant>=stagnantLimit?'NO_PROGRESS':null,preserveCheckpoint:true,canClose:false,last};
}

// Semantic classification comes from a reviewed caller; prose cannot classify
// itself or grant implementation authority. Result is a decision aid only.
export function intakeDecision(facts) {
  if(!facts||facts.ambiguous||facts.claim==='BUGFIX'&&facts.violatesApprovedSpec!==true)return {route:'ASK_SEMANTICS',canImplement:false};
  if(facts.duplicate===true)return {route:'EXISTING_REQUIREMENT',canImplement:false};
  if(facts.claim==='BUGFIX') {
    if(!facts.reproductionRef||!facts.runningSourceRef||!facts.runningConfigRef||!facts.runningArtifactRef)return {route:'VERIFY_RUNNING_BASELINE',canImplement:false};
    return {route:facts.masterMatchesRunning===true?'BUGFIX_MASTER':'BUGFIX_MAINTENANCE',canImplement:false,required:['reproduction','inherited-fixes','G2-candidate-and-combined','master-disposition','explicit-execution-permission']};
  }
  if(facts.selectedCurrentRound===true)return {route:'REPLAN_SAME_ROUND_STEP_1',canImplement:false,preserveValidWork:true};
  if(facts.prioritySwitch===true)return {route:'CHECKPOINT_THEN_SWITCH',canImplement:false,singleActiveWork:true};
  if(facts.irreversibleCurrentImpact===true)return {route:'HUMAN_MINIMAL_CURRENT_CHANGE',canImplement:false};
  return {route:'RECORD_FUTURE_INTENT',canImplement:false};
}
