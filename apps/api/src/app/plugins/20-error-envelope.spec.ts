import Fastify, { FastifyInstance } from 'fastify';
import type { FastifyError } from 'fastify';
import requestMeta from './10-request-meta';
import errorEnvelope from './20-error-envelope';

function makeFastifyError(
  statusCode: number,
  message: string,
  code: string
): FastifyError {
  const err = new Error(message) as FastifyError;
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

describe('plugin 20-error-envelope', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = Fastify({ logger: false });
    await server.register(requestMeta);
    await server.register(errorEnvelope);

    server.get('/ok', async () => ({ ok: true }));

    server.get('/throws-error', async () => {
      throw new Error('secret server detail');
    });

    server.get('/throws-string', async () => {
      // Simulăm throw non-Error (caz suportat de getRawErrorMessage); nu folosiți în rute reale.
      throw 'plain-string-error'; // NOSONAR typescript:S7784 — valoare intenționat primită ca `unknown`
    });

    server.get('/client-error', async () => {
      throw makeFastifyError(404, 'Resource missing', 'NOT_FOUND');
    });

    await server.ready();
  });

  afterEach(async () => {
    await server.close();
  });

  it('returnează envelope JSON pentru Error cu status 500, maschează mesajul către client', async () => {
    const res = await server.inject({ method: 'GET', url: '/throws-error' });
    const body = res.json() as {
      error: { code: string; message: string; request_id: string };
    };

    expect(res.statusCode).toBe(500);
    expect(body.error.code).toBe('INTERNAL');
    expect(body.error.message).toBe('Internal error');
    expect(body.error.request_id).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it('pentru eroare non-500 folosește codul Fastify și mesajul brut către client', async () => {
    const res = await server.inject({ method: 'GET', url: '/client-error' });
    const body = res.json() as {
      error: { code: string; message: string; request_id: string };
    };

    expect(res.statusCode).toBe(404);
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toBe('Resource missing');
  });

  it('tratează throw string ca 500 cu cod INTERNAL', async () => {
    const res = await server.inject({ method: 'GET', url: '/throws-string' });
    const body = res.json() as { error: { code: string; message: string } };

    expect(res.statusCode).toBe(500);
    expect(body.error.code).toBe('INTERNAL');
    expect(body.error.message).toBe('Internal error');
  });
});
