/**
 * Normalizează antetul `x-request-id` conform comportamentului tipic al proxy-urilor
 * (aceeași cheie repetată, `string | string[]` în IncomingHttpHeaders, sau concatenare cu virgulă).
 */

function firstNonEmptyCommaSegment(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  const head = trimmed.split(',')[0].trim();
  return head.length > 0 ? head : undefined;
}

export function pickRequestIdHeader(
  value: string | string[] | undefined
): string | undefined {
  if (typeof value === 'string') {
    return firstNonEmptyCommaSegment(value);
  }
  if (Array.isArray(value)) {
    for (const v of value) {
      if (typeof v !== 'string') {
        continue;
      }
      const token = firstNonEmptyCommaSegment(v);
      if (token !== undefined) {
        return token;
      }
    }
    return undefined;
  }
  return undefined;
}
