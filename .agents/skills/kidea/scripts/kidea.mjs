// R02-T01 scaffold: no project reads, writes, or implemented workflow actions.
const actions = ['init', 'resume', 'status', 'approve', 'change', 'visualize'];
const args = process.argv.slice(2);
const [action] = args;

if (process.versions.node.split('.')[0] !== '24') {
  console.error(JSON.stringify({ code: 'UNSUPPORTED_RUNTIME', message: 'Use the approved Node.js 24 runtime.' }));
  process.exitCode = 2;
} else if (action === '--help' && args.length === 1) {
  console.log(JSON.stringify({ stage: 'R02-T01 scaffold', actions, implemented: [], help: 'All product actions are not implemented. No project files are read or written.' }));
} else if (!actions.includes(action) || args.some((arg) => arg.startsWith('-')) ||
  (['resume', 'status', 'visualize'].includes(action) && args.length !== 1)) {
  console.error(JSON.stringify({ code: 'INVALID_ARGUMENTS', message: 'Use --help alone or a known action. This scaffold has no product functionality.' }));
  process.exitCode = 2;
} else {
  console.error(JSON.stringify({ code: 'NOT_IMPLEMENTED', action, message: 'Chức năng chưa được triển khai. Không đọc hoặc sửa hồ sơ project.' }));
  process.exitCode = 3;
}
