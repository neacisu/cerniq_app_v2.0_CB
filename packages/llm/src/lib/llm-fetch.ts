/**
 * Client HTTP rezilient pentru endpoint-uri LLM — timeout, retry opțional pentru erori tranzitorii,
 * fără PII în mesaje de eroare. Logging structurat pentru Vector: vezi `formatLlmVectorLogLine`.
 */

export interface LlmFetchOptions extends RequestInit {
  /** Timeout per încercare (ms). */
  timeoutMs?: number;
  /** Număr de **reîncercări** după eșec (implicit 0 = o singură încercare). */
  maxRetries?: number;
  /** Status HTTP pentru care se reîncearcă (ex. upstream indisponibil). */
  retryOnStatuses?: number[];
}

const DEFAULT_RETRY_STATUSES = [502, 503, 504];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Pathname sigur pentru loguri — fără query (poate conține date sensibile). */
export function llmUrlPathForLog(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname || '/';
  } catch {
    return '(invalid-url)';
  }
}

/** Linie JSON pe un singur rând — compatibilă agregator Vector (stacks-02); fără PII. */
export function formatLlmVectorLogLine(fields: {
  readonly component: 'cerniq.llm.http';
  readonly outcome: 'ok' | 'error';
  readonly duration_ms: number;
  readonly path: string;
  readonly http_status?: number;
  readonly attempt?: number;
  readonly error_class?: string;
}): string {
  return JSON.stringify(fields);
}

export async function llmFetch(
  url: string,
  init: LlmFetchOptions = {}
): Promise<Response> {
  const {
    timeoutMs = 30_000,
    maxRetries = 0,
    retryOnStatuses = DEFAULT_RETRY_STATUSES,
    ...rest
  } = init;

  const maxAttempts = 1 + Math.max(0, maxRetries);

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...rest, signal: ctrl.signal });
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

  throw new Error('llmFetch: exhausted retries');
}
