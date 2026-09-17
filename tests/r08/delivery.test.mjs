import {test} from 'node:test';import assert from 'node:assert/strict';
import {deployment,compatible} from './delivery-r1/child.mjs';
test('one child supports both lab configs and rejects production/unknown image',()=>{
 const p={target:'lab-dev',component:'backend',name:'kidea-r08-b2-dev-backend',network:'kidea-r08-b2-net',image:'sha256:'+'a'.repeat(64),mounts:[],command:['/backend']};
 for(const target of ['lab-dev','lab-prod']){const a=deployment({...p,target});assert.ok(a.includes('--read-only'));assert.ok(a.includes('--pull=never'));assert.ok(!a.includes('-p'));assert.ok(a.includes('--user=1000:1000'));}
 assert.throws(()=>deployment({...p,target:'production'}));assert.throws(()=>deployment({...p,image:'latest'}));
});
test('schema and integrity mismatch blocks unchanged binary deployment',()=>{
 const e={schemaHex:'123',version:0,integrity:'ok'};compatible(e,e);
 for(const a of [{...e,schemaHex:'456'},{...e,version:1},{...e,integrity:'bad'}])assert.throws(()=>compatible(a,e));
});
