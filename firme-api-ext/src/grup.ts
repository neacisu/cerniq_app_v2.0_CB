/**
 * Graful administratorilor, extins din o firmă deschisă (nu un graf precalculat al țării).
 *
 * Noduri: firma (COD_INMATRICULARE) și persoana (nume normalizat + data nașterii tăiată la zi).
 * Muchii: persoană—firmă, cu calitatea. Registrul încărcat nu conține asociați sau acționari:
 * un grup aici înseamnă „același administrator”, nu „același proprietar”.
 *
 * Reguli de cinste:
 *  - fără dată de naștere nu se unește nimic (persoana apare doar pe firma rădăcină, neconfirmat);
 *  - 01/01 este dată slabă: muchia se desenează marcat și poate fi scoasă din filtru;
 *  - implicit contează doar `administrator` și `administrator si reprezentant`; restul calităților
 *    (lichidatori, administratori judiciari, reprezentanți ai persoanei juridice…) sunt un strat separat.
 */

export const CALITATI_NUCLEU = ['administrator', 'administrator si reprezentant'] as const;
export const ADANCIME_MAX = 2;
export const PLAFON_MIN = 20;
export const PLAFON_MAX = 400;
export const PLAFON_IMPLICIT = 120;

/** Rând din od_reprezentanti_legali, deja normalizat de SQL (vezi routes/grup.ts). */
export interface Rep {
  cod: string;
  nume: string;          // MAJUSCULE, spații colapsate
  data: string | null;   // zz/ll/aaaa sau null când lipsește / nu este o dată
  calitate: string;      // litere mici, spații colapsate
}
export interface Optiuni {
  adancime: 1 | 2;
  plafon: number;
  profesionisti: boolean;
  dateSlabe: boolean;
  fara: string[];        // id-uri de persoane scoase din graf
  faraRoluri: string[];  // calități scoase din graf
}
export interface FirmaInfo { denumire: string; cui: string | null }
export interface Deps {
  repsDeFirme(cods: string[]): Promise<Rep[]>;
  /** Toate firmele persoanelor date (potrivire pe cheia nume+dată), limitate la calitățile cerute (null = toate). */
  repsDePersoane(chei: { nume: string; data: string }[], doarCalitati: readonly string[] | null): Promise<Rep[]>;
  firme(cods: string[]): Promise<Map<string, FirmaInfo>>;
}

export type Strat = 'administrator' | 'profesional';
export interface NodFirma { id: string; tip: 'firma'; cod: string; cui: string | null; denumire: string; nivel: number; radacina: boolean }
export interface NodPersoana { id: string; tip: 'persoana'; nume: string; data: string; slaba: boolean; nivel: number; nrFirme: number; calitati: string[] }
export interface Muchie { persoana: string; firma: string; calitate: string; strat: Strat; slaba: boolean }
export interface Neconfirmat { nume: string; data: string | null; calitate: string; strat: Strat; motiv: 'fara-data' | 'data-slaba' }
export interface Graf {
  radacina: { cod: string; cui: string | null; denumire: string };
  noduri: (NodFirma | NodPersoana)[];
  muchii: Muchie[];
  neconfirmate: Neconfirmat[];
  roluri: { calitate: string; nr: number; activ: boolean }[];
  trunchiat: boolean;
  omise: { firme: number; persoane: number };
  parametri: Optiuni;
}

/** Echivalentul în JS al normalizării din SQL: majuscule + spații colapsate; data tăiată la zi (ambele forme dau aceeași cheie). */
export function cheiePersoana(numeBrut: string, dataBrut: string | null | undefined): { nume: string; data: string | null } {
  const nume = numeBrut.replace(/\s+/g, ' ').trim().toUpperCase();
  const d = (dataBrut ?? '').trim();
  return { nume, data: /^\d{2}\/\d{2}\/\d{4}( \d{2}:\d{2}:\d{2})?$/.test(d) ? d.slice(0, 10) : null };
}
export const idPersoana = (nume: string, data: string): string => `p:${nume}|${data}`;
export const idFirma = (cod: string): string => `f:${cod}`;
export const esteSlaba = (data: string): boolean => data.slice(0, 5) === '01/01';
export const stratul = (calitate: string): Strat => ((CALITATI_NUCLEU as readonly string[]).includes(calitate) ? 'administrator' : 'profesional');
export const cuiUtilizabil = (cui: string | null | undefined): cui is string => !!cui && cui !== '0' && cui.trim() !== '';

export function normalizeaza(opt: Partial<Optiuni>): Optiuni {
  const a = opt.adancime === 2 ? 2 : 1;
  const p = Math.min(PLAFON_MAX, Math.max(PLAFON_MIN, Math.trunc(opt.plafon ?? PLAFON_IMPLICIT)));
  return {
    adancime: a, plafon: Number.isFinite(p) ? p : PLAFON_IMPLICIT, profesionisti: !!opt.profesionisti, dateSlabe: opt.dateSlabe !== false,
    fara: [...new Set(opt.fara ?? [])].sort(), faraRoluri: [...new Set(opt.faraRoluri ?? [])].sort(),
  };
}

