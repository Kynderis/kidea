// OP-r1 component: observations are read-only and never product decisions.
import { createHash } from 'node:crypto';

export const POLICY = Object.freeze({ fastMs: 2000, slowMs: 30000, fastStaleMs: 5000,
  slowStaleMs: 60000, probeMs: 5000, probeTimeoutMs: 2000, reminderMs: 300000,
  dataLimitBytes: 2 * 1024 ** 3, windowMs: 60000 });
export const GROUPS = Object.freeze({ fast: ['M1', 'M2', 'M3', 'M4', 'M7'], slow: ['M8', 'M9'] });
const ERROR_CODES = ['PROCESSING', 'RECONCILE', 'VERSION_CONFLICT', 'INVARIANT', 'PERMISSION'];
const CRITICAL_CODES = ['VERSION_CONFLICT', 'INVARIANT', 'PERMISSION'];
const keys = (v, names) => v && typeof v === 'object' && !Array.isArray(v)
  && Object.keys(v).sort().join('|') === [...names].sort().join('|');
const integer = v => Number.isSafeInteger(v) && v >= 0;
const finite = v => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const identifier = v => typeof v === 'string' && /^[A-Za-z0-9_-]{1,48}$/.test(v);
const version = v => typeof v === 'string' && /^(0|[1-9][0-9]{0,19})$/.test(v)
  && BigInt(v) <= 18446744073709551615n;
