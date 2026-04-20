/**
 * Export trace OTLP către stack observability (Tempo) — stacks-02.
 * Variabile standard OpenTelemetry; fără endpoint nu pornește SDK (fără duplicare stack paralel).
 * @see docs/enterprise/apps-api-fastify-core.md
 */
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

let sdk: NodeSDK | undefined;

export function startNodeOtel(): void {
  if (process.env.OTEL_SDK_DISABLED === 'true') {
    return;
  }
  if (sdk) {
    return;
  }
  const endpoint =
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?.trim() ||
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
  if (!endpoint) {
    return;
  }

  const serviceName = process.env.OTEL_SERVICE_NAME?.trim() || 'cerniq-api';
  const exporter = new OTLPTraceExporter({ url: endpoint });
  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
    }),
    traceExporter: exporter,
    instrumentations: [new HttpInstrumentation()],
  });
  sdk.start();

  const shutdown = () => {
    void sdk?.shutdown().catch(() => undefined);
  };
  process.once('SIGTERM', shutdown);
  process.once('beforeExit', shutdown);
}
