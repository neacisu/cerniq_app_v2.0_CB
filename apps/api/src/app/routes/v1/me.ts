import { FastifyPluginAsync } from 'fastify';
import { chaptersResolvedFromJwt } from '../../../lib/rbac-chapters.js';

/**
 * Profil minim: cere `X-Tenant-Id` (UUID) + JWT HS256 (`JWT_SECRET` ≥ 32 caractere) cu `sub` și opțional `tid` aliniat tenantului.
 * Dev: `AUTH_DEV_ALLOW_TENANT_HEADER=1` + `NODE_ENV!==production` permite doar header tenant (fără JWT) — interzis în producție.
 */
const me: FastifyPluginAsync = async (fastify) => {
  fastify.get('/me', async (request, reply) => {
    if (!request.tenantId) {
      return reply.status(403).send({
        error: {
          code: 'TENANT_REQUIRED',
          message: 'X-Tenant-Id obligatoriu pentru acest endpoint',
          request_id: request.requestId,
        },
      });
    }

    const devTenantOnly =
      process.env.NODE_ENV !== 'production' &&
      process.env.AUTH_DEV_ALLOW_TENANT_HEADER === '1';

    if (request.auth?.sub) {
      if (request.auth.tid && request.auth.tid !== request.tenantId) {
        return reply.status(403).send({
          error: {
            code: 'TENANT_JWT_MISMATCH',
            message: 'Claim tid din JWT nu coincide cu X-Tenant-Id',
            request_id: request.requestId,
          },
        });
      }
      return {
        tenant_id: request.tenantId,
        subject: request.auth.sub,
        chapters: chaptersResolvedFromJwt(request.auth, { devTenantOnly: false }),
      };
    }

    if (devTenantOnly) {
      return {
        tenant_id: request.tenantId,
        subject: 'dev-tenant-header-only',
        chapters: chaptersResolvedFromJwt(null, { devTenantOnly: true }),
      };
    }

    return reply.status(401).send({
      error: {
        code: 'AUTH_REQUIRED',
        message:
          'Authorization: Bearer cu JWT HS256 (claim sub; tid opțional dar recomandat) sau AUTH_DEV_ALLOW_TENANT_HEADER=1 în dev',
        request_id: request.requestId,
      },
    });
  });
};

export default me;