const unique = v => new Set(v).size === v.length;
const copy = v => structuredClone(v);
function assert(ok) { if (!ok) throw new Error('SCHEMA'); }
export function p95(samples) {
  return samples.length ? [...samples].sort((a, b) => a - b)[Math.ceil(samples.length * 0.95) - 1] : null;
}
export function validateConfig(config) {
  assert(keys(config, ['run', 'sources', 'storageTargets', 'topology']));
  assert(keys(config.run, ['id', 'operator', 'confirmed', 'startMs', 'endMs']));
  assert(identifier(config.run.id) && identifier(config.run.operator) && typeof config.run.confirmed === 'boolean');
  assert(integer(config.run.startMs) && integer(config.run.endMs) && config.run.endMs > config.run.startMs);
  assert(config.run.endMs - config.run.startMs <= 4 * 3600000);
  assert(keys(config.topology, ['independentHostVerified', 'receiverVerified']));
  assert(Object.values(config.topology).every(v => typeof v === 'boolean'));
  assert(Array.isArray(config.storageTargets) && config.storageTargets.length > 0
    && config.storageTargets.every(identifier) && unique(config.storageTargets));
  assert(keys(config.sources, ['fast', 'slow']));
  for (const source of Object.values(config.sources)) {
    assert(keys(source, ['id', 'clock'])); assert(identifier(source.id));
    const c = source.clock;
    assert(keys(c, ['offsetMs', 'uncertaintyMs', 'measuredAtMs', 'validForMs']));
    assert(Number.isFinite(c.offsetMs) && finite(c.uncertaintyMs) && integer(c.measuredAtMs)
      && integer(c.validForMs) && c.validForMs > 0);
  }
  assert(config.sources.fast.id !== config.sources.slow.id);
  return copy(config);
}
function validateSignal(id, v, config) {
  if (id === 'M1') {
    assert(keys(v, ['pending', 'oldestAgeMs']) && integer(v.pending));
    assert(v.pending === 0 ? v.oldestAgeMs === null : finite(v.oldestAgeMs));
  } else if (id === 'M2') {
    assert(keys(v, ['open', 'resolved']) && Array.isArray(v.open) && Array.isArray(v.resolved));
    assert(v.open.length <= ERROR_CODES.length && v.resolved.length <= ERROR_CODES.length);
    assert(v.open.every(e => keys(e, ['code', 'count']) && ERROR_CODES.includes(e.code)
      && integer(e.count) && e.count > 0));
    assert(v.resolved.every(e => ERROR_CODES.includes(e)) && unique(v.resolved)
      && unique(v.open.map(e => e.code)) && !v.open.some(e => v.resolved.includes(e.code)));
  } else if (id === 'M3') {
    assert(keys(v, ['measured', 'basis', 'windowMs', 'samplesMs', 'uncoveredAgeMs']));
    assert(typeof v.measured === 'boolean' && v.basis === 'SINGLE_OBSERVER' && v.windowMs === POLICY.windowMs);
    assert(Array.isArray(v.samplesMs) && Array.isArray(v.uncoveredAgeMs)
      && v.samplesMs.length + v.uncoveredAgeMs.length <= 10000
      && v.samplesMs.every(finite) && v.uncoveredAgeMs.every(finite));
    assert(v.measured || v.samplesMs.length + v.uncoveredAgeMs.length === 0);
  } else if (id === 'M4') {
    assert(keys(v, ['lastSuccess']));
    assert(v.lastSuccess === null || (keys(v.lastSuccess, ['atMs', 'version'])
      && integer(v.lastSuccess.atMs) && version(v.lastSuccess.version)));
  } else if (id === 'M7') {
    assert(keys(v, ['measured', 'basis', 'windowMs', 'read', 'write']));
    assert(typeof v.measured === 'boolean' && v.basis === 'SINGLE_OBSERVER' && v.windowMs === POLICY.windowMs);
    for (const group of [v.read, v.write]) {
      assert(keys(group, ['scheduled', 'samplesMs', 'technicalErrors', 'missedOffers']));
      assert(integer(group.scheduled) && group.scheduled <= 10000 && Array.isArray(group.samplesMs)
        && group.samplesMs.length === group.scheduled && group.samplesMs.every(finite)
        && integer(group.technicalErrors) && group.technicalErrors <= group.scheduled
        && integer(group.missedOffers) && group.missedOffers <= group.technicalErrors);
      assert(v.measured || group.scheduled === 0);
    }
  } else if (id === 'M8') {
    assert(keys(v, ['complete', 'targets']) && typeof v.complete === 'boolean' && Array.isArray(v.targets));
    assert(v.targets.length <= config.storageTargets.length);
    assert(v.targets.every(t => keys(t, ['name', 'bytes', 'freeBytes', 'headroomBytes'])
      && config.storageTargets.includes(t.name) && integer(t.bytes) && integer(t.freeBytes)
      && integer(t.headroomBytes) && t.headroomBytes > 0));
    assert(unique(v.targets.map(t => t.name)));
    assert(!v.complete || v.targets.map(t => t.name).sort().join('|') === [...config.storageTargets].sort().join('|'));
    assert(Number.isSafeInteger(v.targets.reduce((n, t) => n + t.bytes, 0)));
  } else if (id === 'M9') {
    assert(keys(v, ['verified', 'independent', 'destination', 'recoveryPointMs', 'sha256', 'durable', 'integrity']));
    assert(typeof v.verified === 'boolean' && typeof v.independent === 'boolean'
      && config.storageTargets.includes(v.destination) && typeof v.durable === 'boolean' && typeof v.integrity === 'boolean');
    assert(v.recoveryPointMs === null || integer(v.recoveryPointMs));
    assert(v.sha256 === null || (typeof v.sha256 === 'string' && /^[a-f0-9]{64}$/.test(v.sha256)));
    assert(!v.verified || (v.independent && v.durable && v.integrity && v.recoveryPointMs !== null && v.sha256 !== null));
  }
}
export function validateSample(group, sample, config, nonce, wallMs) {
  assert(keys(sample, ['schema', 'source', 'boot', 'sequence', 'nonce', 'sampledAtMs', 'signals']));
  assert(sample.schema === 1 && sample.source === config.sources[group].id && identifier(sample.boot)
    && integer(sample.sequence) && sample.sequence > 0 && sample.nonce === nonce && identifier(nonce)
    && integer(sample.sampledAtMs) && keys(sample.signals, GROUPS[group]));
  for (const id of GROUPS[group]) validateSignal(id, sample.signals[id], config);
  const c = config.sources[group].clock;
  assert(wallMs >= c.measuredAtMs && wallMs - c.measuredAtMs <= c.validForMs);
  // Offset is observer wall minus source wall. Use conservative age, not a blind subtraction.
  const adjusted = sample.sampledAtMs + c.offsetMs;
  assert(adjusted - c.uncertaintyMs <= wallMs);
  const ageMs = Math.max(0, wallMs - adjusted + c.uncertaintyMs);
  assert(ageMs <= (group === 'fast' ? POLICY.fastStaleMs : POLICY.slowStaleMs));
  if (group === 'slow' && sample.signals.M9.recoveryPointMs !== null)
    assert(sample.signals.M9.recoveryPointMs + c.offsetMs - c.uncertaintyMs <= wallMs);
  return { sample: copy(sample), ageMs };
}