interface PersoanaAcc { id: string; nume: string; data: string; nivel: number; nrFirme: number; calitati: Set<string> }

export async function construiesteGraf(deps: Deps, radacina: { cod: string; cui: string | null; denumire: string }, optiuni: Partial<Optiuni>): Promise<Graf> {
  const o = normalizeaza(optiuni);
  const fara = new Set(o.fara), faraRoluri = new Set(o.faraRoluri);
  const doarCalitati = o.profesionisti ? null : CALITATI_NUCLEU;

  const noduriFirme = new Map<string, NodFirma>();
  const persoane = new Map<string, PersoanaAcc>();
  const muchii = new Map<string, Muchie>();
  const neconfirmate: Neconfirmat[] = [];
  const roluri = new Map<string, number>();
  let buget = o.plafon;
  let trunchiat = false;
  const omiseFirme = new Set<string>();
  let omisePersoane = 0;

  const addMuchie = (persoana: string, firma: string, calitate: string, slaba: boolean) => {
    const k = `${persoana}>${firma}>${calitate}`;
    if (!muchii.has(k)) muchii.set(k, { persoana, firma, calitate, strat: stratul(calitate), slaba });
  };
  const numaraRol = (calitate: string) => roluri.set(calitate, (roluri.get(calitate) ?? 0) + 1);
  /** Un rând intră în graf dacă calitatea nu este scoasă și respectă stratul ales. */
  const accepta = (r: Rep): boolean => r.nume !== '' && !faraRoluri.has(r.calitate) && (o.profesionisti || stratul(r.calitate) === 'administrator');
  const cheie = (r: Rep): { id: string; slaba: boolean } | null => (r.data ? { id: idPersoana(r.nume, r.data), slaba: esteSlaba(r.data) } : null);
  /** Persoanele cu dată slabă pot fi excluse din filtru: atunci nu se mai unesc, ca și cele fără dată. */
  const unibila = (r: Rep): boolean => !!r.data && (o.dateSlabe || !esteSlaba(r.data));

  // Rădăcina
  noduriFirme.set(idFirma(radacina.cod), { id: idFirma(radacina.cod), tip: 'firma', cod: radacina.cod, cui: cuiUtilizabil(radacina.cui) ? radacina.cui : null, denumire: radacina.denumire, nivel: 0, radacina: true });
  buget -= 1;

  // Nivelul 0: administratorii firmei deschise
  const repsRad = (await deps.repsDeFirme([radacina.cod])).filter((r) => r.cod === radacina.cod);
  for (const r of repsRad) {
    if (r.nume === '' || faraRoluri.has(r.calitate)) continue;
    if (!o.profesionisti && stratul(r.calitate) !== 'administrator') continue;
    numaraRol(r.calitate);
    if (!unibila(r)) { neconfirmate.push({ nume: r.nume, data: r.data, calitate: r.calitate, strat: stratul(r.calitate), motiv: r.data ? 'data-slaba' : 'fara-data' }); continue; }
    const k = cheie(r)!;
    if (fara.has(k.id)) continue;
    let p = persoane.get(k.id);
    if (!p) {
      if (buget <= 0) { omisePersoane++; trunchiat = true; continue; }
      p = { id: k.id, nume: r.nume, data: r.data!, nivel: 0, nrFirme: 1, calitati: new Set() }; persoane.set(k.id, p); buget--;
    }
    p.calitati.add(r.calitate);
    addMuchie(k.id, idFirma(radacina.cod), r.calitate, k.slaba);
  }

  // Firmele unei liste de persoane (potrivire exactă pe nume + dată); rezultatul e grupat pe id de persoană
  const firmeleLor = async (lista: { id: string; nume: string; data: string }[]): Promise<Map<string, Rep[]>> => {
    const out = new Map<string, Rep[]>();
    if (lista.length === 0) return out;
    const cerute = new Set(lista.map((p) => p.id));
    for (const r of await deps.repsDePersoane(lista.map((p) => ({ nume: p.nume, data: p.data })), doarCalitati)) {
      if (!r.data || !accepta(r)) continue;
      const id = idPersoana(r.nume, r.data);
      if (!cerute.has(id)) continue;
      const l = out.get(id) ?? []; l.push(r); out.set(id, l);
    }
    return out;
  };

  const nivel0 = [...persoane.keys()];
  const firmeNivel1 = new Set<string>();
  if (o.adancime >= 1 && nivel0.length > 0) {
    const legaturi = await firmeleLor(nivel0.map((id) => persoane.get(id)!));
    const candidate = new Set<string>();
    for (const [id, rows] of legaturi) {
      const cods = new Set(rows.map((r) => r.cod));
      persoane.get(id)!.nrFirme = cods.size;
      for (const c of cods) if (c !== radacina.cod) candidate.add(c);
    }
    for (const cod of [...candidate].sort()) {
      if (buget <= 0) { omiseFirme.add(cod); trunchiat = true; continue; }
      noduriFirme.set(idFirma(cod), { id: idFirma(cod), tip: 'firma', cod, cui: null, denumire: cod, nivel: 1, radacina: false });
      firmeNivel1.add(cod); buget--;
    }
    for (const [id, rows] of legaturi) for (const r of rows) if (firmeNivel1.has(r.cod)) { numaraRol(r.calitate); addMuchie(id, idFirma(r.cod), r.calitate, esteSlaba(r.data!)); }
  }

  // Nivelul 2: administratorii firmelor de nivel 1 și celelalte firme ale lor
  if (o.adancime >= 2 && firmeNivel1.size > 0 && buget > 0) {
    const repsF1 = (await deps.repsDeFirme([...firmeNivel1])).filter((r) => firmeNivel1.has(r.cod) && accepta(r) && unibila(r));
    const noi = new Map<string, { nume: string; data: string; slaba: boolean; legaturiF1: Rep[] }>();
    for (const r of repsF1) {
      const id = idPersoana(r.nume, r.data!);
      if (persoane.has(id) || fara.has(id)) continue;
      const n = noi.get(id) ?? { nume: r.nume, data: r.data!, slaba: esteSlaba(r.data!), legaturiF1: [] };
      n.legaturiF1.push(r); noi.set(id, n);
    }
    const legaturi = await firmeleLor([...noi.entries()].map(([id, n]) => ({ id, nume: n.nume, data: n.data })));
    for (const id of [...noi.keys()].sort()) {
      const n = noi.get(id)!;
      const rows = legaturi.get(id) ?? [];
      const firmeNoi = [...new Set(rows.map((r) => r.cod).filter((c) => c !== radacina.cod && !firmeNivel1.has(c)))].sort();
      if (firmeNoi.length === 0) continue; // administrator al unei singure firme din graf: nu leagă nimic nou
      const existente = firmeNoi.some((c) => noduriFirme.has(idFirma(c)));
      if (buget < (existente ? 1 : 2)) { omisePersoane++; for (const c of firmeNoi) if (!noduriFirme.has(idFirma(c))) omiseFirme.add(c); trunchiat = true; continue; }
      persoane.set(id, { id, nume: n.nume, data: n.data, nivel: 1, nrFirme: new Set(rows.map((r) => r.cod)).size, calitati: new Set() });
      buget--;
      for (const r of n.legaturiF1) { numaraRol(r.calitate); addMuchie(id, idFirma(r.cod), r.calitate, n.slaba); }
      for (const cod of firmeNoi) {
        if (!noduriFirme.has(idFirma(cod))) {
          if (buget <= 0) { omiseFirme.add(cod); trunchiat = true; continue; }
          noduriFirme.set(idFirma(cod), { id: idFirma(cod), tip: 'firma', cod, cui: null, denumire: cod, nivel: 2, radacina: false }); buget--;
        }
        for (const r of rows) if (r.cod === cod) { numaraRol(r.calitate); addMuchie(id, idFirma(cod), r.calitate, n.slaba); }
      }
    }
  }

  // Denumiri și CUI pentru firmele adăugate
  const necunoscute = [...noduriFirme.values()].filter((f) => !f.radacina).map((f) => f.cod);
  if (necunoscute.length > 0) {
    const info = await deps.firme(necunoscute);
    for (const f of noduriFirme.values()) { const i = info.get(f.cod); if (i && !f.radacina) { f.denumire = i.denumire; f.cui = cuiUtilizabil(i.cui) ? i.cui : null; } }
  }

  // Persoanele fără nicio muchie rămasă (de exemplu după plafon) nu se desenează
  const cuMuchii = new Set([...muchii.values()].map((m) => m.persoana));
  for (const id of [...persoane.keys()]) if (!cuMuchii.has(id)) persoane.delete(id);
  for (const p of persoane.values()) for (const m of muchii.values()) if (m.persoana === p.id) p.calitati.add(m.calitate);

  const noduri: Graf['noduri'] = [
    ...[...noduriFirme.values()].sort((a, b) => a.nivel - b.nivel || a.denumire.localeCompare(b.denumire, 'ro')),
    ...[...persoane.values()].sort((a, b) => a.nivel - b.nivel || a.nume.localeCompare(b.nume, 'ro') || a.data.localeCompare(b.data)).map((p): NodPersoana => ({
      id: p.id, tip: 'persoana', nume: p.nume, data: p.data, slaba: esteSlaba(p.data), nivel: p.nivel, nrFirme: p.nrFirme, calitati: [...p.calitati].sort(),
    })),
  ];
  const rol = [...roluri.entries()].map(([calitate, nr]) => ({ calitate, nr, activ: true }));
  for (const c of faraRoluri) if (!roluri.has(c)) rol.push({ calitate: c, nr: 0, activ: false });
  rol.sort((a, b) => b.nr - a.nr || a.calitate.localeCompare(b.calitate));
  return { radacina, noduri, muchii: [...muchii.values()], neconfirmate, roluri: rol, trunchiat, omise: { firme: omiseFirme.size, persoane: omisePersoane }, parametri: o };
}
