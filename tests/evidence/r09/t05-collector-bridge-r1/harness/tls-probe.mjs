import fs from 'node:fs';
import https from 'node:https';
import assert from 'node:assert/strict';

const headers = JSON.parse(fs.readFileSync('/config/headers.json', 'utf8'));
headers['x-observer-nonce'] = 'tls_probe';
const ca = fs.readFileSync('/config/cert.pem');
const result = await new Promise((resolve, reject) => {
  const request = https.get('https://source.test:8444/internal/observer/sample/fast', { ca, headers, rejectUnauthorized: true, signal: AbortSignal.timeout(3000) }, response => {
    const chunks = [];
    response.on('data', chunk => chunks.push(chunk));
    response.on('end', () => resolve({ status: response.statusCode, body: JSON.parse(Buffer.concat(chunks).toString('utf8')) }));
  });
  request.on('error', reject);
});
assert.equal(result.status, 200);
assert.equal(result.body.schema, 2);
assert.equal(result.body.source, 'backend_fast');
assert.equal(result.body.nonce, 'tls_probe');
assert.equal(result.body.signals.M1.pending, 1);
assert.equal(result.body.signals.M2.state, 'PARTIAL');
assert.equal(result.body.signals.M3.state, 'UNKNOWN');
assert.equal(result.body.signals.M7.state, 'UNKNOWN');
fs.writeFileSync('/out/raw-tls-sample.json', JSON.stringify(result.body, null, 2), { flag: 'wx' });
