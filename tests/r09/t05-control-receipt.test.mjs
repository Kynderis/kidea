import assert from 'node:assert/strict';
import {test} from 'node:test';
import {encodeReceipt, decodeReceipt} from './t03-integration/control-receipt.mjs';
const value = {id:2,action:'UNPAUSE_APP',status:'DONE',at:'2026-09-18T08:09:45.789Z'};
test('incomplete receipt remains pending until all exact bytes arrive', () => {
 const encoded = encodeReceipt(value);
 for (let n=0;n<encoded.length;n++) assert.equal(decodeReceipt(encoded.slice(0,n),2,value.action),null);
 assert.deepEqual(decodeReceipt(encoded,2,value.action),value);
});
test('corruption cannot acknowledge the owned fixture action', () => {
 const encoded = encodeReceipt(value);
 assert.equal(decodeReceipt(encoded+'x',2,value.action),null);
 assert.equal(decodeReceipt(encoded.replace('DONE','FAIL'),2,value.action),null);
});
test('complete receipt must match sequence, action and validated schema', () => {
 assert.throws(()=>decodeReceipt(encodeReceipt(value),1,value.action));
 assert.throws(()=>decodeReceipt(encodeReceipt(value),2,'PAUSE_APP'));
 assert.throws(()=>decodeReceipt(encodeReceipt({...value,status:'FAIL'}),2,value.action));
 assert.throws(()=>decodeReceipt(encodeReceipt({...value,at:'invalid'}),2,value.action));
 assert.throws(()=>decodeReceipt(encodeReceipt({...value,extra:true}),2,value.action));
});
