// Explicit finite AI trial. Never called by npm test; each run consumes account usage.
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync, createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildCases } from './fixtures/r02-t04/catalog.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(repo, '.test-output/r02-t05/ai-trial-1');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const save = (name, data) => writeFileSync(path.join(output, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2), { flag: 'wx' });
function tree(root, excluded = []) {
  const result = {};
  function visit(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
      if (dir === root && excluded.includes(entry.name)) continue;
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Unexpected link: ${file}`);
      if (entry.isDirectory()) visit(file);
      else result[path.relative(root, file).replaceAll('\\','/')] = hash(readFileSync(file));
    }
  }
  visit(root); return result;
}
const sourceHashes = () => ({ ...tree(repo, ['.git','.tools','.test-output']), '$runtime': hash(readFileSync(process.execPath)) });
const inputHashes = () => tree(path.join(output, 'worlds'));
const [mode, cli] = process.argv.slice(2);
if (!['prepare','run'].includes(mode) || !cli || process.argv.length !== 4) throw new Error('Usage: approved-node tests/status-ai-trial.mjs prepare|run inspected-codex.exe');
if (mode === 'prepare') {
  mkdirSync(output, { recursive: false });
  for (const id of ['B01','A01','V03']) {
    const row = buildCases().find(c => c.id === id);
    for (const [relative, bytes] of Object.entries(row.world.files)) {
      const file = path.join(output, 'worlds', id, relative);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, bytes, { flag: 'wx' });
    }
  }
  const skill = path.join(repo, '.agents/skills/kidea/SKILL.md');
  const roots = ['B01','A01','V03'].map(id => path.join(output,'worlds',id));
  const prompt = `$kidea status. Dùng skill tại ${skill}. Đây là một lượt thử chỉ đọc được Human cho phép. Hãy lần lượt xem trạng thái ba project giả sau (mỗi đường dẫn là project root riêng):\n${roots.join('\n')}\nBạn được đọc skill, helper/runtime/dependency của nó và các file được tham chiếu trong ba project này. Chạy helper theo skill rồi báo kết quả từng project bằng tiếng Việt ngắn gọn, nêu giới hạn và điều còn cần xác nhận. Không sửa/tạo/xóa file, không cài đặt, không truy cập project khác, không mạng/dịch vụ ngoài, không tạo agent, không chạy tiếp công việc sản phẩm. Không đọc log/manifest/expected của lượt thử. Nếu gặp lỗi, báo lỗi và giới hạn; không thử lại vô hạn.`;
  const args = ['exec','--ephemeral','--sandbox','read-only','--ignore-rules','--json','--color','never',
    '-c','approval_policy="never"','-c','notify=[]','-c','mcp_servers.node_repl.enabled=false','-c','web_search="disabled"',
    ...['apps','plugins','hooks','memories','multi_agent','multi_agent_v2','browser_use','browser_use_external','computer_use','in_app_browser','image_generation','skill_mcp_dependency_install'].flatMap(name=>['--disable',name]),
    '-C',roots[0],prompt];
  save('prompt.txt',prompt);
  save('manifest.json',{ preparedAt:new Date().toISOString(), cli, cliHash:hash(readFileSync(cli)), node:process.version,
    sessions:3, timeoutMs:180000, automaticRetries:0, args, promptHash:hash(prompt), sources:sourceHashes(), inputs:inputHashes(),
    expected:{ B01:'OK, unfinished and partial/unknown; no ready/approval/live-health claim', A01:'OK, APPROVED only recorded; no real Human permission', V03:'INCOMPLETE, missing snapshot, data null; no verified progress' },
    isolation:'Three independent ephemeral CLI processes, same immutable input set; configured model/effort retained, integrations/hooks/memory/agents disabled per invocation. Sandbox is not claimed as a universal OS read boundary.' });
  console.log(JSON.stringify({prepared:output,inputs:Object.keys(inputHashes()).length}));
} else {
  const manifest = JSON.parse(readFileSync(path.join(output,'manifest.json'),'utf8'));
  if (cli !== manifest.cli || hash(readFileSync(cli)) !== manifest.cliHash || JSON.stringify(sourceHashes()) !== JSON.stringify(manifest.sources) || JSON.stringify(inputHashes()) !== JSON.stringify(manifest.inputs)) throw new Error('Frozen inputs changed; no session started');
  save('run-start.json',{at:new Date().toISOString(),manifestHash:hash(readFileSync(path.join(output,'manifest.json')))});
  const results=[];
  for (let session=1; session<=3; session++) {
    const startedAt=new Date().toISOString();
    const stdout=createWriteStream(path.join(output,`session-${session}.jsonl`),{flags:'wx'});
    const stderr=createWriteStream(path.join(output,`session-${session}.stderr.txt`),{flags:'wx'});
    let timedOut=false, error=null;
    const child=spawn(cli,manifest.args,{cwd:repo,windowsHide:true,stdio:['ignore','pipe','pipe']});
    child.stdout.pipe(stdout); child.stderr.pipe(stderr);
    console.log(JSON.stringify({session,startedAt,pid:child.pid}));
    const timer=setTimeout(()=>{ timedOut=true; if(child.pid) {
      const killed=spawnSync('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true,encoding:'utf8',timeout:10000});
      save(`session-${session}.timeout.json`,{pid:child.pid,exitCode:killed.status,stdout:killed.stdout,stderr:killed.stderr});
    } },manifest.timeoutMs);
    const finished=new Promise(resolve=>{child.on('error',e=>{error=e.message;});child.on('close',(code,signal)=>resolve({code,signal}));});
    const closed=await finished; clearTimeout(timer);
    await Promise.all([stdout,stderr].map(stream=>stream.closed?Promise.resolve():new Promise(resolve=>stream.on('close',resolve))));
    const sources=sourceHashes(), inputs=inputHashes();
    const result={session,startedAt,endedAt:new Date().toISOString(),...closed,timedOut,error,
      sourcesUnchanged:JSON.stringify(sources)===JSON.stringify(manifest.sources),inputsUnchanged:JSON.stringify(inputs)===JSON.stringify(manifest.inputs),
      stdoutHash:hash(readFileSync(path.join(output,`session-${session}.jsonl`))),stderrHash:hash(readFileSync(path.join(output,`session-${session}.stderr.txt`)))};
    save(`session-${session}.result.json`,result);results.push(result);console.log(JSON.stringify(result));
    if(!result.sourcesUnchanged || !result.inputsUnchanged) break;
  }
  save('after.json',{sources:sourceHashes(),inputs:inputHashes()});
  save('summary.json',{results,behaviorReview:'Pending manual inspection of every session; exit 0 is not a behavior pass.'});
  process.exitCode=results.length===3 && results.every(r=>r.code===0&&!r.timedOut&&!r.error&&r.sourcesUnchanged&&r.inputsUnchanged)?0:1;
}
