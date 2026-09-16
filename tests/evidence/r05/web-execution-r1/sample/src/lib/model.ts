export type Context = { actor: string; epoch: string; generation: number };
export type Snapshot = Context & { workshop: string; audience: string; version: string; value: string };
export class ViewState {
 context: Context;
 mounted = true;
 values = new Map<string, Snapshot>();
 constructor(actor = 'U', epoch = 'E1') { this.context = { actor, epoch, generation: 1 }; }
 switchActor(actor: string, epoch = this.context.epoch) {
  this.context = { actor, epoch, generation: this.context.generation + 1 };
  this.values.clear();
 }
 unmount() { this.mounted = false; this.context.generation++; }
 apply(s: Snapshot): boolean {
  if (!this.mounted || s.actor !== this.context.actor || s.epoch !== this.context.epoch || s.generation !== this.context.generation) return false; // CONTEXT_GUARD
  if (!/^(0|[1-9][0-9]*)$/.test(s.version)) return false;
  const key = JSON.stringify([s.workshop, s.audience]); // SCOPED_KEY
  const previous = this.values.get(key);
  if (previous && BigInt(s.version) <= BigInt(previous.version)) return false; // EXACT_VERSION
  this.values.set(key, { ...s }); // GROUP_REPLACEMENT
  return true;
 }
}
export type IntentResult = 'UNKNOWN' | 'FINAL';
export class AdminIntent {
 readonly id: string;
 sent = false;
 state: IntentResult = 'UNKNOWN';
 calls: string[] = [];
 constructor(id: string) { this.id = id; }
 attempt() { this.calls.push(this.sent ? 'GET' : 'POST'); this.sent = true; } // NO_REPLAY
 reconcile(state: IntentResult) { this.state = state; }
}
