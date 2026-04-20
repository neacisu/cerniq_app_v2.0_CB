/**
 * Webhooks **outbound** (Cerniq → partener): HMAC-SHA256 pe corp, antetele canonice,
 * retry cu backoff pentru erori tranzitorii — aliniat docs/enterprise/external-integrations.md.
 * Fără URL hardcodat; apelantul furnizează `targetUrl` din env/CMDB/OpenBao.
 */

import { createHmac } from 'node:crypto';

const DEFAULT_RETRY_STATUSES = [502, 503, 504];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function signCerniqWebhookBody(secret: string, rawBody: string): string {
  return createHmac('sha256', secret).update(rawBody).digest('hex');
}

export interface DeliverCerniqWebhookOptions {
  readonly secret: string;
  /** Minim 8 caractere — paritate cu inbound OpenAPI. */
  readonly idempotencyKey: string;
  readonly timeoutMs?: number;
  readonly maxRetries?: number;
  readonly retryOnStatuses?: number[];
}

/**
 * POST JSON către un endpoint partener cu semnătură și idempotency.
 * Nu loghează corpul — doar outcome pentru agregatoare (fără PII).
 */
export async function deliverCerniqWebhook(
  targetUrl: string,
  body: unknown,
  opts: DeliverCerniqWebhookOptions,
): Promise<Response> {
  if (opts.idempotencyKey.length < 8) {
    throw new Error('idempotencyKey must be at least 8 characters');
  }
  const rawBody =
    typeof body === 'string' ? body : JSON.stringify(body ?? {});
  const signature = signCerniqWebhookBody(opts.secret, rawBody);
  const {
    timeoutMs = 30_000,
    maxRetries = 2,
    retryOnStatuses = DEFAULT_RETRY_STATUSES,
  } = opts;

  const maxAttempts = 1 + Math.max(0, maxRetries);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': opts.idempotencyKey,
          'X-Cerniq-Signature': signature,
        },
        body: rawBody,
        signal: ctrl.signal,
      });
      if (retryOnStatuses.includes(res.status) && attempt < maxAttempts) {
        await sleep(Math.min(1000 * 2 ** (attempt - 1), 8000));
        continue;
      }
      return res;
    } catch (e: unknown) {
      if (attempt >= maxAttempts) {
        throw e;
      }
      await sleep(Math.min(1000 * 2 ** (attempt - 1), 8000));
    } finally {
      clearTimeout(t);
    }
  }

  throw new Error('deliverCerniqWebhook: exhausted retries');
}
