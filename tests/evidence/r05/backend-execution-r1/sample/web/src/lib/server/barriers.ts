const pending = new Map<string, () => void>();
export function waiting(id: string) { return pending.has(id); }
export function release(id: string) { pending.get(id)?.(); }
export function hold(id: string) {
 if (pending.has(id)) throw new Error('Duplicate barrier');
 return new Promise<void>((resolve, reject) => {
  const timer = setTimeout(() => { pending.delete(id); reject(new Error('Barrier timeout')); }, 10000);
  pending.set(id, () => { clearTimeout(timer); pending.delete(id); resolve(); });
 });
}
