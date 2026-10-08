import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { fmtPct } from '../lib/format';

/** Variație procentuală colorată; `inverse` pentru indicatori unde creșterea este nefavorabilă. */
export function Delta({ pct, inverse, label }: { pct: number | null; inverse?: boolean; label?: string }) {
  if (pct === null) return <span className="delta flat">—</span>;
  const dir = Math.abs(pct) < 0.05 ? 'flat' : pct > 0 ? 'up' : 'down';
  const good = dir === 'flat' ? 'flat' : (dir === 'up') !== !!inverse ? 'up' : 'down';
  const Icon = dir === 'flat' ? Minus : dir === 'up' ? ArrowUpRight : ArrowDownRight;
  return <span className={`delta ${good}`}><Icon size={16} aria-hidden="true" />{fmtPct(pct)}{label && <span className="faint" style={{ fontWeight: 500 }}> {label}</span>}</span>;
}
