# SSE, timp real, mod debug — fără PII client

**Scop:** task `ui-sse-optimistic-realtime` — **EventSource**, buffer/throttle, retry erori, mod **debug**; cookie **httpOnly** la autentificare (raport UI / API); **fără PII** în loguri client.

---

## Hook `useBrainSse`

| Fișier | `apps/web/lib/use-brain-sse.ts` |
|--------|----------------------------------|
| Transport | `EventSource` către URL implicit `/api/live` |
| Reconectare | Backoff exponențial la `onerror` (max 30s) |
| Buffer / throttle | Opțional `throttleMs` — coalescează actualizări rapide |
| Evenimente | Parse JSON din `data:`; ignoră payload non-JSON |
| Debug | `setDebug(true)` — `console.debug` doar metadate (**connected**, număr evenimente, **`type`** ultimului eveniment), **fără** serializare completă payload |

---

## Optimistic UI

- Pentru acțiuni utilizator (nu pentru flux SSE brut): folosiți **TanStack Query** (`@tanstack/react-query`) cu `onMutate` / rollback unde e cazul — pattern separat de fluxul telemetriei Brain.

---

## Autentificare

- Token sesiune: **httpOnly** setat de API / domeniu aprobat — nu stocați secrete în `localStorage` pentru apeluri API cross-site; SSE către același origine evită expunerea token în URL.

---

## Teste

- `apps/web/lib/use-brain-sse.spec.ts` — mock `EventSource`, mesaje JSON, ignorare non-JSON, throttle (dacă activ).

---

## Verificare

- Nu logați conținut brut al mesajelor SSE în producție; mod debug doar în dev explicit.