function validateState(s, config) {
  assert(keys(s, ['schema','configHash','restartCount','sources','probes','incidents','notifications','nextNotification']));
  assert(integer(s.restartCount) && integer(s.nextNotification) && s.nextNotification > 0);
  assert(s.sources && Object.keys(s.sources).every(g => ['fast','slow'].includes(g)));
  for (const [g,v] of Object.entries(s.sources)) {
    assert(keys(v,['schema','source','boot','sequence','nonce','sampledAtMs','signals','retired']));
    assert(v.schema === 1 && v.source === config.sources[g].id && identifier(v.boot) && integer(v.sequence)
      && v.sequence > 0 && identifier(v.nonce) && integer(v.sampledAtMs) && keys(v.signals,GROUPS[g]));
    assert(Array.isArray(v.retired) && v.retired.every(identifier) && unique(v.retired) && !v.retired.includes(v.boot));
    for (const id of GROUPS[g]) validateSignal(id,v.signals[id],config);
  }
  assert(s.probes && Object.keys(s.probes).every(t => ['application','dashboard'].includes(t)));
  for (const p of Object.values(s.probes)) assert(keys(p,['failures','ok']) && integer(p.failures) && typeof p.ok === 'boolean');
  const allowedKeys = ['M1:pending','M3:lag','M5:fast','M5:slow','M6:application','M6:dashboard',
    'M7:read','M7:write','M8:storage','M9:backup', ...ERROR_CODES.map(c => 'M2:'+c)];
  assert(s.incidents && Object.keys(s.incidents).every(k => allowedKeys.includes(k)));
  for (const i of Object.values(s.incidents)) {
    assert(keys(i,['firstSeenMs','lastSeenMs','level','count','lastNotifiedMs','recoveredAtMs','healthy','lastHealthyMs']));
    assert(integer(i.firstSeenMs) && integer(i.lastSeenMs) && ['WARNING','CRITICAL'].includes(i.level)
      && integer(i.count) && integer(i.lastNotifiedMs) && (i.recoveredAtMs === null || integer(i.recoveredAtMs))
      && integer(i.healthy) && (i.lastHealthyMs === null || integer(i.lastHealthyMs)));
  }
  assert(Array.isArray(s.notifications) && s.notifications.length < 100000);
  let previous=0;
  for (const n of s.notifications) {
    assert(keys(n,['sequence','key','type','atMs','level','count']) && integer(n.sequence) && n.sequence > previous
      && allowedKeys.includes(n.key) && ['RAISED','ESCALATED','RECOVERED','REMINDER'].includes(n.type)
      && integer(n.atMs) && ['WARNING','CRITICAL'].includes(n.level) && integer(n.count)); previous=n.sequence;
  }
  assert(s.nextNotification > previous);
}

const emptyState = configHash => ({ schema: 1, configHash, restartCount: 0, sources: {}, probes: {},
  incidents: {}, notifications: [], nextNotification: 1 });
