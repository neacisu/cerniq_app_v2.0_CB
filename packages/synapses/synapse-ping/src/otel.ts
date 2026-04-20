/**
 * Corelație trace fără SDK OTel în librărie — span-uri la nivel worker / Vector.
 */
export function traceSynapsePing<T>(fn: () => T): T {
  return fn();
}
