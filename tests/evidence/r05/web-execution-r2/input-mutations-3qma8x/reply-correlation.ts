const MAX_VERSION = 18446744073709551615n;
export function validVersion(v: unknown): v is string {
 return typeof v === 'string' && /^(0|[1-9][0-9]{0,19})$/.test(v) && BigInt(v) <= MAX_VERSION;
}
function record(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function parse(raw: string): unknown { try { return JSON.parse(raw); } catch { return null; } }
export function decodeSnapshot(raw: string): Snapshot | null {
 const v = parse(raw);
 if (!record(v) || typeof v.actor !== 'string' || !v.actor || typeof v.epoch !== 'string' || !v.epoch || typeof v.workshop !== 'string' || !v.workshop || !['public','private'].includes(String(v.audience)) || typeof v.audience !== 'string' || !Number.isSafeInteger(v.generation) || typeof v.generation !== 'number' || v.generation < 1 || !validVersion(v.version) || typeof v.value !== 'string') return null;
 return {actor:v.actor,epoch:v.epoch,workshop:v.workshop,audience:v.audience,generation:v.generation,version:v.version,value:v.value};
}
export function decodeReply(raw: string, context: Context, intentId: string): 'UNKNOWN' | 'SUCCESS' | 'REJECTED' {
 const v=parse(raw);
 if(!record(v) || v.namespace!=='admin' || v.state!=='FINAL')return 'UNKNOWN';
 return v.result==='SUCCESS' || v.result==='REJECTED' ? v.result : 'UNKNOWN';
}
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
 receive(raw: string): boolean { const snapshot=decodeSnapshot(raw); return snapshot ? this.apply(snapshot) : false; }
 unmount() { this.mounted = false; this.context.generation++; }
 apply(s: Snapshot): boolean {
  if (!this.mounted || s.actor !== this.context.actor || s.epoch !== this.context.epoch || s.generation !== this.context.generation) return false; // CONTEXT_GUARD
  if (!validVersion(s.version)) return false;
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
