// Read/write only disposable synthetic fixtures. Retain requests, results and bytes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const script = fileURLToPath(new URL('./mapping-probe.ps1', import.meta.url));
const pwsh = 'C:/Users/vuhoa/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const expectedHash = '362a356ce7f0940ec74f73a8fc2c990a2cc24a38a11c90bbd8eca947110ad139';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
assert.equal(process.platform, 'win32');
assert.equal(process.version, 'v24.21.0');
assert.equal(hash(readFileSync(pwsh)), expectedHash);
const output = path.join(repo, '.test-output', 'r02-t06');
mkdirSync(output, { recursive: true });
const runRoot = mkdtempSync(path.join(output, 'mapping-'));
const sources = ['mapping-probe.cs', 'mapping-probe.ps1', 'mapping.test.mjs'];
writeFileSync(path.join(runRoot, 'environment.json'), JSON.stringify({
  startedAt: new Date().toISOString(), node: process.version, nodePath: process.execPath,
  powershell: pwsh, powershellSha256: expectedHash,
  sources: sources.map(name => ({ name, sha256: hash(readFileSync(new URL(name, import.meta.url))) })),
  scope: 'Synthetic pre-existing writable mapped-view feasibility only; not writer acceptance',
}, null, 2));
console.log(`Mapping probe evidence: ${runRoot}`);
let sequence = 0;
const observations = [];

