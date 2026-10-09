import { describe, expect, it } from 'vitest';
import { cheiePersoana, construiesteGraf, esteSlaba, idPersoana, type Deps, type Rep } from './grup.js';

const R = (cod: string, nume: string, data: string | null, calitate = 'administrator'): Rep => ({ cod, nume, data, calitate });

const INFO: Record<string, { denumire: string; cui: string | null }> = {};
const info = (c: string) => INFO[c] ?? { denumire: `Firma ${c}`, cui: c === 'F9' ? '0' : `9${c}` }; // CUI diferit pentru fiecare cod, ca testele vechi să rămână valabile

function deps(reps: Rep[]): Deps {
  return {
    repsDeFirme: async (cods: string[]) => reps.filter((r) => cods.includes(r.cod)),
    repsDePersoane: async (chei: { nume: string; data: string }[], doar: readonly string[] | null) => reps.filter((r) => r.data && chei.some((k: { nume: string; data: string }) => k.nume === r.nume && k.data === r.data) && (!doar || doar.includes(r.calitate))),
    firme: async (cods: string[]) => new Map(cods.map((c: string) => [c, info(c)])),
  };
}
const rad = { cod: 'F0', cui: '123', denumire: 'Radacina' };
const ids = (g: Awaited<ReturnType<typeof construiesteGraf>>, tip: string) => g.noduri.filter((n) => n.tip === tip).map((n) => n.id);

describe('cheie persoană', () => {
  it('data cu și fără oră dă aceeași cheie; numele se normalizează', () => {
    expect(cheiePersoana(' neacşu   florin ', '02/08/1956 09:50:35')).toEqual(cheiePersoana('NEACŞU FLORIN', '02/08/1956'));
    expect(cheiePersoana('X', '')).toEqual({ nume: 'X', data: null });
    expect(cheiePersoana('X', 'necunoscut').data).toBeNull();
  });
  it('01/01 este dată slabă indiferent de an', () => { expect(esteSlaba('01/01/1968')).toBe(true); expect(esteSlaba('02/01/1968')).toBe(false); });
});

