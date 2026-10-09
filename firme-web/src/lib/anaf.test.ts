import { describe, expect, it } from 'vitest';
import { dataRo, isoDin, mesajStare, zileDe, STARE_FISCALA } from './anaf';
import { hrefWeb, telefonCanonic, uneste, webCanonic } from './contact';
import { construieste, faraData } from './cronologie';
import type { AnafFirma } from '../api/types';

describe('date și stări', () => {
  it('dataRo / isoDin', () => {
    expect(dataRo('2025-03-10')).toBe('10 martie 2025'); expect(dataRo('')).toBe(''); expect(dataRo('necunoscut')).toBe('necunoscut');
    expect(isoDin('26.02.2018')).toBe('2018-02-26'); expect(isoDin('26/02/2018')).toBe('2018-02-26'); expect(isoDin('2018-02-26T10:00')).toBe('2018-02-26'); expect(isoDin('x')).toBeNull();
    expect(zileDe('2026-10-08', Date.parse('2026-10-18'))).toBe(10);
  });
  it('gravitatea ordonează stările', () => { expect(STARE_FISCALA.radiat.gravitate).toBeGreaterThan(STARE_FISCALA.inactiv.gravitate); expect(STARE_FISCALA.inactiv.gravitate).toBeGreaterThan(STARE_FISCALA.activ.gravitate); });
  it('mesaje pentru stările fără date', () => {
    expect(mesajStare({ stare: 'gasit' })).toBeNull();
    expect(mesajStare({ stare: 'negasit' })?.titlu).toMatch(/nu cunoaște/);
    expect(mesajStare({ stare: 'exclus', motiv: 'PF' })?.text).toBe('PF');
    expect(mesajStare({ stare: 'asteptare' })?.titlu).toMatch(/neinterogat/);
  });
});

describe('contacte deduplicate fără pierdere', () => {
  it('același telefon din trei surse apare o dată, cu toate sursele', () => {
    const c = uneste([
      { tip: 'telefon', valoare: '0241854464', sursa: 'ANAF v9', data: '2026-10-08' }, { tip: 'telefon', valoare: '0241 854 464', sursa: 'Snapshot ANAF 2026' },
      { tip: 'telefon', valoare: '+40241854464', sursa: 'ONRC' }, { tip: 'telefon', valoare: '0722111222', sursa: 'ANAF v9' },
    ]);
    expect(c).toHaveLength(2);
    expect(c[0]!.surse.map((s) => s.sursa)).toEqual(['ANAF v9', 'Snapshot ANAF 2026', 'ONRC']);
    expect(c[0]!.valoare).toBe('0241854464'); // se păstrează forma primei surse
  });
  it('ignoră valorile goale și „0”, normalizează web', () => {
    expect(uneste([{ tip: 'telefon', valoare: '', sursa: 'x' }, { tip: 'web', valoare: '0', sursa: 'x' }, { tip: 'telefon', valoare: '12', sursa: 'x' }])).toEqual([]);
    expect(webCanonic('HTTPS://www.Exemplu.ro/')).toBe('exemplu.ro'); expect(hrefWeb('exemplu.ro')).toBe('https://exemplu.ro'); expect(telefonCanonic('0040 741 123 456')).toBe('0741123456');
    expect(uneste([{ tip: 'web', valoare: 'www.a.ro', sursa: 'ONRC' }, { tip: 'web', valoare: 'https://a.ro/', sursa: 'ANAF' }])).toHaveLength(1);
  });
  it('fax și telefon cu același număr rămân distincte', () => { expect(uneste([{ tip: 'telefon', valoare: '0241111222', sursa: 'a' }, { tip: 'fax', valoare: '0241111222', sursa: 'a' }])).toHaveLength(2); });
});

describe('cronologie unificată', () => {
  const anaf = {
    cui: '1', stare: 'gasit', dataInterogare: '2026-10-08',
    generale: { dataInregistrare: '2018-02-26' }, inactiv: { activ: true, dataInactivare: '2025-03-10', dataReactivare: null, dataPublicare: '2025-03-10', dataRadiere: null },
    tvaDetaliu: { inScopTva: false, perioade: [{ ordine: 0, inceput: '2018-09-20', sfarsit: '2025-01-31', dataAnulare: '2025-02-05', mesaj: 'din oficiu' }] },
    tvaIncasare: { activ: false, inceput: null, sfarsit: null, actualizare: null, publicare: null, tipAct: null }, split: { activ: false, inceput: null, anulare: null }, eFactura: { inregistrat: false, data: null },
  } as unknown as AnafFirma;
  it('sortează descrescător, păstrează sursa și nu duplică data de înregistrare identică', () => {
    const { cu } = construieste({ onrc: { dataInmatriculare: '26/02/2018', codInmatriculare: 'J9/150/2018' } as never, anaf, aniBilant: [2019, 2021], snapshotInregistrare: null });
    expect(cu[0]!.titlu).toBe('Declarat inactiv fiscal'); expect(cu[0]!.sursa).toBe('ANAF v9');
    expect(cu.map((e) => e.data)).toEqual([...cu.map((e) => e.data)].sort().reverse());
    expect(cu.filter((e) => e.titlu.startsWith('Înregistrare la ANAF'))).toHaveLength(0);
    expect(cu.some((e) => e.titlu === 'Anulare înregistrare TVA' && e.detaliu === 'din oficiu')).toBe(true);
    expect(cu.filter((e) => e.categorie === 'bilant')).toHaveLength(2);
  });
  it('dosarele din viitor nu intră în cronologie; stările ONRC rămân fără dată', () => {
    const d = (dataDosar: string, dataInViitor: boolean) => ({ id: 1, numar: '1/1/2029', categorie: 'Civil', obiect: '', dataDosar, dataInViitor, potrivire: 'exacta' }) as never;
    expect(construieste({ dosare: [d('2029-09-26', true), d('2024-01-01', false)] }).cu).toHaveLength(1);
    expect(faraData([{ cod: '1107', denumire: 'insolvență  ' }])[0]!.titlu).toBe('1107 · insolvență');
  });
});
