import './backend-caddy-config-check-r3.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const config=JSON.parse(fs.readFileSync(process.argv[2]));
assert.equal(config.apps.http.grace_period,30_000_000_000);
assert.equal(config.apps.http.servers.srv0.strict_sni_host,true);
console.log('bounded 30-second edge drain configuration PASS');
