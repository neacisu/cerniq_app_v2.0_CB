import type { FastifyPluginAsync } from "fastify";
import { pool } from "../db/client.js";
import { ApiError } from "../http.js";
import { celMaiBun, filtreaza, gradPotrivire, sumar, type DosarLista, type Grad, type LegaturaDosar } from "../dosare.js";

const CUI = /^\d{2,13}$/;
const COD = /^[A-Za-z0-9][A-Za-z0-9/.\-]{2,63}$/;
const PLAFON_INCARCARE = 3000;
interface Rand { [k: string]: unknown }

const cache = new Map<string, { la: number; v: Promise<Incarcat> }>();
const TTL = 5 * 60_000;
interface Incarcat { denumire: string; lista: DosarLista[]; trunchiat: boolean; acoperire: Acoperire }
interface Acoperire { stare: "complet" | "partial" | "in-asteptare" | "necautat" | "necunoscut"; cautari: { sursa: string; tip: string; nume: string; stare: string; dosareGasite: number; plafonAtins: boolean; actualizat: string | null }[] }

async function denumireFirma(cui: string | null, cod: string | null): Promise<string> {
  if (cui) {
    const r = await pool.query<{ d: string }>(
      `select d from (
         select "DENUMIRE" as d, 1 as o from od_firme where "CUI" = $1 and "CUI" <> '0' and "CUI" <> ''
         union all select "DENUMIRE", 2 from date_identificare_platitori_2026 where "COD_FISCAL" = $1
         union all select denumire, 3 from anaf_v9_date_generale where cui = $1) x order by o limit 1`, [cui]);
    if (r.rows[0]) return r.rows[0].d;
  }
  if (cod) {
    const r = await pool.query<{ d: string }>(`select "DENUMIRE" as d from od_firme where "COD_INMATRICULARE" = $1 limit 1`, [cod]);
    if (r.rows[0]) return r.rows[0].d;
  }
  return "";
}

