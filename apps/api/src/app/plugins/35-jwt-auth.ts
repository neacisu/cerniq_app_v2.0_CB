import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    /** JWT HS256 valid din `Authorization: Bearer`; `null` dacă lipsește secret, token sau verificare eșuează. */
    auth: { sub: string; tid?: string } | null;
  }
}

interface CerniqJwtPayload extends jwt.JwtPayload {
  tid?: string;
}

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (request) => {
    const hdr = request.headers.authorization;
    const secret = process.env.JWT_SECRET?.trim();
    if (!hdr?.startsWith('Bearer ') || !secret || secret.length < 32) {
      request.auth = null;
      return;
    }
    const token = hdr.slice(7).trim();
    if (!token) {
      request.auth = null;
      return;
    }
    try {
      const payload = jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as CerniqJwtPayload;
      const sub = typeof payload.sub === 'string' ? payload.sub : '';
      const tid = typeof payload.tid === 'string' ? payload.tid : undefined;
      request.auth = sub ? { sub, tid } : null;
    } catch {
      request.auth = null;
    }
  });
};

export default fp(plugin, { name: 'jwt-auth' });
