// Server de dezvoltare care imită API-ul real de citire (aceleași forme de răspuns). Date fictive.
import http from 'node:http';

const PORT = Number(process.env.PORT ?? 4186);
const firme = [
  { cui: '38926034', den: 'QBIKNEF S.R.L.', cod: 'J9/150/2018', ani: [2018, 2019, 2020, 2021], caen: '4120', stari: [['1107', 'insolvență'], ['1139', 'este sub incidența Legii nr. 85/2014'], ['2127', 'raspundere penala cf.  Legii 286/2009, Legii 135/2010']] },
  { cui: '25629090', den: 'AGRO DEMO S.R.L.', cod: 'J40/1234/2009', ani: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], caen: '111', stari: [] },
  { cui: '14399840', den: 'RETAIL DEMO S.A.', cod: 'J40/7/1991', ani: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], caen: '4711', stari: [] },
];
const DEN = (an) => an >= 2016
  ? { I1: 'ACTIVE IMOBILIZATE - TOTAL', I2: 'ACTIVE CIRCULANTE - TOTAL, din care:', I3: 'Stocuri', I4: 'Creante', I5: 'Casa si conturi la banci', I7: 'DATORII', I10: 'CAPITALURI - TOTAL, din care:', I11: 'Capital subscris varsat', I13: 'Cifra de afaceri neta', I14: 'VENITURI TOTALE', I15: 'CHELTUIELI TOTALE', I16: 'Profit brut', I17: 'Pierdere bruta', I18: 'Profit net', I19: 'Pierdere  neta', I20: 'Numar mediu de salariati' }
  : { I1: 'ACTIVE IMOBILIZATE - TOTAL', I2: 'ACTIVE CIRCULANTE - TOTAL, din care:', I3: 'Stocuri', I4: 'Creante', I5: 'Casa si conturi la banci', I7: 'DATORII', I10: 'CAPITALURI - TOTAL, din care:', I11: 'Capital', I12: 'Cifra de afaceri neta', I13: 'VENITURI TOTALE', I14: 'CHELTUIELI TOTALE', I16: 'Pierdere neta', I17: 'Profit net', I18: 'Pierdere  neta', I19: 'Numar mediu de salariati' };
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
function bilant(f, an) {
  const r = rnd(Number(f.cui) + an), den = DEN(an), base = 200_000 * (1 + (Number(f.cui) % 7));
  const growth = 1 + (an - f.ani[0]) * 0.18 + r() * 0.2;
  const ind = []; let poz = 3;
  for (const [cod, d] of Object.entries(den)) {
    let v = Math.round(base * growth * (0.2 + r()));
    if (/Pierdere/.test(d)) v = r() > 0.7 ? Math.round(v / 20) : 0;
    if (/salariati/.test(d)) v = Math.round(1 + r() * 40);
    ind.push({ cod, denumire: d, pozitie: poz++, valoare: v });
  }
  return { formular: 'WEB_UU', caen: f.caen, caenDenumire: f.caen === '4120' ? 'Lucrări de construcții a clădirilor rezidențiale și nerezidențiale' : f.caen === '4711' ? 'Comerț cu amănuntul în magazine nespecializate, cu vânzare predominantă de produse alimentare, băuturi și tutun' : null, caenVersiune: '2', caeno: null, indicatori: ind };
}
const platitor = (f) => ({ codFiscal: f.cui, denumire: f.den, codFiscalParinte: '', tipUnitate: 'Sediu central', tipContrib: 'PJ', localitate: 'Viziru', strada: 'Str. IANCU DE HUNEDOARA', nr: '71', dataInregistrare: '01.02.2025', dataPrelucrare: '16.08.2025 14:55:33', fax: '', sector: '', telefon: '0241 854 464', judetComert: 'J09', nrComert: '150', anComert: '2018', actAutorizare: '', tva: f.cui === '38926034' ? 'NU' : 'DA', dataRadiere: '', codPostal: '817215', dataStare: '26.02.2018', stare: 'INREGISTRAT', judet: 'BRĂILA', imp100: 'DA ', imp120: 'NU ', imp130: 'NU ', cont410: 'NU ', cont412: 'DA ', imp602: 'DA ', imp710: '   ', detaliiAdresa: '', bloc: '', scara: '', etaj: '', ap: '' });
const onrc = (f) => ({ denumire: f.den, cui: f.cui, codInmatriculare: f.cod, dataInmatriculare: '26/02/2018', euid: `ROONRC.${f.cod}`, formaJuridica: f.den.includes('S.A.') ? 'SA' : 'SRL', adrTara: 'România', adrJudet: 'Brăila', adrLocalitate: 'Sat Viziru, Comuna Viziru', adrDenStrada: 'IANCU DE HUNEDOARA', adrNrStrada: '71', adrBloc: '', adrScara: '', adrEtaj: '', adrApartament: '', adrCodPostal: '817215', adrSector: '', adrCompletare: '', web: '', taraFirmaMama: '' });
const caen = [['A', '', '', '', '', 'AGRICULTURĂ, SILVICULTURĂ ȘI PESCUIT'], ['', '', '01', '', '', 'Culturi vegetale și creșterea animalelor'], ['', '', '01', '011', '0111', 'Cultivarea cerealelor'], ['', '', '01', '011', '0112', 'Cultivarea orezului'], ['F', '', '', '', '', 'CONSTRUCȚII'], ['', '', '41', '412', '4120', 'Lucrări de construcții a clădirilor rezidențiale și nerezidențiale'], ['G', '', '', '', '', 'COMERȚ'], ['', '', '47', '471', '4711', 'Comerț cu amănuntul în magazine nespecializate, cu vânzare predominantă de produse alimentare']]
  .map(([sectiunea, subsectiunea, diviziunea, grupa, clasa, denumire]) => ({ sectiunea, subsectiunea, diviziunea, grupa, clasa, denumire, versiuneCaen: '2' }));