function incarca(cui: string | null, cod: string | null): Promise<Incarcat> {
  const k = `${cui ?? ""}|${cod ?? ""}`;
  const hit = cache.get(k);
  if (hit && Date.now() - hit.la < TTL) return hit.v;
  const v = (async (): Promise<Incarcat> => {
    const denumire = await denumireFirma(cui, cod);
    const filtru = cui ? "l.cui = $1" : "l.cod_inmatriculare = $1";
    const r = await pool.query<Rand>(
      `select d.id, d.numar, d.institutie_nume as instanta, d.departament, d.categorie_nume as categorie, d.stadiu_nume as stadiu, d.obiect,
              to_char(d.data_dosar, 'YYYY-MM-DD') as data_dosar, to_char(d.data_modificare, 'YYYY-MM-DD') as data_modificare,
              (select count(*) from dosar_parte x where x.dosar_id = d.id)::int as nr_parti,
              (select count(*) from dosar_sedinta s where s.dosar_id = d.id)::int as nr_sedinte,
              (select to_char(max(s.data_sedinta), 'YYYY-MM-DD') from dosar_sedinta s where s.dosar_id = d.id) as ultima_sedinta,
              (select count(*) from dosar_cale_atac c where c.dosar_id = d.id)::int as nr_cai_atac,
              jsonb_agg(distinct jsonb_build_object('parte', p.nume, 'calitate', p.calitate, 'motiv', l.motiv, 'interogat', l.nume_interogat)) as legaturi
         from dosar_legatura l join dosar d on d.id = l.dosar_id join dosar_parte p on p.id = l.parte_id
        where ${filtru}
        group by d.id order by d.data_dosar desc nulls last, d.id desc limit ${PLAFON_INCARCARE + 1}`,
      [cui ?? cod],
    );
    const trunchiat = r.rows.length > PLAFON_INCARCARE;
    const prag = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10);
    const lista: DosarLista[] = r.rows.slice(0, PLAFON_INCARCARE).map((x) => {
      const legaturi = (x.legaturi as LegaturaDosar[]).map((l) => ({ ...l, grad: gradPotrivire(l.parte, denumire, l.motiv) as Grad }));
      const data = (x.data_dosar as string | null) ?? null;
      return {
        id: Number(x.id), numar: String(x.numar ?? ""), instanta: String(x.instanta ?? ""), departament: String(x.departament ?? ""), categorie: String(x.categorie ?? ""),
        stadiu: String(x.stadiu ?? ""), obiect: String(x.obiect ?? ""), dataDosar: data, dataModificare: (x.data_modificare as string | null) ?? null,
        anDosar: data ? Number(data.slice(0, 4)) : null, rol: [...new Set(legaturi.map((l) => l.calitate).filter(Boolean))].sort(),
        potrivire: celMaiBun(legaturi.map((l) => l.grad)), legaturi, nrParti: Number(x.nr_parti), nrSedinte: Number(x.nr_sedinte),
        ultimaSedinta: (x.ultima_sedinta as string | null) ?? null, nrCaiAtac: Number(x.nr_cai_atac), dataInViitor: !!data && data > prag,
      };
    });
    let acoperire: Acoperire = { stare: "necunoscut", cautari: [] };
    if (cui) {
      const c = await pool.query<Rand>(
        `select sursa, tip, nume_cautat, stare, dosare_gasite, plafon_atins, to_char(actualizat_la, 'YYYY-MM-DD"T"HH24:MI:SSOF') as actualizat from dosar_coada where cui = $1 order by tip, sursa, nume_cautat`, [cui]);
      const cautari = c.rows.map((x) => ({ sursa: String(x.sursa), tip: String(x.tip), nume: String(x.nume_cautat), stare: String(x.stare), dosareGasite: Number(x.dosare_gasite ?? 0), plafonAtins: Boolean(x.plafon_atins), actualizat: (x.actualizat as string | null) ?? null }));
      const firma = cautari.filter((x) => x.tip === "firma");
      acoperire = {
        cautari,
        stare: cautari.length === 0 ? "necautat" : cautari.some((x) => x.plafonAtins) ? "partial" : firma.some((x) => x.stare === "asteptare") || firma.length === 0 ? "in-asteptare" : "complet",
      };
    }
    return { denumire, lista, trunchiat, acoperire };
  })();
  if (cache.size >= 100) cache.delete(cache.keys().next().value as string);
  cache.set(k, { la: Date.now(), v });
  v.catch(() => cache.delete(k));
  return v;
}

function tinta(q: { cui?: string; cod?: string }): { cui: string | null; cod: string | null } {
  const cui = q.cui?.trim() || null, cod = q.cod?.trim() || null;
  if (!cui && !cod) throw new ApiError(400, "Parametri invalizi");
  if (cui && !CUI.test(cui)) throw new ApiError(400, "Parametri invalizi");
  if (cod && !COD.test(cod)) throw new ApiError(400, "Parametri invalizi");
  return { cui, cod };
}

