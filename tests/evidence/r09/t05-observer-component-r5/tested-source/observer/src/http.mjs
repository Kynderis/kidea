import https from 'node:https';
import { randomUUID } from 'node:crypto';
import { POLICY } from './model.mjs';
export function requestJSON(target, { nonce = null, timeoutMs = POLICY.probeTimeoutMs } = {}) {
  return new Promise((resolve, reject) => {
    let u;
    try {
      u = new URL(target.url);
      if (u.protocol !== 'https:' || u.username || u.password || u.hash) throw new Error();
    } catch { reject(new Error('TARGET')); return; }
    const headers = { accept: 'application/json', ...target.headers };
    if (nonce !== null) headers['x-observer-nonce'] = nonce;
    const req = https.request(u, { method: 'GET', ca: target.ca, rejectUnauthorized: true, headers }, res => {
      const chunks = []; let size = 0;
      res.on('data', chunk => {
        size += chunk.length;
        if (size > 65536) req.destroy(new Error('SIZE_LIMIT')); else chunks.push(chunk);
      });
      res.on('error', () => req.destroy(new Error('READ')));
      res.on('end', () => {
        clearTimeout(timer);
        if (res.statusCode !== 200 || !/^application\/json(?:;|$)/i.test(res.headers['content-type'] ?? '')) {
          reject(new Error('RESPONSE')); return;
        }
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
        catch { reject(new Error('SCHEMA')); }
      });
    });
    // Absolute deadline includes connection/TLS/body, not just idle socket time.
    const timer = setTimeout(() => req.destroy(new Error('TIMEOUT')), timeoutMs);
    req.on('error', () => { clearTimeout(timer); reject(new Error('OBSERVATION')); }); req.end();
  });
}
export function startCollector(runtime, targets) {
  let stopped = false; const timers = new Set();
  const pending = new Set();
  function schedule(task, cadence) {
    const loop = () => {
      if (stopped) return;
      const began = performance.now();
      const job = task().catch(() => {}).finally(() => {
        pending.delete(job);
        if (!stopped) { const id = setTimeout(() => { timers.delete(id); loop(); },
          Math.max(0, cadence - (performance.now() - began))); timers.add(id); }
      }); pending.add(job);
    }; loop();
  }
  for (const group of ['fast','slow']) schedule(async () => {
    const nonce = randomUUID();
    try {
      const sample = await requestJSON(targets[group], { nonce });
      if (!stopped) runtime.update((model, at) => model.ingest(group, sample, nonce, at));
    } catch { if (!stopped) runtime.update((model, at) => model.ingest(group, null, nonce, at)); }
  }, group === 'fast' ? POLICY.fastMs : POLICY.slowMs);
  for (const target of ['application','dashboard']) schedule(async () => {
    let ok = false;
    try {
      const data = await requestJSON(targets[target]);
      ok = data && Object.keys(data).sort().join('|') === 'component|schema|status'
        && data.schema === 1 && data.component === target && data.status === 'READ_READY';
    } catch { /* Unknown transport/response is a failed probe, not a business decision. */ }
    if (!stopped) runtime.update((model, at) => model.probe(target, ok, at));
  }, POLICY.probeMs);
  const tick = setInterval(() => { if (!stopped) runtime.update(() => {}); }, 250);
  return async () => { stopped = true; clearInterval(tick); for (const t of timers) clearTimeout(t);
    await Promise.allSettled([...pending]); };
}
