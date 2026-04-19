/**
 * OTel span helpers — integrare cu stack Tempo (stacks-02) la runtime.
 */
export function traceNeuronPing<T>(fn: () => T): T {
  return fn();
}
