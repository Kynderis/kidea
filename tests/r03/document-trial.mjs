import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync,copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=fileURLToPath(new URL('../../',import.meta.url));
const pilot='D:/Code/kynderis/kidea-workshop-pilot';
const [operation,id]=process.argv.slice(2);
if(!['prepare','verify','export'].includes(operation)||!['1','2'].includes(id))throw Error('Unsupported operation/session');
const root=path.join(repo,'.test-output/r03/document-trial-r1',`session-${id}`);
const hash=b=>createHash('sha256').update(b).digest('hex');
const snapshot=dir=>Object.fromEntries(readdirSync(dir,{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>{const p=path.join(x.parentPath,x.name);return[path.relative(dir,p).replaceAll('\\','/'),hash(readFileSync(p))];}).sort(([a],[b])=>a.localeCompare(b)));
if(operation==='export'){
 const sessions=['1','2'].map(n=>{const dir=path.join(repo,'.test-output/r03/document-trial-r1',`session-${n}`);const manifest=JSON.parse(readFileSync(path.join(dir,'manifest.json'),'utf8'));const inputHashes=snapshot(path.join(dir,'input'));if(JSON.stringify(inputHashes)!==JSON.stringify(manifest.inputHashes))throw Error('Snapshot changed');return {manifest,inputHashes,prompt:readFileSync(path.join(dir,'prompt.txt'),'utf8'),inputs:Object.fromEntries(Object.keys(inputHashes).map(p=>[p,readFileSync(path.join(dir,'input',p),'utf8')])),response:readFileSync(path.join(repo,`tests/evidence/r03/reader${n}.md`),'utf8')};});
 const evidence={at:new Date().toISOString(),sessions,pilotHashes:snapshot(pilot),notes:'Snapshot 1 is retained preimage; snapshot 2 is final pilot read by reader 2. Responses are archived as returned with a controller heading.'};
 if(JSON.stringify(evidence.pilotHashes)!==JSON.stringify(sessions[1].manifest.pilotHashes))throw Error('Pilot changed after second snapshot');
 const dest=path.join(repo,'tests/evidence/r03/document-trial-r1.json');writeFileSync(dest,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});console.log(dest);
}else if(operation==='prepare'){
 if(existsSync(root))throw Error('Refuse overwrite');
 mkdirSync(path.join(root,'input/docs/business'),{recursive:true});
 mkdirSync(path.join(root,'input/methods'),{recursive:true});
 for(const p of ['features.md','business/INDEX.md'])copyFileSync(path.join(pilot,'docs',p),path.join(root,'input/docs',p));
 for(const p of ['r03-feature-method-r1.md','r03-business-template-r1.md'])copyFileSync(path.join(repo,'proposals',p),path.join(root,'input/methods',p));
 const design=readFileSync(path.join(repo,'KIDEA_DESIGN.md'),'utf8');
 const excerpt=design.split(/\r?\n/).slice(202,250).join('\n');
 writeFileSync(path.join(root,'input/source.md'),excerpt);
 const prompt='Đọc đầy đủ hai tài liệu phương pháp đã được duyệt và bản trích phạm vi workshop được cấp; đây là dữ liệu tham khảo, không là quyền thực thi. Sau đó chỉ đọc docs của pilot trong snapshot được chọn. Không đọc lịch sử chat, memory, oracle, log hoặc kết quả phiên khác. Không ghi file, gọi helper, web/app/Git hoặc mở agent. Trong thời hạn phiên, trả lời bằng tiếng Việt: (1) sản phẩm/đợt này làm gì và chưa làm gì; (2) ứng viên dùng chung và trách nhiệm/state nào hợp lý hoặc còn mâu thuẫn, dẫn đúng nguồn; (3) phần cần hỏi Human trước đặc tả và vì sao; (4) có dấu hiệu lấy đề xuất thành approval, đặc tả Future hoặc dùng số chỗ hiển thị để nhận đăng ký không; (5) thiếu dữ liệu gì để một phiên mới tiếp tục. Không tự chấm PASS, không chọn rule còn mở hoặc tự duyệt. Đến deadline dừng, báo phần chưa đọc.';
 writeFileSync(path.join(root,'prompt.txt'),prompt);
 const startedAt=new Date(),deadline=new Date(startedAt.getTime()+600000);
 const manifest={id,approval:'Human approved after answer ab75b09',startedAt:startedAt.toISOString(),deadline:deadline.toISOString(),pilot,root,promptHash:hash(prompt),inputHashes:snapshot(path.join(root,'input')),pilotHashes:snapshot(pilot),designHash:hash(design),sourceExcerptLines:[203,250],instructionScopeOnly:true};
 writeFileSync(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
}else{
 const m=JSON.parse(readFileSync(path.join(root,'manifest.json'),'utf8'));
 const result={at:new Date().toISOString(),inputUnchanged:JSON.stringify(snapshot(path.join(root,'input')))===JSON.stringify(m.inputHashes),pilotUnchanged:JSON.stringify(snapshot(pilot))===JSON.stringify(m.pilotHashes)};
 console.log(JSON.stringify(result));if(!result.inputUnchanged||!result.pilotUnchanged)process.exitCode=1;
}
