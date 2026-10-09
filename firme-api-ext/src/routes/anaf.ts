import type { FastifyPluginAsync } from "fastify";
import { pool } from "../db/client.js";
import { ApiError } from "../http.js";
import { discrepante, stareFiscala, stareTva, type StareInterogare } from "../anaf.js";

const CUI = /^\d{2,13}$/;
const MOTIVE_EXCLUS: Record<string, string> = {
  cnp: "Cod numeric personal: persoană fizică, datele ANAF nu se afișează",
  cifra_control: "CUI cu cifră de control invalidă",
  lungime: "Lungime invalidă pentru un CUI",
  scurt: "CUI prea scurt",
};

interface Rand { [k: string]: unknown }
const s = (v: unknown): string | null => (v === null || v === undefined || v === "" ? null : String(v));
const b = (v: unknown): boolean | null => (v === null || v === undefined ? null : Boolean(v));

type Tinta = { cui: string; stare: StareInterogare };

/** Un rând rezumat per CUI, pentru liste (căutare, graf, comparare). */
async function rezumate(cuis: string[]) {
  const r = await pool.query<Rand>(
    `select c.cui, c.stare, c.origine, dg.denumire, dg.stare_inregistrare, dg.status_ro_e_factura, i.status_inactivi, i.data_inactivare, i.data_radiere,
            st.scp_tva, (select count(*) from anaf_v9_perioada_tva p where p.cui = c.cui and p.data_interogare = dg.data_interogare)::int as nr_perioade,
            c.data_interogare
       from anaf_v9_cui c
       left join anaf_v9_date_generale dg on dg.cui = c.cui and dg.data_interogare = c.data_interogare
       left join anaf_v9_inactiv i on i.cui = c.cui and i.data_interogare = c.data_interogare
       left join anaf_v9_scop_tva st on st.cui = c.cui and st.data_interogare = c.data_interogare
      where c.cui = any($1::text[])`,
    [cuis],
  );
  const ex = await pool.query<{ cui: string; motiv: string }>(`select cui, motiv from anaf_v9_exclus where cui = any($1::text[])`, [cuis]);
  const exclus = new Map(ex.rows.map((x) => [x.cui, x.motiv]));
  const gasite = new Map(r.rows.map((x) => [String(x.cui), x]));
  return cuis.map((cui) => {
    if (exclus.has(cui)) return { cui, stare: "exclus" as StareInterogare, motiv: exclus.get(cui) ?? null };
    const x = gasite.get(cui);
    if (!x) return { cui, stare: "absent" as StareInterogare };
    const stare = (x.stare === "gasit" ? "gasit" : x.stare === "negasit" ? "negasit" : "asteptare") as StareInterogare;
    if (stare !== "gasit") return { cui, stare };
    const sf = stareFiscala({ stareInregistrare: s(x.stare_inregistrare), statusInactiv: b(x.status_inactivi), dataRadiere: s(x.data_radiere) });
    return {
      cui, stare, denumire: s(x.denumire), stareFiscala: sf, tva: stareTva({ scopTva: b(x.scp_tva), nrPerioade: Number(x.nr_perioade ?? 0) }),
      eFactura: b(x.status_ro_e_factura), dataInactivare: s(x.data_inactivare), dataInterogare: s(x.data_interogare), descoperitDeScanare: x.origine === "scan",
    };
  });
}

