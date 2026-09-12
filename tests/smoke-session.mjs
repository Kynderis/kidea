// Explicit, one-off AI smoke test; not part of the automatic unit-test command.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repo = fileURLToPath(new URL('../', import.meta.url));
const cli = process.argv[2];
if (!cli || process.argv.length !== 3) throw new Error('Pass the inspected Codex CLI executable path; this command starts one paid/account-usage AI session.');
const output = path.join(repo, '.test-output', 'r02-t01-s04');
mkdirSync(output, { recursive: false });
const snapshot = (directory) => {
  const result = {};
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (dir === directory && ['.git', '.tools', '.test-output'].includes(entry.name)) continue;
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Unexpected link: ${file}`);
      if (entry.isDirectory()) visit(file);
      else result[path.relative(directory, file)] = createHash('sha256').update(readFileSync(file)).digest('hex');
    }
  }
  visit(directory);
  return result;
};
const prompt = '$kidea status. Đây là dữ liệu giả để thử skill. Hãy dùng helper nếu skill hướng dẫn và báo trạng thái thực tế cùng giới hạn. Chỉ đọc, không sửa hoặc tạo file; không cài đặt, không gọi dịch vụ ngoài và không thực hiện công việc khác.';
const before = snapshot(repo);
writeFileSync(path.join(output, 'before.json'), JSON.stringify(before, null, 2));
const args = ['exec', '--ephemeral', '--sandbox', 'read-only', '--json', '--color', 'never', '-C', path.join(repo, 'tests', 'fixtures', 'r02-t01'), prompt];
const result = spawnSync(cli, args, { cwd: repo, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
writeFileSync(path.join(output, 'stdout.jsonl'), result.stdout ?? '');
writeFileSync(path.join(output, 'stderr.txt'), result.stderr ?? '');
const after = snapshot(repo);
writeFileSync(path.join(output, 'after.json'), JSON.stringify(after, null, 2));
const summary = { exitCode: result.status, error: result.error?.message ?? null, signal: result.signal, sourceUnchanged: JSON.stringify(before) === JSON.stringify(after), filesChecked: Object.keys(before).length };
writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
process.exitCode = result.status === 0 && summary.sourceUnchanged ? 0 : 1;
