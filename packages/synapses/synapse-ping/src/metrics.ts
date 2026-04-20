/**
 * Cârlige metrici Prometheus (prom-client la agregare în proces worker).
 * Research §8 — fiecare sinapsă expune hooks metrics.
 */
export function registerSynapsePingMetrics(): { name: string; value: number } {
  return { name: 'cerniq_synapse_ping_ready', value: 1 };
}
