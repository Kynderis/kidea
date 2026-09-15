import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {summarizeProfile,profileCommand,profileRoot} from './profile.mjs';

function sample() {
  const frame=name=>({functionName:name,url:name==='(root)'?'':'node:fs',lineNumber:0,columnNumber:0});
  return {startTime:1000,endTime:1700,nodes:[{id:1,callFrame:frame('(root)'),children:[2]},{id:2,callFrame:frame('realpathSync'),children:[3,4]},{id:3,callFrame:frame('lstat')},{id:4,callFrame:frame('realpathSync')}],samples:[3,4,2],timeDeltas:[100,200,300]};
}
test('weighted profile separates self/inclusive and does not double-count recursive frames',()=>{
  const r=summarizeProfile(sample()),a=r.frames.find(f=>f.functionName==='realpathSync'),b=r.frames.find(f=>f.functionName==='lstat');
  assert.equal(r.sampledUs,600);assert.equal(r.durationUs,700);assert.equal(r.unattributedTailUs,100);
  assert.equal(a.selfUs,500);assert.equal(a.inclusiveUs,600);assert.equal(a.inclusiveSamples,3);assert.equal(b.selfUs,100);
  assert.equal(r.frames.reduce((n,f)=>n+f.selfUs,0),600);assert.equal(a.inclusivePercent,100);
});
test('profile preserves anonymous/native-like frames and zero-time samples',()=>{
  const p=sample();p.nodes[2].callFrame={functionName:'',url:'',lineNumber:-1,columnNumber:-1};p.timeDeltas[0]=0;
  const r=summarizeProfile(p);assert.equal(r.sampleCount,3);assert.equal(r.sampledUs,500);assert.ok(r.frames.some(f=>f.functionName===''&&f.selfSamples===1));
});
test('invalid or truncated samples are rejected, not converted into a successful profile',()=>{
  for(const mutate of [p=>p.samples.pop(),p=>p.samples[0]=999,p=>p.timeDeltas[0]=-1,p=>p.timeDeltas[0]=1e9,p=>p.endTime=p.startTime,p=>p.samples=[],p=>p.nodes.push(p.nodes[0])]){
    const p=sample();mutate(p);assert.throws(()=>summarizeProfile(p));
  }
});
test('missing child, multiple parents and unsampled cycles are rejected',()=>{
  for(const mutate of [p=>p.nodes[0].children.push(999),p=>p.nodes[0].children.push(3),p=>{p.nodes.push({id:5,callFrame:p.nodes[0].callFrame,children:[6]},{id:6,callFrame:p.nodes[0].callFrame,children:[5]});}]){const p=sample();mutate(p);assert.throws(()=>summarizeProfile(p));}
});
test('profile command fixes output outside the retained fixture and keeps public status entry',()=>{
  const command=profileCommand();assert.equal(command[0],process.execPath);assert.equal(command.at(-1),'status');
  assert.equal(command.filter(x=>x==='--cpu-prof').length,1);assert.ok(command.includes('--cpu-prof-interval=1000'));
  assert.ok(command.includes('--cpu-prof-name=QF-M-R02.cpuprofile'));assert.ok(command.includes('--cpu-prof-dir='+path.join(profileRoot,'profiles')));
  assert.match(command.at(-2),/[\\/]kidea\.mjs$/);assert.match(profileRoot,/[\\/]profile-r1$/);
});
test('unknown profiling action cannot create a root or start a diagnostic attempt',()=>{
  const before=existsSync(profileRoot),r=spawnSync(process.execPath,['tests/r02-t10/profile.mjs','reset'],{cwd:process.cwd(),encoding:'utf8',windowsHide:true});
  assert.equal(r.status,1);assert.match(r.stderr,/no retry\/reset\/recovery/);assert.equal(existsSync(profileRoot),before);
});
