// Optional local Git reads only: no fetch, filters, hooks, commits, refs, index
// or worktree writes. A retained commit is a recovery source, not authorization.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync } from 'node:fs';
import path from 'node:path';
import { validPath } from './schema.mjs';

export const approvedGitExecutable = 'C:/Program Files/Git/cmd/git.exe';
const hash = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/;
const fail = code => { throw Object.assign(new Error(code), { code }); };
function git(root, args) {
  // Probe only the selected repository. Never discover a parent project's
  // metadata; an ordinary .git file remains valid for an explicit worktree.
  let entry;
  try { entry = lstatSync(path.join(root, '.git')); } catch { fail('GIT_UNAVAILABLE'); }
  if (entry.isSymbolicLink() || !entry.isDirectory() && !entry.isFile()) fail('GIT_UNAVAILABLE');
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith('GIT_')));
  const result = spawnSync(approvedGitExecutable, ['--no-optional-locks', '--no-lazy-fetch', ...args], {
    cwd: root, encoding: null, timeout: 10000, maxBuffer: 32 * 1024 * 1024, windowsHide: true,
    env: { ...env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null',
      GIT_NO_REPLACE_OBJECTS: '1', GIT_NO_LAZY_FETCH: '1', GIT_TERMINAL_PROMPT: '0', GIT_CEILING_DIRECTORIES: path.dirname(path.resolve(root)) }
  });
  if (result.error || result.status !== 0) fail('GIT_UNAVAILABLE');
  return result.stdout;
}
function checkRoot(root) {
  if (path.resolve(git(root, ['rev-parse', '--show-toplevel']).toString().trim()) !== path.resolve(root)) fail('GIT_ROOT_DIFFERS');
}
// Read-only checkout facts for resume. A caller must authorize Git reads.
export function readGitContext(root) {
  checkRoot(root);
  let head=null,branch=null;
  try{head=git(root,['rev-parse','--verify','HEAD^{commit}']).toString().trim();}catch{}
  try{branch=git(root,['symbolic-ref','--quiet','HEAD']).toString().trim();}catch{}
  const unmerged=git(root,['ls-files','--unmerged','-z']);
  const conflictPaths=[...new Set(unmerged.toString('utf8').split('\0').filter(Boolean).map(line=>line.slice(line.indexOf('\t')+1)))].sort();
  return {head,branch,unmerged:unmerged.length>0,conflictPaths};
}
export function readGitVersion(root, location) {
  if (location?.kind !== 'GIT' || !hash.test(location.commit) || !validPath(location.path)) fail('INVALID_GIT_VERSION');
  checkRoot(root);
  if (git(root, ['cat-file', '-t', location.commit]).toString().trim() !== 'commit') fail('GIT_COMMIT_REQUIRED');
  return git(root, ['cat-file', 'blob', `${location.commit}:${location.path}`]);
}
export function findGitVersion(root, relative, bytes, anchor = null) {
  if (!validPath(relative) || !Buffer.isBuffer(bytes)) fail('INVALID_GIT_VERSION');
  try {
    checkRoot(root);
    if (!git(root, ['symbolic-ref', '--quiet', 'HEAD']).toString().trim().startsWith('refs/heads/')) return null;
    const commit = git(root, ['rev-parse', '--verify', 'HEAD^{commit}']).toString().trim();
    if (!hash.test(commit)) return null;
    const refs = git(root, ['for-each-ref', `--contains=${commit}`, '--format=%(refname)', 'refs/heads', 'refs/tags']).toString().trim();
    if (!refs) return null;
    const location = { kind: 'GIT', commit, path: relative };
    if (!readGitVersion(root, location).equals(bytes)) return null;
    return { source: { path: relative, anchor }, location,
      integrity: { method: 'SHA256', value: createHash('sha256').update(bytes).digest('hex'), byteLength: bytes.length } };
  } catch { return null; }
}
