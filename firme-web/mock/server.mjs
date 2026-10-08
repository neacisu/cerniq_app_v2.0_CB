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
const platitor = (f) => ({ codFiscal: f.cui, denumire: f.den, codFiscalParinte: '', tipUnitate: 'Sediu central', tipContrib: 'PJ', localitate: 'Viziru', strada: 'Str. IANCU DE HUNEDOARA', nr: '71', dataInregistrare: '01.02.2025', dataPrelucrare: '16.08.2025 14:55:33', fax: '', sector: '', telefon: '', judetComert: 'J09', nrComert: '150', anComert: '2018', actAutorizare: '', tva: f.cui === '38926034' ? 'NU' : 'DA', dataRadiere: '', codPostal: '817215', dataStare: '26.02.2018', stare: 'INREGISTRAT', judet: 'BRĂILA', imp100: 'DA ', imp120: 'NU ', imp130: 'NU ', cont410: 'NU ', cont412: 'DA ', imp602: 'DA ', imp710: '   ', detaliiAdresa: '', bloc: '', scara: '', etaj: '', ap: '' });
const onrc = (f) => ({ denumire: f.den, cui: f.cui, codInmatriculare: f.cod, dataInmatriculare: '26/02/2018', euid: `ROONRC.${f.cod}`, formaJuridica: f.den.includes('S.A.') ? 'SA' : 'SRL', adrTara: 'România', adrJudet: 'Brăila', adrLocalitate: 'Sat Viziru, Comuna Viziru', adrDenStrada: 'IANCU DE HUNEDOARA', adrNrStrada: '71', adrBloc: '', adrScara: '', adrEtaj: '', adrApartament: '', adrCodPostal: '817215', adrSector: '', adrCompletare: '', web: '', taraFirmaMama: '' });
const caen = [['A', '', '', '', '', 'AGRICULTURĂ, SILVICULTURĂ ȘI PESCUIT'], ['', '', '01', '', '', 'Culturi vegetale și creșterea animalelor'], ['', '', '01', '011', '0111', 'Cultivarea cerealelor'], ['', '', '01', '011', '0112', 'Cultivarea orezului'], ['F', '', '', '', '', 'CONSTRUCȚII'], ['', '', '41', '412', '4120', 'Lucrări de construcții a clădirilor rezidențiale și nerezidențiale'], ['G', '', '', '', '', 'COMERȚ'], ['', '', '47', '471', '4711', 'Comerț cu amănuntul în magazine nespecializate, cu vânzare predominantă de produse alimentare']]
  .map(([sectiunea, subsectiunea, diviziunea, grupa, clasa, denumire]) => ({ sectiunea, subsectiunea, diviziunea, grupa, clasa, denumire, versiuneCaen: '2' }));

function route(url) {
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
