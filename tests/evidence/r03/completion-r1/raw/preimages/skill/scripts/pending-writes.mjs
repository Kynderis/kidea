import { lstatSync, readdirSync, realpathSync } from 'node:fs';
import path from 'node:path';

// Internal writer-discovery namespace, not an authoritative task/approval source.
// A future writer must create its pending child before any target mutation and
// retain it until the whole write has been reconciled. Status never cleans it.
// Once created, keep the registry directory itself: retiring a child must leave
// its change timestamps observable, not reset an absent registry back to absent.
export const pendingWritesPath = '.kidea/checkpoints/pending';
export class PendingWriteReadError extends Error {
  constructor(code) { super(code); this.code = code; }
}

export function inspectPendingWrites(root) {
  const components = pendingWritesPath.split('/');
  const identity = [];
  let target = root;
  try {
    for (const [index, segment] of components.entries()) {
      target = path.join(target, segment);
      let stat;
      try { stat = lstatSync(target, { bigint: true }); }
      catch (error) {
        if (error.code === 'ENOENT') return { pending: false, fingerprint: JSON.stringify([...identity, 'ABSENT', index]) };
        throw error;
      }
      // Never follow links in the discovery namespace, including dangling ones.
      if (stat.isSymbolicLink()) throw new PendingWriteReadError('UNSAFE_PENDING_PATH');
      if (!stat.isDirectory()) throw new PendingWriteReadError('PENDING_NOT_DIRECTORY');
      const relative = path.relative(root, realpathSync(target));
      if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new PendingWriteReadError('UNSAFE_PENDING_PATH');
      identity.push([String(stat.dev), String(stat.ino)]);
      if (index === components.length - 1) {
        const entries = readdirSync(target).sort();
        identity.push([String(stat.mtimeNs), String(stat.ctimeNs), entries]);
        // Any entry blocks, even an empty child directory, malformed journal or
        // unknown file. No scanning child content or interpreting DONE labels.
        return { pending: entries.length > 0, fingerprint: JSON.stringify(identity) };
      }
    }
  } catch (error) {
    if (error instanceof PendingWriteReadError) throw error;
    throw new PendingWriteReadError('PENDING_READ_FAILED');
  }
}
