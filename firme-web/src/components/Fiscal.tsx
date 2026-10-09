import { AlertTriangle, BadgeCheck, Building, FileText, Receipt, ShieldAlert, ShieldCheck, Split } from 'lucide-react';
import type { AnafFirma, AnafRezumat } from '../api/types';
import { dataRo, STARE_FISCALA, STARE_TVA, zileDe } from '../lib/anaf';
import { Badge } from './ui';

/** Etichetă de proveniență: orice valoare afișată își spune sursa și data. */
export function Sursa({ nume, data, titlu }: { nume: string; data?: string | null; titlu?: string }) {
  return <span className="sursa" title={titlu ?? `Sursa: ${nume}${data ? `, interogat la ${dataRo(data)}` : ''}`}><FileText size={12} aria-hidden="true" />{nume}{data ? ` · ${dataRo(data)}` : ''}</span>;
}

/** Rândul de stări fiscale din antet (ANAF v9 prevalează la stare). */
export function StariFiscale({ anaf, compact }: { anaf: AnafFirma | null | undefined; compact?: boolean }) {
  if (!anaf || anaf.stare !== 'gasit' || !anaf.stareFiscala) return null;
  const sf = STARE_FISCALA[anaf.stareFiscala], tva = STARE_TVA[anaf.tva ?? 'necunoscut'];
  const eticheteInactiv = anaf.stareFiscala === 'inactiv' && anaf.inactiv?.dataInactivare ? ` din ${dataRo(anaf.inactiv.dataInactivare)}` : '';
  return (
    <div className="row" style={{ gap: 6 }}>
      <Badge tone={sf.ton} title={sf.descriere}>{sf.gravitate >= 2 ? <ShieldAlert size={14} aria-hidden="true" /> : <ShieldCheck size={14} aria-hidden="true" />}{sf.eticheta}{compact ? '' : eticheteInactiv}</Badge>
      <Badge tone={tva.ton} title={anaf.tvaDetaliu?.perioade[0]?.sfarsit ? `Înregistrare TVA anulată la ${dataRo(anaf.tvaDetaliu.perioade[0].sfarsit)}` : undefined}>{tva.eticheta}</Badge>
      {anaf.eFactura?.inregistrat && <Badge tone="green" title={anaf.eFactura.data ? `RO e-Factura din ${dataRo(anaf.eFactura.data)}` : undefined}><BadgeCheck size={14} aria-hidden="true" />e-Factura</Badge>}
      {anaf.tvaIncasare?.activ && <Badge tone="violet"><Receipt size={14} aria-hidden="true" />TVA la încasare</Badge>}
      {anaf.split?.activ && <Badge tone="violet"><Split size={14} aria-hidden="true" />Split TVA</Badge>}
      {anaf.descoperitDeScanare && <Badge tone="blue" title="CUI descoperit prin scanarea ANAF; nu există în celelalte straturi."><Building size={14} aria-hidden="true" />Doar la ANAF</Badge>}
      {(anaf.discrepante?.length ?? 0) > 0 && <Badge tone="amber" title="Starea din ANAF v9 diferă de snapshot-ul ANAF 2026"><AlertTriangle size={14} aria-hidden="true" />Diferă de snapshot</Badge>}
    </div>
  );
}

/** Indicator mic de stare pentru liste (rezultate, comparare). */
export function PunctFiscal({ r }: { r: AnafRezumat | undefined }) {
  if (!r || r.stare === 'absent') return null;
  if (r.stare !== 'gasit' || !r.stareFiscala) {
    const t = { negasit: 'Negăsit la ANAF', asteptare: 'Neinterogat încă', exclus: 'Persoană fizică' }[r.stare as 'negasit' | 'asteptare' | 'exclus'];
    return t ? <Badge title="Stare ANAF v9">{t}</Badge> : null;
  }
  const sf = STARE_FISCALA[r.stareFiscala];
  return <Badge tone={sf.ton} title={`${sf.descriere}${r.dataInactivare ? ` (din ${dataRo(r.dataInactivare)})` : ''}`}>{sf.eticheta}</Badge>;
}

export function Prospetime({ data }: { data: string | undefined }) {
  const z = zileDe(data);
  if (z === null) return null;
  return <span className={`sursa${z > 30 ? ' veche' : ''}`} title={z > 30 ? 'Datele ANAF au mai mult de 30 de zile' : 'Date recente'}>ANAF v9 · {dataRo(data)}{z > 30 ? ` · acum ${z} zile` : ''}</span>;
}
