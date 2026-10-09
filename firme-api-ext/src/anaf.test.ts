import { describe, expect, it } from 'vitest';
import { discrepante, normText, stareFiscala, stareTva, telefonCanonic } from './anaf.js';
import { bazaDenumire, celMaiBun, filtreaza, gradPotrivire, numeParteCurat, sumar, type DosarLista } from './dosare.js';

describe('stare fiscală (v9)', () => {
  const i = (stareInregistrare: string | null, statusInactiv: boolean | null, dataRadiere: string | null = null) => ({ stareInregistrare, statusInactiv, dataRadiere });
  it('cea mai gravă stare câștigă', () => {
    expect(stareFiscala(i('INREGISTRAT din data 26.02.2018', true))).toBe('inactiv');
    expect(stareFiscala(i('RADIERE din data 01.01.2020', true))).toBe('radiat');
    expect(stareFiscala(i('INREGISTRAT din data x', false, '2021-05-05'))).toBe('radiat');
    expect(stareFiscala(i('DIZOLVARE din data x', false))).toBe('dizolvat');
    expect(stareFiscala(i('SUSPENDARE din data x', true))).toBe('suspendat');
    expect(stareFiscala(i('INREGISTRAT din data x', false))).toBe('activ');
    expect(stareFiscala(i('RELUARE din data x', false))).toBe('activ');
    expect(stareFiscala(i(null, null))).toBe('necunoscut');
  });
  it('TVA: plătitor / anulat / neplătitor', () => {
    expect(stareTva({ scopTva: true, nrPerioade: 1 })).toBe('platitor');
    expect(stareTva({ scopTva: false, nrPerioade: 1 })).toBe('anulat');
    expect(stareTva({ scopTva: false, nrPerioade: 0 })).toBe('neplatitor');
    expect(stareTva({ scopTva: null, nrPerioade: 0 })).toBe('necunoscut');
  });
  it('discrepanțe față de snapshot (cazul QBIKNEF: înregistrat în snapshot, inactiv în v9)', () => {
    const d = discrepante({ stareFiscala: 'inactiv', tva: 'anulat', denumire: 'QBIKNEF S.R.L.', adresa: null }, { stare: 'INREGISTRAT', tva: 'NU', denumire: 'QBIKNEF S.R.L.', adresa: null });
    expect(d).toEqual([{ camp: 'stare', v9: 'inactiv', snapshot: 'INREGISTRAT' }]);
    expect(discrepante({ stareFiscala: 'activ', tva: 'platitor', denumire: 'A', adresa: null }, { stare: 'INREGISTRAT', tva: 'NU', denumire: 'A', adresa: null }).map((x) => x.camp)).toEqual(['tva']);
    expect(discrepante({ stareFiscala: 'activ', tva: 'platitor', denumire: 'A', adresa: null }, null)).toEqual([]);
  });
  it('normText și telefon canonic', () => {
    expect(normText('Brăila, Șos. Nouă')).toBe('BRAILA SOS NOUA');
    expect(telefonCanonic('+40 241 854 464')).toBe('0241854464');
    expect(telefonCanonic('0241-854-464')).toBe('0241854464');
    expect(telefonCanonic('0040741123456')).toBe('0741123456');
    expect(telefonCanonic('12')).toBeNull();
  });
});

describe('dosare: potrivire după nume', () => {
  it('curăță mențiunile de reprezentare și formele juridice', () => {
    expect(numeParteCurat('QBIKNEF SRL - PRIN LICHIDATOR JUDICIAR SIERRA QUADRANT FILIALA BUCUREŞTI SPRL')).toBe('QBIKNEF SRL');
    expect(numeParteCurat('QBIKNEF SRL - CU DOM. PROC. ALES LA CAB. AV. CHIŢU')).toBe('QBIKNEF SRL');
    expect(numeParteCurat('QBIKNEF SRL,')).toBe('QBIKNEF SRL');
    expect(bazaDenumire('QBIKNEF S.R.L.')).toBe('QBIKNEF');
    expect(bazaDenumire('Agro Zoo Promise SRL')).toBe('AGRO ZOO PROMISE');
  });
  it('grade: exactă, prin reprezentant, parțială, doar nume', () => {
    expect(gradPotrivire('QBIKNEF SRL', 'QBIKNEF S.R.L.', 'denumire')).toBe('exacta');
    expect(gradPotrivire('QBIKNEF SRL - PRIN ADMINISTRATOR JUDICIAR X SPRL', 'QBIKNEF S.R.L.', 'denumire')).toBe('exacta');
    expect(gradPotrivire('ALTA FIRMA SRL', 'QBIKNEF S.R.L.', 'reprezentant')).toBe('reprezentant');
    expect(gradPotrivire('QBIKNEF IMPEX SRL', 'QBIKNEF S.R.L.', 'denumire')).toBe('partiala');
    expect(gradPotrivire('TOTAL ALT NUME', 'QBIKNEF S.R.L.', 'denumire')).toBe('nume');
    expect(celMaiBun(['nume', 'partiala'])).toBe('partiala');
    expect(celMaiBun(['nume', 'exacta', 'reprezentant'])).toBe('exacta');
  });
  const d = (id: number, o: Partial<DosarLista>): DosarLista => ({ id, numar: `${id}/1/2023`, instanta: 'Tribunalul X', departament: '', categorie: 'Civil', stadiu: 'Fond', obiect: 'pretenții', dataDosar: '2023-05-01', dataModificare: null, anDosar: 2023, rol: ['Pârât'], potrivire: 'exacta', legaturi: [], nrParti: 2, nrSedinte: 1, ultimaSedinta: null, nrCaiAtac: 0, dataInViitor: false, ...o });
  it('filtre și sumar', () => {
    const l = [d(1, {}), d(2, { categorie: 'Penal', rol: ['Inculpat'], anDosar: 2024, dataDosar: '2024-01-01', potrivire: 'partiala' }), d(3, { dataDosar: '2029-09-26', anDosar: 2029, dataInViitor: true, potrivire: 'nume' })];
    expect(filtreaza(l, { categorie: 'Penal' }).map((x) => x.id)).toEqual([2]);
    expect(filtreaza(l, { doarExacte: true }).map((x) => x.id)).toEqual([1]);
    expect(filtreaza(l, { q: 'pretentii' }).length).toBe(3);
    const s = sumar(l);
    expect(s.total).toBe(3); expect(s.ultimul).toBe('2024-01-01'); // data din viitor nu este „ultimul dosar”
    expect(s.categorii[0]).toEqual({ valoare: 'Civil', nr: 2 });
  });
});
