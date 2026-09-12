import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const target = new URL('./scenarios.json', import.meta.url);
const before = readFileSync(target);
const data = JSON.parse(before.toString('utf8'));
assert.equal(data.fixtureVersion, 1);
assert.equal(data.synthetic, true);
assert.equal(data.kideaRuntimeRun, false);
assert.equal(data.cases.length, 29);
assert.equal(new Set(data.cases.map(c => c.id)).size, 29);
const counts = {};
for (const c of data.cases) {
  assert.match(c.id, /^(A|V|P)\d{2}$/);
  assert.match(c.case, /^KA-0[5-8]$/);
  for (const key of ['before', 'eventOrAfter', 'expected', 'reason']) {
    assert.equal(typeof c[key], 'string');
    assert.ok(c[key].trim().length > 0, `${c.id}.${key}`);
  }
  counts[c.case] = (counts[c.case] ?? 0) + 1;
}
assert.deepEqual(readFileSync(target), before);
console.log(JSON.stringify({catalogEntries: data.cases.length, counts,
  sha256: createHash('sha256').update(before).digest('hex'),
  unchanged: true, kideaRuntimeRun: false, semanticExpectedExecuted: false}, null, 2));
