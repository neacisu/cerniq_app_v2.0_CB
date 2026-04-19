/**
 * Prometheus-friendly metrics hooks (wire to prom-client în producție).
 * Conform research §8 — fiecare unitate expune metrics.
 */
export function registerNeuronPingMetrics(): { name: string; value: number } {
  return { name: 'cerniq_neuron_ping_ready', value: 1 };
}