describe('graful administratorilor', () => {
  const baza = [R('F0', 'ION', '01/02/1970'), R('F1', 'ION', '01/02/1970'), R('F2', 'ION', '01/02/1970'), R('F1', 'ANA', '05/05/1980'), R('F3', 'ANA', '05/05/1980'), R('F1', 'GEO', '06/06/1966')];

  it('nivelul 1: celelalte firme ale administratorilor rădăcinii', async () => {
    const g = await construiesteGraf(deps(baza), rad, { adancime: 1 });
    expect(ids(g, 'firma').sort()).toEqual(['f:F0', 'f:F1', 'f:F2']);
    expect(ids(g, 'persoana')).toEqual([idPersoana('ION', '01/02/1970')]);
    expect(g.muchii).toHaveLength(3);
    expect(g.trunchiat).toBe(false);
  });
  it('nivelul 2: administratorii firmelor de nivel 1 care aduc firme noi', async () => {
    const g = await construiesteGraf(deps(baza), rad, { adancime: 2 });
    expect(ids(g, 'firma').sort()).toEqual(['f:F0', 'f:F1', 'f:F2', 'f:F3']);
    expect(ids(g, 'persoana')).toContain(idPersoana('ANA', '05/05/1980'));
    expect(ids(g, 'persoana')).not.toContain(idPersoana('GEO', '06/06/1966')); // o singură firmă în graf, nu leagă nimic
  });
  it('fără dată nu se unește nimic: apare doar ca neconfirmat pe rădăcină', async () => {
    const reps = [R('F0', 'POPA', null), R('F1', 'POPA', null), R('F0', 'ION', '01/02/1970')];
    const g = await construiesteGraf(deps(reps), rad, { adancime: 2 });
    expect(g.neconfirmate).toEqual([expect.objectContaining({ nume: 'POPA', motiv: 'fara-data' })]);
    expect(ids(g, 'firma')).toEqual(['f:F0']);
  });
  it('dată slabă: desenată și marcată; scoasă din filtru nu se mai unește', async () => {
    const reps = [R('F0', 'X', '01/01/1968'), R('F1', 'X', '01/01/1968')];
    const cu = await construiesteGraf(deps(reps), rad, { adancime: 1, dateSlabe: true });
    expect(cu.muchii.every((m: { slaba: boolean }) => m.slaba)).toBe(true);
    expect(ids(cu, 'firma')).toContain('f:F1');
    const fara = await construiesteGraf(deps(reps), rad, { adancime: 1, dateSlabe: false });
    expect(ids(fara, 'firma')).toEqual(['f:F0']);
    expect(fara.neconfirmate[0]?.motiv).toBe('data-slaba');
  });
  it('stratul profesional este oprit implicit și pornit explicit', async () => {
    const reps = [R('F0', 'LICH', '03/03/1960', 'lichidator'), R('F1', 'LICH', '03/03/1960', 'lichidator'), R('F0', 'ION', '01/02/1970'), R('F5', 'ION', '01/02/1970', 'lichidator')];
    const implicit = await construiesteGraf(deps(reps), rad, { adancime: 1 });
    expect(ids(implicit, 'persoana')).toEqual([idPersoana('ION', '01/02/1970')]);
    expect(ids(implicit, 'firma')).toEqual(['f:F0']); // ION este doar lichidator la F5
    const extins = await construiesteGraf(deps(reps), rad, { adancime: 1, profesionisti: true });
    expect(ids(extins, 'persoana')).toHaveLength(2);
    expect(ids(extins, 'firma').sort()).toEqual(['f:F0', 'f:F1', 'f:F5']);
    expect(extins.muchii.some((m: { strat: string }) => m.strat === 'profesional')).toBe(true);
  });
  it('„administrator si reprezentant” face parte din nucleu', async () => {
    const g = await construiesteGraf(deps([R('F0', 'A', '02/02/1970', 'administrator si reprezentant'), R('F1', 'A', '02/02/1970')]), rad, { adancime: 1 });
    expect(ids(g, 'firma')).toContain('f:F1');
  });
  it('persoană scoasă și rol scos reconstruiesc graful din aceeași interogare', async () => {
    const f = await construiesteGraf(deps(baza), rad, { adancime: 2, fara: [idPersoana('ION', '01/02/1970')] });
    expect(ids(f, 'firma')).toEqual(['f:F0']);
    const r = await construiesteGraf(deps(baza), rad, { adancime: 1, faraRoluri: ['administrator'] });
    expect(ids(r, 'firma')).toEqual(['f:F0']);
    expect(r.roluri.find((x: { calitate: string }) => x.calitate === 'administrator')).toEqual({ calitate: 'administrator', nr: 0, activ: false });
  });
  it('plafonul de noduri oprește componenta și marchează trunchierea', async () => {
    const reps = [R('F0', 'ION', '01/02/1970'), ...Array.from({ length: 60 }, (_, i) => R(`G${String(i).padStart(2, '0')}`, 'ION', '01/02/1970'))];
    const g = await construiesteGraf(deps(reps), rad, { adancime: 1, plafon: 20 });
    expect(g.noduri.length).toBeLessThanOrEqual(20);
    expect(g.trunchiat).toBe(true);
    expect(g.omise.firme).toBe(60 - 18);
  });
  it('plafon în afara limitelor este readus în interval', async () => {
    const g = await construiesteGraf(deps(baza), rad, { plafon: 100000 });
    expect(g.parametri.plafon).toBe(400);
  });
  it('CUI 0 sau gol nu este tratat ca CUI', async () => {
    const g = await construiesteGraf(deps([R('F0', 'A', '02/02/1970'), R('F9', 'A', '02/02/1970')]), rad, { adancime: 1 });
    expect(g.noduri.find((n) => n.tip === 'firma' && n.cod === 'F9')).toMatchObject({ cui: null });
  });
  it('aceeași persoană cu două calități la aceeași firmă dă două muchii, nu un duplicat', async () => {
    const g = await construiesteGraf(deps([R('F0', 'A', '02/02/1970'), R('F0', 'A', '02/02/1970'), R('F0', 'A', '02/02/1970', 'administrator si reprezentant')]), rad, { adancime: 1 });
    expect(g.muchii).toHaveLength(2);
  });
});

