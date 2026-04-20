import { FastifyPluginAsync } from 'fastify';
import { loadLlmConfigDevFallback, resolveEndpoint } from '@cerniq/llm';
import { LlmQuotaGuard } from '@cerniq/messaging';
import { llmQuotaChecks } from '../../lib/cerniq-metrics';

/**
 * Health rutare LLM + verificare cotă (fără apel model real).
 */
const llmProxyHealth: FastifyPluginAsync = async (fastify) => {
  fastify.get('/llm/health', async (request, reply) => {
    const tenantId = request.tenantId;
    if (!tenantId) {
      return reply.status(400).send({
        error: {
          code: 'TENANT_REQUIRED',
          message: 'X-Tenant-Id header required',
          request_id: request.requestId,
        },
      });
    }
    const cfg = loadLlmConfigDevFallback();
    const max = Number(process.env.LLM_QUOTA_TOKENS_PER_DAY ?? '100000');
    let quotaOk = true;
    let redisUnavailable = false;
    try {
      const guard = new LlmQuotaGuard(max);
      quotaOk = await guard.consume(tenantId, 'day', 1);
      await guard.disconnect();
    } catch {
      redisUnavailable = true;
      llmQuotaChecks.inc({ result: 'error' });
      quotaOk = true;
    }
    if (!quotaOk) {
      llmQuotaChecks.inc({ result: 'exceeded' });
      return reply.status(429).send({
        error: {
          code: 'LLM_QUOTA',
          message: 'Tenant quota exceeded',
          request_id: request.requestId,
        },
      });
    }
    if (!redisUnavailable) {
      llmQuotaChecks.inc({ result: 'ok' });
    }
    return {
      guard_endpoint: resolveEndpoint(cfg, 'guard'),
      tenant_id: tenantId,
      quota: 'ok',
    };
  });
};

export default llmProxyHealth;
