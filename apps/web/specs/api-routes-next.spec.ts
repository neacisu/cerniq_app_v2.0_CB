/**
 * Route handlers folosesc `next/server`; mediul `node` oferă `Request`/`Response` globale (Node 18+).
 * @jest-environment node
 */
import { GET as getLive } from '../app/api/live/route';
import { GET as getTelemetry } from '../app/api/telemetry/route';
import { POST as postCommand } from '../app/api/command/route';

describe('Next Route Handlers — api/live, api/telemetry, api/command', () => {
  const origInternal = process.env.CERNIQ_API_INTERNAL_URL;

  afterEach(() => {
    if (origInternal === undefined) {
      delete process.env.CERNIQ_API_INTERNAL_URL;
    } else {
      process.env.CERNIQ_API_INTERNAL_URL = origInternal;
    }
    jest.restoreAllMocks();
  });

  describe('GET /api/live', () => {
    it('returnează SSE cu antete corecte (mod local fără upstream)', async () => {
      delete process.env.CERNIQ_API_INTERNAL_URL;
      const res = await getLive();
      expect(res.headers.get('Content-Type')).toMatch(/text\/event-stream/);
      expect(res.headers.get('Cache-Control')).toBe('no-cache, no-transform');
      const reader = res.body?.getReader();
      if (reader === undefined) {
        throw new Error('expected ReadableStreamDefaultReader from response body');
      }
      const first = await reader.read();
      const line = new TextDecoder().decode(first.value);
      expect(line).toContain('connected');
      await reader.cancel();
    });

    it('proxy către API intern când upstream răspunde OK cu body', async () => {
      process.env.CERNIQ_API_INTERNAL_URL = 'http://cerniq-api-internal';
      const enc = new TextEncoder();
      const upstreamBody = new ReadableStream({
        start(c) {
          c.enqueue(enc.encode('data: {"type":"proxy"}\n\n'));
        },
      });
      const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(upstreamBody, {
          status: 200,
          headers: { 'Content-Type': 'text/event-stream' },
        }),
      );
      const res = await getLive();
      expect(fetchSpy).toHaveBeenCalledWith(
        'http://cerniq-api-internal/v1/cognitive/stream',
        expect.objectContaining({
          headers: { Accept: 'text/event-stream' },
          cache: 'no-store',
        }),
      );
      expect(res.headers.get('Content-Type')).toMatch(/text\/event-stream/);
      const reader = res.body?.getReader();
      if (reader === undefined) {
        throw new Error('expected ReadableStreamDefaultReader from response body');
      }
      const chunk = await reader.read();
      expect(new TextDecoder().decode(chunk.value)).toContain('proxy');
      await reader.cancel();
    });

    it('cade pe stream local dacă upstream nu e OK', async () => {
      process.env.CERNIQ_API_INTERNAL_URL = 'http://unreachable';
      jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 503 }));
      const res = await getLive();
      const reader = res.body?.getReader();
      if (reader === undefined) {
        throw new Error('expected ReadableStreamDefaultReader from response body');
      }
      const first = await reader.read();
      expect(new TextDecoder().decode(first.value)).toContain('connected');
      await reader.cancel();
    });
  });

  describe('GET /api/telemetry', () => {
    it('returnează JSON cu service cerniq-web', async () => {
      const res = await getTelemetry();
      expect(res.status).toBe(200);
      const json = (await res.json()) as { service: string };
      expect(json.service).toBe('cerniq-web');
    });
  });

  describe('POST /api/command', () => {
    it('acceptă JSON și răspunde ok cu received', async () => {
      const req = new Request('http://localhost/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping' }),
      });
      const res = await postCommand(req);
      expect(res.status).toBe(200);
      const json = (await res.json()) as { ok: boolean; received: { action: string } };
      expect(json.ok).toBe(true);
      expect(json.received).toEqual({ action: 'ping' });
    });

    it('corp invalid: răspunde tot ok cu received gol', async () => {
      const req = new Request('http://localhost/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      });
      const res = await postCommand(req);
      const json = (await res.json()) as { ok: boolean; received: unknown };
      expect(json.ok).toBe(true);
      expect(json.received).toEqual({});
    });
  });
});
