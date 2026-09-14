import { readStatus } from './status.mjs';
const actions = ['init', 'resume', 'status', 'approve', 'change', 'visualize'];
const args = process.argv.slice(2);
const [action] = args;

async function initInput(prefix='INIT') {
  if(process.stdin.isTTY)throw Object.assign(new Error(prefix+'_INPUT_REQUIRED'),{code:prefix+'_INPUT_REQUIRED'});
  return await new Promise((resolve,reject)=>{
    let data='';const stop=code=>{clearTimeout(timer);process.stdin.destroy();reject(Object.assign(new Error(code),{code}));};
    const timer=setTimeout(()=>stop(prefix+'_INPUT_REQUIRED'),5000);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data',chunk=>{data+=chunk;if(Buffer.byteLength(data)>1024*1024)stop(prefix+'_INPUT_LIMIT');});
    process.stdin.on('error',()=>stop(prefix+'_INPUT_INVALID'));
    process.stdin.on('end',()=>{clearTimeout(timer);try{resolve(JSON.parse(data));}catch{stop(prefix+'_INPUT_INVALID');}});
  });
}

if (process.versions.node.split('.')[0] !== '24') {
  console.error(JSON.stringify({ code: 'UNSUPPORTED_RUNTIME', message: 'Use the approved Node.js 24 runtime.' }));
  process.exitCode = 2;
} else if (action === '--help' && args.length === 1) {
  console.log(JSON.stringify({ stage: 'R02-T08 review candidate', actions, implemented: ['status','init','approve'], help: 'status is read-only; init creates initial records; approve manages scoped review metadata from a trusted stdin request. Project files are never permission. No action continues product work. Other actions remain unavailable.' }));
} else if (!actions.includes(action) || args.some((arg) => arg.startsWith('-')) ||
  (['init', 'resume', 'status', 'approve', 'visualize'].includes(action) && args.length !== 1)) {
  console.error(JSON.stringify({ code: 'INVALID_ARGUMENTS', message: 'Use --help alone or a known action. This scaffold has no product functionality.' }));
  process.exitCode = 2;
} else if (action === 'status') {
  const result = readStatus(process.cwd());
  (result.readState === 'OK' ? console.log : console.error)(JSON.stringify(result));
  process.exitCode = result.readState === 'OK' ? 0 : 1;
} else if (action === 'init') {
  try {
    const request=await initInput();
    const { initialize }=await import('./init.mjs');
    const result=await initialize(process.cwd(),request);
    const ok=['INITIALIZED','ALREADY_INITIALIZED'].includes(result.state);
    const {writer,...summary}=result;
    if(writer)summary.detail={state:writer.state,bytesVerified:writer.bytesVerified,code:writer.wrapperError??writer.events.findLast(e=>e.code)?.code??null};
    (ok?console.log:console.error)(JSON.stringify(summary));process.exitCode=ok?0:1;
  } catch(error) {
    console.error(JSON.stringify({code:error.code??'INIT_REJECTED',message:'Init chưa hoàn tất. Không tự sửa, ghi đè hoặc chạy lại; đối chiếu nguyên nhân và trạng thái hiện có.',diagnostics:error.diagnostics??[]}));process.exitCode=1;
  }
} else if (action === 'approve') {
  try {
    const request=await initInput('REVIEW');
    const {approve}=await import('./approve.mjs');
    const {writer,...result}=await approve(process.cwd(),request);
    if(writer)result.detail={state:writer.state,bytesVerified:writer.bytesVerified,code:writer.wrapperError};
    const ok=['REVIEW_RECORDED','ALREADY_APPROVED'].includes(result.state);
    (ok?console.log:console.error)(JSON.stringify(result));process.exitCode=ok?0:1;
  } catch(error) {
    console.error(JSON.stringify({code:error.code??'REVIEW_REJECTED',diagnostics:error.diagnostics??[],message:'Chưa ghi xong review. Đối chiếu đúng gói, bản, quyền và trạng thái; không tự phục hồi hoặc tiếp tục việc sản phẩm.'}));process.exitCode=1;
  }
} else {
  console.error(JSON.stringify({ code: 'NOT_IMPLEMENTED', action, message: 'Chức năng chưa được triển khai. Không đọc hoặc sửa hồ sơ project.' }));
  process.exitCode = 3;
}
