# firme-api-ext

Extensie pentru API-ul de citire din `/opt/firme-api` (care nu este încă un repository git): graful administratorilor, `GET /grup/<COD_INMATRICULARE>`.

Fișiere de copiat în `/opt/firme-api/src/`: `src/grup.ts` (logică pură, testată aici) și `src/routes/grup.ts` (rută Fastify + interogările SQL); în `src/app.ts` se adaugă `import { grupRoutes } from "./routes/grup.js"` și `await app.register(grupRoutes)`.

## Reguli
- Persoana = **nume normalizat** (majuscule, spații colapsate) + **data nașterii tăiată la zi** (`zz/ll/aaaa` și `zz/ll/aaaa hh:mm:ss` dau aceeași cheie). Niciodată numele singur.
- Fără dată nu se unește nimic: persoana apare doar pe firma deschisă, marcată `neconfirmat`.
- `01/01` este dată slabă: muchia se desenează marcată (`slaba`); cu `slabe=false` nu se mai unește.
- Implicit contează doar `administrator` și `administrator si reprezentant`. Restul calităților (lichidatori, administratori judiciari, reprezentant al persoanei juridice…) sunt stratul `profesional`, pornit cu `profesionisti=true`.
- Nodurile sunt firma (`COD_INMATRICULARE`, CUI doar dacă nu este `0` sau gol) și persoana; muchia poartă calitatea. Registrul nu conține asociați sau acționari.
- Adâncime 1–2, plafon de noduri 20–400 (implicit 120); `trunchiat` și `omise` spun ce a rămas pe dinafară.
- Filtre refăcute din aceeași interogare: `fara` (id-uri de persoane), `faraRoluri` (calități), `slabe`, `profesionisti`.

## Cost
Căutarea firmelor unei persoane parcurge `od_reprezentanti_legali` o dată pe nivel (~0,5 s, fără index nou; prefiltrul pe dată cu lungime 10 sau 19 reduce de la ~2,6 s). Rezultatele se țin 10 minute în memorie, iar concurența este limitată la 3.

## Rulare
`FIRME_API_PORT=4197 pnpm start` într-o sesiune tmux (`firme-api-grup`); nginx din `firme-web` trimite `/api/grup/` acolo, cu limită strictă de cereri. După o repornire a API-ului principal (care încarcă și ruta nouă) location-ul `/api/grup/` se poate scoate din `deploy/nginx.conf`.

## Teste
`npm i && npm test`

## Rute adăugate ulterior
- `GET /anaf/:cui` și `GET /anaf?cui=a,b,c` (max 100): stratul ANAF v9 (`anaf_v9_*`), ultima `data_interogare` per CUI. `stareFiscala` (radiat > dizolvat > suspendat > inactiv > activ) și `tva` (plătitor/anulat/neplătitor) se derivă în `anaf.ts`; v9 prevalează la stare, iar diferențele față de snapshot-ul ANAF 2026 sunt întoarse în `discrepante`, nu ascunse. Stările de interogare (`gasit`, `negasit`, `asteptare`, `exclus`, `absent`) rămân distincte.
- `GET /dosare?cui=|cod=&…` și `GET /dosare/:id`: dosare din portalul instanțelor, legate de firmă doar prin `dosar_legatura` (după nume). Fiecare dosar are un grad de potrivire calculat transparent (`exacta`, `reprezentant`, `partiala`, `nume`), iar răspunsul spune cât de completă este căutarea (`acoperire`).
- Graful contopește înmatriculările multiple ale aceleiași firme (mutări de sediu): același CUI + aceeași denumire de bază = un nod cu `coduri`; același CUI cu denumiri diferite rămâne separat, marcat `cuiPartajat`.
