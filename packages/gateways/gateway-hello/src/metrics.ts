/**
 * Metrici gateway (înregistrare la worker Temporal sau proces dedicat).
 */
export function registerGatewayHelloMetrics(): { name: string; value: number } {
  return { name: 'cerniq_gateway_hello_ready', value: 1 };
}