function start(request) {
  const id = String(++sequence).padStart(3, '0');
  const requestPath = path.join(runRoot, `${id}-request.json`);
  writeFileSync(requestPath, JSON.stringify(request, null, 2), { flag: 'wx' });
  const child = spawn(pwsh, ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', script,
    '-RequestPath', requestPath], { cwd: repo, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdout.setEncoding('utf8'); child.stderr.setEncoding('utf8');
  let stdout = '', stderr = '', pending = '';
  const events = [], waiters = [], consumed = new Set();
  const timeout = setTimeout(() => child.kill(), 45000);
  child.stdout.on('data', text => {
    stdout += text; pending += text;
    while (pending.includes('\n')) {
      const end = pending.indexOf('\n'), line = pending.slice(0, end).trim();
      pending = pending.slice(end + 1);
      if (!line) continue;
      try {
        const value = JSON.parse(line); events.push(value);
        for (const waiter of [...waiters]) if (waiter.event === value.event || value.event === 'error') {
          waiters.splice(waiters.indexOf(waiter), 1);
          consumed.add(value);
          value.event === 'error' ? waiter.reject(new Error(value.message)) : waiter.resolve(value);
        }
      } catch { /* Preserve all non-JSON diagnostics in stdout. */ }
    }
  });
  child.stderr.on('data', text => { stderr += text; });
  child.on('error', error => { stderr += String(error); });
  const done = new Promise(resolve => child.on('close', (code, signal) => {
    clearTimeout(timeout);
    const result = { id, pid: child.pid, code, signal, events, stdout, stderr };
    writeFileSync(path.join(runRoot, `${id}-result.json`), JSON.stringify(result, null, 2));
    for (const waiter of waiters.splice(0)) waiter.reject(new Error(`Child closed: ${JSON.stringify(result)}`));
    resolve(result);
  }));
  return { done, wait(event) {
    const found = events.find(value => value.event === event && !consumed.has(value));
    if (found) { consumed.add(found); return Promise.resolve(found); }
    return new Promise((resolve, reject) => waiters.push({ event, resolve, reject }));
  }, command(command) { child.stdin.write(JSON.stringify(command) + '\n'); },
  async release() { child.stdin.end(JSON.stringify({ action: 'release' }) + '\n'); return await done; } };
}

for (const leaseRole of ['target', 'input']) {
  for (const level of [0, 7, 3]) {
    for (const mapping of ['none', 'handles-open', 'handles-closed']) {
      const label = `${leaseRole}-level${level}-${mapping}`;
      test(label, { timeout: 40000 }, async () => {
        const directory = mkdtempSync(path.join(runRoot, `${label}-`));
        const file = path.join(directory, 'fixture.bin');
        const seed = Buffer.alloc(4096, 0x2e);
        seed.write('ORIGINAL_PREFIX_0123456789ABCDEF__');
        writeFileSync(file, seed, { flag: 'wx' });
        const beforeHash = hash(seed);
        const mapper = mapping === 'none' ? null : start({ role: 'mapper', path: file, closeOriginalHandles: mapping === 'handles-closed' });
        let lease;
        const observed = { label, leaseRole, level, mapping, beforeHash, file };
        try {
          if (mapper) observed.mapper = await mapper.wait('ready');
          if (mapping === 'handles-closed') {
            assert.equal(observed.mapper.originalHandlesClosed, true);
            mapper.command({ action: 'write', text: 'MAPPING_ALIVE_0123456789ABCDEF__' });
            observed.liveViewWrite = await mapper.wait('written');
            assert.equal(observed.liveViewWrite.prefix, 'MAPPING_ALIVE_0123456789ABCDEF__');
          }
          lease = start({ role: 'lease', path: file, leaseRole, level });
          observed.lease = await lease.wait('ready');
          if (mapping === 'none') {
            assert.equal(observed.lease.opened, true, 'normal file opens');
            if (level) assert.equal(observed.lease.oplockGranted, true, 'normal file grants requested oplock');
          } else if (mapping === 'handles-open') {
            assert.equal(observed.lease.opened, false, 'original writable handle conflicts with lease');
            assert.equal(observed.lease.openError, 32);
          } else if (observed.lease.opened) {
            mapper.command({ action: 'write', text: 'MAPPED_MUTATION_0123456789ABCDEF__' });
            observed.mappedWrite = await mapper.wait('written');
            lease.command({ action: 'read' });
            observed.readWhileLeased = await lease.wait('read');
            assert.equal(observed.readWhileLeased.prefix, observed.mappedWrite.prefix,
              'same leased handle observes the already-mapped writer modification');
            assert.notEqual(observed.readWhileLeased.prefix, observed.lease.prefix);
            assert.fail('closed-original-handles writable mapped view bypassed lease admission');
          } else {
            assert.equal(observed.lease.openError, 32,
              'closed-original-handles writable mapped view still prevents lease admission');
          }
        } finally {
          if (lease) { observed.leaseResult = await lease.release(); assert.equal(observed.leaseResult.code, 0); }
          if (mapper) { observed.mapperResult = await mapper.release(); assert.equal(observed.mapperResult.code, 0); }
          observed.afterHash = hash(readFileSync(file));
          observed.afterPrefix = readFileSync(file).subarray(0, 32).toString('utf8');
          if (mapping === 'handles-closed') {
            assert.notEqual(observed.afterHash, beforeHash, 'closed-handle view really mutated the backing file');
            const afterUnmap = start({ role: 'lease', path: file, leaseRole, level });
            try {
              observed.afterUnmapLease = await afterUnmap.wait('ready');
              assert.equal(observed.afterUnmapLease.opened, true, 'same lease admits after last view is unmapped');
              assert.equal(observed.afterUnmapLease.prefix, observed.afterPrefix);
              if (level) assert.equal(observed.afterUnmapLease.oplockGranted, true);
            } finally {
              observed.afterUnmapResult = await afterUnmap.release();
              assert.equal(observed.afterUnmapResult.code, 0);
            }
          }
          observations.push(observed);
          writeFileSync(path.join(runRoot, 'observations.json'), JSON.stringify(observations, null, 2));
          console.log(JSON.stringify({ label, opened: observed.lease?.opened, openError: observed.lease?.openError,
            oplockGranted: observed.lease?.oplockGranted, oplockError: observed.lease?.oplockError,
            mutationWhileLeased: !!observed.readWhileLeased, oplockSignaledAfter: observed.readWhileLeased?.oplockSignaled }));
        }
      });
    }
  }
}