export const anafRoutes: FastifyPluginAsync = async (app) => {
  // Rezumate pentru liste: /anaf?cui=1,2,3 (maximum 100)
  app.get<{ Querystring: { cui: string } }>(
    "/anaf",
    { schema: { querystring: { type: "object", additionalProperties: false, required: ["cui"], properties: { cui: { type: "string", minLength: 2, maxLength: 1500 } } } } },
    async (request) => {
      const lista = [...new Set(request.query.cui.split(",").map((x) => x.trim()).filter(Boolean))];
      if (lista.length === 0 || lista.length > 100 || lista.some((x) => !CUI.test(x))) throw new ApiError(400, "Parametri invalizi");
      return { rezultate: await rezumate(lista) };
    },
  );

  // Fișa ANAF completă pentru un CUI
  app.get<{ Params: { cui: string } }>("/anaf/:cui", async (request) => {
    const cui = request.params.cui;
    if (!CUI.test(cui)) throw new ApiError(400, "Parametri invalizi");

    const ex = await pool.query<{ motiv: string }>(`select motiv from anaf_v9_exclus where cui = $1`, [cui]);
    if (ex.rows[0]) return { cui, stare: "exclus" as StareInterogare, motiv: MOTIVE_EXCLUS[ex.rows[0].motiv] ?? ex.rows[0].motiv };
    const c = await pool.query<Rand>(`select stare, origine, zona, data_interogare, actualizat_la from anaf_v9_cui where cui = $1`, [cui]);
    const rc = c.rows[0];
    if (!rc) return { cui, stare: "absent" as StareInterogare };
    if (rc.stare !== "gasit") return { cui, stare: (rc.stare === "negasit" ? "negasit" : "asteptare") as StareInterogare, descoperitDeScanare: rc.origine === "scan" };

    const m = await pool.query<Rand>(
      `select dg.*, i.data_inactivare, i.data_reactivare, i.data_publicare, i.data_radiere, i.status_inactivi,
              st.scp_tva, r.data_inceput_tva_inc, r.data_sfarsit_tva_inc, r.data_actualizare_tva_inc, r.data_publicare_tva_inc, r.tip_act_tva_inc, r.status_tva_incasare,
              sp.data_inceput_split_tva, sp.data_anulare_split_tva, sp.status_split_tva,
              se.s_denumire_strada, se.s_numar_strada, se.s_denumire_localitate, se.s_denumire_judet, se.s_cod_postal, se.s_detalii_adresa, se.s_tara,
              dm.d_denumire_strada, dm.d_numar_strada, dm.d_denumire_localitate, dm.d_denumire_judet, dm.d_cod_postal, dm.d_detalii_adresa, dm.d_tara
         from anaf_v9_date_generale dg
         left join anaf_v9_inactiv i on i.cui = dg.cui and i.data_interogare = dg.data_interogare
         left join anaf_v9_scop_tva st on st.cui = dg.cui and st.data_interogare = dg.data_interogare
         left join anaf_v9_rtvai r on r.cui = dg.cui and r.data_interogare = dg.data_interogare
         left join anaf_v9_split sp on sp.cui = dg.cui and sp.data_interogare = dg.data_interogare
         left join anaf_v9_sediu se on se.cui = dg.cui and se.data_interogare = dg.data_interogare
         left join anaf_v9_domiciliu dm on dm.cui = dg.cui and dm.data_interogare = dg.data_interogare
        where dg.cui = $1 order by dg.data_interogare desc limit 1`,
      [cui],
    );
    const x = m.rows[0];
    if (!x) return { cui, stare: "asteptare" as StareInterogare };
    const data = String(x.data_interogare);
    const [per, src, snap] = await Promise.all([
      pool.query<Rand>(`select ordine, data_inceput_scp_tva, data_sfarsit_scp_tva, data_anul_imp_scp_tva, mesaj_scp_tva from anaf_v9_perioada_tva where cui = $1 and data_interogare = $2 order by ordine`, [cui, data]),
      pool.query<Rand>(`select sursa, cod_inmatriculare, nr_randuri, adrese_diferite, denumiri_diferite from anaf_v9_sursa where cui = $1 order by sursa`, [cui]),
      pool.query<Rand>(`select "STARE" as stare, "TVA" as tva, "DENUMIRE" as denumire, "DATA_STARE" as data_stare, "TELEFON" as telefon, "FAX" as fax from date_identificare_platitori_2026 where "COD_FISCAL" = $1 limit 1`, [cui]),
    ]);
    const perioade = per.rows.map((p) => ({ ordine: Number(p.ordine), inceput: s(p.data_inceput_scp_tva), sfarsit: s(p.data_sfarsit_scp_tva), dataAnulare: s(p.data_anul_imp_scp_tva), mesaj: s(p.mesaj_scp_tva) }));
    const sf = stareFiscala({ stareInregistrare: s(x.stare_inregistrare), statusInactiv: b(x.status_inactivi), dataRadiere: s(x.data_radiere) });
    const tva = stareTva({ scopTva: b(x.scp_tva), nrPerioade: perioade.length });
    const sn = snap.rows[0] ?? null;
    return {
      cui, stare: "gasit" as StareInterogare, dataInterogare: data, descoperitDeScanare: rc.origine === "scan",
      stareFiscala: sf, tva,
      generale: {
        denumire: s(x.denumire), adresa: s(x.adresa), nrRegCom: s(x.nr_reg_com), telefon: s(x.telefon), fax: s(x.fax), codPostal: s(x.cod_postal), act: s(x.act),
        stareInregistrare: s(x.stare_inregistrare), dataInregistrare: s(x.data_inregistrare), codCaen: s(x.cod_caen), iban: s(x.iban),
        organFiscal: s(x.organ_fiscal_competent), formaProprietate: s(x.forma_de_proprietate), formaOrganizare: s(x.forma_organizare), formaJuridica: s(x.forma_juridica),
      },
      inactiv: { activ: b(x.status_inactivi) ?? false, dataInactivare: s(x.data_inactivare), dataReactivare: s(x.data_reactivare), dataPublicare: s(x.data_publicare), dataRadiere: s(x.data_radiere) },
      tvaDetaliu: { inScopTva: b(x.scp_tva), perioade },
      tvaIncasare: { activ: b(x.status_tva_incasare) ?? false, inceput: s(x.data_inceput_tva_inc), sfarsit: s(x.data_sfarsit_tva_inc), actualizare: s(x.data_actualizare_tva_inc), publicare: s(x.data_publicare_tva_inc), tipAct: s(x.tip_act_tva_inc) },
      split: { activ: b(x.status_split_tva) ?? false, inceput: s(x.data_inceput_split_tva), anulare: s(x.data_anulare_split_tva) },
      eFactura: { inregistrat: b(x.status_ro_e_factura) ?? false, data: s(x.data_inreg_reg_ro_e_factura) },
      sediu: { strada: s(x.s_denumire_strada), numar: s(x.s_numar_strada), localitate: s(x.s_denumire_localitate), judet: s(x.s_denumire_judet), codPostal: s(x.s_cod_postal), detalii: s(x.s_detalii_adresa), tara: s(x.s_tara) },
      domiciliu: { strada: s(x.d_denumire_strada), numar: s(x.d_numar_strada), localitate: s(x.d_denumire_localitate), judet: s(x.d_denumire_judet), codPostal: s(x.d_cod_postal), detalii: s(x.d_detalii_adresa), tara: s(x.d_tara) },
      surse: src.rows.map((r) => ({ sursa: String(r.sursa), codInmatriculare: s(r.cod_inmatriculare), nrRanduri: Number(r.nr_randuri ?? 0), adreseDiferite: b(r.adrese_diferite), denumiriDiferite: b(r.denumiri_diferite) })),
      snapshot: sn ? { stare: s(sn.stare), tva: s(sn.tva), denumire: s(sn.denumire), dataStare: s(sn.data_stare), telefon: s(sn.telefon), fax: s(sn.fax) } : null,
      discrepante: discrepante({ stareFiscala: sf, tva, denumire: s(x.denumire), adresa: s(x.adresa) }, sn ? { stare: s(sn.stare), tva: s(sn.tva), denumire: s(sn.denumire), adresa: null } : null),
    };
  });
};
export type { Tinta };
