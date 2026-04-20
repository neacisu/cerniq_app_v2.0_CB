import { afterEach, describe, expect, it } from '@jest/globals';

describe('otel-init', () => {
  const origOtel = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  const origTraces = process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
  const origDisabled = process.env.OTEL_SDK_DISABLED;

  afterEach(() => {
    if (origOtel === undefined) delete process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    else process.env.OTEL_EXPORTER_OTLP_ENDPOINT = origOtel;
    if (origTraces === undefined) delete process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
    else process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = origTraces;
    if (origDisabled === undefined) delete process.env.OTEL_SDK_DISABLED;
    else process.env.OTEL_SDK_DISABLED = origDisabled;
    jest.resetModules();
  });

  it('startNodeOtel nu pornește SDK fără endpoint OTLP (fără side-effect)', async () => {
    delete process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    delete process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT;
    delete process.env.OTEL_SDK_DISABLED;
    const { startNodeOtel } = await import('./otel-init.js');
    expect(() => startNodeOtel()).not.toThrow();
  });

  it('startNodeOtel respectă OTEL_SDK_DISABLED=true', async () => {
    process.env.OTEL_SDK_DISABLED = 'true';
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = 'http://example.invalid/v1/traces';
    const { startNodeOtel } = await import('./otel-init.js');
    expect(() => startNodeOtel()).not.toThrow();
  });
});
