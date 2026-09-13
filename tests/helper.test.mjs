import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const helper = fileURLToPath(new URL('../.agents/skills/kidea/scripts/kidea.mjs', import.meta.url));
const fixture = fileURLToPath(new URL('./fixtures/r02-t01/', import.meta.url));
const snapshot = (root) => Object.fromEntries(readdirSync(root, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile()).map((entry) => {
    const file = path.join(entry.parentPath, entry.name);
    return [path.relative(root, file), createHash('sha256').update(readFileSync(file)).digest('hex')];
  }));

const cases = [
  { args: ['--help'], status: 0 },
  ...['init', 'resume', 'approve', 'change', 'visualize'].map((action) => ({ args: [action], status: 3, code: 'NOT_IMPLEMENTED' })),
  { args: ['init', 'Ý tưởng có dấu và khoảng trắng'], status: 3, code: 'NOT_IMPLEMENTED' },
  { args: ['approve', 'R99-T01-S01'], status: 3, code: 'NOT_IMPLEMENTED' },
  ...[[], ['unknown'], ['--help', 'init'], ['status', 'unexpected'], ['resume', '--force'], ['init', '--write'], ['visualize', '../outside']]
    .map((args) => ({ args, status: 2, code: 'INVALID_ARGUMENTS' })),
];

for (const entry of cases) {
  test(`scaffold ${JSON.stringify(entry.args)}`, () => {
    assert.equal(process.versions.node.split('.')[0], '24');
    const before = snapshot(fixture);
    const result = spawnSync(process.execPath, [helper, ...entry.args], { cwd: fixture, encoding: 'utf8', timeout: 5000 });
    assert.ifError(result.error);
    assert.equal(result.status, entry.status, result.stderr);
    const response = JSON.parse(entry.status === 0 ? result.stdout : result.stderr);
    if (entry.code) assert.equal(response.code, entry.code);
    else assert.deepEqual(response.implemented, ['status']);
    assert.equal(entry.status === 0 ? result.stderr : result.stdout, '');
    assert.deepEqual(snapshot(fixture), before);
  });
}
