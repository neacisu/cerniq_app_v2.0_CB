# Guvernanță LLM — cote și priorități

## Endpoint-uri (stacks-05)

Clase: guard, fast, reasoning, embeddings — VIP `49000–49004` prin HAProxy; ACL rețea stacks-04.

## Cote

- Per **tenant** și opțional per **utilizator**: tokeni/lună, concurență max, burst.
- Tracking: contoare în **redis-shared** + persistență agregată Postgres pentru facturare internă.

## Prioritate

- Cozi separate sau score în coadă: tier enterprise > standard > dev.

## Degradare

- La depășire: răspuns 429 sau model mai mic (fast vs reasoning) cu header `X-Cerniq-Degraded: 1`.

## Metrici

- Prometheus: `cerniq_llm_tokens_total`, `cerniq_llm_latency_seconds`, `cerniq_llm_quota_violations_total`.

## Fără consum nelimitat în producție

- Feature flag `LLM_UNLIMITED` interzis în `NODE_ENV=production`.
