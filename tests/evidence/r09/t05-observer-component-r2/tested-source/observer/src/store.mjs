import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
const digest = data => createHash('sha256').update(data).digest('hex');
const noFollow = fs.constants.O_NOFOLLOW ?? 0;
const syncDir = dir => { const fd = fs.openSync(dir, 'r'); try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); } };
function privateFile(file) {
  const st = fs.lstatSync(file);
  if (!st.isFile() || st.isSymbolicLink() || (typeof process.getuid === 'function' && st.uid !== process.getuid())
    || (st.mode & 0o077) !== 0) throw new Error('STATE_PERMISSION');
}
// One local writer, private owned directory, no sync/network filesystem; never rewrite a bad checkpoint.
export class SnapshotStore {
  constructor(directory, { limitBytes = 2 * 1024 ** 2 } = {}) {
    this.directory = fs.realpathSync(directory);
    const st = fs.lstatSync(directory);
    if (!st.isDirectory() || st.isSymbolicLink() || (st.mode & 0o077) !== 0
      || (typeof process.getuid === 'function' && st.uid !== process.getuid())) throw new Error('STATE_PERMISSION');
    if (!Number.isSafeInteger(limitBytes) || limitBytes <= 0) throw new Error('STATE_LIMIT');
    this.limitBytes = limitBytes; this.file = path.join(this.directory, 'observer.json');
    this.lock = path.join(this.directory, 'observer.lock'); this.lockToken = randomUUID();
    if (fs.existsSync(this.lock)) {
      privateFile(this.lock); const bytes = fs.readFileSync(this.lock, 'utf8');
      let old; try { old = JSON.parse(bytes); } catch { throw new Error('STATE_LOCK'); }
      if (old.host !== os.hostname() || !Number.isSafeInteger(old.pid) || old.pid <= 0) throw new Error('STATE_LOCK');
      let dead = false;
      try { process.kill(old.pid, 0); } catch (error) { dead = error.code === 'ESRCH'; }
      if (!dead || fs.readFileSync(this.lock, 'utf8') !== bytes) throw new Error('STATE_LOCK');
      // Only reclaim a proven dead owned local PID lock; retain all data and orphan temp files.
      fs.unlinkSync(this.lock); syncDir(this.directory);
    }
    const fd = fs.openSync(this.lock, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollow, 0o600);
    try { fs.writeFileSync(fd, JSON.stringify({ token: this.lockToken, pid: process.pid, host: os.hostname() })); fs.fsyncSync(fd); }
    finally { fs.closeSync(fd); } syncDir(this.directory);
  }
  load() {
    if (!fs.existsSync(this.file)) return null;
    privateFile(this.file);
    const fd = fs.openSync(this.file, fs.constants.O_RDONLY | noFollow);
    let record;
    try {
      if (fs.fstatSync(fd).size > this.limitBytes) throw new Error('STATE_LIMIT');
      record = JSON.parse(fs.readFileSync(fd, 'utf8'));
    } catch { throw new Error('STATE_INVALID'); } finally { fs.closeSync(fd); }
    if (!record || Object.keys(record).sort().join('|') !== 'payload|sha256'
      || typeof record.payload !== 'string' || digest(record.payload) !== record.sha256) throw new Error('STATE_INVALID');
    try { return JSON.parse(record.payload); } catch { throw new Error('STATE_INVALID'); }
  }
  save(state) {
    const payload = JSON.stringify(state), bytes = JSON.stringify({ payload, sha256: digest(payload) }) + '\n';
    if (Buffer.byteLength(bytes) > this.limitBytes) throw new Error('STATE_LIMIT');
    if (fs.existsSync(this.file)) privateFile(this.file);
    const temp = path.join(this.directory, 'observer-' + randomUUID() + '.tmp');
    const fd = fs.openSync(temp, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollow, 0o600);
    try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    fs.renameSync(temp, this.file); syncDir(this.directory);
  }
  close() {
    if (!fs.existsSync(this.lock)) return;
    privateFile(this.lock); const v = JSON.parse(fs.readFileSync(this.lock, 'utf8'));
    if (v.token !== this.lockToken) throw new Error('STATE_LOCK');
    fs.unlinkSync(this.lock); syncDir(this.directory);
  }
}
