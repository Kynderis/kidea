// Shared host adaptation for synthetic fixtures, never project execution policy.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolveGitExecutable } from '../../.agents/skills/kidea/scripts/git-versions.mjs';

export const directoryLinkType = process.platform === 'win32' ? 'junction' : 'dir';
// Git for Windows expects NUL, not Node's Win32-device spelling (\\.\nul).
const gitNullDevice = process.platform === 'win32' ? 'NUL' : '/dev/null';

export function fixtureGit(root, args, input) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith('GIT_')));
  Object.assign(env, { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: gitNullDevice, GIT_TERMINAL_PROMPT: '0' });
  const result = spawnSync(resolveGitExecutable(root), [
    '-c', `core.hooksPath=${gitNullDevice}`, '-c', 'commit.gpgsign=false', '-c', 'tag.gpgsign=false',
    '-c', 'core.autocrlf=false', ...args,
  ], { cwd: root, env, input, encoding: 'utf8', timeout: 15000, windowsHide: true });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `${args.join(' ')}: ${result.stderr}`);
  return result.stdout;
}