// Graful administratorilor: formă identică cu API-ul real, date fictive.
function grup(cod, u) {
  const root = firme.find((x) => x.cod === cod);
  if (!root) return [404, { eroare: 'Firma nu a fost găsită' }];
  const adancime = Number(u.searchParams.get('adancime') ?? 1), plafon = Number(u.searchParams.get('plafon') ?? 120);
  const prof = u.searchParams.get('profesionisti') === 'true', slabe = u.searchParams.get('slabe') !== 'false';
  const fara = u.searchParams.getAll('fara'), faraRoluri = u.searchParams.getAll('faraRoluri');
  const F = (c, den, nivel) => ({ id: `f:${c}`, tip: 'firma', cod: c, cui: c.length % 2 ? '1234' + c.length : null, denumire: den, nivel, radacina: false });
  const P = (nume, data, nivel, nrFirme, calitati) => ({ id: `p:${nume}|${data}`, tip: 'persoana', nume, data, slaba: data.startsWith('01/01'), nivel, nrFirme, calitati });
  const noduri = [{ id: `f:${root.cod}`, tip: 'firma', cod: root.cod, cui: root.cui, denumire: root.den, nivel: 0, radacina: true }];
  const muchii = [], neconfirmate = [];
  const leaga = (p, c, calitate = 'administrator', slaba = false) => { if (!faraRoluri.includes(calitate)) muchii.push({ persoana: p.id, firma: `f:${c}`, calitate, strat: calitate === 'administrator' ? 'administrator' : 'profesional', slaba }); };
  const ion = P('POPESCU ION', '12/03/1980', 0, 7, ['administrator']);
  if (!fara.includes(ion.id)) { noduri.push(ion); leaga(ion, root.cod); for (let i = 1; i <= 6; i++) { noduri.push(F(`G${i}`, `CONSTRUCT GRUP ${i} S.R.L.`, 1)); leaga(ion, `G${i}`); } }
  const maria = P('IONESCU MARIA', '01/01/1968', 0, 3, ['administrator']);
  if (slabe && !fara.includes(maria.id)) { noduri.push(maria); leaga(maria, root.cod, 'administrator', true); for (let i = 7; i <= 8; i++) { noduri.push(F(`G${i}`, `AGRO MARIA ${i} S.R.L.`, 1)); leaga(maria, `G${i}`, 'administrator', true); } }
  else if (!slabe) neconfirmate.push({ nume: 'IONESCU MARIA', data: '01/01/1968', calitate: 'administrator', strat: 'administrator', motiv: 'data-slaba' });
  neconfirmate.push({ nume: 'GHEORGHE VASILE', data: null, calitate: 'administrator', strat: 'administrator', motiv: 'fara-data' });
  if (prof) { const l = P('LICHIDATOR EXPERT', '03/03/1960', 0, 5, ['lichidator']); noduri.push(l); leaga(l, root.cod, 'lichidator'); for (let i = 1; i <= 4; i++) { noduri.push(F(`L${i}`, `FIRMA IN LICHIDARE ${i} S.R.L.`, 1)); leaga(l, `L${i}`, 'lichidator'); } }
  if (adancime >= 2 && !fara.includes(ion.id)) { const ana = P('MARINESCU ANA', '05/05/1985', 1, 5, ['administrator']); noduri.push(ana); leaga(ana, 'G1'); for (let i = 1; i <= 4; i++) { noduri.push(F(`H${i}`, `LOGISTIC ANA ${i} S.R.L.`, 2)); leaga(ana, `H${i}`); } }
  let trunchiat = false; const omise = { firme: 0, persoane: 0 };
  if (noduri.length > plafon) { trunchiat = true; while (noduri.length > plafon) { const x = noduri.pop(); if (x.tip === 'firma') omise.firme++; else omise.persoane++; } }
  const ids = new Set(noduri.map((n) => n.id)); const m2 = muchii.filter((m) => ids.has(m.persoana) && ids.has(m.firma));
  const cnt = {}; m2.forEach((m) => { cnt[m.calitate] = (cnt[m.calitate] ?? 0) + 1; });
  const roluri = [...Object.entries(cnt).map(([calitate, nr]) => ({ calitate, nr, activ: true })), ...faraRoluri.filter((c) => !cnt[c]).map((calitate) => ({ calitate, nr: 0, activ: false }))];
  return [200, { radacina: { cod: root.cod, cui: root.cui, denumire: root.den }, noduri, muchii: m2, neconfirmate, roluri, trunchiat, omise, parametri: { adancime, plafon, profesionisti: prof, dateSlabe: slabe, fara, faraRoluri } }];
}


