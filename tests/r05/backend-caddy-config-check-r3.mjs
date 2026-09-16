import fs from 'node:fs';
import assert from 'node:assert/strict';
const config=JSON.parse(fs.readFileSync(process.argv[2]));
assert.equal(config.admin.disabled,true);
const server=config.apps.http.servers.srv0;
assert.deepEqual(server.listen,[':8443']);
assert.equal(server.max_header_bytes,16384);
assert.deepEqual(server.protocols,['h1','h2']);
assert.equal(config.apps.pki.certificate_authorities.local.install_trust,false);
const handlers=[];
function walk(routes){for(const r of routes||[])for(const h of r.handle||[]){handlers.push(h);if(h.routes)walk(h.routes)}}
walk(server.routes);
assert.ok(handlers.every(h=>['subroute','headers','request_body','static_response','reverse_proxy'].includes(h.handler)));
assert.equal(handlers.find(h=>h.handler==='request_body').max_size,131072);
const guard=handlers.findIndex(h=>h.handler==='static_response'&&h.status_code===400);
const proxy=handlers.findIndex(h=>h.handler==='reverse_proxy');
assert.ok(guard>=0&&guard<proxy,'forged-header rejection must run before proxy');
const proxies=handlers.filter(h=>h.handler==='reverse_proxy');
assert.deepEqual(proxies.flatMap(p=>p.upstreams.map(u=>u.dial)),['backend:8080','web:4173']);
for(const p of proxies){assert.ok(!p.handle_response);assert.ok(p.headers.request.delete.includes('X-Role'));assert.ok(p.headers.request.delete.includes('X-Actor'));}
console.log('adapted configuration invariants PASS');
