import test from 'node:test';
import assert from 'node:assert/strict';
import {assertBudget,isOwnedRunLabel} from './backend-budget-r4.mjs';
const gib=1024**3;
const c=name=>({name,cpu:0.5,memory:gib});
test('Android and backend labels share the same quota authority',()=>{
 assert.equal(isOwnedRunLabel('A1-ANDROID-r1'),true);
 assert.equal(isOwnedRunLabel('E2-BW-r5'),true);
 assert.equal(isOwnedRunLabel('A1-ANDROID-r2'),false);
 assert.throws(()=>assertBudget([{name:'android',cpu:2,memory:4*gib}],[c('backend-client')]),/exceed/);
});
test('three services and one client fit the approved ceiling',()=>assert.equal(assertBudget(['backend','web','caddy'].map(c),[c('browser')]).memory,4*gib));
test('actual incident shape: second client rejected while browser remains live',()=>assert.throws(()=>assertBudget(['backend','web','caddy','browser'].map(c),[c('drain')]),/exceed/));
test('restarting an existing service does not double-count it',()=>assert.equal(assertBudget(['backend','web','caddy'].map(c),[c('backend')]).cpu,1.5));
test('unbounded or unknown quotas cannot pass preflight',()=>assert.throws(()=>assertBudget([{name:'unbounded',cpu:0,memory:gib}],[]),/Missing bounded/));
test('CPU and memory limits are enforced independently',()=>{
 assert.throws(()=>assertBudget([],[{name:'cpu',cpu:2.1,memory:gib}]),/exceed/);
 assert.throws(()=>assertBudget([],[{name:'memory',cpu:1,memory:5*gib}]),/exceed/);
});