// ANAF v9 și dosare: aceeași formă ca API-ul real, date fictive.
const ANAF = {
  '38926034': { sf: 'inactiv', tva: 'anulat', den: 'QBIKNEF S.R.L.', inactiv: { activ: true, dataInactivare: '2025-03-10', dataReactivare: null, dataPublicare: '2025-03-10', dataRadiere: null }, per: [{ ordine: 0, inceput: '2018-09-20', sfarsit: '2025-01-31', dataAnulare: '2025-02-05', mesaj: 'Anularea înregistrării în scopuri de TVA a fost efectuată din oficiu, potrivit art.316 alin.(11) lit.d) din Legea nr.227/2015' }], efactura: null, disc: [{ camp: 'stare', v9: 'inactiv', snapshot: 'INREGISTRAT' }], tel: '0241854464' },
  '25629090': { sf: 'activ', tva: 'platitor', den: 'AGRO DEMO S.R.L.', inactiv: { activ: false, dataInactivare: null, dataReactivare: null, dataPublicare: null, dataRadiere: null }, per: [{ ordine: 0, inceput: '2009-06-04', sfarsit: null, dataAnulare: null, mesaj: null }], efactura: '2024-02-01', inc: { activ: false, inceput: '2013-01-01', sfarsit: '2021-03-01', tipAct: 'Radiere' }, tel: '0241854464' },
  '14399840': { sf: 'activ', tva: 'platitor', den: 'RETAIL DEMO S.A.', inactiv: { activ: false, dataInactivare: null, dataReactivare: null, dataPublicare: null, dataRadiere: null }, per: [{ ordine: 0, inceput: '1993-01-01', sfarsit: null, dataAnulare: null, mesaj: null }], efactura: '2023-07-01', split: { activ: true, inceput: '2018-01-01', anulare: null }, tel: '0212223344' },
  '77777777': { sf: 'activ', tva: 'neplatitor', den: 'FIRMA DOAR LA ANAF S.R.L.', inactiv: { activ: false, dataInactivare: null, dataReactivare: null, dataPublicare: null, dataRadiere: null }, per: [], efactura: null, scanare: true, tel: '' },
};
const anafStare = (c) => (ANAF[c] ? 'gasit' : c === '66666666' ? 'negasit' : c === '55555555' ? 'asteptare' : c.length === 13 ? 'exclus' : 'absent');
const adresa = { strada: 'Str. Iancu de Hunedoara', numar: '71', localitate: 'Sat Viziru Com. Viziru', judet: 'BRĂILA', codPostal: '817215', detalii: null, tara: null };
function anaf(c) {
  const st = anafStare(c); if (st !== 'gasit') return { cui: c, stare: st, ...(st === 'exclus' ? { motiv: 'Cod numeric personal: persoană fizică, datele ANAF nu se afișează' } : {}) };
  const a = ANAF[c];
  return { cui: c, stare: 'gasit', dataInterogare: '2026-10-08', descoperitDeScanare: !!a.scanare, stareFiscala: a.sf, tva: a.tva,
    generale: { denumire: a.den, adresa: 'JUD. BRĂILA, SAT VIZIRU COM. VIZIRU, STR. IANCU DE HUNEDOARA, NR.71', nrRegCom: 'J09/150/2018', telefon: a.tel || null, fax: null, codPostal: '817215', act: null, stareInregistrare: a.sf === 'activ' ? 'INREGISTRAT din data 02.06.2009' : 'INREGISTRAT din data 26.02.2018', dataInregistrare: '2018-02-26', codCaen: '111', iban: null, organFiscal: 'Unitatea Fiscală Orășenească Însurăței', formaProprietate: 'PROPR.PRIVATA-CAPITAL PRIVAT AUTOHTON', formaOrganizare: 'PERSOANA JURIDICA', formaJuridica: 'SOCIETATE COMERCIALĂ CU RĂSPUNDERE LIMITATĂ' },
    inactiv: a.inactiv, tvaDetaliu: { inScopTva: a.tva === 'platitor', perioade: a.per }, tvaIncasare: { activ: !!a.inc?.activ, inceput: a.inc?.inceput ?? null, sfarsit: a.inc?.sfarsit ?? null, actualizare: null, publicare: null, tipAct: a.inc?.tipAct ?? null },
    split: { activ: !!a.split?.activ, inceput: a.split?.inceput ?? null, anulare: a.split?.anulare ?? null }, eFactura: { inregistrat: !!a.efactura, data: a.efactura },
    sediu: adresa, domiciliu: { ...adresa, strada: 'Str. Alta' }, surse: a.scanare ? [] : [{ sursa: 'od_firme', codInmatriculare: 'J9/150/2018', nrRanduri: 1, adreseDiferite: false, denumiriDiferite: false }, { sursa: 'platitori', codInmatriculare: null, nrRanduri: 1, adreseDiferite: null, denumiriDiferite: null }],
    snapshot: a.scanare ? null : { stare: 'INREGISTRAT', tva: 'NU', denumire: a.den, dataStare: '26.02.2018', telefon: a.tel || null, fax: null }, discrepante: a.disc ?? [] };
}
const rezumat = (c) => { const x = anaf(c); return x.stare !== 'gasit' ? { cui: c, stare: x.stare, motiv: x.motiv } : { cui: c, stare: 'gasit', denumire: x.generale.denumire, stareFiscala: x.stareFiscala, tva: x.tva, eFactura: x.eFactura.inregistrat, dataInactivare: x.inactiv.dataInactivare, dataInterogare: x.dataInterogare, descoperitDeScanare: x.descoperitDeScanare }; };

