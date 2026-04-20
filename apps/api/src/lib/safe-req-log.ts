import type { IncomingHttpHeaders } from 'node:http';

/** Redactare antete sensibile pentru loguri JSON → Vector (stacks-02, logging-audit-policy). */
export function headersForLog(headers: IncomingHttpHeaders): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(headers)) {
    const key = k.toLowerCase();
    if (key === 'authorization' || key === 'cookie' || key === 'set-cookie') {
      out[k] = '[Redacted]';
    } else {
      out[k] = v;
    }
  }
  return out;
}
