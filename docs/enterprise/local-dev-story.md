# Poveste dezvoltare locală / dev

## stacks-02

- **Nu** rula `postgres`, `redis`, `mail` în compose-ul proiectului.
- Conectare la **PostgreSQL central** și **redis-shared** prin VPN/vSwitch sau tunnel aprobat din CMDB.
- Secrete din **OpenBao** sau `.env.local` ignorat de git (fără commit).

## Tooling

- `pnpm install`, `pnpm exec nx serve api`, `pnpm exec nx dev web`.
- Temporal: client către cluster partajat; nu cluster nou în repo.

## Traefik

- În dev local, opțional fără Traefik (direct localhost); în integrare, labels pe rețea `traefik_default`.

## stacks-04/05

- Conștient de **MTU 1450** și VIP `10.0.1.10` pentru Redis.
- **hz.164** ca referință flux cerniq-dev (stacks-03).