const CAT = ['Civil', 'Penal', 'Faliment', 'Litigii cu profesioniştii', 'Contencios administrativ şi fiscal'];
const DOS = Array.from({ length: 34 }, (_, i) => { const an = 2022 + (i % 5); const grad = i % 9 === 0 ? 'nume' : i % 5 === 0 ? 'reprezentant' : i % 7 === 0 ? 'partiala' : 'exacta'; const rol = ['Reclamant', 'Pârât', 'Inculpat', 'Debitor', 'Creditor'][i % 5];
  return { id: i + 1, numar: `${1000 + i * 37}/${100 + (i % 9)}/${an}`, instanta: `Tribunalul ${['Brăila', 'Iași', 'Galați'][i % 3]}`, departament: 'Secția civilă', categorie: CAT[i % 5], stadiu: i % 6 === 0 ? 'Apel' : 'Fond', obiect: ['pretenții', 'contestație la executare', 'înșelăciunea (art.244 NCP)', 'cerere deschidere procedură insolvență', 'anulare act administrativ'][i % 5],
    dataDosar: `${an}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 27)).padStart(2, '0')}`, dataModificare: '2026-09-01', anDosar: an, rol: [rol], potrivire: grad, legaturi: [{ parte: grad === 'partiala' ? 'QBIKNEF IMPEX SRL' : grad === 'nume' ? 'QBIK NEF' : 'QBIKNEF SRL - PRIN LICHIDATOR JUDICIAR X SPRL', calitate: rol, motiv: grad === 'reprezentant' ? 'reprezentant' : 'denumire', interogat: grad === 'reprezentant' ? 'SIERRA QUADRANT' : 'QBIKNEF', grad }],
    nrParti: 2 + (i % 4), nrSedinte: i % 6, ultimaSedinta: i % 6 ? `${an}-06-15` : null, nrCaiAtac: i % 6 === 0 ? 1 : 0, dataInViitor: i === 33 }; });
