import { Observer } from './model.mjs';
import { SnapshotStore } from './store.mjs';
export class Runtime {
  constructor(config, directory, clock = () => ({ wallMs: Date.now(), monoMs: performance.now() })) {
    this.clock = clock; this.store = new SnapshotStore(directory); this.failed = false;
    try { this.model = new Observer(config, this.store.load(), clock()); this.update(() => {}); }
    catch { this.store.close(); throw new Error('OBSERVER_START'); }
  }
  update(mutation) {
    if (this.failed) return false;
    const at = this.clock();
    try {
      const accepted = mutation(this.model, at);
      const next = this.model.snapshot(at);
      // Publish only after complete metadata and notifications are durably committed.
      this.store.save(this.model.exportState()); this.published = next;
      return accepted === undefined ? true : accepted;
    } catch { this.failed = true; return false; }
  }
  view() {
    this.update(() => {});
    if (this.failed) {
      const last=structuredClone(this.published ?? {});
      return { ...last, schema: 1, conclusion: last.conclusion === 'CRITICAL' ? 'CRITICAL' : 'UNKNOWN',
        unknown: [...(last.unknown ?? []), 'OBSERVER_STORAGE'],
        eligibility: { observationReady: false, writeReady: false, reasons: ['OBSERVER_STORAGE'] },
        deliveryClaim: 'NOT_MEASURED_AT_RECEIVER', persistedLast: this.published ?? null };
    }
    return structuredClone(this.published);
  }
  close() { this.store.close(); }
}