export const dosareRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Querystring: { cui?: string; cod?: string; categorie?: string; stadiu?: string; rol?: string; an?: number; potrivire?: Grad; q?: string; doarExacte?: boolean; limit?: number; offset?: number } }>(
    "/dosare",
    {
      schema: {
        querystring: {
          type: "object", additionalProperties: false,
          properties: {
            cui: { type: "string", maxLength: 13 }, cod: { type: "string", maxLength: 64 }, categorie: { type: "string", maxLength: 120 }, stadiu: { type: "string", maxLength: 120 },
            rol: { type: "string", maxLength: 80 }, an: { type: "integer", minimum: 1900, maximum: 2100 }, potrivire: { type: "string", enum: ["exacta", "reprezentant", "partiala", "nume"] },
            q: { type: "string", maxLength: 120 }, doarExacte: { type: "boolean", default: false }, limit: { type: "integer", minimum: 1, maximum: 100, default: 25 }, offset: { type: "integer", minimum: 0, maximum: 10000, default: 0 },
          },
        },
      },
    },
    async (request) => {
      const { cui, cod } = tinta(request.query);
      const b = await incarca(cui, cod);
      const f = { categorie: request.query.categorie, stadiu: request.query.stadiu, rol: request.query.rol, an: request.query.an, potrivire: request.query.potrivire, q: request.query.q, doarExacte: request.query.doarExacte };
      const filtrate = filtreaza(b.lista, f);
      const limit = request.query.limit ?? 25, offset = request.query.offset ?? 0;
      return {
        cui, cod, denumireFirma: b.denumire, acoperire: b.acoperire, trunchiat: b.trunchiat, plafonIncarcare: PLAFON_INCARCARE,
        total: filtrate.length, totalFirma: b.lista.length, sumarFirma: sumar(b.lista), sumarFiltrat: sumar(filtrate),
        pagina: { limit, offset }, dosare: filtrate.slice(offset, offset + limit),
      };
    },
  );

  app.get<{ Params: { id: string }; Querystring: { cui?: string; cod?: string } }>("/dosare/:id", async (request) => {
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(400, "Parametri invalizi");
    const { cui, cod } = tinta(request.query);
    const b = await incarca(cui, cod);
    const lista = b.lista.find((d) => d.id === id);
    if (!lista) throw new ApiError(404, "Dosarul nu este legat de această firmă");
    const [d, parti, sedinte, cai] = await Promise.all([
      pool.query<Rand>(`select numar, numar_vechi, institutie_nume, departament, categorie_nume, stadiu_nume, obiect, obiecte_secundare, to_char(data_dosar,'YYYY-MM-DD') as data_dosar, to_char(data_initiala,'YYYY-MM-DD') as data_initiala, to_char(data_modificare,'YYYY-MM-DD HH24:MI') as data_modificare from dosar where id = $1`, [id]),
      pool.query<Rand>(`select ord, nume, calitate, calitate_anterioara, to_char(data_calitate,'YYYY-MM-DD') as data_calitate from dosar_parte where dosar_id = $1 order by ord`, [id]),
      pool.query<Rand>(`select ord, to_char(data_sedinta,'YYYY-MM-DD') as data_sedinta, ora, complet, solutie, solutie_sumar, to_char(data_pronuntare,'YYYY-MM-DD') as data_pronuntare, document_nume, numar_document, to_char(data_document,'YYYY-MM-DD') as data_document from dosar_sedinta where dosar_id = $1 order by data_sedinta desc nulls last, ord`, [id]),
      pool.query<Rand>(`select ord, to_char(data_declarare,'YYYY-MM-DD') as data_declarare, parte_declaratoare, tip from dosar_cale_atac where dosar_id = $1 order by ord`, [id]),
    ]);
    const x = d.rows[0];
    if (!x) throw new ApiError(404, "Dosarul nu a fost găsit");
    return {
      ...lista,
      numarVechi: (x.numar_vechi as string | null) || null, departament: String(x.departament ?? ""), obiecteSecundare: (x.obiecte_secundare as string | null) || null, dataInitiala: (x.data_initiala as string | null) ?? null,
      parti: parti.rows.map((p) => ({ ord: Number(p.ord), nume: String(p.nume ?? ""), calitate: String(p.calitate ?? ""), calitateAnterioara: (p.calitate_anterioara as string | null) || null, dataCalitate: (p.data_calitate as string | null) ?? null })),
      sedinte: sedinte.rows.map((x2) => ({ data: (x2.data_sedinta as string | null) ?? null, ora: (x2.ora as string | null) || null, complet: (x2.complet as string | null) || null, solutie: (x2.solutie as string | null) || null, solutieSumar: (x2.solutie_sumar as string | null) || null, dataPronuntare: (x2.data_pronuntare as string | null) ?? null, document: (x2.document_nume as string | null) || null, numarDocument: (x2.numar_document as string | null) || null, dataDocument: (x2.data_document as string | null) ?? null })),
      caiAtac: cai.rows.map((c) => ({ data: (c.data_declarare as string | null) ?? null, parte: (c.parte_declaratoare as string | null) || null, tip: (c.tip as string | null) || null })),
    };
  });
};
