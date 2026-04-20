/**
 * Crossing-tenant: header UUID + JWT `tid` trebuie aliniate — doc-business-tenancy-batch-import.
 */
import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import jwtAuth from '../../plugins/35-jwt-auth';
import requestMeta from '../../plugins/10-request-meta';
import tenantContext from '../../plugins/30-tenant-context';
import me from './me';

const SECRET = 's'.repeat(32);
const TENANT_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const TENANT_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

describe('GET /v1/me — izolare tenant', () => {
  const origJwt = process.env.JWT_SECRET;
  const origNodeEnv = process.env.NODE_ENV;
  const origDevTenant = process.env.AUTH_DEV_ALLOW_TENANT_HEADER;

  afterEach(() => {
    if (origJwt === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = origJwt;
    if (origNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = origNodeEnv;
    if (origDevTenant === undefined) delete process.env.AUTH_DEV_ALLOW_TENANT_HEADER;
    else process.env.AUTH_DEV_ALLOW_TENANT_HEADER = origDevTenant;
  });

  async function buildServer() {
    process.env.JWT_SECRET = SECRET;
    const server = Fastify({ logger: false });
    await server.register(requestMeta);
    await server.register(tenantContext);
    await server.register(jwtAuth);
    await server.register(me, { prefix: '/v1' });
    return server;
  }

  it('403 TENANT_REQUIRED fără X-Tenant-Id', async () => {
    const server = await buildServer();
    const res = await server.inject({ method: 'GET', url: '/v1/me' });
    expect(res.statusCode).toBe(403);
    expect(res.json().error.code).toBe('TENANT_REQUIRED');
    await server.close();
  });

  it('403 TENANT_JWT_MISMATCH când tid JWT ≠ header tenant', async () => {
    const server = await buildServer();
    const token = jwt.sign(
      { sub: 'user-1', tid: TENANT_B },
      SECRET,
      { algorithm: 'HS256' },
    );
    const res = await server.inject({
      method: 'GET',
      url: '/v1/me',
      headers: {
        'x-tenant-id': TENANT_A,
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.statusCode).toBe(403);
    expect(res.json().error.code).toBe('TENANT_JWT_MISMATCH');
    await server.close();
  });

  it('200 când JWT valid și tid aliniat header-ului', async () => {
    const server = await buildServer();
    const token = jwt.sign(
      { sub: 'user-1', tid: TENANT_A },
      SECRET,
      { algorithm: 'HS256' },
    );
    const res = await server.inject({
      method: 'GET',
      url: '/v1/me',
      headers: {
        'x-tenant-id': TENANT_A,
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      tenant_id: string;
      subject: string;
      chapters: string[];
    };
    expect(body.tenant_id).toBe(TENANT_A);
    expect(body.subject).toBe('user-1');
    expect(body.chapters).toEqual(['chapter:home', 'chapter:brain']);
    await server.close();
  });

  it('200 — chapters din JWT roles', async () => {
    const server = await buildServer();
    const token = jwt.sign(
      { sub: 'user-1', tid: TENANT_A, roles: ['chapter:sales', 'chapter:admin'] },
      SECRET,
      { algorithm: 'HS256' },
    );
    const res = await server.inject({
      method: 'GET',
      url: '/v1/me',
      headers: {
        'x-tenant-id': TENANT_A,
        authorization: `Bearer ${token}`,
      },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { chapters: string[] };
    expect(body.chapters).toEqual(
      expect.arrayContaining(['chapter:sales', 'chapter:admin']),
    );
    expect(body.chapters.length).toBe(2);
    await server.close();
  });

  it('401 când lipsește JWT în producție (fără dev bypass)', async () => {
    process.env.NODE_ENV = 'production';
    const server = await buildServer();
    const res = await server.inject({
      method: 'GET',
      url: '/v1/me',
      headers: { 'x-tenant-id': TENANT_A },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().error.code).toBe('AUTH_REQUIRED');
    await server.close();
  });

  it('dev: tenant header singur când AUTH_DEV_ALLOW_TENANT_HEADER=1', async () => {
    process.env.NODE_ENV = 'development';
    process.env.AUTH_DEV_ALLOW_TENANT_HEADER = '1';
    const server = await buildServer();
    const res = await server.inject({
      method: 'GET',
      url: '/v1/me',
      headers: { 'x-tenant-id': TENANT_A },
    });
    expect(res.statusCode).toBe(200);
    expect((res.json() as { tenant_id: string }).tenant_id).toBe(TENANT_A);
    await server.close();
  });
});
