# Traefik — routere v2 (referință)

**Cale config:** `/opt/traefik` pe orchestrator `77.42.76.185` (stacks-02).

## Routere HTTP (exemplu conceptual)

```yaml
# fragment ilustrativ — nu înlocuiește configul live
http:
  routers:
    cerniq-v2-web:
      rule: Host(`v2.cerniq.app`)
      service: cerniq-v2-web-svc
      tls: {}
    cerniq-v2-api:
      rule: Host(`api.v2.cerniq.app`)
      service: cerniq-v2-api-svc
      tls: {}
  services:
    cerniq-v2-web-svc:
      loadBalancer:
        servers:
          - url: http://127.0.0.1:25000
    cerniq-v2-api-svc:
      loadBalancer:
        servers:
          - url: http://127.0.0.1:25010
```

## TLS

- ACME DNS-01 sau HTTP-01; sau cert Origin Cloudflare instalat la Traefik dacă Full strict.

## Rețea

- Serviciile aplicație pe `traefik_default` sau accesibile de la procesul Traefik.

## Upstream final

- După închidere topologie: 25xxx și/sau 64xxx — vezi [deploy-topology-v2.md](./deploy-topology-v2.md).
