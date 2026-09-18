import https from 'node:https';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { describe, conclusionText } from './display.mjs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const client = `const root=document.getElementById('data');const status=document.getElementById('status');
const describe=${describe.toString()};const conclusionText=${conclusionText.toString()};
let last=performance.now(),authorized=true;let critical=JSON.parse(document.getElementById('initial').textContent).conclusion==='CRITICAL';
const lost=()=>{status.textContent=critical?'Có lỗi nghiêm trọng đã biết — bộ quan sát không rõ':'Không rõ — mất tín hiệu bộ quan sát';};
const render=v=>{root.textContent=describe(v);critical=v.conclusion==='CRITICAL';status.textContent=conclusionText(v.conclusion);};
async function refresh(){try{const r=await fetch('/api/observation',{cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(2000)});
if(r.status===401||r.status===403){authorized=false;root.textContent='';document.getElementById('initial').textContent='';status.textContent='Không có quyền quan sát';return;}
if(!r.ok)throw Error();const v=await r.json();if(!authorized)return;render(v);last=performance.now();}
catch{if(performance.now()-last>5000)lost();}}
document.getElementById('refresh').addEventListener('click',refresh);
setInterval(()=>{if(authorized&&performance.now()-last>5000)lost();},250);
setInterval(()=>{if(authorized)refresh();},2000);`;
export function cookieVerifier(readSessions) {
  return request => {
    const raw = request.headers.cookie ?? '';
    if (raw.length > 4096) return false;
    const matches = raw.split(';').map(s=>s.trim()).filter(s=>s.startsWith('__Host-workshop_observer='));
    if (matches.length !== 1) return false;
    const token = matches[0].slice('__Host-workshop_observer='.length);
    if (!/^[A-Za-z0-9_-]{32,128}$/.test(token)) return false;
    for (const s of readSessions()) {
      if (!s || typeof s.token !== 'string' || s.role !== 'admin' || !Number.isSafeInteger(s.expiresAtMs)
        || s.expiresAtMs <= Date.now()) continue;
      const a=Buffer.from(token),b=Buffer.from(s.token);
      if (a.length === b.length && timingSafeEqual(a,b)) return true;
    }
    return false;
  };
}
export function createServer(runtime, tls, authorized) {
  const server = https.createServer({ ...tls, minVersion: 'TLSv1.2', maxHeaderSize: 8192 }, (req,res) => {
    const nonce=randomBytes(18).toString('base64');
    res.setHeader('cache-control','private, no-store');res.setHeader('x-robots-tag','noindex, nofollow');
    res.setHeader('x-content-type-options','nosniff');res.setHeader('referrer-policy','no-referrer');
    res.setHeader('content-security-policy',"default-src 'none'; script-src 'nonce-"+nonce+"'; style-src 'nonce-"+nonce+"'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end();return;}
    let allowed=false;try{allowed=authorized(req);}catch{/* Closed if session store cannot be read. */}
    if (!allowed) {res.writeHead(403);res.end();return;}
    if (!['/operations','/api/observation','/health/observer'].includes(req.url)) {res.writeHead(404);res.end();return;}
    if (req.url === '/health/observer') {
      res.writeHead(runtime.failed?503:200,{'content-type':'application/json'});
      res.end(req.method==='HEAD'?'':JSON.stringify({schema:1,component:'observer',status:runtime.failed?'UNKNOWN':'LIVE'}));return;
    }
    const view=runtime.view();res.statusCode=runtime.failed?503:200;
    if(req.url==='/api/observation'){res.setHeader('content-type','application/json');res.end(req.method==='HEAD'?'':JSON.stringify(view));return;}
    res.setHeader('content-type','text/html; charset=utf-8');
    res.end(req.method==='HEAD'?'':`<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Quan sát lab</title><style nonce="${nonce}">body{font-family:system-ui;max-width:70rem;margin:auto;padding:1rem;color:#17212b;background:#f4f7fa}h1{font-size:1.5rem}button{font:inherit;padding:.6rem 1rem}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:white;padding:1rem;border:1px solid #dce4ea;border-radius:.5rem}#status{font-weight:700}</style></head><body><h1>Quan sát lab — màn dự phòng</h1><p id="status" role="status" aria-live="polite">${escape(conclusionText(view.conclusion))}</p><p>Chỉ xem. Dữ liệu thiếu là không rõ; cảnh báo không tự cấp quyền sửa hoặc phục hồi.</p><button id="refresh" type="button">Làm mới dữ liệu</button><pre id="data">${escape(describe(view))}</pre><script id="initial" type="application/json" nonce="${nonce}">${JSON.stringify(view).replaceAll("<", "\\u003c")}</script><script nonce="${nonce}">${client}</script></body></html>`);
  });
  server.requestTimeout=5000;server.headersTimeout=5000;server.keepAliveTimeout=1000;
  return server;
}