DOS[33].dataDosar = '2029-09-26'; DOS[33].anDosar = 2029;
const fac = (v) => { const m = new Map(); v.forEach((x) => x !== null && x !== '' && m.set(String(x), (m.get(String(x)) ?? 0) + 1)); return [...m].map(([valoare, nr]) => ({ valoare, nr })).sort((a, b) => b.nr - a.nr); };
const sum = (l) => ({ total: l.length, categorii: fac(l.map((d) => d.categorie)), stadii: fac(l.map((d) => d.stadiu)), roluri: fac(l.flatMap((d) => d.rol)), ani: fac(l.map((d) => d.anDosar)).sort((a, b) => a.valoare - b.valoare), instante: fac(l.map((d) => d.instanta)), potriviri: fac(l.map((d) => d.potrivire)), primul: l.map((d) => d.dataDosar).sort()[0] ?? null, ultimul: l.filter((d) => !d.dataInViitor).map((d) => d.dataDosar).sort().at(-1) ?? null });
function dosare(u) {
  const q = u.searchParams, cui = q.get('cui'); const toate = cui === '38926034' ? DOS : [];
  let l = toate.filter((d) => (!q.get('categorie') || d.categorie === q.get('categorie')) && (!q.get('stadiu') || d.stadiu === q.get('stadiu')) && (!q.get('rol') || d.rol.includes(q.get('rol'))) && (!q.get('an') || d.anDosar === Number(q.get('an'))) && (!q.get('potrivire') || d.potrivire === q.get('potrivire')) && (q.get('doarExacte') !== 'true' || ['exacta', 'reprezentant'].includes(d.potrivire)) && (!q.get('q') || `${d.numar} ${d.obiect}`.toLowerCase().includes(q.get('q').toLowerCase())));
  l = [...l].sort((a, b) => (a.dataDosar < b.dataDosar ? 1 : -1));
  const limit = Number(q.get('limit') ?? 25), offset = Number(q.get('offset') ?? 0);
  return [200, { cui, cod: q.get('cod'), denumireFirma: 'QBIKNEF S.R.L.', acoperire: { stare: cui === '38926034' ? 'complet' : 'in-asteptare', cautari: [{ sursa: 'portal', tip: 'firma', nume: 'QBIKNEF', stare: cui === '38926034' ? 'gasit' : 'asteptare', dosareGasite: toate.length, plafonAtins: false, actualizat: null }, { sursa: 'iccj', tip: 'firma', nume: 'QBIKNEF', stare: 'negasit', dosareGasite: 0, plafonAtins: false, actualizat: null }, { sursa: 'portal', tip: 'reprezentant', nume: 'NEACŞU FLORIN', stare: 'asteptare', dosareGasite: 0, plafonAtins: false, actualizat: null }] }, trunchiat: false, plafonIncarcare: 3000, total: l.length, totalFirma: toate.length, sumarFirma: sum(toate), sumarFiltrat: sum(l), pagina: { limit, offset }, dosare: l.slice(offset, offset + limit) }];
}

