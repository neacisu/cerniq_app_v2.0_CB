import type { FastifyPluginAsync } from "fastify";
import { pool } from "../db/client.js";
import { ApiError } from "../http.js";
import {
  PLAFON_IMPLICIT, PLAFON_MAX, PLAFON_MIN, construiesteGraf, normalizeaza,
  type Deps, type FirmaInfo, type Graf, type Rep,
} from "../grup.js";

const COD_PATTERN = /^[A-Za-z0-9][A-Za-z0-9/.\-]{2,63}$/;

// Normalizarea se face în SQL, ca aceeași expresie să producă și cheia returnată, și potrivirea:
// nume = MAJUSCULE cu spații colapsate; dată = zz/ll/aaaa (cu sau fără oră) tăiată la zi, altfel NULL.
const REGEX_DATA = String.raw`^\d{2}/\d{2}/\d{4}( \d{2}:\d{2}:\d{2})?$`;
const nume = (c: string) => String.raw`upper(regexp_replace(btrim(${c}), '\s+', ' ', 'g'))`;
const calitate = (c: string) => String.raw`lower(regexp_replace(btrim(${c}), '\s+', ' ', 'g'))`;

const deps: Deps = {
  async repsDeFirme(cods) {
    const r = await pool.query<Rep>(
      `select "COD_INMATRICULARE" as cod, ${nume('"PERSOANA_IMPUTERNICITA"')} as nume,
              case when btrim("DATA_NASTERE") ~ '${REGEX_DATA}' then left(btrim("DATA_NASTERE"), 10) end as data,
              ${calitate('"CALITATE"')} as calitate
         from od_reprezentanti_legali where "COD_INMATRICULARE" = any($1::text[])`,
      [cods],
    );
    return r.rows;
  },
  async repsDePersoane(chei, doarCalitati) {
    if (chei.length === 0) return [];
    // Prefiltrul ieftin pe dată (și lungimea 10 sau 19, adică cele două forme din sursă) înaintea expresiei de nume
    // scade parcurgerea tabelei de la ~2,6 s la ~0,5 s; potrivirea exactă rămâne cea din JOIN.
    const r = await pool.query<Rep>(
      `select r."COD_INMATRICULARE" as cod, k.nume, k.data, ${calitate('r."CALITATE"')} as calitate
         from od_reprezentanti_legali r
         join unnest($1::text[], $2::text[]) as k(nume, data)
           on ${nume('r."PERSOANA_IMPUTERNICITA"')} = k.nume
          and left(btrim(r."DATA_NASTERE"), 10) = k.data
        where left(btrim(r."DATA_NASTERE"), 10) = any($2::text[])
          and length(btrim(r."DATA_NASTERE")) in (10, 19)
          and ($3::text[] is null or ${calitate('r."CALITATE"')} = any($3::text[]))`,
      [chei.map((k) => k.nume), chei.map((k) => k.data), doarCalitati ? [...doarCalitati] : null],
    );
    return r.rows;
  },
  async firme(cods) {
    const r = await pool.query<{ cod: string; denumire: string; cui: string }>(
      `select distinct on ("COD_INMATRICULARE") "COD_INMATRICULARE" as cod, "DENUMIRE" as denumire, "CUI" as cui
         from od_firme where "COD_INMATRICULARE" = any($1::text[]) order by "COD_INMATRICULARE", "DENUMIRE"`,
      [cods],
    );
    return new Map<string, FirmaInfo>(r.rows.map((x) => [x.cod, { denumire: x.denumire, cui: x.cui }]));
  },
};

// Datele sunt statice (snapshot), deci rezultatul se poate ține în memorie. Parcurgerea tabelei de
// reprezentanți costă ~0,3 s pe nivel, așa că limităm și concurența ca graful să nu înfometeze restul API-ului.
const CACHE_TTL_MS = 10 * 60_000;
const CACHE_MAX = 200;
const cache = new Map<string, { la: number; graf: Graf }>();
const CONCURENTA_MAX = 3;
let active = 0;

export const grupRoutes: FastifyPluginAsync = async (app) => {
  app.get<{
    Params: { "*": string };
    Querystring: { adancime?: number; plafon?: number; profesionisti?: boolean; slabe?: boolean; fara?: string[]; faraRoluri?: string[] };
  }>(
    "/grup/*",
    {
      schema: {
        querystring: {
          type: "object",
          additionalProperties: false,
          properties: {
            adancime: { type: "integer", minimum: 1, maximum: 2, default: 1 },
            plafon: { type: "integer", minimum: PLAFON_MIN, maximum: PLAFON_MAX, default: PLAFON_IMPLICIT },
            profesionisti: { type: "boolean", default: false },
            slabe: { type: "boolean", default: true },
            fara: { type: "array", maxItems: 50, items: { type: "string", maxLength: 200 } },
            faraRoluri: { type: "array", maxItems: 30, items: { type: "string", maxLength: 80 } },
          },
        },
      },
    },
    async (request) => {
      const brut = request.params["*"].trim();
      if (!COD_PATTERN.test(brut)) throw new ApiError(400, "Parametri invalizi");
      const q = request.query;
      const optiuni = normalizeaza({
        adancime: q.adancime === 2 ? 2 : 1, plafon: q.plafon, profesionisti: q.profesionisti, dateSlabe: q.slabe, fara: q.fara, faraRoluri: q.faraRoluri,
      });

      const cheieCache = `${brut.toUpperCase()}|${JSON.stringify(optiuni)}`;
      const hit = cache.get(cheieCache);
      if (hit && Date.now() - hit.la < CACHE_TTL_MS) return hit.graf;

      if (active >= CONCURENTA_MAX) throw new ApiError(503, "Serviciul este ocupat. Încearcă din nou în câteva secunde.");
      active++;
      try {
        let gasite = await deps.firme([brut]);
        let cod = brut;
        if (gasite.size === 0 && brut !== brut.toUpperCase()) { cod = brut.toUpperCase(); gasite = await deps.firme([cod]); }
        const info = gasite.get(cod);
        if (!info) throw new ApiError(404, "Firma nu a fost găsită");
        const graf = await construiesteGraf(deps, { cod, cui: info.cui, denumire: info.denumire }, optiuni);
        if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string);
        cache.set(cheieCache, { la: Date.now(), graf });
        return graf;
      } finally {
        active--;
      }
    },
  );
};
