# Contracte API, SSE și evenimente

## Versiune API

- Prefix URL: `/v1` pentru REST public.
- Header: `Accept: application/json`; răspunsuri `Content-Type: application/json; charset=utf-8`.

## Trace și corelare

- `X-Request-Id`: generat de Traefik sau de API dacă lipsește; propagat în loguri și trace OTel.
- `traceparent` / `tracestate` (W3C): opțional de la client; altfel generat la intrare.

## Envelope erori

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mesaj sigur pentru client",
    "request_id": "uuid",
    "details": []
  }
}
```

Coduri HTTP: 400 validare, 401 neautentificat, 403 interzis, 404, 409 conflict (idempotency), 429 rate limit, 5xx intern.

## Idempotency

- Header: `Idempotency-Key` (UUID) pentru `POST` care creează resurse sau efecte financiare.
- Cheia ținută în Redis (`redis-shared`) cu TTL (ex. 24h); replay același răspuns la repetare.

## SSE (telemetrie Brain)

- Endpoint: `GET /v1/cognitive/stream` (API) sau proxy Next `app/api/live` — vezi implementare.
- `Content-Type: text/event-stream`
- Evenimente (exemplu):

```text
event: telemetry
data: {"ts":"...","gateway_id":"...","neuron_id":"...","trace_id":"...","level":"info","metric":"latency_ms","value":12}

event: heartbeat
data: {"ts":"..."}
```

- Reconnect: client `EventSource` cu backoff exponențial; server trimite comentarii `: ping` la 15s.

## Consumatori

- **Intern:** `apps/web` prin Traefik (cookie httpOnly sesiune sau Bearer).
- **Extern:** doar cu API keys rotite din OpenBao + rate limit Redis; fără expunere directă port aplicație.

## OpenAPI

Sursă canonică: [`docs/openapi/openapi.yaml`](../openapi/openapi.yaml).