function route(url) {
  let m0;
  const u = new URL(url, 'http://x'), p = decodeURIComponent(u.pathname);
  if (p === '/health') return [200, { stare: 'ok' }];
  if (p === '/firme') {
    const q = (u.searchParams.get('q') ?? '').trim(), lim = Number(u.searchParams.get('limit') ?? 20);
    if (!q) return [400, { eroare: 'Parametri invalizi' }];
    if (!/^\d+$/.test(q) && !q.includes('/') && q.length < 2) return [400, { eroare: 'Căutarea după denumire cere cel puțin 2 caractere' }];
    const hit = firme.filter((f) => (/^\d+$/.test(q) ? f.cui === q : q.includes('/') ? f.cod.toLowerCase() === q.toLowerCase() : f.den.toLowerCase().startsWith(q.toLowerCase())));
    const out = [];
    if (/^\d+$/.test(q)) hit.forEach((f) => out.push({ sursa: 'anaf', denumire: f.den, cui: f.cui, codInmatriculare: null }));
    hit.forEach((f) => out.push({ sursa: 'onrc', denumire: f.den, cui: f.cui, codInmatriculare: f.cod }));
    return [200, { rezultate: out.slice(0, lim) }];
  }
  if (p.startsWith('/grup/')) return grup(p.slice(6), u);
  if (p === '/anaf') { const l = (u.searchParams.get('cui') ?? '').split(',').filter(Boolean); return l.length && l.length <= 100 && l.every((x) => /^\d{2,13}$/.test(x)) ? [200, { rezultate: l.map(rezumat) }] : [400, { eroare: 'Parametri invalizi' }]; }
  if ((m0 = p.match(/^\/anaf\/(\d{2,13})$/))) return [200, anaf(m0[1])];
  if (p === '/dosare') return dosare(u);
  if ((m0 = p.match(/^\/dosare\/(\d+)$/))) { const d = DOS.find((x) => x.id === Number(m0[1])); return d ? [200, { ...d, numarVechi: null, obiecteSecundare: null, dataInitiala: d.dataDosar, parti: [{ ord: 1, nume: 'QBIKNEF SRL', calitate: d.rol[0], calitateAnterioara: null, dataCalitate: null }, { ord: 2, nume: 'SOCIETATEA EXEMPLU SRL', calitate: 'Pârât', calitateAnterioara: null, dataCalitate: null }], sedinte: [{ data: '2026-09-28', ora: '09:00', complet: 'Complet 2', solutie: 'Amână cauza', solutieSumar: 'lipsă de apărare', dataPronuntare: null, document: null, numarDocument: null, dataDocument: null }, { data: '2025-11-22', ora: '10:00', complet: 'Complet 2', solutie: 'Respinge cererea', solutieSumar: null, dataPronuntare: '2025-11-22', document: 'Sentință', numarDocument: '123', dataDocument: '2025-11-22' }], caiAtac: d.nrCaiAtac ? [{ data: '2025-12-01', parte: 'QBIKNEF SRL', tip: 'Apel' }] : [] }] : [404, { eroare: 'Dosarul nu este legat de această firmă' }]; }
  let m;
  if ((m = p.match(/^\/cui\/(\d{2,13})$/))) { const f = firme.find((x) => x.cui === m[1]); return f ? [200, { cui: f.cui, platitor: platitor(f), inmatriculari: [onrc(f)], bilant: f.ani.map((an) => ({ an, formular: 'WEB_UU' })) }] : [404, { eroare: 'Firma nu a fost găsită' }]; }
  if ((m = p.match(/^\/firme\/inmatriculare\/(.+)$/))) { const f = firme.find((x) => x.cod === m[1]); return f ? [200, { codInmatriculare: f.cod, firme: [onrc(f)], stari: f.stari.map(([cod, denumire]) => ({ cod, denumire })), reprezentantiLegali: [{ persoanaImputernicita: 'POPESCU ION', calitate: 'Administrator', dataNastere: '12/03/1980', localitateNastere: 'Brăila', judetNastere: 'Brăila', taraNastere: 'România', localitate: 'Viziru', judet: 'Brăila', tara: 'România' }, { persoanaImputernicita: 'IONESCU MARIA', calitate: 'Asociat', dataNastere: '', localitateNastere: '', judetNastere: '', taraNastere: '', localitate: '', judet: '', tara: '' }], reprezentantiIf: [], sucursale: [], platitori: [platitor(f)] }] : [404, { eroare: 'Firma nu a fost găsită' }]; }
  if ((m = p.match(/^\/bilant\/(\d{2,13})(?:\/(\d{4}))?$/))) {
    const f = firme.find((x) => x.cui === m[1]); if (!f) return [404, { eroare: 'Nu există bilanț pentru acest CUI' }];
    return m[2] ? (f.ani.includes(+m[2]) ? [200, { cui: f.cui, an: +m[2], formulare: [bilant(f, +m[2])] }] : [404, { eroare: 'Nu există bilanț pentru acest CUI' }]) : [200, { cui: f.cui, ani: f.ani.map((an) => ({ an, formulare: [bilant(f, an)] })) }];
  }
  if ((m = p.match(/^\/indicatori\/(\d{4})\/([A-Z0-9_]+)$/))) { const an = +m[1]; if (an < 2008 || an > 2025) return [400, { eroare: 'Parametri invalizi' }]; if (m[2] !== 'WEB_UU' || an < 2011) return [404, { eroare: 'Nu există indicatori pentru acest an și formular' }]; let poz = 3; return [200, { an, formular: m[2], indicatori: [{ cod: 'CUI', denumire: 'cui', pozitie: 1, esteDimensiune: true }, { cod: 'CAEN', denumire: 'caen', pozitie: 2, esteDimensiune: true }, ...Object.entries(DEN(an)).map(([cod, denumire]) => ({ cod, denumire, pozitie: poz++, esteDimensiune: false }))] }]; }
  if (p === '/nomenclatoare/stari') return [200, { stari: [['1035', 'radiere'], ['1107', 'insolvență'], ['1139', 'este sub incidența Legii nr. 85/2014'], ['2127', 'raspundere penala cf.  Legii 286/2009, Legii 135/2010']].map(([cod, denumire]) => ({ cod, denumire })) }];
  if (p === '/nomenclatoare/versiuni-caen') return [200, { versiuni: [['0', 'Versiunea 1998'], ['1', 'Versiunea 2003'], ['2', 'Versiunea 2008'], ['3', 'Versiunea 2025']].map(([cod, descriere]) => ({ cod, descriere })) }];
  if (p === '/nomenclatoare/caen') { const c = u.searchParams.get('clasa'); return [200, { versiune: u.searchParams.get('versiune') ?? '2', clase: c ? caen.filter((x) => x.clasa === c) : caen }]; }
  return [404, { eroare: 'Rută inexistentă' }];
}
http.createServer((req, res) => {
  const [code, body] = req.method === 'GET' || req.method === 'HEAD' ? route(req.url ?? '/') : [405, { eroare: 'API-ul este doar pentru citire' }];
  setTimeout(() => { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)); }, 120);
}).listen(PORT, '127.0.0.1', () => console.log(`mock API pe http://127.0.0.1:${PORT}`));
