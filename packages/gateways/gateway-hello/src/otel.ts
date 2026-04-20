/** Hook no-op — trace la nivel infrastructură (Tempo); fără duplicare Collector. */
export function traceGatewayHello<T>(fn: () => T): T {
  return fn();
}
