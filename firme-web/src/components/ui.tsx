import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { AlertTriangle, Inbox, Loader2, RotateCw, type LucideIcon } from 'lucide-react';
import { ApiError } from '../api/client';

export function Skeleton({ w, h = 16, r }: { w?: number | string; h?: number | string; r?: number }) {
  return <span className="skeleton" style={{ width: w ?? '100%', height: h, borderRadius: r }} aria-hidden="true" />;
}
export function SkeletonLines({ n = 3 }: { n?: number }) {
  return <div className="stack-sm" role="status" aria-label="Se încarcă">{Array.from({ length: n }, (_, i) => <Skeleton key={i} w={`${100 - i * 12}%`} h={16} />)}</div>;
}
export function Spinner({ size = 20 }: { size?: number }) { return <Loader2 size={size} className="spin" aria-label="Se încarcă" />; }

export function Badge({ tone, children, title }: { tone?: 'blue' | 'green' | 'amber' | 'red' | 'violet'; children: ReactNode; title?: string }) {
  return <span className={`badge${tone ? ` t-${tone}` : ''}`} title={title}>{children}</span>;
}

export function Empty({ icon: Icon = Inbox, title, children, action }: { icon?: LucideIcon; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="ico"><Icon size={30} aria-hidden="true" /></div>
      <h3>{title}</h3>{children && <p>{children}</p>}{action}
    </div>
  );
}

export function ErrorBox({ error, onRetry, compact }: { error: unknown; onRetry?: () => void; compact?: boolean }) {
  const e = error instanceof ApiError ? error : null;
  const notFound = e?.status === 404;
  const msg = e ? e.message : error instanceof Error ? error.message : 'A apărut o eroare neașteptată.';
  const body = (
    <>
      <div className="ico"><AlertTriangle size={30} aria-hidden="true" /></div>
      <h3>{notFound ? 'Nu am găsit nimic' : e?.status === 503 ? 'Interogarea a durat prea mult' : 'Ceva nu a mers'}</h3>
      <p>{msg}</p>
      {onRetry && !notFound && <button className="btn" onClick={onRetry}><RotateCw size={18} aria-hidden="true" /> Reîncearcă</button>}
    </>
  );
  return compact ? <div className="empty" role="alert" style={{ padding: 24 }}>{body}</div> : <div className="empty glass card" role="alert">{body}</div>;
}

export function PageHead({ eyebrow, title, children, actions }: { eyebrow?: string; title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="page-head">
      <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{children && <p>{children}</p>}</div>
      {actions && <div className="row no-print">{actions}</div>}
    </header>
  );
}

export function Seg<T extends string | number>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; label: string }) {
  return (
    <div className="seg" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} role="tab" aria-selected={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}

export function IconButton({ icon: Icon, label, small, ...rest }: { icon: LucideIcon; label: string; small?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} aria-label={label} title={label} className={`btn btn-icon${small ? ' btn-sm' : ''} ${rest.className ?? 'btn-ghost'}`}><Icon size={small ? 18 : 20} aria-hidden="true" /></button>;
}

export function Card({ title, icon: Icon, actions, children, className = '' }: { title?: string; icon?: LucideIcon; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`glass live card stack ${className}`}>
      {(title || actions) && (
        <div className="row between"><h2 className="card-title">{Icon && <Icon size={22} aria-hidden="true" />}{title}</h2>{actions && <div className="row no-print">{actions}</div>}</div>
      )}
      {children}
    </section>
  );
}

export function KV({ items }: { items: [string, ReactNode][] }) {
  const shown = items.filter(([, v]) => v !== '' && v !== null && v !== undefined && v !== false);
  if (!shown.length) return <p className="muted">Nu există date publicate.</p>;
  return <dl className="kv">{shown.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}