describe('aceeași firmă cu mai multe numere de înmatriculare', () => {
  const reps = [R('F0', 'ION', '01/02/1970'), R('F1', 'ION', '01/02/1970'), R('F1B', 'ION', '01/02/1970'), R('F2', 'ION', '01/02/1970'), R('F3', 'ION', '01/02/1970')];
  const seteaza = (o: Record<string, { denumire: string; cui: string | null }>) => { for (const k of Object.keys(INFO)) delete INFO[k]; Object.assign(INFO, o); };

  it('același CUI + aceeași denumire (mutare de sediu) devin un singur nod, cu toate codurile păstrate', async () => {
    seteaza({ F1: { denumire: 'ALIPOT S.R.L.', cui: '4921121' }, F1B: { denumire: 'ALIPOT SRL', cui: '4921121' }, F2: { denumire: 'ALTA', cui: '222' }, F3: { denumire: 'ALTA2', cui: '333' } });
    const g = await construiesteGraf(deps(reps), rad, { adancime: 1 });
    const firme = g.noduri.filter((n) => n.tip === 'firma');
    expect(firme).toHaveLength(4); // rădăcina + ALIPOT (o singură dată) + 2 firme
    const alipot = firme.find((n) => n.tip === 'firma' && n.cui === '4921121');
    expect(alipot).toMatchObject({ coduri: ['F1', 'F1B'], cuiPartajat: false });
    expect(g.muchii.filter((m) => m.firma === alipot!.id)).toHaveLength(1); // muchiile duplicate se unesc
  });
  it('înmatricularea veche a rădăcinii se alipește rădăcinii, nu apare ca „altă firmă”', async () => {
    seteaza({ F1: { denumire: 'RADACINA SRL', cui: '123' }, F2: { denumire: 'X', cui: '5' }, F1B: { denumire: 'Y', cui: '6' }, F3: { denumire: 'Z', cui: '7' } });
    const g = await construiesteGraf(deps(reps), { cod: 'F0', cui: '123', denumire: 'Radacina S.R.L.' }, { adancime: 1 });
    const r = g.noduri.find((n) => n.tip === 'firma' && n.radacina);
    expect(r).toMatchObject({ coduri: ['F0', 'F1'] });
    expect(g.noduri.filter((n) => n.tip === 'firma')).toHaveLength(4);
  });
  it('același CUI cu denumiri diferite NU se contopește: se marchează cuiPartajat', async () => {
    seteaza({ F1: { denumire: 'AKMEVIZYON SRL', cui: '18972397' }, F1B: { denumire: 'BG RONTEX SRL', cui: '18972397' }, F2: { denumire: 'A', cui: '2' }, F3: { denumire: 'B', cui: '3' } });
    const g = await construiesteGraf(deps(reps), rad, { adancime: 1 });
    const partajate = g.noduri.filter((n) => n.tip === 'firma' && n.cuiPartajat);
    expect(partajate.map((n) => n.tip === 'firma' && n.denumire).sort()).toEqual(['AKMEVIZYON SRL', 'BG RONTEX SRL']);
    expect(g.noduri.filter((n) => n.tip === 'firma')).toHaveLength(5);
  });
  it('CUI 0 sau lipsă nu contopește nimic', async () => {
    seteaza({ F1: { denumire: 'SAME SRL', cui: '0' }, F1B: { denumire: 'SAME SRL', cui: '0' }, F2: { denumire: 'A', cui: '2' }, F3: { denumire: 'B', cui: '3' } });
    const g = await construiesteGraf(deps(reps), rad, { adancime: 1 });
    expect(g.noduri.filter((n) => n.tip === 'firma')).toHaveLength(5); // F1 și F1B rămân distincte: fără CUI utilizabil nu avem pe ce să le unim
  });
});
