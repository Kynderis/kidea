// Checks fixture recipes, not Kidea's schema or runtime behavior.
// Builds virtual files in memory only; never writes or runs fixture instructions.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

assert.equal(process.versions.node.split('.')[0], '24');
const root = fileURLToPath(new URL('./', import.meta.url));
const baseRoot = path.join(root, 'base');
const manifest = JSON.parse(readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const base = new Map();
for (const entry of readdirSync(baseRoot, { recursive: true, withFileTypes: true })) {
  assert.ok(!entry.isSymbolicLink(), 'Fixture base must not contain links');
  if (!entry.isFile()) continue;
  const file = path.join(entry.parentPath, entry.name);
  base.set(path.relative(baseRoot, file).replaceAll(path.sep, '/'), readFileSync(file, 'utf8').replaceAll('\r\n', '\n'));
}
const snapshot = () => createHash('sha256').update(JSON.stringify([...base])).digest('hex');
const before = snapshot();
const start = '<!-- kidea:data:start -->\n```json\n';
const end = '\n```\n<!-- kidea:data:end -->';

function editData(text, mutation) {
  const left = text.indexOf(start);
  assert.ok(left >= 0, 'Recipe expects a valid baseline envelope');
  const bodyStart = left + start.length;
  const right = text.indexOf(end, bodyStart);
  assert.ok(right >= 0);
  const data = JSON.parse(text.slice(bodyStart, right));
  assert.ok(Array.isArray(mutation.path) && mutation.path.length > 0);
  let parent = data;
  for (const key of mutation.path.slice(0, -1)) {
    assert.ok(Object.hasOwn(parent, key), `Recipe parent missing: ${key}`);
    parent = parent[key];
  }
  const key = mutation.path.at(-1);
  assert.ok(!['__proto__', 'constructor', 'prototype'].includes(key));
  if (mutation.op === 'remove') {
    assert.ok(Object.hasOwn(parent, key), 'Cannot remove absent recipe field');
    assert.ok(!Array.isArray(parent), 'Array removal not used by this catalog');
    delete parent[key];
  } else {
    parent[key] = structuredClone(mutation.value);
  }
  return text.slice(0, bodyStart) + JSON.stringify(data, null, 2) + text.slice(right);
}

const ids = new Set();
const counts = {};
for (const entry of manifest.cases) {
  assert.ok(!ids.has(entry.id), 'Duplicate fixture ID');
  ids.add(entry.id);
  assert.ok(entry.title && entry.reason && entry.ka.length);
  counts[entry.expected] = (counts[entry.expected] ?? 0) + 1;
  const files = new Map(base);
  for (const mutation of entry.mutations) {
    // These are virtual map keys; payload paths are never resolved or followed.
    assert.ok(typeof mutation.file === 'string' && !mutation.file.includes('..'));
    assert.ok(!path.isAbsolute(mutation.file));
    if (mutation.op === 'addFile') {
      assert.ok(!files.has(mutation.file));
      files.set(mutation.file, mutation.content);
      continue;
    }
    assert.ok(files.has(mutation.file), `${entry.id}: recipe file missing`);
    if (mutation.op === 'removeFile') {
      files.delete(mutation.file);
    } else if (mutation.op === 'replaceText') {
      const text = files.get(mutation.file);
      assert.ok(mutation.find.length > 0);
      assert.equal(text.split(mutation.find).length - 1, 1, `${entry.id}: raw target must occur once`);
      files.set(mutation.file, text.replace(mutation.find, mutation.replace));
    } else {
      assert.ok(['set', 'remove'].includes(mutation.op));
      files.set(mutation.file, editData(files.get(mutation.file), mutation));
    }
  }
  // Deliberately do not parse/validate the corrupted result or compare a Kidea output.
  assert.ok(files.size > 0);
}
assert.equal(ids.size, 41);
assert.equal(counts.REJECT, 33);
assert.equal(snapshot(), before);
console.log(JSON.stringify({
  scope: 'fixture-recipe-integrity-only',
  baselineFiles: base.size,
  materializedInMemory: ids.size,
  expectedCategories: counts,
  baseMapUnchanged: true,
  kideaValidatorRun: false,
}, null, 2));
