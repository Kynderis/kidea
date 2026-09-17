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
  { args: ['visualize'], status: 3, code: 'NOT_IMPLEMENTED' },
  { args: ['change'], status: 1, code: 'CHANGE_INPUT_INVALID' },
  { args: ['resume'], status: 1, code: 'RESUME_INPUT_INVALID' },
  { args: ['approve'], status: 1, code: 'REVIEW_INPUT_INVALID' },
  { args: ['init'], status: 1, code: 'INIT_INPUT_INVALID' },
  { args: ['init', 'Ý tưởng có dấu và khoảng trắng'], status: 2, code: 'INVALID_ARGUMENTS' },
  { args: ['approve', 'R99-T01-S01'], status: 2, code: 'INVALID_ARGUMENTS' },
  ...[[], ['unknown'], ['--help', 'init'], ['status', 'unexpected'], ['resume', '--force'], ['init', '--write'], ['visualize', '../outside']]
    .map((args) => ({ args, status: 2, code: 'INVALID_ARGUMENTS' })),
];

for (const entry of cases) {
  test(`scaffold ${JSON.stringify(entry.args)}`, () => {
    assert.ok(Number(process.versions.node.split('.')[0]) >= 24, 'Node.js 24 or newer is required');
    const before = snapshot(fixture);
    const result = spawnSync(process.execPath, [helper, ...entry.args], { cwd: fixture, input:'', encoding: 'utf8', timeout: 10000, windowsHide:true });
    assert.ifError(result.error);
    assert.equal(result.status, entry.status, result.stderr);
    const response = JSON.parse(entry.status === 0 ? result.stdout : result.stderr);
    if (entry.code) assert.equal(response.code, entry.code);
    else assert.deepEqual(response.implemented, ['status','init','approve','resume','change']);
    assert.equal(entry.status === 0 ? result.stderr : result.stdout, '');
    assert.deepEqual(snapshot(fixture), before);
  });
}
