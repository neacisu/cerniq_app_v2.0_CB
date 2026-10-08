# firme-web

Frontend pentru **firme.cerniq.app**: registrul firmelor din România (ANAF, ONRC, situații financiare 2008–2025).
React 19 + TypeScript + Vite, design „Liquid Glass”, responsive de la telefon la ecrane late.

## Pagini
Acasă · Căutare · Fișa firmei (prezentare, financiar, stări ONRC, reprezentanți, date ANAF) · Comparare · Favorite · Istoric ·
Nomenclatoare (CAEN, stări, versiuni) · Indicatori · Date și API (explorator) · Despre · Setări · 404.
Dialoguri: comenzi rapide (Ctrl K), setări rapide, scurtături, distribuie, export CSV/JSON, alege firmă, confirmare, ajutor, detaliu CAEN.

## Comenzi
```bash
npm install
npm run mock        # API fals pe 127.0.0.1:4186 (aceleași forme ca API-ul real)
npm run dev         # http://localhost:5173, /api -> FIRME_API_TARGET (implicit 127.0.0.1:4186)
npm run build       # typecheck + build în dist/
npm test            # teste unitare (vitest)
```

## API
Clientul vorbește cu API-ul de citire (`/opt/firme-api`) prin prefixul `/api` (`VITE_API_BASE` îl poate schimba).
Indicatorii cheie se identifică după **denumirea din legenda anului**, nu după cod (codurile I* își schimbă sensul între ani).

## Date locale
Favorite, note, istoric, comparare și setări stau doar în `localStorage`.

## Deploy
Vezi `deploy/README.md`.
