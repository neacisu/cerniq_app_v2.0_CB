/**
 * Parsare antet W3C `traceparent` (fără SDK OTel în proces).
 * Corelare loguri JSON cu trace-uri procesate de Collector/Tempo pe orchestrator (ADR-0008, stacks-02).
 *
 * @see https://www.w3.org/TR/trace-context/
 */
const TRACEPARENT_V00 =
  /^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/i;

export type ParsedTraceparent = {
  traceId: string;
  parentSpanId: string;
};

export function parseTraceparent(
  value: string | string[] | undefined
): ParsedTraceparent | undefined {
  if (value === undefined) {
    return undefined;
  }
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== 'string') {
    return undefined;
  }
  const m = TRACEPARENT_V00.exec(raw.trim());
  if (!m) {
    return undefined;
  }
  return { traceId: m[1].toLowerCase(), parentSpanId: m[2].toLowerCase() };
}