export class Observer {
  constructor(config, saved = null, { wallMs = Date.now(), monoMs = performance.now() } = {}) {
    this.config = validateConfig(config);
    this.hash = createHash('sha256').update(JSON.stringify(this.config)).digest('hex');
    if (saved && (saved.schema !== 1 || saved.configHash !== this.hash)) throw new Error('STATE_CONFIG');
    if (saved) validateState(saved, this.config);
    this.state = saved ? copy(saved) : emptyState(this.hash);
    this.fresh = {}; this.probeFresh = {}; this.lastWall = wallMs; this.lastMono = monoMs;
    if (saved) {
      this.state.restartCount++;
      for (const i of Object.values(this.state.incidents)) { i.healthy = 0; i.lastHealthyMs = null; }
      for (const p of Object.values(this.state.probes)) p.failures = 0;
    }
  }
  ingest(group, sample, nonce, { wallMs = Date.now(), monoMs = performance.now() } = {}) {
    try {
      const checked = validateSample(group, sample, this.config, nonce, wallMs);
      const previous = this.state.sources[group];
      assert(!previous || !previous.retired.includes(sample.boot));
      assert(!previous || (sample.boot === previous.boot ? sample.sequence > previous.sequence
        : sample.sampledAtMs > previous.sampledAtMs));
      assert(!previous || sample.sampledAtMs >= previous.sampledAtMs);
      const changedBoot = previous && previous.boot !== sample.boot;
      if (changedBoot) this.resetRecovery(group);
      this.state.sources[group] = { ...checked.sample,
        retired: changedBoot ? [...previous.retired, previous.boot] : previous?.retired ?? [] };
      this.fresh[group] = { at: monoMs, wallMs, ageMs: checked.ageMs };
      this.evaluate(wallMs, monoMs, group);
      return true;
    } catch {
      this.resetRecovery(group);
      this.evaluate(wallMs, monoMs);
      return false; // No raw error/response/credential is exposed or considered a fresh sample.
    }
  }
  resetRecovery(group) {
    for (const [key, incident] of Object.entries(this.state.incidents))
      if (key.endsWith(':' + group) || GROUPS[group]?.some(id => key.startsWith(id + ':'))) { incident.healthy = 0; incident.lastHealthyMs = null; }
  }
  probe(target, ok, { wallMs = Date.now(), monoMs = performance.now() } = {}) {
    assert(['application', 'dashboard'].includes(target) && typeof ok === 'boolean');
    const p = this.state.probes[target] ?? { failures: 0, ok: false };
    p.ok = ok; p.failures = ok ? 0 : p.failures + 1; this.state.probes[target] = p;
    this.probeFresh[target] = monoMs;
    this.observe('M6:' + target, !ok && p.failures >= 2 ? 'CRITICAL' : null, p.failures, wallMs, true, ok);
    this.evaluate(wallMs, monoMs);
  }
  notify(key, type, incident, wallMs) {
    this.state.notifications.push({ sequence: this.state.nextNotification++, key, type, atMs: wallMs,
      level: incident.level, count: incident.count });
    incident.lastNotifiedMs = wallMs;
  }
  observe(key, level, count, wallMs, newObservation, canRecover = true, recoverAfter = 3) {
    let incident = this.state.incidents[key];
    if (level) {
      if (!incident || incident.recoveredAtMs !== null) {
        incident = { firstSeenMs: wallMs, lastSeenMs: wallMs, level, count,
          lastNotifiedMs: null, recoveredAtMs: null, healthy: 0, lastHealthyMs: null };
        this.state.incidents[key] = incident; this.notify(key, 'RAISED', incident, wallMs);
      } else {
        const escalates = level === 'CRITICAL' && incident.level !== 'CRITICAL';
        incident.lastSeenMs = wallMs; incident.count = count; { incident.healthy = 0; incident.lastHealthyMs = null; }
        if (escalates) { incident.level = level; this.notify(key, 'ESCALATED', incident, wallMs); }
      }
    } else if (incident && incident.recoveredAtMs === null) {
      const cadence = key.startsWith("M6:") ? POLICY.probeMs
        : key.startsWith("M8:") || key.startsWith("M9:") || key === "M5:slow" ? POLICY.slowMs : POLICY.fastMs;
      if (newObservation && canRecover && (incident.lastHealthyMs === null || wallMs - incident.lastHealthyMs >= cadence)) {
        incident.healthy++; incident.lastHealthyMs = wallMs;
      } else if (!canRecover) { incident.healthy = 0; incident.lastHealthyMs = null; }
      if (incident.healthy >= recoverAfter) {
        incident.recoveredAtMs = wallMs; this.notify(key, 'RECOVERED', incident, wallMs);
      }
    }
    if (incident && incident.recoveredAtMs === null && incident.level === 'CRITICAL'
      && wallMs - incident.lastNotifiedMs >= POLICY.reminderMs) this.notify(key, 'REMINDER', incident, wallMs);
  }
  sourceAge(group, monoMs) {
    const f = this.fresh[group]; return f ? f.ageMs + Math.max(0, monoMs - f.at) : null;
  }
  evaluate(wallMs, monoMs, updated = null) {
    // Wall jumps invalidate observations; monotonic time is used for local freshness.
    if (monoMs < this.lastMono || Math.abs((wallMs - this.lastWall) - (monoMs - this.lastMono)) > 1000) {
      this.fresh = {}; this.probeFresh = {};
      for (const i of Object.values(this.state.incidents)) { i.healthy = 0; i.lastHealthyMs = null; }
    }
    this.lastWall = wallMs; this.lastMono = monoMs;
    const unknown = [];
    for (const group of ['fast', 'slow']) {
      const age = this.sourceAge(group, monoMs);
      const valid = age !== null && age <= (group === 'fast' ? POLICY.fastStaleMs : POLICY.slowStaleMs);
      if (!valid) { unknown.push('M5:' + group); this.resetRecovery(group); }
      this.observe('M5:' + group, valid ? null : 'WARNING', 1, wallMs, updated === group, valid);
      if (!valid) continue;
      const { signals } = this.state.sources[group];
      const extraAge = age;
      if (group === 'fast') {
        const pending = signals.M1;
        const oldest = pending.pending ? pending.oldestAgeMs + extraAge : null;
        this.observe('M1:pending', oldest >= 30000 ? 'CRITICAL' : oldest > 5000 ? 'WARNING' : null,
          pending.pending, wallMs, updated === group);
        for (const code of ERROR_CODES) {
          const error = signals.M2.open.find(e => e.code === code);
          this.observe('M2:' + code, error ? CRITICAL_CODES.includes(code) ? 'CRITICAL' : 'WARNING' : null,
            error?.count ?? 0, wallMs, updated === group, signals.M2.resolved.includes(code));
        }
        if (!signals.M3.measured) { unknown.push('M3:unmeasured'); const i=this.state.incidents['M3:lag']; if(i){i.healthy=0;i.lastHealthyMs=null;} }
        else this.observe('M3:lag', p95(signals.M3.samplesMs) > 2000
          || signals.M3.uncoveredAgeMs.some(a => a + extraAge > 5000) ? 'WARNING' : null,
          signals.M3.uncoveredAgeMs.length, wallMs, updated === group);
        if (!signals.M7.measured) { unknown.push('M7:unmeasured'); for(const key of ['M7:read','M7:write']) {const i=this.state.incidents[key];if(i){i.healthy=0;i.lastHealthyMs=null;}} }
        else for (const [name, limit] of [['read', 1000], ['write', 2000]]) {
          const v = signals.M7[name];
          this.observe('M7:' + name, p95(v.samplesMs) > limit
            || v.technicalErrors * 100 > v.scheduled ? 'WARNING' : null,
            v.technicalErrors, wallMs, updated === group);
        }
      } else {
        const storage = signals.M8;
        const bytes = storage.targets.reduce((n, t) => n + t.bytes, 0);
        if (!storage.complete) unknown.push('M8:incomplete');
        const storageLevel = bytes >= POLICY.dataLimitBytes || storage.targets.some(t => t.freeBytes < t.headroomBytes)
          ? 'CRITICAL' : bytes >= POLICY.dataLimitBytes * 0.8 ? 'WARNING' : null;
        this.observe('M8:storage', storageLevel, bytes, wallMs, updated === group,
          storage.complete && bytes < POLICY.dataLimitBytes * 0.8
            && storage.targets.every(t => t.freeBytes >= t.headroomBytes), 2);
        const backup = signals.M9;
        const clock = this.config.sources.slow.clock;
        const recoveryAge = backup.recoveryPointMs === null ? null
          : wallMs - (backup.recoveryPointMs + clock.offsetMs) + clock.uncertaintyMs;
        this.observe('M9:backup', !backup.verified || recoveryAge > 900000 ? 'CRITICAL'
          : recoveryAge > 600000 ? 'WARNING' : null, 1, wallMs, updated === group,
          backup.verified && recoveryAge <= 600000, 2);
      }
    }
    for (const target of ['application', 'dashboard']) {
      const at = this.probeFresh[target];
      if (at === undefined || monoMs - at > POLICY.probeMs + POLICY.probeTimeoutMs
        || (!this.state.probes[target]?.ok && this.state.probes[target]?.failures < 2)) unknown.push('M6:' + target);
      const incident = this.state.incidents['M6:' + target];
      if (incident && unknown.includes('M6:' + target)) { incident.healthy = 0; incident.lastHealthyMs = null; }
    }
    // Reminder progression is independent of whether a failed source sends another sample.
    for (const [key, i] of Object.entries(this.state.incidents))
      if (i.recoveredAtMs === null && i.level === 'CRITICAL'
        && wallMs - i.lastNotifiedMs >= POLICY.reminderMs) this.notify(key, 'REMINDER', i, wallMs);
    this.unknown = unknown;
  }
  snapshot({ wallMs = Date.now(), monoMs = performance.now() } = {}) {
    this.evaluate(wallMs, monoMs);
    const active = this.config.run.confirmed && wallMs >= this.config.run.startMs && wallMs < this.config.run.endMs;
    const open = Object.entries(this.state.incidents).filter(([, i]) => i.recoveredAtMs === null);
    const critical = open.some(([, i]) => i.level === 'CRITICAL');
    const conclusion = !active ? 'OUTSIDE_RUN' : critical ? 'CRITICAL' : this.unknown.length ? 'UNKNOWN'
      : open.length ? 'WARNING' : 'NORMAL_IN_OBSERVED_SCOPE';
    const reasons = ['BACKEND_ADMISSION_NOT_WIRED'];
    if (!active) reasons.push('NO_CONFIRMED_WINDOW');
    if (!this.config.topology.independentHostVerified) reasons.push('INDEPENDENT_HOST_NOT_VERIFIED');
    if (!this.config.topology.receiverVerified) reasons.push('RECEIVER_NOT_VERIFIED');
    if (this.unknown.length) reasons.push('MISSING_OBSERVATIONS');
    if (critical) reasons.push('OPEN_CRITICAL_INCIDENT');
    return { schema: 1, run: copy(this.config.run), generatedAtMs: wallMs, restartCount: this.state.restartCount,
      conclusion, unknown: [...this.unknown], sources: Object.fromEntries(['fast', 'slow'].map(group => [group,
        { ageMs: this.sourceAge(group, monoMs), current: !this.unknown.includes('M5:' + group),
          last: this.state.sources[group] ? copy(this.state.sources[group].signals) : null }])),
      probes: copy(this.state.probes), incidents: copy(this.state.incidents), notifications: copy(this.state.notifications),
      eligibility: { observationReady: active && !critical && !this.unknown.length
        && this.config.topology.independentHostVerified && this.config.topology.receiverVerified,
        writeReady: false, reasons }, deliveryClaim: 'NOT_MEASURED_AT_RECEIVER' };
  }
  exportState() { return copy(this.state); }
}
