import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const digest = body => createHash('sha256').update(body).digest('hex');
export function encodeReceipt(value) {
 const body = JSON.stringify(value);
 return digest(body) + '\n' + body;
}
export function decodeReceipt(bytes, id, action) {
 const split = bytes.indexOf('\n');
 if (split !== 64) return null;
 const body = bytes.slice(split + 1);
 if (digest(body) !== bytes.slice(0, split)) return null;
 const value = JSON.parse(body);
 assert.deepEqual(Object.keys(value).sort(), ['action','at','id','status']);
 assert.equal(value.id,id); assert.equal(value.action,action);
 assert.equal(value.status,'DONE'); assert.ok(Number.isFinite(Date.parse(value.at)));
 return value;
}
